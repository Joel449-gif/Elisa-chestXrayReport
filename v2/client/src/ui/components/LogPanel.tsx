import { useAppStore } from "../../store"

function RiskBadge({ probability }: { probability: number }) {
  const pct = Math.round(probability * 100)
  const color =
    pct > 60
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      : pct > 30
        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${color}`}>
      {pct}%
    </span>
  )
}

export function LogPanel() {
  const { logs, clearLogs, setActiveView } = useAppStore()

  const predictionLogs = logs.filter(
    (l) => l.severity === "success" && l.pathologies,
  )

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Prediction Log{" "}
          <span className="text-sm font-normal text-gray-500">
            ({predictionLogs.length})
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={clearLogs}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Clear Log
          </button>
          <button
            onClick={() => setActiveView("analysis")}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Back to Analysis
          </button>
        </div>
      </div>

      {predictionLogs.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-600">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium">No predictions yet</p>
          <p className="text-sm mt-1">
            Upload a chest X-ray from the{" "}
            <button
              onClick={() => setActiveView("analysis")}
              className="text-blue-500 hover:underline"
            >
              Analysis
            </button>{" "}
            tab to see results here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {predictionLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {log.filename}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {log.pathologies?.length ?? 0} findings
                </span>
              </div>

              {log.pathologies && log.pathologies.length > 0 && (
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {log.pathologies.map((p) => (
                      <div
                        key={p.name}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate mr-2">
                          {p.name}
                        </span>
                        <RiskBadge probability={p.probability} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
