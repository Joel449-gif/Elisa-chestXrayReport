import { Header } from "./components/Header"
import { UploadZone } from "./components/UploadZone"
import { PredictionPanel } from "./components/PredictionPanel"

export function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <UploadZone />
        <PredictionPanel />
      </main>
    </div>
  )
}
