import assert from "node:assert/strict";
import { test } from "node:test";
import { RANGER7_DIALOGUE, resolveDialogueNode, type DialogueNode } from "../lib/ranger7-dialogue";

const NODES = RANGER7_DIALOGUE.nodes;

/** Walk every transition in the machine, including the ones hidden behind game answers. */
function collectTargets(id: string, seen = new Set<string>()): Set<string> {
  if (seen.has(id)) return seen;
  const node = resolveDialogueNode(id);
  seen.add(id);
  const nexts: string[] = [
    ...("actions" in node ? node.actions.map((action) => action.next) : []),
    ...("options" in node ? node.options.flatMap((option) => (option.next ? [option.next] : [])) : []),
    // The story-tab round trip is a runtime edge: returning to this tab jumps to `returnNext`.
    ...("returnNext" in node && node.returnNext ? [node.returnNext] : []),
  ];
  for (const next of nexts) collectTargets(next, seen);
  return seen;
}

function allText(node: DialogueNode): string {
  const parts: string[] = [node.badge, node.mood, node.speech];
  if ("title" in node && node.title) parts.push(node.title);
  if ("actions" in node) parts.push(...node.actions.map((action) => action.label));
  if (node.kind === "game") parts.push(...node.options.flatMap((option) => [option.label, option.feedback]));
  if (node.kind === "item") parts.push(...(node.specs ?? []).flatMap((spec) => [spec.label, spec.value]));
  parts.push(...(node.sources ?? []).map((source) => source.label));
  return parts.join(" ");
}

test("the dialogue graph has no dangling, duplicated or unreachable nodes", () => {
  assert.ok(RANGER7_DIALOGUE.initialState in NODES, "initial state must be a real node");
  for (const [id, node] of Object.entries(NODES)) {
    const targets = "actions" in node ? node.actions.map((action) => action.next) : node.kind === "game" ? node.options.flatMap((option) => (option.next ? [option.next] : [])) : [];
    assert.ok(targets.length > 0, `${id} must lead somewhere`);
    for (const target of targets) assert.ok(target in NODES, `${id} points at missing node ${target}`);
    assert.notEqual(node.badge, "", `${id} needs a status badge`);
    assert.notEqual(node.mood, "", `${id} needs a mood`);
    assert.ok(node.speech.trim().length > 40, `${id} speech is too short to be a real reply`);
    for (const source of node.sources ?? []) assert.match(source.url, /^https:\/\//, `${id} source must be a live https link`);
  }
  const reachable = collectTargets(RANGER7_DIALOGUE.initialState);
  assert.deepEqual(
    Object.keys(NODES).filter((id) => !reachable.has(id)),
    [],
    "every node must be reachable from the greeting",
  );
  assert.equal(Object.keys(NODES).length, 27);
});

test("each memory bank runs in order and hands back to the hub", () => {
  const banks: [string, number][] = [
    ["AUDIO_", 3],
    ["VIDEO_", 2],
    ["GALLERY_", 6],
    ["MISSION_", 4],
    ["COORDS_", 3],
  ];
  for (const [prefix, total] of banks) {
    for (let step = 1; step <= total; step += 1) {
      const node = resolveDialogueNode(`${prefix}${step}`);
      assert.ok(["item", "audio", "video"].includes(node.kind), `${prefix}${step} must be a media node`);
      assert.equal("step" in node ? node.step : 0, step, `${prefix}${step} step`);
      assert.equal("step" in node ? node.total : 0, total, `${prefix}${step} total`);
    }
    const last = resolveDialogueNode(`${prefix}${total}`);
    const lastAction = "actions" in last ? last.actions.at(-1) : undefined;
    assert.equal(lastAction?.next, "HUB_MENU", `${prefix}${total} should return to the hub`);
  }
  for (let round = 1; round <= 3; round += 1) {
    const node = resolveDialogueNode(`GAME_${round}`);
    assert.equal(node.kind, "game");
    assert.equal("round" in node ? node.round : 0, round);
    assert.equal("totalRounds" in node ? node.totalRounds : 0, 3);
    const correct = node.kind === "game" ? node.options.filter((option) => option.correct) : [];
    assert.equal(correct.length, 1, `GAME_${round} needs exactly one correct answer`);
  }
  const game1 = resolveDialogueNode("GAME_1");
  const game3 = resolveDialogueNode("GAME_3");
  assert.equal(game1.kind === "game" ? game1.options.find((option) => option.correct)?.next : "", "GAME_2");
  assert.equal(game3.kind === "game" ? game3.options.find((option) => option.correct)?.next : "", "HUB_MENU");
});

test("the handshake keeps one affirmative button and the hub keeps all seven banks", () => {
  const expected: Record<string, string> = { GREETING_1: "GREETING_2", GREETING_2: "GREETING_3", GREETING_3: "HUB_MENU" };
  for (const [id, next] of Object.entries(expected)) {
    const node = resolveDialogueNode(id);
    assert.equal(node.kind, "dialogue");
    assert.equal("actions" in node ? node.actions.length : 0, 1, `${id} must offer a single affirmative`);
    assert.equal("actions" in node ? node.actions[0].next : "", next, `${id} continues to ${next}`);
  }
  const hub = resolveDialogueNode("HUB_MENU");
  assert.equal(hub.kind, "hub");
  assert.equal("actions" in hub ? hub.actions.length : 0, 7);
  const storyAction = "actions" in hub ? hub.actions.find((action) => action.open) : undefined;
  assert.equal(storyAction?.next, "STORY_TAB_OPENED");
  assert.equal(storyAction?.open, "/heroes/ranger-7/story");
  assert.equal(RANGER7_DIALOGUE.routes.story, "/heroes/ranger-7/story");
  assert.ok(NODES["STORY_COMPLETED_WELCOME_BACK"], "returning from the story tab must be greeted");
});

test("the machine only repeats corrected, sourced facts", () => {
  const banned = [
    "960.58", // the blueprint called this the video carrier; it is the 3 W transponder
    "222", // hydrazine engine is 224 N
    "green light",
    "0.18", // final-frame timing is ~2.3 s (NASA History) / t−2.5 s (LPI)
    "imgcat", // unverified GIF archive links from the blueprint
    "1,132",
    "2.56",
    "361.8", // unverified dry mass
    "1.24 billion", // unverified impact energy
    "crators",
    "International Astronomical Union", // the naming attribution is not in our sources
    "Pictures! We have Pictures!", // invented quote
    "Tycho",
  ];
  for (const [id, node] of Object.entries(NODES)) {
    const text = allText(node);
    for (const needle of banned) assert.ok(!text.includes(needle), `${id} still contains banned text "${needle}"`);
    assert.ok(!/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(text), `${id} must stay emoji-free`);
  }
  const everything = Object.values(NODES).map(allText).join(" ");
  for (const verified of [
    "959.52", // Channel F video downlink, 60 W (NSSDCA)
    "960.05", // Channel P video downlink, 60 W (NSSDCA)
    "224-newton", // midcourse engine (NSSDCA)
    "13:25:48.82 UTC", // impact (NSSDCA)
    "13:08:45 UTC", // first image (NASA History)
    "4,308 photographs",
    "2.62 km/s",
    "67 seconds", // Ranger 6 TV on during ascent (SP-4210)
    "never definitively established", // Ranger 6 cause (SP-4210)
    "Surveyor", // confidence → Surveyor → Apollo (NASA History)
    "10.6340° S",
    "339.3230° E",
    "Mare Cognitum",
    "LROC",
    "LPI",
    "NSSDCA",
  ]) {
    assert.ok(everything.includes(verified), `the machine should keep the verified value ${verified}`);
  }
});

test("archive frames stay credited and audio stays labelled as synthetic", () => {
  for (let step = 1; step <= 6; step += 1) {
    const node = resolveDialogueNode(`GALLERY_${step}`);
    assert.equal(node.kind, "item");
    const photo = node.kind === "item" ? node.photo : undefined;
    assert.ok(photo, `GALLERY_${step} needs a photograph`);
    assert.match(photo!.source, /^https:\/\//);
    assert.ok(photo!.credit.includes("NASA"), `GALLERY_${step} must carry a NASA credit`);
    assert.ok(photo!.alt.length > 20, `GALLERY_${step} needs a real description`);
  }
  for (let step = 1; step <= 3; step += 1) {
    const node = resolveDialogueNode(`AUDIO_${step}`);
    assert.equal(node.kind, "audio");
    assert.match(node.badge, /SYNTHETIC READ-ALOUD/, `AUDIO_${step} must not pretend to be archival audio`);
    assert.equal("actions" in node ? node.actions.length : 0, 1);
  }
  for (let step = 1; step <= 2; step += 1) {
    const node = resolveDialogueNode(`VIDEO_${step}`);
    assert.equal(node.kind, "video");
    assert.equal(node.kind === "video" ? node.video.id : "", step === 1 ? "5Z7GGiXRAo0" : "bIFHcWvUWiA");
    assert.ok(node.kind === "video" && node.video.channel.length > 0, `VIDEO_${step} must name its publisher`);
  }
  assert.match(RANGER7_DIALOGUE.voiceNote, /Imagined machine voice/);
  assert.ok(RANGER7_DIALOGUE.voiceNote.includes("NASA does not endorse"));
});
