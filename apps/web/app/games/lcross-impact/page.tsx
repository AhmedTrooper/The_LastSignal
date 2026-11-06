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
      eyebrow="LCROSS / Clues in the shadows"
      title="What was hiding in that crater?"
      lede="A planned impact lifted material into view. Explore the plume, then see why scientists study more than just a photograph."
      scene="map"
    >
      <div className="space-y-12">
        <LCROSSSimulator standalone />

        <details className="club-note mt-8"><summary className="cursor-pointer py-2 font-semibold">Look deeper: mission background</summary>
          <h3 className="display text-xl font-bold text-ink">
            Authentic NASA Mission Context: LCROSS in Cabeus Crater
          </h3>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            On October 9, 2009, NASA sent the LCROSS Centaur upper stage hurtling into the permanently shadowed floor of Cabeus crater near the lunar south pole. The collision excavated a 20-meter crater and launched 350 tons of regolith into the sunlight. Trailing four minutes behind, the shepherding spacecraft flew through the plume, using near-infrared spectrometers to detect the distinctive absorption signatures of water ice at 1.4 µm and 1.9 µm. The mission proved that polar craters on the Moon harbor volatile reservoirs essential for future lunar exploration.
          </p>
        </details>
      </div>
    </SitePage>
  );
}
