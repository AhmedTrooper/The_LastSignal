import { INSIGHT_BOOK } from "./machine-books/insight";
import { INSIGHT_PHOTOS } from "./insight-media";
import { buildNarrationManifest, buildThoughtMoments, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 },
  { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 },
  { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const INSIGHT_CLOUD_DIRECTION = Object.fromEntries(INSIGHT_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const INSIGHT_THOUGHTS = buildThoughtMoments(INSIGHT_BOOK, INSIGHT_CLOUD_DIRECTION);
export const INSIGHT_AUDIO_MANIFEST = buildNarrationManifest(INSIGHT_BOOK, INSIGHT_THOUGHTS);
export const INSIGHT_THOUGHT_EDITION: ThoughtEdition = {
  book: INSIGHT_BOOK,
  moments: INSIGHT_THOUGHTS,
  theme: "mars",
  cover: INSIGHT_PHOTOS.firstSelfie,
  bookmarkKey: "rv:insight:scroll:v1",
  manifestUrl: "/api/stories/insight/narration",
  evidenceUrl: "/api/stories/insight/evidence",
  opening: { kicker: "Mars / InSight / 2018-042A", title: "I stayed", emphasis: "to listen.", introduction: "No wheels. A delicate ear on the ground. I went to Mars to help people understand what lay inside it.", invitation: "Follow my journey, one thought at a time." },
  preface: { label: "The lander that listened", text: "Solar wings, careful measurements, stubborn soil, and a team that kept trying." },
  ending: "The lander is quiet. Its measurements and the place it left behind are still part of the scientific record.",
  directions: {
    "a-place-to-listen": { place: "Earth to Elysium Planitia", date: "2015–2018", tone: "paper", photographs: { 0: INSIGHT_PHOTOS.cleanroom, 3: INSIGHT_PHOTOS.firstSelfie } },
    "an-ear-on-the-ground": { place: "Elysium Planitia", date: "December 2018 – April 2019", tone: "night", photographs: { 1: INSIGHT_PHOTOS.deployment } },
    "the-stubborn-soil": { place: "Beside the lander", date: "2019 – January 2021", tone: "paper", photographs: { 3: INSIGHT_PHOTOS.mole } },
    "sand-in-the-wind": { place: "The solar panels", date: "22 May 2021", tone: "paper", photographs: { 1: INSIGHT_PHOTOS.cleaning } },
    "quiet-not-forgotten": { place: "Elysium Planitia / preserved science records", date: "2022–2024", tone: "night", photographs: { 0: INSIGHT_PHOTOS.finalSelfie, 3: INSIGHT_PHOTOS.laterLook } },
  },
};
