"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { VIKING_PHOTOS } from "@/lib/viking-media";
import { VIKING_SOURCES as S } from "@/lib/viking-sources";
import { VIKING_LAB_TESTS, VIKING_POWER_VIEWS, VIKING_SAMPLER, checkVikingTeachingWrite, vikingSamplerStep, type VikingSamplerState, type VikingTeachingTarget } from "@/lib/viking-activities";
import VikingIllustration from "./viking-illustration";

const CHAPTER_IMAGES: Record<string, (keyof typeof VIKING_PHOTOS)[]> = {
  "a-careful-arrival": ["first"], "a-picture-and-a-stuck-pin": ["color", "sampler"],
  "soil-with-a-surprise": ["laboratory"], "a-patient-weather-watcher": ["cover"],
  "a-silent-link-a-lasting-record": ["orbital"],
};

function SamplerActivity() {
  const [state, setState] = useState<VikingSamplerState>("stuck");
  const item = VIKING_SAMPLER[state];
  return <section className="viking-activity"><p className="tc-eyebrow">A repair across space</p><h3>Inspect. Test. Then try.</h3><VikingIllustration scene={item.scene} />
    <div role="group" aria-label="Investigate the stuck sampler"><button type="button" disabled={state !== "stuck"} onClick={() => setState(value => vikingSamplerStep(value, "inspect"))}>Inspect the camera evidence</button><button type="button" disabled={state !== "inspected"} onClick={() => setState(value => vikingSamplerStep(value, "test"))}>Test on the Earth duplicate</button><button type="button" disabled={state !== "tested"} onClick={() => setState(value => vikingSamplerStep(value, "try-command"))}>Try the tested command</button><button type="button" onClick={() => setState("stuck")}>Start again</button></div>
    <p role="status" aria-live="polite">{item.explanation}</p><a href={S.discoveries.url} target="_blank" rel="noopener noreferrer">Read NASA’s repair account ↗</a>
  </section>;
}

function ScanActivity() {
  const id = useId();
  const [reveal, setReveal] = useState(0);
  return <section className="viking-activity"><p className="tc-eyebrow">Build a view in strips</p><h3>A camera that scanned its surroundings.</h3><VikingIllustration scene="scan" reveal={reveal} />
    <label htmlFor={`${id}-scan`}>Reveal the illustrated image</label><input id={`${id}-scan`} type="range" min="0" max="100" step="10" value={reveal} aria-valuetext={`${reveal}% of the teaching drawing; not elapsed mission time`} onChange={event => setReveal(Number(event.target.value))} />
    <div role="group" aria-label="Reveal the scan drawing"><button type="button" onClick={() => setReveal(100)}>Reveal the full drawing</button><button type="button" onClick={() => setReveal(0)}>Reset the drawing</button></div>
    <p role="status" aria-live="polite">{reveal === 0 ? "Use arrow keys on the slider or the reveal button. Viking’s first picture was assembled from scanned lines; this drawing is not the original image." : "The illustration appears from left to right. NASA’s real photograph is separate below, showing footpad 2—not a reconstruction of this drawing."}</p>
  </section>;
}

function LaboratoryActivity() {
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState<"signal" | "compare" | null>(null);
  const item = VIKING_LAB_TESTS[selected];
  return <section className="viking-activity"><p className="tc-eyebrow">A clue is not a conclusion</p><h3>What did each experiment ask?</h3><VikingIllustration scene={item.scene} />
    <div role="group" aria-label="Choose a Viking experiment">{VIKING_LAB_TESTS.map((test, index) => <button type="button" key={test.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{test.label}</button>)}</div><p role="status" aria-live="polite">{item.explanation}</p>
    <h4>A soil sample releases gas. What next?</h4><div role="group" aria-label="Interpret a gas signal"><button type="button" aria-pressed={answer === "signal"} onClick={() => setAnswer("signal")}>Call the signal proof of life</button><button type="button" aria-pressed={answer === "compare"} onClick={() => setAnswer("compare")}>Compare tests and explanations</button></div>
    {answer && <p role="status" aria-live="polite">{answer === "signal" ? "Not yet. A chemical reaction can happen without organisms. A signal needs other evidence and controls." : "Yes—compare independent tests, controls and possible chemistry. Viking did not establish definitive evidence of life."}</p>}<a href={item.source} target="_blank" rel="noopener noreferrer">Check this experiment’s source ↗</a>
  </section>;
}

function PowerActivity() {
  const [selected, setSelected] = useState(0);
  const item = VIKING_POWER_VIEWS[selected];
  return <section className="viking-activity"><p className="tc-eyebrow">Different ways to make electricity</p><h3>What changes when the sky gets dustier?</h3><VikingIllustration scene={item.scene} />
    <div role="group" aria-label="Compare illumination conditions">{VIKING_POWER_VIEWS.map((view, index) => <button type="button" key={view.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{view.label}</button>)}</div>
    <dl className="viking-power-comparison"><div><dt>Solar panel</dt><dd>Depends on incoming sunlight</dd></div><div><dt>RTG</dt><dd>Uses radioactive-decay heat</dd></div></dl><p role="status" aria-live="polite">{item.explanation}</p><a href={S.project.url} target="_blank" rel="noopener noreferrer">Read about Viking’s power source ↗</a>
  </section>;
}

function MemoryActivity() {
  const [target, setTarget] = useState<VikingTeachingTarget>("unused");
  const [checked, setChecked] = useState(false);
  const result = checkVikingTeachingWrite(target);
  return <section className="viking-activity"><p className="tc-eyebrow">Check an update before sending it</p><h3>Could this change overwrite another job?</h3><VikingIllustration scene="memory" />
    <div role="group" aria-label="Choose a teaching memory region"><button type="button" aria-pressed={target === "unused"} onClick={() => { setTarget("unused"); setChecked(false); }}>Unused region</button><button type="button" aria-pressed={target === "antenna"} onClick={() => { setTarget("antenna"); setChecked(false); }}>Radio-pointing region</button></div>
    <button type="button" onClick={() => setChecked(true)}>Check the update</button><p role="status" aria-live="polite">{checked ? result.explanation : "Choose a region, then check the overlap. This small grid is an analogy, not Viking’s real addresses or an executable command."}</p><a href={S.monitor.url} target="_blank" rel="noopener noreferrer">Inspect JPL’s diagnosis and recovery attempts ↗</a>
  </section>;
}

export default function VikingChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState(false);
  return <div className="viking-extras">
    {chapter === "a-careful-arrival" && <section className="viking-activity"><p className="tc-eyebrow">Protect the question</p><h3>Why clean a robot before sending it to Mars?</h3><VikingIllustration scene="protect" /><div role="group" aria-label="Explore planetary protection"><button type="button" aria-pressed={selected} onClick={() => setSelected(value => !value)}>{selected ? "Return to the question" : "Reveal the reason"}</button></div><p role="status" aria-live="polite">{selected ? "Earth microbes could contaminate Mars and confuse a search for Martian life. Heat treatment and the bioshield reduced that risk; they did not verify that absolutely zero microbes remained." : "The experiment asks about Mars, not about microbes brought from Earth. What could a hitchhiker change?"}</p><a href={S.launchHistory.url} target="_blank" rel="noopener noreferrer">Read NASA’s planetary-protection account ↗</a></section>}
    {chapter === "a-picture-and-a-stuck-pin" && <><ScanActivity /><SamplerActivity /></>}
    {chapter === "soil-with-a-surprise" && <LaboratoryActivity />}
    {chapter === "a-patient-weather-watcher" && <PowerActivity />}
    {chapter === "a-silent-link-a-lasting-record" && <MemoryActivity />}
    <p className="viking-teaching-note">Teaching drawings and controls, not measured signals, live commands or flight simulations.</p>
    {(CHAPTER_IMAGES[chapter] ?? []).map(key => {
      const photo = VIKING_PHOTOS[key];
      return <figure key={key} className="viking-archive"><p className="tc-eyebrow">Source media · {photo.name}</p><div className="viking-photo-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Source and original ↗</a></figcaption></figure>;
    })}
    {chapter === "a-silent-link-a-lasting-record" && <a href={VIKING_PHOTOS.overview.src} target="_blank" rel="noopener noreferrer">Inspect HiRISE’s original overview and candidate entry-hardware locations ↗</a>}
    <a href="/api/stories/viking-1/evidence" download>Download Viking 1’s sources, facts and story JSON ↗</a>
  </div>;
}
