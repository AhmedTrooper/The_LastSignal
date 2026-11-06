import type { EventChapter, MachineBook } from "@/lib/machine-books";
import { getHero } from "@/lib/heroes";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";
import ComicScene from "./comic-scene";

/** The same four beats become the prose edition; no parallel, drifting comic script. */
export default function EventComicPage({ book, chapter }: { book: MachineBook; chapter: EventChapter }) {
  const moon = getHero(book.slug)?.body === "moon";
  const stages = ["journey", "hardware", "science", "legacy"] as const;
  return <div className="nook-comic-grid" aria-label="Four-panel comic">
    {chapter.beats.map((beat, index) => <figure key={`${chapter.id}-${index}`} className="nook-panel">
      <div className="nook-panel-heading"><span>{String(index + 1).padStart(2, "0")}</span><span>{book.name}’s imagined voice</span></div>
      <div className="nook-bubble"><p>{beat.line}</p></div>
      {beat.art ? <EagleIssueArt scene={beat.art} /> : <ComicScene machine={book.slug} stage={stages[index]} moon={moon} />}
      <figcaption>{beat.detail}</figcaption>
    </figure>)}
  </div>;
}
