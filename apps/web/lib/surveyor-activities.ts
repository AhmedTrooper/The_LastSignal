import type { SurveyorScene } from "./surveyor-scenes";
import { SURVEYOR_SOURCES as S } from "./surveyor-sources";

export const SURVEYOR_DESCENT = [
  { scene: "approach", label: "Approach", action: "Begin the braking sequence", explanation: "The altitude-marking radar starts an automatic sequence. Rocket ignition follows after a delay; the mark itself is not the ignition." },
  { scene: "retro", label: "Main braking", action: "Follow the spent casing", explanation: "The main solid retrorocket removes most of the approach speed. The smaller vernier engines also operate during this phase." },
  { scene: "jettison", label: "Casing discarded", action: "Follow radar feedback", explanation: "The spent casing is discarded. It stays on the Moon as used hardware; its precise resting coordinates have not been verified here." },
  { scene: "radar", label: "Controlled descent", action: "Follow the final drop", explanation: "Radar altitude and motion readings feed the controller, which regulates vernier thrust. The engines cut off close to the surface." },
  { scene: "touchdown", label: "Three-point touchdown", action: "Start again", explanation: "A short free fall ends on shock-absorbing legs. The reported contact span is 19 milliseconds. This diagram shows the order, not reconstructed flight telemetry." },
] as const satisfies readonly { scene: SurveyorScene; label: string; action: string; explanation: string }[];

export function nextSurveyorDescent(step: number) { return Math.min(Math.max(0, step) + 1, SURVEYOR_DESCENT.length - 1); }

/** Ideal vertical mast on level ground; result is in mast heights, never measured lunar meters. */
export function surveyorShadowRatio(sunElevation: number) {
  const angle = Number.isFinite(sunElevation) ? Math.min(75, Math.max(15, sunElevation)) : 45;
  return 1 / Math.tan(angle * Math.PI / 180);
}

export const SURVEYOR_INVESTIGATIONS: Record<string, { title: string; source: string; options: { label: string; scene: SurveyorScene; explanation: string }[] }> = {
  "a-question-in-flight": { title: "Which part of the antenna story do we know?", source: S.landing.url, options: [
    { label: "During the flight", scene: "antenna", explanation: "Antenna A did not show the expected deployment. The team could use Antenna B, but could not establish A’s exact position." },
    { label: "After the landing", scene: "radio", explanation: "Radio readings and photographs confirmed Antenna A was extended. They did not reveal whether braking or touchdown released it." },
  ] },
  "a-footprint-and-a-picture": { title: "Aim the mirror. Compare the evidence.", source: S.reportTwo.url, options: [
    { label: "Look at the footpad", scene: "footpad", explanation: "A footpad and the surrounding disturbed ground show what the landing did locally. Part II estimates penetration with assumptions, not a perfectly known depth." },
    { label: "Add the leg readings", scene: "soil", explanation: "Strain gauges add information about forces during landing. Multiple soil models can fit these readings; dynamic impact resistance is not the same as a unique static bearing capacity." },
    { label: "Look toward the horizon", scene: "panorama", explanation: "Turning the camera’s mirror built a wider view from many frames. Rocks and craters elsewhere remind us that one supported landing is not a guarantee for every site." },
  ] },
  "through-the-long-night": { title: "Does more charging always help?", source: S.extended.url, options: [
    { label: "Face the Sun", scene: "wakeup", explanation: "After contact returned, carefully orienting the panel allowed the weakened battery to recharge." },
    { label: "Reduce charging", scene: "shade", explanation: "During the later overheating, the team turned the panel away to reduce charging. Engineers suspected an internal battery short; no new part was delivered to the Moon." },
    { label: "Inspect the broken tile", scene: "tile", explanation: "The broken thermal-radiator segment was a real scar, but its reported performance effect was negligible. A visible defect is not automatically the cause of every problem." },
  ] },
};
