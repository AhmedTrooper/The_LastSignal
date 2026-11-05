import data from "./eagleStoryData.json";
import { photo, type Photo } from "./photos";

export type EagleMemory = (typeof data.scenes)[number] & { photo?: Photo };
export const EAGLE_MEMORIES: EagleMemory[] = data.scenes.map(scene => ({
  ...scene,
  photo: scene.photoId ? {
    name: scene.image!,
    src: `https://www.lpi.usra.edu/resources/apollo/images/browse/AS11/${scene.photoId.split("-")[1]}/${scene.photoId.split("-")[2]}.jpg`,
    alt: scene.photoCaption!, title: scene.photoId, credit: "NASA · Lunar and Planetary Institute", ai: false,
    source: `https://www.lpi.usra.edu/resources/apollo/frame/?${scene.photoId}`,
  } : scene.image ? photo(scene.image) : undefined,
}));
