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
  title = title.replaceAll("The Last Signal", "RoverVilla");
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
    icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
    other: { "format-detection": "telephone=no" },
  };
}

export const defaultSEO: Metadata = generateSEO({
  title: "RoverVilla: meet the machines we left on Mars and the Moon",
  description:
    "Their mission ended. Their story didn't. The life stories of the rovers, landers and probes that went where we couldn't and never came back.",
});
