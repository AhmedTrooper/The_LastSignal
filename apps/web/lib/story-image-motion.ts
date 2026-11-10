import type { TargetAndTransition, Transition } from "motion/react";

export const STORY_IMAGE_MOTIONS = ["bloom", "shutter", "unfold", "drift", "scan", "focus", "rise", "settle", "trace", "orbit", "sweep", "hinge"] as const;
export type StoryImageMotion = typeof STORY_IMAGE_MOTIONS[number];
type Recipe = { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition };
const ease = [0.22, 1, 0.36, 1] as const;
const tween = (duration: number): Transition => ({ type: "tween", duration, ease, opacity: { type: "tween", duration: 0.3 } });
const clear = { opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" };

const recipes: Record<StoryImageMotion, Recipe> = {
  bloom: { initial: { opacity: 1, clipPath: "circle(2% at 50% 50%)" }, animate: { opacity: 1, clipPath: ["circle(2% at 50% 50%)", "circle(18% at 50% 50%)", "circle(43% at 50% 50%)", "circle(75% at 50% 50%)"] }, transition: tween(2) },
  shutter: { initial: { opacity: 0, clipPath: "inset(0% 49.8% 0% 49.8%)" }, animate: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }, transition: tween(1.8) },
  unfold: { initial: { opacity: 0, rotateX: 38, scale: 0.88, y: "-4%" }, animate: { opacity: 1, rotateX: [38, -5, 1, 0], scale: [0.88, 1.015, 1], y: "0%" }, transition: tween(2) },
  drift: { initial: { opacity: 0, x: "-9%", rotate: -4, scale: 0.95 }, animate: { opacity: 1, x: "0%", rotate: 0, scale: 1 }, transition: tween(1.9) },
  scan: { initial: { opacity: 1, clipPath: "inset(0% 0% 99.5% 0%)" }, animate: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }, transition: { type: "tween", duration: 1.8, ease: "easeInOut" } },
  focus: { initial: { opacity: 0, scale: 1.14, clipPath: "inset(23% 23% 23% 23% round 18%)" }, animate: { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0%)" }, transition: tween(1.8) },
  rise: { initial: { opacity: 0, y: "14%", rotate: -2, scale: 0.96 }, animate: { opacity: 1, y: "0%", rotate: 0, scale: 1 }, transition: tween(1.7) },
  settle: { initial: { opacity: 0, y: "-12%", rotate: -2, scale: 0.97 }, animate: { opacity: 1, y: ["-12%", "2%", "-4%", "1%", "-1%", "0%"], rotate: [-2, 1, -0.4, 0], scale: [0.97, 1.012, 1] }, transition: { ...tween(2), y: { type: "tween", duration: 2, times: [0, 0.43, 0.64, 0.81, 0.93, 1], ease: "easeInOut" } } },
  trace: { initial: { opacity: 1, clipPath: "circle(1% at 12% 85%)" }, animate: { opacity: 1, clipPath: "circle(150% at 12% 85%)" }, transition: { type: "tween", duration: 1.8, ease: "easeInOut" } },
  orbit: { initial: { opacity: 0, rotate: -8, scale: 0.91 }, animate: { opacity: 1, rotate: [-8, 3, -0.8, 0], scale: [0.91, 1.01, 1] }, transition: tween(2) },
  sweep: { initial: { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" }, animate: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }, transition: { type: "tween", duration: 1.6, ease: "easeInOut" } },
  hinge: { initial: { opacity: 0, rotateY: -42, scale: 0.94 }, animate: { opacity: 1, rotateY: [-42, 5, 0], scale: 1 }, transition: tween(1.9) },
};

/** Unknown JSON values fall back safely; reduced motion shows the complete untransformed frame. */
export function storyImageMotion(name?: string, reduced = false): Recipe {
  if (reduced) return { initial: clear, animate: clear, transition: { duration: 0 } };
  return recipes[STORY_IMAGE_MOTIONS.find(value => value === name) ?? "bloom"];
}
