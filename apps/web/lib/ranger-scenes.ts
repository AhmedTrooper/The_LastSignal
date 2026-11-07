export type RangerScene =
  | "telescope"
  | "tower"
  | "cameras"
  | "radio"
  | "failures"
  | "spark"
  | "corona"
  | "lockout"
  | "launch"
  | "peanuts"
  | "sunlock"
  | "burn"
  | "first-photo"
  | "guericke"
  | "soil"
  | "downlink"
  | "final-frame"
  | "static"
  | "cognitum"
  | "crater";

/** One scene per authored beat, used by the cloud reader and the four-panel comic. */
export const RANGER_ART_SCENES: Record<string, RangerScene[]> = {
  "six-eyed-tower": ["telescope", "tower", "cameras", "radio"],
  "six-failures": ["failures", "spark", "corona", "lockout"],
  "lucky-peanuts": ["launch", "peanuts", "sunlock", "burn"],
  "seventeen-minutes": ["first-photo", "guericke", "soil", "downlink"],
  "mare-cognitum": ["final-frame", "static", "cognitum", "crater"],
};
