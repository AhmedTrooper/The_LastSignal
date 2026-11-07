import { generateSEO } from "@/lib/seo";
export const metadata = generateSEO({ title: "Ingenuity: A little helicopter. A new sky. | Book & Comic", description: "Five NASA-sourced stories about Ingenuity’s first flight, navigation challenges, discarded landing equipment and lasting engineering lessons.", path: "/heroes/ingenuity/book" });
export default function IngenuityBookLayout({ children }: { children: React.ReactNode }) { return children; }
