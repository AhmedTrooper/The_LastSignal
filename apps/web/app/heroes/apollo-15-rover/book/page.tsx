import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { LRV_BOOK } from "@/lib/machine-books/apollo-15-rover";
import { LRV_PHOTOS } from "@/lib/lrv-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/reviewed-rovers.css";

export const metadata = generateSEO({ title: "Apollo 15 Rover | Book & Comic Nook", description: LRV_BOOK.introduction, path: "/heroes/apollo-15-rover/book", ogImage: LRV_PHOTOS.cover.src });
export default function LrvBookPage() { return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening the lunar rover’s book…</main>}><BookNook slug="apollo-15-rover" /></Suspense>; }
