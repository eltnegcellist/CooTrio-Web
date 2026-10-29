import {prepareAssets} from './assets.js';

// The exact upstream PengChengStarling checkpoint, converted and published by
// Sherpa's model maintainer. No alternative Thai model or Whisper fallback.
const base='https://huggingface.co/csukuangfj/sherpa-onnx-streaming-zipformer-ar_en_id_ja_ru_th_vi_zh-2025-02-10/resolve/c6726c1147387ad2a11148b33973135d92a55e6c/';
const vendor=new URL('../vendor/sherpa-pengcheng-1.12.32-th/',import.meta.url);
export const PENGCHENG_ASSETS=Object.freeze([
  {key:'encoder',file:'encoder-epoch-75-avg-11-chunk-16-left-128.int8.onnx',bytes:296583597,
    sha256:'f9001ed7a9e46d0294438c1a30cd7c72d1cc4bdd4e7880edbcda36f67081e32e'},
  {key:'decoder',file:'decoder-epoch-75-avg-11-chunk-16-left-128.onnx',bytes:33837085,
    sha256:'7ebc63f34b21c8efb4a41a5a2eee7fe1448829ce0230ecc5369e67fc14d90d48'},
  {key:'joiner',file:'joiner-epoch-75-avg-11-chunk-16-left-128.int8.onnx',bytes:8257421,
    sha256:'db88e3172323551abaa99b91b18fb422a27ea4a834fd0db10389f9478816f917'},
  {key:'tokens',file:'tokens.txt',bytes:195244,
    sha256:'784f24950f6bcce1b0021035632dd60fd4617ecd8ca0581ab57d7b39d77ba5ab'},
  {key:'bpe',file:'bpe.model',bytes:476049,
    sha256:'027731f33cff7266f2878c6fb7e478cf4af983962e311bb565112792794c13cd'},
  {key:'wasm',file:'sherpa-onnx-wasm-main-asr.wasm',bytes:10967247,
    sha256:'5d9e3a0c420530876adcf3a93768b4822c0ebae12c0ed640711397e11288168e'},
  {key:'binding',file:'sherpa-onnx-asr.js',bytes:49519,
    sha256:'c71a9817c2dd3ab69fd1967a81260428650890980d11d97cfa8e00d551e34f2b'},
  {key:'glue',file:'sherpa-onnx-wasm-main-asr.js',bytes:76344,
    sha256:'6a4ed91c7b0cd85c4af568b9df376bff242aee3f172684cd0ed8d4d36f6f50fb'},
  // Worker digest/size is checked just like the huge model weights.
  {key:'worker',file:'pengcheng-worker.js',url:new URL('./pengcheng-worker.js',import.meta.url).href,
    bytes:3939,sha256:'3b05f8a359ec00d9bad5ef531c1de7d17f1ec65a7d92d6bbb4d4dac233fc020b'}
].map(meta=>Object.freeze({...meta,model:'pengchengstarling-th',
  url:meta.url||(meta.key==='wasm'||meta.key==='binding'||meta.key==='glue'
    ?new URL(meta.file,vendor).href:base+meta.file)})));

export async function createPengChengThaiAsr({onProgress=()=>{}}={}){
  if(!globalThis.document)throw Error('PengChengStarling requires a browser; Whisper substitution is forbidden');
  onProgress({stage:'stage',language:'th',message:'タイ語モデルを準備しています…'});
  const cache=await prepareAssets({assets:PENGCHENG_ASSETS},{
    progress:event=>onProgress({stage:'progress',language:'th',...event})});
  const payload={},transfers=[];let workerSource;
  for(const asset of PENGCHENG_ASSETS){
    const response=await cache.match(asset.url);
    if(!response)throw Error('Verified PengChengStarling asset is missing: '+asset.file);
    const bytes=await response.arrayBuffer();
    if(asset.key==='worker')workerSource=bytes;
    else{payload[asset.key]=bytes;transfers.push(bytes);}
  }
  const workerUrl=URL.createObjectURL(new Blob([workerSource],{type:'text/javascript'}));
  let worker;
  try{worker=new Worker(workerUrl);}catch(error){URL.revokeObjectURL(workerUrl);throw error;}
  const pending=new Map();let nextId=0,closed=false,busy=false;
  const close=(message='PengChengStarling has been closed')=>{
    if(closed)return;closed=true;worker.terminate();URL.revokeObjectURL(workerUrl);
    for(const task of pending.values()){clearTimeout(task.timer);task.reject(Error(message));}
    pending.clear();
  };
  worker.onmessage=({data})=>{
    if(data.type==='diagnostic'){onProgress({stage:'diagnostic',language:'th',message:data.message});return;}
    const task=pending.get(data.id);if(!task)return;
    pending.delete(data.id);clearTimeout(task.timer);
    if(data.type==='result')onProgress({stage:'asr-timing',language:'th',elapsedMs:data.elapsedMs,
      wasmMemoryBytes:data.wasmMemoryBytes});
    data.type==='error'?task.reject(Error(data.message)):task.resolve(data);
  };
  worker.onerror=event=>close(event.message||'PengChengStarling Worker failed');
  const request=(type,fields={},transfer=[],timeout=180000)=>new Promise((resolve,reject)=>{
    if(closed){reject(Error('PengChengStarling has been closed'));return;}
    const id=++nextId,timer=setTimeout(()=>close('PengChengStarling '+type+' timed out'),timeout);
    pending.set(id,{resolve,reject,timer});
    try{worker.postMessage({id,type,...fields},transfer);}
    catch(error){pending.delete(id);clearTimeout(timer);reject(error);}
  });
  let ready;
  try{
    ready=await request('init',payload,transfers,240000);
    if(ready.model!=='pengchengstarling-th'||ready.language!=='th'||ready.precision!=='int8-encoder-joiner')
      throw Error('Unexpected PengChengStarling model identity');
  }catch(error){close();throw error;}
  return {locale:'th',model:'pengchengstarling-th',family:'pengchengstarling',ready,
    async transcribe(audio){
      if(closed)throw Error('PengChengStarling has been closed');
      if(busy)throw Error('PengChengStarling recognizer already processing');
      if(!(audio instanceof Float32Array)||!audio.length||audio.some(value=>!Number.isFinite(value)))
        throw Error('Expected finite mono 16kHz PCM');
      busy=true;
      try{const buffer=audio.slice().buffer;return (await request('transcribe',{audio:buffer},[buffer])).text;}
      finally{busy=false;}
    },close:async()=>close()};
}
