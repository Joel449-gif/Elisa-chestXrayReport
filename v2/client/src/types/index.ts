export interface Pathology {
  name: string
  probability: number
  opPoint: number
}

export interface ModelConfig {
  imageSize: number
  imageScale: number
  outputNode: string
  labels: string[]
  scaleUpper: number | null
  opPoints: number[]
}

export interface PredictionResult {
  filename: string
  pathologies: Pathology[]
  rawLogits: number[]
  processingTimeMs: number
}

export interface SegmentationMask {
  maskBase64: string
  width: number
  height: number
}

export interface ExplanationMap {
  heatmapBase64: string
  width: number
  height: number
  pathologyIndex: number
  method: "gradcam" | "gradient"
}

export interface UploadState {
  status: "idle" | "uploading" | "processing" | "done" | "error"
  filename: string | null
  previewUrl: string | null
  error?: string
}

export type InferenceMode = "client" | "server"
