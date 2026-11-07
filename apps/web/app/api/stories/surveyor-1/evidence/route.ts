import { SURVEYOR_BOOK } from "@/lib/machine-books/surveyor";
import { SURVEYOR_SOURCES as S, SURVEYOR_POSITION, SURVEYOR_RESEARCH_NOTES } from "@/lib/surveyor-sources";
import { SURVEYOR_PHOTOS, SURVEYOR_ARCHIVE } from "@/lib/surveyor-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "surveyor-1", reviewedOn: "2026-11-08",
    note: "NASA summaries and original records, with official LROC instrument-team sources. First-person voice is an imagined retelling, not a spacecraft transmission. Diagrams and interactive models are not measured telemetry.",
    routes: { story: "/heroes/surveyor-1/story", book: "/heroes/surveyor-1/book", narration: "/api/stories/surveyor-1/narration" },
    identity: { name: "Surveyor 1", hardwareDesignation: "Surveyor-A", cosparId: "1966-045A", source: S.registry.url, independentlyVerifiedSatcatId: null },
    missionFacts: [
      { label: "Launch", value: "1966-05-30", source: S.mission.url },
      { label: "Lunar landing", value: "1966-06-02", source: S.mission.url },
      { label: "Launch mass", value: 995.2, unit: "kg", source: S.registry.url },
      { label: "Landed mass", value: 294.3, unit: "kg", source: S.registry.url },
      { label: "Footpad contact span", value: 19, unit: "ms", source: S.landing.url },
      { label: "July 1966 picture count", value: 11150, firstLunarDay: 10338, secondLunarDay: 812, source: S.extended.url },
      { label: "Later NASA picture count", value: 11240, firstLunarDay: 10622, secondLunarDay: 618, source: S.history.url },
      { label: "Last engineering contact", value: "1967-01-07", source: S.registry.url },
    ],
    publishedPositionEstimate: SURVEYOR_POSITION, verifiedDebrisCoordinates: null, exactStaticBearingCapacity: null,
    exactAntennaReleaseTime: null, recordedFarewellWords: null,
    sources: S, chapters: SURVEYOR_BOOK.chapters, images: SURVEYOR_PHOTOS, archive: SURVEYOR_ARCHIVE,
    rejectedOrQualifiedDraftClaims: SURVEYOR_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="surveyor-1-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
