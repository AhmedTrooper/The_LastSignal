"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { EagleMemory } from "@/lib/eagle-story";
import { EAGLE_FILMS } from "@/lib/eagle-media";
import { ArrowLeft, ArrowRight, Close, Play } from "@/app/components/icons";
import { SignalMark } from "@/app/components/logo";
import EagleMediaPlayer from "@/app/components/profile/eagle-media-player";
import { useEagleVoice } from "@/app/components/profile/use-eagle-voice";

const SECONDS_PER_SCENE = 18;

/** Apollo-only photographic film, using the same narrative record as the interactive story. */
export default function EagleFilm({ memories }: { memories: EagleMemory[] }) {
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reel, setReel] = useState(0);
  const [pauseMedia, setPauseMedia] = useState(0);
  const cursor = useRef(0);
  const total = memories.length * SECONDS_PER_SCENE;
  const index = Math.min(memories.length - 1, Math.floor(position / SECONDS_PER_SCENE));
  const memory = memories[index];
  const voice = useEagleVoice(memory.id);
  const stopVoice = voice.stop;
  const reduced = useReducedMotion();
  const pause = useCallback(() => setPlaying(false), []);
  const playArchive = useCallback(() => { pause(); stopVoice(); }, [pause, stopVoice]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      cursor.current = Math.min(total, cursor.current + (now - last) / 1000);
      last = now;
      setPosition(cursor.current);
      if (cursor.current >= total) setPlaying(false);
    }, 100);
    return () => clearInterval(timer);
  }, [playing, total]);

  useEffect(() => {
    const hide = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, [pause]);

  const seek = (seconds: number) => {
    pause(); voice.stop();
    cursor.current = Math.max(0, Math.min(seconds, total));
    setPosition(cursor.current);
  };
  const play = () => {
    voice.stop(); setPauseMedia(n => n + 1);
    if (position >= total) { cursor.current = 0; setPosition(0); }
    setPlaying(value => !value);
  };

  return (
    <div className="eagle-story eagle-film eagle-blackbox text-white" data-playing={playing && !reduced}>
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#080810]">
        {memory.photo ? <div key={memory.id} className="eagle-film-image pointer-events-none absolute inset-0 -z-10"><Image src={memory.photo.src} alt="" fill sizes="100vw" className="object-cover opacity-35 blur-sm" priority={index === 0} /><div className="absolute inset-0 bg-[linear-gradient(90deg,#080810_5%,#080810c9_50%,#08081055),linear-gradient(0deg,#080810,transparent_35%)]" /></div> : <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_50%,#302239,#080810_70%)]" />}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-9 lg:px-12"><Link href="/heroes/apollo-11-lander" className="flex items-center gap-3"><SignalMark className="h-7 w-7 text-[#c1b4ff]" /><span className="font-mono text-[10px] uppercase tracking-widest">Eagle <span className="text-white/45">/ The photographic film</span></span></Link><Link href="/heroes/apollo-11-lander" aria-label="Return to Eagle’s console" className="eagle-utility"><Close className="h-4 w-4" /></Link></header>
        <div className="mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-8 px-5 py-10 sm:px-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12">
          <div>
            <p className="eagle-eyebrow text-[#c1b4ff]!">{String(index + 1).padStart(2, "0")} / {String(memories.length).padStart(2, "0")} <span className="ml-3 text-white/50">{memory.phase}</span></p>
            <h1 className="display mt-5 max-w-[12ch] text-[clamp(3.2rem,6vw,6.8rem)] text-balance">{memory.title}</h1>
            <p className="mt-5 font-mono text-[10px] text-white/55">{memory.date}{memory.get ? ` · ${memory.get} GET` : ""}</p>
            <p className="mt-6 max-w-lg text-lg leading-[1.85] text-white/80" aria-live={playing ? "off" : "polite"}>{memory.filmText}</p>
            {voice.available && <button type="button" onClick={() => { pause(); setPauseMedia(n => n + 1); if (voice.speaking) voice.stop(); else voice.start(memory.filmText); }} className="eagle-utility mt-6" aria-pressed={voice.speaking}>{voice.speaking ? "Stop narration" : "Hear this scene"}</button>}
            <p className="mt-4 text-[10px] text-white/45">First-person interpretation · optional synthetic read-aloud</p>
          </div>
          <div key={memory.id}>
            {memory.photo ? <figure className="overflow-hidden rounded-xl border border-white/20 bg-black/50"><div className="relative aspect-[4/3]"><Image src={memory.photo.src} alt={memory.photo.alt} fill sizes="(min-width:1024px) 52vw, 100vw" className="object-contain" /></div><figcaption className="flex items-start justify-between gap-3 border-t border-white/10 p-4 text-[10px] leading-relaxed text-white/60"><span>{memory.photo.title} · {memory.photo.credit}</span><a href={memory.photo.source} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[#c1b4ff] underline">Source ↗</a></figcaption></figure> : <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-[#d1b376]/25 bg-[#0b0b10]"><span className="eagle-eyebrow text-[#d1b376]!">Guidance computer / program alarm</span><span className="mt-6 font-mono text-[clamp(6rem,14vw,11rem)] leading-none tracking-tight text-[#ead3a6]">1202</span><span className="mt-6 font-mono text-xs text-white/60">EXECUTIVE OVERFLOW · GUIDANCE PRESERVED</span><span className="mt-5 text-[10px] text-white/40">Illustrative display</span></div>}
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-6 sm:px-9 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-2"><button type="button" onClick={play} className="eagle-utility bg-[#cdbdff]! text-[#161020]! border-transparent! min-w-28" aria-pressed={playing}><Play className="h-4 w-4" />{playing ? "Pause film" : position >= total ? "Replay film" : "Play film"}</button><button type="button" aria-label="Previous film scene" disabled={index === 0} onClick={() => seek((index - 1) * SECONDS_PER_SCENE)} className="eagle-utility disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button><button type="button" aria-label="Next film scene" disabled={index === memories.length - 1} onClick={() => seek((index + 1) * SECONDS_PER_SCENE)} className="eagle-utility disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button></div><a href="#original-film" onClick={pause} className="inline-flex min-h-11 items-center gap-2 text-xs text-[#d4c4ff]">Watch the original mission reels <span aria-hidden="true">↓</span></a></div>
          <input type="range" min="0" max={total} step="0.1" value={position} onChange={event => seek(Number(event.target.value))} aria-label="Photographic film timeline" aria-valuetext={`Scene ${index + 1} of ${memories.length}: ${memory.title}`} className="eagle-audio-range mt-3 w-full" style={{ "--audio-progress": `${position / total * 100}%` } as React.CSSProperties} />
          <div className="flex justify-between gap-4 font-mono text-[9px] text-white/45"><span>PHOTOGRAPHS + STORY · SELF-PACED OR AUTOMATIC</span><span>08 MEMORIES</span></div>
        </div>
      </section>

      <section id="original-film" className="mx-auto max-w-[1440px] scroll-mt-5 px-5 py-14 sm:px-9 lg:px-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="eagle-eyebrow text-[#c1b4ff]!">The original reels</p><h2 className="display mt-3 text-4xl">Through their cameras.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">Three archival films, three points of view. Choose a reel and watch the actual mission footage with Video.js.</p></div><Link href="/heroes/apollo-11-lander/story" className="eagle-utility">Enter the interactive story <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.6fr]">
          <div className="space-y-3" role="group" aria-label="Original mission reels">{EAGLE_FILMS.map((film, i) => <button type="button" key={film.id} aria-pressed={reel === i} onClick={() => { pause(); voice.stop(); setReel(i); }} className={`eagle-memory w-full ${reel === i ? "border-[#bdaaff]/60! bg-violet/10!" : ""}`}><span className="font-mono text-[10px] text-[#c1b4ff]">REEL {String(i + 1).padStart(2, "0")}</span><span className="mt-3 block text-lg font-semibold">{film.title}</span><span className="mt-2 block text-xs leading-relaxed text-white/60">{film.perspective}</span><span className="mt-3 block font-mono text-[9px] text-white/45">{film.phase}</span></button>)}</div>
          <EagleMediaPlayer key={EAGLE_FILMS[reel].src} media={EAGLE_FILMS[reel]} onPlay={playArchive} pauseSignal={pauseMedia} />
        </div>
      </section>
    </div>
  );
}
