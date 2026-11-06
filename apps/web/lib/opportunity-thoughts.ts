import { OPPORTUNITY_BOOK } from "./machine-books/opportunity";
import { OPPORTUNITY_NARRATION } from "./opportunity-narration";
import { buildThoughtMoments, buildNarrationManifest, type ThoughtDirection } from "./thought-clouds";

/** Keys belong to the moment, not its display order. Keep existing keys when adding moments. */
export const OPPORTUNITY_CLOUD_DIRECTION: Record<string, ThoughtDirection[]> = {
  "airbag-landing": [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  blueberries: [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "lower-left", textRevision: 1 },
    { key: "b03", placement: "upper-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
  purgatory: [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
  marathon: [
    { key: "b01", placement: "upper-right", textRevision: 1 },
    { key: "b02", placement: "upper-left", textRevision: 1 },
    { key: "b03", placement: "lower-right", textRevision: 1 },
    { key: "b04", placement: "upper-left", textRevision: 1 },
  ],
  "dust-storm": [
    { key: "b01", placement: "upper-left", textRevision: 1 },
    { key: "b02", placement: "upper-right", textRevision: 1 },
    { key: "b03", placement: "lower-left", textRevision: 1 },
    { key: "b04", placement: "upper-right", textRevision: 1 },
  ],
};

export const OPPORTUNITY_THOUGHTS = buildThoughtMoments(OPPORTUNITY_BOOK, OPPORTUNITY_CLOUD_DIRECTION, OPPORTUNITY_NARRATION);
export const OPPORTUNITY_AUDIO_MANIFEST = buildNarrationManifest(OPPORTUNITY_BOOK, OPPORTUNITY_THOUGHTS);
