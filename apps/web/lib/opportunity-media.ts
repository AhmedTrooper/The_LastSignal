import type { Photo } from "./photos";
import type { ScrollEdition } from "./machine-scroll";
import { OPPORTUNITY_BOOK } from "./machine-books/opportunity";

function archive(id: string, alt: string, file: string, source: string, credit = "NASA/JPL-Caltech"): Photo {
  return { name: id, title: id, alt, src: `https://d2pn8kiwq2w21t.cloudfront.net/original_images/${file}`, source, credit, ai: false };
}
export const OPPORTUNITY_PHOTOS = {
  shadow: archive("PIA06739", "Opportunity’s shadow photographed by its front hazard-avoidance camera at Endurance Crater on Sol 180, not at landing or during the final storm.", "jpegPIA06739.jpg", "https://www.jpl.nasa.gov/images/pia06739-opportunity-catches-its-shadow-on-sol-180/", "NASA/JPL"),
  purgatory: archive("PIA07999", "A look back at Purgatory Dune and the wheel tracks after Opportunity’s escape. Taken on Sol 491, not while the rover was still trapped.", "jpegPIA07999.jpg", "https://www.jpl.nasa.gov/images/pia07999-looking-back-at-purgatory-dune/", "NASA/JPL"),
  marathon: archive("PIA19155", "Opportunity’s approach to Marathon Valley, assembled from images taken on 3 and 4 March 2015, before the marathon-distance milestone.", "jpegPIA19155.jpg", "https://www.jpl.nasa.gov/images/pia19155-opportunitys-approach-to-marathon-valley/"),
  handoff: archive("PIA26812", "Perseverance’s navigation-camera view on 11 October 2026, when that rover passed Opportunity’s distance record. This is not an Opportunity photograph.", "e1_-_PIA26812_-_NAVCAM_record.png", "https://www.jpl.nasa.gov/news/nasas-perseverance-sets-off-world-record-for-total-distance-driven/"),
};

export const OPPORTUNITY_SCROLL_EDITION: ScrollEdition = {
  book: OPPORTUNITY_BOOK, cover: OPPORTUNITY_PHOTOS.shadow, bookmarkKey: "rv:opportunity:scroll:v1", theme: "mars",
  opening: { kicker: "Mars / Opportunity / MER-B", title: "Just a little", emphasis: "farther.", introduction: "I landed inside a crater. There were rocks to investigate right beside me. Then my wheels found a way out—and a much longer story.", invitation: "Come for the landing. Stay for the little things that kept a rover going." },
  preface: { label: "A rover, not a race", text: "Stone spheres in a rock. A wheel stuck in sand. A sky that no longer let the sunlight through. My journey wasn’t a straight line, and the team on Earth stayed with me through every turn." },
  ending: "The wheels are still on Mars. The pictures, measurements and lessons came home. A distance record can change hands; those discoveries remain.",
  directions: {
    "airbag-landing": { place: "Eagle Crater, Meridiani Planum", date: "January 2004", tone: "paper", diagram: "airbags" },
    blueberries: { place: "Berry Bowl, Eagle Crater", date: "March 2004", tone: "paper", diagram: "berries" },
    purgatory: { place: "Purgatory Dune", date: "April–June 2005", tone: "night", photograph: OPPORTUNITY_PHOTOS.purgatory, diagram: "sand", diagramBeats: [0, 1, 2] },
    marathon: { place: "Approaching Marathon Valley", date: "24 March 2015", tone: "paper", photograph: OPPORTUNITY_PHOTOS.marathon, diagram: "marathon", diagramBeats: [1, 2] },
    "dust-storm": { place: "Perseverance Valley", date: "June 2018 / Later legacy", tone: "night", photograph: OPPORTUNITY_PHOTOS.handoff, diagram: "dust", diagramBeats: [0, 1, 2] },
  },
};
