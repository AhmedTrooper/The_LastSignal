import type { Metadata } from "next";
import SitePage from "@/app/components/site-page";
import LCROSSSimulator from "@/app/components/profile/lcross-simulator";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "LCROSS 7.2 GJ Kinetic Impact & Water Ice | The Last Signal",
  description:
    "Simulate the 7.2 Gigajoule kinetic impact of the Centaur rocket into Cabeus crater and detect water ice absorption at 1.4 µm and 1.9 µm.",
  path: "/games/lcross-impact",
});

export default function LCROSSImpactGamePage() {
  return (
    <SitePage
      eyebrow="Kinetic Impact Simulator"
      title="The 7.2 GJ Plume That Found Water on the Moon"
      lede="Calculate the kinetic energy of a 2,305 kg rocket impacting at 9,000 km/h, fly through the 10-km dust plume, and inspect the infrared spectra that confirmed pure water ice in permanent lunar shadow."
    >
      <div className="space-y-12">
        <LCROSSSimulator standalone />

        <div className="mt-8 rounded-2xl border border-line bg-mist p-6">
          <h3 className="display text-xl font-bold text-ink">
            Authentic NASA Mission Context: LCROSS in Cabeus Crater
          </h3>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            On October 9, 2009, NASA sent the LCROSS Centaur upper stage hurtling into the permanently shadowed floor of Cabeus crater near the lunar south pole. The collision excavated a 20-meter crater and launched 350 tons of regolith into the sunlight. Trailing four minutes behind, the shepherding spacecraft flew through the plume, using near-infrared spectrometers to detect the distinctive absorption signatures of water ice at 1.4 µm and 1.9 µm. The mission proved that polar craters on the Moon harbor volatile reservoirs essential for future lunar exploration.
          </p>
        </div>
      </div>
    </SitePage>
  );
}
