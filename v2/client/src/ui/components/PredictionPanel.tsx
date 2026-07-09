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

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 italic">
        Upload a chest X-ray to see results
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Predictions</h2>
        <button
          onClick={clearPredictions}
          className="text-xs px-3 py-1 rounded border border-red-300 text-red-600
                     hover:bg-red-50 transition-colors"
        >
          Clear All
        </button>
      </div>

      {predictions.map((pred) => (
        <div
          key={pred.id}
          className="rounded-lg shadow-md overflow-hidden bg-white"
        >
          <div className="bg-[#E1F7F5] px-4 py-2 text-sm font-medium text-[#0E46A3]">
            {pred.filename}
          </div>

          <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="flex-1 flex justify-center">
              <XRayViewer src={pred.previewUrl} />
            </div>

            <div className="w-full md:w-64 space-y-1">
              <div className="flex justify-between text-[10px] text-gray-500 px-1">
                <span>Healthy</span>
                <span>Risk</span>
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
