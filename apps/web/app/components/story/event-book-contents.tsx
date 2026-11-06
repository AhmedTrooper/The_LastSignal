"use client";

import { useEffect, useRef, useState } from "react";
import type { MachineBook } from "@/lib/machine-books";
import { Close, ArrowRight } from "@/app/components/icons";

export default function EventBookContents({ book, current, onSelect, onClose }: { book: MachineBook; current: number; onSelect: (chapter: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const items = book.chapters.map((chapter, index) => ({ chapter, index })).filter(({ chapter }) => `${chapter.title} ${chapter.event} ${chapter.hardware} ${chapter.beats.map(beat => beat.detail).join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    search.current?.focus();
    const overflow = document.body.style.overflow;
    // Focus mode already owns the scroll lock; do not restore its stale lock on exit.
    const ownsScrollLock = overflow !== "hidden";
    if (ownsScrollLock) document.body.style.overflow = "hidden";
    return () => { element?.close(); if (ownsScrollLock) document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} aria-labelledby="book-contents-title" className="book-contents-dialog" onKeyDown={event => { if (event.key === "Escape") event.stopPropagation(); }} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="book-contents-inner">
      <div className="flex items-start justify-between gap-4"><div><p className="book-kicker">{book.name} / Every chapter stands alone</p><h2 id="book-contents-title" className="display mt-2 text-3xl">{book.title}</h2></div><button type="button" onClick={onClose} aria-label="Close chapters" className="book-control"><Close className="h-4 w-4" /></button></div>
      <label className="mt-6 block"><span className="sr-only">Search chapters</span><input ref={search} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find an event…" className="w-full rounded-xl border border-[#d9d1c3] bg-white px-4 py-3 text-sm outline-offset-4" /></label>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">{items.map(({ chapter, index }) => <button type="button" key={chapter.id} onClick={() => onSelect(index)} aria-current={index === current ? "page" : undefined} className={`book-chapter-entry ${index === current ? "is-current" : ""}`}><span className="book-kicker">Chapter {index + 1}</span><span className="mt-2 block text-sm font-semibold leading-relaxed">{chapter.title}</span><span className="mt-2 block text-xs leading-relaxed text-[#675747]">{chapter.event}</span><span className="mt-3 flex items-center justify-between text-xs">{index === current ? "Reading now" : "Read this event"}<ArrowRight className="h-4 w-4" /></span></button>)}</div>
      {!items.length && <p role="status" className="py-10 text-center text-sm">No chapters match. Try another event.</p>}
    </div>
  </dialog>;
}
