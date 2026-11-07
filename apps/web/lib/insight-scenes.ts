export type InsightScene = "earth" | "relay" | "lander" | "solar" | "wind" | "deployment" | "shield" | "seismic" | "mole" | "soil" | "scoop" | "dust" | "cleaning" | "quiet" | "archive";

export const INSIGHT_ART_SCENES: Record<string, readonly InsightScene[]> = {
  "a-place-to-listen": ["earth", "relay", "lander", "solar"],
  "an-ear-on-the-ground": ["wind", "deployment", "shield", "seismic"],
  "the-stubborn-soil": ["mole", "soil", "scoop", "mole"],
  "sand-in-the-wind": ["dust", "scoop", "cleaning", "solar"],
  "quiet-not-forgotten": ["dust", "quiet", "seismic", "archive"],
};
