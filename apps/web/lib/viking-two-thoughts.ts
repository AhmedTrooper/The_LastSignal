import { VIKING_TWO_BOOK } from "./machine-books/viking-two";
import { VIKING_TWO_PHOTOS } from "./viking-two-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const VIKING_TWO_CLOUD_DIRECTION = Object.fromEntries(VIKING_TWO_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const VIKING_TWO_THOUGHTS = buildThoughtMoments(VIKING_TWO_BOOK, VIKING_TWO_CLOUD_DIRECTION);
export const VIKING_TWO_AUDIO_MANIFEST = buildNarrationManifest(VIKING_TWO_BOOK, VIKING_TWO_THOUGHTS);
export const VIKING_TWO_THOUGHT_EDITION: ThoughtEdition = {
  book: VIKING_TWO_BOOK, moments: VIKING_TWO_THOUGHTS, theme: "mars", cover: VIKING_TWO_PHOTOS.cover,
  bookmarkKey: "rv:viking-2:scroll:v1", manifestUrl: "/api/stories/viking-2/narration", evidenceUrl: "/api/stories/viking-2/evidence",
  opening: { kicker: "Mars / Viking 2 / the northern twin", title: "A leaning lander.", emphasis: "A closer look.", introduction: "I pushed a rock to ask about the soil beneath it. I listened for motion, watched frost return, and sent my northern postcards home.", invitation: "Follow the landing, the rock, the uncertain signal and the frost." },
  preface: { label: "A different neighborhood", text: "Two landers. Two sites. More than one way to ask a question about Mars." },
  ending: "I stayed in Utopia, but my observations traveled. A moved rock, a puzzling signal and a winter photograph are still invitations to look carefully—and to say what we do not yet know.",
  directions: {
    "a-leaning-arrival": { place: "Mars orbit / Utopia Planitia", date: "1975–1976", tone: "paper" },
    "beneath-mister-badger": { place: "Utopia / the sampler and a sheltered location", date: "October 1976", tone: "night", photographs: { 2: VIKING_TWO_PHOTOS.rock } },
    "ears-that-heard-the-wind": { place: "Viking seismic record / lessons for later instruments", date: "1976–1981 / later missions", tone: "paper" },
    "a-winter-postcard": { place: "Utopia / frost and recurring seasons", date: "1979 / comparison with an earlier year", tone: "night", photographs: { 1: VIKING_TWO_PHOTOS.frost } },
    "a-relay-and-a-resting-place": { place: "Relay to Earth / memorial / HiRISE identification", date: "1979–1980 / 2001 / 2006", tone: "paper" },
  },
};
