"use client";

import { OPPORTUNITY_SCROLL_EDITION } from "@/lib/opportunity-media";
import OpportunityIllustration from "./opportunity-illustration";
import MachineScrollStory from "./machine-scroll-story";
import type { OpportunityScene } from "@/lib/machine-books/types";

const renderDiagram = (kind: string, beat: number) => {
  const scenes: Record<string, OpportunityScene[]> = {
    airbags: ["airbags", "airbags", "rollout", "rollout"],
    berries: ["berries", "minerals", "minerals", "berries"],
    sand: ["sand", "testbed", "escape", "escape"],
    marathon: ["marathon", "solar", "marathon", "marathon"],
    dust: ["dust", "signal", "quiet", "handoff"],
  };
  return <OpportunityIllustration scene={scenes[kind][beat]} step={beat} />;
};

export default function OpportunityScrollStory() {
  return <MachineScrollStory edition={OPPORTUNITY_SCROLL_EDITION} renderDiagram={renderDiagram} />;
}
