import { assetUrl } from "./heroes";
import type { NarrationClip } from "./thought-clouds";

type EagleClip = [beatId: string, textFingerprint: string, durationMs: number];

/** Recorded Eagle narration clips published in the R2 `audio/story-scroll/apollo11/` folder.
 * Each key and file name is the scroll-story beat ID. Fingerprints and durations are
 * measured from the current APOLLO_BOOK text and the local MP3 files. */
const EAGLE_CLIPS: EagleClip[] = [
  ["apollo-11-lander.undocking.b01", "fd99d5d8", 5068],
  ["apollo-11-lander.undocking.b02", "76400601", 4049],
  ["apollo-11-lander.undocking.b03", "38468c79", 4049],
  ["apollo-11-lander.undocking.b04", "fb9c7f36", 4676],
  ["apollo-11-lander.alarm.b01", "7edbdc7e", 5486],
  ["apollo-11-lander.alarm.b02", "888855a4", 3709],
  ["apollo-11-lander.alarm.b03", "0531895f", 4362],
  ["apollo-11-lander.alarm.b04", "617ecdc2", 3318],
  ["apollo-11-lander.touchdown.b01", "d2288f35", 4754],
  ["apollo-11-lander.touchdown.b02", "ff042d25", 4754],
  ["apollo-11-lander.touchdown.b03", "5efe8483", 4598],
  ["apollo-11-lander.touchdown.b04", "e379f3a2", 4676],
  ["apollo-11-lander.first-step.b01", "75ef4192", 5642],
  ["apollo-11-lander.first-step.b02", "1d1d5add", 3709],
  ["apollo-11-lander.first-step.b03", "9476a956", 4362],
  ["apollo-11-lander.first-step.b04", "824a14ea", 4127],
  ["apollo-11-lander.first-vibrations.b01", "e8f4e81f", 4754],
  ["apollo-11-lander.first-vibrations.b02", "356529c4", 5146],
  ["apollo-11-lander.first-vibrations.b03", "212e459f", 4911],
  ["apollo-11-lander.first-vibrations.b04", "3db7b4a5", 4989],
  ["apollo-11-lander.reflector.b01", "4c528042", 5146],
  ["apollo-11-lander.reflector.b02", "a5733df1", 3396],
  ["apollo-11-lander.reflector.b03", "4e643c90", 5146],
  ["apollo-11-lander.reflector.b04", "460abc44", 5564],
  ["apollo-11-lander.solar-wind.b01", "1a356736", 4519],
  ["apollo-11-lander.solar-wind.b02", "92f62dd1", 4833],
  ["apollo-11-lander.solar-wind.b03", "461ede48", 4206],
  ["apollo-11-lander.solar-wind.b04", "4a94df41", 4519],
  ["apollo-11-lander.breaker.b01", "77e55728", 6113],
  ["apollo-11-lander.breaker.b02", "9bb16107", 4362],
  ["apollo-11-lander.breaker.b03", "d256298e", 4127],
  ["apollo-11-lander.breaker.b04", "bbfbdb46", 4362],
  ["apollo-11-lander.liftoff.b01", "6183c771", 5564],
  ["apollo-11-lander.liftoff.b02", "ad839739", 4441],
  ["apollo-11-lander.liftoff.b03", "6f35ddfb", 5068],
  ["apollo-11-lander.liftoff.b04", "2d1c3f71", 5251],
  ["apollo-11-lander.seen-again.b01", "752d727f", 5486],
  ["apollo-11-lander.seen-again.b02", "f62d9853", 4284],
  ["apollo-11-lander.seen-again.b03", "f2dd3808", 4362],
  ["apollo-11-lander.seen-again.b04", "f3e49211", 4833],
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
