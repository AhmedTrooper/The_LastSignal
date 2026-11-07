import { INGENUITY_BOOK } from "./machine-books/ingenuity";
import { INGENUITY_PHOTOS } from "./ingenuity-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const INGENUITY_CLOUD_DIRECTION = Object.fromEntries(INGENUITY_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const INGENUITY_THOUGHTS = buildThoughtMoments(INGENUITY_BOOK, INGENUITY_CLOUD_DIRECTION);
export const INGENUITY_AUDIO_MANIFEST = buildNarrationManifest(INGENUITY_BOOK, INGENUITY_THOUGHTS);
export const INGENUITY_THOUGHT_EDITION: ThoughtEdition = {
  book: INGENUITY_BOOK, moments: INGENUITY_THOUGHTS, theme: "mars", cover: INGENUITY_PHOTOS.cover,
  bookmarkKey: "rv:ingenuity:scroll:v1", manifestUrl: "/api/stories/ingenuity/narration", evidenceUrl: "/api/stories/ingenuity/evidence",
  opening: { kicker: "Mars / Ingenuity / an aircraft on another world", title: "A little helicopter.", emphasis: "A new sky.", introduction: "I began with a question: could a small helicopter fly on Mars? My flights turned that question into evidence.", invitation: "Follow the flights—and the people who kept learning." },
  preface: { label: "Before the first flight", text: "Thin air, onboard guidance, a piece of flight history, and one small aircraft." },
  ending: "The flying is over. The pictures, the flight records and the lessons are still here. My remaining equipment was given a possible new job—not a guaranteed future.",
  directions: {
    "a-new-sky": { place: "Earth to Wright Brothers Field", date: "2020–2021", tone: "paper", photographs: { 1: INGENUITY_PHOTOS.fabric, 3: INGENUITY_PHOTOS.firstFlight } },
    "the-missing-picture": { place: "Jezero Crater / Flight 6", date: "22 May 2021", tone: "night", photographs: { 2: INGENUITY_PHOTOS.flightSix } },
    "the-gear-left-behind": { place: "Perseverance’s discarded entry equipment", date: "19 April 2022", tone: "paper", photographs: { 2: INGENUITY_PHOTOS.debris } },
    "a-backup-sense": { place: "Jezero Crater / winter operations", date: "June 2022", tone: "night" },
    "a-record-for-the-future": { place: "Valinor Hills / preserved engineering records", date: "2024", tone: "paper", photographs: { 1: INGENUITY_PHOTOS.brokenShadow, 3: INGENUITY_PHOTOS.perch } },
  },
};
