"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, ClockIcon, HeartIcon, HomeIcon, MapIcon } from "@/app/components/icons";

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon, match: (p: string) => p === "/" || (p.startsWith("/heroes") && !p.endsWith("/story")) },
  { href: "/where-they-rest", label: "Map", Icon: MapIcon, match: (p: string) => p.startsWith("/where-they-rest") },
  { href: "/story", label: "Story", Icon: BookIcon, match: (p: string) => p === "/story" || p.endsWith("/story") },
  { href: "/timeline", label: "Timeline", Icon: ClockIcon, match: (p: string) => p.startsWith("/timeline") },
  { href: "/tributes", label: "Tributes", Icon: HeartIcon, match: (p: string) => p.startsWith("/tributes") },
];

/** App-style bottom navigation, shown below the lg breakpoint only. */
export default function TabBar() {
  const pathname = usePathname();
  // Stories and games play full screen with their own controls.
  if (/^\/heroes\/[^/]+\/story$/.test(pathname) || pathname === "/story/book" || pathname === "/heroes/apollo-11-lander/book" || pathname.startsWith("/games/")) return null;
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {TABS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active ? "text-violet" : "text-ink-soft"}`}
              >
                <Icon className={`h-6 w-6 ${active ? "[&_path]:fill-violet/15" : ""}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
