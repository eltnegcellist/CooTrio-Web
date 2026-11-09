const ids=['animals','counting','temperature','acknowledge','reaction_surprise','reaction_mishap','approach','attention','vocal_prompt','accept'];
const labels={
 ja:['どうぶつ','かず','あつい・つめたい','相づち','びっくり','あらら','おいで','注目','声を出そう','どうぞ'],
 en:['Animals','Counting','Temperature','Acknowledgment','Surprise','Oops','Come closer','Attention','Make a sound','Permission'],
 de:['Tiere','Zählen','Temperatur','Zustimmung','Überraschung','Hoppla','Komm näher','Aufmerksamkeit','Laute machen','Erlaubnis'],
 es:['Animales','Contar','Temperatura','Asentir','Sorpresa','Uy','Acércate','Atención','Hacer sonidos','Permiso'],
 fr:['Animaux','Compter','Température','Acquiescer','Surprise','Oups','Viens près','Attention','Faire un son','Permission'],
 zh:['动物','数数','冷热','回应','惊讶','哎呀','过来','注意','发声','允许'],
 ko:['동물','숫자 세기','온도','맞장구','놀람','어머','이리 와','주목','소리 내기','허락'],
 hi:['जानवर','गिनती','तापमान','सहमति','आश्चर्य','अरे','पास आओ','ध्यान','आवाज़ निकालो','अनुमति'],
 ar:['حيوانات','عدّ','حرارة','تجاوب','مفاجأة','عفواً','اقترب','انتباه','إصدار صوت','إذن'],
 th:['สัตว์','นับเลข','อุณหภูมิ','ตอบรับ','ประหลาดใจ','อุ๊ย','มาหา','สนใจ','ส่งเสียง','อนุญาต'],
 vi:['Động vật','Đếm số','Nóng lạnh','Đáp lời','Ngạc nhiên','Ối','Lại gần','Chú ý','Phát âm','Cho phép'],
 tl:['Hayop','Pagbilang','Temperatura','Pagtugon','Pagkagulat','Naku','Lumapit','Pansin','Gumawa ng tunog','Pahintulot']};
export function frequencyLabel(id,language='ja'){const i=ids.indexOf(id);return i<0?null:(labels[language]||labels.en)[i];}
export {labels as FREQUENCY_LABELS};
export const FREQUENCY_NOTE_IDS={
 '動物のお話だよ。':'animals','一緒に数えようね。':'counting','あついか、つめたいか確かめよう。':'temperature',
 'うん、お話を聞いているよ。':'acknowledge','わあ、びっくりしたね。':'reaction_surprise','あらら、大丈夫だよ。':'reaction_mishap',
 'こっちにおいで。':'approach','こっちを見てみよう。':'attention','一緒に声を出してみよう。':'vocal_prompt','どうぞ、使っていいよ。':'accept'};
