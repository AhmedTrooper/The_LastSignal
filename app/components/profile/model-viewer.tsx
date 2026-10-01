"use client";

import Image from "next/image";
import { useState } from "react";
import type { Hero } from "@/lib/heroes";

/**
 * Labelled parts over the machine's portrait. Zoom and label toggles are real; a true
 * rotatable 3D model replaces this once a public-domain mesh is wired in.
 */
export default function ModelViewer({ image, parts = [] }: { image: string; parts?: NonNullable<Hero["parts"]> }) {
  const [zoom, setZoom] = useState(false);
  const [labels, setLabels] = useState(true);
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist">
        <div className={`absolute inset-0 transition-transform duration-700 ${zoom ? "scale-150" : ""}`} style={{ transformOrigin: focus ? `${parts.find((p) => p.label === focus)?.x}% ${parts.find((p) => p.label === focus)?.y}%` : "50% 50%" }}>
          <Image src={image} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          {labels &&
            parts.map((p) => (
              <button
                key={p.label}
                onClick={() => setFocus(focus === p.label ? null : p.label)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-pressed={focus === p.label}
              >
                <span className={`block h-3.5 w-3.5 rounded-full border-2 border-white bg-violet shadow ${focus === p.label ? "ring-4 ring-violet/40" : ""}`} />
                <span
                  className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white/90 px-2 py-1 font-mono text-[11px] text-violet shadow-sm sm:text-xs ${
                    p.side === "left" ? "right-6" : "left-6"
                  }`}
                >
                  {p.label}
                </span>
              </button>
            ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => setZoom(!zoom)}
          aria-pressed={zoom}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${zoom ? "bg-violet text-white" : "border border-line hover:border-violet"}`}
        >
          {zoom ? "Zoom out" : "Zoom"}
        </button>
        {parts.length > 0 && (
          <button
            onClick={() => setLabels(!labels)}
            aria-pressed={labels}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${labels ? "bg-violet text-white" : "border border-line hover:border-violet"}`}
          >
            Labels
          </button>
        )}
        <span className="self-center font-mono text-xs text-ink-soft">Interactive 3D coming soon</span>
      </div>
    </div>
  );
}
