import data from "./eagleStoryData.json";
import { photo, type Photo } from "./photos";

export type EagleTrigger = "undock" | "alarm" | "land" | "camera" | "laser" | "breaker" | "ascent" | "return";
export type EagleMemory = Omit<(typeof data.scenes)[number], "trigger"> & { trigger: EagleTrigger; photo?: Photo; photos: Photo[] };
export const EAGLE_STORY_SOURCES = [
  { label: "Apollo Flight Journal · Undocking", url: "https://apollojournals.org/afj/ap11fj/17day5-undock-doi.html" },
  { label: "ALSJ · Landing & program alarms", url: "https://apollojournals.org/alsj/a11/a11.landing.html" },
  { label: "ALSJ · First steps", url: "https://apollojournals.org/alsj/a11/a11.step.html" },
  { label: "ALSJ · Circuit breaker & ascent", url: "https://apollojournals.org/alsj/a11/a11.launch.html" },
  { label: "NASA / JPL · Lunar laser ranging", url: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/" },
  { label: "ALSJ · Experiment deployment", url: "https://apollojournals.org/alsj/a11/a11.clsout.html" },
  { label: "NASA / LROC · Apollo 11: Second Look", url: "https://science.nasa.gov/photojournal/apollo-11-second-look/" },
];

export function apolloPhoto(id: string, caption: string): Photo {
  return {
    name: `nasa/${id.toLowerCase()}`,
    src: `https://www.lpi.usra.edu/resources/apollo/images/print/AS11/${id.split("-")[1]}/${id.split("-")[2]}.jpg`,
    alt: caption, title: id, credit: "NASA · Lunar and Planetary Institute", ai: false,
    source: `https://www.lpi.usra.edu/resources/apollo/frame/?${id}`,
  };
}

function archivePhoto(image: string): Photo {
  const record = photo(image);
  return image === "nasa/PIA12909" ? { ...record, source: "https://science.nasa.gov/photojournal/apollo-11-second-look/", alt: "LROC’s second view of the Apollo 11 landing site, published in September 2009." } : record;
}

export const EAGLE_MEMORIES: EagleMemory[] = data.scenes.map(scene => ({
  ...scene,
  trigger: scene.trigger as EagleTrigger,
  photo: scene.photoId ? apolloPhoto(scene.photoId, scene.photoCaption!) : scene.image ? archivePhoto(scene.image) : undefined,
  photos: [
    ...(scene.photoId ? [apolloPhoto(scene.photoId, scene.photoCaption!)] : scene.image ? [archivePhoto(scene.image)] : []),
    ...scene.gallery.map(item => apolloPhoto(item.id, item.caption)),
  ],
}));
