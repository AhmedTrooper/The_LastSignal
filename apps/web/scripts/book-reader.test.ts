import assert from "node:assert/strict";
import { test } from "node:test";
import { SPREADS, TOC_ITEMS } from "@thelastsignal/data";
import { readBookPosition, turnBookPage, chapterTitle } from "../lib/book-reader";
import { BOOK_SPREADS } from "../lib/book-spreads";
import { COMIC_SCRIPT, comicLines } from "../lib/book-comic";

test("mobile navigation visits both pages before advancing a spread", () => {
  const first = { spread: 0, side: "left" as const };
  const second = turnBookPage(first, 1, true, SPREADS.length);
  assert.deepEqual(second, { spread: 0, side: "right" });
  assert.deepEqual(turnBookPage(second, 1, true, SPREADS.length), { spread: 1, side: "left" });
  assert.deepEqual(turnBookPage(second, -1, true, SPREADS.length), first);
});

test("desktop turns complete spreads and navigation stays bounded", () => {
  assert.deepEqual(turnBookPage({ spread: 0, side: "left" }, -1, false, SPREADS.length), { spread: 0, side: "left" });
  assert.deepEqual(turnBookPage({ spread: 0, side: "right" }, 1, false, SPREADS.length), { spread: 1, side: "left" });
  assert.deepEqual(turnBookPage({ spread: SPREADS.length - 1, side: "right" }, 1, true, SPREADS.length), { spread: SPREADS.length - 1, side: "right" });
});

test("bookmarks restore only valid positions", () => {
  assert.deepEqual(readBookPosition(JSON.stringify({ spread: 6, side: "right" }), SPREADS.length), { spread: 6, side: "right" });
  for (const raw of [null, "broken", "null", JSON.stringify({ spread: -1, side: "left" }), JSON.stringify({ spread: SPREADS.length, side: "left" }), JSON.stringify({ spread: 1, side: "middle" })]) assert.deepEqual(readBookPosition(raw, SPREADS.length), { spread: 0, side: "left" });
});

test("all chapter links resolve to pages in the book", () => {
  for (const item of TOC_ITEMS) {
    assert.ok(SPREADS[item.spread]);
    assert.equal(item.page, item.spread * 2 + 1);
  }
  assert.equal(chapterTitle("Chapter 3: Apollo 11 Eagle [Part I & II]"), "Apollo 11 Eagle");
});

test("the web book preserves chapter order and uses the checked Apollo story", () => {
  assert.deepEqual(BOOK_SPREADS.map(spread => spread.id), SPREADS.map(spread => spread.id));
  const apollo = BOOK_SPREADS.find(spread => spread.id === "apollo-11-part-1")!;
  assert.ok(apollo.telemetrySummary?.some(reading => reading.value.includes("45 seconds")));
  assert.equal(apollo.rightPage.quote, undefined);
  assert.equal(SPREADS.find(spread => spread.id === apollo.id)?.telemetrySummary?.find(reading => reading.label === "Residual Fuel")?.value, "25 seconds remaining");
});

test("every story spread has four short comic beats", () => {
  for (const spread of BOOK_SPREADS.filter(spread => spread.id !== "cover-toc")) {
    assert.equal(COMIC_SCRIPT[spread.id]?.length, 4, spread.id);
    assert.equal(comicLines(spread, "left").length, 2);
    assert.equal(comicLines(spread, "right").length, 2);
    assert.ok(COMIC_SCRIPT[spread.id].every(line => line.length <= 160), spread.id);
  }
});
