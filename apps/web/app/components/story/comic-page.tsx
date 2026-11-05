"use client";

import Link from "next/link";
import type { BookSpread } from "@thelastsignal/data";
import { comicLines } from "@/lib/book-comic";
import ComicScene from "./comic-scene";
import { ArrowRight } from "@/app/components/icons";
import EagleLearningLens from "@/app/components/profile/eagle-learning-lens";

export default function ComicPage({ spread, side, page, onNotes }: { spread: BookSpread; side: "left" | "right"; page: number; onNotes: () => void }) {
  const lines = comicLines(spread, side);
  const machine = spread.id;
  const moon = /ranger|surveyor|apollo|lcross|grail/.test(machine);
  const heading = side === "left" ? spread.leftPage.heading : spread.rightPage.heading;
  const stages = side === "left" ? ["journey", "hardware"] as const : ["science", "legacy"] as const;
  return (
    <div className={`comic-page comic-page-${side}`}>
      <div className="comic-running-head"><span>{spread.machineName}</span><span>{spread.chapterNumber ? `CH. ${spread.chapterNumber}` : "ROVERVILLA"}</span></div>
      <h2 data-book-heading tabIndex={-1} className="comic-page-title outline-none">{heading ?? spread.spreadTitle}</h2>
      <div className="comic-panels">
        {lines.map((line, i) => <figure key={line} className={`comic-panel comic-panel-${i}`}>
          <span className="comic-caption">{side === "left" ? i === 0 ? "The journey begins…" : "A closer look" : i === 0 ? "What the hardware made possible" : "What stayed behind"}</span>
          <div className="comic-speech"><p>{line}</p><span aria-hidden="true" /></div>
          <ComicScene machine={machine} stage={stages[i]} moon={moon} />
          <figcaption className="sr-only">{spread.machineName}: {line} Original stylized illustration.</figcaption>
        </figure>)}
      </div>
      {spread.heroSlug === "apollo-11-lander" && <details className="mt-3 text-xs text-[#76528a]"><summary className="cursor-pointer py-2">What did this hardware make possible?</summary><EagleLearningLens memory={spread.id === "apollo-11-part-1" ? side === "left" ? "alarm" : "touchdown" : side === "left" ? "liftoff" : "science"} compact /></details>}
      <div className="comic-page-links"><button type="button" onClick={onNotes}>Open the field notes <ArrowRight className="h-3.5 w-3.5" /></button>{side === "right" && spread.heroSlug && <Link href={`/heroes/${spread.heroSlug}`}>Meet the machine ↗</Link>}</div>
      <footer className="comic-page-footer"><span>Imagined voice · Original SVG art</span><span>{page}</span></footer>
    </div>
  );
}
