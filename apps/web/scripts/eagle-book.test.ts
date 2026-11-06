import assert from "node:assert/strict";
import { test } from "node:test";
import { APOLLO_BOOK } from "../lib/machine-books/apollo";
import { chapterParagraphs, MACHINE_BOOKS, machineBookUrl, readMachineBookmarks, resolveMachineReading } from "../lib/machine-books";

test("Eagle's event book remains published with standalone, source-linked chapters", () => {
  assert.ok(MACHINE_BOOKS.includes(APOLLO_BOOK));
  const ids = APOLLO_BOOK.chapters.map(chapter => chapter.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const chapter of APOLLO_BOOK.chapters) {
    assert.equal(chapter.beats.length, 4, chapter.id);
    assert.ok(chapter.event && chapter.hardware && chapter.discovery && chapter.question);
    assert.ok(["apollojournals.org", "science.nasa.gov", "www.jpl.nasa.gov"].includes(new URL(chapter.source).hostname));
    for (const [index, paragraph] of chapterParagraphs(chapter).entries()) {
      assert.ok(paragraph.includes(chapter.beats[index].line), "Prose must retain the comic's event beat");
      assert.ok(paragraph.includes(chapter.beats[index].detail), "Both formats need the same factual context");
    }
  }
});

test("bookmarks reject malformed, unknown, and obsolete chapter positions", () => {
  for (const raw of [null, "broken", "null", "[]", "42", '{"apollo-11-lander":null}', '{"apollo-11-lander":{"chapter":"missing","format":"comic"}}', '{"apollo-11-lander":{"chapter":"alarm","format":"notes"}}']) {
    assert.deepEqual(readMachineBookmarks(raw), {});
  }
  assert.deepEqual(readMachineBookmarks(JSON.stringify({
    "apollo-11-lander": { chapter: "breaker", format: "book" },
    "spirit": { chapter: "dust-storm", format: "comic" },
  })), { "apollo-11-lander": { chapter: "breaker", format: "book" } });
});

test("explicit links override bookmarks while omitted values resume Eagle", () => {
  const saved = { chapter: "breaker", format: "book" as const };
  const breaker = APOLLO_BOOK.chapters.findIndex(chapter => chapter.id === "breaker");
  const alarm = APOLLO_BOOK.chapters.findIndex(chapter => chapter.id === "alarm");
  assert.deepEqual(resolveMachineReading(APOLLO_BOOK, null, null, saved), { index: breaker, format: "book" });
  assert.deepEqual(resolveMachineReading(APOLLO_BOOK, "alarm", "comic", saved), { index: alarm, format: "comic" });
  assert.deepEqual(resolveMachineReading(APOLLO_BOOK, "alarm", null, saved), { index: alarm, format: "book" });
  assert.deepEqual(resolveMachineReading(APOLLO_BOOK, "obsolete", "invalid", saved), { index: 0, format: "book" });
  assert.deepEqual(resolveMachineReading(APOLLO_BOOK, null, null), { index: 0, format: "comic" });
});

test("chapter and format links round-trip without forcing a format on resume", () => {
  for (const chapter of APOLLO_BOOK.chapters) {
    for (const format of ["comic", "book"] as const) {
      const url = new URL(machineBookUrl(APOLLO_BOOK.slug, chapter.id, format), "https://rovervilla.test");
      assert.equal(url.pathname, "/heroes/apollo-11-lander/book");
      const reading = resolveMachineReading(APOLLO_BOOK, url.searchParams.get("chapter"), url.searchParams.get("format"));
      assert.equal(APOLLO_BOOK.chapters[reading.index].id, chapter.id);
      assert.equal(reading.format, format);
    }
  }
  const resume = new URL(machineBookUrl(APOLLO_BOOK.slug), "https://rovervilla.test");
  assert.equal(resume.searchParams.has("chapter"), false);
  assert.equal(resume.searchParams.has("format"), false);
});
