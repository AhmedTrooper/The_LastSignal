"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { EagleTrigger } from "@/lib/eagle-story";
import { ArrowRight } from "@/app/components/icons";

const LABELS: Record<EagleTrigger, string> = {
  undock: "Docking interface", alarm: "Guidance priorities", land: "Final approach",
  camera: "MESA deployment", laser: "Corner-cube optics", breaker: "Engine-arm circuit",
  ascent: "Stage separation", return: "The legacy",
};

type Props = { kind: EagleTrigger; engaged: boolean; action: string; result: string; onEngage: () => void };

export default function EagleMechanism({ kind, engaged, action, result, onEngage }: Props) {
  const reduced = useReducedMotion();
  const [approach, setApproach] = useState(engaged ? 100 : 0);
  const [replay, setReplay] = useState(0);
  const transition = { duration: reduced ? 0 : 1.2, ease: "easeInOut" as const };
  const activate = () => { setApproach(100); setReplay(n => n + 1); onEngage(); };

  return (
    <section className="eagle-mechanism" aria-label={`${LABELS[kind]} interactive mechanism`}>
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
        <div><p className="eagle-eyebrow text-[9px]!">Your hands on the hardware</p><h3 className="mt-1 text-sm font-semibold text-white/90">{LABELS[kind]}</h3></div>
        <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] ${engaged ? "border-[#bdaaff]/40 text-[#d5c6ff]" : "border-white/15 text-white/55"}`}>{engaged ? "EXPLORED" : "TRY IT"}</span>
      </div>

      <svg key={replay} viewBox="0 0 600 215" className="block aspect-[600/215] w-full" fill="none" aria-hidden="true">
        <defs>
          <pattern id={`grid-${kind}`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="#ffffff" strokeOpacity="0.035" /></pattern>
          <linearGradient id={`beam-${kind}`}><stop stopColor="#bdaaff" stopOpacity="0" /><stop offset="1" stopColor="#d4c6ff" /></linearGradient>
        </defs>
        <path d="M0 0H600V215H0Z" fill={`url(#grid-${kind})`} />
        {kind === "alarm" ? <>
          <rect x="30" y="27" width="150" height="153" rx="8" fill="#090b11" stroke="#ffffff30" />
          <rect x="44" y="41" width="122" height="37" rx="3" fill="#c7a77312" stroke="#c7a77355" />
          <text x="105" y="67" textAnchor="middle" fill="#ead3a6" fontFamily="monospace" fontSize="27">1202</text>
          <text x="105" y="98" textAnchor="middle" fill="#b1a6c5" fontFamily="monospace" fontSize="9">EXECUTIVE OVERFLOW</text>
          {[0, 1, 2, 3, 4].map(x => [0, 1].map(y => <rect key={`${x}-${y}`} x={47 + x * 24} y={114 + y * 24} width="17" height="17" rx="2" fill="#ffffff0d" stroke="#ffffff18" />))}
          {[["GUIDANCE", "KEEP THE FLIGHT PATH", "#c8b7ff"], ["SECONDARY WORK", "DEFER & RESTART", "#d6ba85"]].map(([label, note, color], i) => <g key={label}>
            <text x="232" y={52 + i * 90} fill="#d5cee2" fontFamily="monospace" fontSize="11">{label}</text>
            <rect x="232" y={65 + i * 90} width="325" height="17" rx="3" fill="#ffffff09" />
            <motion.rect x="232" y={65 + i * 90} height="17" rx="3" fill={color} initial={{ width: 290 }} animate={{ width: engaged && i === 1 ? 48 : 290 }} transition={transition} />
            <text x="232" y={99 + i * 90} fill="#aaa2b8" fontFamily="monospace" fontSize="9">{engaged ? note : "WORK WAITING"}</text>
          </g>)}
        </> : kind === "laser" ? <>
          <circle cx="88" cy="102" r="43" stroke="#a99cdf" strokeWidth="1.5" /><path d="M50 94q32-22 73 0M53 123q31-23 70-2M83 60q-20 45 0 84M95 60q29 43 2 84" stroke="#a99cdf" strokeOpacity="0.4" />
          <rect x="444" y="47" width="102" height="102" rx="4" stroke="#d1bf97" fill="#17131e" />
          {Array.from({ length: 100 }, (_, i) => <circle key={i} cx={452 + i % 10 * 9.5} cy={55 + Math.floor(i / 10) * 9.5} r="2.6" fill={engaged ? "#ddd2fa" : "#81768e"} />)}
          <path d="M134 93H437M134 114H437" stroke="#ffffff20" strokeDasharray="4 5" />
          {engaged && <motion.path d="M134 93H437V114H134" stroke={`url(#beam-${kind})`} strokeWidth="3" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 2 }} />}
          <text x="88" y="176" textAnchor="middle" fill="#b6aecb" fontFamily="monospace" fontSize="10">EARTH OBSERVATORY</text>
          <text x="495" y="176" textAnchor="middle" fill="#d1bf97" fontFamily="monospace" fontSize="10">100 CORNER CUBES</text>
          <text x="285" y="70" textAnchor="middle" fill="#b6aecb" fontFamily="monospace" fontSize="10">OUTBOUND LIGHT</text>
          <text x="285" y="143" textAnchor="middle" fill="#c8b7ff" fontFamily="monospace" fontSize="10">{engaged ? "RETURN TO SOURCE" : "NO BATTERY REQUIRED"}</text>
        </> : kind === "breaker" ? <>
          <text x="300" y="37" textAnchor="middle" fill="#b6aecb" fontFamily="monospace" fontSize="11">BUZZ’S PANEL 16 · SIMPLIFIED CIRCUIT</text>
          <path d="M82 100H236m119 0h160v66H82V100" stroke={engaged ? "#bdaaff" : "#ffffff28"} strokeWidth="2" />
          <rect x="233" y="64" width="124" height="76" rx="5" fill="#10101b" stroke="#b6aecb" />
          <circle cx="249" cy="100" r="4" fill="#d8ccff" /><circle cx="341" cy="100" r="4" fill="#d8ccff" />
          <motion.path d="M249 100L341 71" stroke="#d8ccff" strokeWidth="4" initial={false} animate={{ d: engaged ? "M249 100H341" : "M249 100L341 71" }} transition={transition} />
          <motion.g initial={{ x: 0, y: 0 }} animate={{ x: engaged ? 24 : 0, y: engaged ? -33 : 0 }} transition={transition}><path d="M197 183h114l12 5-12 5H197Z" fill="#d1b376" /><path d="M197 183h15v10h-15" fill="#b39ad7" /></motion.g>
          <circle cx="470" cy="100" r="14" fill={engaged ? "#bdaaff" : "#242130"} stroke="#bdaaff" />
          <text x="83" y="81" fill="#b6aecb" fontFamily="monospace" fontSize="9">CIRCUIT</text><text x="438" y="135" fill="#b6aecb" fontFamily="monospace" fontSize="9">{engaged ? "CLOSED" : "OPEN"}</text>
        </> : <>
          {kind !== "undock" && <><path d="M24 186h552" stroke="#b6aecb55" /><path d="M41 186l12-12 18 12m74 0 16-23 25 23m234 0 18-11 29 11" fill="#8b7b6633" stroke="#a69a7e66" /></>}
          {kind === "undock" && <motion.g initial={{ x: 0 }} animate={{ x: engaged ? -55 : 0 }} transition={transition}><path d="M198 106l-52-45H85v90h61z" stroke="#b6aecb" strokeWidth="2" fill="#ffffff04" /><path d="M88 72H56v68h32m110-34h65" stroke="#b6aecb" strokeWidth="2" /><path d="M76 94H42m34 26H42" stroke="#bdaaff" /><text x="82" y="40" fill="#b6aecb" fontFamily="monospace" fontSize="11">COLUMBIA</text></motion.g>}
          <motion.g initial={false} animate={{ x: kind === "undock" && engaged ? 75 : kind === "land" ? -50 + approach * 0.8 : 0, y: kind === "land" ? -42 + approach * 0.42 : 0 }} transition={transition}>
            <motion.g initial={{ y: 0 }} animate={{ y: kind === "ascent" && engaged ? -86 : 0 }} transition={transition}>
              <path d="M281 48h54l24 30-8 37h-85l-8-37z" stroke="#e1d9ef" strokeWidth="2" fill="#181823" /><path d="M283 59h16v16h-23zm51 0h-16v16h23z" fill="#bdaaff44" stroke="#bdaaff" /><path d="M299 115l-9 15h37l-9-15" stroke="#e1d9ef" />
              {kind === "ascent" && engaged && <motion.path d="M292 131l16 40 17-40" stroke="#e0c492" strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition} />}
            </motion.g>
            <path d="M259 131h101v31H259z" fill="#9f865125" stroke="#d1b376" strokeWidth="2" /><path d="M263 147l-30 38m123-38 30 38m-165 0h28m125 0h28M290 132v48m9-40h-9m9 10h-9m9 10h-9m9 10h-9" stroke="#b6aecb" strokeWidth="1.5" />
            {kind === "land" && <><path d="M225 185v13m168-13v13" stroke="#e1d9ef" /><circle cx="347" cy="142" r="4" fill={engaged ? "#d2c2ff" : "#514653"} /></>}
            {kind === "camera" && <motion.g initial={false} animate={{ rotate: engaged ? 70 : 0 }} style={{ transformOrigin: "361px 133px" }} transition={transition}><path d="M361 132h54v11h-54" fill="#bdaaff33" stroke="#bdaaff" /><rect x="382" y="110" width="22" height="20" rx="2" stroke="#bdaaff" /><path d="m403 117 11-5v16l-11-5" stroke="#bdaaff" /></motion.g>}
          </motion.g>
          <text x="445" y="80" fill="#c9c1d9" fontFamily="monospace" fontSize="10">{kind === "camera" ? "CAMERA STOWED" : "ASCENT STAGE"}</text>
          <text x="445" y="151" fill="#d1b376" fontFamily="monospace" fontSize="10">{kind === "camera" && engaged ? "VIEW OPEN" : "DESCENT STAGE"}</text>
          {kind === "land" && <text x="30" y="33" fill={engaged ? "#d8ccff" : "#d1b376"} fontFamily="monospace" fontSize="11">{engaged ? "CONTACT LIGHT" : "CLEAR THE ROUGH GROUND"}</text>}
        </>}
      </svg>

      <div className="px-4 pb-4 sm:px-5">
        {kind === "land" && <label className="mb-3 block text-[11px] text-white/65">Explore the approach <span className="text-white/40">· drag or use arrow keys</span><input type="range" min="0" max="100" value={approach} aria-label="Illustrative landing approach" aria-valuetext={engaged ? "Landed" : `${approach}% along illustrative path`} onChange={event => { const value = Number(event.target.value); setApproach(value); if (value === 100) onEngage(); }} className="eagle-audio-range mt-1 w-full" /></label>}
        <button type="button" data-memory-action onClick={activate} className="flex min-h-12 w-full items-center justify-between gap-4 rounded-lg border border-[#bdaaff]/30 bg-[#bdaaff]/10 px-4 py-3 text-left text-xs font-semibold leading-relaxed text-[#e3d9ff] transition-colors hover:bg-[#bdaaff]/20"><span>{engaged ? "Replay the mechanism" : action}</span><ArrowRight className="h-4 w-4 shrink-0" /></button>
        <p className="mt-2 text-[10px] text-white/45">Illustrative mechanism · not to scale or real-time flight control</p>
        <div aria-live="polite">{engaged && <p className="mt-3 border-l-2 border-[#bdaaff]/60 pl-3 text-xs leading-relaxed text-[#d8c9fc]">{result}</p>}</div>
      </div>
    </section>
  );
}
