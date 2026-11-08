import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MPL_BOOK } from "../lib/machine-books/mars-polar-lander";
import { chapterParagraphs, getMachineBook, machineBookUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { MPL_SOURCES } from "../lib/mpl-sources";
import { MPL_THOUGHTS, MPL_AUDIO_MANIFEST } from "../lib/mpl-thoughts";
import { MPL_PHOTOS } from "../lib/mpl-media";
import { MPL_ART_SCENES } from "../lib/mpl-scenes";
import { mplLatchStep, mplTelemetryStep } from "../lib/mpl-activities";
import EventComicPage from "../app/components/story/event-comic-page";
import MplThoughtStory from "../app/components/story/mpl-thought-story";
import MplChapterExtras from "../app/components/story/mpl-chapter-extras";
import { GET as evidenceGET } from "../app/api/stories/mars-polar-lander/evidence/route";
import { GET as narrationGET } from "../app/api/stories/mars-polar-lander/narration/route";

function source(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov") || parsed.hostname.endsWith(".uahirise.org"), url);
}

test("Mars Polar Lander shares five chapters and twenty beats across comic, book and scroll", () => {
  assert.equal(getMachineBook("mars-polar-lander"), MPL_BOOK);
  assert.equal(MPL_BOOK.chapters.length, 5);
  assert.equal(MPL_THOUGHTS.length, 20);
  assert.equal(new Set(MPL_THOUGHTS.map(item => item.beatId)).size, 20);
  for (const record of Object.values(MPL_SOURCES)) { source(record.url); assert.ok(record.locator && record.evidence); }
  for (const chapter of MPL_BOOK.chapters) {
    source(chapter.source);
    chapter.relatedSources?.forEach(item => source(item.url));
    chapter.telemetry?.forEach(item => source(item.source));
    assert.deepEqual(MPL_THOUGHTS.filter(item => item.chapterId === chapter.id).map(item => item.narrationText), chapterParagraphs(chapter));
    assert.equal(MPL_ART_SCENES[chapter.id].length, 4);
    const markup = renderToStaticMarkup(<EventComicPage book={MPL_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="mpl-art"/g) ?? []).length, 4);
    for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
  }
});

test("Mars Polar Lander's scroll exposes reading links, chapter anchors and factual text on the server", () => {
  const markup = renderToStaticMarkup(<MplThoughtStory />);
  assert.match(markup, /data-machine="mars-polar-lander"/);
  assert.match(markup, /mpl-thoughts/);
  assert.match(markup, /Choose how to read Mars Polar Lander/);
  assert.match(markup, /format=comic/);
  assert.match(markup, /format=book/);
  for (const chapter of MPL_BOOK.chapters) {
    assert.ok(markup.includes(`id="${chapter.id}"`));
    for (const beat of chapter.beats) assert.ok(markup.includes(renderToStaticMarkup(<>{beat.detail}</>)));
  }
});

test("Mars Polar Lander bookmarks stay separate and respect explicit chapters", () => {
  const saved = readMachineBookmarks(JSON.stringify({ "mars-polar-lander": { chapter: "searching-the-ice", format: "book" }, "phoenix": { chapter: "friendly-soil-and-laser-snow", format: "comic" } }));
  assert.deepEqual(resolveMachineReading(MPL_BOOK, null, null, saved["mars-polar-lander"]), { index: 3, format: "book" });
  assert.deepEqual(resolveMachineReading(MPL_BOOK, "carrying-names-and-a-microphone", "comic", saved["mars-polar-lander"]), { index: 0, format: "comic" });
  assert.equal(saved["phoenix"].chapter, "friendly-soil-and-laser-snow");
  const url = new URL(machineBookUrl("mars-polar-lander", "searching-the-ice", "comic"), "https://rovervilla.example");
  assert.equal(url.pathname, "/heroes/mars-polar-lander/book");
  assert.equal(url.searchParams.get("chapter"), "searching-the-ice");
});

test("Mars Polar Lander lessons require the ordered steps", () => {
  assert.equal(mplLatchStep("descent", "clear"), "descent");
  assert.equal(mplLatchStep("descent", "deploy"), "deployed");
  const latched = mplLatchStep("deployed", "latch");
  assert.equal(latched, "latched");
  assert.equal(mplLatchStep(latched, "clear"), "cleared");
  assert.equal(mplTelemetryStep("silent", "descend"), "silent");
  assert.equal(mplTelemetryStep("silent", "enable"), "heartbeat");
  assert.equal(mplTelemetryStep("heartbeat", "descend"), "landed");
});

test("Mars Polar Lander activities use native accessible controls and separate source photos", () => {
  for (const chapter of MPL_BOOK.chapters) {
    const markup = renderToStaticMarkup(<MplChapterExtras chapter={chapter.id} />);
    assert.match(markup, /type="button"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /\/api\/stories\/mars-polar-lander\/evidence/);
    assert.ok(!/autoplay|autoPlay/.test(markup));
    if (chapter.id === "the-fatal-latch") assert.match(markup, /Clear before touchdown check/);
    if (chapter.id === "lessons-and-phoenix") assert.match(markup, /Enable live tones/);
  }
  for (const photo of Object.values(MPL_PHOTOS)) { source(photo.source); source(photo.src); assert.equal(photo.ai, false); }
  assert.match(MPL_PHOTOS.cover.alt, /illustration, not a photograph/);
  assert.match(MPL_PHOTOS.site.alt, /not an image of the lander/);
});

test("Mars Polar Lander's published text corrects the draft's precision and ID errors", () => {
  const prose = MPL_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/576 kg|30,000-G|60,000 G|22 m\/s|179 m\/s|880 ?nm|50-gram|1,000,000|20:03:20|MARDI|gyro|thermal brick|oven brick|pre-heat/i.test(prose));
  assert.match(prose, /false .* signal|old landed/i);
  assert.match(prose, /Deep Space 2/);
  assert.match(prose, /Phoenix/);
});

test("Mars Polar Lander evidence keeps the unknown landing and the narration manifest has no recordings", async () => {
  const evidence = await evidenceGET().json();
  assert.equal(evidence.identity.cosparId, "1999-001A");
  assert.equal(evidence.findings.directlyObservedDescentTelemetry, false);
  assert.equal(evidence.findings.spacecraftPositivelyLocated, false);
  assert.equal(evidence.findings.exactImpactVelocityAsserted, null);
  assert.equal(evidence.findings.exactPeakGAsserted, null);
  assert.equal(evidence.findings.currentHardwareFunctionality, null);
  assert.equal(evidence.findings.recordedFarewellWords, null);
  assert.equal(evidence.spacecraft.dryMassKg, 290);
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(manifest.missingClips, 20);
  assert.equal(MPL_AUDIO_MANIFEST.readyClips, 0);
});
