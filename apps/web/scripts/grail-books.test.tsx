import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { GRAIL_BOOK } from "../lib/machine-books/grail";
import { chapterParagraphs, getMachineBook, machineBookUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { GRAIL_SOURCES } from "../lib/grail-sources";
import { GRAIL_THOUGHTS, GRAIL_AUDIO_MANIFEST } from "../lib/grail-thoughts";
import { GRAIL_PHOTOS } from "../lib/grail-media";
import { GRAIL_ART_SCENES } from "../lib/grail-scenes";
import { grailMasconStep, grailBurnStep } from "../lib/grail-activities";
import EventComicPage from "../app/components/story/event-comic-page";
import GrailThoughtStory from "../app/components/story/grail-thought-story";
import GrailChapterExtras from "../app/components/story/grail-chapter-extras";
import { GET as evidenceGET } from "../app/api/stories/grail/evidence/route";
import { GET as narrationGET } from "../app/api/stories/grail/narration/route";

function source(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov") || parsed.hostname.startsWith("lroc."), url);
}

test("GRAIL shares five chapters and twenty beats across comic, book and scroll", () => {
  assert.equal(getMachineBook("grail"), GRAIL_BOOK);
  assert.equal(GRAIL_BOOK.chapters.length, 5);
  assert.equal(GRAIL_THOUGHTS.length, 20);
  assert.equal(new Set(GRAIL_THOUGHTS.map(item => item.beatId)).size, 20);
  for (const record of Object.values(GRAIL_SOURCES)) { source(record.url); assert.ok(record.locator && record.evidence); }
  for (const chapter of GRAIL_BOOK.chapters) {
    source(chapter.source);
    chapter.relatedSources?.forEach(item => source(item.url));
    chapter.telemetry?.forEach(item => source(item.source));
    assert.deepEqual(GRAIL_THOUGHTS.filter(item => item.chapterId === chapter.id).map(item => item.narrationText), chapterParagraphs(chapter));
    assert.equal(GRAIL_ART_SCENES[chapter.id].length, 4);
    const markup = renderToStaticMarkup(<EventComicPage book={GRAIL_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="grail-art"/g) ?? []).length, 4);
    for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
  }
});

test("GRAIL's scroll exposes reading links, chapter anchors and factual text on the server", () => {
  const markup = renderToStaticMarkup(<GrailThoughtStory />);
  assert.match(markup, /data-machine="grail"/);
  assert.match(markup, /grail-thoughts/);
  assert.match(markup, /Choose how to read GRAIL/);
  assert.match(markup, /format=comic/);
  assert.match(markup, /format=book/);
  for (const chapter of GRAIL_BOOK.chapters) {
    assert.ok(markup.includes(`id="${chapter.id}"`));
    for (const beat of chapter.beats) assert.ok(markup.includes(renderToStaticMarkup(<>{beat.detail}</>)));
  }
});

test("GRAIL bookmarks stay separate and respect explicit chapters", () => {
  const saved = readMachineBookmarks(JSON.stringify({ "grail": { chapter: "the-x-ray-moon", format: "book" }, "viking-2": { chapter: "a-winter-postcard", format: "comic" } }));
  assert.deepEqual(resolveMachineReading(GRAIL_BOOK, null, null, saved["grail"]), { index: 3, format: "book" });
  assert.deepEqual(resolveMachineReading(GRAIL_BOOK, "a-long-way-to-the-moon", "comic", saved["grail"]), { index: 0, format: "comic" });
  assert.equal(saved["viking-2"].chapter, "a-winter-postcard");
  const url = new URL(machineBookUrl("grail", "the-x-ray-moon", "comic"), "https://rovervilla.example");
  assert.equal(url.pathname, "/heroes/grail/book");
  assert.equal(url.searchParams.get("chapter"), "the-x-ray-moon");
});

test("GRAIL's mascon and burn lessons require the ordered steps", () => {
  assert.equal(grailMasconStep("approach", "pass"), "approach");
  assert.equal(grailMasconStep("approach", "approach"), "stretch");
  assert.equal(grailMasconStep("stretch", "pass"), "recover");
  assert.equal(grailMasconStep("recover", "reset"), "approach");
  assert.equal(grailBurnStep("orbit", "impact"), "orbit");
  assert.equal(grailBurnStep("orbit", "burn"), "burning");
  assert.equal(grailBurnStep("burning", "deplete"), "empty");
  assert.equal(grailBurnStep("empty", "impact"), "impact");
});

test("GRAIL activities use native accessible controls and separate source photos", () => {
  for (const chapter of GRAIL_BOOK.chapters) {
    const markup = renderToStaticMarkup(<GrailChapterExtras chapter={chapter.id} />);
    assert.match(markup, /type="button"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /\/api\/stories\/grail\/evidence/);
    assert.ok(!/autoplay|autoPlay/.test(markup));
    if (chapter.id === "cosmic-tag") assert.match(markup, /range-rate/);
    if (chapter.id === "the-x-ray-moon") assert.match(markup, /porosity/);
  }
  for (const photo of Object.values(GRAIL_PHOTOS)) { source(photo.source); source(photo.src); assert.equal(photo.ai, false); }
  assert.match(GRAIL_PHOTOS.porosity.alt, /porosity map, not a crust-thickness measurement/);
  assert.match(GRAIL_PHOTOS.cover.alt, /artist concept, not a flight photograph/);
});

test("GRAIL's published text corrects the draft's precision and ID errors", () => {
  const prose = GRAIL_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/0\.02 microns|red blood cell \(0\.02|307 kg|202 kg dry|PIA14886|PIA16842|PIA16588.+thickness|PIA16600.+impact-site|thermal brick|oven brick|pre-heat/i.test(prose));
  assert.match(prose, /range-rate/);
  assert.match(prose, /132\.6|fueled/i.test(prose) ? /132/ : /range-rate/);
  assert.match(prose, /more than 115,000/i);
  assert.match(prose, /Sally K\. Ride Impact Site/);
});

test("GRAIL evidence keeps conflicts and the narration manifest has no recordings", async () => {
  const evidence = await evidenceGET().json();
  assert.equal(evidence.identity.cosparA, "2011-046A");
  assert.equal(evidence.identity.cosparB, "2011-046B");
  assert.equal(evidence.spacecraft.dryMassEachKg, 132.6);
  assert.equal(evidence.spacecraft.fueledMassEachKg, 202.4);
  assert.equal(evidence.chronologyQualifications.flowOrbitInsertion.length, 2);
  assert.equal(evidence.findings.rangingUnit, "range-rate (meters per second), not distance in microns");
  assert.equal(evidence.findings.exactRangingPrecisionAsserted, null);
  assert.equal(evidence.findings.craterDiameterM, 5);
  assert.equal(evidence.findings.currentHardwareFunctionality, null);
  assert.equal(evidence.findings.recordedFarewellWords, null);
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(manifest.missingClips, 20);
  assert.equal(GRAIL_AUDIO_MANIFEST.readyClips, 0);
});
