import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { SPIRIT_PHOTOS } from "@/lib/spirit-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/spirit-story.css";

export const metadata = generateSEO({ title: "The Chronicles of Spirit | Book & Comic Nook", description: "Five NASA-sourced chapters about Spirit’s rocky welcome, memory recovery, hill climb, broken-wheel discovery and final winter.", path: "/heroes/spirit/book", ogImage: SPIRIT_PHOTOS.cover.src });

export default function SpiritBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Spirit’s book…</main>}><BookNook slug="spirit" /></Suspense>;
}
