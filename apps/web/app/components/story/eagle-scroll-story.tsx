"use client";

import { useState } from "react";
import { EAGLE_THOUGHT_EDITION } from "@/lib/eagle-thoughts";
import type { EagleScrollDiagram as Diagram } from "@/lib/eagle-scroll";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import EagleScrollDiagram from "./eagle-scroll-diagram";
import { useEagleStoryLink } from "./use-eagle-story-link";

const renderIllustration = (moment: ThoughtMoment) => {
  const direction = EAGLE_THOUGHT_EDITION.directions[moment.chapterId];
  return <EagleScrollDiagram kind={direction.diagram as Diagram} beat={moment.beatSequence - 1} stage />;
};

export default function EagleScrollStory() {
  const [chapter, setChapter] = useState(0);
  const book = EAGLE_THOUGHT_EDITION.book;
  const link = useEagleStoryLink(chapter, book.chapters.length, book.chapters[chapter].title, `/heroes/${book.slug}`);
  return <MachineThoughtStory edition={EAGLE_THOUGHT_EDITION} renderIllustration={renderIllustration} onChapterChange={setChapter} onFinish={link.finish} />;
}
