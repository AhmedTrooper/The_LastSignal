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
  const image = book.slug === "opportunity" ? OPPORTUNITY_PHOTOS.shadow : photo(portrait(hero), hero.name);
  const eagle = book.slug === "apollo-11-lander";
  const saved = bookmarks[book.slug];
  const index = book.chapters.findIndex(chapter => chapter.id === saved?.chapter);
  const chapters = book.chapters.map((chapter, number) => ({ chapter, number })).filter(({ chapter }) => `${chapter.title} ${chapter.event} ${chapter.hardware} ${chapter.beats.map(beat => beat.detail).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <SitePage eyebrow={`${book.name}’s Book & Comic Nook`} title={`The Chronicles of ${book.name}.`} lede={`One ${eagle ? "lunar module" : "Mars rover"}. A book of true events. Choose any chapter: read the comic, settle into the storybook, or let the story unfold as you scroll.`} scene="stories">
    <div className="nook-eagle-cover">
      <Link href={machineBookUrl(book.slug)} className="nook-cover" aria-label={`Open ${book.name}: ${book.title}`}>
        <Image src={eagle ? img(portrait(hero)) : image.src} alt={image.alt} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
        <div className="nook-cover-shade" /><span className="nook-cover-number">{eagle ? "Apollo 11 / LM-5" : "Opportunity / MER-B"}</span><div className="nook-cover-title"><p>{book.name}</p><h2>{book.title}</h2></div>{image.ai && <span className="nook-ai-label">AI-generated illustration</span>}
      </Link>
      <div className="nook-cover-introduction"><p className="nook-eyebrow">{book.chapters.length} true-event chapters · Three ways to read</p><h2 className="display text-3xl sm:text-4xl">{eagle ? <>The crew went home.<br />My story stayed.</> : <>Built for a short visit.<br />I kept rolling.</>}</h2><p>{book.introduction}</p><Link href={machineBookUrl(book.slug)} className="nook-open">{saved ? `Resume chapter ${index + 1} · ${saved.format === "book" ? "Storybook" : "Comic"}` : `Open ${book.name}’s book`}<ArrowRight className="h-5 w-5" /></Link><Link href={machineStoryUrl(book.slug)} className="nook-open">Let the story unfold as you scroll <ArrowRight className="h-5 w-5" /></Link><Link href={`/heroes/${book.slug}`} className="nook-image-credit">Explore {book.name}’s real hardware ↗</Link>{!image.ai && <a className="nook-image-credit" href={image.source} target="_blank" rel="noopener noreferrer">Cover image: {image.credit} ↗</a>}</div>
    </div>
    <div className="nook-shelf-toolbar"><h2 className="display text-2xl">Every chapter is its own adventure.</h2><label><span className="sr-only">Find a {book.name} event</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find an event or piece of hardware…" /></label></div>
    <ol className="nook-eagle-chapters">{chapters.map(({ chapter, number }) => <li key={chapter.id}><p className="nook-eyebrow">Chapter {String(number + 1).padStart(2, "0")}</p><h3>{chapter.title}</h3><p>{chapter.event}</p><div><Link href={machineBookUrl(book.slug, chapter.id, "comic")}>Read comic <ArrowRight className="h-4 w-4" /></Link><Link href={machineBookUrl(book.slug, chapter.id, "book")}>Read storybook <ArrowRight className="h-4 w-4" /></Link><Link href={machineStoryUrl(book.slug, chapter.id)}>Scroll chapter <ArrowRight className="h-4 w-4" /></Link></div></li>)}</ol>
    {!chapters.length && <p role="status" className="py-12 text-center text-ink-soft">No chapters match. Try “landing”, “camera”, or “pen”.</p>}
    <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-soft">Events are grounded in linked mission records. Machine voices are imagined retellings, not astronaut quotations. Illustrations are AI-assisted and stylized. RoverVilla is independent and is not endorsed by NASA.</p>
  </SitePage>;
}
