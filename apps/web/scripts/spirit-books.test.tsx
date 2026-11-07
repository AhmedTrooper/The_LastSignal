import assert from "node:assert/strict";
import { test } from "node:test";
import { statSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { SPIRIT_BOOK } from "../lib/machine-books/spirit";
import { getMachineBook, machineBookUrl, machineStoryUrl, chapterParagraphs, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { SPIRIT_THOUGHTS, SPIRIT_AUDIO_MANIFEST } from "../lib/spirit-thoughts";
import { SPIRIT_PHOTOS, SPIRIT_ARCHIVE } from "../lib/spirit-media";
import { SPIRIT_SOURCES } from "../lib/spirit-sources";
import { SPIRIT_ART_SCENES } from "../lib/spirit-scenes";
import { spiritRecoveryStep } from "../lib/spirit-activities";
import SpiritThoughtStory from "../app/components/story/spirit-thought-story";
import SpiritChapterExtras from "../app/components/story/spirit-chapter-extras";
import EventComicPage from "../app/components/story/event-comic-page";
import { GET as evidenceGET } from "../app/api/stories/spirit/evidence/route";
import { GET as narrationGET } from "../app/api/stories/spirit/narration/route";

function missionSource(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov") || url === SPIRIT_SOURCES.orbital.url, url);
}

test("Spirit's five chapters share all twenty beats across prose, comic and scroll", () => {
  assert.equal(getMachineBook("spirit"), SPIRIT_BOOK);
  assert.equal(SPIRIT_BOOK.chapters.length, 5);
  assert.equal(SPIRIT_THOUGHTS.length, 20);
  assert.equal(new Set(SPIRIT_THOUGHTS.map(item => item.beatId)).size, 20);
  for (const source of Object.values(SPIRIT_SOURCES)) { missionSource(source.url); assert.ok(source.locator && source.evidence); }
  for (const chapter of SPIRIT_BOOK.chapters) {
    missionSource(chapter.source);
    chapter.relatedSources?.forEach(source => missionSource(source.url));
    chapter.telemetry?.forEach(item => missionSource(item.source));
    const thoughts = SPIRIT_THOUGHTS.filter(item => item.chapterId === chapter.id);
    assert.deepEqual(thoughts.map(item => item.narrationText), chapterParagraphs(chapter));
    assert.equal(SPIRIT_ART_SCENES[chapter.id].length, 4);
    const comic = renderToStaticMarkup(<EventComicPage book={SPIRIT_BOOK} chapter={chapter} />);
    assert.equal((comic.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((comic.match(/class="spirit-art"/g) ?? []).length, 4);
    for (const beat of chapter.beats) assert.ok(comic.includes(beat.line));
    for (const match of comic.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
    const ids = [...comic.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, "SVG definitions must not collide across panels");
  }
});

test("Spirit's server-rendered scroll reader exposes its chapters and three reading formats", () => {
  const markup = renderToStaticMarkup(<SpiritThoughtStory />);
  assert.match(markup, /spirit-thoughts/);
  assert.match(markup, /data-machine="spirit"/);
  assert.match(markup, /Back to the story room/);
  assert.match(markup, /Choose how to read Spirit/);
  assert.match(markup, /format=comic/);
  assert.match(markup, /format=book/);
  assert.match(markup, /\/api\/stories\/spirit\/narration/);
  for (const chapter of SPIRIT_BOOK.chapters) {
    assert.ok(markup.includes(`id="${chapter.id}"`));
    for (const beat of chapter.beats) assert.ok(markup.includes(beat.detail));
  }
});

test("Spirit format links retain chapters and keep a separate bookmark", () => {
  const chapter = SPIRIT_BOOK.chapters[3];
  for (const format of ["book", "comic"] as const) {
    const url = new URL(machineBookUrl("spirit", chapter.id, format), "https://rovervilla.example");
    assert.equal(url.pathname, "/heroes/spirit/book");
    assert.equal(url.searchParams.get("format"), format);
    assert.equal(url.searchParams.get("chapter"), chapter.id);
  }
  assert.equal(machineStoryUrl("spirit", chapter.id), `/heroes/spirit/story#${chapter.id}`);
  const saved = readMachineBookmarks(JSON.stringify({ spirit: { chapter: chapter.id, format: "comic" }, opportunity: { chapter: "bogus", format: "comic" } }));
  assert.deepEqual(resolveMachineReading(SPIRIT_BOOK, null, null, saved.spirit), { index: 3, format: "comic" });
  assert.deepEqual(resolveMachineReading(SPIRIT_BOOK, SPIRIT_BOOK.chapters[0].id, "book", saved.spirit), { index: 0, format: "book" });
  assert.equal(saved.opportunity, undefined);
});

test("Spirit recovery model requires the bypass and file cleanup before reformatting", () => {
  assert.equal(spiritRecoveryStep("resetting", "restart"), "resetting");
  assert.equal(spiritRecoveryStep("resetting", "delete-files"), "resetting");
  assert.equal(spiritRecoveryStep("resetting", "reformat"), "resetting");
  const bypassed = spiritRecoveryStep("resetting", "bypass");
  assert.equal(bypassed, "bypassed");
  assert.equal(spiritRecoveryStep(bypassed, "reformat"), "bypassed");
  const stable = spiritRecoveryStep(bypassed, "delete-files");
  assert.equal(stable, "stable");
  const reformatted = spiritRecoveryStep(stable, "reformat");
  assert.equal(reformatted, "reformatted");
  assert.equal(spiritRecoveryStep(reformatted, "reset-model"), "resetting");
});

test("Spirit activities offer native controls and a user-started silent archive movie", () => {
  for (const chapter of SPIRIT_BOOK.chapters) {
    const markup = renderToStaticMarkup(<SpiritChapterExtras chapter={chapter.id} />);
    assert.match(markup, /type="button"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /\/api\/stories\/spirit\/evidence/);
    assert.ok(!/autoplay|autoPlay/.test(markup));
    if (chapter.id === "the-clue-under-my-wheel") {
      assert.match(markup, /type="range"/);
      assert.match(markup, /Reveal the full track/);
    }
    if (chapter.id === "the-view-from-the-hill") {
      assert.match(markup, /<video[^>]*controls=""/);
      assert.match(markup, /preload="none"/);
      assert.match(markup, /NASA camera sequence · silent/);
    }
  }
  for (const photo of Object.values(SPIRIT_PHOTOS)) { missionSource(photo.src); missionSource(photo.source); assert.equal(photo.ai, false); }
  const movie = SPIRIT_ARCHIVE.dustDevils;
  missionSource(movie.originalSrc);
  assert.ok(statSync(new URL(`../public${movie.src}`, import.meta.url)).size > 0);
});

test("Spirit evidence preserves dates, media identity and uncertainty instead of draft inventions", async () => {
  const prose = SPIRIT_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/128,224|PIA09714|PIA05200|14\.5985|60\+|100% cured|-55|warranty|STILL AWAKE/.test(prose));
  assert.match(prose, /not proof that life had lived on Mars/);
  assert.match(prose, /immediate cause of the silence is unknown/);
  assert.match(prose, /sunlight reflecting from my panels, not a new radio signal/);
  assert.equal(SPIRIT_PHOTOS.silica.name, "PIA09491");
  assert.equal(SPIRIT_PHOTOS.grinding.name, "PIA05223");
  const response = evidenceGET();
  const evidence = await response.json();
  assert.match(response.headers.get("Content-Disposition")!, /spirit-nasa-evidence\.json/);
  assert.equal(evidence.identity.cosparId, "2003-027A");
  assert.equal(evidence.preciseLandmarkCoordinates, null);
  assert.equal(evidence.measuredFinalInternalTemperature, null);
  assert.equal(evidence.recordedFarewellWords, null);
  assert.equal(evidence.chapters.length, 5);
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(SPIRIT_AUDIO_MANIFEST.readyClips, 0);
  assert.equal(manifest.missingClips, 20);
  assert.ok(manifest.moments.every((moment: { audio: { src: unknown; durationMs: unknown } }) => moment.audio.src === null && moment.audio.durationMs === null));
});
