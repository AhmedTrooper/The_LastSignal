"use client";

import { useEffect, useRef, useState } from "react";
import { SPREADS, TOC_ITEMS } from "@thelastsignal/data";
import { chapterTitle } from "@/lib/book-reader";
import { Close, ArrowRight } from "@/app/components/icons";

export default function BookContents({ current, onSelect, onClose }: { current: number; onSelect: (spread: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const items = TOC_ITEMS.filter(item => `${item.title} ${item.machine}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  return (
    <dialog ref={dialog} aria-labelledby="book-contents-title" className="book-contents-dialog" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="book-contents-inner">
        <div className="flex items-start justify-between gap-4"><div><p className="book-kicker">Find your next story</p><h2 id="book-contents-title" className="display mt-2 text-3xl">Inside the book.</h2></div><button type="button" onClick={onClose} aria-label="Close chapters" className="book-control"><Close className="h-4 w-4" /></button></div>
        <label className="mt-6 block"><span className="sr-only">Search chapters or machines</span><input autoFocus type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a machine or chapter…" className="w-full rounded-xl border border-[#d9d1c3] bg-white px-4 py-3 text-sm outline-offset-4" /></label>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {items.map(item => <button type="button" key={item.spread} onClick={() => onSelect(item.spread)} aria-current={item.spread === current ? "page" : undefined} className={`book-chapter-entry ${item.spread === current ? "is-current" : ""}`}><span className="font-mono text-[10px] uppercase tracking-wider text-[#746857]">{SPREADS[item.spread].chapterNumber ? `Chapter ${SPREADS[item.spread].chapterNumber}` : item.machine}</span><span className="mt-2 block text-sm font-semibold leading-relaxed">{chapterTitle(item.title)}</span><span className="mt-3 flex items-center justify-between font-mono text-[10px] text-[#776653]"><span>PAGE {item.page}</span><ArrowRight className="h-3.5 w-3.5" /></span></button>)}
        </div>
        {!items.length && <p role="status" className="py-10 text-center text-sm text-[#746857]">No chapters match. Try a machine’s name.</p>}
      </div>
    </dialog>
  );
}
