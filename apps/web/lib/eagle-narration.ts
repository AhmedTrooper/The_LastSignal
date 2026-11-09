import { assetUrl } from "./heroes";
import type { NarrationClip } from "./thought-clouds";

type EagleClip = [beatId: string, textFingerprint: string, durationMs: number];

/** Recorded Eagle narration clips published in the R2 `audio/story-scroll/apollo11/` folder.
 * Each key and file name is the scroll-story beat ID. Fingerprints and durations are
 * measured from the current APOLLO_BOOK text and the local MP3 files. */
const EAGLE_CLIPS: EagleClip[] = [
["apollo-11-lander.undocking.b01", "196f1916", 8438],
  ["apollo-11-lander.undocking.b02", "7d6191bc", 5721],
  ["apollo-11-lander.undocking.b03", "59fafc7d", 6844],
  ["apollo-11-lander.undocking.b04", "20368b88", 7393],
  ["apollo-11-lander.alarm.b01", "55eb0e75", 7236],
  ["apollo-11-lander.alarm.b02", "8ec90042", 7158],
  ["apollo-11-lander.alarm.b03", "e7c0bf2d", 10031],
  ["apollo-11-lander.alarm.b04", "5a32bc86", 8438],
  ["apollo-11-lander.touchdown.b01", "9c674779", 7811],
  ["apollo-11-lander.touchdown.b02", "ca151650", 6687],
  ["apollo-11-lander.touchdown.b03", "b1917dd5", 6426],
  ["apollo-11-lander.touchdown.b04", "ebc8c167", 11311],
  ["apollo-11-lander.first-step.b01", "1ed9b4c2", 10109],
  ["apollo-11-lander.first-step.b02", "f97a1b68", 7158],
  ["apollo-11-lander.first-step.b03", "ebb4ba8c", 9169],
  ["apollo-11-lander.first-step.b04", "5b6dd0d5", 8986],
  ["apollo-11-lander.first-vibrations.b01", "ae775e29", 7967],
  ["apollo-11-lander.first-vibrations.b02", "142af75f", 8986],
  ["apollo-11-lander.first-vibrations.b03", "76b68ca8", 6269],
  ["apollo-11-lander.first-vibrations.b04", "55c27ca9", 8986],
  ["apollo-11-lander.reflector.b01", "343c242b", 10684],
  ["apollo-11-lander.reflector.b02", "f61912fa", 9091],
  ["apollo-11-lander.reflector.b03", "db3e9e7b", 8594],
  ["apollo-11-lander.reflector.b04", "c83e6128", 7811],
  ["apollo-11-lander.solar-wind.b01", "8142a363", 8829],
  ["apollo-11-lander.solar-wind.b02", "9a310255", 7706],
  ["apollo-11-lander.solar-wind.b03", "c2420a1d", 7706],
  ["apollo-11-lander.solar-wind.b04", "c3119a69", 7079],
  ["apollo-11-lander.breaker.b01", "472de0ff", 9482],
  ["apollo-11-lander.breaker.b02", "26a9b27b", 9326],
  ["apollo-11-lander.breaker.b03", "592b657b", 8516],
  ["apollo-11-lander.breaker.b04", "04a56cdd", 9561],
  ["apollo-11-lander.liftoff.b01", "4b110bee", 7967],
  ["apollo-11-lander.liftoff.b02", "ecf51738", 8673],
  ["apollo-11-lander.liftoff.b03", "ca18b01f", 7706],
  ["apollo-11-lander.liftoff.b04", "d4899e97", 8202],
  ["apollo-11-lander.seen-again.b01", "3181237b", 10188],
  ["apollo-11-lander.seen-again.b02", "384e578b", 10371],
  ["apollo-11-lander.seen-again.b03", "692e9d6b", 8829],
  ["apollo-11-lander.seen-again.b04", "5aeeff63", 7471],
];

export const EAGLE_NARRATION: Record<string, NarrationClip> = Object.fromEntries(
  EAGLE_CLIPS.map(([beatId, textFingerprint, durationMs]) => [
    beatId,
    {
      beatId,
      language: "en",
      textRevision: 1,
      textFingerprint,
      src: assetUrl(`audio/story-scroll/apollo11/${beatId}.mp3`),
      durationMs,
    } satisfies NarrationClip,
  ]),
) as Record<string, NarrationClip>;
