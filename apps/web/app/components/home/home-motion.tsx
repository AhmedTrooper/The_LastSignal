"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { MotionConfig, motion, useAnimationControls, useInView } from "motion/react";
import { Pause, Play } from "@/app/components/icons";

const HomeMotionContext = createContext({ enabled: false, paused: false, reduced: false, toggle: () => {} });

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotionPreference(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const readMotionPreference = () => window.matchMedia(motionQuery).matches;
const readServerMotionPreference = () => null;

/** Motion stays local to the homepage. Server/no-JS content remains fully visible. */
export function HomeMotionProvider({ children, suspended = false }: { children: ReactNode; suspended?: boolean }) {
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore<boolean | null>(subscribeMotionPreference, readMotionPreference, readServerMotionPreference);
  const enabled = reduced === false && !paused && !suspended;
  return <HomeMotionContext.Provider value={{ enabled, paused, reduced: reduced === true, toggle: () => setPaused(value => !value) }}>
    <MotionConfig reducedMotion={enabled ? "user" : "always"}>
      <div className="explorer-home" data-motion-paused={!enabled}>{children}</div>
    </MotionConfig>
  </HomeMotionContext.Provider>;
}

/** Shared spring for "fall from top" — heavy, slightly overshoots on landing. */
const dropSpring = (delay: number) => ({ type: "spring" as const, stiffness: 118, damping: 15, mass: 0.72, delay });

/**
 * Scroll reveal that FALLS FROM THE TOP into place (y negative) with a spring overshoot,
 * a slight tilt, and a blur-clear — the page's main heavy-motion primitive.
 * Never hides content in server markup: elements stay visible until the observer fires.
 */
export function HomeReveal({ children, className = "", delay = 0, fall = -56 }: { children: ReactNode; className?: string; delay?: number; fall?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const controls = useAnimationControls();
  const played = useRef(false);
  const { enabled } = useContext(HomeMotionContext);
  useEffect(() => {
    if (!enabled) {
      controls.stop();
      controls.set({ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" });
      return;
    }
    if (inView && !played.current) {
      played.current = true;
      controls.set({ opacity: 0, y: fall, rotate: -1.4, scale: 0.965, filter: "blur(8px)" });
      void controls.start({ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }, dropSpring(delay));
    }
  }, [enabled, inView, controls, delay, fall]);
  return <motion.div ref={ref} className={className} initial={false} animate={controls}>{children}</motion.div>;
}

/**
 * Single cascade item for the hero: falls from the top with tilt + blur.
 * Parent passes staggered `delay` (0, 0.08, 0.16 …) to build the cascade.
 */
export function HomeDrop({ children, className = "", delay = 0, fall = -68, tilt = 0, amount = 0.35 }: { children: ReactNode; className?: string; delay?: number; fall?: number; tilt?: number; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const controls = useAnimationControls();
  const played = useRef(false);
  const { enabled } = useContext(HomeMotionContext);
  useEffect(() => {
    if (!enabled) {
      controls.stop();
      controls.set({ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" });
      return;
    }
    if (inView && !played.current) {
      played.current = true;
      controls.set({ opacity: 0, y: fall, x: tilt > 0 ? 14 : tilt < 0 ? -14 : 0, rotate: tilt, scale: 0.95, filter: "blur(10px)" });
      void controls.start({ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" }, dropSpring(delay));
    }
  }, [enabled, inView, controls, delay, fall, tilt]);
  return <motion.div ref={ref} className={className} initial={false} animate={controls}>{children}</motion.div>;
}

/** Mascot: drops from above with a heavy bounce, then settles into the gentle idle float. */
export function HomeCompanion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.05 });
  const controls = useAnimationControls();
  const entered = useRef(false);
  const { enabled } = useContext(HomeMotionContext);
  useEffect(() => {
    if (!enabled) {
      controls.stop();
      entered.current = false;
      controls.set({ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" });
      return;
    }
    if (enabled && inView) {
      if (!entered.current) {
        controls.set({ opacity: 0, y: -96, rotate: -5, scale: 0.88, filter: "blur(10px)" });
        void controls
          .start({ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }, { type: "spring" as const, stiffness: 72, damping: 11, mass: 0.95 })
          .then(() => {
            entered.current = true;
            void controls.start({ y: [0, -6, 0], rotate: [0, 0.7, 0] }, { duration: 7, repeat: Infinity, ease: "easeInOut" });
          });
      } else {
        void controls.start({ y: [0, -6, 0], rotate: [0, 0.7, 0] }, { duration: 7, repeat: Infinity, ease: "easeInOut" });
      }
    } else {
      controls.stop();
      void controls.set({ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" });
    }
    return () => controls.stop();
  }, [enabled, inView, controls]);
  return <motion.div ref={ref} className="rv-hero-companion" initial={false} animate={controls}>{children}</motion.div>;
}

/** Draws the gold underline under "didn't." — stroke pathLength 0 → 1, timed after the title drops. */
export function HeroUnderline({ className = "" }: { className?: string }) {
  const ref = useRef<SVGPathElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const controls = useAnimationControls();
  const { enabled } = useContext(HomeMotionContext);
  useEffect(() => {
    if (!enabled) {
      controls.set({ pathLength: 1, opacity: 1 });
      return;
    }
    if (inView) {
      controls.set({ pathLength: 0, opacity: 1 });
      void controls.start({ pathLength: 1 }, { duration: 0.85, ease: "easeOut", delay: 0.55 });
    }
  }, [enabled, inView, controls]);
  return (
    <svg viewBox="0 0 140 12" preserveAspectRatio="none" className={className} aria-hidden="true">
      <motion.path ref={ref} d="M4 8c34-6 80-7 132-3" fill="none" stroke="#e6a45f" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 1 }} animate={controls} />
    </svg>
  );
}

export function HomeMotionToggle() {
  const { paused, reduced, toggle } = useContext(HomeMotionContext);
  if (reduced) return <span className="rv-motion-status">Reduced motion enabled</span>;
  return <button type="button" className="rv-motion-toggle" aria-pressed={paused} aria-label={paused ? "Resume decorative animations" : "Pause decorative animations"} onClick={toggle}>
    {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
    {paused ? "Resume motion" : "Pause motion"}
  </button>;
}
