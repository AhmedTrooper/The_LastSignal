"use client";

import { EAGLE_THOUGHT_EDITION } from "@/lib/eagle-thoughts";
import type { EagleScrollDiagram as Diagram } from "@/lib/eagle-scroll";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import EagleScrollDiagram from "./eagle-scroll-diagram";
import "./eagle-story-art.css";

const renderIllustration = (moment: ThoughtMoment) => {
  const direction = EAGLE_THOUGHT_EDITION.directions[moment.chapterId];
  return <EagleScrollDiagram kind={direction.diagram as Diagram} beat={moment.beatSequence - 1} stage />;
};

export default function EagleScrollStory() {
  return <MachineThoughtStory edition={EAGLE_THOUGHT_EDITION} renderIllustration={renderIllustration} />;
}
