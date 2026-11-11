/** Per-beat storyboards, shared by comic and scroll views. Names are stable narration/scene keys. */
export const LRV_ART_SCENES = {
  "a-car-in-a-cupboard": ["folded", "mesh-wheel", "battery-pair", "crew-cargo"],
  "the-wheels-unfold": ["launch", "deployment", "controller", "checkout"],
  "another-way-to-steer": ["front-fault", "rear-steering", "navigation", "elbow-route"],
  "the-seatbelt-passenger": ["seatbelt", "missing-photo", "vesicles", "sample-ct"],
  "uphill-to-a-white-rock": ["front-return", "slope", "genesis", "sample-bags"],
  "a-wall-with-layers": ["rille", "layered-wall", "core-sample", "return-route"],
  "parked-to-watch": ["tv-camera", "earth-antenna", "falcon-ascent", "parked"],
  "the-wheels-stayed-the-clues-travelled": ["traverse-record", "landing-map", "lab-record", "legacy"],
} as const;
export const PATHFINDER_ART_SCENES = {
  "two-jobs-one-journey": ["two-machines", "name-card", "launch", "mission-goals"],
  "the-landing-that-bounced": ["heat-shield", "parachute", "airbags", "petals"],
  "a-ramp-not-yet-a-road": ["blocked-ramp", "rollout", "station-and-rover", "radio-chain"],
  "the-rocks-with-nicknames": ["rock-targets", "apxs", "hazard-check", "rock-comparison"],
  "the-station-watched-the-sky": ["weather-mast", "clouds", "wind", "radio-science"],
  "the-week-became-a-longer-journey": ["rover-trail", "mission-record", "power-management", "extended-mission"],
  "a-carrier-is-not-a-conversation": ["chimp", "carrier", "broken-link", "unknown-rover"],
  "the-record-outlived-the-link": ["panorama", "data-records", "orbiter", "legacy"],
} as const;
export type LrvScene = typeof LRV_ART_SCENES[keyof typeof LRV_ART_SCENES][number];
export type PathfinderScene = typeof PATHFINDER_ART_SCENES[keyof typeof PATHFINDER_ART_SCENES][number];
