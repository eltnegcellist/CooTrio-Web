import { SileroEndpointPolicy, AnalysisResampler, RawPcmWindow } from './silero-endpoint.js';

export class SileroCaptureDetector {
  static async create(options) {
    const detector=new SileroCaptureDetector(options);
    try { await detector.ready;return detector; } catch(error) { detector.close();throw error; }
  }
  constructor({sampleRate,onResult,onError,onDiagnostic,signal,workerFactory=()=>new Worker(new URL('./silero-worker.js',import.meta.url),{type:'module'})}) {
    this.rate=sampleRate;this.onResult=onResult;this.onError=onError;this.onDiagnostic=onDiagnostic;
    this.workerStats={sent:0,received:0,stale:0,errors:0,resets:0,overflow:0,maxPending:0,lastReceivedAt:null};
    this.window=new RawPcmWindow(sampleRate*30);this.policy=new SileroEndpointPolicy();this.resampler=new AnalysisResampler(sampleRate);
    this.epoch=0;this.pending=0;this.frame=new Float32Array(512);this.frameCount=0;this.vadSamples=0;this.base=0;this.captureStart=null;this.pendingEnd=null;this.dirty=false;this.closed=false;
    this.worker=workerFactory();
    this.ready=new Promise((resolve,reject)=>{
      this.timer=setTimeout(()=>reject(Error('声の判定モデルの準備が完了しませんでした。')),15000);
      this.worker.onerror=()=>{this.noteWorker('error');reject(Error('声の判定処理を読み込めませんでした。'));this.fail();};
      this.worker.onmessage=({data})=>{
        if(this.closed)return;
        if(data.type==='ready'){clearTimeout(this.timer);this.initialized=true;resolve();}
        else if(data.type==='error'){this.noteWorker('error');reject(Error(data.message));this.fail();}
        else if(data.type==='probability') {
          if(data.epoch!==this.epoch){this.noteWorker('stale');return;}
          this.pending=Math.max(0,this.pending-1);
          this.noteWorker('received');
          if(this.pendingEnd)return;
          let event;try { event=this.policy.push(data.probability); } catch { this.fail();return; }
          if(event==='speech-start') { this.captureStart=Math.max(0,data.endSample-Math.round(this.rate*.55));this.onResult({event}); }
          if(event==='cancel')this.captureStart=null;
          if(event==='utterance') { this.pendingEnd=data.endSample+Math.round(this.rate*.14);this.flushEndpoint(); }
        }
      };
      const abort=()=>{reject(Error('Silero initialization cancelled'));this.close();};
      this.removeAbort=()=>signal?.removeEventListener('abort',abort);
      if(signal?.aborted){abort();return;}
      signal?.addEventListener('abort',abort,{once:true});
      this.worker.postMessage({type:'init'});
    });
  }
  // Counts are metadata only; never expose PCM, probabilities or transcripts.
  noteWorker(kind) {
    const stats=this.workerStats;
    if(kind==='sent')stats.sent++;
    else if(kind==='received'){stats.received++;stats.lastReceivedAt=Date.now();}
    else if(kind==='stale')stats.stale++;
    else if(kind==='error')stats.errors++;
    else if(kind==='reset')stats.resets++;
    else if(kind==='overflow')stats.overflow++;
    stats.maxPending=Math.max(stats.maxPending,this.pending);
    try{this.onDiagnostic?.({kind,pending:this.pending});}catch{}
  }
  getDiagnostics() {
    const stats=this.workerStats;
    return {backend:'silero',initialized:Boolean(this.initialized),closed:this.closed,
      pending:this.pending,maxPending:stats.maxPending,
      sent:stats.sent,received:stats.received,stale:stats.stale,
      errors:stats.errors,resets:stats.resets,overflow:stats.overflow,
      lastReceivedAgeMs:stats.lastReceivedAt===null?null:Math.max(0,Date.now()-stats.lastReceivedAt)};
  }
  fail() {
    if(this.closed)return;
    const initialized=this.initialized;this.close();
    if(initialized)this.onError?.(Error('声の判定処理が中断しました。設定で従来方式に戻して再開してください。'));
  }
  push(frame) {
    if(this.closed)return {event:'none'};
    this.dirty=true;this.window.append(frame);
    if(this.pendingEnd){this.flushEndpoint();return {event:'none'};}
    if(this.captureStart!==null && this.window.end-this.captureStart>=this.rate*30) {
      const audio=this.forceCurrentUtterance();this.onResult({event:'utterance',audio});return {event:'none'};
    }
    for(const sample of this.resampler.push(frame)) {
      this.frame[this.frameCount++]=sample;
      if(this.frameCount===512) {
        if(this.pending>=64){this.noteWorker('overflow');this.fail();return {event:'none'};}
        this.vadSamples+=512;this.pending++;
        const samples=this.frame;this.frame=new Float32Array(512);this.frameCount=0;
        this.worker.postMessage({type:'frame',samples,epoch:this.epoch,endSample:this.base+Math.round(this.vadSamples*this.rate/16000)},[samples.buffer]);
        this.noteWorker('sent');
      }
    }
    return {event:'none'};
  }
  flushEndpoint() {
    if(this.pendingEnd===null || this.window.end<this.pendingEnd)return;
    const startSample=this.captureStart??Math.max(0,this.pendingEnd-this.rate*.55),endSample=this.pendingEnd;
    const audio=this.window.slice(startSample,endSample);
    this.resetSpeechOnly();this.onResult({event:'utterance',audio,startSample,endSample});
  }
  forceCurrentUtterance() {
    const audio=this.window.slice(this.captureStart??Math.max(0,this.window.end-this.rate*.55));
    this.resetSpeechOnly();return audio;
  }
  resetSpeechOnly() {
    if(!this.dirty)return;
    this.epoch++;this.pending=0;this.noteWorker('reset');this.frameCount=0;this.vadSamples=0;this.captureStart=null;this.pendingEnd=null;
    this.policy.reset();this.resampler.reset();this.window.clear();this.base=0;this.dirty=false;
    if(!this.closed)this.worker.postMessage({type:'reset'});
  }
  reset() { this.resetSpeechOnly(); }
  close() { if(this.closed)return;this.closed=true;clearTimeout(this.timer);this.removeAbort?.();this.worker.terminate(); }
}
