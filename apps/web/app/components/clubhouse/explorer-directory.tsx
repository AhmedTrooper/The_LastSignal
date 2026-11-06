"use client";

import { useState } from "react";
import { type Hero } from "@/lib/heroes";
import { EXPLORER_TRAITS } from "@/lib/clubhouse";
import HeroCard from "@/app/components/hero-card";

export default function ExplorerDirectory({ heroes }: { heroes: Hero[] }) {
  const [world, setWorld] = useState<"all" | "moon" | "mars">("all");
  const [query, setQuery] = useState("");
  const shown = heroes.filter(hero => (world === "all" || hero.body === world) && `${hero.name} ${hero.nickname ?? ""} ${hero.slug} ${hero.kind} ${EXPLORER_TRAITS[hero.slug] ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div><div className="club-directory-tools"><div className="club-segment" role="group" aria-label="Choose a world">{(["all", "moon", "mars"] as const).map(body => <button key={body} type="button" aria-pressed={world === body} onClick={() => setWorld(body)}>{body === "all" ? "Everyone" : body === "moon" ? "The Moon" : "Mars"}</button>)}</div><label className="club-search"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg><span className="sr-only">Find an explorer</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a name, a rover, a little flyer…" /></label></div><p className="club-results" role="status">{shown.length} {shown.length === 1 ? "explorer" : "explorers"} waiting to meet you</p><ul className="club-explorer-grid">{shown.map((hero, index) => <li key={hero.slug}><HeroCard hero={hero} priority={index < 3} /></li>)}</ul>{!shown.length && <div className="club-empty"><h2 className="display text-2xl">No explorer by that name… yet.</h2><p className="mt-3 text-sm text-ink-soft">Try “Eagle”, “Opportunity”, or “rover”.</p><button type="button" onClick={() => { setQuery(""); setWorld("all"); }} className="club-button club-button-secondary mt-5">Show everyone</button></div>}</div>;
}
