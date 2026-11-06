"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/components/logo";
import { ArrowRight, BookIcon, ChevronDown, Close, MapIcon, Play, RoverIcon } from "@/app/components/icons";
import { useAuth } from "@/lib/auth-context";
import { CLUB_LINKS, CLUB_MORE_LINKS, isClubLinkActive } from "@/lib/clubhouse";

const NAV_ICONS = { explorers: RoverIcon, stories: BookIcon, games: Play, map: MapIcon };

export function TributeButton({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const hero = pathname.match(/^\/heroes\/([^/]+)/)?.[1];
  return (
    <Link
      href={hero ? `/heroes/${hero}#tributes` : "/tributes"}
      className={`inline-flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-deep ${className}`}
    >
      Leave a tribute
      <ArrowRight />
    </Link>
  );
}

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  if (loading) return null;
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => signInWithGoogle()}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink hover:border-violet hover:text-violet transition-colors"
        >
          Sign in
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {user.photoURL ? (
        <Image
          src={user.photoURL}
          alt={user.displayName || "User"}
          width={32}
          height={32}
          referrerPolicy="no-referrer"
          className="rounded-full ring-1 ring-violet/30"
        />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet text-xs font-bold text-white">
          {(user.displayName || "U")[0]?.toUpperCase()}
        </span>
      )}
      <button
        onClick={() => signOutUser()}
        title="Sign out"
        className="text-[11px] text-ink-soft hover:text-red-500 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}

function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    return () => { node?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} id="club-mobile-menu" className="club-menu-dialog" aria-label="Explore RoverVilla" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header><Logo compact /><button type="button" onClick={onClose} aria-label="Close menu"><Close /></button></header>
    <p className="club-kicker mt-6">Where shall we go?</p>
    <nav className="club-mobile-links" aria-label="Main navigation">{CLUB_LINKS.map(link => { const Icon = NAV_ICONS[link.icon]; return <Link key={link.href} href={link.href} onClick={onClose} aria-current={isClubLinkActive(pathname, link.href) ? "page" : undefined}><Icon className="h-7 w-7" /><span><strong>{link.label}</strong><small>{link.description}</small></span></Link>; })}</nav>
    <nav className="club-menu-extra" aria-label="More places">{CLUB_MORE_LINKS.map(link => <Link key={link.href} href={link.href} onClick={onClose}>{link.label}</Link>)}</nav>
    <div className="club-menu-bottom"><div><p className="text-xs text-ink-soft">No account needed to explore.</p><div className="mt-3"><AuthButton /></div></div><Link href="/privacy" onClick={onClose} className="py-3 text-xs text-ink-soft">Privacy &amp; your data ↗</Link></div>
  </dialog>;
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const more = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeMore = (event: KeyboardEvent) => { if (event.key === "Escape" && more.current?.open) { more.current.open = false; more.current.querySelector<HTMLElement>("summary")?.focus(); } };
    window.addEventListener("keydown", closeMore);
    return () => window.removeEventListener("keydown", closeMore);
  }, []);
  return <>
    <a href="#club-main" className="club-skip-link">Skip to page content</a>
    <header className="club-header"><div className="club-header-inner">
      <Link href="/" aria-label="RoverVilla home" className="club-header-logo"><Logo /></Link>
      <nav className="club-desktop-nav" aria-label="Explore RoverVilla">{CLUB_LINKS.map(link => <Link key={link.href} href={link.href} aria-current={isClubLinkActive(pathname, link.href) ? "page" : undefined} className="club-nav-link">{link.label}</Link>)}<details ref={more} className="club-more-menu"><summary>More <ChevronDown className="h-3.5 w-3.5" /></summary><div className="club-more-panel">{CLUB_MORE_LINKS.map(link => <Link key={link.href} href={link.href} onClick={() => { if (more.current) more.current.open = false; }}>{link.label}</Link>)}<div className="club-account"><AuthButton /></div></div></details></nav>
      <div className="club-header-actions"><Link href="/story" className="club-button club-button-primary">Find a story <ArrowRight className="h-4 w-4" /></Link><button type="button" className="club-menu-toggle" aria-label="Open menu" aria-expanded={open} aria-controls="club-mobile-menu" onClick={() => setOpen(true)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5 8h14M5 16h14" /></svg></button></div>
    </div></header>
    {open && <MobileMenu pathname={pathname} onClose={() => setOpen(false)} />}
  </>;
}
