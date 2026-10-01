import Image from "next/image";
import HeroVideo from "@/app/components/home/hero-video";
import Link from "next/link";
import { HEROES, FEATURED, catNo, getHero, lifespan, type Hero } from "@/lib/heroes";
import HeroCard from "@/app/components/hero-card";
import Globe from "@/app/components/globe";
import { ArrowRight } from "@/app/components/icons";

const featured = FEATURED.map((s) => getHero(s)).filter((h): h is Hero => !!h);

export function Hero() {
  const opp = getHero("opportunity")!;
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      {/* Desktop: the video fills the right part, clear and undimmed, with only its left edge
          melting into the dark behind the headline. Phones: a band below the headline, pinned to
          the top of the frame so the rover's head stays in view. */}
      <div className="absolute inset-x-0 top-[250px] bottom-0 -z-10 sm:top-[300px] lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[58%]">
        <HeroVideo className="absolute inset-0 h-full w-full object-cover object-[50%_0%] lg:object-center" />
        {/* Phones: a long fade from the headline into the video, plus a light tint over it. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0c0a22_0%,rgba(12,10,34,0.35)_16%,rgba(12,10,34,0.12)_50%,rgba(12,10,34,0.55)_100%)] lg:hidden" />
        {/* Desktop: a wide fade into the headline side, with soft top and bottom shading. */}
        <div className="absolute inset-y-0 left-0 hidden w-[50%] bg-gradient-to-r from-night via-night/70 to-transparent lg:block" />
        <div className="absolute inset-0 hidden bg-night/20 lg:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-night/70 to-transparent lg:block" />
        <div className="absolute inset-x-0 top-0 hidden h-20 bg-gradient-to-b from-night/50 to-transparent lg:block" />
      </div>

      <div className="relative mx-auto flex min-h-[680px] max-w-[1440px] flex-col justify-between px-4 pt-10 pb-20 sm:px-8 lg:min-h-[620px] lg:pt-20 lg:pb-24">
        <div>
          <h1 className="display rise text-[52px] sm:text-7xl lg:text-[104px]">
            Their mission
            <br />
            ended.
            <br />
            Their story
            <br />
            didn’t.
          </h1>
          <Link
            href="#heroes"
            className="rise mt-7 inline-flex items-center gap-3 rounded-full bg-violet px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-violet-deep lg:mt-8"
            style={{ animationDelay: "120ms" }}
          >
            Meet the heroes <ArrowRight />
          </Link>
        </div>
        <p className="font-mono text-xs leading-relaxed text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.8)] sm:absolute sm:right-8 sm:bottom-24 sm:text-right">
          {catNo(opp.no)} · {opp.name}
          <br />
          {opp.restingPlace}
        </p>
      </div>
    </section>
  );
}

export function Ticker() {
  const items = HEROES.map((h) => `${h.name} ${lifespan(h)}`);
  const row = items.join("  ·  ") + "  ·  ";
  return (
    <div className="relative z-10 -mt-10 -rotate-1 overflow-hidden bg-violet py-3 font-mono text-[13px] tracking-[0.12em] text-white uppercase sm:py-3.5 sm:text-base" aria-hidden>
      <div className="ticker flex w-max whitespace-pre">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  );
}

export function HeroesGrid() {
  const [lead, ...rest] = featured;
  return (
    <section id="heroes" className="mx-auto max-w-[1440px] scroll-mt-24 px-4 pt-8 pb-12 sm:px-8 lg:pt-12 lg:pb-16">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1.2fr_1fr_1fr] lg:grid-rows-2">
        <div className="col-span-2 lg:col-span-1 lg:row-span-2" data-reveal>
          <HeroCard hero={lead} size="lg" priority />
        </div>
        {rest.slice(0, 4).map((h) => (
          <div key={h.slug} data-reveal>
            <HeroCard hero={h} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Link href="/heroes" className="inline-flex items-center gap-2 font-semibold text-violet hover:underline">
          All {HEROES.length} heroes <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

export function NamesBand() {
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      <Image src="/images/crater.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover object-bottom opacity-40" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0c0a22_15%,rgba(12,10,34,0.4)_100%)]" />
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:py-24">
        <h2 className="display max-w-[20ch] text-4xl sm:text-6xl lg:text-7xl" data-reveal>
          They had names, birthdays and last words, just like us.
        </h2>
      </div>
    </section>
  );
}

const sitesOn = (body: "mars" | "moon") =>
  HEROES.filter((h) => h.body === body).map((h) => ({ id: h.slug, name: h.name, lat: h.coords.lat, lon: h.coords.lon }));

export function Resting() {
  return (
    <section className="overflow-hidden bg-mist">
      <div className="mx-auto grid grid-cols-1 max-w-[1440px] items-center gap-10 px-4 pt-14 sm:px-8 lg:grid-cols-[1fr_1.3fr] lg:pt-0">
        <div className="lg:py-24" data-reveal>
          <h2 className="display text-5xl lg:text-6xl">Resting among the stars.</h2>
          <Link
            href="/where-they-rest"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-violet px-6 py-3.5 font-semibold text-white transition-colors hover:bg-violet-deep"
          >
            Where they rest <ArrowRight />
          </Link>
        </div>
        <Link href="/where-they-rest" aria-label="Open the map of resting places" className="relative flex items-end justify-center gap-6 lg:h-full">
          <Globe body="mars" sites={sitesOn("mars")} interactive={false} autoRotate labels="none" pin="sm" start={{ lat: 15, lon: -30 }} className="w-[78%] max-w-[440px] translate-y-[22%]" />
          <Globe body="moon" sites={sitesOn("moon")} interactive={false} autoRotate labels="none" pin="sm" start={{ lat: 10, lon: 0 }} className="mb-16 w-[30%] max-w-[180px] self-center" />
        </Link>
      </div>
    </section>
  );
}
