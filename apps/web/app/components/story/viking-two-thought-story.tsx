"use client";

import { VIKING_TWO_THOUGHT_EDITION } from "@/lib/viking-two-thoughts";
import { VIKING_TWO_ART_SCENES } from "@/lib/viking-two-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import VikingTwoIllustration from "./viking-two-illustration";
import VikingTwoChapterExtras from "./viking-two-chapter-extras";
import "./viking-story.css";
import "./viking-two-story.css";

const renderIllustration = (moment: ThoughtMoment) => <VikingTwoIllustration scene={VIKING_TWO_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "tilt"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <VikingTwoChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function VikingTwoThoughtStory() {
  return <MachineThoughtStory edition={VIKING_TWO_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
