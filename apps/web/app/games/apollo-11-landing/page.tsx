import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import ApolloSimulator from "@/app/components/profile/apollo-simulator";
import { ArrowLeft } from "@/app/components/icons";

export const metadata: Metadata = generateSEO({
  title: "Apollo 11: Tranquility Base & Eagle Cockpit | The Last Signal",
  description:
    "An interactive cockpit and artifact simulation of the Apollo 11 lunar landing at Tranquility Base. Experience the 1202 computer alarms, manual hover over West Crater, and explore the artifacts left on the Moon.",
  path: "/games/apollo-11-landing",
});

export default function ApolloLandingGamePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#070611] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 font-mono text-xs text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Games
            </Link>

            <Link
              href="/heroes/apollo-11-lander"
              className="font-mono text-xs text-violet-bright transition hover:underline"
            >
              View Eagle Dossier ↗
            </Link>
          </div>

          <ApolloSimulator standalone />
        </div>
      </main>
    </>
  );
}
