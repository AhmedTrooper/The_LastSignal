"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { EagleMemory } from "@/lib/eagle-story";
import { EMPTY_EAGLE_PROGRESS, readEagleProgress } from "@/lib/eagle-progress";
import { EAGLE_INVITATIONS, type EaglePerspective } from "@/lib/eagle-perspectives";
import { eagleIllustrationContext } from "@/lib/eagle-lessons";
import { ArrowLeft, ArrowRight, Close } from "@/app/components/icons";
import EagleJourneyNav from "@/app/components/profile/eagle-journey-nav";
import EagleLearningLens from "@/app/components/profile/eagle-learning-lens";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";
import { useEagleVoice } from "@/app/components/profile/use-eagle-voice";
import EagleMechanism from "./eagle-mechanism";
import EagleTelemetry from "./eagle-telemetry";
import EagleMemoryMedia from "./eagle-memory-media";
import { useEagleStoryLink } from "./use-eagle-story-link";
import EagleLandingGame from "./eagle-landing-game";
import "./eagle-journey.css";

type Props = { slug: string; name: string; chapters: EagleMemory[]; sources: { label: string; url: string }[] };

export default function EagleStory({ slug, name, chapters, sources }: Props) {
  const [progress, setProgress] = useState(EMPTY_EAGLE_PROGRESS);
  const [restored, setRestored] = useState(false);
  const [pauseSignal, setPauseSignal] = useState(0);
  const [perspective, setPerspective] = useState<EaglePerspective | null>(null);
  const saveKey = useRef("");
  const heading = useRef<HTMLHeadingElement>(null);
  const mechanism = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);
  const reduced = useReducedMotion();
  const { index, furthest, acted } = progress;
  const memory = chapters[index];
  const invitation = EAGLE_INVITATIONS[memory.id];
  const view = perspective?.view ?? "illustration";
  const voice = useEagleVoice(memory.id);
  const stopVoice = voice.stop;
  const last = index === chapters.length - 1;
  const hasActed = acted.includes(index);
  const consoleHref = `/heroes/${slug}`;
  const link = useEagleStoryLink(index, chapters.length, memory.title, consoleHref);

  useEffect(() => {
    const visit = new URLSearchParams(window.location.search).get("visit") ?? "direct";
    saveKey.current = `tls:eagle:playback:v2:${visit}`;
    let saved = EMPTY_EAGLE_PROGRESS;
    try { saved = readEagleProgress(sessionStorage.getItem(saveKey.current), chapters.length); } catch { /* Persistence is optional. */ }
    const frame = requestAnimationFrame(() => { setProgress(saved); setRestored(true); });
    return () => cancelAnimationFrame(frame);
  }, [chapters.length]);

  useEffect(() => {
    if (!restored) return;
    try { sessionStorage.setItem(saveKey.current, JSON.stringify(progress)); } catch { /* Playback works without storage. */ }
  }, [progress, restored]);

  useEffect(() => {
    if (!shouldFocus.current) return;
    const frame = requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" }); });
    return () => cancelAnimationFrame(frame);
  }, [index, reduced]);

  const goTo = (next: number) => {
    if (next < 0 || next >= chapters.length) return;
    voice.stop();
    setPerspective(null);
    shouldFocus.current = true;
    setProgress(previous => ({ ...previous, index: next, furthest: Math.max(previous.furthest, next) }));
  };
  const engage = useCallback(() => setProgress(previous => previous.acted.includes(index) ? previous : { ...previous, acted: [...previous.acted, index] }), [index]);
  const choose = (choice: EaglePerspective) => {
    voice.stop();
    setPerspective(choice);
    if (choice.view === "photo") engage();
  };
  const mediaPlayed = useCallback(() => { stopVoice(); engage(); }, [stopVoice, engage]);
  const finish = () => { voice.stop(); setPauseSignal(n => n + 1); link.finish(); };

  return (
    <div className="eagle-story eagle-blackbox eagle-kid-journey min-h-dvh text-[#30243d]" data-scene={memory.id}>
      <EagleJourneyNav branded />
      <header className="border-b border-white/10 px-5 pt-5 sm:px-9 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 pb-4">
          <Link href={consoleHref} className="flex items-center gap-3"><span className="font-mono text-[11px] uppercase tracking-[0.16em]">Eagle&apos;s journey<span className="mt-1 block text-[9px] tracking-[0.12em] text-[#796780]">One mission. Eight hardware memories.</span></span></Link>
          <div className="flex items-center gap-4"><span role="status" className="hidden items-center gap-2 font-mono text-[10px] text-white/60 sm:flex"><span className={`h-1.5 w-1.5 rounded-full ${link.linked ? "bg-[#c1b4ff]" : "bg-white/35"}`} />{link.linked ? "Eagle is waiting in your other tab" : "Explore at your own pace"}</span><Link href={consoleHref} className="eagle-utility" aria-label="Leave the story and open Eagle’s comic"><Close className="h-4 w-4" /><span className="hidden sm:inline">Back to Eagle</span></Link></div>
        </div>
        <nav aria-label="Story memories" className="mx-auto grid max-w-[1440px] grid-cols-8 gap-1 sm:gap-2">
          {chapters.map((chapter, i) => <button type="button" key={chapter.id} onClick={() => goTo(i)} disabled={i > furthest} aria-current={i === index ? "step" : undefined} aria-label={`Memory ${i + 1}: ${chapter.title}`} className={`eagle-scene-tab ${i === index ? "is-current" : ""} ${i < index ? "is-past" : ""}`}><span className="font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span><span className="hidden text-[10px] leading-tight lg:block">{chapter.phase}</span></button>)}
        </nav>
      </header>

      {link.done ? <section className="mx-auto max-w-xl px-5 py-24"><p className="eagle-eyebrow">All eight memories recovered</p><h1 className="display mt-5 text-5xl">Thank you for listening.</h1><p className="mt-6 text-[#796781]">{link.linked ? "Your other tab knows you finished. Returning to Eagle…" : "Opening Eagle’s comic…"}</p><a href={`${consoleHref}?storyCompleted=true`} className="eagle-utility mt-6">Back to Eagle <ArrowRight /></a></section> : (
        <div className="mx-auto max-w-[1536px] px-5 pb-8 sm:px-9 lg:px-12">
          <details className="group my-4 rounded-lg border border-white/10 bg-white/[0.015]"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 font-mono text-[10px] text-white/55"><span>{memory.date} <span className="ml-3 text-[#c1b4ff]">{memory.get ? `${memory.get} GET` : memory.phase}</span></span><span>Mission record <span aria-hidden="true" className="ml-2">+</span></span></summary><EagleTelemetry key={memory.id} memory={memory} /></details>
          <div className="grid gap-7 pb-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-12 lg:gap-y-6">
            <div className="order-2 min-w-0 lg:order-1 lg:row-span-2">
              <motion.div key={memory.id} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <div ref={mechanism} className="scroll-mt-5"><EagleMemoryMedia key={`${memory.id}-${perspective?.photoIndex ?? 0}`} memory={memory} onPlay={mediaPlayed} pauseSignal={pauseSignal} view={view} onViewChange={next => choose({ label: next, view: next, reply: "Take your time. There’s more than one way to explore this memory." })} initialPhoto={perspective?.photoIndex ?? 0} illustration={<figure className="eagle-journey-illustration"><EagleIssueArt scene={memory.lesson.art} /><figcaption>AI-assisted story art. {eagleIllustrationContext(memory.id)} Original media is in its own tabs.</figcaption></figure>} game={memory.id === "touchdown" ? <EagleLandingGame compact onLanded={engage} /> : undefined} mechanism={!last ? <EagleMechanism key={memory.id} kind={memory.trigger} engaged={hasActed} action={memory.action!} result={memory.result!} onEngage={engage} /> : undefined} /></div>
              </motion.div>
            </div>

            <motion.section key={`narration-${memory.id}`} aria-labelledby="eagle-memory-title" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="eagle-journey-dialogue order-1 min-w-0 lg:col-start-2 lg:row-start-1 lg:pt-1">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="eagle-eyebrow text-[#c1b4ff]!">Memory {String(index + 1).padStart(2, "0")} <span className="text-white/35">/ {String(chapters.length).padStart(2, "0")}</span></p>{voice.available && <button type="button" className="eagle-utility" aria-pressed={voice.speaking} onClick={() => { if (voice.speaking) voice.stop(); else { setPauseSignal(n => n + 1); voice.start(`${memory.title} ${perspective?.reply ?? invitation.line}`); } }}>{voice.speaking ? "Stop narration" : "Hear Eagle"}</button>}</div>
              <h1 ref={heading} id="eagle-memory-title" tabIndex={-1} className="display max-w-[13ch] text-[clamp(2.9rem,4.8vw,4.8rem)] text-balance outline-none">{memory.title}</h1>
              <p className="mt-6 text-[18px] leading-[1.75] text-white/85">{invitation.line}</p>
              {!last && <div className="mt-6"><p className="mb-3 text-sm font-semibold text-[#d8c8ff]">{invitation.question}</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{invitation.choices.map(choice => <button type="button" key={choice.label} aria-pressed={perspective?.label === choice.label} onClick={() => choose(choice)} className={`eagle-story-choice ${perspective?.label === choice.label ? "is-selected" : ""}`}><span>{choice.label}</span><ArrowRight className="h-4 w-4 shrink-0" /></button>)}</div></div>}
              {perspective && <p role="status" className="mt-5 border-l-2 border-[#bdaaff]/45 pl-4 text-sm leading-[1.8] text-[#d9cffa]">{perspective.reply}</p>}
              <div className="mt-5"><EagleLearningLens memory={memory.id} compact /></div>
              <details className="eagle-engineering group mt-6"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-xs font-semibold"><span>Tell me a little more</span><span aria-hidden="true" className="text-lg text-[#c1b4ff] group-open:rotate-45">+</span></summary><div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-3">{memory.speech.slice(1).map(line => <p key={line} className="text-xs leading-[1.8] text-white/65">{line}</p>)}<h2 className="pt-2 text-sm font-semibold text-[#d4c6ff]">{memory.detail.title}</h2><p className="text-xs leading-[1.8] text-white/65">{memory.detail.text}</p><a href={memory.source} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center text-xs text-[#c1b4ff] underline underline-offset-4">Read the mission record ↗</a></div></details>
            </motion.section>
              <div className="order-3 lg:col-start-2 lg:row-start-2">
                <button type="button" data-memory-next onClick={() => { if (last) finish(); else { engage(); goTo(index + 1); } }} className="eagle-reply flex min-h-16 w-full items-center justify-between gap-4 rounded-xl bg-violet px-5 py-4 text-left text-sm font-semibold leading-relaxed hover:bg-violet-deep"><span>{memory.next}</span><ArrowRight className="h-5 w-5 shrink-0" /></button><p className="mt-3 text-xs text-[#796780]">Read, listen, or try the hardware. You can continue at your own pace.</p>
                <div className="mt-3 flex items-center justify-between gap-3">{index > 0 ? <button type="button" onClick={() => goTo(index - 1)} className="inline-flex min-h-11 items-center gap-2 text-xs text-white/60 hover:text-white"><ArrowLeft className="h-3.5 w-3.5" />Previous memory</button> : <span className="py-3 font-mono text-[9px] text-white/40">LM-5 / APOLLO 11</span>}<span className="text-[10px] text-white/45">{last ? "The story comes home" : "At your pace. No timer."}</span></div>
              </div>
          </div>

          <footer className="border-t border-white/10 py-5 text-[11px] leading-relaxed text-white/50">
            <div className="flex flex-wrap items-center justify-between gap-4"><p className="max-w-xl">Eagle’s first-person voice is an interpretation of the mission record. Read-aloud uses a synthetic voice; archive players contain original recordings.</p><Link href={`/heroes/${slug}/movie`} className="eagle-utility">Watch the photographic film <ArrowRight className="h-3.5 w-3.5" /></Link></div>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3"><details><summary className="cursor-pointer py-2">Historical sources &amp; credits</summary><p className="mt-2">{name} · Apollo Lunar Module LM-5 · An independent exhibit. NASA does not endorse this project.</p><ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#c1b4ff] hover:underline">{source.label} ↗</a></li>)}</ul></details><button type="button" onClick={() => { voice.stop(); setPerspective(null); shouldFocus.current = true; setProgress(EMPTY_EAGLE_PROGRESS); }} className="min-h-10 text-xs text-white/60 hover:text-white">Restart from memory 1</button></div>
          </footer>
        </div>
      )}
    </div>
  );
}
