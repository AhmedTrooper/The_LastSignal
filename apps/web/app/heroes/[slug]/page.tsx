import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HEROES, bodyName, catNo, fmtDots, fmtLong, getHero, img, lifespan, portrait, type Hero, assetUrl } from "@/lib/heroes";
import { photo, type Photo } from "@/lib/photos";
import { generateSEO } from "@/lib/seo";
import { WIKI } from "@/lib/wiki";
import { SIGNATURES } from "@/lib/signatures";
import { PARTS, DOWNLOADS } from "@/lib/parts";
import { VIDEOS, NEWS, EYES, eyesUrl } from "@/lib/media";
import { LAYOUTS, SECTION_LABEL, type SectionId } from "@/lib/layouts";
import { STORIES } from "@/lib/stories";
import { buildEagleConsole } from "@/lib/console";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { ArrowRight, Pin, STAT_ICONS } from "@/app/components/icons";
import SectionNav from "@/app/components/profile/section-nav";
import Documentary from "@/app/components/profile/documentary";
import ModelStudio, { type StudioSource } from "@/app/components/profile/model-studio";
import Gallery from "@/app/components/profile/gallery";
import TributeWall from "@/app/components/profile/tribute-wall";
import LastSignalArt, { CAPTION } from "@/app/components/profile/last-signal";
import SignatureBlock from "@/app/components/profile/signature";
import Videos from "@/app/components/profile/videos";
import EyesEmbed from "@/app/components/profile/eyes-embed";
import Wiki from "@/app/components/profile/wiki";
import EagleComicAdventure from "@/app/components/profile/eagle-comic-adventure";
import Archive from "@/app/components/profile/archive";
import { HeroSchema } from "@/app/components/structured-data";
import OpportunityLibrary from "@/app/components/profile/opportunity-library";
import Ranger7Dialogue from "@/app/components/profile/ranger7-dialogue";
import { machineBookUrl } from "@/lib/machine-books";

const HERO_GAMES: Record<string, { href: string; title: string; desc: string }> = {
  "ranger-7": {
    href: "/games/ranger-7-dive",
    title: "Last Pictures",
    desc: "Fall toward the Moon with Ranger 7 and keep taking pictures until the very end.",
  },
  spirit: {
    href: "/games/mer-twins",
    title: "Chasing Sunshine",
    desc: "Keep a solar-powered Mars rover alive one sol at a time, through dust and winter.",
  },
  opportunity: {
    href: "/games/mer-twins",
    title: "Chasing Sunshine",
    desc: "Keep a solar-powered Mars rover alive one sol at a time, through dust and storms.",
  },
  ingenuity: {
    href: "/games/ingenuity-flight",
    title: "Thin Air",
    desc: "Climb, hover, and land a helicopter in Mars's thin atmosphere.",
  },
  insight: {
    href: "/games/insight-seismology",
    title: "Marsquake Hunter",
    desc: "Read seismograms and work out how far away each marsquake struck.",
  },
  "viking-1": {
    href: "/games/viking-biology",
    title: "Is Anything Alive?",
    desc: "Run Viking's soil tests and decide what the results mean.",
  },
  "viking-2": {
    href: "/games/viking-biology",
    title: "Is Anything Alive?",
    desc: "Run Viking's soil tests and decide what the results mean.",
  },
  "mars-polar-lander": {
    href: "/games/polar-lander-forensics",
    title: "Trust the Signal",
    desc: "Be the landing computer and decide when the lander has really touched down.",
  },
  lcross: {
    href: "/games/lcross-impact",
    title: "Into the Plume",
    desc: "Hit a dark crater, then fly through the plume to look for water.",
  },
  grail: {
    href: "/games/grail-gravity",
    title: "Ebb & Flow",
    desc: "Find hidden masses under the Moon from two spacecraft flying in tandem.",
  },
};

export function generateStaticParams() {
  return HEROES.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hero = getHero((await params).slug);
  if (!hero) return {};
  return generateSEO({
    title: `${hero.name} (${lifespan(hero)}) | RoverVilla`,
    description: hero.summary,
    path: `/heroes/${hero.slug}`,
    ogImage: img(portrait(hero)),
    keywords: [hero.name, hero.designation, hero.restingPlace],
  });
}

const card = "rounded-2xl border border-line bg-white p-5 sm:p-6";

/** Credit line for a photo: archive title and credit with a source link, or a clear AI label. */
function Credit({ p, className = "" }: { p: Photo; className?: string }) {
  if (p.ai) return <span className={`font-mono text-[11px] text-ink-soft ${className}`}>AI-generated placeholder</span>;
  return (
    <a href={p.source} target="_blank" rel="noopener noreferrer" className={`font-mono text-[11px] text-ink-soft hover:text-violet ${className}`}>
      {p.title} · {p.credit}
    </a>
  );
}

function Heading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="display text-[32px] sm:text-[40px]">{children}</h2>
      {sub && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base">{sub}</p>}
    </div>
  );
}

function storyLabel(hero: Hero) {
  if (hero.slug === "opportunity") return "Scroll the story";
  return STORIES[hero.slug] ? "Watch the film" : "Read the story";
}

/** The credit block that closes every hero page. */
function Sources({ hero }: { hero: Hero }) {
  return (
    <section className="border-t border-line pt-6 pb-4">
      <h2 className="font-mono text-xs tracking-[0.12em] uppercase">Sources</h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {hero.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        Resting on {bodyName(hero.body)}. Photos are from NASA&apos;s public archives and credited individually; anything marked AI-generated is not a real photo. The 3D model {hero.model ? "is NASA's own" : "is a simplified model made for this site"}. Videos play from their publishers&apos; YouTube channels. NASA does not endorse this site.
      </p>
    </section>
  );
}

function Sidebar({ hero, nav }: { hero: Hero; nav: { id: string; label: string }[] }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className={`${card} no-scrollbar lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}>
        {hero.card ? (
          <figure>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white lg:aspect-[4/3]">
              <Image src={assetUrl(`images/${hero.card}.webp`)} alt={`${hero.name}, illustration`} fill priority sizes="(min-width:1024px) 260px, 100vw" className="object-contain p-2" />
            </div>
            <figcaption className="mt-1 font-mono text-[10px] text-ink-soft">Illustration, AI-generated</figcaption>
          </figure>
        ) : null}
        <p className="mt-4 font-mono text-sm">{catNo(hero.no)}</p>
        <h1 className="display mt-1 text-[34px]">{hero.name}</h1>
        {hero.nickname && <p className="display mt-1 text-xl font-bold">{hero.nickname}</p>}
        <dl className="mt-4 space-y-2 font-mono text-[13px] leading-snug">
          <dd>{hero.designation}</dd>
          <div className="flex justify-between gap-4 lg:block">
            <dt className="lg:inline">Born </dt>
            <dd className="text-right lg:inline lg:text-left">{fmtLong(hero.launch.date)}</dd>
          </div>
          <div className="flex justify-between gap-4 lg:block">
            <dt className="lg:inline">{hero.end.label} </dt>
            <dd className="text-right lg:inline lg:text-left">{fmtLong(hero.end.date)}</dd>
          </div>
          <dd className="flex items-center gap-1.5 text-ink-soft">
            <Pin className="h-3.5 w-3.5 text-violet" /> {hero.restingPlace}
          </dd>
        </dl>

        <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-5 lg:grid-cols-1 lg:gap-4">
          {hero.stats.map((s) => {
            const Icon = STAT_ICONS[s.icon];
            return (
              <li key={s.label} className="flex flex-col items-center gap-1 rounded-xl bg-mist p-3 text-center lg:flex-row lg:gap-4 lg:bg-transparent lg:p-0 lg:text-left">
                <Icon className="h-6 w-6 shrink-0 text-violet lg:h-8 lg:w-8 lg:text-ink" />
                <div>
                  <p className="display text-lg lg:text-xl" style={{ lineHeight: 1.1 }}>
                    {s.value}
                  </p>
                  <p className="font-mono text-[11px] text-ink-soft lg:text-xs">{s.label}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 space-y-2 border-t border-line pt-5">
          <Link href={`/heroes/${hero.slug}/story`} className="flex items-center justify-between rounded-full bg-violet px-6 py-3.5 text-sm font-semibold text-white hover:bg-violet-deep">
            {storyLabel(hero)} <ArrowRight />
          </Link>
          {hero.slug === "opportunity" && <Link href={machineBookUrl(hero.slug)} className="flex items-center justify-between rounded-full border border-line px-6 py-3 text-sm font-semibold hover:border-violet">Book &amp; Comic Nook <ArrowRight /></Link>}
          <a href="#tributes" className="flex items-center justify-between rounded-full border border-line px-6 py-3 text-sm font-semibold hover:border-violet hover:text-violet">
            Leave a tribute <ArrowRight />
          </a>
          <div className="hidden pt-3 lg:block">
            <SectionNav items={nav} />
          </div>
        </div>
      </div>
    </aside>
  );
}

function RouteMap({ route }: { route: NonNullable<Hero["route"]> }) {
  const pts = route.points.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <div className="relative isolate h-full min-h-[260px] overflow-hidden rounded-2xl bg-night p-5 text-white sm:p-6">
      <Image src={assetUrl("images/nasa/PIA08812.jpg")} alt="" fill sizes="(min-width:1024px) 45vw, 100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/45" />
      <div className="flex items-start justify-between">
        <h3 className="display text-[28px] sm:text-[34px]">Route</h3>
        <p className="display text-3xl sm:text-[34px]">{route.km}</p>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <polyline points={pts} fill="none" stroke="#7a57ff" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 3 }} />
      </svg>
      {route.points.map((p) => (
        <span key={p.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className="block h-3.5 w-3.5 rounded-full border-2 border-white bg-violet" />
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">{p.name}</span>
        </span>
      ))}
      <p className="absolute bottom-4 left-5 font-mono text-[11px] text-white/80">Illustrative path, not to scale · Background: Victoria crater, NASA/JPL/University of Arizona</p>
    </div>
  );
}

export default async function HeroPage({ params }: { params: Promise<{ slug: string }> }) {
  const hero = getHero((await params).slug);
  if (!hero) notFound();
  const twin = hero.twin ? getHero(hero.twin) : undefined;
  const mars = hero.body === "mars";
  const pics = {
    portrait: photo(portrait(hero), hero.name),
    born: photo(hero.photos?.born ?? "assembly", "Engineers assembling a spacecraft in a cleanroom"),
    launch: photo(hero.photos?.launch ?? "launch", "A rocket lifting off at night"),
    landing: photo(hero.photos?.landing ?? (mars && hero.category !== "helicopter" ? "landing" : hero.image), `${hero.name} landing site`),
    end: hero.photos?.end ? photo(hero.photos.end) : undefined,
  };
  const gallery = hero.gallery.map((n) => photo(n, hero.name));
  const allReal = gallery.every((g) => !g.ai);
  const wiki = WIKI[hero.slug];
  const sig = SIGNATURES[hero.slug];
  const videos = VIDEOS[hero.slug] ?? [];
  const news = NEWS[hero.slug] ?? [];
  const eyes = EYES[hero.slug];
  const film = STORIES[hero.slug];
  const model: StudioSource = hero.model
    ? { kind: "glb", src: assetUrl(hero.model.src), title: hero.model.title, credit: "NASA 3D Resources", source: hero.model.source, note: hero.model.note }
    : { kind: "built", slug: hero.slug };

  // Sections present for this hero, in the order its life calls for.
  const has: Record<SectionId, boolean> = {
    model: true,
    film: !!film && hero.slug !== "opportunity",
    signature:
      !!sig ||
      hero.slug === "ranger-7" ||
      hero.slug === "apollo-11-lander" ||
      hero.slug === "spirit" ||
      hero.slug === "opportunity" ||
      hero.slug === "ingenuity" ||
      hero.slug === "insight" ||
      hero.slug === "viking-1" ||
      hero.slug === "viking-2" ||
      hero.slug === "mars-polar-lander" ||
      hero.slug === "surveyor-1" ||
      hero.slug === "lcross" ||
      hero.slug === "grail",
    life: !!hero.chapters?.length,
    journey: true,
    lost: true,
    wiki: !!wiki,
    videos: videos.length > 0,
    news: news.length > 0,
    eyes: !!eyes,
    gallery: gallery.length > 0,
    twin: !!twin,
    tributes: true,
    explore: !!hero.links?.length,
    documentary: true,
  };
  const order = (LAYOUTS[hero.slug] ?? (Object.keys(SECTION_LABEL) as SectionId[])).filter((id) => has[id]);
  const label = (id: SectionId) => (id === "lost" ? hero.end.label : id === "signature" && sig ? sig.title : SECTION_LABEL[id]);
  const nav = [...(hero.slug === "opportunity" ? [{ id: "opportunity-stories", label: "Book, comic & scroll" }] : []), ...(hero.slug === "ranger-7" ? [{ id: "ranger-hub", label: "Talk to Ranger 7" }] : []), ...order.filter((id) => id !== "twin").map((id) => ({ id, label: label(id) }))];

  const sections: Record<SectionId, () => React.ReactNode> = {
    model: () => (
      <section id="model" className={`${card} scroll-mt-24`}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">Meet {hero.nickname ?? hero.name}</p>
            <h2 className="display mt-1 text-[32px] sm:text-[40px]">Every part, up close</h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">Turn it, pick a part to see what it did, pull the parts apart, or download it to print your own.</p>
        </div>
        <ModelStudio name={hero.name} model={model} parts={PARTS[hero.slug] ?? []} poster={pics.portrait.src} posterAlt={pics.portrait.alt} downloads={DOWNLOADS[hero.slug]} />
      </section>
    ),

    film: () => hero.slug === "opportunity" ? null :
      film && (
        <section id="film" className="relative isolate scroll-mt-24 overflow-hidden rounded-2xl bg-night text-white">
          <Image src={pics.portrait.src} alt="" fill sizes="(min-width:1024px) 70vw, 100vw" className="-z-10 object-cover opacity-55" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,10,34,0.92)_0%,rgba(12,10,34,0.4)_70%)]" />
          <div className="max-w-xl p-6 sm:p-10">
            <p className="font-mono text-xs tracking-[0.12em] text-white/70 uppercase">The film · {film.scenes.length} scenes</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">{film.lede}</h2>
            <p className="mt-3 text-white/80">From why it was built to its last signal, told in real NASA photographs. Scroll through it, or press play.</p>
            <Link href={`/heroes/${hero.slug}/story`} className="mt-6 inline-flex items-center gap-3 rounded-full bg-violet px-6 py-3.5 text-sm font-semibold hover:bg-violet-deep">
              Watch the film <ArrowRight />
            </Link>
          </div>
        </section>
      ),

    signature: () => {
      const game = hero.slug === "apollo-11-lander" ? undefined : HERO_GAMES[hero.slug];
      return (
        sig && (
          <section id="signature" className={`${card} scroll-mt-24`}>
            <SignatureBlock sig={sig} accent={mars ? "mars" : "moon"} />
            {game && (
              <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-line bg-mist p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">Interactive Mission Simulation</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink sm:text-base">{game.title}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">{game.desc}</p>
                </div>
                <Link
                  href={game.href}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-deep"
                >
                  Play Simulation <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </section>
        )
      );
    },

    life: () => (
      <section id="life" className="scroll-mt-24 pt-4">
        <Heading sub="They went where we couldn’t.">Life’s work</Heading>
        <ol className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          {hero.chapters!.map((c, i) => {
            const p = photo(c.image, c.title);
            return (
              <li key={c.title}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                  <Image src={img(c.image)} alt={p.alt} title={p.credit} fill sizes="(min-width:1280px) 25vw, 50vw" className="object-cover" />
                  <span className="absolute top-2 left-2 rounded bg-white/85 px-1.5 py-0.5 font-mono text-[11px]">{catNo(i + 1)}</span>
                  {p.ai && <span className="absolute right-2 bottom-2 rounded bg-white/85 px-1.5 py-0.5 font-mono text-[10px]">AI placeholder</span>}
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-bold">{c.title}</h3>
                  <span className="shrink-0 font-mono text-sm">{c.year}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.text}</p>
              </li>
            );
          })}
        </ol>
      </section>
    ),

    journey: () => (
      <section id="journey" className="grid scroll-mt-24 grid-cols-1 gap-4 xl:grid-cols-2">
        <div className={card}>
          <p className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">Born on Earth</p>
          <h2 className="display mt-1 text-[30px]">Launch</h2>
          <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl">
            <Image src={pics.launch.src} alt={pics.launch.alt} fill sizes="(min-width:1280px) 30vw, 100vw" className="object-cover" />
          </div>
          <Credit p={pics.launch} className="mt-2 block" />
          <p className="mt-3 font-mono text-[15px] leading-relaxed">
            {fmtLong(hero.launch.date)}
            {hero.launch.time && ` · ${hero.launch.time}`}
            <br />
            {hero.launch.rocket} · {hero.launch.pad}
          </p>
          <p className="mt-2 text-sm text-ink-soft">Built by {hero.builder}.</p>
        </div>
        {hero.landing ? (
          <div className={card}>
            <p className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">Arrival on {bodyName(hero.body)}</p>
            <h2 className="display mt-1 text-[30px]">Landing</h2>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={pics.landing.src} alt={pics.landing.alt} fill sizes="(min-width:1280px) 30vw, 100vw" className="object-cover" />
            </div>
            <Credit p={pics.landing} className="mt-2 block" />
            <p className="mt-3 font-mono text-[15px] leading-relaxed">
              {fmtLong(hero.landing.date)}
              <br />
              {hero.landing.site} · {hero.landing.method}
            </p>
          </div>
        ) : (
          <div className={card}>
            <p className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">Before launch</p>
            <h2 className="display mt-1 text-[30px]">Built</h2>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={pics.born.src} alt={pics.born.alt} fill sizes="(min-width:1280px) 30vw, 100vw" className="object-cover" />
            </div>
            <Credit p={pics.born} className="mt-2 block" />
            <p className="mt-3 text-[15px] leading-relaxed">{hero.summary}</p>
          </div>
        )}
        {hero.route && (
          <div className="xl:col-span-2">
            <RouteMap route={hero.route} />
          </div>
        )}
      </section>
    ),

    lost: () => (
      <section id="lost" className="relative isolate scroll-mt-24 overflow-hidden rounded-2xl bg-night p-5 text-white sm:p-8">
        {pics.end && (
          <>
            <Image src={pics.end.src} alt="" fill sizes="(min-width:1280px) 60vw, 100vw" className="-z-10 object-cover opacity-35" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(12,10,34,0.6),rgba(12,10,34,0.92))]" />
          </>
        )}
        <div className="grid items-center gap-6 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="font-mono text-xs tracking-[0.12em] text-white/70 uppercase">{CAPTION[hero.end.how]}</p>
            <h2 className="display mt-2 text-[34px] sm:text-[44px]">{hero.end.label}</h2>
            <p className="mt-2 font-mono text-sm">{fmtDots(hero.end.date)}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/85 sm:text-base">{hero.end.story}</p>
          </div>
          <LastSignalArt how={hero.end.how} className={`h-auto w-full ${mars ? "text-[#ffb38a]" : "text-violet-bright"}`} />
        </div>
        {pics.end && !pics.end.ai && (
          <a href={pics.end.source} target="_blank" rel="noopener noreferrer" className="mt-5 block font-mono text-[11px] text-white/55 hover:text-white">
            Background: {pics.end.title} · {pics.end.credit}{hero.slug === "opportunity" ? " · Simulated darkness graphic, not a final camera frame" : ""}
          </a>
        )}
      </section>
    ),

    wiki: () =>
      wiki && (
        <section id="wiki" className={`${card} scroll-mt-24`}>
          <p className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">The full story</p>
          <h2 className="display mt-1 mb-5 text-[32px] sm:text-[40px]">{hero.name}, from start to finish</h2>
          <Wiki entry={wiki} name={hero.name} />
        </section>
      ),

    videos: () => (
      <section id="videos" className={`${card} scroll-mt-24`}>
        <Heading sub="Official films and footage from NASA, JPL and museum archives.">Watch</Heading>
        <Videos items={videos} />
      </section>
    ),

    news: () => (
      <section id="news" className={`${card} scroll-mt-24`}>
        <Heading sub="Articles, image releases and history pieces from NASA.">In the news</Heading>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {news.map((n) => (
            <li key={n.url}>
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="group flex h-full items-start justify-between gap-3 rounded-xl border border-line p-4 hover:border-violet">
                <span>
                  <span className="block font-mono text-[11px] text-ink-soft">{n.site}</span>
                  <span className="mt-1 block text-[15px] leading-snug font-semibold group-hover:text-violet">{n.title}</span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    ),

    eyes: () =>
      eyes && (
        <section id="eyes" className={`${card} scroll-mt-24`}>
          <Heading sub={`Follow ${hero.name}'s real path in NASA's Eyes on the Solar System, built from spacecraft navigation data.`}>Fly along</Heading>
          <EyesEmbed src={eyesUrl(eyes)} name={hero.name} />
          <p className="mt-2 font-mono text-[11px] text-ink-soft">
            NASA/JPL-Caltech ·{" "}
            <a href={`https://eyes.nasa.gov/apps/solar-system/#/${eyes}`} target="_blank" rel="noopener noreferrer" className="hover:text-violet">
              open full screen
            </a>
          </p>
        </section>
      ),

    gallery: () => (
      <section id="gallery" className={`${card} scroll-mt-24`}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="display text-[30px]">Gallery</h2>
          <span className="rounded-full bg-violet-soft px-3 py-1 font-mono text-[11px] text-violet">{allReal ? `${gallery.length} archive photos` : "Includes AI placeholders"}</span>
        </div>
        <Gallery items={gallery} name={hero.name} />
        {allReal && <p className="mt-3 font-mono text-[11px] text-ink-soft">Tap a photo for its title, credit and source.</p>}
      </section>
    ),

    twin: () =>
      twin && (
        <section className={`${card} grid items-center gap-5 sm:grid-cols-[200px_1fr]`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image src={img(portrait(twin))} alt="" fill sizes="200px" className="object-cover" />
          </div>
          <div>
            <p className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">Its twin</p>
            <h2 className="display mt-1 text-[28px]">{twin.name}</h2>
            <p className="mt-1 font-mono text-sm">
              {catNo(twin.no)} · {lifespan(twin)}
            </p>
            <Link href={`/heroes/${twin.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-violet hover:underline">
              Visit {twin.name} <ArrowRight />
            </Link>
          </div>
        </section>
      ),

    tributes: () => (
      <section id="tributes" className="scroll-mt-24 pt-4">
        <Heading>Tribute wall</Heading>
        <TributeWall slug={hero.slug} name={hero.name} />
      </section>
    ),

    explore: () => (
      <section id="explore" className={`${card} scroll-mt-24`}>
        <h2 className="display text-[30px]">Explore further</h2>
        <p className="mt-1 text-sm text-ink-soft">Official mission pages, catalogues, photo archives and 3D files.</p>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {hero.links!.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm font-semibold hover:border-violet hover:text-violet">
                {l.label}
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    ),

    documentary: () => (
      <section id="documentary" className="grid scroll-mt-24 grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Documentary name={hero.name} image={pics.portrait.src} />
        <div className={`${card} flex flex-col justify-center`}>
          <p className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">Coming later</p>
          <h2 className="display mt-1 text-[28px]">An AI-narrated documentary</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            We have not made it yet. When it is ready it will be told in the first person by an AI voice, built only from the mission records above, and clearly labelled as AI-made.
          </p>
        </div>
      </section>
    ),
  };

  // Apollo 11 gets the console: a first-person room at the top of the page, with the verified
  // record folded away underneath for anyone who wants to inspect it.
  if (hero.slug === "apollo-11-lander") {
    const eagle = buildEagleConsole({ photos: gallery, videos });
    const archiveOrder = order.filter((id) => id !== "model" && id !== "film");

    return (
      <>
        <HeroSchema hero={hero} />
        <Header />
        <main id="club-main">
          {/* The console owns the first screen: header + this section = one viewport. */}
          <section className="bg-[#fff9ef]">
            <div>
              <EagleComicAdventure
                data={eagle}
                slug={hero.slug}
                name={hero.name}
                model={model}
                parts={PARTS[hero.slug] ?? []}
                poster={pics.portrait.src}
                posterAlt={pics.portrait.alt}
              />
            </div>
          </section>

          <section className="bg-[#f7f1e6]">
            <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-8">
              <Archive count={archiveOrder.length} friendly>
                <div className="space-y-4">
                  {archiveOrder.map((id) => (
                    <div key={id}>{sections[id]()}</div>
                  ))}
                </div>
              </Archive>
              <Sources hero={hero} />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeroSchema hero={hero} />
      <Header />
      <main id="club-main" className={`club-profile ${mars ? "bg-[#fbf7f4]" : "bg-[#f6f7fa]"}`}>
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-4 py-6 sm:px-8 lg:grid-cols-[270px_minmax(0,1fr)] lg:py-8">
          <Sidebar hero={hero} nav={nav} />
          {/* Phones: the same section list as sticky chips under the header. */}
          <div className={`sticky top-[72px] z-30 -mx-4 border-b border-line px-4 backdrop-blur sm:-mx-8 sm:px-8 lg:hidden ${mars ? "bg-[#fbf7f4]/95" : "bg-[#f6f7fa]/95"}`}>
            <SectionNav items={nav} variant="chips" />
          </div>

          <div className="min-w-0 space-y-4">
            {hero.slug === "opportunity" && <OpportunityLibrary />}
            {hero.slug === "ranger-7" && <Ranger7Dialogue />}
            {order.map((id) => (
              <div key={id}>{sections[id]()}</div>
            ))}

            <Sources hero={hero} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
