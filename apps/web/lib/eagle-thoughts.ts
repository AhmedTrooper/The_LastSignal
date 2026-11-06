import { APOLLO_BOOK } from "./machine-books/apollo";
import { EAGLE_SCROLL_BOOKMARK, EAGLE_SCROLL_COVER, EAGLE_SCROLL_DIRECTION } from "./eagle-scroll";
import { EAGLE_NARRATION } from "./eagle-narration";
import { buildNarrationManifest, buildThoughtMoments, type ThoughtDirection, type ThoughtEdition } from "./thought-clouds";

/** Keep these authored keys when inserting or reordering chapters. */
export const EAGLE_CLOUD_DIRECTION: Record<string, ThoughtDirection[]> = {
  undocking: [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  alarm: [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "upper-left", textRevision: 1 },
    { key: "b03", placement: "lower-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
  touchdown: [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  "first-step": [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "upper-left", textRevision: 1 },
    { key: "b03", placement: "lower-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
  "first-vibrations": [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  reflector: [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "upper-left", textRevision: 1 },
    { key: "b03", placement: "lower-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
  "solar-wind": [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  breaker: [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "upper-left", textRevision: 1 },
    { key: "b03", placement: "lower-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
  liftoff: [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  "seen-again": [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "upper-left", textRevision: 1 },
    { key: "b03", placement: "lower-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
};

export const EAGLE_THOUGHTS = buildThoughtMoments(APOLLO_BOOK, EAGLE_CLOUD_DIRECTION, EAGLE_NARRATION);
export const EAGLE_AUDIO_MANIFEST = buildNarrationManifest(APOLLO_BOOK, EAGLE_THOUGHTS);
export const EAGLE_THOUGHT_EDITION: ThoughtEdition = {
  book: APOLLO_BOOK, directions: EAGLE_SCROLL_DIRECTION, cover: EAGLE_SCROLL_COVER,
  bookmarkKey: EAGLE_SCROLL_BOOKMARK, moments: EAGLE_THOUGHTS,
  manifestUrl: "/api/stories/apollo-11-lander/narration",
  opening: { kicker: "Apollo 11 / Eagle / LM-5", title: "The part that", emphasis: "stayed.", introduction: "Neil and Buzz had a way home. Part of me was built to stay behind.", invitation: "Come into my memories. One thought at a time." },
  preface: { label: "Before the dust settled", text: "A docking connection. A computer warning. A camera tucked beside a ladder." },
  ending: "The landing stage, the instruments, the traces in the dust. You’ve met the machine behind them.",
};
