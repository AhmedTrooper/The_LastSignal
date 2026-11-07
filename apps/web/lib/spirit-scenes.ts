export type SpiritScene = "landing" | "basalt" | "earth" | "hills" | "files" | "reset" | "bypass" | "clean" | "goethite" | "wind" | "summit" | "plate" | "wheel" | "scrape" | "scan" | "springs" | "trap" | "testbed" | "winter" | "archive";
export const SPIRIT_ART_SCENES: Record<string, readonly SpiritScene[]> = {
  "a-rocky-welcome": ["landing", "basalt", "earth", "hills"],
  "a-fresh-start": ["files", "reset", "bypass", "clean"],
  "the-view-from-the-hill": ["goethite", "wind", "summit", "plate"],
  "the-clue-under-my-wheel": ["wheel", "scrape", "scan", "springs"],
  "the-record-that-stayed": ["trap", "testbed", "winter", "archive"],
};
