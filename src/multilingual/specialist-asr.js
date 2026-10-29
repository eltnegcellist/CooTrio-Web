/**
 * Opt-in, local-only Moonshine streaming specialists for the production app.
 *
 * Keep the existing Japanese engine and the existing auto-multilingual
 * Whisper/ACFT engine entirely separate. These six Streaming checkpoints
 * are the MIT-licensed Moonshine catalog models; not legacy Community Base.
 *
 * Only 'en' multilingual may use Whisper; fixed locales fail closed if their
 * adopted offline ASR is not ready. Never route them through auto Whisper.
 */
import {MoonshineAsrClient} from '../asr-client.js';
export const MOONSHINE_SPECIALIST_LANGUAGES=Object.freeze(
  ['de','es','zh','ar','vi','tl']
);
const TINY_LANGUAGES=new Set(['zh','ar','vi','tl']);
export async function createSpecialistMoonshine(locale,{onProgress=()=>{}}={}){
  if(!MOONSHINE_SPECIALIST_LANGUAGES.includes(locale))
    throw Error('Unqualified specialist language: '+locale);
  const model=TINY_LANGUAGES.has(locale)?'tiny':'small';
  const transient=error=>/(?:HTTP\s*(?:429|5\d\d)|\bnetwork\b|\bfetch failed\b|\btemporarily unavailable\b)/i
    .test(String(error?.message||error));
  // Limited fresh-Worker retry for transient Moonshine CDN 5xx/429. We keep
  // any successfully downloaded assets in the browser Cache API. Do not
  // retry errors from model identity, license/integrity or page isolation.
  for(let attempt=1;attempt<=3;attempt++){
    let client;
    client=new MoonshineAsrClient({onEvent:event=>{
      if(event.type==='manifest'){
        onProgress({stage:'manifest',language:locale,manifest:event.manifest});
        client.resumeInit();
      } else if(['stage','progress','diagnostic','asset-event'].includes(event.type)){
        onProgress({...event,language:locale});
      }
    }});
    try {
      const ready=await client.init({model,language:locale,researchBenchmark:'app-specialist-asr'});
      if(ready?.engine!=='moonshine'||ready?.model!==model+'-streaming-'+locale)
        throw Error('Specialist worker returned an unexpected model identity');
      return {
        locale,model:ready.model,family:'moonshine',ready,
        transcribe:audio=>client.transcribe(audio),
        close:()=>client.close()
      };
    }catch(error){
      client.close();
      if(attempt>=3||!transient(error))throw error;
      onProgress({stage:'retry',language:locale,attempt,
        message:'モデル配信元への接続を再試行しています…'});
      await new Promise(resolve=>setTimeout(resolve,attempt*600));
    }
  }
  throw Error('Moonshine model initialization failed after retries');
}

/**
 * All ten fixed-language modes, excluding existing Japanese and multilingual.
 * This is the product-wide ASR allowlist. No fixed mode may call Whisper.
 */
export const FIXED_ASR_LANGUAGES=Object.freeze(['de','fr','es','zh','ko','th','hi','ar','vi','tl']);
export const FIXED_ASR_MODELS=Object.freeze({
  de:'moonshine-small-streaming-de',fr:'vosk-small-fr-0.22',
  es:'moonshine-small-streaming-es',zh:'moonshine-tiny-streaming-zh',
  ko:'sensevoice-small-ko-int8',th:'pengchengstarling-th',
  hi:'vosk-small-hi-0.22',ar:'moonshine-tiny-streaming-ar',
  vi:'moonshine-tiny-streaming-vi',tl:'moonshine-tiny-streaming-tl'
});
/**
 * Fail closed if a fixed-locale ASR is not yet installed. In particular ko/th
 * must never use the old (Whisper) fallback. Each returned engine handles
 * Float32Array 16kHz mono and has transcribe/close.
 */
export async function createFixedLocaleAsr(locale,{onProgress=()=>{},voskArchive=null}={}){
  if(!FIXED_ASR_LANGUAGES.includes(locale))throw Error('Unsupported fixed ASR language: '+locale);
  if(MOONSHINE_SPECIALIST_LANGUAGES.includes(locale))
    return createSpecialistMoonshine(locale,{onProgress});
  if(locale==='fr'||locale==='hi'){
    const {createVoskFixedAsr}=await import('./vosk-asr.js');
    return createVoskFixedAsr(locale,{archive:voskArchive,onProgress});
  }
  if(locale==='ko'){
    const {createSenseVoiceKoreanAsr}=await import('./sensevoice-asr.js');
    return createSenseVoiceKoreanAsr({onProgress});
  }
  if(locale==='th'){
    const {createPengChengThaiAsr}=await import('./pengcheng-asr.js');
    return createPengChengThaiAsr({onProgress});
  }
  throw Error('Fixed-locale ASR adapter unavailable: '+locale);
}
