import { LRV_BOOK } from "./machine-books/apollo-15-rover";
import { LRV_PHOTOS } from "./lrv-media";
import { buildNarrationManifest, buildThoughtMoments, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const LRV_THOUGHTS = buildThoughtMoments(LRV_BOOK, Object.fromEntries(LRV_BOOK.chapters.map(chapter => [chapter.id, cues])));
export const LRV_AUDIO_MANIFEST = buildNarrationManifest(LRV_BOOK, LRV_THOUGHTS);
export const LRV_THOUGHT_EDITION: ThoughtEdition = {
  book: LRV_BOOK, moments: LRV_THOUGHTS, theme: "moon", cover: LRV_PHOTOS.cover,
  bookmarkKey: "rv:apollo-15-rover:scroll:v1", manifestUrl: "/api/stories/apollo-15-rover/narration", evidenceUrl: "/api/stories/apollo-15-rover/evidence",
  opening: { kicker: "Apollo 15 / Lunar Roving Vehicle / Hadley-Apennine", title: "Folded for flight.", emphasis: "Built to roam.", introduction: "A steering fault. A seatbelt stop. A white rock on a hillside. Come along with the car whose wheels stayed on the Moon.", invitation: "Eight real chapters. One discovery at a time." },
  preface: { label: "Before the first wheel turned", text: "A compact chassis, metal tyres and a finite battery supply. A larger adventure began inside a smaller package." },
  ending: "The rover stayed. Samples, pictures and engineering lessons travelled home. The evidence is still yours to explore.",
  directions: {
    "a-car-in-a-cupboard": { place: "Earth / design and launch packaging", date: "Before July 1971", tone: "night" },
    "the-wheels-unfold": { place: "Earth to Hadley-Apennine", date: "26–31 July 1971", tone: "paper" },
    "another-way-to-steer": { place: "First traverse / Hadley-Apennine", date: "31 July 1971", tone: "night" },
    "the-seatbelt-passenger": { place: "First traverse / sample 15016 account", date: "31 July 1971 / later sample study", tone: "paper" },
    "uphill-to-a-white-rock": { place: "Station 6a and Spur Crater", date: "1 August 1971", tone: "paper" },
    "a-wall-with-layers": { place: "Hadley Rille", date: "2 August 1971", tone: "night" },
    "parked-to-watch": { place: "Final parking near Falcon", date: "2 August 1971", tone: "night" },
    "the-wheels-stayed-the-clues-travelled": { place: "Moon hardware / Earth records and laboratories", date: "After the surface mission", tone: "paper" },
  },
};
