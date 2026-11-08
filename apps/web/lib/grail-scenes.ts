export type GrailScene = "launch" | "cruise" | "l1" | "arrival" | "names" | "twins" | "link" | "mascon" | "farside" | "moonkam" | "primary" | "descent" | "low" | "resolution" | "map" | "crust" | "porosity" | "dikes" | "burn" | "impact" | "memorial" | "craters";
export const GRAIL_ART_SCENES: Record<string, readonly GrailScene[]> = {
  "a-long-way-to-the-moon": ["launch", "cruise", "arrival", "names"],
  "cosmic-tag": ["twins", "link", "mascon", "moonkam"],
  "lower-and-sharper": ["primary", "descent", "low", "resolution"],
  "the-x-ray-moon": ["map", "crust", "porosity", "dikes"],
  "a-place-named-for-sally": ["burn", "impact", "memorial", "craters"],
};
