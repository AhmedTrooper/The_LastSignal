import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";

export const metadata = generateSEO({
  title: "Games | RoverVilla",
  description: "Free browser games about the machines we left on Mars and the Moon.",
  path: "/games",
});

type Game = { title: string; text: string; href?: string; icon: ReactNode };

const tile = "h-full w-full rounded-[22%]";

/** A gradient app icon with a simple line drawing on it. */
const icon = (gradient: string, glyph: ReactNode) => (
  <span className={`${tile} flex items-center justify-center bg-linear-to-br ${gradient} text-white`}>
    <svg viewBox="0 0 64 64" className="h-[56%] w-[56%]" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {glyph}
    </svg>
  </span>
);

const GAMES: Game[] = [
  {
    title: "Touchdown",
    text: "Land on Mars and the Moon and find the machines we left there.",
    href: "/games/landing",
    icon: <Image src="/images/icon-touchdown.webp" alt="" width={256} height={256} className={tile} />,
  },
  {
    title: "Last Pictures",
    text: "Fall toward the Moon with Ranger 7 and keep shooting.",
    href: "/games/ranger-7-dive",
    icon: icon(
      "from-slate-500 via-slate-700 to-[#18204a]",
      <>
        <rect x="10" y="18" width="44" height="32" rx="6" />
        <circle cx="32" cy="34" r="9" />
        <path d="M22 18l4-6h12l4 6" />
      </>,
    ),
  },
  {
    title: "Ebb & Flow",
    text: "Find hidden masses under the Moon from two spacecraft.",
    href: "/games/grail-gravity",
    icon: icon(
      "from-violet-400 via-indigo-600 to-[#2a1f5c]",
      <>
        <rect x="8" y="16" width="10" height="10" rx="2" />
        <rect x="46" y="16" width="10" height="10" rx="2" />
        <path d="M18 21h28" strokeDasharray="3 4" />
        <path d="M6 46c8 0 10-8 16-8s8 10 14 10 8-12 14-12 6 6 8 6" />
      </>,
    ),
  },
  {
    title: "Into the Plume",
    text: "Hit a dark crater, then fly through the plume to find water.",
    href: "/games/lcross-impact",
    icon: icon(
      "from-cyan-400 via-sky-700 to-[#101320]",
      <>
        <path d="M8 50h48" />
        <path d="M32 50c-2-10-10-14-12-24M32 50c2-10 10-14 12-24M32 50V22" />
        <circle cx="32" cy="12" r="4" />
      </>,
    ),
  },
  {
    title: "Trust the Signal",
    text: "Be the landing computer. Cut the engines at the right moment.",
    href: "/games/polar-lander-forensics",
    icon: icon(
      "from-sky-300 via-blue-500 to-[#0d1b3a]",
      <>
        <path d="M20 30h24l-4 10H24z" />
        <path d="M24 40l-6 10M40 40l6 10M32 40v10" />
        <path d="M25 20a10 10 0 0 1 14 0M20 14a17 17 0 0 1 24 0" />
      </>,
    ),
  },
  {
    title: "Is Anything Alive?",
    text: "Run Viking's soil tests and decide what they mean.",
    href: "/games/viking-biology",
    icon: icon(
      "from-orange-300 via-orange-600 to-[#7a2e1c]",
      <>
        <path d="M26 10h12M28 10v14L16 48a4 4 0 0 0 4 6h24a4 4 0 0 0 4-6L36 24V10" />
        <path d="M20 40h24" />
      </>,
    ),
  },
  {
    title: "Marsquake Hunter",
    text: "Read seismograms and find how far away each quake struck.",
    href: "/games/insight-seismology",
    icon: icon("from-amber-300 via-rose-500 to-[#5a1d2a]", <path d="M4 32h10l4-8 5 18 5-28 5 34 5-22 4 6h18" />),
  },
  {
    title: "Thin Air",
    text: "Climb, hover and land a helicopter in Mars's thin air.",
    href: "/games/ingenuity-flight",
    icon: icon(
      "from-yellow-200 via-amber-500 to-[#8a4a1c]",
      <>
        <path d="M10 16h44M14 24h36" />
        <path d="M32 16v16" />
        <rect x="24" y="32" width="16" height="10" rx="2" />
        <path d="M26 42l-6 10M38 42l6 10" />
      </>,
    ),
  },
  {
    title: "Chasing Sunshine",
    text: "Keep a solar rover alive, one Martian day at a time.",
    href: "/games/mer-twins",
    icon: icon(
      "from-yellow-300 via-orange-500 to-blue-700",
      <>
        <circle cx="46" cy="16" r="6" />
        <path d="M46 4v3M46 25v3M34 16h3M55 16h3" />
        <path d="M8 36h34" />
        <rect x="16" y="38" width="18" height="8" rx="2" />
        <circle cx="16" cy="52" r="3" />
        <circle cx="25" cy="52" r="3" />
        <circle cx="34" cy="52" r="3" />
      </>,
    ),
  },
  {
    title: "Drive with a delay",
    text: "Steer a rover with minutes of signal delay.",
    icon: icon(
      "from-orange-400 via-rose-500 to-blue-700",
      <>
        <circle cx="32" cy="32" r="20" />
        <path d="M32 20v12l8 6" />
      </>,
    ),
  },
  {
    title: "Whose last view?",
    text: "Guess which machine took the photo.",
    icon: icon(
      "from-sky-400 via-indigo-500 to-blue-700",
      <>
        <rect x="10" y="16" width="44" height="34" rx="4" />
        <path d="M10 42l12-10 10 8 8-6 14 10" />
      </>,
    ),
  },
];

/** Games: a simple store grid of icons. */
export default function GamesPage() {
  return (
    <SitePage eyebrow="RoverVilla" title="Games">
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {GAMES.map((g) => {
          const body = (
            <>
              <div className="relative aspect-square w-full shadow-[0_12px_30px_rgba(13,11,38,0.14)] transition-transform duration-300 group-hover:-translate-y-1 rounded-[22%]">
                {g.icon}
                {!g.href && <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[10px] text-ink">Soon</span>}
              </div>
              <h2 className="mt-3 font-semibold text-ink">{g.title}</h2>
              <p className="mt-0.5 text-sm leading-snug text-ink-soft">{g.text}</p>
            </>
          );
          return (
            <li key={g.title}>
              {g.href ? (
                <Link href={g.href} className="group block">
                  {body}
                </Link>
              ) : (
                <div className="opacity-70">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-16 font-mono text-[11px] text-ink-soft">Touchdown icon: AI-generated.</p>
    </SitePage>
  );
}
