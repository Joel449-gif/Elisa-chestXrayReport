import type { Pathology, ModelConfig } from "../../types"
import { PATHOLOGY_OP_POINTS, type PathologyName } from "../../types/pathology"
import { applyModelNormalization } from "../preprocessing"

export interface ClassifierInput {
  pixels: Float32Array
  width: number
  height: number
}

export interface ClassifierOutput {
  logits: Float32Array
  pathologies: Pathology[]
}

/**
 * Normalize raw logits against operating points.
 * This mirrors the V1 distOverClasses logic.
 */
export function calibrateProbabilities(
  logits: Float32Array,
  config: ModelConfig,
): Pathology[] {
  const result: Pathology[] = []

  for (let i = 0; i < logits.length; i++) {
    const label = config.labels[i]!
    if (!label) continue

    const logit = logits[i]!
    const opPoint = PATHOLOGY_OP_POINTS[label as PathologyName] ?? config.opPoints[i] ?? 0.5
    let normalized: number

    if (logit < opPoint) {
      normalized = logit / (opPoint * 2)
    } else {
      normalized = 1 - (1 - logit) / ((1 - opPoint) * 2)
      if (normalized > 0.6 && config.scaleUpper) {
        normalized = Math.min(1, normalized * config.scaleUpper)
      }
    }

    result.push({
      name: label as PathologyName,
      probability: normalized,
      opPoint,
    })
  }

  return result
}

/**
 * Prepare input tensor data for the classifier.
 * Returns the pixel data shaped as [1, 1, H, W] after normalization.
 */
export function prepareClassifierInput(
  input: ClassifierInput,
  config: ModelConfig,
): Float32Array {
  const normalized = applyModelNormalization(input.pixels, config.imageScale)
  return normalized
}
