import { SPREADS, type BookSpread } from "@thelastsignal/data";
import { EAGLE_MEMORIES } from "./eagle-story";

/** Web presentation only: keep Apollo's book pages aligned with the checked story record. */
export const BOOK_SPREADS: BookSpread[] = SPREADS.map(spread => {
  if (spread.id === "apollo-11-part-1") {
    const alarm = EAGLE_MEMORIES.find(memory => memory.id === "alarm")!;
    const landing = EAGLE_MEMORIES.find(memory => memory.id === "touchdown")!;
    return {
      ...spread,
      telemetrySummary: landing.telemetry.map(({ label, value }) => ({ label, value })),
      leftPage: { heading: "A warning. Not the end.", subheading: "The guidance computer keeps the landing alive", paragraphs: alarm.speech, calloutBox: { title: "What the software protected", text: alarm.detail.text } },
      rightPage: { heading: "A place to put my feet.", subheading: "Beyond the boulder field", paragraphs: landing.speech, takeaway: "The landing depended on software, human judgment, and hardware working together." },
    };
  }
  if (spread.id === "apollo-11-part-2") {
    const science = EAGLE_MEMORIES.find(memory => memory.id === "science")!;
    const ascent = EAGLE_MEMORIES.find(memory => memory.id === "liftoff")!;
    return {
      ...spread,
      leftPage: { heading: "My last job was to stay.", subheading: "One machine. Two endings.", paragraphs: ascent.speech, calloutBox: { title: "A launch pad on the Moon", text: ascent.detail.text } },
      rightPage: { heading: "Left behind. Still useful.", subheading: "A small instrument. A long experiment.", paragraphs: science.speech, takeaway: "Passive corner cubes return incoming light without a battery. Repeated observations turn those returns into science." },
    };
  }
  return spread;
});
