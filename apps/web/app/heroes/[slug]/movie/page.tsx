import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHero, img, portrait } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import { EAGLE_MEMORIES } from "@/lib/eagle-story";
import EagleFilm from "@/app/components/story/eagle-film";

/** Apollo's photographic film and original mission reels share the story's archive record. */
export function generateStaticParams() {
  return [{ slug: "apollo-11-lander" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hero = getHero((await params).slug);
  if (!hero || hero.slug !== "apollo-11-lander") return {};
  return generateSEO({
    title: "Eagle's hardware memories: illustrated film and original reels | RoverVilla",
    description: "Follow Eagle's real components and mission through illustrated memories, source-labelled photographs, and original onboard film.",
    path: `/heroes/${hero.slug}/movie`,
    ogImage: img(portrait(hero)),
  });
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const hero = getHero((await params).slug);
  if (!hero || hero.slug !== "apollo-11-lander") notFound();

  return (
    <main>
      <EagleFilm memories={EAGLE_MEMORIES} />
    </main>
  );
}
