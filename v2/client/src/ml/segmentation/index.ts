/**
 * Lung segmentation module.
 * Stub for future U-Net segmentation integration.
 */

export interface SegmentationResult {
  /** Binary mask pixels (0 or 1) */
  mask: Uint8Array
  width: number
  height: number
}

/**
 * Placeholder — returns a full-frame mask.
 * Replace with actual U-Net inference when model is available.
 */
export function segmentLungs(
  _pixels: Float32Array,
  width: number,
  height: number,
): SegmentationResult {
  const mask = new Uint8Array(width * height)
  for (let i = 0; i < mask.length; i++) {
    mask[i] = 1
  }
  return { mask, width, height }
}
