"use client";

import Image from "next/image";
import { useState } from "react";
import { MPL_PHOTOS } from "@/lib/mpl-media";
import { MPL_SOURCES as S } from "@/lib/mpl-sources";
import { MPL_INVESTIGATIONS, MPL_LATCH, MPL_TELEMETRY, mplLatchStep, mplTelemetryStep, type MplLatchState, type MplTelemetryState } from "@/lib/mpl-activities";
import MplIllustration from "./mpl-illustration";

const IMAGES: Record<string, (keyof typeof MPL_PHOTOS)[]> = {
  "carrying-names-and-a-microphone": ["cover"], "amundsen-and-scott": [],
  "the-fatal-latch": [], "searching-the-ice": ["site", "search", "scale"], "lessons-and-phoenix": ["map"],
};

function LatchActivity() {
  const [state, setState] = useState<MplLatchState>("descent");
  const item = MPL_LATCH[state];
  return <section className="mpl-activity"><p className="tc-eyebrow">Patch the sequence</p><h3>Clear the deployment signal in time.</h3><MplIllustration scene={item.scene} /><div role="group" aria-label="Explore the sensor sequence"><button type="button" disabled={state !== "descent"} onClick={() => setState(value => mplLatchStep(value, "deploy"))}>Deploy the legs</button><button type="button" disabled={state !== "deployed"} onClick={() => setState(value => mplLatchStep(value, "latch"))}>Latch the transient</button><button type="button" disabled={state !== "latched"} onClick={() => setState(value => mplLatchStep(value, "clear"))}>Clear before touchdown check</button><button type="button" onClick={() => setState("descent")}>Start again</button></div><p role="status" aria-live="polite">{item.explanation} This is a teaching sequence, not executable flight software.</p><a href={S.hallLesson.url} target="_blank" rel="noopener noreferrer">Read the NASA lesson on the sensor transient ↗</a></section>;
}

function TelemetryActivity() {
  const [state, setState] = useState<MplTelemetryState>("silent");
  const item = MPL_TELEMETRY[state];
  return <section className="mpl-activity"><p className="tc-eyebrow">Observability matters</p><h3>Keep the descent visible.</h3><MplIllustration scene={item.scene} /><div role="group" aria-label="Explore the descent telemetry sequence"><button type="button" disabled={state !== "silent"} onClick={() => setState(value => mplTelemetryStep(value, "enable"))}>Enable live tones</button><button type="button" disabled={state !== "heartbeat"} onClick={() => setState(value => mplTelemetryStep(value, "descend"))}>Descend with telemetry</button><button type="button" onClick={() => setState("silent")}>Start again</button></div><p role="status" aria-live="polite">{item.explanation}</p><a href={S.mission.url} target="_blank" rel="noopener noreferrer">Check NASA’s mission timeline ↗</a></section>;
}

export default function MplChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState(0);
  const question = MPL_INVESTIGATIONS[chapter];
  const item = question?.options[selected];
  return <div className="mpl-extras">
    {question && item && <section className="mpl-activity"><p className="tc-eyebrow">Look closer</p><h3>{question.title}</h3><MplIllustration scene={item.scene} /><div role="group" aria-label={question.title}>{question.options.map((choice, index) => <button type="button" key={choice.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{choice.label}</button>)}</div><p role="status" aria-live="polite">{item.explanation}</p><a href={question.source} target="_blank" rel="noopener noreferrer">Inspect the source record ↗</a></section>}
    {chapter === "the-fatal-latch" && <LatchActivity />}
    {chapter === "lessons-and-phoenix" && <TelemetryActivity />}
    <p className="mpl-teaching-note">Teaching drawings and controls, not recovered telemetry, executable procedures or a found-spacecraft claim.</p>
    {(IMAGES[chapter] ?? []).map(key => { const photo = MPL_PHOTOS[key]; return <figure key={key} className="mpl-archive"><p className="tc-eyebrow">Source media · {photo.name}</p><div className="mpl-photo-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Source and original ↗</a></figcaption></figure>; })}
    {chapter === "searching-the-ice" && <a href={S.searchMosaic.url} target="_blank" rel="noopener noreferrer">Inspect the MGS search mosaic record ↗</a>}
    {chapter === "lessons-and-phoenix" && <a href={S.failureReview.url} target="_blank" rel="noopener noreferrer">Read the JPL Special Review Board report ↗</a>}
    <a href="/api/stories/mars-polar-lander/evidence" download>Download Mars Polar Lander’s sources, facts and story JSON ↗</a>
  </div>;
}
