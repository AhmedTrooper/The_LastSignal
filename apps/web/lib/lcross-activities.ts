import type { LcrossScene } from "./lcross-scenes";
import { LCROSS_SOURCES as S } from "./lcross-sources";

export const LCROSS_IMPACT_STEPS = [
  { scene: "separate", label: "Separate the roles", action: "Follow the observer’s maneuver", explanation: "The Centaur is the impactor. The shepherd carries the science instruments and separates before the impact." },
  { scene: "plan", label: "Create an observing interval", action: "Follow the Centaur", explanation: "A braking maneuver makes the shepherd arrive later. This teaching diagram does not command a spacecraft or simulate the exact trajectory." },
  { scene: "impact", label: "Centaur impact", action: "Look at the observations", explanation: "The first impact exposes lunar material. The objective is a measurement, not a spectacular visible explosion." },
  { scene: "observe", label: "Observe and transmit", action: "Follow the final impact", explanation: "The shepherd observes the event and sends data to Earth. Multiple instruments provide complementary evidence." },
  { scene: "final", label: "Shepherd impact", action: "Start again", explanation: "The observer impacts too, ending the flight. Its returned records remain available for analysis." },
] as const satisfies readonly { scene: LcrossScene; label: string; action: string; explanation: string }[];

export type LcrossRecoveryState = "noisy-backup" | "restored-rates" | "protected";
export function lcrossRecoveryStep(state: LcrossRecoveryState, action: "restore-rates" | "revise-protection" | "reset"): LcrossRecoveryState {
  if (action === "reset") return "noisy-backup";
  if (action === "restore-rates" && state === "noisy-backup") return "restored-rates";
  if (action === "revise-protection" && state === "restored-rates") return "protected";
  return state;
}
export const LCROSS_RECOVERY: Record<LcrossRecoveryState, { scene: LcrossScene; explanation: string }> = {
  "noisy-backup": { scene: "noise", explanation: "Noisy backup rate estimates are being treated as real motion. The controller over-corrects and consumes propellant." },
  "restored-rates": { scene: "recover", explanation: "The IRU was still functional. Returning to its rate information reduced thruster firing. A remaining task is to improve fault protection and backup control." },
  protected: { scene: "conserve", explanation: "The team revised sensor-switching rules, backup control and excessive-usage safeguards. Other mission activities were also changed to conserve propellant." },
};

export const LCROSS_INVESTIGATIONS: Record<string, { title: string; source: string; options: { label: string; scene: LcrossScene; explanation: string }[] }> = {
  "a-stage-with-another-job": { title: "Give the used hardware a new role.", source: S.overview.url, options: [
    { label: "Inspect the ring", scene: "ring", explanation: "An ESPA ring provided the structural starting point. Panels, instruments, propulsion and tests made it a spacecraft—not simply a spacer with cameras taped on." },
    { label: "Inspect the Centaur", scene: "separate", explanation: "The used launch stage became the impactor. Its motion could excavate material that the shepherd’s instruments would study." },
    { label: "Inspect the shadow", scene: "shadow", explanation: "Hydrogen detections suggested a question about water. A dark crater floor cannot be identified as pure ice just because it is cold." },
  ] },
  "light-with-a-water-clue": { title: "What does the water estimate describe?", source: S.water.url, options: [
    { label: "Read the number", scene: "estimate", explanation: "The reported concentration is 5.6 ± 2.9% water by mass at the LCROSS impact site. The uncertainty is part of the result." },
    { label: "Check the location", scene: "shadow", explanation: "This is a local estimate from an impact experiment. It is not a survey showing 5.6% water in every crater or across the whole south pole." },
    { label: "Compare the instruments", scene: "spectra", explanation: "Camera appearance, near-infrared patterns and ultraviolet observations play different roles. Spectroscopic evidence helps identify composition; a bright cloud alone does not." },
  ] },
  "the-impact-that-kept-teaching": { title: "Different instruments. Different ways to observe.", source: S.laterCrater.url, options: [
    { label: "Reflected light", scene: "later", explanation: "An ordinary visible-light camera needs illumination. The crater floor’s shadow makes this difficult; darkness is not a chemical measurement." },
    { label: "Thermal radiation", scene: "infrared", explanation: "Thermal instruments can detect emitted radiation and changes in heat. A warm spot does not by itself prove that it contains water." },
    { label: "Radar", scene: "radar", explanation: "Mini-RF sends a radar signal and measures the return. Before/after comparisons help search for a surface change; processing and uncertainty still matter." },
    { label: "Very faint light", scene: "faint-light", explanation: "ShadowCam on Danuri uses faint reflected sunlight. The 2024 study combined it with radar observations to investigate the likely Centaur crater, not to certify two craters or operating spacecraft." },
  ] },
};
