"use client";

import { useEffect, useRef, useState } from "react";
import { INGENUITY_ARCHIVE } from "@/lib/ingenuity-media";
import { INGENUITY_SOURCES as S } from "@/lib/ingenuity-sources";

const QUESTIONS: Record<string, { question: string; source: string; options: { label: string; explanation: string }[] }> = {
  "a-new-sky": { question: "What had to fly the helicopter?", source: S.firstFlight.url, options: [
    { label: "The onboard algorithms", explanation: "Ingenuity flew autonomously. The team sent instructions and examined the returned data; Earth was too far away for a live joystick." },
    { label: "The rover’s role", explanation: "Perseverance relayed communications and recorded the first flight. It was not a remote-control pilot steering the helicopter in real time." },
  ] },
  "the-missing-picture": { question: "Why did the time on a picture matter?", source: S.glitch.url, options: [
    { label: "Compare the sensors", explanation: "The navigation algorithm compared camera features with motion estimates. Wrong timestamps made it compare information from the wrong moments." },
    { label: "Inspect the safe landing", explanation: "The final-descent design stopped using camera images. Together with the aircraft’s stability margin, this helped stop the oscillations. The camera was not physically repaired in flight." },
  ] },
  "the-gear-left-behind": { question: "Why photograph equipment that had been discarded?", source: S.debris.url, options: [
    { label: "Inspect the parachute", explanation: "The images could show the canopy and suspension lines from a new viewpoint. Engineers could compare what they saw with the landing’s records and design." },
    { label: "Inspect the backshell", explanation: "The protective shell had finished its job, but its condition could offer engineering evidence. The report still called for more analysis—not an instant verdict." },
  ] },
  "a-backup-sense": { question: "Could the team replace a sensor without sending a new one?", source: S.sensor.url, options: [
    { label: "Reuse IMU data", explanation: "IMU accelerometers could estimate starting orientation. The fallback was generally less accurate than the purpose-built inclinometer, but it offered another way to initialize navigation." },
    { label: "Read the patch plan", explanation: "The team had prepared this fallback before arriving on Mars. A software patch substituted IMU-derived packets; it did not mend the failed sensor." },
  ] },
  "a-record-for-the-future": { question: "Does twenty years of storage mean twenty years of operation?", source: S.farewell.url, options: [
    { label: "Check what was confirmed", explanation: "The April 16, 2024 transmission confirmed the stationary-testbed software was operating. It did not confirm the helicopter’s condition in 2026." },
    { label: "Check what was possible", explanation: "NASA calculated potential memory capacity for about twenty years of daily data. Dust-related power loss or a failed electrical component could stop data collection sooner." },
  ] },
};

function ArchiveMedia({ name }: { name: keyof typeof INGENUITY_ARCHIVE }) {
  const item = INGENUITY_ARCHIVE[name];
  const media = useRef<HTMLMediaElement | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = media.current;
    const pause = () => { if (document.hidden) element?.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => { element?.pause(); document.removeEventListener("visibilitychange", pause); };
  }, []);
  return <section className="ingenuity-archive"><p className="tc-eyebrow">NASA archive · not story narration</p><h3>{item.title}</h3>
    {item.kind === "audio" ? <audio ref={node => { media.current = node; }} src={item.src} controls preload="none" aria-label={item.title} onError={() => setFailed(true)} /> : <video ref={node => { media.current = node; }} src={item.src} controls playsInline preload="none" aria-label={item.title} onError={() => setFailed(true)} />}
    <p>{item.description}</p>{failed && <p role="status">This media could not load. The NASA source below provides an alternative.</p>}
    <a href={item.source} target="_blank" rel="noopener noreferrer">{item.credit} · Source and description ↗</a>
  </section>;
}

export default function IngenuityChapterExtras({ chapter }: { chapter: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const question = QUESTIONS[chapter];
  return <div className="ingenuity-extras">
    {question && <section className="ingenuity-activity"><p className="tc-eyebrow">Look closer</p><h3>{question.question}</h3><div role="group" aria-label={question.question}>{question.options.map((option, i) => <button key={option.label} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{option.label}</button>)}</div><p role="status" aria-live="polite">{selected === null ? "Choose something to investigate. No timer or score." : question.options[selected].explanation}</p><a href={question.source} target="_blank" rel="noopener noreferrer">Check the NASA record ↗</a></section>}
    {chapter === "a-new-sky" && <><ArchiveMedia name="firstFlight" /><ArchiveMedia name="hum" /></>}
    {chapter === "the-missing-picture" && <ArchiveMedia name="flightSix" />}
  </div>;
}
