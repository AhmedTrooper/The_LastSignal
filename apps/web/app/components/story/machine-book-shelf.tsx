"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/app/components/icons";
import SitePage from "@/app/components/site-page";
import { getHero, img, portrait } from "@/lib/heroes";
import { photo } from "@/lib/photos";
import { MACHINE_BOOKMARK_KEY, machineBookUrl, machineStoryUrl, readMachineBookmarks, type MachineBook, type MachineBookmark } from "@/lib/machine-books";
import { OPPORTUNITY_PHOTOS } from "@/lib/opportunity-media";
import { RANGER_PHOTOS } from "@/lib/ranger-media";
import { INSIGHT_PHOTOS } from "@/lib/insight-media";
import { INGENUITY_PHOTOS } from "@/lib/ingenuity-media";
import { SPIRIT_PHOTOS } from "@/lib/spirit-media";
import { SURVEYOR_PHOTOS } from "@/lib/surveyor-media";
import { LCROSS_PHOTOS } from "@/lib/lcross-media";
import { VIKING_PHOTOS } from "@/lib/viking-media";
import { VIKING_TWO_PHOTOS } from "@/lib/viking-two-media";
import { GRAIL_PHOTOS } from "@/lib/grail-media";
import { PHOENIX_PHOTOS } from "@/lib/phoenix-media";

export default function MachineBookShelf({ book }: { book: MachineBook }) {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Record<string, MachineBookmark>>({});
  useEffect(() => {
    let saved = {};
    try { saved = readMachineBookmarks(localStorage.getItem(MACHINE_BOOKMARK_KEY)); } catch { /* Optional local progress. */ }
    const frame = requestAnimationFrame(() => setBookmarks(saved));
    return () => cancelAnimationFrame(frame);
  }, []);
  const hero = getHero(book.slug)!;
  const eagle = book.slug === "apollo-11-lander";
  const ranger = book.slug === "ranger-7";
  const insight = book.slug === "insight";
  const ingenuity = book.slug === "ingenuity";
  const spirit = book.slug === "spirit";
  const surveyor = book.slug === "surveyor-1";
  const lcross = book.slug === "lcross";
  const viking = book.slug === "viking-1" || book.slug === "viking-2";
  const grail = book.slug === "grail";
  const phoenix = book.slug === "phoenix";
  const image = phoenix ? PHOENIX_PHOTOS.cover : grail ? GRAIL_PHOTOS.cover : book.slug === "viking-2" ? VIKING_TWO_PHOTOS.cover : viking ? VIKING_PHOTOS.cover : lcross ? LCROSS_PHOTOS.cover : surveyor ? SURVEYOR_PHOTOS.cover : spirit ? SPIRIT_PHOTOS.cover : ingenuity ? INGENUITY_PHOTOS.cover : insight ? INSIGHT_PHOTOS.firstSelfie : ranger ? RANGER_PHOTOS.cover : book.slug === "opportunity" ? OPPORTUNITY_PHOTOS.shadow : photo(portrait(hero), hero.name);
  const saved = bookmarks[book.slug];
  const index = book.chapters.findIndex(chapter => chapter.id === saved?.chapter);
  const chapters = book.chapters.map((chapter, number) => ({ chapter, number })).filter(({ chapter }) => `${chapter.title} ${chapter.event} ${chapter.hardware} ${chapter.beats.map(beat => beat.detail).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <SitePage eyebrow={`${book.name}’s Book & Comic Nook`} title={`The Chronicles of ${book.name}.`} lede={`One ${eagle ? "lunar module" : phoenix ? "Mars lander" : grail ? "twin lunar orbiters" : lcross ? "lunar impact experiment" : surveyor ? "lunar lander" : ranger ? "lunar impactor" : insight || viking ? "Mars lander" : ingenuity ? "Mars helicopter" : "Mars rover"}. A book of true events. Choose any chapter: read the comic, settle into the storybook, or let the story unfold as you scroll.`} scene="stories">
    <div className="nook-eagle-cover">
      <Link href={machineBookUrl(book.slug)} className="nook-cover" aria-label={`Open ${book.name}: ${book.title}`}>
        <Image src={eagle ? img(portrait(hero)) : image.src} alt={image.alt} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
        <div className="nook-cover-shade" /><span className="nook-cover-number">{eagle ? "Apollo 11 / LM-5" : phoenix ? "Phoenix / 2007-034A / Arctic lander" : grail ? "GRAIL / 2011-046A–B / Ebb & Flow" : viking ? `${book.name} / ${book.slug === "viking-2" ? "1975-083C" : "1975-075C"} / stationary Mars lander` : lcross ? "LCROSS / 2009-031B / Centaur experiment" : surveyor ? "Surveyor 1 / 1966-045A" : ranger ? "Ranger 7 / 1964-041A" : insight ? "InSight / 2018-042A" : ingenuity ? "Ingenuity / Mars helicopter" : spirit ? "Spirit / MER-A / 2003-027A" : "Opportunity / MER-B"}</span><div className="nook-cover-title"><p>{book.name}</p><h2>{book.title}</h2></div>{image.ai && <span className="nook-ai-label">AI-generated illustration</span>}
      </Link>
      <div className="nook-cover-introduction"><p className="nook-eyebrow">{book.chapters.length} true-event chapters · Three ways to read</p><h2 className="display text-3xl sm:text-4xl">{eagle ? <>The crew went home.<br />My story stayed.</> : viking ? <>My feet stayed on Mars.<br />My questions traveled.</> : lcross ? <>My flight ended.<br />The experiment kept teaching.</> : surveyor ? <>My feet stayed on the Moon.<br />My pictures came home.</> : ranger ? <>I had no way home.<br />My pictures did.</> : insight ? <>I stayed in one place.<br />My records went much farther.</> : ingenuity ? <>My flights ended.<br />Their lessons stayed.</> : <>Built for a short visit.<br />I kept rolling.</>}</h2><p>{book.introduction}</p><Link href={machineBookUrl(book.slug)} className="nook-open">{saved ? `Resume chapter ${index + 1} · ${saved.format === "book" ? "Storybook" : "Comic"}` : `Open ${book.name}’s book`}<ArrowRight className="h-5 w-5" /></Link><Link href={machineStoryUrl(book.slug)} className="nook-open">Let the story unfold as you scroll <ArrowRight className="h-5 w-5" /></Link>{!image.ai && <a className="nook-image-credit" href={image.source} target="_blank" rel="noopener noreferrer">Cover {lcross ? "artist’s concept" : "image"}: {image.credit} ↗</a>}</div>
    </div>
    <div className="nook-shelf-toolbar"><h2 className="display text-2xl">Every chapter is its own adventure.</h2><label><span className="sr-only">Find a {book.name} event</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find an event or piece of hardware…" /></label></div>
    <ol className="nook-eagle-chapters">{chapters.map(({ chapter, number }) => <li key={chapter.id}><p className="nook-eyebrow">Chapter {String(number + 1).padStart(2, "0")}</p><h3>{chapter.title}</h3><p>{chapter.event}</p><div><Link href={machineBookUrl(book.slug, chapter.id, "comic")}>Read comic <ArrowRight className="h-4 w-4" /></Link><Link href={machineBookUrl(book.slug, chapter.id, "book")}>Read storybook <ArrowRight className="h-4 w-4" /></Link><Link href={machineStoryUrl(book.slug, chapter.id)}>Scroll chapter <ArrowRight className="h-4 w-4" /></Link></div></li>)}</ol>
    {!chapters.length && <p role="status" className="py-12 text-center text-ink-soft">No chapters match. Try “landing”, “camera”, or “pen”.</p>}
    <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-soft">Events are grounded in linked mission records. Machine voices are imagined retellings, not astronaut quotations. Illustrations are AI-assisted and stylized. RoverVilla is independent and is not endorsed by NASA.</p>
  </SitePage>;
}
