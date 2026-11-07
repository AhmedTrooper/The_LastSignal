import type { InsightScene } from "@/lib/insight-scenes";

/** A labelled, stylized teaching drawing. Positions and waves are not measured telemetry. */
export default function InsightIllustration({ scene = "lander" }: { scene?: InsightScene }) {
  const digging = ["mole", "soil", "scoop"].includes(scene);
  const shield = ["shield", "seismic", "quiet", "archive"].includes(scene);
  const dusty = ["dust", "quiet", "cleaning"].includes(scene);
  return <svg viewBox="0 0 640 380" fill="none" aria-hidden="true" className="insight-art" data-scene={scene}>
    <path d="M20 283Q180 245 350 281T620 272V366H20Z" fill="#cfa995" />
    <g stroke="#574859" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {scene === "earth" && <><path d="M38 280V70H603V277M38 119H603M138 72V269M505 72V269" stroke="#a68c9f" strokeDasharray="7 9" /><rect x="48" y="293" width="540" height="22" rx="6" fill="#d1c8d7" /></>}
      {([170, 470]).map(cx => <g key={cx}>
        <ellipse cx={cx} cy="205" rx="115" ry="66" fill={dusty ? "#b99483" : "#8398b9"} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = i * Math.PI / 6;
          return <path key={i} d={`M${cx} 205L${cx + 113 * Math.cos(a)} ${205 + 64 * Math.sin(a)}`} stroke={dusty ? "#917b80" : "#d7dff1"} strokeWidth="2" />;
        })}
        <ellipse cx={cx} cy="205" rx="18" ry="11" fill="#cbbbac" />
      </g>)}
      <path d="M256 152L330 140L388 163L383 222L315 240L250 215Z" fill="#ebc590" />
      <path d="M251 192L314 216L383 194V223L315 244L251 218Z" fill="#b68771" />
      <path d="M266 224L234 294M363 226L402 290M316 245L316 317" strokeWidth="9" stroke="#dac4b0" />
      <path d="M214 295H254M382 291H422M296 318H338" strokeWidth="8" />
      <path d="M338 151V113M330 105H347M281 157V129" stroke="#6e677b" />
      <rect x="267" y="125" width="22" height="16" rx="3" fill="#c6d2de" /><circle cx="278" cy="133" r="4" fill="#574859" />
      <path d={digging ? "M360 158L410 126L470 235L478 266" : scene === "deployment" ? "M360 158L403 87L478 195L464 264" : "M360 158L395 105L429 130L439 180"} stroke="#eee4d4" strokeWidth="10" />
      <circle cx="395" cy="105" r="7" fill="#d5c6b7" />
      {digging ? <path d="M457 265L477 261L504 281L475 289Z" fill="#cab4a1" /> : <path d={scene === "deployment" ? "M464 264l-11 12m11-12l-5 15m5-15v17m0-17l6 15m-6-15l12 12" : "M439 180l-11 12m11-12l-5 15m5-15v17m0-17l6 15m-6-15l12 12"} strokeWidth="2.5" />}
      {!digging && <>
        <path d="M324 261Q385 292 470 291" stroke="#907581" strokeWidth="2" />
        <path d={shield ? "M448 284Q448 244 480 244Q512 244 514 284Z" : "M457 287V267L480 254L503 267V287Z"} fill={shield ? "#f7f0dc" : "#d09a73"} />
        <path d="M445 287H516" />
      </>}
      {digging && <>
        <path d="M420 295H537V352H420Z" fill="#b88771" stroke="none" />
        <path d="M463 296V341H489V296" fill="#e0c5a1" />
        <path d="M477 286V343" stroke="#685b67" strokeWidth="8" /><path d="M478 285Q427 276 375 254" stroke="#ad745b" strokeWidth="2" />
        {scene === "soil" && <path d="M429 310l19-6m-10 25l13-6m48-18l24 7m-20 19l17 6" stroke="#795c60" strokeWidth="5" />}
      </>}
      {(scene === "wind" || scene === "cleaning") && <g stroke="#a37280"><path d="M24 120Q89 90 154 120" /><path d="M28 139Q103 106 187 138M412 69Q482 38 581 65M439 88Q510 60 601 90" /></g>}
      {scene === "cleaning" && <g fill="#e6bc78" stroke="none">{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={423 + i * 10} cy={184 + Math.sin(i) * 17 + i * 3} r="3" />)}</g>}
      {scene === "seismic" && <g stroke="#b37865" strokeWidth="3"><path d="M389 340Q459 305 540 339M362 360Q456 315 559 357" strokeDasharray="6 8" /><path d="M36 80H97l8-18 13 40 11-31 12 9h84" stroke="#a77672" /></g>}
      {scene === "relay" && <g><rect x="91" y="51" width="28" height="23" rx="2" fill="#dcc3ab" /><path d="M76 57H91M119 57H134M105 74V85" /><rect x="491" y="36" width="28" height="23" rx="2" fill="#dcc3ab" /><path d="M476 42H491M519 42H534M505 59V71" /><path d="M130 57Q253 16 332 87M482 46Q411 10 367 85" strokeDasharray="4 8" stroke="#a77691" /></g>}
      {scene === "archive" && <g><path d="M456 51l52 19-20 26-52-19Z" fill="#cebfcb" /><path d="M460 39l20 6-24 69-20-6M508 55l20 6-24 69-20-6" fill="#8193b5" /><path d="M483 105L340 183M491 109L419 250" stroke="#b590a5" strokeDasharray="5 9" /></g>}
    </g>
  </svg>;
}
