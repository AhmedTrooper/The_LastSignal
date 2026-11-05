export type EagleProgress = { index: number; furthest: number; acted: number[] };
export const EMPTY_EAGLE_PROGRESS: EagleProgress = { index: 0, furthest: 0, acted: [] };

/** Ignore malformed/old saves rather than allowing a bad index to break the story. */
export function readEagleProgress(raw: string | null, total: number): EagleProgress {
  if (!raw) return EMPTY_EAGLE_PROGRESS;
  try {
    const value = JSON.parse(raw);
    const validIndex = (n: unknown): n is number => Number.isInteger(n) && Number(n) >= 0 && Number(n) < total;
    if (!validIndex(value.index) || !validIndex(value.furthest) || value.index > value.furthest || !Array.isArray(value.acted) || !value.acted.every(validIndex)) return EMPTY_EAGLE_PROGRESS;
    return { index: value.index, furthest: value.furthest, acted: [...new Set<number>(value.acted)] };
  } catch { return EMPTY_EAGLE_PROGRESS; }
}
