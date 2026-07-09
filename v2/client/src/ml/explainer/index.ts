/**
 * Explainability module.
 * Interface for GradCAM / gradient-based saliency.
 */

export interface SaliencyMap {
  /** Grayscale heatmap values, 0-1 normalized */
  map: Float32Array
  width: number
  height: number
}

/**
 * Compute GradCAM heatmap from activations and gradients.
 * GradCAM = ReLU( sum_k( alpha_k * A_k ) )
 * where alpha_k = global_avg_pool( d(y^c) / d(A_k) )
 */
export function computeGradCAM(
  activations: Float32Array,
  gradients: Float32Array,
  actWidth: number,
  actHeight: number,
  upscaleTo: { width: number; height: number },
): SaliencyMap {
  const numChannels = gradients.length / (actWidth * actHeight)
  const channelSize = actWidth * actHeight

  const alpha = new Float32Array(numChannels)
  for (let c = 0; c < numChannels; c++) {
    let sum = 0
    for (let i = 0; i < channelSize; i++) {
      sum += gradients[c * channelSize + i]!
    }
    alpha[c] = sum / channelSize
  }

  const heatmap = new Float32Array(channelSize)
  for (let i = 0; i < channelSize; i++) {
    let val = 0
    for (let c = 0; c < numChannels; c++) {
      val += alpha[c]! * activations[c * channelSize + i]!
    }
    heatmap[i] = Math.max(0, val)
  }

  const maxVal = heatmap.reduce((a, b) => Math.max(a, b), 0)
  if (maxVal > 0) {
    for (let i = 0; i < heatmap.length; i++) {
      heatmap[i]! /= maxVal
    }
  }

  const upscaled = resizeBilinear(
    heatmap,
    actWidth,
    actHeight,
    upscaleTo.width,
    upscaleTo.height,
  )

  return { map: upscaled, width: upscaleTo.width, height: upscaleTo.height }
}

function resizeBilinear(
  src: Float32Array,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): Float32Array {
  const dst = new Float32Array(dstW * dstH)
  const xRatio = srcW / dstW
  const yRatio = srcH / dstH

  for (let dy = 0; dy < dstH; dy++) {
    for (let dx = 0; dx < dstW; dx++) {
      const sx = dx * xRatio
      const sy = dy * yRatio
      const ix = Math.floor(sx)
      const iy = Math.floor(sy)
      const fx = sx - ix
      const fy = sy - iy

      const ix1 = Math.min(ix + 1, srcW - 1)
      const iy1 = Math.min(iy + 1, srcH - 1)

      const v00 = src[iy * srcW + ix]!
      const v10 = src[iy * srcW + ix1]!
      const v01 = src[iy1 * srcW + ix]!
      const v11 = src[iy1 * srcW + ix1]!

      const top = v00 + fx * (v10 - v00)
      const bot = v01 + fx * (v11 - v01)
      dst[dy * dstW + dx] = top + fy * (bot - top)
    }
  }
  return dst
}
