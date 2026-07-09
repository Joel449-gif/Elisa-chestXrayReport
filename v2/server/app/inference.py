"""Inference — real DenseNet-121 model with GradCAM, falls back to mock."""

from __future__ import annotations

import logging
import time

import numpy as np
from PIL import Image

from .config import CLASSIFIER_LABELS, CLASSIFIER_OP_POINTS, SCALE_UPPER

logger = logging.getLogger(__name__)

PathologyResult = tuple[str, float, float]

# ---------------------------------------------------------------------------
# Calibration
# ---------------------------------------------------------------------------


def calibrate_probability(
    probability: float, op_point: float, scale_upper: float | None
) -> float:
    if probability < op_point:
        return probability / (op_point * 2)
    normalized = 1 - (1 - probability) / ((1 - op_point) * 2)
    if normalized > 0.6 and scale_upper:
        normalized = min(1.0, normalized * scale_upper)
    return normalized


# ---------------------------------------------------------------------------
# Model loader
# ---------------------------------------------------------------------------

_model_instance: "ChestXRayModel | None" = None


def get_model() -> "ChestXRayModel | None":
    global _model_instance
    if _model_instance is not None:
        return _model_instance
    try:
        from .model import ChestXRayModel

        _model_instance = ChestXRayModel(num_classes=len(CLASSIFIER_LABELS))
        _model_instance.predict(Image.new("RGB", (224, 224)))
        logger.info("Real model loaded successfully")
    except Exception as exc:
        logger.warning("Could not load real model, using mock: %s", exc)
        _model_instance = None
    return _model_instance


# ---------------------------------------------------------------------------
# Prediction
# ---------------------------------------------------------------------------


def predict(
    image: Image.Image,
) -> tuple[list[PathologyResult], dict | None]:
    """Run inference on a PIL image.
    Returns (pathology_results, saliency_dict_or_None)."""

    model = get_model()

    if model is not None:
        logits = model.predict(image)
        results = _logits_to_results(logits, _to_probability)
    else:
        logits = _mock_logits(image)
        results = _logits_to_results(logits, _calibrate_mock)

    results.sort(key=lambda x: x[1], reverse=True)
    return results, None


def _logits_to_results(
    logits: np.ndarray,
    prob_fn: callable,
) -> list[PathologyResult]:
    results: list[PathologyResult] = []
    for i, label in enumerate(CLASSIFIER_LABELS):
        if not label:
            continue
        prob = prob_fn(logits[i], CLASSIFIER_OP_POINTS[i], SCALE_UPPER)
        results.append((label, prob, CLASSIFIER_OP_POINTS[i]))
    return results


def predict_with_saliency(
    image: Image.Image,
) -> tuple[list[PathologyResult], dict | None]:
    """Like predict() but also returns a saliency heatmap for the top pathology."""
    model = get_model()
    results_list, _ = predict(image)
    saliency = None

    if model is not None and results_list:
        top_idx = _find_label_index(results_list[0][0])
        if top_idx is not None:
            try:
                heatmap, w, h = model.compute_gradcam(image, top_idx)
                saliency = {
                    "map": heatmap.tolist(),
                    "width": w,
                    "height": h,
                }
            except Exception as exc:
                logger.warning("GradCAM failed: %s", exc)

    return results_list, saliency


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

SIGMOID_X_MAX = 10.0
TEMPERATURE = 2.5


def _to_probability(
    logit: float, _op_point: float, _scale_upper: float | None
) -> float:
    """Temperature-scaled sigmoid for real model logits."""
    clipped = max(-SIGMOID_X_MAX, min(SIGMOID_X_MAX, logit / TEMPERATURE))
    prob = 1.0 / (1.0 + np.exp(-clipped))
    return min(prob, 0.95)


def _calibrate_mock(
    raw: float, op_point: float, scale_upper: float | None
) -> float:
    """V1-style calibration for mock pseudo-probabilities."""
    return calibrate_probability(raw, op_point, scale_upper)


def _find_label_index(label: str) -> int | None:
    try:
        return CLASSIFIER_LABELS.index(label)
    except ValueError:
        return None


# ---------------------------------------------------------------------------
# Mock fallback
# ---------------------------------------------------------------------------


def _mock_logits(image: Image.Image) -> np.ndarray:
    grey = image.convert("L")
    resized = grey.resize((224, 224), Image.BILINEAR)
    pixels = np.array(resized, dtype=np.float32) / 255.0

    np.random.seed(hash(str(pixels.tobytes())) % (2**31))
    n = len(CLASSIFIER_OP_POINTS)
    logits = np.random.normal(loc=0.02, scale=0.04, size=n).tolist()
    elevate = np.random.choice(n, size=max(1, min(2, n)), replace=False)
    for idx in elevate:
        logits[idx] = np.random.uniform(0.08, 0.35)
    return np.array(logits, dtype=np.float32)
