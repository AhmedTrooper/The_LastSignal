import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HEROES, bodyName, catNo, fmtCoords, getHero, img, nextHero, portrait, storyChapters } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import StoryView from "@/app/components/story/story-view";
import CinematicStory from "@/app/components/story/cinematic-story";
import { STORIES } from "@/lib/stories";
import { photo } from "@/lib/photos";
import EagleScrollStory from "@/app/components/story/eagle-scroll-story";
import OpportunityScrollStory from "@/app/components/story/opportunity-scroll-story";
import RangerThoughtStory from "@/app/components/story/ranger-thought-story";
import { getMachineBook } from "@/lib/machine-books";

export function generateStaticParams() {
  return HEROES.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hero = getHero((await params).slug);
  if (!hero) return {};
  const book = getMachineBook(hero.slug);
  const count = book?.chapters.length ?? (STORIES[hero.slug]?.scenes.length ?? storyChapters(hero).length);
  return generateSEO({
    title: `${book?.name ?? hero.name}, a story in ${count} ${book || !STORIES[hero.slug] ? "chapters" : "scenes"} | The Last Signal`,
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

  // Eagle's event chapters share their text with the book and comic editions.
  if (hero.slug === "apollo-11-lander") {
    return (
      <main id="club-main">
        <EagleScrollStory />
      </main>
    );
  }
  if (hero.slug === "opportunity") return <main><OpportunityScrollStory /></main>;
  if (hero.slug === "ranger-7") return <main><RangerThoughtStory /></main>;

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
      <main id="club-main">
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
