import {translate} from './multilingual/translations.js';
export const BLACK_SCREEN_KEY='emma_black_screen_mode';
export function createBlackScreenMode({doc=document,storage=localStorage,clock=globalThis,onExit=()=>{},onReply=()=>{},canReply=()=>true,vibrate=()=>globalThis.navigator?.vibrate?.(35)}={}){
  let enabled=false, requested=false, active=false, ownsFullscreen=false, generation=0;
  let overlay,button,replyButton,renderControls=()=>{},hideTimer,holdTimer,pointer=null,previousFocus=null,blocked=[];
  const clearHide=()=>{clock.clearTimeout(hideTimer);hideTimer=null;};
  function cancelHold(){clock.clearTimeout(holdTimer);holdTimer=null;pointer=null;}
  function hide(){clearHide();cancelHold();for(const b of [button,replyButton])if(b){b.hidden=true;b.style.display='none';}}
  function reveal(){if(!active||pointer!==null)return;renderControls();clearHide();for(const b of [button,replyButton]){b.hidden=false;b.style.display='block';}hideTimer=clock.setTimeout(hide,3000);}
  function close(){
    generation++;requested=false;active=false;hide();
    if(overlay){overlay.hidden=true;overlay.style.display='none';}
    for(const el of blocked)el.inert=false;
    blocked=[];
    if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
    previousFocus=null;
    if(ownsFullscreen&&doc.fullscreenElement===doc.documentElement){
      try{Promise.resolve(doc.exitFullscreen()).catch(()=>{});}catch{}
    }
    ownsFullscreen=false;
  }
  function bind(input){
    if(!input)return;
    try{enabled=storage.getItem(BLACK_SCREEN_KEY)==='true';}catch{}
    input.checked=enabled;
    input.addEventListener('change',()=>{enabled=input.checked;try{storage.setItem(BLACK_SCREEN_KEY,String(enabled));}catch{}});
    overlay=doc.createElement('div');overlay.id='blackScreenOverlay';overlay.hidden=true;
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('data-no-i18n','');overlay.setAttribute('aria-label','画面オフモード');overlay.tabIndex=-1;
    overlay.style.cssText='display:none;position:fixed;inset:0;z-index:2147483647;background:#000;touch-action:none;overscroll-behavior:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;';
    function makeControl(side,label){
      const b=doc.createElement('button');b.type='button';b.hidden=true;
      b.style.cssText='position:absolute;top:16px;background:#222;color:#fff;border:1px solid #777;border-radius:12px;padding:8px;touch-action:none;box-sizing:border-box;';
      b.style.setProperty('left',side==='left'?'max(16px, env(safe-area-inset-left))':'auto','important');
      b.style.setProperty('right',side==='right'?'max(16px, env(safe-area-inset-right))':'auto','important');
      b.style.setProperty('top','max(16px, env(safe-area-inset-top))','important');
      b.style.setProperty('width','min(44%, 168px)','important');
      b.style.setProperty('min-width','0','important');
      b.style.setProperty('margin','0','important');
      for(const prop of ['user-select','-webkit-user-select','-webkit-touch-callout'])b.style.setProperty(prop,'none','important');
      const img=doc.createElement('img');img.alt='';img.draggable=false;
      img.style.cssText='display:block;width:100%;height:auto;pointer-events:none;user-select:none;-webkit-user-drag:none;-webkit-touch-callout:none;';
      b.append(img);
      function render(language){
        const title=translate(label,language),hold=translate('（長押し）',language);
        b.setAttribute('aria-label',title+' '+hold);
        const escapeXml=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const svg='<svg xmlns="http://www.w3.org/2000/svg" width="150" height="52" viewBox="0 0 150 52"><g fill="white" text-anchor="middle" font-family="sans-serif" direction="'+(language==='ar'?'rtl':'ltr')+'">'+[title,hold].map((line,i)=>{
          const size=Math.min(15, Math.floor(220/Math.max(1,Array.from(line).length)));
          return '<text x="75" y="'+(20+i*20)+'" font-size="'+size+'">'+escapeXml(line)+'</text>';
        }).join('')+'</g></svg>';
        img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
      }
      return {button:b,render};
    }
    const restore=makeControl('right','画面を戻す');
    const reply=makeControl('left','今すぐAIが返事する');
    button=restore.button;replyButton=reply.button;
    renderControls=()=>{
      const language=doc.documentElement.dataset.appLanguage||doc.documentElement.lang||'ja';
      overlay.setAttribute('aria-label',translate('画面オフモード',language));
      restore.render(language);reply.render(language);
    };
    renderControls();
    overlay.append(replyButton,button);doc.body.append(overlay);
    overlay.addEventListener('click',e=>{e.stopPropagation();if(e.target===overlay)reveal();});
    overlay.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();},{capture:true});
    overlay.addEventListener('selectstart',e=>e.preventDefault());
    overlay.addEventListener('dragstart',e=>e.preventDefault());
    overlay.addEventListener('touchstart',e=>{if(e.target===button||e.target===replyButton)e.preventDefault();},{passive:false});
    overlay.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();if(!button.hidden)(doc.activeElement===replyButton?button:replyButton).focus();}else if(e.target===overlay&&(e.key==='Enter'||e.key===' ')){e.preventDefault();reveal();button.focus();}});
    function begin(id,b){
      if(!active||b.hidden||pointer!==null)return;
      clearHide();pointer=id;
      holdTimer=clock.setTimeout(()=>{
        if(!active||pointer!==id)return;
        hide();
        if(b===replyButton&&!canReply())return;
        try{vibrate();}catch{}
        if(b===button){close();void onExit();}
        else void onReply();
      },1500);
    }
    function cancel(){if(pointer===null)return;cancelHold();reveal();}
    for(const b of [button,replyButton]){
      b.addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary)return;e.preventDefault();begin(e.pointerId,b);try{b.setPointerCapture(e.pointerId);}catch{}});
      b.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;const r=b.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)cancel();});
      for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,e=>{if(pointer===e.pointerId)cancel();});
      b.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat)begin('keyboard',b);}});
      b.addEventListener('keyup',e=>{if(pointer==='keyboard')cancel();});
      b.addEventListener('blur',cancel);
    }
    doc.addEventListener('visibilitychange',()=>{if(doc.hidden&&active)hide();});
    doc.addEventListener('fullscreenchange',()=>{if(!doc.fullscreenElement)ownsFullscreen=false;});
  }
  function prepare({fullscreen=false}={}){
    requested=enabled&&!!overlay;
    const token=++generation;
    if(!requested||!fullscreen||doc.fullscreenElement||!doc.documentElement.requestFullscreen)return;
    try{Promise.resolve(doc.documentElement.requestFullscreen()).then(()=>{
      if(token===generation&&requested){ownsFullscreen=doc.fullscreenElement===doc.documentElement;}
      else if(doc.fullscreenElement===doc.documentElement&&!requested){try{Promise.resolve(doc.exitFullscreen()).catch(()=>{});}catch{}}
    }).catch(()=>{});}catch{}
  }
  function show(){
    if(!requested||active)return;
    active=true;renderControls();previousFocus=doc.activeElement;
    overlay.hidden=false;overlay.style.display='block';hide();
    blocked=[...doc.body.children].filter(el=>el!==overlay&&!el.inert);
    for(const el of blocked)el.inert=true;
    overlay.focus({preventScroll:true});
  }
  return {bind,prepare,show,close,get requested(){return requested;},get active(){return active;}};
}
