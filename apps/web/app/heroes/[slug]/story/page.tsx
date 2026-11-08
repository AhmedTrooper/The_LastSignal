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
import InsightThoughtStory from "@/app/components/story/insight-thought-story";
import IngenuityThoughtStory from "@/app/components/story/ingenuity-thought-story";
import SpiritThoughtStory from "@/app/components/story/spirit-thought-story";
import SurveyorThoughtStory from "@/app/components/story/surveyor-thought-story";
import LcrossThoughtStory from "@/app/components/story/lcross-thought-story";
import VikingThoughtStory from "@/app/components/story/viking-thought-story";
import { VIKING_PHOTOS } from "@/lib/viking-media";
import VikingTwoThoughtStory from "@/app/components/story/viking-two-thought-story";
import { VIKING_TWO_PHOTOS } from "@/lib/viking-two-media";
import GrailThoughtStory from "@/app/components/story/grail-thought-story";
import { GRAIL_PHOTOS } from "@/lib/grail-media";
import PhoenixThoughtStory from "@/app/components/story/phoenix-thought-story";
import { PHOENIX_PHOTOS } from "@/lib/phoenix-media";
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
    description: (hero.slug.startsWith("viking-") || hero.slug === "grail" || hero.slug === "phoenix") && book ? book.introduction : hero.summary,
    path: `/heroes/${hero.slug}/story`,
    ogImage: hero.slug === "phoenix" ? PHOENIX_PHOTOS.cover.src : hero.slug === "grail" ? GRAIL_PHOTOS.cover.src : hero.slug === "viking-2" ? VIKING_TWO_PHOTOS.cover.src : hero.slug === "viking-1" ? VIKING_PHOTOS.cover.src : img(portrait(hero)),
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
  if (hero.slug === "insight") return <main id="club-main"><InsightThoughtStory /></main>;
  if (hero.slug === "ingenuity") return <main id="club-main"><IngenuityThoughtStory /></main>;
  if (hero.slug === "spirit") return <main id="club-main"><SpiritThoughtStory /></main>;
  if (hero.slug === "surveyor-1") return <main id="club-main"><SurveyorThoughtStory /></main>;
  if (hero.slug === "lcross") return <main id="club-main"><LcrossThoughtStory /></main>;
  if (hero.slug === "viking-1") return <main id="club-main"><VikingThoughtStory /></main>;
  if (hero.slug === "viking-2") return <main id="club-main"><VikingTwoThoughtStory /></main>;
  if (hero.slug === "grail") return <main id="club-main"><GrailThoughtStory /></main>;
  if (hero.slug === "phoenix") return <main id="club-main"><PhoenixThoughtStory /></main>;

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
