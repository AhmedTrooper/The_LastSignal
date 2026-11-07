export type IngenuityScene = "ride" | "fabric" | "rotors" | "hover" | "camera" | "timing" | "tilt" | "landing" | "scout" | "backshell" | "parachute" | "records" | "winter" | "sensor" | "backup" | "patch" | "sand" | "damage" | "memory";
export const INGENUITY_ART_SCENES: Record<string, readonly IngenuityScene[]> = {
  "a-new-sky": ["ride", "fabric", "rotors", "hover"],
  "the-missing-picture": ["camera", "timing", "tilt", "landing"],
  "the-gear-left-behind": ["scout", "parachute", "backshell", "records"],
  "a-backup-sense": ["winter", "sensor", "backup", "patch"],
  "a-record-for-the-future": ["sand", "damage", "patch", "memory"],
};
