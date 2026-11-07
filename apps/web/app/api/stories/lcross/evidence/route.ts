import { LCROSS_BOOK } from "@/lib/machine-books/lcross";
import { LCROSS_SOURCES as S, LCROSS_RESEARCH_NOTES } from "@/lib/lcross-sources";
import { LCROSS_PHOTOS, LCROSS_ARCHIVE } from "@/lib/lcross-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "lcross", reviewedOn: "2026-11-08",
    note: "NASA source summaries and the NASA-coauthored LPI instrument-team abstract. First-person voice is an imagined retelling, not a spacecraft transmission. NASA artist’s concepts and SVS data visualizations are not mission photographs.",
    routes: { story: "/heroes/lcross/story", book: "/heroes/lcross/book", narration: "/api/stories/lcross/narration" },
    identity: { name: "LCROSS", fullName: "Lunar Crater Observation and Sensing Satellite", cosparId: "2009-031B", source: S.registry.url, independentlyVerifiedCentaurCosparId: null, independentlyVerifiedSatcatIds: null },
    missionFacts: [
      { label: "Launch", value: "2009-06-18", source: S.mission.url },
      { label: "Final impacts", value: "2009-10-09", source: S.registry.url },
      { label: "Science instruments", value: 9, cameras: 5, spectrometers: 3, photometer: 1, source: S.overview.url },
      { label: "Mission-summary propellant loss", value: 140, unit: "kg", source: S.mission.url },
      { label: "Technical report propellant loss", value: 152, qualifier: "nearly", unit: "kg", initialRemainingKg: 202, source: S.operations.url },
      { label: "Local water estimate", value: 5.6, uncertaintyPercentagePoints: 2.9, unit: "percent by mass", scope: "Regolith at the LCROSS impact site in Cabeus", source: S.water.url },
      { label: "Later Centaur crater estimate", value: 22, qualifier: "approximately; likely crater identification", unit: "m diameter", source: S.laterCrater.url },
    ],
    verifiedTwinCraterCoordinates: null, uniformSouthPoleWaterConcentration: null, guaranteedResourceExtractionYield: null, recordedFarewellWords: null,
    sources: S, chapters: LCROSS_BOOK.chapters, images: LCROSS_PHOTOS, archive: LCROSS_ARCHIVE,
    rejectedOrQualifiedDraftClaims: LCROSS_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="lcross-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
