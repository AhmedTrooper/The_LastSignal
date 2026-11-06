"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookIcon } from "@/app/components/icons";
import { SignalMark } from "@/app/components/logo";
import { useEagleFullscreen } from "@/app/components/profile/use-eagle-fullscreen";
import { useEagleVoice } from "@/app/components/profile/use-eagle-voice";
import { chapterParagraphs, MACHINE_BOOKMARK_KEY, machineBookUrl, readMachineBookmarks, resolveMachineReading, type MachineBook, type MachineBookmark, type ReadingFormat } from "@/lib/machine-books";
import { EAGLE_MEMORIES, type EagleTrigger } from "@/lib/eagle-story";
import BookContents from "./event-book-contents";
import ComicPage from "./event-comic-page";
import EagleMechanism from "./eagle-mechanism";
import EagleBookActivity from "./eagle-book-activity";

const MECHANISMS: Record<string, { kind: EagleTrigger; action: string }> = {
  undocking: { kind: "undock", action: "Separate the illustrated spacecraft" },
  alarm: { kind: "alarm", action: "See guidance take priority" },
  touchdown: { kind: "land", action: "Guide the approach toward clear ground" },
  "first-step": { kind: "camera", action: "Lower the MESA camera bay" },
  reflector: { kind: "laser", action: "Follow a laser pulse out and back" },
  breaker: { kind: "breaker", action: "Use the pen to push the damaged control in" },
  liftoff: { kind: "ascent", action: "Watch the two stages part" },
};

export default function MachineBookReader({ book, requestedChapter, requestedFormat }: { book: MachineBook; requestedChapter: string | null; requestedFormat: string | null }) {
  const [saved, setSaved] = useState<MachineBookmark>();
  const [ready, setReady] = useState(false);
  const [contents, setContents] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [explored, setExplored] = useState<string[]>([]);
  const { ref: reader, fullscreen, toggle } = useEagleFullscreen();
  const heading = useRef<HTMLHeadingElement>(null);
  const previousChapter = useRef<string | null>(null);
  const { index, format } = resolveMachineReading(book, requestedChapter, requestedFormat, saved);
  const chapter = book.chapters[index];
  const paragraphs = chapterParagraphs(chapter);
  const voice = useEagleVoice(`${book.slug}:${chapter.id}:${format}`);
  const stopVoice = voice.stop;
  const mechanism = book.slug === "apollo-11-lander" ? MECHANISMS[chapter.id] : undefined;
  const memory = book.slug === "apollo-11-lander" && chapter.memory !== "science" ? EAGLE_MEMORIES.find(item => item.id === chapter.memory) : undefined;

  useEffect(() => {
    let bookmark: MachineBookmark | undefined;
    try { bookmark = readMachineBookmarks(localStorage.getItem(MACHINE_BOOKMARK_KEY))[book.slug]; } catch { /* Reading works without storage. */ }
    const frame = requestAnimationFrame(() => { setSaved(bookmark); setReady(true); });
    return () => cancelAnimationFrame(frame);
  }, [book.slug]);

  useEffect(() => {
    if (!ready) return;
    try {
      const bookmarks = readMachineBookmarks(localStorage.getItem(MACHINE_BOOKMARK_KEY));
      bookmarks[book.slug] = { chapter: chapter.id, format };
      localStorage.setItem(MACHINE_BOOKMARK_KEY, JSON.stringify(bookmarks));
    } catch { /* Optional bookmark. */ }
    const changed = previousChapter.current !== null && previousChapter.current !== chapter.id;
    previousChapter.current = chapter.id;
    if (changed) {
      const frame = requestAnimationFrame(() => {
        heading.current?.focus({ preventScroll: true });
        heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [ready, book.slug, chapter.id, format]);

  const navigate = useCallback((next: number, nextFormat: ReadingFormat = format) => {
    const target = book.chapters[next];
    if (!target) return;
    stopVoice();
    setContents(false);
    window.history.pushState(null, "", machineBookUrl(book.slug, target.id, nextFormat));
  }, [book, format, stopVoice]);

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (!ready || contents || event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('input, textarea, select, button, a, summary, dialog, [contenteditable="true"], [role="slider"], [role="tablist"]')) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(index + (event.key === "ArrowRight" ? 1 : -1));
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [contents, index, navigate, ready]);

  if (!ready) return <main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening {book.name}’s book…</main>;
  return <div ref={reader} className={`storybook-reader nook-reader ${fullscreen ? "book-reader-fullscreen" : ""}`} style={{ "--book-font-scale": fontScale } as CSSProperties}>
    <header className="book-reader-header"><Link href="/heroes/apollo-11-lander/book" className="flex items-center gap-3"><SignalMark className="h-7 w-7" /><span className="text-sm">Eagle’s Book &amp; Comic Nook<span className="block text-xs text-[#c7bcd4]">Back to Eagle’s book</span></span></Link><div className="flex gap-2"><button type="button" className="book-reader-button" onClick={() => { voice.stop(); setContents(true); }}><BookIcon className="h-4 w-4" />Chapters</button><button type="button" data-fullscreen-toggle className="book-reader-button" aria-pressed={fullscreen} onClick={toggle}>{fullscreen ? "Exit focus" : "Focus mode"}</button></div></header>
    <main className="nook-reading-stage">
      <div className="nook-book-heading"><p className="nook-eyebrow">{book.name} / One life, {book.chapters.length} event chapters</p><p className="display text-2xl sm:text-3xl">{book.title}</p></div>
      <div className="nook-toolbar">
        <div role="group" aria-label="Reading format" className="nook-format">{(["comic", "book"] as const).map(mode => <button type="button" key={mode} aria-pressed={format === mode} onClick={() => { if (format !== mode) navigate(index, mode); }}>{mode === "comic" ? "Comic book" : "Storybook"}</button>)}</div>
        <div className="flex flex-wrap items-center gap-2"><div role="group" aria-label="Reading text size" className="flex"><button type="button" className="book-reader-button" aria-label="Decrease text size" disabled={fontScale <= 1} onClick={() => setFontScale(value => Math.max(1, value - 0.1))}>A−</button><button type="button" className="book-reader-button" aria-label="Increase text size" disabled={fontScale >= 1.4} onClick={() => setFontScale(value => Math.min(1.4, value + 0.1))}>A+</button></div><button type="button" className="book-reader-button" disabled={!voice.available} aria-pressed={voice.speaking} onClick={() => voice.speaking ? voice.stop() : voice.start(`${chapter.title}. ${paragraphs.join(" ")}`)}>{voice.speaking ? "Stop narration" : "Read aloud"}</button></div>
      </div>
      <p className="nook-voice-note">Imagined machine voice · {voice.available ? "Synthetic English narration" : "Read-aloud is unavailable in this browser"} · AI-assisted illustrations</p>
      <article className={`nook-chapter nook-chapter-${format}`} aria-labelledby="nook-chapter-title">
        <header className="nook-chapter-heading"><p className="nook-eyebrow">Chapter {index + 1} / {book.chapters.length} · A standalone true event</p><h1 ref={heading} tabIndex={-1} id="nook-chapter-title">{chapter.title}</h1><p>{chapter.event}</p></header>
        {format === "comic" ? <ComicPage book={book} chapter={chapter} /> : <div className="nook-prose-spread">{[0, 1].map(side => <section key={side} className="nook-prose-page" aria-label={`Story page ${side + 1}`}><div className="nook-running-head"><span>{book.name}</span><span>{side === 0 ? "The event" : "What happened next"}</span></div>{paragraphs.slice(side * 2, side * 2 + 2).map((paragraph, i) => <p key={i} className={side === 0 && i === 0 ? "nook-drop-cap" : undefined}>{paragraph}</p>)}<span className="nook-page-number">{index * 2 + side + 1}</span></section>)}</div>}
        <section className="nook-discovery" key={chapter.id} aria-label="The discovery"><p className="nook-eyebrow">What this machine helped us learn</p><p>{chapter.discovery}</p><details><summary>{chapter.question}</summary><p>Look for the connection between <strong>{chapter.hardware.toLowerCase()}</strong> and what happened in this event. Revisit the panels, then compare your explanation with the mission record.</p></details></section>
      </article>
      {mechanism && <div className="nook-mechanism"><EagleMechanism key={chapter.id} kind={mechanism.kind} action={mechanism.action} result={chapter.discovery} engaged={explored.includes(chapter.id)} onEngage={() => setExplored(previous => previous.includes(chapter.id) ? previous : [...previous, chapter.id])} /></div>}
      {!mechanism && <EagleBookActivity key={chapter.id} chapter={chapter.id} />}
      <details className="nook-source" key={`source-${chapter.id}`}><summary>Open the mission record</summary><dl><div><dt>Documented event</dt><dd>{chapter.event}</dd></div><div><dt>Hardware</dt><dd>{chapter.hardware}</dd></div>{memory?.telemetry.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl><a href={chapter.source} target="_blank" rel="noopener noreferrer">Read the source: {new URL(chapter.source).hostname} ↗</a>{chapter.relatedSources?.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}{memory && <a href={memory.source} target="_blank" rel="noopener noreferrer">Event telemetry and context ↗</a>}<p>First-person storytelling is an imagined retelling of the linked record, not an original transmission. Artwork is illustrative, not to scale.</p></details>
      <nav className="nook-chapter-nav" aria-label="Chapter navigation"><button type="button" className="book-reader-button" disabled={index === 0} onClick={() => navigate(index - 1)}><ArrowLeft className="h-4 w-4" />Previous chapter</button><span role="status">{index + 1} / {book.chapters.length}</span>{index < book.chapters.length - 1 ? <button type="button" className="book-reader-button book-reader-button-primary" onClick={() => navigate(index + 1)}>Next chapter<ArrowRight className="h-4 w-4" /></button> : <Link className="book-reader-button book-reader-button-primary" href="/heroes/apollo-11-lander/book">Back to Eagle’s book<ArrowRight className="h-4 w-4" /></Link>}</nav>
      <div className="nook-reader-footer"><Link href={`/heroes/${book.slug}`}>Explore {book.name}’s hardware and mission ↗</Link><p>Chapter and format are bookmarked when browser storage is available.</p></div>
    </main>
    {contents && <BookContents book={book} current={index} onSelect={next => navigate(next)} onClose={() => setContents(false)} />}
  </div>;
}
