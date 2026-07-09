import { describe, it, expect } from "vitest"
import { preprocessChestXray } from "../ml/preprocessing"

describe("preprocessChestXray", () => {
  it("should return correct dimensions", () => {
    const data = new ImageData(448, 448)
    const result = preprocessChestXray(data, 224)

    expect(result.width).toBe(224)
    expect(result.height).toBe(224)
    expect(result.pixels.length).toBe(224 * 224)
  })

  it("should produce values in [0, 1] range", () => {
    const data = new ImageData(224, 224)
    const result = preprocessChestXray(data, 224)

    for (let i = 0; i < result.pixels.length; i++) {
      expect(result.pixels[i]).toBeGreaterThanOrEqual(0)
      expect(result.pixels[i]).toBeLessThanOrEqual(1)
    }
  })
})
