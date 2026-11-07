import { APOLLO_BOOK } from "./apollo";
import { OPPORTUNITY_BOOK } from "./opportunity";
import { RANGER_BOOK } from "./ranger";
import { INSIGHT_BOOK } from "./insight";
import type { MachineBook } from "./types";
export { chapterParagraphs } from "./types";
export type { MachineBook, EventChapter, StoryBeat } from "./types";

export const MACHINE_BOOKS = [APOLLO_BOOK, OPPORTUNITY_BOOK, RANGER_BOOK, INSIGHT_BOOK];
export const getMachineBook = (slug: string) => MACHINE_BOOKS.find(book => book.slug === slug);
export type ReadingFormat = "comic" | "book";
export const machineStoryUrl = (slug: string, chapter?: string) => `/heroes/${slug}/story${chapter ? `#${encodeURIComponent(chapter)}` : ""}`;
export function machineBookUrl(slug: string, chapter?: string, format?: ReadingFormat) {
  const query = new URLSearchParams({ read: "1" });
  if (format) query.set("format", format);
  if (chapter) query.set("chapter", chapter);
  return `/heroes/${slug}/book?${query}`;
}

/** Explicit chapter links beat a bookmark; missing query values resume that machine. */
export function resolveMachineReading(book: MachineBook, chapter: string | null, format: string | null, saved?: MachineBookmark) {
  const requested = book.chapters.findIndex(item => item.id === chapter);
  const bookmarked = book.chapters.findIndex(item => item.id === saved?.chapter);
  return {
    index: chapter !== null ? Math.max(0, requested) : Math.max(0, bookmarked),
    format: format === "comic" || format === "book" ? format : saved?.format ?? "comic",
  };
}

export type MachineBookmark = { chapter: string; format: ReadingFormat };
export const MACHINE_BOOKMARK_KEY = "rv:machine-books:v1";
export function readMachineBookmarks(raw: string | null): Record<string, MachineBookmark> {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(MACHINE_BOOKS.flatMap(book => {
      const item = value[book.slug];
      return item && (item.format === "comic" || item.format === "book") && book.chapters.some(chapter => chapter.id === item.chapter) ? [[book.slug, { chapter: item.chapter, format: item.format }]] : [];
    }));
  } catch { return {}; }
}
