import assert from "node:assert/strict";
import { test } from "node:test";
import { statSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { LCROSS_BOOK } from "../lib/machine-books/lcross";
import { getMachineBook, chapterParagraphs, machineBookUrl, machineStoryUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { LCROSS_SOURCES } from "../lib/lcross-sources";
import { LCROSS_THOUGHTS, LCROSS_AUDIO_MANIFEST } from "../lib/lcross-thoughts";
import { LCROSS_PHOTOS, LCROSS_ARCHIVE } from "../lib/lcross-media";
import { LCROSS_ART_SCENES } from "../lib/lcross-scenes";
import { LCROSS_IMPACT_STEPS, lcrossRecoveryStep } from "../lib/lcross-activities";
import EventComicPage from "../app/components/story/event-comic-page";
import LcrossThoughtStory from "../app/components/story/lcross-thought-story";
import LcrossChapterExtras from "../app/components/story/lcross-chapter-extras";
import { GET as evidenceGET } from "../app/api/stories/lcross/evidence/route";
import { GET as narrationGET } from "../app/api/stories/lcross/narration/route";

function missionSource(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov") || url === LCROSS_SOURCES.laterCrater.url, url);
}

const htmlText = (text: string) => renderToStaticMarkup(<>{text}</>);

test("LCROSS shares twenty sourced beats between its five chapters and all three formats", () => {
  assert.equal(getMachineBook("lcross"), LCROSS_BOOK);
  assert.equal(LCROSS_BOOK.chapters.length, 5);
  assert.equal(LCROSS_THOUGHTS.length, 20);
  assert.equal(new Set(LCROSS_THOUGHTS.map(item => item.beatId)).size, 20);
  for (const source of Object.values(LCROSS_SOURCES)) { missionSource(source.url); assert.ok(source.locator && source.evidence); }
  for (const chapter of LCROSS_BOOK.chapters) {
    missionSource(chapter.source);
    chapter.relatedSources?.forEach(source => missionSource(source.url));
    chapter.telemetry?.forEach(item => missionSource(item.source));
    assert.deepEqual(LCROSS_THOUGHTS.filter(item => item.chapterId === chapter.id).map(item => item.narrationText), chapterParagraphs(chapter));
    assert.equal(LCROSS_ART_SCENES[chapter.id].length, 4);
    const markup = renderToStaticMarkup(<EventComicPage book={LCROSS_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="lcross-art"/g) ?? []).length, 4);
    for (const beat of chapter.beats) assert.ok(markup.includes(htmlText(beat.line)));
    for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("LCROSS scroll content is server-visible with five chapter anchors and format links", () => {
  const markup = renderToStaticMarkup(<LcrossThoughtStory />);
  assert.match(markup, /lcross-thoughts/);
  assert.match(markup, /data-machine="lcross"/);
  assert.match(markup, /Choose how to read LCROSS/);
  assert.match(markup, /format=comic/);
  assert.match(markup, /format=book/);
  for (const chapter of LCROSS_BOOK.chapters) {
    assert.ok(markup.includes(`id="${chapter.id}"`));
    for (const beat of chapter.beats) assert.ok(markup.includes(htmlText(beat.detail)));
  }
});

test("LCROSS reading links and bookmarks preserve an explicit chapter", () => {
  const chapter = LCROSS_BOOK.chapters[3];
  for (const format of ["comic", "book"] as const) {
    const url = new URL(machineBookUrl("lcross", chapter.id, format), "https://rovervilla.example");
    assert.equal(url.pathname, "/heroes/lcross/book");
    assert.equal(url.searchParams.get("format"), format);
    assert.equal(url.searchParams.get("chapter"), chapter.id);
  }
  assert.equal(machineStoryUrl("lcross", chapter.id), `/heroes/lcross/story#${chapter.id}`);
  const saved = readMachineBookmarks(JSON.stringify({ lcross: { chapter: chapter.id, format: "comic" } }));
  assert.deepEqual(resolveMachineReading(LCROSS_BOOK, null, null, saved.lcross), { index: 3, format: "comic" });
  assert.deepEqual(resolveMachineReading(LCROSS_BOOK, LCROSS_BOOK.chapters[0].id, "book", saved.lcross), { index: 0, format: "book" });
});

test("LCROSS recovery model separates restoring rates from revising safeguards", () => {
  assert.equal(lcrossRecoveryStep("noisy-backup", "revise-protection"), "noisy-backup");
  const restored = lcrossRecoveryStep("noisy-backup", "restore-rates");
  assert.equal(restored, "restored-rates");
  assert.equal(lcrossRecoveryStep(restored, "revise-protection"), "protected");
  assert.equal(lcrossRecoveryStep("protected", "reset"), "noisy-backup");
  assert.deepEqual(LCROSS_IMPACT_STEPS.map(item => item.scene), ["separate", "plan", "impact", "observe", "final"]);
});

test("LCROSS activities provide native controls and a user-started archive visualization", () => {
  for (const chapter of LCROSS_BOOK.chapters) {
    const markup = renderToStaticMarkup(<LcrossChapterExtras chapter={chapter.id} />);
    assert.match(markup, /type="button"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /\/api\/stories\/lcross\/evidence/);
    assert.ok(!/autoplay|autoPlay/.test(markup));
    if (chapter.id === "light-with-a-water-clue") { assert.match(markup, /type="range"/); assert.match(markup, /not an altitude or measured time/); }
    if (chapter.id === "the-impact-that-kept-teaching") { assert.match(markup, /<video[^>]*controls=""/); assert.match(markup, /preload="none"/); assert.match(markup, /NASA data visualization · silent/); }
  }
  for (const photo of Object.values(LCROSS_PHOTOS)) {
    missionSource(photo.source);
    if (photo.src.startsWith("https:")) missionSource(photo.src);
    else assert.ok(statSync(new URL(`../public${photo.src}`, import.meta.url)).size > 0);
    assert.equal(photo.ai, false);
  }
  assert.match(LCROSS_PHOTOS.cover.alt, /artist’s concept/);
  assert.match(LCROSS_PHOTOS.lamp.alt, /not a spacecraft camera frame/);
  assert.ok(statSync(new URL(`../public${LCROSS_ARCHIVE.lamp.src}`, import.meta.url)).size > 0);
});

test("LCROSS evidence keeps water local, instrument roles distinct and uncertain claims qualified", async () => {
  const prose = LCROSS_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/2009-031C|833|6\.5 billion|2-billion|nine cameras|every byte|NASA.*certified|40 gallons/.test(prose));
  assert.match(prose, /not a confirmed hole in my fuel tank/);
  assert.match(prose, /reported uncertainty of 2.9 percentage points/);
  assert.match(prose, /not mean every shadowed crater had the same concentration/);
  assert.match(prose, /likely impact crater/);
  assert.match(prose, /ShadowCam, on Danuri/);
  const evidence = await evidenceGET().json();
  assert.equal(evidence.identity.cosparId, "2009-031B");
  assert.equal(evidence.identity.independentlyVerifiedCentaurCosparId, null);
  assert.equal(evidence.verifiedTwinCraterCoordinates, null);
  assert.equal(evidence.uniformSouthPoleWaterConcentration, null);
  assert.equal(evidence.guaranteedResourceExtractionYield, null);
  assert.equal(evidence.recordedFarewellWords, null);
  const water = evidence.missionFacts.find((item: { label: string }) => item.label === "Local water estimate");
  assert.equal(water.value, 5.6);
  assert.equal(water.uncertaintyPercentagePoints, 2.9);
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(LCROSS_AUDIO_MANIFEST.readyClips, 0);
  assert.equal(manifest.missingClips, 20);
});
