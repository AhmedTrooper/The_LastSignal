import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "The Chronicles of Ranger 7 | Book & Comic Nook",
  description: "Five true-event stories from Ranger 7’s one-way mission to the Moon. Read each as a comic, storybook or scroll story, with NASA, NSSDCA and LPI sources.",
  path: "/heroes/ranger-7/book",
});

export default function RangerBookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
