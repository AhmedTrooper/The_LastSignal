import { PATHFINDER_BOOK } from "./machine-books/pathfinder-sojourner";
import { PATHFINDER_PHOTOS } from "./pathfinder-media";
import { buildNarrationManifest, buildThoughtMoments, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

const cues: ThoughtDirection[] = [
  { key: "b01", placement: "upper-left", textRevision: 1 }, { key: "b02", placement: "upper-right", textRevision: 1 },
  { key: "b03", placement: "lower-left", textRevision: 1 }, { key: "b04", placement: "upper-left", textRevision: 1 },
];
export const PATHFINDER_THOUGHTS = buildThoughtMoments(PATHFINDER_BOOK, Object.fromEntries(PATHFINDER_BOOK.chapters.map(chapter => [chapter.id, cues])));
export const PATHFINDER_AUDIO_MANIFEST = buildNarrationManifest(PATHFINDER_BOOK, PATHFINDER_THOUGHTS);
export const PATHFINDER_THOUGHT_EDITION: ThoughtEdition = {
  book: PATHFINDER_BOOK, moments: PATHFINDER_THOUGHTS, theme: "mars", cover: PATHFINDER_PHOTOS.cover,
  bookmarkKey: "rv:pathfinder-sojourner:scroll:v1", manifestUrl: "/api/stories/pathfinder-sojourner/narration", evidenceUrl: "/api/stories/pathfinder-sojourner/evidence",
  opening: { kicker: "Mars Pathfinder / Sojourner / Ares Vallis", title: "One stayed.", emphasis: "One rolled.", introduction: "A bouncing arrival. A blocked ramp. A rover that needed its station. Two machines, one real adventure—and an ending the records cannot fully show.", invitation: "Follow eight chapters. Keep the evidence close." },
  preface: { label: "A partnership on another world", text: "The rover investigated nearby rocks. The station watched the sky and relayed the rover's data to Earth." },
  ending: "The link ended. The observations did not lose their value. Keep the discoveries—and the unanswered questions—together.",
  directions: {
    "two-jobs-one-journey": { place: "Earth / preparation and launch", date: "1996 / 4 December launch", tone: "night" },
    "the-landing-that-bounced": { place: "Mars atmosphere to Ares Vallis", date: "4 July 1997", tone: "paper" },
    "a-ramp-not-yet-a-road": { place: "The lander's deployment ramps", date: "5 July US time / 6 July UTC", tone: "paper" },
    "the-rocks-with-nicknames": { place: "Rocks near Sagan Memorial Station", date: "July 1997", tone: "night" },
    "the-station-watched-the-sky": { place: "Ares Vallis / lander science", date: "July 1997 / observations continued", tone: "paper" },
    "the-week-became-a-longer-journey": { place: "Primary mission to extended operations", date: "August 1997", tone: "night" },
    "a-carrier-is-not-a-conversation": { place: "The Earth–lander–rover link", date: "27 September–October 1997", tone: "night" },
    "the-record-outlived-the-link": { place: "Mission review / later orbital view", date: "November 1997 / 2006", tone: "paper" },
  },
};
