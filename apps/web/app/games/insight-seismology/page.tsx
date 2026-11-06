import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import InSightSimulator from "@/app/components/profile/insight-simulator";
import { ArrowLeft } from "@/app/components/icons";
import MissionIntro from "@/app/components/clubhouse/mission-intro";

export const metadata: Metadata = generateSEO({
  title: "InSight: Marsquake Seismology & Core Explorer | The Last Signal",
  description:
    "An interactive simulator exploring Mars's deep interior. Sonify real marsquakes from 1,319 seismic detections, inspect the liquid core, and explore the HP3 Mole at Homestead Hollow.",
  path: "/games/insight-seismology",
});

export default function InSightSeismologyGamePage() {
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
              href="/heroes/insight"
              className="font-mono text-xs text-rose-300 transition hover:underline"
            >
              Meet InSight ↗
            </Link>
          </div>

          <MissionIntro title="What’s moving beneath Mars?">A still-looking landscape can have a story underneath. Explore the signals and learn why scientists compare vibrations carefully.</MissionIntro><div className="club-game-shell"><InSightSimulator standalone /></div>
        </div>
      </main>
    </>
  );
}
