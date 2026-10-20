"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/components/logo";
import { ArrowRight } from "@/app/components/icons";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/heroes", label: "Heroes" },
  { href: "/story", label: "Story" },
  { href: "/timeline", label: "Timeline" },
  { href: "/where-they-rest", label: "Where They Rest" },
  { href: "/gallery", label: "Gallery" },
  { href: "/games", label: "Games" },
  { href: "/about", label: "About" },
];

/** Hero profiles live under /heroes, but their story pages belong to the Story section. */
const isActive = (pathname: string, href: string) =>
  href === "/story" ? pathname === "/story" || pathname.endsWith("/story") : href === "/heroes" ? pathname.startsWith("/heroes") && !pathname.endsWith("/story") : pathname.startsWith(href);

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
      <button
        onClick={() => signInWithGoogle()}
        className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink hover:border-violet hover:text-violet transition-colors"
      >
        Sign in
      </button>
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

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8 lg:h-[76px]">
          <Link href="/" aria-label="The Last Signal home" className="shrink-0 text-ink">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-5 text-[15px] font-medium lg:flex xl:gap-7">
            {LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 transition-colors hover:text-violet ${active ? "text-violet after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded after:bg-violet" : ""}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <TributeButton />
            <AuthButton />
          </div>

          <button
            className="-mr-2 p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 7h16M3 15h16" />}
            </svg>
          </button>
        </div>
      </header>

      {/* Kept outside <header>: its backdrop-filter would otherwise become the
          containing block for this fixed panel and collapse it to the bar's height. */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-white transition-[opacity,transform] duration-300 lg:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 pt-6">
          {[...LINKS, { href: "/tributes", label: "Tributes" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="display border-b border-line py-4 text-3xl text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-4 p-6">
          <div onClick={() => setOpen(false)}>
            <TributeButton className="w-full justify-center py-4" />
          </div>
          <div className="flex justify-center pt-2">
            <AuthButton />
          </div>
        </div>
      </div>
    </>
  );
}
