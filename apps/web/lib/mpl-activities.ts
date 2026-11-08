import { MPL_SOURCES as S } from "./mpl-sources";
import type { MplScene } from "./mpl-scenes";

type Investigation = { title: string; source: string; options: { label: string; scene: MplScene; explanation: string }[] };
export const MPL_INVESTIGATIONS: Record<string, Investigation> = {
  "carrying-names-and-a-microphone": { title: "Designed to be silent during descent?", source: S.registry.url, options: [
    { label: "Live descent radio", scene: "microphone", explanation: "A live descent link would have revealed the spacecraft state in real time, but MPL was not built to transmit through entry. Later missions changed that practice." },
    { label: "Polar target", scene: "target", explanation: "The target was southern polar layered terrain. The choice traded equatorial convenience for direct access to polar ice and climate layers." },
    { label: "Microphone cargo", scene: "microphone", explanation: "The microphone was an education and outreach attempt to hear Mars. It never transmitted surface sounds because the lander was lost during descent." },
  ] },
  "amundsen-and-scott": { title: "How does a probe land without a parachute?", source: S.ds2.url, options: [
    { label: "Parachute and rockets", scene: "drop", explanation: "Deep Space 2 had neither. It was a passive penetrator designed to survive hard impact rather than avoid it." },
    { label: "Shatter and split", scene: "shatter", explanation: "The ceramic aeroshell shatters on impact while the aftbody stays near the surface and the forebody penetrates. The drawing exaggerates the split for teaching." },
    { label: "Underground drill", scene: "drill", explanation: "The forebody carried a small drill and water-vapor test. No data were received, so the intended measurement remains unproven." },
  ] },
  "the-fatal-latch": { title: "Correct sensor, wrong moment.", source: S.hallLesson.url, options: [
    { label: "At leg deployment", scene: "snap", explanation: "Unfolding the legs in the air could briefly trip the touchdown sensors. That transient had to be ignored before terminal descent." },
    { label: "At touchdown check", scene: "cutoff", explanation: "When the computer later trusted the sensor state, an old landed signal could read as present tense. Timing made a true hardware signal misleading." },
    { label: "Live telemetry", scene: "silence", explanation: "With no descent telemetry, Earth could not see the hidden state. Later missions treated live descent data as essential evidence." },
  ] },
  "searching-the-ice": { title: "Why is the lander still missing?", source: S.searchMosaic.url, options: [
    { label: "No search", scene: "search", explanation: "There was extensive orbital imaging, including MGS and later HiRISE. The challenge is scale, dust, frost and seasonal change." },
    { label: "Bright dot", scene: "frost", explanation: "A bright orbital speck was later shown to change with the season and interpreted as frost, not a parachute." },
    { label: "HiRISE resolution", scene: "hirise", explanation: "Later HiRISE images are sharper than MGS, but the hardware is small, dusty and covered by seasonal ice, so identification remains difficult." },
  ] },
};

export type MplLatchState = "descent" | "deployed" | "latched" | "cleared";
export type MplLatchAction = "deploy" | "latch" | "clear" | "reset";
export function mplLatchStep(state: MplLatchState, action: MplLatchAction): MplLatchState {
  if (action === "reset") return "descent";
  if (state === "descent" && action === "deploy") return "deployed";
  if (state === "deployed" && action === "latch") return "latched";
  if (state === "latched" && action === "clear") return "cleared";
  return state;
}
export const MPL_LATCH: Record<MplLatchState, { scene: MplScene; explanation: string }> = {
  descent: { scene: "descent", explanation: "Under the parachute, the computer is still in flight. A touchdown signal now would be premature." },
  deployed: { scene: "snap", explanation: "The legs unfold and the mechanical motion can briefly trip the magnetic touchdown sensors." },
  latched: { scene: "latch", explanation: "For teaching, the transient is shown as a latched flag. The real lesson is that the deployment signal must not survive into the touchdown check." },
  cleared: { scene: "cutoff", explanation: "If the software clears the deployment transient before the touchdown check, a later engine shutdown can only follow a real contact signal." },
};

export type MplTelemetryState = "silent" | "heartbeat" | "landed";
export type MplTelemetryAction = "enable" | "descend" | "reset";
export function mplTelemetryStep(state: MplTelemetryState, action: MplTelemetryAction): MplTelemetryState {
  if (action === "reset") return "silent";
  if (state === "silent" && action === "enable") return "heartbeat";
  if (state === "heartbeat" && action === "descend") return "landed";
  return state;
}
export const MPL_TELEMETRY: Record<MplTelemetryState, { scene: MplScene; explanation: string }> = {
  silent: { scene: "silence", explanation: "MPL sent no descent telemetry, so Earth could not see the hidden sensor state during the highest-risk minutes." },
  heartbeat: { scene: "rules", explanation: "Later missions treat continuous descent telemetry as a requirement, so engineers can see alarms and state changes as they happen." },
  landed: { scene: "reborn", explanation: "With live tones and integrated testing, later landers could confirm touchdown and diagnose problems instead of searching in silence." },
};
