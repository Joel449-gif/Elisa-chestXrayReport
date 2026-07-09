import { useEffect } from "react"
import { useAppStore } from "../store"
import { Header } from "./components/Header"
import { UploadZone } from "./components/UploadZone"
import { LogPanel } from "./components/LogPanel"
import { Toast } from "./components/Toast"
import { ResultPanel } from "./components/ResultPanel"

export function App() {
  const darkMode = useAppStore((s) => s.darkMode)
  const activeView = useAppStore((s) => s.activeView)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <Toast />
      {activeView === "analysis" ? (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <section className="text-center py-8 px-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              AI-Powered Chest X-Ray Analysis
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              ELISA V2 detects{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                12 thoracic pathologies
              </strong>{" "}
              from chest X-rays using a deep learning model. Upload an image for
              instant risk assessment with explainable heatmaps.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />{" "}
                DenseNet-121
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> GradCAM
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> 224×224
              </span>
            </div>
          </section>

          <UploadZone />
          <ResultPanel />
        </main>
      ) : (
        <LogPanel />
      )}
    </div>
  )
}
