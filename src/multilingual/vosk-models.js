// Official Vosk Small 0.22 checkpoints; no retraining or weight conversion.
// Mirror transports are untrusted until the official ZIP SHA-256 matches.
const mirror='https://huggingface.co/localstack/vosk-models/resolve/a0cabdd6801bd201c783afcc096208cde59fa182/';
export const VOSK_MODELS=Object.freeze({
  fr:Object.freeze({name:'vosk-model-small-fr-0.22.tar.gz',bytes:42205829,
    sha256:'5b814a5a1b20211496ab70a87fc91c3bfe7d93d1809aa3d5568e05c33d2c940d',
    tarBytes:68505600,tarSha256:'16243cf8f9d8206fd83e01ce4163d15e982b4ab46c1c87508017a3a3b45583a4',
    zipBytes:42233323,zipSha256:'cabf6180e177eb9b3a9a9d43a437bd5e549f3a7d09525e5d69a3fed787be12ad'}),
  hi:Object.freeze({name:'vosk-model-small-hi-0.22.tar.gz',bytes:44454995,
    sha256:'609f81a9f9d77779a6b44a81356811fb48cdb273d9e56e9e7c69300a8e3306fc',
    tarBytes:82104320,tarSha256:'94f72425830ebe7d8bee42af5a16d999cd8db09a7ee9a9386f769f960e7641bf',
    zipBytes:44458845,zipSha256:'7c50a10866889f0ac21d912c20537a055a597ed09fc1d3e5bcd798f9f0017e48'})
});
export const voskZipUrl=locale=>mirror+VOSK_MODELS[locale].name.replace('.tar.gz','.zip');
export async function sha256(bytes){
  const hash=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
