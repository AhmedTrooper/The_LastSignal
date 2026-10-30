import type { Metadata } from "next";
import SitePage from "@/app/components/site-page";
import MPLSimulator from "@/app/components/profile/mpl-simulator";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Mars Polar Lander 40-Meter Crash Forensics | The Last Signal",
  description:
    "Forensic reconstruction of Mars Polar Lander's premature engine cutoff 40 meters above Planum Australe. Sourced from the NASA Casani Board Report.",
  path: "/games/polar-lander-forensics",
});

export default function PolarLanderForensicsGamePage() {
  return (
    <SitePage
      eyebrow="Forensic Flight Simulator"
      title="The 40-Meter Engine Cutoff Bug"
      lede="Why did Mars Polar Lander go silent on December 3, 1999? Calculate the free fall impact speed, inspect the un-cleared sensor bit, and discover the NASA reforms that saved future rovers."
    >
      <div className="space-y-12">
        <MPLSimulator standalone />

        <div className="mt-8 rounded-2xl border border-line bg-mist p-6">
          <h3 className="display text-xl font-bold text-ink">
            Authentic NASA Review Board Context: Casani & Spear Report
          </h3>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            In March 2000, NASA released the official Casani Board Report detailing the probable cause of the Mars Polar Lander loss. Testing revealed that landing gear leg deployment springs created magnetic sensor transients that set the touchdown bit in the computer at 1,500 meters altitude. When software began monitoring for touchdown at 40 meters altitude, it read the pre-existing TRUE bit and cut the engines in mid-air. The reforms resulting from this failure mandated the deep-space telemetry beacons and end-to-end hardware-in-the-loop testing that made Spirit, Opportunity, Curiosity, and Perseverance successful.
          </p>
        </div>
      </div>
    </SitePage>
  );
}
