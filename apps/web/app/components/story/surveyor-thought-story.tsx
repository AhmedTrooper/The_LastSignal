"use client";

import { SURVEYOR_THOUGHT_EDITION } from "@/lib/surveyor-thoughts";
import { SURVEYOR_ART_SCENES } from "@/lib/surveyor-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import SurveyorIllustration from "./surveyor-illustration";
import SurveyorChapterExtras from "./surveyor-chapter-extras";
import "./surveyor-story.css";

const renderIllustration = (moment: ThoughtMoment) => <SurveyorIllustration scene={SURVEYOR_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "touchdown"} />;
const renderNotesExtras = (moment: ThoughtMoment) => <SurveyorChapterExtras key={moment.chapterId} chapter={moment.chapterId} />;
export default function SurveyorThoughtStory() {
  return <MachineThoughtStory edition={SURVEYOR_THOUGHT_EDITION} renderIllustration={renderIllustration} renderNotesExtras={renderNotesExtras} />;
}
