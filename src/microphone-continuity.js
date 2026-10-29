// Developer-only experiment: keep the already-granted MediaStream alive across
// English playback. This does not override browser background suspension.
export const MIC_CONTINUITY_KEY = 'emma_web_persistent_microphone_experiment_v1';

export function persistentMicrophoneEnabled(storage) {
  try { return storage?.getItem(MIC_CONTINUITY_KEY) === 'true'; }
  catch { return false; }
}

export function shouldReleaseMicrophoneForReply({running, hasMicrophone, persistent}) {
  return Boolean(running && hasMicrophone && !persistent);
}

export function compareHiddenMicrophoneSnapshots(before, after, hiddenMilliseconds) {
  if(!before || !after) return null;
  const frames = Math.max(0, (after.frames ?? 0) - (before.frames ?? 0));
  const samples = Math.max(0, (after.samples ?? 0) - (before.samples ?? 0));
  const live = (after.liveTracks ?? 0) > 0;
  const active = after.contextState === 'running' && live && frames > 0;
  return {
    seconds: Math.max(0, Math.round((hiddenMilliseconds || 0)/1000)),
    frames, samples, live, muted: (after.mutedTracks ?? 0) > 0,
    contextState: after.contextState ?? 'unknown', inputContinued: active
  };
}


// In-memory, per-hidden-period aggregate metrics. No audio buffers,
// transcripts, model tokens, or speaker-identifying content are retained.
export class HiddenAudioPipelineProbe {
  constructor(now=()=>Date.now()) {
    this.now=now;
    this.startedAt=now();
    this.frames=0;
    this.samples=0;
    this.rmsSum=0;
    this.peakRms=0;
    this.aboveLevelFrames=0;
    this.ignoredFrames=0;
    this.vadFrames=0;
    this.speechStarts=0;
    this.utterances=0;
    this.asrStarts=0;
    this.asrCompletes=0;
    this.asrNonempty=0;
    this.asrErrors=0;
    this.replyStarts=0;
    this.replyCompletes=0;
    this.events=[];
    this.levelWindows=new Map();
    this.worker={sent:0,received:0,stale:0,errors:0,resets:0,overflow:0,
      pendingLast:null,pendingMax:0,lastSentMs:null,lastReceivedMs:null};
    this.workerStart=null;
    this.workerEnd=null;
    this.sampleRate=0;
    this.zeroSignal={zeroFrames:0,nonzeroFrames:0,zeroSamples:0,
      zeroRunSamples:0,longestZeroRunSamples:0,lastNonzeroMs:null};
    this.recovery={status:'not-attempted',attempts:0,requestedAtMs:null,
      finishedAtMs:null,signalRestoredAtMs:null,errorName:'none'};
  }

  setSampleRate(rate) {
    if(Number.isFinite(rate)&&rate>0)this.sampleRate=rate;
  }

  zeroRunSeconds() {
    return this.sampleRate>0?this.zeroSignal.zeroRunSamples/this.sampleRate:0;
  }

  shouldAttemptRecovery() {
    // One guarded attempt per hidden interval. Require actual PCM frames, not
    // wall time or silent intervals inferred from missing worklet messages.
    return this.recovery.attempts===0 && this.zeroRunSeconds()>=5;
  }

  markRecovery(status,errorName='none') {
    const nowMs=Math.max(0,this.now()-this.startedAt);
    if(status==='requesting') {
      if(this.recovery.attempts)return;
      this.recovery.attempts=1;
      this.recovery.requestedAtMs=nowMs;
    } else {
      this.recovery.finishedAtMs=nowMs;
      this.recovery.errorName=String(errorName||'none').slice(0,40);
    }
    this.recovery.status=status;
  }

  // Derive 5-second windows from incoming frames/events; hidden tabs cannot
  // reliably run timers. Retain no more than the latest five minutes.
  windowAt() {
    const index=Math.max(0,Math.floor((this.now()-this.startedAt)/5000));
    if(!this.levelWindows.has(index)) {
      this.levelWindows.set(index,{frames:0,rmsSum:0,peakRms:0,aboveLevelFrames:0,
        ignoredFrames:0,vadFrames:0,workerSent:0,workerReceived:0,
        workerStale:0,workerErrors:0,workerPendingMax:0,workerPendingLast:null,zeroFrames:0,events:[]});
      if(this.levelWindows.size>60)this.levelWindows.delete(this.levelWindows.keys().next().value);
    }
    return this.levelWindows.get(index);
  }

  recordFrame({rms=0,samples=0,ignored=false}={}) {
    const level=Number.isFinite(rms)?Math.max(0,rms):0;
    const window=this.windowAt();
    const sampleCount=Math.max(0,Number(samples)||0);
    this.frames++;this.samples+=sampleCount;
    const zero=this.sampleRate>0 && sampleCount>0 && rms===0;
    const ms=Math.max(0,this.now()-this.startedAt);
    if(zero) {
      this.zeroSignal.zeroFrames++;
      this.zeroSignal.zeroSamples+=sampleCount;
      this.zeroSignal.zeroRunSamples+=sampleCount;
      this.zeroSignal.longestZeroRunSamples=Math.max(
        this.zeroSignal.longestZeroRunSamples,this.zeroSignal.zeroRunSamples);
      window.zeroFrames++;
    } else if(sampleCount>0 && Number.isFinite(rms) && rms>0) {
      this.zeroSignal.nonzeroFrames++;
      this.zeroSignal.zeroRunSamples=0;
      this.zeroSignal.lastNonzeroMs=ms;
      if(this.recovery.status==='replaced-no-signal') {
        this.recovery.status='signal-restored';
        this.recovery.signalRestoredAtMs=ms;
      }
    }
    this.rmsSum+=level;this.peakRms=Math.max(this.peakRms,level);
    window.frames++;window.rmsSum+=level;window.peakRms=Math.max(window.peakRms,level);
    // An amplitude heuristic; not proof of speech.
    if(level>=0.012){this.aboveLevelFrames++;window.aboveLevelFrames++;}
    if(ignored){this.ignoredFrames++;window.ignoredFrames++;}
    else{this.vadFrames++;window.vadFrames++;}
  }

  recordWorker({kind,pending}={}) {
    const window=this.windowAt();
    const ms=Math.max(0,this.now()-this.startedAt);
    if(kind==='sent'){this.worker.sent++;window.workerSent++;this.worker.lastSentMs=ms;}
    else if(kind==='received'){this.worker.received++;window.workerReceived++;this.worker.lastReceivedMs=ms;}
    else if(kind==='stale'){this.worker.stale++;window.workerStale++;}
    else if(kind==='error'){this.worker.errors++;window.workerErrors++;}
    else if(kind==='reset')this.worker.resets++;
    else if(kind==='overflow')this.worker.overflow++;
    else return;
    if(Number.isInteger(pending)&&pending>=0) {
      this.worker.pendingLast=pending;
      this.worker.pendingMax=Math.max(this.worker.pendingMax,pending);
      window.workerPendingMax=Math.max(window.workerPendingMax,pending);
      window.workerPendingLast=pending;
    }
  }

  setWorkerStart(value){this.workerStart=value||null;}
  setWorkerEnd(value){this.workerEnd=value||null;}

  event(kind) {
    const counters={
      'speech-start':'speechStarts','utterance':'utterances',
      'asr-start':'asrStarts','asr-complete':'asrCompletes',
      'asr-nonempty':'asrNonempty','asr-error':'asrErrors',
      'reply-start':'replyStarts','reply-complete':'replyCompletes'
    };
    const field=counters[kind];
    if(!field)return;
    this[field]++;
    const ms=Math.max(0,this.now()-this.startedAt);
    if(this.events.length<32)this.events.push({ms,stage:kind});
    const window=this.windowAt();
    if(window.events.length<8)window.events.push(kind);
  }

  snapshot() {
    const elapsedMs=Math.max(0,this.now()-this.startedAt);
    const lastIndex=Math.floor(elapsedMs/5000);
    const firstIndex=Math.max(0,lastIndex-59);
    const level5s=[];
    for(let index=firstIndex;index<=lastIndex;index++) {
      const w=this.levelWindows.get(index);
      level5s.push({startSec:index*5,frames:w?.frames??0,
        meanRms:w?.frames?w.rmsSum/w.frames:0,peakRms:w?.peakRms??0,
        aboveLevelFrames:w?.aboveLevelFrames??0,
        ignoredFrames:w?.ignoredFrames??0,vadFrames:w?.vadFrames??0,
        workerSent:w?.workerSent??0,workerReceived:w?.workerReceived??0,
        workerStale:w?.workerStale??0,workerErrors:w?.workerErrors??0,
        workerPendingMax:w?.workerPendingMax??0,
        workerPendingLast:w?.workerPendingLast??null,zeroFrames:w?.zeroFrames??0,
        events:w?.events||[]});
    }
    return {
      frames:this.frames,samples:this.samples,
      meanRms:this.frames?this.rmsSum/this.frames:0,
      peakRms:this.peakRms,aboveLevelFrames:this.aboveLevelFrames,
      ignoredFrames:this.ignoredFrames,vadFrames:this.vadFrames,
      speechStarts:this.speechStarts,utterances:this.utterances,
      asrStarts:this.asrStarts,asrCompletes:this.asrCompletes,
      asrNonempty:this.asrNonempty,asrErrors:this.asrErrors,
      replyStarts:this.replyStarts,replyCompletes:this.replyCompletes,
      events:this.events.map(event=>({...event})),
      level5s,worker:{...this.worker,start:this.workerStart,end:this.workerEnd},
      zeroSignal:{...this.zeroSignal,zeroRunSeconds:this.zeroRunSeconds(),
        longestZeroRunSeconds:this.sampleRate>0?this.zeroSignal.longestZeroRunSamples/this.sampleRate:0,
        signalAfterReply:this.replyCompletes>0 && this.zeroSignal.lastNonzeroMs!==null
          ? this.zeroSignal.lastNonzeroMs>=(this.events.findLast(e=>e.stage==='reply-complete')?.ms??Infinity)
          : null},
      recovery:{...this.recovery}
    };
  }
}
