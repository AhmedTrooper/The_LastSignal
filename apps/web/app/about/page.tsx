import Link from "next/link";
import { HEROES } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import { Waveform } from "@/app/components/waveform";
import { ArrowRight } from "@/app/components/icons";

export const metadata = generateSEO({
  title: "About | The Last Signal",
  description: "They had names, birthdays and last words, just like us. Why we built a memorial for the machines we left behind.",
  path: "/about",
});

const RULES = [
  { title: "Real history underneath", text: "The adventures begin with real mission records. Source links let curious readers look deeper. An imagined machine voice is never presented as an astronaut’s quotation." },
  { title: "Pictures with a story", text: "Archival photographs carry their credits. Story illustrations are labelled, so you can tell a drawing from a real view of another world." },
  { title: "Room for everyone", text: "Read a chapter, try a control, or just look around. You do not need an account to explore RoverVilla." },
  { title: "Our own little clubhouse", text: "RoverVilla is independent, not affiliated with or endorsed by a space agency. AI-assisted narration and artwork are identified separately." },
];

export default function AboutPage() {
  return (
    <SitePage eyebrow="Why RoverVilla exists" title="They had names, birthdays and last words, just like us." lede="The people came home. Many of their machines didn’t. We made a place to remember what those explorers helped us do." scene="about">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed" data-reveal>
          <p>
            Rovers, landers and probes went where we couldn’t, and they never came back. Their missions are over, but they are still out
            there, on the plains of Mars and the dust of the Moon.
          </p>
          <p>
            We remember them the way we remember great people: where they were born, the life they lived, what they discovered, and
            their last signal home. The archive holds {HEROES.length} of them today, from Ranger 7 in 1964 to Ingenuity.
          </p>
          <Waveform seed="about" bars={40} live className="h-12 w-72 text-violet" />
          <Link href="/heroes" className="inline-flex items-center gap-3 rounded-full bg-violet px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-violet-deep">
            Meet the explorers <ArrowRight />
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {RULES.map((r, i) => (
            <li key={r.title} className="rounded-2xl border border-line bg-mist p-6" data-reveal>
              <p className="font-mono text-xs">0{i + 1}</p>
              <h2 className="display mt-2 text-2xl">{r.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{r.text}</p>
            </li>
          ))}
          <li className="rounded-2xl border border-line bg-mist p-6 sm:col-span-2" data-reveal>
            <p className="font-mono text-xs">LEGAL &amp; COMPLIANCE</p>
            <h2 className="display mt-2 text-2xl">Your Data &amp; Privacy</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              You can read our policies and manage your account and messages. Exploring the stories does not require signing in.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <Link href="/privacy" className="rounded-full border border-line bg-white px-4 py-2 text-ink hover:border-violet hover:text-violet transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="rounded-full border border-line bg-white px-4 py-2 text-ink hover:border-violet hover:text-violet transition-colors">
                Terms of Service
              </Link>
              <Link href="/delete-account" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100 transition-colors">
                Delete Account &amp; Data →
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </SitePage>
  );
}
