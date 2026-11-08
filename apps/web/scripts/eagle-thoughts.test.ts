import assert from "node:assert/strict";
import { test } from "node:test";
import { APOLLO_BOOK } from "../lib/machine-books/apollo";
import { EAGLE_THOUGHTS, EAGLE_CLOUD_DIRECTION, EAGLE_THOUGHT_EDITION, EAGLE_AUDIO_MANIFEST } from "../lib/eagle-thoughts";
import { OPPORTUNITY_THOUGHTS, OPPORTUNITY_AUDIO_MANIFEST } from "../lib/opportunity-thoughts";
import { buildThoughtMoments } from "../lib/thought-clouds";
import { GET } from "../app/api/stories/apollo-11-lander/narration/route";

test("Eagle's ten source-backed chapters become forty thoughts without losing their full text", () => {
  assert.equal(APOLLO_BOOK.chapters.length, 10);
  assert.equal(EAGLE_THOUGHTS.length, 40);
  assert.equal(new Set(EAGLE_THOUGHTS.map(moment => moment.beatId)).size, 40);
  for (const [index, moment] of EAGLE_THOUGHTS.entries()) {
    const chapter = APOLLO_BOOK.chapters[moment.chapterSequence - 1];
    const beat = chapter.beats[moment.beatSequence - 1];
    assert.equal(moment.bubbleText, beat.line);
    assert.equal(moment.detailText, beat.detail);
    assert.equal(moment.narrationText, `${beat.line} ${beat.detail}`);
    assert.equal(moment.sourceUrl, chapter.source);
    assert.equal(moment.displaySerial, index + 1);
    assert.match(moment.url, /^\/heroes\/apollo-11-lander\/story#/);
    assert.ok(EAGLE_THOUGHT_EDITION.directions[chapter.id].photograph || EAGLE_THOUGHT_EDITION.directions[chapter.id].diagram);
  }
});

test("the machine's moment identity survives a changed chapter display order", () => {
  const book = { ...APOLLO_BOOK, chapters: [...APOLLO_BOOK.chapters].reverse() };
  const reordered = buildThoughtMoments(book, EAGLE_CLOUD_DIRECTION);
  assert.deepEqual(reordered.map(moment => moment.beatId).sort(), EAGLE_THOUGHTS.map(moment => moment.beatId).sort());
  assert.equal(reordered[0].displaySerial, 1);
  assert.equal(reordered[0].beatId, "apollo-11-lander.seen-again.b01");
});

test("Eagle and Opportunity never share beat IDs, audio manifests or bookmark storage", () => {
  const combined = [...EAGLE_THOUGHTS, ...OPPORTUNITY_THOUGHTS];
  assert.equal(new Set(combined.map(moment => moment.beatId)).size, 60);
  assert.equal(EAGLE_AUDIO_MANIFEST.machineId, "apollo-11-lander");
  assert.equal(OPPORTUNITY_AUDIO_MANIFEST.machineId, "opportunity");
  assert.equal(EAGLE_THOUGHT_EDITION.bookmarkKey, "rv:eagle:scroll:v1");
  assert.equal(EAGLE_THOUGHT_EDITION.manifestUrl, "/api/stories/apollo-11-lander/narration");
  assert.equal(OPPORTUNITY_THOUGHTS.length, 20);
  assert.equal(EAGLE_AUDIO_MANIFEST.readyClips, 40);
  assert.equal(EAGLE_AUDIO_MANIFEST.missingClips, 0);
  assert.ok(EAGLE_THOUGHTS.every(moment => moment.audio.status === "ready"));
  assert.ok(EAGLE_THOUGHTS.every(moment => moment.audio.src?.endsWith(`/audio/story-scroll/apollo11/${moment.beatId}.mp3`)));
  assert.ok(EAGLE_THOUGHTS.every(moment => (moment.audio.durationMs ?? 0) > 0));
});

test("Eagle's narration endpoint exposes all forty recorded clips with exact beat IDs", async () => {
  const response = GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Content-Disposition")!, /eagle-narration-manifest\.json/);
  const manifest = await response.json();
  assert.equal(manifest.totalMoments, 40);
  assert.equal(manifest.readyClips, 40);
  assert.equal(manifest.moments[0].beatId, "apollo-11-lander.undocking.b01");
  assert.equal(manifest.moments[39].beatId, "apollo-11-lander.seen-again.b04");
  assert.ok(manifest.moments.every((moment: { audio: { status: string; src: string | null; durationMs: number | null }; beatId: string }) => moment.audio.status === "ready" && moment.audio.src?.endsWith(`/audio/story-scroll/apollo11/${moment.beatId}.mp3`) && (moment.audio.durationMs ?? 0) > 0));
});
