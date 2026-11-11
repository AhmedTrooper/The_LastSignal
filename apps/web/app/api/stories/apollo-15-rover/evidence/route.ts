import { LRV_BOOK } from "@/lib/machine-books/apollo-15-rover";
import { LRV_SOURCES, LRV_FACTS, LRV_POSITION, LRV_RESEARCH_NOTES } from "@/lib/lrv-sources";
import { LRV_PHOTOS, LRV_RESOURCES } from "@/lib/lrv-media";
import { LRV_THOUGHTS } from "@/lib/lrv-thoughts";
import { ROVER_EVIDENCE_NOTE } from "@/lib/rover-research";

export function GET() {
  return Response.json({ schemaVersion: 1, machineId: LRV_BOOK.slug, reviewedOn: "2026-11-11", note: ROVER_EVIDENCE_NOTE,
    identity: { name: "Apollo 15 Lunar Roving Vehicle", parentMissionCosparId: "1971-063C", parentIdAppliesTo: "Falcon lunar module / ALSEP", independentlyVerifiedRoverCosparId: null, independentlyVerifiedRoverSatcatId: null, source: LRV_SOURCES.catalog.url },
    facts: LRV_FACTS, position: LRV_POSITION, sources: LRV_SOURCES, chapters: LRV_BOOK.chapters,
    moments: LRV_THOUGHTS, photographs: LRV_PHOTOS, resources: LRV_RESOURCES, researchNotes: LRV_RESEARCH_NOTES,
    unknowns: { exactRoverParkingCoordinates: null, currentElectronicHealth: null, exactFinalRadioTime: null, recordedMachineFarewell: null },
    narration: { producedClips: 0, originalMachineSpeech: null, note: "Reader preview is synthetic. Historical sound is available in the NASA-linked video; it is not the machine's voice." },
  }, { headers: { "Content-Disposition": 'attachment; filename="apollo-15-rover-nasa-evidence.json"', "Cache-Control": "no-cache" } });
}
