"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { EagleChapter } from "@/lib/console";
import type { Photo } from "@/lib/photos";
import { SignalMark } from "@/app/components/logo";
import { ArrowRight, Close } from "@/app/components/icons";

const CHANNEL = "eagle_mission_link";

export type StoryChapter = EagleChapter & { photo?: Photo };

type Props = {
  slug: string;
  name: string;
  chapters: StoryChapter[];
  sources: { label: string; url: string }[];
};

/** Deterministic stars, so the field is the same every visit and never hydrates differently. */
const STARS = Array.from({ length: 150 }, (_, i) => ({
  x: (i * 67.31) % 100,
  y: (i * 39.17 + (i % 8) * 9) % 100,
  r: 0.5 + ((i * 13) % 9) / 8,
  o: 0.2 + ((i * 23) % 10) / 14,
  d: -((i * 1.7) % 9),
}));

/**
 * The story tab. One chapter at a time, one action per chapter, and a channel back to the console.
 * It is opened by the console with window.open, so it is allowed to close itself when it is done.
 */
export default function EagleStory({ slug, name, chapters, sources }: Props) {
  const [i, setI] = useState(0);
  const [acted, setActed] = useState<Set<number>>(() => new Set());
  const [done, setDone] = useState(false);
  const channel = useRef<BroadcastChannel | null>(null);
  const doneRef = useRef(false);

  const chapter = chapters[i];
  const consoleHref = `/heroes/${slug}`;
  const last = i === chapters.length - 1;
  const hasActed = acted.has(i);

  useEffect(() => {
    doneRef.current = done;
  }, [done]);

  // Open the channel once. The console on the other tab is listening.
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(CHANNEL);
    channel.current = ch;
    const bye = () => {
      if (!doneRef.current) ch.postMessage({ type: "STORY_CLOSED" });
    };
    window.addEventListener("pagehide", bye);
    return () => {
      window.removeEventListener("pagehide", bye);
      ch.close();
      channel.current = null;
    };
  }, []);

  // Tell the console which chapter is on screen.
  useEffect(() => {
    if (done) return;
    channel.current?.postMessage({ type: "STORY_PROGRESS", scene: i + 1, total: chapters.length });
  }, [i, done, chapters.length]);

  const act = () => {
    setActed((prev) => {
      const nextSet = new Set(prev);
      nextSet.add(i);
      return nextSet;
    });
  };

  const finish = () => {
    channel.current?.postMessage({ type: "STORY_COMPLETED" });
    doneRef.current = true;
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const advance = () => {
    if (last) {
      finish();
      return;
    }
    setI((n) => n + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (k: number) => {
    if (k > i) return;
    setI(k);
    setDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeTab = () => {
    window.close();
    // Browsers refuse to close a tab the script did not open. In that case, go to the console.
    window.setTimeout(() => {
      window.location.href = consoleHref;
    }, 300);
  };

  return (
    <div className="min-h-[100svh] bg-[#08070f] text-white">
      <h1 className="sr-only">{name}: the story</h1>

      {/* The bar stays put; the chapters move under it. */}
      <header className="fixed inset-x-0 top-0 z-40 bg-[linear-gradient(180deg,rgba(8,7,15,0.96)_0%,rgba(8,7,15,0.7)_60%,transparent_100%)] px-4 pt-4 pb-6 sm:px-8 sm:pt-5">
        <div className="flex items-center justify-between gap-4">
          <Link href={consoleHref} className="flex items-center gap-2.5 text-white/90 hover:text-white">
            <SignalMark className="h-6 w-6" />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase sm:text-[11px]">
              The Last Signal <span className="text-white/40">/ Eagle</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
              {done ? "Complete" : `${i + 1} / ${chapters.length}`}
            </span>
            <Link
              href={consoleHref}
              aria-label="Close the story and return to the console"
              className="rounded-full bg-white/10 p-2 backdrop-blur transition-colors hover:bg-white/20"
            >
              <Close />
            </Link>
          </div>
        </div>

        <div className="mt-3 flex gap-1">
          {chapters.map((c, k) => (
            <button
              key={c.id}
              onClick={() => goTo(k)}
              disabled={k > i}
              aria-label={`Chapter ${c.n}: ${c.title}`}
              aria-current={!done && k === i ? "step" : undefined}
              className={`h-0.5 flex-1 rounded-full transition-colors ${
                done || k < i ? "bg-violet-bright" : k === i ? "bg-violet-bright/80" : "bg-white/15"
              } ${k < i ? "cursor-pointer hover:bg-white" : ""}`}
            />
          ))}
        </div>
      </header>

      {done ? (
        <section className="mx-auto flex min-h-[100svh] max-w-2xl flex-col justify-center px-5 pt-28 pb-20 sm:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-bright">Transmission complete</p>
          <h2 className="display mt-4 text-[44px] leading-[0.95] sm:text-[64px]">Thank you for staying.</h2>
          <p className="mt-6 text-[17px] leading-relaxed text-white/70">
            The console tab is still open. It knows you finished — I sent the message when you pressed the last button.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/45">
            Fifty-seven years is a long time to be a machine with nothing to do. It was good to be listened to.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={closeTab}
              className="group flex w-full items-center justify-between gap-4 rounded-full bg-violet px-6 py-4 text-sm font-semibold transition-colors hover:bg-violet-deep"
            >
              Return to my console
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
            <Link
              href={consoleHref}
              className="flex w-full items-center justify-between gap-4 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white"
            >
              Open the console in this tab
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>

          <div className="mt-14 border-t border-white/10 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">Sources</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-violet-bright hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-white/35">
              Eagle&apos;s voice is an interpretation built from these records; the dates, figures and quoted lines are theirs. NASA does not endorse this site.
            </p>
          </div>
        </section>
      ) : (
        <main className="lg:grid lg:grid-cols-2">
          {/* The plate: a photograph where one exists, a star field where one does not. */}
          <div className="relative h-[54svh] overflow-hidden bg-black lg:sticky lg:top-0 lg:h-[100svh]">
            {chapter.photo ? (
              <>
                <Image
                  key={chapter.id}
                  src={chapter.photo.src}
                  alt={chapter.photo.alt}
                  fill
                  priority={i < 2}
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="eagle-drift object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,15,0.55)_0%,transparent_35%,transparent_60%,rgba(8,7,15,0.85)_100%)] lg:bg-[linear-gradient(180deg,rgba(8,7,15,0.5)_0%,transparent_30%,transparent_65%,rgba(8,7,15,0.9)_100%)]" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-8">
                  <p className="max-w-[75%] font-mono text-[10px] leading-relaxed text-white/55">
                    {chapter.photo.ai ? (
                      "AI-generated placeholder"
                    ) : (
                      <>
                        {chapter.photo.title} · {chapter.photo.credit}
                      </>
                    )}
                  </p>
                  {!chapter.photo.ai && (
                    <a
                      href={chapter.photo.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 font-mono text-[10px] text-white/55 underline hover:text-white"
                    >
                      source
                    </a>
                  )}
                </div>
              </>
            ) : (
              <Starfield chapter={chapter} />
            )}

            <p className="absolute top-24 left-4 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 sm:left-8 lg:block">
              {String(chapter.n).padStart(2, "0")} · {chapter.status}
            </p>
          </div>

          {/* The voice. */}
          <div className="px-5 pt-10 pb-24 sm:px-10 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-28 lg:pr-14 lg:pl-12">
            <div key={chapter.id} className="rise mx-auto w-full max-w-xl lg:mx-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-bright">{chapter.status}</p>
              <h2 className="display mt-3 text-[38px] leading-[0.96] sm:text-[50px]">{chapter.title}</h2>
              <p className="mt-2 font-mono text-xs text-white/40">{chapter.date}</p>

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
                {chapter.telemetry.map((t) => (
                  <div key={t.label} className="bg-[#0b0a16] px-3 py-3">
                    <dt className="font-mono text-[9px] uppercase tracking-wider text-white/35">{t.label}</dt>
                    <dd className="mt-1 font-mono text-[13px] text-white">{t.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 space-y-4">
                {chapter.speech.map((line, k) => (
                  <p
                    key={k}
                    className={
                      k === 0
                        ? "text-[19px] leading-[1.55] text-white sm:text-[21px]"
                        : "text-[15px] leading-relaxed text-white/65 sm:text-base"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>

              {chapter.note && <p className="mt-5 font-mono text-[10px] text-white/30">{chapter.note}</p>}

              <div className="mt-8">
                {!hasActed ? (
                  <button
                    onClick={act}
                    className="group flex w-full items-center justify-between gap-4 rounded-xl border border-white/15 px-5 py-4 text-left transition-colors hover:border-violet-bright/70 hover:bg-white/[0.04]"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Your move</span>
                      <span className="mt-1 block text-sm font-semibold text-white">{chapter.action.label}</span>
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors group-hover:border-violet-bright group-hover:text-white">
                      <ArrowRight />
                    </span>
                  </button>
                ) : (
                  <>
                    <p className="flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] px-5 py-4 text-sm leading-relaxed text-emerald-100/90">
                      <span className="mt-0.5 shrink-0 font-mono text-[10px] uppercase tracking-wider text-emerald-400">Done</span>
                      <span>{chapter.action.result}</span>
                    </p>
                    <button
                      onClick={advance}
                      className="group mt-4 flex w-full items-center justify-between gap-4 rounded-full bg-violet px-6 py-4 text-sm font-semibold transition-colors hover:bg-violet-deep"
                    >
                      <span>{chapter.cta}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

/** The star field behind chapters without a photograph: a slow, quiet signal readout. */
function Starfield({ chapter }: { chapter: StoryChapter }) {
  const glyph = chapter.glyph;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_115%,#191338_0%,#0a0918_55%,#08070f_100%)]">
      <div className="absolute inset-0">
        {STARS.map((s, n) => (
          <span
            key={n}
            className="eagle-twinkle absolute rounded-full bg-white"
            style={
              {
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.r,
                height: s.r,
                opacity: s.o,
                animationDelay: `${s.d}s`,
                "--o": s.o,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {glyph && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/25">{glyph.label}</p>
          <p className="display mt-3 text-[92px] leading-none text-white/10 tabular-nums sm:text-[120px]">
            {glyph.value}
            {glyph.unit && <span className="ml-3 text-2xl text-white/15">{glyph.unit}</span>}
          </p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(8,7,15,0.85))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_25%,rgba(8,7,15,0.55)_100%)]" />

      <p className="absolute inset-x-4 bottom-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 sm:inset-x-8">
        {chapter.status}
      </p>
    </div>
  );
}
