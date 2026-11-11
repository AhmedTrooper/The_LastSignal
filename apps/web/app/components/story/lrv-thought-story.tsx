"use client";

import { LRV_THOUGHT_EDITION } from "@/lib/lrv-thoughts";
import { LRV_ART_SCENES } from "@/lib/rover-scenes";
import type { ThoughtMoment } from "@/lib/thought-clouds";
import MachineThoughtStory from "./machine-thought-story";
import LrvIllustration from "./lrv-illustration";
import RoverChapterExtras from "./rover-chapter-extras";
import "./reviewed-rovers.css";

const illustration = (moment: ThoughtMoment) => <LrvIllustration scene={LRV_ART_SCENES[moment.chapterId as keyof typeof LRV_ART_SCENES][moment.beatSequence - 1]} />;
const extras = (moment: ThoughtMoment) => <RoverChapterExtras key={moment.chapterId} machine="lrv" chapter={moment.chapterId} />;
export default function LrvThoughtStory() { return <MachineThoughtStory edition={LRV_THOUGHT_EDITION} renderIllustration={illustration} renderNotesExtras={extras} />; }
