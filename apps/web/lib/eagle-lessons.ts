import type { EagleComicScene } from "./eagle-comic";
import type { EagleComponentId } from "./eagle-components";

export type EagleLesson = { components: EagleComponentId[]; question: string; answer: string; art: EagleComicScene; issue: string };

export function eagleIllustrationContext(memory: string): string {
  if (memory === "undocking") return "An exploded design view: the two stages are shown apart to explain their jobs. They remained joined during the landing.";
  if (memory === "first-step") return "A simplified view of the MESA bay and camera. This is not a drawing of the separate rear science-equipment bay.";
  if (memory === "liftoff") return "The drawing illustrates stage separation. The original onboard ascent film starts after liftoff.";
  if (memory === "monument") return "A drawing of the descent stage that stayed behind—not a live image from the Moon.";
  return "An illustration of the hardware and its role—not to scale and not a reconstructed telemetry frame.";
}

/** Every memory is about named equipment and its role—not a generic space adventure. */
export const EAGLE_LESSONS: Record<string, EagleLesson> = {
  undocking: { components: ["ascent", "descent", "sband"], question: "Why did Eagle have two halves?", answer: "One stage could land the crew and support their work. The other could take the cabin back to orbit, leaving the landing equipment behind.", art: "body", issue: "spider" },
  alarm: { components: ["guidance", "rcs"], question: "How could a warning appear while Eagle kept flying?", answer: "The software protected essential guidance tasks. People in Mission Control assessed the recovery and told the crew they could continue.", art: "priorities", issue: "overload" },
  touchdown: { components: ["engine", "legs", "honeycomb"], question: "What gave the science a place to begin?", answer: "Controlled descent and landing gear helped Eagle reach and stand on clear ground. That made the crew's surface work possible.", art: "boulders", issue: "overload" },
  "first-step": { components: ["ladder", "mesa", "sband"], question: "How did a box of equipment become a window for Earth?", answer: "Lowering the MESA bay exposed the television camera's view of the ladder. The camera and radio link helped people on Earth follow the first steps.", art: "camera", issue: "spider" },
  science: { components: ["seismometer", "reflector", "solarWind", "dust"], question: "What could a few instruments tell us about a whole world?", answer: "Different tools measured different things: ground motion, returning light, solar-wind material, and changes in solar-cell performance.", art: "mirror", issue: "science" },
  breaker: { components: ["breaker", "ascent"], question: "Why did a tiny control matter to a big journey?", answer: "The crew needed to prepare the ascent stage for departure. A pen let Aldrin push in a damaged control; Houston then confirmed the circuitry looked fine.", art: "pen", issue: "goodbye" },
  liftoff: { components: ["ascent", "descent", "rcs"], question: "How did staying behind help the crew leave?", answer: "The landing stage became a launch platform. The lighter, separate cabin could depart with its own engine for rendezvous with Columbia.", art: "goodbye", issue: "goodbye" },
  monument: { components: ["descent", "plaque", "reflector"], question: "What can we learn from equipment that no longer sends a signal?", answer: "Mission records and later orbital photographs preserve its story. The separate passive reflector returns light when observatories illuminate it; Eagle itself is not sending live messages.", art: "quiet", issue: "goodbye" },
};
