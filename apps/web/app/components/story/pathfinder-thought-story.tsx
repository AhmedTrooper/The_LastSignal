"use client";

import { PATHFINDER_THOUGHT_EDITION } from "@/lib/pathfinder-thoughts";
import { PATHFINDER_ART_SCENES } from "@/lib/rover-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import PathfinderIllustration from "./pathfinder-illustration";
import RoverChapterExtras from "./rover-chapter-extras";
import "./reviewed-rovers.css";

const illustration = (moment: ThoughtMoment) => <PathfinderIllustration scene={PATHFINDER_ART_SCENES[moment.chapterId as keyof typeof PATHFINDER_ART_SCENES][moment.beatSequence - 1]} />;
const extras = (moment: ThoughtMoment) => <RoverChapterExtras key={moment.chapterId} machine="pathfinder" chapter={moment.chapterId} />;
export default function PathfinderThoughtStory() { return <MachineThoughtStory edition={PATHFINDER_THOUGHT_EDITION} renderIllustration={illustration} renderNotesExtras={extras} />; }
