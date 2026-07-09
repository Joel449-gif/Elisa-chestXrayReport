import { useAppStore } from "../../store"

function RiskPct({ probability }: { probability: number }) {
  const pct = Math.round(probability * 100)
  const color =
    pct > 60
      ? "text-red-600 dark:text-red-400 font-semibold"
      : pct > 30
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-green-600 dark:text-green-400"
  return <span className={color}>{pct}%</span>
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
        <button
          onClick={clearLogs}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Clear Log
        </button>
      </div>

      {predictionLogs.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-600">
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
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-500">
                  Timestamp
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-500">
                  Image
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-500">
                  Findings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {predictionLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {log.filename}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {log.pathologies?.map((p) => (
                        <span
                          key={p.name}
                          className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap"
                        >
                          {p.name}: <RiskPct probability={p.probability} />
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
