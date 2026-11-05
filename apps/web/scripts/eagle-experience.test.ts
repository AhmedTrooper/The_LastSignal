import assert from "node:assert/strict";
import { test } from "node:test";
import { buildEagleConsole as sharedConsole, type ConsolePhoto } from "@thelastsignal/data";
import { buildEagleConsole } from "../lib/console";
import { isEagleMessage } from "../lib/eagle-link";
import { EAGLE_FILMS, EAGLE_MEDIA } from "../lib/eagle-media";
import { EMPTY_EAGLE_PROGRESS, readEagleProgress } from "../lib/eagle-progress";
import { EAGLE_INVITATIONS } from "../lib/eagle-perspectives";
import { LANDING_ZONE, initialLanding, stepLanding } from "../lib/eagle-landing";
import { EAGLE_KID_PARTS } from "../lib/eagle-kid-parts";
import { PARTS } from "@thelastsignal/data";
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
    assert.ok(data.beats[id].speech.length <= 2);
    assert.ok(data.beats[id].speech.every(line => line.length < 200));
  }
});

test("kid-friendly part explanations map to real Eagle hardware", () => {
  const hardware = new Set(PARTS["apollo-11-lander"].map(part => part.id));
  assert.equal(new Set(EAGLE_KID_PARTS.map(part => part.id)).size, EAGLE_KID_PARTS.length);
  for (const part of EAGLE_KID_PARTS) {
    assert.ok(hardware.has(part.id), part.id);
    assert.ok(part.line.length < 190);
    assert.ok(part.why.length < 190);
    assert.ok(part.x > 0 && part.x < 100 && part.y > 0 && part.y < 100);
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
    for (const id of scene.media) assert.ok(EAGLE_MEDIA[id], `Missing media ${id}`);
  }
});

test("all three original film reels are distinct and available in the console", () => {
  const data = buildEagleConsole({ photos: [], videos: [] });
  const films = Object.values(data.beats).filter(beat => beat.id.startsWith("film_"));
  assert.equal(films.length, 3);
  assert.equal(new Set(EAGLE_FILMS.map(film => film.src)).size, 3);
  assert.ok(EAGLE_MEDIA["descent-film"].src.includes("Lunar_Landing"));
  assert.ok(EAGLE_MEDIA["undocking-film"].src.includes("mag-c"));
  assert.deepEqual(story.scenes.find(scene => scene.id === "liftoff")?.media, ["ascent-film", "ascent-audio"]);
});

test("story restoration rejects invalid indices and malformed saved state", () => {
  const saved = { index: 3, furthest: 4, acted: [0, 1, 2, 2] };
  assert.deepEqual(readEagleProgress(JSON.stringify(saved), 8), { ...saved, acted: [0, 1, 2] });
  for (const bad of [null, "broken", "null", JSON.stringify({ ...saved, index: 8 }), JSON.stringify({ ...saved, furthest: -1 }), JSON.stringify({ ...saved, index: 5 }), JSON.stringify({ ...saved, acted: ["1"] })]) {
    assert.deepEqual(readEagleProgress(bad, 8), EMPTY_EAGLE_PROGRESS);
  }
});

test("the handshake requires a matching machine and well-formed session", () => {
  for (const type of ["CONSOLE_READY", "STORY_ACK"]) {
    assert.equal(isEagleMessage({ type, session: "visit-1", machineId: "apollo-11-lander" }), true);
    assert.equal(isEagleMessage({ type, session: null, machineId: "apollo-11-lander" }), false);
    assert.equal(isEagleMessage({ type, session: "visit-1", machineId: "other" }), false);
  }
});

test("every story choice opens a supported viewpoint without rewriting history", () => {
  for (const scene of story.scenes) {
    const invitation = EAGLE_INVITATIONS[scene.id];
    assert.ok(invitation.line.length < 220, `${scene.id} should keep its opening short`);
    if (scene.id === "monument") assert.equal(invitation.choices.length, 0);
    else assert.equal(invitation.choices.length, 2);
    for (const choice of invitation.choices) {
      assert.ok(["photo", "mechanism", "game", ...scene.media].includes(choice.view), `${scene.id} → ${choice.view}`);
      if (choice.view === "game") assert.equal(scene.id, "touchdown");
      if (choice.photoIndex) assert.ok(scene.gallery.length >= choice.photoIndex);
    }
  }
});

test("landing gameplay rewards a gentle landing on clear ground", () => {
  const landing = { ...initialLanding(), status: "flying" as const, x: LANDING_ZONE.x, y: 0.01, vx: 0.1, vy: -0.5 };
  assert.equal(stepLanding(landing, 0, 0, 0.05).status, "landed");
  assert.equal(stepLanding({ ...landing, x: -6 }, 0, 0, 0.05).status, "retry");
  assert.equal(stepLanding({ ...landing, vy: -4 }, 0, 0, 0.05).status, "retry");
  assert.equal(stepLanding({ ...landing, vx: 3 }, 0, 0, 0.05).status, "retry");
});

test("landing gameplay is bounded, fuel-limited, and idle until started", () => {
  const ready = initialLanding();
  assert.deepEqual(stepLanding(ready, 100, 1, 10), ready);
  const flying = { ...ready, status: "flying" as const, fuel: 0 };
  const next = stepLanding(flying, 100, 1, 10);
  assert.equal(next.fuel, 0);
  assert.ok(next.vy < flying.vy);
  assert.equal(next.vx, stepLanding(flying, 0, 0, 10).vx);
  assert.deepEqual(stepLanding(flying, 50, 0, 0.05), stepLanding(flying, 50, 0, 10));
});

test("landing challenge can be completed with gentle closed-loop corrections", () => {
  let state = { ...initialLanding(), status: "flying" as const } as ReturnType<typeof initialLanding>;
  for (let i = 0; i < 4000 && state.status === "flying"; i++) {
    const descent = -Math.min(1, Math.max(0.35, state.y / 7));
    const throttle = Math.max(0, Math.min(100, (0.8 + (descent - state.vy) * 0.9) / 1.5 * 100));
    const drift = Math.max(-1.5, Math.min(1.5, (LANDING_ZONE.x - state.x) * 0.18));
    const steer = Math.max(-1, Math.min(1, (drift - state.vx) * 1.3));
    state = stepLanding(state, throttle, steer, 0.05);
  }
  assert.equal(state.status, "landed");
  assert.ok(state.fuel > 0);
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
