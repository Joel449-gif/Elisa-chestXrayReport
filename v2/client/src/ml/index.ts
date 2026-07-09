/**
 * ML Engine — clean entry point.
 * All ML logic lives here with zero DOM dependencies.
 */

export { preprocessChestXray, applyModelNormalization } from "./preprocessing"
export { calibrateProbabilities, prepareClassifierInput } from "./classifier"
export { computeGradCAM } from "./explainer"
export { segmentLungs } from "./segmentation"

export type { ClassifierInput, ClassifierOutput } from "./classifier"
export type { SaliencyMap } from "./explainer"
export type { SegmentationResult } from "./segmentation"
export type { ProcessedImage } from "./preprocessing"
