import { HEROES } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import ExplorerDirectory from "@/app/components/clubhouse/explorer-directory";

export const metadata = generateSEO({
  title: "Heroes: the machines we left behind | The Last Signal",
  description: "Every rover, lander and probe in the archive, from Ranger 7 to Ingenuity.",
  path: "/heroes",
});

export default function HeroesPage() {
  return (
    <SitePage eyebrow="Meet the explorers" title="Big adventures. Little machines." lede="Some rolled. Some landed. One learned to fly. Pick a space explorer and discover the real story behind its extraordinary journey." scene="explorers">
      <ExplorerDirectory heroes={HEROES} />
    </SitePage>
  );
}
