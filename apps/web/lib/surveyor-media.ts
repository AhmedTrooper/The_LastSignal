import type { Photo } from "./photos";
import { SURVEYOR_SOURCES as S } from "./surveyor-sources";

/** Observed NASA asset links and a labelled page rendered from the mission report. */
export const SURVEYOR_PHOTOS = {
  cover: { name: "surveyor-1-mosaic", title: "Surveyor 1’s landing-site mosaic", src: "https://www.nasa.gov/wp-content/uploads/2021/05/surveyor_1_7_mosaic_image.jpg", source: S.history.url, credit: "NASA", alt: "A composite of Surveyor 1 images shows the lunar terrain around its landing site; a mosaic, not a single camera exposure.", ai: false },
  launch: { name: "surveyor-1-launch", title: "Atlas-Centaur launch · 30 May 1966", src: "https://www.nasa.gov/wp-content/uploads/2021/05/surveyor_1_1_launch.jpg", source: S.history.url, credit: "NASA", alt: "The Atlas-Centaur carrying Surveyor 1 lifts off from Florida.", ai: false },
  diagram: { name: "surveyor-1-diagram", title: "Surveyor 1 hardware schematic", src: "https://www.nasa.gov/wp-content/uploads/2021/05/surveyor_1_3_model_diagram.jpg", source: S.history.url, credit: "NASA", alt: "NASA’s schematic identifies Surveyor’s legs, solar panel, antennas and other components. It is an engineering illustration, not a lunar photograph.", ai: false },
  footpad: { name: "surveyor-1-footpad", title: "A footpad and the local lunar ground", src: "https://www.nasa.gov/wp-content/uploads/2021/05/surveyor_1_4_foot_pad.jpg", source: S.history.url, credit: "NASA", alt: "Surveyor 1’s camera looks down at its footpad and surrounding granular lunar material.", ai: false },
  color: { name: "surveyor-1-color-composite", title: "A color view assembled from filtered images", src: "https://www.nasa.gov/wp-content/uploads/2021/05/surveyor_1_5_color_image.jpg", source: S.history.url, credit: "NASA", alt: "A lunar surface color composite assembled from separate Surveyor 1 images taken through different filters.", ai: false },
  surfaceShadow: { name: "surveyor-1-surface-shadow", title: "The lander photographs its own shadow", src: "https://www.nasa.gov/wp-content/uploads/2021/05/surveyor_1_6_shadow_lunarsurface.jpg", source: S.history.url, credit: "NASA", alt: "Surveyor 1’s shadow stretches across the lunar terrain as the first lunar night approaches.", ai: false },
  radiator: { name: "TR32-1023-II-Fig-A2", title: "Compartment A · 12 July 1966 · report figure", src: "/media/surveyor-1/compartment-a-p95.jpg", source: S.reportTwo.url, credit: "NASA/JPL · TR 32-1023, Part II, printed p. 95", alt: "Mission-report page showing a photograph of one damaged Vycor radiator segment on Compartment A. The original caption is retained.", ai: false },
  orbital: { name: "surveyor-1-lroc-2009", title: "Surveyor 1 from lunar orbit · 2009", src: "https://www.nasa.gov/wp-content/uploads/2021/05/surveyor_1_9_lroc_image_2009_nasa_gsfc_asu.png", source: S.history.url, credit: "NASA/GSFC/Arizona State University", alt: "LROC image locates the small Surveyor 1 spacecraft and its long shadow on the lunar surface.", ai: false },
} satisfies Record<string, Photo>;

export const SURVEYOR_ARCHIVE = {
  retrospective: {
    title: "America’s First Lunar Surveyor Turns 50", source: S.film.url, credit: "NASA/JPL-Caltech",
    src: "/media/surveyor-1/surveyor-retrospective.mp4", captions: "/media/surveyor-1/surveyor-retrospective.vtt",
    originalSrc: "https://d2pn8kiwq2w21t.cloudfront.net/media/videossurveyor20160602JPL-20160601-SURVEYf-0001-720cc.m4v",
    description: "NASA/JPL’s 2016 retrospective combines historical footage, illustrations and narration. It is not continuous onboard landing footage, a live signal, or Surveyor’s voice. Surveyor 1 made the first US soft landing; Luna 9 preceded it. Captions come from the NASA film.",
  },
} as const;
