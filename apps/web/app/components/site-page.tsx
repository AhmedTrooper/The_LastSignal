import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { RevealManager } from "@/app/components/scroll-fx";
import WorldIllustration, { type ClubScene } from "@/app/components/clubhouse/world-illustration";

/** Standard inner page: eyebrow, big title, optional lede, then the content. */
export default function SitePage({
  eyebrow,
  title,
  lede,
  scene = "explorers",
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  scene?: ClubScene;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="club-main" className="club-page">
        <div className="club-page-inner">
          <header className="club-page-heading"><div><p className="club-room-label">{eyebrow}</p><h1 className="display">{title}</h1>{lede && <p className="club-page-lede">{lede}</p>}</div><div className="club-page-art"><WorldIllustration scene={scene} /></div></header>
          <div className="club-page-content">{children}</div>
        </div>
      </main>
      <Footer />
      <RevealManager />
    </>
  );
}
