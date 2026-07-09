import { describe, it, expect } from "vitest"
import { calibrateProbabilities } from "../ml/classifier"
import type { ModelConfig } from "../types"

const TEST_CONFIG: ModelConfig = {
  imageSize: 224,
  imageScale: 1024,
  outputNode: "Sigmoid_435",
  labels: ["Atelectasis", "Consolidation", "", "", "Edema"],
  scaleUpper: 1.3,
  opPoints: [0.074, 0.038, 0.098, 0.01, 0.024],
}

describe("calibrateProbabilities", () => {
  it("should skip empty labels", () => {
    const logits = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5])
    const result = calibrateProbabilities(logits, TEST_CONFIG)

    expect(result.length).toBe(3) // only non-empty labels
    expect(result[0]?.name).toBe("Atelectasis")
    expect(result[1]?.name).toBe("Consolidation")
    expect(result[2]?.name).toBe("Edema")
  })

  it("should return probabilities between 0 and 1", () => {
    const logits = new Float32Array([0.9, 0.9, 0.9, 0.9, 0.9])
    const result = calibrateProbabilities(logits, TEST_CONFIG)

    for (const p of result) {
      expect(p.probability).toBeGreaterThanOrEqual(0)
      expect(p.probability).toBeLessThanOrEqual(1)
    }
  })
})
