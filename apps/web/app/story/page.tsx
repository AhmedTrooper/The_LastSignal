import Link from "next/link";
import { HEROES } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import HeroCard from "@/app/components/hero-card";
import { BookIcon } from "@/app/components/icons";
import StoryShelf from "@/app/components/story/story-shelf";
import "./story-index.css";

export const metadata = generateSEO({ title: "Story room | RoverVilla", description: "One machine, a book of true stories. Read a comic, open a storybook, or let a space adventure unfold as you scroll.", path: "/story" });

export default function StoryIndex() {
  return <SitePage eyebrow="The story room" title="There’s a friend between these pages." lede="Find a quiet corner. Pick an explorer. Their real adventures come as scroll stories, comics, and books—your pace, your favourite way to read." scene="stories">
    <StoryShelf />
    <div className="club-section-heading"><div><h2 className="display">More explorers. More stories.</h2><p>A different journey behind every machine. Who will you meet next?</p></div></div>
    <ul className="club-explorer-grid">{HEROES.map(hero => <li key={hero.slug}><HeroCard hero={hero} story /></li>)}</ul>
    <div className="club-reading-launch"><div><h2 className="display">One more page?</h2><p>The original illustrated collection is still here, too. Choose a machine and turn the page.</p></div><Link href="/story/book" className="club-button club-button-secondary"><BookIcon className="h-5 w-5" />Open the collection</Link></div>
  </SitePage>;
}
