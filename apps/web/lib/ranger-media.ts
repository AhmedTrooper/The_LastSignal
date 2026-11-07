import type { Photo } from "./photos";
import { photo } from "./photos";
import { RANGER_7_MISSION, getLpiBrowseUrl, getLpiMetaUrl } from "./ranger-dive";

/** Real archive frames used by the Ranger 7 cloud edition. No generated image is presented as a mission photograph. */
export const RANGER_PHOTOS = {
  cover: photo("nasa/PIA23520", "Ranger 7 in the JPL cleanroom"),
  firstImage: photo("nasa/PIA02975", "The first close-up image of the Moon taken by a U.S. spacecraft"),
  guericke: photo("nasa/PIA02974", "Guericke Crater as seen by Ranger 7"),
  finalFrame: {
    name: "lpi-ranger-7-p200",
    title: "Ranger 7’s final transmission, cut off by impact",
    alt: "The last Ranger 7 partial-scan frame: lunar surface on the left, horizontal receiver static cutting through the right side.",
    src: getLpiBrowseUrl("P", 200),
    source: getLpiMetaUrl("P", 200),
    credit: "NASA/JPL/LPI",
    ai: false,
  } satisfies Photo,
  crater: {
    name: "lroc-m153014430l",
    title: "Ranger 7’s impact crater from lunar orbit",
    alt: "LROC view of the bright 14-meter crater left by Ranger 7 in Mare Cognitum.",
    src: RANGER_7_MISSION.crater.lrocImageUrl,
    source: RANGER_7_MISSION.crater.lrocAnalysisUrl,
    credit: "NASA/GSFC/Arizona State University",
    ai: false,
  } satisfies Photo,
} as const;
