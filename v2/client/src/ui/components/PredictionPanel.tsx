import { useState } from "react"
import { useAppStore } from "../../store"
import { XRayViewer } from "./XRayViewer"
import { RiskBar } from "./RiskBar"

export function PredictionPanel() {
  const { predictions, clearPredictions } = useAppStore()
  const [_activeSaliency, _setActiveSaliency] = useState<{
    predId: string
    pathologyIndex: number
  } | null>(null)

  if (predictions.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Predictions <span className="text-sm font-normal text-gray-500">({predictions.length})</span>
        </h2>
        <button
          onClick={clearPredictions}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Clear All
        </button>
      </div>

      {predictions.map((pred) => (
        <div
          key={pred.id}
          className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-900/50 overflow-hidden animate-[fade-in_0.3s_ease-out]"
        >
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {pred.filename}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {new Date(pred.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 p-5">
            <div className="flex-1 flex justify-center">
              <XRayViewer src={pred.previewUrl} />
            </div>

            <div className="w-full md:w-72 space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider px-1 mb-2">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>

              {pred.pathologies.map((p, idx) => (
                <RiskBar
                  key={p.name}
                  pathology={p}
                  showExplain
                  onExplain={() =>
                    _setActiveSaliency({
                      predId: pred.id,
                      pathologyIndex: idx,
                    })
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
