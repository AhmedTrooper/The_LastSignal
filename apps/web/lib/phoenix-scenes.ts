export type PhoenixScene = "launch" | "descent" | "parachute" | "touchdown" | "panorama" | "underneath" | "trench" | "vanished" | "clump" | "vibrator" | "sticky" | "melt" | "beakers" | "perchlorate" | "brine" | "laser" | "lazarus" | "frost" | "shadow" | "dvd";
export const PHOENIX_ART_SCENES: Record<string, readonly PhoenixScene[]> = {
  "risen-from-the-ashes": ["launch", "descent", "parachute", "touchdown"],
  "holy-cow-and-vanishing-ice": ["panorama", "underneath", "trench", "vanished"],
  "tasting-the-water": ["clump", "vibrator", "sticky", "melt"],
  "friendly-soil-and-laser-snow": ["beakers", "perchlorate", "brine", "laser"],
  "a-winter-farewell": ["lazarus", "frost", "shadow", "dvd"],
};
