import {prepareAssets} from './assets.js';
const base='https://huggingface.co/csukuangfj/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17/resolve/2365baeacb507f821a0c8120fcee3d484dba7a07/';
const vendor=new URL('../vendor/sherpa-sensevoice-1.12.32/',import.meta.url);
export const SENSEVOICE_ASSETS=Object.freeze([
  {key:'model',file:'model.int8.onnx',url:base+'model.int8.onnx',bytes:239233841,
    sha256:'c71f0ce00bec95b07744e116345e33d8cbbe08cef896382cf907bf4b51a2cd51'},
  {key:'tokens',file:'tokens.txt',url:base+'tokens.txt',bytes:315894,
    sha256:'f449eb28dc567533d7fa59be34e2abca8784f771850c78a47fb731a31429a1dc'},
  {key:'wasm',file:'sherpa-onnx-wasm-main-vad-asr.wasm',bytes:11719405,
    sha256:'80099b875b0b35a7b219407e192049668d64fb771dfd0f36480d39df7d36d36c'},
  {key:'binding',file:'sherpa-onnx-asr.js',bytes:49519,
    sha256:'c71a9817c2dd3ab69fd1967a81260428650890980d11d97cfa8e00d551e34f2b'},
  {key:'glue',file:'sherpa-onnx-asr-runtime.js',bytes:90403,
    sha256:'281fbf4ce86eebcba519d509382180b11ecbee7de04543a2f6abc51cd9ef0ac1'},
  {key:'worker',file:'sensevoice-worker.js',url:new URL('./sensevoice-worker.js',import.meta.url).href,
    bytes:3123,sha256:'33a024db1a88dd39e6c8021a9f74208a48e2e24ee324522059808fffc00000af'}
].map(meta=>Object.freeze({...meta,model:'sensevoice',url:meta.url||new URL(meta.file,vendor).href})));

export async function createSenseVoiceKoreanAsr({onProgress=()=>{}}={}){
  if(!globalThis.document)throw Error('SenseVoice Small INT8 requires a browser; Whisper substitution is forbidden');
  onProgress({stage:'stage',message:'モデルを準備しています…'});
  const cache=await prepareAssets({assets:SENSEVOICE_ASSETS},{
    progress:event=>onProgress({stage:'progress',language:'ko',...event})});
  const payload={},transfers=[];let workerSource;
  for(const asset of SENSEVOICE_ASSETS){
    const response=await cache.match(asset.url);
    if(!response)throw Error('Verified SenseVoice asset is missing: '+asset.file);
    const bytes=await response.arrayBuffer();
    if(asset.key==='worker')workerSource=bytes;
    else{payload[asset.key]=bytes;transfers.push(bytes);}
  }
  // The verified Worker source is cached too: a fresh offline ASR instance
  // must not require an online fetch of its classic Worker entry point.
  const workerUrl=URL.createObjectURL(new Blob([workerSource],{type:'text/javascript'}));
  let worker;
  try{worker=new Worker(workerUrl);}catch(error){URL.revokeObjectURL(workerUrl);throw error;}
  const pending=new Map();let nextId=0,closed=false,busy=false;
  const close=(message='SenseVoice has been closed')=>{
    if(closed)return;closed=true;worker.terminate();URL.revokeObjectURL(workerUrl);
    for(const task of pending.values()){clearTimeout(task.timer);task.reject(Error(message));}
    pending.clear();
  };
  worker.onmessage=({data})=>{
    if(data.type==='diagnostic'){onProgress({stage:'diagnostic',language:'ko',message:data.message});return;}
    const task=pending.get(data.id);if(!task)return;
    pending.delete(data.id);clearTimeout(task.timer);
    if(data.type==='result')onProgress({stage:'asr-timing',language:'ko',elapsedMs:data.elapsedMs,wasmMemoryBytes:data.wasmMemoryBytes});
    data.type==='error'?task.reject(Error(data.message)):task.resolve(data);
  };
  worker.onerror=event=>close(event.message||'SenseVoice Worker failed');
  const request=(type,fields={},transfer=[],timeout=120000)=>new Promise((resolve,reject)=>{
    if(closed){reject(Error('SenseVoice has been closed'));return;}
    const id=++nextId,timer=setTimeout(()=>close('SenseVoice '+type+' timed out'),timeout);
    pending.set(id,{resolve,reject,timer});
    try{worker.postMessage({id,type,...fields},transfer);}catch(error){pending.delete(id);clearTimeout(timer);reject(error);}
  });
  let ready;
  try{
    ready=await request('init',payload,transfers,180000);
    if(ready.model!=='sensevoice-small-ko-int8'||ready.language!=='ko'||ready.precision!=='int8')
      throw Error('Unexpected SenseVoice model identity');
  }catch(error){close();throw error;}
  return {locale:'ko',model:'sensevoice-small-ko-int8',family:'sensevoice',ready,
    async transcribe(audio){
      if(closed)throw Error('SenseVoice has been closed');
      if(busy)throw Error('SenseVoice recognizer already processing');
      if(!(audio instanceof Float32Array)||!audio.length||audio.some(value=>!Number.isFinite(value)))
        throw Error('Expected finite mono 16kHz PCM');
      busy=true;
      try{const buffer=audio.slice().buffer;return (await request('transcribe',{audio:buffer},[buffer])).text;}
      finally{busy=false;}
    },close:async()=>close()};
}
