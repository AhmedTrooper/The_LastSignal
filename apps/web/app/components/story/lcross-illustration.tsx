import { useId } from "react";
import type { LcrossScene } from "@/lib/lcross-scenes";

const TITLES: Record<LcrossScene, string> = {
  ring: "An adapter ring supports a spacecraft and its instruments", launch: "A launch stage carries two lunar missions", shadow: "Crater walls block low sunlight from the floor", plan: "An impactor and an observer have different roles", thrusters: "Control thrusters consume propellant", noise: "A controller receives noisy backup information", recover: "Useful sensor information is restored", conserve: "Revised safeguards help conserve propellant", separate: "The observer separates from the used rocket stage", impact: "The rocket stage exposes material by impact", observe: "The following spacecraft observes the impact", transmit: "Measurements are sent to Earth", plume: "Impact debris rises from shadow into light", spectra: "Different instruments inspect patterns in light", estimate: "A local estimate includes an uncertainty", volatiles: "Different materials raise questions about a cold trap", final: "The observing spacecraft also impacts", bandwidth: "A downlink has a limited capacity", later: "A shadowed crater is difficult to see in ordinary light", record: "Mission records remain after the flight ends", infrared: "Thermal radiation provides a different view", radar: "Radar supplies illumination and measures a return", "faint-light": "A sensitive camera uses faint reflected light",
};

function Craft({ firing = false }: { firing?: boolean }) {
  return <g stroke="#374753" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M-61-46L-17-71L45-55L73-10L44 43L-18 57L-64 20Z" fill="#c6a468" />
    <path d="M-61-46L-30-24L32-43L45-55M-30-24L-36 28L-18 57M32-43L48 10L44 43M-36 28L48 10" fill="none" stroke="#eed9aa" strokeWidth="2" />
    <ellipse cx="-4" cy="-6" rx="31" ry="28" fill="#3e5360" /><ellipse cx="-4" cy="-6" rx="18" ry="17" fill="#7794a1" />
    <g fill="#eddab2">{[[-40,-39],[14,-55],[55,-24],[49,28],[-4,42],[-49,14]].map(([cx,cy])=><circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" />)}</g>
    <path d="M70-15L149-39L169 32L86 53Z" fill="#567e90" /><path d="M97-23L116 43M123-31L143 36M81 8L159-13" stroke="#b8d7d4" strokeWidth="1.5" />
    <path d="M-17-71L-29-103L39-88L45-55Z" fill="#d8b976" />
    {[[-16,-87],[4,-82],[23,-76]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="6" fill="#617a86" />)}
    <path d="M-56 21L-78 33L-65 44ZM33 47L37 69L52 56Z" fill="#52606b" />
    {firing && <g fill="#e6c78c" stroke="#c39571" strokeWidth="2"><path d="M-76 35L-113 63L-77 48Z" /><path d="M40 65L37 100L52 72Z" /></g>}
  </g>;
}

function Centaur() {
  return <g stroke="#53606c" strokeWidth="3" strokeLinejoin="round"><path d="M-95-31H76Q99 0 76 31H-95Z" fill="#e4dfd3" /><ellipse cx="-95" cy="0" rx="15" ry="31" fill="#b6b7b7" /><path d="M-36-31V31M46-31V31" /><path d="M88-12L112-20V20L88 12" fill="#a1a2a9" /></g>;
}

/** AI-assisted teaching art; paths, signals and lighting are not recovered telemetry. */
export default function LcrossIllustration({ scene = "plan", reveal = 100 }: { scene?: LcrossScene; reveal?: number }) {
  const id = useId().replaceAll(":", "");
  const progress = Number.isFinite(reveal) ? Math.min(100, Math.max(0, reveal)) : 0;
  const floor = ["shadow","impact","observe","plume","final","later","infrared","radar","faint-light"].includes(scene);
  const sensor = ["noise","recover","conserve","spectra","estimate","volatiles","bandwidth","record"].includes(scene);
  return <svg viewBox="0 0 640 440" fill="none" className="lcross-art" data-scene={scene} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${TITLES[scene]} · stylized teaching diagram`}</title>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#233b4c" /><stop offset="1" stopColor="#738393" /></linearGradient><clipPath id={`${id}-plume`}><rect x="135" y={372 - 220 * progress / 100} width="330" height={220 * progress / 100 + 10} /></clipPath></defs>
    <path d="M0 0H640V440H0Z" fill={`url(#${id}-sky)`} />
    <g fill="#e4d5bd" opacity=".65">{[[54,96],[146,56],[267,70],[424,50],[561,118],[510,213]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="2" />)}</g>
    {floor ? <><path d="M0 216L94 164L170 202L236 319L373 321L457 203L557 160L640 214V440H0Z" fill={scene === "infrared" ? "#68577a" : "#77818a"} /><path d="M170 202L236 319H373L457 203L412 390H204Z" fill={scene === "faint-light" || scene === "radar" ? "#5d737c" : "#192d3e"} /><ellipse cx="304" cy="361" rx="45" ry="13" fill={scene === "infrared" ? "#e7b673" : "#0f2537"} />
      {scene !== "infrared" && <g stroke="#e0c99b" strokeWidth="3"><circle cx="58" cy="121" r="20" fill="#e0c99b" /><path d="M80 128L569 180M80 151L585 205" opacity=".6" /></g>}
      {(scene === "plume" || scene === "observe" || scene === "impact") && <g clipPath={`url(#${id}-plume)`}><path d="M264 359Q234 300 216 262Q167 207 199 178Q247 174 282 249Q278 166 303 146Q348 170 335 249Q386 187 418 203Q443 237 382 285L341 359Z" fill="#d9e2d6" fillOpacity=".8" /><path d="M303 337V174M274 336L220 223M334 339L395 237" stroke="#f2e2b5" strokeWidth="3" strokeDasharray="7 11" /></g>}
      {(scene === "observe" || scene === "final") && <g transform="translate(490 111) scale(.45)"><Craft /></g>}
      {scene === "impact" && <g transform="translate(300 305) rotate(77) scale(.28)"><Centaur /></g>}
      {(scene === "radar" || scene === "faint-light" || scene === "later" || scene === "infrared") && <><path d="M481 79L538 94L512 122L456 107Z" fill="#d4c5a6" stroke="#344852" strokeWidth="3" /><path d="M466 54L483 61L453 135L436 128M540 73L557 80L527 154L510 147" fill="#6d99a8" stroke="#344852" strokeWidth="3" />{scene === "radar" && <path d="M491 128L295 346L461 160M501 137L317 361L483 169" stroke="#a1d3c5" strokeWidth="3" strokeDasharray="7 8" />}{scene === "faint-light" && <path d="M303 345L488 131" stroke="#d7caa4" strokeWidth="2" strokeDasharray="3 10" />}</>}
      <text x="45" y="413" fill="#f4e8cf" fontSize="17">Illustrative crater section · not an impact-site map</text>
    </> : sensor ? <g stroke="#405465" strokeWidth="3" strokeLinejoin="round">
      <rect x="65" y="82" width="214" height="249" rx="18" fill="#e3d6ba" /><rect x="365" y="101" width="207" height="207" rx="18" fill="#afc5c5" />
      <rect x="390" y="124" width="156" height="144" rx="10" fill="#f5edde" />
      {scene === "noise" ? <><path d="M87 132L118 148L127 121L156 164L169 138L211 154L256 116M87 204L120 180L147 218L170 185L211 204L252 177M391 174L417 146L431 201L452 159L477 213L511 152L544 186" fill="none" stroke="#aa6d69" /><path d="M284 206H351M333 193L351 206L333 220" /></>
        : scene === "recover" || scene === "conserve" ? <><path d="M90 154H248M90 202H248M90 250H227" stroke="#718982" /><path d="M400 194L432 220L512 159" fill="none" stroke="#668c79" strokeWidth="8" /><path d="M284 206H351M333 193L351 206L333 220" /></>
        : scene === "spectra" ? <><path d="M89 140H253M89 196H253M89 252H253" stroke="#87918a" /><path d="M94 147L119 157L136 218L153 157L179 155L195 198L212 157L247 151" fill="none" stroke="#6b8f9c" /><path d="M401 224L435 152L455 225L489 174L517 224" stroke="#a4819b" fill="none" /></>
        : scene === "bandwidth" ? <>{[0,1,2,3,4].map(i=><rect key={i} x="95" y={105+i*40} width="149" height="26" rx="4" fill="#bfa574" />)}<rect x="430" y="150" width="65" height="90" rx="6" fill="#8faeaa" /><path d="M283 156L352 176M283 211L352 202M283 263L352 230" stroke="#d9c59b" /></>
        : <><path d="M94 128H248M94 169H248M94 210H248M94 251H228" stroke="#85918e" /><circle cx="469" cy="192" r="39" fill="#91b8b5" /><text x="469" y="203" textAnchor="middle" fill="#304957" stroke="none" fontSize="38">?</text></>}
      <text x="80" y="365" fill="#f4e8cf" stroke="none" fontSize="18">{scene === "noise" ? "Noisy information is not always motion" : scene === "spectra" ? "Schematic light patterns · not recorded spectra" : scene === "bandwidth" ? "Choose what fits in the downlink" : scene === "estimate" ? "A local estimate includes uncertainty" : scene === "volatiles" ? "Different materials. More questions." : scene === "record" ? "The record remains after the flight" : "Useful measurements and safeguards"}</text>
    </g> : scene === "launch" ? <g stroke="#52606c" strokeWidth="3"><path d="M313 47Q351 85 350 113V302H276V113Q278 79 313 47Z" fill="#e7ded0" /><path d="M276 192H350M277 263L251 302V325L277 307M350 263L374 304V325L350 308" fill="#a2a5ac" /><path d="M290 307L278 396L314 365L345 408L336 307" fill="#e2bd84" /><text x="55" y="88" fill="#f5e5c6" stroke="none" fontSize="22">Two missions share a launch</text></g>
      : <>
        <ellipse cx="182" cy="331" rx="211" ry="148" fill="#acafb4" /><path d="M0 336Q143 251 255 336L359 422H0Z" fill="#7f8894" />
        <g transform={scene === "ring" ? "translate(284 231) scale(1.2)" : "translate(437 190) scale(.76)"}><Craft firing={scene === "thrusters"} /></g>
        {scene !== "ring" && <g transform={scene === "transmit" ? "translate(183 140) scale(.7)" : "translate(201 181) scale(.9)"}><Centaur /></g>}
        {scene === "plan" && <path d="M123 237Q176 312 216 343M436 273Q363 325 303 348" stroke="#e3d0a5" strokeWidth="3" strokeDasharray="8 10" />}
        {scene === "separate" && <path d="M306 182H346M320 169L304 182L320 195" stroke="#d5e1db" strokeWidth="3" />}
        {scene === "transmit" && <g stroke="#d4dfdd" strokeWidth="3"><path d="M544 194Q575 158 550 125M565 211Q614 157 572 99" /><circle cx="580" cy="64" r="24" fill="#84b3ac" /></g>}
        <text x="42" y="52" fill="#f6e8cf" fontSize="21">{scene === "ring" ? "An adapter ring becomes a spacecraft" : scene === "separate" ? "One impactor. One observer." : scene === "thrusters" ? "Thruster firing spends propellant" : scene === "transmit" ? "Send the measurements home" : "A used stage has another job"}</text>
      </>}
  </svg>;
}
