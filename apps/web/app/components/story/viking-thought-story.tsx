"use client";

import { VIKING_THOUGHT_EDITION } from "@/lib/viking-thoughts";
import { VIKING_ART_SCENES } from "@/lib/viking-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import VikingIllustration from "./viking-illustration";
import VikingChapterExtras from "./viking-chapter-extras";
import "./viking-story.css";

const renderIllustration = (moment: ThoughtMoment) => <VikingIllustration scene={VIKING_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "touchdown"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <VikingChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function VikingThoughtStory() {
  return <MachineThoughtStory edition={VIKING_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
