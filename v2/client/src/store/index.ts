import { create } from "zustand"
import type { UploadState, InferenceMode } from "../types"
import type { Pathology } from "../types"

export interface PredictionItem {
  id: string
  filename: string
  previewUrl: string
  pathologies: Pathology[]
  rawLogits: number[]
  timestamp: number
}

interface AppState {
  /* upload */
  upload: UploadState
  setUpload: (upload: Partial<UploadState>) => void

  /* predictions */
  predictions: PredictionItem[]
  addPrediction: (pred: PredictionItem) => void
  clearPredictions: () => void

  /* settings */
  inferenceMode: InferenceMode
  setInferenceMode: (mode: InferenceMode) => void

  /* ui */
  darkMode: boolean
  toggleDarkMode: () => void
}

export const useAppStore = create<AppState>((set) => ({
  /* upload */
  upload: { status: "idle", filename: null, previewUrl: null },
  setUpload: (partial) =>
    set((state) => ({ upload: { ...state.upload, ...partial } })),

  /* predictions */
  predictions: [],
  addPrediction: (pred) =>
    set((state) => ({ predictions: [pred, ...state.predictions] })),
  clearPredictions: () => set({ predictions: [] }),

  /* settings */
  inferenceMode: "server",
  setInferenceMode: (mode) => set({ inferenceMode: mode }),

  /* ui */
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}))
