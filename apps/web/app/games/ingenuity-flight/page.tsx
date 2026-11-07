import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import IngenuitySimulator from "@/app/components/profile/ingenuity-simulator";
import { ArrowLeft } from "@/app/components/icons";
import MissionIntro from "@/app/components/clubhouse/mission-intro";

export const metadata: Metadata = generateSEO({
  title: "Ingenuity: Mars Rotorcraft Aerodynamics & Flight Lab | The Last Signal",
  description:
    "An interactive simulator exploring the aerodynamics of powered flight in Mars's 1% atmosphere. Tweak atmospheric density and rotor RPM, inspect all 72 flights, and discover the 1903 Wright Flyer fabric swatch on Mars.",
  path: "/games/ingenuity-flight",
});

export default function IngenuityFlightGamePage() {
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
              href="/heroes/ingenuity/story"
              className="font-mono text-xs text-cyan-300 transition hover:underline"
            >
              Meet Ingenuity ↗
            </Link>
          </div>

          <MissionIntro title="What if we could fly on Mars?">Explore spinning blades and thin air. Try a setting, notice what changes, and meet the real little helicopter behind the experiment.</MissionIntro><div className="club-game-shell"><IngenuitySimulator standalone /></div>
        </div>
      </main>
    </>
  );
}
