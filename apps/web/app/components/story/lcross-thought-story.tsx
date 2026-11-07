"use client";

import { LCROSS_THOUGHT_EDITION } from "@/lib/lcross-thoughts";
import { LCROSS_ART_SCENES } from "@/lib/lcross-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import LcrossIllustration from "./lcross-illustration";
import LcrossChapterExtras from "./lcross-chapter-extras";
import "./lcross-story.css";

const renderIllustration = (moment: ThoughtMoment) => <LcrossIllustration scene={LCROSS_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "plan"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <LcrossChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function LcrossThoughtStory() {
  return <MachineThoughtStory edition={LCROSS_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
