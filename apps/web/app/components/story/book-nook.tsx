"use client";

import { useSearchParams } from "next/navigation";
import { getMachineBook } from "@/lib/machine-books";
import MachineBookShelf from "./machine-book-shelf";
import MachineBookReader from "./machine-book-reader";

export default function BookNook() {
  const query = useSearchParams();
  const book = getMachineBook("apollo-11-lander")!;
  if (!query.has("read") && !query.has("chapter") && !query.has("format")) return <MachineBookShelf />;
  return <MachineBookReader key={book.slug} book={book} requestedChapter={query.get("chapter")} requestedFormat={query.get("format")} />;
}
