import { GRAIL_SOURCES as S } from "./grail-sources";
import type { GrailScene } from "./grail-scenes";

type Investigation = { title: string; source: string; options: { label: string; scene: GrailScene; explanation: string }[] };
export const GRAIL_INVESTIGATIONS: Record<string, Investigation> = {
  "a-long-way-to-the-moon": { title: "Slow can be smarter.", source: S.mission.url, options: [
    { label: "Sprint straight there", scene: "cruise", explanation: "A fast direct route is possible, but the low-energy L1 path helped the ultra-stable clocks settle and reduced braking fuel." },
    { label: "Low-energy L1 route", scene: "l1", explanation: "Passing near Sun–Earth L1 and returning to the Moon is slower, yet it matches arrival speed more gently and keeps the clocks in steadier sunlight." },
    { label: "Student names", scene: "names", explanation: "Ebb and Flow were chosen by Emily Dickinson Elementary fourth-graders in a national contest. Names are history, not navigation data." },
  ] },
  "cosmic-tag": { title: "What does the link measure?", source: S.registryA.url, options: [
    { label: "Distance only", scene: "link", explanation: "A single distance cannot show how gravity changes the twins’ motion. LGRS measures range-rate: how fast the separation changes." },
    { label: "Separation speed", scene: "link", explanation: "When gravity tugs one twin, the separation speed changes for a moment. Those tiny speed changes map hidden mass." },
    { label: "Surface photo", scene: "moonkam", explanation: "MoonKAM took more than 115,000 student-targeted images, but the gravity map came from the radio link, not from the pictures." },
  ] },
  "lower-and-sharper": { title: "Why fly lower?", source: S.mission.url, options: [
    { label: "Stay high forever", scene: "primary", explanation: "A high orbit is safer, but small gravity signals fade faster with altitude, so fine features are harder to resolve." },
    { label: "Drop lower for detail", scene: "low", explanation: "The extended mission accepted a lower orbit so closer passes could sharpen the gravity map, while the team managed the stronger lunar tug." },
    { label: "Lower is always better", scene: "resolution", explanation: "Too low can shorten life or raise risk. Lower helped resolution here, but it was a mission choice, not a free upgrade." },
  ] },
  "the-x-ray-moon": { title: "Separate map from photo.", source: S.porosity.url, options: [
    { label: "Gravity map", scene: "map", explanation: "PIA16587 is the lunar gravity field from GRAIL measurements. It is not a surface photograph." },
    { label: "Porosity map", scene: "porosity", explanation: "PIA16588 depicts highland-crust porosity from bulk density and Apollo grain-density data. It is not the crust-thickness map." },
    { label: "Buried dikes", scene: "dikes", explanation: "Long gravity signatures are interpreted as buried magma dikes. They are inferred from gravity, not seen as surface cracks." },
  ] },
};

export type GrailMasconState = "approach" | "stretch" | "recover";
export type GrailMasconAction = "approach" | "pass" | "reset";
export function grailMasconStep(state: GrailMasconState, action: GrailMasconAction): GrailMasconState {
  if (action === "reset") return "approach";
  if (state === "approach" && action === "approach") return "stretch";
  if (state === "stretch" && action === "pass") return "recover";
  return state;
}
export const GRAIL_MASCON: Record<GrailMasconState, { scene: GrailScene; gap: number; explanation: string }> = {
  approach: { scene: "mascon", gap: 0, explanation: "The lead twin nears a hidden mass concentration. No signal has changed yet; this is the starting lineup, not a measurement." },
  stretch: { scene: "link", gap: 18, explanation: "Extra gravity pulls the lead twin a little faster, so the separation grows for a moment. LGRS records the range-rate change." },
  recover: { scene: "farside", gap: 0, explanation: "After passing the mass, the pull reverses and the trailing twin catches up. The later change helps locate the hidden mass." },
};

export type GrailBurnState = "orbit" | "burning" | "empty" | "impact";
export type GrailBurnAction = "burn" | "deplete" | "impact" | "reset";
export function grailBurnStep(state: GrailBurnState, action: GrailBurnAction): GrailBurnState {
  if (action === "reset") return "orbit";
  if (state === "orbit" && action === "burn") return "burning";
  if (state === "burning" && action === "deplete") return "empty";
  if (state === "empty" && action === "impact") return "impact";
  return state;
}
export const GRAIL_BURN: Record<GrailBurnState, { scene: GrailScene; explanation: string }> = {
  orbit: { scene: "low", explanation: "Before the burn, the twins are in their low extended-mission orbit with very little propellant left." },
  burning: { scene: "burn", explanation: "About 50 minutes before impact, each twin fired until propellant was depleted: Ebb for 4 min 3 s, Flow for 5 min 7 s." },
  empty: { scene: "burn", explanation: "The empty-tank burn measured the true remaining fuel so engineers could validate fuel models for future missions." },
  impact: { scene: "impact", explanation: "Ebb impacted at 22:28:51 UTC and Flow 30 seconds later, both at about 1.68 km/s on the Sally K. Ride mountain." },
};
