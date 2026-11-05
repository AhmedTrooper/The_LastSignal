import assert from "node:assert/strict";
import { test } from "node:test";
import { EAGLE_COMIC_ISSUES, EMPTY_EAGLE_COMIC, comicIssueReady, readEagleComicProgress } from "../lib/eagle-comic";

test("the Apollo comic has four issues with three short illustrated panels each", () => {
  assert.equal(EAGLE_COMIC_ISSUES.length, 4);
  assert.equal(new Set(EAGLE_COMIC_ISSUES.map(issue => issue.id)).size, 4);
  for (const issue of EAGLE_COMIC_ISSUES) {
    assert.equal(issue.panels.length, 3);
    assert.ok(issue.panels.every(panel => panel.bubble.length < 200));
    assert.ok(issue.source.startsWith("https://"));
    assert.ok(issue.discovery.hardware && issue.discovery.knowledge && issue.discovery.legacy);
  }
});

test("every required hardware action must be explored before the discovery", () => {
  for (const issue of EAGLE_COMIC_ISSUES) {
    assert.equal(comicIssueReady(issue, []), false);
    assert.equal(comicIssueReady(issue, issue.steps.slice(1)), false);
    assert.equal(comicIssueReady(issue, issue.steps), true);
  }
});

test("complete issue progress survives a reload", () => {
  const progress = { issue: 3, panel: 5, actions: Object.fromEntries(EAGLE_COMIC_ISSUES.map(issue => [issue.id, issue.steps])), collected: EAGLE_COMIC_ISSUES.map(issue => issue.id) };
  assert.deepEqual(readEagleComicProgress(JSON.stringify(progress)), progress);
});

test("malformed saves and incomplete discoveries cannot unlock later issues", () => {
  for (const raw of [null, "broken", "null", JSON.stringify({ issue: 9, panel: 0, actions: {}, collected: [] }), JSON.stringify({ issue: 0, panel: 0, actions: [], collected: [] }), JSON.stringify({ issue: 0, panel: 0, actions: { spider: ["unknown"] }, collected: [] })]) assert.deepEqual(readEagleComicProgress(raw), EMPTY_EAGLE_COMIC);
  const incomplete = readEagleComicProgress(JSON.stringify({ issue: 2, panel: 4, actions: {}, collected: ["spider", "overload"] }));
  assert.equal(incomplete.issue, 0);
  assert.equal(incomplete.panel, 3);
  assert.deepEqual(incomplete.collected, []);
  const skipped = readEagleComicProgress(JSON.stringify({ issue: 2, panel: 0, actions: { science: EAGLE_COMIC_ISSUES[2].steps }, collected: ["science"] }));
  assert.equal(skipped.issue, 0);
  assert.deepEqual(skipped.collected, []);
});
