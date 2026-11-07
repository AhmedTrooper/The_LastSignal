import Link from "next/link";
import { HEROES } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import HeroCard from "@/app/components/hero-card";
import { ArrowLeft } from "@/app/components/icons";

export const metadata = generateSEO({
  title: "Our heroes | RoverVilla",
  description: "A different journey behind every machine. Meet the space explorers and follow their stories from the Moon and Mars.",
  path: "/our-hero",
});

export default function OurHeroesPage() {
  return (
    <SitePage eyebrow="Our heroes" title="More explorers. More stories." lede="A different journey behind every machine. Who will you meet next?" scene="explorers">
      <div className="club-directory-tools">
        <Link href="/story" className="club-button club-button-secondary"><ArrowLeft className="h-4 w-4" />Back to the story room</Link>
      </div>
      <h2 className="sr-only">Choose an explorer</h2>
      <ul className="club-explorer-grid" aria-label="Our space explorers">
        {HEROES.map(hero => <li key={hero.slug}><HeroCard hero={hero} story /></li>)}
      </ul>
    </SitePage>
  );
}
