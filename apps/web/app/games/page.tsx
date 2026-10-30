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
    title: "GRAIL: Microwave Gravity Lab",
    text: "Measure Moon gravity down to 0.02 µm/s in tandem orbit and explore the Sally K. Ride Impact Site.",
    href: "/games/grail-gravity",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-purple-600 via-indigo-700 to-slate-950 text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="20" cy="32" r="8" className="text-purple-300" strokeWidth="2.5" />
          <circle cx="44" cy="32" r="8" className="text-cyan-300" strokeWidth="2.5" />
          <path d="M28 32h8" strokeDasharray="2 2" className="text-amber-400" strokeWidth="2" />
        </svg>
      </span>
    ),
  },
  {
    title: "LCROSS: 7.2 GJ Water Plume",
    text: "Simulate the 9,000 km/h kinetic impact into Cabeus crater and detect water ice at 1.4 µm & 1.9 µm.",
    href: "/games/lcross-impact",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-sky-500 via-cyan-600 to-indigo-950 text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 50l20-30 20 30" className="text-cyan-300" strokeWidth="3" />
          <circle cx="32" cy="16" r="4" className="text-amber-300" fill="currentColor" />
          <path d="M24 50c4-6 12-6 16 0" className="text-white" strokeWidth="2" />
        </svg>
      </span>
    ),
  },
  {
    title: "Mars Polar Lander: 40m Bug Forensics",
    text: "Calculate free-fall physics, dissect the un-cleared sensor bit, and discover the reforms that saved Curiosity.",
    href: "/games/polar-lander-forensics",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-rose-600 via-red-700 to-zinc-950 text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M32 10v32m-8-8l8 8 8-8" className="text-rose-300" strokeWidth="3" />
          <path d="M14 54h36" className="text-white" strokeWidth="3" />
          <circle cx="32" cy="12" r="3" className="text-amber-400" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    title: "Viking: Mars Biology Lab",
    text: "Inject 14C nutrient broth into Martian soil, listen to the Geiger counter, and solve the perchlorate mystery.",
    href: "/games/viking-biology",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-amber-600 via-rose-700 to-indigo-950 text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M24 12v12l-10 24h36l-10-24v-12" className="text-amber-300" strokeWidth="3" />
          <path d="M20 12h24" className="text-white" strokeWidth="3" />
          <circle cx="32" cy="40" r="3" className="text-cyan-300" fill="currentColor" />
          <circle cx="26" cy="44" r="2" className="text-cyan-300" fill="currentColor" />
          <circle cx="38" cy="43" r="2.5" className="text-cyan-300" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    title: "InSight: Mars Seismology Lab",
    text: "Hear deep marsquakes, analyze seismograms, and hammer the heat probe through Martian regolith.",
    href: "/games/insight-seismology",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-emerald-600 via-teal-700 to-indigo-950 text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 32h14l4-12 6 24 6-18 4 10 4-4h14" className="text-emerald-300" strokeWidth="3" />
          <circle cx="32" cy="52" r="4" className="text-amber-400" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    title: "Ingenuity: Mars Aerodynamics",
    text: "Spin rotors at 2,900 RPM in Mars's 1% air and fly across 72 missions.",
    href: "/games/ingenuity-flight",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-cyan-500 via-sky-600 to-indigo-950 text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 20h40M8 26h48" className="text-cyan-300" strokeWidth="3" />
          <rect x="26" y="26" width="12" height="14" rx="2" className="text-amber-400" fill="currentColor" />
          <path d="M26 40l-8 14M38 40l8 14M22 54h-4M46 54h-4" className="text-white" />
        </svg>
      </span>
    ),
  },
  {
    title: "Mars Twins: Dust & Power",
    text: "Scrub atmospheric dust (tau) from clear skies to blackout and survive on Mars.",
    href: "/games/mer-twins",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-amber-600 via-orange-600 to-rose-950 text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="32" cy="24" r="12" className="text-amber-300" strokeWidth="2.5" />
          <path d="M12 52c8-8 16-12 24-8s16 4 20-4" className="text-orange-200" strokeWidth="2.5" />
          <circle cx="20" cy="46" r="3" className="text-white" fill="currentColor" />
          <circle cx="44" cy="44" r="3" className="text-white" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    title: "Tranquility Base Cockpit",
    text: "Fly Eagle past West Crater and explore 100+ discarded Moon artifacts.",
    href: "/games/apollo-11-landing",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-amber-500 via-sky-600 to-indigo-900 text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 48l16-32 16 32-16-8-16 8z" className="text-amber-300" />
          <path d="M12 56l10-8M52 56l-10-8" className="text-white" />
          <circle cx="32" cy="16" r="3" className="text-cyan-300" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    title: "17-Minute Impact Dive",
    text: "Scrub Ranger 7's kamikaze dive from 2,110 km to the Moon's surface.",
    href: "/games/ranger-7-dive",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-violet-600 via-indigo-700 to-black text-white relative overflow-hidden shadow-inner`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:12px_12px]" />
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
          <circle cx="32" cy="32" r="22" strokeDasharray="4 4" className="text-violet-300" />
          <circle cx="32" cy="32" r="8" className="text-amber-400" />
          <path d="M32 4v16M32 44v16M4 32h16M44 32h16" />
          <path d="M22 22l20 20" strokeWidth="2" strokeDasharray="2 2" className="text-red-400" />
        </svg>
      </span>
    ),
  },
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
