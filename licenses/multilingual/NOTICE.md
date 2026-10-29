# Multilingual on-device components

**Model/license inventory reviewed on 2026-10-28.** The full current
twelve-language production model list, separate semantic and speech
models, recorded-audio generator and runtime dependencies are in
`../CURRENT-MODEL-INVENTORY.json`.
Reference-only, recomputed MD5 fingerprints of the unchanged source
legal documents are in `../CURRENT-LICENSE-DIGESTS.json`; **MD5 never
replaces the existing SHA-256 verification of downloaded model weights.**

A pinned upstream model-card commit may be older than 2026-10-28, because
the actual app still uses those immutable model revisions. Do not edit the
original model card or replace the weights merely to make its date newer.

**SenseVoice licensing is not finally clarified for all use cases.**
The model weights refer to FunASR's separate model agreement, rather
than the Sherpa-ONNX runtime's Apache-2.0 license. The exact ONNX
conversion and commercial/redistribution scope remain open for
license-owner clarification; see
https://github.com/modelscope/FunASR/issues/3715 .
Keep the full v1.1 text as retained; no blanket commercial right is
asserted here. For Thai PengChengStarling, the upstream Apache-2.0
model-card label and the separate downstream conversion/provenance must
both remain visible.


Pinned model URLs, sizes, revisions and SHA-256 are recorded in
`src/multilingual/assets.json` (or its packaged Android copy).

- **Whisper Small**: OpenAI Whisper, MIT. See WHISPER-MIT.txt.
  https://github.com/openai/whisper
- **Converted Whisper Small ONNX**: Xenova/whisper-small,
  revision `2d67713f236afa48a18992566e7647f6ca848e13`, Apache-2.0 model card.
  https://huggingface.co/Xenova/whisper-small/tree/2d67713f236afa48a18992566e7647f6ca848e13
- **Multilingual E5 Small**: Microsoft, MIT. See E5-MIT.txt.
  Converted ONNX: Xenova/multilingual-e5-small,
  revision `761b726dd34fb83930e26aab4e9ac3899aa1fa78`.
  https://huggingface.co/Xenova/multilingual-e5-small/tree/761b726dd34fb83930e26aab4e9ac3899aa1fa78
- **Transformers.js 3.8.1**: Hugging Face, Apache-2.0.
  Its license is included in `multilingual-assets/runtime/LICENSE-transformers.txt`.
- **ONNX Runtime Web 1.30.0**: Microsoft, MIT. See ONNXRUNTIME.txt.
  The runtime license is also included alongside the bundled runtime; existing
  ONNX Runtime third-party notices in `licenses/semantic/` remain applicable.

The Apache-2.0 license text included with Transformers.js also applies to the
converted Whisper model. Model weights are downloaded on demand, never included
in the APK or duplicated per language. Speech remains on the device.

The small project-specific FP32 classification heads originate from the frozen
C10 Topic and v2 Interaction experiments. Their provenance, class order and hash
are recorded in `multilingual-assets/heads/config.json`. They are not a new
training run or a human-reviewed product-accuracy claim.

## French and Hindi Vosk Small 0.22

- Official checkpoint publisher: Alpha Cephei / Vosk, Apache-2.0 according to
  the publisher's model catalog: https://alphacephei.com/vosk/models
  Official ZIPs: `vosk-model-small-fr-0.22.zip`, `vosk-model-small-hi-0.22.zip`.
  Their original README files remain inside the repacked models.
- `vosk-browser` 0.0.8 by Ciaran O'Reilly, Apache-2.0 (publisher npm metadata):
  https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/package.json
  Source: https://github.com/ccoreilly/vosk-browser
  Exact runtime SHA-256 is pinned in `src/multilingual/vosk-asr.js`.
- Transport mirror: https://huggingface.co/localstack/vosk-models at revision
  `a0cabdd6801bd201c783afcc096208cde59fa182`. The mirror is not trusted for
  model identity: the official ZIP SHA-256 must match before extraction.
- Changes: archive container only (ZIP to tar.gz with explicit directory
  permissions). All model weights and original README bytes remain unchanged.
  ZIP, Python tar.gz and uncompressed tar digests are pinned in
  `src/multilingual/vosk-models.js`. No microphone audio is uploaded.
- Apache-2.0 text: `../semantic/LICENSE-APACHE-2.0.txt`.

The optional browser evaluation uses Google's FLEURS held-out TEST recordings,
CC-BY-4.0: https://huggingface.co/datasets/google/fleurs . Attribution:
Conneau et al., *FLEURS: Few-shot Learning Evaluation of Universal
Representations of Speech*, https://arxiv.org/abs/2205.12446 . Recordings are
downloaded into ignored test outputs; only transcripts, predictions and metrics
are retained in the research report. These are general read-speech samples,
not evidence of caregiver-conversation accuracy.

## Korean SenseVoice Small INT8

- Model: FunAudioLLM / Alibaba SenseVoice Small, original model card:
  https://huggingface.co/FunAudioLLM/SenseVoiceSmall/tree/3847d57b6bdf2dd8875cb1508d2af43d80a16bf7
  The model card refers to the FunASR Model Open Source License Agreement,
  not to the Apache license of the Sherpa runtime.
- Retained model agreement: `SENSEVOICE-MODEL-LICENSE.txt`, version 1.1,
  SHA-256 `7dba975a2069691db4992b0592d70828b330d2f8a30a71450f4e152a554e84f8`.
  Source revision: `58830eca4012644aac0c3218c3ccc7d98f003fda` at
  https://github.com/modelscope/FunASR/blob/58830eca4012644aac0c3218c3ccc7d98f003fda/MODEL_LICENSE .
  It permits use/copy/modification/sharing under its conditions, including
  source/author attribution, retention of model names, conduct restrictions,
  termination and revision clauses. The acquired text does not contain a
  separate noncommercial-only restriction; its full terms remain applicable.
- Exact Sherpa ONNX INT8 conversion by Fangjun Kuang / k2-fsa:
  https://huggingface.co/csukuangfj/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17/tree/2365baeacb507f821a0c8120fcee3d484dba7a07 .
  `model.int8.onnx`: 239233841 bytes, SHA-256
  `c71f0ce00bec95b07744e116345e33d8cbbe08cef896382cf907bf4b51a2cd51`.
  Weight values are not modified by this app. The int8 checkpoint, tokens,
  language setting (`ko`) and all runtime hashes are pinned in
  `src/multilingual/sensevoice-asr.js`.
- Runtime: k2-fsa Sherpa-ONNX ASR-only WebAssembly 1.12.32, source commit
  `5f3dcc1dce87e8a6d16887d516bb35aaca4c23eb`, Apache-2.0:
  https://github.com/k2-fsa/sherpa-onnx/releases/tag/v1.12.32 .
  Original license and exact provenance are retained beside the runtime in
  `src/vendor/sherpa-sensevoice-1.12.32/`. Existing ONNX Runtime MIT and
  third-party notices also apply.
- Runtime changes: only the generated demo's `.data` file-preloader prefix is
  omitted in `sherpa-onnx-asr-runtime.js`. The original JS and derivation are
  retained; the compiled WASM and ASR binding are unchanged. Official weights
  and tokens are verified independently and loaded via FS_createDataFile.
  TTS is disabled in this official build. The general npm Sherpa binary that
  contains eSpeak-ng/Piper material is not used.
- Models are downloaded and checksum-verified on the device, with chunked
  persistent storage. No model weights are committed to Git. Speech is not
  uploaded. Only Korean mode instantiates this recognizer; there is no
  Whisper or alternative-ASR fallback.

## Thai PengChengStarling (original source-license review 2026-10-27; inventory rechecked 2026-10-28)

- Original eight-language streaming ASR model by PCL-Voice / PengChengStarling:
  https://github.com/PCL-Voice/PengChengStarling . Model checkpoint:
  https://huggingface.co/stdo/PengChengStarling . The latter model card labels
  its license Apache-2.0 at revision `3afca1d0cdbda6b0cde440e31539be81df5d1301`.
  The complete model card is retained in `PENGCHENG-MODEL-CARD.md`, and the
  Apache license in `PENGCHENG-APACHE-2.0.txt`. The original training-code
  repository still has no root LICENSE; this app does not distribute that
  toolkit or infer permission to copy it from its public visibility.
- INT8 encoder and joiner conversion by k2-fsa / Fangjun Kuang, revision
  `c6726c1147387ad2a11148b33973135d92a55e6c`:
  https://huggingface.co/csukuangfj/sherpa-onnx-streaming-zipformer-ar_en_id_ja_ru_th_vi_zh-2025-02-10 .
  The encoder is 296583597 bytes, SHA-256 `f9001ed7a9e46d0294438c1a30cd7c72d1cc4bdd4e7880edbcda36f67081e32e`.
  Original decoder, converted INT8 joiner, tokens and BPE vocabulary are pinned
  independently in `src/multilingual/pengcheng-asr.js`.
  This downstream repository has no separate license metadata. The original
  model's grant and an identified derivative conversion are the basis, rather
  than assuming every file on Hugging Face has a permissive license.
  Sherpa PR #1835 (merge `d5da9430e89a6ac05ead12ef01e7d501e5192904`)
  downloads the original stdo weights, quantizes encoder/joiner MatMul weights,
  and publishes this exact repository. Original/converted decoder, BPE and
  token git blob identities match. Sources and checked hashes are retained in
  `PENGCHENG-PROVENANCE.json`.
- ASR-only Sherpa-ONNX 1.12.32 WASM, Apache-2.0, source commit
  `5f3dcc1dce87e8a6d16887d516bb35aaca4c23eb`, reproduced by
  `.github/workflows/prepare-pengcheng-runtime.yml`. Its source patch in
  `scripts/patch-pengcheng-wasm.py` inserts the author's original Thai `<TH>`
  decoder start token, with evidence of applied token ID 8 required by the
  Worker. It does not modify any model weights. Runtime binary hashes and
  upstream source attribution are retained in its vendor manifest.
- Model weights are not part of Git or the APK. The browser verifies their
  full SHA-256 before using them and persists them in chunked IndexedDB.
  Microphone PCM stays local; Whisper is never used for Thai mode.
- License and attribution are accessible from the Thai language provider note
  at `PENGCHENG-NOTICE.html`, including on an offline restart. Commercial use
  or distribution is not prohibited by the reviewed Apache-2.0 terms, subject
  to their notice/license/modification requirements. This is not a guarantee
  of all training-data rights, patents or third-party claims.
- Mac app conversations and offline execution have been measured; phone
  performance and broader natural-speech quality remain separate acceptance
  limits. See `docs/PENGCHENG_LICENSE_REVIEW_20261027_JA.md` for this review.
