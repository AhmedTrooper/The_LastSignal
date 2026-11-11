/** Provenance for the two new rover editions. Values are transcribed, not reconstructed telemetry. */
export type RoverSource = { title: string; url: string; locator: string; evidence: string };
export type RoverFact = { id: string; label: string; value: string | number | null; unit?: string; source: string; locator: string; note: string; status: "documented" | "reported" | "unknown" };
export function roverFact(id: string, label: string, value: RoverFact["value"], source: RoverSource, note: string, unit?: string): RoverFact {
  return { id, label, value, unit, source: source.url, locator: source.locator, note, status: value === null ? "unknown" : "documented" };
}
export const ROVER_EVIDENCE_NOTE = "NASA-owned sources only. First-person text is a source-backed retelling, not original spacecraft speech. SVGs and interactions are simplified teaching illustrations, not engineering reconstructions or measured telemetry. Unknown values remain null.";
