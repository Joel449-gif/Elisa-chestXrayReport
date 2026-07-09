import type { Pathology } from "../../types"

interface RiskBarProps {
  pathology: Pathology
  showExplain?: boolean
  onExplain?: () => void
}

export function RiskBar({ pathology, showExplain, onExplain }: RiskBarProps) {
  const pct = Math.round(pathology.probability * 100)

  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className={`min-w-[140px] text-xs truncate ${
          pathology.probability > 0.6 ? "font-bold" : ""
        }`}
        title={pathology.name}
      >
        {pathology.name}
      </span>

      <div className="relative flex-1 h-4 rounded-full overflow-hidden bg-gradient-to-r from-[#8DECB4] via-white to-[#c12e2a]">
        <span
          className="absolute top-0 h-full w-0.5 bg-gray-800"
          style={{ left: `${pct}%` }}
        />
      </div>

      {showExplain && pathology.probability > 0.6 && (
        <button
          onClick={onExplain}
          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700
                     hover:bg-blue-200 transition-colors"
        >
          explain
        </button>
      )}
    </div>
  )
}
