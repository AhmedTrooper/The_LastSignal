import type { EagleComicScene } from "../eagle-comic";

export type OpportunityScene = "airbags" | "rollout" | "berries" | "grinder" | "minerals" | "sand" | "testbed" | "escape" | "solar" | "memory" | "marathon" | "dust" | "signal" | "quiet" | "handoff";
export type StoryBeat = { line: string; detail: string; art?: EagleComicScene; roverArt?: OpportunityScene; sfx?: string };
export type EventChapter = {
  id: string;
  title: string;
  event: string;
  hardware: string;
  source: string;
  relatedSources?: { label: string; url: string }[];
  telemetry?: { label: string; value: string; note: string; source: string }[];
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
