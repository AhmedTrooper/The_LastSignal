import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import StoryIndex from "../app/story/page";
import OurHeroesPage, { metadata } from "../app/our-hero/page";
import sitemap from "../app/sitemap";
import { HEROES } from "../lib/heroes";
import { MACHINE_BOOKS } from "../lib/machine-books";
import { BASE_URL } from "../lib/seo";

test("the story room keeps the edition shelf and links to the separate heroes route", () => {
  const page = StoryIndex();
  // Render the route's content, not the shared header's browser/auth hooks.
  const markup = renderToStaticMarkup(<>{page.props.children}</>);
  assert.equal((markup.match(/class="club-book-feature"/g) ?? []).length, MACHINE_BOOKS.length);
  assert.ok(!markup.includes("club-explorer-grid"));
  assert.ok(!markup.includes("More explorers. More stories."));
  assert.match(markup, /href="\/our-hero"/);
  assert.match(markup, /href="\/story\/book"/);
});

test("our heroes preserves the moved cards, copy and story destinations", () => {
  const page = OurHeroesPage();
  assert.equal(page.props.title, "More explorers. More stories.");
  assert.equal(page.props.lede, "A different journey behind every machine. Who will you meet next?");
  const markup = renderToStaticMarkup(<>{page.props.children}</>);
  assert.equal((markup.match(/class="club-explorer-card /g) ?? []).length, HEROES.length);
  assert.equal((markup.match(/Read my story/g) ?? []).length, HEROES.length);
  for (const hero of HEROES) assert.ok(markup.includes(`href="/heroes/${hero.slug}/story"`), hero.slug);
  assert.match(markup, /href="\/story"/);
  assert.ok(!markup.includes("club-book-feature"));
});

test("the relocated heroes route has its own canonical URL and sitemap entry", () => {
  assert.equal(metadata.alternates?.canonical, `${BASE_URL}/our-hero`);
  assert.equal(sitemap().filter(entry => entry.url === `${BASE_URL}/our-hero`).length, 1);
});
