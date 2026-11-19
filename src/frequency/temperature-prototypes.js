// Frozen prototype sentences for second-stage temperature meaning detection.
// Only used after the existing Topic model accepts 'temperature'.
// 3 examples per class and locale; no keyword matching or separate neural encoder.
// 2026-11-09 author-written candidate corpus (not real caregiver training data).
export const TEMPERATURE_PROTOTYPES={
  "ja": {
    "hot": [
      "暑いね",
      "ちょっと暑いかな",
      "触ると熱いね"
    ],
    "cold": [
      "寒いね",
      "ちょっと寒いかな",
      "触ると冷たいね"
    ]
  },
  "en": {
    "hot": [
      "It's hot.",
      "Feels pretty warm.",
      "That is hot to touch."
    ],
    "cold": [
      "It's cold.",
      "Feels a bit chilly.",
      "That feels cold to touch."
    ]
  },
  "de": {
    "hot": [
      "Es ist heiß.",
      "Es ist richtig warm.",
      "Das fühlt sich heiß an."
    ],
    "cold": [
      "Es ist kalt.",
      "Es ist ziemlich kühl.",
      "Das fühlt sich kalt an."
    ]
  },
  "es": {
    "hot": [
      "Hace calor.",
      "Qué calor hace.",
      "Eso está caliente."
    ],
    "cold": [
      "Hace frío.",
      "Qué fresco está.",
      "Eso está frío."
    ]
  },
  "fr": {
    "hot": [
      "Il fait chaud.",
      "Quelle chaleur !",
      "C'est chaud au toucher."
    ],
    "cold": [
      "Il fait froid.",
      "Il fait un peu frais.",
      "C'est froid au toucher."
    ]
  },
  "zh": {
    "hot": [
      "好热啊",
      "有点热呢",
      "摸起来好烫"
    ],
    "cold": [
      "好冷啊",
      "有点冷呢",
      "摸起来冰凉"
    ]
  },
  "ko": {
    "hot": [
      "덥네",
      "좀 더운 것 같아",
      "만지면 뜨겁네"
    ],
    "cold": [
      "춥네",
      "좀 추운 것 같아",
      "만지면 차갑네"
    ]
  },
  "hi": {
    "hot": [
      "बहुत गर्मी है।",
      "थोड़ी गर्मी लग रही है।",
      "यह छूने पर गरम है।"
    ],
    "cold": [
      "बहुत ठंड है।",
      "थोड़ी ठंड लग रही है।",
      "यह छूने पर ठंडा है।"
    ]
  },
  "ar": {
    "hot": [
      "الجو حار.",
      "الجو دافئ جدًا.",
      "هذا ساخن عند لمسه."
    ],
    "cold": [
      "الجو بارد.",
      "أشعر بالبرد قليلًا.",
      "هذا بارد عند لمسه."
    ]
  },
  "th": {
    "hot": [
      "ร้อนจังเลย",
      "อากาศค่อนข้างร้อน",
      "จับแล้วร้อนนะ"
    ],
    "cold": [
      "หนาวจังเลย",
      "อากาศเย็นนะ",
      "จับแล้วเย็นนะ"
    ]
  },
  "vi": {
    "hot": [
      "Nóng quá.",
      "Hơi nóng rồi.",
      "Sờ vào thấy nóng."
    ],
    "cold": [
      "Lạnh quá.",
      "Hơi lạnh rồi.",
      "Sờ vào thấy lạnh."
    ]
  },
  "tl": {
    "hot": [
      "Ang init!",
      "Medyo mainit.",
      "Mainit sa hawak."
    ],
    "cold": [
      "Ang lamig!",
      "Medyo malamig.",
      "Malamig sa hawak."
    ]
  }
};
