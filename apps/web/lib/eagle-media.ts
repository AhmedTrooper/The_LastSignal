/** ALSJ's current home is linked by https://www.nasa.gov/history/alsj-and-afj/.
 * Media URLs checked against the journal on 5 November 2026.
 */
export const ALSJ = "https://apollojournals.org/alsj/a11/";

export type EagleMedia = {
  kind: "audio" | "video";
  src: string;
  title: string;
  source: string;
  credit: string;
  description: string;
  id?: string;
  phase?: string;
  perspective?: string;
  transcript?: { get: string; who: string; text: string }[];
};

export const EAGLE_AUDIO: EagleMedia[] = [
  { kind: "audio", src: `${ALSJ}a11a1023114-4746.mp3`, title: "The landing loop", source: `${ALSJ}a11.landing.html`, credit: "NASA mission audio · Apollo Lunar Surface Journal", description: "The air-to-ground recording covers powered descent, the computer alarms, and touchdown. This is an extended archive clip; use the timeline to explore it." },
  { kind: "audio", src: `${ALSJ}a11a1091545-1101226.mp3`, title: "The first steps", source: `${ALSJ}a11.step.html`, credit: "NASA mission audio · Apollo Lunar Surface Journal", description: "Listen to the crew preparing to step onto the surface and beginning their moonwalk. The accompanying journal provides the full transcript." },
  { kind: "audio", src: `${ALSJ}a11a1101216-1105300.mp3`, title: "Voices across the distance", source: `${ALSJ}a11.mobility.html`, credit: "NASA mission audio · Apollo Lunar Surface Journal", description: "An extended recording of lunar mobility, the presidential call, and the surface work that followed." },
  { kind: "audio", src: `${ALSJ}A11_Ascent_FD_plus_onboard_audio.mp3`, title: "Leaving the Moon", source: `${ALSJ}a11.launch.html`, credit: "NASA recordings · ALSJ synchronized Flight Director and onboard audio", description: "A synchronized presentation of the Flight Director loop and onboard recording during lunar ascent." },
];

export const EAGLE_DESCENT_FILM: EagleMedia = {
  id: "descent-film",
  kind: "video",
  src: `${ALSJ}Apollo_11_Lunar_Landing_clipped_5min0sec_border_final_720x720.mp4`,
  title: "Through Eagle’s window",
  source: `${ALSJ}a11.landing.html`,
  credit: "NASA · Apollo 11 16 mm film · ALSJ",
  description: "The final five minutes of descent, recorded through Buzz Aldrin’s window. Follow the changing view as Eagle approaches the lunar surface. This ALSJ presentation uses original 16 mm film.",
  phase: "20 July 1969 · Powered descent",
  perspective: "Aboard Eagle · Aldrin’s window",
};

export const EAGLE_FILMS: EagleMedia[] = [
  {
    id: "undocking-film", kind: "video", src: `${ALSJ}a11-16mm-mag-c.mp4`,
    title: "The moment we parted", phase: "20 July 1969 · Lunar orbit",
    perspective: "Aboard Columbia · Michael Collins’s view",
    source: "https://apollojournals.org/afj/ap11fj/17day5-undock-doi.html",
    credit: "NASA · Apollo 11 magazine C · Apollo Flight / Lunar Surface Journals",
    description: "Columbia’s camera watches Eagle separate and turn for an inspection. The landing gear is already extended. Look for the two triangular cockpit windows and the long contact probes below the footpads.",
  },
  EAGLE_DESCENT_FILM,
  {
    id: "ascent-film", kind: "video", src: `${ALSJ}a11ascent16mm.mp4`,
    title: "The ground falls away", phase: "21 July 1969 · Lunar ascent",
    perspective: "Aboard Eagle’s ascent stage",
    source: `${ALSJ}a11.launch.html#1242202`,
    credit: "NASA · Apollo 11 16 mm film · ALSJ / Ken Glover / Mark Gray",
    description: "The camera starts about six seconds after liftoff. Watch the terrain recede beneath the departing cabin. The descent stage has become the launch pad left behind. This is the MP4 edition of ALSJ’s ascent reel.",
  },
];

export const EAGLE_FLIGHT_DIRECTOR: EagleMedia = {
  id: "flight-director", kind: "audio", src: `${ALSJ}A11_landing_FD_loop.mp3`,
  title: "Inside Mission Control", phase: "20 July 1969 · The Flight Director loop",
  source: `${ALSJ}a11.landing.html`, credit: "NASA mission audio · ALSJ / Colin Mackellar",
  description: "Listen to the Flight Director’s loop during the approach. This extended recording starts earlier than the air-to-ground clip; the two players are independent archive recordings.",
};

/** IDs let the story, console and film library share the same checked sources. */
export const EAGLE_MEDIA: Record<string, EagleMedia> = {
  "landing-audio": { ...EAGLE_AUDIO[0], id: "landing-audio", phase: "20 July 1969 · Air-to-ground loop", transcript: [
    { get: "102:38:30", who: "Neil Armstrong", text: "It’s a 1202." },
    { get: "102:38:53", who: "Charlie Duke", text: "We’re Go on that alarm." },
    { get: "102:45:40", who: "Buzz Aldrin", text: "Contact Light." },
  ] },
  "first-step-audio": { ...EAGLE_AUDIO[1], id: "first-step-audio", phase: "21 July 1969 · First steps" },
  "surface-audio": { ...EAGLE_AUDIO[2], id: "surface-audio", phase: "21 July 1969 · Surface exploration" },
  "ascent-audio": { ...EAGLE_AUDIO[3], id: "ascent-audio", phase: "21 July 1969 · Returning to orbit", transcript: [
    { get: "124:22:02", who: "Buzz Aldrin · onboard", text: "We’re off." },
    { get: "124:22:11", who: "Neil Armstrong · onboard", text: "The Eagle has wings." },
  ] },
  "flight-director": EAGLE_FLIGHT_DIRECTOR,
  ...Object.fromEntries(EAGLE_FILMS.map(film => [film.id!, film])),
};
