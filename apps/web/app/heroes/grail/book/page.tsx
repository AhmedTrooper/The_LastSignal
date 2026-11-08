import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { GRAIL_PHOTOS } from "@/lib/grail-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/grail-story.css";

export const metadata = generateSEO({ title: "The Chronicles of GRAIL | Book & Comic Nook", description: "Five sourced chapters about Ebb and Flow’s long cruise, tandem gravity ranging, lower orbits, the lunar X-ray map and the Sally K. Ride Impact Site.", path: "/heroes/grail/book", ogImage: GRAIL_PHOTOS.cover.src });
export default function GrailBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening GRAIL’s book…</main>}><BookNook slug="grail" /></Suspense>;
}
