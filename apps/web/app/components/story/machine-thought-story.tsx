"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BookIcon, Close } from "@/app/components/icons";
import { machineBookUrl } from "@/lib/machine-books";
import { readMachineScrollPosition } from "@/lib/machine-scroll";
import { thoughtAtScroll, type ThoughtEdition, type ThoughtMoment } from "@/lib/thought-clouds";
import ThoughtNarration from "./thought-narration";
import "./eagle-scroll.css";
import "./thought-clouds.css";

const HEADER_HEIGHT = 64;
type IllustrationRenderer = (moment: ThoughtMoment) => ReactNode;

function CloudOutline() {
  return <svg className="tc-cloud-outline" viewBox="0 0 440 270" preserveAspectRatio="none" aria-hidden="true"><path d="M44 231C9 228 1 207 19 185C-3 161 0 137 20 120C3 91 16 67 46 63C50 33 80 20 109 35C127 9 161 6 187 25C217 7 248 10 267 31C302 12 333 22 346 47C379 35 411 51 410 80C442 89 445 118 424 139C443 165 434 191 410 201C411 230 385 248 354 241C330 262 298 260 278 246C245 266 214 263 191 249C160 265 129 258 112 242C85 256 55 250 44 231Z" /></svg>;
}

function ReaderDialog({ name, title, onClose, children }: { name: string; title: string; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    return () => { node?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className="tc-dialog" aria-labelledby="tc-dialog-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header><div><p className="tc-eyebrow">The Chronicles of {name}</p><h2 id="tc-dialog-title">{title}</h2></div><button type="button" onClick={onClose} aria-label="Close reading panel"><Close className="h-5 w-5" /></button></header>{children}
  </dialog>;
}

function MomentNotes({ moment, edition }: { moment: ThoughtMoment; edition: ThoughtEdition }) {
  const BOOK = edition.book;
  const MOMENTS = edition.moments;
  const chapter = BOOK.chapters[moment.chapterSequence - 1];
  return <div className="tc-notes">
    <p className="tc-note-serial">Moment {String(moment.displaySerial).padStart(2, "0")} / {MOMENTS.length} · Chapter {moment.chapterSequence}</p>
    <p className="tc-note-line">{moment.bubbleText}</p><p className="tc-note-detail">{moment.detailText}</p>
    <section><h3>What this helped us learn</h3><p>{chapter.discovery}</p></section>
    <details><summary>The hardware and mission record</summary><p>{chapter.hardware}</p>{chapter.telemetry?.map(item => <p key={item.label}><strong>{item.label}: {item.value}.</strong> {item.note} <a href={item.source} target="_blank" rel="noopener noreferrer">Source ↗</a></p>)}<a href={moment.sourceUrl} target="_blank" rel="noopener noreferrer">Open this event’s source ↗</a>{moment.relatedSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</details>
    <div className="tc-note-formats"><Link href={machineBookUrl(BOOK.slug, chapter.id, "book")}><BookIcon className="h-4 w-4" />Read the complete chapter</Link><Link href={machineBookUrl(BOOK.slug, chapter.id, "comic")}>Open the comic ↗</Link></div>
    <details className="tc-production-note"><summary>Moment ID &amp; narration script</summary><code>{moment.beatId}</code><p>Display serial {moment.displaySerial} · text revision {moment.textRevision} · fingerprint <code>{moment.textFingerprint}</code></p><p>{moment.audio.status === "ready" ? "A matching recorded narration is attached." : moment.audio.status === "stale" ? "The recorded clip needs updating before it can play." : "The narration script is ready; no recorded clip is attached."}</p><p><strong>Exact narration text:</strong> {moment.narrationText}</p><a href={moment.url}>Link to this moment</a><a href={edition.manifestUrl} download>Download the complete audio-production manifest</a></details>
  </div>;
}

function MomentVisual({ moment, edition, renderIllustration }: { moment: ThoughtMoment; edition: ThoughtEdition; renderIllustration: IllustrationRenderer }) {
  const BOOK = edition.book;
  const chapter = BOOK.chapters[moment.chapterSequence - 1];
  const direction = edition.directions[chapter.id];
  const index = moment.beatSequence - 1;
  const photograph = direction.photographs?.[index] ?? (direction.photograph && !direction.diagramBeats?.includes(index) ? direction.photograph : undefined);
  return <figure className={`tc-art ${photograph ? "tc-art-photo" : ""}`} data-art-for={moment.beatId}>
    <div className="tc-art-picture">{photograph ? <Image key={photograph.src} src={photograph.src} alt={photograph.alt} fill sizes="(min-width:900px) 58vw, 90vw" className="object-contain" /> : renderIllustration(moment)}</div>
    <figcaption>{photograph ? <a href={photograph.source} target="_blank" rel="noopener noreferrer">{photograph.title} · {photograph.credit} ↗<span>{photograph.alt}</span></a> : "Illustrated memory · AI-assisted, not to scale"}</figcaption>
  </figure>;
}

function ThoughtStage({ edition, renderIllustration, active, hasStarted, blocked, onNotes, onMove, reduced }: { edition: ThoughtEdition; renderIllustration: IllustrationRenderer; active: number; hasStarted: boolean; blocked: boolean; onNotes: (moment: number) => void; onMove: (moment: number) => void; reduced: boolean }) {
  const BOOK = edition.book;
  const MOMENTS = edition.moments;
  const moment = MOMENTS[active];
  const chapterIndex = moment.chapterSequence - 1;
  const chapter = BOOK.chapters[chapterIndex];
  const moments = MOMENTS.filter(moment => moment.chapterId === chapter.id);
  const local = moment.beatSequence - 1;
  const direction = edition.directions[chapter.id];
  return <div className={`tc-stage tc-tone-${direction.tone}`} data-placement={moment.bubblePlacement} data-current={hasStarted} data-chapter={chapter.id} inert={!hasStarted}>
      <header className="tc-chapter-heading"><p className="tc-eyebrow">Chapter {chapterIndex + 1} / {BOOK.chapters.length} · {direction.date}</p><h2 id={`tc-title-${chapter.id}`}>{chapter.title}</h2><p>{direction.place}</p></header>
      <MomentVisual moment={moment} edition={edition} renderIllustration={renderIllustration} />
      {hasStarted && <motion.div key={moment.beatId} id={`cloud-${moment.beatId}`} tabIndex={-1} className="tc-cloud" data-beat-id={moment.beatId} data-serial={moment.displaySerial} initial={reduced ? false : { opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : 0.32, ease: "easeOut" }}>
        <CloudOutline /><div className="tc-cloud-inside"><p className="tc-cloud-speaker">{BOOK.name}<span>{String(moment.displaySerial).padStart(2, "0")} / {MOMENTS.length}</span></p><p className="tc-cloud-line">{moment.bubbleText}</p><button type="button" onClick={() => onNotes(moment.displaySerial - 1)}>More to this moment <ArrowRight className="h-3.5 w-3.5" /></button></div><span className="tc-thought-dot tc-thought-dot-one" aria-hidden="true" /><span className="tc-thought-dot tc-thought-dot-two" aria-hidden="true" />
      </motion.div>}
      <footer className="tc-stage-controls"><button type="button" disabled={moment.displaySerial === 1} onClick={() => onMove(moment.displaySerial - 2)} aria-label="Previous moment"><ArrowLeft className="h-4 w-4" /><span>Previous</span></button><div>{hasStarted && !blocked ? <ThoughtNarration key={moment.beatId} moment={moment} /> : <span className="tc-scroll-invitation">Scroll to follow the thought</span>}</div><button type="button" onClick={() => onMove(moment.displaySerial)}>{moment.displaySerial === MOMENTS.length ? "Finish story" : local === moments.length - 1 ? "Next chapter" : "Next moment"}<ArrowRight className="h-4 w-4" /></button></footer>
      <div className="tc-moment-track" aria-hidden="true">{moments.map((item, index) => <span key={item.beatId} data-complete={index <= local} />)}</div>
  </div>;
}

export default function MachineThoughtStory({ edition: EDITION, renderIllustration, onChapterChange, onFinish }: { edition: ThoughtEdition; renderIllustration: IllustrationRenderer; onChapterChange?: (index: number) => void; onFinish?: () => void }) {
  const BOOK = EDITION.book;
  const MOMENTS = EDITION.moments;
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [dialog, setDialog] = useState<"chapters" | number | null>(null);
  const [resume, setResume] = useState<number | null>(null);
  const needsFocus = useRef<string | null>(null);
  const positions = useRef<number[]>([]);
  const endPosition = useRef(Infinity);
  const reduced = useReducedMotion();
  const moment = MOMENTS[active];
  useEffect(() => { onChapterChange?.(moment.chapterSequence - 1); }, [moment.chapterSequence, onChapterChange]);

  useEffect(() => {
    let index: number | null = null;
    try {
      const saved = readMachineScrollPosition(BOOK, localStorage.getItem(EDITION.bookmarkKey));
      if (saved) { const found = MOMENTS.findIndex(item => item.chapterId === saved.chapter && item.beatSequence === saved.beat + 1); if (found >= 0) index = found; }
    } catch { /* The story works without a saved position. */ }
    const frame = requestAnimationFrame(() => setResume(index));
    return () => cancelAnimationFrame(frame);
  }, [BOOK, MOMENTS, EDITION.bookmarkKey]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(thoughtAtScroll(positions.current, window.scrollY + 2));
      setStarted(window.scrollY + 2 >= (positions.current[0] ?? Infinity));
      setAtEnd(window.scrollY + 2 >= endPosition.current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      positions.current = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-thought-marker]"), element => window.scrollY + element.getBoundingClientRect().top - HEADER_HEIGHT);
      endPosition.current = window.scrollY + document.getElementById("tc-ending")!.getBoundingClientRect().top - HEADER_HEIGHT;
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(root.current!);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => { resize.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", measure); cancelAnimationFrame(frame); };
  }, [MOMENTS]);

  useEffect(() => {
    if (!started) return;
    try { localStorage.setItem(EDITION.bookmarkKey, JSON.stringify({ chapter: moment.chapterId, beat: moment.beatSequence - 1, beatId: moment.beatId })); } catch { /* Optional local bookmark. */ }
    if (!atEnd && window.location.hash !== `#${moment.beatId}`) window.history.replaceState(window.history.state, "", `#${moment.beatId}`);
    if (needsFocus.current === moment.beatId) {
      const frame = requestAnimationFrame(() => { document.getElementById(`cloud-${moment.beatId}`)?.focus({ preventScroll: true }); needsFocus.current = null; });
      return () => cancelAnimationFrame(frame);
    }
  }, [started, moment, atEnd, EDITION.bookmarkKey]);

  const move = useCallback((index: number) => {
    setDialog(null);
    if (index >= MOMENTS.length) { document.getElementById("tc-ending")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" }); return; }
    const next = MOMENTS[Math.max(0, index)];
    needsFocus.current = next.beatId;
    window.history.pushState(null, "", `#${next.beatId}`);
    // A direct moment jump avoids racing through every intermediate voice and scene.
    requestAnimationFrame(() => {
      const marker = document.getElementById(next.beatId);
      if (marker) window.scrollTo({ top: window.scrollY + marker.getBoundingClientRect().top - HEADER_HEIGHT + 2, behavior: "instant" });
      document.getElementById(`cloud-${next.beatId}`)?.focus({ preventScroll: true });
    });
  }, [reduced, MOMENTS]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (dialog !== null || !started || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof HTMLElement && event.target.closest('a,button,input,textarea,select,summary,dialog,[contenteditable="true"]')) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(active + (event.key === "ArrowRight" ? 1 : -1)); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, started, dialog, move]);

  const themeClass = EDITION.theme === "mars" ? "es-mars opportunity-thoughts" : EDITION.theme === "moon" ? "ranger-thoughts" : "eagle-thoughts";
  return <div ref={root} className={`eagle-scroll thought-story ${themeClass}`} data-machine={BOOK.slug} data-active-moment={moment.beatId} data-started={started}>
    <a href={`#${MOMENTS[0].beatId}`} className="es-skip" onClick={event => { event.preventDefault(); move(0); }}>Skip to {BOOK.name}’s first thought</a>
    <header className="tc-topbar"><Link href={`/heroes/${BOOK.slug}`}><ArrowLeft className="h-4 w-4" /><span>{BOOK.name}<span className="tc-topbar-description"> / a story in thoughts</span></span></Link><p className="tc-topbar-serial" aria-label={started ? `Moment ${moment.displaySerial} of ${MOMENTS.length}` : `${MOMENTS.length} story moments`}>{started ? `${String(moment.displaySerial).padStart(2, "0")} / ${MOMENTS.length}` : `${MOMENTS.length} moments`}</p><nav aria-label="Story controls"><button type="button" onClick={() => setDialog("chapters")}>Chapters</button><Link href={machineBookUrl(BOOK.slug, moment.chapterId, "book")}>Full book</Link></nav><div className="tc-total-progress" style={{ transform: `scaleX(${started ? moment.displaySerial / MOMENTS.length : 0})` }} aria-hidden="true" /></header>
    <section className="es-opening tc-opening" aria-labelledby="tc-story-title"><div className="es-opening-image"><Image src={EDITION.cover.src} alt={EDITION.cover.alt} fill priority sizes="100vw" className="object-cover" /></div><div className="es-opening-shade" /><div className="es-opening-copy"><p className="es-label">{EDITION.opening.kicker}</p><h1 id="tc-story-title">{EDITION.opening.title}<br /><em>{EDITION.opening.emphasis}</em></h1><p>{EDITION.opening.introduction}</p><p className="es-opening-invitation">{EDITION.opening.invitation}</p></div><div className="es-opening-bottom"><div><a href={`#${MOMENTS[0].beatId}`} className="es-start" onClick={event => { event.preventDefault(); move(0); }}>Let’s begin <span aria-hidden="true">↓</span></a>{resume !== null && <button type="button" className="es-resume" onClick={() => move(resume)}>Pick up at moment {String(resume + 1).padStart(2, "0")} ↗</button>}</div><p>{BOOK.chapters.length} true-event chapters.<br /><span>Imagined machine thoughts, grounded in mission records.</span></p></div><a className="es-opening-credit" href={EDITION.cover.source} target="_blank" rel="noopener noreferrer">{EDITION.cover.title} · {EDITION.cover.credit} ↗</a></section>
    <div className="tc-story-track" style={{ "--tc-moments": MOMENTS.length } as CSSProperties}>
      <ThoughtStage edition={EDITION} renderIllustration={renderIllustration} active={active} hasStarted={started && !atEnd} blocked={dialog !== null} onNotes={setDialog} onMove={move} reduced={!!reduced} />
      {MOMENTS.map((item, index) => <div key={item.beatId} id={item.beatId} className="tc-marker" style={{ top: `calc(${index} * var(--tc-step))` }} data-thought-marker data-index={index}>{item.beatSequence === 1 && <span id={item.chapterId} className="tc-legacy-anchor" />}<span id={item.legacyAnchor} className="tc-legacy-anchor" /><section className="sr-only" aria-label={`Moment ${item.displaySerial}: ${item.chapterTitle}`}><h3>{item.bubbleText}</h3><p>{item.detailText}</p></section></div>)}
    </div>
    <section id="tc-ending" className="es-ending"><p className="es-label">{BOOK.name} / A story remembered</p><h2>They never came back.<br /><em>So we bring their stories home.</em></h2><p>{EDITION.ending}</p><div>{onFinish ? <button type="button" onClick={onFinish}>Back to {BOOK.name} <ArrowRight className="h-4 w-4" /></button> : <Link href={`/heroes/${BOOK.slug}`}>Back to {BOOK.name} <ArrowRight className="h-4 w-4" /></Link>}<Link href={`/heroes/${BOOK.slug}/book`}>Read the full book</Link><button type="button" onClick={() => move(0)}>Start at the first thought ↑</button></div><details className="tc-production-footer"><summary>Sources, words &amp; narration production</summary><p>Every cloud uses a line from {BOOK.name}’s existing story. “More to this moment” preserves the full explanation and source links. Illustrations and the machine’s first-person voice are interpretations; archival photographs carry their own credits.</p><p>Moment IDs stay matched to narration text and visual direction. The manifest identifies missing or outdated clips. Browser voice preview, when available, is synthetic; no produced narration is implied by an empty audio entry.</p><a href={EDITION.manifestUrl} download>Download the narration manifest ↗</a></details></section>
    {dialog !== null && <ReaderDialog name={BOOK.name} title={dialog === "chapters" ? "Where shall we begin?" : MOMENTS[dialog].chapterTitle} onClose={() => setDialog(null)}>{dialog === "chapters" ? <ol className="tc-chapter-list">{BOOK.chapters.map((chapter, index) => <li key={chapter.id}><button type="button" onClick={() => move(MOMENTS.findIndex(item => item.chapterId === chapter.id))} aria-current={chapter.id === moment.chapterId ? "location" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><span><strong>{chapter.title}</strong><small>{EDITION.directions[chapter.id].date} · {chapter.beats.length} moments</small></span><ArrowRight className="h-4 w-4" /></button></li>)}</ol> : <MomentNotes moment={MOMENTS[dialog]} edition={EDITION} />}</ReaderDialog>}
  </div>;
}
