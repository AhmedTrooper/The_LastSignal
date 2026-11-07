import assert from "node:assert/strict";
import { test } from "node:test";
import { MACHINE_BOOKS, machineBookUrl, machineStoryUrl, readMachineBookmarks, resolveMachineReading, chapterParagraphs } from "../lib/machine-books";
import { OPPORTUNITY_BOOK, OPPORTUNITY_HANDOFF } from "../lib/machine-books/opportunity";
import { APOLLO_BOOK } from "../lib/machine-books/apollo";
import { RANGER_BOOK } from "../lib/machine-books/ranger";
import { OPPORTUNITY_SCROLL_EDITION, OPPORTUNITY_PHOTOS } from "../lib/opportunity-media";
import { readMachineScrollPosition } from "../lib/machine-scroll";

test("the completed machine books are in the published library", () => {
  assert.deepEqual(MACHINE_BOOKS.map(book => book.slug), ["apollo-11-lander", "opportunity", "ranger-7", "insight", "ingenuity", "spirit", "surveyor-1", "lcross"]);
  assert.equal(APOLLO_BOOK.chapters.length, 10);
  assert.deepEqual(OPPORTUNITY_BOOK.chapters.map(chapter => chapter.id), ["airbag-landing", "blueberries", "purgatory", "marathon", "dust-storm"]);
  assert.deepEqual(RANGER_BOOK.chapters.map(chapter => chapter.id), ["six-eyed-tower", "six-failures", "lucky-peanuts", "seventeen-minutes", "mare-cognitum"]);
});

test("all Opportunity formats share four beats and retain event-specific sources", () => {
  for (const chapter of OPPORTUNITY_BOOK.chapters) {
    assert.equal(chapter.beats.length, 4);
    assert.equal(chapterParagraphs(chapter).length, 4);
    assert.ok(chapter.beats.every(beat => beat.roverArt && !beat.art));
    assert.ok(chapter.telemetry?.every(item => item.source.startsWith("https://") && item.note));
    assert.ok(chapter.source.startsWith("https://"));
    assert.ok(OPPORTUNITY_SCROLL_EDITION.directions[chapter.id]);
    for (const format of ["comic", "book"] as const) {
      const url = new URL(machineBookUrl("opportunity", chapter.id, format), "https://rovervilla.test");
      assert.equal(url.pathname, "/heroes/opportunity/book");
      const reading = resolveMachineReading(OPPORTUNITY_BOOK, url.searchParams.get("chapter"), url.searchParams.get("format"));
      assert.equal(OPPORTUNITY_BOOK.chapters[reading.index].id, chapter.id);
    }
    assert.equal(machineStoryUrl("opportunity", chapter.id), `/heroes/opportunity/story#${chapter.id}`);
  }
});

test("machine bookmarks cannot move one explorer into another's chapters", () => {
  const bookmarks = readMachineBookmarks(JSON.stringify({ "apollo-11-lander": { chapter: "reflector", format: "book" }, opportunity: { chapter: "blueberries", format: "comic" } }));
  assert.deepEqual(bookmarks, { "apollo-11-lander": { chapter: "reflector", format: "book" }, opportunity: { chapter: "blueberries", format: "comic" } });
  assert.deepEqual(readMachineBookmarks('{"opportunity":{"chapter":"reflector","format":"book"}}'), {});
  assert.equal(readMachineScrollPosition(OPPORTUNITY_BOOK, '{"chapter":"reflector","beat":1}'), null);
  assert.deepEqual(readMachineScrollPosition(OPPORTUNITY_BOOK, '{"chapter":"blueberries","beat":3}'), { chapter: "blueberries", beat: 3 });
});

test("the 2026 handoff is a sourced later milestone, not an Opportunity transmission", () => {
  assert.equal(OPPORTUNITY_HANDOFF.date, "11 October 2026");
  assert.equal(OPPORTUNITY_HANDOFF.previousKm, 45.16);
  assert.equal(OPPORTUNITY_HANDOFF.newKm, 45.22);
  assert.ok(OPPORTUNITY_BOOK.chapters[4].relatedSources?.some(source => source.url === OPPORTUNITY_HANDOFF.source));
  assert.match(OPPORTUNITY_BOOK.chapters[4].beats[3].detail, /not a new signal/);
});

test("image credits identify the actual viewpoint and avoid the fake final-frame attribution", () => {
  assert.ok(Object.values(OPPORTUNITY_PHOTOS).every(photo => !photo.ai && photo.source && photo.alt));
  assert.match(OPPORTUNITY_PHOTOS.handoff.alt, /not an Opportunity photograph/);
  assert.match(OPPORTUNITY_PHOTOS.purgatory.alt, /after Opportunity/);
  const story = JSON.stringify(OPPORTUNITY_BOOK);
  assert.ok(!story.includes("Bank 3"));
  assert.ok(!story.includes("99.998%"));
  assert.ok(!story.includes("My battery is low and it's getting dark"));
  assert.ok(!story.includes("PIA22521"));
});
