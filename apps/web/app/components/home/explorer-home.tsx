"use client";

import Image from "next/image";
import Link from "next/link";
import { machineEntryUrl } from "@/lib/machine-links";
import { useState } from "react";
import { ArrowRight, BookIcon, Play, LightbulbIcon, MapIcon } from "@/app/components/icons";
import ComicScene from "@/app/components/story/comic-scene";
import { HOME_REELS, reelPoster } from "@/lib/home-reels";
import ReelViewer from "./reel-viewer";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";
import OpportunityIllustration from "@/app/components/story/opportunity-illustration";
import RangerIllustration from "@/app/components/story/ranger-illustration";
import { MACHINE_BOOKS, machineBookUrl, machineStoryUrl } from "@/lib/machine-books";
import HeroScene from "./hero-scene";
import SpaceSky from "./space-sky";
import StoryChapter from "./story-chapter";
import { HomeCompanion, HomeMotionProvider, HomeMotionToggle, HomeReveal } from "./home-motion";

const FEATURED_STORIES = MACHINE_BOOKS.slice(0, 3);

export default function ExplorerHome() {
  const [reel, setReel] = useState<number | null>(null);

  return (
    <HomeMotionProvider suspended={reel !== null}>
      {/* ── Chapter 1 · the invitation ─────────────────────────────────────── */}
      <section className="rv-hero">
        <SpaceSky className="rv-hero-sky" />
        <HomeReveal className="rv-hero-copy">
          <p className="rv-kicker rv-kicker-pill">Hello, future explorer.</p>
          <h1 className="display">
            Their mission ended.<br />
            <span>
              Their story <em>didn’t.<svg viewBox="0 0 140 12" preserveAspectRatio="none" className="rv-hero-underline" aria-hidden="true"><path d="M4 8c34-6 80-7 132-3" fill="none" stroke="#e6a45f" strokeWidth="5" strokeLinecap="round" /></svg></em>
            </span>
          </h1>
          <p className="rv-hero-lede">
            They went to the Moon and Mars. They couldn’t come home.
            <br className="hidden sm:block" /> But their adventures? Those are waiting for <strong>you.</strong>
          </p>
          <div className="rv-actions">
            <Link href={machineEntryUrl("apollo-11-lander")} className="rv-button rv-button-orange">
              Meet your first explorer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/story" className="rv-button rv-button-outline">
              <BookIcon className="h-4 w-4" /> Step into the story room
            </Link>
          </div>
          <p className="rv-reassurance">No download. No sign-in. Just bring your curiosity.</p>
          <button type="button" onClick={() => setReel(0)} className="rv-preview-link text-left">
            <span className="rv-preview-icon"><Play className="h-4 w-4" /></span>
            <span>
              <span className="block text-xs font-semibold">Let Oppy show you around.</span>
              <span className="text-xs text-[#6b5f7d]">Watch the RoverVilla tour · {HOME_REELS[0].duration}</span>
            </span>
          </button>
          <HomeMotionToggle />
        </HomeReveal>
        <HomeCompanion>
          <figure className="rv-logo-stage" aria-describedby="rv-story-art-note">
            <div className="rv-mascot-bubble">
              Hey! I saved you a seat.<span aria-hidden="true" />
            </div>
            <HeroScene className="rv-hero-guide" />
          </figure>
        </HomeCompanion>
      </section>

      {/* ── Chapter 2 · the shelf of friends ───────────────────────────────── */}
      <StoryChapter
        layout="stack"
        tint="lilac"
        number="02"
        kicker="Real adventures. A favourite way to read."
        title={<>A little closer to a faraway friend.</>}
        lede="Let the story unfold as you scroll, turn the book’s pages, or follow the comic panels."
        aside={
          <Link href="/story" className="rv-button rv-button-outline">
            Visit the story room <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="rv-story-shelf">
          {FEATURED_STORIES.map((book) => (
            <article key={book.slug} className="rv-story-card">
              <figure className="rv-story-card-figure" aria-describedby="rv-story-art-note">
                <div className="rv-story-card-art">
                  {book.slug === "apollo-11-lander" ? <EagleIssueArt scene="body" /> : book.slug === "ranger-7" ? <RangerIllustration scene="tower" /> : <OpportunityIllustration scene="rollout" />}
                </div>
              </figure>
              <div className="rv-story-card-copy">
                <p className="rv-kicker">{book.name} / {book.chapters.length} true-event chapters</p>
                <h3 className="display">{book.title}</h3>
                <p>{book.introduction}</p>
                <div className="rv-story-card-links">
                  <Link href={machineStoryUrl(book.slug)} className="rv-button rv-button-orange">
                    Come into my story <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={machineBookUrl(book.slug, undefined, "comic")} className="rv-story-link">
                    Read my comic ↗
                  </Link>
                  <Link href={machineBookUrl(book.slug, undefined, "book")} className="rv-story-link">
                    Open my book ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p id="rv-story-art-note" className="rv-story-art-note">Character illustrations on this page are AI-assisted, not mission photographs.</p>
      </StoryChapter>

      {/* ── Chapter 3 · the clubhouse reel ──────────────────────────────────── */}
      <StoryChapter
        layout="stack"
        tint="sand"
        number="03"
        kicker="A little story. A big adventure."
        title={<>Welcome to the rover clubhouse.</>}
        lede="Meet Oppy and friends in short animated stories. Pick one and press play."
        aside={<span className="rv-rail-hint">Scroll or swipe <ArrowRight className="h-4 w-4" /></span>}
      >
        <div className="rv-reels-rail">
          {HOME_REELS.map((item, index) => (
            <button type="button" key={item.id} onClick={() => setReel(index)} className="rv-reel-card" aria-label={`Watch ${item.title}, ${item.duration}`}>
              <span className="rv-reel-poster">
                <Image src={reelPoster(item)} alt="" fill sizes="(min-width:1024px) 240px, 180px" className="object-cover" />
                <span className="rv-reel-play"><Play className="h-5 w-5" /></span>
                <span className="rv-reel-duration">{item.duration}</span>
                <span className="rv-reel-type">Animated story</span>
              </span>
              <span className="rv-reel-info">
                <span className="rv-kicker">{item.tag}</span>
                <span className="mt-1.5 block text-sm font-bold leading-snug">{item.title}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="rv-reel-note">
          RoverVilla’s characters tell imagined stories. For the historical record, explore each machine’s story and labelled archival media.
        </p>
      </StoryChapter>

      {/* ── Chapter 4 · how a story works ───────────────────────────────────── */}
      <StoryChapter
        layout="stack"
        tint="peach"
        number="04"
        kicker="An adventure with an “aha!”"
        title={<>Not just “read and remember.”</>}
        lede="Meet the character. Help the hardware. Discover why it mattered."
      >
        <ol className="rv-step-grid">
          <li>
            <span className="rv-step-number">01</span>
            <span className="rv-step-icon"><BookIcon className="h-7 w-7" /></span>
            <h3 className="display">Hear my story.</h3>
            <p>A landing. A surprise. A little machine with a big job to do.</p>
          </li>
          <li>
            <span className="rv-step-number">02</span>
            <span className="rv-step-icon"><Play className="h-7 w-7" /></span>
            <h3 className="display">Try what I did.</h3>
            <p>Guide a landing, explore a part, or follow a pulse of light.</p>
          </li>
          <li>
            <span className="rv-step-number">03</span>
            <span className="rv-step-icon"><LightbulbIcon className="h-7 w-7" /></span>
            <h3 className="display">Find the “aha!”</h3>
            <p>See how a piece of engineering helped us learn something new.</p>
          </li>
        </ol>
      </StoryChapter>

      {/* ── Chapter 5 · the comic ──────────────────────────────────────────── */}
      <StoryChapter
        tint="sage"
        number="05"
        kicker="For the “one more page” explorers"
        title={<>A whole universe between the panels.</>}
        lede="Meet the machines through colourful comics. Short dialogue, big pictures, and field notes when you want to look closer."
        aside={
          <Link href="/story" className="rv-button rv-button-orange">
            Find my next comic <BookIcon className="h-4 w-4" />
          </Link>
        }
      >
        <figure className="rv-comic-preview" aria-describedby="rv-story-art-note">
          <ComicScene machine="mer-part-1" stage="hardware" moon={false} />
          <figcaption className="rv-comic-speech">
            A broken wheel?<br />There was a discovery hiding underneath.
          </figcaption>
          <span className="rv-comic-sticker">Turn the page →</span>
        </figure>
      </StoryChapter>

      {/* ── The launchpad ──────────────────────────────────────────────────── */}
      <HomeReveal className="rv-launchpad-wrap">
        <section className="rv-launchpad" aria-labelledby="rv-launchpad-title">
          <div>
            <p className="rv-kicker">Ready when you are</p>
            <h2 id="rv-launchpad-title" className="display">Your next “what if?” starts here.</h2>
            <p>Follow an explorer’s story, or find a new friend on the space map.</p>
          </div>
          <div className="rv-actions">
            <Link href="/story" className="rv-button rv-button-orange"><BookIcon className="h-4 w-4" />Find your next story</Link>
            <Link href="/where-they-rest" className="rv-button rv-button-light"><MapIcon className="h-4 w-4" />Open the space map</Link>
          </div>
        </section>
      </HomeReveal>

      <div className="rv-grownup-note">
        <strong>Little adventures. Real history.</strong>
        <p>
          Built for curious young explorers, with room for grown-ups to look deeper. Stories are interpretations;
          historical recordings and source records are identified separately. RoverVilla is independent—not endorsed by NASA.
        </p>
      </div>

      {reel !== null && <ReelViewer initialIndex={reel} onClose={() => setReel(null)} />}
    </HomeMotionProvider>
  );
}
