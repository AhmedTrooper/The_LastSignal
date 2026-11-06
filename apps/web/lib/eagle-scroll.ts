import { APOLLO_BOOK } from "./machine-books/apollo";
import { apolloPhoto, EAGLE_MEMORIES } from "./eagle-story";
import type { Photo } from "./photos";

export type EagleScrollDiagram = "stages" | "guidance" | "landing" | "camera" | "seismic" | "laser" | "foil" | "breaker" | "ascent";
export type EagleScrollDirection = {
  place: string;
  date: string;
  tone: "night" | "paper";
  photograph?: Photo;
  diagram?: EagleScrollDiagram;
  /** Beats using the diagram instead of the photograph. */
  diagramBeats?: number[];
};

export const EAGLE_SCROLL_COVER = apolloPhoto("AS11-40-5902", "Eagle standing at Tranquility Base during Apollo 11’s surface visit.");

/** Art direction only. All three editions read the event text from APOLLO_BOOK. */
export const EAGLE_SCROLL_DIRECTION: Record<string, EagleScrollDirection> = {
  undocking: { place: "Above the Moon", date: "20 July 1969", tone: "night", photograph: apolloPhoto("AS11-44-6581", "Eagle photographed from Columbia after undocking, with its landing gear extended."), diagram: "stages", diagramBeats: [2] },
  alarm: { place: "Inside Eagle", date: "20 July 1969", tone: "night", diagram: "guidance" },
  touchdown: { place: "Tranquility Base", date: "20 July 1969", tone: "night", photograph: EAGLE_SCROLL_COVER, diagram: "landing", diagramBeats: [0, 1, 2] },
  "first-step": { place: "Beside the ladder", date: "21 July 1969", tone: "paper", diagram: "camera" },
  "first-vibrations": { place: "On the lunar ground", date: "21 July 1969", tone: "paper", photograph: apolloPhoto("AS11-40-5948", "The deployed passive seismic experiment, with Eagle in the background."), diagram: "seismic", diagramBeats: [1, 2] },
  reflector: { place: "A little farther from Eagle", date: "21 July 1969", tone: "night", photograph: apolloPhoto("AS11-40-5952", "Apollo 11’s laser ranging retroreflector on the lunar surface."), diagram: "laser", diagramBeats: [1, 2, 3] },
  "solar-wind": { place: "Before the moonwalk ended", date: "21 July 1969", tone: "paper", photograph: apolloPhoto("AS11-40-5873", "Aldrin beside the solar-wind collector earlier in the moonwalk, before its foil was recovered."), diagram: "foil", diagramBeats: [2, 3] },
  breaker: { place: "Back inside the cabin", date: "21 July 1969", tone: "night", diagram: "breaker" },
  liftoff: { place: "Leaving Tranquility Base", date: "21 July 1969", tone: "night", diagram: "ascent" },
  "seen-again": { place: "Seen from lunar orbit", date: "Years later", tone: "paper", photograph: EAGLE_MEMORIES.find(memory => memory.id === "monument")!.photo },
};

export const EAGLE_SCROLL_BOOKMARK = "rv:eagle:scroll:v1";
export type EagleScrollPosition = { chapter: string; beat: number };
export function readEagleScrollPosition(raw: string | null): EagleScrollPosition | null {
  try {
    const value = JSON.parse(raw ?? "null");
    const chapter = APOLLO_BOOK.chapters.find(chapter => chapter.id === value?.chapter);
    if (chapter && Number.isInteger(value.beat) && value.beat >= 0 && value.beat < chapter.beats.length) return { chapter: chapter.id, beat: value.beat };
  } catch { /* Reading never depends on storage. */ }
  return null;
}

export function eagleScrollUrl(chapter?: string) {
  return `/heroes/apollo-11-lander/story${chapter ? `#${encodeURIComponent(chapter)}` : ""}`;
}
