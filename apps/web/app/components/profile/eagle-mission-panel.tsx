"use client";

import Image from "next/image";
import { useState } from "react";
import type { EagleMission } from "@/lib/eagle-missions";
import EagleMechanism from "@/app/components/story/eagle-mechanism";

export default function EagleMissionPanel({ mission }: { mission: EagleMission }) {
  const [explored, setExplored] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#100e20]">
      <div className="relative aspect-[16/9] bg-black"><Image src={mission.photo.src} alt={mission.photo.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain" /><span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 font-mono text-[9px] text-[#ddceff]">{mission.status}</span></div>
      <div className="p-5 sm:p-6">
        <p className="eagle-eyebrow text-[#c1b4ff]!">{mission.code}</p>
        <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-white/10 py-4">{mission.facts.map(fact => <div key={fact.label}><dt className="font-mono text-[9px] uppercase leading-relaxed text-white/50">{fact.label}</dt><dd className="mt-2 text-xs leading-relaxed text-white/90">{fact.value}</dd></div>)}</dl>
        <div className="mt-5 grid gap-5 sm:grid-cols-2"><div><h3 className="text-xs font-semibold text-[#d4c4ff]">What the hardware did</h3><p className="mt-2 text-xs leading-[1.8] text-white/65">{mission.hardware}</p></div><div><h3 className="text-xs font-semibold text-[#d4c4ff]">What we learned</h3><p className="mt-2 text-xs leading-[1.8] text-white/65">{mission.discovery}</p></div></div>
        <p className="mt-5 border-l-2 border-[#bdaaff]/35 pl-3 text-xs leading-relaxed text-white/70"><strong className="text-white/90">What stayed: </strong>{mission.leftBehind}</p>
        {mission.id === "reflector" && <div className="mt-5"><EagleMechanism kind="laser" engaged={explored} onEngage={() => setExplored(true)} action="Follow a laser pulse" result="The corner cubes return light toward its source. Repeated measurements reveal the Moon’s motion." /></div>}
        <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-4 text-[10px] text-white/50"><a href={mission.photo.source} target="_blank" rel="noopener noreferrer" className="py-2 hover:underline">{mission.photo.title} · {mission.photo.credit} ↗</a><a href={mission.source} target="_blank" rel="noopener noreferrer" className="py-2 text-[#c1b4ff] underline underline-offset-4">Read the experiment record ↗</a></div>
      </div>
    </div>
  );
}
