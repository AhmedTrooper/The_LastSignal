import type { Story } from "./types";
import { OPPORTUNITY } from "./opportunity";
import { RANGER_7 } from "./ranger-7";

/** Heroes with a cinematic story; the rest keep the chaptered story view. */
export const STORIES: Record<string, Story> = {
  opportunity: OPPORTUNITY,
  "ranger-7": RANGER_7,
};

export type { Story, Scene, Cam } from "./types";
