import type { Story } from "./types";
import { OPPORTUNITY } from "./opportunity";
import { SPIRIT } from "./spirit";
import { INGENUITY } from "./ingenuity";
import { INSIGHT } from "./insight";
import { RANGER_7 } from "./ranger-7";
import { APOLLO_11_LANDER } from "./apollo-11-lander";
import { VIKING_1 } from "./viking-1";
import { VIKING_2 } from "./viking-2";
import { MARS_POLAR_LANDER } from "./mars-polar-lander";
import { SURVEYOR_1 } from "./surveyor-1";
import { LCROSS } from "./lcross";
import { GRAIL } from "./grail";

/** Heroes with a cinematic story; the rest keep the chaptered story view. */
export const STORIES: Record<string, Story> = {
  opportunity: OPPORTUNITY,
  spirit: SPIRIT,
  ingenuity: INGENUITY,
  insight: INSIGHT,
  "ranger-7": RANGER_7,
  "apollo-11-lander": APOLLO_11_LANDER,
  "viking-1": VIKING_1,
  "viking-2": VIKING_2,
  "mars-polar-lander": MARS_POLAR_LANDER,
  "surveyor-1": SURVEYOR_1,
  lcross: LCROSS,
  grail: GRAIL,
};

export type { Story, Scene, Cam } from "./types";
