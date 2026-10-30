# CooTrio / みつことば

[English](#english) · [日本語](#日本語)

## English

English moments shared by a parent, a baby, and AI.

[Open the app](https://eltnegcellist.github.io/CooTrio-Web/)

The app is called “みつことば” in Japanese and “CooTrio” internationally. Speech recognition, topic and interaction classification, prerecorded English playback, and illustrations run in your browser. First use requires model downloads and microphone permission. Please check your available data allowance and storage space.

### Models

Japanese uses Moonshine Small Streaming and Ruri INT8. Other supported languages use their dedicated ASR models and E5. Multilingual mode uses Whisper Small. A fixed language does not automatically fall back to a different ASR model.

Ruri is downloaded from the existing [ruri_int8 repository](https://github.com/eltnegcellist/ruri_int8), with a pinned commit and SHA-256 verification. See the [in-app inventory](https://eltnegcellist.github.io/CooTrio-Web/licenses.html?lang=en) for other models and their terms.

### Browser requirements

Use an up-to-date browser with microphone, WebAssembly, Service Worker, and browser storage support. Offline use after downloading models depends on what remains saved on your device. Operation while the screen is locked depends on the OS and browser.

The app path differs from the old site. You may need to download models again, grant microphone permission again, and reinstall the PWA. Migration of the old site's saved data is not guaranteed.

### Releases

This repository contains official CooTrio Web releases. Release versions, model identifiers, and application file hashes are recorded in `release-manifest.json`.

### Third-party notices

[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), the [license inventory](licenses.html?lang=en), and notices accompanying individual files are retained. The inventory lists model-specific terms and outstanding verification items.

## 日本語

親と赤ちゃんとAI、3人でつくる英語の時間。

[アプリを開く](https://eltnegcellist.github.io/CooTrio-Web/)

日本語では「みつことば」、海外向けには「CooTrio」と表示します。音声認識、話題・やりとりの判定、採用済み英語音声、イラストはブラウザ内で動作します。初回はモデル取得とマイク許可が必要です。通信量と保存容量をご確認ください。

### モデル

日本語はMoonshine Small StreamingとRuri INT8、他の対応言語は各専用ASRとE5を使用します。MultilingualはWhisper Smallを使用します。固定言語で別のASRへ自動置換しません。

Ruriモデルは[既存のruri_int8](https://github.com/eltnegcellist/ruri_int8)から固定コミット・SHA-256検証付きで取得します。その他のモデルとライセンスは[アプリ内の一覧](https://eltnegcellist.github.io/CooTrio-Web/licenses.html)を参照してください。

### 利用環境

マイク、WebAssembly、Service Worker、保存領域を利用できる最新のブラウザで開いてください。モデル取得後のオフライン利用は保存状態に依存します。画面ロック中の動作はOS・ブラウザに依存します。

旧サイトとはアプリのパスが異なります。モデルの再取得、マイクの再許可、PWAの再インストールが必要になる場合があります。旧サイトの保存状態の引き継ぎは保証しません。

### リリース

このリポジトリではCooTrio Webの正式リリースを公開しています。リリースのバージョン、モデル識別情報、アプリファイルのハッシュは `release-manifest.json` に記録しています。

### 第三者通知

[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)、[ライセンス一覧](licenses.html)、各ファイル付属の通知を保持しています。モデルごとの条件と未解決の確認事項は一覧に記載しています。
