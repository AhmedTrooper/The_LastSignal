"use client";

import { useEffect, useState } from "react";

/**
 * The verified record, folded away under the console. It is still server-rendered and still in the
 * HTML for search engines and for anyone who follows a #tributes or #wiki- link; it only opens.
 */
export default function Archive({ children, count, friendly = false }: { children: React.ReactNode; count: number; friendly?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openNow = () => setOpen(true);
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      if (document.getElementById(id)) openNow();
    };
    window.addEventListener("tls:open-archive", openNow);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      window.removeEventListener("tls:open-archive", openNow);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    <section id="archive" className="scroll-mt-24">
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">The verified record</p>
          <h2 className="display mt-1 text-[30px] sm:text-[36px]">{friendly ? "Curious about the real details?" : "Everything, in full"}</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {friendly ? "The photographs, hardware facts, and historical sources are here when you want to look closer. You don’t have to read it all to enjoy the story." : "The long read, the mission clock, the launch and landing, every photograph and the sources they came from. Nothing here is summarised for you."}
          </p>
        </div>
        <button
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="archive-body"
          className="inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-violet hover:text-violet sm:self-auto"
        >
          {open ? "Close the record" : `Open the record · ${count} sections`}
          <span aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
            ↓
          </span>
        </button>
      </div>

      <div id="archive-body" hidden={!open} className="pt-8">
        {children}
      </div>
    </section>
  );
}
