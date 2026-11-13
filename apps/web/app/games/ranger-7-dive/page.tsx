import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import RangerDive from "@/app/components/profile/ranger-dive";
import { ArrowLeft } from "@/app/components/icons";
import MissionIntro from "@/app/components/clubhouse/mission-intro";

export const metadata: Metadata = generateSEO({
  title: "Ranger 7: 17-Minute Lunar Impact Dive | RoverVilla",
  description:
    "An interactive flight replay of humanity's first kamikaze dive into the Moon on July 31, 1964. Scrub from 2,110 km down to the final split-second impact at 2.62 km/s.",
  path: "/games/ranger-7-dive",
});

export default function RangerDiveGamePage() {
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

            <Link
              href="/heroes/ranger-7/story"
              className="font-mono text-xs text-violet-bright transition hover:underline"
            >
              Meet Ranger 7 ↗
            </Link>
          </div>

          <MissionIntro title="What could one last picture tell us?">Follow a camera spacecraft toward the Moon. Explore its view, then look closer at what those pictures helped people learn.</MissionIntro><div className="club-game-shell"><RangerDive standalone /></div>
        </div>
      </main>
    </>
  );
}
