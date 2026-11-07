import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { INSIGHT_BOOK } from "../lib/machine-books/insight";
import { getMachineBook, machineBookUrl, machineStoryUrl, chapterParagraphs } from "../lib/machine-books";
import { INSIGHT_PHOTOS } from "../lib/insight-media";
import { INSIGHT_ART_SCENES } from "../lib/insight-scenes";
import { INSIGHT_THOUGHTS, INSIGHT_AUDIO_MANIFEST } from "../lib/insight-thoughts";
import { INSIGHT_SOURCES } from "../lib/insight-sources";
import EventComicPage from "../app/components/story/event-comic-page";
import { GET as evidenceGET } from "../app/api/stories/insight/evidence/route";
import { GET as narrationGET } from "../app/api/stories/insight/narration/route";

const nasaHosted = (url: string) => {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov"), url);
};

test("InSight has five shared event chapters and twenty source-linked thoughts", () => {
  assert.equal(getMachineBook("insight"), INSIGHT_BOOK);
  assert.equal(INSIGHT_BOOK.chapters.length, 5);
  assert.equal(INSIGHT_THOUGHTS.length, 20);
  assert.equal(new Set(INSIGHT_THOUGHTS.map(moment => moment.beatId)).size, 20);
  for (const source of Object.values(INSIGHT_SOURCES)) {
    nasaHosted(source.url);
    assert.ok(source.locator && source.evidence);
  }
  for (const chapter of INSIGHT_BOOK.chapters) {
    nasaHosted(chapter.source);
    chapter.relatedSources?.forEach(source => nasaHosted(source.url));
    chapter.telemetry?.forEach(reading => nasaHosted(reading.source));
    assert.equal(chapter.beats.length, 4);
    assert.equal(INSIGHT_ART_SCENES[chapter.id].length, 4);
    const thoughts = INSIGHT_THOUGHTS.filter(moment => moment.chapterId === chapter.id);
    assert.deepEqual(thoughts.map(moment => moment.narrationText), chapterParagraphs(chapter));
    for (const format of ["comic", "book"] as const) {
      const url = new URL(machineBookUrl("insight", chapter.id, format), "https://rovervilla.example");
      assert.equal(url.pathname, "/heroes/insight/book");
      assert.equal(url.searchParams.get("format"), format);
      assert.equal(url.searchParams.get("chapter"), chapter.id);
      assert.equal(url.searchParams.get("read"), "1");
    }
    assert.equal(machineStoryUrl("insight", chapter.id), `/heroes/insight/story#${chapter.id}`);
  }
});

test("InSight comics use their own four labelled illustrations, not a rover or Eagle", () => {
  for (const chapter of INSIGHT_BOOK.chapters) {
    const markup = renderToStaticMarkup(<EventComicPage book={INSIGHT_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="insight-art"/g) ?? []).length, 4);
    assert.ok(markup.includes("InSight’s imagined voice"));
    assert.ok(!markup.includes("opportunity-art") && !markup.includes("eagle-issue-art"));
    assert.ok(!markup.includes("ninety") && !markup.includes("sixty"));
  }
  for (const photograph of Object.values(INSIGHT_PHOTOS)) {
    nasaHosted(photograph.source);
    nasaHosted(photograph.src);
    assert.equal(photograph.ai, false);
  }
});

test("InSight does not turn draft precision or a mission metaphor into verified data", () => {
  const prose = INSIGHT_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/4\.5024|1,830|1830|100% active|0\.76|2,429,807/.test(prose));
  assert.match(prose, /deep heat-flow measurement was not achieved/);
  assert.match(prose, /first likely marsquake/);
  assert.match(prose, /about 30 watt-hours/);
  assert.match(prose, /not a permanent cleaning system/);
});

test("InSight exports source evidence without invented recordings or current reflector telemetry", async () => {
  const evidence = await evidenceGET().json();
  assert.equal(evidence.identity.cosparId, "2018-042A");
  assert.equal(evidence.exactComponentCoordinates, null);
  assert.equal(evidence.currentReflectorStatus, null);
  assert.ok(evidence.rejectedOrQualifiedDraftClaims.some((claim: string) => claim.includes("PIA23047")));
  const manifest = await narrationGET().json();
  assert.equal(manifest.totalMoments, 20);
  assert.equal(manifest.readyClips, 0);
  assert.equal(INSIGHT_AUDIO_MANIFEST.missingClips, 20);
  for (const moment of manifest.moments) {
    assert.equal(moment.voiceRole, "imagined-machine-thought");
    assert.equal(moment.audio.src, null);
    assert.equal(moment.audio.durationMs, null);
  }
});
