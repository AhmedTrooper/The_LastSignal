export type VikingTwoScene = "twins" | "link-loss" | "descent" | "tilt" | "sampler" | "shelter" | "push" | "sample-plan" | "seismometer" | "wind" | "uncertain" | "ground" | "summer" | "frost" | "grains" | "seasons" | "relay" | "battery" | "memorial" | "orbit";
export const VIKING_TWO_ART_SCENES: Record<string, readonly VikingTwoScene[]> = {
  "a-leaning-arrival": ["twins", "link-loss", "descent", "tilt"],
  "beneath-mister-badger": ["sampler", "shelter", "push", "sample-plan"],
  "ears-that-heard-the-wind": ["seismometer", "wind", "uncertain", "ground"],
  "a-winter-postcard": ["summer", "frost", "grains", "seasons"],
  "a-relay-and-a-resting-place": ["relay", "battery", "memorial", "orbit"],
};
