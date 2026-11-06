"use client";

import { useState } from "react";
import Image from "next/image";
import { EAGLE_MEMORIES } from "@/lib/eagle-story";

/** Small, untimed activities for the events without a flight-mechanism animation. */
export default function EagleBookActivity({ chapter }: { chapter: string }) {
  const [revealed, setRevealed] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  if (chapter === "first-vibrations") return <section className="nook-activity" aria-labelledby="eagle-activity-title">
    <p className="nook-eyebrow">Your turn / Ground motion</p><h2 id="eagle-activity-title">What should the seismic package measure?</h2>
    <svg viewBox="0 0 600 160" role="img" aria-label="Simplified seismic sensor resting on lunar ground"><path d="M20 124h560" stroke="#b6aecb" strokeWidth="2" /><rect x="260" y="40" width="80" height="84" rx="6" fill="#c9b37f" /><path d="M260 54l-92 10v44l92-10m80-44 92 10v44l-92-10" fill="#8192ab" stroke="#d5c6ff" strokeWidth="2" />{choice === "ground" && <path d="M35 141h95l10-9 12 17 17-26 18 32 16-18 12 4h350" stroke="#dcc8f4" strokeWidth="3" fill="none" />}</svg>
    <div role="group" aria-label="Choose what a seismometer measures" className="flex flex-wrap gap-3"><button type="button" className="book-reader-button" aria-pressed={choice === "ground"} onClick={() => setChoice("ground")}>Movement through the ground</button><button type="button" className="book-reader-button" aria-pressed={choice === "air"} onClick={() => setChoice("air")}>Sound through the air</button></div>
    <div role="status">{choice && <p>{choice === "ground" ? "Yes. A seismometer measures ground motion. Knowing when the crew moved nearby helped scientists interpret the signals." : "That is how a microphone usually listens. A seismometer responds to motion of the ground beneath it. Try the other choice."}</p>}</div><p className="nook-activity-note">AI-assisted diagram and illustrative wave · Not a recorded moonquake.</p>
  </section>;
  if (chapter === "solar-wind") return <section className="nook-activity" aria-labelledby="eagle-activity-title">
    <p className="nook-eyebrow">Your turn / Returning the evidence</p><h2 id="eagle-activity-title">The collector or the whole experiment?</h2>
    <svg viewBox="0 0 600 190" role="img" aria-label={revealed ? "Collector foil packed for return; supporting staff stays on the Moon" : "Collector foil unrolled on its supporting staff"}><path d="M20 169h290m-130 0V30" stroke="#b6aecb" strokeWidth="4" />{!revealed && <><path d="M180 35h120v96H180z" fill="#d9dce4" stroke="#91859c" strokeWidth="3" />{[48, 78, 108].map(y => <path key={y} d={`M90 ${y}h77m-9-5 9 5-9 5`} stroke="#e6cb8b" strokeWidth="3" fill="none" />)}</>}<rect x="392" y="97" width="146" height="65" rx="8" fill="#59476d" stroke="#c9b5de" strokeWidth="2" />{revealed && <path d="M416 118h100v22H416z" fill="#d9dce4" />}<text x="115" y="186" fill="#ded1ea" fontSize="12">Lunar surface</text><text x="395" y="186" fill="#ded1ea" fontSize="12">Return-sample container</text></svg>
    <button type="button" className="book-reader-button" onClick={() => setRevealed(value => !value)}>{revealed ? "Unroll the illustrated collector again" : "Pack the foil for the trip home"}</button><div role="status">{revealed && <p>The foil carried trapped solar-wind material to laboratories on Earth. The supporting staff stayed on the Moon. One experiment, two different destinations.</p>}</div><p className="nook-activity-note">AI-assisted diagram · A simplified explanation, not a reconstruction of the packing procedure.</p>
  </section>;
  if (chapter === "seen-again") {
    const image = EAGLE_MEMORIES.find(memory => memory.id === "monument")?.photo;
    if (!image) return null;
    return <section className="nook-activity" aria-labelledby="eagle-activity-title"><p className="nook-eyebrow">Your turn / Inspect the evidence</p><h2 id="eagle-activity-title">Trade the drawing for an orbital photograph.</h2><button type="button" className="book-reader-button" aria-expanded={revealed} onClick={() => setRevealed(value => !value)}>{revealed ? "Close the archive image" : "Open LRO’s archived view"}</button>{revealed && <figure className="mt-5"><div className="relative aspect-square max-w-xl"><Image src={image.src} alt={image.alt} fill sizes="(min-width:640px) 576px, 90vw" className="object-contain" /></div><figcaption className="mt-3 text-sm leading-relaxed"><a href={image.source} target="_blank" rel="noopener noreferrer">{image.title} · {image.credit} ↗</a><p>This is a later observation of the landing site. Look for the hardware and shadows, then compare this viewpoint with the illustrated scenes.</p></figcaption></figure>}</section>;
  }
  return null;
}
