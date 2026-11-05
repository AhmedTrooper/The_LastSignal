export type EaglePerspective = { label: string; view: string; reply: string; photoIndex?: number };
export type EagleInvitation = { line: string; question: string; choices: EaglePerspective[] };

/** Choices change the viewpoint and activity; the historical sequence stays anchored to the record. */
export const EAGLE_INVITATIONS: Record<string, EagleInvitation> = {
  undocking: {
    line: "Michael stayed in Columbia. Neil and Buzz came with me. For a moment, we could see each other through our windows.",
    question: "Where would you like to be?",
    choices: [
      { label: "At Michael’s window", view: "undocking-film", reply: "You’re watching from Columbia now. That little spacecraft turning outside is me. Michael was checking my landing gear." },
      { label: "Inside your engineering", view: "mechanism", reply: "Two halves, each with its own job. Release the docking connection and watch me leave Columbia behind." },
    ],
  },
  alarm: {
    line: "A warning lit my display: 1202. I was still flying. Someone had to decide whether we could keep going.",
    question: "Would you listen, or look inside?",
    choices: [
      { label: "Put me on the radio loop", view: "landing-audio", reply: "Listen for Neil’s alarm call, then Charlie Duke’s GO. Real voices, making a real decision." },
      { label: "Show me how you coped", view: "mechanism", reply: "My computer had too much work. Watch what happens when essential guidance takes priority." },
    ],
  },
  touchdown: {
    line: "Boulders ahead. Neil took partial manual control. I needed somewhere to put my feet.",
    question: "Want the view, or the controls?",
    choices: [
      { label: "Let me see the ground", view: "descent-film", reply: "This film came from Buzz’s window. Watch the terrain slip underneath us, then the dust as we get close." },
      { label: "Let me guide you down", view: "game", reply: "Take the controls in this illustrative 3D approach. Find clear ground, brake sideways, and settle gently. The original film shows what the real crew experienced." },
    ],
  },
  "first-step": {
    line: "Neil was on my ladder. A small pull on a lanyard gave Earth a way to watch what happened next.",
    question: "Which part of the moment is yours?",
    choices: [
      { label: "I want to hear it", view: "first-step-audio", reply: "The recording is longer than the famous sentence. Stay a while with the voices around that first step." },
      { label: "How did Earth see it?", view: "mechanism", reply: "Pull the lanyard. My hinged MESA bay lowers, opening the television camera’s view of the ladder." },
    ],
  },
  science: {
    line: "They unpacked a little science station from my body. One instrument listened. Another could answer Earth without a battery.",
    question: "What would you investigate?",
    choices: [
      { label: "Send some light home", view: "mechanism", reply: "Send a pulse toward the corner cubes. They return light toward its source. Years of timing those returns revealed the Moon’s slow retreat." },
      { label: "Something that listened", view: "photo", photoIndex: 1, reply: "That is the seismic package. It was sensitive enough to pick up the astronauts’ footsteps during deployment." },
    ],
  },
  breaker: {
    line: "A broken circuit-breaker knob. A felt-tip pen. Sometimes the smallest things are part of getting people home.",
    question: "Look inside the cabin, or outside it?",
    choices: [
      { label: "Show me Buzz’s solution", view: "mechanism", reply: "On Buzz’s Panel 16, a pen pushed the damaged breaker in. Try closing the simplified circuit." },
      { label: "What would stay behind?", view: "photo", reply: "The plaque stayed on my ladder. My upper half would take the crew away; this message, and the landing stage beneath it, would remain." },
    ],
  },
  liftoff: {
    line: "My cabin rose with Neil and Buzz inside. My lower half stayed. Bringing them home was always the plan.",
    question: "Which half will you follow?",
    choices: [
      { label: "Ride with the cabin", view: "ascent-film", reply: "The camera starts after liftoff. Watch the ground recede as my ascent stage heads back toward Columbia." },
      { label: "Stay with the landing stage", view: "mechanism", reply: "Separate the stages. The part with the landing legs becomes a launch pad—and the part left on the Moon." },
    ],
  },
  monument: {
    line: "A little shape. A long shadow. Now you know the machine beside the footprints. Thank you for staying with me.",
    question: "Shall we bring your story back to my console?",
    choices: [],
  },
};
