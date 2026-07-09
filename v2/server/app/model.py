"""Real DenseNet-121 model with GradCAM explainability."""

from __future__ import annotations

import logging

import numpy as np
import torch
import torch.nn.functional as F
import torchvision.models as models
from PIL import Image
from torchvision.models import DenseNet121_Weights

logger = logging.getLogger(__name__)

TARGET_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]


class ChestXRayModel:
    """DenseNet-121 with ImageNet pre-training, adapted for 18 chest X-ray outputs.
    Provides inference + GradCAM heatmaps.
    """

    def __init__(self, num_classes: int = 18):
        self.device = torch.device("cpu")

        self.model = models.densenet121(weights=DenseNet121_Weights.IMAGENET1K_V1)
        in_features = self.model.classifier.in_features
        self.model.classifier = torch.nn.Linear(in_features, num_classes)
        self.model.eval()
        self.model.to(self.device)

        # Forward hook — stores activation (keeps gradients for autograd.grad)
        self._activations: torch.Tensor | None = None
        self._target_layer = self.model.features.denseblock4.denselayer16.conv2
        self._fwd_handle = self._target_layer.register_forward_hook(
            lambda _m, _i, out: setattr(self, "_activations", out)
        )

        self.loaded = True
        logger.info("DenseNet-121 loaded with %d output classes", num_classes)

    # ------------------------------------------------------------------
    # Preprocessing
    # ------------------------------------------------------------------

    @staticmethod
    def preprocess(image: Image.Image) -> torch.Tensor:
        rgb = image.convert("RGB")
        resized = rgb.resize((TARGET_SIZE, TARGET_SIZE), Image.BILINEAR)
        arr = np.array(resized, dtype=np.float32) / 255.0
        for c in range(3):
            arr[..., c] = (arr[..., c] - MEAN[c]) / STD[c]
        tensor = torch.from_numpy(arr).permute(2, 0, 1).unsqueeze(0)
        return tensor

    # ------------------------------------------------------------------
    # Inference
    # ------------------------------------------------------------------

    @torch.no_grad()
    def predict(self, image: Image.Image) -> np.ndarray:
        """Return raw logits as float32 array of shape (num_classes,)."""
        tensor = self.preprocess(image).to(self.device)
        logits = self.model(tensor)
        return logits.squeeze(0).cpu().numpy()

    # ------------------------------------------------------------------
    # GradCAM
    # ------------------------------------------------------------------

    def compute_gradcam(
        self, image: Image.Image, class_idx: int
    ) -> tuple[np.ndarray, int, int]:
        """Return (heatmap, width, height) — heatmap is a flat float32 array in [0,1]."""

        self._activations = None
        tensor = self.preprocess(image).to(self.device)
        tensor.requires_grad_(True)

        logits = self.model(tensor)
        score = logits[0, class_idx]

        if self._activations is None:
            raise RuntimeError("Forward hook did not capture activations")

        grads = torch.autograd.grad(score, self._activations)[0]
        act = self._activations.detach()

        act_np = act.squeeze(0).cpu().numpy()
        grad_np = grads.squeeze(0).cpu().numpy()

        num_channels, act_h, act_w = act_np.shape

        weights = grad_np.reshape(num_channels, -1).mean(axis=1)

        cam = np.zeros((act_h, act_w), dtype=np.float32)
        for i in range(num_channels):
            cam += weights[i] * act_np[i]

        cam = np.maximum(cam, 0)
        c_max = cam.max()
        if c_max > 0:
            cam /= c_max

        cam_t = torch.from_numpy(cam).unsqueeze(0).unsqueeze(0)
        cam_up = F.interpolate(
            cam_t,
            size=(TARGET_SIZE, TARGET_SIZE),
            mode="bilinear",
            align_corners=False,
        )
        result = cam_up.squeeze().numpy().astype(np.float32)

        return result.ravel(), TARGET_SIZE, TARGET_SIZE

    def close(self) -> None:
        self._fwd_handle.remove()
