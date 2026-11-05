import Image from "next/image";

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
      <Image src="/branding/rovervilla-logo.webp" alt="" width={600} height={625} className={`${compact ? "h-10 w-10" : "h-12 w-12"} rounded-xl bg-[#07112b] object-contain p-0.5`} />
      <span className={`font-display font-bold tracking-[-0.025em] ${compact ? "text-lg" : "text-xl lg:text-[23px]"}`}>
        RoverVilla
      </span>
    </span>
  );
}
