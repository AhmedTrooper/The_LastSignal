import { VIKING_BOOK } from "@/lib/machine-books/viking";
import { VIKING_SOURCES as S, VIKING_RESEARCH_NOTES } from "@/lib/viking-sources";
import { VIKING_PHOTOS } from "@/lib/viking-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "viking-1", reviewedOn: "2026-11-08",
    note: "Inspected NASA/JPL records and official HiRISE instrument-team captions. First-person voice is imagined, not a transmission. Teaching controls and drawings do not reproduce measured telemetry, exact flight memory addresses or executable commands.",
    routes: { story: "/heroes/viking-1/story", book: "/heroes/viking-1/book", narration: "/api/stories/viking-1/narration" },
    identity: { name: "Viking 1 Lander", memorialName: "Thomas Mutch Memorial Station", cosparId: "1975-075C", catalogAlias: "09024", source: S.registry.url },
    coordinates: { latitude: 22.27, longitudeEast: 312.05, referenceFrame: "planetocentric", qualifier: "approximate NSSDCA landing location; not HiRISE image-center metadata", source: S.registry.url, independentlyVerifiedFourDecimalArtifactPositions: null, independentlyVerifiedMolaElevations: null },
    missionFacts: [
      { label: "Launch", value: "1975-08-20T21:22:00Z", source: S.mission.url },
      { label: "Touchdown", value: "1976-07-20T11:53:06Z", source: S.registry.url },
      { label: "First image transmission began", value: 25, unit: "seconds after landing", source: S.registry.url },
      { label: "First photograph footpad", value: 2, imageId: "PIA00381", source: S.firstPhoto.url },
      { label: "First soil sampling", value: "1976-07-28", source: S.mission.url },
      { label: "Reported surface endurance", value: 2245, unit: "Martian sols", source: S.launchHistory.url },
      { label: "Nominal power in catalog table", value: 70, unit: "W total", qualifier: "nominal; catalog prose separately gives 30 W per RTG", source: S.registry.url },
      { label: "First HiRISE frame acquisition", value: "2006-11-22", imageId: "PSP_001521_2025", originalScaleCmPerPixel: 30.3, mapProjectedScaleCmPerPixel: 25, source: S.hirise.url },
      { label: "Stereo frame acquisition", value: "2006-12-08", imageId: "PSP_001719_2025", originalScaleCmPerPixel: 28.8, mapProjectedScaleCmPerPixel: 25, source: S.stereo.url },
      { label: "Opportunity surpassed endurance record", value: "2010-05-19", source: S.landingHistory.url },
    ],
    chronologyQualifications: {
      finalTransmissionOrOperations: { value: "1982-11-11", source: S.mission.url },
      catalogContactLoss: { value: "1982-11-13", source: S.registry.url },
      reportBatteryChangeCommand: { value: "1982-11-19", source: S.monitor.url },
      reportEmergency: { value: "1982-11-20", source: S.monitor.url },
      reportRecoveryEnd: { value: "1983-03", source: S.monitor.url },
      memorialRenaming: [{ value: "1981-01", source: S.registry.url }, { value: "1982-01", source: S.mission.url }],
    },
    findings: { definitiveLifeDetection: false, perchlorateReanalysis: "Hypothesis about heating and organic analysis; not a complete resolution of all biology tests", landerOrbitalIdentification: "confirmed by topographic comparison", entryHardwareIdentifications: "candidate/likely", currentHardwareFunctionality: null, measuredAntennaMotionDate: null, guaranteedZeroEarthMicrobes: null, recordedFarewellWords: null },
    sources: S, chapters: VIKING_BOOK.chapters, images: VIKING_PHOTOS,
    rejectedOrQualifiedDraftClaims: VIKING_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="viking-1-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
