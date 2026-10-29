---
license: apache-2.0
language:
- zh
- en
- vi
- ru
- ja
- th
- id
- ar
metrics:
- wer
- cer
---

# Introduction

The [PengChengStarling project](https://github.com/yangb05/PengChengStarling) is a multilingual ASR system development toolkit built upon [the icefall project](https://github.com/k2-fsa/icefall). 
To evaluate the capabilities of PengChengStarling, we developed a multilingual **streaming** ASR model supporting **eight** languages: Chinese, English, Russian, Vietnamese, Japanese, Thai, Indonesian, and Arabic. Each language was trained with approximately **2,000** hours of audio data, primarily sourced from open datasets. Our model achieves comparable or superior streaming ASR performance in **six** of these languages compared to Whisper-Large v3, while being only **20%** of its size. Additionally, our model offers a remarkable **7x** speed improvement in inference compared to Whisper-Large v3.

## Results
| Language | Testset | Whisper-Large v3 | Ours |
|:--------:|:-------:|:----------------:|:----:|
| Chinese | [wenetspeech test meeting](https://github.com/wenet-e2e/WenetSpeech) | 22.99 | **22.67** |
| Vietnamese | [gigaspeech2-vi test](https://huggingface.co/datasets/speechcolab/gigaspeech2) | 17.94 | **7.09** |
| Japanese | [reazonspeech test](https://huggingface.co/datasets/reazon-research/reazonspeech) | 16.3 | **13.34** |
| Thai | [gigaspeech2-th test](https://huggingface.co/datasets/speechcolab/gigaspeech2) | 20.44 | **17.39** |
| Indonesia | [gigaspeech2-id test](https://huggingface.co/datasets/speechcolab/gigaspeech2) | **20.03** | 20.54 |
| Arabic | [mgb2 test](https://arabicspeech.org/resources/mgb2) | 30.3 | **24.37** |

## Uses

Please refer to the [document](https://github.com/yangb05/PengChengStarling) for guidance on using the checkpoints in this repository.


## Model Card Contact

yangb05@pcl.ac.cn