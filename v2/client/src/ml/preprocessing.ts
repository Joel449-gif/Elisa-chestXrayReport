/**
 * Image preprocessing for chest X-ray classifier.
 * Pure functions — no DOM dependencies.
 */

export interface ProcessedImage {
  /** Float32 grayscale pixels normalized to [0, 1] */
  pixels: Float32Array
  width: number
  height: number
}

/**
 * Convert an ImageData to a normalized grayscale tensor.
 * Resizes via canvas to targetSize, center-crops, and normalizes.
 */
export function preprocessChestXray(
  imageData: ImageData,
  targetSize: number,
): ProcessedImage {
  const { width, height } = imageData
  const src = new Float32Array(imageData.data.length / 4)
  for (let i = 0; i < src.length; i++) {
    src[i] = imageData.data[i * 4]! / 255
  }

  const size = Math.min(width, height)
  const offsetX = Math.floor((width - size) / 2)
  const offsetY = Math.floor((height - size) / 2)

  const cropped = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cropped[y * size + x] = src[(y + offsetY) * width + (x + offsetX)]!
    }
  }

  const resized = resizeBilinear(cropped, size, size, targetSize, targetSize)

  return { pixels: resized, width: targetSize, height: targetSize }
}

/**
 * Apply the model-specific normalization:
 *   normalized = pixels * 2 - 1
 *   scaled = normalized * IMAGE_SCALE
 */
export function applyModelNormalization(
  pixels: Float32Array,
  imageScale: number,
): Float32Array {
  const out = new Float32Array(pixels.length)
  for (let i = 0; i < pixels.length; i++) {
    out[i] = (pixels[i]! * 2 - 1) * imageScale
  }
  return out
}

/**
 * Bilinear resize.
 */
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
