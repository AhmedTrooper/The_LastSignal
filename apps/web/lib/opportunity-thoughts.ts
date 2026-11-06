import { OPPORTUNITY_BOOK } from "./machine-books/opportunity";
import { OPPORTUNITY_NARRATION } from "./opportunity-narration";
import { buildThoughtMoments, type ThoughtDirection } from "./thought-clouds";

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
export const OPPORTUNITY_AUDIO_MANIFEST = {
  schemaVersion: 1,
  machineId: OPPORTUNITY_BOOK.slug,
  title: "The Chronicles of Opportunity — narration production manifest",
  language: "en",
  voiceRole: "imagined-machine-thought",
  note: "Narration text includes the short cloud and its full factual context. Null audio fields mean no recording is attached. Durations are populated only from actual clips. Reject mismatched beat IDs, language, text revisions or fingerprints.",
  totalMoments: OPPORTUNITY_THOUGHTS.length,
  readyClips: OPPORTUNITY_THOUGHTS.filter(moment => moment.audio.status === "ready").length,
  missingClips: OPPORTUNITY_THOUGHTS.filter(moment => moment.audio.status === "missing").length,
  staleClips: OPPORTUNITY_THOUGHTS.filter(moment => moment.audio.status === "stale").length,
  moments: OPPORTUNITY_THOUGHTS,
};
