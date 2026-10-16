import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import { assetUrl } from "@thelastsignal/data";

export const metadata = generateSEO({
  title: "Games | The Last Signal",
  description: "Free browser games about the machines we left on Mars and the Moon.",
  path: "/games",
});

type Game = { title: string; text: string; href?: string; icon: ReactNode };

const tile = "h-full w-full rounded-[22%]";

const GAMES: Game[] = [
  {
    title: "Touchdown",
    text: "Land on Mars and the Moon and find the machines we left there.",
    href: "/games/landing",
    icon: <Image src={assetUrl("images/icon-touchdown.webp")} alt="" width={256} height={256} className={tile} />,
  },
  {
    title: "Drive with a delay",
    text: "Steer a rover with minutes of signal delay.",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-orange-400 via-rose-500 to-violet-700 text-white`}>
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden>
          <circle cx="32" cy="32" r="20" />
          <path d="M32 20v12l8 6" />
        </svg>
      </span>
    ),
  },
  {
    title: "Whose last view?",
    text: "Guess which machine took the photo.",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-sky-400 via-indigo-500 to-violet-700 text-white`}>
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" aria-hidden>
          <rect x="10" y="16" width="44" height="34" rx="4" />
          <path d="M10 42l12-10 10 8 8-6 14 10" />
        </svg>
      </span>
    ),
  },
];

/** Games: a simple store grid of icons. */
export default function GamesPage() {
  return (
    <SitePage eyebrow="The Last Signal" title="Games">
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
