"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeToVoices(listener: () => void) {
  if (!("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", listener);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", listener);
}

function hasVoice() {
  return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function" && window.speechSynthesis.getVoices().length > 0;
}

export function useEagleVoice(scene: string) {
  const [speaking, setSpeaking] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const supported = useSyncExternalStore(subscribeToVoices, hasVoice, () => false);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const stop = useCallback(() => {
    const current = utterance.current;
    if (current) {
      current.onend = null;
      current.onerror = null;
      window.speechSynthesis?.cancel();
      utterance.current = null;
    }
    setSpeaking(false);
  }, []);
  useEffect(() => {
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", hide);
    return () => { stop(); document.removeEventListener("visibilitychange", hide); };
  }, [scene, stop]);
  const start = (text: string) => {
    stop();
    if (!hasVoice() || unavailable) { setUnavailable(true); return; }
    const line = new SpeechSynthesisUtterance(text);
    line.lang = "en-US";
    line.rate = 0.9;
    line.pitch = 0.9;
    line.onend = () => { utterance.current = null; setSpeaking(false); };
    line.onerror = () => { utterance.current = null; setSpeaking(false); setUnavailable(true); };
    utterance.current = line;
    setSpeaking(true);
    window.speechSynthesis.speak(line);
  };
  return { speaking, available: supported && !unavailable, start, stop };
}
