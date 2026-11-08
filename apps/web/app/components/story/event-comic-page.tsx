import type { EventChapter, MachineBook } from "@/lib/machine-books";
import { getHero } from "@/lib/heroes";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";
import { RANGER_ART_SCENES } from "@/lib/ranger-scenes";
import ComicScene from "./comic-scene";
import OpportunityIllustration from "./opportunity-illustration";
import RangerIllustration from "./ranger-illustration";
import InsightIllustration from "./insight-illustration";
import { INSIGHT_ART_SCENES } from "@/lib/insight-scenes";
import IngenuityIllustration from "./ingenuity-illustration";
import { INGENUITY_ART_SCENES } from "@/lib/ingenuity-scenes";
import SpiritIllustration from "./spirit-illustration";
import { SPIRIT_ART_SCENES } from "@/lib/spirit-scenes";
import SurveyorIllustration from "./surveyor-illustration";
import { SURVEYOR_ART_SCENES } from "@/lib/surveyor-scenes";
import LcrossIllustration from "./lcross-illustration";
import { LCROSS_ART_SCENES } from "@/lib/lcross-scenes";
import VikingIllustration from "./viking-illustration";
import { VIKING_ART_SCENES } from "@/lib/viking-scenes";
import VikingTwoIllustration from "./viking-two-illustration";
import { VIKING_TWO_ART_SCENES } from "@/lib/viking-two-scenes";
import GrailIllustration from "./grail-illustration";
import { GRAIL_ART_SCENES } from "@/lib/grail-scenes";

/** The same four beats become the prose edition; no parallel, drifting comic script. */
export default function EventComicPage({ book, chapter }: { book: MachineBook; chapter: EventChapter }) {
  const moon = getHero(book.slug)?.body === "moon";
  const stages = ["journey", "hardware", "science", "legacy"] as const;
  const rangerScenes = book.slug === "ranger-7" ? RANGER_ART_SCENES[chapter.id] : undefined;
  return <div className="nook-comic-grid" aria-label="Four-panel comic">
    {chapter.beats.map((beat, index) => <figure key={`${chapter.id}-${index}`} className="nook-panel">
      <div className="nook-panel-heading"><span>{String(index + 1).padStart(2, "0")}</span><span>{book.name}’s imagined voice</span></div>
      <div className="nook-bubble"><p>{beat.line}</p></div>
      {book.slug === "grail" ? <GrailIllustration scene={GRAIL_ART_SCENES[chapter.id]?.[index] ?? "twins"} /> : book.slug === "viking-2" ? <VikingTwoIllustration scene={VIKING_TWO_ART_SCENES[chapter.id]?.[index] ?? "tilt"} /> : book.slug === "viking-1" ? <VikingIllustration scene={VIKING_ART_SCENES[chapter.id]?.[index] ?? "touchdown"} /> : book.slug === "lcross" ? <LcrossIllustration scene={LCROSS_ART_SCENES[chapter.id]?.[index] ?? "plan"} /> : book.slug === "surveyor-1" ? <SurveyorIllustration scene={SURVEYOR_ART_SCENES[chapter.id]?.[index] ?? "touchdown"} /> : book.slug === "spirit" ? <SpiritIllustration scene={SPIRIT_ART_SCENES[chapter.id]?.[index] ?? "hills"} /> : book.slug === "ingenuity" ? <IngenuityIllustration scene={INGENUITY_ART_SCENES[chapter.id]?.[index] ?? "hover"} /> : book.slug === "insight" ? <InsightIllustration scene={INSIGHT_ART_SCENES[chapter.id]?.[index] ?? "lander"} /> : beat.roverArt ? <OpportunityIllustration scene={beat.roverArt} step={index} /> : beat.art ? <EagleIssueArt scene={beat.art} /> : rangerScenes?.[index] ? <RangerIllustration scene={rangerScenes[index]} step={index} /> : <ComicScene machine={book.slug} stage={stages[index]} moon={moon} />}
      {beat.sfx && <span className="nook-sfx" aria-label={`Imagined sound effect: ${beat.sfx}`}>{beat.sfx}</span>}
      <figcaption>{beat.detail}</figcaption>
    </figure>)}
  </div>;
}
