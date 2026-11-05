"use client";

import Image from "next/image";
import { useState } from "react";
import type { EagleMission } from "@/lib/eagle-missions";
import EagleMechanism from "@/app/components/story/eagle-mechanism";

export default function EagleMissionPanel({ mission }: { mission: EagleMission }) {
  const [explored, setExplored] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#decedd] bg-[#fffdf6] text-[#3d3049] shadow-[0_5px_0_#ecdfcf]">
      <div className="relative aspect-[16/9] bg-black"><Image src={mission.photo.src} alt={mission.photo.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain" /><span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 font-mono text-[9px] text-[#ddceff]">{mission.status}</span></div>
      <div className="p-5 sm:p-6">
        <p className="eagle-kid-eyebrow">Real equipment. A real discovery.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2"><div><h3 className="text-sm font-bold text-[#76528b]">What did this part do?</h3><p className="mt-2 text-sm leading-[1.8] text-[#75647c]">{mission.hardware}</p></div><div><h3 className="text-sm font-bold text-[#76528b]">What did it help us learn?</h3><p className="mt-2 text-sm leading-[1.8] text-[#75647c]">{mission.discovery}</p></div></div>
        <p className="mt-5 rounded-xl bg-[#efe4f5] p-4 text-xs leading-relaxed text-[#725680]"><strong>What stayed on the Moon: </strong>{mission.leftBehind}</p>
        {mission.id === "reflector" && <div className="mt-5"><EagleMechanism kind="laser" engaged={explored} onEngage={() => setExplored(true)} action="Follow a laser pulse" result="The corner cubes return light toward its source. Repeated measurements reveal the Moon’s motion." /></div>}
        <details className="mt-5 rounded-lg border border-[#dfd0e6] px-3 text-xs"><summary className="cursor-pointer py-3 text-[#76528b]">A closer look at the science</summary><p className="font-mono text-[9px] text-[#796780]">{mission.code}</p><dl className="mt-3 grid grid-cols-3 gap-3 border-t border-[#e6dbea] py-4">{mission.facts.map(fact => <div key={fact.label}><dt className="text-[9px] uppercase leading-relaxed text-[#796780]">{fact.label}</dt><dd className="mt-2 text-xs leading-relaxed">{fact.value}</dd></div>)}</dl></details>
        <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-[#e5d8e8] pt-4 text-[10px] text-[#796780]"><a href={mission.photo.source} target="_blank" rel="noopener noreferrer" className="py-2 hover:underline">{mission.photo.title} · {mission.photo.credit} ↗</a><a href={mission.source} target="_blank" rel="noopener noreferrer" className="py-2 text-[#76528b] underline underline-offset-4">Read the experiment record ↗</a></div>
      </div>
    </div>
  );
}
