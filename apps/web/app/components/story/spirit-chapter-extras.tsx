"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { SPIRIT_ARCHIVE, SPIRIT_PHOTOS, SPIRIT_MODEL } from "@/lib/spirit-media";
import { SPIRIT_SOURCES as S } from "@/lib/spirit-sources";
import { SPIRIT_INVESTIGATIONS, SPIRIT_RECOVERY, spiritRecoveryStep, type SpiritRecoveryState } from "@/lib/spirit-activities";
import SpiritIllustration from "./spirit-illustration";

const CHAPTER_IMAGES: Record<string, (keyof typeof SPIRIT_PHOTOS)[]> = {
  "a-rocky-welcome": ["grinding", "earth"],
  "the-view-from-the-hill": ["cover", "goethite"],
  "the-clue-under-my-wheel": ["silica"],
  "the-record-that-stayed": ["troy", "troySoil"],
};

function RecoveryActivity() {
  const [state, setState] = useState<SpiritRecoveryState>("resetting");
  const [restarted, setRestarted] = useState(false);
  const item = SPIRIT_RECOVERY[state];
  return <section className="spirit-activity"><p className="tc-eyebrow">Try the recovery sequence</p><h3>Can another restart fix the files?</h3>
    <SpiritIllustration scene={item.scene} />
    <div role="group" aria-label="Memory recovery steps">
      <button type="button" disabled={state !== "resetting"} onClick={() => { setState(value => spiritRecoveryStep(value, "restart")); setRestarted(true); }}>Try restarting</button>
      <button type="button" disabled={state !== "resetting"} onClick={() => setState(value => spiritRecoveryStep(value, "bypass"))}>Bypass flash</button>
      <button type="button" disabled={state !== "bypassed"} onClick={() => setState(value => spiritRecoveryStep(value, "delete-files"))}>Remove old files</button>
      <button type="button" disabled={state !== "stable"} onClick={() => setState(value => spiritRecoveryStep(value, "reformat"))}>Reformat storage</button>
    </div>
    <p role="status" aria-live="polite">{state === "resetting" && restarted ? "The restart returns to the same problem. The flash files have not changed. Try bypassing flash instead." : item.explanation}</p>
    <button type="button" className="spirit-reset" onClick={() => { setState("resetting"); setRestarted(false); }}>Reset the model</button>
    <a href={S.recovery.url} target="_blank" rel="noopener noreferrer">Read the recovery report ↗</a>
  </section>;
}

function SilicaActivity() {
  const id = useId();
  const [progress, setProgress] = useState(0);
  const [measured, setMeasured] = useState(false);
  return <section className="spirit-activity"><p className="tc-eyebrow">Uncover, then investigate</p><h3>A bright patch is only the beginning.</h3>
    <SpiritIllustration scene={measured ? "scan" : "scrape"} reveal={progress} />
    <label htmlFor={`${id}-track`}>Reveal the illustrated wheel track</label>
    <input id={`${id}-track`} type="range" min="0" max="100" step="10" value={progress} aria-valuetext={`${progress}% of the drawing revealed; not a measured distance`} onChange={event => { setProgress(Number(event.target.value)); setMeasured(false); }} />
    <div role="group" aria-label="Investigate the exposed soil"><button type="button" onClick={() => setProgress(100)}>Reveal the full track</button><button type="button" disabled={progress === 0} onClick={() => setMeasured(true)}>Check the instruments</button><button type="button" onClick={() => { setProgress(0); setMeasured(false); }}>Start again</button></div>
    <p role="status" aria-live="polite">{measured ? "Mini-TES flagged silica remotely. APXS measurements then found approximately 90% silica. Scientists proposed water-related formation; these instruments did not detect microbes." : progress > 0 ? "Pale soil appears beneath the darker surface. Color alone cannot tell us its chemistry. Check the instruments next." : "Move the slider, use its arrow keys, or reveal the full track with the button. These controls uncover a drawing, not live Martian soil."}</p>
    <a href={S.silica.url} target="_blank" rel="noopener noreferrer">Check the dates and instrument record ↗</a>
  </section>;
}

function DustDevilMovie() {
  const media = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const item = SPIRIT_ARCHIVE.dustDevils;
  useEffect(() => {
    const video = media.current;
    const pause = () => { if (document.hidden) video?.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => { video?.pause(); document.removeEventListener("visibilitychange", pause); };
  }, []);
  return <section className="spirit-archive"><p className="tc-eyebrow">NASA camera sequence · silent</p><h3>{item.title}</h3>
    <video ref={media} src={item.src} poster={item.poster} controls playsInline preload="none" aria-label={item.title} onError={() => setFailed(true)} />
    <p>{item.description}</p>
    {failed && <p role="status">The movie could not load. Open NASA’s original below.</p>}
    <a href={item.source} target="_blank" rel="noopener noreferrer">{item.credit} · Original sequence and description ↗</a>
  </section>;
}

export default function SpiritChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState(0);
  const question = SPIRIT_INVESTIGATIONS[chapter];
  const choice = question?.choices[selected];
  return <div className="spirit-extras">
    {question && choice && <section className="spirit-activity"><p className="tc-eyebrow">Look closer</p><h3>{question.title}</h3><SpiritIllustration scene={choice.scene} /><div role="group" aria-label={question.title}>{question.choices.map((option, index) => <button key={option.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{option.label}</button>)}</div><p role="status" aria-live="polite">{choice.explanation}</p><a href={question.source} target="_blank" rel="noopener noreferrer">Check the NASA record ↗</a></section>}
    {chapter === "a-fresh-start" && <RecoveryActivity />}
    {chapter === "the-clue-under-my-wheel" && <SilicaActivity />}
    <p className="spirit-teaching-note">Illustrated teaching models, not live controls or measured simulations.</p>
    {(CHAPTER_IMAGES[chapter] ?? []).map(key => {
      const photo = SPIRIT_PHOTOS[key];
      return <figure className="spirit-archive" key={key}><p className="tc-eyebrow">NASA mission record · {photo.name}</p><div className="spirit-photo-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Source and full-size download ↗</a></figcaption></figure>;
    })}
    {chapter === "the-view-from-the-hill" && <DustDevilMovie />}
    {chapter === "a-rocky-welcome" && <a href={SPIRIT_MODEL.source} target="_blank" rel="noopener noreferrer">Explore NASA’s shared Spirit and Opportunity 3D model ↗</a>}
    {chapter === "the-record-that-stayed" && <section className="spirit-archive"><h3>Look for Spirit from orbit</h3><p>The March 31, 2011 HiRISE observation explains the bright reflection from Spirit’s solar panels. The observation’s center coordinates describe the image, not an exact rover fix.</p><a href={S.orbital.url} target="_blank" rel="noopener noreferrer">NASA/JPL-Caltech/UArizona · ESP_021925_1650 ↗</a></section>}
    <a href="/api/stories/spirit/evidence" download>Download Spirit’s sources, facts and story JSON ↗</a>
  </div>;
}
