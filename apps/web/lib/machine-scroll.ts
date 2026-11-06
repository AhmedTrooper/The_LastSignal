import type { MachineBook } from "./machine-books/types";
import type { Photo } from "./photos";

export type ScrollDirection = { place: string; date: string; tone: "night" | "paper"; photograph?: Photo; diagram?: string; diagramBeats?: number[] };
export type ScrollEdition = {
  book: MachineBook;
  directions: Record<string, ScrollDirection>;
  cover: Photo;
  bookmarkKey: string;
  theme?: "mars";
  opening: { kicker: string; title: string; emphasis: string; introduction: string; invitation: string };
  preface: { label: string; text: string };
  ending: string;
};
export type ScrollPosition = { chapter: string; beat: number };

export function readMachineScrollPosition(book: MachineBook, raw: string | null): ScrollPosition | null {
  try {
    const value = JSON.parse(raw ?? "null");
    const chapter = book.chapters.find(chapter => chapter.id === value?.chapter);
    if (chapter && Number.isInteger(value.beat) && value.beat >= 0 && value.beat < chapter.beats.length) return { chapter: chapter.id, beat: value.beat };
  } catch { /* Optional local reading position. */ }
  return null;
}
