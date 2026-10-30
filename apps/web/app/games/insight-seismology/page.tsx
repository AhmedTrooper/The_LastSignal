import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import InSightSimulator from "@/app/components/profile/insight-simulator";
import { ArrowLeft } from "@/app/components/icons";

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
      <main className="min-h-screen bg-[#070511] px-4 py-8 sm:px-6 lg:px-8">
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
              View InSight Dossier ↗
            </Link>
          </div>

          <InSightSimulator standalone />
        </div>
      </main>
    </>
  );
}
