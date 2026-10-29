import {LANGUAGES,LANGUAGE_NAMES,LANGUAGE_KEY,LANGUAGE_MODE_KEY,resolveLanguage,browserLanguages} from './core.js';
import { enhanceChoiceSelect, syncChoiceButtons } from '../settings-choice-buttons.js';
import {translate} from './translations.js?v=20261027-twelve-locale-r1';
import {renderLocalizedAbout} from './about-page.js';
// Disclose the fixed specialist provider; Whisper is used only by Multilingual.
// This is UI disclosure, not a claim that natural-speech QA is complete.
const ASR_PROVIDER_NOTICE={
  de:'Spracherkennung: Moonshine Small Streaming (Beta).',
  es:'Reconocimiento de voz: Moonshine Small Streaming (beta).',
  zh:'语音识别：Moonshine Tiny Streaming（测试版）。',
  ar:'التعرف على الكلام: Moonshine Tiny Streaming (نسخة تجريبية).',
  vi:'Nhận dạng giọng nói: Moonshine Tiny Streaming (thử nghiệm).',
  tl:'Pagkilala sa boses: Moonshine Tiny Streaming (beta).',
  fr:'Reconnaissance vocale : Vosk Small. Téléchargement automatique au premier démarrage, puis conservation sur cet appareil.',
  ko:'한국어 음성 인식: SenseVoice Small INT8. 처음 시작할 때 모델을 내려받고 이 기기에 저장해요.',
  th:'ภาษาไทย: PengChengStarling รุ่นทดลอง ดาวน์โหลดโมเดลประมาณ 350 MB ครั้งแรกและเก็บในอุปกรณ์ ไม่มีการใช้ Whisper',
  hi:'हिन्दी Vosk Small: पहली बार मॉडल अपने आप डाउनलोड होगा और इसी डिवाइस पर सुरक्षित रहेगा।'
};
export function installLanguageUI({document=globalThis.document,storage=globalThis.localStorage,
  languages=undefined,onChange=async()=>{},onExplanationsChange=()=>{},onRedetectSpeechLanguage=()=>{}}={}) {
  let saved,savedMode;try{saved=storage.getItem(LANGUAGE_KEY);savedMode=storage.getItem(LANGUAGE_MODE_KEY);}catch{}
  // A pre-existing saved selection is treated as manual (legacy migration).
  // New visitors and users who explicitly choose Auto follow the browser.
  const initialMode=LANGUAGES.includes(saved)&&savedMode!=='auto'?'manual':'auto';
  let mode=initialMode;
  const detected=()=>resolveLanguage({languages:languages??browserLanguages()});
  const initial=resolveLanguage({saved:mode==='manual'?saved:null,languages:languages??browserLanguages()});
  let language=initial.language,needsChoice=initial.needsChoice;
  const originals=new WeakMap(),attributes=new WeakMap(),selectors=[];
  const wordmark=document.querySelector('#onboardingScreen .brand-wordmark');
  const japaneseWordmark=wordmark?.innerHTML;
  const productNames=Object.fromEntries(LANGUAGES.map(code=>[code,code==='ja'?'みつことば':'CooTrio']));
  const title='言語を選択';
  const status=document.createElement('p');status.className='small multilingual-status';status.setAttribute('aria-live','polite');
  status.id='languageModelStatus';
  const note=document.createElement('p');note.className='small multilingual-mode-note';
  let busy=false,phase='idle';
  const progressPanel=document.createElement('section');progressPanel.id='languageDownloadPanel';
  progressPanel.className='language-download-panel';progressPanel.hidden=true;
  const progressTitle=document.createElement('strong');
  const progressHint=document.createElement('p');progressHint.className='small';
  const progressTrack=document.createElement('div');progressTrack.className='language-download-track';
  progressTrack.setAttribute('role','progressbar');progressTrack.setAttribute('aria-label','音声モデルの取得状況');
  progressTrack.setAttribute('aria-valuemin','0');progressTrack.setAttribute('aria-valuemax','100');
  const progressFill=document.createElement('div');progressFill.className='language-download-fill';
  progressTrack.append(progressFill);progressPanel.append(progressTitle,progressHint,progressTrack);
  function setStatus(key,{loaded,total,phase:nextPhase}={}){
    if(nextPhase)phase=nextPhase;
    status.dataset.message=key;status.dataset.loaded=loaded??'';status.dataset.total=total??'';
    const known=Number.isFinite(Number(total))&&Number(total)>0;
    status.textContent=translate(key,language)+(known?` ${(Number(loaded||0)/1e6).toFixed(1)} / ${(Number(total)/1e6).toFixed(1)} MB`:'');
    const stage=phase.startsWith('semantic-')?'semantic':'asr';
    const action=phase.endsWith('download')||phase==='download'?'download':
      phase.endsWith('initializing')||phase==='initializing'?'initializing':'loading';
    const active=phase==='loading'||phase==='download'||phase==='initializing'||
      phase.startsWith('asr-')||phase.startsWith('semantic-');
    progressPanel.hidden=!active;
    if(active){
      const headline=stage==='semantic'
        ? action==='download'?'セマンティックモデルをダウンロードしています…':
          action==='initializing'?'セマンティックモデルを初期化しています…':'セマンティックモデルを準備しています…'
        : action==='download'?'音声認識モデルをダウンロードしています…':
          action==='initializing'?'音声認識モデルを初期化しています…':'音声モデルを準備しています';
      progressTitle.textContent=translate(headline,language);
      progressHint.textContent=translate('準備中でも言語を変更できます。',language);
      const measurable=known&&action==='download';
      const pct=measurable?Math.max(0,Math.min(100,Math.round(Number(loaded||0)/Number(total)*100))):null;
      progressTrack.classList.toggle('indeterminate',pct===null);
      progressFill.style.width=(pct??35)+'%';
      if(pct===null)progressTrack.removeAttribute('aria-valuenow');
      else progressTrack.setAttribute('aria-valuenow',String(pct));
      progressTrack.setAttribute('aria-valuetext',progressTitle.textContent+(measurable?' '+status.textContent:''));
    }
  }
  async function choose(next){
    if(busy||(next!=='auto'&&!LANGUAGES.includes(next)))return;
    const automatic=next==='auto',resolved=automatic?detected().language:next;
    busy=true;selectors.forEach(s=>s.disabled=true);
    try{
      await onChange(resolved,{commit:()=>{
        language=resolved;mode=automatic?'auto':'manual';needsChoice=false;
        try{storage.setItem(LANGUAGE_KEY,resolved);storage.setItem(LANGUAGE_MODE_KEY,mode);}catch{}
        apply();document.getElementById('settingsLanguage')?.__collapseChoiceButtons?.();onExplanationsChange();
      }});
    }catch(error){
      console.error('Language preparation:',error);
      const details=String(error?.message||'');
      const storageFailure=/モデルを端末に保存できませんでした|QuotaExceeded|Unexpected internal error/i.test(details);
      const isolationFailure=['このブラウザではMoonshineに必要なService Workerを利用できません。','Moonshineに必要なブラウザ分離を有効にできませんでした。通常のブラウザタブで開き直してください。']
        .find(message=>details.includes(message));
      setStatus(isolationFailure||
        (storageFailure?'モデル保存に失敗しました。空き容量を確認して再試行してください。':'モデルを準備できませんでした。再試行してください。'));
      status.title=language==='ja'?details:translate(isolationFailure||'モデルを準備できませんでした。再試行してください。',language);
    }
    finally{busy=false;selectors.forEach(s=>s.disabled=false);apply();}
  }
  function picker(id){
    const wrap=document.createElement(id==='settingsLanguage'?'div':'label');wrap.className='language-picker';
    const label=document.createElement('span');label.className='language-picker-title';label.textContent=title;wrap.append(label);
    const select=document.createElement('select');select.id=id;select.setAttribute('aria-label',title);
    const automatic=document.createElement('option');automatic.value='auto';select.append(automatic);
    for(const code of LANGUAGES){const option=document.createElement('option');option.value=code;option.textContent=LANGUAGE_NAMES[code];option.dir=code==='ar'?'rtl':'ltr';option.lang=code;select.append(option);}
    select.value=mode==='auto'?'auto':language;select.addEventListener('change',()=>choose(select.value));selectors.push(select);wrap.append(select);
    if(id==='settingsLanguage')enhanceChoiceSelect(select);
    return wrap;
  }
  document.querySelector('#onboardingScreen .brand-row')?.after(picker('onboardingLanguage'));
  const settings=document.querySelector('#settingsScreen .settings-content');
  const settingsCard=document.createElement('article');settingsCard.className='card language-settings';
  settingsCard.innerHTML='<h2>言語</h2>';
  settingsCard.append(picker('settingsLanguage'),note,progressPanel,status);
  const redetectSpeechLanguage=document.createElement('button');
  redetectSpeechLanguage.id='redetectSpeechLanguage';
  redetectSpeechLanguage.type='button';redetectSpeechLanguage.className='outline-button';
  redetectSpeechLanguage.textContent='音声言語を再判定';
  redetectSpeechLanguage.addEventListener('click',()=>{
    if(language!=='en')return;
    onRedetectSpeechLanguage();
    setStatus('次の発話で音声言語を自動判定します。');
  });
  settingsCard.append(redetectSpeechLanguage);
  // Offline Vosk models are imported once, SHA-256 verified, and kept in
  // CacheStorage. Import is explicit; large models are never uploaded.
  const voskArchiveControl=document.createElement('label');
  voskArchiveControl.className='vosk-model-import';
  const voskArchiveTitle=document.createElement('span');
  voskArchiveTitle.textContent='Vosk Small — optional offline model import (.tar.gz)';
  const voskArchiveInput=document.createElement('input');
  voskArchiveInput.id='localeVoskArchive';voskArchiveInput.type='file';
  voskArchiveInput.accept='.tar.gz,application/gzip';
  voskArchiveInput.setAttribute('aria-label','Vosk Small offline model archive');
  voskArchiveControl.append(voskArchiveTitle,voskArchiveInput);
  const voskModelDownload=document.createElement('a');
  voskModelDownload.href='https://github.com/eltnegcellist/CooTrio-Web#models';
  voskModelDownload.target='_blank';voskModelDownload.rel='noopener noreferrer';
  voskModelDownload.textContent='Get checked Vosk browser models (Actions → successful run → artifact ZIP → select .tar.gz)';
  voskArchiveControl.append(voskModelDownload);
  document.querySelector('#developerTools')?.append(voskArchiveControl);
  voskArchiveInput.addEventListener('change',()=>{
    const file=voskArchiveInput.files?.[0];
    if(file)setStatus('Vosk archive selected. Start Emma to validate and cache offline.');
  });
  // Language first; manual Vosk import developer-only.
  settings?.querySelector('header')?.after(settingsCard);
  const about=document.querySelector('#aboutScreen .screen-content');
  let localizedAbout=null,localizedAboutLanguage=null;
  function eligible(node){
    const parent=node.parentElement;
    if(parent?.closest('.history-japanese,.history-english')&&!parent.closest('.history-label'))return false;
    return !parent?.closest('script,style,svg,.brand-wordmark,[data-no-i18n],#reply,#replyJapanese,#featureBody .history-entry');
  }
  function text(node){
    if(!eligible(node))return;
    const current=node.textContent,previous=originals.get(node);
    const source=previous&&current===previous.translated?previous.source:current;
    const translated=translate(source,language);originals.set(node,{source,translated});
    if(current!==translated)node.textContent=translated;
  }
  function walk(root){
    if(root.nodeType===3){text(root);return;}
    if(!root.querySelectorAll)return;
    const walker=document.createTreeWalker(root,4);let node;while(node=walker.nextNode())text(node);
    for(const el of [root,...root.querySelectorAll('[aria-label],[placeholder],[title],[alt]')]){
      if(!el.getAttribute||el.closest?.('[data-no-i18n],svg'))continue;
      const old=attributes.get(el)||{};
      for(const key of ['aria-label','placeholder','title','alt'])if(el.hasAttribute(key)){
        const value=el.getAttribute(key),prev=old[key],source=prev&&value===prev.translated?prev.source:value;
        const translated=translate(source,language);old[key]={source,translated};if(value!==translated)el.setAttribute(key,translated);
      }attributes.set(el,old);
    }
  }
  function apply(){
    document.documentElement.lang=language;document.documentElement.dataset.appLanguage=language;
    document.documentElement.dir=language==='ar'?'rtl':'ltr';
    const licenseLink=document.querySelector('#licenseSettingsLink');
    if(licenseLink)licenseLink.href='./licenses.html?lang='+encodeURIComponent(language);
    document.title=productNames[language];
    for(const el of document.querySelectorAll('#reply,.example-reply,.play-english-text')){
      el.lang='en';el.dir='ltr';
    }
    for(const el of document.querySelectorAll('#debugInput,textarea[data-semantic="input"]'))el.dir='auto';
    for(const el of document.querySelectorAll('#runtimeBackend'))el.dir='ltr';
    const manifest=document.querySelector('link[rel="manifest"]');
    if(manifest)manifest.setAttribute('href',language==='ja'
      ? './manifest.webmanifest?v=20261020-cootrio-r1'
      : './manifest.intl.webmanifest?v=20261020-cootrio-r1');
    const description=document.querySelector('meta[name="description"]');
    if(description)description.setAttribute('content',language==='ja'
      ? '親と赤ちゃんとAI、3人でつくる英語アプリ'
      : translate('みつことば — 親と赤ちゃんとAIの英語時間',language));
    const appleTitle=document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if(appleTitle)appleTitle.setAttribute('content',productNames[language]);
    if(wordmark){
      if(language==='ja'&&wordmark.dataset.localized==='true')wordmark.innerHTML=japaneseWordmark;
      else if(language!=='ja')wordmark.textContent=productNames[language];
      wordmark.dataset.localized=String(language!=='ja');
      wordmark.classList.toggle('brand-wordmark-localized',language!=='ja');
    }
    selectors.forEach(s=>{
      s.value=mode==='auto'?'auto':language;
      s.querySelector('option[value="auto"]').textContent=translate('自動（ブラウザ設定）',language)+' · '+LANGUAGE_NAMES[detected().language];
      syncChoiceButtons(s);
    });
    note.textContent=ASR_PROVIDER_NOTICE[language]||translate(language==='en'?'英語表示で、さまざまな言語の音声を自動認識します。':'選択した言語で話しかけると、短い英語で返します。',language);
    if(language==='th'){
      const license=document.createElement('a');
      license.href='./licenses/multilingual/PENGCHENG-NOTICE.html';
      license.textContent='ใบอนุญาตและแหล่งที่มาของโมเดล';
      license.target='_blank';license.rel='noopener noreferrer';
      license.dataset.thaiModelLicense='';note.append(' · ',license);
    }
    redetectSpeechLanguage.hidden=language!=='en';
    voskArchiveControl.hidden=!['fr','hi'].includes(language);
    const sub=document.querySelector('#prepareEmmaButton .button-sub');
    if(sub)sub.textContent=translate('初回のみ必要なモデルを準備します',language)+(language==='en'?' · ~387 MB':'');
    // Keep the original full Japanese research page intact, and render a
    // substantial localized page (including all 6 source links) for other languages.
    if(about&&language!=='ja'&&localizedAboutLanguage!==language){
      localizedAbout?.remove();
      localizedAbout=renderLocalizedAbout(document,language);
      about.querySelector('header')?.after(localizedAbout);
      localizedAboutLanguage=language;
    }
    if(localizedAbout)localizedAbout.hidden=language==='ja';
    if(about)for(const child of about.children) {
      if(child!==localizedAbout&&child.tagName!=='HEADER')child.hidden=language!=='ja';
    }
    const firstButton=document.getElementById('prepareEmmaButton');if(firstButton&&!busy)firstButton.disabled=needsChoice;
    // The Japanese Small/Tiny switch belongs exclusively to developer tools.
    const developerAsr=document.getElementById('developerJapaneseAsr');
    if(developerAsr)developerAsr.hidden=language!=='ja';
    const hint=document.getElementById('replyJapanese');
    if(hint){
      // Context notes also appear in supported non-English UI locales.
      // English requires no same-language explanation; the underlying reply
      // remains available in its original English text.
      hint.hidden=language==='en';
      hint.setAttribute('aria-label',translate('英文の場面説明',language));
    }
    for(const id of ['storageProtectionStatus','modelCacheStatus','modelCacheHistoryStatus']){
      const el=document.getElementById(id);if(el)el.hidden=language!=='ja';
    }
    const semanticHelp=document.getElementById('topicGuideSettings');
    if(semanticHelp){
      semanticHelp.hidden=false;
      const guideLink=semanticHelp.querySelector('a[href*="topic-guide.html"]');
      if(guideLink)guideLink.href='./topic-guide.html?lang='+encodeURIComponent(language);
    }
    walk(document.body);
    if(status.dataset.message)setStatus(status.dataset.message,{loaded:Number(status.dataset.loaded),total:Number(status.dataset.total),phase});
  }
  const observer=new MutationObserver(records=>{
    for(const r of records){if(r.type==='characterData')text(r.target);else if(r.type==='attributes')walk(r.target);else if(r.type==='childList')for(const n of r.addedNodes)walk(n);}
  });observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title','alt']});
  apply();
  return {get language(){return language;},
    get explanationLanguage(){return language;},
    get needsChoice(){return needsChoice;},get mode(){return mode;},apply,setStatus,choose,
    confirm(){
      try{storage.setItem(LANGUAGE_KEY,language);storage.setItem(LANGUAGE_MODE_KEY,mode);}catch{}
      return true;
    },
    translate:text=>translate(text,language),dispose:()=>observer.disconnect()};
}
