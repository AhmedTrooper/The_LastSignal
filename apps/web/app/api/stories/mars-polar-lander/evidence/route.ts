import { MPL_BOOK } from "@/lib/machine-books/mars-polar-lander";
import { MPL_SOURCES as S, MPL_RESEARCH_NOTES } from "@/lib/mpl-sources";
import { MPL_PHOTOS } from "@/lib/mpl-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "mars-polar-lander", reviewedOn: "2026-11-08",
    note: "Inspected NASA/NSSDCA/JPL/HiRISE source summaries. Imagined lander voice, not transmissions. Teaching drawings and sequences are not recovered telemetry, executable procedures or a found-spacecraft claim. Descent reconstruction follows the investigation finding in qualified form.",
    routes: { story: "/heroes/mars-polar-lander/story", book: "/heroes/mars-polar-lander/book", narration: "/api/stories/mars-polar-lander/narration" },
    identity: { name: "Mars Polar Lander", cosparId: "1999-001A", noradId: 25605, microprobes: "Deep Space 2 Amundsen and Scott", source: S.registry.url },
    catalogPosition: { latitude: -76, longitudeEast: 165, referenceFrame: "target landing zone (NSSDCA: 76 S, 195 W)", source: S.registry.url, independentlyVerifiedArtifactPosition: null },
    spacecraft: { dryMassKg: 290, totalProfileMassKg: 583, source: S.registry.url },
    missionFacts: [
      { label: "Launch", value: "1999-01-03T20:21:10Z", vehicle: "Delta 7425", site: "Cape Canaveral", source: S.registry.url },
      { label: "Last telemetry", value: "1999-12-03 (just before atmospheric entry)", source: S.registry.url },
      { label: "Contact attempts terminated", value: "2000-01-17", source: S.mission.url },
      { label: "Lander mass", value: 290, unit: "kg", source: S.registry.url },
      { label: "Descent propulsion", value: "12 engines (three groups of four, 266 N each)", source: S.registry.url },
      { label: "Deep Space 2 mass each", value: 3.572, unit: "kg", source: S.ds2.url },
      { label: "Deep Space 2 impact design", value: "160 to 200 m/s", penetration: "0.3 to 1 m", source: S.ds2.url },
    ],
    findings: { falseLandedSignalFinding: true, directlyObservedDescentTelemetry: false, spacecraftPositivelyLocated: false, exactImpactVelocityAsserted: null, exactPeakGAsserted: null, currentHardwareFunctionality: null, recordedFarewellWords: null },
    sources: S, chapters: MPL_BOOK.chapters, images: MPL_PHOTOS,
    rejectedOrQualifiedDraftClaims: MPL_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="mars-polar-lander-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
