import { VIKING_SOURCES as S } from "./viking-sources";
import type { VikingScene } from "./viking-scenes";

export type VikingSamplerState = "stuck" | "inspected" | "tested" | "released";
export type VikingSamplerAction = "inspect" | "test" | "try-command" | "reset";
export function vikingSamplerStep(state: VikingSamplerState, action: VikingSamplerAction): VikingSamplerState {
  if (action === "reset") return "stuck";
  if (state === "stuck" && action === "inspect") return "inspected";
  if (state === "inspected" && action === "test") return "tested";
  if (state === "tested" && action === "try-command") return "released";
  return state;
}
export const VIKING_SAMPLER: Record<VikingSamplerState, { scene: VikingScene; explanation: string }> = {
  stuck: { scene: "jam", explanation: "The scoop cannot deliver soil. Begin with the camera evidence instead of applying more force." },
  inspected: { scene: "jam", explanation: "A stuck locking pin is the verified problem. Cameras help inspect progress; the exact pin number and temperature in the draft are not established here. Test a plan on the Earth duplicate next." },
  tested: { scene: "testbed", explanation: "NASA’s account describes commands tested on a duplicate lander, with cameras checking each step. This is a simplified teaching order, not a replay of the actual command sequence." },
  released: { scene: "scoop", explanation: "The carefully tested commands freed the real sampler, and images showed the pin on the ground. Viking collected soil on July 28. This control does not operate a spacecraft." },
};

export const VIKING_LAB_TESTS = [
  { label: "Gas Exchange", scene: "reaction", explanation: "Look for changing gases around soil exposed to humidity and nutrients. Gas release is an observation; chemical reactions can happen without organisms.", source: S.launchHistory.url },
  { label: "Labeled Release", scene: "reaction", explanation: "Add carbon-tagged nutrients, then watch for tagged gas. A response and a control help investigate possible metabolism, but a single response cannot settle the life question.", source: S.launchHistory.url },
  { label: "Pyrolytic Release", scene: "laboratory", explanation: "Ask whether carbon from tagged gases becomes incorporated into the soil. This is a different question from whether a nutrient-treated sample releases gas.", source: S.launchHistory.url },
  { label: "Organic analysis", scene: "organics", explanation: "GCMS searched for organic compounds. Detection limits and heating affect interpretation. Phoenix’s perchlorate finding prompted later laboratory work—not a definitive answer to all Viking life tests.", source: S.biologyReview.url },
] satisfies { label: string; scene: VikingScene; explanation: string; source: string }[];

export const VIKING_POWER_VIEWS = [
  { label: "Clearer sky", scene: "power", explanation: "A solar panel needs incoming sunlight. An RTG uses heat from natural radioactive decay instead. Viking’s batteries supported peak loads; both available power and equipment needs still limited operations." },
  { label: "Dustier sky", scene: "weather", explanation: "Dust can reduce light reaching a solar panel, but it does not switch off radioactive decay. This comparison illustrates the different energy sources, not an exact storm, power reading or guaranteed RTG output." },
] satisfies { label: string; scene: VikingScene; explanation: string }[];

export type VikingTeachingTarget = "unused" | "antenna";
/** A two-region analogy, not Viking's flight memory addresses or a real mission command validator. */
export function checkVikingTeachingWrite(target: VikingTeachingTarget) {
  return target === "unused"
    ? { allowed: true, radioParametersPreserved: true, explanation: "In this teaching grid, the update fits the unused region and preserves the radio information. Real flight changes require much more testing than this single check." }
    : { allowed: false, radioParametersPreserved: true, explanation: "The overlap check blocks the update: that region holds radio-pointing information. JPL reported such information was overwritten in Viking. This diagram does not reconstruct the real memory map or prove that a single check could have saved the mission." };
}
