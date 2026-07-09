import { useState, useCallback } from "react"
import { useAppStore } from "../../store"
import { XRayViewer } from "./XRayViewer"
import { RiskBar } from "./RiskBar"

function mockSaliencyMap(
  width: number,
  height: number,
  centerX: number,
  centerY: number,
): Float32Array {
  const map = new Float32Array(width * height)
  const sigma = Math.min(width, height) * 0.2
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX
      const dy = y - centerY
      map[y * width + x] = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma))
    }
  }
  return map
}

interface SaliencyState {
  map: Float32Array
  width: number
  height: number
}

function toFloat32(arr: number[]): Float32Array {
  const f = new Float32Array(arr.length)
  for (let i = 0; i < arr.length; i++) f[i] = arr[i]!
  return f
}

export function ResultPanel() {
  const { upload, predictions } = useAppStore()
  const [saliency, setSaliency] = useState<SaliencyState | null>(null)

  const currentSaliency = saliency ?? null

  const handleExplain = useCallback(
    (predId: string, pathologyIndex: number) => {
      const pred = predictions.find((p) => p.id === predId)
      if (!pred) return

      if (pred.saliency) {
        setSaliency({
          map: toFloat32(pred.saliency.map),
          width: pred.saliency.width,
          height: pred.saliency.height,
        })
        return
      }

      const img = new Image()
      img.onload = () => {
        const w = Math.min(img.width, 224)
        const h = Math.min(img.height, 224)
        const cx = 70 + (pathologyIndex * 17) % (w - 140)
        const cy = 70 + (pathologyIndex * 23) % (h - 140)
        const map = mockSaliencyMap(w, h, cx, cy)
        setSaliency({ map, width: w, height: h })
      }
      img.src = pred.previewUrl
    },
    [predictions],
  )

  if (upload.status !== "done" || predictions.length === 0) return null

  const latest = predictions[0]!

  const hasServerSaliency = latest.saliency != null

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-900/50 overflow-hidden animate-[fade-in_0.3s_ease-out]">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {latest.filename}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {new Date(latest.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-5">
        <div className="flex-1 flex justify-center">
          <XRayViewer
            src={latest.previewUrl}
            saliencyMap={
              hasServerSaliency
                ? toFloat32(latest.saliency!.map)
                : (currentSaliency?.map ?? null)
            }
            saliencyWidth={hasServerSaliency ? latest.saliency!.width : (currentSaliency?.width ?? undefined)}
            saliencyHeight={hasServerSaliency ? latest.saliency!.height : (currentSaliency?.height ?? undefined)}
          />
        </div>

        <div className="w-full md:w-72 space-y-1">
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider px-1 mb-2">
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>

          {latest.pathologies.map((p, idx) => (
            <RiskBar
              key={p.name}
              pathology={p}
              showExplain
              onExplain={() => handleExplain(latest.id, idx)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
