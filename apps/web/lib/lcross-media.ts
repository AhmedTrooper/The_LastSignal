import type { Photo } from "./photos";
import { LCROSS_SOURCES as S } from "./lcross-sources";

/** URLs observed on NASA pages. Concepts, camera frames and data visualizations remain distinct. */
export const LCROSS_PHOTOS = {
  cover: { name: "lcross-centaur-concept", title: "LCROSS and Centaur · NASA artist’s concept", src: "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/226580main_2007-08-02_On_Way_In.jpg", source: S.mission.url, credit: "NASA", alt: "NASA artist’s concept of the LCROSS shepherding spacecraft separating from the Centaur above the Moon; not a photograph of the actual separation.", ai: false },
  plume: { name: "lcross-visible-plume", title: "Visible-camera plume · about 20 seconds after impact", src: "https://www.nasa.gov/wp-content/uploads/2019/03/402247main_lcross_results1_full.jpg", source: S.overview.url, credit: "NASA", alt: "NASA’s released LCROSS visible-camera image shows the impact debris plume. Appearance alone does not identify water or determine its concentration.", ai: false },
  nearInfrared: { name: "lcross-near-infrared-view", title: "Near-infrared lunar view · context image", src: "https://www.nasa.gov/wp-content/uploads/2019/03/392924main_LCROSS_4_full.jpg", source: S.overview.url, credit: "NASA", alt: "A lunar surface image from one of LCROSS’s near-infrared cameras, released with NASA’s overview. Its exposure date is not established here; it is not labelled as a terminal-impact frame or water-abundance map.", ai: false },
  lamp: { name: "SVS3785-LAMP", title: "LRO LAMP’s view · data-driven visualization", src: "/media/lcross/lamp-observation.jpg", source: S.lamp.url, credit: "NASA/Goddard Space Flight Center Scientific Visualization Studio", alt: "An SVS visualization shows the LAMP sensor slit and vapor-cloud signal. The signal is enhanced by subtracting data from the previous orbit; this is not a spacecraft camera frame.", ai: false },
} satisfies Record<string, Photo>;

export const LCROSS_ARCHIVE = {
  lamp: {
    title: "Watch LAMP observe the impact cloud", kind: "video", src: "/media/lcross/lamp-observation.mp4",
    originalSrc: "https://svs.gsfc.nasa.gov/vis/a000000/a003700/a003785/lcross_lamp_360p.mp4",
    source: S.lamp.url, credit: "NASA/Goddard Space Flight Center Scientific Visualization Studio",
    description: "NASA’s visualization looks through LRO LAMP’s ultraviolet viewport. The cloud signal uses the difference between post-impact data and the previous orbit. It is a silent data-driven animation, not continuous camera footage, a live transmission or LCROSS’s voice.",
  },
} as const;
