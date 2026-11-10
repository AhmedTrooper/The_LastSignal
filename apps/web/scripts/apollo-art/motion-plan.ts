import type { StoryImageMotion } from "../../lib/story-image-motion";

/** Deliberate, per-shot entrance direction. Names survive chapter reordering. */
export const MOTION_PLAN: Record<string, StoryImageMotion> = {
  "undocking.b01": "drift", "undocking.b02": "orbit", "undocking.b03": "unfold", "undocking.b04": "sweep",
  "alarm.b01": "scan", "alarm.b02": "shutter", "alarm.b03": "hinge", "alarm.b04": "focus",
  "touchdown.b01": "focus", "touchdown.b02": "drift", "touchdown.b03": "scan", "touchdown.b04": "settle",
  "first-step.b01": "hinge", "first-step.b02": "unfold", "first-step.b03": "shutter", "first-step.b04": "settle",
  "first-vibrations.b01": "bloom", "first-vibrations.b02": "unfold", "first-vibrations.b03": "trace", "first-vibrations.b04": "rise",
  "reflector.b01": "bloom", "reflector.b02": "hinge", "reflector.b03": "trace", "reflector.b04": "orbit",
  "solar-wind.b01": "rise", "solar-wind.b02": "sweep", "solar-wind.b03": "shutter", "solar-wind.b04": "unfold",
  "breaker.b01": "focus", "breaker.b02": "scan", "breaker.b03": "drift", "breaker.b04": "sweep",
  "liftoff.b01": "shutter", "liftoff.b02": "unfold", "liftoff.b03": "rise", "liftoff.b04": "settle",
  "seen-again.b01": "sweep", "seen-again.b02": "orbit", "seen-again.b03": "focus", "seen-again.b04": "bloom",
};
