import { EAGLE_COMPONENTS, type EagleComponentId } from "./eagle-components";

const PLACEMENTS: { id: EagleComponentId; label: string; x: number; y: number }[] = [
  { id: "ascent", label: "My crew cabin", x: 50, y: 38 },
  { id: "descent", label: "My landing stage", x: 51, y: 65 },
  { id: "legs", label: "My landing feet", x: 24, y: 84 },
  { id: "engine", label: "My landing engine", x: 51, y: 83 },
  { id: "ladder", label: "My ladder", x: 39, y: 73 },
  { id: "sband", label: "My Earth link", x: 70, y: 26 },
  { id: "rcs", label: "My steering rockets", x: 35, y: 48 },
];

export const EAGLE_KID_PARTS = PLACEMENTS.map(part => ({ ...part, line: EAGLE_COMPONENTS[part.id].job, why: EAGLE_COMPONENTS[part.id].why, source: EAGLE_COMPONENTS[part.id].source }));
