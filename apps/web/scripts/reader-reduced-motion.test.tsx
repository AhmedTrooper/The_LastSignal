import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { useReaderReducedMotion } from "../app/components/story/use-reader-reduced-motion";

function Preference() {
  return <span>{String(useReaderReducedMotion())}</span>;
}

test("reader motion preferences have a deterministic server/hydration snapshot", () => {
  assert.equal(renderToStaticMarkup(<Preference />), "<span>false</span>");
});
