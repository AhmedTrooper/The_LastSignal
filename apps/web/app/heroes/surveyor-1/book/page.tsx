import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { SURVEYOR_PHOTOS } from "@/lib/surveyor-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/surveyor-story.css";

export const metadata = generateSEO({ title: "The Chronicles of Surveyor 1 | Book & Comic Nook", description: "Five NASA-sourced chapters about an uncertain antenna, radar-controlled landing, lunar images, night survival and a later orbital shadow.", path: "/heroes/surveyor-1/book", ogImage: SURVEYOR_PHOTOS.cover.src });

export default function SurveyorBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Surveyor 1’s book…</main>}><BookNook slug="surveyor-1" /></Suspense>;
}
