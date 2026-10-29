// Classic Worker: audited official ASR-only Sherpa runtime, no TTS/Whisper
// models. The parent verifies every script, binary and model before transfer.
let recognizer=null,runtime=null,closed=false;
const post=message=>self.postMessage(message);
const fail=(id,error)=>post({type:'error',id,message:String(error?.message||error)});
self.onmessage=({data})=>{
  if(closed)return;
  if(data.type==='init'){
    const {model,tokens,wasm,binding,glue}=data;
    const urls=[];
    const script=bytes=>{const url=URL.createObjectURL(new Blob([bytes],{type:'text/javascript'}));urls.push(url);return url;};
    self.Module={
      wasmBinary:new Uint8Array(wasm),
      print:message=>post({type:'diagnostic',message}),
      printErr:message=>post({type:'diagnostic',message}),
      onAbort:message=>fail(data.id,Error('SenseVoice WASM aborted: '+message)),
      onRuntimeInitialized(){
        try{
          runtime=self.Module;
          runtime.FS_createDataFile('/','sense-voice.onnx',new Uint8Array(model),true,false,true);
          runtime.FS_createDataFile('/','tokens.txt',new Uint8Array(tokens),true,false,true);
          recognizer=new OfflineRecognizer({
            featConfig:{sampleRate:16000,featureDim:80},
            modelConfig:{tokens:'/tokens.txt',numThreads:1,provider:'cpu',debug:0,
              senseVoice:{model:'/sense-voice.onnx',language:'ko',useInverseTextNormalization:1}},
            decodingMethod:'greedy_search'
          },runtime);
          if(!recognizer.handle)throw Error('SenseVoice recognizer creation failed');
          post({type:'ready',id:data.id,engine:'sensevoice',model:'sensevoice-small-ko-int8',
            language:'ko',precision:'int8',architecture:'sherpa-onnx-wasm-simd',
            license:'FunASR Model Open Source License Agreement',wasmMemoryBytes:runtime.HEAPU8.buffer.byteLength});
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
      if(!recognizer)throw Error('SenseVoice is not initialized');
      const audio=new Float32Array(data.audio);
      if(!audio.length||audio.some(value=>!Number.isFinite(value)))throw Error('Expected finite mono 16kHz PCM');
      const started=performance.now();stream=recognizer.createStream();
      if(!stream.handle)throw Error('SenseVoice stream creation failed');
      stream.acceptWaveform(16000,audio);recognizer.decode(stream);
      const result=recognizer.getResult(stream);
      post({type:'result',id:data.id,text:String(result.text||'').replace(/<\|[^|]+\|>/g,'').trim(),
        language:result.lang||'ko',elapsedMs:Math.round(performance.now()-started),
        wasmMemoryBytes:runtime.HEAPU8.buffer.byteLength});
    }catch(error){fail(data.id,error);}
    finally{stream?.free();}
    return;
  }
  if(data.type==='close'){
    closed=true;try{recognizer?.free();}finally{recognizer=null;self.close();}
  }
};
