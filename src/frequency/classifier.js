import {FREQUENCY_MODELS} from './model-assets.js';
import {decodeHead,classifyEmbedding} from '../semantic/core.js';
const CACHE='cootrio-frequency-classifiers-v1';
const sha=async b=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),x=>x.toString(16).padStart(2,'0')).join('');
async function verified(url,pin,fetcher,cache){
  const valid=async r=>{if(!r?.ok)return null;const b=await r.arrayBuffer();return b.byteLength===pin.bytes&&await sha(b)===pin.sha256?b:null;};
  let bytes=cache?await valid(await cache.match(url)):null;
  if(!bytes){const r=await fetcher(url,{cache:'no-store'});bytes=await valid(r);if(!bytes)throw Error('追加分類器の検証に失敗しました。');if(cache)await cache.put(url,new Response(bytes)).catch(()=>{});}
  return bytes;
}
function floats(bytes){const d=new DataView(bytes);return Float64Array.from({length:bytes.byteLength/4},(_,i)=>d.getFloat32(i*4,true));}
export async function loadFrequencyClassifier(encoder,{fetcher=globalThis.fetch,cacheStorage=globalThis.caches}={}){
  const pin=FREQUENCY_MODELS[encoder];if(!pin)throw Error('未対応の意味判定モデルです。');
  const cache=cacheStorage?await cacheStorage.open(CACHE).catch(()=>null):null,url=new URL(pin.url,import.meta.url).href;
  const config=JSON.parse(new TextDecoder().decode(await verified(url,pin,fetcher,cache)));
  if(config.encoder!==encoder||config.encoderSha256!==pin.encoderSha256)throw Error('追加分類器の基盤モデルが一致しません。');
  const support=floats(await verified(new URL(config.support.file,url).href,config.support,fetcher,cache));
  if(config.support.shape[1]!==(encoder==='e5'?384:421)||support.length!==config.support.rows.length*config.support.shape[1]||!support.every(Number.isFinite))throw Error('意味比較データが不正です。');
  const languages={};
  for(const [lang,c] of Object.entries(config.languages)){
    const heads={};for(const [axis,h]of Object.entries(c.heads))heads[axis]=decodeHead(await verified(new URL(h.file,url).href,h,fetcher,cache),h);
    languages[lang]=heads;
  }
  return {config,support,languages};
}
export function applyFrequencyClassifier(embedding,baseline,model,language){
  const baseLanguage=String(language||'').toLowerCase().split('-')[0];language=baseLanguage==='fil'?'tl':baseLanguage;
  const heads=model.languages[language];if(!heads)throw Error('この言語の追加分類器がありません。');
  const scores=classifyEmbedding(embedding,heads,{threshold:0,margin:0}),norm=Math.hypot(...embedding);
  if(!Number.isFinite(norm)||norm<=0)throw Error('意味ベクトルが不正です。');
  const features=model.config.metric==='unit_embedding_v1'?embedding.map(v=>v/norm):[...embedding.map(v=>v/norm),...baseline.topic.probabilities,...baseline.interaction.probabilities];
  const length=Math.hypot(...features),metric=features.map(v=>v/length);
  const width=model.config.support.shape[1];
  if(metric.length!==width||!metric.every(Number.isFinite))throw Error('既存分類器の特徴量が一致しません。');
  const near={topic:{},interaction:{}};
  for(const [j,row]of model.config.support.rows.entries()){
    let dot=0;for(let k=0;k<width;k++)dot+=metric[k]*model.support[j*width+k];
    near[row.axis][row.label]=Math.max(near[row.axis][row.label]??-Infinity,dot);
  }
  const result={...baseline,frequencyLanguage:language};
  for(const [axis,head]of Object.entries(heads)){
    const score=scores[axis],rule=head.supportThresholds[score.id];if(!rule)continue;
    const similarity=near[axis][score.id]??-Infinity,margin=similarity-(near[axis].__old__??1);
    if(score.probability<rule.probability||similarity<rule.similarity||margin<rule.margin||axis==='topic'&&score.margin<.05)continue;
    result[axis]={...score,frequencyExtension:true,supportSimilarity:similarity,supportMargin:margin};
  }
  return result;
}
