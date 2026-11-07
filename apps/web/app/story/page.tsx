import Link from "next/link";
import { HEROES } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import HeroCard from "@/app/components/hero-card";
import { ArrowRight, BookIcon } from "@/app/components/icons";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";
import OpportunityIllustration from "@/app/components/story/opportunity-illustration";
import RangerIllustration from "@/app/components/story/ranger-illustration";
import InsightIllustration from "@/app/components/story/insight-illustration";
import IngenuityIllustration from "@/app/components/story/ingenuity-illustration";
import { MACHINE_BOOKS, machineBookUrl, machineStoryUrl } from "@/lib/machine-books";

export const metadata = generateSEO({ title: "Story room | RoverVilla", description: "One machine, a book of true stories. Read a comic, open a storybook, or let a space adventure unfold as you scroll.", path: "/story" });

export default function StoryIndex() {
  return <SitePage eyebrow="The story room" title="There’s a friend between these pages." lede="Find a quiet corner. Pick an explorer. Their real adventures come as scroll stories, comics, and books—your pace, your favourite way to read." scene="stories">
    <div className="club-featured-stories">{MACHINE_BOOKS.map(book => <article key={book.slug} className="club-book-feature"><div className="club-book-feature-art">{book.slug === "apollo-11-lander" ? <EagleIssueArt scene="quiet" /> : book.slug === "ranger-7" ? <RangerIllustration scene="tower" /> : book.slug === "insight" ? <InsightIllustration /> : book.slug === "ingenuity" ? <IngenuityIllustration /> : <OpportunityIllustration scene="rollout" />}<span className="club-art-label">AI-assisted story illustration</span></div><div className="club-book-feature-copy"><p className="club-kicker">{book.name} / {book.chapters.length} standalone chapters</p><h2 className="display">{book.title}</h2><p>{book.introduction}</p><div><Link href={machineStoryUrl(book.slug)} className="club-button club-button-primary">Let the story unfold <ArrowRight className="h-4 w-4" /></Link><Link href={machineBookUrl(book.slug, undefined, "comic")}>Comic ↗</Link><Link href={machineBookUrl(book.slug, undefined, "book")}>Storybook ↗</Link></div></div></article>)}</div>
    <div className="club-section-heading"><div><h2 className="display">More explorers. More stories.</h2><p>A different journey behind every machine. Who will you meet next?</p></div></div>
    <ul className="club-explorer-grid">{HEROES.map(hero => <li key={hero.slug}><HeroCard hero={hero} story /></li>)}</ul>
    <div className="club-reading-launch"><div><h2 className="display">One more page?</h2><p>The original illustrated collection is still here, too. Choose a machine and turn the page.</p></div><Link href="/story/book" className="club-button club-button-secondary"><BookIcon className="h-5 w-5" />Open the collection</Link></div>
  </SitePage>;
}
