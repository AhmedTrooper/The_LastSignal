import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import ExplorerHome from "@/app/components/home/explorer-home";
import "./home.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-[#fffaf0] text-ink">
        <ExplorerHome />
      </main>
      <Footer />
    </>
  );
}
