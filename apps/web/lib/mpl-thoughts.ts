import { MPL_BOOK } from "./machine-books/mars-polar-lander";
import { MPL_PHOTOS } from "./mpl-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const MPL_CLOUD_DIRECTION = Object.fromEntries(MPL_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const MPL_THOUGHTS = buildThoughtMoments(MPL_BOOK, MPL_CLOUD_DIRECTION);
export const MPL_AUDIO_MANIFEST = buildNarrationManifest(MPL_BOOK, MPL_THOUGHTS);
export const MPL_THOUGHT_EDITION: ThoughtEdition = {
  book: MPL_BOOK, moments: MPL_THOUGHTS, theme: "mars", cover: MPL_PHOTOS.cover,
  bookmarkKey: "rv:mars-polar-lander:scroll:v1", manifestUrl: "/api/stories/mars-polar-lander/narration", evidenceUrl: "/api/stories/mars-polar-lander/evidence",
  opening: { kicker: "Mars / Mars Polar Lander / the silent pioneer", title: "A microphone.", emphasis: "A missing signal.", introduction: "We flew to the south pole with student names, a microphone, two tiny penetrators — and a software warning we never got to send.", invitation: "Follow the launch, the penetrators, the latch, the search and the lessons." },
  preface: { label: "Bottom of the world", text: "Layered ice, long silence, and a map drawn from orbit." },
  ending: "We rested unseen in the polar ice, but the lessons traveled onward. Every later lander flew with a louder voice.",
  directions: {
    "carrying-names-and-a-microphone": { place: "Cape Canaveral / Planum Australe", date: "1999", tone: "night" },
    "amundsen-and-scott": { place: "Cruise ring / polar subsurface", date: "3 December 1999", tone: "paper" },
    "the-fatal-latch": { place: "Parachute / powered descent", date: "3 December 1999", tone: "night" },
    "searching-the-ice": { place: "Planum Australe / orbital search", date: "1999–2000 and later", tone: "paper", photographs: { 0: MPL_PHOTOS.site, 1: MPL_PHOTOS.search } },
    "lessons-and-phoenix": { place: "Investigation / Phoenix in the north", date: "2000–2008 and later", tone: "night" },
  },
};
