import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import { assetUrl } from "@thelastsignal/data";
import { ArrowRight, Play } from "@/app/components/icons";
import EagleIssueArt from "@/app/components/profile/eagle-issue-art";

export const metadata = generateSEO({
  title: "Games | The Last Signal",
  description: "Free browser games about the machines we left on Mars and the Moon.",
  path: "/games",
});

type Game = { title: string; text: string; href?: string; icon: ReactNode };

const tile = "h-full w-full rounded-[22%]";

const GAMES: Game[] = [
  {
    title: "Two spacecraft. One Moon.",
    text: "Explore how a pair of spacecraft helps reveal the Moon’s gravity.",
    href: "/games/grail-gravity",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-purple-600 via-indigo-700 to-slate-950 text-white relative overflow-hidden shadow-inner`}>
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="20" cy="32" r="8" className="text-purple-300" strokeWidth="2.5" />
          <circle cx="44" cy="32" r="8" className="text-cyan-300" strokeWidth="2.5" />
          <path d="M28 32h8" strokeDasharray="2 2" className="text-amber-400" strokeWidth="2" />
        </svg>
      </span>
    ),
  },
  {
    title: "A clue in the shadows",
    text: "Follow an impact plume and learn how scientists looked for lunar water.",
    href: "/games/lcross-impact",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-sky-500 via-cyan-600 to-indigo-950 text-white relative overflow-hidden shadow-inner`}>
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 50l20-30 20 30" className="text-cyan-300" strokeWidth="3" />
          <circle cx="32" cy="16" r="4" className="text-amber-300" fill="currentColor" />
          <path d="M24 50c4-6 12-6 16 0" className="text-white" strokeWidth="2" />
        </svg>
      </span>
    ),
  },
  {
    title: "The missing-signal mystery",
    text: "Investigate a possible landing failure. What can missing data tell us?",
    href: "/games/polar-lander-forensics",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-rose-600 via-red-700 to-zinc-950 text-white relative overflow-hidden shadow-inner`}>
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M32 10v32m-8-8l8 8 8-8" className="text-rose-300" strokeWidth="3" />
          <path d="M14 54h36" className="text-white" strokeWidth="3" />
          <circle cx="32" cy="12" r="3" className="text-amber-400" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    title: "A scoop of Mars",
    text: "Try a soil experiment, then think carefully about what its results mean.",
    href: "/games/viking-biology",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-amber-600 via-rose-700 to-indigo-950 text-white relative overflow-hidden shadow-inner`}>
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
    title: "Listen inside Mars",
    text: "Look for a quake signal and discover what vibrations can reveal.",
    href: "/games/insight-seismology",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-emerald-600 via-teal-700 to-indigo-950 text-white relative overflow-hidden shadow-inner`}>
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 32h14l4-12 6 24 6-18 4 10 4-4h14" className="text-emerald-300" strokeWidth="3" />
          <circle cx="32" cy="52" r="4" className="text-amber-400" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    title: "Fly with Ingenuity",
    text: "Explore how spinning blades can help a little helicopter fly in thin air.",
    href: "/games/ingenuity-flight",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-cyan-500 via-sky-600 to-indigo-950 text-white relative overflow-hidden shadow-inner`}>
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 20h40M8 26h48" className="text-cyan-300" strokeWidth="3" />
          <rect x="26" y="26" width="12" height="14" rx="2" className="text-amber-400" fill="currentColor" />
          <path d="M26 40l-8 14M38 40l8 14M22 54h-4M46 54h-4" className="text-white" />
        </svg>
      </span>
    ),
  },
  {
    title: "The rover weather lab",
    text: "See how dust changes the sunlight a solar-powered rover depends on.",
    href: "/games/mer-twins",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-amber-600 via-orange-600 to-rose-950 text-white relative overflow-hidden shadow-inner`}>
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
    title: "Find a place for Eagle’s feet",
    text: "Try an illustrated landing, then meet the real engine and landing gear.",
    href: "/games/apollo-11-landing",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-amber-500 via-sky-600 to-indigo-900 text-white relative overflow-hidden shadow-inner`}>
        <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 relative z-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 48l16-32 16 32-16-8-16 8z" className="text-amber-300" />
          <path d="M12 56l10-8M52 56l-10-8" className="text-white" />
          <circle cx="32" cy="16" r="3" className="text-cyan-300" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    title: "One last look at the Moon",
    text: "Follow Ranger 7’s camera views as the spacecraft approaches the surface.",
    href: "/games/ranger-7-dive",
    icon: (
      <span className={`${tile} flex items-center justify-center bg-linear-to-br from-violet-600 via-indigo-700 to-black text-white relative overflow-hidden shadow-inner`}>
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
  const playable = GAMES.filter(game => game.href).sort((a, b) => (a.href === "/games/apollo-11-landing" ? -1 : b.href === "/games/apollo-11-landing" ? 1 : 0));
  return (
    <SitePage eyebrow="The mission playground" title="A little try. A big “aha!”" lede="You don’t have to get it right first time. Try the controls, notice what changes, and discover the engineering behind a real space adventure." scene="games">
      <section className="club-game-feature"><div><p className="club-kicker">A good place to begin / Eagle</p><h2 className="display">Can you find a place for my feet?</h2><p>There’s rough ground ahead. Help the illustrated lander find a clear patch, then see how the real landing happened.</p><Link href="/games/apollo-11-landing" className="club-button club-button-primary">Try Eagle’s landing <ArrowRight className="h-4 w-4" /></Link><span>No score to beat. Your curiosity is enough.</span></div><figure><EagleIssueArt scene="boulders" /><figcaption>AI-assisted illustration · practice game, not a flight replay</figcaption></figure></section>
      <div className="club-section-heading"><div><h2 className="display">Choose your next mission.</h2><p>A camera, a pair of wings, a tiny ground movement. There’s more than one way to explore.</p></div></div>
      <ul className="club-game-grid">
        {playable.map((g) => {
          const body = (
            <>
               <div className="club-game-icon">
                {g.icon}
                {!g.href && <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[10px] text-ink">Soon</span>}
              </div>
               <div className="club-game-copy"><h3 className="display">{g.title}</h3><p>{g.text}</p><span>Let’s try it <Play className="h-3.5 w-3.5" /></span></div>
            </>
          );
          return (
            <li key={g.title}>
              {g.href ? (
                 <Link href={g.href} className="club-game-card">
                  {body}
                </Link>
              ) : (
                <div className="opacity-70">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="club-note mt-10"><strong>Practice, not Mission Control.</strong><p className="mt-2">These games are illustrative learning tools, not live spacecraft controls or exact flight replays. Mission records and sources are available alongside the stories. The Touchdown icon is AI-generated.</p></div>
      <details className="mt-8 text-sm text-ink-soft"><summary className="cursor-pointer py-3">In the workshop</summary><ul className="mt-3 space-y-3">{GAMES.filter(game => !game.href).map(game => <li key={game.title}><strong>{game.title}</strong> — {game.text} <span className="text-xs">Coming later</span></li>)}</ul></details>
    </SitePage>
  );
}
