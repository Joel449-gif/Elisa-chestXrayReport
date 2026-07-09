import { useAppStore } from "../../store"

export function Header() {
  const { darkMode, toggleDarkMode, inferenceMode, setInferenceMode, showLogs, toggleLogs } =
    useAppStore()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            E
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Elisa <span className="text-blue-600 dark:text-blue-400">V2</span>
          </h1>
        </div>

        <nav className="flex items-center gap-3 text-sm">
          <button
            onClick={toggleLogs}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              showLogs
                ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {showLogs ? "Hide Log" : "Log"}
          </button>

          <select
            value={inferenceMode}
            onChange={(e) => setInferenceMode(e.target.value as "client" | "server")}
            className="px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
          >
            <option value="server">Server</option>
            <option value="client">TF.js</option>
          </select>

          <button
            onClick={toggleDarkMode}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? "\u{2600}\u{FE0F}" : "\u{1F319}"}
          </button>
        </nav>
      </div>
    </header>
  )
}
