import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import MERSimulator from "@/app/components/profile/mer-simulator";
import { ArrowLeft } from "@/app/components/icons";
import MissionIntro from "@/app/components/clubhouse/mission-intro";

export const metadata: Metadata = generateSEO({
  title: "Mars Exploration Rovers: Dust Storm & Power Survival | The Last Signal",
  description:
    "An interactive simulation of NASA's twin Mars Exploration Rovers, Spirit and Opportunity. Scrub atmospheric optical depth (tau), inspect the World Trade Center 9/11 aluminum cuffs, and analyze authentic Sol 5111 telemetry.",
  path: "/games/mer-twins",
});

export default function MERTwinsGamePage() {
  return (
    <>
      <Header />
      <main id="club-main" className="club-game-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 font-mono text-xs text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Games
            </Link>

            <div className="flex gap-4 font-mono text-xs">
              <Link
                href="/heroes/opportunity"
                className="text-orange-400 transition hover:underline"
              >
                Meet Opportunity ↗
              </Link>
              <Link
                href="/heroes/spirit"
                className="text-rose-400 transition hover:underline"
              >
                Meet Spirit ↗
              </Link>
            </div>
          </div>

          <MissionIntro title="A rover needs its sunshine.">Change the conditions in an illustrative weather lab. See why dust, sunlight, and power mattered to Spirit and Opportunity.</MissionIntro><div className="club-game-shell"><MERSimulator standalone rover="opportunity" /></div>
        </div>
      </main>
    </>
  );
}
