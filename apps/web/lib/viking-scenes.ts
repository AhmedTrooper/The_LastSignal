export type VikingScene = "protect" | "site" | "descent" | "touchdown" | "scan" | "jam" | "testbed" | "scoop" | "laboratory" | "reaction" | "organics" | "perchlorate" | "power" | "weather" | "relativity" | "endurance" | "battery" | "memory" | "recovery" | "orbit";
export const VIKING_ART_SCENES: Record<string, readonly VikingScene[]> = {
  "a-careful-arrival": ["protect", "site", "descent", "touchdown"],
  "a-picture-and-a-stuck-pin": ["scan", "jam", "testbed", "scoop"],
  "soil-with-a-surprise": ["laboratory", "reaction", "organics", "perchlorate"],
  "a-patient-weather-watcher": ["power", "weather", "relativity", "endurance"],
  "a-silent-link-a-lasting-record": ["battery", "memory", "recovery", "orbit"],
};
