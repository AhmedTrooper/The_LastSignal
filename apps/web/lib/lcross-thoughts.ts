import { LCROSS_BOOK } from "./machine-books/lcross";
import { LCROSS_PHOTOS } from "./lcross-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const LCROSS_CLOUD_DIRECTION = Object.fromEntries(LCROSS_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const LCROSS_THOUGHTS = buildThoughtMoments(LCROSS_BOOK, LCROSS_CLOUD_DIRECTION);
export const LCROSS_AUDIO_MANIFEST = buildNarrationManifest(LCROSS_BOOK, LCROSS_THOUGHTS);
export const LCROSS_THOUGHT_EDITION: ThoughtEdition = {
  book: LCROSS_BOOK, moments: LCROSS_THOUGHTS, theme: "moon", cover: LCROSS_PHOTOS.cover,
  bookmarkKey: "rv:lcross:scroll:v1", manifestUrl: "/api/stories/lcross/narration", evidenceUrl: "/api/stories/lcross/evidence",
  opening: { kicker: "Moon / LCROSS / a used stage with a new job", title: "One more job.", emphasis: "One big question.", introduction: "A used rocket stage became the first part of an experiment. I followed it into a cold crater’s story, watching the light for clues about water.", invitation: "Follow the hardware, the fuel scare, and the evidence." },
  preface: { label: "Before the impact", text: "A reused structure, complementary instruments, and a plan for making hidden material observable." },
  ending: "Our impacts ended the flight, not the investigation. The used hardware left a crater on the Moon and a record on Earth—and the record still has questions worth asking.",
  directions: {
    "a-stage-with-another-job": { place: "Earth to a lunar polar experiment", date: "June 2009", tone: "paper" },
    "the-fuel-scare": { place: "Cruise / attitude control and mission operations", date: "August–September 2009", tone: "night" },
    "two-impacts-one-experiment": { place: "Cabeus / Centaur impact and shepherd observations", date: "9 October 2009", tone: "paper" },
    "light-with-a-water-clue": { place: "Impact observations and later scientific analysis", date: "2009–2010", tone: "night", photographs: { 0: LCROSS_PHOTOS.plume, 1: LCROSS_PHOTOS.lamp } },
    "the-impact-that-kept-teaching": { place: "Preserved mission data / later crater research", date: "2009 / 2024", tone: "paper" },
  },
};
