"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { VIKING_TWO_PHOTOS } from "@/lib/viking-two-media";
import { VIKING_TWO_SOURCES as S } from "@/lib/viking-two-sources";
import { VIKING_TWO_INVESTIGATIONS, VIKING_TWO_RELAY, vikingTwoRelayStep, type VikingTwoRelayState } from "@/lib/viking-two-activities";
import VikingTwoIllustration from "./viking-two-illustration";

const IMAGES: Record<string, (keyof typeof VIKING_TWO_PHOTOS)[]> = {
  "a-leaning-arrival": ["color"], "beneath-mister-badger": ["rock"],
  "ears-that-heard-the-wind": [], "a-winter-postcard": ["frost", "summer"], "a-relay-and-a-resting-place": ["cover"],
};

function FrostActivity() {
  const id = useId();
  const [reveal, setReveal] = useState(0);
  return <section className="viking-activity"><p className="tc-eyebrow">Compare the appearance</p><h3>Bring an illustrated coating into view.</h3><VikingTwoIllustration scene="frost" reveal={reveal} /><label htmlFor={`${id}-frost`}>Reveal the teaching frost drawing</label><input id={`${id}-frost`} type="range" min="0" max="100" step="10" value={reveal} aria-valuetext={`${reveal}% of the drawing revealed; not measured temperature or ice thickness`} onChange={event => setReveal(Number(event.target.value))} /><div role="group" aria-label="Reveal the frost drawing"><button type="button" onClick={() => setReveal(100)}>Reveal the coating</button><button type="button" onClick={() => setReveal(0)}>Reset the drawing</button></div><p role="status" aria-live="polite">{reveal === 0 ? "Use the slider’s arrow keys or the reveal button. This drawing changes the appearance, not the temperature of a real Mars site." : "A lighter coating changes the visible scene. The original photograph and its proposed explanation are separate below; the slider does not measure its composition or depth."}</p></section>;
}

function RelayActivity() {
  const [state, setState] = useState<VikingTwoRelayState>("empty");
  const item = VIKING_TWO_RELAY[state];
  return <section className="viking-activity"><p className="tc-eyebrow">Every link has a job</p><h3>Help a postcard reach Earth.</h3><VikingTwoIllustration scene={item.scene} /><div role="group" aria-label="Explore the relay chain"><button type="button" disabled={state !== "empty"} onClick={() => setState(value => vikingTwoRelayStep(value, "store"))}>Store the observation</button><button type="button" disabled={state !== "stored"} onClick={() => setState(value => vikingTwoRelayStep(value, "pass"))}>Pass it to the orbiter</button><button type="button" disabled={state !== "at-orbiter"} onClick={() => setState(value => vikingTwoRelayStep(value, "forward"))}>Relay it to Earth</button><button type="button" onClick={() => setState("empty")}>Start again</button></div><p role="status" aria-live="polite">{item.explanation}</p><a href={S.frost.url} target="_blank" rel="noopener noreferrer">Check the real frost image’s relay dates ↗</a></section>;
}

export default function VikingTwoChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState(0);
  const question = VIKING_TWO_INVESTIGATIONS[chapter];
  const item = question?.options[selected];
  return <div className="viking-extras viking-two-extras">
    {question && item && <section className="viking-activity"><p className="tc-eyebrow">Look closer</p><h3>{question.title}</h3><VikingTwoIllustration scene={item.scene} /><div role="group" aria-label={question.title}>{question.options.map((choice, index) => <button type="button" key={choice.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{choice.label}</button>)}</div><p role="status" aria-live="polite">{item.explanation}</p><a href={question.source} target="_blank" rel="noopener noreferrer">Inspect the source record ↗</a></section>}
    {chapter === "a-winter-postcard" && <FrostActivity />}
    {chapter === "a-relay-and-a-resting-place" && <RelayActivity />}
    <p className="viking-teaching-note">Teaching controls and drawings, not live commands, recorded waveforms or measured frost thickness.</p>
    {(IMAGES[chapter] ?? []).map(key => { const photo = VIKING_TWO_PHOTOS[key]; return <figure key={key} className="viking-archive"><p className="tc-eyebrow">Source media · {photo.name}</p><div className="viking-photo-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Source and original ↗</a></figcaption></figure>; })}
    {chapter === "ears-that-heard-the-wind" && <a href={S.seismicReport.url} target="_blank" rel="noopener noreferrer">Read the final seismic report and its actual event figures ↗</a>}
    {chapter === "a-relay-and-a-resting-place" && <a href={S.hirise.url} target="_blank" rel="noopener noreferrer">Inspect HiRISE’s real lander image and candidate entry hardware ↗</a>}
    <a href="/api/stories/viking-2/evidence" download>Download Viking 2’s sources, facts and story JSON ↗</a>
  </div>;
}
