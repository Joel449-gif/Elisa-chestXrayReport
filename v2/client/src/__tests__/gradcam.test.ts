import { describe, it, expect } from "vitest"
import { computeGradCAM } from "../ml/explainer"

describe("computeGradCAM", () => {
  it("should produce a correctly sized heatmap", () => {
    const actW = 7
    const actH = 7
    const numChannels = 512
    const activations = new Float32Array(actW * actH * numChannels)
    const gradients = new Float32Array(actW * actH * numChannels)

    activations.fill(0.5)
    gradients.fill(0.1)

    const result = computeGradCAM(activations, gradients, actW, actH, {
      width: 224,
      height: 224,
    })

    expect(result.width).toBe(224)
    expect(result.height).toBe(224)
    expect(result.map.length).toBe(224 * 224)
  })

  it("should normalize values to [0, 1]", () => {
    const activations = new Float32Array(7 * 7 * 8)
    const gradients = new Float32Array(7 * 7 * 8)
    activations.fill(2.0)
    gradients.fill(1.0)

    const result = computeGradCAM(activations, gradients, 7, 7, {
      width: 7,
      height: 7,
    })

    for (const v of result.map) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    }
  })
})
