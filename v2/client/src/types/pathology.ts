export const PATHOLOGIES = [
  "Atelectasis",
  "Consolidation",
  "Edema",
  "Emphysema",
  "Fibrosis",
  "Effusion",
  "Pleural Thickening",
  "Cardiomegaly",
  "Mass",
  "Hernia",
  "Lung Opacity",
  "Enlarged Cardiomedia",
] as const

export type PathologyName = (typeof PATHOLOGIES)[number]

export const PATHOLOGY_OP_POINTS: Record<PathologyName, number> = {
  Atelectasis: 0.07422872,
  Consolidation: 0.038290843,
  Edema: 0.023601074,
  Emphysema: 0.0022490358,
  Fibrosis: 0.010060724,
  Effusion: 0.103246614,
  "Pleural Thickening": 0.026791653,
  Cardiomegaly: 0.050318155,
  Mass: 0.01939503,
  Hernia: 0.042889766,
  "Lung Opacity": 0.20204692,
  "Enlarged Cardiomedia": 0.05015312,
}
