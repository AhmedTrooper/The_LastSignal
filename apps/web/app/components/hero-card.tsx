import Image from "next/image";
import Link from "next/link";
import { machineEntryUrl } from "@/lib/machine-links";
import { type Hero, catNo, lifespan, assetUrl, img, portrait } from "@/lib/heroes";
import { photo } from "@/lib/photos";
import { ArrowRight } from "@/app/components/icons";
import { EXPLORER_TRAITS } from "@/lib/clubhouse";

/** A roomy explorer card: character first, source-labelled image, mission facts underneath. */
export default function HeroCard({ hero, size = "md", priority = false, story = false }: { hero: Hero; size?: "lg" | "md"; priority?: boolean; story?: boolean }) {
  const archive = photo(portrait(hero), hero.name);
  const illustration = !!hero.card;
  return <Link href={story ? `/heroes/${hero.slug}/story` : machineEntryUrl(hero.slug)} className={`club-explorer-card ${size === "lg" ? "club-explorer-card-large" : ""}`}>
    <div className="club-explorer-stage" data-world={hero.body}>
      <span className="club-world-badge" data-world={hero.body}><span aria-hidden="true" />{hero.body === "moon" ? "The Moon" : "Mars"}</span>
      <Image src={illustration ? assetUrl(`images/${hero.card}.webp`) : img(portrait(hero))} alt={illustration ? `${hero.name}, AI-generated illustration` : archive.alt} fill priority={priority} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" className={illustration ? "object-contain p-5" : "object-cover"} />
      <span className="club-art-label">{illustration || archive.ai ? "AI-generated illustration" : archive.credit}</span>
    </div>
    <div className="club-explorer-copy"><p className="club-kicker">{catNo(hero.no)} / {hero.kind}</p><h3 className="display">{hero.slug === "apollo-11-lander" ? "Eagle" : hero.name}</h3><p className="club-explorer-trait">{EXPLORER_TRAITS[hero.slug] ?? "An explorer with a story"}</p><p className="club-explorer-summary">{hero.summary}</p><div className="club-explorer-bottom"><span>{lifespan(hero)}</span><span>{story ? "Read my story" : "Meet me"} <ArrowRight className="h-4 w-4" /></span></div></div>
  </Link>;
}
