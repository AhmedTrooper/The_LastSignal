import type { EagleComicScene } from "../eagle-comic";

export type StoryBeat = { line: string; detail: string; art?: EagleComicScene };
export type EventChapter = {
  id: string;
  title: string;
  event: string;
  hardware: string;
  source: string;
  relatedSources?: { label: string; url: string }[];
  beats: [StoryBeat, StoryBeat, StoryBeat, StoryBeat];
  discovery: string;
  question: string;
  memory?: string;
};
export type MachineBook = {
  slug: string;
  name: string;
  title: string;
  introduction: string;
  chapters: EventChapter[];
};

/** Comic captions and prose paragraphs are two presentations of the same story beats. */
export const chapterParagraphs = (chapter: EventChapter) => chapter.beats.map(beat => `${beat.line} ${beat.detail}`);
