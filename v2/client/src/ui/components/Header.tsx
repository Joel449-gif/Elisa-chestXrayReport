import { useAppStore } from "../../store"

const tabs = [
  { key: "analysis" as const, label: "Analysis" },
  { key: "log" as const, label: "Log" },
]

export function Header() {
  const { darkMode, toggleDarkMode, inferenceMode, setInferenceMode, activeView, setActiveView } =
    useAppStore()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Elisa <span className="text-blue-600 dark:text-blue-400">V2</span>
            </h1>
          </div>

          <nav className="flex items-center gap-1 ml-4 p-0.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeView === tab.key
                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <nav className="flex items-center gap-3 text-sm">
          <select
            value={inferenceMode}
            onChange={(e) =>
              setInferenceMode(e.target.value as "client" | "server")
            }
            className="px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
          >
            <option value="server">Server</option>
            <option value="client">TF.js</option>
          </select>

          <button
            onClick={toggleDarkMode}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? "\u2600\uFE0F" : "\u{1F319}"}
          </button>
        </nav>
      </div>
    </header>
  )
}
