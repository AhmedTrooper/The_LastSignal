"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { img } from "@/lib/heroes";
import { Close } from "@/app/components/icons";

/** Thumbnail grid with a keyboard-friendly lightbox. */
export default function Gallery({ images, name, columns = "grid-cols-2 sm:grid-cols-3" }: { images: string[]; name: string; columns?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <>
      <div className={`grid gap-2 ${columns}`}>
        {images.map((src, i) => (
          <button key={src + i} onClick={() => setOpen(i)} className="group relative aspect-[3/2] overflow-hidden rounded-lg bg-mist">
            <Image src={img(src)} alt={`${name}, image ${i + 1} (AI placeholder)`} fill sizes="(min-width:1024px) 15vw, 45vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`${name} gallery`} className="fixed inset-0 z-[60] flex items-center justify-center bg-night/90 p-4 backdrop-blur" onClick={() => setOpen(null)}>
          <button className="absolute top-4 right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Close" autoFocus>
            <Close />
          </button>
          <figure className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={img(images[open])} alt="" fill sizes="100vw" className="object-contain" />
            <figcaption className="absolute -bottom-8 left-0 font-mono text-xs text-white/70">
              {open + 1} / {images.length} · AI-generated placeholder, to be replaced with a credited archive photo
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
