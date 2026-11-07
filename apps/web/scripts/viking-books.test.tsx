import assert from "node:assert/strict";
import { test } from "node:test";
import { statSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { VIKING_BOOK } from "../lib/machine-books/viking";
import { chapterParagraphs, getMachineBook, machineBookUrl, machineStoryUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { VIKING_SOURCES } from "../lib/viking-sources";
import { VIKING_THOUGHTS, VIKING_AUDIO_MANIFEST } from "../lib/viking-thoughts";
import { VIKING_PHOTOS } from "../lib/viking-media";
import { VIKING_ART_SCENES } from "../lib/viking-scenes";
import { checkVikingTeachingWrite, vikingSamplerStep, VIKING_LAB_TESTS } from "../lib/viking-activities";
import EventComicPage from "../app/components/story/event-comic-page";
import VikingThoughtStory from "../app/components/story/viking-thought-story";
import VikingChapterExtras from "../app/components/story/viking-chapter-extras";
import VikingIllustration from "../app/components/story/viking-illustration";
import { GET as evidenceGET } from "../app/api/stories/viking-1/evidence/route";
import { GET as narrationGET } from "../app/api/stories/viking-1/narration/route";

function missionSource(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov") || parsed.hostname === "www.uahirise.org" || parsed.hostname === "static.uahirise.org", url);
}
const htmlText = (text: string) => renderToStaticMarkup(<>{text}</>);

test("Viking shares twenty sourced beats across five chapters and three formats", () => {
  assert.equal(getMachineBook("viking-1"), VIKING_BOOK);
  assert.equal(VIKING_BOOK.chapters.length, 5);
  assert.equal(VIKING_THOUGHTS.length, 20);
  assert.equal(new Set(VIKING_THOUGHTS.map(item => item.beatId)).size, 20);
  for (const source of Object.values(VIKING_SOURCES)) { missionSource(source.url); assert.ok(source.locator && source.evidence); }
  for (const chapter of VIKING_BOOK.chapters) {
    missionSource(chapter.source);
    chapter.relatedSources?.forEach(source => missionSource(source.url));
    chapter.telemetry?.forEach(item => missionSource(item.source));
    assert.deepEqual(VIKING_THOUGHTS.filter(item => item.chapterId === chapter.id).map(item => item.narrationText), chapterParagraphs(chapter));
    assert.equal(VIKING_ART_SCENES[chapter.id].length, 4);
    const markup = renderToStaticMarkup(<EventComicPage book={VIKING_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="viking-art"/g) ?? []).length, 4);
    for (const beat of chapter.beats) assert.ok(markup.includes(htmlText(beat.line)));
    for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("Viking's scroll has server-visible text, chapter anchors and reading links", () => {
  const markup = renderToStaticMarkup(<VikingThoughtStory />);
  assert.match(markup, /viking-thoughts/);
  assert.match(markup, /data-machine="viking-1"/);
  assert.match(markup, /Choose how to read Viking 1/);
  assert.match(markup, /format=comic/);
  assert.match(markup, /format=book/);
  for (const chapter of VIKING_BOOK.chapters) {
    assert.ok(markup.includes(`id="${chapter.id}"`));
    for (const beat of chapter.beats) assert.ok(markup.includes(htmlText(beat.detail)));
  }
});

test("Viking's independent bookmarks respect explicit chapter links", () => {
  const chapter = VIKING_BOOK.chapters[3];
  for (const format of ["comic", "book"] as const) {
    const url = new URL(machineBookUrl("viking-1", chapter.id, format), "https://rovervilla.example");
    assert.equal(url.pathname, "/heroes/viking-1/book");
    assert.equal(url.searchParams.get("chapter"), chapter.id);
    assert.equal(url.searchParams.get("format"), format);
  }
  assert.equal(machineStoryUrl("viking-1", chapter.id), `/heroes/viking-1/story#${chapter.id}`);
  const saved = readMachineBookmarks(JSON.stringify({ "viking-1": { chapter: chapter.id, format: "comic" }, lcross: { chapter: "the-fuel-scare", format: "book" } }));
  assert.deepEqual(resolveMachineReading(VIKING_BOOK, null, null, saved["viking-1"]), { index: 3, format: "comic" });
  assert.deepEqual(resolveMachineReading(VIKING_BOOK, VIKING_BOOK.chapters[0].id, "book", saved["viking-1"]), { index: 0, format: "book" });
  assert.equal(saved.lcross.chapter, "the-fuel-scare");
});

test("Viking's sampler lesson requires inspection and Earth testing before a trial command", () => {
  assert.equal(vikingSamplerStep("stuck", "try-command"), "stuck");
  assert.equal(vikingSamplerStep("stuck", "test"), "stuck");
  assert.equal(vikingSamplerStep("stuck", "inspect"), "inspected");
  assert.equal(vikingSamplerStep("inspected", "try-command"), "inspected");
  assert.equal(vikingSamplerStep("inspected", "test"), "tested");
  assert.equal(vikingSamplerStep("tested", "try-command"), "released");
  assert.equal(vikingSamplerStep("released", "reset"), "stuck");
});

test("Viking's teaching update blocks overlap without changing radio information", () => {
  assert.equal(checkVikingTeachingWrite("unused").allowed, true);
  assert.equal(checkVikingTeachingWrite("antenna").allowed, false);
  assert.equal(checkVikingTeachingWrite("antenna").radioParametersPreserved, true);
  assert.match(checkVikingTeachingWrite("antenna").explanation, /does not reconstruct the real memory map/);
  assert.equal(VIKING_LAB_TESTS.length, 4);
});

test("Viking's activities use native controls and correctly classified source images", () => {
  for (const chapter of VIKING_BOOK.chapters) {
    const markup = renderToStaticMarkup(<VikingChapterExtras chapter={chapter.id} />);
    assert.match(markup, /type="button"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /\/api\/stories\/viking-1\/evidence/);
    assert.ok(!/autoplay|autoPlay/.test(markup));
    if (chapter.id === "a-picture-and-a-stuck-pin") { assert.match(markup, /type="range"/); assert.match(markup, /not elapsed mission time/); }
  }
  for (const photo of Object.values(VIKING_PHOTOS)) {
    missionSource(photo.source);
    if (photo.src.startsWith("https:")) missionSource(photo.src);
    else assert.ok(statSync(new URL(`../public${photo.src}`, import.meta.url)).size > 0);
    assert.equal(photo.ai, false);
  }
  assert.match(VIKING_PHOTOS.cover.alt, /not a picture of the sampler trenches/);
  assert.match(VIKING_PHOTOS.first.alt, /footpad 2/);
  assert.match(VIKING_PHOTOS.sampler.alt, /on Earth/);
  assert.match(VIKING_PHOTOS.orbital.alt, /November 22, 2006/);
  assert.match(VIKING_PHOTOS.overview.alt, /candidate locations/);
  const clipped = renderToStaticMarkup(<VikingIllustration scene="scan" reveal={500} />);
  assert.match(clipped, /<rect width="640" height="440"/);
});

test("Viking's evidence preserves date conflicts and avoids life or current-functionality claims", async () => {
  const prose = VIKING_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/34 years|zero Earth|ZERO CARBON|zero organics|solved my puzzle|pin two|Pin #2|40,000|22\.2692|May 21|99\.9%|112°C/.test(prose));
  assert.match(prose, /Mars 3 had made an earlier landing/);
  assert.match(prose, /not a complete solution to every life test/);
  assert.match(prose, /could not watch the antenna move/);
  const evidence = await evidenceGET().json();
  assert.equal(evidence.identity.cosparId, "1975-075C");
  assert.equal(evidence.coordinates.independentlyVerifiedFourDecimalArtifactPositions, null);
  assert.equal(evidence.findings.definitiveLifeDetection, false);
  assert.equal(evidence.findings.currentHardwareFunctionality, null);
  assert.equal(evidence.findings.recordedFarewellWords, null);
  assert.equal(evidence.chronologyQualifications.finalTransmissionOrOperations.value, "1982-11-11");
  assert.equal(evidence.chronologyQualifications.catalogContactLoss.value, "1982-11-13");
  assert.equal(evidence.chronologyQualifications.reportBatteryChangeCommand.value, "1982-11-19");
  assert.equal(evidence.chronologyQualifications.reportRecoveryEnd.value, "1983-03");
  assert.equal(evidence.missionFacts.find((item: { label: string }) => item.label === "First HiRISE frame acquisition").value, "2006-11-22");
});

test("Viking's narration manifest truthfully marks all twenty recordings missing", async () => {
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(VIKING_AUDIO_MANIFEST.readyClips, 0);
  assert.equal(manifest.missingClips, 20);
  for (const moment of manifest.moments) { assert.equal(moment.audio.src, null); assert.equal(moment.audio.durationMs, null); }
});
