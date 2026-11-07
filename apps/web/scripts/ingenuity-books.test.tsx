import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { INGENUITY_BOOK } from "../lib/machine-books/ingenuity";
import { getMachineBook, machineBookUrl, chapterParagraphs } from "../lib/machine-books";
import { INGENUITY_THOUGHTS, INGENUITY_AUDIO_MANIFEST } from "../lib/ingenuity-thoughts";
import { INGENUITY_PHOTOS, INGENUITY_ARCHIVE } from "../lib/ingenuity-media";
import { INGENUITY_SOURCES } from "../lib/ingenuity-sources";
import EventComicPage from "../app/components/story/event-comic-page";
import { GET } from "../app/api/stories/ingenuity/evidence/route";

const nasaHosted = (url: string) => {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:");
  assert.ok(parsed.hostname === "nasa.gov" || parsed.hostname.endsWith(".nasa.gov"), url);
};

test("Ingenuity publishes five NASA-sourced chapters as twenty shared thoughts", () => {
  assert.equal(getMachineBook("ingenuity"), INGENUITY_BOOK);
  assert.equal(INGENUITY_BOOK.chapters.length, 5);
  assert.equal(INGENUITY_THOUGHTS.length, 20);
  assert.equal(new Set(INGENUITY_THOUGHTS.map(moment => moment.beatId)).size, 20);
  for (const source of Object.values(INGENUITY_SOURCES)) {
    nasaHosted(source.url);
    assert.ok(source.locator && source.evidence);
  }
  for (const chapter of INGENUITY_BOOK.chapters) {
    nasaHosted(chapter.source);
    chapter.relatedSources?.forEach(source => nasaHosted(source.url));
    chapter.telemetry?.forEach(reading => nasaHosted(reading.source));
    assert.deepEqual(INGENUITY_THOUGHTS.filter(moment => moment.chapterId === chapter.id).map(moment => moment.narrationText), chapterParagraphs(chapter));
    const url = new URL(machineBookUrl("ingenuity", chapter.id, "comic"), "https://rovervilla.example");
    assert.equal(url.pathname, "/heroes/ingenuity/book");
    assert.equal(url.searchParams.get("read"), "1");
    assert.equal(url.searchParams.get("chapter"), chapter.id);
  }
});

test("Ingenuity comics have four aircraft drawings with valid SVG path characters", () => {
  for (const chapter of INGENUITY_BOOK.chapters) {
    const markup = renderToStaticMarkup(<EventComicPage book={INGENUITY_BOOK} chapter={chapter} />);
    assert.equal((markup.match(/class="nook-panel"/g) ?? []).length, 4);
    assert.equal((markup.match(/class="ingenuity-art"/g) ?? []).length, 4);
    for (const match of markup.matchAll(/\bd="([^"]+)"/g)) assert.match(match[1], /^[MmZzLlHhVvCcSsQqTtAa0-9+., eE-]+$/);
  }
  for (const image of Object.values(INGENUITY_PHOTOS)) { nasaHosted(image.src); nasaHosted(image.source); assert.equal(image.ai, false); }
  for (const item of Object.values(INGENUITY_ARCHIVE)) { nasaHosted(item.src); nasaHosted(item.source); }
});

test("Ingenuity preserves uncertainty rather than importing dramatic draft claims", async () => {
  const prose = INGENUITY_BOOK.chapters.flatMap(chapterParagraphs).join(" ");
  assert.ok(!/50 milliseconds|50ms|frozen solid|STILL AWAKE|2020-052B|0\.68|18\.4988/.test(prose));
  assert.match(prose, /most-likely scenario/);
  assert.match(prose, /could potentially hold about twenty years/);
  assert.match(prose, /cannot claim what I am recording today/);
  assert.match(prose, /prepared the fallback patch before my arrival/);
  const evidence = await GET().json();
  assert.equal(evidence.verified2026OperatingStatus, null);
  assert.equal(evidence.exactAirfieldCoordinates, null);
  assert.equal(evidence.identity.independentlyVerifiedCosparId, null);
  assert.equal(INGENUITY_AUDIO_MANIFEST.readyClips, 0);
  assert.equal(INGENUITY_AUDIO_MANIFEST.missingClips, 20);
});
