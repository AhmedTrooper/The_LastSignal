"use client";

import { GRAIL_THOUGHT_EDITION } from "@/lib/grail-thoughts";
import { GRAIL_ART_SCENES } from "@/lib/grail-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import GrailIllustration from "./grail-illustration";
import GrailChapterExtras from "./grail-chapter-extras";
import "./grail-story.css";

const renderIllustration = (moment: ThoughtMoment) => <GrailIllustration scene={GRAIL_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "twins"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <GrailChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function GrailThoughtStory() {
  return <MachineThoughtStory edition={GRAIL_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
