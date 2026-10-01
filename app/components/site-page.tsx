import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { RevealManager } from "@/app/components/scroll-fx";

/** Standard inner page: eyebrow, big title, optional lede, then the content. */
export default function SitePage({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-20 sm:px-8 lg:pt-14 lg:pb-28">
          <p className="rise font-mono text-sm tracking-[0.12em] text-violet uppercase">{eyebrow}</p>
          <h1 className="display rise mt-3 max-w-[16ch] text-5xl lg:text-[80px]" style={{ animationDelay: "60ms" }}>
            {title}
          </h1>
          {lede && (
            <p className="rise mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft" style={{ animationDelay: "120ms" }}>
              {lede}
            </p>
          )}
          <div className="mt-10 lg:mt-14">{children}</div>
        </div>
      </main>
      <Footer />
      <RevealManager />
    </>
  );
}
