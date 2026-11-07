"use client";

import { RANGER_SCROLL_EDITION } from "@/lib/ranger-scroll";
import { RANGER_ART_SCENES } from "@/lib/ranger-scenes";
import { RANGER_THOUGHTS } from "@/lib/ranger-thoughts";
import type { ThoughtEdition, ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import RangerIllustration from "./ranger-illustration";

const edition: ThoughtEdition = {
  ...RANGER_SCROLL_EDITION,
  moments: RANGER_THOUGHTS,
  manifestUrl: "/api/stories/ranger-7/narration",
};

const renderIllustration = (moment: ThoughtMoment) => (
  <RangerIllustration
    scene={RANGER_ART_SCENES[moment.chapterId]?.[moment.beatSequence - 1] ?? "tower"}
    step={moment.beatSequence - 1}
  />
);

export default function RangerThoughtStory() {
  return <MachineThoughtStory edition={edition} renderIllustration={renderIllustration} />;
}
