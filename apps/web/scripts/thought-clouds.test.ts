import assert from "node:assert/strict";
import { test } from "node:test";
import { OPPORTUNITY_BOOK } from "../lib/machine-books/opportunity";
import { OPPORTUNITY_THOUGHTS, OPPORTUNITY_CLOUD_DIRECTION, OPPORTUNITY_AUDIO_MANIFEST } from "../lib/opportunity-thoughts";
import { buildThoughtMoments, narrationFingerprint, thoughtAtScroll, type NarrationClip } from "../lib/thought-clouds";
import { GET } from "../app/api/stories/opportunity/narration/route";

test("the cloud edition preserves all twenty authored lines, explanations and event sources", () => {
  assert.equal(OPPORTUNITY_THOUGHTS.length, 20);
  assert.equal(new Set(OPPORTUNITY_THOUGHTS.map(moment => moment.beatId)).size, 20);
  for (const [index, moment] of OPPORTUNITY_THOUGHTS.entries()) {
    const chapter = OPPORTUNITY_BOOK.chapters[moment.chapterSequence - 1];
    const beat = chapter.beats[moment.beatSequence - 1];
    assert.equal(moment.bubbleText, beat.line);
    assert.equal(moment.detailText, beat.detail);
    assert.equal(moment.narrationText, `${beat.line} ${beat.detail}`);
    assert.equal(moment.sourceUrl, chapter.source);
    assert.equal(moment.displaySerial, index + 1);
    assert.equal(moment.voiceRole, "imagined-machine-thought");
    assert.equal(moment.url, `/heroes/opportunity/story#${moment.beatId}`);
  }
});

test("stable IDs survive reordering chapters while display serials follow the new order", () => {
  const book = { ...OPPORTUNITY_BOOK, chapters: [...OPPORTUNITY_BOOK.chapters].reverse() };
  const reordered = buildThoughtMoments(book, OPPORTUNITY_CLOUD_DIRECTION);
  assert.deepEqual(reordered.map(moment => moment.beatId).sort(), OPPORTUNITY_THOUGHTS.map(moment => moment.beatId).sort());
  assert.equal(reordered[0].displaySerial, 1);
  assert.equal(reordered[0].chapterId, "dust-storm");
  assert.equal(OPPORTUNITY_THOUGHTS[0].beatId, "opportunity.airbag-landing.b01");
});

test("duplicate IDs and missing direction fail explicitly instead of breaking audio pairing", () => {
  const direction = { ...OPPORTUNITY_CLOUD_DIRECTION, blueberries: OPPORTUNITY_CLOUD_DIRECTION.blueberries.map(cue => ({ ...cue, key: "duplicate" })) };
  assert.throws(() => buildThoughtMoments(OPPORTUNITY_BOOK, direction), /Duplicate thought ID/);
  assert.throws(() => buildThoughtMoments(OPPORTUNITY_BOOK, {}), /Missing thought-cloud direction/);
});

test("an audio clip must match beat, spoken text, language and revision", () => {
  const moment = OPPORTUNITY_THOUGHTS[0];
  const clip: NarrationClip = { beatId: moment.beatId, language: "en", textRevision: 1, textFingerprint: moment.textFingerprint, src: "/audio/opportunity/example.mp3", durationMs: 13000 };
  const matching = buildThoughtMoments(OPPORTUNITY_BOOK, OPPORTUNITY_CLOUD_DIRECTION, { [moment.beatId]: clip });
  assert.equal(matching[0].audio.status, "ready");
  assert.equal(matching[0].audio.durationMs, 13000);
  for (const mismatch of [{ ...clip, textRevision: 2 }, { ...clip, textFingerprint: "old-text" }, { ...clip, beatId: "other-moment" }, { ...clip, durationMs: 0 }, { ...clip, src: "javascript:alert(1)" }, { ...clip, src: "//untrusted.test/clip.mp3" }]) {
    const stale = buildThoughtMoments(OPPORTUNITY_BOOK, OPPORTUNITY_CLOUD_DIRECTION, { [moment.beatId]: mismatch })[0];
    assert.equal(stale.audio.status, "stale");
    assert.equal(stale.audio.src, null);
    assert.equal(stale.audio.durationMs, null);
  }
});

test("changing even the full-context words invalidates the old narration", () => {
  const moment = OPPORTUNITY_THOUGHTS[0];
  const original = OPPORTUNITY_BOOK.chapters[0];
  const beats = [...original.beats] as typeof original.beats;
  beats[0] = { ...beats[0], detail: `${beats[0].detail} Additional context.` };
  const book = { ...OPPORTUNITY_BOOK, chapters: [{ ...original, beats }, ...OPPORTUNITY_BOOK.chapters.slice(1)] };
  const clip: NarrationClip = { beatId: moment.beatId, language: "en", textRevision: 1, textFingerprint: moment.textFingerprint, src: "/audio/example.mp3", durationMs: 5000 };
  const revised = buildThoughtMoments(book, OPPORTUNITY_CLOUD_DIRECTION, { [moment.beatId]: clip })[0];
  assert.notEqual(revised.textFingerprint, moment.textFingerprint);
  assert.equal(revised.audio.status, "stale");
  assert.equal(narrationFingerprint(moment.narrationText), moment.textFingerprint);
});

test("the manifest describes real production state without fabricated clips or timings", () => {
  assert.equal(OPPORTUNITY_AUDIO_MANIFEST.totalMoments, 20);
  assert.equal(OPPORTUNITY_AUDIO_MANIFEST.readyClips, 0);
  assert.equal(OPPORTUNITY_AUDIO_MANIFEST.missingClips, 20);
  assert.equal(OPPORTUNITY_AUDIO_MANIFEST.staleClips, 0);
  for (const moment of OPPORTUNITY_AUDIO_MANIFEST.moments) {
    assert.equal(moment.audio.src, null);
    assert.equal(moment.audio.durationMs, null);
    assert.ok(moment.suggestedAudioFilename.includes(moment.beatId));
    assert.ok(moment.suggestedAudioFilename.includes(moment.textFingerprint));
  }
});

test("scroll selection visits every moment and stays bounded at either end", () => {
  const positions = Array.from({ length: 20 }, (_, index) => 800 + index * 400);
  assert.equal(thoughtAtScroll(positions, 0), 0);
  for (let index = 0; index < 20; index++) assert.equal(thoughtAtScroll(positions, positions[index] + 2), index);
  assert.equal(thoughtAtScroll(positions, 100000), 19);
  assert.equal(thoughtAtScroll(positions, positions[4] - 1), 3);
});

test("the downloadable manifest endpoint returns scripts and serials, not fictional audio assets", async () => {
  const response = GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Content-Type")!, /application\/json/);
  assert.match(response.headers.get("Content-Disposition")!, /opportunity-narration-manifest\.json/);
  const manifest = await response.json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(manifest.readyClips, 0);
  assert.equal(manifest.moments[0].beatId, "opportunity.airbag-landing.b01");
  assert.equal(manifest.moments[19].displaySerial, 20);
});
