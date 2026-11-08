"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import { Play } from "@/app/components/icons";

function subscribe(listener: () => void) {
  if (!("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", listener);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", listener);
}
function hasEnglishVoice() {
  return "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined" && window.speechSynthesis.getVoices().some(voice => /^en(?:-|_)?/i.test(voice.lang));
}

/** Key this component by beatId. Moving on or leaving the tab cancels the current narration. */
export default function ThoughtNarration({ moment }: { moment: ThoughtMoment }) {
  const browserVoice = useSyncExternalStore(subscribe, hasEnglishVoice, () => false);
  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "error">("idle");
  const audio = useRef<HTMLAudioElement | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const token = useRef(0);
  const recorded = moment.audio.status === "ready" && moment.audio.src !== null;

  const cancel = useCallback(() => {
    token.current++;
    if (audio.current) {
      const player = audio.current;
      player.onended = null;
      player.onerror = null;
      player.pause();
      player.removeAttribute("src");
      player.load();
      audio.current = null;
    }
    if (utterance.current) {
      utterance.current.onend = null;
      utterance.current.onerror = null;
      window.speechSynthesis.cancel();
      utterance.current = null;
    }
  }, []);
  useEffect(() => {
    const hide = () => { if (document.hidden) { cancel(); setStatus("idle"); } };
    document.addEventListener("visibilitychange", hide);
    return () => { cancel(); document.removeEventListener("visibilitychange", hide); };
  }, [cancel]);

  const start = useCallback(async () => {
    cancel();
    const current = token.current;
    if (recorded) {
      const player = new Audio(moment.audio.src!);
      audio.current = player;
      player.onended = () => { if (token.current === current) setStatus("idle"); };
      player.onerror = () => { if (token.current === current) setStatus("error"); };
      setStatus("playing");
      try { await player.play(); } catch { if (token.current === current) setStatus("error"); }
    } else if (browserVoice) {
      const speech = new SpeechSynthesisUtterance(moment.narrationText);
      speech.lang = "en-US";
      speech.voice = window.speechSynthesis.getVoices().find(voice => /^en(?:-|_)?/i.test(voice.lang)) ?? null;
      speech.rate = 0.92;
      speech.onend = () => { if (token.current === current) { utterance.current = null; setStatus("idle"); } };
      speech.onerror = () => { if (token.current === current) { utterance.current = null; setStatus("error"); } };
      utterance.current = speech;
      setStatus("playing");
      // cancel() may leave the browser's global queue paused after a previous moment.
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(speech);
    }
  }, [browserVoice, cancel, moment, recorded]);

  const startRef = useRef<() => Promise<void>>(async () => {});
  useEffect(() => {
    startRef.current = start;
  }, [start]);

  useEffect(() => {
    if (!recorded) return;
    void startRef.current();
  }, [moment.beatId, recorded]);

  const toggle = async () => {
    if (status === "playing") {
      if (audio.current) audio.current.pause(); else window.speechSynthesis.pause();
      setStatus("paused");
    } else if (status === "paused") {
      const current = token.current;
      if (audio.current) {
        try { await audio.current.play(); if (current === token.current) setStatus("playing"); } catch { if (current === token.current) setStatus("error"); }
      } else { window.speechSynthesis.resume(); setStatus("playing"); }
    } else await start();
  };
  return <div className="tc-narration" data-audio-beat={moment.beatId}>
    <div><button type="button" onClick={toggle} disabled={!recorded && !browserVoice} aria-label={status === "playing" ? "Pause narration" : status === "paused" ? "Resume narration" : recorded ? "Play this moment’s narration" : "Preview this moment with a synthetic English voice"}>{status === "playing" ? <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="currentColor" /></svg> : <Play className="h-3.5 w-3.5" />}{status === "playing" ? "Pause" : status === "paused" ? "Resume" : recorded ? "Listen" : "Voice preview"}</button>{(status === "playing" || status === "paused") && <button type="button" onClick={() => { cancel(); setStatus("idle"); }}>Stop</button>}</div>
    <p role="status">{status === "error" ? "Voice couldn’t play. You can retry or read the full moment." : recorded ? "Recorded imagined voice" : browserVoice ? "Synthetic preview · full context included" : "Script ready · no recorded clip yet"}</p>
    {recorded && <p className="tc-audio-debug"><span>{moment.audio.src}</span><a href={moment.audio.src!} target="_blank" rel="noopener noreferrer">Open audio</a></p>}
  </div>;
}
