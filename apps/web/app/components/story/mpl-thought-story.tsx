"use client";

import { MPL_THOUGHT_EDITION } from "@/lib/mpl-thoughts";
import { MPL_ART_SCENES } from "@/lib/mpl-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import MplIllustration from "./mpl-illustration";
import MplChapterExtras from "./mpl-chapter-extras";
import "./mpl-story.css";

const renderIllustration = (moment: ThoughtMoment) => <MplIllustration scene={MPL_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "fall"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <MplChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function MplThoughtStory() {
  return <MachineThoughtStory edition={MPL_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
