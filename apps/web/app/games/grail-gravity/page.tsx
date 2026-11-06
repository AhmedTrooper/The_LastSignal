import type { Metadata } from "next";
import SitePage from "@/app/components/site-page";
import GRAILSimulator from "@/app/components/profile/grail-simulator";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "GRAIL Microwave Gravity Lab | The Last Signal",
  description:
    "Measure the Moon's gravity field with 0.02 micrometer-per-second precision using tandem Ka-band ranging, and explore the Sally K. Ride Impact Site.",
  path: "/games/grail-gravity",
});

export default function GRAILGravityGamePage() {
  return (
    <SitePage
      eyebrow="GRAIL / The Moon gravity lab"
      title="Two spacecraft. One remarkable Moon."
      lede="Follow Ebb and Flow. Explore how the changing space between two orbiters can help us learn about a world beneath them."
      scene="map"
    >
      <div className="space-y-12">
        <GRAILSimulator standalone />

        <details className="club-note mt-8"><summary className="cursor-pointer py-2 font-semibold">Look deeper: mission background</summary>
          <h3 className="display text-xl font-bold text-ink">
            Authentic NASA Mission Context: GRAIL Ebb & Flow
          </h3>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            In 2012, NASA&apos;s GRAIL mission mapped the gravitational field of the Moon with unprecedented precision. By measuring small variations in the distance between the twin spacecraft down to 20 nanometers per second using Ka-band microwaves, scientists proved the Moon&apos;s crust is only 34 to 43 km thick (slashing previous Apollo seismic estimates almost in half) and discovered ancient magma dikes up to 500 km long. Over 100,000 students participated through Dr. Sally Ride&apos;s MoonKAM camera program before the twins ended their mission on a mountain ridge named in her honor.
          </p>
        </details>
      </div>
    </SitePage>
  );
}
