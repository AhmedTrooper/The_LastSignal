import Link from "next/link";
import { ArrowRight } from "@/app/components/icons";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";
import { MACHINE_BOOKS, machineBookUrl, machineStoryUrl } from "@/lib/machine-books";
import OpportunityIllustration from "./opportunity-illustration";
import RangerIllustration from "./ranger-illustration";
import InsightIllustration from "./insight-illustration";
import IngenuityIllustration from "./ingenuity-illustration";

/** The story editions shelf, separate from the machine catalogue below it. */
export default function StoryShelf() {
  return (
    <div className="story-index-shelf">
      <div className="club-featured-stories">
        {MACHINE_BOOKS.map(book => (
          <article key={book.slug} className="club-book-feature" aria-labelledby={`story-shelf-${book.slug}`}>
            <figure className="story-index-figure" aria-describedby="story-index-art-note">
              <div className="club-book-feature-art">
                {book.slug === "apollo-11-lander" ? <EagleIssueArt scene="quiet" />
                  : book.slug === "ranger-7" ? <RangerIllustration scene="tower" />
                  : book.slug === "insight" ? <InsightIllustration />
                  : book.slug === "ingenuity" ? <IngenuityIllustration />
                  : <OpportunityIllustration scene="rollout" />}
              </div>
            </figure>
            <div className="club-book-feature-copy">
              <p className="club-kicker">{book.name} / {book.chapters.length} standalone chapters</p>
              <h2 id={`story-shelf-${book.slug}`} className="display">{book.title}</h2>
              <p>{book.introduction}</p>
              <div className="story-index-links">
                <Link href={machineStoryUrl(book.slug)} className="club-button club-button-primary">
                  Let the story unfold <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={machineBookUrl(book.slug, undefined, "comic")}>Comic ↗</Link>
                <Link href={machineBookUrl(book.slug, undefined, "book")}>Storybook ↗</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p id="story-index-art-note" className="story-index-art-note">Character illustrations in this shelf are AI-assisted, not mission photographs.</p>
    </div>
  );
}
