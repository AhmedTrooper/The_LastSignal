import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import ExplorerHome from "@/app/components/home/explorer-home";
import "./home.css";

export default function Home() {
  return (
    <>
      <Header />
      <main id="club-main" className="bg-[#fcf9f2] text-ink">
        <ExplorerHome />
      </main>
      <Footer />
    </>
  );
}
