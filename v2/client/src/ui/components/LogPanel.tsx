import { useRef, useEffect } from "react"
import { useAppStore } from "../../store"

const severityDot: Record<string, string> = {
  info: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
}

const severityText: Record<string, string> = {
  info: "text-blue-600 dark:text-blue-400",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
}

export function LogPanel() {
  const { logs, showLogs, clearLogs } = useAppStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs.length])

  if (!showLogs) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
            Activity Log
          </h3>
          <button
            onClick={clearLogs}
            className="text-[10px] px-2 py-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="max-h-40 overflow-y-auto p-2 space-y-0.5 font-mono text-[11px]">
          {logs.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-600 italic p-2">
              No activity yet
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <span
                  className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${severityDot[log.severity]}`}
                />
                <span className="text-gray-400 dark:text-gray-600 shrink-0 w-16">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={severityText[log.severity]}>
                  {log.message}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
