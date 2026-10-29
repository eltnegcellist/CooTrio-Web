// Classic Worker; pinned PengChengStarling INT8 encoder/joiner and patched
// Sherpa ASR-only WASM. The parent verifies every binary before passing it.
let recognizer=null,runtime=null,closed=false;
const post=message=>self.postMessage(message);
const fail=(id,error)=>post({type:'error',id,message:String(error?.message||error)});
self.onmessage=({data})=>{
  if(closed)return;
  if(data.type==='init'){
    const {encoder,decoder,joiner,tokens,bpe,wasm,binding,glue}=data;
    const urls=[];
    const script=bytes=>{const url=URL.createObjectURL(new Blob([bytes],{type:'text/javascript'}));urls.push(url);return url;};
    self.Module={
      wasmBinary:new Uint8Array(wasm),
      print:message=>post({type:'diagnostic',message}),
      printErr:message=>post({type:'diagnostic',message}),
      onAbort:message=>fail(data.id,Error('PengChengStarling WASM aborted: '+message)),
      onRuntimeInitialized(){
        try{
          runtime=self.Module;
          const files=[['encoder.onnx',encoder],['decoder.onnx',decoder],['joiner.onnx',joiner],
            ['tokens.txt',tokens],['bpe.model',bpe]];
          for(const [name,bytes] of files)runtime.FS_createDataFile('/',name,new Uint8Array(bytes),true,false,true);
          recognizer=new OnlineRecognizer({
            featConfig:{sampleRate:16000,featureDim:80},
            modelConfig:{
              transducer:{encoder:'/encoder.onnx',decoder:'/decoder.onnx',joiner:'/joiner.onnx'},
              tokens:'/tokens.txt',numThreads:1,provider:'cpu',debug:0,
              modelType:'',modelingUnit:'cjkchar+bpe',bpeVocab:'/bpe.model'
            },
            decodingMethod:'greedy_search',maxActivePaths:4,enableEndpoint:0
          },runtime);
          if(!recognizer.handle)throw Error('PengChengStarling recognizer creation failed');
          post({type:'ready',id:data.id,engine:'pengchengstarling',model:'pengchengstarling-th',
            language:'th',precision:'int8-encoder-joiner',architecture:'sherpa-onnx-wasm-simd-th-sos',
            wasmMemoryBytes:runtime.HEAPU8.buffer.byteLength});
        }catch(error){fail(data.id,error);}
        finally{for(const url of urls)URL.revokeObjectURL(url);}
      }
    };
    try{importScripts(script(binding),script(glue));}
    catch(error){for(const url of urls)URL.revokeObjectURL(url);fail(data.id,error);}
    return;
  }
  if(data.type==='transcribe'){
    let stream;
    try{
      if(!recognizer)throw Error('PengChengStarling is not initialized');
      const audio=new Float32Array(data.audio);
      if(!audio.length||audio.some(value=>!Number.isFinite(value)))throw Error('Expected finite mono 16kHz PCM');
      const started=performance.now();stream=recognizer.createStream();
      if(!stream.handle)throw Error('PengChengStarling stream creation failed');
      // The C++ patch only applies the real Thai decoder SOS during Decode(),
      // not when JS supplies an option. Require observed token 8 afterwards.
      stream.setOption('pengcheng_langtag','<TH>');
      stream.acceptWaveform(16000,audio);stream.inputFinished();
      let iterations=0;
      while(recognizer.isReady(stream)){
        if(++iterations>100000)throw Error('PengChengStarling decoding did not terminate');
        recognizer.decode(stream);
      }
      const observedTag=stream.getOption('pengcheng_langtag_applied');
      if(observedTag!=='8')throw Error('PengChengStarling Thai SOS not applied in real decoder: '+observedTag);
      const result=recognizer.getResult(stream);
      post({type:'result',id:data.id,text:String(result.text||'').trim(),
        language:'th',observedTag,decodeSteps:iterations,
        elapsedMs:Math.round(performance.now()-started),wasmMemoryBytes:runtime.HEAPU8.buffer.byteLength});
    }catch(error){fail(data.id,error);}
    finally{stream?.free();}
    return;
  }
  if(data.type==='close'){
    closed=true;try{recognizer?.free();}finally{recognizer=null;self.close();}
  }
};
