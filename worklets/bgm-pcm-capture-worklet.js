import { BgmEchoFilter } from '../src/bgm-echo-filter.js';

class BgmPcmCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.filter = new BgmEchoFilter(sampleRate);
  }

  process([input, playback]) {
    const microphone = input?.[0];
    if (!microphone) return true;
    const pcm = new Float32Array(microphone.length);
    this.filter.process(microphone, playback?.[0], pcm);
    this.port.postMessage(pcm, [pcm.buffer]);
    return true;
  }
}

registerProcessor('emma-bgm-pcm-capture', BgmPcmCapture);
