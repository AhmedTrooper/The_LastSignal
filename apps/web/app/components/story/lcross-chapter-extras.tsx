"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { LCROSS_PHOTOS, LCROSS_ARCHIVE } from "@/lib/lcross-media";
import { LCROSS_SOURCES as S } from "@/lib/lcross-sources";
import { LCROSS_INVESTIGATIONS, LCROSS_IMPACT_STEPS, LCROSS_RECOVERY, lcrossRecoveryStep, type LcrossRecoveryState } from "@/lib/lcross-activities";
import LcrossIllustration from "./lcross-illustration";

const CHAPTER_IMAGES: Record<string, (keyof typeof LCROSS_PHOTOS)[]> = {
  "a-stage-with-another-job": ["cover"], "two-impacts-one-experiment": ["nearInfrared"],
  "light-with-a-water-clue": ["plume"], "the-impact-that-kept-teaching": ["lamp"],
};

function RecoveryActivity() {
  const [state, setState] = useState<LcrossRecoveryState>("noisy-backup");
  const item = LCROSS_RECOVERY[state];
  return <section className="lcross-activity"><p className="tc-eyebrow">Investigate the control loop</p><h3>Noise or real motion?</h3><LcrossIllustration scene={item.scene} />
    <div role="group" aria-label="Explore the recovery"><button type="button" disabled={state !== "noisy-backup"} onClick={() => setState(value => lcrossRecoveryStep(value, "restore-rates"))}>Restore useful rate measurements</button><button type="button" disabled={state !== "restored-rates"} onClick={() => setState(value => lcrossRecoveryStep(value, "revise-protection"))}>Revise the safeguards</button><button type="button" onClick={() => setState("noisy-backup")}>Start again</button></div>
    <p role="status" aria-live="polite">{item.explanation}</p><a href={S.operations.url} target="_blank" rel="noopener noreferrer">Read the flight-operations account ↗</a>
  </section>;
}

function ImpactActivity() {
  const [step, setStep] = useState(0);
  const item = LCROSS_IMPACT_STEPS[step];
  return <section className="lcross-activity"><p className="tc-eyebrow">Follow the experiment</p><h3>Give the observer time to observe.</h3><LcrossIllustration scene={item.scene} />
    <ol className="lcross-step-list" aria-label="Impact experiment sequence">{LCROSS_IMPACT_STEPS.map((phase, index) => <li key={phase.label} aria-current={step === index ? "step" : undefined}>{phase.label}</li>)}</ol>
    <div role="group" aria-label="Explore the impact sequence"><button type="button" disabled={step === 0} onClick={() => setStep(value => Math.max(0, value - 1))}>Previous phase</button><button type="button" onClick={() => setStep(value => value === LCROSS_IMPACT_STEPS.length - 1 ? 0 : value + 1)}>{item.action}</button></div>
    <p role="status" aria-live="polite">{item.explanation}</p><a href={S.mission.url} target="_blank" rel="noopener noreferrer">Check the mission sequence ↗</a>
  </section>;
}

function PlumeActivity() {
  const id = useId();
  const [reveal, setReveal] = useState(0);
  return <section className="lcross-activity"><p className="tc-eyebrow">Bring a hidden clue into view</p><h3>The experiment needed light as well as an impact.</h3><LcrossIllustration scene="plume" reveal={reveal} />
    <label htmlFor={`${id}-plume`}>Reveal the illustrated plume</label><input id={`${id}-plume`} type="range" min="0" max="100" step="10" value={reveal} aria-valuetext={`${reveal}% of the drawing revealed; not an altitude or measured time`} onChange={event => setReveal(Number(event.target.value))} />
    <div role="group" aria-label="Reveal the plume"><button type="button" onClick={() => setReveal(100)}>Reveal the full drawing</button><button type="button" onClick={() => setReveal(0)}>Reset the drawing</button></div>
    <p role="status" aria-live="polite">{reveal === 0 ? "The crater floor is shadowed. Move the slider with pointer or arrow keys, or use the button." : "The drawing shows debris reaching illumination. Brightness alone still cannot identify water: compare the instrument evidence below."}</p>
    <a href={S.overview.url} target="_blank" rel="noopener noreferrer">Compare with NASA’s real plume image ↗</a>
  </section>;
}

function LampMovie() {
  const media = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const item = LCROSS_ARCHIVE.lamp;
  useEffect(() => {
    const video = media.current;
    const pause = () => { if (document.hidden) video?.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => { video?.pause(); document.removeEventListener("visibilitychange", pause); };
  }, []);
  return <section className="lcross-archive"><p className="tc-eyebrow">NASA data visualization · silent</p><h3>{item.title}</h3><video ref={media} src={item.src} controls playsInline preload="none" aria-label={item.title} onError={() => setFailed(true)} /><p>{item.description}</p>{failed && <p role="status">The movie could not load. NASA’s original is available below.</p>}<a href={item.source} target="_blank" rel="noopener noreferrer">{item.credit} · Original and description ↗</a></section>;
}

export default function LcrossChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState(0);
  const question = LCROSS_INVESTIGATIONS[chapter];
  const option = question?.options[selected];
  return <div className="lcross-extras">
    {question && option && <section className="lcross-activity"><p className="tc-eyebrow">Look closer</p><h3>{question.title}</h3><LcrossIllustration scene={option.scene} /><div role="group" aria-label={question.title}>{question.options.map((choice, index) => <button type="button" key={choice.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{choice.label}</button>)}</div><p role="status" aria-live="polite">{option.explanation}</p><a href={question.source} target="_blank" rel="noopener noreferrer">Check the source record ↗</a></section>}
    {chapter === "the-fuel-scare" && <RecoveryActivity />}
    {chapter === "two-impacts-one-experiment" && <ImpactActivity />}
    {chapter === "light-with-a-water-clue" && <PlumeActivity />}
    <p className="lcross-teaching-note">Teaching drawings, not live commands, measured spectra or mission simulations.</p>
    {(CHAPTER_IMAGES[chapter] ?? []).map(key => {
      const photo = LCROSS_PHOTOS[key];
      return <figure key={key} className="lcross-archive"><p className="tc-eyebrow">Source media · {photo.name}</p><div className="lcross-photo-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Source and original ↗</a></figcaption></figure>;
    })}
    {chapter === "the-impact-that-kept-teaching" && <><LampMovie /><a href={S.laterCrater.url} target="_blank" rel="noopener noreferrer">Inspect the 2024 instrument-team crater study and figures ↗</a></>}
    <a href="/api/stories/lcross/evidence" download>Download LCROSS’s sources, facts and story JSON ↗</a>
  </div>;
}
