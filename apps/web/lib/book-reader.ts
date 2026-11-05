export type BookPosition = { spread: number; side: "left" | "right" };
export const BOOKMARK_KEY = "rv:storybook:position:v1";

export function readBookPosition(raw: string | null, spreadCount: number): BookPosition {
  try {
    const value = JSON.parse(raw ?? "null");
    if (value && Number.isInteger(value.spread) && value.spread >= 0 && value.spread < spreadCount && ["left", "right"].includes(value.side)) return { spread: value.spread, side: value.side };
  } catch { /* Start at the cover when a bookmark is unavailable. */ }
  return { spread: 0, side: "left" };
}

/** On narrow screens turn one page, not a whole spread that skips half the story. */
export function turnBookPage(position: BookPosition, direction: -1 | 1, singlePage: boolean, spreadCount: number): BookPosition {
  if (singlePage) {
    const current = position.spread * 2 + (position.side === "right" ? 1 : 0);
    const next = Math.max(0, Math.min(spreadCount * 2 - 1, current + direction));
    return { spread: Math.floor(next / 2), side: next % 2 ? "right" : "left" };
  }
  return { spread: Math.max(0, Math.min(spreadCount - 1, position.spread + direction)), side: "left" };
}

export function chapterTitle(title: string): string {
  return title.replace(/\s*\[.*\]$/, "").replace(/^Chapter \d+:\s*/, "");
}
