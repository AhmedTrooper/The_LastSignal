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
};

export const EAGLE_AUDIO: EagleMedia[] = [
  { kind: "audio", src: `${ALSJ}a11a1023114-4746.mp3`, title: "The landing loop", source: `${ALSJ}a11.landing.html`, credit: "NASA mission audio · Apollo Lunar Surface Journal", description: "The air-to-ground recording covers powered descent, the computer alarms, and touchdown. This is an extended archive clip; use the timeline to explore it." },
  { kind: "audio", src: `${ALSJ}a11a1091545-1101226.mp3`, title: "The first steps", source: `${ALSJ}a11.step.html`, credit: "NASA mission audio · Apollo Lunar Surface Journal", description: "Listen to the crew preparing to step onto the surface and beginning their moonwalk. The accompanying journal provides the full transcript." },
  { kind: "audio", src: `${ALSJ}a11a1101216-1105300.mp3`, title: "Voices across the distance", source: `${ALSJ}a11.mobility.html`, credit: "NASA mission audio · Apollo Lunar Surface Journal", description: "An extended recording of lunar mobility, the presidential call, and the surface work that followed." },
  { kind: "audio", src: `${ALSJ}A11_Ascent_FD_plus_onboard_audio.mp3`, title: "Leaving the Moon", source: `${ALSJ}a11.launch.html`, credit: "NASA recordings · ALSJ synchronized Flight Director and onboard audio", description: "A synchronized presentation of the Flight Director loop and onboard recording during lunar ascent." },
];

export const EAGLE_DESCENT_FILM: EagleMedia = {
  kind: "video",
  src: `${ALSJ}a11-16mm-mag-c.mp4`,
  title: "Through Eagle’s window",
  source: `${ALSJ}a11.landing.html`,
  credit: "NASA · Apollo 11 16 mm film · ALSJ",
  description: "The onboard camera looks out over the lunar surface during descent. This is archival film; it is not a live camera or a simulated view.",
};
