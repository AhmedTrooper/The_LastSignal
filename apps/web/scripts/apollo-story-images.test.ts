import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EAGLE_THOUGHTS, EAGLE_THOUGHT_EDITION } from "../lib/eagle-thoughts";
import { APOLLO_STORY_ILLUSTRATIONS } from "../lib/story-images/apollo11";
import MachineThoughtStory from "../app/components/story/machine-thought-story";
import { STORY_IMAGE_MOTIONS, storyImageMotion } from "../lib/story-image-motion";
import StoryIllustrationView from "../app/components/story/story-illustration";
import { assetUrl } from "../lib/heroes";

test("every Apollo moment has its own sourced artwork under the same stable ID", () => {
  const images = Object.values(APOLLO_STORY_ILLUSTRATIONS);
  assert.deepEqual(images.map(image => image.beatId), EAGLE_THOUGHTS.map(moment => moment.beatId));
  assert.equal(new Set(images.map(image => image.src)).size, 40);
  assert.equal(new Set(images.map(image => image.alt)).size, 40);
  for (const image of images) {
    assert.equal(image.src, assetUrl(`images/story-scroll/apollo11/${image.beatId}.webp`));
    assert.equal(new URL(image.src).protocol, "https:", "The story reader must use R2, not a local public path");
    assert.ok(image.width > 0 && image.height > 0);
    assert.ok(image.context.length > 40 && image.interpretation.length > 40);
    assert.match(image.credit, /AI-assisted illustration/);
    assert.ok(STORY_IMAGE_MOTIONS.some(preset => preset === image.motion), `${image.beatId}: unknown motion`);
    assert.ok(image.sources.length > 0);
    image.sources.forEach(source => assert.equal(new URL(source.url).protocol, "https:"));
  }
});

test("upload originals are preserved and only temporary public story-scroll copies are ignored", async () => {
  for (const image of Object.values(APOLLO_STORY_ILLUSTRATIONS)) {
    const file = `video/story-scroll/apollo11/${image.beatId}.webp`;
    const original = await readFile(new URL(`../${file}`, import.meta.url));
    const preview = await readFile(new URL(`../public/${file}`, import.meta.url)).catch((error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") return null; // Temporary public copies are absent on a fresh checkout.
      throw error;
    });
    const metadata = JSON.parse(await readFile(new URL(`../lib/story-images/apollo11/${image.beatId}.json`, import.meta.url), "utf8"));
    if (preview) assert.deepEqual(preview, original, image.beatId);
    assert.equal(metadata.r2Key, `images/story-scroll/apollo11/${image.beatId}.webp`);
    assert.equal(metadata.assetSha256, createHash("sha256").update(original).digest("hex"));
    assert.match(await readFile(new URL(`../video/story-scroll/apollo11/${image.beatId}.svg`, import.meta.url), "utf8"), /<svg\b/);
  }
  const cwd = new URL("../", import.meta.url);
  const ignored = execFileSync("git", ["check-ignore", "public/video/story-scroll/apollo11/example.webp"], { cwd, encoding: "utf8" });
  assert.match(ignored, /public\/video\/story-scroll/);
  const rule = await readFile(new URL("../.gitignore", import.meta.url), "utf8");
  assert.ok(rule.split("\n").includes("/public/video/story-scroll/"));
  assert.ok(!rule.split("\n").includes("/public/video/"), "Do not ignore unrelated public videos");
});

test("multi-keyframe image entrances use tweens and reduced motion clears every transform", () => {
  for (const preset of STORY_IMAGE_MOTIONS) {
    const recipe = storyImageMotion(preset);
    assert.equal(recipe.transition.type, "tween", preset);
    assert.ok((recipe.transition.duration ?? 0) >= 1.6);
    assert.ok((recipe.transition.duration ?? 0) <= 2);
    assert.equal(recipe.transition.repeat, undefined, "Entrances must settle instead of repeating");
    const reduced = storyImageMotion(preset, true);
    assert.equal(reduced.transition.duration, 0);
    assert.deepEqual(reduced.animate, { opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
  }
  assert.deepEqual(storyImageMotion("unrecognized"), storyImageMotion("bloom"));
});

test("clipped entrances leave the observed outer frame visible", () => {
  const image = Object.values(APOLLO_STORY_ILLUSTRATIONS)[0];
  for (const motion of STORY_IMAGE_MOTIONS) {
    const markup = renderToStaticMarkup(createElement(StoryIllustrationView, { illustration: { ...image, motion }, reduced: false }));
    const frame = markup.match(/<figure\b[^>]*>/)?.[0];
    assert.ok(frame, motion);
    assert.doesNotMatch(frame, /clip-path|opacity|transform/, "Visibility must be observed outside the animated clipping mask");
    assert.match(markup, /data-image-state="loading"/);
    assert.match(markup, /loading="eager"/, "Only the active image is mounted; a closed mask must not block its loading");
    assert.match(markup, /class="tc-art-picture apollo-story-image"/);
  }
});

test("each story moment selects its own illustration with explicit attribution", () => {
  for (const [index, moment] of EAGLE_THOUGHTS.entries()) {
    const markup = renderToStaticMarkup(createElement(MachineThoughtStory, {
      edition: { ...EAGLE_THOUGHT_EDITION, moments: EAGLE_THOUGHTS.slice(index) },
      renderIllustration: () => createElement("svg", { "data-test-fallback": true }),
    }));
    assert.match(markup, /data-media-kind="illustration"/);
    assert.ok(markup.includes(`${moment.beatId}.webp`), moment.beatId);
    assert.match(markup, /AI-assisted illustration, not a photograph/);
    assert.doesNotMatch(markup, /data-test-fallback/);
    assert.equal(moment.audio.status, "ready", `Image changes must not invalidate ${moment.beatId}'s audio`);
  }
});

test("Eagle artwork does not replace the other twelve machines' existing media", async () => {
  const readers = [
    import("../app/components/story/opportunity-thought-story"),
    import("../app/components/story/ranger-thought-story"),
    import("../app/components/story/insight-thought-story"),
    import("../app/components/story/ingenuity-thought-story"),
    import("../app/components/story/spirit-thought-story"),
    import("../app/components/story/surveyor-thought-story"),
    import("../app/components/story/lcross-thought-story"),
    import("../app/components/story/viking-thought-story"),
    import("../app/components/story/viking-two-thought-story"),
    import("../app/components/story/grail-thought-story"),
    import("../app/components/story/phoenix-thought-story"),
    import("../app/components/story/mpl-thought-story"),
  ];
  for (const { default: Reader } of await Promise.all(readers)) {
    const markup = renderToStaticMarkup(createElement(Reader));
    assert.match(markup, /data-media-kind="(?:archive|diagram)"/);
    assert.doesNotMatch(markup, /data-image-state|apollo-story-image|\/video\/story-scroll\/apollo11\//);
  }
});
