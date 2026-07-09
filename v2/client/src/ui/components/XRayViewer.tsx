import { useRef, useEffect } from "react"

interface XRayViewerProps {
  src: string
  saliencyMap?: Float32Array | null
  saliencyWidth?: number
  saliencyHeight?: number
}

function applyHeatmap(
  ctx: CanvasRenderingContext2D,
  map: Float32Array,
  w: number,
  h: number,
) {
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data

  for (let i = 0; i < map.length; i++) {
    const v = Math.round(map[i]! * 255)
    const idx = i * 4
    data[idx] = v
    data[idx + 1] = 0
    data[idx + 2] = 0
    data[idx + 3] = v > 10 ? 180 : 0
  }

  ctx.putImageData(imageData, 0, 0)
}

export function XRayViewer({
  src,
  saliencyMap,
  saliencyWidth,
  saliencyHeight,
}: XRayViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
    }
    img.src = src
  }, [src])

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas || !saliencyMap || !saliencyWidth || !saliencyHeight) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = saliencyWidth
    canvas.height = saliencyHeight
    applyHeatmap(ctx, saliencyMap, saliencyWidth, saliencyHeight)
  }, [saliencyMap, saliencyWidth, saliencyHeight])

  return (
    <div className="relative inline-block">
      <canvas ref={canvasRef} className="max-h-[600px] rounded shadow" />
      <canvas
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
      />
    </div>
  )
}
