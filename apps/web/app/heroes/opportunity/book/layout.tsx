import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({ title: "The Chronicles of Opportunity | Book & Comic Nook", description: "Five true-event stories from Opportunity’s Mars mission. Read each as a comic, storybook or chronological scroll story, with NASA/JPL sources.", path: "/heroes/opportunity/book" });

export default function OpportunityBookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
