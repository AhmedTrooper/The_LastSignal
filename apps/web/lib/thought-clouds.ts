import type { MachineBook } from "./machine-books/types";
import type { ScrollEdition } from "./machine-scroll";

export type CloudPlacement = "upper-left" | "upper-right" | "lower-left" | "lower-right";
export type ThoughtDirection = { key: string; placement: CloudPlacement; textRevision: number };
export type NarrationClip = {
  beatId: string;
  language: "en";
  textRevision: number;
  textFingerprint: string;
  src: string;
  durationMs: number;
};
export type ThoughtMoment = {
  beatId: string;
  chapterId: string;
  chapterTitle: string;
  chapterSequence: number;
  beatSequence: number;
  displaySerial: number;
  voiceRole: "imagined-machine-thought";
  bubbleText: string;
  detailText: string;
  narrationText: string;
  textRevision: number;
  textFingerprint: string;
  sourceUrl: string;
  relatedSources: { label: string; url: string }[];
  bubblePlacement: CloudPlacement;
  url: string;
  legacyAnchor: string;
  suggestedAudioFilename: string;
  audio: {
    beatId: string;
    language: "en";
    textRevision: number;
    textFingerprint: string;
    status: "missing" | "ready" | "stale";
    src: string | null;
    durationMs: number | null;
  };
};
export type ThoughtEdition = ScrollEdition & { moments: ThoughtMoment[]; manifestUrl: string };

export function buildNarrationManifest(book: MachineBook, moments: ThoughtMoment[]) {
  return {
    schemaVersion: 1, machineId: book.slug,
    title: `The Chronicles of ${book.name} — narration production manifest`, language: "en",
    voiceRole: "imagined-machine-thought",
    note: "Narration text includes the short cloud and its full factual context. Null audio fields mean no recording is attached. Durations are populated only from actual clips. Reject mismatched beat IDs, language, text revisions or fingerprints.",
    totalMoments: moments.length,
    readyClips: moments.filter(moment => moment.audio.status === "ready").length,
    missingClips: moments.filter(moment => moment.audio.status === "missing").length,
    staleClips: moments.filter(moment => moment.audio.status === "stale").length,
    moments,
  };
}

/** Deterministic change detector, not a security hash. Includes every spoken character. */
export function narrationFingerprint(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function safeAudioSource(src: unknown) {
  if (typeof src !== "string" || !src.trim()) return false;
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("\\")) return true;
  try { return new URL(src).protocol === "https:"; } catch { return false; }
}

/** Stable authored keys are independent of a chapter's position in the book. */
export function buildThoughtMoments(book: MachineBook, direction: Record<string, ThoughtDirection[]>, clips: Record<string, NarrationClip> = {}): ThoughtMoment[] {
  const ids = new Set<string>();
  let serial = 0;
  return book.chapters.flatMap((chapter, chapterIndex) => {
    const cues = direction[chapter.id];
    if (cues?.length !== chapter.beats.length) throw new Error(`Missing thought-cloud direction for ${chapter.id}`);
    return chapter.beats.map((beat, index) => {
      const cue = cues[index];
      if (!cue || !/^[a-z][a-z0-9-]*$/.test(cue.key) || !Number.isInteger(cue.textRevision) || cue.textRevision < 1 || !["upper-left", "upper-right", "lower-left", "lower-right"].includes(cue.placement)) throw new Error(`Invalid thought-cloud key, placement or revision in ${chapter.id}`);
      const beatId = `${book.slug}.${chapter.id}.${cue.key}`;
      if (ids.has(beatId)) throw new Error(`Duplicate thought ID: ${beatId}`);
      ids.add(beatId);
      const narrationText = `${beat.line} ${beat.detail}`;
      const textFingerprint = narrationFingerprint(narrationText);
      const clip = clips[beatId];
      const ready = !!clip && clip.beatId === beatId && clip.language === "en" && clip.textRevision === cue.textRevision && clip.textFingerprint === textFingerprint && safeAudioSource(clip.src) && Number.isFinite(clip.durationMs) && clip.durationMs > 0;
      return {
        beatId, chapterId: chapter.id, chapterTitle: chapter.title,
        chapterSequence: chapterIndex + 1, beatSequence: index + 1, displaySerial: ++serial,
        voiceRole: "imagined-machine-thought", bubbleText: beat.line, detailText: beat.detail, narrationText,
        textRevision: cue.textRevision, textFingerprint, sourceUrl: chapter.source, relatedSources: chapter.relatedSources ?? [],
        bubblePlacement: cue.placement, url: `/heroes/${book.slug}/story#${beatId}`,
        legacyAnchor: `${chapter.id}-beat-${index}`,
        suggestedAudioFilename: `${beatId}.en.r${cue.textRevision}.${textFingerprint}.mp3`,
        audio: { beatId, language: "en", textRevision: cue.textRevision, textFingerprint, status: ready ? "ready" : clip ? "stale" : "missing", src: ready ? clip.src : null, durationMs: ready ? clip.durationMs : null },
      } satisfies ThoughtMoment;
    });
  });
}

/** Pure scroll selection: no skipped sequence at a chapter boundary; bounded at either end. */
export function thoughtAtScroll(positions: readonly number[], scrollY: number) {
  let selected = 0;
  for (let index = 0; index < positions.length; index++) {
    if (positions[index] > scrollY) break;
    selected = index;
  }
  return selected;
}
