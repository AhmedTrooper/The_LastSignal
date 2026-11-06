import { Suspense } from "react";
import BookNook from "@/app/components/story/book-nook";
import "@/app/story/book/book.css";
import "./machine-books.css";

export default function StoryBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening the Book &amp; Comic Nook…</main>}><BookNook /></Suspense>;
}
