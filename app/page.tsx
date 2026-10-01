import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Hero, Ticker, HeroesGrid, NamesBand, Resting } from "@/app/components/home/sections";
import { RevealManager } from "@/app/components/scroll-fx";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-white text-ink">
        <Hero />
        <Ticker />
        <HeroesGrid />
        <NamesBand />
        <Resting />
      </main>
      <Footer />
      <RevealManager />
    </>
  );
}
