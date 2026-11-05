import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import EagleLandingLesson from "@/app/components/story/eagle-landing-lesson";
import EagleJourneyNav from "@/app/components/profile/eagle-journey-nav";
import { ArrowLeft } from "@/app/components/icons";

export const metadata: Metadata = generateSEO({
  title: "Eagle's landing challenge: learn what the real hardware did | RoverVilla",
  description:
    "Try a simplified landing game, then discover how Eagle's descent engine, landing legs, and contact probes supported the actual Apollo 11 mission. Gameplay readings are not historical telemetry.",
  path: "/games/apollo-11-landing",
});

export default function ApolloLandingGamePage() {
  return (
    <>
      <Header />
      <EagleJourneyNav />
      <main className="min-h-screen bg-[#fff9ef] px-4 py-8 text-[#30243d] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#775884] transition hover:text-[#563564]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Games
            </Link>

            <Link
              href="/heroes/apollo-11-lander"
              className="font-mono text-xs text-violet-bright transition hover:underline"
            >
              Read Eagle&apos;s comic ↗
            </Link>
          </div>

          <div className="eagle-story"><p className="font-mono text-[10px] uppercase tracking-wider text-[#77528d]">One real mission. An illustrative practice game.</p><h1 className="display mt-3 text-4xl sm:text-5xl">Find a place for my feet.</h1><p className="mb-6 mt-4 max-w-xl text-sm leading-relaxed text-[#796781]">Guide the game lander beyond rough ground and settle gently. Then meet the actual engine and landing gear behind the lesson. This is not a replay of the flight or a live telemetry feed.</p><EagleLandingLesson /><Link href="/heroes/apollo-11-lander/story" className="mt-5 inline-flex min-h-11 items-center text-sm text-[#79548b]">Explore the actual mission&apos;s eight memories ↗</Link></div>
        </div>
      </main>
    </>
  );
}
