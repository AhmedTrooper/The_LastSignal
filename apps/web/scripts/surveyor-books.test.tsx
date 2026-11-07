import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, statSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { SURVEYOR_BOOK } from "../lib/machine-books/surveyor";
import { getMachineBook, chapterParagraphs, machineBookUrl, machineStoryUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";
import { SURVEYOR_THOUGHTS, SURVEYOR_AUDIO_MANIFEST } from "../lib/surveyor-thoughts";
import { SURVEYOR_SOURCES, SURVEYOR_POSITION } from "../lib/surveyor-sources";
import { SURVEYOR_ART_SCENES } from "../lib/surveyor-scenes";
import { SURVEYOR_PHOTOS, SURVEYOR_ARCHIVE } from "../lib/surveyor-media";
import { SURVEYOR_DESCENT, nextSurveyorDescent, surveyorShadowRatio } from "../lib/surveyor-activities";
import EventComicPage from "../app/components/story/event-comic-page";
import SurveyorThoughtStory from "../app/components/story/surveyor-thought-story";
import SurveyorChapterExtras from "../app/components/story/surveyor-chapter-extras";
import { GET as evidenceGET } from "../app/api/stories/surveyor-1/evidence/route";
import { GET as narrationGET } from "../app/api/stories/surveyor-1/narration/route";

function missionSource(url: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov") || url === SURVEYOR_SOURCES.orbital.url || url === SURVEYOR_SOURCES.coordinates.url, url);
}

test("Surveyor publishes five sourced chapters as twenty shared prose/comic/scroll beats", () => {
  assert.equal(getMachineBook("surveyor-1"), SURVEYOR_BOOK);
  assert.equal(SURVEYOR_BOOK.chapters.length, 5);
  assert.equal(SURVEYOR_THOUGHTS.length, 20);
  assert.equal(new Set(SURVEYOR_THOUGHTS.map(item => item.beatId)).size, 20);
  for (const source of Object.values(SURVEYOR_SOURCES)) { missionSource(source.url); assert.ok(source.locator && source.evidence); }
  for (const chapter of SURVEYOR_BOOK.chapters) {
    missionSource(chapter.source);
    chapter.relatedSources?.forEach(source => missionSource(source.url));
    chapter.telemetry?.forEach(item => missionSource(item.source));
    assert.deepEqual(SURVEYOR_THOUGHTS.filter(item => item.chapterId === chapter.id).map(item => item.narrationText), chapterParagraphs(chapter));
    assert.equal(SURVEYOR_ART_SCENES[chapter.id].length, 4);
    const markup = renderToStaticMarkup(<EventComicPage book={SURVEYOR_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="surveyor-art"/g) ?? []).length, 4);
    for (const beat of chapter.beats) assert.ok(markup.includes(beat.line));
    for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("Surveyor scroll markup preserves all five chapters and all reading formats", () => {
  const markup = renderToStaticMarkup(<SurveyorThoughtStory />);
  assert.match(markup, /surveyor-thoughts/);
  assert.match(markup, /data-machine="surveyor-1"/);
  assert.match(markup, /Back to the story room/);
  assert.match(markup, /Choose how to read Surveyor 1/);
  assert.match(markup, /format=comic/);
  assert.match(markup, /format=book/);
  for (const chapter of SURVEYOR_BOOK.chapters) {
    assert.ok(markup.includes(`id="${chapter.id}"`));
    for (const beat of chapter.beats) assert.ok(markup.includes(beat.detail));
  }
});

test("Surveyor bookmarks and reader links keep explicit chapters and formats", () => {
  const chapter = SURVEYOR_BOOK.chapters[3];
  for (const format of ["book", "comic"] as const) {
    const url = new URL(machineBookUrl("surveyor-1", chapter.id, format), "https://rovervilla.example");
    assert.equal(url.pathname, "/heroes/surveyor-1/book");
    assert.equal(url.searchParams.get("chapter"), chapter.id);
    assert.equal(url.searchParams.get("format"), format);
  }
  assert.equal(machineStoryUrl("surveyor-1", chapter.id), `/heroes/surveyor-1/story#${chapter.id}`);
  const saved = readMachineBookmarks(JSON.stringify({ "surveyor-1": { chapter: chapter.id, format: "comic" } }));
  assert.deepEqual(resolveMachineReading(SURVEYOR_BOOK, null, null, saved["surveyor-1"]), { index: 3, format: "comic" });
  assert.deepEqual(resolveMachineReading(SURVEYOR_BOOK, SURVEYOR_BOOK.chapters[0].id, "book", saved["surveyor-1"]), { index: 0, format: "book" });
});

test("Surveyor teaching models keep descent order and normalized shadow geometry", () => {
  assert.deepEqual(SURVEYOR_DESCENT.map(item => item.scene), ["approach", "retro", "jettison", "radar", "touchdown"]);
  assert.equal(nextSurveyorDescent(0), 1);
  assert.equal(nextSurveyorDescent(4), 4);
  assert.ok(Math.abs(surveyorShadowRatio(45) - 1) < 1e-10);
  assert.ok(surveyorShadowRatio(15) > surveyorShadowRatio(45));
  assert.ok(surveyorShadowRatio(45) > surveyorShadowRatio(75));
  assert.equal(surveyorShadowRatio(0), surveyorShadowRatio(15));
  assert.equal(surveyorShadowRatio(90), surveyorShadowRatio(75));
  assert.ok(Math.abs(surveyorShadowRatio(NaN) - 1) < 1e-10);
});

test("Surveyor lessons expose native controls and captioned, user-started archive video", () => {
  for (const chapter of SURVEYOR_BOOK.chapters) {
    const markup = renderToStaticMarkup(<SurveyorChapterExtras chapter={chapter.id} />);
    assert.match(markup, /type="button"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /\/api\/stories\/surveyor-1\/evidence/);
    assert.ok(!/autoplay|autoPlay/.test(markup));
    if (chapter.id === "three-feet-down") { assert.match(markup, /<video[^>]*controls=""/); assert.match(markup, /<track kind="captions"/); assert.match(markup, /preload="none"/); }
    if (chapter.id === "the-long-shadow") { assert.match(markup, /type="range"/); assert.match(markup, /Low Sun/); }
  }
  for (const photo of Object.values(SURVEYOR_PHOTOS)) {
    missionSource(photo.source);
    if (photo.src.startsWith("https:")) missionSource(photo.src);
    else assert.ok(statSync(new URL(`../public${photo.src}`, import.meta.url)).size > 0);
    assert.equal(photo.ai, false);
  }
  const film = SURVEYOR_ARCHIVE.retrospective;
  assert.ok(statSync(new URL(`../public${film.src}`, import.meta.url)).size > 0);
  const captions = readFileSync(new URL(`../public${film.captions}`, import.meta.url), "utf8");
  assert.match(captions, /^WEBVTT/);
  assert.ok(!captions.includes("\\h"));
});

test("Surveyor evidence preserves source disagreement without importing dramatic draft claims", async () => {
  const prose = SURVEYOR_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/PIA00359|frozen solid|280|warranty|APOLLO CERTIFIED|5–8 psi|shattered into jagged|15\.7/.test(prose));
  assert.match(prose, /Luna 9 had already soft-landed/);
  assert.match(prose, /first US soft landing/);
  assert.match(prose, /not established as the cause of the battery trouble/);
  assert.match(prose, /no single photograph certified the whole Moon safe/);
  const evidence = await evidenceGET().json();
  assert.equal(evidence.identity.cosparId, "1966-045A");
  assert.equal(evidence.exactAntennaReleaseTime, null);
  assert.equal(evidence.exactStaticBearingCapacity, null);
  assert.equal(evidence.verifiedDebrisCoordinates, null);
  assert.equal(evidence.recordedFarewellWords, null);
  assert.equal(evidence.publishedPositionEstimate.elevationMeters, -1889);
  assert.equal(SURVEYOR_POSITION.tableUncertaintyMeters, 5.6);
  assert.equal(evidence.missionFacts.find((fact: { label: string }) => fact.label === "July 1966 picture count").value, 11150);
  assert.equal(evidence.missionFacts.find((fact: { label: string }) => fact.label === "Later NASA picture count").value, 11240);
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(SURVEYOR_AUDIO_MANIFEST.readyClips, 0);
  assert.equal(manifest.missingClips, 20);
});
