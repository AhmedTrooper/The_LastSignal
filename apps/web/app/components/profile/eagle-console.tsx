"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
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

const STAGE_BEATS = new Set(["photo", "video", "transcript", "specs", "quiz"]);

const stageMotion = {
  initial: { opacity: 0, y: 14, scale: 0.985 },
  enter: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
};

const speechListMotion = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075 } },
};

const speechLineMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] as const } },
};

const hubListMotion = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};

const hubCardMotion = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.7, 0.2, 1] as const } },
};

/**
 * Eagle's console. One voice, and the real record underneath.
 * The dialogue is an interpretation; every number and quoted line comes from the mission record.
 */
export default function EagleConsole({ data, slug, name, model, parts, poster, posterAlt }: Props) {
  const [beatId, setBeatId] = useState(data.start);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [story, setStory] = useState<{ scene: number; total: number } | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());

  const reduceMotion = useReducedMotion();
  const instant = reduceMotion === true;

  const atHub = beatId === "hub";
  const beat: ConsoleBeat | null = atHub ? null : (data.beats[beatId] ?? data.beats[data.start] ?? null);
  const stage: ConsoleStage | null = beat?.stage ?? null;
  const activeBank = bankFor(beatId);
  const inGreeting = beatId === "arrival" || beatId === "introduction" || beatId === "connection";
  const speech = beat ? beat.speech : data.hub.speech;
  const cta = beat?.cta ?? null;
  const ctaReady = stage?.kind !== "quiz" || correct;
  const isMediaBeat = !!stage && STAGE_BEATS.has(stage.kind);
  const stageKey = stage && stage.kind !== "model" ? beatId : "model";

  const allVisited = visited.size >= data.banks.length;
  const hubStatus = allVisited ? `All ${data.banks.length} banks visited` : `Memories · ${visited.size}/${data.banks.length} visited`;
  const statusText = atHub ? hubStatus : beat ? beat.status : data.hub.status;

  const progressSegments = useMemo(
    () =>
      data.banks.map((bank) => ({
        id: bank.id,
        visited: visited.has(bank.id),
        active: activeBank === bank.id,
      })),
    [data.banks, visited, activeBank],
  );

  // Every beat change is a new scene: drop the quiz answer, stop the film, stop the voice, mark the bank visited.
  const goToBeat = useCallback((id: string) => {
    setBeatId(id);
    const bank = bankFor(id);
    if (bank) {
      setVisited((previous) => {
        if (previous.has(bank)) return previous;
        const next = new Set(previous);
        next.add(bank);
        return next;
      });
    }
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
        window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
      }
    },
    [goToBeat, instant],
  );

  // Enter or Space advances the scene; Escape returns to the memories. Ignored inside interactive controls.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && typeof target.closest === "function" && target.closest("button, a, input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "Enter" || event.key === " ") {
        if (cta && ctaReady) {
          event.preventDefault();
          go(cta);
        }
        return;
      }
      if (event.key === "Escape" && !atHub) {
        event.preventDefault();
        goToBeat("hub");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cta, ctaReady, atHub, go, goToBeat]);

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

  // CTA placement is contextual: continue next to the evidence, not only under the speech.
  const renderCta = (placement: "stage" | "speech") => {
    if (!cta || !ctaReady) return null;
    const sharedProps = {
      layoutId: instant ? undefined : "eagle-console-cta",
      onClick: () => go(cta),
      transition: { type: "spring", stiffness: 420, damping: 34 } as const,
    };
    if (placement === "stage") {
      return (
        <motion.button
          key={`cta-stage-${beatId}`}
          {...sharedProps}
          className="group mt-4 inline-flex w-full items-center justify-between gap-3 rounded-xl border border-violet-bright/35 bg-violet/[0.12] px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:border-violet-bright/70 hover:bg-violet/[0.18]"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-violet-bright/80">Continue</span>
            <span className="mt-0.5 block leading-snug">{cta.label}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
      );
    }
    return (
      <motion.button
        key={`cta-speech-${beatId}`}
        {...sharedProps}
        className="group mt-7 inline-flex w-full items-center justify-between gap-4 rounded-full bg-violet px-6 py-4 text-left text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-violet-deep active:scale-[0.99]"
      >
        <span>{cta.label}</span>
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </motion.button>
    );
  };

  return (
    <LayoutGroup>
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
                {!instant && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-bright opacity-75" />}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-bright" />
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={statusText}
                  initial={instant ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={instant ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="truncate"
                >
                  {statusText}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>

        {/* Seven-bank progress strip, under the registry line. */}
        <div aria-label="Memories visited" className="mt-3 flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">Progress</span>
          <div className="flex flex-1 gap-1">
            {progressSegments.map((segment) => (
              <span
                key={segment.id}
                aria-hidden
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  segment.visited ? "bg-violet-bright" : segment.active ? "bg-violet-bright/45" : "bg-white/12"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">{visited.size}/{data.banks.length}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10">
          {/* The machine, or whatever it is showing you. */}
          <div key={stageKey} className="order-3 min-w-0 lg:order-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stageKey}
                variants={stageMotion}
                initial={instant ? false : "initial"}
                animate="enter"
                exit={instant ? undefined : "exit"}
                transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {renderStage()}
              </motion.div>
            </AnimatePresence>
            {isMediaBeat && renderCta("stage")}
          </div>

          {/* The voice. */}
          <div className="order-1 flex min-w-0 flex-col lg:order-2 lg:justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              {atHub ? "Memories" : inGreeting ? "Incoming transmission" : "Eagle"}
            </p>

            <motion.div
              key={`speech-${beatId}`}
              variants={speechListMotion}
              initial={instant ? false : "hidden"}
              animate="show"
              className="mt-4 space-y-4"
            >
              {speech.map((line, i) => (
                <motion.p
                  key={i}
                  variants={speechLineMotion}
                  className={i === 0 ? "text-[20px] leading-[1.45] text-white sm:text-[23px]" : "text-[16px] leading-relaxed text-white/65 sm:text-[17px]"}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>

            {beat?.note && <p className="mt-5 font-mono text-[10px] leading-relaxed text-white/35">{beat.note}</p>}

            {!isMediaBeat && renderCta("speech")}
            {stage?.kind === "quiz" && !correct && (
              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Choose an answer to continue</p>
            )}
          </div>

          {/* The memories: seven banks, one story, one archive. On phones it comes before the model. */}
          {atHub && (
            <motion.div
              variants={hubListMotion}
              initial={instant ? false : "hidden"}
              animate="show"
              className="order-2 grid gap-2 border-t border-white/10 pt-6 sm:grid-cols-2 lg:order-3 lg:col-span-2 lg:mt-2 lg:pt-8"
            >
              {data.banks.map((bank, i) => {
                const bankVisited = visited.has(bank.id);
                return (
                  <motion.button
                    key={bank.id}
                    variants={hubCardMotion}
                    onClick={() => goToBeat(bank.first)}
                    whileHover={instant ? undefined : { y: -3 }}
                    whileTap={instant ? undefined : { scale: 0.995 }}
                    className={`group flex items-start gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                      bankVisited ? "border-violet-bright/40 bg-violet/[0.08]" : "border-white/12 hover:border-violet-bright/60 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`mt-0.5 font-mono text-[10px] ${bankVisited ? "text-violet-bright" : "text-white/30"}`}>
                      {bankVisited ? (
                        <svg viewBox="0 0 12 12" className="mt-0.5 h-3.5 w-3.5" fill="none" aria-hidden>
                          <path d="M2.5 6.5 5 9l4.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold text-white">{bank.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-white/45">{bank.line}</span>
                    </span>
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-white/30">{bankVisited ? "visited" : bank.meta}</span>
                  </motion.button>
                );
              })}
              {data.actions.map((action) => (
                <motion.button
                  key={action.id}
                  variants={hubCardMotion}
                  onClick={action.id === "story" ? openStory : action.id === "movie" ? openMovie : openArchive}
                  whileHover={instant ? undefined : { y: -3 }}
                  whileTap={instant ? undefined : { scale: 0.995 }}
                  className="group flex items-start gap-4 rounded-xl border border-dashed border-violet-bright/40 px-4 py-3.5 text-left transition-colors hover:border-violet-bright hover:bg-violet/[0.12]"
                >
                  <span className="mt-0.5 font-mono text-[10px] text-violet-bright">↗</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-white">{action.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-white/45">{action.line}</span>
                  </span>
                  <span className="mt-0.5 shrink-0 font-mono text-[10px] text-white/30">{action.meta}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>

        {/* In a branch: a quiet way back. Escape does the same. */}
        {!atHub && !inGreeting && (
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
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
              title="Escape"
              className="ml-auto rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/35 hover:text-white"
            >
              All memories <span aria-hidden>· Esc</span>
            </button>
          </div>
        )}
      </section>
    </LayoutGroup>
  );
}
