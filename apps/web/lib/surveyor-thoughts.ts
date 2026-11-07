import { SURVEYOR_BOOK } from "./machine-books/surveyor";
import { SURVEYOR_PHOTOS } from "./surveyor-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const SURVEYOR_CLOUD_DIRECTION = Object.fromEntries(SURVEYOR_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const SURVEYOR_THOUGHTS = buildThoughtMoments(SURVEYOR_BOOK, SURVEYOR_CLOUD_DIRECTION);
export const SURVEYOR_AUDIO_MANIFEST = buildNarrationManifest(SURVEYOR_BOOK, SURVEYOR_THOUGHTS);
export const SURVEYOR_THOUGHT_EDITION: ThoughtEdition = {
  book: SURVEYOR_BOOK, moments: SURVEYOR_THOUGHTS, theme: "moon", cover: SURVEYOR_PHOTOS.cover,
  bookmarkKey: "rv:surveyor-1:scroll:v1", manifestUrl: "/api/stories/surveyor-1/narration", evidenceUrl: "/api/stories/surveyor-1/evidence",
  opening: { kicker: "Moon / Surveyor 1 / a careful arrival", title: "Three feet.", emphasis: "A new foothold.", introduction: "I came to slow down, stand on unfamiliar ground, and send the evidence home. A footpad, a camera and a long shadow each had something to tell.", invitation: "Follow five chapters, one discovery at a time." },
  preface: { label: "Before the landing", text: "A lightweight frame, a radar-guided descent, and questions that pictures alone could not answer." },
  ending: "My radio fell silent, but my pictures did not lose their meaning. The hardware left on the Moon and the records kept on Earth are two parts of the same adventure.",
  directions: {
    "a-question-in-flight": { place: "Earth to Oceanus Procellarum", date: "May–June 1966", tone: "night", photographs: { 1: SURVEYOR_PHOTOS.launch } },
    "three-feet-down": { place: "Oceanus Procellarum / automatic descent", date: "2 June 1966", tone: "paper", photographs: { 3: SURVEYOR_PHOTOS.footpad } },
    "a-footprint-and-a-picture": { place: "The ground beneath the lander", date: "June 1966", tone: "paper", photographs: { 1: SURVEYOR_PHOTOS.footpad, 3: SURVEYOR_PHOTOS.color } },
    "through-the-long-night": { place: "Compartment A / solar power and thermal control", date: "June–July 1966", tone: "night", photographs: { 3: SURVEYOR_PHOTOS.radiator } },
    "the-long-shadow": { place: "Mission records and the later orbital view", date: "1966–1967 / 2009", tone: "paper", photographs: { 1: SURVEYOR_PHOTOS.surfaceShadow, 2: SURVEYOR_PHOTOS.orbital } },
  },
};
