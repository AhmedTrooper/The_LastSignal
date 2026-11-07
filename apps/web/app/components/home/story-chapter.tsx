import type { ReactNode } from "react";
import { HomeReveal } from "./home-motion";

/**
 * One chapter of the home page journey. Each chapter gets its own tint so the page reads
 * as a sequence of rooms rather than a stack of sections — the "scroll-triggered
 * storytelling" pattern from the UI/UX Pro Max dataset.
 */
export default function StoryChapter({
  tint,
  number,
  kicker,
  title,
  lede,
  aside,
  children,
  layout = "split",
}: {
  tint: "lilac" | "peach" | "sage" | "sand";
  number: string;
  kicker: string;
  title: ReactNode;
  lede: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  layout?: "split" | "stack";
}) {
  return (
    <section className={`rv-chapter rv-chapter-${tint} rv-chapter-${layout}`} aria-labelledby={`rv-chapter-${number}`}>
      <div className="rv-chapter-inner">
        <HomeReveal className="rv-chapter-heading">
          <div className="rv-chapter-copy">
            <p className="rv-kicker">
              <span className="rv-chapter-number">{number}</span>
              {kicker}
            </p>
            <h2 id={`rv-chapter-${number}`} className="display rv-chapter-title">
              {title}
            </h2>
            <p className="rv-chapter-lede">{lede}</p>
          </div>
          {aside && <div className="rv-chapter-aside">{aside}</div>}
        </HomeReveal>
        <HomeReveal className="rv-chapter-content">{children}</HomeReveal>
      </div>
    </section>
  );
}
