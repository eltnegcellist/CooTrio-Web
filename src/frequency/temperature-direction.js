// Second-stage temperature classifier. All vectors come from the *same* frozen
// Ruri or E5 encoder that already produced the accepted Topic prediction.
// No word/regex labels, remote inference, or changes to the Topic model.
import {TEMPERATURE_PROTOTYPES} from './temperature-prototypes.js';

const DIM=384;
const cache=new Map();
const unit=value=>{
  if((!Array.isArray(value)&&!ArrayBuffer.isView(value))||value.length!==DIM)return null;
  const result=Array.from(value);
  if(!result.every(Number.isFinite))return null;
  const norm=Math.hypot(...result);
  return Number.isFinite(norm)&&norm>0?result.map(x=>x/norm):null;
};
const cosine=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const localeId=locale=>{
  const code=String(locale||'').toLowerCase().split(/[-_]/)[0];
  return code==='fil'?'tl':code;
};
function centroid(vectors){
  const sum=new Float64Array(DIM);
  for(const vector of vectors){
    const v=unit(vector);
    if(!v)throw Error('Temperature prototype embedding dimensions or values are invalid');
    for(let i=0;i<DIM;i++)sum[i]+=v[i];
  }
  const result=unit(sum);
  if(!result)throw Error('Temperature prototype centroid is empty');
  return result;
}

export function classifyTemperatureDirection(embedding,model,locale){
  if(model?.schemaVersion!==1)return null;
  const language=localeId(locale),group=model.languages?.[language],v=unit(embedding);
  if(!group||!v)return null;
  const hot=unit(group.hot),cold=unit(group.cold);
  if(!hot||!cold)return null;
  const h=cosine(v,hot),c=cosine(v,cold),similarity=Math.max(h,c),margin=Math.abs(h-c);
  const minSimilarity=group.minSimilarity??.65,minMargin=group.minMargin??.035;
  if(!Number.isFinite(minSimilarity)||!Number.isFinite(minMargin)||minSimilarity<0||minSimilarity>1||minMargin<0||minMargin>1)return null;
  if(similarity<minSimilarity||margin<minMargin)return null;
  return {id:h>c?'hot':'cold',confidence:similarity,margin,language,method:'frozen-embedding-prototypes-v1'};
}

// Internal diagnostic only. Do not turn this into a forced hot/cold prediction.
// The abstention threshold remains a separate, explicit policy.
export function inspectTemperatureDirection(embedding,model,locale){
  const language=localeId(locale),group=model?.languages?.[language];
  const v=unit(embedding),hot=unit(group?.hot),cold=unit(group?.cold);
  if(!v||!hot||!cold)return null;
  const hotSimilarity=cosine(v,hot),coldSimilarity=cosine(v,cold);
  const confidence=Math.max(hotSimilarity,coldSimilarity);
  const margin=Math.abs(hotSimilarity-coldSimilarity);
  const thresholdSimilarity=group.minSimilarity??.65,thresholdMargin=group.minMargin??.035;
  return {id:confidence>=thresholdSimilarity&&margin>=thresholdMargin?
    (hotSimilarity>coldSimilarity?'hot':'cold'):null,
    confidence,margin,hotSimilarity,coldSimilarity,language,
    abstentionReason:confidence<thresholdSimilarity?'low-similarity':margin<thresholdMargin?'low-margin':null};
}

export function refineTemperaturePrediction(prediction,embedding,model,language){
  if(prediction?.topic?.id!=='temperature')return prediction;
  return {...prediction,temperatureDirection:classifyTemperatureDirection(embedding,model,language)};
}

// The prototype vectors are generated lazily on the device from the exact
// existing encoder (no second model download). They are cached per encoder and
// locale and are never sent outside the device.
export async function classifyTemperatureWithEncoder(embedding,prediction,encoder,language,encode){
  if(prediction?.topic?.id!=='temperature')return null;
  if(!['ruri','e5'].includes(encoder)||typeof encode!=='function')return null;
  const locale=localeId(language),samples=TEMPERATURE_PROTOTYPES[locale];
  if(!samples||!Array.isArray(samples.hot)||!Array.isArray(samples.cold))return null;
  const key=encoder+':'+locale;
  let prepared=cache.get(key);
  if(!prepared){
    prepared=(async()=>{
      const vectors={hot:[],cold:[]};
      for(const category of ['hot','cold']){
        for(const text of samples[category])vectors[category].push(await encode(text));
      }
      return {schemaVersion:1,languages:{[locale]:{
        hot:centroid(vectors.hot),
        cold:centroid(vectors.cold),
        minSimilarity:.65,
        minMargin:.035
      }}};
    })();
    cache.set(key,prepared);
  }
  try{
    const model=await prepared;
    // Preserve score margins for QA even when this conservative model abstains.
    // Only `id` is used for actual English/Visual Cue routing.
    return inspectTemperatureDirection(embedding,model,locale);
  }
  catch{
    // Failure is local to this optional second-stage classifier. The original
    // temperature answer and its verified recorded voice continue unchanged.
    cache.delete(key);
    return null;
  }
}
