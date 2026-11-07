import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import EagleScrollStory from "../app/components/story/eagle-scroll-story";
import OpportunityScrollStory from "../app/components/story/opportunity-scroll-story";
import RangerThoughtStory from "../app/components/story/ranger-thought-story";
import InsightThoughtStory from "../app/components/story/insight-thought-story";
import IngenuityThoughtStory from "../app/components/story/ingenuity-thought-story";

test("every featured scroll reader returns to the story list and never links a hidden profile or shelf", () => {
  for (const Reader of [EagleScrollStory, OpportunityScrollStory, RangerThoughtStory, InsightThoughtStory, IngenuityThoughtStory]) {
    const markup = renderToStaticMarkup(<Reader />);
    const topbar = markup.match(/<header class="tc-topbar">([\s\S]*?)<\/header>/)?.[1];
    assert.ok(topbar, Reader.name);
    const backLink = topbar.match(/<a\b[^>]*>/)?.[0];
    assert.ok(backLink, Reader.name);
    assert.match(backLink, /\bhref="\/story"/);
    assert.match(backLink, /\baria-label="Back to the story room"/);
    const links = [...markup.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match => match[1]);
    assert.ok(links.includes("/story"));
    for (const href of links) {
      const url = new URL(href.replaceAll("&amp;", "&"), "https://rovervilla.example");
      if (url.origin !== "https://rovervilla.example") continue;
      assert.ok(!/^\/heroes(?:\/[^/]+)?\/?$/.test(url.pathname), `${Reader.name}: ${href}`);
      if (/^\/heroes\/[^/]+\/book$/.test(url.pathname)) {
        assert.equal(url.searchParams.get("read"), "1", `${Reader.name}: ${href}`);
      }
    }
  }
});
