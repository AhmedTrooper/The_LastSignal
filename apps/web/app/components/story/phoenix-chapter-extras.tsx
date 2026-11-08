"use client";

import Image from "next/image";
import { useState } from "react";
import { PHOENIX_PHOTOS } from "@/lib/phoenix-media";
import { PHOENIX_SOURCES as S } from "@/lib/phoenix-sources";
import { PHOENIX_INVESTIGATIONS, PHOENIX_TRENCH, PHOENIX_WINTER, phoenixTrenchStep, phoenixWinterStep, type PhoenixTrenchState, type PhoenixWinterState } from "@/lib/phoenix-activities";
import PhoenixIllustration from "./phoenix-illustration";

const IMAGES: Record<string, (keyof typeof PHOENIX_PHOTOS)[]> = {
  "risen-from-the-ashes": ["parachute"], "holy-cow-and-vanishing-ice": ["sublimation", "panorama"],
  "tasting-the-water": [], "friendly-soil-and-laser-snow": [], "a-winter-farewell": ["afterWinter"],
};

function TrenchActivity() {
  const [state, setState] = useState<PhoenixTrenchState>("sol20");
  const item = PHOENIX_TRENCH[state];
  return <section className="phoenix-activity"><p className="tc-eyebrow">Compare the same trench</p><h3>Watch the material change.</h3><PhoenixIllustration scene={item.scene} /><div role="group" aria-label="Compare the trench"><button type="button" disabled={state !== "sol20"} onClick={() => setState(value => phoenixTrenchStep(value, "compare"))}>Compare four days later</button><button type="button" onClick={() => setState("sol20")}>Start again</button></div><p role="status" aria-live="polite">{item.explanation}</p><a href={S.mission.url} target="_blank" rel="noopener noreferrer">Check NASA’s trench conclusion ↗</a></section>;
}

function WinterActivity() {
  const [state, setState] = useState<PhoenixWinterState>("summer");
  const item = PHOENIX_WINTER[state];
  return <section className="phoenix-activity"><p className="tc-eyebrow">Season changes everything</p><h3>Follow the season, not just the lander.</h3><PhoenixIllustration scene={item.scene} /><div role="group" aria-label="Explore the seasonal sequence"><button type="button" disabled={state !== "summer"} onClick={() => setState(value => phoenixWinterStep(value, "darken"))}>Enter winter darkness</button><button type="button" disabled={state !== "dark"} onClick={() => setState(value => phoenixWinterStep(value, "return"))}>Return in spring</button><button type="button" onClick={() => setState("summer")}>Start again</button></div><p role="status" aria-live="polite">{item.explanation}</p><a href={S.afterWinter.url} target="_blank" rel="noopener noreferrer">Read HiRISE’s winter interpretation ↗</a></section>;
}

export default function PhoenixChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState(0);
  const question = PHOENIX_INVESTIGATIONS[chapter];
  const item = question?.options[selected];
  return <div className="phoenix-extras">
    {question && item && <section className="phoenix-activity"><p className="tc-eyebrow">Look closer</p><h3>{question.title}</h3><PhoenixIllustration scene={item.scene} /><div role="group" aria-label={question.title}>{question.options.map((choice, index) => <button type="button" key={choice.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{choice.label}</button>)}</div><p role="status" aria-live="polite">{item.explanation}</p><a href={question.source} target="_blank" rel="noopener noreferrer">Inspect the source record ↗</a></section>}
    {chapter === "holy-cow-and-vanishing-ice" && <TrenchActivity />}
    {chapter === "a-winter-farewell" && <WinterActivity />}
    <p className="phoenix-teaching-note">Teaching drawings and controls, not recovered telemetry, laboratory traces or live commands.</p>
    {(IMAGES[chapter] ?? []).map(key => { const photo = PHOENIX_PHOTOS[key]; return <figure key={key} className="phoenix-archive"><p className="tc-eyebrow">Source media · {photo.name}</p><div className="phoenix-photo-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Source and original ↗</a></figcaption></figure>; })}
    {chapter === "risen-from-the-ashes" && <a href={S.descent.url} target="_blank" rel="noopener noreferrer">Read HiRISE’s descent caption and geometry ↗</a>}
    {chapter === "a-winter-farewell" && <a href={S.visions.url} target="_blank" rel="noopener noreferrer">Inspect the Visions of Mars archive description ↗</a>}
    <a href="/api/stories/phoenix/evidence" download>Download Phoenix’s sources, facts and story JSON ↗</a>
  </div>;
}
