// SNS sharing only. Use the public URL, never conversations, recordings or usage data.
export const PUBLIC_APP_URL = 'https://cootrio-web.pages.dev/';
// [card title, hint, share text, copied, manual copy, failed]
const COPY = {
  ja: ['みつことばをシェアしてもらえませんか？','家族や友だちに紹介する','最近「みつことば」を使ってます。赤ちゃんに話しかけると、AIが短い英語で返してくれるアプリです。','アプリのリンクをコピーしました。','リンクを選択してコピーしてください。','共有できなかったので、リンクをコピーしました。'],
  en: ['Could you share CooTrio?','Send it to family or friends','I’ve been using CooTrio. When I talk to my baby, it replies with a little English.','App link copied.','Select and copy the link.','Sharing did not work, so I copied the link.'],
  de: ['Würdest du CooTrio teilen?','Mit Familie oder Freunden teilen','Ich benutze gerade CooTrio. Wenn ich mit meinem Baby spreche, antwortet die App mit einem kurzen englischen Satz.','Link kopiert.','Link markieren und kopieren.','Teilen fehlgeschlagen. Link kopiert.'],
  fr: ['Pourriez-vous partager CooTrio ?','À envoyer à vos proches','J’utilise CooTrio en ce moment. Je parle à mon bébé et l’appli répond avec une petite phrase en anglais.','Lien copié.','Sélectionnez et copiez le lien.','Le partage a échoué. Lien copié.'],
  es: ['¿Puedes compartir CooTrio?','Envíalo a familiares o amigos','Últimamente uso CooTrio. Hablo con mi bebé y la app responde con una frase cortita en inglés.','Enlace copiado.','Selecciona y copia el enlace.','No se pudo compartir. Enlace copiado.'],
  zh: ['可以帮忙分享 CooTrio 吗？','发给家人或朋友','最近在用 CooTrio。跟宝宝说话时，它会用一句简短的英语回应。','已复制链接。','请选择并复制链接。','分享失败，已复制链接。'],
  ko: ['CooTrio를 공유해 주시겠어요?','가족이나 친구에게 보내기','요즘 CooTrio를 쓰고 있어요. 아기에게 말을 걸면 짧은 영어로 대답해 주는 앱이에요.','링크를 복사했어요.','링크를 선택해 복사하세요.','공유하지 못해 링크를 복사했어요.'],
  th: ['ช่วยแชร์ CooTrio ให้หน่อยได้ไหม?','ส่งให้ครอบครัวหรือเพื่อน','ช่วงนี้ฉันใช้ CooTrio อยู่ค่ะ เวลาคุยกับลูก แอปจะตอบกลับเป็นภาษาอังกฤษสั้น ๆ','คัดลอกลิงก์แล้ว','เลือกและคัดลอกลิงก์','แชร์ไม่ได้ จึงคัดลอกลิงก์ให้แล้ว'],
  hi: ['क्या आप CooTrio शेयर करेंगे?','परिवार या दोस्तों को भेजें','आजकल मैं CooTrio इस्तेमाल कर रहा/रही हूँ। बच्चे से बात करूँ तो ऐप अंग्रेज़ी में छोटा-सा जवाब देता है।','लिंक कॉपी हो गया।','लिंक चुनकर कॉपी करें।','शेयर नहीं हुआ। लिंक कॉपी हो गया।'],
  ar: ['هل يمكنك مشاركة CooTrio؟','أرسلها للعائلة أو الأصدقاء','أستخدم CooTrio هذه الأيام. عندما أتحدث مع طفلي، يرد التطبيق بجملة قصيرة بالإنجليزية.','تم نسخ الرابط.','حدد الرابط وانسخه.','تعذرت المشاركة، تم نسخ الرابط.'],
  vi: ['Bạn có thể chia sẻ CooTrio không?','Gửi cho gia đình hoặc bạn bè','Dạo này mình dùng CooTrio. Mình nói chuyện với bé, ứng dụng sẽ trả lời bằng một câu tiếng Anh ngắn.','Đã sao chép liên kết.','Chọn và sao chép liên kết.','Không chia sẻ được nên đã sao chép liên kết.'],
  tl: ['Puwede mo bang ibahagi ang CooTrio?','Ipadala sa pamilya o kaibigan','Ginagamit ko ang CooTrio nitong mga araw. Kapag kinakausap ko ang baby ko, sumasagot ang app sa maikling English.','Nakopya ang link.','Piliin at kopyahin ang link.','Hindi maibahagi kaya kinopya ang link.'],
};
const copyFor = language => COPY[language] || COPY.en;

export function makeSharePayload(language='ja', appUrl=PUBLIC_APP_URL) {
  return {title:language==='ja'?'みつことば':'CooTrio', text:copyFor(language)[2], url:appUrl};
}

// Image shares differ between receiving apps. Include the public URL in the
// image's text caption because some share targets discard the separate URL field.
export function makeIllustratedSharePayload(language, file, appUrl=PUBLIC_APP_URL) {
  const text=copyFor(language)[2]+'\n'+appUrl;
  return {title:language==='ja'?'みつことば':'CooTrio',text,files:[file]};
}

// Build an original *layout* from the already-approved logo; no generated faces,
// screenshots, user content or network requests are included in the share image.
function createShareCard(document,language,logoSource) {
  const ImageCtor=document.defaultView?.Image;
  const FileCtor=document.defaultView?.File;
  if(!ImageCtor||!FileCtor||!logoSource?.startsWith('data:image/png;base64,'))return Promise.resolve(null);
  return new Promise(resolve=>{
    const image=new ImageCtor();
    image.onerror=()=>resolve(null);
    image.onload=()=>{
      try{
        const canvas=document.createElement('canvas');
        canvas.width=1200;canvas.height=630;
        const ctx=canvas.getContext('2d');
        if(!ctx||typeof canvas.toBlob!=='function')return resolve(null);
        const bg=ctx.createLinearGradient(0,0,1200,630);
        bg.addColorStop(0,'#fffafc');bg.addColorStop(1,'#f5eeff');
        ctx.fillStyle=bg;ctx.fillRect(0,0,1200,630);
        ctx.fillStyle='rgba(228,197,237,0.25)';
        ctx.beginPath();ctx.arc(1105,40,260,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,197,212,0.22)';
        ctx.beginPath();ctx.arc(200,650,280,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#ffffff';
        ctx.beginPath();ctx.roundRect?.(45,45,1110,540,36);
        if(ctx.roundRect){ctx.fill();}else{ctx.fillRect(45,45,1110,540);}
        ctx.strokeStyle='#eadcf0';ctx.lineWidth=3;ctx.strokeRect(45,45,1110,540);
        const japanese=language==='ja';
        ctx.fillStyle='#61488d';
        ctx.font=(japanese?'bold 78px':'bold 83px')+' system-ui, sans-serif';
        ctx.fillText(japanese?'みつことば':'CooTrio',110,225);
        ctx.fillStyle='#4e4559';
        ctx.font=(japanese?'40px':'39px')+' system-ui, sans-serif';
        ctx.fillText(japanese?'赤ちゃんに話しかけると、':'Talk to your baby.',110,330);
        ctx.fillText(japanese?'AIが英語でひとこと。':'Hear a little English back.',110,395);
        ctx.fillStyle='#83758b';
        ctx.font='27px system-ui, sans-serif';
        ctx.fillText(japanese?'親子で使う、無料のWebアプリ':'Free web app for parents and babies',110,507);
        ctx.fillStyle='#f7ecfb';
        ctx.beginPath();ctx.arc(930,307,172,0,Math.PI*2);ctx.fill();
        ctx.drawImage(image,778,153,305,305);
        canvas.toBlob(blob=>{
          if(!blob||blob.size===0)return resolve(null);
          resolve(new FileCtor([blob],japanese?'mitsukotoba.png':'cootrio.png',{type:'image/png'}));
        },'image/png');
      }catch{resolve(null);}
    };
    image.src=logoSource;
  });
}

export function installSettingsSharing({
  document=globalThis.document,
  navigatorObject=globalThis.navigator,
  appUrl=PUBLIC_APP_URL
}={}) {
  // Present in the initial HTML; without JS the card still opens the public app.
  const wrap=document.getElementById('appSharingSettings');
  const shareButton=document.getElementById('shareAppButton');
  const label=document.getElementById('shareAppLabel');
  const hint=document.getElementById('shareAppHint');
  const artwork=document.getElementById('shareAppArtwork');
  const status=document.getElementById('shareAppStatus');
  const fallback=document.getElementById('shareAppFallback');
  if(!wrap||!shareButton||!label||!hint||!artwork||!status||!fallback)return {apply(){}};

  const homeLogo=document.querySelector('#homeScreen img.home-logo-img');
  const logoSource=homeLogo?.getAttribute('src');
  if(logoSource?.startsWith('data:image/png;base64,')){
    const thumb=document.createElement('img');
    thumb.className='settings-sharing-thumbnail';
    thumb.src=logoSource;
    thumb.alt='';
    artwork.replaceChildren(thumb);
  }

  let language='ja',readyImage=null,cardRevision=0;
  const strings=()=>copyFor(language);
  async function prepareArtwork(){
    // Pre-render before the user's click so navigator.share() can run synchronously
    // within the browser's transient user activation.
    const myRevision=++cardRevision;
    readyImage=null;
    if(typeof navigatorObject?.share!=='function'||typeof navigatorObject?.canShare!=='function')return;
    const file=await createShareCard(document,language,logoSource);
    if(myRevision===cardRevision){
      readyImage=file;
      wrap.dataset.shareImageReady=file?'yes':'no';
    }
  }
  function manualCopy(){
    fallback.hidden=false;fallback.focus();fallback.select();
    status.textContent=strings()[4];
  }
  async function copyLink(){
    try{
      if(!navigatorObject?.clipboard?.writeText)return manualCopy();
      await navigatorObject.clipboard.writeText(appUrl);
      status.textContent=strings()[3];
    }catch{manualCopy();}
  }
  shareButton.addEventListener('click',async event=>{
    event.preventDefault();
    status.textContent='';
    fallback.hidden=true;
    if(typeof navigatorObject?.share!=='function')return copyLink();
    const file=readyImage;
    let payload=makeSharePayload(language,appUrl);
    if(file){
      try{
        if(navigatorObject.canShare({files:[file]}))
          payload=makeIllustratedSharePayload(language,file,appUrl);
      }catch{}
    }
    try{await navigatorObject.share(payload);}
    catch(error){
      if(error?.name==='AbortError')return;
      // An image share may be rejected by a particular target; retry the link.
      if('files' in payload){
        try{await navigatorObject.share(makeSharePayload(language,appUrl));return;}
        catch(retryError){if(retryError?.name==='AbortError')return;}
      }
      await copyLink();
    }
  });
  return {
    apply(nextLanguage){
      language=COPY[nextLanguage]?nextLanguage:'en';
      wrap.setAttribute('aria-label',language==='ja'?'アプリを共有':'Share the app');
      label.textContent=strings()[0];
      hint.textContent=strings()[1];
      fallback.setAttribute('aria-label',language==='ja'?'アプリのURL':'App URL');
      if(status.textContent)status.textContent=fallback.hidden?strings()[3]:strings()[4];
      void prepareArtwork();
    }
  };
}
