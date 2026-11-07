import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import StoryShelf from "../app/components/story/story-shelf";
import { MACHINE_BOOKS, machineBookUrl, machineStoryUrl } from "../lib/machine-books";

test("the story shelf keeps every edition and its three reader links", () => {
  const markup = renderToStaticMarkup(<StoryShelf />);
  const articles = [...markup.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(articles.length, MACHINE_BOOKS.length);
  MACHINE_BOOKS.forEach((book, index) => {
    const article = articles[index][1];
    assert.ok(article.includes(`id="story-shelf-${book.slug}"`));
    assert.ok(article.includes(book.title));
    assert.ok(article.includes(`${book.chapters.length} standalone chapters`));
    const hrefs = [...article.matchAll(/href="([^"]+)"/g)].map(([, href]) => href.replaceAll("&amp;", "&"));
    assert.deepEqual(hrefs, [machineStoryUrl(book.slug), machineBookUrl(book.slug, undefined, "comic"), machineBookUrl(book.slug, undefined, "book")]);
  });
});

test("story covers have one shared disclosure, without captions over the artwork", () => {
  const markup = renderToStaticMarkup(<StoryShelf />);
  assert.equal((markup.match(/aria-describedby="story-index-art-note"/g) ?? []).length, MACHINE_BOOKS.length);
  assert.equal((markup.match(/id="story-index-art-note"/g) ?? []).length, 1);
  assert.equal((markup.match(/AI-assisted/g) ?? []).length, 1);
  const figures = [...markup.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)];
  assert.equal(figures.length, MACHINE_BOOKS.length);
  for (const [, figure] of figures) {
    assert.match(figure, /<div class="club-book-feature-art">[\s\S]*<\/svg><\/div>/);
    assert.ok(!figure.includes("club-art-label"));
    assert.ok(!figure.includes("<figcaption"));
  }
});

test("story shelf enhancements preserve server-visible copy and the existing cover scenes", () => {
  const markup = renderToStaticMarkup(<StoryShelf />);
  assert.match(markup, /Illustrated Eagle comic scene: quiet/);
  assert.match(markup, /class="ranger-art ranger-art-tower"/);
  assert.match(markup, /class="insight-art"/);
  assert.match(markup, /class="ingenuity-art"/);
  assert.ok(!/opacity:0[;\"]|visibility:hidden|display:none/.test(markup));
  assert.ok(!markup.includes("club-explorer-card"));
});
