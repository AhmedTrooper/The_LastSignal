"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, BookIcon, Close } from "@/app/components/icons";
import { machineBookUrl } from "@/lib/machine-books";
import { readMachineScrollPosition } from "@/lib/machine-scroll";
import { thoughtAtScroll, type ThoughtEdition, type ThoughtMoment } from "@/lib/thought-clouds";
import ThoughtNarration from "./thought-narration";
import StoryIllustrationView from "./story-illustration";
import { useReaderReducedMotion } from "./use-reader-reduced-motion";
import "./eagle-scroll.css";
import "./thought-clouds.css";

const HEADER_HEIGHT = 64;
/** Heavy spring for "fall from top" — overshoots slightly on landing. */
const dropSpring = (delay: number) => ({ type: "spring" as const, stiffness: 120, damping: 15, mass: 0.72, delay });

/** Split-headline bounce: each word falls with rotateX + stagger (UI/UX Pro Max: SplitText, headline only). */
function TitleBurst({ title, emphasis, reduced }: { title: string; emphasis: string; reduced: boolean }) {
  const titleWords = title.split(/\s+/).filter(Boolean);
  const emphasisWords = emphasis.split(/\s+/).filter(Boolean);
  return <h1 id="tc-story-title" aria-label={`${title} ${emphasis}`}>{titleWords.flatMap((word, index) => [<motion.span key={`t-${index}-${word}`} aria-hidden="true" className="tc-title-word" initial={reduced ? false : { opacity: 0, y: -64, rotateX: -42, rotateZ: index % 2 === 0 ? 2.5 : -2.5, scale: 0.94 }} animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }} transition={{ type: "spring" as const, stiffness: 130, damping: 14, delay: 0.15 + index * 0.045 }}>{word}</motion.span>, index < titleWords.length - 1 ? " " : null])}<br /><em>{emphasisWords.flatMap((word, index) => [<motion.span key={`e-${index}-${word}`} aria-hidden="true" className="tc-title-word" initial={reduced ? false : { opacity: 0, y: -64, rotateX: -42, rotateZ: index % 2 === 0 ? 2.5 : -2.5, scale: 0.94 }} animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }} transition={{ type: "spring" as const, stiffness: 130, damping: 14, delay: 0.15 + (titleWords.length + index) * 0.045 }}>{word}</motion.span>, index < emphasisWords.length - 1 ? " " : null])}</em></h1>;
}

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

function MomentNotes({ moment, edition, renderNotesExtras }: { moment: ThoughtMoment; edition: ThoughtEdition; renderNotesExtras?: IllustrationRenderer }) {
  const BOOK = edition.book;
  const MOMENTS = edition.moments;
  const chapter = BOOK.chapters[moment.chapterSequence - 1];
  const illustration = edition.illustrations?.[moment.beatId];
  return <div className="tc-notes">
    <p className="tc-note-serial">Moment {String(moment.displaySerial).padStart(2, "0")} / {MOMENTS.length} · Chapter {moment.chapterSequence}</p>
    <p className="tc-note-line">{moment.bubbleText}</p><p className="tc-note-detail">{moment.detailText}</p>
    {illustration && <details className="tc-illustration-sources"><summary>About this illustration · sources &amp; context</summary><p><strong>{illustration.title}</strong> · {illustration.credit}</p><p>{illustration.context}</p><p>{illustration.interpretation}</p>{illustration.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</details>}
    <section><h3>What this helped us learn</h3><p>{chapter.discovery}</p></section>
    <details><summary>The hardware and mission record</summary><p>{chapter.hardware}</p>{chapter.telemetry?.map(item => <p key={item.label}><strong>{item.label}: {item.value}.</strong> {item.note} <a href={item.source} target="_blank" rel="noopener noreferrer">Source ↗</a></p>)}<a href={moment.sourceUrl} target="_blank" rel="noopener noreferrer">Open this event’s source ↗</a>{moment.relatedSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</details>
    <div className="tc-note-formats"><Link href={machineBookUrl(BOOK.slug, chapter.id, "book")}><BookIcon className="h-4 w-4" />Read the complete chapter</Link><Link href={machineBookUrl(BOOK.slug, chapter.id, "comic")}>Open the comic ↗</Link></div>
    {renderNotesExtras?.(moment)}
    {edition.evidenceUrl && <a href={edition.evidenceUrl} download className="inline-flex min-h-11 items-center text-sm underline">Download the NASA source ledger ↗</a>}
    <details className="tc-production-note"><summary>Moment ID &amp; narration script</summary><code>{moment.beatId}</code><p>Display serial {moment.displaySerial} · text revision {moment.textRevision} · fingerprint <code>{moment.textFingerprint}</code></p><p>{moment.audio.status === "ready" ? "A matching recorded narration is attached." : moment.audio.status === "stale" ? "The recorded clip needs updating before it can play." : "The narration script is ready; no recorded clip is attached."}</p><p><strong>Exact narration text:</strong> {moment.narrationText}</p><a href={moment.url}>Link to this moment</a><a href={edition.manifestUrl} download>Download the complete audio-production manifest</a></details>
  </div>;
}

function MomentVisual({ moment, edition, renderIllustration, reduced }: { moment: ThoughtMoment; edition: ThoughtEdition; renderIllustration: IllustrationRenderer; reduced: boolean }) {
  const BOOK = edition.book;
  const chapter = BOOK.chapters[moment.chapterSequence - 1];
  const direction = edition.directions[chapter.id];
  const index = moment.beatSequence - 1;
  const photograph = direction.photographs?.[index] ?? (direction.photograph && !direction.diagramBeats?.includes(index) ? direction.photograph : undefined);
  const illustration = edition.illustrations?.[moment.beatId];
  if (illustration) return <StoryIllustrationView key={moment.beatId} illustration={illustration} reduced={reduced} fallback={renderIllustration(moment)} />;
  const image = photograph;
  const pattern = moment.displaySerial % 4;
  const photoClip = [
    ["circle(0.1% at 50% 50%)", "circle(52% at 50% 50%)", "circle(78% at 50% 50%)", "circle(70% at 50% 50%)", "circle(76.5% at 50% 50%)", "circle(75% at 50% 50%)"],
    ["inset(0 100% 0 0)", "inset(0 52% 0 0)", "inset(0 0% 0 0)"],
    ["inset(100% 0 0 0)", "inset(48% 0 0 0)", "inset(0% 0 0 0)"],
    ["ellipse(0% 50% at 50% 50%)", "ellipse(42% 50% at 50% 50%)", "ellipse(75% 50% at 50% 50%)"],
  ][pattern]!;
  const photoScale = [
    [1.08, 1.02, 1, 1.015, 1],
    [1.06, 1.02, 1],
    [1.06, 1.02, 1],
    [1.08, 1, 1],
  ][pattern]!;
  return <motion.figure key={moment.beatId} className={`tc-art ${photograph ? "tc-art-photo" : ""}`} data-art-for={moment.beatId} data-media-kind={photograph ? "archive" : "diagram"} initial={false} animate={{ opacity: 1 }}>
    <motion.div className="tc-art-picture" initial={reduced ? false : image ? { opacity: 0, clipPath: photoClip[0], scale: photoScale[0] } : { opacity: 0, scale: 0.96, rotateX: 12 }} animate={reduced ? { opacity: 1, clipPath: "none", scale: 1, rotateX: 0 } : image ? { opacity: 1, clipPath: photoClip, scale: photoScale } : { opacity: 1, scale: 1, rotateX: 0 }} transition={reduced ? { duration: 0 } : image ? { clipPath: { type: "tween", duration: 1.8, ease: [0.22, 1, 0.36, 1] }, scale: { type: "tween", duration: 1.8, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } } : { duration: 0.5, ease: "easeOut" }} style={{ transformPerspective: 700 }}>
      {image ? <Image key={image.src} src={image.src} alt={image.alt} fill sizes="(min-width:900px) 58vw, 90vw" className="object-contain" /> : renderIllustration(moment)}
      {image && pattern === 0 && !reduced && <motion.span className="tc-center-dot" aria-hidden="true" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1, 1.25, 1], opacity: [0, 0.9, 0.9, 0.25] }} transition={{ type: "tween", duration: 1.8, times: [0, 0.12, 0.3, 1], ease: "easeOut" }} />}
    </motion.div>
    <motion.figcaption initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={reduced ? { duration: 0 } : { duration: 0.5, delay: image ? 1.2 : 0.4 }}>
      {photograph ? <a href={photograph.source} target="_blank" rel="noopener noreferrer">{photograph.title} · {photograph.credit} ↗<span>{photograph.alt}</span></a> : "Illustrated memory · AI-assisted, not to scale"}
    </motion.figcaption>
  </motion.figure>;
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
  const previousDisabled = moment.displaySerial === 1;
  return <div className={`tc-stage tc-tone-${direction.tone}`} data-placement={moment.bubblePlacement} data-current={hasStarted} data-chapter={chapter.id} inert={!hasStarted}>
      <motion.header key={chapter.id} className="tc-chapter-heading" initial={reduced ? false : { opacity: 0, rotateX: -55, y: -24, scale: 0.97 }} animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }} transition={dropSpring(0)} style={{ transformPerspective: 800 }}><p className="tc-eyebrow">Chapter {chapterIndex + 1} / {BOOK.chapters.length} · {direction.date}</p><h2 id={`tc-title-${chapter.id}`}>{chapter.title}</h2><p>{direction.place}</p></motion.header>
      <MomentVisual moment={moment} edition={edition} renderIllustration={renderIllustration} reduced={reduced} />
      <div className="tc-bubbles" aria-hidden="true"><span /><span /><span /></div>
      {hasStarted && <motion.div key={moment.beatId} id={`cloud-${moment.beatId}`} tabIndex={-1} className="tc-cloud" data-beat-id={moment.beatId} data-serial={moment.displaySerial} initial={reduced ? false : { opacity: 0, y: -40, rotate: moment.bubblePlacement?.includes("right") ? -4 : 4, scale: 0.7 }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} transition={{ type: "spring" as const, stiffness: 260, damping: 11, mass: 0.5, delay: 0.08 }}>
        <CloudOutline /><motion.span className="tc-sparkle" aria-hidden="true" initial={reduced ? false : { scale: 0, rotate: -40, opacity: 0 }} animate={reduced ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 1, rotate: 0, opacity: 1, y: [0, -4, 0] }} transition={{ scale: { type: "spring" as const, stiffness: 260, damping: 11, delay: 0.28 }, rotate: { type: "spring" as const, stiffness: 260, damping: 11, delay: 0.28 }, opacity: { duration: 0.2, delay: 0.28 }, y: reduced ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }} /><div className="tc-cloud-inside"><p className="tc-cloud-speaker">{BOOK.name}<span>{String(moment.displaySerial).padStart(2, "0")} / {MOMENTS.length}</span></p><p className="tc-cloud-line">{moment.bubbleText}</p><button type="button" onClick={() => onNotes(moment.displaySerial - 1)}>More to this moment <ArrowRight className="h-3.5 w-3.5" /></button></div><span className="tc-thought-dot tc-thought-dot-one" aria-hidden="true" /><span className="tc-thought-dot tc-thought-dot-two" aria-hidden="true" />
      </motion.div>}
      <footer className="tc-stage-controls"><button type="button" aria-disabled={previousDisabled} data-disabled={previousDisabled} tabIndex={previousDisabled ? -1 : undefined} onClick={() => { if (!previousDisabled) onMove(moment.displaySerial - 2); }} aria-label="Previous moment"><ArrowLeft className="h-4 w-4" /><span>Previous</span></button><div>{hasStarted && !blocked ? <ThoughtNarration key={moment.beatId} moment={moment} /> : <span className="tc-scroll-invitation">Scroll to follow the thought</span>}</div><button type="button" onClick={() => onMove(moment.displaySerial)}>{moment.displaySerial === MOMENTS.length ? "Finish story" : local === moments.length - 1 ? "Next chapter" : "Next moment"}<ArrowRight className="h-4 w-4" /></button></footer>
      <div className="tc-moment-track" aria-hidden="true">{moments.map((item, index) => <span key={item.beatId} data-complete={index <= local} />)}</div>
  </div>;
}

export default function MachineThoughtStory({ edition: EDITION, renderIllustration, onChapterChange, renderNotesExtras }: { edition: ThoughtEdition; renderIllustration: IllustrationRenderer; onChapterChange?: (index: number) => void; renderNotesExtras?: IllustrationRenderer }) {
  const BOOK = EDITION.book;
  const storyFirst = BOOK.slug === "apollo-11-lander" || BOOK.slug === "insight" || BOOK.slug === "ingenuity" || BOOK.slug === "spirit" || BOOK.slug === "surveyor-1" || BOOK.slug === "lcross" || BOOK.slug === "viking-1" || BOOK.slug === "viking-2" || BOOK.slug === "grail" || BOOK.slug === "phoenix" || BOOK.slug === "mars-polar-lander" || BOOK.slug === "apollo-15-rover" || BOOK.slug === "pathfinder-sojourner";
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
  const reduced = useReaderReducedMotion();
  const openingRef = useRef<HTMLElement>(null);
  const { scrollYProgress: openingProgress } = useScroll({ target: openingRef, offset: ["start start", "end start"] });
  const coverY = useTransform(openingProgress, [0, 1], [0, 90]);
  const copyY = useTransform(openingProgress, [0, 1], [0, -70]);
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
      const node = root.current;
      if (!node) return; // A queued ResizeObserver callback can land right after unmount.
      positions.current = Array.from(node.querySelectorAll<HTMLElement>("[data-thought-marker]"), element => window.scrollY + element.getBoundingClientRect().top - HEADER_HEIGHT);
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
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target && !target.closest(".tc-stage-controls") && target.closest('a,button,input,textarea,select,summary,dialog,[contenteditable="true"]')) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(active + (event.key === "ArrowRight" ? 1 : -1)); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, started, dialog, move]);

  const themeClass = BOOK.slug === "apollo-15-rover" ? "lrv-thoughts" : BOOK.slug === "pathfinder-sojourner" ? "pathfinder-thoughts" : BOOK.slug === "mars-polar-lander" ? "mpl-thoughts" : BOOK.slug === "phoenix" ? "phoenix-thoughts" : BOOK.slug === "grail" ? "grail-thoughts" : BOOK.slug === "viking-2" ? "es-mars viking-two-thoughts" : BOOK.slug === "viking-1" ? "es-mars viking-thoughts" : BOOK.slug === "lcross" ? "lcross-thoughts" : BOOK.slug === "surveyor-1" ? "surveyor-thoughts" : BOOK.slug === "spirit" ? "es-mars spirit-thoughts" : BOOK.slug === "ingenuity" ? "es-mars ingenuity-thoughts" : BOOK.slug === "insight" ? "es-mars insight-thoughts" : EDITION.theme === "mars" ? "es-mars opportunity-thoughts" : EDITION.theme === "moon" ? "ranger-thoughts" : "eagle-thoughts";
  return <div ref={root} className={`eagle-scroll thought-story ${themeClass}`} data-machine={BOOK.slug} data-active-moment={moment.beatId} data-started={started}>
    <a href={`#${MOMENTS[0].beatId}`} className="es-skip" onClick={event => { event.preventDefault(); move(0); }}>Skip to {BOOK.name}’s first thought</a>
    <header className="tc-topbar"><Link href="/story" aria-label="Back to the story room"><ArrowLeft className="h-4 w-4" /><span>{BOOK.name}<span className="tc-topbar-description"> / a story in thoughts</span></span></Link><p className="tc-topbar-serial" aria-label={started ? `Moment ${moment.displaySerial} of ${MOMENTS.length}` : `${MOMENTS.length} story moments`}>{started ? `${String(moment.displaySerial).padStart(2, "0")} / ${MOMENTS.length}` : `${MOMENTS.length} moments`}</p><nav aria-label="Story controls"><button type="button" onClick={() => setDialog("chapters")}>Chapters</button>{storyFirst && <><span aria-current="page">Story</span><Link href={machineBookUrl(BOOK.slug, moment.chapterId, "comic")}>Comic</Link></>}<Link href={machineBookUrl(BOOK.slug, moment.chapterId, "book")}>{storyFirst ? "Book" : "Full book"}</Link></nav><div className="tc-total-progress" style={{ transform: `scaleX(${started ? moment.displaySerial / MOMENTS.length : 0})` }} aria-hidden="true" /></header>
    <motion.section ref={openingRef} className="es-opening tc-opening" aria-labelledby="tc-story-title" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.4 }}><motion.div className="es-opening-image" style={reduced ? undefined : { y: coverY }}><motion.div className="es-opening-entrance" initial={reduced ? false : { scale: 1.22, y: -36, filter: "blur(10px)" }} animate={{ scale: 1, y: 0, filter: "blur(0px)" }} transition={{ type: "spring" as const, stiffness: 55, damping: 14, mass: 1 }}><Image src={EDITION.cover.src} alt={EDITION.cover.alt} fill priority sizes="100vw" className="object-cover" /></motion.div></motion.div><div className="es-opening-shade" /><span className="tc-shooting tc-shooting-one" aria-hidden="true" /><span className="tc-shooting tc-shooting-two" aria-hidden="true" /><motion.div className="es-opening-copy" style={reduced ? undefined : { y: copyY }}><motion.p className="es-label" initial={reduced ? false : { opacity: 0, y: -48, rotate: -2, scale: 0.96, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }} transition={dropSpring(0.05)}>{EDITION.opening.kicker}</motion.p><TitleBurst title={EDITION.opening.title} emphasis={EDITION.opening.emphasis} reduced={!!reduced} /><motion.p initial={reduced ? false : { opacity: 0, y: -56, rotate: -1.2, scale: 0.97, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }} transition={dropSpring(0.3)}>{EDITION.opening.introduction}</motion.p><motion.p className="es-opening-invitation" initial={reduced ? false : { opacity: 0, y: -48, rotate: -1, scale: 0.97, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }} transition={dropSpring(0.42)}>{EDITION.opening.invitation}</motion.p></motion.div><motion.div className="es-opening-bottom" initial={reduced ? false : { opacity: 0, y: -52, scale: 0.97, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} transition={dropSpring(0.55)}><div>{storyFirst ? <nav className="tc-reading-formats" aria-label={`Choose how to read ${BOOK.name}’s story`}><a href={`#${MOMENTS[0].beatId}`} aria-current="page" onClick={event => { event.preventDefault(); move(0); }}>Scroll story <motion.span aria-hidden="true" animate={reduced ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>↓</motion.span></a><Link href={machineBookUrl(BOOK.slug, BOOK.chapters[0].id, "comic")}>Comic</Link><Link href={machineBookUrl(BOOK.slug, BOOK.chapters[0].id, "book")}>Book</Link></nav> : <a href={`#${MOMENTS[0].beatId}`} className="es-start" onClick={event => { event.preventDefault(); move(0); }}>Let’s begin <span aria-hidden="true">↓</span></a>}{resume !== null && <button type="button" className="es-resume" onClick={() => move(resume)}>Pick up at moment {String(resume + 1).padStart(2, "0")} ↗</button>}</div><p>{BOOK.chapters.length} true-event chapters.<br /><span>Imagined machine thoughts, grounded in mission records.</span></p></motion.div><motion.a className="es-opening-credit" href={EDITION.cover.source} target="_blank" rel="noopener noreferrer" initial={reduced ? false : { opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={dropSpring(0.7)}>{EDITION.cover.title} · {EDITION.cover.credit} ↗</motion.a></motion.section>
    <div className="tc-story-track" style={{ "--tc-moments": MOMENTS.length } as CSSProperties}>
      <ThoughtStage edition={EDITION} renderIllustration={renderIllustration} active={active} hasStarted={started && !atEnd} blocked={dialog !== null} onNotes={setDialog} onMove={move} reduced={!!reduced} />
      {MOMENTS.map((item, index) => <div key={item.beatId} id={item.beatId} className="tc-marker" style={{ top: `calc(${index} * var(--tc-step))` }} data-thought-marker data-index={index}>{item.beatSequence === 1 && <span id={item.chapterId} className="tc-legacy-anchor" />}<span id={item.legacyAnchor} className="tc-legacy-anchor" /><section className="sr-only" aria-label={`Moment ${item.displaySerial}: ${item.chapterTitle}`}><h3>{item.bubbleText}</h3><p>{item.detailText}</p></section></div>)}
    </div>
    <motion.section id="tc-ending" className="es-ending" initial={reduced ? false : { opacity: 0, y: -56, scale: 0.98, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.25 }} transition={dropSpring(0)}><motion.p className="es-label" initial={reduced ? false : { opacity: 0, y: -40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={dropSpring(0.05)}>{BOOK.name} / A story remembered</motion.p><motion.h2 initial={reduced ? false : { opacity: 0, y: -72, rotate: -1.4, scale: 0.96, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.25 }} transition={dropSpring(0.12)}>They never came back.<br /><em>So we bring their stories home.</em></motion.h2><motion.p initial={reduced ? false : { opacity: 0, y: -52, scale: 0.97, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.25 }} transition={dropSpring(0.2)}>{EDITION.ending}</motion.p><motion.div initial={reduced ? false : { opacity: 0, y: -44, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={dropSpring(0.3)}><Link href="/story">Find another story <ArrowRight className="h-4 w-4" /></Link><Link href={machineBookUrl(BOOK.slug, BOOK.chapters[0].id, "book")}>Read the full book</Link><button type="button" onClick={() => move(0)}>Start at the first thought ↑</button></motion.div><details className="tc-production-footer"><summary>Sources, words &amp; narration production</summary><p>Every cloud uses a line from {BOOK.name}’s existing story. “More to this moment” preserves the full explanation and source links. Illustrations and the machine’s first-person voice are interpretations; archival photographs carry their own credits.</p><p>Moment IDs stay matched to narration text and visual direction. The manifest identifies missing or outdated clips. Browser voice preview, when available, is synthetic; no produced narration is implied by an empty audio entry.</p><a href={EDITION.manifestUrl} download>Download the narration manifest ↗</a></details></motion.section>
    {dialog !== null && <ReaderDialog name={BOOK.name} title={dialog === "chapters" ? "Where shall we begin?" : MOMENTS[dialog].chapterTitle} onClose={() => setDialog(null)}>{dialog === "chapters" ? <ol className="tc-chapter-list">{BOOK.chapters.map((chapter, index) => <li key={chapter.id}><button type="button" onClick={() => move(MOMENTS.findIndex(item => item.chapterId === chapter.id))} aria-current={chapter.id === moment.chapterId ? "location" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><span><strong>{chapter.title}</strong><small>{EDITION.directions[chapter.id].date} · {chapter.beats.length} moments</small></span><ArrowRight className="h-4 w-4" /></button></li>)}</ol> : <MomentNotes moment={MOMENTS[dialog]} edition={EDITION} renderNotesExtras={renderNotesExtras} />}</ReaderDialog>}
  </div>;
}
