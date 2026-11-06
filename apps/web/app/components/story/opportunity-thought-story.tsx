"use client";

import { OPPORTUNITY_SCROLL_EDITION } from "@/lib/opportunity-media";
import { OPPORTUNITY_THOUGHTS } from "@/lib/opportunity-thoughts";
import type { ThoughtEdition, ThoughtMoment } from "@/lib/thought-clouds";
import OpportunityIllustration from "./opportunity-illustration";
import MachineThoughtStory from "./machine-thought-story";

const edition: ThoughtEdition = {
  ...OPPORTUNITY_SCROLL_EDITION, moments: OPPORTUNITY_THOUGHTS, manifestUrl: "/api/stories/opportunity/narration",
  opening: { ...OPPORTUNITY_SCROLL_EDITION.opening, introduction: "Come with me. I’ve got a few things I’d like to tell you.", invitation: "One thought at a time. Scroll to follow along." },
};
const renderIllustration = (moment: ThoughtMoment) => <OpportunityIllustration scene={edition.book.chapters[moment.chapterSequence - 1].beats[moment.beatSequence - 1].roverArt!} step={moment.beatSequence - 1} stage />;

export default function OpportunityThoughtStory() {
  return <MachineThoughtStory edition={edition} renderIllustration={renderIllustration} />;
}
