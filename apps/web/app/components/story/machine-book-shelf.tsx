"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/app/components/icons";
import SitePage from "@/app/components/site-page";
import { getHero, img, portrait } from "@/lib/heroes";
import { photo } from "@/lib/photos";
import { MACHINE_BOOKS, MACHINE_BOOKMARK_KEY, machineBookUrl, readMachineBookmarks, type MachineBookmark } from "@/lib/machine-books";

export default function MachineBookShelf() {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Record<string, MachineBookmark>>({});
  useEffect(() => {
    let saved = {};
    try { saved = readMachineBookmarks(localStorage.getItem(MACHINE_BOOKMARK_KEY)); } catch { /* Optional local progress. */ }
    const frame = requestAnimationFrame(() => setBookmarks(saved));
    return () => cancelAnimationFrame(frame);
  }, []);
  const book = MACHINE_BOOKS[0];
  const hero = getHero(book.slug)!;
  const image = photo(portrait(hero), hero.name);
  const saved = bookmarks[book.slug];
  const index = book.chapters.findIndex(chapter => chapter.id === saved?.chapter);
  const chapters = book.chapters.map((chapter, number) => ({ chapter, number })).filter(({ chapter }) => `${chapter.title} ${chapter.event} ${chapter.hardware} ${chapter.beats.map(beat => beat.detail).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <SitePage eyebrow="Eagle’s Book & Comic Nook" title="The Chronicles of Eagle." lede="One lunar module. A book of true events. Choose any chapter, then read it as a four-panel comic or a storybook. Your place is saved on this device.">
    <div className="nook-eagle-cover">
      <Link href={machineBookUrl(book.slug)} className="nook-cover" aria-label={`Open Eagle: ${book.title}`}>
        <Image src={img(portrait(hero))} alt={image.alt} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
        <div className="nook-cover-shade" /><span className="nook-cover-number">Apollo 11 / LM-5</span><div className="nook-cover-title"><p>{book.name}</p><h2>{book.title}</h2></div>{image.ai && <span className="nook-ai-label">AI-generated illustration</span>}
      </Link>
      <div className="nook-cover-introduction"><p className="nook-eyebrow">{book.chapters.length} true-event chapters · Two ways to read</p><h2 className="display text-3xl sm:text-4xl">The crew went home.<br />My story stayed.</h2><p>{book.introduction}</p><Link href={machineBookUrl(book.slug)} className="nook-open">{saved ? `Resume chapter ${index + 1} · ${saved.format === "book" ? "Storybook" : "Comic"}` : "Open Eagle’s book"}<ArrowRight className="h-5 w-5" /></Link><Link href={`/heroes/${book.slug}`} className="nook-image-credit">Explore Eagle’s real hardware ↗</Link>{!image.ai && <a className="nook-image-credit" href={image.source} target="_blank" rel="noopener noreferrer">Cover image: {image.credit} ↗</a>}</div>
    </div>
    <div className="nook-shelf-toolbar"><h2 className="display text-2xl">Every chapter is its own adventure.</h2><label><span className="sr-only">Find an Eagle event</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find an event or piece of hardware…" /></label></div>
    <ol className="nook-eagle-chapters">{chapters.map(({ chapter, number }) => <li key={chapter.id}><p className="nook-eyebrow">Chapter {String(number + 1).padStart(2, "0")}</p><h3>{chapter.title}</h3><p>{chapter.event}</p><div><Link href={machineBookUrl(book.slug, chapter.id, "comic")}>Read comic <ArrowRight className="h-4 w-4" /></Link><Link href={machineBookUrl(book.slug, chapter.id, "book")}>Read storybook <ArrowRight className="h-4 w-4" /></Link></div></li>)}</ol>
    {!chapters.length && <p role="status" className="py-12 text-center text-ink-soft">No chapters match. Try “landing”, “camera”, or “pen”.</p>}
    <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-soft">Events are grounded in linked mission records. Machine voices are imagined retellings, not astronaut quotations. Illustrations are AI-assisted and stylized. RoverVilla is independent and is not endorsed by NASA.</p>
  </SitePage>;
}
