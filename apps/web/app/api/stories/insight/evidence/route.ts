import { INSIGHT_SOURCES, INSIGHT_RESEARCH_NOTES } from "@/lib/insight-sources";
import { INSIGHT_BOOK } from "@/lib/machine-books/insight";
import { INSIGHT_PHOTOS, INSIGHT_ARCHIVE_VIDEO } from "@/lib/insight-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "insight", reviewedOn: "2026-11-07",
    note: "NASA source summaries and locators, not verbatim historical quotations. Story text is a labelled imagined retelling. Omitted draft claims are not verified telemetry.",
    identity: { name: "InSight", cosparId: "2018-042A", source: INSIGHT_SOURCES.registry.url },
    sources: INSIGHT_SOURCES, chapters: INSIGHT_BOOK.chapters, images: INSIGHT_PHOTOS, archiveVideo: INSIGHT_ARCHIVE_VIDEO,
    exactComponentCoordinates: null, currentReflectorStatus: null, rejectedOrQualifiedDraftClaims: INSIGHT_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="insight-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
