"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EAGLE_RECORD_URL, type ConsoleData, type ConsoleStage } from "@/lib/console";
import { connectEagle, readEagleStatus } from "@/lib/eagle-link";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, ArrowRight, BookIcon, ClockIcon, MapIcon, Play, RoverIcon, RouteIcon } from "@/app/components/icons";
import ModelStudio, { type StudioPart, type StudioSource } from "./model-studio";
import EagleMediaPlayer from "./eagle-media-player";
import EagleMissionPanel from "./eagle-mission-panel";
import { useEagleVoice } from "./use-eagle-voice";
import { useEagleFullscreen } from "./use-eagle-fullscreen";
import EagleCharacter from "./eagle-character";
import "./eagle-kids.css";

type Props = { data: ConsoleData; slug: string; name: string; model: StudioSource; parts: StudioPart[]; poster: string; posterAlt: string };
export type EagleConsoleProps = Props;
const BANK_PREFIX: [string, string][] = [["body_", "body"], ["work_", "work"], ["voices_", "voices"], ["film_", "film"], ["photo_", "photos"], ["rest_", "rest"], ["test_", "test"]];
const bankFor = (id: string) => BANK_PREFIX.find(([prefix]) => id.startsWith(prefix))?.[1];
const BANK_ICONS = { body: RoverIcon, work: RouteIcon, voices: SignalWave, film: Play, photos: BookIcon, rest: MapIcon, test: ClockIcon };
const MEMORY_LABELS: Record<string, { title: string; line: string }> = {
  body: { title: "Explore my parts", line: "Tap a part. Find out what it did." },
  work: { title: "What did we discover?", line: "A mirror, a listener, and a little science." },
  voices: { title: "Hear the real voices", line: "Listen to the original mission recordings." },
  film: { title: "Look through our cameras", line: "Watch the original films from space." },
  photos: { title: "Open my photo album", line: "A footprint. A ladder. A message that stayed." },
  rest: { title: "What stayed on the Moon?", line: "Find the equipment the crew left behind." },
  test: { title: "Be my mission teammate", line: "Work through a few decisions with me." },
};

export function SignalWave({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true"><path d="M2 10v4m5-8v12m5-16v20m5-14v8m5-11v14m5-9v4m3-6v8" /></svg>;
}

export default function EagleConsole({ data, slug, name, model, parts, poster, posterAlt }: Props) {
  const [beatId, setBeatId] = useState(data.start);
  const [reply, setReply] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const [part, setPart] = useState<StudioPart | null>(null);
  const [story, setStory] = useState<{ scene: number; total: number; title: string } | null>(null);
  const [storyClosed, setStoryClosed] = useState(false);
  const [pauseMedia, setPauseMedia] = useState(0);
  const [modelView, setModelView] = useState<"character" | "model">("character");
  const session = useRef("");
  const heading = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);
  const voice = useEagleVoice(beatId);
  const { ref, fullscreen, toggle } = useEagleFullscreen();
  const reduced = useReducedMotion();
  const { user } = useAuth();
  const atHub = beatId === "hub";
  const greeting = ["arrival", "introduction", "connection"].includes(beatId);
  const beat = atHub ? null : data.beats[beatId];
  const stage = beat?.stage;
  const bank = bankFor(beatId);
  const records = Object.values(data.beats).filter(b => bank && bankFor(b.id) === bank).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const recordIndex = records.findIndex(b => b.id === beatId);
  const title = atHub ? "Pick a memory, teammate." : beat?.title ?? beat?.hint ?? "Let me show you.";
  const speech = atHub ? data.hub.speech : beat?.speech ?? [];
  const cta = beat?.cta;
  const ctaReady = stage?.kind !== "quiz" || correct;
  const activeBank = data.banks.find(b => b.id === bank);

  const goToBeat = useCallback((id: string, answer = "") => {
    setBeatId(id);
    setReply(answer);
    setPicked(null);
    setCorrect(false);
    setPart(null);
    shouldFocus.current = true;
    const nextBank = bankFor(id);
    if (nextBank) setVisited(previous => previous.includes(nextBank) ? previous : [...previous, nextBank]);
  }, []);

  useEffect(() => {
    if (!shouldFocus.current) return;
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      ref.current?.scrollTo({ top: 0, behavior: "instant" });
      if (!document.fullscreenElement) ref.current?.scrollIntoView({ block: "start", behavior: reduced ? "instant" : "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [beatId, reduced, ref]);

  useEffect(() => {
    try { session.current = sessionStorage.getItem("tls:eagle:story-session") ?? ""; } catch { /* Optional continuity. */ }
    const link = connectEagle(message => {
      if (!session.current || message.session !== session.current) return;
      if (message.type === "SCENE_PROGRESS") {
        setStory({ scene: message.scene!, total: message.total!, title: message.title! }); setStoryClosed(false);
        link.send({ type: "CONSOLE_READY", session: message.session, machineId: "apollo-11-lander" });
      }
      if (message.type === "STORY_CLOSED") { setStory(null); setStoryClosed(true); }
      if (message.type === "STORY_COMPLETED") {
        setStory(null); setStoryClosed(false); goToBeat("story_returned");
        link.send({ type: "STORY_ACK", session: message.session, machineId: "apollo-11-lander" });
      }
    });
    const requestStatus = () => {
      if (session.current) link.send({ type: "STATUS_REQUEST", session: session.current, machineId: "apollo-11-lander" });
    };
    const query = new URLSearchParams(window.location.search);
    let restoreFrame: number | undefined;
    if (query.get("storyCompleted") === "true" || readEagleStatus(session.current)?.type === "STORY_COMPLETED") {
      restoreFrame = requestAnimationFrame(() => goToBeat("story_returned"));
      query.delete("storyCompleted");
      const search = query.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`);
    }
    requestStatus();
    window.addEventListener("focus", requestStatus);
    return () => { if (restoreFrame !== undefined) cancelAnimationFrame(restoreFrame); link.close(); window.removeEventListener("focus", requestStatus); };
  }, [goToBeat]);

  const openArchive = async () => {
    if (fullscreen) await toggle();
    window.dispatchEvent(new Event("tls:open-archive"));
    requestAnimationFrame(() => document.getElementById("archive")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" }));
  };
  const continueConversation = () => {
    if (!cta) return;
    voice.stop();
    if ("next" in cta) goToBeat(cta.next, cta.label);
    else if (cta.action === "archive") void openArchive();
    else goToBeat(cta.action === "restart" ? data.start : "story_opened");
  };
  const openStory = (event: MouseEvent<HTMLAnchorElement>) => {
    const id = crypto.randomUUID();
    session.current = id;
    try { sessionStorage.setItem("tls:eagle:story-session", id); } catch { /* The channel works without persistence. */ }
    event.currentTarget.href = `/heroes/${slug}/story?visit=${id}`;
    setStoryClosed(false); voice.stop(); goToBeat("story_opened");
  };

  const renderStage = () => {
    if (!stage || stage.kind === "model") return (
      <div className="eagle-visual-board">
        <div className="eagle-visual-tabs" role="group" aria-label="Choose a view of Eagle"><button type="button" aria-pressed={modelView === "character"} onClick={() => setModelView("character")}>{bank === "body" ? "Tap my parts" : "Storybook Eagle"}</button><button type="button" aria-pressed={modelView === "model"} onClick={() => setModelView("model")}>Real 3D model</button></div>
        {modelView === "character" ? <EagleCharacter key={bank === "body" ? "parts" : "character"} interactive={bank === "body"} greeting={greeting} /> : <div className="eagle-real-model"><p className="px-5 pt-5 text-xs text-[#725784]">The actual spacecraft design · NASA 3D Resources</p><ModelStudio name={name} model={model} parts={parts} poster={poster} posterAlt={posterAlt} stage="light" compact immersive showMarkers onPartSelect={setPart} /><p className="border-t border-[#e1d6e6] px-5 py-4 text-xs leading-relaxed text-[#74697b]">Both stages shown together. The landing stage is the part left on the Moon.</p></div>}
      </div>
    );
    if (stage.kind === "media") return <EagleMediaPlayer key={beatId} media={stage.media} onPlay={voice.stop} pauseSignal={pauseMedia} />;
    if (stage.kind === "mission") return <EagleMissionPanel key={beatId} mission={stage.mission} />;
    if (stage.kind === "photo") return <figure className="overflow-hidden rounded-2xl border border-white/15 bg-[#17142a] text-white"><div className="relative aspect-[4/3]"><Image src={stage.photo.src} alt={stage.photo.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain" /></div><figcaption className="flex items-start justify-between gap-4 border-t border-white/10 p-4 text-xs leading-relaxed text-white/65"><span>{stage.photo.ai ? "AI-generated placeholder" : `${stage.photo.title} · ${stage.photo.credit}`}</span>{!stage.photo.ai && <a href={stage.photo.source} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[#c1b4ff] underline underline-offset-4">Source ↗</a>}</figcaption></figure>;
    if (stage.kind === "video") return <ArchiveVideo key={beatId} video={stage.video} onPlay={voice.stop} />;
    if (stage.kind === "specs") return <div className="rounded-2xl border border-white/15 bg-[#17142a] p-5 text-white sm:p-7"><p className="eagle-eyebrow">Inside the mission record</p><h3 className="display mt-3 text-3xl">{beat?.hint ?? "The details I kept."}</h3><dl className="mt-6 divide-y divide-white/10">{stage.rows.map(row => <div key={row.label} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-4"><dt className="text-xs leading-relaxed text-white/60">{row.label}</dt><dd className="text-sm leading-relaxed text-white/90">{row.value}</dd></div>)}</dl><a href={EAGLE_RECORD_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-xs text-[#c1b4ff] underline underline-offset-4">Explore the Apollo Lunar Surface Journal ↗</a></div>;
    if (stage.kind === "transcript") return <div className="rounded-2xl border border-[#e1d5de] bg-white p-6"><p className="eagle-kid-eyebrow">Archived words</p>{stage.lines.map((line, i) => <blockquote key={i} className="mt-5"><p className="font-mono text-xs text-[#78548f]">{line.who}</p><p className="mt-2 text-xl leading-relaxed">“{line.text}”</p></blockquote>)}</div>;
    return <div className="eagle-quiz rounded-2xl border border-[#e1d5c3] bg-white p-5 sm:p-7"><p className="eagle-kid-eyebrow">Mission Control · no timer, no penalty</p><h3 className="mt-4 text-xl font-semibold leading-snug">{stage.question}</h3><div className="mt-6 space-y-3">{stage.options.map((option, i) => <button type="button" key={option.label} onClick={() => { setPicked(i); if (option.correct) setCorrect(true); }} disabled={correct} aria-pressed={picked === i} className={`flex w-full gap-4 rounded-xl border p-4 text-left text-sm leading-relaxed transition-colors disabled:cursor-default ${picked === i ? option.correct ? "border-emerald-500/60 bg-emerald-100/60" : "border-amber-500/60 bg-amber-100/60" : "border-[#ded3e2] hover:border-[#9d79b3] hover:bg-[#f8f0fc]"}`}><span className="font-mono text-[#82728c]">{String.fromCharCode(65 + i)}</span><span>{option.label}</span></button>)}</div><div aria-live="polite">{picked !== null && <p className={`mt-5 text-sm leading-relaxed ${correct ? "text-emerald-800" : "text-amber-900"}`}><strong>{correct ? "That’s it. " : "Let’s think again. "}</strong>{stage.options[picked].feedback}</p>}</div></div>;
  };

  return (
    <div ref={ref} className={`eagle-experience eagle-kids relative isolate scroll-mt-20 ${fullscreen ? "eagle-fullscreen" : "min-h-[calc(100dvh-77px)]"}`}>
      <div className="eagle-atmosphere pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto flex min-h-[inherit] w-full max-w-[1440px] flex-col px-5 py-5 sm:px-9 lg:px-14 lg:py-7">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7dccb] pb-5">
          <div><p className="eagle-kid-eyebrow">Your new Moon teammate</p><p className="mt-1 text-sm font-semibold">Eagle <span className="font-normal text-[#84728d]">/ Apollo 11</span></p></div>
          <div className="flex items-center gap-2"><a href={`/heroes/${slug}/story`} target="_blank" rel="noopener noreferrer" onClick={openStory} className="eagle-utility"><BookIcon className="h-4 w-4" />My story ↗</a><button type="button" onClick={toggle} data-fullscreen-toggle aria-pressed={fullscreen} className="eagle-utility"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true"><path d={fullscreen ? "M8 3v5H3m13-5v5h5M3 16h5v5m13-5h-5v5" : "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"} /></svg>{fullscreen ? "Exit focus" : "Focus mode"}</button></div>
        </header>

        {story && <div role="status" className="eagle-story-status mt-4 overflow-hidden rounded-lg border border-[#d7c0e2] bg-[#f0e3f8]"><p className="px-4 py-3 text-sm text-[#705480]">Your adventure in the other tab · memory {story.scene}/{story.total} — {story.title}</p><div className="h-0.5 bg-[#e0d0e9]" aria-hidden="true"><div className="h-full bg-[#9573ad] transition-[width] duration-300" style={{ width: `${story.scene / story.total * 100}%` }} /></div></div>}

        <div className={`grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 ${atHub ? "lg:py-8" : "lg:py-12"}`}>
          <div className="order-1 min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={!stage || stage.kind === "model" ? "model" : beatId} initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                {renderStage()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="eagle-dialogue order-2 min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="eagle-kid-eyebrow">{greeting ? "A little hello from the Moon" : activeBank ? `${MEMORY_LABELS[activeBank.id]?.title ?? activeBank.label} · ${recordIndex + 1} / ${records.length}` : atHub ? "Choose your next adventure" : "Back with your Moon teammate"}</span>
              {voice.available && <button type="button" className="eagle-utility" aria-pressed={voice.speaking} onClick={() => { if (voice.speaking) voice.stop(); else { setPauseMedia(n => n + 1); voice.start(`${title} ${speech.join(" ")}`); } }}><SignalWave className="h-4 w-4" />{voice.speaking ? "Stop voice" : "Hear Eagle"}</button>}
            </div>
            <motion.div key={beatId} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}>
              {reply && <p className="mb-5 border-l-2 border-[#c9b2d6] pl-3 text-xs italic leading-relaxed text-[#7c6b85]">You · {reply}</p>}
              {beatId === "arrival" && user?.displayName && <p className="mb-3 text-sm text-[#725188]">Welcome, {user.displayName.split(" ")[0]}.</p>}
              <h1 ref={heading} tabIndex={-1} className={`display max-w-[13ch] text-balance outline-none ${greeting ? "text-[clamp(2.75rem,5.4vw,5.25rem)]" : "text-[clamp(2.4rem,4.2vw,4rem)]"}`}>{title}</h1>
              <div className="mt-6 space-y-4">
                {speech.slice(0, 2).map((line, i) => <motion.p key={line} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.08 + i * 0.1, duration: 0.4 }} className={i === 0 ? "text-[18px] leading-[1.7] text-[#40394d]" : "text-[15px] leading-[1.8] text-[#74667d]"}>{line}</motion.p>)}
                {speech.length > 2 && <details className="text-sm leading-relaxed text-[#74667d]"><summary className="cursor-pointer py-2">Tell me a little more</summary>{speech.slice(2).map(line => <p key={line} className="mt-3">{line}</p>)}</details>}
              </div>
              {part && <p role="status" className="mt-5 rounded-xl border border-[#d7c0e0] bg-[#f2e8f7] p-4 text-sm leading-relaxed text-[#695074]">You found my <strong>{part.label.toLowerCase()}</strong>. {part.text}</p>}
              {storyClosed && beatId === "story_opened" && <p role="status" className="mt-4 text-sm text-[#74667d]">Your story tab has closed. We can keep exploring here.</p>}
              {cta && <button type="button" data-conversation-next onClick={continueConversation} disabled={!ctaReady} className="eagle-reply group mt-8 flex min-h-16 w-full items-center justify-between gap-5 rounded-2xl bg-violet px-5 py-4 text-left text-sm font-semibold leading-relaxed transition-colors hover:bg-violet-deep disabled:cursor-default disabled:bg-white/10 disabled:text-white/45"><span><span className="mb-1 block font-mono text-[9px] font-normal uppercase tracking-[0.2em] text-white/60">Your reply</span>{ctaReady ? cta.label : "Choose an answer beside me to continue."}</span><ArrowRight className="h-5 w-5 shrink-0" /></button>}
              {greeting && <button type="button" onClick={() => { voice.stop(); goToBeat("hub"); }} className="mt-4 min-h-11 text-xs font-semibold text-[#72518b]">I’m curious—let’s explore your memories →</button>}
              {voice.available && <p className="mt-3 text-[10px] leading-relaxed text-[#74667d]">Read-aloud is a synthetic voice. Original recordings are in my audio memories.</p>}
            </motion.div>
          </div>
        </div>

        {atHub && (
          <div className="pb-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="eagle-kid-eyebrow">Something to see, hear, and try</p>
              <span className="text-xs text-[#74667d]">{visited.length} of {data.banks.length} memory collections explored</span>
            </div>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {data.banks.map((item, i) => {
                const Icon = BANK_ICONS[item.id as keyof typeof BANK_ICONS] ?? BookIcon;
                return (
                  <motion.button
                    type="button" key={item.id}
                    initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : i * 0.035 }}
                    onClick={() => goToBeat(item.first)} className="eagle-memory group"
                  >
                    <div className="mb-4 flex items-center justify-between text-[#7a5791]">
                      <Icon className="h-5 w-5" />
                      <span className="font-mono text-[10px] text-[#74667d]">{visited.includes(item.id) ? "Explored" : item.meta}</span>
                    </div>
                    <span className="block text-sm font-semibold">{MEMORY_LABELS[item.id]?.title ?? item.label}</span>
                    <span className="mt-2 block text-xs leading-relaxed text-[#74667d]">{MEMORY_LABELS[item.id]?.line ?? item.line}</span>
                  </motion.button>
                );
              })}
              <a
                href={`/heroes/${slug}/story`} target="_blank" rel="noopener noreferrer"
                onClick={openStory}
                className="eagle-memory eagle-story-memory"
              >
                <div className="mb-4 flex items-center justify-between text-[#7a5791]">
                  <BookIcon className="h-5 w-5" /><span className="font-mono text-[10px]">NEW TAB ↗</span>
                </div>
                <span className="block text-sm font-semibold">Come on my adventure</span>
                <span className="mt-2 block text-xs leading-relaxed text-[#74667d]">Eight memories. Let’s discover what happened.</span>
              </a>
              <a
                href={`/heroes/${slug}/movie`} target="_blank" rel="noopener noreferrer"
                onClick={() => { voice.stop(); goToBeat("movie_opened"); }}
                className="eagle-memory eagle-film-memory"
              >
                <div className="mb-4 flex items-center justify-between text-[#7a5791]">
                  <Play className="h-5 w-5" /><span className="font-mono text-[10px]">PHOTOGRAPHIC FILM ↗</span>
                </div>
                <span className="block text-sm font-semibold">Watch my picture story</span>
                <span className="mt-2 block text-xs leading-relaxed text-[#74667d]">Real photographs, a little narration, and original film reels.</span>
              </a>
            </div>
            <div className="eagle-play-invitation mt-5"><div><p className="text-sm font-bold">Can you find a place for my feet?</p><p className="mt-1 text-xs leading-relaxed text-[#74667d]">Try a simplified 3D landing. The real crew’s story is in the archive.</p></div><a href="/games/apollo-11-landing" target="_blank" rel="noopener noreferrer" className="eagle-utility">Take the controls <ArrowRight className="h-4 w-4" /></a></div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#74667d]">
              <button type="button" onClick={openArchive} className="py-3 hover:text-[#73518c]">Want the deeper details? Open the mission record ↓</button>
            </div>
          </div>
        )}

        {!greeting && !atHub && <nav aria-label="Memory navigation" className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7dccb] py-5">{recordIndex > 0 ? <button type="button" onClick={() => goToBeat(records[recordIndex - 1].id)} className="eagle-utility"><ArrowLeft className="h-4 w-4" />Previous memory</button> : <span />}<button type="button" onClick={() => goToBeat("hub")} className="eagle-utility">All my memories <span aria-hidden="true">↗</span></button></nav>}
        <footer className="flex flex-wrap items-start justify-between gap-3 border-t border-[#e7dccb] pt-5 text-[11px] leading-relaxed text-[#74667d]">
          <details className="max-w-xl">
            <summary className="cursor-pointer py-2">About this conversation</summary>
            <p className="mt-2 leading-relaxed">Eagle’s imagined first-person voice is inspired by the mission record. It is not an original transmission. Historical recordings and quoted words are identified separately.</p>
          </details>
           <a href={EAGLE_RECORD_URL} target="_blank" rel="noopener noreferrer" className="py-2 text-[#73518c] hover:underline">Read the historical sources ↗</a>
        </footer>
      </div>
    </div>
  );
}

function ArchiveVideo({ video, onPlay }: { video: Extract<ConsoleStage, { kind: "video" }>["video"]; onPlay: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const command = (func: string) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "https://www.youtube-nocookie.com");
  return <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/30"><div className="relative aspect-video bg-black">{loaded ? <iframe ref={frame} src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&enablejsapi=1`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full" /> : <button type="button" onClick={() => { onPlay(); setLoaded(true); }} className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-5"><Play className="h-12 w-12 text-[#c1b4ff]" /><span className="text-sm">Watch {video.title}</span></button>}</div><div className="p-5"><h3 className="text-lg font-semibold">{video.title}</h3><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { onPlay(); if (loaded) command("playVideo"); else setLoaded(true); }} className="eagle-utility"><Play className="h-4 w-4" />Watch</button><button type="button" disabled={!loaded} onClick={() => command("pauseVideo")} className="eagle-utility disabled:opacity-40">Ⅱ Pause</button><a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="ml-auto py-3 text-xs text-[#c1b4ff] underline">{video.channel} · source ↗</a></div></div></div>;
}
