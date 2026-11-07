import { RANGER_BOOK } from "./machine-books/ranger";
import { RANGER_NARRATION } from "./ranger-narration";
import { buildNarrationManifest, buildThoughtMoments, type ThoughtDirection } from "./thought-clouds";

/** Keys belong to the moment, not its display order. Keep existing keys when adding moments. */
export const RANGER_CLOUD_DIRECTION: Record<string, ThoughtDirection[]> = {
  "six-eyed-tower": [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  "six-failures": [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "lower-left", textRevision: 1 },
    { key: "b03", placement: "upper-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
  "lucky-peanuts": [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  "seventeen-minutes": [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "upper-left", textRevision: 1 },
    { key: "b03", placement: "lower-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
  "mare-cognitum": [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "lower-right", textRevision: 1 },
    { key: "b03", placement: "upper-right", textRevision: 1 },
    { key: "b04", placement: "lower-left", textRevision: 1 },
  ],
};

export const RANGER_THOUGHTS = buildThoughtMoments(RANGER_BOOK, RANGER_CLOUD_DIRECTION, RANGER_NARRATION);
export const RANGER_AUDIO_MANIFEST = buildNarrationManifest(RANGER_BOOK, RANGER_THOUGHTS);
