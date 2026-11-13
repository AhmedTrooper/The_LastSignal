import type { Metadata } from "next";
import SitePage from "@/app/components/site-page";
import MPLSimulator from "@/app/components/profile/mpl-simulator";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Mars Polar Lander 40-Meter Crash Forensics | RoverVilla",
  description:
    "Forensic reconstruction of Mars Polar Lander's premature engine cutoff 40 meters above Planum Australe. Sourced from the NASA Casani Board Report.",
  path: "/games/polar-lander-forensics",
});

export default function PolarLanderForensicsGamePage() {
  return (
    <SitePage
      eyebrow="Mars Polar Lander / A missing signal"
      title="When should a machine trust a signal?"
      lede="Investigate a possible landing-system failure. Compare the signals, explore the timing, and remember: a proposed explanation is not the same as an observed final moment."
      scene="games"
    >
      <div className="space-y-12">
        <MPLSimulator standalone />

        <details className="club-note mt-8"><summary className="cursor-pointer py-2 font-semibold">Look deeper: mission background</summary>
          <h3 className="display text-xl font-bold text-ink">
            Authentic NASA Review Board Context: Casani & Spear Report
          </h3>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            In March 2000, NASA released the official Casani Board Report detailing the probable cause of the Mars Polar Lander loss. Testing revealed that landing gear leg deployment springs created magnetic sensor transients that set the touchdown bit in the computer at 1,500 meters altitude. When software began monitoring for touchdown at 40 meters altitude, it read the pre-existing TRUE bit and cut the engines in mid-air. The reforms resulting from this failure mandated the deep-space telemetry beacons and end-to-end hardware-in-the-loop testing that made Spirit, Opportunity, Curiosity, and Perseverance successful.
          </p>
        </details>
      </div>
    </SitePage>
  );
}
