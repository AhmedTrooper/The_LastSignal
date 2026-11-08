import { VIKING_TWO_SOURCES as S } from "./viking-two-sources";
import type { VikingTwoScene } from "./viking-two-scenes";

type Investigation = { title: string; source: string; options: { label: string; scene: VikingTwoScene; explanation: string }[] };
export const VIKING_TWO_INVESTIGATIONS: Record<string, Investigation> = {
  "a-leaning-arrival": { title: "A radio backup is not a landing joystick.", source: S.landing.url, options: [
    { label: "Landing guidance", scene: "descent", explanation: "Onboard guidance controlled descent. Radio delay made real-time piloting from Earth impractical whether the high-gain link worked or not." },
    { label: "Orbiter attitude", scene: "link-loss", explanation: "The orbiter’s backup inertial reference restored stabilization automatically. This was a different job from steering the lander." },
    { label: "Low-gain data", scene: "relay", explanation: "NASA’s history describes a small engineering stream through the low-gain antenna. High-rate link loss was not a complete three-hour blackout." },
  ] },
  "beneath-mister-badger": { title: "What changed when the rock moved?", source: S.rock.url, options: [
    { label: "Before the push", scene: "shelter", explanation: "A rock covered a different sampling location from exposed soil. Shelter was a reason to investigate, not proof of life or a known million-year history." },
    { label: "After the push", scene: "push", explanation: "The photographs verified that the rock called Mister Badger moved. The backhoe also disturbed some soil; a rock push did not leave an untouched laboratory sample." },
    { label: "Sampling plan", scene: "sample-plan", explanation: "The October 8 caption describes sampling planned for October 11 and later analysis. It does not show an immediate scoop before sunlight could destroy everything." },
  ] },
  "ears-that-heard-the-wind": { title: "Could the interesting signal still be wind?", source: S.seismicReport.url, options: [
    { label: "Look at the signal", scene: "seismometer", explanation: "A detector measures motion. A signal shape alone does not establish its source. This drawing is not the recorded Sol 80 waveform." },
    { label: "Check the weather", scene: "uncertain", explanation: "Wind observations were missing within 20 minutes of the event. Nearby quiet conditions could not exclude a brief gust during that gap." },
    { label: "Compare explanations", scene: "wind", explanation: "A natural seismic event and a wind gust remained possible. Calling the event a confirmed magnitude-2.8 quake would turn a model-dependent interpretation into a fact." },
  ] },
  "a-winter-postcard": { title: "Separate the observation from the explanation.", source: S.frost.url, options: [
    { label: "What the image shows", scene: "frost", explanation: "NASA describes a thin water-ice coating on the rocks and soil in the May 18, 1979 photograph. Its relay to Earth occurred later, on June 7." },
    { label: "Proposed formation", scene: "grains", explanation: "The caption proposes dust grains carrying water and carbon dioxide ice, then carbon dioxide returning to the air. The remaining material includes water and dust—not guaranteed pure ice." },
    { label: "Compare another season", scene: "seasons", explanation: "Frost had appeared a Martian year earlier and lasted about 100 days then. That comparison is not a guarantee for every winter or proof of buried ice directly under Viking." },
  ] },
};

export type VikingTwoRelayState = "empty" | "stored" | "at-orbiter" | "on-earth";
export type VikingTwoRelayAction = "store" | "pass" | "forward" | "reset";
export function vikingTwoRelayStep(state: VikingTwoRelayState, action: VikingTwoRelayAction): VikingTwoRelayState {
  if (action === "reset") return "empty";
  if (state === "empty" && action === "store") return "stored";
  if (state === "stored" && action === "pass") return "at-orbiter";
  if (state === "at-orbiter" && action === "forward") return "on-earth";
  return state;
}
export const VIKING_TWO_RELAY: Record<VikingTwoRelayState, { scene: VikingTwoScene; explanation: string }> = {
  empty: { scene: "sampler", explanation: "Begin by storing an observation. This lesson follows the roles in a communications chain, not an actual scheduled pass or measured transfer rate." },
  stored: { scene: "sample-plan", explanation: "The lander’s recorder holds the observation until it can be transmitted. Storage and taking a photograph are different jobs." },
  "at-orbiter": { scene: "relay", explanation: "The lander’s UHF link passes the observation to an orbiter. The real frost caption identifies Viking Orbiter 1 as its relay to Earth." },
  "on-earth": { scene: "orbit", explanation: "The orbiter forwards the observation to Earth. The May 18 frost picture arrived by relay June 7; those are distinct dates, not a video of this teaching sequence." },
};
