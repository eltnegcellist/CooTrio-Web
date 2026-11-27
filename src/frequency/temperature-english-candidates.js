// All 26 proposed full English utterances. They are not selected by the
// application before the exact Qwen recordings are approved and SHA pinned.
// Source: shared/temperature-split-candidates.json
export const TEMPERATURE_DIRECTION_TEXTS={
  "hot": {
    "topics": [
      "Feeling warm, baby? Whew, it's warm! Let's get comfy.",
      "It's a hot day! Whew, it's warm! Let's stay comfy.",
      "Too warm, little one? Whew, that's warm! Let's cool down.",
      "That feels hot! Whew, it's warm! Let's cool down."
    ],
    "combined": {
      "care": [
        "Feeling too warm? Let's cool down. I'll help you.",
        "It's warm in here! Let's get comfy. Nice and easy.",
        "That's a little hot! Let's cool down. I'm right here."
      ],
      "inquiry": [
        "Too warm, baby? Feeling hot? Let's cool down.",
        "Is it hot today? Feeling warm? Whew, it's hot!",
        "Does that feel hot? Is it warm? Whew, that's hot!"
      ],
      "reassurance": [
        "It's warm, sweetheart. I'm here with you. Let's cool down.",
        "Too hot? I'm right here. We'll cool down together.",
        "Feeling a bit warm? It's okay. Let's get comfy."
      ]
    }
  },
  "cold": {
    "topics": [
      "Feeling chilly, baby? Brr, it's cold! Let's get cozy.",
      "It's a cold day! Brr, brr! Let's stay cozy.",
      "Feeling cold, little one? Brr, it's chilly! Let's get cozy.",
      "That feels cold! Brr, brr! So chilly!"
    ],
    "combined": {
      "care": [
        "Feeling a little chilly? Let's get cozy. I'll help you.",
        "It's chilly in here! Let's get cozy. Nice and easy.",
        "That's a little cold! Let's get cozy. I'm right here."
      ],
      "inquiry": [
        "Feeling chilly, baby? Are you cold? Let's get cozy.",
        "Is it cold today? Feeling chilly? Brr, brr!",
        "Does that feel cold? Is it chilly? Brr, that's cold!"
      ],
      "reassurance": [
        "It's chilly, sweetheart. I'm here with you. We'll get cozy.",
        "Too cold? I'm right here. We'll get cozy together.",
        "Feeling a bit chilly? It's okay. Let's get cozy."
      ]
    }
  }
};
export const APPROVED_TEMPERATURE_AUDIO=[
  {
    "text": "Feeling warm, baby? Whew, it's warm! Let's get comfy.",
    "file": "../temperature-1202/clips/bc413d2fa72ea0d8eb72eb17.m4a",
    "sha256": "3342181a42acdb41acb2f57e0dec2a27a3e3f88f532ab92bcfbeaac968a17430",
    "bytes": 59704,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "It's a hot day! Whew, it's warm! Let's stay comfy.",
    "file": "../temperature-1202/clips/1201edfb9cb8731de8be0243.m4a",
    "sha256": "2e5af95a94af64506cbf5f64c7c94f4de4ccf2fc49b96d3d3885862b8202826c",
    "bytes": 57924,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Too warm, little one? Whew, that's warm! Let's cool down.",
    "file": "../temperature-1202/clips/7da2c85f2cb1b2f125309aca.m4a",
    "sha256": "231d90777b6dd92bb6ae82f375b0d34a11bdb604563d9ae7790786a553d923a7",
    "bytes": 67546,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "That feels hot! Whew, it's warm! Let's cool down.",
    "file": "../temperature-1202/clips/cce4ddcc59e3dbd17c42f972.m4a",
    "sha256": "9649f703536d1fb9aa8a55a865781afdc1c9f3c49d67a7f90133ff64da51f9ce",
    "bytes": 56301,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Feeling chilly, baby? Brr, it's cold! Let's get cozy.",
    "file": "../temperature-1202/clips/38a198912ef282c0492aaabb.m4a",
    "sha256": "4d0c04fb28effa9b29c4a0583cf9480d592c6d901745d4aacdf6852794549948",
    "bytes": 64049,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "It's a cold day! Brr, brr! Let's stay cozy.",
    "file": "../temperature-1202/clips/d86a8514c3b7ea5855e6a3da.m4a",
    "sha256": "727b5175790d6cc5291e543eccb73126140c28efbe8a37cb9e3d17401b3f4eaf",
    "bytes": 58462,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Feeling cold, little one? Brr, it's chilly! Let's get cozy.",
    "file": "../temperature-1202/clips/b16d6e9106fa44f5a4c3528b.m4a",
    "sha256": "0d25417a4721c698c69d989857ec764dce5878088e7786dc5ed1de4e57c36351",
    "bytes": 60227,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "That feels cold! Brr, brr! So chilly!",
    "file": "../temperature-1202/clips/d03ebc01f3fc0b5c3db46816.m4a",
    "sha256": "acbba547d555d4eafa1ec64bd643eafbdcc0aa26e75e10270d88613dbfb5a2fe",
    "bytes": 51896,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Feeling too warm? Let's cool down. I'll help you.",
    "file": "../temperature-1202/clips/a716d90a781e8a7fa4c4d0b7.m4a",
    "sha256": "11d6825c86b4f4f1dfd6ab7e9848fd722a3742b37b11471468ee6bffcc304d84",
    "bytes": 47955,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "It's warm in here! Let's get comfy. Nice and easy.",
    "file": "../temperature-1202/clips/4f015d537a405b9a7a60b62f.m4a",
    "sha256": "be5953ee65824b710d2f8cb699861b84ed31ee6f27c0f547620412103a115bb3",
    "bytes": 53488,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "That's a little hot! Let's cool down. I'm right here.",
    "file": "../temperature-1202/clips/8d650903b5bd82d0b6d1b050.m4a",
    "sha256": "78dc905f24bd4a9484fdccfac481cc4eddb34cb3d177ac450ec3ffc2fdef1702",
    "bytes": 54980,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Feeling a little chilly? Let's get cozy. I'll help you.",
    "file": "../temperature-1202/clips/db87658b870abcdbca002315.m4a",
    "sha256": "44d7864bb703ce6a63eea688d58c750fad16f0e679bbdaa2b5b6d0ff66151373",
    "bytes": 54353,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "It's chilly in here! Let's get cozy. Nice and easy.",
    "file": "../temperature-1202/clips/dce8a50299014e2670a36fb5.m4a",
    "sha256": "dd033bfbfae4da192d874072a765f8b6b8ef134f15908a18dcc53b3a27cf8de4",
    "bytes": 62276,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "That's a little cold! Let's get cozy. I'm right here.",
    "file": "../temperature-1202/clips/2168465f22d5b053a4e27c55.m4a",
    "sha256": "c5d3560d253d904f056ddb03b4d5279deca26272cd7f7174149564d0491e83ae",
    "bytes": 59409,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Too warm, baby? Feeling hot? Let's cool down.",
    "file": "../temperature-1202/clips/1e255e3ac34fa8a12d00cffd.m4a",
    "sha256": "aeb26c27a281b5818edb1453a95c3f758e7b1036c2680babd5cfb7f3f7cb9be0",
    "bytes": 50420,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Is it hot today? Feeling warm? Whew, it's hot!",
    "file": "../temperature-1202/clips/87749bb68b3deb850340d73d.m4a",
    "sha256": "3f92bd25841295707b111884a38cb7747a2d0e7de7d1d0fec494ceb9a5231555",
    "bytes": 57272,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Does that feel hot? Is it warm? Whew, that's hot!",
    "file": "../temperature-1202/clips/5de652e208f28dbc1d5510e3.m4a",
    "sha256": "6eb896a42c718dab17a5fd2b157fc308646329be6fcf2422dfe4fab8d8303efb",
    "bytes": 54435,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Feeling chilly, baby? Are you cold? Let's get cozy.",
    "file": "../temperature-1202/clips/3070de3c4789daa93f06cd7c.m4a",
    "sha256": "12592324a54b446de8b44a3ba29b157d12dc756c0d0cb29707f456a76fa75fe7",
    "bytes": 55946,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Is it cold today? Feeling chilly? Brr, brr!",
    "file": "../temperature-1202/clips/7a29711c738d20ebb184cf41.m4a",
    "sha256": "04cc7c7fc3366fb5e126c63358ec05da9d4c735bd5edd974edb7b00787b04370",
    "bytes": 46087,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Does that feel cold? Is it chilly? Brr, that's cold!",
    "file": "../temperature-1202/clips/39d3f6db6ffcc672029727f7.m4a",
    "sha256": "31107371e7a0fab9f172c9bad54903f1ee39b390239a22da9f484e2caed26921",
    "bytes": 58265,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "It's warm, sweetheart. I'm here with you. Let's cool down.",
    "file": "../temperature-1202/clips/1e5e20353fd99264c71364b7.m4a",
    "sha256": "3a004b77910e77be217dac4d061faa79b2c32f8d33fb4187a27bb765e907ee26",
    "bytes": 55056,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Too hot? I'm right here. We'll cool down together.",
    "file": "../temperature-1202/clips/c49caa4c23ed26ab784c2e99.m4a",
    "sha256": "edade849d34b6ee3f8578b62a1d95b7d9800010adf8eb22e1924f230464d4840",
    "bytes": 53323,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Feeling a bit warm? It's okay. Let's get comfy.",
    "file": "../temperature-1202/clips/92bfa97d9db998ad66b1edb5.m4a",
    "sha256": "306047cae422f6a2cc4a8c6f61277bce2285433224cff84f3a46b7d1eae9b6fb",
    "bytes": 53775,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "It's chilly, sweetheart. I'm here with you. We'll get cozy.",
    "file": "../temperature-1202/clips/037ed4f87b065ef72d086ef5.m4a",
    "sha256": "0df9d040ff682b40ee1faf3353a90216361d5f3c2f4105b8436fc8ce18018c5a",
    "bytes": 59907,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Too cold? I'm right here. We'll get cozy together.",
    "file": "../temperature-1202/clips/3c63cfdf5355f1aef252f1ce.m4a",
    "sha256": "507141a781d075779537735e36c2cade4308eb00473fb0122fe761032dc6090a",
    "bytes": 56185,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  },
  {
    "text": "Feeling a bit chilly? It's okay. Let's get cozy.",
    "file": "../temperature-1202/clips/a73c4e140fc548dad2b0b0c0.m4a",
    "sha256": "b174961e3add351cfa2d2d2e395f8c2330d9c2f66ade727a2fb8befff1cd0361",
    "bytes": 56689,
    "seed": 1202,
    "modelRevision": "e7dd0585652209fa0d7783659aad4e8a324de11c",
    "referenceSha256": "49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0",
    "humanApproved": true
  }
]; // populated only after 26 voice reviews
const SHA=/^[a-f0-9]{64}$/;
export function approvedTemperatureAudioComplete(){
  const texts=[...Object.values(TEMPERATURE_DIRECTION_TEXTS).flatMap(d=>[...d.topics,...Object.values(d.combined).flat()])];
  const approved=APPROVED_TEMPERATURE_AUDIO;
  if(approved.length!==26||texts.length!==26)return false;
  const accepted=new Map(approved.map(row=>[row.text,row]));
  // Reject a duplicate file/hash even if 26 different English keys are present.
  // Each full utterance must have its own independently verified audio.
  const files=new Set(approved.map(row=>row?.file));
  const hashes=new Set(approved.map(row=>row?.sha256));
  return accepted.size===26&&files.size===26&&hashes.size===26&&texts.every(text=>{
    const row=accepted.get(text);
    return row && row.seed===1202 &&
      row.modelRevision==='e7dd0585652209fa0d7783659aad4e8a324de11c' &&
      row.referenceSha256==='49e2939ab96482595d300d52135bc57234df4a019aca773f739d2f6f8be3a8d0' &&
      SHA.test(row.sha256) && row.humanApproved===true &&
      Number.isInteger(row.bytes)&&row.bytes>0&&
      /^\.\.\/temperature-1202\/clips\/[a-f0-9]{24}\.m4a$/.test(row.file);
  });
}
export function approvedTemperatureCandidates(direction,interaction=null){
  if(!approvedTemperatureAudioComplete()||!['hot','cold'].includes(direction))return null;
  const pool=TEMPERATURE_DIRECTION_TEXTS[direction];
  return {topics:pool.topics,combined:pool.combined[interaction]||null};
}
