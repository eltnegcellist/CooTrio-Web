import { createSpeexCanceller } from '../src/speex-echo-canceller.js';

class EmmaSpeexPcmCapture extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.engine = null;
    try {
      this.engine = createSpeexCanceller(options.processorOptions.module, sampleRate);
      this.port.postMessage({type:'ready'});
    } catch (error) {
      this.reportFailure(error);
    }
    this.port.onmessage = ({data}) => {
      if (data?.type === 'stop') this.closeEngine();
    };
  }

  closeEngine() {
    const engine = this.engine;
    this.engine = null;
    engine?.destroy();
  }

  reportFailure(error) {
    this.port.postMessage({type:'speex-error', message:String(error?.message || error)});
  }

  process(inputs) {
    const mic = inputs[0]?.[0];
    if (!mic) return true;
    const pcm = new Float32Array(mic.length);
    if (this.engine) {
      try {
        this.engine.cancel(mic, inputs[1]?.[0], pcm);
      } catch (error) {
        this.reportFailure(error);
        this.closeEngine();
        pcm.set(mic);
      }
    } else {
      pcm.set(mic);
    }
    this.port.postMessage(pcm, [pcm.buffer]);
    return true;
  }
}

registerProcessor('emma-speex-pcm-capture', EmmaSpeexPcmCapture);
