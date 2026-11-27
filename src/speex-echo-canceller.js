// Direct, allocation-free PCM bridge to the pinned speex-kmp WASM.
const PCM_SCALE = 32768;
const SET_SAMPLING_RATE = 24;

function toPcm16(value) {
  return Number.isFinite(value)
    ? Math.max(-PCM_SCALE, Math.min(PCM_SCALE - 1, Math.round(value * PCM_SCALE)))
    : 0;
}

export function createSpeexCanceller(module, sampleRate) {
  const frameSize = sampleRate / 50; // 20 ms
  if (sampleRate < 8000 || sampleRate > 96000 || !Number.isInteger(frameSize)) {
    throw new Error('Unsupported SpeexDSP sample rate: ' + sampleRate);
  }
  let wasm;
  const imports = {
    env: {emscripten_notify_memory_growth() {}},
    wasi_snapshot_preview1: {
      proc_exit(code) { throw new Error('SpeexDSP exited: ' + code); },
      fd_close() { return 8; }, // EBADF
      fd_seek() { return 70; }, // ESPIPE
      // Discard the library's diagnostic text in the audio render thread.
      fd_write(_fd, iov, count, written) {
        const view = new DataView(wasm.memory.buffer);
        let size = 0;
        for (let i = 0; i < count; i++) size += view.getUint32(iov + i * 8 + 4, true);
        view.setUint32(written, size, true);
        return 0;
      },
    },
  };
  wasm = new WebAssembly.Instance(module, imports).exports;
  wasm._initialize();
  let handle = 0, micPtr = 0, refPtr = 0, countPtr = 0;
  const destroy = () => {
    if (handle) wasm.xdsp_echo_free(handle);
    if (micPtr) wasm.free(micPtr);
    if (refPtr) wasm.free(refPtr);
    if (countPtr) wasm.free(countPtr);
    handle = micPtr = refPtr = countPtr = 0;
  };
  try {
    handle = wasm.xdsp_echo_create(frameSize, frameSize * 12, 1, 1); // 240 ms tail
    if (!handle || wasm.xdsp_echo_ctl_int(handle, SET_SAMPLING_RATE, sampleRate) !== 0) {
      throw new Error('SpeexDSP echo state creation failed');
    }
    micPtr = wasm.malloc(frameSize * Int16Array.BYTES_PER_ELEMENT);
    refPtr = wasm.malloc(frameSize * Int16Array.BYTES_PER_ELEMENT);
    countPtr = wasm.malloc(Int32Array.BYTES_PER_ELEMENT);
    if (!micPtr || !refPtr || !countPtr) throw new Error('SpeexDSP buffer allocation failed');
    const outPtr = wasm.xdsp_echo_output(handle, countPtr);
    if (!outPtr) throw new Error('SpeexDSP output buffer unavailable');

    let memory, micFrame, refFrame, outFrame, outputCount, position = 0;
    function refreshViews() {
      if (memory === wasm.memory.buffer) return;
      memory = wasm.memory.buffer;
      micFrame = new Int16Array(memory, micPtr, frameSize);
      refFrame = new Int16Array(memory, refPtr, frameSize);
      outFrame = new Int16Array(memory, outPtr, frameSize);
      outputCount = new Int32Array(memory, countPtr, 1);
    }
    refreshViews();
    const previousFrame = new Int16Array(frameSize);
    return {
      latencySamples: frameSize,
      cancel(mic, reference, pcm) {
        if (!handle) throw new Error('SpeexDSP canceller is closed');
        for (let i = 0; i < mic.length; i++) {
          // Emit the preceding processed frame as this one is collected. This
          // gives a fixed delay even when render quanta straddle frame boundaries.
          pcm[i] = previousFrame[position] / PCM_SCALE;
          micFrame[position] = toPcm16(mic[i]);
          refFrame[position] = toPcm16(reference?.[i]);
          position++;
          if (position !== frameSize) continue;
          const status = wasm.xdsp_echo_cancellation(handle, micPtr, frameSize, refPtr, frameSize);
          if (status !== 0 || wasm.xdsp_echo_output(handle, countPtr) !== outPtr) {
            throw new Error('SpeexDSP echo cancellation failed');
          }
          refreshViews();
          if (outputCount[0] !== frameSize) throw new Error('SpeexDSP returned an incomplete frame');
          previousFrame.set(outFrame);
          position = 0;
        }
      },
      destroy,
    };
  } catch (error) {
    destroy();
    throw error;
  }
}
