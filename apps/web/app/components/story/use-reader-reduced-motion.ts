"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(listener: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

/** Hydration starts with the server's preference, then adopts the browser's live setting. */
export function useReaderReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
