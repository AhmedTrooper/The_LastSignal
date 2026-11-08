export type MplScene = "launch" | "target" | "microchip" | "microphone" | "drop" | "shatter" | "pierce" | "drill" | "descent" | "snap" | "latch" | "cutoff" | "fall" | "silence" | "search" | "frost" | "hirise" | "twin" | "rules" | "reborn" | "memory";
export const MPL_ART_SCENES: Record<string, readonly MplScene[]> = {
  "carrying-names-and-a-microphone": ["launch", "target", "microchip", "microphone"],
  "amundsen-and-scott": ["drop", "shatter", "pierce", "drill"],
  "the-fatal-latch": ["snap", "latch", "cutoff", "fall"],
  "searching-the-ice": ["silence", "search", "frost", "hirise"],
  "lessons-and-phoenix": ["twin", "rules", "reborn", "memory"],
};
