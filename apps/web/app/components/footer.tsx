import Link from "next/link";
import { Logo } from "@/app/components/logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid grid-cols-1 max-w-[1440px] gap-8 px-4 py-12 sm:px-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12">
        <Link href="/" className="text-ink" aria-label="The Last Signal home">
          <Logo />
        </Link>
        <p className="text-lg leading-snug md:border-l md:border-line md:pl-12">
          They never came back.
          <br />
          So we bring their stories home.
        </p>
        <div className="space-y-2 font-mono text-sm text-ink-soft md:text-right">
          <p>
            thelastsignal.mtas.fi ·{" "}
            <Link href="/privacy" className="underline hover:text-violet">
              Privacy Policy
            </Link>
          </p>
          <p className="max-w-xs text-xs leading-relaxed">
            An independent memorial, not affiliated with or endorsed by any space agency. Images marked AI are placeholders, and the home page illustration is AI-generated.
          </p>
        </div>
      </div>
    </footer>
  );
}
