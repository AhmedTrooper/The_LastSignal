"use client";

import { useCallback, useState } from "react";
import EagleLandingGame from "./eagle-landing-game";
import EagleLearningLens from "@/app/components/profile/eagle-learning-lens";
import EagleCharacter from "@/app/components/profile/eagle-character";

export default function EagleLandingLesson() {
  const [landed, setLanded] = useState(false);
  const finish = useCallback(() => setLanded(true), []);
  return <div className="space-y-6"><EagleLandingGame onLanded={finish} />{landed && <p role="status" className="rounded-xl border border-[#d4b6de] bg-[#f2e5fa] p-4 text-sm text-[#795386]">You landed in the game. Now compare the idea with the jobs of Eagle&apos;s actual engine and landing gear.</p>}<EagleLearningLens memory="touchdown" /><details className="rounded-xl border border-[#d7bfdc] bg-[#fffaf0] p-4 text-[#765387]"><summary className="cursor-pointer text-sm font-semibold">Tap the real component names in a storybook diagram</summary><div className="mt-4"><EagleCharacter interactive /></div></details></div>;
}
