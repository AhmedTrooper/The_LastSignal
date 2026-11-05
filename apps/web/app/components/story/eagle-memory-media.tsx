"use client";

import Image from "next/image";
import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import type { EagleMemory } from "@/lib/eagle-story";
import { EAGLE_MEDIA } from "@/lib/eagle-media";
import { ArrowLeft, ArrowRight } from "@/app/components/icons";
import EagleMediaPlayer from "@/app/components/profile/eagle-media-player";

export default function EagleMemoryMedia({ memory, onPlay, pauseSignal = 0, view, onViewChange, mechanism, game, illustration, initialPhoto = 0 }: { memory: EagleMemory; onPlay: () => void; pauseSignal?: number; view: string; onViewChange: (view: string) => void; mechanism?: ReactNode; game?: ReactNode; illustration?: ReactNode; initialPhoto?: number }) {
  const choices = [
    ...(illustration ? [{ id: "illustration", label: "Illustrated memory" }] : []),
    ...(memory.photos.length ? [{ id: "photo", label: memory.photos.length > 1 ? "Photographs" : "Photograph" }] : []),
    ...memory.media.map(id => ({ id, label: id === "flight-director" ? "Mission Control" : EAGLE_MEDIA[id].kind === "video" ? "Onboard film" : "Original audio" })),
    ...(mechanism ? [{ id: "mechanism", label: "Hands on" }] : []),
    ...(game ? [{ id: "game", label: "Take the controls" }] : []),
  ];
  const [photoIndex, setPhotoIndex] = useState(initialPhoto);
  const id = useId();
  const picture = memory.photos[photoIndex];
  const select = (next: string) => onViewChange(next);
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === "ArrowRight" ? (index + 1) % choices.length : event.key === "ArrowLeft" ? (index + choices.length - 1) % choices.length : event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    select(choices[next].id);
    document.getElementById(`${id}-tab-${choices[next].id}`)?.focus();
  };
  if (!choices.length) return null;

  return (
    <div className="min-w-0">
      <div role="tablist" aria-label="Scene archive media" className="mb-3 flex flex-wrap gap-1.5">
        {choices.map((choice, index) => <button key={choice.id} id={`${id}-tab-${choice.id}`} type="button" role="tab" aria-selected={view === choice.id} aria-controls={`${id}-panel`} tabIndex={view === choice.id ? 0 : -1} onKeyDown={event => keyboard(event, index)} onClick={() => select(choice.id)} className={`eagle-media-tab ${view === choice.id ? "eagle-media-tab-active" : ""}`}>{choice.label}</button>)}
      </div>
      <div id={`${id}-panel`} role="tabpanel" tabIndex={0} aria-labelledby={`${id}-tab-${view}`} className="outline-offset-4">
        {view === "illustration" ? illustration : view === "game" ? game : view === "mechanism" ? mechanism : view === "photo" && picture ? (
          <figure className="overflow-hidden rounded-xl border border-white/15 bg-black">
            <div className="relative aspect-[16/10]">
              <Image key={picture.src} src={picture.src} alt={picture.alt} fill sizes="(min-width:1024px) 52vw, 100vw" className="object-contain" loading={memory.id === "undocking" ? "eager" : "lazy"} />
              <div className="pointer-events-none absolute inset-3 border border-white/15" aria-hidden="true"><span className="absolute -top-px -left-px h-4 w-4 border-t border-l border-white/70" /><span className="absolute -right-px -bottom-px h-4 w-4 border-r border-b border-white/70" /></div>
            </div>
            <figcaption className="border-t border-white/10 bg-[#10101a] p-4">
              <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] text-[#c1b4ff]">{picture.ai ? "AI-GENERATED PLACEHOLDER" : `${picture.title} · ${picture.credit}`}</p><p className="mt-1.5 text-xs leading-relaxed text-white/65">{picture.alt}</p></div><a href={picture.source} target="_blank" rel="noopener noreferrer" className="shrink-0 py-1 text-xs text-white/75 underline underline-offset-4">Source ↗</a></div>
              {memory.photos.length > 1 && <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2"><button type="button" aria-label="Previous photograph" disabled={photoIndex === 0} onClick={() => setPhotoIndex(i => i - 1)} className="eagle-utility disabled:opacity-35"><ArrowLeft className="h-4 w-4" /></button><span className="font-mono text-[10px] text-white/60">{photoIndex + 1} / {memory.photos.length}</span><button type="button" aria-label="Next photograph" disabled={photoIndex === memory.photos.length - 1} onClick={() => setPhotoIndex(i => i + 1)} className="eagle-utility disabled:opacity-35"><ArrowRight className="h-4 w-4" /></button></div>}
            </figcaption>
          </figure>
        ) : <EagleMediaPlayer key={view} media={EAGLE_MEDIA[view]} onPlay={onPlay} compact pauseSignal={pauseSignal} />}
      </div>
    </div>
  );
}
