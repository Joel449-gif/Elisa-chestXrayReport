import type { ModelConfig } from "./index"

const RAW_CONFIG: ModelConfig = {
  imageSize: 224,
  imageScale: 1024,
  outputNode: "Sigmoid_435",
  labels: [
    "Atelectasis",
    "Consolidation",
    "",
    "",
    "Edema",
    "Emphysema",
    "Fibrosis",
    "Effusion",
    "",
    "Pleural Thickening",
    "Cardiomegaly",
    "",
    "Mass",
    "Hernia",
    "",
    "",
    "Lung Opacity",
    "Enlarged Cardiomedia",
  ],
  scaleUpper: 1.3,
  opPoints: [
    0.07422872, 0.038290843, 0.09814756, 0.0098118475, 0.023601074,
    0.0022490358, 0.010060724, 0.103246614, 0.056810737, 0.026791653,
    0.050318155, 0.023985857, 0.01939503, 0.042889766, 0.053369623,
    0.035975814, 0.20204692, 0.05015312,
  ],
}

export function getModelConfig(): ModelConfig {
  return RAW_CONFIG
}
