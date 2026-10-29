// Install a complete new generation before replacing an existing active shell.
// The fallback below can only read the currently activated, complete cache.
const CACHE='cootrio-web-shell-v189-access-credentials';
const SHELL=['./src/multilingual/additional-translations.js','./src/multilingual/additional-about.js','./src/visual-cue-settings.js','./src/visual-cue-controller.js','./src/visual-cue-catalog.js','./src/emma-background-cues.js','./src/multilingual/confirmation.js','./src/multilingual/operational-messages.js','./src/multilingual/core.js','./src/multilingual/performance.js','./src/multilingual/performance-controls.js','./src/multilingual/translations.js','./src/multilingual/ui.js','./src/settings-choice-buttons.js','./src/multilingual/about-page.js','./src/multilingual/client.js','./src/multilingual/worker.js','./src/multilingual/assets.js','./src/multilingual/assets.json','./src/multilingual/semantic-client.js','./src/multilingual/specialist-asr.js','./src/multilingual/vosk-asr.js','./src/multilingual/vosk-models.js','./src/multilingual/vosk-archive.js','./src/multilingual/vosk-archive-worker.js','./src/multilingual/sensevoice-asr.js','./src/multilingual/sensevoice-worker.js','./src/multilingual/pengcheng-asr.js','./src/multilingual/pengcheng-worker.js','./src/prerecorded-voice.js?v=20261021-audio-recovery-v2','./src/prerecorded-voice.js','./assets/voice-1202/manifest.json','./src/semantic/panel.js','./src/semantic/controller.js','./src/semantic/core.js','./src/semantic/client.js','./src/semantic/worker.js','./src/semantic/download.js', './src/semantic/tokenize.js','./src/semantic-assets-manifest.json','./src/conversation-history.js','./src/feature-screens.js','./src/app-navigation.js','./shared/play-topics.json','./','./index.html','./topic-guide.html','./src/multilingual/topic-guide.js','./src/multilingual/topic-guide-examples.js','./reset.html','./styles.css','./manifest.webmanifest','./manifest.intl.webmanifest','./icons/mitsukotoba-baby-abc-v2-192.png','./assets/mitsukotoba-parent.png','./assets/mitsukotoba-baby.png','./assets/mitsukotoba-ai.png','./assets/emma-face/emma-face-idle-open.svg','./assets/emma-face/emma-face-idle-half.svg','./assets/emma-face/emma-face-idle-closed.svg','./assets/emma-face/emma-face-talk-small.svg','./assets/emma-face/emma-face-talk-medium.svg','./assets/emma-face/emma-face-talk-large.svg','./assets/emma-face/emma-face-talk-small-half.svg','./assets/emma-face/emma-face-talk-small-closed.svg','./assets/emma-face/emma-face-talk-medium-half.svg','./assets/emma-face/emma-face-talk-medium-closed.svg','./assets/emma-face/emma-face-talk-large-half.svg','./assets/emma-face/emma-face-talk-large-closed.svg','./src/resume-greeting.js','./src/app.js','./src/microphone-continuity.js','./src/asr-worker.js','./src/moonshine-keyterm-bias.js','./src/asr-client.js','./src/turn-revisions.js','./src/emma-color-palettes.js','./src/resumable-download.js','./src/moonshine-module.js','./src/audio-capture.js','./src/silero-capture.js','./src/silero-endpoint.js','./src/silero-worker.js','./src/lite-response-engine.js','./src/interaction/diagnostics.js','./src/interaction/diversity.js','./src/interaction/frequent-replies.js','./src/interaction/supplemental-replies.js','./src/interaction/ruri-routing.js','./src/interaction/response.js','./src/lite-topic-matcher.js','./src/lite-phonetic-scene-matcher.js','./src/tts-worker.js','./worklets/pcm-capture-worklet.js'];
// Complete the transitive static ES module graph of src/app.js. These imports
// must survive a first-visit offline restart even before an online reload has
// let the controlling SW observe and cache dynamic network requests.
SHELL.push('./src/reply-display-hint.js','./src/vendor/moonshine/asset-downloader.js',
  './src/vendor/moonshine/errors.js','./src/multilingual/acft-model-store.js',
  './src/multilingual/acft-client.js','./src/multilingual/acft-window-policy.js',
  './src/multilingual/developer-translations.js');
SHELL.push('./src/multilingual/local-semantic-assets.js');
// This graph is loaded lazily by the ASR Worker, so the app.js static-import
// closure does not cover it. A shell generation update must retain the
// existing Moonshine code/runtime too, without fetching language-model weights.
for(const file of ['agent-flow.js','asset-downloader.js','embedding-model.js','enums.js','errors.js',
  'events.js','grapheme-to-phonemizer.js','index.js','mic-transcriber.js','module.js','moonshine.mjs',
  'moonshine.wasm.gz','stream.js','stt-worker-host.js','stt-worker-protocol.js','stt-worker.js',
  'text-to-speech.js','transcriber.js','tts-worker-host.js','tts-worker-protocol.js','tts-worker.js',
  'types.js','voice-clone.js']){
  const path='./src/vendor/moonshine/'+file;if(!SHELL.includes(path))SHELL.push(path);
}

// All current conversation illustrations, including animations and reduced-motion
// posters, must be available before the first utterance after an offline restart.
// Keep this list equal to the catalog; the offline browser probe decodes every file.
SHELL.push(
  "./assets/visual-cue/artwork/stills/milk.webp",
  "./assets/visual-cue/artwork/stills/book.webp",
  "./assets/visual-cue/artwork/stills/hands.webp",
  "./assets/visual-cue/artwork/stills/bath.webp",
  "./assets/visual-cue/artwork/stills/diaper.webp",
  "./assets/visual-cue/artwork/stills/toy.webp",
  "./assets/visual-cue/artwork/stills/outdoor.webp",
  "./assets/visual-cue/artwork/stills/sun.webp",
  "./assets/visual-cue/artwork/stills/clothes.webp",
  "./assets/visual-cue/artwork/stills/rain.webp",
  "./assets/visual-cue/artwork/stills/meal.webp",
  "./assets/visual-cue/artwork/stills/music.webp",
  "./assets/visual-cue/artwork/animations/hand-clap.webp",
  "./assets/visual-cue/artwork/posters/hand-clap.webp",
  "./assets/visual-cue/artwork/animations/sip.webp",
  "./assets/visual-cue/artwork/posters/sip.webp",
  "./assets/visual-cue/artwork/animations/water-rain.webp",
  "./assets/visual-cue/artwork/posters/water-rain.webp",
  "./assets/visual-cue/artwork/animations/water-shower.webp",
  "./assets/visual-cue/artwork/posters/water-shower.webp",
  "./assets/visual-cue/artwork/animations/water-splash.webp",
  "./assets/visual-cue/artwork/posters/water-splash.webp",
  "./assets/visual-cue/artwork/animations/spoon.webp",
  "./assets/visual-cue/artwork/posters/spoon.webp",
  "./assets/visual-cue/artwork/animations/notes.webp",
  "./assets/visual-cue/artwork/posters/notes.webp",
  "./assets/visual-cue/artwork/animations/peekaboo.webp",
  "./assets/visual-cue/artwork/posters/peekaboo.webp",
  "./assets/visual-cue/artwork/animations/care-wipe.webp",
  "./assets/visual-cue/artwork/posters/care-wipe.webp",
  "./assets/visual-cue/artwork/stills/diaper-v2.webp",
  "./assets/visual-cue/artwork/animations/change-diaper-v2.webp",
  "./assets/visual-cue/artwork/posters/change-diaper-v2.webp",
  "./assets/visual-cue/artwork/stills/clothes-open-v2.webp",
  "./assets/visual-cue/artwork/animations/change-zipper.webp",
  "./assets/visual-cue/artwork/posters/change-zipper.webp",
  "./assets/visual-cue/artwork/stills/tummy.webp",
  "./assets/visual-cue/artwork/animations/change-diaper-exchange.webp",
  "./assets/visual-cue/artwork/posters/change-diaper-exchange.webp",
  "./assets/visual-cue/artwork/stills/feet.webp",
  "./assets/visual-cue/artwork/animations/page.webp",
  "./assets/visual-cue/artwork/posters/page.webp",
  "./assets/visual-cue/artwork/animations/dress-sleeves.webp",
  "./assets/visual-cue/artwork/posters/dress-sleeves.webp",
  "./assets/visual-cue/artwork/animations/change-clothes.webp",
  "./assets/visual-cue/artwork/posters/change-clothes.webp",
  "./assets/visual-cue/artwork/animations/care-burp.webp",
  "./assets/visual-cue/artwork/posters/care-burp.webp",
  "./assets/visual-cue/artwork/stills/cup.webp",
  "./assets/visual-cue/artwork/stills/hands-open-v2.webp",
  "./assets/visual-cue/artwork/stills/sleep.webp",
  "./assets/visual-cue/artwork/stills/wake-bed.webp",
  "./assets/visual-cue/artwork/animations/kick.webp",
  "./assets/visual-cue/artwork/posters/kick.webp",
  "./assets/visual-cue/artwork/stills/hold-hands.webp",
  "./assets/visual-cue/artwork/animations/hand-wave.webp",
  "./assets/visual-cue/artwork/posters/hand-wave.webp",
  "./assets/visual-cue/motion-variants/hug-face-cuddle-poster.webp",
  "./assets/visual-cue/motion-variants/sun-rays.svg",
  "./assets/visual-cue/motion-variants/sun-rays-poster.svg",
  "./assets/visual-cue/motion-variants/outdoor-leaves.svg",
  "./assets/visual-cue/motion-variants/outdoor-leaves-poster.svg",
  "./assets/visual-cue/motion-variants/sleep-stars.svg",
  "./assets/visual-cue/motion-variants/sleep-stars-poster.svg",
  "./assets/visual-cue/motion-variants/toy-rattle.svg",
  "./assets/visual-cue/motion-variants/toy-rattle-poster.svg",
  "./assets/visual-cue/motion-variants/toy-roll.svg",
  "./assets/visual-cue/motion-variants/toy-roll-poster.svg",
  "./assets/visual-cue/motion-variants/hand-wash.svg",
  "./assets/visual-cue/motion-variants/hand-wash-poster.svg",
  "./assets/visual-cue/motion-variants/hug-face-cuddle.webp"
);

// Deliver the Thai model grant, source attribution and modification notices offline.
SHELL.push('./licenses/multilingual/PENGCHENG-NOTICE.html','./licenses/multilingual/PENGCHENG-APACHE-2.0.txt','./licenses/multilingual/PENGCHENG-MODEL-CARD.md','./licenses/multilingual/PENGCHENG-PROVENANCE.json','./licenses/multilingual/NOTICE.md','./THIRD_PARTY_NOTICES.md');
SHELL.push(
  './licenses.html',
  './licenses/CURRENT-MODEL-INVENTORY.json',
  './licenses/CURRENT-LICENSE-DIGESTS.json',
  './licenses/multilingual/SENSEVOICE-MODEL-LICENSE.txt',
  './licenses/multilingual/WHISPER-MIT.txt',
  './licenses/multilingual/E5-MIT.txt',
  './licenses/multilingual/ONNXRUNTIME.txt',
  './licenses/semantic/MODEL-CARD.md',
  './multilingual-assets/runtime/LICENSE-transformers.txt'
);

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k.startsWith('cootrio-web-shell-')&&k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
));

function withIsolationHeaders(response) {
  if(!response) return response;
  const headers=new Headers(response.headers);
  headers.set('Cross-Origin-Opener-Policy','same-origin');
  headers.set('Cross-Origin-Embedder-Policy','require-corp');
  headers.set('Cross-Origin-Resource-Policy','same-origin');
  return new Response(response.body,{
    status:response.status,
    statusText:response.statusText,
    headers
  });
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  // Only the ASR adapter writes this checksum-verified cache. A stable URL
  // also keeps Vosk's expanded IDBFS directory stable across app restarts.
  // Never copy these archives into the ordinary shell cache.
  if(url.pathname.includes('/src/multilingual/fixed-vosk/')){
    event.respondWith(caches.open('cootrio-fixed-vosk-official-20261025-v3')
      .then(cache=>cache.match(event.request))
      .then(response=>response?withIsolationHeaders(response):Response.error()));
    return;
  }

  // The voice worker owns a checksum-verified cache; avoid duplicate media storage.
  if(url.pathname.includes('/assets/voice-1202/')) {
    event.respondWith(fetch(event.request).then(withIsolationHeaders));
    return;
  }

  // Silero has its own SHA-256-verified model cache in the VAD worker.
  // Avoid a second, unverified copy in the shell cache.
  if(url.pathname.includes('/assets/vad/') ||
     url.pathname.includes('/src/vendor/sherpa-sensevoice-1.12.32/') ||
     url.pathname.includes('/src/vendor/sherpa-pengcheng-1.12.32-th/')) {
    event.respondWith(fetch(event.request).then(withIsolationHeaders));
    return;
  }

  // These are opt-in, SHA-256-verified assets cached by the semantic worker.
  // Do not duplicate ~93 MB into the ordinary shell cache.
  if(url.pathname.includes('/semantic-assets/') || url.pathname.includes('/multilingual-assets/')) {
    event.respondWith(caches.match(event.request).then(cached=>cached ? withIsolationHeaders(cached) : fetch(event.request).then(withIsolationHeaders)));
    return;
  }

  const isAppCode =
    event.request.mode==='navigate' ||
    ['document','script','style','worker','audioworklet'].includes(event.request.destination) ||
    /\.(?:html|js|css)$/.test(url.pathname);

  if(isAppCode){
    event.respondWith(
      (async()=>{
        const cache=await caches.open(CACHE);
        try{
          // Fresh code wins whenever the network is available. An HTTP error
          // is never written into the previously complete offline shell.
          const response=await fetch(event.request,{cache:'no-store'});
          if(!response.ok)return withIsolationHeaders(response);
          const isolated=withIsolationHeaders(response);
          await cache.put(event.request,isolated.clone()).catch(error=>{
            console.warn('Shell response cache failed',url.pathname,error);
          });
          return isolated;
        }catch{
          // The installed generation was atomically precached. Version query
          // strings must not stop index.html, app.js or styles.css from
          // booting when a browser is restarted without connectivity.
          // An exact versioned URL must win over an older bare alias. Using
          // ignoreSearch first could return stale code even when the current
          // query-specific module was already verified/downloaded online.
          const cached=await cache.match(event.request)||await cache.match(event.request,{ignoreSearch:true});
          return cached?withIsolationHeaders(cached):Response.error();
        }
      })()
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>{
      const network=fetch(event.request).then(response=>{
        const isolated=withIsolationHeaders(response);
        const copy=isolated.clone();
        caches.open(CACHE).then(c=>c.put(event.request,copy));
        return isolated;
      }).catch(()=>cached ? withIsolationHeaders(cached) : Response.error());
      return cached ? withIsolationHeaders(cached) : network;
    })
  );
});


const BACKGROUND_META_CACHE='mitsukotoba-background-model-meta-v1';

function bgHash(value){
  let hash=2166136261;
  for(let i=0;i<value.length;i++){
    hash^=value.charCodeAt(i);
    hash=Math.imul(hash,16777619);
  }
  return (hash>>>0).toString(16);
}

function bgMetaKey(id){
  return new URL('./__model_bg_meta__/'+id,self.registration.scope).href;
}

async function saveBgMeta(meta){
  const cache=await caches.open(BACKGROUND_META_CACHE);
  await cache.put(bgMetaKey(meta.id),new Response(JSON.stringify(meta),{
    headers:{'content-type':'application/json'}
  }));
}

async function loadBgMeta(id){
  const cache=await caches.open(BACKGROUND_META_CACHE);
  const response=await cache.match(bgMetaKey(id));
  return response ? response.json() : null;
}

async function deleteBgMeta(id){
  const cache=await caches.open(BACKGROUND_META_CACHE);
  await cache.delete(bgMetaKey(id));
}

async function listBgMeta(){
  const cache=await caches.open(BACKGROUND_META_CACHE);
  const requests=await cache.keys();
  const out=[];
  for(const request of requests){
    const response=await cache.match(request);
    if(!response) continue;
    try{out.push(await response.json());}catch{}
  }
  return out;
}

async function startTrackedBackgroundDownloads(){
  if(!self.registration.backgroundFetch) return;
  const items=await listBgMeta();
  for(const meta of items){
    try{
      const existing=await self.registration.backgroundFetch.get(meta.id);
      if(existing) continue;
      const request=new Request(meta.url,{
        mode:'cors',
        credentials:'omit',
        cache:'no-store'
      });
      await self.registration.backgroundFetch.fetch(
        meta.id,
        [request],
        {title:meta.title||'Preparing speech models'}
      );
    }catch(error){
      console.warn('Background Fetch start skipped',meta.url,error);
    }
  }
}

self.addEventListener('message',event=>{
  const message=event.data||{};
  if(message.type==='track-model-download'){
    const url=String(message.url||'');
    const cacheName=String(message.cacheName||'');
    const cacheKey=String(message.cacheKey||'');
    if(!url||!cacheName||!cacheKey) return;
    const title=String(message.title||'Preparing speech models').slice(0,110);
    const id='mitsukotoba-model-'+bgHash(url);
    event.waitUntil(saveBgMeta({id,url,cacheName,cacheKey,title}));
    return;
  }
  if(message.type==='start-background-downloads'){
    event.waitUntil(startTrackedBackgroundDownloads());
  }
});

self.addEventListener('backgroundfetchsuccess',event=>{
  event.waitUntil((async()=>{
    const meta=await loadBgMeta(event.registration.id);
    if(!meta) return;
    const records=await event.registration.matchAll();
    const target=await caches.open(meta.cacheName);
    for(const record of records){
      try{
        const response=await record.responseReady;
        if(response?.ok) await target.put(meta.cacheKey,response.clone());
      }catch(error){
        console.warn('Background Fetch response cache failed',error);
      }
    }
    await deleteBgMeta(meta.id);
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clients){
      client.postMessage({type:'background-model-ready',url:meta.url});
    }
  })());
});
