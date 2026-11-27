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
  const hotSimilarity=cosine(v,hot),coldSimilarity=cosine(v,cold);
  const confidence=Math.max(hotSimilarity,coldSimilarity);
  const margin=Math.abs(hotSimilarity-coldSimilarity);
  // The Topic gate has already accepted temperature. Use a stable cold
  // tie-break when the two directions have exactly the same score.
  return {id:hotSimilarity>coldSimilarity?'hot':'cold',
    confidence,margin,hotSimilarity,coldSimilarity,language,
    method:'frozen-embedding-prototypes-v1'};
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
        cold:centroid(vectors.cold)
      }}};
    })();
    cache.set(key,prepared);
  }
  try{
    const model=await prepared;
    return classifyTemperatureDirection(embedding,model,locale);
  }
  catch{
    // Failure is local to this optional second-stage classifier. The original
    // temperature answer and its verified recorded voice continue unchanged.
    cache.delete(key);
    return null;
  }
}
