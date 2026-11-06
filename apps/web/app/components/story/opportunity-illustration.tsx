import { useId } from "react";
import type { OpportunityScene } from "@/lib/machine-books/types";

function Rover({ stuck = false, clean = true }: { stuck?: boolean; clean?: boolean }) {
  return <g fill="none" stroke="#3b2927" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
    <path d="m218 241 133-16 92 54-139 23z" fill={clean ? "#527383" : "#a58c75"} /><path d="m238 255 59-7m-41 23 63-10m-8-22 29 29m-30-32 54 28" stroke="#e0cf9a" strokeWidth="2" />
    <path d="m222 264 79 47 116-26v34l-118 20-77-50z" fill="#c7a374" /><path d="M309 237v-88" strokeWidth="8" /><path d="m281 128 42-5 22 21-42 9-25-13z" fill="#d7d2c0" /><path d="m292 133 10-1m18-3 10-1" stroke="#1a333f" strokeWidth="7" />
    {[244, 314, 397].map((x, i) => <g key={x}><path d={`M${x} 306v37`} /><ellipse cx={x} cy={i === 1 ? 375 : 352} rx="25" ry="27" fill="#6c5a53" /><ellipse cx={x} cy={i === 1 ? 375 : 352} rx="13" ry="15" fill="#c4b4a2" /><path d={`m${x - 10} ${i === 1 ? 357 : 334} 20 35m-20-2 20-33`} strokeWidth="2" /></g>)}
    <path d="m402 306 43 17 18 38-27 9m8-46 26-28" stroke="#cabfa8" strokeWidth="8" /><path d="m402 306 43 17 18 38-27 9" strokeWidth="2" />
    {stuck && <path d="M174 376q139-84 295-5v43H174z" fill="#c59775" stroke="#ae7857" />}
  </g>;
}

/** AI-assisted illustrative panels. Apparent scale, motion and readouts are not flight telemetry. */
export default function OpportunityIllustration({ scene, step = 0 }: { scene: OpportunityScene; step?: number }) {
  const id = useId().replaceAll(":", "");
  const dark = ["dust", "signal", "quiet", "memory", "handoff"].includes(scene);
  return <svg viewBox="0 0 640 440" role="img" aria-label={`Illustrative Opportunity scene: ${scene}`} className={`opportunity-art opportunity-art-${scene}`}>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor={dark ? "#211b23" : "#c79778"} /><stop offset="1" stopColor={dark ? "#6b504b" : "#ecceb0"} /></linearGradient><pattern id={`${id}-dots`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#493734" opacity=".1" /></pattern></defs>
    <path d="M0 0h640v440H0z" fill={`url(#${id}-sky)`} /><path d="M0 332q126-54 273-5t367-12v125H0z" fill={dark ? "#866051" : "#c28e6b"} /><path d="M0 358q196-45 335-17t305-17v116H0z" fill="#c29c7a" /><path d="M0 0h640v440H0z" fill={`url(#${id}-dots)`} />
    {scene === "airbags" ? <g stroke="#5b4639" strokeWidth="2"><path d="M225 46q100-75 200 0z" fill="#e8d9b9" /><path d="M225 46l69 116m131-116-71 116" fill="none" /><g className="oppy-airbags" style={{ transform: `translateY(${step > 0 ? 65 : 0}px)` }}>{[[271, 208], [329, 185], [389, 217], [250, 261], [318, 267], [382, 271]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="46" fill="#d4bc8d" />)}<path d="m284 200 50-20 28 47-54 25z" fill="#9c8e77" /></g><path d="m179 373 47 9m225-18 37 8" stroke="#876045" /></g> : ["berries", "minerals", "grinder"].includes(scene) ? <>
      <path d="m63 203 374-33 142 191-437 43z" fill="#d5c8a9" stroke="#705841" strokeWidth="3" /><path d="m79 238 384-36m-360 64 380-30m-346 65 381-35m-350 69 373-38" fill="none" stroke="#ac967a" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(i => <circle key={i} cx={129 + i % 5 * 70 + Math.floor(i / 5) * 20} cy={221 + Math.floor(i / 5) * 55} r={i % 3 ? 10 : 14} fill="#777b7d" stroke="#48494a" strokeWidth="2" />)}
      {scene === "minerals" && <><path d="M476 110l-73 82m73-82-28-54h-68" fill="none" stroke="#c3b995" strokeWidth="12" /><circle cx="403" cy="193" r="33" fill="#e3d9c5" stroke="#4e3a33" strokeWidth="3" /><text x="38" y="64" fill="#382c27" fontFamily="monospace" fontSize="16">BERRIES + BERRY-FREE ROCK</text><text x="39" y="93" fill="#4f463d" fontSize="15">Compare the mineral evidence.</text></>}
      {scene === "grinder" && <circle cx="315" cy="278" r="64" stroke="#f0e0b3" strokeWidth="4" fill="#b9ad98" />}
    </> : scene === "testbed" ? <><path d="M60 114h520v290H60z" fill="#e3d6c2" stroke="#82694e" strokeWidth="3" /><path d="M61 351q201-82 519 0v52H61z" fill="#c7a074" /><g transform="translate(0,-23)"><Rover stuck /></g><text x="105" y="87" fill="#40362f" fontFamily="monospace" fontSize="16">TEST IDEAS ON EARTH FIRST</text></> : scene === "memory" ? <><rect x="63" y="76" width="210" height="241" rx="8" fill="#3d3943" stroke="#d2bea0" strokeWidth="3" /><text x="88" y="123" fill="#e8d7bc" fontFamily="monospace" fontSize="22">FLASH</text><path d="m104 166 64-15-23 64 58-13" stroke="#c48370" strokeWidth="4" fill="none" /><rect x="368" y="75" width="203" height="243" rx="8" fill="#776453" stroke="#d2bea0" strokeWidth="3" /><text x="397" y="123" fill="#eee2cf" fontFamily="monospace" fontSize="22">RAM</text><path d="M394 154h153m-153 38h118m-118 39h135" stroke="#d9bf8a" strokeWidth="5" /><path d="M459 335v38H235m-1-9-11 9 11 9" stroke="#e8d7bc" strokeWidth="3" fill="none" /><text x="71" y="412" fill="#332b2a" fontSize="15">Return data before the temporary memory loses power.</text></> : scene === "handoff" ? <><g transform="translate(-122,-15) scale(.86)"><Rover clean={false} /></g><path d="M314 271h223m-17-11 17 11-17 11" stroke="#e6d8b8" strokeWidth="3" /><text x="40" y="77" fill="#efe1c8" fontFamily="monospace" fontSize="19">OPPORTUNITY / 45.16 KM</text><text x="324" y="328" fill="#3b2d29" fontFamily="monospace" fontSize="17">PERSEVERANCE / 45.22 KM</text><text x="328" y="359" fill="#3b2d29" fontSize="15">11 October 2026 · later record</text></> : <>
      <g className="oppy-rover-move" style={{ transform: scene === "escape" ? `translateX(${Math.min(step, 3) * 24}px)` : "none" }}><Rover stuck={scene === "sand"} clean={!["solar", "quiet", "dust", "signal"].includes(scene)} /></g>
      {scene === "solar" && <><path d="m49 165 99-30m-105 70 133-31m-68 74 94-25" stroke="#e2cdb3" strokeWidth="4" fill="none" /><text x="33" y="57" fill="#3b302b" fontFamily="monospace" fontSize="16">WIND CAN CLEAN SOLAR PANELS</text></>}
      {scene === "marathon" && <><path d="M53 415h542" stroke="#ebddbd" strokeDasharray="6 8" strokeWidth="3" /><text x="42" y="65" fill="#3b302b" fontFamily="monospace" fontSize="22">42.195 KM / MANY SEPARATE DRIVES</text></>}
      {scene === "dust" && [0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`M0 ${65 + i * 45}q180-46 330-8t310-5`} stroke="#875c4d" strokeWidth="20" fill="none" opacity=".5" />)}
      {scene === "signal" && <><path d="M350 150q130-2 169-111m-180 123q127 17 191-81" stroke="#e6d8b8" strokeWidth="2" fill="none" strokeDasharray="5 8" /><text x="29" y="69" fill="#ecdbc0" fontFamily="monospace" fontSize="16">LAST CONTACT / 10 JUNE 2018</text></>}
    </>}
  </svg>;
}
