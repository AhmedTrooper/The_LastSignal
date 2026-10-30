import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import IngenuitySimulator from "@/app/components/profile/ingenuity-simulator";
import { ArrowLeft } from "@/app/components/icons";

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
      <main className="min-h-screen bg-[#06050e] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 font-mono text-xs text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Games
            </Link>

            <Link
              href="/heroes/ingenuity"
              className="font-mono text-xs text-cyan-300 transition hover:underline"
            >
              View Ingenuity Profile ↗
            </Link>
          </div>

          <IngenuitySimulator standalone />
        </div>
      </main>
    </>
  );
}
