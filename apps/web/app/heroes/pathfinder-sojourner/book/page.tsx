import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { PATHFINDER_BOOK } from "@/lib/machine-books/pathfinder-sojourner";
import { PATHFINDER_PHOTOS } from "@/lib/pathfinder-media";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";
import "@/app/components/story/reviewed-rovers.css";

export const metadata = generateSEO({ title: "Pathfinder & Sojourner | Book & Comic Nook", description: PATHFINDER_BOOK.introduction, path: "/heroes/pathfinder-sojourner/book", ogImage: PATHFINDER_PHOTOS.cover.src });
export default function PathfinderBookPage() { return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Pathfinder and Sojourner’s book…</main>}><BookNook slug="pathfinder-sojourner" /></Suspense>; }
