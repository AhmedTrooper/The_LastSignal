"use client";

import { PHOENIX_THOUGHT_EDITION } from "@/lib/phoenix-thoughts";
import { PHOENIX_ART_SCENES } from "@/lib/phoenix-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import PhoenixIllustration from "./phoenix-illustration";
import PhoenixChapterExtras from "./phoenix-chapter-extras";
import "./phoenix-story.css";

const renderIllustration = (moment: ThoughtMoment) => <PhoenixIllustration scene={PHOENIX_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "touchdown"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <PhoenixChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function PhoenixThoughtStory() {
  return <MachineThoughtStory edition={PHOENIX_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
