"use client";

import Image from "next/image";
import { useState } from "react";
import { GRAIL_PHOTOS } from "@/lib/grail-media";
import { GRAIL_SOURCES as S } from "@/lib/grail-sources";
import { GRAIL_INVESTIGATIONS, GRAIL_MASCON, GRAIL_BURN, grailMasconStep, grailBurnStep, type GrailMasconState, type GrailBurnState } from "@/lib/grail-activities";
import GrailIllustration from "./grail-illustration";

const IMAGES: Record<string, (keyof typeof GRAIL_PHOTOS)[]> = {
  "a-long-way-to-the-moon": ["cover"], "cosmic-tag": ["science"], "lower-and-sharper": [],
  "the-x-ray-moon": ["gravity", "porosity"], "a-place-named-for-sally": ["target", "flightPath", "restingSpot"],
};

function MasconActivity() {
  const [state, setState] = useState<GrailMasconState>("approach");
  const item = GRAIL_MASCON[state];
  return <section className="grail-activity"><p className="tc-eyebrow">Try the measurement idea</p><h3>Fly over a hidden mass.</h3><GrailIllustration scene={item.scene} /><div role="group" aria-label="Explore the tandem measurement"><button type="button" disabled={state !== "approach"} onClick={() => setState(value => grailMasconStep(value, "approach"))}>Approach the mass</button><button type="button" disabled={state !== "stretch"} onClick={() => setState(value => grailMasconStep(value, "pass"))}>Pass the mass</button><button type="button" onClick={() => setState("approach")}>Start again</button></div><p role="status" aria-live="polite">{item.explanation} The drawing’s gap is exaggerated; it is not a measured separation.</p><a href={S.registryA.url} target="_blank" rel="noopener noreferrer">Check LGRS range-rate in the catalog ↗</a></section>;
}

function BurnActivity() {
  const [state, setState] = useState<GrailBurnState>("orbit");
  const item = GRAIL_BURN[state];
  return <section className="grail-activity"><p className="tc-eyebrow">Sequence matters</p><h3>Help the twins finish the fuel experiment.</h3><GrailIllustration scene={item.scene} /><div role="group" aria-label="Explore the final burn sequence"><button type="button" disabled={state !== "orbit"} onClick={() => setState(value => grailBurnStep(value, "burn"))}>Start the burn</button><button type="button" disabled={state !== "burning"} onClick={() => setState(value => grailBurnStep(value, "deplete"))}>Burn until empty</button><button type="button" disabled={state !== "empty"} onClick={() => setState(value => grailBurnStep(value, "impact"))}>Impact</button><button type="button" onClick={() => setState("orbit")}>Start again</button></div><p role="status" aria-live="polite">{item.explanation}</p><a href={S.impact.url} target="_blank" rel="noopener noreferrer">Read NASA’s fuel-burn report ↗</a></section>;
}

export default function GrailChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState(0);
  const question = GRAIL_INVESTIGATIONS[chapter];
  const item = question?.options[selected];
  return <div className="grail-extras">
    {question && item && <section className="grail-activity"><p className="tc-eyebrow">Look closer</p><h3>{question.title}</h3><GrailIllustration scene={item.scene} /><div role="group" aria-label={question.title}>{question.options.map((choice, index) => <button type="button" key={choice.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{choice.label}</button>)}</div><p role="status" aria-live="polite">{item.explanation}</p><a href={question.source} target="_blank" rel="noopener noreferrer">Inspect the source record ↗</a></section>}
    {chapter === "cosmic-tag" && <MasconActivity />}
    {chapter === "a-place-named-for-sally" && <BurnActivity />}
    <p className="grail-teaching-note">Teaching drawings and controls, not live commands, measured signals or fuel telemetry.</p>
    {(IMAGES[chapter] ?? []).map(key => { const photo = GRAIL_PHOTOS[key]; return <figure key={key} className="grail-archive"><p className="tc-eyebrow">Source media · {photo.name}</p><div className="grail-photo-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Source and original ↗</a></figcaption></figure>; })}
    {chapter === "the-x-ray-moon" && <a href={S.impactSites.url} target="_blank" rel="noopener noreferrer">Open NASA’s GRAIL impact-sites resource ↗</a>}
    {chapter === "a-place-named-for-sally" && <a href={S.lrocCrater.url} target="_blank" rel="noopener noreferrer">Inspect LROC’s impact-crater caption ↗</a>}
    <a href="/api/stories/grail/evidence" download>Download GRAIL’s sources, facts and story JSON ↗</a>
  </div>;
}
