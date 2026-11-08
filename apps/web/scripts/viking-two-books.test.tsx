import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { VIKING_TWO_BOOK } from "../lib/machine-books/viking-two";
import { chapterParagraphs, getMachineBook, machineBookUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { VIKING_TWO_SOURCES } from "../lib/viking-two-sources";
import { VIKING_TWO_THOUGHTS, VIKING_TWO_AUDIO_MANIFEST } from "../lib/viking-two-thoughts";
import { VIKING_TWO_PHOTOS } from "../lib/viking-two-media";
import { VIKING_TWO_ART_SCENES } from "../lib/viking-two-scenes";
import { vikingTwoRelayStep } from "../lib/viking-two-activities";
import EventComicPage from "../app/components/story/event-comic-page";
import VikingTwoThoughtStory from "../app/components/story/viking-two-thought-story";
import VikingTwoChapterExtras from "../app/components/story/viking-two-chapter-extras";
import { GET as evidenceGET } from "../app/api/stories/viking-2/evidence/route";
import { GET as narrationGET } from "../app/api/stories/viking-2/narration/route";

function source(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov") || parsed.hostname === "www.uahirise.org", url);
}

test("Viking 2 shares five chapters and twenty beats across comic, book and scroll", () => {
  assert.equal(getMachineBook("viking-2"), VIKING_TWO_BOOK);
  assert.equal(VIKING_TWO_BOOK.chapters.length, 5);
  assert.equal(VIKING_TWO_THOUGHTS.length, 20);
  assert.equal(new Set(VIKING_TWO_THOUGHTS.map(item => item.beatId)).size, 20);
  for (const record of Object.values(VIKING_TWO_SOURCES)) { source(record.url); assert.ok(record.locator && record.evidence); }
  for (const chapter of VIKING_TWO_BOOK.chapters) {
    source(chapter.source);
    chapter.relatedSources?.forEach(item => source(item.url));
    chapter.telemetry?.forEach(item => source(item.source));
    assert.deepEqual(VIKING_TWO_THOUGHTS.filter(item => item.chapterId === chapter.id).map(item => item.narrationText), chapterParagraphs(chapter));
    assert.equal(VIKING_TWO_ART_SCENES[chapter.id].length, 4);
    const markup = renderToStaticMarkup(<EventComicPage book={VIKING_TWO_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="viking-two-art"/g) ?? []).length, 4);
    for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
  }
});

test("Viking 2's scroll exposes reading links, chapter anchors and factual text on the server", () => {
  const markup = renderToStaticMarkup(<VikingTwoThoughtStory />);
  assert.match(markup, /data-machine="viking-2"/);
  assert.match(markup, /viking-two-thoughts/);
  assert.match(markup, /Choose how to read Viking 2/);
  assert.match(markup, /format=comic/);
  assert.match(markup, /format=book/);
  for (const chapter of VIKING_TWO_BOOK.chapters) {
    assert.ok(markup.includes(`id="${chapter.id}"`));
    for (const beat of chapter.beats) assert.ok(markup.includes(renderToStaticMarkup(<>{beat.detail}</>)));
  }
});

test("Viking 2's bookmarks remain separate from its twin and respect explicit chapters", () => {
  const saved = readMachineBookmarks(JSON.stringify({ "viking-2": { chapter: "a-winter-postcard", format: "book" }, "viking-1": { chapter: "soil-with-a-surprise", format: "comic" } }));
  assert.deepEqual(resolveMachineReading(VIKING_TWO_BOOK, null, null, saved["viking-2"]), { index: 3, format: "book" });
  assert.deepEqual(resolveMachineReading(VIKING_TWO_BOOK, "a-leaning-arrival", "comic", saved["viking-2"]), { index: 0, format: "comic" });
  assert.equal(saved["viking-1"].chapter, "soil-with-a-surprise");
  const url = new URL(machineBookUrl("viking-2", "a-winter-postcard", "comic"), "https://rovervilla.example");
  assert.equal(url.pathname, "/heroes/viking-2/book");
  assert.equal(url.searchParams.get("chapter"), "a-winter-postcard");
});

test("Viking 2's relay requires storage, transfer to an orbiter and forwarding to Earth", () => {
  assert.equal(vikingTwoRelayStep("empty", "forward"), "empty");
  assert.equal(vikingTwoRelayStep("empty", "pass"), "empty");
  const stored = vikingTwoRelayStep("empty", "store");
  assert.equal(stored, "stored");
  const passed = vikingTwoRelayStep(stored, "pass");
  assert.equal(passed, "at-orbiter");
  assert.equal(vikingTwoRelayStep(passed, "forward"), "on-earth");
  assert.equal(vikingTwoRelayStep("on-earth", "reset"), "empty");
});

test("Viking 2 activities use native accessible controls and separate source photos", () => {
  for (const chapter of VIKING_TWO_BOOK.chapters) {
    const markup = renderToStaticMarkup(<VikingTwoChapterExtras chapter={chapter.id} />);
    assert.match(markup, /type="button"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /\/api\/stories\/viking-2\/evidence/);
    assert.ok(!/autoplay|autoPlay/.test(markup));
    if (chapter.id === "a-winter-postcard") { assert.match(markup, /type="range"/); assert.match(markup, /not measured temperature or ice thickness/); }
    if (chapter.id === "ears-that-heard-the-wind") assert.match(markup, /not the recorded Sol 80 waveform/);
  }
  for (const photo of Object.values(VIKING_TWO_PHOTOS)) { source(photo.source); source(photo.src); assert.equal(photo.ai, false); }
  assert.match(VIKING_TWO_PHOTOS.rock.alt, /names the rock Mister Badger, not the arm/);
  assert.match(VIKING_TWO_PHOTOS.frost.alt, /May 18, 1979/);
});

test("Viking 2's published text rejects unsupported precision and keeps the seismic event ambiguous", () => {
  const prose = VIKING_TWO_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/my arm.{0,30}Mister Badger|million-year|2\.8 tremor|zero wind|8\.2.degree|Footpad #3|-120|seven weeks|NASA.*certified/.test(prose));
  assert.match(prose, /not three hours of total blindness/);
  assert.match(prose, /names? does not belong to my arm|name does not belong to my arm/);
  assert.match(prose, /No wind measurement was available within twenty minutes/);
  assert.match(prose, /residue included water and dust/);
  assert.match(prose, /not a confirmation of my ambiguous event/);
});

test("Viking 2 evidence retains source conflicts and narration truthfully has no recordings", async () => {
  const evidence = await evidenceGET().json();
  assert.equal(evidence.identity.cosparId, "1975-083C");
  assert.equal(evidence.findings.confirmedSol80Marsquake, false);
  assert.equal(evidence.findings.directlyMeasuredSol80MagnitudeAndDistance, null);
  assert.equal(evidence.findings.currentHardwareFunctionality, null);
  assert.equal(evidence.findings.recordedFarewellWords, null);
  assert.equal(evidence.chronologyQualifications.tiltDegrees.length, 2);
  assert.equal(evidence.chronologyQualifications.landingTimes.length, 2);
  const frost = evidence.missionFacts.find((item: { label: string }) => item.label === "Frost photograph");
  assert.equal(frost.cameraMetadata, "Camera 1");
  assert.equal(frost.exposureDate, "1979-05-18");
  assert.equal(frost.earthRelayDate, "1979-06-07");
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(manifest.missingClips, 20);
  assert.equal(VIKING_TWO_AUDIO_MANIFEST.readyClips, 0);
});
