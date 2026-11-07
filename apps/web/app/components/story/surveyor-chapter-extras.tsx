"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { SURVEYOR_ARCHIVE, SURVEYOR_PHOTOS } from "@/lib/surveyor-media";
import { SURVEYOR_SOURCES as S } from "@/lib/surveyor-sources";
import { SURVEYOR_DESCENT, SURVEYOR_INVESTIGATIONS, nextSurveyorDescent, surveyorShadowRatio } from "@/lib/surveyor-activities";
import SurveyorIllustration from "./surveyor-illustration";

const CHAPTER_IMAGES: Record<string, (keyof typeof SURVEYOR_PHOTOS)[]> = {
  "a-question-in-flight": ["launch", "diagram"],
  "three-feet-down": ["footpad"],
  "a-footprint-and-a-picture": ["footpad", "color", "cover"],
  "through-the-long-night": ["radiator"],
  "the-long-shadow": ["surfaceShadow", "orbital"],
};

function DescentActivity() {
  const [step, setStep] = useState(0);
  const item = SURVEYOR_DESCENT[step];
  return <section className="surveyor-activity"><p className="tc-eyebrow">Follow the hardware handover</p><h3>How does a fast arrival become a gentle landing?</h3>
    <SurveyorIllustration scene={item.scene} />
    <ol className="surveyor-descent-steps" aria-label="Descent sequence">{SURVEYOR_DESCENT.map((stage, index) => <li key={stage.label} aria-current={step === index ? "step" : undefined}>{stage.label}</li>)}</ol>
    <div role="group" aria-label="Explore the descent"><button type="button" disabled={step === 0} onClick={() => setStep(value => Math.max(0, value - 1))}>Previous stage</button><button type="button" onClick={() => setStep(value => value === SURVEYOR_DESCENT.length - 1 ? 0 : nextSurveyorDescent(value))}>{item.action}</button></div>
    <p role="status" aria-live="polite">{item.explanation}</p><a href={S.landing.url} target="_blank" rel="noopener noreferrer">Read the landing report ↗</a>
  </section>;
}

function ShadowActivity() {
  const [angle, setAngle] = useState(30);
  const id = useId();
  return <section className="surveyor-activity"><p className="tc-eyebrow">Try the lighting</p><h3>The same height can cast different shadows.</h3>
    <SurveyorIllustration scene="shadow" sunElevation={angle} />
    <label htmlFor={`${id}-sun`}>Illustrative Sun elevation: {angle}° above the horizon</label>
    <input id={`${id}-sun`} type="range" min="15" max="75" step="5" value={angle} aria-valuetext={`${angle} degrees above the horizon in the teaching model`} onChange={event => setAngle(Number(event.target.value))} />
    <div role="group" aria-label="Choose an illustrative sun angle"><button type="button" onClick={() => setAngle(15)}>Low Sun</button><button type="button" onClick={() => setAngle(45)}>Middle angle</button><button type="button" onClick={() => setAngle(75)}>High Sun</button></div>
    <p role="status" aria-live="polite">The ideal shadow is {surveyorShadowRatio(angle).toFixed(2)} times the mast height. Lower sunlight makes a longer shadow; the mast has not grown.</p>
    <p>Model: shadow length ÷ height = 1 ÷ tan(Sun elevation). This assumes a vertical mast and flat ground. It does not measure Surveyor’s actual terrain, shadow or condition.</p>
    <a href={S.orbital.url} target="_blank" rel="noopener noreferrer">Compare with LROC’s real afternoon image ↗</a>
  </section>;
}

function ArchiveFilm() {
  const media = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const film = SURVEYOR_ARCHIVE.retrospective;
  useEffect(() => {
    const video = media.current;
    const pause = () => { if (document.hidden) video?.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => { video?.pause(); document.removeEventListener("visibilitychange", pause); };
  }, []);
  return <section className="surveyor-archive"><p className="tc-eyebrow">NASA archive · captioned historical film</p><h3>{film.title}</h3>
    <video ref={media} src={film.src} controls playsInline preload="none" aria-label={film.title} onError={() => setFailed(true)}><track kind="captions" src={film.captions} srcLang="en" label="English · NASA captions" default /></video>
    <p>{film.description}</p>{failed && <p role="status">The film could not load. NASA’s original is available below.</p>}
    <a href={film.source} target="_blank" rel="noopener noreferrer">{film.credit} · Original film and download ↗</a>
  </section>;
}

export default function SurveyorChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState(0);
  const investigation = SURVEYOR_INVESTIGATIONS[chapter];
  const option = investigation?.options[selected];
  return <div className="surveyor-extras">
    {investigation && option && <section className="surveyor-activity"><p className="tc-eyebrow">Look closer</p><h3>{investigation.title}</h3><SurveyorIllustration scene={option.scene} /><div role="group" aria-label={investigation.title}>{investigation.options.map((choice, index) => <button type="button" key={choice.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{choice.label}</button>)}</div><p role="status" aria-live="polite">{option.explanation}</p><a href={investigation.source} target="_blank" rel="noopener noreferrer">Check the mission record ↗</a></section>}
    {chapter === "three-feet-down" && <DescentActivity />}
    {chapter === "the-long-shadow" && <ShadowActivity />}
    <p className="surveyor-teaching-note">Illustrated teaching models, not live commands or recovered telemetry.</p>
    {(CHAPTER_IMAGES[chapter] ?? []).map(key => {
      const photo = SURVEYOR_PHOTOS[key];
      return <figure key={key} className="surveyor-archive"><p className="tc-eyebrow">Mission evidence · {photo.name}</p><div className={`surveyor-photo-frame${key === "radiator" ? " surveyor-report-frame" : ""}`}><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Source and original ↗</a></figcaption></figure>;
    })}
    {chapter === "three-feet-down" && <ArchiveFilm />}
    <a href="/api/stories/surveyor-1/evidence" download>Download Surveyor 1’s sources, facts and story JSON ↗</a>
  </div>;
}
