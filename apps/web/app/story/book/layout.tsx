import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Monuments in the Dust: RoverVilla’s space comic",
  description:
    "Meet the machines left on the Moon and Mars through an illustrated comic: original SVG panels, imagined machine voices, mission stories, and optional science field notes.",
  path: "/story/book",
});

export default function StoryBookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
