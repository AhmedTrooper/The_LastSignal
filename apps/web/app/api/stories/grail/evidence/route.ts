import { GRAIL_BOOK } from "@/lib/machine-books/grail";
import { GRAIL_SOURCES as S, GRAIL_RESEARCH_NOTES } from "@/lib/grail-sources";
import { GRAIL_PHOTOS } from "@/lib/grail-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "grail", reviewedOn: "2026-11-08",
    note: "Inspected NASA/NSSDCA/JPL/LROC source summaries. Imagined twin voice, not transmissions. Teaching drawings and signals are not measured range-rate traces, fuel telemetry or commands. The Flow orbit-insertion date conflict is retained.",
    routes: { story: "/heroes/grail/story", book: "/heroes/grail/book", narration: "/api/stories/grail/narration" },
    identity: { name: "Gravity Recovery and Interior Laboratory (GRAIL)", twinNames: "Ebb (GRAIL-A) and Flow (GRAIL-B)", cosparA: "2011-046A", cosparB: "2011-046B", noradA: 37801, noradB: 37802, source: S.registryA.url },
    spacecraft: { dryMassEachKg: 132.6, fueledMassEachKg: 202.4, source: S.registryA.url },
    catalogPositions: [
      { spacecraft: "GRAIL-A (Ebb)", latitude: 75.6088, longitudeWest: 26.5940, source: S.registryA.url },
      { spacecraft: "GRAIL-B (Flow)", latitude: 75.6508, longitudeWest: 26.8341, source: S.registryB.url },
    ],
    missionFacts: [
      { label: "Launch", value: "2011-09-10T13:08:52Z", vehicle: "Delta 7920H (D356)", site: "SLC-17B", source: S.mission.url },
      { label: "Ebb lunar orbit insertion", value: "2011-12-31", source: S.registryA.url },
      { label: "Primary science phase", value: "2012-03-07 to 2012-05-29", source: S.mission.url },
      { label: "Second science phase began", value: "2012-08-08", source: S.mission.url },
      { label: "MoonKAM images", value: 115000, qualifier: "more than", unit: "total images", source: S.impact.url },
      { label: "Ebb impact", value: "2012-12-17T22:28:51Z", speed: "about 1.68 km/s", source: S.impact.url },
      { label: "Flow impact", value: "2012-12-17T22:29:21Z", speed: "about 1.68 km/s", source: S.impact.url },
      { label: "Fuel burn Ebb", value: "4 minutes 3 seconds", source: S.impact.url },
      { label: "Fuel burn Flow", value: "5 minutes 7 seconds", source: S.impact.url },
    ],
    chronologyQualifications: { flowOrbitInsertion: [{ value: "2012-01-01", source: S.registryB.url }, { value: "2012-01-02", source: S.mission.url }] },
    findings: { rangingUnit: "range-rate (meters per second), not distance in microns", exactRangingPrecisionAsserted: null, gravityMap: "PIA16587", porosityMap: "PIA16588", crustThicknessAssertedRangeKm: "34 to 43", craterDiameterM: 5, craterEjecta: "dark and irregular (LROC caption)", currentHardwareFunctionality: null, recordedFarewellWords: null },
    sources: S, chapters: GRAIL_BOOK.chapters, images: GRAIL_PHOTOS,
    rejectedOrQualifiedDraftClaims: GRAIL_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="grail-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
