import {convertOfficialVoskZip} from './vosk-archive.js';
self.onmessage=async({data})=>{
  try{self.postMessage({archive:await convertOfficialVoskZip(data.locale,data.zip)});}
  catch(error){self.postMessage({error:String(error?.message||error)});}
};
