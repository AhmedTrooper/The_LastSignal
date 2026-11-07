import type { MetadataRoute } from "next";
import { HEROES } from "@/lib/heroes";
import { BASE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/where-they-rest", priority: 0.8 },
    { path: "/story", priority: 0.8 },
    { path: "/our-hero", priority: 0.8 },
    { path: "/timeline", priority: 0.8 },
    { path: "/gallery", priority: 0.6 },
    { path: "/tributes", priority: 0.6 },
    { path: "/about", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/delete-account", priority: 0.3 },
  ];
  const heroRoutes = HEROES.map((h) => ({ path: `/heroes/${h.slug}/story`, priority: 0.8 }));
  return [...staticRoutes, ...heroRoutes].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));
}
