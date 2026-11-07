export type LcrossScene = "ring" | "launch" | "shadow" | "plan" | "thrusters" | "noise" | "recover" | "conserve" | "separate" | "impact" | "observe" | "transmit" | "plume" | "spectra" | "estimate" | "volatiles" | "final" | "bandwidth" | "later" | "record" | "infrared" | "radar" | "faint-light";
export const LCROSS_ART_SCENES: Record<string, readonly LcrossScene[]> = {
  "a-stage-with-another-job": ["ring", "launch", "shadow", "plan"],
  "the-fuel-scare": ["thrusters", "noise", "recover", "conserve"],
  "two-impacts-one-experiment": ["separate", "impact", "observe", "transmit"],
  "light-with-a-water-clue": ["plume", "spectra", "estimate", "volatiles"],
  "the-impact-that-kept-teaching": ["final", "bandwidth", "later", "record"],
};
