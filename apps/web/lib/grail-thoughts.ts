import { GRAIL_BOOK } from "./machine-books/grail";
import { GRAIL_PHOTOS } from "./grail-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const GRAIL_CLOUD_DIRECTION = Object.fromEntries(GRAIL_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const GRAIL_THOUGHTS = buildThoughtMoments(GRAIL_BOOK, GRAIL_CLOUD_DIRECTION);
export const GRAIL_AUDIO_MANIFEST = buildNarrationManifest(GRAIL_BOOK, GRAIL_THOUGHTS);
export const GRAIL_THOUGHT_EDITION: ThoughtEdition = {
  book: GRAIL_BOOK, moments: GRAIL_THOUGHTS, theme: "moon", cover: GRAIL_PHOTOS.cover,
  bookmarkKey: "rv:grail:scroll:v1", manifestUrl: "/api/stories/grail/narration", evidenceUrl: "/api/stories/grail/evidence",
  opening: { kicker: "Moon / GRAIL / Ebb & Flow", title: "Two twins.", emphasis: "One gravity map.", introduction: "We flew side by side, measured how the Moon tugged us apart, took student pictures, and finished on a mountain named for Sally Ride.", invitation: "Follow the long cruise, the cosmic tag, and the final burn." },
  preface: { label: "Side by side", text: "Two small spacecraft, one shared measurement, and a map of what cameras cannot see." },
  ending: "We rested on the Sally K. Ride mountain, but the data kept traveling. Gravity, crater marks and student pictures still teach.",
  directions: {
    "a-long-way-to-the-moon": { place: "Cape Canaveral / L1 cruise / lunar orbit", date: "2011–2012", tone: "night" },
    "cosmic-tag": { place: "Tandem polar orbit / MoonKAM", date: "2012", tone: "paper", photographs: { 1: GRAIL_PHOTOS.science } },
    "lower-and-sharper": { place: "Lower lunar orbit / extended mission", date: "2012", tone: "night" },
    "the-x-ray-moon": { place: "Gravity map / highland crust", date: "December 2012 results", tone: "paper", photographs: { 0: GRAIL_PHOTOS.gravity, 2: GRAIL_PHOTOS.porosity } },
    "a-place-named-for-sally": { place: "Goldschmidt mountain / Sally K. Ride Impact Site", date: "17 December 2012", tone: "night", photographs: { 2: GRAIL_PHOTOS.restingSpot } },
  },
};
