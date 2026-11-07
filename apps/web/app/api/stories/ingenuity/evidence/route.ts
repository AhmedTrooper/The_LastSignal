import { INGENUITY_BOOK } from "@/lib/machine-books/ingenuity";
import { INGENUITY_SOURCES, INGENUITY_RESEARCH_NOTES } from "@/lib/ingenuity-sources";
import { INGENUITY_PHOTOS, INGENUITY_ARCHIVE } from "@/lib/ingenuity-media";
export function GET() {
  return Response.json({ schemaVersion: 1, machineId: "ingenuity", reviewedOn: "2026-11-07", note: "NASA source summaries, not historical quotations. First-person narration is an imagined retelling. Future testbed capability is not evidence of current operation.", identity: { name: "Ingenuity", independentlyVerifiedCosparId: null }, sources: INGENUITY_SOURCES, chapters: INGENUITY_BOOK.chapters, images: INGENUITY_PHOTOS, archive: INGENUITY_ARCHIVE, exactAirfieldCoordinates: null, verified2026OperatingStatus: null, rejectedOrQualifiedDraftClaims: INGENUITY_RESEARCH_NOTES }, { headers: { "Content-Disposition": 'attachment; filename="ingenuity-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
