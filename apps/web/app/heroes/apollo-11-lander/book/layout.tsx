import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "The Chronicles of Eagle | Book & Comic Nook",
  description: "Apollo 11’s Eagle tells its story through standalone true-event chapters. Read each as a four-panel comic or a storybook, with narration and linked mission records.",
  path: "/heroes/apollo-11-lander/book",
});

export default function EagleBookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
