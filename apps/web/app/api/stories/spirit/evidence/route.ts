import { SPIRIT_BOOK } from "@/lib/machine-books/spirit";
import { SPIRIT_SOURCES as S, SPIRIT_RESEARCH_NOTES } from "@/lib/spirit-sources";
import { SPIRIT_PHOTOS, SPIRIT_ARCHIVE, SPIRIT_MODEL } from "@/lib/spirit-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "spirit", reviewedOn: "2026-11-08",
    note: "NASA source summaries and original mission data links. First-person prose is an imagined retelling, not a rover transmission. HiRISE’s University of Arizona site is the official NASA instrument-team source. Teaching diagrams are not measured telemetry.",
    routes: { story: "/heroes/spirit/story", book: "/heroes/spirit/book", narration: "/api/stories/spirit/narration" },
    identity: { name: "Spirit", hardwareDesignation: "Mars Exploration Rover A / MER-2", cosparId: "2003-027A", source: S.registry.url, independentlyVerifiedSatcatId: null },
    missionFacts: [
      { label: "Rover mass", value: 185, unit: "kg", source: S.registry.url },
      { label: "Planned prime mission", value: 90, unit: "sols", source: S.endReport.url },
      { label: "Last communication", value: "2010-03-22", sol: 2210, source: S.endReport.url },
      { label: "Public mission completion", value: "2011-05-25", source: S.mission.url },
      { label: "Technical report recovery-command period", start: "2010-07-27", end: "2011-07-13", commands: 1411, source: S.endReport.url },
      { label: "Accumulated drive distance", value: 7730.50, unit: "m", scope: "Report appendix, printed page 24", source: S.endReport.url },
      { label: "Total source images", value: 124839, scope: "Report appendix, printed page 28; Sols 1–2210", source: S.endReport.url },
    ],
    preciseLandmarkCoordinates: null, measuredFinalInternalTemperature: null, recordedFarewellWords: null,
    sources: S, chapters: SPIRIT_BOOK.chapters, images: SPIRIT_PHOTOS, archive: SPIRIT_ARCHIVE, model: SPIRIT_MODEL,
    rejectedOrQualifiedDraftClaims: SPIRIT_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="spirit-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
