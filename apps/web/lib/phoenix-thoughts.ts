import { PHOENIX_BOOK } from "./machine-books/phoenix";
import { PHOENIX_PHOTOS } from "./phoenix-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const PHOENIX_CLOUD_DIRECTION = Object.fromEntries(PHOENIX_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const PHOENIX_THOUGHTS = buildThoughtMoments(PHOENIX_BOOK, PHOENIX_CLOUD_DIRECTION);
export const PHOENIX_AUDIO_MANIFEST = buildNarrationManifest(PHOENIX_BOOK, PHOENIX_THOUGHTS);
export const PHOENIX_THOUGHT_EDITION: ThoughtEdition = {
  book: PHOENIX_BOOK, moments: PHOENIX_THOUGHTS, theme: "mars", cover: PHOENIX_PHOTOS.cover,
  bookmarkKey: "rv:phoenix:scroll:v1", manifestUrl: "/api/stories/phoenix/narration", evidenceUrl: "/api/stories/phoenix/evidence",
  opening: { kicker: "Mars / Phoenix / the Arctic ice-hunter", title: "I rose again.", emphasis: "Then I dug.", introduction: "Spare parts, a parachute caught from orbit, disappearing ice, tasted water, salty soil and falling snow — all in Green Valley.", invitation: "Follow the resurrection, the trenches and the winter farewell." },
  preface: { label: "Far north", text: "No boulders, no hills — just flat polygon ground and ice close below." },
  ending: "Winter covered my solar wings, but the records traveled on. Green Valley still keeps the archives I helped create.",
  directions: {
    "risen-from-the-ashes": { place: "Cape Canaveral / descent / Green Valley", date: "2007–2008", tone: "night", photographs: { 1: PHOENIX_PHOTOS.parachute } },
    "holy-cow-and-vanishing-ice": { place: "Green Valley / trenches", date: "June 2008", tone: "paper", photographs: { 3: PHOENIX_PHOTOS.sublimation } },
    "tasting-the-water": { place: "Deck ovens / TEGA", date: "July 2008", tone: "night" },
    "friendly-soil-and-laser-snow": { place: "Arctic soil / sky above", date: "August–September 2008", tone: "paper" },
    "a-winter-farewell": { place: "Polar night / HiRISE after-view", date: "November 2008 – May 2010", tone: "night", photographs: { 2: PHOENIX_PHOTOS.afterWinter } },
  },
};
