# ELISA - Chest X-Ray Report

A fully client-side chest X-ray diagnostic assistant powered by deep learning. All processing runs in the browser via TensorFlow.js — images are never uploaded to any server.

## System Overview

ELISA detects 14 chest pathologies from X-ray images using a DenseNet-based classifier (CheXNet variant), with an autoencoder-based out-of-distribution (OOD) safety check and gradient-based saliency maps to explain predictions.

### Detectable Pathologies

| # | Pathology |
|---|-----------|
| 1 | Atelectasis |
| 2 | Consolidation |
| 3 | Edema |
| 4 | Emphysema |
| 5 | Fibrosis |
| 6 | Effusion |
| 7 | Pleural Thickening |
| 8 | Cardiomegaly |
| 9 | Mass |
| 10 | Hernia |
| 11 | Lung Opacity |
| 12 | Enlarged Cardiomedia |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Browser (TensorFlow.js)                    │
│                                                             │
│  User Uploads Image                                          │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────────┐     ┌──────────────────┐               │
│  │ Autoencoder      │     │ Classifier       │               │
│  │ (64×64)          │────▶│ (DenseNet 224×224)│              │
│  │ OOD Detection    │     │ 18 sigmoid       │               │
│  │ SSIM + recError  │     │ outputs          │               │
│  └─────────────────┘     └────────┬─────────┘               │
│         │                         │                         │
│         │                         ▼                         │
│         │              ┌─────────────────────┐              │
│         │              │ Probability Calib.  │              │
│         └──────────────┤ Risk Visualization  │              │
│                        │ Gradient Heatmaps   │              │
│                        └─────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### Two Neural Network Models

| Model | Type | Input | Output | Purpose |
|-------|------|-------|--------|---------|
| **Classifier** | DenseNet (CheXNet) | 224×224 grayscale | 18 logits (sigmoid) | Pathology prediction |
| **Autoencoder** | Convolutional AE | 64×64 grayscale | 64×64 reconstruction | OOD rejection |

### Processing Pipeline

1. **Image Preprocessing** — Resize, center-crop to 224×224, normalize
2. **OOD Check** — Autoencoder reconstructs the image; if SSIM < 0.60, the image is rejected as out-of-distribution
3. **Classification** — DenseNet forward pass produces 18 sigmoid outputs
4. **Calibration** — Raw logits are normalized against pre-computed operating points per class
5. **Visualization** — Risk bars per pathology, with "Explain" buttons that compute gradient-based saliency heatmaps

## Project Structure

```
├── index.htm                   # Main web app entry point
├── system.html                 # System overview page
├── features.html               # Features description
├── anomalies.html              # Pathology descriptions
├── build/
│   ├── app.js                  # Electron desktop wrapper
│   └── package.json            # Electron dependencies
├── res/
│   ├── css/                    # Bootstrap 3.3.7 + custom styles
│   └── js/
│       ├── system.js           # Core application logic
│       ├── tf.js               # TensorFlow.js runtime
│       ├── tf-2.0.1.min.js     # TF.js v2.0.1
│       ├── ssim.js             # SSIM image comparison
│       ├── js-colormaps.js     # Colormap data for heatmaps
│       └── magnify.js          # Image zoom
├── models/
│   ├── xrv-all-45rot15trans15scale/   # Classifier model (TF.js format)
│   └── ae-chest-savedmodel-64-512/    # Autoencoder model (TF.js format)
├── scripts/
│   ├── onnx2tf.py              # ONNX → TensorFlow conversion
│   └── *.ipynb                 # Conversion notebooks
└── examples/                   # Sample chest X-rays
```

## Model Conversion Pipeline

Models trained in PyTorch or TensorFlow are converted to browser-compatible format:

```
PyTorch/TF → ONNX → TensorFlow → TensorFlow.js
```

The `scripts/onnx2tf.py` script handles custom gradient registrations needed for the saliency map feature.

## Usage

### Web App (Browser)

Open `index.htm` in a modern browser. Click **"LET'S GET STARTED!!"** to load the models, then upload a chest X-ray image.

> Note: The first load downloads ~100MB of model weights. Subsequent loads use IndexedDB caching.

### Desktop App (Electron)

```bash
cd build
npm install
npm start
```

### Query Parameters

| Parameter | Effect |
|-----------|--------|
| `?local=true` | Hides about dialog and online-only elements |
| `?accept=true` | Auto-accepts disclaimer and starts immediately |
| `?debug=true` | Loads mock model (no downloads, for UI debugging) |
| `?randomorder=true` | Processes uploaded files in random order |

## Tech Stack

- **Frontend**: jQuery 3.5.1, Bootstrap 3.3.7
- **ML Runtime**: TensorFlow.js v2.0.1
- **Desktop**: Electron 9.1.3
- **Model Source**: CheXNet (DenseNet-121) trained on ChestX-ray14

## Privacy

All image processing is performed entirely on your device. No images or data are transmitted to any server.

## License

ISC

## References

- CheXNet: [1901.11210v3](https://arxiv.org/abs/1901.11210)
- ChestX-ray14 dataset
