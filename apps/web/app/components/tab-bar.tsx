"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, MapIcon, Play, RoverIcon } from "@/app/components/icons";
import { CLUB_LINKS, isClubLinkActive } from "@/lib/clubhouse";

const ICONS = { explorers: RoverIcon, stories: BookIcon, games: Play, map: MapIcon };

export default function TabBar() {
  const path = usePathname();
  // Immersive readers and mission games keep their own navigation.
  if (/^\/heroes\/[^/]+\/(story|book|movie)$/.test(path) || path === "/story/book" || path.startsWith("/games/")) return null;
  return <nav className="club-tabbar" aria-label="Quick places"><ul>{CLUB_LINKS.map(link => { const Icon = ICONS[link.icon]; return <li key={link.href}><Link href={link.href} aria-current={isClubLinkActive(path, link.href) ? "page" : undefined}><Icon className="h-5 w-5" />{link.short}</Link></li>; })}</ul></nav>;
}
