// Playback always uses the explicitly selected, verified recorded bank.
import { PrerecordedVoiceBank } from './prerecorded-voice.js?v=a3-v6';
import {A3_RECORDING, QWEN_RECORDING} from './emma-voice-selection.js';
const profiles = {
  [A3_RECORDING]: {engine:'a3-prerecorded', model:'Gemini 3.8 Flash TTS', voice:'A3'},
  [QWEN_RECORDING]: {engine:'qwen3-prerecorded', model:'Qwen3-TTS-1.7B-Base-8bit',
    voice:'Mitsukotoba-1202', generationSeed:1202, license:'Apache-2.0'}
};
let recording = A3_RECORDING, bank;
let recoveryRounds = 0, recoveryTimer = null;
function reportPrefetch(activeBank, status) {
  if (activeBank !== bank) return;
  self.postMessage({type:'prefetch-status', ...status});
  if (status.stage === 'complete') {
    recoveryRounds = 0;
    if (recoveryTimer) clearTimeout(recoveryTimer);
    recoveryTimer = null;
  } else if (status.stage === 'partial' && status.failed > 0 && recoveryRounds < 2 && !recoveryTimer) {
    // One missing clip must not hold the application hostage. Retry the
    // incomplete cache later while keeping already verified voices available.
    recoveryRounds++;
    recoveryTimer = setTimeout(() => {
      recoveryTimer = null;
      prefetch(activeBank);
    }, recoveryRounds * 15000);
  }
}

function prefetch(activeBank) {
  void activeBank.prefetchAll(status => reportPrefetch(activeBank, status))
    .catch(error => reportPrefetch(activeBank, {
      stage:'paused', message:error?.message || String(error)
    }));
}

self.onmessage = async event => {
  const data = event.data || {};
  try {
    if (data.type === 'init') {
      const selected = data.recording === QWEN_RECORDING ? QWEN_RECORDING : A3_RECORDING;
      if (data.engine && data.engine !== profiles[selected].engine) {
        throw Error('実行時の音声合成は廃止しました。事前収録音源を準備してください。');
      }
      if (!bank || selected !== recording) {
        if (recoveryTimer) clearTimeout(recoveryTimer);
        recoveryTimer = null;
        recoveryRounds = 0;
        recording = selected;
        bank = new PrerecordedVoiceBank({recording});
      }
      const activeBank = bank;
      await activeBank.init();
      if (activeBank !== bank) return;
      self.postMessage({type:'ready', device:'prerecorded-local', ...profiles[selected],
        offlineManifest:activeBank.offlineManifest});
      return;
    }
    if (!bank) throw Error('音声一覧を準備してください。');
    if (data.type === 'prefetch') {
      // Cache filling must not block playback or turn into a fatal voice error.
      prefetch(bank);
      return;
    }
    if (data.type === 'speak') {
      if (data.engine && data.engine !== profiles[recording].engine) {
        throw Error('実行時の音声合成は廃止しました。');
      }
      const text = String(data.text || (Array.isArray(data.sentences) ? data.sentences.join(' ') : '')).trim();
      if (!text) throw Error('再生する英文がありません。');
      const activeBank = bank;
      const excerptText = typeof data.excerptText === 'string' ? data.excerptText : null;
      const {blob, playbackDurationMs} = excerptText
        ? await activeBank.audioForExcerpt(text, excerptText)
        : {blob: await activeBank.audioFor(text)};
      if (activeBank !== bank) return;
      if (!blob) throw Error('この英文に対応する事前収録音源がありません。音声を再準備してください。');
      const {engine, voice} = profiles[recording];
      self.postMessage({type:'audio',requestId:data.requestId,index:0,sentence:excerptText||text,blob,playbackDurationMs,engine,voice});
      self.postMessage({type:'complete',requestId:data.requestId,total:1,engine,voice});
    }
  } catch (error) {
    self.postMessage({type:'error',requestId:data.requestId,message:error?.message || String(error)});
  }
};
