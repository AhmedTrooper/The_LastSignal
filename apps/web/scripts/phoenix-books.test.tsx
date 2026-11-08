import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PHOENIX_BOOK } from "../lib/machine-books/phoenix";
import { chapterParagraphs, getMachineBook, machineBookUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { PHOENIX_SOURCES } from "../lib/phoenix-sources";
import { PHOENIX_THOUGHTS, PHOENIX_AUDIO_MANIFEST } from "../lib/phoenix-thoughts";
import { PHOENIX_PHOTOS } from "../lib/phoenix-media";
import { PHOENIX_ART_SCENES } from "../lib/phoenix-scenes";
import { phoenixTrenchStep, phoenixWinterStep } from "../lib/phoenix-activities";
import EventComicPage from "../app/components/story/event-comic-page";
import PhoenixThoughtStory from "../app/components/story/phoenix-thought-story";
import PhoenixChapterExtras from "../app/components/story/phoenix-chapter-extras";
import { GET as evidenceGET } from "../app/api/stories/phoenix/evidence/route";
import { GET as narrationGET } from "../app/api/stories/phoenix/narration/route";

function source(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov") || parsed.hostname.endsWith(".uahirise.org") || parsed.hostname === "www.planetary.org", url);
}

test("Phoenix shares five chapters and twenty beats across comic, book and scroll", () => {
  assert.equal(getMachineBook("phoenix"), PHOENIX_BOOK);
  assert.equal(PHOENIX_BOOK.chapters.length, 5);
  assert.equal(PHOENIX_THOUGHTS.length, 20);
  assert.equal(new Set(PHOENIX_THOUGHTS.map(item => item.beatId)).size, 20);
  for (const record of Object.values(PHOENIX_SOURCES)) { source(record.url); assert.ok(record.locator && record.evidence); }
  for (const chapter of PHOENIX_BOOK.chapters) {
    source(chapter.source);
    chapter.relatedSources?.forEach(item => source(item.url));
    chapter.telemetry?.forEach(item => source(item.source));
    assert.deepEqual(PHOENIX_THOUGHTS.filter(item => item.chapterId === chapter.id).map(item => item.narrationText), chapterParagraphs(chapter));
    assert.equal(PHOENIX_ART_SCENES[chapter.id].length, 4);
    const markup = renderToStaticMarkup(<EventComicPage book={PHOENIX_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="phoenix-art"/g) ?? []).length, 4);
    for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
  }
});

test("Phoenix's scroll exposes reading links, chapter anchors and factual text on the server", () => {
  const markup = renderToStaticMarkup(<PhoenixThoughtStory />);
  assert.match(markup, /data-machine="phoenix"/);
  assert.match(markup, /phoenix-thoughts/);
  assert.match(markup, /Choose how to read Phoenix/);
  assert.match(markup, /format=comic/);
  assert.match(markup, /format=book/);
  for (const chapter of PHOENIX_BOOK.chapters) {
    assert.ok(markup.includes(`id="${chapter.id}"`));
    for (const beat of chapter.beats) assert.ok(markup.includes(renderToStaticMarkup(<>{beat.detail}</>)));
  }
});

test("Phoenix bookmarks stay separate and respect explicit chapters", () => {
  const saved = readMachineBookmarks(JSON.stringify({ "phoenix": { chapter: "friendly-soil-and-laser-snow", format: "book" }, "grail": { chapter: "the-x-ray-moon", format: "comic" } }));
  assert.deepEqual(resolveMachineReading(PHOENIX_BOOK, null, null, saved["phoenix"]), { index: 3, format: "book" });
  assert.deepEqual(resolveMachineReading(PHOENIX_BOOK, "risen-from-the-ashes", "comic", saved["phoenix"]), { index: 0, format: "comic" });
  assert.equal(saved["grail"].chapter, "the-x-ray-moon");
  const url = new URL(machineBookUrl("phoenix", "friendly-soil-and-laser-snow", "comic"), "https://rovervilla.example");
  assert.equal(url.pathname, "/heroes/phoenix/book");
  assert.equal(url.searchParams.get("chapter"), "friendly-soil-and-laser-snow");
});

test("Phoenix trench and winter lessons require the ordered steps", () => {
  assert.equal(phoenixTrenchStep("sol24", "compare"), "sol24");
  assert.equal(phoenixTrenchStep("sol20", "compare"), "sol24");
  assert.equal(phoenixTrenchStep("sol24", "reset"), "sol20");
  assert.equal(phoenixWinterStep("summer", "return"), "summer");
  assert.equal(phoenixWinterStep("summer", "darken"), "dark");
  assert.equal(phoenixWinterStep("dark", "return"), "after");
});

test("Phoenix activities use native accessible controls and separate source photos", () => {
  for (const chapter of PHOENIX_BOOK.chapters) {
    const markup = renderToStaticMarkup(<PhoenixChapterExtras chapter={chapter.id} />);
    assert.match(markup, /type="button"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /\/api\/stories\/phoenix\/evidence/);
    assert.ok(!/autoplay|autoPlay/.test(markup));
    if (chapter.id === "holy-cow-and-vanishing-ice") assert.match(markup, /Compare four days later/);
    if (chapter.id === "a-winter-farewell") assert.match(markup, /Enter winter darkness/);
  }
  for (const photo of Object.values(PHOENIX_PHOTOS)) { source(photo.source); source(photo.src); assert.equal(photo.ai, false); }
  assert.match(PHOENIX_PHOTOS.cover.alt, /artist concept, not a flight photograph/);
  assert.match(PHOENIX_PHOTOS.parachute.alt, /about 20 km in front of the crater/);
});

test("Phoenix's published text corrects the draft's precision and ID errors", () => {
  const prose = PHOENIX_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/12 thrusters|302 N|310 km away|pH 7\.7|0\.6% perchlorate|150 to 200 kg|80 centimeters|500 to 1,000 years|MARDI|gyro/i.test(prose));
  assert.match(prose, /23:38:38 UT/);
  assert.match(prose, /760 km/);
  assert.match(prose, /vaporized before reaching the ground|vaporized/i);
  assert.match(prose, /about 2\.5 miles|2\.5 miles/i);
});

test("Phoenix evidence keeps clock conflicts and the narration manifest has no recordings", async () => {
  const evidence = await evidenceGET().json();
  assert.equal(evidence.identity.cosparId, "2007-034A");
  assert.equal(evidence.chronologyQualifications.touchdownClocks.length, 2);
  assert.equal(evidence.findings.exactPhAsserted, null);
  assert.equal(evidence.findings.exactPerchloratePercentAsserted, null);
  assert.equal(evidence.findings.snowReachedGround, false);
  assert.equal(evidence.findings.currentHardwareFunctionality, null);
  assert.equal(evidence.findings.recordedFarewellWords, null);
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(manifest.missingClips, 20);
  assert.equal(PHOENIX_AUDIO_MANIFEST.readyClips, 0);
});
