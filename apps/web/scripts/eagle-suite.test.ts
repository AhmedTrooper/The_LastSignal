import assert from "node:assert/strict";
import { test } from "node:test";
import { EAGLE_COMPONENTS } from "../lib/eagle-components";
import { EAGLE_LESSONS, eagleIllustrationContext } from "../lib/eagle-lessons";
import { EAGLE_MEMORIES } from "../lib/eagle-story";
import { EAGLE_COMIC_ISSUES } from "../lib/eagle-comic";
import { EAGLE_KID_PARTS } from "../lib/eagle-kid-parts";
import { EAGLE_MISSIONS } from "../lib/eagle-missions";
import { APOLLO_11_LANDER } from "../lib/wiki/apollo-11-lander";

test("every story memory and comic issue points to actual component entries", () => {
  for (const memory of EAGLE_MEMORIES) {
    assert.equal(memory.lesson, EAGLE_LESSONS[memory.id]);
    assert.ok(memory.lesson.components.length > 0);
    for (const id of memory.lesson.components) assert.ok(EAGLE_COMPONENTS[id], id);
    assert.ok(EAGLE_COMIC_ISSUES.some(issue => issue.id === memory.lesson.issue));
  }
  for (const issue of EAGLE_COMIC_ISSUES) for (const id of issue.components) assert.ok(EAGLE_COMPONENTS[id]);
});

test("parts and experiment pages reuse the same factual explanations", () => {
  for (const part of EAGLE_KID_PARTS) {
    assert.equal(part.line, EAGLE_COMPONENTS[part.id].job);
    assert.equal(part.why, EAGLE_COMPONENTS[part.id].why);
    assert.equal(part.source, EAGLE_COMPONENTS[part.id].source);
  }
  for (const [index, id] of ["reflector", "seismometer", "solarWind", "dust"].entries()) {
    const component = EAGLE_COMPONENTS[id as keyof typeof EAGLE_COMPONENTS];
    assert.equal(EAGLE_MISSIONS[index].hardware, component.job);
    assert.equal(EAGLE_MISSIONS[index].discovery, component.why);
  }
});

test("sources, deployed instruments, and illustration contexts are explicit", () => {
  for (const component of Object.values(EAGLE_COMPONENTS)) {
    assert.ok(component.source.startsWith("https://"));
    assert.ok(component.job && component.why);
  }
  assert.equal(EAGLE_COMPONENTS.reflector.belongsTo, "Deployed experiment");
  assert.ok(EAGLE_COMPONENTS.reflector.why.includes("does not send radio telemetry"));
  assert.ok(eagleIllustrationContext("undocking").includes("remained joined"));
  assert.ok(eagleIllustrationContext("first-step").includes("separate rear"));
  assert.ok(APOLLO_11_LANDER.facts.every(fact => !fact.label.includes("Mass")));
});
