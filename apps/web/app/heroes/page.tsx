import { HEROES } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import ExplorerDirectory from "@/app/components/clubhouse/explorer-directory";

export const metadata = generateSEO({
  title: "Explorer archive | RoverVilla",
  description: "Browse the machines' detailed profiles, hardware, mission records, and archive media, from Ranger 7 to Ingenuity.",
  path: "/heroes",
});

export default function HeroesPage() {
  return (
    <SitePage eyebrow="Explorer archive" title="Meet the machines up close." lede="Pick an explorer to open its detailed profile, look around its hardware, and browse its mission records and archive media." scene="explorers">
      <ExplorerDirectory heroes={HEROES} />
    </SitePage>
  );
}
