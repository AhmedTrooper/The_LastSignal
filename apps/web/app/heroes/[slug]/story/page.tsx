import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HEROES, bodyName, catNo, fmtCoords, getHero, img, nextHero, portrait, storyChapters } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import StoryView from "@/app/components/story/story-view";
import CinematicStory from "@/app/components/story/cinematic-story";
import { STORIES } from "@/lib/stories";
import { EAGLE_MEMORIES, EAGLE_STORY_SOURCES } from "@/lib/eagle-story";
import { photo } from "@/lib/photos";
import EagleStory from "@/app/components/story/eagle-story";

export function generateStaticParams() {
  return HEROES.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hero = getHero((await params).slug);
  if (!hero) return {};
  const eagle = hero.slug === "apollo-11-lander";
  const count = eagle ? EAGLE_MEMORIES.length : (STORIES[hero.slug]?.scenes.length ?? storyChapters(hero).length);
  return generateSEO({
    title: `${hero.name}, a story in ${count} ${eagle || !STORIES[hero.slug] ? "chapters" : "scenes"} | The Last Signal`,
    description: hero.summary,
    path: `/heroes/${hero.slug}/story`,
    ogImage: img(portrait(hero)),
  });
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const hero = getHero((await params).slug);
  if (!hero) notFound();
  const next = nextHero(hero);
  const film = STORIES[hero.slug];

  // Apollo 11 tells its own story: eight chapters, one action each, and a channel back to the console.
  if (hero.slug === "apollo-11-lander") {
    return (
      <main>
        <EagleStory
          slug={hero.slug}
          name={hero.name}
          chapters={EAGLE_MEMORIES}
          sources={EAGLE_STORY_SOURCES}
        />
      </main>
    );
  }

  if (film) {
    return (
      <main>
        <CinematicStory
          slug={hero.slug}
          name={hero.name}
          scenes={film.scenes.map((sc) => ({ ...sc, photo: sc.image ? photo(sc.image, sc.title) : undefined }))}
          sources={film.sources}
        />
      </main>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <Header />
      </div>
      <main>
        <h1 className="sr-only">{hero.name}: the story</h1>
        <StoryView
          slug={hero.slug}
          name={hero.name}
          no={catNo(hero.no)}
          body={bodyName(hero.body)}
          coords={fmtCoords(hero.coords)}
          chapters={storyChapters(hero)}
          next={{ slug: next.slug, name: next.name, image: portrait(next) }}
        />
      </main>
    </>
  );
}
