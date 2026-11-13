import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CLUB_LINKS, CLUB_MORE_LINKS, EXPLORER_TRAITS, isClubLinkActive } from "../lib/clubhouse";
import { HEROES } from "../lib/heroes";
import HeroesPage from "../app/heroes/page";
import WorldIllustration, { type ClubScene } from "../app/components/clubhouse/world-illustration";

test("our heroes sits directly before the story room in the main navigation", () => {
  assert.deepEqual(CLUB_LINKS.map(link => link.href), ["/our-hero", "/story", "/where-they-rest"]);
  assert.deepEqual(CLUB_MORE_LINKS.map(link => link.href), ["/heroes", "/games", "/games/landing", "/gallery", "/timeline", "/tributes", "/about"]);
  assert.equal(new Set([...CLUB_LINKS, ...CLUB_MORE_LINKS].map(link => link.href)).size, 10);
});

test("the More menu exposes an archive directory that opens every detailed profile", () => {
  assert.ok(CLUB_MORE_LINKS.some(link => link.href === "/heroes"));
  const page = HeroesPage();
  assert.equal(page.props.eyebrow, "Explorer archive");
  const markup = renderToStaticMarkup(<>{page.props.children}</>);
  assert.equal((markup.match(/Open my profile/g) ?? []).length, HEROES.length);
  for (const hero of HEROES) {
    assert.ok(markup.includes(`href="/heroes/${hero.slug}"`), hero.slug);
    assert.ok(!markup.includes(`href="/heroes/${hero.slug}/story"`), hero.slug);
  }
});

test("immersive readers belong to Stories rather than the explorer directory", () => {
  for (const path of ["/story", "/story/book", "/heroes/apollo-11-lander/story", "/heroes/opportunity/book", "/heroes/apollo-11-lander/movie"]) {
    assert.equal(isClubLinkActive(path, "/story"), true);
    assert.equal(isClubLinkActive(path, "/heroes"), false);
    assert.equal(isClubLinkActive(path, "/our-hero"), false);
  }
  assert.equal(isClubLinkActive("/our-hero", "/our-hero"), true);
  assert.equal(isClubLinkActive("/our-hero", "/story"), false);
  assert.equal(isClubLinkActive("/heroes/opportunity", "/heroes"), true);
  assert.equal(isClubLinkActive("/games/ingenuity-flight", "/games"), true);
  assert.equal(isClubLinkActive("/gamesmanship", "/games"), false);
});

test("every catalogue explorer has a friendly UI description without altering mission data", () => {
  for (const hero of HEROES) assert.ok(EXPLORER_TRAITS[hero.slug], hero.slug);
});

test("decorative room drawings carry no sparkle patterns or author-tracking labels", () => {
  for (const scene of ["explorers", "stories", "games", "map", "photos", "timeline", "messages", "about"] as ClubScene[]) {
    const markup = renderToStaticMarkup(<WorldIllustration scene={scene} />);
    assert.match(markup, /aria-hidden="true"/);
    assert.ok(!markup.includes("<pattern"));
    assert.ok(!markup.includes("AI-assisted"));
    assert.ok(!markup.includes("✦"));
    assert.ok(!markup.includes("<text"));
  }
});
