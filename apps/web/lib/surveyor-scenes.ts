export type SurveyorScene = "launch" | "antenna" | "guide" | "approach" | "retro" | "jettison" | "radar" | "touchdown" | "mirror" | "footpad" | "soil" | "panorama" | "night" | "wakeup" | "shade" | "tile" | "radio" | "quiet" | "orbiter" | "shadow";
export const SURVEYOR_ART_SCENES: Record<string, readonly SurveyorScene[]> = {
  "a-question-in-flight": ["guide", "launch", "antenna", "approach"],
  "three-feet-down": ["retro", "jettison", "radar", "touchdown"],
  "a-footprint-and-a-picture": ["mirror", "footpad", "soil", "panorama"],
  "through-the-long-night": ["night", "wakeup", "shade", "tile"],
  "the-long-shadow": ["radio", "quiet", "orbiter", "shadow"],
};
