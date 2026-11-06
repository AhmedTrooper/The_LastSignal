import Link from "next/link";
import { HEROES } from "@/lib/heroes";
import { photo } from "@/lib/photos";
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
      eyebrow="The space photo album"
      title="Look what they saw."
      lede="Rocks up close. Worlds from above. Little tracks in a very big place. Open a picture to see its story, credit, and original source. Any AI illustration is clearly labelled."
      scene="photos"
    >
      <div className="club-gallery-room space-y-8">
        {HEROES.filter((h) => h.gallery.length > 0).map((h) => (
          <section key={h.slug} data-reveal>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="display text-3xl">{h.name}</h2>
              <Link href={`/heroes/${h.slug}`} className="text-sm font-semibold text-violet hover:underline">
                 Meet this explorer ↗
              </Link>
            </div>
            <Gallery items={h.gallery.map((n) => photo(n, h.name))} name={h.name} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
          </section>
        ))}
      </div>
    </SitePage>
  );
}
