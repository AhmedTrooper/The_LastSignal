import assert from "node:assert/strict";
import { test } from "node:test";
import { buildEagleConsole as sharedConsole, type ConsolePhoto } from "@thelastsignal/data";
import { buildEagleConsole } from "../lib/console";
import { isEagleMessage } from "../lib/eagle-link";
import { EAGLE_AUDIO } from "../lib/eagle-media";
import story from "../lib/eagleStoryData.json";

const photos: ConsolePhoto[] = ["as11-40-5927", "as11-40-5902", "as11-40-5899", "S69-39961", "as11-44-6642", "PIA12909", "jsc2007e034221"].map(id => ({
  name: `nasa/${id}`, title: id, alt: id, src: `https://example.org/${id}.jpg`,
  source: "https://www.nasa.gov/", credit: "NASA", ai: false,
}));

test("every greeting has one forward reply and no media gate", () => {
  const data = buildEagleConsole({ photos, videos: [] });
  for (const [id, next] of [["arrival", "introduction"], ["introduction", "connection"], ["connection", "hub"]]) {
    assert.equal("next" in data.beats[id].cta && data.beats[id].cta.next, next);
    assert.equal(data.beats[id].stage, undefined);
    assert.ok(data.beats[id].title);
  }
});

test("all memory banks and forward links resolve, even without a gallery", () => {
  for (const input of [{ photos, videos: [] }, { photos: [], videos: [] }]) {
    const data = buildEagleConsole(input);
    for (const bank of data.banks) assert.ok(data.beats[bank.first], bank.first);
    for (const beat of Object.values(data.beats)) {
      if ("next" in beat.cta) assert.ok(beat.cta.next === "hub" || data.beats[beat.cta.next], `${beat.id} → ${beat.cta.next}`);
    }
    assert.ok(data.banks.some(bank => bank.id === "film"));
  }
});

test("replies vary, while the web presentation leaves the shared record unchanged", () => {
  const input = { photos, videos: [] };
  const before = sharedConsole(input);
  const data = buildEagleConsole(input);
  assert.deepEqual(sharedConsole(input), before);
  const labels = Object.values(data.beats).map(beat => beat.cta.label);
  assert.equal(new Set(labels).size, labels.length);
  assert.ok(labels.every(label => !/^Yes[,.!]/i.test(label)));
});

test("the story has eight chronological memories and one return action", () => {
  assert.equal(story.scenes.length, 8);
  assert.equal(new Set(story.scenes.map(scene => scene.id)).size, 8);
  const clocks = story.scenes.filter(scene => scene.get).map(scene => scene.get!.split(":").map(Number)).map(([h, m = 0, s = 0]) => h * 3600 + m * 60 + s);
  assert.deepEqual(clocks, [...clocks].sort((a, b) => a - b));
  assert.equal(story.scenes.at(-1)?.trigger, "return");
  assert.equal(story.scenes.at(-1)?.action, null);
  assert.equal(new Set(story.scenes.map(scene => scene.next)).size, 8);
  for (const scene of story.scenes) {
    assert.ok(scene.source.startsWith("https://"));
    assert.equal(scene.telemetry.length, 4);
    if (scene.audio !== undefined) assert.equal(EAGLE_AUDIO[scene.audio].kind, "audio");
  }
});

test("cross-tab protocol rejects foreign and malformed progress events", () => {
  const message = { type: "SCENE_PROGRESS", machineId: "apollo-11-lander", session: "visit-1", scene: 3, total: 8, title: "Landing" };
  assert.equal(isEagleMessage(message), true);
  for (const patch of [{ machineId: "another-machine" }, { session: null }, { scene: 0 }, { scene: 9 }, { total: 101 }, { title: undefined }, { scene: "3" }, { type: "UNKNOWN" }]) {
    assert.equal(isEagleMessage({ ...message, ...patch }), false);
  }
  assert.equal(isEagleMessage(null), false);
  assert.equal(isEagleMessage({ type: "STORY_COMPLETED", machineId: "apollo-11-lander", session: "visit-1" }), true);
});
