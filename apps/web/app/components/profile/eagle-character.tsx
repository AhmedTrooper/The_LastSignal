"use client";

import { useState } from "react";
import { EAGLE_KID_PARTS } from "@/lib/eagle-kid-parts";

export default function EagleCharacter({ interactive = false, greeting = false }: { interactive?: boolean; greeting?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const part = EAGLE_KID_PARTS.find(item => item.id === selected);
  return (
    <section className="eagle-character-card" aria-label={interactive ? "Explore Eagle’s illustrated parts" : "Meet Eagle’s storybook character"}>
      <div className="eagle-character-caption"><span>{interactive ? "Every part had a job" : "Eagle / The way-home hero"}</span><span>{interactive ? "TAP A PART" : "APOLLO 11"}</span></div>
      <div className="eagle-character-scene">
        <svg viewBox="0 0 600 430" className="h-auto w-full" fill="none" aria-hidden="true">
          <defs><linearGradient id="eagle-kid-sky" x2="0" y2="1"><stop stopColor="#172547" /><stop offset="1" stopColor="#5a5477" /></linearGradient><linearGradient id="eagle-kid-ground" x2="0" y2="1"><stop stopColor="#c7b7b5" /><stop offset="1" stopColor="#a090a8" /></linearGradient></defs>
          <path d="M0 0h600v430H0z" fill="url(#eagle-kid-sky)" />
          {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={(i * 79.7) % 600} cy={(i * 41.3) % 260} r={i % 4 ? 1 : 2} fill="#f8e2b8" opacity="0.7" />)}
          <circle cx="85" cy="89" r="36" fill="#9cbbc8" /><path d="m69 59-10 20 22 8 11 26 17-24-12-22z" fill="#668c9b" />
          <path d="M0 315q101-68 193-31t167-16q103-37 240 22v140H0z" fill="#847b94" /><path d="M0 359q122-39 259-12t341-4v87H0z" fill="url(#eagle-kid-ground)" />
          <path d="m417 404 62-22 35 12-35 15zm-372-33 38-12 25 10-24 11z" fill="#95849e" stroke="#5c526a" strokeWidth="2" />
          <ellipse cx="307" cy="380" rx="140" ry="17" fill="#584b7330" />
          <g stroke="#1c2340" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
            <path d="m251 129 90-2 32 34-4 87-130 5-18-87z" fill="#ece2cf" /><path d="m248 140 37 3m21-3 33 1" stroke="#c2aa90" strokeWidth="2" />
            <path d="m257 161 39 2-3 47-48-6z" fill="#426881" /><path d="m312 162 39-2 8 46-49 5z" fill="#426881" />
            <ellipse cx="273" cy="182" rx="9" ry="12" fill="#cce8f7" stroke="none" /><ellipse cx="331" cy="181" rx="9" ry="12" fill="#cce8f7" stroke="none" /><circle cx="279" cy="174" r="4" fill="#fff" stroke="none" /><circle cx="337" cy="173" r="4" fill="#fff" stroke="none" />
            <path d="M285 229q16 15 32-1" stroke="#735e68" strokeWidth="3" />
            <path d="M208 187h17v32h-17zM370 187h17v32h-17z" fill="#9eabb1" /><path d="M198 190h10v10h-10zm0 18h10v10h-10zm189-18h10v10h-10zm0 18h10v10h-10z" fill="#5f6574" strokeWidth="2" />
            <path d="m352 141 47-27m-5-31q-2 58 50 47z" fill="#ead7b5" /><path d="m414 107 19-23" strokeWidth="3" />
            <path d="m220 258 149-8 26 53-143 16-37-18z" fill="#d7ad61" /><path d="m223 270 142-8m-115 24 108-13m-96 30 70-8" stroke="#b7854f" strokeWidth="2" />
            <path d="m227 286-59 86m217-95 47 91m-172-52-30 61m112-71 30 69" stroke="#e0d7c7" strokeWidth="8" /><path d="m227 286-59 86m217-95 47 91m-172-52-30 61m112-71 30 69" strokeWidth="3" />
            {[{ x: 168, y: 375 }, { x: 432, y: 371 }, { x: 232, y: 380 }, { x: 373, y: 379 }].map(foot => <ellipse key={foot.x} cx={foot.x} cy={foot.y} rx="22" ry="6" fill="#dedcd4" stroke="#6a6574" strokeWidth="2" />)}
            <path d="m270 273-30 86m39-60-21-4m17 15-20-4m16 16-20-4m16 16-21-5" stroke="#e9dfcc" strokeWidth="3" />
            <path d="m282 319-10 19h48l-10-21" fill="#675265" /><path d="m237 256-30-9-14 16 21 10" fill="#e1d6c3" />
          </g>
          {!interactive && <g><path d="M53 226q31-26 61-10" stroke="#f8d398" strokeWidth="3" strokeDasharray="6 7" /><text x="44" y="256" fill="#f8e4bc" fontFamily="sans-serif" fontSize="13">{greeting ? "A visitor!" : "Still part of the story."}</text></g>}
        </svg>
        {interactive && EAGLE_KID_PARTS.map((item, i) => <button key={item.id} type="button" onClick={() => setSelected(item.id)} aria-label={item.label} aria-pressed={selected === item.id} className={`eagle-part-dot ${selected === item.id ? "is-selected" : ""}`} style={{ left: `${item.x}%`, top: `${item.y}%` }}>{i + 1}</button>)}
      </div>
      <div className="eagle-character-note">{interactive ? "Choose a numbered part, or a name below." : "A storybook view of the whole lunar module. The descent stage is the part left behind."}</div>
      {interactive && <div className="eagle-part-buttons" role="group" aria-label="Eagle’s parts">{EAGLE_KID_PARTS.map(item => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)} className={selected === item.id ? "is-selected" : ""}>{item.label}</button>)}</div>}
      <div aria-live="polite">{part && <div className="eagle-part-discovery"><p className="text-sm font-bold">{part.label}</p><p className="mt-2 text-sm leading-relaxed">{part.line}</p><p className="mt-3 rounded-lg bg-[#ede4f4] p-3 text-xs leading-relaxed"><strong>Why it mattered: </strong>{part.why}</p></div>}</div>
      <p className="eagle-art-credit">AI-assisted character illustration · Not a spacecraft reconstruction</p>
    </section>
  );
}
