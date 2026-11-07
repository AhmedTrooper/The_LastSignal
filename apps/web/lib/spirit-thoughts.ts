import { SPIRIT_BOOK } from "./machine-books/spirit";
import { SPIRIT_PHOTOS } from "./spirit-media";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const SPIRIT_CLOUD_DIRECTION = Object.fromEntries(SPIRIT_BOOK.chapters.map(chapter => [chapter.id, cues]));
export const SPIRIT_THOUGHTS = buildThoughtMoments(SPIRIT_BOOK, SPIRIT_CLOUD_DIRECTION);
export const SPIRIT_AUDIO_MANIFEST = buildNarrationManifest(SPIRIT_BOOK, SPIRIT_THOUGHTS);
export const SPIRIT_THOUGHT_EDITION: ThoughtEdition = {
  book: SPIRIT_BOOK, moments: SPIRIT_THOUGHTS, theme: "mars", cover: SPIRIT_PHOTOS.cover,
  bookmarkKey: "rv:spirit:scroll:v1", manifestUrl: "/api/stories/spirit/narration", evidenceUrl: "/api/stories/spirit/evidence",
  opening: { kicker: "Mars / Spirit / a rover with a question", title: "A distant hill.", emphasis: "A closer look.", introduction: "I crossed a rocky plain, climbed toward older clues, and found a surprise underneath a broken wheel. Come see what looking closely can uncover.", invitation: "Five chapters. Follow the clues at your own pace." },
  preface: { label: "Before the first drive", text: "A solar-powered rover, a set of instruments, and a team ready to be surprised." },
  ending: "My wheels are still. My observations are not forgotten. The people who kept asking questions—and the people reading my records now—are part of what my hardware made possible.",
  directions: {
    "a-rocky-welcome": { place: "Gusev Crater / Columbia Memorial Station", date: "2003–2004", tone: "paper", photographs: { 1: SPIRIT_PHOTOS.grinding, 2: SPIRIT_PHOTOS.earth } },
    "a-fresh-start": { place: "Mars and the engineering team on Earth", date: "January–February 2004", tone: "night" },
    "the-view-from-the-hill": { place: "Columbia Hills / Husband Hill", date: "2004–2005", tone: "paper", photographs: { 0: SPIRIT_PHOTOS.goethite, 2: SPIRIT_PHOTOS.cover } },
    "the-clue-under-my-wheel": { place: "Gertrude Weise / near Home Plate", date: "2006–2007", tone: "paper", photographs: { 1: SPIRIT_PHOTOS.silica } },
    "the-record-that-stayed": { place: "Troy / west of Home Plate", date: "2009–2011", tone: "night", photographs: { 0: SPIRIT_PHOTOS.troy, 1: SPIRIT_PHOTOS.troySoil } },
  },
};
