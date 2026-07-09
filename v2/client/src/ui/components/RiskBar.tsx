import type { Pathology } from "../../types"

interface RiskBarProps {
  pathology: Pathology
  showExplain?: boolean
  onExplain?: () => void
}

export function RiskBar({ pathology, showExplain, onExplain }: RiskBarProps) {
  const pct = Math.round(pathology.probability * 100)

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <span
        className={`min-w-[130px] text-xs truncate ${
          pathology.probability > 0.6
            ? "font-semibold text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-400"
        }`}
        title={pathology.name}
      >
        {pathology.name}
      </span>

      <div className="relative flex-1 h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background:
              pct > 60
                ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                : pct > 30
                  ? "linear-gradient(90deg, #22c55e, #f59e0b)"
                  : "linear-gradient(90deg, #22c55e, #4ade80)",
          }}
        />
        <span
          className="absolute top-0 h-full w-0.5 bg-gray-900 dark:bg-gray-100"
          style={{ left: `${pct}%` }}
        />
      </div>

      {showExplain && pathology.probability > 0.6 && (
        <button
          onClick={onExplain}
          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors whitespace-nowrap"
        >
          explain
        </button>
      )}
    </div>
  )
}
