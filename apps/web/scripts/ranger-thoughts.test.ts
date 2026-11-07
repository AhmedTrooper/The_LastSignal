import assert from "node:assert/strict";
import { test } from "node:test";
import { MACHINE_BOOKS, machineBookUrl, machineStoryUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { RANGER_BOOK } from "../lib/machine-books/ranger";
import { RANGER_SCROLL_EDITION } from "../lib/ranger-scroll";
import { RANGER_ART_SCENES } from "../lib/ranger-scenes";
import { RANGER_PHOTOS } from "../lib/ranger-media";
import { RANGER_THOUGHTS, RANGER_AUDIO_MANIFEST } from "../lib/ranger-thoughts";
import { readMachineScrollPosition } from "../lib/machine-scroll";
import { GET } from "../app/api/stories/ranger-7/narration/route";

test("Ranger 7 is a published five-chapter book with four sourced beats per chapter", () => {
  assert.ok(MACHINE_BOOKS.some(book => book.slug === "ranger-7"));
  assert.equal(RANGER_BOOK.chapters.length, 5);
  assert.deepEqual(RANGER_BOOK.chapters.map(chapter => chapter.id), ["six-eyed-tower", "six-failures", "lucky-peanuts", "seventeen-minutes", "mare-cognitum"]);
  for (const chapter of RANGER_BOOK.chapters) {
    assert.equal(chapter.beats.length, 4);
    assert.ok(chapter.source.startsWith("https://"));
    assert.ok(chapter.telemetry?.every(item => item.source.startsWith("https://") && item.note));
    assert.ok(!chapter.beats.some(beat => beat.roverArt || beat.art));
    assert.ok(RANGER_SCROLL_EDITION.directions[chapter.id]);
    assert.equal(RANGER_ART_SCENES[chapter.id]?.length, 4);
  }
});

test("every Ranger cloud keeps the authored line, full context, source and stable ID", () => {
  assert.equal(RANGER_THOUGHTS.length, 20);
  assert.equal(new Set(RANGER_THOUGHTS.map(moment => moment.beatId)).size, 20);
  for (const [index, moment] of RANGER_THOUGHTS.entries()) {
    const chapter = RANGER_BOOK.chapters[moment.chapterSequence - 1];
    const beat = chapter.beats[moment.beatSequence - 1];
    assert.equal(moment.bubbleText, beat.line);
    assert.equal(moment.detailText, beat.detail);
    assert.equal(moment.narrationText, `${beat.line} ${beat.detail}`);
    assert.equal(moment.sourceUrl, chapter.source);
    assert.equal(moment.displaySerial, index + 1);
    assert.equal(moment.voiceRole, "imagined-machine-thought");
    assert.ok(moment.beatId.startsWith("ranger-7."));
    assert.equal(moment.url, `/heroes/ranger-7/story#${moment.beatId}`);
  }
});

test("the Ranger art and archive-photo mappings line up with the four beats", () => {
  for (const chapter of RANGER_BOOK.chapters) {
    const scenes = RANGER_ART_SCENES[chapter.id];
    assert.equal(scenes?.length, chapter.beats.length);
    assert.equal(new Set(scenes).size, scenes.length);
  }
  const first = RANGER_SCROLL_EDITION.directions["seventeen-minutes"].photographs;
  assert.ok(first?.[0]?.source.includes("PIA02975"));
  assert.ok(first?.[1]?.source.includes("PIA02974"));
  const last = RANGER_SCROLL_EDITION.directions["mare-cognitum"].photographs;
  assert.equal(last?.[1]?.name, "lpi-ranger-7-p200");
  assert.equal(last?.[3]?.name, "lroc-m153014430l");
  assert.ok(Object.values(RANGER_PHOTOS).every(photo => !photo.ai && photo.source.startsWith("https://") && photo.alt && photo.credit));
});

test("Ranger bookmarks and chapter links stay inside Ranger 7", () => {
  const bookmarks = readMachineBookmarks(JSON.stringify({ "ranger-7": { chapter: "lucky-peanuts", format: "book" }, opportunity: { chapter: "blueberries", format: "comic" } }));
  assert.deepEqual(bookmarks, { "ranger-7": { chapter: "lucky-peanuts", format: "book" }, opportunity: { chapter: "blueberries", format: "comic" } });
  assert.deepEqual(readMachineBookmarks('{"ranger-7":{"chapter":"blueberries","format":"book"}}'), {});
  assert.equal(readMachineScrollPosition(RANGER_BOOK, '{"chapter":"blueberries","beat":1}'), null);
  assert.deepEqual(readMachineScrollPosition(RANGER_BOOK, '{"chapter":"mare-cognitum","beat":2}'), { chapter: "mare-cognitum", beat: 2 });
  for (const chapter of RANGER_BOOK.chapters) {
    for (const format of ["comic", "book"] as const) {
      const url = new URL(machineBookUrl("ranger-7", chapter.id, format), "https://rovervilla.test");
      assert.equal(url.pathname, "/heroes/ranger-7/book");
      const reading = resolveMachineReading(RANGER_BOOK, url.searchParams.get("chapter"), url.searchParams.get("format"));
      assert.equal(RANGER_BOOK.chapters[reading.index].id, chapter.id);
    }
    assert.equal(machineStoryUrl("ranger-7", chapter.id), `/heroes/ranger-7/story#${chapter.id}`);
  }
});

test("factual guardrails: uncertainty, downlink values and Apollo confidence are stated carefully", () => {
  const text = JSON.stringify(RANGER_BOOK);
  assert.match(text, /Never definitively established/);
  assert.match(text, /Channel F 959\.52 MHz/);
  assert.match(text, /Channel P 960\.05 MHz/);
  assert.match(text, /separate 3 W transponder used 960\.58 MHz/);
  assert.match(text, /gave them confidence that the smoother mare regions could support an Apollo landing/);
  assert.ok(!text.includes("proved the regolith had bearing strength"));
  assert.ok(!text.includes("kamikaze"));
});

test("the Ranger narration manifest reports missing clips honestly", async () => {
  assert.equal(RANGER_AUDIO_MANIFEST.totalMoments, 20);
  assert.equal(RANGER_AUDIO_MANIFEST.readyClips, 0);
  assert.equal(RANGER_AUDIO_MANIFEST.missingClips, 20);
  assert.equal(RANGER_AUDIO_MANIFEST.staleClips, 0);
  for (const moment of RANGER_AUDIO_MANIFEST.moments) {
    assert.equal(moment.audio.src, null);
    assert.equal(moment.audio.durationMs, null);
    assert.ok(moment.suggestedAudioFilename.includes(moment.beatId));
    assert.ok(moment.suggestedAudioFilename.includes(moment.textFingerprint));
  }
  const response = GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Content-Type")!, /application\/json/);
  assert.match(response.headers.get("Content-Disposition")!, /ranger-7-narration-manifest\.json/);
  const manifest = await response.json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(manifest.readyClips, 0);
  assert.equal(manifest.moments[0].beatId, "ranger-7.six-eyed-tower.b01");
  assert.equal(manifest.moments[19].displaySerial, 20);
});
