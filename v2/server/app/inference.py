"""Inference logic — currently returns mock predictions.
Replace with ONNX Runtime / PyTorch when model is available."""

import time
import numpy as np
from PIL import Image

from .config import (
    CLASSIFIER_LABELS,
    CLASSIFIER_OP_POINTS,
    SCALE_UPPER,
)

PathologyResult = tuple[str, float, float]


def calibrate_probability(logit: float, op_point: float, scale_upper: float | None) -> float:
    if logit < op_point:
        return logit / (op_point * 2)
    normalized = 1 - (1 - logit) / ((1 - op_point) * 2)
    if normalized > 0.6 and scale_upper:
        normalized = min(1.0, normalized * scale_upper)
    return normalized


def predict(image: Image.Image) -> list[PathologyResult]:
    """
    Run inference on a PIL image.
    Currently returns mock predictions. Replace with actual model.
    """
    grey = image.convert("L")
    resized = grey.resize((224, 224), Image.BILINEAR)
    pixels = np.array(resized, dtype=np.float32) / 255.0

    # Mock: generate random logits
    np.random.seed(hash(str(pixels.tobytes())) % (2**31))
    logits = np.random.uniform(0, 1, size=len(CLASSIFIER_OP_POINTS)).tolist()

    results: list[PathologyResult] = []
    for i, label in enumerate(CLASSIFIER_LABELS):
        if not label:
            continue
        prob = calibrate_probability(logits[i], CLASSIFIER_OP_POINTS[i], SCALE_UPPER)
        results.append((label, prob, CLASSIFIER_OP_POINTS[i]))

    results.sort(key=lambda x: x[1], reverse=True)
    return results


def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for model input."""
    grey = image.convert("L")
    resized = grey.resize((224, 224), Image.BILINEAR)
    pixels = np.array(resized, dtype=np.float32) / 255.0
    normalized = (pixels * 2 - 1) * 1024
    return normalized.reshape(1, 1, 224, 224)
