import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HEROES, bodyName, catNo, fmtDots, fmtLong, getHero, img, lifespan, type Hero } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Waveform } from "@/app/components/waveform";
import { ArrowRight, Pin, STAT_ICONS } from "@/app/components/icons";
import SectionNav from "@/app/components/profile/section-nav";
import Documentary from "@/app/components/profile/documentary";
import ModelViewer from "@/app/components/profile/model-viewer";
import Gallery from "@/app/components/profile/gallery";
import TributeWall from "@/app/components/profile/tribute-wall";
import { HeroSchema } from "@/app/components/structured-data";

export function generateStaticParams() {
  return HEROES.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hero = getHero((await params).slug);
  if (!hero) return {};
  return generateSEO({
    title: `${hero.name} (${lifespan(hero)}) | The Last Signal`,
    description: hero.summary,
    path: `/heroes/${hero.slug}`,
    ogImage: img(hero.image),
    keywords: [hero.name, hero.designation, hero.restingPlace],
  });
}

const card = "rounded-2xl border border-line bg-white p-5 sm:p-6";

function Heading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="display text-[32px] sm:text-[38px]">{children}</h2>
      {sub && <p className="mt-2 font-mono text-[15px] sm:text-lg">{sub}</p>}
    </div>
  );
}

function Sidebar({ hero, nav }: { hero: Hero; nav: { id: string; label: string }[] }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className={`${card} lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto no-scrollbar`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl lg:aspect-[4/3]">
          <Image src={img(hero.image)} alt={`${hero.name} (AI-generated placeholder)`} fill priority sizes="(min-width:1024px) 260px, 100vw" className="object-cover" />
        </div>
        <p className="mt-5 font-mono text-sm">{catNo(hero.no)}</p>
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
          <dd className="flex items-center gap-1.5 text-ink-soft"><Pin className="h-3.5 w-3.5 text-violet" /> {hero.restingPlace}</dd>
        </dl>

        <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-5 lg:grid-cols-1 lg:gap-4">
          {hero.stats.map((s) => {
            const Icon = STAT_ICONS[s.icon];
            return (
              <li key={s.label} className="flex flex-col items-center gap-1 rounded-xl bg-mist p-3 text-center lg:flex-row lg:gap-4 lg:bg-transparent lg:p-0 lg:text-left">
                <Icon className="h-6 w-6 shrink-0 text-violet lg:h-8 lg:w-8 lg:text-ink" />
                <div>
                  <p className="display text-lg lg:text-xl" style={{ lineHeight: 1.1 }}>{s.value}</p>
                  <p className="font-mono text-[11px] text-ink-soft lg:text-xs">{s.label}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 border-t border-line pt-5">
          <div className="hidden lg:block">
            <SectionNav items={nav} />
          </div>
          <a href="#tributes" className="flex items-center justify-between rounded-full bg-violet px-6 py-3.5 text-sm font-semibold text-white hover:bg-violet-deep lg:mt-5">
            Leave a tribute <ArrowRight />
          </a>
        </div>
      </div>
    </aside>
  );
}

function RouteMap({ route }: { route: NonNullable<Hero["route"]> }) {
  const pts = route.points.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <div className="relative isolate h-full min-h-[260px] overflow-hidden rounded-2xl bg-night p-5 text-white sm:p-6">
      <Image src="/images/route.jpg" alt="" fill sizes="(min-width:1024px) 45vw, 100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/20" />
      <div className="flex items-start justify-between">
        <h2 className="display text-[32px] sm:text-[38px]">Route</h2>
        <p className="display text-3xl sm:text-[38px]">{route.km}</p>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <polyline points={pts} fill="none" stroke="#7a57ff" strokeWidth="0.9" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 3 }} />
      </svg>
      {route.points.map((p) => (
        <span key={p.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className="block h-3.5 w-3.5 rounded-full border-2 border-white bg-violet" />
          <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">{p.name}</span>
        </span>
      ))}
      <p className="absolute bottom-4 left-5 font-mono text-[11px] text-white/80">Illustrative path, not to scale</p>
    </div>
  );
}

export default async function HeroPage({ params }: { params: Promise<{ slug: string }> }) {
  const hero = getHero((await params).slug);
  if (!hero) notFound();
  const twin = hero.twin ? getHero(hero.twin) : undefined;

  const nav = [
    { id: "documentary", label: "Documentary" },
    { id: "born", label: "Born" },
    { id: "model", label: "3D model" },
    { id: "launch", label: "Launch day" },
    hero.landing && { id: "landing", label: "Landing" },
    hero.chapters && { id: "life", label: "Life’s work" },
    { id: "last-signal", label: hero.end.label },
    { id: "gallery", label: "Gallery" },
    { id: "tributes", label: "Tributes" },
  ].filter((x): x is { id: string; label: string } => !!x);

  const chapterLinks = [
    { id: "born", label: "Born", image: "assembly" },
    { id: "launch", label: "Launch", image: "launch" },
    hero.landing && { id: "landing", label: "Landing", image: hero.body === "mars" ? "landing" : hero.image },
    { id: hero.chapters ? "life" : "gallery", label: "Life’s work", image: hero.chapters?.[0]?.image ?? hero.image },
    { id: "last-signal", label: hero.end.label, image: hero.story?.at(-2)?.image ?? hero.image },
  ].filter((x): x is { id: string; label: string; image: string } => !!x);

  return (
    <>
      <HeroSchema hero={hero} />
      <Header />
      <main className="bg-mist">
        <div className="mx-auto grid grid-cols-1 max-w-[1440px] gap-4 px-4 py-6 sm:px-8 lg:grid-cols-[270px_minmax(0,1fr)] lg:py-8">
          <Sidebar hero={hero} nav={nav} />
          {/* Phones: the same section list as sticky chips under the header. */}
          <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-mist/95 px-4 backdrop-blur sm:-mx-8 sm:px-8 lg:hidden">
            <SectionNav items={nav} variant="chips" />
          </div>

          <div className="min-w-0 space-y-4">
            {/* Documentary + chapters */}
            <section id="documentary" className="grid grid-cols-1 scroll-mt-24 gap-4 xl:grid-cols-[1.6fr_1fr]">
              <Documentary name={hero.name} image={img(hero.image)} />
              <div className={card}>
                <h2 className="display text-[30px]">Chapters</h2>
                <ol className="mt-4 space-y-3">
                  {chapterLinks.map((c, i) => (
                    <li key={c.id + c.label}>
                      <a href={`#${c.id}`} className="group flex items-center gap-4">
                        <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                          <Image src={img(c.image)} alt="" fill sizes="80px" className="object-cover transition-transform group-hover:scale-110" />
                        </span>
                        <span>
                          <span className="block font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                          <span className="font-semibold group-hover:text-violet">{c.label}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
                <Link href={`/heroes/${hero.slug}/story`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet hover:underline">
                  Watch it as a story <ArrowRight />
                </Link>
              </div>
            </section>

            {/* Born */}
            <section id="born" className="scroll-mt-24 pt-6">
              <Heading sub="Born on Earth. Resting among the stars.">Born</Heading>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.6fr_1fr]">
                <figure>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                    <Image src="/images/assembly.jpg" alt="Engineers assembling a rover in a cleanroom (AI-generated placeholder)" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-2 font-mono text-sm">Assembly · {hero.builder}</figcaption>
                </figure>
                <div className={`${card} flex flex-col`}>
                  <p className="text-[15px] leading-relaxed">{hero.summary}</p>
                  <dl className="mt-auto space-y-2.5 border-t border-line pt-4 font-mono text-sm">
                    {(hero.specs ?? [{ label: "Builder", value: hero.builder }]).map((s) => (
                      <div key={s.label} className="flex justify-between gap-4">
                        <dt>{s.label}</dt>
                        <dd className="font-sans font-bold">{s.value}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4">
                      <dt>Type</dt>
                      <dd className="font-sans font-bold">{hero.kind}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>

            {/* 3D model + launch day */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
              <section id="model" className={`${card} scroll-mt-24`}>
                <h2 className="display mb-4 text-[30px]">3D model</h2>
                <ModelViewer image={img(hero.image)} parts={hero.parts} />
              </section>
              <section id="launch" className={`${card} flex scroll-mt-24 flex-col`}>
                <h2 className="display mb-4 text-[30px]">Launch day</h2>
                <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-xl">
                  <Image src="/images/launch.jpg" alt="A rocket lifting off at night (AI-generated placeholder)" fill sizes="(min-width:1280px) 30vw, 100vw" className="object-cover" />
                </div>
                <p className="mt-4 font-mono text-[15px] leading-relaxed">
                  {fmtLong(hero.launch.date)}
                  {hero.launch.time && ` · ${hero.launch.time}`}
                  <br />
                  {hero.launch.rocket}
                  <br />
                  {hero.launch.pad}
                </p>
              </section>
            </div>

            {/* Landing + route */}
            {hero.landing && (
              <div className={`grid gap-4 ${hero.route ? "xl:grid-cols-[1fr_1.3fr]" : ""}`}>
                <section id="landing" className={`${card} scroll-mt-24`}>
                  <h2 className="display mb-4 text-[30px]">Landing</h2>
                  <div className="relative aspect-[16/8] overflow-hidden rounded-xl">
                    <Image src={img(hero.body === "mars" && hero.category !== "helicopter" ? "landing" : hero.image)} alt="" fill sizes="(min-width:1280px) 30vw, 100vw" className="object-cover" />
                  </div>
                  <p className="mt-4 font-mono text-[15px] leading-relaxed">
                    {fmtLong(hero.landing.date)}
                    <br />
                    {hero.landing.site}
                    <br />
                    {hero.landing.method}
                  </p>
                </section>
                {hero.route && <RouteMap route={hero.route} />}
              </div>
            )}

            {/* Life's work */}
            {hero.chapters && (
              <section id="life" className="scroll-mt-24 pt-6">
                <Heading sub="They went where we couldn’t.">Life’s work</Heading>
                <ol className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                  {hero.chapters.map((c, i) => (
                    <li key={c.title} data-reveal>
                      <div className="relative aspect-[16/7] overflow-hidden rounded-xl">
                        <Image src={img(c.image)} alt="" fill sizes="(min-width:1280px) 25vw, 50vw" className="object-cover" />
                        <span className="absolute top-2 left-2 rounded bg-white/85 px-1.5 py-0.5 font-mono text-[11px]">{catNo(i + 1)}</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between gap-3">
                        <h3 className="font-bold">{c.title}</h3>
                        <span className="shrink-0 font-mono text-sm">{c.year}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Discoveries + last signal */}
            <div className={`grid gap-4 ${hero.discoveries ? "xl:grid-cols-[1.4fr_1fr]" : ""}`}>
              {hero.discoveries && (
                <section className={card}>
                  <h2 className="display mb-4 text-[30px]">Discoveries</h2>
                  <ul className="grid grid-cols-3 gap-3">
                    {hero.discoveries.map((d) => (
                      <li key={d.title}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          <Image src={img(d.image)} alt="" fill sizes="15vw" className="object-cover" />
                        </div>
                        <p className="mt-2 font-mono text-xs leading-snug">{d.title}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section id="last-signal" className="scroll-mt-24 rounded-2xl bg-night p-5 text-white sm:p-6">
                <h2 className="display text-[30px] sm:text-[38px]">{hero.end.label}</h2>
                <Waveform seed={`${hero.slug}-last`} bars={34} fade={0.45} live className="mt-5 h-20 w-full text-violet-bright" />
                <p className="mt-4 font-mono text-sm">
                  {fmtDots(hero.end.date)} · {hero.end.label.toLowerCase()}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-white/85">{hero.end.story}</p>
              </section>
            </div>

            {/* Gallery + twin */}
            <div className={`grid gap-4 ${twin ? "xl:grid-cols-[1.6fr_1fr]" : ""}`}>
              <section id="gallery" className={`${card} scroll-mt-24`}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="display text-[30px]">Gallery</h2>
                  <span className="rounded-full bg-violet-soft px-3 py-1 font-mono text-[11px] text-violet">AI placeholders</span>
                </div>
                <Gallery images={hero.gallery} name={hero.name} />
              </section>
              {twin && (
                <section className={`${card} flex flex-col`}>
                  <h2 className="display text-[30px]">Twin</h2>
                  <p className="mt-2 font-mono text-sm">
                    {catNo(twin.no)} · {twin.name} · {lifespan(twin)}
                  </p>
                  <div className="relative mt-4 min-h-[200px] flex-1 overflow-hidden rounded-xl">
                    <Image src={img(twin.image)} alt="" fill sizes="(min-width:1280px) 25vw, 100vw" className="object-cover" />
                  </div>
                  <Link href={`/heroes/${twin.slug}`} className="mt-4 flex items-center justify-between rounded-full bg-violet px-6 py-3.5 text-sm font-semibold text-white hover:bg-violet-deep">
                    Read their story <ArrowRight />
                  </Link>
                </section>
              )}
            </div>

            {/* Tributes */}
            <section id="tributes" className="scroll-mt-24 pt-6">
              <Heading>Tribute wall</Heading>
              <TributeWall slug={hero.slug} name={hero.name} />
            </section>

            <section className="border-t border-line pt-6 pb-4">
              <h2 className="font-mono text-xs tracking-[0.12em] uppercase">Sources</h2>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {hero.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">{s.label}</a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-soft">
                Resting on {bodyName(hero.body)}. Photos on this page are AI-generated placeholders until credited archive images are added.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
