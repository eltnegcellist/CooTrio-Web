// Exact existing runtime and classification heads; weights and inference policy unchanged.
// The worker verifies/persists these before importing runtime code or reading heads.
export const LOCAL_SEMANTIC_ASSETS=Object.freeze([
  {
    "file": "runtime/transformers.mjs",
    "model": "e5-runtime-heads",
    "bytes": 566731,
    "sha256": "b45314faf0b06930d5570e1712a231a6224cc90c559439ef134fdc392dbbfc63"
  },
  {
    "file": "runtime/ort-wasm-simd-threaded.mjs",
    "model": "e5-runtime-heads",
    "bytes": 24381,
    "sha256": "e13f7f94fc51b4ca72b12faeb1ee95f4ace6dfbc8939bc718aabdc0a27c4299b"
  },
  {
    "file": "runtime/ort-wasm-simd-threaded.wasm",
    "model": "e5-runtime-heads",
    "bytes": 14239897,
    "sha256": "3398c10d07d229bd91b364548e130e0e51a8e5704b88c7c083ebbeb78842dee2"
  },
  {
    "file": "heads/config.json",
    "model": "e5-runtime-heads",
    "bytes": 1619,
    "sha256": "1b938606bd1558d47e4c563df7b56587b7c34b8c591f0d2dafc2266337c2e716"
  },
  {
    "file": "heads/topic.f32",
    "model": "e5-runtime-heads",
    "bytes": 33880,
    "sha256": "a7a408808cad64269c10759f67ad805a37daf86cb5f92d3a4bbb9270fa7708ab"
  },
  {
    "file": "heads/interaction.f32",
    "model": "e5-runtime-heads",
    "bytes": 23100,
    "sha256": "e8cee3cc7855732e95fdd36c6c3c78df3e479f488ec5a920b2e6f0872d9d5f04"
  }
].map(meta=>Object.freeze({...meta,url:new URL('../../multilingual-assets/'+meta.file,import.meta.url).href})));
