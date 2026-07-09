import { useEffect } from "react"
import { useAppStore } from "../../store"

export function Toast() {
  const { notification, setNotification } = useAppStore()

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(() => setNotification(null), 4000)
    return () => clearTimeout(t)
  }, [notification, setNotification])

  if (!notification) return null

  return (
    <div className="fixed top-20 right-4 z-[60] animate-[fade-in_0.2s_ease-out]">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border backdrop-blur-md ${
          notification.type === "success"
            ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/80 dark:border-green-700 dark:text-green-300"
            : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/80 dark:border-red-700 dark:text-red-300"
        }`}
      >
        <span className="text-lg">
          {notification.type === "success" ? "\u2705" : "\u26A0\uFE0F"}
        </span>
        <p className="text-sm font-medium">{notification.message}</p>
        <button
          onClick={() => setNotification(null)}
          className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
