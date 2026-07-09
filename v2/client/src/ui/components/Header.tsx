import { useAppStore } from "../../store"

export function Header() {
  const { darkMode, toggleDarkMode, inferenceMode, setInferenceMode } =
    useAppStore()

  return (
    <header
      className={`w-full px-6 py-4 flex items-center justify-between ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-[#F1EEDC] text-[#AF8260]"
      }`}
    >
      <h1 className="text-2xl font-bold tracking-wide font-[Cambria]">
        ELISA — Chest X-Ray Report
      </h1>

      <nav className="flex items-center gap-4 text-sm">
        <select
          value={inferenceMode}
          onChange={(e) => setInferenceMode(e.target.value as "client" | "server")}
          className="px-2 py-1 rounded border bg-white text-gray-800"
        >
          <option value="server">Server (FastAPI)</option>
          <option value="client">Client (TF.js)</option>
        </select>

        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded border hover:opacity-80"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </nav>
    </header>
  )
}
