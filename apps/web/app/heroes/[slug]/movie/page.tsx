import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHero, img, portrait } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import { STORIES } from "@/lib/stories";
import { EAGLE_MEMORIES } from "@/lib/eagle-story";
import EagleFilm from "@/app/components/story/eagle-film";

/** Apollo's photographic film and original mission reels share the story's archive record. */
export function generateStaticParams() {
  return [{ slug: "apollo-11-lander" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hero = getHero((await params).slug);
  const film = hero ? STORIES[hero.slug] : undefined;
  if (!hero || hero.slug !== "apollo-11-lander" || !film) return {};
  return generateSEO({
    title: `${hero.name}, the movie | The Last Signal`,
    description: film.lede,
    path: `/heroes/${hero.slug}/movie`,
    ogImage: img(portrait(hero)),
  });
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const hero = getHero((await params).slug);
  if (!hero || hero.slug !== "apollo-11-lander") notFound();
  const film = STORIES[hero.slug];
  if (!film) notFound();

  return (
    <main>
      <EagleFilm memories={EAGLE_MEMORIES} />
    </main>
  );
}
