import type { SpiritScene } from "./spirit-scenes";
import { SPIRIT_SOURCES as S } from "./spirit-sources";

type Investigation = { title: string; source: string; choices: { label: string; scene: SpiritScene; explanation: string }[] };
export const SPIRIT_INVESTIGATIONS: Record<string, Investigation> = {
  "a-rocky-welcome": { title: "What changes when we look closer?", source: S.grinding.url, choices: [
    { label: "Inspect a dusty rock", scene: "basalt", explanation: "A camera shows the rock’s surface. Dust and weathering can hide information about its interior." },
    { label: "Expose the interior", scene: "goethite", explanation: "The Rock Abrasion Tool ground a shallow patch into Adirondack. Instruments could then examine fresh material rather than just its surface coating." },
    { label: "Look back at Earth", scene: "earth", explanation: "Navcam and Pancam supplied different parts of the Earth composite. Image processing made a faint point easier to see; it did not turn that point into a close-up planet." },
  ] },
  "the-view-from-the-hill": { title: "Same summit. Two starting levels.", source: S.climb.url, choices: [
    { label: "Start from the plains", scene: "summit", explanation: "The September 1, 2005 report puts the summit 82 meters above the edge of the surrounding plains." },
    { label: "Start from the landing site", scene: "hills", explanation: "The same report puts it 106 meters above Spirit’s landing site. A different reference level changes the measured height, not the hill." },
    { label: "Follow a mineral clue", scene: "goethite", explanation: "Goethite identified in Clovis contains hydroxyl in its structure. That is a clue about water-related alteration, not a photograph of an ancient lake." },
  ] },
  "the-record-that-stayed": { title: "Which way would help the panels face the winter Sun?", source: S.stationary.url, choices: [
    { label: "Keep the southward lean", scene: "winter", explanation: "At Spirit’s site, the winter Sun stayed in the northern sky. A southward lean made the energy problem harder." },
    { label: "Improve the northward tilt", scene: "testbed", explanation: "The team tried to reduce the southward tilt to collect more sunlight. Choosing this in a teaching model cannot free the real rover or guarantee survival." },
    { label: "Inspect the later orbital view", scene: "archive", explanation: "In March 2011, HiRISE saw a bright reflection from Spirit’s panels. Viewing geometry explains that brightness; it was not evidence that the rover had resumed transmitting." },
  ] },
};

/** A short teaching sequence based on the recovery reports, not executable rover commands. */
export type SpiritRecoveryState = "resetting" | "bypassed" | "stable" | "reformatted";
export type SpiritRecoveryAction = "restart" | "bypass" | "delete-files" | "reformat" | "reset-model";
export function spiritRecoveryStep(state: SpiritRecoveryState, action: SpiritRecoveryAction): SpiritRecoveryState {
  if (action === "reset-model") return "resetting";
  if (action === "bypass" && state === "resetting") return "bypassed";
  if (action === "delete-files" && state === "bypassed") return "stable";
  if (action === "reformat" && state === "stable") return "reformatted";
  return state;
}
export const SPIRIT_RECOVERY: Record<SpiritRecoveryState, { scene: SpiritScene; explanation: string }> = {
  resetting: { scene: "reset", explanation: "Restarting still leaves the same flash files in place. Try the recovery mode that avoids flash." },
  bypassed: { scene: "bypass", explanation: "A temporary mode avoids flash memory. Engineers can investigate and remove unnecessary files." },
  stable: { scene: "clean", explanation: "After file deletion, normal boot was stable by February 1. Engineers then reformatted as a precaution." },
  reformatted: { scene: "clean", explanation: "The February 5 report confirmed successful reformatting the previous day. The mission could continue; this did not guarantee that memory would never fail again." },
};
