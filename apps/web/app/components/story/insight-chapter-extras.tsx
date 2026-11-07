"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { INSIGHT_ARCHIVE_VIDEO, INSIGHT_PHOTOS } from "@/lib/insight-media";
import { INSIGHT_SOURCES } from "@/lib/insight-sources";

const QUESTIONS: Record<string, { question: string; options: { label: string; explanation: string }[]; source: string }> = {
  "a-place-to-listen": { question: "What could explore beneath a lander that stays still?", options: [
    { label: "A seismometer", explanation: "SEIS measures ground motion. Scientists use the way seismic waves travel to investigate layers inside Mars." },
    { label: "A camera", explanation: "The cameras help examine the surface and place instruments safely. A surface photograph alone cannot show the core." },
  ], source: INSIGHT_SOURCES.deployment.url },
  "an-ear-on-the-ground": { question: "Is every wiggle a marsquake?", options: [
    { label: "Check the weather", explanation: "Wind and pressure changes can produce vibrations too. Scientists compare weather records with seismic measurements to understand the noise." },
    { label: "Check spacecraft activity", explanation: "Moving the robotic arm also produces a signal. NASA’s Sol 128 visualization includes wind, the likely quake, and arm movement—not just one sound." },
  ], source: INSIGHT_SOURCES.firstQuake.url },
  "the-stubborn-soil": { question: "Why could a working hammer still get stuck?", options: [
    { label: "Inspect the soil", explanation: "The clumpy soil did not collapse around the mole as expected. Without enough friction against its body, the probe could bounce instead of digging deeper." },
    { label: "Inspect the result", explanation: "The scoop helped bury the probe, but its top just below the surface was not the required three-meter depth. The deep heat-flow measurement was not achieved." },
  ], source: INSIGHT_SOURCES.mole.url },
  "sand-in-the-wind": { question: "What made the sand trial different from adding more dust?", options: [
    { label: "Follow the grains", explanation: "The team trickled larger sand grains near the panel. Wind carried them across its surface, where they could hop and carry smaller dust particles away." },
    { label: "Check the energy", explanation: "The trial gained about 30 watt-hours per sol. That is an additional daily energy yield—not a permanent recovery or proof of another year of operation." },
  ], source: INSIGHT_SOURCES.cleaning.url },
};

function ArchiveVideo({ kind }: { kind: keyof typeof INSIGHT_ARCHIVE_VIDEO }) {
  const item = INSIGHT_ARCHIVE_VIDEO[kind];
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = video.current;
    const pause = () => { if (document.hidden) element?.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => { element?.pause(); document.removeEventListener("visibilitychange", pause); };
  }, []);
  return <section className="insight-archive" aria-label={item.title}>
    <p className="tc-eyebrow">From NASA’s archive</p><h3>{item.title}</h3>
    <video ref={video} src={item.src} controls playsInline preload="none" poster={kind === "cleaning" ? INSIGHT_PHOTOS.cleaning.src : undefined} aria-label={item.title} onError={() => setError(true)} />
    <p>{item.description}</p>
    {error && <p role="status">The archive video could not load here. The NASA source below provides an alternative.</p>}
    <a href={item.source} target="_blank" rel="noopener noreferrer">{item.credit} · Source{kind === "wind" ? " and written transcript" : " and description"} ↗</a>
  </section>;
}

export default function InsightChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [later, setLater] = useState(false);
  const question = QUESTIONS[chapter];
  const photo = later ? INSIGHT_PHOTOS.finalSelfie : INSIGHT_PHOTOS.firstSelfie;
  return <div className="insight-extras">
    {question && <section className="insight-activity"><p className="tc-eyebrow">Look closer</p><h3>{question.question}</h3>
      <div role="group" aria-label={question.question}>{question.options.map((option, i) => <button type="button" key={option.label} aria-pressed={selected === i} onClick={() => setSelected(i)}>{option.label}</button>)}</div>
      <p role="status" aria-live="polite">{selected === null ? "Pick something to investigate. There is no timer or score." : question.options[selected].explanation}</p>
      <a href={question.source} target="_blank" rel="noopener noreferrer">Check NASA’s explanation ↗</a>
    </section>}
    {chapter === "an-ear-on-the-ground" && <ArchiveVideo kind="wind" />}
    {chapter === "sand-in-the-wind" && <ArchiveVideo kind="cleaning" />}
    {chapter === "quiet-not-forgotten" && <>
      <section className="insight-activity"><p className="tc-eyebrow">Same lander. Different days.</p><h3>What changed between the selfies?</h3>
        <div role="group" aria-label="Choose an archival selfie"><button type="button" aria-pressed={!later} onClick={() => setLater(false)}>6 December 2018</button><button type="button" aria-pressed={later} onClick={() => setLater(true)}>24 April 2022</button></div>
        <figure className="insight-comparison"><Image src={photo.src} alt={photo.alt} width={1000} height={650} className="object-contain" /><figcaption><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.title} · {photo.credit} ↗</a></figcaption></figure>
        <p>These are NASA’s selfie mosaics, not a continuous recording. Compare the dust on the deck and panels. Dust reduced how much sunlight the solar cells could use.</p>
      </section>
      <details className="insight-future"><summary>What about the small laser reflector?</summary><p>InSight carries LaRRI, a passive reflector intended for possible future laser-equipped Mars orbiters. That intended use is not evidence of successful ranging or a confirmed “active in 2026” status.</p><a href={INSIGHT_SOURCES.reflector.url} target="_blank" rel="noopener noreferrer">Read NASA’s 2020 explanation ↗</a></details>
    </>}
  </div>;
}
