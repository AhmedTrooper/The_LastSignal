"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ConsoleBeat, ConsoleCta, ConsoleData, ConsoleStage } from "@/lib/console";
import { ArrowRight } from "@/app/components/icons";
import ModelStudio, { type StudioPart, type StudioSource } from "./model-studio";

const CHANNEL = "eagle_mission_link";

type Props = {
  data: ConsoleData;
  slug: string;
  name: string;
  model: StudioSource;
  parts: StudioPart[];
  poster: string;
  posterAlt: string;
};

const BANK_PREFIX: [string, string][] = [
  ["body_", "body"],
  ["work_", "work"],
  ["voices_", "voices"],
  ["film_", "film"],
  ["photo_", "photos"],
  ["rest_", "rest"],
  ["test_", "test"],
];

function bankFor(id: string) {
  for (const [prefix, bank] of BANK_PREFIX) if (id.startsWith(prefix)) return bank;
  return null;
}

/**
 * Eagle's console. One voice, one button at a time, and the real record underneath.
 * The dialogue is an interpretation; every number and quoted line comes from the mission record.
 */
export default function EagleConsole({ data, slug, name, model, parts, poster, posterAlt }: Props) {
  const [beatId, setBeatId] = useState(data.start);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [story, setStory] = useState<{ scene: number; total: number } | null>(null);

  const atHub = beatId === "hub";
  const beat: ConsoleBeat | null = atHub ? null : (data.beats[beatId] ?? data.beats[data.start] ?? null);
  const stage: ConsoleStage | null = beat?.stage ?? null;
  const activeBank = bankFor(beatId);
  const inGreeting = beatId === "arrival" || beatId === "introduction" || beatId === "connection";
  const speech = beat ? beat.speech : data.hub.speech;
  const status = beat ? beat.status : data.hub.status;
  const cta = beat?.cta ?? null;
  const ctaReady = stage?.kind !== "quiz" || correct;

  // Every beat change is a new scene: drop the quiz answer, stop the film, stop the voice.
  const goToBeat = useCallback((id: string) => {
    setBeatId(id);
    setPicked(null);
    setCorrect(false);
    setPlaying(null);
    setSpeaking(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  // The channel handler needs the current beat without being re-created on every beat.
  const beatRef = useRef(beatId);
  useEffect(() => {
    beatRef.current = beatId;
  }, [beatId]);

  // The story tab reports in over a BroadcastChannel. No account, no backend.
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (event: MessageEvent) => {
      const msg = event.data as { type?: string; scene?: number; total?: number } | null;
      if (msg?.type === "STORY_PROGRESS" && msg.scene && msg.total) setStory({ scene: msg.scene, total: msg.total });
      if (msg?.type === "STORY_CLOSED") setStory(null);
      if (msg?.type === "STORY_COMPLETED") {
        setStory(null);
        if (beatRef.current === "story_opened") goToBeat("story_returned");
      }
    };
    return () => channel.close();
  }, [goToBeat]);

  const go = useCallback(
    (next: ConsoleCta) => {
      if ("next" in next) {
        goToBeat(next.next);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [goToBeat],
  );

  const openStory = () => {
    window.open(`/heroes/${slug}/story`, "_blank", "noopener,noreferrer");
    goToBeat("story_opened");
  };

  // The movie is a standalone cinematic cut. It does not report back, so the console stays put.
  const openMovie = () => {
    window.open(`/heroes/${slug}/movie`, "_blank", "noopener,noreferrer");
  };

  const openArchive = () => {
    window.dispatchEvent(new Event("tls:open-archive"));
    requestAnimationFrame(() => document.getElementById("archive")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const startVoice = (lines: { who: string; text: string }[]) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lines.map((l) => `${l.who} said: ${l.text}`).join(" "));
    utterance.rate = 0.86;
    utterance.pitch = 0.8;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const stopVoice = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const pickAnswer = (index: number, isCorrect: boolean) => {
    setPicked(index);
    if (isCorrect) setCorrect(true);
  };

  const renderStage = () => {
    if (!stage || stage.kind === "model") {
      return <ModelStudio name={name} model={model} parts={parts} poster={poster} posterAlt={posterAlt} stage="dark" compact />;
    }

    if (stage.kind === "photo") {
      const p = stage.photo;
      return (
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
            <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 52vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-2 flex items-start justify-between gap-4 font-mono text-[10px] leading-relaxed text-white/45">
            <span className="min-w-0">{p.ai ? "AI-generated placeholder" : `${p.title} · ${p.credit}`}</span>
            {!p.ai && (
              <a href={p.source} target="_blank" rel="noopener noreferrer" className="shrink-0 text-white/60 underline hover:text-white">
                source
              </a>
            )}
          </figcaption>
        </figure>
      );
    }

    if (stage.kind === "video") {
      const v = stage.video;
      return (
        <div>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
            {playing === v.id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button onClick={() => setPlaying(v.id)} className="group absolute inset-0" aria-label={`Play video: ${v.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail */}
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                <span className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-transform group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
          <p className="mt-2 font-mono text-[10px] text-white/45">
            {v.channel} ·{" "}
            <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="text-white/60 underline hover:text-white">
              watch at the source
            </a>
          </p>
        </div>
      );
    }

    if (stage.kind === "transcript") {
      return (
        <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Archived transcript</p>
            <div className="flex gap-2">
              <button
                onClick={() => startVoice(stage.lines)}
                className="rounded-full bg-white px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink hover:bg-violet-soft"
              >
                Start
              </button>
              <button
                onClick={stopVoice}
                disabled={!speaking}
                className="rounded-full border border-white/20 px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/70 hover:border-white/50 disabled:opacity-40"
              >
                Stop
              </button>
            </div>
          </div>
          <ul className="mt-5 space-y-4">
            {stage.lines.map((line, i) => (
              <li key={`${line.who}-${i}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-violet-bright">{line.who}</p>
                <p className="mt-1 text-[17px] leading-relaxed text-white/90 sm:text-lg">&ldquo;{line.text}&rdquo;</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-[10px] leading-relaxed text-white/35">
            Synthetic voice. The words are the archived transcript, not a recording.
          </p>
        </div>
      );
    }

    if (stage.kind === "specs") {
      return (
        <dl className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/12">
          {stage.rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[110px_1fr] gap-4 px-4 py-3 sm:grid-cols-[150px_1fr] sm:px-5">
              <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-wider text-white/40">{row.label}</dt>
              <dd className="text-sm leading-relaxed text-white/90">{row.value}</dd>
            </div>
          ))}
        </dl>
      );
    }

    // Quiz.
    return (
      <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Question</p>
        <p className="mt-2 text-lg leading-snug text-white sm:text-xl">{stage.question}</p>
        <div className="mt-5 space-y-2">
          {stage.options.map((option, i) => {
            const chosen = picked === i;
            const reveal = chosen || (correct && option.correct);
            const tone = reveal
              ? option.correct
                ? "border-emerald-400/60 bg-emerald-400/10"
                : "border-red-400/50 bg-red-400/10"
              : "border-white/12 hover:border-white/35 hover:bg-white/[0.04]";
            return (
              <button
                key={option.label}
                onClick={() => pickAnswer(i, option.correct)}
                disabled={correct}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-default ${tone}`}
              >
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-[10px] text-white/40">{String.fromCharCode(65 + i)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-relaxed text-white/90">{option.label}</span>
                    {reveal && <span className="mt-2 block text-xs leading-relaxed text-white/60">{option.feedback}</span>}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {correct && <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-emerald-400">Answer accepted</p>}
      </div>
    );
  };

  return (
    <section aria-label="Eagle, the Apollo 11 lunar module" className="relative">
      {/* Registry line and live status. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="text-white">Eagle</span>
          <span className="text-white/20">/</span>
          <span className="text-white/50">LM-5</span>
          <span className="text-white/20">/</span>
          <span className="text-white/50">1969-059C</span>
        </div>
        <div className="flex min-w-0 items-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em]">
          {story && (
            <span className="shrink-0 text-violet-bright">
              Other tab · scene {story.scene}/{story.total}
            </span>
          )}
          <span className="flex min-w-0 items-center gap-2 text-white/40">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-bright opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-bright" />
            </span>
            <span key={status} className="console-fade-in truncate">{status}</span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10">
        {/* The machine, or whatever it is showing you. */}
        <div key={stage && stage.kind !== "model" ? beatId : "model"} className="console-stage-in order-3 min-w-0 lg:order-1">
          {renderStage()}
        </div>

        {/* The voice. */}
        <div className="order-1 flex min-w-0 flex-col lg:order-2 lg:justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            {atHub ? "Memories" : inGreeting ? "Incoming transmission" : "Eagle"}
          </p>

          <div key={`speech-${beatId}`} className="mt-4 space-y-4">
            {speech.map((line, i) => (
              <p
                key={i}
                className={`${i === 0 ? "text-[20px] leading-[1.45] text-white sm:text-[23px]" : "text-[16px] leading-relaxed text-white/65 sm:text-[17px]"} rise`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {line}
              </p>
            ))}
          </div>

          {beat?.note && <p className="mt-5 font-mono text-[10px] leading-relaxed text-white/35">{beat.note}</p>}

          {cta && ctaReady && (
            <button
              key={`cta-${beatId}`}
              onClick={() => go(cta)}
              className="console-fade-in group mt-7 inline-flex w-full items-center justify-between gap-4 rounded-full bg-violet px-6 py-4 text-left text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-violet-deep active:scale-[0.99]"
            >
              <span>{cta.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
          {stage?.kind === "quiz" && !correct && (
            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Choose an answer to continue</p>
          )}
        </div>

        {/* The memory core: seven banks, one story, one archive. On phones it comes before the model. */}
        {atHub && (
          <div className="console-fade-in order-2 grid gap-2 border-t border-white/10 pt-6 sm:grid-cols-2 lg:order-3 lg:col-span-2 lg:mt-2 lg:pt-8">
            {data.banks.map((bank, i) => (
              <button
                key={bank.id}
                onClick={() => goToBeat(bank.first)}
                style={{ animationDelay: `${i * 45}ms` }}
                className="console-card-in group flex items-start gap-4 rounded-xl border border-white/12 px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-bright/60 hover:bg-white/[0.04] active:translate-y-0 active:scale-[0.995]"
              >
                <span className="mt-0.5 font-mono text-[10px] text-white/30">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-white">{bank.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-white/45">{bank.line}</span>
                </span>
                <span className="mt-0.5 shrink-0 font-mono text-[10px] text-white/30">{bank.meta}</span>
              </button>
            ))}
            {data.actions.map((action, i) => (
              <button
                key={action.id}
                onClick={action.id === "story" ? openStory : action.id === "movie" ? openMovie : openArchive}
                style={{ animationDelay: `${(data.banks.length + i) * 45}ms` }}
                className="console-card-in group flex items-start gap-4 rounded-xl border border-dashed border-violet-bright/40 px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-bright hover:bg-violet/[0.12] active:translate-y-0 active:scale-[0.995]"
              >
                <span className="mt-0.5 font-mono text-[10px] text-violet-bright">↗</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-white">{action.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-white/45">{action.line}</span>
                </span>
                <span className="mt-0.5 shrink-0 font-mono text-[10px] text-white/30">{action.meta}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* In a branch: a quiet way back. */}
      {!atHub && !inGreeting && (
        <div className="console-fade-in mt-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
          {data.banks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => goToBeat(bank.first)}
              aria-current={activeBank === bank.id ? "true" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeBank === bank.id ? "bg-white text-ink" : "border border-white/15 text-white/55 hover:border-white/40 hover:text-white"
              }`}
            >
              {bank.label}
            </button>
          ))}
          <button
            onClick={() => goToBeat("hub")}
            className="ml-auto rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/35 hover:text-white"
          >
            All memories
          </button>
        </div>
      )}
    </section>
  );
}
