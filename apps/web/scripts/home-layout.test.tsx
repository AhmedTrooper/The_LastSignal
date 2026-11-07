import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import ExplorerHome from "../app/components/home/explorer-home";
import StoryChapter from "../app/components/home/story-chapter";
import { HomeReveal } from "../app/components/home/home-motion";
import SpaceSky from "../app/components/home/space-sky";

test("homepage keeps three story entry points and no hidden profile or game links", () => {
  const markup = renderToStaticMarkup(<ExplorerHome />);
  assert.equal((markup.match(/class="rv-story-card"/g) ?? []).length, 3);
  assert.ok(!markup.includes("Who’s calling your curiosity?"));
  for (const match of markup.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll("&amp;", "&"), "https://rovervilla.example");
    assert.ok(!/^\/heroes(?:\/[^/]+)?\/?$/.test(url.pathname), url.pathname);
    assert.ok(!/^\/games(?:\/|$)/.test(url.pathname), url.pathname);
  }
});

test("story artwork has one section disclosure rather than repeated image captions", () => {
  const markup = renderToStaticMarkup(<ExplorerHome />);
  const figures = [...markup.matchAll(/<figure class="rv-story-card-figure" aria-describedby="rv-story-art-note">([\s\S]*?)<\/figure>/g)];
  assert.equal(figures.length, 3);
  for (const [, figure] of figures) {
    assert.match(figure, /<div class="rv-story-card-art">[\s\S]*<\/svg><\/div>/);
    assert.ok(!figure.includes("AI-assisted story art"));
    assert.ok(!figure.includes("rv-story-card-badge"));
  }
  assert.equal((markup.match(/id="rv-story-art-note"/g) ?? []).length, 1);
  assert.equal((markup.match(/AI-assisted/g) ?? []).length, 1);
});

test("a stacked chapter keeps media and its note in the same content column", () => {
  const markup = renderToStaticMarkup(<StoryChapter layout="stack" tint="sand" number="03" kicker="Reels" title="A story" lede="Choose a reel."><span data-testid="media">Media</span><p data-testid="note">Media note</p></StoryChapter>);
  assert.match(markup, /rv-chapter-stack/);
  assert.match(markup, /<div class="rv-chapter-content"><span data-testid="media">Media<\/span><p data-testid="note">Media note<\/p><\/div>/);
});

test("homepage enhancements are visible in server markup and ambient motion starts paused", () => {
  const markup = renderToStaticMarkup(<ExplorerHome />);
  assert.match(markup, /data-motion-paused="true"/);
  assert.match(markup, /aria-label="Pause decorative animations"/);
  const reveal = renderToStaticMarkup(<HomeReveal><p>Readable without JavaScript</p></HomeReveal>);
  assert.ok(reveal.includes("Readable without JavaScript"));
  assert.ok(!/opacity:0[;\"]|visibility:hidden|display:none/.test(reveal));
  const sky = renderToStaticMarkup(<SpaceSky />);
  assert.match(sky, /aria-hidden="true"/);
  assert.equal((sky.match(/rv-sky-star-beacon/g) ?? []).length, 2);
});
