"use client";

import { useId, useRef, type ReactNode } from "react";
import { motion, useInView, type TargetAndTransition } from "motion/react";
import { useReaderReducedMotion } from "./use-reader-reduced-motion";

const entrances = ["unfold", "drift", "focus", "rise", "turn", "settle", "sweep", "lift"] as const;
const starts: TargetAndTransition[] = [
  { opacity: 0, scaleX: 0.3, rotate: -5 }, { opacity: 0, x: -55, rotate: -3 },
  { opacity: 0, scale: 1.18 }, { opacity: 0, y: 42 }, { opacity: 0, rotate: -12, scale: 0.88 },
  { opacity: 0, y: -38 }, { opacity: 0, x: 48 }, { opacity: 0, y: 22, scale: 0.8 },
];

/** Observe an unclipped SVG; animate its inner drawing, never the reading controls or text. */
export default function RoverSvgFrame({ machine, scene, index, animated = true, children }: { machine: "lrv" | "pathfinder"; scene: string; index: number; animated?: boolean; children: ReactNode }) {
  const root = useRef<SVGSVGElement>(null);
  const visible = useInView(root, { once: true, amount: 0.12 });
  const reduced = useReaderReducedMotion();
  const id = useId();
  const variant = (index + (machine === "pathfinder" ? 3 : 0)) % starts.length;
  const initial = starts[variant];
  const settled = { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, rotate: 0 };
  const animate = reduced ? settled : variant === 5 ? { ...settled, y: [-38, 8, -5, 0] } : variant === 0 ? { ...settled, scaleX: [0.3, 1.04, 1] } : settled;
  return <><svg ref={root} viewBox="0 0 640 440" role="img" aria-labelledby={`${id}-title ${id}-description`} className={`${machine}-art`} data-scene={scene} data-entrance={entrances[variant]}>
    <title id={`${id}-title`}>{`${machine === "lrv" ? "Apollo 15 rover" : "Pathfinder and Sojourner"}: ${scene.replaceAll("-", " ")}`}</title>
    <desc id={`${id}-description`}>{`${animated ? "AI-assisted, simplified" : "Simplified"} teaching illustration based on linked NASA sources. Not a photograph, exact engineering model or recorded spacecraft motion. Source notes accompany this story moment.`}</desc>
    <motion.g className="reviewed-rover-reveal" initial={reduced || !animated ? false : initial} animate={!animated ? settled : visible || reduced ? animate : initial} transition={{ type: "tween", duration: reduced || !animated ? 0 : machine === "lrv" ? 1.15 : 0.95, ease: [0.22, 1, 0.36, 1] }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>{children}</motion.g>
    <text x="320" y="425" textAnchor="middle" fill="currentColor" opacity=".8" fontFamily="monospace" fontSize="10">AI-ASSISTED SCHEMATIC · NOT TO SCALE OR TELEMETRY</text>
  </svg>{animated && <noscript><style>{".reviewed-rover-reveal { opacity: 1 !important; transform: none !important; }"}</style></noscript>}</>;
}
