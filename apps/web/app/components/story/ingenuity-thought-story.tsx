"use client";

import { INGENUITY_THOUGHT_EDITION } from "@/lib/ingenuity-thoughts";
import { INGENUITY_ART_SCENES } from "@/lib/ingenuity-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import IngenuityIllustration from "./ingenuity-illustration";
import IngenuityChapterExtras from "./ingenuity-chapter-extras";
import "./ingenuity-story.css";

const renderIllustration = (moment: ThoughtMoment) => <IngenuityIllustration scene={INGENUITY_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "hover"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <IngenuityChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function IngenuityThoughtStory() {
  return <MachineThoughtStory edition={INGENUITY_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
