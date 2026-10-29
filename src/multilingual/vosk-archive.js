import {VOSK_MODELS,sha256} from './vosk-models.js';

export async function streamBytes(stream,maxBytes,onProgress=()=>{}){
  const reader=stream.getReader(),chunks=[];let size=0;
  try{for(;;){
    const {done,value}=await reader.read();if(done)break;
    size+=value.length;
    if(size>maxBytes)throw Error('Vosk archive exceeds the verified size limit');
    chunks.push(value);
    onProgress(size,maxBytes);
  }}catch(error){await reader.cancel().catch(()=>{});throw error;}
  const bytes=new Uint8Array(size);let offset=0;
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  return bytes;
}

// Match Python tarfile.GNU_FORMAT, mtime=0, including explicit 0755 parents.
// The entire uncompressed TAR must match the independently generated digest.
function tarHeader(name,size,isDirectory=false){
  const header=new Uint8Array(512),encoder=new TextEncoder();
  const put=(offset,text)=>header.set(encoder.encode(text),offset);
  if(name.length+(isDirectory?1:0)>100)throw Error('Vosk TAR path too long');
  put(0,name+(isDirectory?'/':''));
  put(100,(isDirectory?0o755:0o644).toString(8).padStart(7,'0')+'\0');
  put(108,'0000000\0');put(116,'0000000\0');
  put(124,size.toString(8).padStart(11,'0')+'\0');put(136,'00000000000\0');
  put(148,'        ');put(156,isDirectory?'5':'0');put(257,'ustar  \0');
  const sum=header.reduce((a,b)=>a+b,0);
  put(148,sum.toString(8).padStart(6,'0')+'\0 ');
  return header;
}

export async function convertOfficialVoskZip(locale,input){
  const spec=VOSK_MODELS[locale],zip=new Uint8Array(input);
  if(!spec||zip.length!==spec.zipBytes||await sha256(zip)!==spec.zipSha256)
    throw Error('Vosk official ZIP SHA-256/length mismatch');
  const view=new DataView(zip.buffer,zip.byteOffset,zip.byteLength);
  let end=zip.length-22;
  for(;end>=Math.max(0,zip.length-65557);end--){
    if(view.getUint32(end,true)===0x06054b50)break;
  }
  if(end<0||view.getUint16(end+4,true)||view.getUint16(end+6,true))throw Error('Unsupported Vosk ZIP directory');
  const count=view.getUint16(end+10,true),prefix=spec.name.replace('.tar.gz','')+'/';
  let cursor=view.getUint32(end+16,true),tarSize=0;
  const chunks=[],directories=new Set();
  const append=bytes=>{chunks.push(bytes);tarSize+=bytes.length;};
  for(let index=0;index<count;index++){
    if(view.getUint32(cursor,true)!==0x02014b50)throw Error('Invalid Vosk ZIP entry');
    const flags=view.getUint16(cursor+8,true),method=view.getUint16(cursor+10,true);
    const compressed=view.getUint32(cursor+20,true),size=view.getUint32(cursor+24,true);
    const nameLength=view.getUint16(cursor+28,true),extra=view.getUint16(cursor+30,true),comment=view.getUint16(cursor+32,true);
    const name=new TextDecoder('utf-8',{fatal:true}).decode(zip.subarray(cursor+46,cursor+46+nameLength));
    const mode=view.getUint32(cursor+38,true)>>>16,local=view.getUint32(cursor+42,true);
    cursor+=46+nameLength+extra+comment;
    if(!name.startsWith(prefix)||name.includes('..')||name.includes('\\')||flags&1||(mode&0o170000)===0o120000)
      throw Error('Unsafe Vosk ZIP path or entry');
    if(name.endsWith('/'))continue;
    if(size>spec.tarBytes||view.getUint32(local,true)!==0x04034b50)throw Error('Invalid Vosk ZIP file');
    const start=local+30+view.getUint16(local+26,true)+view.getUint16(local+28,true);
    const packed=zip.subarray(start,start+compressed);
    const data=method===0?packed:method===8?await streamBytes(
      new Blob([packed]).stream().pipeThrough(new DecompressionStream('deflate-raw')),size):null;
    if(!data||data.length!==size)throw Error('Vosk ZIP decompression failed');
    const path='model/'+name.slice(prefix.length),parts=path.split('/');
    for(let depth=1;depth<parts.length;depth++){
      const dir=parts.slice(0,depth).join('/');
      if(!directories.has(dir)){append(tarHeader(dir,0,true));directories.add(dir);}
    }
    append(tarHeader(path,size));append(data);
    if(size%512)append(new Uint8Array(512-size%512));
  }
  // Python tarfile pads the two end blocks to its 10240-byte record boundary.
  append(new Uint8Array(Math.ceil((tarSize+1024)/10240)*10240-tarSize));
  if(tarSize!==spec.tarBytes)throw Error('Vosk TAR length mismatch');
  const tar=new Uint8Array(tarSize);let offset=0;
  for(const chunk of chunks){tar.set(chunk,offset);offset+=chunk.length;}
  if(await sha256(tar)!==spec.tarSha256)throw Error('Vosk TAR SHA-256 mismatch');
  const gzip=await new Response(new Blob([tar]).stream().pipeThrough(new CompressionStream('gzip'))).blob();
  return gzip;
}
