import Link from "next/link";
import { HEROES } from "@/lib/heroes";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import Gallery from "@/app/components/profile/gallery";

export const metadata = generateSEO({
  title: "Gallery | The Last Signal",
  description: "Photos of the machines we left on Mars and the Moon.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <SitePage
      eyebrow="Gallery"
      title="Their last views."
      lede="Every image here is an AI-made placeholder for now. They will be replaced with credited public-domain mission photos."
    >
      <div className="space-y-12">
        {HEROES.filter((h) => h.gallery.length > 1).map((h) => (
          <section key={h.slug} data-reveal>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="display text-3xl">{h.name}</h2>
              <Link href={`/heroes/${h.slug}`} className="text-sm font-semibold text-violet hover:underline">
                Read their story
              </Link>
            </div>
            <Gallery images={h.gallery} name={h.name} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />
          </section>
        ))}
      </div>
    </SitePage>
  );
}
