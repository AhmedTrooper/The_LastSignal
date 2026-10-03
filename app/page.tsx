import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Hero, Ticker, Resting } from "@/app/components/home/sections";
import { Famous, Worlds, LastSignals, RoverModel, GameStrip } from "@/app/components/home/highlights";
import { RevealManager } from "@/app/components/scroll-fx";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-white text-ink">
        <Hero />
        <Ticker />
        <Famous />
        <Worlds />
        <LastSignals />
        <RoverModel />
        <GameStrip />
        <Resting />
      </main>
      <Footer />
      <RevealManager />
    </>
  );
}
