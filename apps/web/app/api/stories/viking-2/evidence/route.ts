import { VIKING_TWO_BOOK } from "@/lib/machine-books/viking-two";
import { VIKING_TWO_SOURCES as S, VIKING_TWO_RESEARCH_NOTES } from "@/lib/viking-two-sources";
import { VIKING_TWO_PHOTOS } from "@/lib/viking-two-media";

export function GET() {
  return Response.json({
    schemaVersion: 1, machineId: "viking-2", reviewedOn: "2026-11-08",
    note: "Inspected NASA source summaries. Imagined machine thoughts, not transmissions. Teaching signals and controls are not measured waveforms, temperatures or commands. Conflicting source dates and model-dependent interpretations remain attributed.",
    routes: { story: "/heroes/viking-2/story", book: "/heroes/viking-2/book", narration: "/api/stories/viking-2/narration" },
    identity: { name: "Viking 2 Lander", memorialName: "Gerald Soffen Memorial Station", cosparId: "1975-083C", catalogAlias: "09408", source: S.registry.url },
    catalogPosition: { latitude: 47.6673, longitudeEast: 134.2809, referenceFrame: "not explicitly labelled on this catalog page", source: S.registry.url, independentlyVerifiedArtifactCoordinatesAndMolaElevations: null },
    missionFacts: [
      { label: "Launch", value: "1975-09-09T18:39:00Z", source: S.mission.url },
      { label: "Landing", value: "1976-09-03", source: S.mission.url },
      { label: "Surface operation", value: 1281, unit: "Mars days", source: S.registry.url },
      { label: "Rock-pushing photograph", value: "PIA00528", rockNameInCaption: "Mister Badger", actionDate: "1976-10-08", plannedSamplingDate: "1976-10-11", source: S.rock.url },
      { label: "Quiet-period seismic data", value: 2100, qualifier: "more than", unit: "hours", source: S.seismicReport.url },
      { label: "Frost photograph", value: "PIA00571", exposureDate: "1979-05-18", earthRelayDate: "1979-06-07", cameraMetadata: "Camera 1", source: S.frost.url },
      { label: "Memorial renaming", value: "2001-07", source: S.mission.url },
      { label: "HiRISE acquisition", value: "2006-11-21", imageId: "PSP_001501_2280", originalScaleCmPerPixel: 31, mapProjectedScaleCmPerPixel: 25, source: S.hirise.url },
    ],
    chronologyQualifications: {
      separation: [{ value: "19:39:59 UT", source: S.registry.url }, { value: "20:19 UT", source: S.mission.url }],
      landingTimes: [{ value: "22:37:50 UT", source: S.mission.url }, { value: "22:58:20 UT", source: S.registry.url }],
      batteryFailureOrMissionEnd: [{ value: "1980-04-11", source: S.registry.url }, { value: "1980-04-12", source: S.mission.url }],
      tiltDegrees: [{ value: 8.2, source: S.registry.url }, { value: 8.5, direction: "west", source: S.mission.url }],
    },
    findings: { confirmedSol80Marsquake: false, sol80Interpretation: "Natural seismic event and wind gust remain possible", directlyMeasuredSol80MagnitudeAndDistance: null, frostFormation: "Attributed proposed mechanism; residue includes water and dust", guaranteedPureIce: null, currentHardwareFunctionality: null, landerOrbitalIdentification: "confirmed by topographic comparison", entryHardwareIdentifications: "candidate/likely", recordedFarewellWords: null },
    sources: S, chapters: VIKING_TWO_BOOK.chapters, images: VIKING_TWO_PHOTOS,
    rejectedOrQualifiedDraftClaims: VIKING_TWO_RESEARCH_NOTES,
  }, { headers: { "Content-Disposition": 'attachment; filename="viking-2-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
