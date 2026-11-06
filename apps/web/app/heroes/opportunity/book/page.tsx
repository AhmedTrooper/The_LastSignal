import { Suspense } from "react";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "@/app/heroes/apollo-11-lander/book/machine-books.css";

export default function OpportunityBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Opportunity’s book…</main>}><BookNook slug="opportunity" /></Suspense>;
}
