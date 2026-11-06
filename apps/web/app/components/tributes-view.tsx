"use client";

import Image from "next/image";
import { useState } from "react";
import { type Hero, fmtDots, img, portrait } from "@/lib/heroes";
import { Waveform } from "@/app/components/waveform";
import TributeWall from "@/app/components/profile/tribute-wall";
import WorldIllustration from "@/app/components/clubhouse/world-illustration";

/** The dark "last signal" screen: pick a hero, see their final waveform, leave a tribute. */
export default function TributesView({ heroes }: { heroes: Hero[] }) {
  const [slug, setSlug] = useState("opportunity");
  const hero = heroes.find((h) => h.slug === slug) ?? heroes[0];

  return (
    <div className="club-message-view mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:py-14">
      <header className="club-page-heading"><div><p className="club-room-label">Messages to the explorers</p><h1 className="display">Thanks for going first.</h1><p className="club-page-lede">A kind word for a faraway machine. Share what surprised you, what you learned, or which adventure you loved.</p></div><div className="club-page-art"><WorldIllustration scene="messages" /></div></header>
      <ul className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2" aria-label="Choose a hero">
        {heroes.map((h) => (
          <li key={h.slug} className="shrink-0">
            <button
              onClick={() => setSlug(h.slug)}
              aria-pressed={h.slug === slug}
              className={`flex items-center gap-2 rounded-full py-1 pr-4 pl-1 text-sm transition-colors ${h.slug === slug ? "bg-violet" : "bg-white/10 hover:bg-white/20"}`}
            >
              <span className="relative h-7 w-7 overflow-hidden rounded-full">
                <Image src={img(portrait(h))} alt="" fill sizes="28px" className="object-cover" />
              </span>
              {h.name}
            </button>
          </li>
        ))}
      </ul>
      <section className="club-message-memory"><p className="club-kicker">A memory of {hero.name}</p><Waveform seed={`${hero.slug}-last`} bars={40} fade={0.45} className="mt-5 h-12 w-full max-w-md text-violet" /><p className="mt-5 font-mono text-sm">{fmtDots(hero.end.date)} · {hero.end.label}</p><p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">{hero.end.story}</p></section>
      <div className="mt-10">
        <TributeWall slug={hero.slug} name={hero.name} />
      </div>
    </div>
  );
}
