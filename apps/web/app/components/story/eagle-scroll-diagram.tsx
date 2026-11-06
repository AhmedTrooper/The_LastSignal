import { useId } from "react";
import type { EagleScrollDiagram } from "@/lib/eagle-scroll";

function Lander({ raised = false, camera = false }: { raised?: boolean; camera?: boolean }) {
  return <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none">
    <g className="es-ascent-stage" style={{ transform: raised ? "translateY(-112px)" : "translateY(0)" }}>
      <path d="m302 163 85-6 36 44-12 65-123 2-17-56z" fill="#c4c1b3" /><path d="m297 188 34-2-5 33-36 2m64-35 33-3 10 35-42-1" fill="#232729" /><path d="m331 269-10 24h55l-12-25" fill="#4b4540" />
      <path d="m372 159 22-38m-24-13q28 37 65 2z" fill="#c4c1b3" />
      {raised && <path d="m329 298 17 45 21-45" stroke="#e0b973" />}
    </g>
    <path d="m278 300 137-9 27 62-154 12-19-34z" fill="#9e8050" /><path d="m290 315 117-9m-113 30 123-10m-99-24-7 57m65-61 13 57" stroke="#d3b580" />
    <path d="m284 341-72 97m213-99 66 94m-165-70-19 79m77-83 23 80" strokeWidth="4" />
    <path d="M189 442h48m233-5h48m-236 7h43m66-1h48" strokeWidth="5" /><path d="m317 328-22 93m12-47 15 2m-12-14 15 2m-8-15 15 2m-32 36 15 3m-19 10 15 3" />
    {camera && <g><path d="m276 333-61 20 13 32 64-24z" fill="#a28b64" /><rect x="227" y="333" width="37" height="24" fill="#bdc2bd" /><path d="m227 341-18-9v31l18-12" fill="#373d3b" /></g>}
  </g>;
}

/** Scroll-driven explanatory diagrams, never scene-matched telemetry. */
export default function EagleScrollDiagram({ kind, beat, stage = false }: { kind: EagleScrollDiagram; beat: number; stage?: boolean }) {
  const id = useId().replaceAll(":", "");
  const late = beat >= 2;
  return <svg viewBox="0 0 720 520" className={`es-diagram es-diagram-${kind}`} role="img" aria-label={`Illustrated ${kind.replaceAll("-", " ")} mechanism, stage ${beat + 1} of the chapter`}>
    <defs><pattern id={`${id}-grid`} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" stroke="currentColor" opacity=".08" fill="none" /></pattern></defs>
    {!stage && <path d="M0 0h720v520H0z" fill={`url(#${id}-grid)`} />}
    {kind === "guidance" ? <>
      <text x="55" y="95" className="es-diagram-label">APOLLO GUIDANCE COMPUTER</text>
      <text x="47" y="248" className="es-alarm-number">1202</text>
      <text x="57" y="289" className="es-diagram-label">EXECUTIVE OVERFLOW</text>
      <path d="M57 320h606" stroke="currentColor" opacity=".35" />
      <text x="57" y="357" className="es-diagram-label">GUIDANCE</text><rect x="280" y="340" width="366" height="18" fill="#b7c8ad" />
      <text x="57" y="405" className="es-diagram-label">SECONDARY WORK</text><rect className="es-work-bar" x="280" y="388" width={beat ? 92 : 366} height="18" fill="#a98dc2" />
      <text x="57" y="468" className="es-diagram-note">{beat === 0 ? "More work than the computer could handle." : beat === 1 ? "Essential tasks protected. Other work set aside." : "Houston assessed the recovery. The landing continued."}</text>
    </> : kind === "laser" ? <>
      <circle cx="122" cy="241" r="73" stroke="#b2c1c0" strokeWidth="2" fill="#384e54" /><path d="m111 172-27 49 45 22 5 53 43-43-9-55z" fill="#7faaa0" />
      <rect x="510" y="177" width="136" height="136" stroke="#d5b77d" fill="#303037" />{Array.from({ length: 100 }, (_, i) => <circle key={i} cx={520 + i % 10 * 12.9} cy={187 + Math.floor(i / 10) * 12.9} r="3.3" fill={late ? "#e2d7f2" : "#aaaab5"} />)}
      <path className="es-laser-path" d={late ? "M200 226h299v34H200" : "M200 226h299"} fill="none" stroke="#d1c1ed" strokeWidth="3" /><path d="m486 219 13 7-13 7" fill="none" stroke="#d1c1ed" strokeWidth="2" />{late && <path d="m213 253-13 7 13 7" fill="none" stroke="#d1c1ed" strokeWidth="2" />}
      <text x="64" y="360" className="es-diagram-label">EARTH</text><text x="504" y="360" className="es-diagram-label">100 CORNER CUBES</text>
      <text x="61" y="445" className="es-diagram-note">{beat < 2 ? "An observatory supplies the light." : "Light returns toward the place it came from."}</text>
    </> : kind === "breaker" ? <>
      <text x="59" y="96" className="es-diagram-label">ENGINE ARM / PANEL 16</text><rect x="85" y="141" width="550" height="265" rx="6" stroke="currentColor" fill="none" opacity=".65" />
      <path d="M121 275h188m104 0h181" stroke={late ? "#d1c1ed" : "#736c76"} strokeWidth="4" /><circle cx="309" cy="275" r="7" fill="currentColor" /><circle cx="413" cy="275" r="7" fill="currentColor" />
      <path className="es-breaker-switch" d={late ? "M309 275h104" : "M309 275l100-50"} stroke="#ddd3c6" strokeWidth="7" fill="none" />
      {late ? <g><path d="M249 353h174l24 8-24 8H249z" fill="#a48abf" stroke="currentColor" /><text x="239" y="447" className="es-diagram-note">A pen operates the damaged control.</text></g> : <><path d="m474 362 28-11 14 12-29 11z" fill="#c2b7a7" /><text x="117" y="447" className="es-diagram-note">The knob was damaged. The circuit still mattered.</text></>}
    </> : kind === "seismic" ? <>
      <text x="58" y="86" className="es-diagram-label">PASSIVE SEISMIC EXPERIMENT</text>
      <path d="M45 364h630" stroke="currentColor" opacity=".5" /><rect x="304" y="204" width="112" height="154" fill="#b49c65" stroke="currentColor" />
      <path d="M304 237 155 253v84l149-17m112-83 149 16v84l-149-17" fill="#718894" stroke="currentColor" /><path d="M318 204v-35h18m-22 120h89m-89 18h89" stroke="currentColor" fill="none" />
      <path d={late ? "M45 409h150l12-10 13 28 18-51 20 70 21-46 13 9h383" : "M45 409h630"} stroke="#9673b4" strokeWidth="3" fill="none" /><text x="59" y="478" className="es-diagram-note">{late ? "Ground motion becomes a signal." : "Levelled on the ground. Solar panels open."}</text>
    </> : kind === "foil" ? <>
      <text x="55" y="83" className="es-diagram-label">SOLAR-WIND COLLECTOR</text><path d="M45 405h276m-117 0V148" stroke="currentColor" strokeWidth="3" />
      {beat < 3 && <path d="M204 160h112v151H204z" fill="#bac2c3" stroke="#797786" />}
      <rect x="454" y="304" width="177" height="98" rx="3" stroke="currentColor" fill="none" />{beat >= 3 && <path d="M479 335h127v24H479z" fill="#bac2c3" stroke="#797786" />}
      <path d="M343 258q87-12 128 31m-21-2 21 2-7-21" stroke="#84609e" strokeWidth="2" fill="none" />
      <text x="103" y="449" className="es-diagram-label">STAFF STAYS</text><text x="454" y="449" className="es-diagram-label">FOIL RETURNS</text>
    </> : <>
      {kind === "landing" && <><path d="m44 446 45-53 45 33 17 32m18-9 25-70 61 64" fill="#695e56" stroke="#a49585" /><path d="M390 451h262" stroke="#c8b893" strokeDasharray="6 9" /><path d="M62 470h600" stroke="currentColor" opacity=".4" /></>}
      <g className="es-landing-craft" style={{ transform: kind === "landing" ? `translate(${beat === 0 ? -58 : 45}px, ${beat < 2 ? -74 : 0}px)` : "translate(0,0)" }}><Lander raised={kind === "ascent" && late || kind === "stages"} camera={kind === "camera" && beat > 0} />{kind === "landing" && late && <path d="M508 438v30" stroke="#d4c298" strokeWidth="2" />}</g>
      <text x="54" y="75" className="es-diagram-label">{kind === "stages" ? "ONE SPACECRAFT. TWO JOBS." : kind === "camera" ? "MESA / HINGED CAMERA BAY" : kind === "ascent" ? late ? "THE CABIN RETURNS TO ORBIT" : "THE LANDING STAGE BECOMES A LAUNCH PAD" : late ? "SURFACE CONTACT" : "PAST THE ROUGH GROUND"}</text>
      {kind === "camera" && beat > 0 && <><path d="M214 350 95 308m119 42L95 413" stroke="#9472aa" strokeDasharray="5 5" /><text x="67" y="474" className="es-diagram-note">The lowered bay opens a view toward the ladder.</text></>}
      {kind === "ascent" && <text x="423" y="381" className="es-diagram-label">STAYS HERE</text>}
      {kind === "stages" && <><path d="M424 143h196m-180 190h180" stroke="currentColor" opacity=".5" /><text x="487" y="124" className="es-diagram-label">CREW CABIN</text><text x="475" y="364" className="es-diagram-label">LANDING STAGE</text></>}
    </>}
  </svg>;
}
