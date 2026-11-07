import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { LCROSS_PHOTOS } from "@/lib/lcross-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/lcross-story.css";

export const metadata = generateSEO({ title: "The Chronicles of LCROSS | Book & Comic Nook", description: "Five sourced chapters about a reused rocket stage, a fuel scare, two impacts and the evidence for water in lunar polar material.", path: "/heroes/lcross/book", ogImage: LCROSS_PHOTOS.cover.src });

export default function LcrossBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening LCROSS’s book…</main>}><BookNook slug="lcross" /></Suspense>;
}
