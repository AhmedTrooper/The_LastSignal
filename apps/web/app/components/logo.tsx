/** The broadcast mark: a dot inside three pairs of arcs, like a beacon still calling. */
export function SignalMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="24" cy="24" r="3.6" fill="currentColor" stroke="none" />
      <path d="M17 17a10 10 0 0 0 0 14M31 17a10 10 0 0 1 0 14" strokeWidth="3" />
      <path d="M11.5 11.5a17.7 17.7 0 0 0 0 25M36.5 11.5a17.7 17.7 0 0 1 0 25" strokeWidth="3" />
      <path d="M6 6a25.5 25.5 0 0 0 0 36M42 6a25.5 25.5 0 0 1 0 36" strokeWidth="3" />
    </svg>
  );
}

export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SignalMark className={compact ? "h-8 w-8" : "h-9 w-9 lg:h-10 lg:w-10"} />
      <span className={`font-display font-bold uppercase tracking-[-0.01em] ${compact ? "text-[13px]" : "text-[15px] lg:text-[17px]"}`}>
        RoverVilla
      </span>
    </span>
  );
}
