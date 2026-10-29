import {LANGUAGES,LANGUAGE_KEY,LANGUAGE_MODE_KEY,resolveLanguage,browserLanguages} from './core.js';
import {GUIDE_EXAMPLES} from './topic-guide-examples.js';

// The Japanese examples are extracted from the generated contract guide.
// Only the labels and explanatory text are localized; this does not change
// ASR, Topic or Interaction routing.
export const GUIDE_LABELS={"en":{"topics":"Bath|Milk / breastfeeding|Sleep|Waking up|Diapers|Changing clothes|Cuddles|Hands|Feet|Smiling|Crying|Baby sounds|Burping / tummy|Play|Going outside|Rain|Sunshine|Food / weaning|Picture books|Music / singing|Drinking","interactions":"Affection|Praise|Achievement|Recognizing effort|Encouragement|Invitation|Starting|Finishing|Checking completion|Caring|Question|Reassurance|Repeating|Pausing","copy":["Topics and ways of speaking","Mitsukotoba identifies what you're talking about (Topic) and how you're speaking to your baby (Interaction) separately, then chooses a short English reply.","How it works","Speech recognition converts your speech to text. Semantic models infer both axes (Ruri for Japanese and E5 for supported other languages). Replies come from prepared English phrases rather than word-for-word translations.","21 baby-care topics","These are translated examples from an older Japanese test set, not guaranteed classification results.","14 ways of speaking","Praising, inviting, asking, and reassuring can lead to different replies even when the topic is the same.","Topic × Interaction examples","Examples of registered combinations and the beginning of their English replies. Exact responses may vary.","When classification is uncertain","Recognition errors, very short speech, multiple topics, or an unavailable semantic model can affect classification. Check the recognized text and try a short, specific sentence.","Back to Mitsukotoba","Back to top","Example phrase","Topic","Way of speaking","English reply"]},"de":{"topics":"Baden|Milch / Stillen|Schlafen|Aufwachen|Windeln|Umziehen|Kuscheln|Hände|Füße|Lächeln|Weinen|Babystimmen|Bäuerchen / Bauch|Spielen|Draußen sein|Regen|Sonnenschein|Essen / Beikost|Bilderbücher|Musik / Singen|Trinken","interactions":"Zuneigung|Lob|Erfolg|Anstrengung anerkennen|Ermutigung|Einladung|Beginn|Ende|Ende nachfragen|Fürsorge|Frage|Beruhigen|Wiederholen|Pause","copy":["Themen und Arten des Sprechens","Mitsukotoba erkennt getrennt, worüber Sie sprechen (Thema), und wie Sie Ihr Baby ansprechen (Interaktion). Daraus wählt es eine kurze englische Antwort.","So funktioniert es","Spracherkennung wandelt Sprache in Text um. Semantische Modelle ordnen Thema und Interaktion zu (Ruri für Japanisch, E5 für andere unterstützte Sprachen). Englische Antworten stammen aus vorbereiteten Formulierungen und sind keine wörtlichen Übersetzungen.","21 Themen rund ums Baby","Diese übersetzten Beispiele stammen aus früheren japanischen Tests; eine bestimmte Zuordnung ist nicht garantiert.","14 Arten der Ansprache","Lob, Einladungen, Fragen und beruhigende Worte können auch beim selben Thema andere Antworten auslösen.","Thema × Interaktion: Beispiele","Beispiele gespeicherter Kombinationen und des Anfangs englischer Antworten. Die genaue Antwort kann variieren.","Wenn die Einordnung unsicher ist","Erkennungsfehler, kurze Aussagen, mehrere Themen oder ein nicht verfügbares Modell können die Einordnung beeinträchtigen. Prüfen Sie den erkannten Text.","Zurück zu Mitsukotoba","Nach oben","Beispielsatz","Thema","Ansprache","Englische Antwort"]},"fr":{"topics":"Bain|Lait / allaitement|Sommeil|Réveil|Couches|Habillage|Câlins|Mains|Pieds|Sourires|Pleurs|Babillage|Rot / ventre|Jeux|Sorties|Pluie|Soleil|Repas / diversification|Livres illustrés|Musique / chansons|Boire","interactions":"Affection|Félicitations|Réussite|Valoriser l'effort|Encouragement|Invitation|Commencer|Terminer|Vérifier la fin|Attention|Question|Rassurer|Répéter|Pause","copy":["Sujets et façons de parler","Mitsukotoba identifie séparément le sujet de votre phrase et la façon dont vous parlez à votre bébé, puis choisit une courte réponse en anglais.","Fonctionnement","La reconnaissance vocale transforme la parole en texte. Des modèles sémantiques estiment les deux catégories (Ruri pour le japonais, E5 pour les autres langues prises en charge). Les réponses proviennent de phrases anglaises préparées, sans traduction littérale.","21 sujets du quotidien","Ces exemples traduits viennent d'anciens tests japonais et ne garantissent aucun résultat de classification.","14 façons de parler","Féliciter, inviter, questionner ou rassurer peut donner des réponses différentes sur un même sujet.","Exemples sujet × interaction","Combinaisons existantes et débuts de réponses anglaises. La formulation peut varier.","En cas d'incertitude","Des erreurs de transcription, des phrases courtes, plusieurs sujets ou un modèle indisponible peuvent fausser le classement. Vérifiez le texte reconnu.","Retour à Mitsukotoba","Haut de page","Exemple de phrase","Sujet","Façon de parler","Réponse anglaise"]},"ko":{"topics":"목욕|우유 / 수유|잠|일어나기|기저귀|옷 갈아입기|안아 주기|손|발|미소|울음|옹알이|트림 / 배|놀이|산책 / 외출|비|햇살|식사 / 이유식|그림책|음악 / 노래|마시기","interactions":"애정|칭찬|성취|노력 인정|격려|제안|시작|끝내기|완료 확인|배려|질문|안심시키기|다시 하기|잠시 쉬기","copy":["주제와 말하는 방식","미츠코토바는 무엇에 대해 말하는지(주제)와 아기에게 어떻게 말하는지(상호작용)를 따로 판단해 짧은 영어 답변을 고릅니다.","판단 방법","음성 인식으로 말을 문자로 바꾼 뒤 의미 모델로 두 항목을 추정합니다. 일본어에는 Ruri, 다른 지원 언어에는 E5를 사용합니다. 답변은 직역이 아니라 미리 준비한 영어 표현에서 선택합니다.","육아 주제 21가지","아래 예문은 이전 일본어 테스트의 예시를 번역한 것으로, 실제 분류 결과를 보장하지 않습니다.","말하는 방식 14가지","같은 주제라도 칭찬, 제안, 질문, 안심시키기에 따라 답변이 달라질 수 있어요.","주제 × 말하는 방식 예시","준비된 조합과 영어 답변의 첫 부분을 보여 줍니다. 실제 표현은 달라질 수 있습니다.","판단이 어려운 경우","음성 인식 오류, 짧은 발화, 여러 주제, 모델 사용 불가로 분류가 달라질 수 있습니다. 인식된 문장을 확인해 주세요.","미츠코토바로 돌아가기","맨 위로","예문","주제","말하는 방식","영어 답변"]},"th":{"topics":"อาบน้ำ|นม / ให้นม|นอน|ตื่นนอน|ผ้าอ้อม|เปลี่ยนเสื้อผ้า|กอด|มือ|เท้า|ยิ้ม|ร้องไห้|ส่งเสียงอ้อแอ้|เรอ / ท้อง|เล่น|ออกไปข้างนอก|ฝน|แสงแดด|อาหาร / อาหารเสริม|หนังสือภาพ|ดนตรี / ร้องเพลง|ดื่ม","interactions":"ความรัก|คำชม|ความสำเร็จ|เห็นคุณค่าความพยายาม|ให้กำลังใจ|ชวนทำ|เริ่มต้น|จบ|ถามว่าเสร็จหรือยัง|เอาใจใส่|คำถาม|ปลอบใจ|ทำอีกครั้ง|พัก","copy":["หัวข้อและวิธีพูดกับลูก","มิตสึโคโตบะประเมินหัวข้อที่พูดและวิธีพูดกับลูกแยกกัน แล้วเลือกคำตอบภาษาอังกฤษสั้น ๆ","วิธีทำงาน","ระบบเปลี่ยนเสียงพูดเป็นข้อความ จากนั้นใช้โมเดลความหมายแยกหัวข้อและรูปแบบการพูด (Ruri สำหรับภาษาญี่ปุ่น และ E5 สำหรับภาษาอื่นที่รองรับ) คำตอบเลือกจากประโยคอังกฤษที่เตรียมไว้ ไม่ใช่การแปลตรงตัว","หัวข้อเลี้ยงลูก 21 หัวข้อ","ตัวอย่างที่แปลจากชุดทดสอบภาษาญี่ปุ่นเดิมนี้ไม่รับประกันผลการจัดหมวดหมู่","วิธีพูด 14 แบบ","การชม ชวน ถาม หรือปลอบใจในหัวข้อเดียวกันอาจได้คำตอบต่างกัน","ตัวอย่างหัวข้อ × วิธีพูด","แสดงตัวอย่างคำตอบอังกฤษที่เตรียมไว้ คำตอบจริงอาจต่างกัน","เมื่อระบบไม่แน่ใจ","ความผิดพลาดของการรู้จำเสียง ข้อความสั้น หลายหัวข้อ หรือโมเดลที่ใช้ไม่ได้ อาจทำให้จัดหมวดหมู่คลาดเคลื่อน โปรดตรวจข้อความที่รู้จำ","กลับไปมิตสึโคโตบะ","กลับขึ้นบน","ตัวอย่างประโยค","หัวข้อ","วิธีพูด","คำตอบอังกฤษ"]},"es":{"topics":"Baño|Leche / lactancia|Sueño|Despertar|Pañales|Cambiarse de ropa|Abrazos|Manos|Pies|Sonrisas|Llanto|Balbuceos|Eructos / barriga|Jugar|Salir de paseo|Lluvia|Sol|Comida / alimentación complementaria|Libros ilustrados|Música / canciones|Beber","interactions":"Cariño|Elogio|Logro|Reconocer el esfuerzo|Ánimo|Invitación|Inicio|Finalizar|Preguntar si terminó|Cuidado|Pregunta|Tranquilizar|Repetir|Pausa","copy":["Temas y formas de hablar","Mitsukotoba identifica por separado de qué hablas (tema) y cómo te diriges al bebé (interacción), y elige una respuesta breve en inglés.","Cómo funciona","El reconocimiento de voz convierte el habla en texto. Los modelos semánticos detectan ambas categorías (Ruri para japonés y E5 para otros idiomas compatibles). Las respuestas se eligen entre frases inglesas preparadas; no son traducciones literales.","21 temas de crianza","Estos ejemplos traducidos proceden de pruebas japonesas anteriores y no garantizan un resultado de clasificación.","14 formas de hablar","Elogiar, invitar, preguntar o tranquilizar puede producir respuestas distintas sobre el mismo tema.","Ejemplos de tema × interacción","Combinaciones disponibles y comienzos de respuestas inglesas; la respuesta puede variar.","Cuando la clasificación es incierta","Los errores de reconocimiento, frases cortas, varios temas o un modelo no disponible pueden afectar la clasificación. Comprueba el texto reconocido.","Volver a Mitsukotoba","Ir arriba","Frase de ejemplo","Tema","Forma de hablar","Respuesta inglesa"]},"zh":{"topics":"洗澡|喝奶 / 哺乳|睡觉|醒来|尿布|换衣服|拥抱|小手|小脚|微笑|哭泣|咿呀学语|打嗝 / 肚子|玩耍|外出散步|下雨|阳光|吃饭 / 辅食|绘本|音乐 / 唱歌|喝水","interactions":"亲昵|表扬|取得进步|认可努力|鼓励|邀请|开始|结束|确认完成|关怀|询问|安慰|再来一次|暂停","copy":["话题与交流方式","应用分别判断你在说什么（话题）以及如何对宝宝说话（互动方式），再选出简短的英文回应。","判定方式","语音识别先将说话转成文字，语义模型再推断话题与互动方式（日语使用 Ruri，其他支持的语言使用 E5）。回应来自预先准备的英语短句，而不是逐字翻译。","21种育儿话题","以下是根据旧版日语测试例句翻译的参考表达，不保证实际分类结果。","14种交流方式","同一话题下，表扬、邀请、提问或安慰可能得到不同回应。","话题 × 互动示例","展示已收录的组合及英文回应开头，实际回应可能变化。","无法确定分类时","识别错误、句子过短、话题混合或语义模型不可用都可能影响结果。请核对识别出的文字。","返回应用","返回顶部","示例说法","话题","交流方式","英文回应"]},"hi":{"topics":"नहलाना|दूध / स्तनपान|सोना|जागना|डायपर|कपड़े बदलना|गले लगाना|हाथ|पैर|मुस्कुराना|रोना|बच्चे की आवाज़ें|डकार / पेट|खेलना|बाहर घूमना|बारिश|धूप|भोजन / पूरक आहार|चित्र पुस्तकें|संगीत / गाना|पीना","interactions":"स्नेह|प्रशंसा|उपलब्धि|मेहनत की सराहना|प्रोत्साहन|निमंत्रण|शुरू करना|समाप्त करना|पूरा हुआ क्या पूछना|देखभाल|सवाल|आश्वासन|दोहराना|विराम","copy":["विषय और बातचीत का तरीका","मित्सुकोतोबा अलग-अलग पहचानता है कि आप किस विषय पर और बच्चे से किस तरह बात कर रहे हैं, फिर छोटा अंग्रेज़ी जवाब चुनता है।","यह कैसे काम करता है","वाणी पहचान बोले गए शब्दों को टेक्स्ट में बदलती है। अर्थ मॉडल विषय और बातचीत का तरीका पहचानता है (जापानी के लिए Ruri, अन्य समर्थित भाषाओं के लिए E5)। जवाब पहले से तैयार अंग्रेज़ी वाक्यों से चुना जाता है, शब्दशः अनुवाद नहीं।","शिशु देखभाल के 21 विषय","ये पुराने जापानी परीक्षणों के अनूदित उदाहरण हैं; वर्गीकरण के परिणाम की गारंटी नहीं है।","बातचीत के 14 तरीके","एक ही विषय पर प्रशंसा, आमंत्रण, सवाल या आश्वासन से जवाब बदल सकता है।","विषय × बातचीत के उदाहरण","उपलब्ध संयोजन और अंग्रेज़ी जवाबों की शुरुआत। वास्तविक जवाब अलग हो सकता है।","जब वर्गीकरण स्पष्ट न हो","वाणी पहचान में त्रुटि, छोटा वाक्य, कई विषय या अनुपलब्ध मॉडल परिणाम को प्रभावित कर सकते हैं। पहचाना गया टेक्स्ट जाँचें।","ऐप पर लौटें","ऊपर जाएँ","उदाहरण वाक्य","विषय","बातचीत का तरीका","अंग्रेज़ी जवाब"]},"ar":{"topics":"الاستحمام|الحليب / الرضاعة|النوم|الاستيقاظ|الحفاضات|تغيير الملابس|العناق|اليدان|القدمان|الابتسام|البكاء|مناغاة الطفل|التجشؤ / البطن|اللعب|الخروج|المطر|الشمس|الطعام / التغذية التكميلية|كتب الصور|الموسيقى / الغناء|الشرب","interactions":"المودة|المدح|الإنجاز|تقدير الجهد|التشجيع|الدعوة|البدء|الإنهاء|التحقق من الانتهاء|الرعاية|السؤال|الطمأنة|التكرار|الاستراحة","copy":["المواضيع وطرق التحدث","يحدّد التطبيق موضوع حديثك وطريقة مخاطبتك لطفلك بصورة منفصلة، ثم يختار ردًا إنجليزيًا قصيرًا.","كيف يعمل","تحوّل تقنية التعرف على الكلام الصوت إلى نص، ثم يستنتج النموذج الدلالي الموضوع وطريقة التفاعل (Ruri لليابانية وE5 للغات الأخرى المدعومة). الردود عبارات إنجليزية مُعدّة وليست ترجمة حرفية.","21 موضوعًا لرعاية الطفل","هذه أمثلة مترجمة من اختبارات يابانية سابقة، ولا تضمن نتائج التصنيف.","14 طريقة للتحدث","يمكن أن يؤدي المدح أو الدعوة أو السؤال أو الطمأنة إلى رد مختلف للموضوع نفسه.","أمثلة الموضوع × التفاعل","تركيبات مسجلة وبدايات ردود إنجليزية. قد يختلف الرد الفعلي.","عندما يكون التصنيف غير مؤكد","قد تؤثر أخطاء التعرف على الصوت أو العبارات القصيرة أو تعدد المواضيع أو تعذر تشغيل النموذج في التصنيف. راجع النص المتعرف عليه.","العودة إلى التطبيق","العودة إلى الأعلى","عبارة مثال","الموضوع","طريقة التحدث","الرد الإنجليزي"]},"vi":{"topics":"Tắm|Sữa / cho bú|Ngủ|Thức dậy|Tã|Thay quần áo|Ôm ấp|Bàn tay|Bàn chân|Mỉm cười|Khóc|Bập bẹ|Ợ hơi / bụng|Chơi|Ra ngoài|Mưa|Nắng|Ăn / ăn dặm|Sách tranh|Nhạc / hát|Uống","interactions":"Yêu thương|Khen ngợi|Thành công|Ghi nhận nỗ lực|Động viên|Rủ rê|Bắt đầu|Kết thúc|Hỏi đã xong chưa|Quan tâm|Hỏi|Trấn an|Lặp lại|Tạm nghỉ","copy":["Chủ đề và cách trò chuyện","Mitsukotoba nhận diện riêng nội dung bạn nói (Chủ đề) và cách bạn nói với bé (Tương tác), rồi chọn một câu trả lời tiếng Anh ngắn.","Cách hoạt động","Nhận dạng giọng nói chuyển lời nói thành văn bản. Mô hình ngữ nghĩa suy luận cả hai khía cạnh (Ruri cho tiếng Nhật và E5 cho các ngôn ngữ khác được hỗ trợ). Câu trả lời lấy từ các câu tiếng Anh có sẵn, không phải bản dịch từng chữ.","21 chủ đề chăm bé","Các ví dụ này được dịch từ bộ kiểm thử tiếng Nhật cũ và không bảo đảm kết quả phân loại.","14 cách trò chuyện","Khen, rủ, hỏi hoặc trấn an có thể tạo ra các câu trả lời khác nhau với cùng một chủ đề.","Ví dụ chủ đề × tương tác","Các kết hợp đã có và phần mở đầu câu trả lời tiếng Anh. Câu thực tế có thể thay đổi.","Khi khó phân loại","Lỗi nhận dạng giọng nói, câu quá ngắn, nhiều chủ đề hoặc mô hình không hoạt động có thể ảnh hưởng kết quả. Hãy kiểm tra văn bản nhận dạng.","Quay lại Mitsukotoba","Lên đầu trang","Câu ví dụ","Chủ đề","Cách trò chuyện","Câu trả lời tiếng Anh"]},"tl":{"topics":"Paliligo|Gatas / pagpapasuso|Pagtulog|Paggising|Lampin|Pagpapalit ng damit|Yakap|Kamay|Paa|Ngiti|Pag-iyak|Daldal ng sanggol|Dighay / tiyan|Paglalaro|Paglabas|Ulan|Araw|Pagkain / solids|Aklat na may larawan|Musika / kanta|Pag-inom","interactions":"Pagmamahal|Papuri|Tagumpay|Pagkilala sa pagsisikap|Pagpapalakas ng loob|Pag-anyaya|Pagsisimula|Pagtatapos|Pagtanong kung tapos na|Pag-aalaga|Pagtatanong|Pagpapakalma|Pag-uulit|Pagpapahinga","copy":["Mga paksa at paraan ng pakikipag-usap","Hiwalay na kinikilala ng Mitsukotoba kung ano ang paksa at kung paano mo kinakausap ang sanggol, bago pumili ng maikling sagot sa Ingles.","Paano ito gumagana","Ginagawang teksto ng speech recognition ang iyong sinabi. Tinutukoy ng semantic model ang paksa at paraan ng pakikipag-usap (Ruri sa Japanese at E5 sa ibang suportadong wika). Pinipili ang sagot mula sa mga inihandang pariralang Ingles, hindi direktang salin.","21 paksa tungkol sa sanggol","Ang mga halimbawang ito ay salin mula sa lumang Japanese test at hindi garantiya ng resulta ng pag-uuri.","14 paraan ng pakikipag-usap","Ang papuri, pag-anyaya, pagtatanong at pagpapakalma ay maaaring magbigay ng magkaibang sagot kahit pareho ang paksa.","Mga halimbawa ng paksa × interaksiyon","Mga umiiral na kumbinasyon at simula ng mga sagot sa Ingles. Maaaring mag-iba ang aktuwal na sagot.","Kapag hindi tiyak ang klasipikasyon","Maaaring maapektuhan ng maling pagkilala sa boses, maiikling pangungusap, maraming paksa o hindi magamit na modelo ang resulta. Tingnan ang tekstong nakilala.","Bumalik sa Mitsukotoba","Bumalik sa itaas","Halimbawang pangungusap","Paksa","Paraan ng pakikipag-usap","Sagot sa Ingles"]}};

export function resolveTopicGuideLanguage(doc,preferred=null){
  const win=doc.defaultView;
  const fromUrl=preferred??new URLSearchParams(win?.location?.search||'').get('lang');
  if(LANGUAGES.includes(fromUrl))return fromUrl;
  try{
    if(win?.localStorage?.getItem(LANGUAGE_MODE_KEY)==='manual'){
      const saved=win.localStorage.getItem(LANGUAGE_KEY);
      if(LANGUAGES.includes(saved))return saved;
    }
  }catch{}
  return resolveLanguage({languages:browserLanguages(win?.navigator,win?.Intl)}).language;
}

export function renderTopicGuide(doc,{language}={}){
  const locale=resolveTopicGuideLanguage(doc,language);
  if(locale==='ja')return 'ja'; // Keep the complete original Japanese guide.
  const words=GUIDE_LABELS[locale]||GUIDE_LABELS.en;
  const main=doc.querySelector('main.topic-guide');
  if(!main)return null;
  const topics=[...main.querySelectorAll('#topics tbody tr')];
  const interactions=[...main.querySelectorAll('#interactions tbody tr')];
  const pairs=[...main.querySelectorAll('#pairs tbody tr')];
  const names=words.topics.split('|'),methods=words.interactions.split('|');
  const samples=GUIDE_EXAMPLES[locale];
  const topicExamples=samples?.topics.split('|')||[];
  const pairExamples=samples?.pairs.split('|')||[];
  if(topics.length!==21||interactions.length!==14||pairs.length!==8||names.length!==21||methods.length!==14||topicExamples.length!==21||pairExamples.length!==8){
    console.error('Topic guide contract and translation counts do not match');
    return null;
  }
  const jaTopics=topics.map(row=>row.querySelector('th')?.textContent.trim());
  const jaMethods=interactions.map(row=>row.querySelector('th')?.textContent.trim());
  const [title,lead,howHeading,howText,topicsHeading,topicsHint,methodsHeading,methodsHint,
    pairsHeading,pairsHint,limitsHeading,limitsText,back,top,japaneseExample,topicTitle,methodTitle,englishReply]=words.copy;

  const make=(tag,text='',cls='')=>{
    const node=doc.createElement(tag);
    if(text)node.textContent=text;
    if(cls)node.className=cls;
    return node;
  };
  const section=(id,heading)=>{
    const s=make('section','','card');s.id=id;s.append(make('h2',heading));return s;
  };
  const table=(headers)=>{
    const t=make('table','','interaction-table'),thead=make('thead'),tr=make('tr');
    for(const name of headers){const th=make('th',name);th.scope='col';tr.append(th);}
    thead.append(tr);t.append(thead,make('tbody'));return t;
  };
  const originalLabel={"en":"Japanese original","de":"Japanisches Original","fr":"Original japonais","es":"Original en japonés","zh":"日语原文","ko":"일본어 원문","th":"ต้นฉบับภาษาญี่ปุ่น","hi":"मूल जापानी","ar":"النص الياباني الأصلي","vi":"Bản gốc tiếng Nhật","tl":"Orihinal na Japanese"}[locale]||'Japanese original';
  const appendOriginal=(cell,sourceText)=>{
    if(!sourceText)return;
    const details=make('details','','guide-original');
    details.append(make('summary',originalLabel));
    const source=make('span',sourceText,'utterance');source.lang='ja';source.dir='ltr';
    details.append(source);cell.append(details);
  };
  const header=make('header');
  const backLink=make('a','← '+back);backLink.href='./?lang='+encodeURIComponent(locale);
  header.append(backLink,make('h1',title),make('p',lead));
  const nav=make('nav','','guide-nav');
  nav.setAttribute('aria-label',title);
  for(const [id,label] of [['logic',howHeading],['topics',topicsHeading],['interactions',methodsHeading],
    ['pairs',pairsHeading],['limits',limitsHeading]]){
    const a=make('a',label);a.href='#'+id;nav.append(a);
  }
  header.append(nav);
  const logic=section('logic',howHeading);logic.append(make('p',howText));
  const topicSection=section('topics',topicsHeading);
  topicSection.classList.add('table-card');
  topicSection.append(make('p',topicsHint));
  const topicTable=table([topicTitle,japaneseExample]);
  const topicBody=topicTable.tBodies[0];
  for(let i=0;i<21;i++){
    const tr=make('tr'),th=make('th',names[i]);th.scope='row';
    const td=make('td');
    const sample=topics[i].querySelector('.utterance');
    if(sample){
      const utterance=make('span',topicExamples[i],'utterance');
      utterance.lang=locale;td.append(utterance);
      appendOriginal(td,sample.textContent.trim());
    }
    tr.append(th,td);topicBody.append(tr);
  }
  topicSection.append(topicTable);
  const methodSection=section('interactions',methodsHeading);
  methodSection.classList.add('table-card');
  methodSection.append(make('p',methodsHint));
  const methodTable=table([methodTitle,'ID']);
  const methodBody=methodTable.tBodies[0];
  for(let i=0;i<14;i++){
    const tr=make('tr'),th=make('th',methods[i]);th.scope='row';
    const id=make('td');id.append(make('code',interactions[i].querySelector('code')?.textContent.trim()||''));
    tr.append(th,id);methodBody.append(tr);
  }
  methodSection.append(methodTable);
  const pairSection=section('pairs',pairsHeading);
  pairSection.classList.add('table-card');
  pairSection.append(make('p',pairsHint));
  const pairTable=table([topicTitle+' × '+methodTitle,japaneseExample,englishReply]);
  for(const [pairIndex,source] of pairs.entries()){
    const title=source.querySelector('th')?.textContent.trim()||'';
    const split=title.split(' × ');
    const ti=jaTopics.indexOf(split[0]),mi=jaMethods.indexOf(split[1]);
    if(ti<0||mi<0)continue;
    const tr=make('tr'),th=make('th',names[ti]+' × '+methods[mi]);th.scope='row';
    const parent=make('td');
    const sentence=make('span',pairExamples[pairIndex],'utterance');sentence.lang=locale;
    parent.append(sentence);
    appendOriginal(parent,source.querySelector('td:not([lang])')?.textContent.trim()||'');
    const english=make('td',source.querySelector('td[lang="en"]')?.textContent.trim()||'');
    english.lang='en';english.dir='ltr';tr.append(th,parent,english);pairTable.tBodies[0].append(tr);
  }
  pairSection.append(pairTable);
  const limits=section('limits',limitsHeading);limits.append(make('p',limitsText));
  const footer=make('footer');
  const topLink=make('a',top);topLink.href='#';footer.append(topLink);
  main.replaceChildren(header,logic,topicSection,methodSection,pairSection,limits,footer);
  doc.documentElement.lang=locale;
  doc.documentElement.dir=locale==='ar'?'rtl':'ltr';
  doc.title=title+' | Mitsukotoba';
  return locale;
}
if(typeof document!=='undefined'&&document.querySelector('main.topic-guide')){
  renderTopicGuide(document);
}
