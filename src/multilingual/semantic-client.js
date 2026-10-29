import {SemanticLiteClient} from '../semantic/client.js';
export class LanguageSemanticClient {
  constructor({language,multilingual,specialist=null,onStatus}){
    this.language=language;this.multilingual=multilingual;this.specialist=specialist;this.japanese=new SemanticLiteClient({onStatus});
  }
  get active(){
    const locale=this.language();
    // Exactly the original model routes for Japanese and auto-multilingual.
    // Exactly one ASR mode retains Whisper (auto multilingual 'en').
    return locale==='ja'?this.japanese:
      locale==='en'?this.multilingual:this.specialist;
  }
  get ready(){return this.active.ready;}
  prepare(){return this.active.prepare();}
  predict(text,options){return this.active.predict(text,options);}
  cancel(){this.active.cancel();}
  cancelPending(){this.active.cancelPending();}
}
