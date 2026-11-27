export const A3_RECORDING = 'a3';
export const QWEN_RECORDING = 'qwen';
export const QWEN_VOICE_SETTING = 'emma_developer_qwen_voice_v1';

export function selectedEmmaRecording(storage) {
  try {
    return (storage || globalThis.localStorage)?.getItem(QWEN_VOICE_SETTING) === 'true'
      ? QWEN_RECORDING : A3_RECORDING;
  } catch {
    return A3_RECORDING;
  }
}

export function bindQwenVoiceSetting(toggle, developerPanel, onChange) {
  if (!toggle || !developerPanel) return;
  const sync = () => { toggle.checked = selectedEmmaRecording() === QWEN_RECORDING; };
  sync();
  toggle.addEventListener('change', async () => {
    if (developerPanel.classList.contains('hidden')) { sync(); return; }
    const previous = selectedEmmaRecording();
    try {
      if (toggle.checked) localStorage.setItem(QWEN_VOICE_SETTING, 'true');
      else localStorage.removeItem(QWEN_VOICE_SETTING);
    } catch {
      sync();
      return;
    }
    sync();
    if (previous === selectedEmmaRecording()) return;
    toggle.disabled = true;
    try { await onChange(); }
    finally { toggle.disabled = false; }
  });
}
