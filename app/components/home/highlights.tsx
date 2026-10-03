import Image from "next/image";
import Link from "next/link";
import { HEROES, bodyName, getHero, lifespan, type Body, type Hero } from "@/lib/heroes";
import { photoMeta } from "@/lib/photos";
import { PARTS } from "@/lib/parts";
import ModelStudio from "@/app/components/profile/model-studio";
import { ArrowRight } from "@/app/components/icons";

/*
 * Home page sections below the hero. Facts come from the archive in lib/heroes.ts; the few
 * short captions written here each restate one line of a hero's record (noted beside it).
 */

const hero = (slug: string): Hero => {
  const h = getHero(slug);
  if (!h) throw new Error(`home: unknown hero ${slug}`);
  return h;
};

const pic = (name: string) => {
  const p = photoMeta(name);
  if (!p) throw new Error(`home: ${name} is not an archive photo`);
  return p;
};

/** Transparent studio cut-out of a machine, or its portrait when there is none. */
const cutout = (h: Hero) => (h.card ? `/images/${h.card}.webp` : pic(h.photo!).src);

/** Names short enough to sit under a small circle. */
const SHORT: Record<string, string> = {
  "pathfinder-sojourner": "Pathfinder",
  "mars-polar-lander": "Polar Lander",
  "apollo-11-lander": "Apollo 11",
  "apollo-15-rover": "Moon rover",
};
const short = (h: Hero) => SHORT[h.slug] ?? h.name;

const Eyebrow = ({ children, className = "text-violet" }: { children: React.ReactNode; className?: string }) => (
  <p className={`font-mono text-sm tracking-[0.12em] uppercase ${className}`}>{children}</p>
);

/* ── The famous ones ────────────────────────────────────────────────────────── */

/** Well-known machines from both worlds, oldest first. Twins share one picture. `h` sets
 *  each picture's height relative to the others: small at the ends, biggest in the middle.
 *  `r` is its cut-out's width / height. On desktop each machine's share of the row is h × r,
 *  so the row always fills the width exactly and the heights keep these proportions. Phones
 *  show three in one row and tablets all five in a compact grid (`place`), the twins big in
 *  the middle. */
const FAMOUS: { slugs: string[]; h: number; r: number; place: string }[] = [
  { slugs: ["apollo-11-lander"], h: 170, r: 1.08, place: "px-[4%] sm:col-start-1 sm:row-start-1 sm:px-[8%]" },
  { slugs: ["apollo-15-rover"], h: 200, r: 1.52, place: "max-sm:hidden sm:col-start-1 sm:row-start-2" },
  { slugs: ["spirit", "opportunity"], h: 290, r: 1.14, place: "sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:justify-center lg:justify-end" },
  { slugs: ["insight"], h: 210, r: 1.59, place: "max-sm:hidden sm:col-start-3 sm:row-start-1" },
  { slugs: ["ingenuity"], h: 130, r: 1.34, place: "px-[10%] sm:col-start-3 sm:row-start-2" },
];

export function Famous() {
  return (
    <section id="famous" className="relative mx-auto max-w-[1440px] scroll-mt-20 px-4 pt-6 sm:px-8">
      {/* Wide screens: the heading floats over the row, in the sky above the smaller machines. */}
      <div className="flex flex-wrap items-end justify-between gap-3 xl:pointer-events-none xl:absolute xl:inset-x-8 xl:top-6 xl:z-10 xl:items-start">
        <div>
          <Eyebrow className="text-xs text-violet max-sm:hidden">The famous ones</Eyebrow>
          <h2 className="display text-[22px] [text-shadow:0_0_14px_#fff,0_0_4px_#fff] sm:mt-2 sm:text-3xl">
            Different worlds. <br className="max-sm:hidden" />
            Same curiosity.
          </h2>
        </div>
        <Link href="/heroes" className="inline-flex items-center gap-2 text-sm font-semibold text-violet hover:underline max-sm:hidden xl:pointer-events-auto">
          All {HEROES.length} machines <ArrowRight />
        </Link>
      </div>

      <ul className="mt-3 grid grid-cols-[1fr_1.7fr_1fr] gap-x-2 sm:mt-4 sm:gap-x-3 sm:gap-y-4 lg:flex lg:gap-6 xl:mt-0 xl:pt-4">
        {FAMOUS.map(({ slugs, h: height, r, place }) => {
          const hs = slugs.map(hero);
          const last = hs[hs.length - 1];
          const years = hs.length > 1 ? `${lifespan(hs[0]).slice(0, 4)}–${lifespan(last).slice(-4)}` : lifespan(last);
          return (
            <li
              key={slugs.join("+")}
              className={`flex min-w-0 flex-col justify-end text-center lg:row-auto lg:px-0 lg:[flex:var(--g)_1_0%] ${place}`}
              style={{ "--g": Math.round(height * r) } as React.CSSProperties}
              data-reveal
            >
              <Link href={`/heroes/${last.slug}`} className="group block" aria-label={hs.map((h) => h.name).join(" and ")}>
                <span className="relative block w-full" style={{ aspectRatio: r }}>
                  <Image
                    src={cutout(last)}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 30vw, 45vw"
                    className="object-contain object-bottom drop-shadow-[0_16px_16px_rgba(45,20,90,0.14)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
                  />
                </span>
              </Link>
              <p className="display mt-1.5 text-[13px] leading-tight sm:text-base lg:mt-2 lg:text-sm lg:whitespace-nowrap xl:text-lg">
                {hs.map((h, i) => (
                  <span key={h.slug}>
                    {i > 0 && " & "}
                    <Link href={`/heroes/${h.slug}`} className="hover:text-violet">
                      {h.name}
                    </Link>
                  </span>
                ))}
              </p>
              <p className="font-mono text-[10px] text-ink-soft sm:text-xs">{years}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Mars and Moon ──────────────────────────────────────────────────────────── */

const WORLD: Record<Body, { title: string; lede: string; panel: string; accent: string; texture: string }> = {
  mars: {
    title: "The Martian family",
    lede: "Landers, rovers and a helicopter, from Viking 1 in 1976 to Ingenuity in 2024.",
    panel: "bg-[#fff1e8]",
    accent: "text-mars",
    texture: "bg-[url(/textures/mars-1024.jpg)]",
  },
  moon: {
    title: "The Lunar family",
    lede: "Probes that struck it on purpose, landers, and the first car driven on another world.",
    panel: "bg-[#eef2f7]",
    accent: "text-violet",
    texture: "bg-[url(/textures/moon-1024.jpg)]",
  },
};

function Orbit({ body }: { body: Body }) {
  const w = WORLD[body];
  const list = HEROES.filter((h) => h.body === body);
  return (
    <div className={`grid items-center gap-2 rounded-3xl px-4 pt-5 pb-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] sm:gap-8 sm:p-8 ${w.panel}`} data-reveal>
      {/* Phones: just the name and the link, so the orbit gets the room. */}
      <div className="max-sm:flex max-sm:items-baseline max-sm:justify-between max-sm:gap-3">
        <Eyebrow className={`max-sm:hidden ${w.accent}`}>
          <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-current align-middle" />
          {bodyName(body)}
        </Eyebrow>
        <h3 className="display text-2xl sm:mt-3 sm:text-5xl">{w.title}</h3>
        <p className="mt-3 max-w-sm text-ink-soft max-sm:hidden">{w.lede}</p>
        <Link href={`/heroes#h-${body}`} className={`inline-flex shrink-0 items-center gap-2 text-sm font-semibold hover:underline sm:mt-4 sm:text-base ${w.accent}`}>
          <span className="max-sm:hidden">All {bodyName(body)} machines</span>
          <span className="sm:hidden">See all</span> <ArrowRight />
        </Link>
      </div>

      <div className="relative mx-auto mb-4 aspect-square w-full max-w-[400px]">
        <div aria-hidden className="absolute inset-[11%] rounded-full border-2 border-dashed border-ink/10" />
        <div
          aria-hidden
          className={`planet absolute inset-[31%] rounded-full shadow-[inset_-18px_-10px_34px_rgba(0,0,0,0.5),0_20px_40px_-12px_rgba(0,0,0,0.3)] ${w.texture}`}
        />
        <ul>
          {list.map((h, i) => {
            const a = (i / list.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <li
                key={h.slug}
                className="absolute w-[19%] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(50 + 39 * Math.cos(a)).toFixed(2)}%`, top: `${(50 + 39 * Math.sin(a)).toFixed(2)}%` }}
              >
                <Link href={`/heroes/${h.slug}`} className="group block text-center" title={h.name} aria-label={h.name}>
                  <span className="relative block aspect-square overflow-hidden rounded-full bg-white shadow-[0_8px_20px_-8px_rgba(45,20,90,0.35)] ring-2 ring-white transition-transform duration-300 group-hover:scale-110 group-hover:ring-violet">
                    <Image src={cutout(h)} alt="" fill sizes="80px" className="object-contain p-1.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Names in a layer of their own, so no circle covers its neighbour's label. */}
        <ul aria-hidden className="pointer-events-none">
          {list.map((h, i) => {
            const a = (i / list.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <li
                key={h.slug}
                className="absolute -translate-x-1/2 rounded-sm bg-white/70 px-1 font-mono text-[10px] whitespace-nowrap text-ink sm:text-[11px]"
                style={{ left: `${(50 + 39 * Math.cos(a)).toFixed(2)}%`, top: `calc(${(50 + 39 * Math.sin(a)).toFixed(2)}% + 9.5% + 4px)` }}
              >
                {short(h)}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Worlds() {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-3 px-4 py-8 sm:gap-4 sm:px-8 sm:py-14 lg:py-20 xl:grid-cols-2">
      <Orbit body="mars" />
      <Orbit body="moon" />
    </section>
  );
}

/* ── Last signals ───────────────────────────────────────────────────────────── */

const POLAROIDS: { slug: string; image: string; date: string; text: string; tilt: number; drop: number }[] = [
  // apollo-15-rover, chapter "Watching them leave"
  { slug: "apollo-15-rover", image: "nasa/S71-41509", date: "2 Aug 1971", text: "Its camera watched the crew leave.", tilt: -5, drop: 10 },
  // phoenix, end story and chapter "Winter"
  { slug: "phoenix", image: "nasa/PIA12338", date: "2 Nov 2008", text: "Last signal, as the arctic winter set in.", tilt: 3, drop: 34 },
  // spirit, end story
  { slug: "spirit", image: "nasa/PIA12007", date: "22 Mar 2010", text: "Stuck at Troy, it last called home.", tilt: -2, drop: 0 },
  // opportunity, end story
  { slug: "opportunity", image: "nasa/PIA22222", date: "10 Jun 2018", text: "Very low power and a darkening sky.", tilt: 4, drop: 28 },
  // insight, end story and chapter "One of the last images"
  { slug: "insight", image: "nasa/PIA25680", date: "15 Dec 2022", text: "Its last word to Earth.", tilt: -4, drop: 6 },
];

export function LastSignals() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2" data-reveal>
        <div>
          <Eyebrow className="text-violet max-sm:hidden">Last signals</Eyebrow>
          <h2 className="display max-w-[22ch] text-3xl sm:mt-3 sm:text-5xl">
            They had names, birthdays and last words, <span className="text-violet">just like us.</span>
          </h2>
        </div>
        <Link href="/timeline" className="inline-flex items-center gap-2 text-sm font-semibold text-violet hover:underline sm:text-base">
          How each one went quiet <ArrowRight />
        </Link>
      </div>
      {/* Phones: four prints in a 2 × 2 grid. Desktop: all five in a loose, staggered row. */}
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-5">
        {POLAROIDS.map((p, i) => {
          const h = hero(p.slug);
          const ph = pic(p.image);
          return (
            <li
              key={p.slug}
              className={`lg:translate-y-(--drop) ${i === 4 ? "max-sm:hidden" : ""}`}
              style={{ "--drop": `${p.drop}px` } as React.CSSProperties}
              data-reveal
            >
              <Link
                href={`/heroes/${h.slug}`}
                className="relative block bg-white p-2 pb-3 shadow-[0_14px_30px_-12px_rgba(13,11,38,0.35)] transition-[rotate,scale] duration-300 hover:z-10 hover:scale-105 hover:rotate-0! sm:p-3 sm:pb-4"
                style={{ rotate: `${p.tilt}deg` }}
              >
                <span className="relative block aspect-square overflow-hidden bg-mist">
                  <Image src={ph.src} alt={ph.alt} fill sizes="(min-width:1024px) 18vw, (min-width:640px) 30vw, 45vw" className="object-cover" />
                </span>
                <span className="mt-2 block font-hand text-[16px] leading-tight text-ink sm:text-[21px]">{p.text}</span>
                <span className="mt-1 block font-mono text-[9px] text-ink-soft sm:text-[11px]">
                  {h.name} · {p.date}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Opportunity in 3D ──────────────────────────────────────────────────────── */

export function RoverModel() {
  const h = hero("opportunity");
  const m = h.model!;
  const p = pic(h.photo!);
  return (
    <section className="bg-[#f3f0ff]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-5 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-12 lg:py-20">
        <div data-reveal>
          <Eyebrow className="text-violet max-sm:hidden">3D model</Eyebrow>
          <h2 className="display text-3xl sm:mt-3 sm:text-5xl">Turn Opportunity in your hands.</h2>
          <p className="mt-4 max-w-md text-lg text-ink-soft max-sm:hidden">{h.summary}</p>
          <dl className="mt-4 flex flex-wrap gap-2 sm:mt-6">
            {h.stats.map((s) => (
              <div key={s.label} className="rounded-full bg-white px-3.5 py-1.5 text-sm shadow-[0_6px_16px_-10px_rgba(45,20,140,0.4)]">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-semibold">{s.value}</span> <span className="text-ink-soft">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Link href={`/heroes/${h.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-violet hover:underline sm:mt-8">
            Opportunity’s story <ArrowRight />
          </Link>
        </div>
        <div>
          <ModelStudio
            name={h.name}
            model={{ kind: "glb", src: m.src, title: m.title, credit: "NASA 3D Resources", source: m.source, note: m.note }}
            parts={PARTS[h.slug] ?? []}
            poster={p.src}
            posterAlt={p.alt}
            stage="light"
            compact
          />
        </div>
      </div>
    </section>
  );
}

/* ── Touchdown ──────────────────────────────────────────────────────────────── */

export function GameStrip() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-8">
      <Link href="/games/landing" className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-3 pr-5 transition-colors hover:border-violet">
        <Image src="/images/icon-touchdown.webp" alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-[22%]" />
        <p className="min-w-0 flex-1 text-[15px]">
          <span className="font-semibold">Touchdown</span>
          <span className="text-ink-soft"> · a short landing game on Mars and the Moon</span>
        </p>
        <span className="hidden font-mono text-[10px] text-ink-soft sm:inline">Icon: AI-generated</span>
        <span className="inline-flex items-center gap-2 font-semibold text-violet">
          Play <ArrowRight />
        </span>
      </Link>
    </section>
  );
}
