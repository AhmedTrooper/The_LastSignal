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

/** A small, once-only entrance; never hide essential text in server markup. */
export function HomeReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const controls = useAnimationControls();
  const played = useRef(false);
  const { enabled } = useContext(HomeMotionContext);
  useEffect(() => {
    if (!enabled) {
      controls.stop();
      controls.set({ opacity: 1, y: 0 });
      return;
    }
    if (inView && !played.current) {
      played.current = true;
      void controls.start({ opacity: [0.95, 1], y: [16, 0] }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    }
  }, [enabled, inView, controls]);
  return <motion.div ref={ref} className={className} initial={false} animate={controls}>{children}</motion.div>;
}

export function HomeCompanion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.05 });
  const controls = useAnimationControls();
  const { enabled } = useContext(HomeMotionContext);
  useEffect(() => {
    if (enabled && inView) {
      void controls.start({ y: [0, -5, 0] }, { duration: 7, repeat: Infinity, ease: "easeInOut" });
    } else {
      controls.stop();
      controls.set({ y: 0 });
    }
    return () => controls.stop();
  }, [enabled, inView, controls]);
  return <motion.div ref={ref} className="rv-hero-companion" initial={false} animate={controls}>{children}</motion.div>;
}

export function HomeMotionToggle() {
  const { paused, reduced, toggle } = useContext(HomeMotionContext);
  if (reduced) return <span className="rv-motion-status">Reduced motion enabled</span>;
  return <button type="button" className="rv-motion-toggle" aria-pressed={paused} aria-label={paused ? "Resume decorative animations" : "Pause decorative animations"} onClick={toggle}>
    {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
    {paused ? "Resume motion" : "Pause motion"}
  </button>;
}
