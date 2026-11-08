import type { Photo } from "./photos";
import { MPL_SOURCES as S } from "./mpl-sources";

export const MPL_PHOTOS = {
  cover: { name: "MPL illustration", title: "Mars Polar Lander on the surface of Mars", src: "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/1699_mpl_768.jpg", source: S.mission.url, credit: "NASA/Jet Propulsion Laboratory-Caltech", alt: "Artist illustration of Mars Polar Lander on Mars, with three legs, solar wings, a mast camera and a robotic arm. It is an illustration, not a photograph of the spacecraft.", ai: false },
  site: { name: "PIA02348", title: "Latest color view of the polar landing site", src: "https://images-assets.nasa.gov/image/PIA02348/PIA02348~orig.jpg", source: S.site.url, credit: "NASA/JPL/MSSS", alt: "MGS color view of the polar target landing zone at about 76 degrees south. It is a site map, not an image of the lander.", ai: false },
  search: { name: "PIA02353", title: "Mars Polar Lander: the search continues", src: "https://images-assets.nasa.gov/image/PIA02353/PIA02353~orig.jpg", source: S.searchMosaic.url, credit: "NASA/JPL/MSSS", alt: "MGS search mosaic of the polar terrain where engineers looked for the missing lander. It represents the search, not a found spacecraft.", ai: false },
  scale: { name: "PIA02347", title: "Landing zone compared with JPL", src: "https://images-assets.nasa.gov/image/PIA02347/PIA02347~orig.jpg", source: S.scale.url, credit: "NASA/JPL/MSSS", alt: "Scale comparison of the polar landing-zone terrain with buildings and trees at JPL. It illustrates terrain scale, not the lander.", ai: false },
  map: { name: "PIA02314", title: "Proposed landing-site flat map", src: "https://images-assets.nasa.gov/image/PIA02314/PIA02314~orig.jpg", source: S.map.url, credit: "NASA/JPL", alt: "Flat map of the proposed Mars Polar Lander landing site. It is a planning map, not a post-landing crater photograph.", ai: false },
} satisfies Record<string, Photo>;
