// Cancels the part of the microphone signal predicted by the local BGM.
// Both inputs use the same AudioContext clock. The capture/output route can
// still introduce an unknown delay, so estimate it from the signals first.
export class BgmEchoFilter {
  constructor(sampleRate) {
    this.lookback = Math.round(sampleRate * .35);
    this.window = Math.round(sampleRate * .12);
    this.scanInterval = Math.round(sampleRate * .45);
    this.scanStride = Math.max(2, Math.round(sampleRate / 8000));
    this.sampleStride = this.scanStride * 11;
    this.taps = new Float32Array(Math.round(sampleRate * .009));
    this.size = 2 ** Math.ceil(Math.log2(this.lookback + this.window + this.scanInterval + this.taps.length));
    this.mask = this.size - 1;
    this.reference = new Float32Array(this.size * 2);
    this.microphone = new Float32Array(this.size);
    this.position = 0;
    this.age = 0;
    this.delay = -1;
    this.nextScan = this.lookback + this.window;
    this.referencePower = 0;
    this.estimatePower = 0;
    this.residualPower = 0;
    this.microphonePower = 0;
  }

  process(microphone, reference, result) {
    for (let i = 0; i < microphone.length; i++) {
      const index = this.position & this.mask;
      const input = microphone[i];
      const bgm = reference?.[i] ?? 0;
      this.microphone[index] = input;
      this.reference[index] = bgm;
      this.reference[index + this.size] = bgm;
      result[i] = this.cancel(input, index);
      this.position++;
    }

    if (this.position >= this.nextScan && !this.sweep) {
      this.nextScan = this.position + this.scanInterval;
      this.sweep = { head: this.position - 1, delay: 0, bestDelay: 0, bestScore: 0 };
    }
    if (this.sweep) this.scan();
  }

  scan() {
    const sweep = this.sweep;
    // Spread the correlation search over render callbacks to limit deadline spikes.
    for (let i = 0; i < 56 && sweep.delay <= this.lookback; i++) {
      const score = Math.abs(this.correlation(sweep.head, sweep.delay));
      if (score > sweep.bestScore) {
        sweep.bestScore = score;
        sweep.bestDelay = sweep.delay;
      }
      sweep.delay += this.scanStride;
    }
    if (sweep.delay <= this.lookback) return;
    this.sweep = null;
    if (sweep.bestScore < .32) return;

    const coarseDelay = sweep.bestDelay;
    for (let delay = Math.max(0, coarseDelay - this.scanStride + 1);
      delay < coarseDelay + this.scanStride && delay <= this.lookback; delay++) {
      const score = Math.abs(this.correlation(sweep.head, delay));
      if (score > sweep.bestScore) {
        sweep.bestScore = score;
        sweep.bestDelay = delay;
      }
    }
    const inCurrentFilter = sweep.bestDelay >= this.delay &&
      sweep.bestDelay < this.delay + this.taps.length * .85;
    if (this.delay >= 0 && (inCurrentFilter || sweep.bestScore < .5)) return;
    this.delay = Math.max(0, sweep.bestDelay - Math.round(this.taps.length * .45));
    this.taps.fill(0);
    this.age = 0;
    this.referencePower = this.estimatePower = this.residualPower = this.microphonePower = 0;
  }

  correlation(head, delay) {
    let cross = 0, refPower = 0, micPower = 0;
    const diff = this.scanStride;
    for (let offset = 0; offset < this.window; offset += this.sampleStride) {
      const time = head - offset;
      const x = this.reference[(time - delay) & this.mask] -
        this.reference[(time - delay - diff) & this.mask];
      const mic = this.microphone[time & this.mask] - this.microphone[(time - diff) & this.mask];
      cross += x * mic;
      refPower += x * x;
      micPower += mic * mic;
    }
    return refPower > .000001 && micPower > .0000001 ? cross / Math.sqrt(refPower * micPower) : 0;
  }

  cancel(input, index) {
    if (this.delay < 0) return input;
    const start = ((index - this.delay) & this.mask) + this.size;
    const reference = this.reference;
    const taps = this.taps;
    const newSample = reference[start];
    const oldSample = reference[start - taps.length];
    if (this.age === 0) {
      for (let tap = 0; tap < taps.length; tap++) this.referencePower += reference[start - tap] ** 2;
    } else {
      this.referencePower = Math.max(0, this.referencePower + newSample ** 2 - oldSample ** 2);
    }
    this.age++;
    if (this.referencePower < .000003) return input;

    let estimate = 0;
    for (let tap = 0; tap < taps.length; tap++) estimate += taps[tap] * reference[start - tap];

    this.estimatePower += .002 * (estimate * estimate - this.estimatePower);
    this.microphonePower += .002 * (input * input - this.microphonePower);
    const error = input - estimate;
    this.residualPower += .015 * (error * error - this.residualPower);
    // Learn from the BGM, but slow updates sharply when someone near the
    // microphone is louder than the predicted echo. Always pass their PCM.
    const nearSpeech = this.age > taps.length * 14 &&
      (this.microphonePower > 4 * (this.estimatePower + .0000001) ||
       this.residualPower > .55 * (this.estimatePower + .0000001));
    const adjustment = (nearSpeech ? 0 : .12) * error / (this.referencePower + .0003);
    for (let tap = 0; tap < taps.length; tap++) {
      taps[tap] += adjustment * reference[start - tap];
    }
    return error;
  }
}
