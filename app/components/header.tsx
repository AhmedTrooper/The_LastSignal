"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/components/logo";
import { ArrowRight } from "@/app/components/icons";

const LINKS = [
  { href: "/heroes", label: "Heroes" },
  { href: "/where-they-rest", label: "Where They Rest" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

/** Standard / Story / Timeline. Story and Standard keep you on the same hero when you're on one. */
function useModes(pathname: string) {
  const hero = pathname.match(/^\/heroes\/([^/]+)/)?.[1];
  const mode = pathname.endsWith("/story") || pathname === "/story" ? "story" : pathname.startsWith("/timeline") ? "timeline" : "standard";
  return {
    mode,
    modes: [
      { id: "standard", label: "Standard", href: hero ? `/heroes/${hero}` : "/" },
      { id: "story", label: "Story", href: hero ? `/heroes/${hero}/story` : "/story" },
      { id: "timeline", label: "Timeline", href: "/timeline" },
    ],
  };
}

export function ModeSwitch({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { mode, modes } = useModes(pathname);
  return (
    <nav aria-label="View mode" className={`flex items-center rounded-full border border-line bg-white p-1 text-sm ${className}`}>
      {modes.map((m) => (
        <Link
          key={m.id}
          href={m.href}
          aria-current={mode === m.id ? "page" : undefined}
          className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
            mode === m.id ? "bg-violet text-white" : "text-ink hover:text-violet"
          }`}
        >
          {m.label}
        </Link>
      ))}
    </nav>
  );
}

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

          <nav className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
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

          <div className="hidden items-center gap-5 lg:flex">
            <ModeSwitch className="hidden xl:flex" />
            <TributeButton />
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
          {[...LINKS, { href: "/timeline", label: "Timeline" }, { href: "/tributes", label: "Tributes" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="display border-b border-line py-4 text-3xl text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-4 p-6">
          <div onClick={() => setOpen(false)} className="space-y-4">
            <ModeSwitch className="w-fit" />
            <TributeButton className="w-full justify-center py-4" />
          </div>
        </div>
      </div>
    </>
  );
}
