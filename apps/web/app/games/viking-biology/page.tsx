import type { Metadata } from "next";
import SitePage from "@/app/components/site-page";
import VikingSimulator from "@/app/components/profile/viking-simulator";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Viking Mars Biology Lab | RoverVilla",
  description:
    "Simulate the 1976 Viking Labeled Release radioactive soil experiment and solve the 32-year perchlorate mystery with authentic NASA telemetry.",
  path: "/games/viking-biology",
});

export default function VikingBiologyGamePage() {
  return (
    <SitePage
      eyebrow="Viking / A travelling laboratory"
      title="A scoop of soil. A very big question."
      lede="What can an experiment tell us about an unfamiliar world? Try the laboratory controls and think about more than one explanation for a result."
      scene="games"
    >
      <div className="space-y-12">
        <VikingSimulator lander="viking-1" standalone />

        <details className="club-note mt-8"><summary className="cursor-pointer py-2 font-semibold">Look deeper: mission background</summary>
          <h3 className="display text-xl font-bold text-ink">
            Authentic NASA Mission Context: Project Viking
          </h3>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            In July 1976, Viking 1 became the first spacecraft to operate successfully on the surface of Mars. Its biology package was an engineering marvel: three miniature laboratories crammed into a one-cubic-foot automated container. The Labeled Release experiment gave a startling positive signal, but the lack of organic carbon detected by the GCMS puzzled scientists for decades until the 2008 Phoenix lander discovered oxidizing perchlorate salts in Martian soil.
          </p>
        </details>
      </div>
    </SitePage>
  );
}
