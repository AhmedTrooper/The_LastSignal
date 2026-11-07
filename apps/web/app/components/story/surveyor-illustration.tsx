import { useId } from "react";
import type { SurveyorScene } from "@/lib/surveyor-scenes";
import { surveyorShadowRatio } from "@/lib/surveyor-activities";

const TITLES: Record<SurveyorScene, string> = {
  launch: "An Atlas-Centaur carries a robotic lander toward the Moon", antenna: "One antenna has an uncertain deployment", guide: "A lander and a question about unfamiliar ground", approach: "Surveyor prepares for descent", retro: "The main retrorocket slows the lander", jettison: "A spent rocket casing separates", radar: "Radar measurements guide the small vernier engines", touchdown: "Shock-absorbing legs meet the ground", mirror: "A movable mirror aims the television camera", footpad: "A landing foot and disturbed local soil", soil: "Images and landing measurements provide different evidence", panorama: "A camera assembles views of rocks and hills", night: "Insulated equipment waits through lunar darkness", wakeup: "A solar panel is positioned for charging", shade: "Panel orientation reduces charging during an anomaly", tile: "One thermal-radiator segment is broken", radio: "An antenna connects the lander to Earth", quiet: "The camera record remains after imaging ends", orbiter: "An orbiting camera looks down on the landing site", shadow: "An ideal mast casts a longer shadow when the Sun is lower",
};

function Lander({ retro = false, folded = false, turned = false }: { retro?: boolean; folded?: boolean; turned?: boolean }) {
  return <g stroke="#44434e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0-87L-88 58L95 55Z M0-87L5 91M-62 11L64 9M-88 58L5 91L95 55" stroke="#c5b197" strokeWidth="7" fill="none" />
    <path d="M0-87L-88 58L95 55Z M0-87L5 91M-62 11L64 9" fill="none" strokeWidth="2" />
    <path d="M-57 8L-91 66M67 9L99 63M5 38V95" stroke="#e1ddd0" strokeWidth="9" />
    <g fill="#f1eee2"><ellipse cx="-96" cy="70" rx="28" ry="9" /><ellipse cx="103" cy="67" rx="28" ry="9" /><ellipse cx="5" cy="100" rx="30" ry="10" /></g>
    {retro && <circle cx="0" cy="19" r="41" fill="#8f8990" />}
    <rect x="-59" y="-22" width="37" height="38" rx="4" fill="#f1eee2" /><rect x="27" y="-19" width="36" height="35" rx="4" fill="#ded9cc" />
    <path d="M0-85V-182" stroke="#c5b197" strokeWidth="6" />
    <g transform={turned ? "rotate(64 0 -183)" : undefined}><path d="M-52-195L29-211L61-183L-19-166Z" fill="#819b99" /><path d="M-25-201L7-171M3-206L35-176M-39-184L42-200" stroke="#d9e7d9" strokeWidth="1.5" /></g>
    <path d="M-5-143L24-158L53-120L25-103Z" fill="#ece2c8" />
    <path d="M-39-33V-118" stroke="#f1eee2" strokeWidth="16" /><path d="M-55-126L-34-136L-18-121L-36-111Z" fill="#8b8493" />
    <path d={folded ? "M-60 17L-55-43" : "M-60 17L-144-25"} stroke="#d5cbbd" /><path d="M68 14L142-24" stroke="#d5cbbd" />
    <circle cx={folded ? -55 : -144} cy={folded ? -46 : -28} r="5" fill="#ede1c6" /><circle cx="142" cy="-27" r="5" fill="#ede1c6" />
    <path d="M-56 25L-64 40H-44ZM56 24L47 39H68ZM0 60L-10 75H10Z" fill="#6d6673" />
  </g>;
}

/** AI-assisted diagrams; geometry, color and camera paths are illustrative rather than measured. */
export default function SurveyorIllustration({ scene = "touchdown", sunElevation = 30 }: { scene?: SurveyorScene; sunElevation?: number }) {
  const id = useId().replaceAll(":", "");
  const space = ["launch", "antenna", "approach", "retro", "jettison", "radar", "night", "radio", "orbiter"].includes(scene);
  const ink = space ? "#eee4d4" : "#504657";
  const ratio = surveyorShadowRatio(sunElevation);
  const angle = (Number.isFinite(sunElevation) ? Math.min(75, Math.max(15, sunElevation)) : 45) * Math.PI / 180;
  const sunX = 170 - 120 * Math.cos(angle);
  const sunY = 220 - 120 * Math.sin(angle);
  return <svg viewBox="0 0 640 440" fill="none" className="surveyor-art" data-scene={scene} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${TITLES[scene]} · stylized teaching illustration`}</title>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor={space ? "#252a40" : "#e8e0ed"} /><stop offset="1" stopColor={space ? "#51546b" : "#f8eee0"} /></linearGradient></defs>
    <path d="M0 0H640V440H0Z" fill={`url(#${id}-sky)`} />
    <path d="M0 301L88 280L161 293L234 263L300 294L422 278L481 295L556 272L640 291V440H0Z" fill={space ? "#77737f" : "#b9b1b1"} />
    <path d="M0 375Q155 327 312 365T640 347V440H0Z" fill={space ? "#979099" : "#d8cbbd"} />
    {scene === "launch" ? <g stroke="#585261" strokeWidth="3"><path d="M308 51Q342 69 347 108V287H272V108Q277 69 308 51Z" fill="#eee8df" /><path d="M272 129H347M272 203H347" /><path d="M272 231L251 274V305L272 287M347 231L368 274V305L347 287" fill="#aea7af" /><path d="M290 287L278 371L309 341L336 383L326 287" fill="#e6bc78" stroke="#d1966b" /><text x="58" y="90" fill={ink} stroke="none" fontSize="23">A journey begins</text></g>
      : scene === "footpad" || scene === "soil" ? <g stroke="#66596a" strokeWidth="3"><path d="M324 88L274 299" stroke="#ddd8cb" strokeWidth="21" /><path d="M245 107L300 292" stroke="#b9a790" strokeWidth="10" /><ellipse cx="280" cy="332" rx="100" ry="30" fill="#aaa0a5" /><ellipse cx="280" cy="318" rx="78" ry="22" fill="#f7efe0" /><path d="M202 318V331Q280 369 358 331V318" fill="#e1d6c5" /><path d="M157 356L176 338L194 354L176 365ZM366 339L386 330L402 350L379 355" fill="#9a8c96" />{scene === "soil" && <><rect x="404" y="107" width="177" height="126" rx="14" fill="#fcf4e3" /><path d="M426 202H557M426 129V202M431 180L453 159L471 170L494 142L516 164L550 147" stroke="#7f9d8e" /><text x="488" y="267" textAnchor="middle" fill={ink} stroke="none" fontSize="18">Compare the evidence</text></>}</g>
      : scene === "tile" ? <g stroke="#63536a" strokeWidth="3"><path d="M102 153L432 93L561 195L226 284Z" fill="#c2b6c8" /><path d="M102 153V289L226 382V284M226 382L561 294V195" fill="#ece6d7" />{[0,1,2].flatMap(row=>[0,1,2].map(col=><g key={`${row}-${col}`} transform={`translate(${134+col*93+row*28} ${157-col*17+row*29})`}><path d="M0 0L78-14L21 24L-55 38Z" fill={row===1&&col===1 ? "#8e7c93" : "#e9e3c8"} />{row===1&&col===1&&<path d="M1 0L10 9L-14 17L-3 26" stroke="#f8e8c9" />}</g>))}<text x="84" y="56" fill={ink} stroke="none" fontSize="22">A radiator, not the camera mirror</text></g>
      : scene === "shadow" ? <g stroke="#625969" strokeWidth="3"><path d={`M169 329L${169+110*ratio} 329L${173+110*ratio} 340L171 340Z`} fill="#776c80" stroke="none" /><path d="M170 330V220" stroke="#b39b7f" strokeWidth="7" /><path d="M142 215H198V230H142Z" fill="#e6d9b6" /><path d="M170 284L139 330M170 284L201 330" /><circle cx={sunX} cy={sunY} r="27" fill="#eacb86" stroke="none" /><path d={`M${sunX + 12} ${sunY + 8}L166 218`} stroke="#b9a86d" strokeDasharray="7 8" /><path d="M134 365H553" strokeDasharray="4 7" /><text x="74" y="60" fill={ink} stroke="none" fontSize="20">Same mast. Different light.</text><text x="161" y="395" fill={ink} stroke="none" fontSize="17">Idealized level-ground model</text></g>
      : <>
        {(scene === "guide" || scene === "panorama") && <><ellipse cx="499" cy="340" rx="61" ry="18" fill="#aa9fac" /><path d="M65 352L81 321L111 334L120 360Z" fill="#9b919e" /></>}
        {scene === "night" && <path d="M97 221Q174 181 194 138M474 167Q528 185 551 230" stroke="#a1acc6" strokeWidth="3" strokeDasharray="5 10" />}
        {scene === "quiet" && <path d="M283 362L564 416L589 408L337 353Z" fill="#7b7181" />}
        <g transform={scene === "retro" || scene === "jettison" || scene === "radar" ? "translate(320 221) scale(.72)" : scene === "orbiter" ? "translate(260 336) scale(.42)" : "translate(320 289) scale(.9)"}><Lander retro={scene === "retro" || scene === "approach"} folded={scene === "antenna" || scene === "approach"} turned={scene === "shade"} /></g>
        {scene === "retro" && <path d="M302 263L283 364L321 339L351 384L336 263" fill="#eac989" stroke="#d4a572" strokeWidth="3" />}
        {scene === "jettison" && <g stroke="#c6b8a9" strokeWidth="3"><circle cx="354" cy="354" r="26" fill="#77717d" /><path d="M337 294L345 314M371 284L385 315" strokeDasharray="4 5" /></g>}
        {scene === "radar" && <g stroke="#a7d3c9" strokeWidth="3" strokeDasharray="6 7"><path d="M320 230L189 374M320 230L453 374M320 230V388M320 230L382 377" /></g>}
        {scene === "antenna" && <><circle cx="270" cy="248" r="27" stroke="#d2b281" strokeWidth="3" /><path d="M245 234L163 180H62" stroke="#d2b281" strokeWidth="2" /><text x="59" y="156" fill={ink} fontSize="22">Not confirmed open</text></>}
        {scene === "guide" && <text x="58" y="74" fill={ink} fontSize="25">What will the ground be like?</text>}
        {scene === "mirror" && <g stroke="#987eab" strokeWidth="3"><path d="M286 175Q202 166 153 237M153 237L153 220M153 237L171 234" /><path d="M286 175L209 343" strokeDasharray="6 7" /><circle cx="233" cy="352" r="28" /></g>}
        {(scene === "wakeup" || scene === "shade") && <g><circle cx="83" cy="88" r="28" fill="#e4c47e" /><path d="M112 103L253 133M111 126L224 164" stroke="#bba466" strokeWidth="3" /><text x="398" y="84" fill={ink} fontSize="19">{scene === "shade" ? "Reduce charging" : "Charge carefully"}</text></g>}
        {scene === "radio" && <g stroke="#c7d2d9" strokeWidth="3"><path d="M461 213Q497 183 482 149M477 229Q538 184 511 128" /><circle cx="553" cy="85" r="29" fill="#8aabab" /><path d="M548 60L533 83L556 94L566 76" fill="#d6d7b3" /></g>}
        {scene === "orbiter" && <g stroke="#b9c0d1" strokeWidth="3"><path d="M474 99L512 85L541 110L501 125Z" fill="#e2d7be" /><path d="M447 80L461 72L490 133L476 140M535 59L549 52L578 113L564 120" fill="#7998a8" /><path d="M499 134L280 299" strokeDasharray="5 9" /></g>}
      </>}
  </svg>;
}
