import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { PHOENIX_PHOTOS } from "@/lib/phoenix-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/phoenix-story.css";

export const metadata = generateSEO({ title: "The Chronicles of Phoenix | Book & Comic Nook", description: "Five sourced chapters about Phoenix’s resurrection, Arctic ice, water tasting, salty soil, laser snow and winter farewell.", path: "/heroes/phoenix/book", ogImage: PHOENIX_PHOTOS.cover.src });
export default function PhoenixBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Phoenix’s book…</main>}><BookNook slug="phoenix" /></Suspense>;
}
