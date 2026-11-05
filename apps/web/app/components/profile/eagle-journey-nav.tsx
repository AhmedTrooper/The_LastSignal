"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/components/logo";
import "./eagle-learning.css";

const LINKS = [
  { href: "/heroes/apollo-11-lander", label: "Read my comic" },
  { href: "/heroes/apollo-11-lander/story", label: "Explore my journey" },
  { href: "/heroes/apollo-11-lander/movie", label: "Watch my memories" },
  { href: "/games/apollo-11-landing", label: "Try the landing" },
];

export default function EagleJourneyNav({ branded = false }: { branded?: boolean }) {
  const path = usePathname();
  return <div className="eagle-journey-navigation">{branded && <Link href="/" aria-label="RoverVilla home"><Logo compact /></Link>}<nav aria-label="Ways to explore Eagle">{LINKS.map(link => <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined}>{link.label}</Link>)}</nav></div>;
}
