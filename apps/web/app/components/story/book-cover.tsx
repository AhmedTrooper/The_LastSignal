"use client";

import { ArrowRight } from "@/app/components/icons";

/** Original vector artwork: a symbolic landscape, not a mission photograph. */
export default function BookCover({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="book-cover-art">
      <div className="relative z-10"><p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d5c9b0]">RoverVilla · A space comic</p><h2 className="mt-6 font-serif text-[clamp(2.7rem,4vw,4.8rem)] font-normal leading-[1.04] tracking-tight">Monuments<br />in the <em className="text-[#d9b980]">Dust.</em></h2><p className="mt-5 max-w-[25ch] text-sm leading-[1.9] text-[#e4dbca]/80">They went where we couldn’t.<br />This is what they left us.</p></div>
      <svg viewBox="0 0 500 430" className="book-cover-landscape" fill="none" aria-hidden="true">
        <defs><radialGradient id="book-moon"><stop stopColor="#d8cbb9" /><stop offset="1" stopColor="#96878d" /></radialGradient><linearGradient id="book-ground" x2="0" y2="1"><stop stopColor="#a5826b" /><stop offset="1" stopColor="#382d39" /></linearGradient></defs>
        {[...Array(35)].map((_, i) => <circle key={i} cx={(i * 83.7) % 500} cy={(i * 47.3) % 225} r={i % 4 === 0 ? 1.7 : 0.8} fill="#e9dfc9" opacity={0.3 + i % 3 * 0.2} />)}
        <circle cx="369" cy="80" r="43" fill="url(#book-moon)" /><circle cx="353" cy="66" r="8" fill="#857986" opacity="0.2" /><circle cx="382" cy="94" r="12" fill="#857986" opacity="0.25" />
        <path d="M-20 236Q65 162 172 213T345 185T523 245V430H-20Z" fill="#645563" /><path d="M-20 277q74-75 178-18t216-22q54-5 148 48V430H-20Z" fill="url(#book-ground)" />
        <path d="M99 295q138-21 342 55M12 330q198-54 499 50M-20 360q283-52 500 48" stroke="#c8aa8d" strokeOpacity="0.13" />
        <g stroke="#eddbc1" strokeWidth="3" strokeLinejoin="round"><path d="m147 251 116-9 30 42-112 10z" fill="#b79777" /><path d="m170 295 35 18 57-8m-40-13v31" /><path d="m226 246-3-33m-12-23 25-12 18 20-24 15z" fill="#a99793" /><path d="m264 249 39-45 23 2m-40 16 33 27" /><path d="M161 261v28m101-36v30" /><circle cx="170" cy="307" r="15" fill="#242330" /><circle cx="214" cy="321" r="15" fill="#242330" /><circle cx="266" cy="312" r="15" fill="#242330" /><path d="M170 296v22m-11-11h22m33 3v22m-11-11h22m41-20v22m-11-11h22" strokeWidth="1.5" /><path d="m186 267 37-4m-37 10 40-4" strokeOpacity="0.5" /></g>
        <path d="m222 325 62 79 150 26H272l-80-102z" fill="#171624" opacity="0.5" />
      </svg>
      <div className="relative z-10 mt-auto pt-52"><button type="button" onClick={onOpen} className="flex min-h-12 w-full items-center justify-between rounded-lg border border-[#ead7b5]/35 bg-[#f1e5cc]/10 px-4 py-3 text-sm text-[#f5ead7] hover:bg-[#f1e5cc]/20">Open the book <ArrowRight className="h-4 w-4" /></button><p className="mt-3 font-mono text-[8px] uppercase tracking-[0.13em] text-[#d7c7b0]/60">Original illustration · Not a spacecraft reconstruction</p></div>
    </div>
  );
}
