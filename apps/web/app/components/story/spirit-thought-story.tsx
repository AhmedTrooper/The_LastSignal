"use client";

import { SPIRIT_THOUGHT_EDITION } from "@/lib/spirit-thoughts";
import { SPIRIT_ART_SCENES } from "@/lib/spirit-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import SpiritIllustration from "./spirit-illustration";
import SpiritChapterExtras from "./spirit-chapter-extras";
import "./spirit-story.css";

const renderIllustration = (moment: ThoughtMoment) => <SpiritIllustration scene={SPIRIT_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "hills"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <SpiritChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function SpiritThoughtStory() {
  return <MachineThoughtStory edition={SPIRIT_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
