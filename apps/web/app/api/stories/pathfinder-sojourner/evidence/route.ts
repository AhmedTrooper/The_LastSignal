import { PATHFINDER_BOOK } from "@/lib/machine-books/pathfinder-sojourner";
import { PATHFINDER_SOURCES, PATHFINDER_FACTS, PATHFINDER_POSITION, PATHFINDER_RESEARCH_NOTES } from "@/lib/pathfinder-sources";
import { PATHFINDER_PHOTOS, PATHFINDER_RESOURCES } from "@/lib/pathfinder-media";
import { PATHFINDER_THOUGHTS } from "@/lib/pathfinder-thoughts";
import { ROVER_EVIDENCE_NOTE } from "@/lib/rover-research";

export function GET() {
  return Response.json({ schemaVersion: 1, machineId: PATHFINDER_BOOK.slug, reviewedOn: "2026-11-11", note: ROVER_EVIDENCE_NOTE,
    identity: { landerName: "Mars Pathfinder / Carl Sagan Memorial Station", roverName: "Sojourner", landerCosparId: "1996-068A", independentlyVerifiedRoverCosparId: null, independentlyVerifiedSatcatId: null, source: PATHFINDER_SOURCES.catalog.url },
    facts: PATHFINDER_FACTS, position: PATHFINDER_POSITION, sources: PATHFINDER_SOURCES, chapters: PATHFINDER_BOOK.chapters,
    moments: PATHFINDER_THOUGHTS, photographs: PATHFINDER_PHOTOS, resources: PATHFINDER_RESOURCES, researchNotes: PATHFINDER_RESEARCH_NOTES,
    unknowns: { provenCommunicationLossCause: null, exactFinalRoverMovement: null, exactFinalRoverCoordinates: null, currentElectronicHealth: null, recordedMachineFarewell: null },
    narration: { producedClips: 0, originalMachineSpeech: null, note: "No Mars microphone recording or spoken machine message is asserted. The reader's voice preview is synthetic." },
  }, { headers: { "Content-Disposition": 'attachment; filename="pathfinder-sojourner-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
