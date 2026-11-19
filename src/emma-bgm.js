import {emmaBgmTracks} from './emma-bgm-tracks.js';

export const DEFAULT_BGM_VOLUME = .2;

export class EmmaBgm {
  constructor(onError, loadTrack = fetchTrack, random = Math.random) {
    this.onError = onError;
    this.loadTrack = loadTrack;
    this.random = random;
    this.volume = DEFAULT_BGM_VOLUME;
  }

  start(context, {song = null, loop = song === null, onEnded = null, reference = null} = {}) {
    if (this.context === context && this.song === song && this.loop === loop) {
      this.setReference(reference);
      return;
    }
    this.stop();
    this.context = context;
    this.song = song;
    this.loop = loop;
    this.gain = context.createGain();
    this.gain.gain.value = this.volume;
    this.gain.connect(context.destination);
    this.setReference(reference);
    const playback = this.playback = new AbortController();
    this.playPlaylist(context, playback.signal, song, loop, onEnded).catch(error => {
      if (playback.signal.aborted) return;
      this.stop();
      this.onError(error);
    });
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.gain) this.gain.gain.value = volume;
  }

  setReference(node) {
    if (node === this.reference) return;
    if (this.reference) this.gain.disconnect(this.reference, 0, 1);
    this.reference = node;
    if (node) this.gain.connect(node, 0, 1);
  }

  async playPlaylist(context, signal, song, loop, onEnded) {
    const repeatSong = loop && song !== null;
    let queue = [];
    const nextSong = () => {
      if (song !== null) return song;
      if (!queue.length) queue = this.shuffleTracks();
      return queue.pop();
    };
    let index = nextSong();
    let bytes = await this.loadTrack(emmaBgmTracks[index], signal);
    while (!signal.aborted) {
      const buffer = await context.decodeAudioData(bytes);
      if (signal.aborted) return;
      const ended = this.playBuffer(context, signal, buffer, repeatSong);
      if (song === null) this.lastRandomSong = index;
      if (!loop || repeatSong) {
        await ended;
        if (!signal.aborted) {
          this.stop();
          onEnded?.();
        }
        return;
      }
      index = nextSong();
      // Fetch the next file while the current one is playing, and decode one
      // track at a time so a playlist does not keep all PCM buffers alive.
      [bytes] = await Promise.all([this.loadTrack(emmaBgmTracks[index], signal), ended]);
    }
  }

  shuffleTracks() {
    const queue = emmaBgmTracks.map((_, index) => index);
    for (let end = queue.length - 1; end > 0; end--) {
      const other = Math.floor(this.random() * (end + 1));
      [queue[end], queue[other]] = [queue[other], queue[end]];
    }
    const first = queue.length - 1;
    if (first > 0 && queue[first] === this.lastRandomSong) {
      const other = Math.floor(this.random() * first);
      [queue[first], queue[other]] = [queue[other], queue[first]];
    }
    return queue;
  }

  playBuffer(context, signal, buffer, loop) {
    const source = this.source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(this.gain);
    return new Promise(resolve => {
      const finish = () => {
        signal.removeEventListener('abort', finish);
        source.onended = null;
        source.disconnect();
        if (this.source === source) this.source = null;
        resolve();
      };
      signal.addEventListener('abort', finish, {once: true});
      source.onended = finish;
      source.start();
    });
  }

  stop() {
    const source = this.source;
    this.playback?.abort();
    this.playback = null;
    if (source) {
      try { source.stop(); } catch {}
    }
    this.gain?.disconnect();
    this.gain = null;
    this.reference = null;
    this.context = null;
    this.song = null;
    this.loop = false;
  }
}

async function fetchTrack(track, signal) {
  const url = new URL('../assets/conversation-bgm/' + track.file, import.meta.url);
  const response = await fetch(url, {signal});
  if (!response.ok) throw new Error('BGM file unavailable (' + response.status + ')');
  return response.arrayBuffer();
}
