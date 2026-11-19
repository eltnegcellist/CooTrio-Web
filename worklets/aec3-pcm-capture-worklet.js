// Experimental WebRTC AEC3 (WASM) capture path. Source: locally staged
// @ai-ecoverse/wasm-webrtc-audio-processing 2.1.0-2 (BSD-3-Clause/Apache-2.0).
import {instantiate} from '../assets/experimental-aec3/index.js';

class EmmaAec3PcmCapture extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.failed=false;
    this.engine=null;
    try {
      const wasm=instantiate(options.processorOptions.module);
      this.engine=wasm.create({sampleRate,noiseSuppression:false,vad:false});
      this.port.postMessage({type:'ready'});
    } catch(error) {
      this.failed=true;
      this.port.postMessage({type:'aec3-error',message:String(error?.message||error)});
    }
    this.port.onmessage=event=>{
      if(event.data?.type==='stop'){
        this.engine?.destroy();
        this.engine=null;
      }
    };
  }

  process(inputs) {
    const mic=inputs[0]?.[0];
    if(!mic)return true;
    const reference=inputs[1]?.[0]??new Float32Array(mic.length);
    const pcm=new Float32Array(mic.length);
    if(this.engine && !this.failed) {
      try {
        this.engine.cancel(mic,reference,pcm);
        for(let i=0;i<pcm.length;i++)if(!Number.isFinite(pcm[i]))pcm[i]=0;
      } catch(error) {
        // Never silently keep playing BGM with unfiltered microphone input.
        this.failed=true;
        this.port.postMessage({type:'aec3-error',message:String(error?.message||error)});
        pcm.set(mic);
      }
    } else pcm.set(mic);
    this.port.postMessage(pcm,[pcm.buffer]);
    return true;
  }
}
registerProcessor('emma-aec3-pcm-capture',EmmaAec3PcmCapture);
