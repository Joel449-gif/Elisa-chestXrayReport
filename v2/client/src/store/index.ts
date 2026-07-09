import { create } from "zustand"
import type { UploadState, InferenceMode } from "../types"
import type { Pathology } from "../types"

export interface LogEntry {
  id: string
  timestamp: number
  message: string
  severity: "info" | "success" | "warning" | "error"
  filename?: string
  pathologies?: Pathology[]
}

export interface PredictionItem {
  id: string
  filename: string
  previewUrl: string
  pathologies: Pathology[]
  rawLogits: number[]
  timestamp: number
}

export type ViewTab = "analysis" | "log"

export interface Notification {
  message: string
  type: "success" | "error"
}

interface AppState {
  upload: UploadState
  setUpload: (upload: Partial<UploadState>) => void

  predictions: PredictionItem[]
  addPrediction: (pred: PredictionItem) => void
  clearPredictions: () => void

  inferenceMode: InferenceMode
  setInferenceMode: (mode: InferenceMode) => void

  darkMode: boolean
  toggleDarkMode: () => void

  activeView: ViewTab
  setActiveView: (view: ViewTab) => void

  notification: Notification | null
  setNotification: (n: Notification | null) => void

  logs: LogEntry[]
  addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void
  clearLogs: () => void
}

export const useAppStore = create<AppState>((set) => ({
  upload: { status: "idle", filename: null, previewUrl: null },
  setUpload: (partial) =>
    set((state) => ({ upload: { ...state.upload, ...partial } })),

  predictions: [],
  addPrediction: (pred) =>
    set((state) => ({ predictions: [pred, ...state.predictions] })),
  clearPredictions: () => set({ predictions: [] }),

  inferenceMode: "server",
  setInferenceMode: (mode) => set({ inferenceMode: mode }),

  darkMode: true,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  activeView: "analysis",
  setActiveView: (view) => set({ activeView: view }),

  notification: null,
  setNotification: (n) => set({ notification: n }),

  logs: [],
  addLog: (entry) =>
    set((state) => ({
      logs: [
        { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
        ...state.logs,
      ],
    })),
  clearLogs: () => set({ logs: [] }),
}))
