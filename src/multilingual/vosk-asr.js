/**
 * Device-local French/Hindi Vosk Small. Official Vosk model ZIPs are
 * SHA-verified and repacked on this device (or by audited GitHub Actions).
 * The archive must match the exact hash generated from the official release.
 * A verified archive is cached in CacheStorage; no microphone PCM is uploaded.
 * This code does not, and must not, use Whisper.
 */
import {VOSK_MODELS as ARCHIVES,voskZipUrl,sha256} from './vosk-models.js';
import {streamBytes} from './vosk-archive.js';
export const VOSK_CACHE='cootrio-fixed-vosk-official-20261025-v3';
const CACHE_NAME=VOSK_CACHE;
// Exact library from the successful PR #152 final-result comparison.
const scriptURL='https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/dist/vosk.js';
const scriptHash='29504515526e974f4cb053cf08811c4de5fb2a74007c0a5a957db50eaa8d5d0c';
let runtimeReady=null;
const cacheKey=locale=>new URL('./fixed-vosk/'+ARCHIVES[locale].tarSha256+'/'+ARCHIVES[locale].name,import.meta.url).href;
function report(onProgress,stage,detail=''){onProgress({stage,detail});}
export async function verifyOfficialArchive(locale,file){
  const spec=ARCHIVES[locale];
  if(!spec||!file)throw Error('Official Vosk browser archive is required for '+locale);
  if(file.name!==spec.name||file.size<1||file.size>spec.tarBytes)
    throw Error('Vosk '+locale+': model archive name/length mismatch. Choose the generated official tar.gz.');
  const bytes=await file.arrayBuffer();
  if(!globalThis.crypto?.subtle)throw Error('SHA-256 WebCrypto is unavailable');
  if(await sha256(bytes)!==spec.sha256){
    // Browser/Python gzip headers can differ. Pin the exact TAR bytes too,
    // including all weights, metadata and searchable directory entries.
    const tar=await streamBytes(new Blob([bytes]).stream().pipeThrough(
      new DecompressionStream('gzip')),spec.tarBytes);
    if(tar.length!==spec.tarBytes||await sha256(tar)!==spec.tarSha256)
      throw Error('Vosk '+locale+': SHA-256 mismatch. Model rejected.');
  }
  return new Blob([bytes],{type:'application/gzip'});
}
export async function importVoskArchive(locale,file,{onProgress=()=>{}}={}){
  const verified=await verifyOfficialArchive(locale,file);
  if(!globalThis.caches)throw Error('Offline Cache Storage is unavailable for Vosk model');
  await (await caches.open(CACHE_NAME)).put(cacheKey(locale),
    new Response(verified,{headers:{'Content-Type':'application/gzip'}}));
  report(onProgress,'vosk-verified-and-cached',locale);
  return verified;
}
export async function getStoredVoskArchive(locale){
  if(!ARCHIVES[locale])throw Error('Unsupported Vosk language');
  const response=await (await caches.open(CACHE_NAME)).match(cacheKey(locale));
  if(!response)return null;
  const blob=await response.blob();
  try{return await verifyOfficialArchive(locale,new File([blob],ARCHIVES[locale].name));}
  catch(error){
    await (await caches.open(CACHE_NAME)).delete(cacheKey(locale));
    throw Error('Vosk cached model failed integrity verification; retry download: '+error.message);
  }
}
async function downloadOfficialModel(locale,onProgress){
  if(!globalThis.document)throw Error('Vosk Small browser document is required for automatic model download');
  const spec=ARCHIVES[locale],controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),180000);
  try{
    report(onProgress,'vosk-model-downloading',locale);
    const response=await fetch(voskZipUrl(locale),{signal:controller.signal,credentials:'omit'});
    if(!response.ok)throw Error('Vosk model download HTTP '+response.status);
    const bytes=await streamBytes(response.body,spec.zipBytes,(loaded,total)=>
      onProgress({stage:'progress',language:locale,loaded,total}));
    if(bytes.length!==spec.zipBytes||await sha256(bytes)!==spec.zipSha256)
      throw Error('Vosk official ZIP SHA-256/length mismatch');
    report(onProgress,'vosk-model-preparing',locale);
    const worker=new Worker(new URL('./vosk-archive-worker.js',import.meta.url),{type:'module'});
    try{
      return await new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(Error('Vosk archive preparation timed out')),90000);
        worker.onmessage=({data})=>{clearTimeout(timer);data.error?reject(Error(data.error)):resolve(data.archive);};
        worker.onerror=event=>{clearTimeout(timer);reject(Error(event.message||'Vosk archive worker failed'));};
        worker.postMessage({locale,zip:bytes.buffer},[bytes.buffer]);
      });
    }finally{worker.terminate();}
  }finally{clearTimeout(timeout);}
}
async function loadVoskRuntime(){
  if(!runtimeReady){
    runtimeReady=(async()=>{
      const cache=await caches.open(CACHE_NAME);
      let bytes=await (await cache.match(scriptURL))?.arrayBuffer();
      if(!bytes||await sha256(bytes)!==scriptHash){
        const response=await fetch(scriptURL,{credentials:'omit',signal:AbortSignal.timeout(60000)});
        if(!response.ok)throw Error('Vosk library download HTTP '+response.status);
        bytes=await response.arrayBuffer();
        if(await sha256(bytes)!==scriptHash)throw Error('Vosk library SHA-256 mismatch');
        await cache.put(scriptURL,new Response(bytes));
      }
      const url=URL.createObjectURL(new Blob([bytes],{type:'text/javascript'}));
      try{
        await new Promise((resolve,reject)=>{
          const script=document.createElement('script');script.src=url;
          script.onload=()=>{script.remove();resolve();};
          script.onerror=()=>{script.remove();reject(Error('Vosk library failed to load'));};
          document.head.append(script);
        });
        if(!globalThis.Vosk?.Model)throw Error('Vosk library missing after script load');
        return globalThis.Vosk;
      }finally{URL.revokeObjectURL(url);}
    })().catch(error=>{runtimeReady=null;throw error;});
  }
  return runtimeReady;
}
export async function createVoskFixedAsr(locale,{archive=null,onProgress=()=>{}}={}){
  if(!ARCHIVES[locale])throw Error('Unsupported fixed Vosk language '+locale);
  let modelBlob=archive?await verifyOfficialArchive(locale,archive):await getStoredVoskArchive(locale);
  if(!modelBlob)modelBlob=await downloadOfficialModel(locale,onProgress);
  // Cache integrity is checked before Vosk can execute the archive. The old
  // FS error came from directory mode 000, not CacheStorage/IDBFS contention.
  const cache=await caches.open(CACHE_NAME);
  await cache.put(cacheKey(locale),new Response(modelBlob,{headers:{'Content-Type':'application/gzip'}}));
  report(onProgress,'vosk-verified-and-cached',locale);
  const lib=await loadVoskRuntime();
  // Production SW serves the verified cache at this stable URL. IDBFS can
  // reuse one expanded model, instead of persisting a new Blob UUID per boot.
  const objectUrl=!navigator.serviceWorker?.controller;
  const url=objectUrl?URL.createObjectURL(modelBlob):cacheKey(locale);
  let model,closed=false,pendingFinish=null;
  const terminate=()=>{model?.worker?.terminate();if(objectUrl)URL.revokeObjectURL(url);};
  try{
    report(onProgress,'vosk-model-loading',locale);
    model=new lib.Model(url);
    await new Promise((resolve,reject)=>{
      const finish=error=>{clearTimeout(timer);error?reject(error):resolve();};
      const timer=setTimeout(()=>finish(Error('Vosk '+locale+' browser model load timed out')),90000);
      model.on('load',event=>finish(event.result?null:Error('Vosk model load failed')));
      model.on('error',event=>finish(Error(String(event.error||'Vosk model initialization failed; see browser console'))));
      model.worker.addEventListener('error',event=>finish(Error(event.message||'Vosk worker failed')));
    });
    report(onProgress,'vosk-model-ready',locale);
  }catch(error){terminate();throw error;}
  let busy=false;
  return {
    locale,family:'vosk',model:'vosk-small-'+locale+'-0.22',
    ready:{engine:'vosk',model:'vosk-small-'+locale+'-0.22',architecture:'kaldi-wasm',license:'Apache-2.0'},
    async transcribe(pcm){
      if(closed)throw Error('Vosk has been closed');
      if(busy)throw Error('Vosk recognizer already processing');
      if(!(pcm instanceof Float32Array)||!pcm.length||
        pcm.some(value=>!Number.isFinite(value)))throw Error('Expected finite mono 16kHz PCM');
      busy=true;
      try{
        return await new Promise((resolve,reject)=>{
          const recognizer=new model.KaldiRecognizer(16000);
          let settled=false,text='',audioReplySeen=false;
          const timeout=setTimeout(()=>finish(Error('Vosk final result timed out')),120000);
          const finish=error=>{
            if(settled)return;
            settled=true;clearTimeout(timeout);pendingFinish=null;
            try{recognizer.remove();}catch{}
            if(error)reject(error);else resolve(text.trim());
          };
          pendingFinish=finish;
          // The worker sends a response to acceptWaveform (either result OR
          // partialresult), then a second event for retrieveFinalResult().
          // Always consume both in order. Otherwise the recognizer can be
          // destroyed before Vosk has emitted the actual final words.
          recognizer.on('partialresult',event=>{
            if(event?.recognizerId&&event.recognizerId!==recognizer.id)return;
            audioReplySeen=true;
          });
          recognizer.on('result',event=>{
            if(event?.recognizerId&&event.recognizerId!==recognizer.id)return;
            const next=String(event?.result?.text||'').trim();
            if(next)text=[text,next].filter(Boolean).join(' ');
            if(audioReplySeen)finish();
            else audioReplySeen=true;
          });
          recognizer.on('error',error=>finish(Error(String(error?.error||'Vosk recognition failed'))));
          try{
            const buffer=new AudioBuffer({length:pcm.length,numberOfChannels:1,sampleRate:16000});
            buffer.copyToChannel(pcm,0);
            recognizer.acceptWaveform(buffer);
            if(typeof recognizer.retrieveFinalResult!=='function')
              throw Error('Vosk final result API unavailable');
            recognizer.retrieveFinalResult();
          }catch(error){finish(error);}
        });
      }finally{busy=false;}
    },
    async close(){
      if(closed)return;
      closed=true;
      pendingFinish?.(Error('Vosk has been closed'));
      terminate();
    }
  };
}
