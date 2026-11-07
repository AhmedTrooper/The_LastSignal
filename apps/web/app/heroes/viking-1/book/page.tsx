import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { VIKING_PHOTOS } from "@/lib/viking-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/viking-story.css";

export const metadata = generateSEO({ title: "The Chronicles of Viking 1 | Book & Comic Nook", description: "Five sourced chapters about Viking 1’s careful Mars landing, sampler recovery, surprising soil experiments, long weather watch and lost radio link.", path: "/heroes/viking-1/book", ogImage: VIKING_PHOTOS.cover.src });

export default function VikingBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Viking 1’s book…</main>}><BookNook slug="viking-1" /></Suspense>;
}
