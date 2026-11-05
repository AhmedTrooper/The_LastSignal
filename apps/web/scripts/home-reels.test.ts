import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { HOME_REELS, reelPoster, reelUrl } from "../lib/home-reels";

test("the homepage reels use distinct, encoded R2 objects", () => {
  assert.equal(HOME_REELS.length, 8);
  assert.equal(new Set(HOME_REELS.map(reel => reel.id)).size, 8);
  assert.equal(new Set(HOME_REELS.map(reel => reel.file)).size, 8);
  for (const reel of HOME_REELS) {
    const url = new URL(reelUrl(reel));
    assert.equal(decodeURIComponent(url.pathname.split("/reels/")[1]), reel.file);
    assert.equal(url.protocol, "https:");
    assert.ok(!url.href.includes(" "));
    assert.match(reel.duration, /^\d+:\d{2}$/);
    assert.ok(existsSync(new URL(`../public${reelPoster(reel)}`, import.meta.url)));
  }
});

test("the logo has a public full-size asset and a browser icon", () => {
  for (const asset of ["rovervilla-logo.webp", "rovervilla-icon.png"]) assert.ok(existsSync(new URL(`../public/branding/${asset}`, import.meta.url)));
});
