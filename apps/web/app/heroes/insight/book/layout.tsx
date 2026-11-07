import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({ title: "InSight: The lander that listened | Book & Comic", description: "Five source-linked stories about InSight’s journey, marsquakes, stubborn soil, dust and lasting scientific record. Read as a comic or storybook.", path: "/heroes/insight/book" });

export default function InsightBookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
