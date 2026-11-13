import type { Metadata } from "next";
import { assetUrl } from "@thelastsignal/data";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://thelastsignal.mtas.fi";

const SITE_KEYWORDS = [
  "RoverVilla",
  "Mars rovers memorial",
  "Moon landers",
  "Opportunity rover",
  "Spirit rover",
  "Ingenuity helicopter",
  "Viking lander",
  "space exploration history",
  "last signal",
];

interface SEOConfig {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
}

/** Generates consistent Metadata for any page: Open Graph, Twitter Card, canonical and robots. */
export function generateSEO({
  title,
  description,
  path = "",
  ogImage = assetUrl("images/hero-opportunity.jpg"),
  keywords = [],
}: SEOConfig): Metadata {
  const url = `${BASE_URL}${path}`;
  const imageUrl = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;
  const allKeywords = [...new Set([...keywords, ...SITE_KEYWORDS])];

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    keywords: allKeywords,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: "RoverVilla",
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    icons: { icon: [{ url: "/branding/rovervilla-icon.png", type: "image/png" }] },
    other: { "format-detection": "telephone=no" },
  };
}

export const defaultSEO: Metadata = generateSEO({
  title: "RoverVilla: big adventures with the space machines we left behind",
  description:
    "Meet a space machine, read its comic, and try a mission. Explore the Moon and Mars through playful stories, original illustrations, and the real science behind the adventure.",
});
