import Image from "next/image";
import Link from "next/link";
import { HEROES, catNo, img, lifespan, portrait, storyChapters } from "@/lib/heroes";
import { photo } from "@/lib/photos";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import { ArrowRight } from "@/app/components/icons";

export const metadata = generateSEO({
  title: "Stories: every machine, chapter by chapter | The Last Signal",
  description: "Pick a machine and scroll through its life, from the cleanroom to its last signal.",
  path: "/story",
});

/** Story index: one card per hero, each opening that hero's chaptered story. */
export default function StoryIndex() {
  return (
    <SitePage eyebrow="Story" title="Their lives, chapter by chapter." lede="Pick a machine. Its story opens one screen at a time, from the cleanroom to the last signal.">
      {/* Featured Master Storybook Reader Banner */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-r from-[#170e28] via-[#261542] to-[#170e28] p-6 text-white shadow-2xl sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 font-mono text-xs font-semibold text-rose-300">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
              Master Digital Storybook Edition
            </span>
            <h2 className="display mt-2 text-2xl font-bold sm:text-3xl">
              The Last Signal: Monuments in the Dust
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Experience the complete chronological story in a real two-page digital book reader. Flip through 12 pioneer machines, from Ranger 7&apos;s blind lunar plunge in 1964 to Ingenuity&apos;s historic flights on Mars.
            </p>
          </div>
          <Link
            href="/story/book"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 font-mono text-sm font-bold text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-105 hover:bg-rose-500"
          >
            Open Interactive Book 📖 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HEROES.map((h) => {
          const pic = photo(portrait(h), h.name);
          return (
            <li key={h.slug} data-reveal>
              <Link href={`/heroes/${h.slug}/story`} className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-night p-5 text-white sm:aspect-[3/4]">
                <Image src={img(portrait(h))} alt={pic.alt} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(12,10,34,0)_35%,rgba(12,10,34,0.92))]" />
                <p className="font-mono text-xs text-white/75">
                  {catNo(h.no)} · {storyChapters(h).length} chapters
                </p>
                <h2 className="display mt-1 text-3xl">{h.name}</h2>
                <p className="mt-1 font-mono text-sm text-white/80">{lifespan(h)}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Read the story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                {pic.ai && <span className="absolute top-3 right-3 rounded bg-white/85 px-1.5 py-0.5 font-mono text-[10px] text-ink">AI placeholder</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </SitePage>
  );
}
