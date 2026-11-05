"use client";

import { motion, useReducedMotion } from "motion/react";

/** A labelled schematic, never a claimed reconstruction of a cockpit display. */
export default function EagleMechanism({ kind, engaged }: { kind: string; engaged: boolean }) {
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : 0.9, ease: "easeInOut" as const };
  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-[#0e0d1c]">
      <div className="flex justify-between gap-3 px-4 pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/55"><span>Interactive schematic · not to scale</span><span className={engaged ? "text-[#c1b4ff]" : ""}>{engaged ? "Action complete" : "Awaiting your action"}</span></div>
      <svg viewBox="0 0 420 150" className="h-32 w-full text-[#bdaaff]" fill="none" aria-hidden="true">
        {kind === "alarm" ? <>
          <text x="28" y="48" fill="#e8ddff" fontFamily="monospace" fontSize="24">1202</text>
          <text x="28" y="69" fill="#b6aecb" fontFamily="monospace" fontSize="9">EXECUTIVE OVERFLOW</text>
          {["ESSENTIAL GUIDANCE", "LOWER-PRIORITY WORK"].map((label, i) => <g key={label}><text x="195" y={35 + i * 56} fill="#b6aecb" fontFamily="monospace" fontSize="9">{label}</text><rect x="195" y={45 + i * 56} width="195" height="14" rx="3" fill="#ffffff0d" /><motion.rect x="195" y={45 + i * 56} height="14" rx="3" fill={i === 0 ? "#bdaaff" : "#d1b376"} animate={{ width: engaged && i === 1 ? 0 : 160 }} transition={transition} /></g>)}
          <text x="28" y="111" fill={engaged ? "#d8ceff" : "#c9b48e"} fontFamily="monospace" fontSize="12">{engaged ? "GO · GUIDANCE KEPT" : "ASSESS THE ALARM"}</text>
        </> : kind === "laser" ? <>
          <circle cx="63" cy="77" r="27" stroke="#a99cdf" strokeWidth="1.5" /><path d="M44 65q22 10 36-4M46 89q20-12 36 0" stroke="#a99cdf" /><path d="M340 52l-24 25 24 25M350 52l-24 25 24 25" stroke="#d5cbff" strokeWidth="3" /><path d="M99 70H311M99 84H311" stroke="#ffffff20" strokeDasharray="4 5" />
          <motion.path d="M98 70H311V84H98" stroke="#c7b7ff" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: engaged ? 1 : 0 }} transition={{ ...transition, duration: reduced ? 0 : 1.8 }} />
          <text x="43" y="127" fill="#b6aecb" fontFamily="monospace" fontSize="10">EARTH</text><text x="277" y="127" fill="#b6aecb" fontFamily="monospace" fontSize="10">CORNER CUBES</text>
        </> : kind === "breaker" ? <>
          <path d="M60 74h95m70 0h122" stroke={engaged ? "#bdaaff" : "#ffffff35"} strokeWidth="3" /><rect x="155" y="44" width="70" height="60" rx="5" stroke="#b6aecb" /><motion.path d="M166 76l48-25" stroke="#bdaaff" strokeWidth="3" animate={{ d: engaged ? "M166 76h48" : "M166 76l48-25" }} transition={transition} /><motion.rect width="72" height="10" rx="3" fill="#d1b376" initial={false} animate={{ x: engaged ? 150 : 84, y: engaged ? 98 : 123 }} transition={transition} /><circle cx="355" cy="74" r="8" fill={engaged ? "#bdaaff" : "#ffffff20"} /><text x="148" y="28" fill="#b6aecb" fontFamily="monospace" fontSize="10">ENGINE-ARM BREAKER</text>
        </> : <>
          <path d="M24 132h372" stroke="#ffffff20" strokeWidth="1.5" />
          {kind === "undock" && <motion.g animate={{ x: engaged ? -60 : 0 }} transition={transition}><path d="M110 46l22 32-22 32H62V46z" stroke="#b6aecb" strokeWidth="1.5" /><path d="M132 78h42" stroke="#ffffff35" strokeDasharray="4 4" /><text x="54" y="30" fill="#b6aecb" fontFamily="monospace" fontSize="10">COLUMBIA</text></motion.g>}
          <motion.g animate={{ x: kind === "undock" && engaged ? 65 : 0, y: kind === "land" && !engaged ? -28 : 0 }} transition={transition}>
            <motion.g animate={{ y: kind === "ascent" && engaged ? -66 : 0, opacity: kind === "ascent" && engaged ? 0.3 : 1 }} transition={transition}><path d="M201 46h39l15 18-5 23h-61l-4-23z" stroke="#d9d1f0" strokeWidth="1.7" /><path d="M201 52h11v11h-16zm38 0h-11v11h16z" fill="#bdaaff44" />{kind === "ascent" && engaged && <motion.path d="M211 90l9 29 8-29" stroke="#e0c492" strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}</motion.g>
            <path d="M184 90h70v24h-70z" fill="#9f865129" stroke="#d1b376" strokeWidth="1.7" /><path d="M187 103l-21 26m84-26 21 26m-114 0h22m81 0h22" stroke="#b6aecb" strokeWidth="2" />
            {kind === "camera" && <motion.g animate={{ rotate: engaged ? 65 : 0 }} style={{ transformOrigin: "254px 94px" }} transition={transition}><path d="M256 93h35v8h-35" fill="#bdaaff55" stroke="#bdaaff" /><rect x="275" y="77" width="13" height="14" rx="2" stroke="#bdaaff" /></motion.g>}
          </motion.g>
          <text x="302" y="69" fill="#b6aecb" fontFamily="monospace" fontSize="9">{kind === "ascent" ? "ASCENT STAGE" : "EAGLE"}</text><text x="302" y="109" fill="#d1b376" fontFamily="monospace" fontSize="9">DESCENT STAGE</text>
        </>}
      </svg>
    </div>
  );
}
