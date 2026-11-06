"use client";

import { useState } from "react";
import { APOLLO_BOOK } from "@/lib/machine-books/apollo";
import { EAGLE_SCROLL_BOOKMARK, EAGLE_SCROLL_COVER, EAGLE_SCROLL_DIRECTION, type EagleScrollDiagram as Diagram } from "@/lib/eagle-scroll";
import type { ScrollEdition } from "@/lib/machine-scroll";
import MachineScrollStory from "./machine-scroll-story";
import EagleScrollDiagram from "./eagle-scroll-diagram";
import { useEagleStoryLink } from "./use-eagle-story-link";

const edition: ScrollEdition = {
  book: APOLLO_BOOK, directions: EAGLE_SCROLL_DIRECTION, cover: EAGLE_SCROLL_COVER, bookmarkKey: EAGLE_SCROLL_BOOKMARK,
  opening: { kicker: "Apollo 11 / Eagle / LM-5", title: "The part that", emphasis: "stayed.", introduction: "Neil and Buzz had a way home. Part of me was built to stay behind.", invitation: "Come back to the landing. There’s more to it than a footprint." },
  preface: { label: "Before the dust settled", text: "A docking connection. A computer warning. A camera tucked beside a ladder. The Moon landing happened through small things doing their jobs." },
  ending: "The landing stage, the instruments, the traces in the dust. You’ve met the machine behind them.",
};
const renderDiagram = (kind: string, beat: number) => <EagleScrollDiagram kind={kind as Diagram} beat={beat} />;

export default function EagleScrollStory() {
  const [chapter, setChapter] = useState(0);
  const link = useEagleStoryLink(chapter, APOLLO_BOOK.chapters.length, APOLLO_BOOK.chapters[chapter].title, "/heroes/apollo-11-lander");
  return <MachineScrollStory edition={edition} renderDiagram={renderDiagram} onChapterChange={setChapter} onFinish={link.finish} />;
}
