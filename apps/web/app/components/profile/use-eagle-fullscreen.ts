"use client";

import { useEffect, useRef, useState } from "react";

/** Native fullscreen with a keyboard-accessible theatre fallback on unsupported mobile browsers. */
export function useEagleFullscreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const toggle = async () => {
    if (fullscreen) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      setFullscreen(false);
      return;
    }
    setFullscreen(true);
    try { await ref.current?.requestFullscreen?.(); } catch { /* Theatre view remains available. */ }
  };
  useEffect(() => {
    const change = () => setFullscreen(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);
  useEffect(() => {
    if (!fullscreen || !ref.current) return;
    const root = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const siblings: { node: HTMLElement; inert: boolean }[] = [];
    let node: HTMLElement = root;
    while (node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling !== node && sibling instanceof HTMLElement) { siblings.push({ node: sibling, inert: sibling.inert }); sibling.setAttribute("inert", ""); }
      }
      node = node.parentElement;
      if (node === document.body) break;
    }
    root.querySelector<HTMLElement>("[data-fullscreen-toggle]")?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); if (document.fullscreenElement) void document.exitFullscreen(); setFullscreen(false); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), video[controls], audio[controls], [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    root.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = overflow;
      siblings.forEach(s => { if (!s.inert) s.node.removeAttribute("inert"); });
      root.removeEventListener("keydown", keys);
      previous?.focus({ preventScroll: true });
    };
  }, [fullscreen]);
  return { ref, fullscreen, toggle };
}
