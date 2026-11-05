import type { EagleComponentId } from "./eagle-components";

export type EagleComicScene = "quiet" | "body" | "thermal" | "alarm" | "priorities" | "boulders" | "unpack" | "camera" | "seismic" | "mirror" | "broken" | "pen" | "goodbye";
export type EagleComicPanel = { title: string; bubble: string; narration: string; scene: EagleComicScene };
export type EagleComicIssue = {
  id: string; title: string; subtitle: string; challenge: string;
  panels: EagleComicPanel[];
  steps: string[];
  components: EagleComponentId[];
  discovery: { title: string; hardware: string; knowledge: string; legacy: string };
  source: string;
};

/** Imagined machine dialogue; engineering and event explanations retain their source context. */
export const EAGLE_COMIC_ISSUES: EagleComicIssue[] = [
  {
    id: "spider", title: "The Spider Wrapped in Gold", subtitle: "Why my strange shape made sense", challenge: "A world without useful air or familiar ground",
    panels: [
      { title: "A visitor in the dust", scene: "quiet", bubble: "You found me! Four feet, a gold-coloured blanket, and a story I’ve been keeping for you.", narration: "The part of Eagle left at Tranquility Base is the descent stage. Its imagined voice welcomes you into a memory of the complete lunar module." },
      { title: "Two halves. Two jobs.", scene: "body", bubble: "No air thick enough for airplane wings here. My landing stage went down; my crew cabin could go back up.", narration: "The lunar module did not need an airplane’s shape. Its descent stage carried the landing engine and legs, while the ascent stage had the cabin and its own engine." },
      { title: "A blanket and clever knees", scene: "thermal", bubble: "My shiny layers helped manage heat. Crushable metal inside my legs helped soften the landing.", narration: "Gold-coloured multilayer insulation was not a wrapper made of solid gold. Aluminium honeycomb in the landing gear was designed to absorb energy by crushing." },
    ],
    steps: ["blanket", "legs"],
    components: ["ascent", "descent", "insulation", "honeycomb", "legs"],
    discovery: { title: "One machine. Two endings.", hardware: "Insulation protected equipment; landing gear absorbed landing loads.", knowledge: "A stable landing gave the crew and their instruments a place to work.", legacy: "A separate ascent stage could depart without carrying the landing engine and legs back to orbit." },
    source: "https://www.nasa.gov/wp-content/uploads/static/apollo50th/pdf/A11_MissionReport.pdf",
  },
  {
    id: "overload", title: "Brain Overload & the Boulder Trap", subtitle: "Software and people working together", challenge: "Glitch: too much computer work. Then rough ground.",
    panels: [
      { title: "1202!", scene: "alarm", bubble: "An alarm lit my display. My computer had too much work—but I was still flying.", narration: "Unexpected rendezvous-radar work contributed to executive-overflow alarms. The warning did not mean that essential guidance had stopped." },
      { title: "Keep the important work", scene: "priorities", bubble: "My software protected the guidance tasks. Houston checked the recovery and told the crew to keep going.", narration: "The guidance software, developed under Margaret Hamilton’s leadership at MIT, preserved essential work through restart protection. Mission Control assessed the alarms, and Charlie Duke relayed the GO decision to the crew." },
      { title: "A place for my feet", scene: "boulders", bubble: "Boulders ahead! Neil took partial manual control and guided me toward clearer ground.", narration: "Armstrong steered beyond rough terrain during the final approach. Post-flight analysis put usable fuel at about 45 seconds, including the abort allowance—not a live percentage in this comic." },
    ],
    steps: ["guidance", "landing"],
    components: ["guidance", "rcs", "engine", "legs"],
    discovery: { title: "Warnings need understanding, not panic.", hardware: "Restart protection preserved essential guidance; the crew could control the final approach.", knowledge: "Software, engineering measurements, and human judgment worked together to make the landing possible.", legacy: "Safety-critical systems still depend on carefully managing essential work. This is a shared engineering principle, not a claim that every modern device uses Eagle’s exact software." },
    source: "https://apollojournals.org/alsj/a11/a11.landing.html",
  },
  {
    id: "science", title: "The Mirror & the Moonquake Ear", subtitle: "The discoveries packed inside me", challenge: "How do you study a world from its surface?",
    panels: [
      { title: "Open the science chest", scene: "unpack", bubble: "The crew opened my equipment bay. Our landing site was about to become a little science outpost.", narration: "Armstrong and Aldrin removed surface experiments from the SEQ bay. The hardware helped turn a short visit into observations that could be studied on Earth." },
      { title: "An ear against the ground", scene: "seismic", bubble: "The seismic package listened for tiny movements. It even picked up the crew’s footsteps during deployment.", narration: "The passive seismic experiment was levelled on the surface and its solar panels unfolded. Ground motions became data for scientists; they did not prove that future Moon bases would be free of seismic hazards." },
      { title: "A reply made of light", scene: "mirror", bubble: "A hundred corner cubes. No battery! Send light toward them, and they return it toward its source.", narration: "Repeated observations of the lunar reflector arrays measure the Moon’s motion and provide evidence about its interior, including a fluid core. The reflector is passive; it is not transmitting radio messages." },
    ],
    steps: ["seismic", "laser"],
    components: ["seismometer", "reflector", "solarWind", "dust"],
    discovery: { title: "The equipment stayed. The knowledge came home.", hardware: "A seismic instrument sensed ground motion; corner cubes returned incoming laser light.", knowledge: "Seismic and laser-ranging observations opened different ways to investigate the Moon. Long-term ranging measures its recession at about 3.8 centimetres per year.", legacy: "A passive reflector needs no electrical power. The animation shows the method, not a live measurement or an actual laser sent from this app." },
    source: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/",
  },
  {
    id: "goodbye", title: "The Marker Pen & the Goodbye", subtitle: "How staying behind helped them leave", challenge: "A damaged control—and a final job to do",
    panels: [
      { title: "A tiny broken knob", scene: "broken", bubble: "Buzz found the engine-arm breaker’s knob broken off. The crew still had to prepare my cabin for liftoff.", narration: "The journal places the damaged engine-arm circuit breaker on Buzz’s Panel 16. The knob was damaged; the entire circuit had not been replaced by a pen." },
      { title: "An everyday tool", scene: "pen", bubble: "Buzz used a felt-tip pen to push the breaker in. Houston later confirmed that the circuitry looked fine.", narration: "The pen helped operate a damaged control. It did not instantly ignite the engine, and our tool-choice demonstration does not recreate every electrical check performed by the crew." },
      { title: "My last job was to stay", scene: "goodbye", bubble: "My cabin carried Neil and Buzz back toward Columbia. My landing stage stayed. Thank you for remembering that part of the journey.", narration: "The descent stage served as the launch platform for the ascent stage. A plaque and other equipment remained at the site, which was later photographed from lunar orbit." },
    ],
    steps: ["breaker", "ascent", "beacon"],
    components: ["breaker", "ascent", "descent", "plaque"],
    discovery: { title: "Abandoned, but not forgotten.", hardware: "The damaged breaker could still be pushed in; the descent stage became the launch platform.", knowledge: "Problem-solving and a two-stage design helped the crew return. Later mission records and orbital images let us study what remained.", legacy: "Your thank-you beacon is symbolic and saved only on this device. It does not contact Eagle or light a real plaque on the Moon." },
    source: "https://apollojournals.org/alsj/a11/a11.launch.html#1232043",
  },
];

export type EagleComicProgress = { issue: number; panel: number; actions: Record<string, string[]>; collected: string[] };
export const EMPTY_EAGLE_COMIC: EagleComicProgress = { issue: 0, panel: 0, actions: {}, collected: [] };
export const EAGLE_COMIC_SAVE = "rv:eagle:comic-issues:v1";

export function comicIssueReady(issue: EagleComicIssue, actions: string[]): boolean {
  return issue.steps.every(step => actions.includes(step));
}

export function readEagleComicProgress(raw: string | null): EagleComicProgress {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || !Number.isInteger(value.issue) || value.issue < 0 || value.issue >= EAGLE_COMIC_ISSUES.length || !Number.isInteger(value.panel) || value.panel < 0 || value.panel > 5 || !Array.isArray(value.collected) || !value.actions || typeof value.actions !== "object" || Array.isArray(value.actions)) return EMPTY_EAGLE_COMIC;
    const ids = EAGLE_COMIC_ISSUES.map(issue => issue.id);
    if (!value.collected.every((id: unknown) => typeof id === "string" && ids.includes(id))) return EMPTY_EAGLE_COMIC;
    const actions: Record<string, string[]> = {};
    for (const issue of EAGLE_COMIC_ISSUES) {
      const steps = value.actions[issue.id] ?? [];
      if (!Array.isArray(steps) || !steps.every(step => issue.steps.includes(step))) return EMPTY_EAGLE_COMIC;
      actions[issue.id] = [...new Set<string>(steps)];
    }
    const collected: string[] = [];
    for (const candidate of EAGLE_COMIC_ISSUES) {
      if (!value.collected.includes(candidate.id) || !comicIssueReady(candidate, actions[candidate.id])) break;
      collected.push(candidate.id);
    }
    const issue = Math.min(value.issue, collected.length);
    const panel = value.panel === 5 && collected.length !== EAGLE_COMIC_ISSUES.length ? 0 : value.panel === 4 && !comicIssueReady(EAGLE_COMIC_ISSUES[issue], actions[EAGLE_COMIC_ISSUES[issue].id]) ? 3 : value.panel;
    return { issue, panel, actions, collected };
  } catch { return EMPTY_EAGLE_COMIC; }
}
