import type { Story } from "./types";
import { OPPORTUNITY } from "./opportunity";
import { RANGER_7 } from "./ranger-7";
import { APOLLO_11_LANDER } from "./apollo-11-lander";

/** Heroes with a cinematic story; the rest keep the chaptered story view. */
export const STORIES: Record<string, Story> = {
  opportunity: OPPORTUNITY,
  "ranger-7": RANGER_7,
  "apollo-11-lander": APOLLO_11_LANDER,
};

export type { Story, Scene, Cam } from "./types";
