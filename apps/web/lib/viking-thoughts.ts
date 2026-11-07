import { VIKING_BOOK } from "./machine-books/viking";
import { VIKING_PHOTOS } from "./viking-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const VIKING_CLOUD_DIRECTION = Object.fromEntries(VIKING_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const VIKING_THOUGHTS = buildThoughtMoments(VIKING_BOOK, VIKING_CLOUD_DIRECTION);
export const VIKING_AUDIO_MANIFEST = buildNarrationManifest(VIKING_BOOK, VIKING_THOUGHTS);
export const VIKING_THOUGHT_EDITION: ThoughtEdition = {
  book: VIKING_BOOK, moments: VIKING_THOUGHTS, theme: "mars", cover: VIKING_PHOTOS.cover,
  bookmarkKey: "rv:viking-1:scroll:v1", manifestUrl: "/api/stories/viking-1/narration", evidenceUrl: "/api/stories/viking-1/evidence",
  opening: { kicker: "Mars / Viking 1 / a stationary laboratory", title: "A scoop of soil.", emphasis: "A world of questions.", introduction: "I came to Mars with cameras, a scoop, and experiments. A stuck pin nearly stopped the soil's journey. The answers surprised everyone.", invitation: "Follow the careful arrival, the repair, and the questions that remained." },
  preface: { label: "Before the first scoop", text: "Clean hardware, safer ground and a laboratory designed to compare different clues." },
  ending: "My radio link fell silent, but my records came home. Remember the hardware—and the lesson that a surprising result is an invitation to investigate, not a shortcut to certainty.",
  directions: {
    "a-careful-arrival": { place: "Earth / Mars orbit / Chryse Planitia", date: "1975–1976", tone: "paper" },
    "a-picture-and-a-stuck-pin": { place: "Chryse Planitia / cameras and sampler", date: "July 1976", tone: "night", photographs: { 0: VIKING_PHOTOS.first } },
    "soil-with-a-surprise": { place: "Viking’s experiments / later laboratory reanalysis", date: "1976 / 2008–2010", tone: "paper" },
    "a-patient-weather-watcher": { place: "Mars / repeated observations and radio science", date: "1976–1982", tone: "night" },
    "a-silent-link-a-lasting-record": { place: "Lost downlink / archived evidence / orbital identification", date: "1982 / 2006 / 2010", tone: "paper", photographs: { 3: VIKING_PHOTOS.orbital } },
  },
};
