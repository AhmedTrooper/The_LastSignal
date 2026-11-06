"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { ArrowLeft, ArrowRight, Close } from "@/app/components/icons";
import { APOLLO_BOOK } from "@/lib/machine-books/apollo";
import { machineBookUrl, type EventChapter } from "@/lib/machine-books";
import { EAGLE_SCROLL_BOOKMARK, EAGLE_SCROLL_COVER, EAGLE_SCROLL_DIRECTION, readEagleScrollPosition, type EagleScrollPosition } from "@/lib/eagle-scroll";
import EagleScrollDiagram from "./eagle-scroll-diagram";
import { useEagleStoryLink } from "./use-eagle-story-link";
import "./eagle-scroll.css";

const CHAPTERS = APOLLO_BOOK.chapters;
type ActivePassage = { chapter: number; beat: number };

function ChapterContents({ current, onClose, onChoose }: { current: number; onClose: () => void; onChoose: (index: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    return () => { node?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className="es-contents" aria-labelledby="es-contents-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header><div><p className="es-label">The Chronicles of Eagle</p><h2 id="es-contents-title">Find your chapter.</h2></div><button type="button" aria-label="Close chapters" onClick={onClose}><Close className="h-5 w-5" /></button></header>
    <ol>{CHAPTERS.map((chapter, index) => <li key={chapter.id}><button type="button" aria-current={index === current ? "location" : undefined} onClick={() => onChoose(index)}><span className="es-label">{String(index + 1).padStart(2, "0")}</span><span>{chapter.title}<small>{EAGLE_SCROLL_DIRECTION[chapter.id].place}</small></span><ArrowRight className="h-4 w-4" /></button></li>)}</ol>
  </dialog>;
}

function ChapterVisual({ chapter, beat, reduced }: { chapter: EventChapter; beat: number; reduced: boolean }) {
  const direction = EAGLE_SCROLL_DIRECTION[chapter.id];
  const stage = reduced ? 3 : beat;
  const diagram = direction.diagram && (!direction.photograph || direction.diagramBeats?.includes(stage));
  const image = direction.photograph;
  return <figure className="es-visual" data-visual-beat={stage} aria-label={`${chapter.title}: visual companion`}>
    <div className="es-visual-frame">
      {diagram ? <EagleScrollDiagram kind={direction.diagram!} beat={stage} /> : image ? <div className="es-archive-image" key={image.src}><Image src={image.src} alt={image.alt} fill sizes="(min-width:900px) 54vw, 100vw" className="object-contain" /></div> : null}
    </div>
    <figcaption>{diagram ? <><span className="es-label">Inside the hardware</span><span>AI-assisted explanatory drawing · not to scale{direction.diagram === "seismic" ? "; wave is illustrative" : ""}</span></> : image ? <><span className="es-label">{image.title}</span><a href={image.source} target="_blank" rel="noopener noreferrer">{image.alt} <span className="es-photo-credit">{image.credit} ↗</span></a></> : null}</figcaption>
  </figure>;
}

function ScrollChapter({ chapter, index, active, reduced }: { chapter: EventChapter; index: number; active: ActivePassage | null; reduced: boolean }) {
  const direction = EAGLE_SCROLL_DIRECTION[chapter.id];
  const beat = active?.chapter === index ? active.beat : active && active.chapter > index ? 3 : 0;
  return <article id={chapter.id} className={`es-chapter es-${direction.tone}`} aria-labelledby={`title-${chapter.id}`} tabIndex={-1}>
    <header className="es-chapter-heading" data-scroll-target data-chapter={index} data-beat="0">
      <div className="es-chapter-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div><div><p className="es-label">Chapter {index + 1} / {direction.date} / {direction.place}</p><h2 id={`title-${chapter.id}`}>{chapter.title}</h2><p className="es-event">{chapter.event}</p></div>
    </header>
    <div className="es-spread">
      <ChapterVisual chapter={chapter} beat={beat} reduced={reduced} />
      <div className="es-narrative">{chapter.beats.map((passage, part) => <section key={part} id={`${chapter.id}-beat-${part}`} className="es-passage" data-scroll-target data-chapter={index} data-beat={part} data-active={part === beat} aria-label={`Passage ${part + 1}`}>
        <span className="es-passage-rule" aria-hidden="true" /><p className="es-story-line">{passage.line}</p><p className="es-story-detail">{passage.detail}</p>
      </section>)}</div>
    </div>
    <footer className="es-chapter-footer">
      <div className="es-afterword"><span className="es-label">What came from it</span><p>{chapter.discovery}</p></div>
      <div className="es-chapter-links"><details><summary>The record behind this chapter <span aria-hidden="true">+</span></summary><div><p>{chapter.hardware}</p><a href={chapter.source} target="_blank" rel="noopener noreferrer">Read the original source ↗</a>{chapter.relatedSources?.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div></details><div className="es-editions"><span>This chapter, another way</span><Link href={machineBookUrl(APOLLO_BOOK.slug, chapter.id, "comic")}>Comic <ArrowRight className="h-3.5 w-3.5" /></Link><Link href={machineBookUrl(APOLLO_BOOK.slug, chapter.id, "book")}>Storybook <ArrowRight className="h-3.5 w-3.5" /></Link></div></div>
    </footer>
  </article>;
}

export default function EagleScrollStory() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActivePassage | null>(null);
  const [contents, setContents] = useState(false);
  const [resume, setResume] = useState<EagleScrollPosition | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const chapterIndex = active?.chapter ?? 0;
  const chapter = CHAPTERS[chapterIndex];
  const link = useEagleStoryLink(chapterIndex, CHAPTERS.length, chapter.title, "/heroes/apollo-11-lander");

  useEffect(() => {
    let saved: EagleScrollPosition | null = null;
    try { saved = readEagleScrollPosition(localStorage.getItem(EAGLE_SCROLL_BOOKMARK)); } catch { /* Optional local bookmark. */ }
    const frame = requestAnimationFrame(() => setResume(saved));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const targets = root.current?.querySelectorAll<HTMLElement>("[data-scroll-target]");
    if (!targets?.length) return;
    let frame = 0;
    let markers: { top: number; chapter: number; beat: number }[] = [];
    const update = () => {
      frame = 0;
      // On a phone the visual sits above the text, so read the lower, unobscured area.
      const pinnedMobile = window.innerWidth < 900 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const readingLine = window.scrollY + (pinnedMobile ? window.innerHeight * 0.67 + 32 : window.innerHeight * 0.6);
      let marker: typeof markers[number] | undefined;
      for (const candidate of markers) {
        if (candidate.top > readingLine) break;
        marker = candidate;
      }
      const next = marker ? { chapter: marker.chapter, beat: marker.beat } : null;
      setActive(previous => previous?.chapter === next?.chapter && previous?.beat === next?.beat ? previous : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      markers = Array.from(targets, target => ({
        top: window.scrollY + (target.querySelector<HTMLElement>(".es-story-line") ?? target).getBoundingClientRect().top,
        chapter: Number(target.dataset.chapter), beat: Number(target.dataset.beat),
      }));
      schedule();
    };
    // Cache layout positions; scrolling only changes React state at passage boundaries.
    const resize = new ResizeObserver(measure);
    resize.observe(root.current!);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => { resize.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", measure); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!active) return;
    try { localStorage.setItem(EAGLE_SCROLL_BOOKMARK, JSON.stringify({ chapter: CHAPTERS[active.chapter].id, beat: active.beat })); } catch { /* Reading works without persistence. */ }
  }, [active]);

  const jump = useCallback((id: string, beat?: number) => {
    setContents(false);
    const anchor = beat === undefined ? id : `${id}-beat-${beat}`;
    window.history.pushState(null, "", `#${anchor}`);
    requestAnimationFrame(() => {
      const target = document.getElementById(anchor);
      target?.scrollIntoView({ block: "start", behavior: reduced ? "instant" : "smooth" });
      document.getElementById(id)?.focus({ preventScroll: true });
    });
  }, [reduced]);

  return <div ref={root} className="eagle-scroll" data-active-chapter={chapter.id}>
    <a className="es-skip" href="#undocking">Skip to the first chapter</a>
    <header className="es-topbar"><Link href="/heroes/apollo-11-lander" className="es-home"><ArrowLeft className="h-4 w-4" /><span>Eagle<span className="es-topbar-sub"> / the scroll story</span></span></Link><p className="es-current-chapter">{active ? `${String(chapterIndex + 1).padStart(2, "0")} / ${chapter.title}` : "The Chronicles of Eagle"}</p><nav aria-label="Story controls"><button type="button" onClick={() => setContents(true)}>Chapters</button><Link href={machineBookUrl(APOLLO_BOOK.slug, chapter.id, "comic")} aria-label={`Read ${chapter.title} as a comic`}>Comic</Link><Link href={machineBookUrl(APOLLO_BOOK.slug, chapter.id, "book")} aria-label={`Read ${chapter.title} as a storybook`}>Book</Link></nav><motion.div className="es-scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" /></header>
    <section className="es-opening" aria-labelledby="es-story-title">
      <div className="es-opening-image"><Image src={EAGLE_SCROLL_COVER.src} alt={EAGLE_SCROLL_COVER.alt} fill priority sizes="100vw" className="object-cover" /></div><div className="es-opening-shade" />
      <div className="es-opening-copy"><p className="es-label">Apollo 11 / Eagle / LM-5</p><h1 id="es-story-title">The part<br />that <em>stayed.</em></h1><p>Neil and Buzz had a way home.<br />Part of me was built to stay behind.</p><p className="es-opening-invitation">Come back to the landing. There’s more to it than a footprint.</p></div>
      <div className="es-opening-bottom"><div><a href="#undocking" onClick={event => { event.preventDefault(); jump("undocking"); }} className="es-start">Scroll to begin <span aria-hidden="true">↓</span></a>{resume && <button type="button" onClick={() => jump(resume.chapter, resume.beat)} className="es-resume">Or pick up where you left off ↗</button>}</div><p>{CHAPTERS.length} chapters. One machine.<br /><span>First-person retelling · imagined voice, documented events.</span></p></div>
      <a className="es-opening-credit" href={EAGLE_SCROLL_COVER.source} target="_blank" rel="noopener noreferrer">{EAGLE_SCROLL_COVER.title} · {EAGLE_SCROLL_COVER.credit} ↗</a>
    </section>
    <div className="es-preface"><p className="es-label">Before the dust settled</p><p>A docking connection. A computer warning. A camera tucked beside a ladder. The Moon landing happened through small things doing their jobs.</p><p>These are Eagle’s stories, in the order they happened. Each chapter follows one event. Keep scrolling, and the next part comes into view.</p><button type="button" onClick={() => setContents(true)}>Or start with a chapter that catches your eye <ArrowRight className="h-4 w-4" /></button></div>
    {CHAPTERS.map((chapter, index) => <ScrollChapter key={chapter.id} chapter={chapter} index={index} active={active} reduced={!!reduced} />)}
    <section className="es-ending" aria-labelledby="es-ending-title"><p className="es-label">The Chronicles of Eagle / End</p><h2 id="es-ending-title">They never came back.<br /><em>So we bring their stories home.</em></h2><p>The landing stage, the instruments, the traces in the dust. You’ve met the machine behind them.</p><div><button type="button" onClick={link.finish}>Back to Eagle <ArrowRight className="h-4 w-4" /></button><Link href="/heroes/apollo-11-lander/book">Open the Book &amp; Comic Nook</Link><a href="#undocking" onClick={event => { event.preventDefault(); jump("undocking"); }}>Read from the beginning ↑</a></div><p className="es-ending-note">Archival photographs are credited beside each image. Explanatory drawings are AI-assisted. Historical sources are linked within every chapter. RoverVilla is an independent project, not endorsed by NASA.</p></section>
    {contents && <ChapterContents current={chapterIndex} onClose={() => setContents(false)} onChoose={index => jump(CHAPTERS[index].id)} />}
  </div>;
}
