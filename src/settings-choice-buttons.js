// Settings-only buttons. Native selects remain the state/event source.
export function enhanceChoiceSelect(select) {
  if (!select) return () => {};
  if (select.__syncChoiceButtons) return select.__syncChoiceButtons;
  const doc=select.ownerDocument,compact=select.id==='settingsLanguage';
  const group=doc.createElement('div');
  group.className='settings-choice-buttons'+(compact?' settings-language-buttons':'');
  group.setAttribute('role','group');
  group.setAttribute('aria-label',select.getAttribute('aria-label')||
    select.closest('.choice-setting,.language-picker')?.querySelector('.choice-setting-title,.language-picker-title')?.textContent?.trim()||select.id);
  let toggle,options,summary,open=false;
  if(compact){
    summary=doc.createElement('p');
    summary.id='settingsLanguageCurrent';
    summary.className='settings-language-current settings-choice-button selected';
    summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');
    const value=doc.createElement('bdi');value.dataset.noI18n='';
    summary.append(value);
    toggle=doc.createElement('button');
    toggle.id='settingsLanguageExpand';toggle.type='button';
    toggle.className='settings-language-expand';
    toggle.setAttribute('aria-controls','settingsLanguageOptions');
    options=doc.createElement('div');options.id='settingsLanguageOptions';
    options.className='settings-language-options';
    group.append(summary,toggle,options);
    const setOpen=next=>{
      open=Boolean(next);options.hidden=!open;
      toggle.setAttribute('aria-expanded',String(open));
      toggle.textContent=open?'言語一覧を閉じる':'ほかの言語を選ぶ';
    };
    toggle.addEventListener('click',()=>setOpen(!open));
    select.__collapseChoiceButtons=()=>{
      if(!open)return;
      setOpen(false);toggle.focus();
    };
    setOpen(false);
  }
  const buttons=new Map();
  for(const option of [...select.options]){
    const button=doc.createElement('button');
    button.type='button';button.className='settings-choice-button';
    button.dataset.value=option.value;
    if(option.lang)button.lang=option.lang;
    if(option.dir)button.dir=option.dir;
    button.addEventListener('click',()=>{
      if(button.disabled||select.disabled||select.value===option.value)return;
      select.value=option.value;
      select.dispatchEvent(new doc.defaultView.Event('change',{bubbles:true}));
      sync();
    });
    if(compact&&option.value==='auto')group.insertBefore(button,toggle);
    else (compact?options:group).append(button);
    buttons.set(option.value,{button,option});
  }
  select.after(group);
  select.classList.add('choice-select-enhanced');
  select.setAttribute('aria-hidden','true');
  select.tabIndex=-1;
  function sync(){
    for(const [key,{button,option}] of buttons){
      const active=select.value===key;
      if(button.textContent!==option.textContent)button.textContent=option.textContent;
      button.disabled=Boolean(select.disabled||option.disabled);
      button.classList.toggle('selected',active);
      button.setAttribute('aria-pressed',String(active));
    }
    if(compact){
      summary.hidden=false;
      const autoButton=buttons.get('auto')?.button;
      if(autoButton)autoButton.hidden=select.value==='auto';
      const item=buttons.get(select.value),name=summary.querySelector('bdi');
      if(item&&name.textContent!==item.option.textContent){
        name.textContent=item.option.textContent;
        name.lang=item.option.lang||'';
        name.dir=item.option.dir||'auto';
      }
      toggle.disabled=Boolean(select.disabled);
    }
  }
  select.addEventListener('change',sync);
  if(typeof doc.defaultView?.MutationObserver==='function'){
    const observer=new doc.defaultView.MutationObserver(sync);
    observer.observe(select,{subtree:true,childList:true,characterData:true,
      attributes:true,attributeFilter:['disabled']});
  }
  select.__syncChoiceButtons=sync;
  sync();
  return sync;
}
export function syncChoiceButtons(select){select?.__syncChoiceButtons?.();}
