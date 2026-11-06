"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/photos";
import { ArrowLeft, ArrowRight, Close } from "@/app/components/icons";

function PhotoViewer({ items, name, index, onChange, onClose }: { items: Photo[]; name: string; index: number; onChange: (index: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const picture = items[index];
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const ownsLock = overflow !== "hidden";
    node?.showModal();
    if (ownsLock) document.body.style.overflow = "hidden";
    return () => { node?.close(); if (ownsLock) document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  const previous = () => onChange((index - 1 + items.length) % items.length);
  const next = () => onChange((index + 1) % items.length);
  return <dialog ref={dialog} className="club-photo-dialog" aria-labelledby="club-photo-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); event.stopPropagation(); if (event.key === "ArrowRight") next(); else previous(); } if (event.key === "Escape") event.stopPropagation(); }}>
    <header><div><p className="club-kicker">{name}’s photo album</p><h2 id="club-photo-title">{picture.ai ? "An imagined view" : picture.title}</h2></div><button type="button" aria-label="Close photo" onClick={onClose}><Close /></button></header>
    <figure><div className="club-photo-frame"><Image src={picture.src} alt={picture.ai ? `${name}, AI-generated illustration` : picture.alt} fill sizes="(min-width:1024px) 85vw, 95vw" className="object-contain" /></div><figcaption>{picture.ai ? "AI-generated illustration, not a mission photograph." : <><p>{picture.alt}</p><a href={picture.source} target="_blank" rel="noopener noreferrer">{picture.credit} · Open the original source ↗</a></>}</figcaption></figure>
    <nav aria-label="Photo navigation"><button type="button" onClick={previous} disabled={items.length < 2}><ArrowLeft className="h-4 w-4" />Previous</button><span role="status">{index + 1} / {items.length}</span><button type="button" onClick={next} disabled={items.length < 2}>Next<ArrowRight className="h-4 w-4" /></button></nav>
  </dialog>;
}

export default function Gallery({ items, name, columns = "grid-cols-2 sm:grid-cols-3" }: { items: Photo[]; name: string; columns?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return <><div className={`club-photo-grid grid gap-3 ${columns}`}>{items.map((picture, index) => <button key={`${picture.name}-${index}`} type="button" onClick={() => setOpen(index)} className="club-photo-tile" aria-label={`Open ${picture.ai ? `${name}, image ${index + 1} (AI illustration)` : picture.title}`}><span className="club-photo-thumb"><Image src={picture.src} alt={picture.ai ? `${name}, AI-generated illustration` : picture.alt} fill sizes="(min-width:1024px) 25vw, 45vw" className="object-cover" /></span><span className="club-photo-tile-caption">{picture.ai ? "AI illustration" : picture.title}<span aria-hidden="true">↗</span></span></button>)}</div>{open !== null && <PhotoViewer items={items} name={name} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}</>;
}
