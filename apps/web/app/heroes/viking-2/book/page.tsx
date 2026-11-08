import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { VIKING_TWO_PHOTOS } from "@/lib/viking-two-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/viking-story.css";
import "@/app/components/story/viking-two-story.css";

export const metadata = generateSEO({ title: "The Chronicles of Viking 2 | Book & Comic Nook", description: "Five sourced chapters about Viking 2’s leaning landing, rock push, uncertain seismic signal, frost observations and relay to Earth.", path: "/heroes/viking-2/book", ogImage: VIKING_TWO_PHOTOS.cover.src });
export default function VikingTwoBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Viking 2’s book…</main>}><BookNook slug="viking-2" /></Suspense>;
}
