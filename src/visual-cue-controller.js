import {VISUAL_CUE_RUNTIME_CATALOG} from './visual-cue-runtime-catalog.js';
import {TEMPERATURE_DIRECTION_TEXTS,approvedTemperatureAudioComplete} from './frequency/temperature-english-candidates.js';
import { createEmmaBackground } from './emma-background-cues.js?v=20261020-english-illustrations-v2';
export const normalizeCueText=text=>String(text||'').replaceAll('’',"'").trim().replace(/\s+/g,' ').toLowerCase();
export function resolveVisualCue(text,catalog=VISUAL_CUE_RUNTIME_CATALOG,temperatureDirection=null){
  const plan=catalog.bindings[normalizeCueText(text)]||null;
  // When all 26 clips are eventually approved, the newly recorded texts also
  // resolve to their corresponding direction-specific cue, without changing
  // or polluting any original legacy text binding.
  if(approvedTemperatureAudioComplete()&&['hot','cold'].includes(temperatureDirection)){
    const bank=TEMPERATURE_DIRECTION_TEXTS[temperatureDirection];
    if([...bank.topics,...Object.values(bank.combined).flat()].some(x=>normalizeCueText(x)===normalizeCueText(text))){
      const assetId='temperature-'+temperatureDirection+'-candidate';
      if(catalog.assets[assetId])return {type:'asset',assetId};
    }
  }
  // Only replace the approved neutral-temperature animation when the current
  // Topic turn has an accepted embedding direction. All other cues are unchanged.
  if(plan?.type==='asset'&&plan.assetId==='temperature-comfort-check'&&
    ['hot','cold'].includes(temperatureDirection)){
    const assetId='temperature-'+temperatureDirection+'-candidate';
    if(catalog.assets[assetId])return {type:'asset',assetId};
  }
  return plan;
}

/** Optional turn-owned visual. Audio may end before the next parent utterance finishes. */
export const VISUAL_CUE_POST_AUDIO_MS=10_000;
export function createVisualCueController({document=globalThis.document,baseUrl=new URL('../',import.meta.url),catalog=VISUAL_CUE_RUNTIME_CATALOG,loadImage,media=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)'),onChange=()=>{},setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let mode='emma',motion=true,serial=0,generation=0,current=null,disposed=false,expiryTimer=null;
 const cancelExpiry=()=>{if(expiryTimer!==null){clearTimer(expiryTimer);expiryTimer=null;}};
 const hosts=()=>[...document.querySelectorAll('[data-visual-cue-host]')];
 const clear=()=>{for(const host of hosts()){host.replaceChildren();host.hidden=true;const avatar=host.closest('.avatar');avatar?.classList.remove('has-visual-cue','has-emma-background');delete host.dataset.layer;}onChange(null);};
 const decode=loadImage||((url)=>new Promise((resolve,reject)=>{
  const img=new document.defaultView.Image();let timer=setTimeout(()=>reject(Error('Visual cue image timeout')),8000);
  img.onload=()=>{clearTimeout(timer);resolve(img);};img.onerror=()=>{clearTimeout(timer);reject(Error('Visual cue image unavailable'));};img.src=url;
 }));
 async function render(){
  const version=++generation;clear();
  if(disposed||mode!=='visual'||!current||document.hidden)return;
  const p=current.plan;if(!p)return;
  const animate=motion&&!media?.matches;
  let element;
  try{
   if(p.type==='emma'){element=createEmmaBackground(p.state,document);if(!element){onChange(p);return;}element.dataset.motion=animate?'on':'off';element.classList.add('visual-cue-background');}
   else {
    const a=catalog.assets[p.assetId];if(!a)return;
    const path=animate?a.image:a.poster;
    await decode(new URL(path,baseUrl).href);
    element=document.createElement('img');element.src=new URL(path,baseUrl).href;element.alt='';element.className='visual-cue-image';element.dataset.assetId=a.id;
   }
  }catch{return;}
  if(version!==generation||!current||disposed||mode!=='visual'||document.hidden)return;
  for(const host of hosts()){
   const copy=p.type==='emma'?createEmmaBackground(p.state,document):element.cloneNode(true);
   if(p.type==='emma'){copy.dataset.motion=animate?'on':'off';copy.classList.add('visual-cue-background');}
   host.replaceChildren(copy);host.hidden=false;
   const background=p.type==='emma',avatar=host.closest('.avatar');
   host.dataset.layer=background?'background':'artwork';
   avatar?.classList.toggle('has-visual-cue',!background);
   avatar?.classList.toggle('has-emma-background',background);
  }
  onChange(p);

 }
 const stop=()=>{serial++;generation++;cancelExpiry();current=null;clear();};
 const visibility=()=>{if(document.hidden)stop();};
 const reduction=()=>{void render();};
 document.addEventListener('visibilitychange',visibility);media?.addEventListener?.('change',reduction);
 return {
  configure(settings={}){mode=settings.mode==='visual'?'visual':'emma';motion=settings.motion!==false;void render();},
  begin(text,{temperatureDirection=null}={}){cancelExpiry();const token=++serial;current={token,plan:resolveVisualCue(text,catalog,temperatureDirection),playbackFinished:false};void render();return token;},
  // Hold the cue throughout playback and for ten seconds after audio ends.
  end(token){
   if(current?.token!==token||current.playbackFinished||disposed)return;
   current.playbackFinished=true;
   expiryTimer=setTimer(()=>{if(current?.token===token&&!disposed)stop();},VISUAL_CUE_POST_AUDIO_MS);
  },
  // The microphone/VAD decides when the parent's next utterance has ended.
  nextUtteranceFinished(){stop();},stop,
  preload(text,{temperatureDirection=null}={}){const p=resolveVisualCue(text,catalog,temperatureDirection);if(mode!=='visual'||p?.type!=='asset')return;const a=catalog.assets[p.assetId];if(a)decode(new URL(motion&&!media?.matches?a.image:a.poster,baseUrl).href).catch(()=>{});},
  dispose(){stop();disposed=true;document.removeEventListener('visibilitychange',visibility);media?.removeEventListener?.('change',reduction);}
 };
}
