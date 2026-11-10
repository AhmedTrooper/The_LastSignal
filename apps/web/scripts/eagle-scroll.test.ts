import assert from "node:assert/strict";
import { test } from "node:test";
import { APOLLO_BOOK } from "../lib/machine-books/apollo";
import { EAGLE_SCROLL_DIRECTION, eagleScrollUrl, readEagleScrollPosition } from "../lib/eagle-scroll";

test("scroll art covers the shared chronological chapters without merging their stories", () => {
  assert.deepEqual(APOLLO_BOOK.chapters.map(chapter => chapter.id), ["undocking", "alarm", "touchdown", "first-step", "first-vibrations", "reflector", "solar-wind", "breaker", "liftoff", "seen-again"]);
  assert.match(APOLLO_BOOK.chapters.find(chapter => chapter.id === "solar-wind")!.event, /Solar Wind Composition/);
  for (const chapter of APOLLO_BOOK.chapters) {
    const direction = EAGLE_SCROLL_DIRECTION[chapter.id];
    assert.ok(direction, chapter.id);
    assert.ok(direction.photograph || direction.diagram);
    assert.ok(direction.diagramBeats?.every(beat => Number.isInteger(beat) && beat >= 0 && beat < chapter.beats.length) ?? true);
    if (direction.photograph) {
      assert.equal(direction.photograph.ai, false, "Archive images must be real photographs");
      assert.ok(direction.photograph.source.startsWith("https://"));
    }
    assert.equal(new URL(eagleScrollUrl(chapter.id), "https://rovervilla.test").hash, `#${chapter.id}`);
  }
});

test("scroll resumes validate both the event ID and its passage", () => {
  assert.deepEqual(readEagleScrollPosition('{"chapter":"breaker","beat":2}'), { chapter: "breaker", beat: 2 });
  for (const value of [null, "broken", "null", "[]", "{}", '{"chapter":"opportunity","beat":0}', '{"chapter":"alarm","beat":4}', '{"chapter":"alarm","beat":-1}', '{"chapter":"alarm","beat":1.5}', '{"chapter":"alarm","beat":"1"}']) {
    assert.equal(readEagleScrollPosition(value), null);
  }
});
