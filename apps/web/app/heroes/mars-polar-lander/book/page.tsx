import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { MPL_PHOTOS } from "@/lib/mpl-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/mpl-story.css";

export const metadata = generateSEO({ title: "The Chronicles of Mars Polar Lander | Book & Comic Nook", description: "Five sourced chapters about the polar pioneer, Deep Space 2, the fatal software latch, the orbital search and the lessons that shaped Phoenix.", path: "/heroes/mars-polar-lander/book", ogImage: MPL_PHOTOS.cover.src });
export default function MplBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Mars Polar Lander’s book…</main>}><BookNook slug="mars-polar-lander" /></Suspense>;
}
