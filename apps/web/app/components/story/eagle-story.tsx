"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { EagleMemory } from "@/lib/eagle-story";
import { connectEagle } from "@/lib/eagle-link";
import { EAGLE_AUDIO, EAGLE_DESCENT_FILM } from "@/lib/eagle-media";
import { ArrowLeft, ArrowRight, Close } from "@/app/components/icons";
import { SignalMark } from "@/app/components/logo";
import EagleMediaPlayer from "@/app/components/profile/eagle-media-player";
import { useEagleVoice } from "@/app/components/profile/use-eagle-voice";
import EagleMechanism from "./eagle-mechanism";

type Props = { slug: string; name: string; chapters: EagleMemory[]; sources: { label: string; url: string }[] };

export default function EagleStory({ slug, name, chapters, sources }: Props) {
  const [index, setIndex] = useState(0);
  const [acted, setActed] = useState<number[]>([]);
  const [furthest, setFurthest] = useState(0);
  const [done, setDone] = useState(false);
  const [mediaView, setMediaView] = useState(false);
  const connection = useRef<ReturnType<typeof connectEagle> | null>(null);
  const session = useRef("");
  const current = useRef({ index: 0, done: false });
  const heading = useRef<HTMLHeadingElement>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const chapter = chapters[index];
  const voice = useEagleVoice(chapter.id);
  const last = index === chapters.length - 1;
  const hasActed = acted.includes(index);
  const consoleHref = `/heroes/${slug}`;
  const media = chapter.audio !== undefined ? EAGLE_AUDIO[chapter.audio] : chapter.film ? EAGLE_DESCENT_FILM : undefined;

  useEffect(() => {
    current.current = { index, done };
    if (!done) connection.current?.send({ type: "SCENE_PROGRESS", session: session.current, machineId: "apollo-11-lander", scene: index + 1, total: chapters.length, title: chapter.title });
  }, [index, done, chapters.length, chapter.title]);

  useEffect(() => {
    session.current = new URLSearchParams(window.location.search).get("visit") ?? "";
    const sendStatus = () => {
      const state = current.current;
      connection.current?.send(state.done ? { type: "STORY_COMPLETED", session: session.current, machineId: "apollo-11-lander" } : { type: "SCENE_PROGRESS", session: session.current, machineId: "apollo-11-lander", scene: state.index + 1, total: chapters.length, title: chapters[state.index].title });
    };
    const link = connectEagle(message => { if (message.type === "STATUS_REQUEST" && message.session === session.current) sendStatus(); });
    connection.current = link;
    sendStatus();
    const close = () => { if (!current.current.done) link.send({ type: "STORY_CLOSED", session: session.current, machineId: "apollo-11-lander" }); };
    window.addEventListener("pagehide", close);
    window.addEventListener("pageshow", sendStatus);
    return () => { window.removeEventListener("pagehide", close); window.removeEventListener("pageshow", sendStatus); link.close(); connection.current = null; if (returnTimer.current) clearTimeout(returnTimer.current); };
  }, [chapters]);

  const goTo = (next: number) => {
    voice.stop();
    setMediaView(false);
    setIndex(next);
    setFurthest(n => Math.max(n, next));
    requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" }); });
  };
  const finish = () => {
    voice.stop();
    current.current.done = true;
    connection.current?.send({ type: "STORY_COMPLETED", session: session.current, machineId: "apollo-11-lander" });
    setDone(true);
    window.close();
    returnTimer.current = setTimeout(() => { window.location.assign(`${consoleHref}?storyCompleted=true`); }, 350);
  };

  return (
    <div className="eagle-story min-h-dvh bg-[#0b0a16] text-white [color-scheme:dark]">
      <h1 className="sr-only">{name}: black-box memory playback</h1>
      <header className="relative z-20 border-b border-white/12 bg-[#0b0a16] px-5 pt-5 sm:px-9 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4"><Link href={consoleHref} className="flex items-center gap-3"><SignalMark className="h-7 w-7 text-[#c1b4ff]" /><span className="font-mono text-[10px] uppercase tracking-[0.16em]">Eagle / Black-box memories<span className="mt-1 block text-[9px] tracking-[0.1em] text-white/55">Historical playback · Apollo 11</span></span></Link><Link href={consoleHref} className="eagle-utility" aria-label="Leave the story and open Eagle’s console"><Close className="h-4 w-4" /><span className="hidden sm:inline">Console</span></Link></div>
        <nav aria-label="Story memories" className="mx-auto mt-3 flex max-w-[1440px] gap-2">{chapters.map((memory, i) => <button type="button" key={memory.id} onClick={() => goTo(i)} disabled={i > furthest} aria-current={i === index ? "step" : undefined} aria-label={`Memory ${i + 1}: ${memory.title}`} className="group flex min-h-11 min-w-0 flex-1 flex-col justify-center gap-2 disabled:cursor-default"><span className={`h-0.5 w-full rounded-full ${i <= index ? "bg-[#bdaaff]" : "bg-white/20"}`} /><span className={`hidden text-left font-mono text-[9px] uppercase tracking-wider md:block ${i === index ? "text-[#d0c3ff]" : "text-white/50"}`}>{String(i + 1).padStart(2, "0")}<span className="ml-2 hidden xl:inline">{memory.phase}</span></span></button>)}</nav>
      </header>

      {done ? <div className="mx-auto max-w-xl px-5 py-24"><p className="eagle-eyebrow">Story complete</p><h2 className="display mt-4 text-5xl">Thank you for listening.</h2><p className="mt-6 text-white/65">Returning to Eagle’s console…</p><a href={`${consoleHref}?storyCompleted=true`} className="eagle-utility mt-6">Return to the console <ArrowRight /></a></div> : <>
        <div className="border-b border-white/10 bg-white/[0.02]"><dl className="mx-auto grid max-w-[1440px] grid-cols-2 px-5 sm:grid-cols-4 sm:px-9 lg:px-12">{chapter.telemetry.map(item => <div key={item.label} className="min-w-0 border-white/10 px-2 py-4 sm:border-r sm:px-5 first:sm:pl-0 last:border-0"><dt className="eagle-eyebrow text-[9px]!">{item.label}</dt><dd className="mt-1.5 break-words font-mono text-xs text-[#e2dbfa] sm:text-sm">{item.value}</dd></div>)}</dl></div>

        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14 lg:px-12 lg:py-10">
          <div className="order-2 min-w-0 lg:order-1">
            {media && <div className="mb-3 flex gap-2" role="group" aria-label="Memory media"><button type="button" onClick={() => { voice.stop(); setMediaView(false); }} aria-pressed={!mediaView} className={`eagle-utility ${!mediaView ? "bg-white/10" : ""}`}>Visual memory</button><button type="button" onClick={() => { voice.stop(); setMediaView(true); }} aria-pressed={mediaView} className={`eagle-utility ${mediaView ? "bg-white/10" : ""}`}>{media.kind === "audio" ? "Original audio" : "Onboard film"}</button></div>}
            <motion.div key={`${chapter.id}-${mediaView}`} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              {mediaView && media ? <EagleMediaPlayer key={chapter.id} media={media} onPlay={voice.stop} /> : chapter.photo ? <figure className="overflow-hidden rounded-2xl border border-white/15 bg-black"><div className="relative aspect-[4/3]"><Image src={chapter.photo.src} alt={chapter.photo.alt} fill sizes="(min-width:1024px) 48vw, 100vw" className="object-contain" loading={index === 0 ? "eager" : "lazy"} /></div><figcaption className="flex items-start justify-between gap-3 p-4 text-[11px] leading-relaxed text-white/65"><span>{chapter.photo.ai ? "AI-generated placeholder" : `${chapter.photo.title} · ${chapter.photo.credit}`}</span><a href={chapter.photo.source} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[#c1b4ff] underline">Source ↗</a></figcaption></figure> : <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-white/15 bg-[radial-gradient(ellipse_at_center,#261c36,#0b0a16_75%)]"><p className="eagle-eyebrow text-[#e7c291]!">Apollo Guidance Computer</p><p className="mt-5 font-mono text-[clamp(5rem,12vw,9rem)] leading-none tracking-tight text-[#efd5a7]">1202</p><p className="mt-5 font-mono text-xs text-white/60">EXECUTIVE OVERFLOW</p><span className="mt-6 rounded-full border border-[#dfbb80]/30 px-4 py-2 text-xs text-[#efd5a7]">{hasActed ? "GO · essential guidance preserved" : "A warning during descent"}</span></div>}
            </motion.div>
            {!last && <div className="mt-4"><EagleMechanism key={chapter.id} kind={chapter.trigger} engaged={hasActed} /></div>}
          </div>

          <motion.section key={chapter.id} aria-labelledby="eagle-memory-title" initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="order-1 min-w-0 lg:order-2">
            <div className="flex items-center justify-between gap-3"><p className="eagle-eyebrow text-[#c1b4ff]!">Memory {String(index + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</p>{voice.available && <button type="button" className="eagle-utility" onClick={() => { if (voice.speaking) voice.stop(); else { setMediaView(false); voice.start(`${chapter.title} ${chapter.speech.join(" ")}`); } }} aria-pressed={voice.speaking}>{voice.speaking ? "Stop voice" : "Hear Eagle"}</button>}</div>
            <h2 ref={heading} id="eagle-memory-title" tabIndex={-1} className="display mt-5 max-w-[13ch] text-[clamp(2.8rem,4.8vw,4.5rem)] text-balance outline-none">{chapter.title}</h2>
            <p className="mt-4 font-mono text-[11px] text-white/55">{chapter.date} · {chapter.utc}</p>
            <div className="mt-6 space-y-4">{chapter.speech.map((line, i) => <p key={i} className={i === 0 ? "text-lg leading-[1.7] text-white/90" : "text-[15px] leading-[1.8] text-white/65"}>{line}</p>)}</div>
            {voice.available && <p className="mt-4 text-[10px] text-white/50">Synthetic read-aloud · original audio is in the media panel.</p>}

            <div className="mt-7">
              {!hasActed && !last ? <button type="button" data-memory-action onClick={() => setActed(previous => [...previous, index])} className="group flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl border border-[#bdaaff]/45 bg-violet/10 px-5 py-4 text-left text-sm font-semibold leading-relaxed hover:bg-violet/20"><span><span className="mb-1 block font-mono text-[9px] font-normal uppercase tracking-[0.18em] text-[#c1b4ff]">Explore the mechanism</span>{chapter.action}</span><ArrowRight className="h-5 w-5 shrink-0" /></button> : <>{!last && <p role="status" className="mb-4 border-l-2 border-[#bdaaff] pl-4 text-sm leading-relaxed text-[#d0c3ff]">{chapter.result}</p>}<button type="button" data-memory-next onClick={() => last ? finish() : goTo(index + 1)} className="eagle-reply flex min-h-16 w-full items-center justify-between gap-5 rounded-2xl bg-violet px-5 py-4 text-left text-sm font-semibold leading-relaxed hover:bg-violet-deep"><span>{chapter.next}</span><ArrowRight className="h-5 w-5 shrink-0" /></button></>}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">{index > 0 ? <button type="button" onClick={() => goTo(index - 1)} className="inline-flex min-h-11 items-center gap-2 text-xs text-white/60 hover:text-white"><ArrowLeft className="h-3.5 w-3.5" />Previous memory</button> : <span />}<a href={chapter.source} target="_blank" rel="noopener noreferrer" className="py-3 text-xs text-[#c1b4ff] underline underline-offset-4">Read this memory’s source ↗</a></div>
          </motion.section>
        </div>
        <footer className="mx-auto max-w-[1440px] border-t border-white/10 px-5 py-6 sm:px-9 lg:px-12"><details className="text-xs text-white/55"><summary className="cursor-pointer py-2">About the historical playback &amp; sources</summary><p className="mt-3 max-w-3xl leading-relaxed">The HUD shows archived event references and hardware facts. It does not show live lunar telemetry. Scene-specific heart rate, temperature, pressure, and velocity are not supplied as synchronized measurements. Mechanical diagrams illustrate the engineering and are not flight controls. NASA does not endorse this project.</p><ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">{sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#c1b4ff] hover:underline">{source.label} ↗</a></li>)}</ul></details></footer>
      </>}
    </div>
  );
}
