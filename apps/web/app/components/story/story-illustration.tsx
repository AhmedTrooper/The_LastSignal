"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import type { StoryIllustration } from "@/lib/thought-clouds";
import { storyImageMotion } from "@/lib/story-image-motion";

/** A beat owns its entrance: image decode + viewport entry start it once; scrolling never restarts it. */
export default function StoryIllustrationView({ illustration, reduced, fallback }: { illustration: StoryIllustration; reduced: boolean; fallback?: ReactNode }) {
  // Observe the unclipped frame: scan/bloom start below the 15% visibility threshold.
  const figure = useRef<HTMLElement>(null);
  const inView = useInView(figure, { once: true, amount: 0.15 });
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const failed = state === "error";
  const recipe = storyImageMotion(illustration.motion, reduced || failed);
  const play = reduced || failed || (inView && state === "loaded");
  return <figure ref={figure} className="tc-art tc-art-story-image" data-art-for={illustration.beatId} data-media-kind={failed ? "diagram" : "illustration"} data-image-motion={illustration.motion ?? "bloom"} data-image-state={state}>
    <motion.div className="tc-art-picture apollo-story-image" initial={reduced ? false : recipe.initial} animate={play ? recipe.animate : recipe.initial} transition={recipe.transition} style={{ transformPerspective: 900 }}>
      {failed ? fallback ?? <p>{illustration.alt}</p> : <Image src={illustration.src} alt={illustration.alt} fill loading="eager" sizes="(min-width:900px) 56vw, 90vw" className="object-contain" onLoad={() => setState("loaded")} onError={() => setState("error")} />}
    </motion.div>
    <figcaption><span>{failed ? "Story image unavailable · AI-assisted diagram, not to scale" : `${illustration.title} · AI-assisted illustration, not a photograph`}</span><span>Source notes in “More to this moment”.</span></figcaption>
    <noscript><style>{".apollo-story-image { opacity: 1 !important; transform: none !important; clip-path: none !important; }"}</style></noscript>
  </figure>;
}
