import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "RoverVilla: Storybook of Discarded Machines | Master Edition",
  description:
    "An interactive, real-feel storybook chronicling the 12 legendary NASA machines left on the Moon and Mars from Ranger 7 (1964) to Ingenuity (2024).",
  path: "/story/book",
});

export default function StoryBookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
