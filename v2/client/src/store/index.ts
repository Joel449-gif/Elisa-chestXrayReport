import { create } from "zustand"
import type { UploadState, InferenceMode } from "../types"
import type { Pathology } from "../types"

export interface LogEntry {
  id: string
  timestamp: number
  message: string
  severity: "info" | "success" | "warning" | "error"
}

export interface PredictionItem {
  id: string
  filename: string
  previewUrl: string
  pathologies: Pathology[]
  rawLogits: number[]
  timestamp: number
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

  logs: LogEntry[]
  addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void
  clearLogs: () => void
  showLogs: boolean
  toggleLogs: () => void
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

  logs: [],
  addLog: (entry) =>
    set((state) => ({
      logs: [
        { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
        ...state.logs,
      ],
    })),
  clearLogs: () => set({ logs: [] }),
  showLogs: false,
  toggleLogs: () => set((state) => ({ showLogs: !state.showLogs })),
}))
