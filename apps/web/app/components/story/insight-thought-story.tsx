"use client";

import { INSIGHT_THOUGHT_EDITION } from "@/lib/insight-thoughts";
import { INSIGHT_ART_SCENES } from "@/lib/insight-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import InsightIllustration from "./insight-illustration";
import InsightChapterExtras from "./insight-chapter-extras";
import "./insight-story.css";

const renderIllustration = (moment: ThoughtMoment) => <InsightIllustration scene={INSIGHT_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "lander"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <InsightChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;

export default function InsightThoughtStory() {
  return <MachineThoughtStory edition={INSIGHT_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
