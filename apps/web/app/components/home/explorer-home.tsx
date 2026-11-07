"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookIcon, Play, LightbulbIcon, RoverIcon, MapIcon } from "@/app/components/icons";
import ComicScene from "@/app/components/story/comic-scene";
import { useEagleVoice } from "@/app/components/profile/use-eagle-voice";
import { HOME_REELS, reelPoster } from "@/lib/home-reels";
import ReelViewer from "./reel-viewer";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";
import OpportunityIllustration from "@/app/components/story/opportunity-illustration";
import RangerIllustration from "@/app/components/story/ranger-illustration";
import { MACHINE_BOOKS, machineBookUrl, machineStoryUrl } from "@/lib/machine-books";
import WorldIllustration from "@/app/components/clubhouse/world-illustration";

const EXPLORERS = {
  moon: [
    { name: "Eagle", slug: "apollo-11-lander", art: "apollo-11-part-2", title: "I gave them a way home.", line: "I landed with Neil and Buzz. My lower half stayed behind so they could leave.", lesson: "How a lander became a launch pad", tag: "Start here", phase: "journey" as const },
    { name: "Ranger 7", slug: "ranger-7", art: "ranger-7-part-1", title: "I had to look really closely.", line: "My cameras sent pictures while the Moon rushed toward me. Come see what they found.", lesson: "How cameras helped us study the Moon", tag: "The camera explorer", phase: "hardware" as const },
    { name: "Surveyor 1", slug: "surveyor-1", art: "surveyor-1-part-1", title: "Could I land on three feet?", line: "I slowed down with rockets, then stood on the Moon. My landing had a lesson to teach.", lesson: "How landing gear met unfamiliar ground", tag: "The gentle landing", phase: "science" as const },
  ],
  mars: [
    { name: "Opportunity", slug: "opportunity", art: "mer-part-1", title: "Every rock held a clue.", line: "My tools helped scientists investigate whether water had once shaped this dusty world.", lesson: "How rock measurements tell a planet’s story", tag: "The rock detective", phase: "science" as const },
    { name: "InSight", slug: "insight", art: "insight-part-1", title: "A quiet planet? Listen closer.", line: "I didn’t need to drive. My seismometer listened for tiny movements beneath my feet.", lesson: "How vibrations reveal a planet’s interior", tag: "The planet listener", phase: "hardware" as const },
    { name: "Ingenuity", slug: "ingenuity", art: "ingenuity-part-1", title: "What if we could fly here?", line: "My spinning blades tried something new in Mars’s thin air. A small machine. A big idea.", lesson: "How rotor blades made flight possible", tag: "The little flyer", phase: "journey" as const },
  ],
};

export default function ExplorerHome() {
  const [world, setWorld] = useState<"moon" | "mars">("moon");
  const voice = useEagleVoice(`home-${world}`);
  const [preview, setPreview] = useState<string | null>(null);
  const [reel, setReel] = useState<number | null>(null);
  const openReel = (index: number) => { voice.stop(); setPreview(null); setReel(index); };

  return (
    <div className="explorer-home">
      <section className="rv-hero">
        <div className="rv-hero-copy">
          <p className="rv-kicker">Hello, future explorer.</p>
          <h1 className="display">Their mission ended.<br /><span>Their story <em>didn’t.</em></span></h1>
          <p className="rv-hero-lede">They went to the Moon and Mars. They couldn’t come home.<br className="hidden sm:block" /> But their adventures? Those are waiting for <strong>you.</strong></p>
          <div className="rv-actions"><Link href="/heroes/apollo-11-lander" className="club-button club-button-primary">Meet your first explorer <ArrowRight className="h-4 w-4" /></Link><Link href="/story" className="club-button club-button-secondary"><BookIcon className="h-4 w-4" />Step into the story room</Link></div>
          <p className="rv-reassurance">No download. No sign-in. Just bring your curiosity.</p>
          <button type="button" onClick={() => openReel(0)} className="rv-preview-link text-left"><span className="rv-preview-icon"><Play className="h-4 w-4" /></span><span><span className="block text-xs font-semibold">Let Oppy show you around.</span><span className="text-xs text-[#625777]">Watch the RoverVilla tour · {HOME_REELS[0].duration}</span></span></button>
        </div>
        <figure className="rv-logo-stage">
          <div className="rv-mascot-bubble">Hey! I saved you a seat.<span aria-hidden="true" /></div>
          <WorldIllustration scene="explorers" className="rv-hero-guide" />
        </figure>
      </section>

      <div className="rv-curiosity-strip" aria-label="Ways to explore"><span><BookIcon className="h-4 w-4" /> Read a comic</span><span><Play className="h-4 w-4" /> Hear a memory</span><span><RoverIcon className="h-4 w-4" /> Try the controls</span><span><MapIcon className="h-4 w-4" /> Discover a world</span></div>

      <section className="rv-true-stories" aria-labelledby="true-stories-title"><div className="rv-section-heading"><div><p className="rv-kicker">Real adventures. A favourite way to read.</p><h2 id="true-stories-title" className="display">A little closer to a faraway friend.</h2><p>Let the story unfold as you scroll, turn the book’s pages, or follow the comic panels.</p></div><Link href="/story" className="club-button club-button-secondary">Visit the story room <ArrowRight className="h-4 w-4" /></Link></div><div className="club-featured-stories mt-8">{MACHINE_BOOKS.map(book => <article key={book.slug} className="club-book-feature"><div className="club-book-feature-art">{book.slug === "apollo-11-lander" ? <EagleIssueArt scene="body" /> : book.slug === "ranger-7" ? <RangerIllustration scene="tower" /> : <OpportunityIllustration scene="rollout" />}<span className="club-art-label">AI-assisted story art</span></div><div className="club-book-feature-copy"><p className="club-kicker">{book.name} / {book.chapters.length} true-event chapters</p><h2 className="display">{book.title}</h2><p>{book.introduction}</p><div><Link href={machineStoryUrl(book.slug)} className="club-button club-button-primary">Come into my story <ArrowRight className="h-4 w-4" /></Link><Link href={machineBookUrl(book.slug, undefined, "comic")}>Read my comic ↗</Link><Link href={machineBookUrl(book.slug, undefined, "book")}>Open my book ↗</Link></div></div></article>)}</div></section>

      <section className="rv-reels-section" aria-labelledby="home-reels-title">
        <div className="rv-section-heading"><div><p className="rv-kicker">A little story. A big adventure.</p><h2 id="home-reels-title" className="display">Welcome to the rover clubhouse.</h2><p>Meet Oppy and friends in short animated stories. Pick one and press play.</p></div><span className="font-mono text-[10px] text-[#83748d]">SWIPE TO EXPLORE →</span></div>
        <div className="rv-reels-rail">{HOME_REELS.map((item, index) => <button type="button" key={item.id} onClick={() => openReel(index)} className="rv-reel-card" aria-label={`Watch ${item.title}, ${item.duration}`}><span className="rv-reel-poster"><Image src={reelPoster(item)} alt="" fill sizes="(min-width:1024px) 240px, 180px" className="object-cover" /><span className="rv-reel-play"><Play className="h-5 w-5" /></span><span className="rv-reel-duration">{item.duration}</span><span className="rv-reel-type">Animated story</span></span><span className="rv-reel-info"><span className="rv-kicker">{item.tag}</span><span className="mt-1.5 block text-sm font-bold leading-snug">{item.title}</span></span></button>)}</div>
        <p className="mt-4 text-[10px] leading-relaxed text-[#82758c]">RoverVilla’s characters tell imagined stories. For the historical record, explore each machine’s story and labelled archival media.</p>
      </section>

      <section id="meet-machines" className="rv-explorers">
        <div className="rv-section-heading"><div><p className="rv-kicker">Pick a world. Make a friend.</p><h2 className="display">Who’s calling your curiosity?</h2><p>Choose an explorer. Let the machine tell you what happened.</p></div><div role="group" aria-label="Choose a world" className="rv-world-toggle">{(["moon", "mars"] as const).map(body => <button type="button" key={body} aria-pressed={world === body} onClick={() => { voice.stop(); setPreview(null); setWorld(body); }} className={world === body ? "is-active" : ""}><span className={`rv-world-dot rv-world-${body}`} aria-hidden="true" />{body === "moon" ? "The Moon" : "Mars"}</button>)}</div></div>
        <div className="rv-story-grid">
          {EXPLORERS[world].map((explorer, i) => <article key={explorer.slug} className={`rv-story-card rv-story-card-${i}`}>
            <Link href={`/heroes/${explorer.slug}`} className="rv-story-art" aria-label={`Meet ${explorer.name}`}><ComicScene machine={explorer.art} stage={explorer.phase} moon={world === "moon"} /><span className="rv-story-tag">{explorer.tag}</span></Link>
            <div className="rv-story-copy"><p className="rv-kicker">{explorer.name} <span className="text-[#75677f]">/ {world === "moon" ? "Moon" : "Mars"}</span></p><h3 className="display">{explorer.title}</h3><p className="rv-story-dialogue">{explorer.line}</p><div className="rv-science-bridge"><span>{explorer.lesson}</span></div><div className="rv-card-actions"><Link href={`/heroes/${explorer.slug}`} className="rv-button rv-button-small">Meet {explorer.name}<ArrowRight className="h-3.5 w-3.5" /></Link>{voice.available && <button type="button" onClick={() => { if (voice.speaking && preview === explorer.slug) { voice.stop(); setPreview(null); } else { setPreview(explorer.slug); voice.start(`${explorer.name}. ${explorer.line}`); } }} aria-pressed={voice.speaking && preview === explorer.slug} aria-label={voice.speaking && preview === explorer.slug ? `Stop ${explorer.name}’s synthetic preview` : `Hear a synthetic preview of ${explorer.name}`} className="rv-listen-button">{voice.speaking && preview === explorer.slug ? <span aria-hidden="true">Ⅱ</span> : <Play className="h-4 w-4" />}</button>}</div></div>
          </article>)}
        </div>
        <div className="rv-gallery-footnote"><p>AI-assisted SVG illustrations and imagined machine voices—not mission photographs or original transmissions.</p><Link href="/heroes">Meet all the explorers <ArrowRight className="h-3.5 w-3.5" /></Link></div>
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
        <div><p className="rv-kicker">Ready when you are</p><h2 className="display">Your next “what if?” starts here.</h2><p>We’ve got a lunar landing to try and a map full of explorers to meet.</p></div><div className="rv-actions"><Link href="/games/apollo-11-landing" className="rv-button rv-button-orange"><Play className="h-4 w-4" />Try Eagle’s landing</Link><Link href="/where-they-rest" className="rv-button rv-button-light"><MapIcon className="h-4 w-4" />Open the space map</Link></div>
      </section>
      <div className="rv-grownup-note"><strong>Little adventures. Real history.</strong><p>Built for curious young explorers, with room for grown-ups to look deeper. Stories are interpretations; historical recordings and source records are identified separately. RoverVilla is independent—not endorsed by NASA.</p></div>
      {reel !== null && <ReelViewer initialIndex={reel} onClose={() => setReel(null)} />}
    </div>
  );
}
