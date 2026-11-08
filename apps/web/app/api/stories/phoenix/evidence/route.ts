import { PHOENIX_BOOK } from "@/lib/machine-books/phoenix";
import { PHOENIX_SOURCES as S, PHOENIX_RESEARCH_NOTES } from "@/lib/phoenix-sources";
import { PHOENIX_PHOTOS } from "@/lib/phoenix-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "phoenix", reviewedOn: "2026-11-08",
    note: "Inspected NASA/NSSDCA/JPL/HiRISE source summaries. Imagined lander voice, not transmissions. Teaching drawings and sequences are not recovered telemetry, laboratory traces or commands. Spacecraft and Earth-received touchdown clocks are kept distinct.",
    routes: { story: "/heroes/phoenix/story", book: "/heroes/phoenix/book", narration: "/api/stories/phoenix/narration" },
    identity: { name: "Phoenix Mars Lander", cosparId: "2007-034A", noradId: 32003, source: S.registry.url },
    catalogPosition: { latitude: 68.22, longitudeEast: 234.25, referenceFrame: "NASA Science landing-site caption", source: S.mission.url, independentlyVerifiedArtifactCoordinates: null },
    missionFacts: [
      { label: "Launch", value: "2007-08-04T09:26:34Z", vehicle: "Delta II", site: "Cape Canaveral", source: S.registry.url },
      { label: "Touchdown (spacecraft time)", value: "2008-05-25T23:38:38Z", source: S.mission.url },
      { label: "Touchdown (Earth-received)", value: "2008-05-25T23:53:44Z", source: S.registry.url },
      { label: "Science payload mass", value: 55, unit: "kg", source: S.registry.url },
      { label: "Last signal", value: "2008-11-02", source: S.registry.url },
      { label: "Water confirmation", value: "2008-07-31", source: S.water.url },
      { label: "Snow detection height", value: "about 2.5", unit: "miles (4 km)", source: S.snowSoil.url },
      { label: "After-winter HiRISE", value: "2010-05-07", imageId: "ESP_017716_2485", source: S.afterWinter.url },
    ],
    chronologyQualifications: { touchdownClocks: [{ value: "23:38:38 UT spacecraft time", source: S.mission.url }, { value: "23:53:44 UT Earth-received time", source: S.registry.url }] },
    findings: { waterIceConfirmedByTega: true, soilCalciumCarbonateEvidence: true, perchlorateDetected: true, exactPhAsserted: null, exactPerchloratePercentAsserted: null, snowReachedGround: false, currentHardwareFunctionality: null, recordedFarewellWords: null, westPanelCollapseInterpretation: "likely collapse under winter CO2 frost (HiRISE shadow interpretation)" },
    sources: S, chapters: PHOENIX_BOOK.chapters, images: PHOENIX_PHOTOS,
    rejectedOrQualifiedDraftClaims: PHOENIX_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="phoenix-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
