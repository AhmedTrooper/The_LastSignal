import { PHOENIX_SOURCES as S } from "./phoenix-sources";
import type { PhoenixScene } from "./phoenix-scenes";

type Investigation = { title: string; source: string; options: { label: string; scene: PhoenixScene; explanation: string }[] };
export const PHOENIX_INVESTIGATIONS: Record<string, Investigation> = {
  "risen-from-the-ashes": { title: "A photo is a viewpoint, not the whole landing.", source: S.descent.url, options: [
    { label: "Descent photo", scene: "parachute", explanation: "HiRISE saw Phoenix hanging from its parachute with a crater behind it. Phoenix was actually about 20 km in front of the crater, above flatter ground." },
    { label: "Touchdown clock", scene: "touchdown", explanation: "NASA Science gives 23:38:38 UT spacecraft time; NSSDCA gives 23:53:44 UT Earth-received time. The two clocks are different, not contradictory." },
    { label: "Resurrected hardware", scene: "launch", explanation: "Phoenix reused earlier mission hardware and instruments. Reuse is an engineering decision, not proof that every spare part behaved the same way." },
  ] },
  "holy-cow-and-vanishing-ice": { title: "What does disappearing prove?", source: S.mission.url, options: [
    { label: "One white photo", scene: "trench", explanation: "A bright patch in one image could be ice, salt or another bright material. A later change is stronger evidence." },
    { label: "Four-day change", scene: "vanished", explanation: "Bright trench material vaporized within four days. NASA’s summary concludes it was probably water ice, while the oven test later added chemical evidence." },
    { label: "Under-lander view", scene: "underneath", explanation: "The arm camera documented exposed icy material near a footpad. That view supports the ice story but does not by itself assay the material." },
  ] },
  "tasting-the-water": { title: "Delivery is part of science.", source: S.water.url, options: [
    { label: "Oven only", scene: "melt", explanation: "TEGA can identify gases from heating, but the sample still has to reach the oven. Clumps, sticks and short circuits are part of the measurement chain." },
    { label: "Scoop handling", scene: "sticky", explanation: "NASA’s release says icy samples stuck in the sun-warmed scoop and were handled more easily after air exposure. Technique changed the result." },
    { label: "Water result", scene: "melt", explanation: "The July 31 release reports laboratory identification of water in a TEGA sample. That is stronger than a photograph alone." },
  ] },
  "friendly-soil-and-laser-snow": { title: "Ground history vs. today’s sky.", source: S.snowSoil.url, options: [
    { label: "Soil carbonate", scene: "beakers", explanation: "TEGA and MECA both gave carbonate evidence, pointing to past interaction with liquid water. It does not prove present liquid water at the site." },
    { label: "Perchlorate", scene: "perchlorate", explanation: "Perchlorate salts were found in the soil. They affect chemistry and freezing, but their presence alone does not prove living organisms." },
    { label: "Laser snow", scene: "laser", explanation: "The laser detected snow from clouds about 2.5 miles up, vaporizing before the ground. Falling snow and soil history are different kinds of evidence." },
  ] },
};

export type PhoenixTrenchState = "sol20" | "sol24";
export type PhoenixTrenchAction = "compare" | "reset";
export function phoenixTrenchStep(state: PhoenixTrenchState, action: PhoenixTrenchAction): PhoenixTrenchState {
  if (action === "reset") return "sol20";
  if (state === "sol20" && action === "compare") return "sol24";
  return state;
}
export const PHOENIX_TRENCH: Record<PhoenixTrenchState, { scene: PhoenixScene; explanation: string }> = {
  sol20: { scene: "trench", explanation: "After digging, bright clumps are visible in Dodo Goldilocks. This is the starting observation, not yet the conclusion." },
  sol24: { scene: "vanished", explanation: "Four days later the bright clumps are gone. The change supports volatile water ice, while the later oven test identifies the water chemically." },
};

export type PhoenixWinterState = "summer" | "dark" | "after";
export type PhoenixWinterAction = "darken" | "return" | "reset";
export function phoenixWinterStep(state: PhoenixWinterState, action: PhoenixWinterAction): PhoenixWinterState {
  if (action === "reset") return "summer";
  if (state === "summer" && action === "darken") return "dark";
  if (state === "dark" && action === "return") return "after";
  return state;
}
export const PHOENIX_WINTER: Record<PhoenixWinterState, { scene: PhoenixScene; explanation: string }> = {
  summer: { scene: "panorama", explanation: "In northern summer the Sun stayed above the horizon for weeks, powering the lander and its instruments." },
  dark: { scene: "lazarus", explanation: "As autumn deepened, solar energy fell and the last signal arrived on November 2, 2008. Winter frost then accumulated through the dark season." },
  after: { scene: "shadow", explanation: "HiRISE’s 2010 view shows a changed shadow, interpreted as likely west-panel collapse under winter CO2 frost. The image is evidence for an interpretation, not a direct load measurement." },
};
