"use client";

import Image from "next/image";
import Link from "next/link";
import { machineEntryUrl } from "@/lib/machine-links";
import { useState } from "react";
import { ArrowRight, BookIcon, Play, LightbulbIcon, RoverIcon, MapIcon } from "@/app/components/icons";
import ComicScene from "@/app/components/story/comic-scene";
import { HOME_REELS, reelPoster } from "@/lib/home-reels";
import ReelViewer from "./reel-viewer";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";
import OpportunityIllustration from "@/app/components/story/opportunity-illustration";
import RangerIllustration from "@/app/components/story/ranger-illustration";
import { MACHINE_BOOKS, machineBookUrl, machineStoryUrl } from "@/lib/machine-books";
import HeroScene from "./hero-scene";

const FEATURED_STORIES = MACHINE_BOOKS.slice(0, 3);

export default function ExplorerHome() {
  const [reel, setReel] = useState<number | null>(null);

  return (
    <div className="explorer-home">
      <section className="rv-hero">
        <div className="rv-hero-copy">
          <p className="rv-kicker">Hello, future explorer.</p>
          <h1 className="display">Their mission ended.<br /><span>Their story <em>didn’t.<svg viewBox="0 0 140 12" preserveAspectRatio="none" className="rv-hero-underline" aria-hidden="true"><path d="M4 8c34-6 80-7 132-3" fill="none" stroke="#e6a45f" strokeWidth="5" strokeLinecap="round" /></svg></em></span></h1>
          <p className="rv-hero-lede">They went to the Moon and Mars. They couldn’t come home.<br className="hidden sm:block" /> But their adventures? Those are waiting for <strong>you.</strong></p>
          <div className="rv-actions"><Link href={machineEntryUrl("apollo-11-lander")} className="club-button club-button-primary">Meet your first explorer <ArrowRight className="h-4 w-4" /></Link><Link href="/story" className="club-button club-button-secondary"><BookIcon className="h-4 w-4" />Step into the story room</Link></div>
          <p className="rv-reassurance">No download. No sign-in. Just bring your curiosity.</p>
          <button type="button" onClick={() => setReel(0)} className="rv-preview-link text-left"><span className="rv-preview-icon"><Play className="h-4 w-4" /></span><span><span className="block text-xs font-semibold">Let Oppy show you around.</span><span className="text-xs text-[#625777]">Watch the RoverVilla tour · {HOME_REELS[0].duration}</span></span></button>
        </div>
        <figure className="rv-logo-stage">
          <div className="rv-mascot-bubble">Hey! I saved you a seat.<span aria-hidden="true" /></div>
          <HeroScene className="rv-hero-guide" />
          <figcaption className="rv-hero-art-label">AI-assisted illustration</figcaption>
        </figure>
      </section>

      <div className="rv-curiosity-strip" aria-label="Ways to explore"><span><BookIcon className="h-4 w-4" /> Read a comic</span><span><Play className="h-4 w-4" /> Hear a memory</span><span><RoverIcon className="h-4 w-4" /> Try the controls</span><span><MapIcon className="h-4 w-4" /> Discover a world</span></div>

      <section className="rv-true-stories" aria-labelledby="true-stories-title"><div className="rv-section-heading"><div><p className="rv-kicker">Real adventures. A favourite way to read.</p><h2 id="true-stories-title" className="display">A little closer to a faraway friend.</h2><p>Let the story unfold as you scroll, turn the book’s pages, or follow the comic panels.</p></div><Link href="/story" className="club-button club-button-secondary">Visit the story room <ArrowRight className="h-4 w-4" /></Link></div><div className="club-featured-stories mt-8">{FEATURED_STORIES.map(book => <article key={book.slug} className="club-book-feature"><div className="club-book-feature-art">{book.slug === "apollo-11-lander" ? <EagleIssueArt scene="body" /> : book.slug === "ranger-7" ? <RangerIllustration scene="tower" /> : <OpportunityIllustration scene="rollout" />}<span className="club-art-label">AI-assisted story art</span></div><div className="club-book-feature-copy"><p className="club-kicker">{book.name} / {book.chapters.length} true-event chapters</p><h2 className="display">{book.title}</h2><p>{book.introduction}</p><div><Link href={machineStoryUrl(book.slug)} className="club-button club-button-primary">Come into my story <ArrowRight className="h-4 w-4" /></Link><Link href={machineBookUrl(book.slug, undefined, "comic")}>Read my comic ↗</Link><Link href={machineBookUrl(book.slug, undefined, "book")}>Open my book ↗</Link></div></div></article>)}</div></section>

      <section className="rv-reels-section" aria-labelledby="home-reels-title">
        <div className="rv-section-heading"><div><p className="rv-kicker">A little story. A big adventure.</p><h2 id="home-reels-title" className="display">Welcome to the rover clubhouse.</h2><p>Meet Oppy and friends in short animated stories. Pick one and press play.</p></div><span className="font-mono text-[10px] text-[#83748d]">SCROLL OR SWIPE →</span></div>
        <div className="rv-reels-rail">{HOME_REELS.map((item, index) => <button type="button" key={item.id} onClick={() => setReel(index)} className="rv-reel-card" aria-label={`Watch ${item.title}, ${item.duration}`}><span className="rv-reel-poster"><Image src={reelPoster(item)} alt="" fill sizes="(min-width:1024px) 240px, 180px" className="object-cover" /><span className="rv-reel-play"><Play className="h-5 w-5" /></span><span className="rv-reel-duration">{item.duration}</span><span className="rv-reel-type">Animated story</span></span><span className="rv-reel-info"><span className="rv-kicker">{item.tag}</span><span className="mt-1.5 block text-sm font-bold leading-snug">{item.title}</span></span></button>)}</div>
        <p className="mt-4 text-[11px] leading-relaxed text-[#82758c]">RoverVilla’s characters tell imagined stories. For the historical record, explore each machine’s story and labelled archival media.</p>
      </section>

      <section className="rv-adventure-loop">
        <div className="rv-section-heading"><div><p className="rv-kicker">An adventure with an “aha!”</p><h2 className="display">Not just “read and remember.”</h2><p>Meet the character. Help the hardware. Discover why it mattered.</p></div></div>
        <div className="rv-step-grid">
          <div><span className="rv-step-number">01</span><BookIcon className="h-8 w-8 text-[#7654a7]" /><h3 className="display">Hear my story.</h3><p>A landing. A surprise. A little machine with a big job to do.</p></div>
          <div><span className="rv-step-number">02</span><Play className="h-8 w-8 text-[#b95b22]" /><h3 className="display">Try what I did.</h3><p>Guide a landing, explore a part, or follow a pulse of light.</p></div>
          <div><span className="rv-step-number">03</span><LightbulbIcon className="h-8 w-8 text-[#3e7c76]" /><h3 className="display">Find the “aha!”</h3><p>See how a piece of engineering helped us learn something new.</p></div>
        </div>
      </section>

      <section className="rv-comic-feature">
        <div className="rv-comic-preview" aria-hidden="true"><ComicScene machine="mer-part-1" stage="hardware" moon={false} /><span className="rv-comic-speech">A broken wheel?<br />There was a discovery hiding underneath.</span><span className="rv-comic-sticker">Turn the page →</span></div>
        <div><p className="rv-kicker">For the “one more page” explorers</p><h2 className="display">A whole universe<br />between the panels.</h2><p>Meet the machines through colourful comics. Short dialogue, big pictures, and field notes when you want to look closer.</p><Link href="/story" className="club-button club-button-primary">Find my next comic <BookIcon className="h-4 w-4" /></Link></div>
      </section>

      <section className="rv-launchpad">
        <div><p className="rv-kicker">Ready when you are</p><h2 className="display">Your next “what if?” starts here.</h2><p>Follow an explorer’s story, or find a new friend on the space map.</p></div><div className="rv-actions"><Link href="/story" className="rv-button rv-button-orange"><BookIcon className="h-4 w-4" />Find your next story</Link><Link href="/where-they-rest" className="rv-button rv-button-light"><MapIcon className="h-4 w-4" />Open the space map</Link></div>
      </section>
      <div className="rv-grownup-note"><strong>Little adventures. Real history.</strong><p>Built for curious young explorers, with room for grown-ups to look deeper. Stories are interpretations; historical recordings and source records are identified separately. RoverVilla is independent—not endorsed by NASA.</p></div>
      {reel !== null && <ReelViewer initialIndex={reel} onClose={() => setReel(null)} />}
    </div>
  );
}
