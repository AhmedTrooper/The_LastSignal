"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Play } from "@/app/components/icons";
import {
  RANGER7_DIALOGUE,
  RANGER7_STORY_RETURN_NODE,
  resolveDialogueNode,
  type DialogueAction,
  type DialoguePhoto,
} from "@/lib/ranger7-dialogue";
import { useEagleVoice } from "./use-eagle-voice";
import Videos from "./videos";

/**
 * Ranger 7's conversational state machine: an emotional handshake (one affirmative button
 * per line), a memory hub, sequential memory banks, a three-round game and a round trip
 * through the story tab. Every fact shown here lives in `lib/ranger7-dialogue.ts` with its
 * source; the voice is labelled imagined everywhere it appears.
 */

const WELCOME_BACK_AFTER_MS = 2500;
const PRIMARY =
  "inline-flex min-h-12 items-center justify-between gap-3 rounded-full bg-violet px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-deep disabled:opacity-50";
const SECONDARY =
  "inline-flex min-h-12 items-center justify-between gap-3 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-violet hover:text-violet disabled:opacity-50";

function PhotoFigure({ photo }: { photo: DialoguePhoto }) {
  return (
    <figure className="mt-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-mist">
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 46rem, 92vw" className="object-contain" />
      </div>
      <figcaption className="mt-2 text-[13px] leading-snug text-ink-soft">
        <a href={photo.source} target="_blank" rel="noopener noreferrer" className="hover:text-violet">
          {photo.title} · {photo.credit} ↗
        </a>
        <span className="mt-0.5 block">{photo.alt}</span>
      </figcaption>
    </figure>
  );
}

export default function Ranger7Dialogue() {
  const [nodeId, setNodeId] = useState<string>(RANGER7_DIALOGUE.initialState);
  const [picked, setPicked] = useState<number | null>(null);
  const [storyOpenedAt, setStoryOpenedAt] = useState<number | null>(null);
  const node = resolveDialogueNode(nodeId);
  const voice = useEagleVoice(`ranger-7:${nodeId}`);
  const speechRef = useRef<HTMLElement | null>(null);
  const announcedOnce = useRef(false);

  // After a reader-driven transition, move focus to the reply so screen readers announce it
  // (preventScroll keeps the page where the reader left it). Never on first paint.
  useEffect(() => {
    if (!announcedOnce.current) {
      announcedOnce.current = true;
      return;
    }
    speechRef.current?.focus({ preventScroll: true });
  }, [nodeId]);

  // Round trip: the story opens in a new tab; when the reader comes back to this tab
  // (after a brief guard so an instant return does not skip the "story tab opened" reply),
  // greet them as if they finished the journey.
  useEffect(() => {
    if (storyOpenedAt == null) return;
    let timer = 0;
    const arrive = () => {
      if (document.visibilityState !== "visible") return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (document.visibilityState !== "visible") return;
        setStoryOpenedAt(null);
        setPicked(null);
        setNodeId(RANGER7_STORY_RETURN_NODE);
      }, Math.max(0, WELCOME_BACK_AFTER_MS - (Date.now() - storyOpenedAt)));
    };
    arrive();
    document.addEventListener("visibilitychange", arrive);
    return () => {
      document.removeEventListener("visibilitychange", arrive);
      window.clearTimeout(timer);
    };
  }, [storyOpenedAt]);

  const go = (action: DialogueAction) => {
    setPicked(null);
    // The story action renders as a real target=_blank link, so the tab always opens
    // (window.open + noopener returns null even on success, which would break this guard).
    if (action.open) setStoryOpenedAt(Date.now());
    setNodeId(action.next);
  };

  const reset = () => {
    setPicked(null);
    setStoryOpenedAt(null);
    setNodeId(RANGER7_DIALOGUE.initialState);
  };

  const progress =
    "step" in node ? `${node.step} / ${node.total}` : "round" in node ? `${node.round} / ${node.totalRounds}` : null;
  const category = "category" in node ? node.category : null;
  const actions = "actions" in node ? node.actions : [];

  return (
    <section id="ranger-hub" className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-white p-5 sm:p-7">
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase">
        {RANGER7_DIALOGUE.callSign} / {RANGER7_DIALOGUE.cosparId} / {RANGER7_DIALOGUE.hardwareDesignation}
      </p>
      <h2 className="display mt-3 text-[32px] sm:text-[40px]">Talk to Ranger 7.</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
        An imagined machine voice, one line at a time. Every date, frequency and picture underneath it comes from the
        mission record — sources are listed on each reply.
      </p>

      <div className="mt-5 rounded-2xl border border-line bg-mist/60 p-4 sm:p-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-line bg-white px-3 py-1 font-mono text-[10px] tracking-wider text-violet uppercase">
              {node.badge}
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider text-ink-soft uppercase">
              <span>{node.mood}</span>
              {category && <span aria-hidden>·</span>}
              {category && <span>{category}</span>}
              {progress && <span aria-hidden>·</span>}
              {progress && <span>{progress}</span>}
            </div>
          </div>
          {nodeId !== RANGER7_DIALOGUE.initialState && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-3 py-2 font-mono text-[11px] tracking-wider text-ink-soft uppercase hover:border-violet hover:text-violet"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Start over
            </button>
          )}
        </header>

        <article
          ref={speechRef}
          tabIndex={-1}
          aria-label="Ranger 7 replies"
          className="mt-4 rounded-xl border border-line bg-white p-4 outline-none focus-visible:ring-2 focus-visible:ring-violet sm:p-5"
        >
          <p className="text-[15px] leading-relaxed sm:text-base">{node.speech}</p>
        </article>

        {node.kind === "item" && node.photo && <PhotoFigure photo={node.photo} />}

        {node.kind === "item" && node.specs && (
          <div className="mt-4">
            <h3 className="font-mono text-[12px] tracking-wider text-ink-soft uppercase">{node.title}</h3>
            <dl className="mt-2 divide-y divide-line rounded-xl border border-line bg-white">
              {node.specs.map((spec) => (
                <div key={spec.label} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2.5">
                  <dt className="font-mono text-[11px] tracking-wider text-ink-soft uppercase">{spec.label}</dt>
                  <dd className="text-right font-mono text-[13px] text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {node.kind === "audio" && (
          <div className="mt-4 rounded-xl border border-line bg-white p-4">
            <h3 className="font-mono text-[12px] tracking-wider text-ink-soft uppercase">{node.title}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => voice.start(node.speech)}
                disabled={!voice.available || voice.speaking}
                className={PRIMARY.replace("justify-between", "justify-center").replace("gap-3", "gap-2")}
              >
                <Play className="h-4 w-4" />
                {voice.speaking ? "Reading…" : "Start read-aloud"}
              </button>
              <button
                type="button"
                onClick={voice.stop}
                disabled={!voice.speaking}
                className={SECONDARY.replace("justify-between", "justify-center").replace("gap-3", "gap-2")}
              >
                Stop
              </button>
              <span className="font-mono text-[11px] tracking-wider text-ink-soft uppercase">
                {voice.available ? "Synthetic voice · not an archive recording" : "Read-aloud unavailable in this browser"}
              </span>
            </div>
          </div>
        )}

        {node.kind === "video" && (
          <div className="mt-4">
            <h3 className="font-mono text-[12px] tracking-wider text-ink-soft uppercase">
              {node.title} · {node.video.channel}
            </h3>
            <div className="mt-2">
              <Videos items={[node.video]} />
            </div>
          </div>
        )}

        {node.kind === "game" && (
          <div className="mt-4">
            <h3 className="font-mono text-[12px] tracking-wider text-ink-soft uppercase">{node.title}</h3>
            <div role="group" aria-label={node.title} className="mt-3 space-y-3">
              {node.options.map((option, index) => {
                const chosen = picked === index;
                return (
                  <button
                    key={option.label}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => setPicked(index)}
                    className={[
                      "flex w-full items-start gap-3 rounded-xl border bg-white p-4 text-left text-[15px] leading-snug transition-colors disabled:cursor-default",
                      picked === null ? "border-line hover:border-violet" : "",
                      chosen && option.correct ? "border-violet bg-violet-soft" : "",
                      chosen && !option.correct ? "border-mars bg-mist" : "",
                      picked !== null && !chosen ? "border-line opacity-60" : "",
                    ].join(" ")}
                  >
                    <span className="mt-0.5 font-mono text-[12px] font-semibold text-violet">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div
                className={[
                  "mt-3 rounded-xl border p-4",
                  node.options[picked].correct ? "border-violet bg-violet-soft" : "border-mars bg-white",
                ].join(" ")}
              >
                <p className="text-[15px] leading-relaxed">
                  <span className="font-mono text-[11px] tracking-wider text-ink-soft uppercase">
                    {node.options[picked].correct ? "Correct · " : "Not this time · "}
                  </span>
                  {node.options[picked].feedback}
                </p>
                <div className="mt-3">
                  {node.options[picked].correct && node.options[picked].next ? (
                    <button
                      type="button"
                      onClick={() => go({ label: "Continue", next: node.options[picked].next as string })}
                      className={PRIMARY}
                    >
                      {node.round === node.totalRounds ? "Finish — take me to the hub" : "Next round"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => setPicked(null)} className={SECONDARY}>
                      Choose again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {(node.kind === "hub" || actions.length > 0) && (
          <div
            className={
              node.kind === "hub" ? "mt-5 grid gap-3 sm:grid-cols-2" : "mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            }
          >
            {actions.map((action, index) => {
              const className = node.kind === "hub" ? SECONDARY : index === 0 ? PRIMARY : SECONDARY;
              const inner = (
                <>
                  <span className="flex items-center gap-3 text-left">
                    {node.kind === "hub" && (
                      <span aria-hidden="true" className="font-mono text-[11px] tracking-wider text-ink-soft">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </>
              );
              return action.open ? (
                <a
                  key={action.label}
                  href={action.open}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => go(action)}
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <button key={action.label} type="button" onClick={() => go(action)} className={className}>
                  {inner}
                </button>
              );
            })}
          </div>
        )}

        {node.sources && node.sources.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4 font-mono text-[11px] tracking-wider text-ink-soft uppercase">
            {node.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-violet">
                  {source.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 font-mono text-[11px] tracking-wider text-ink-soft uppercase">{RANGER7_DIALOGUE.voiceNote}</p>
      </div>
    </section>
  );
}
