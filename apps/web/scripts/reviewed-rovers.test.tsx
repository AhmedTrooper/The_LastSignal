import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { LRV_BOOK } from "../lib/machine-books/apollo-15-rover";
import { PATHFINDER_BOOK } from "../lib/machine-books/pathfinder-sojourner";
import { getMachineBook, chapterParagraphs, MACHINE_BOOKS, machineBookUrl, readMachineBookmarks } from "../lib/machine-books";
import { LRV_SOURCES, LRV_FACTS, LRV_POSITION } from "../lib/lrv-sources";
import { PATHFINDER_SOURCES, PATHFINDER_FACTS, PATHFINDER_POSITION } from "../lib/pathfinder-sources";
import { LRV_PHOTOS, LRV_RESOURCES } from "../lib/lrv-media";
import { PATHFINDER_PHOTOS, PATHFINDER_RESOURCES } from "../lib/pathfinder-media";
import { LRV_THOUGHTS, LRV_AUDIO_MANIFEST } from "../lib/lrv-thoughts";
import { PATHFINDER_THOUGHTS, PATHFINDER_AUDIO_MANIFEST } from "../lib/pathfinder-thoughts";
import { LRV_ART_SCENES, PATHFINDER_ART_SCENES } from "../lib/rover-scenes";
import { LRV_INVESTIGATIONS, PATHFINDER_INVESTIGATIONS } from "../lib/rover-investigations";
import EventComicPage from "../app/components/story/event-comic-page";
import LrvThoughtStory from "../app/components/story/lrv-thought-story";
import PathfinderThoughtStory from "../app/components/story/pathfinder-thought-story";
import RoverChapterExtras from "../app/components/story/rover-chapter-extras";
import { GET as lrvEvidence } from "../app/api/stories/apollo-15-rover/evidence/route";
import { GET as pathfinderEvidence } from "../app/api/stories/pathfinder-sojourner/evidence/route";
import { GET as lrvNarration } from "../app/api/stories/apollo-15-rover/narration/route";
import { GET as pathfinderNarration } from "../app/api/stories/pathfinder-sojourner/narration/route";

function nasa(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov"), url);
}
const editions = [
  { book: LRV_BOOK, moments: LRV_THOUGHTS, manifest: LRV_AUDIO_MANIFEST, sources: LRV_SOURCES, facts: LRV_FACTS, scenes: LRV_ART_SCENES, investigations: LRV_INVESTIGATIONS, photos: LRV_PHOTOS, resources: LRV_RESOURCES, machine: "lrv" as const, Reader: LrvThoughtStory },
  { book: PATHFINDER_BOOK, moments: PATHFINDER_THOUGHTS, manifest: PATHFINDER_AUDIO_MANIFEST, sources: PATHFINDER_SOURCES, facts: PATHFINDER_FACTS, scenes: PATHFINDER_ART_SCENES, investigations: PATHFINDER_INVESTIGATIONS, photos: PATHFINDER_PHOTOS, resources: PATHFINDER_RESOURCES, machine: "pathfinder" as const, Reader: PathfinderThoughtStory },
];

test("all fifteen machines now have a registered shared book, including the two former legacy routes", () => {
  assert.equal(MACHINE_BOOKS.length, 15);
  assert.equal(getMachineBook("apollo-15-rover"), LRV_BOOK);
  assert.equal(getMachineBook("pathfinder-sojourner"), PATHFINDER_BOOK);
});

test("each new story has eight ordered chapters, four shared beats and 32 stable moments", () => {
  for (const edition of editions) {
    assert.equal(edition.book.chapters.length, 8);
    assert.equal(edition.moments.length, 32);
    assert.equal(new Set(edition.moments.map(moment => moment.beatId)).size, 32);
    assert.equal(new Set(Object.values(edition.scenes).flat()).size, 32);
    for (const chapter of edition.book.chapters) {
      assert.equal(chapter.beats.length, 4);
      nasa(chapter.source);
      chapter.relatedSources?.forEach(source => nasa(source.url));
      chapter.telemetry?.forEach(item => nasa(item.source));
      assert.deepEqual(edition.moments.filter(moment => moment.chapterId === chapter.id).map(moment => moment.narrationText), chapterParagraphs(chapter));
      assert.ok(edition.investigations[chapter.id]?.choices.length >= 2);
      const markup = renderToStaticMarkup(<EventComicPage book={edition.book} chapter={chapter} />);
      assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
      assert.equal((markup.match(new RegExp(`class="${edition.machine}-art"`, "g")) ?? []).length, 4);
      chapter.beats.forEach(beat => assert.ok(markup.includes(renderToStaticMarkup(<>{beat.line}</>)), `${edition.book.slug}/${chapter.id}: missing comic line`));
      for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
      const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      assert.equal(new Set(ids).size, ids.length);
    }
  }
  assert.deepEqual(LRV_BOOK.chapters.map(chapter => chapter.id), ["a-car-in-a-cupboard", "the-wheels-unfold", "another-way-to-steer", "the-seatbelt-passenger", "uphill-to-a-white-rock", "a-wall-with-layers", "parked-to-watch", "the-wheels-stayed-the-clues-travelled"]);
  assert.deepEqual(PATHFINDER_BOOK.chapters.map(chapter => chapter.id), ["two-jobs-one-journey", "the-landing-that-bounced", "a-ramp-not-yet-a-road", "the-rocks-with-nicknames", "the-station-watched-the-sky", "the-week-became-a-longer-journey", "a-carrier-is-not-a-conversation", "the-record-outlived-the-link"]);
});

test("sources, numbers, images and evidence exports retain NASA provenance and declared limits", async () => {
  for (const edition of editions) {
    for (const source of Object.values(edition.sources)) { nasa(source.url); assert.ok(source.locator.length > 5 && source.evidence.length > 40); }
    for (const fact of edition.facts) { nasa(fact.source); assert.ok(fact.locator && fact.note); if (fact.status === "unknown") assert.equal(fact.value, null); }
    for (const photo of Object.values(edition.photos)) { nasa(photo.src); nasa(photo.source); assert.equal(photo.ai, false); assert.ok(photo.credit && photo.alt); }
    edition.resources.forEach(resource => nasa(resource.source));
  }
  const lunar = await lrvEvidence().json();
  const mars = await pathfinderEvidence().json();
  assert.equal(lunar.identity.parentMissionCosparId, "1971-063C");
  assert.equal(lunar.identity.independentlyVerifiedRoverCosparId, null);
  assert.equal(lunar.unknowns.exactRoverParkingCoordinates, null);
  assert.match(LRV_POSITION.appliesTo, /NOT/);
  assert.equal(mars.identity.landerCosparId, "1996-068A");
  assert.equal(mars.identity.independentlyVerifiedRoverCosparId, null);
  assert.equal(mars.unknowns.provenCommunicationLossCause, null);
  assert.equal(mars.unknowns.exactFinalRoverMovement, null);
  assert.equal(PATHFINDER_POSITION.finalRoverCoordinates, null);
  assert.equal(PATHFINDER_POSITION.longitudeEast, 360 - PATHFINDER_POSITION.longitudeWest);
  assert.equal(lunar.facts.find((fact: { id: string }) => fact.id === "nssdca-distance").value, 27.8);
  assert.equal(lunar.facts.find((fact: { id: string }) => fact.id === "summary-distance").value, 27.9);
  assert.equal(mars.facts.find((fact: { id: string }) => fact.id === "data-later").value, 2.3);
  assert.equal(mars.facts.find((fact: { id: string }) => fact.id === "data-contemporary").value, 2.6);
});

test("new scroll readers and investigations keep accessible controls and all three formats", () => {
  for (const edition of editions) {
    const markup = renderToStaticMarkup(<edition.Reader />);
    assert.ok(markup.includes(`data-machine="${edition.book.slug}"`));
    assert.match(markup, /format=comic/);
    assert.match(markup, /format=book/);
    assert.match(markup, /data-entrance=/);
    assert.doesNotMatch(markup, /story-image|apollo-story-image/);
    for (const chapter of edition.book.chapters) {
      chapter.beats.forEach(beat => assert.ok(markup.includes(renderToStaticMarkup(<>{beat.detail}</>)), `${edition.book.slug}/${chapter.id}: missing full context`));
      const extras = renderToStaticMarkup(<RoverChapterExtras machine={edition.machine} chapter={chapter.id} />);
      assert.match(extras, /type="button"/);
      assert.match(extras, /aria-pressed=/);
      assert.match(extras, /role="status"/);
      assert.match(extras, /Download the NASA source ledger/);
      assert.doesNotMatch(extras, /<iframe|autoplay|autoPlay/, "Archive embeds must require a user action");
    }
    const bookmarks = readMachineBookmarks(JSON.stringify({ [edition.book.slug]: { chapter: edition.book.chapters[2].id, format: "book" } }));
    assert.equal(bookmarks[edition.book.slug].chapter, edition.book.chapters[2].id);
    assert.ok(machineBookUrl(edition.book.slug, edition.book.chapters[2].id, "comic").includes("format=comic"));
  }
});

test("narration manifests contain scripts only, not invented recordings or durations", async () => {
  for (const manifest of [await lrvNarration().json(), await pathfinderNarration().json()]) {
    assert.equal(manifest.totalMoments, 32);
    assert.equal(manifest.readyClips, 0);
    assert.equal(manifest.missingClips, 32);
    manifest.moments.forEach((moment: { audio: { src: unknown; durationMs: unknown } }) => { assert.equal(moment.audio.src, null); assert.equal(moment.audio.durationMs, null); });
  }
});

test("downloadable research JSON is an exact export of the single source, not a drifting second story", async () => {
  for (const get of [lrvEvidence, pathfinderEvidence]) {
    const evidence = await get().json();
    const exported = JSON.parse(readFileSync(new URL(`../docs/research/${evidence.machineId}-nasa-evidence.json`, import.meta.url), "utf8"));
    assert.deepEqual(exported, evidence);
  }
});

test("stories reject common dramatic but unsupported substitutions", () => {
  const moon = LRV_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  const mars = PATHFINDER_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.doesNotMatch(moon, /duct tape|taped map|35 kg|GPS-guided|oldest Moon rock/);
  assert.match(moon, /reported a stop to adjust his seatbelt/);
  assert.match(mars, /not turn a prediction about circling into a witnessed final drive/);
  assert.match(mars, /could not recover lander health data/);
  assert.doesNotMatch(mars, /1996-068B|SATCAT 24680|83 sols|the rover's last words were/i);
});
