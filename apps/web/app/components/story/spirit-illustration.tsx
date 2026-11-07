import { useId } from "react";
import type { SpiritScene } from "@/lib/spirit-scenes";

const TITLES: Record<SpiritScene, string> = {
  landing: "An airbag-protected lander on a Martian plain",
  basalt: "Spirit investigates the fresh interior of a volcanic rock",
  earth: "Spirit looks toward a faint Earth in the dawn sky",
  hills: "The Columbia Hills rise beyond Spirit’s rocky plain",
  files: "An illustrated flash-storage cabinet holds many files",
  reset: "Restart arrows return to the same crowded storage",
  bypass: "A recovery path goes around flash storage",
  clean: "Unneeded files are removed before a clean storage layout",
  goethite: "An instrument examines a rock for mineral clues",
  wind: "Wind passes a solar-powered rover",
  summit: "Spirit looks out from a hilltop",
  plate: "Layered terrain and the flat-topped Home Plate feature",
  wheel: "A marked wheel no longer turns",
  scrape: "A dragged wheel exposes pale soil beneath darker ground",
  scan: "A distant sensor and an arm instrument examine pale soil",
  springs: "Two possible past environments: a hot spring and a steam vent",
  trap: "Spirit’s wheels sink through a crust into loose soil",
  testbed: "An Earth test rover helps engineers investigate difficult terrain",
  winter: "A low northern Sun meets a south-leaning solar panel",
  archive: "Spirit’s records travel from a silent rover into an archive",
};

function Rover({ failed = false, dusty = false }: { failed?: boolean; dusty?: boolean }) {
  return <g stroke="#44383e" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
    <g fill="#716974">
      {[[-70, 28], [0, 52], [77, 28]].map(([x, y]) => <g key={x} transform={`translate(${x} ${y})`}><path d="M0-36V-8" fill="none" /><ellipse rx="19" ry="23" fill="#716974" /><ellipse rx="9" ry="13" fill="#c3b2a4" />{failed && x === -70 ? <path d="M-10-12L10 12M10-12L-10 12" stroke="#f5d2a0" /> : <path d="M-12-16L12 16M-12-2L8 23" stroke="#c3b2a4" strokeWidth="2" />}</g>)}
    </g>
    <path d="M-89-56L8-79L100-34L6-11Z" fill={dusty ? "#b59480" : "#607d8e"} />
    <path d="M-74-51L7-70L83-34M-51-63L35-20M-18-70L65-26M-48-41L37-60" fill="none" stroke="#d9d4bd" strokeWidth="2" />
    <path d="M-82-47L5-7L90-29V1L7 18L-82-14Z" fill="#d0a365" />
    <path d="M-5-69V-141" stroke="#d9d4bd" strokeWidth="8" />
    <path d="M-28-155L6-160L30-144L-7-137L-28-144Z" fill="#d9d4bd" />
    <path d="M-18-148L-10-147M5-151L14-147" stroke="#35495d" strokeWidth="5" />
    <path d="M55-56L64-94" fill="none" /><path d="M45-95Q71-112 83-91Q64-77 45-95Z" fill="#e8dac0" />
    <path d="M75-5L116 17L105 40L137 44" stroke="#d7c7af" strokeWidth="8" fill="none" />
    <circle cx="140" cy="43" r="10" fill="#d7c7af" />
  </g>;
}

/** AI-assisted teaching art. Positions, colors and paths are illustrative, not telemetry. */
export default function SpiritIllustration({ scene = "hills", reveal = 100 }: { scene?: SpiritScene; reveal?: number }) {
  const id = useId().replaceAll(":", "");
  const night = ["earth", "reset", "winter", "archive"].includes(scene);
  const computer = ["files", "reset", "bypass", "clean"].includes(scene);
  const failed = ["wheel", "scrape", "scan", "trap", "winter", "archive"].includes(scene);
  const progress = Math.max(0, Math.min(100, reveal));
  return <svg viewBox="0 0 640 440" fill="none" className="spirit-art" data-scene={scene} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${TITLES[scene]} · stylized teaching illustration`}</title>
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor={night ? "#26314a" : "#ead5b8"} /><stop offset="1" stopColor={night ? "#625067" : "#f9ead2"} /></linearGradient>
      <clipPath id={`${id}-soil`}><rect x="48" y="270" width={480 * progress / 100} height="136" /></clipPath>
    </defs>
    <path d="M0 0H640V440H0Z" fill={`url(#${id}-sky)`} />
    {!night && <circle cx="533" cy="69" r="31" fill="#fdf1cc" opacity="0.85" />}
    <path d="M0 276L64 253L132 277L228 224L317 257L401 204L510 253L578 222L640 249V440H0Z" fill={night ? "#705a66" : "#c6a08a"} />
    <path d="M0 330Q154 283 289 332T640 305V440H0Z" fill={night ? "#977580" : "#d7b18c"} />
    {computer ? <g stroke="#584558" strokeWidth="3" strokeLinejoin="round">
      <rect x="98" y="95" width="274" height="253" rx="20" fill="#e1ccac" />
      <rect x="120" y="120" width="230" height="185" rx="10" fill="#f7edda" />
      {(scene === "clean" ? [0, 1] : [0, 1, 2, 3, 4, 5]).map(i => <g key={i} transform={`translate(${136 + (i % 2) * 100} ${139 + Math.floor(i / 2) * 48})`}><path d="M0 5H15L22 0H73V34H0Z" fill={scene === "clean" ? "#a5b9aa" : "#cea778"} /><path d="M10 16H59M10 25H45" strokeWidth="2" /></g>)}
      <rect x="426" y="159" width="119" height="113" rx="16" fill={scene === "bypass" || scene === "clean" ? "#a5b9aa" : "#b1adbb"} />
      <path d="M448 181H523V249H448Z" fill="#f7edda" /><path d="M469 203L480 218L506 191" stroke="#4d6e66" strokeWidth="5" />
      {scene === "reset" && <g stroke="#ebc98e" strokeWidth="8"><path d="M391 100Q539 48 566 149M553 128L567 151L582 128M380 324Q519 384 564 289M546 298L565 285L576 305" /></g>}
      {scene === "bypass" && <g stroke="#81b7ad" strokeWidth="8"><path d="M54 380H403Q483 380 483 287M469 303L483 285L497 303" /><path d="M389 160L410 182M410 160L389 182" stroke="#b07978" /></g>}
      <text x="235" y="329" textAnchor="middle" fill="#44383e" stroke="none" fontSize="17">Flash files</text>
      <text x="485" y="300" textAnchor="middle" fill={night ? "#ffebcd" : "#44383e"} stroke="none" fontSize="17">Working memory</text>
    </g> : scene === "landing" ? <g stroke="#594955" strokeWidth="3"><path d="M70 211Q104 49 196 117T352 201" strokeDasharray="7 10" /><g fill="#e9dcc1">{[[282, 294], [350, 268], [412, 294], [318, 340], [386, 340]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="48" />)}<path d="M309 270L349 238L392 275L351 311Z" fill="#cbaa75" /></g><text x="56" y="67" fill="#574455" stroke="none" fontSize="21">A protected arrival</text></g>
      : scene === "springs" ? <g stroke="#725660" strokeWidth="3" strokeLinecap="round">
        <ellipse cx="194" cy="308" rx="112" ry="39" fill="#91b7ac" /><ellipse cx="194" cy="308" rx="77" ry="22" fill="#c0d9c8" /><path d="M127 258Q97 228 133 199T128 144M193 258Q171 227 199 194T193 128M258 258Q231 228 262 200T256 147" stroke="#f9f0d8" strokeWidth="9" />
        <path d="M365 354L475 263L583 351Z" fill="#e5cab1" /><path d="M469 284Q442 233 476 205T470 127M500 296Q538 251 510 213T520 154" stroke="#f9f0d8" strokeWidth="9" /><path d="M415 359H561" stroke="#9d7061" />
        <text x="196" y="393" textAnchor="middle" fill="#493c45" stroke="none" fontSize="20">Hot spring?</text><text x="473" y="393" textAnchor="middle" fill="#493c45" stroke="none" fontSize="20">Steam vent?</text>
      </g> : scene === "winter" ? <g stroke="#f1dbaf" strokeWidth="4">
        <path d="M68 169H200M78 203H223M91 237H239" /><path d="M182 155L203 169L182 181" /><circle cx="65" cy="136" r="29" fill="#e6c387" stroke="none" />
        <g transform="translate(371 298) rotate(12)"><Rover failed dusty /></g><text x="47" y="88" fill="#fff0d2" stroke="none" fontSize="20">Low winter Sun</text><text x="58" y="389" fill="#fff0d2" stroke="none" fontSize="18">North</text><text x="515" y="389" fill="#fff0d2" stroke="none" fontSize="18">South</text>
      </g> : <>
        {(scene === "summit" || scene === "hills") && <path d="M0 419L172 365L308 307L423 305L640 420" fill="#b68e76" stroke="#957064" strokeWidth="3" />}
        {scene === "plate" && <g stroke="#a27e69" strokeWidth="3"><path d="M341 224H521L581 293H296Z" fill="#e4c9a4" /><path d="M311 277H565M322 254H547" /><path d="M68 370Q156 350 264 308" stroke="#f8e8ca" strokeWidth="7" strokeDasharray="10 12" /></g>}
        {(scene === "scrape" || scene === "scan") && <g><path d="M41 388L446 275L497 293L110 419Z" fill="#b4816b" /><g clipPath={`url(#${id}-soil)`}><path d="M60 391L447 281L476 293L113 413Z" fill="#f7ecce" /><path d="M95 393L439 290" stroke="#d0b7a0" strokeWidth="4" strokeDasharray="8 12" /></g></g>}
        {scene === "trap" && <path d="M154 355Q328 288 462 342L508 399L217 427Z" fill="#e5cd9c" stroke="#956a61" strokeWidth="3" />}
        <g transform={scene === "summit" ? "translate(304 244) scale(.85)" : scene === "archive" ? "translate(208 310) scale(.8)" : scene === "plate" ? "translate(184 336) scale(.85)" : "translate(298 301)"}><Rover failed={failed} dusty={scene === "trap" || scene === "archive"} /></g>
        {scene === "trap" && <path d="M192 337L213 345L234 338L260 357L278 354L307 367L338 348L359 344L389 334L411 350L439 358L466 399L235 417Z" fill="#e5cd9c" stroke="#ae896a" strokeWidth="2" />}
        {(scene === "basalt" || scene === "goethite" || scene === "scan") && <g stroke="#64505a" strokeWidth="3"><path d="M418 359L454 314L509 329L531 371L466 386Z" fill={scene === "scan" ? "#f5e7c7" : "#89808b"} /><ellipse cx="467" cy="346" rx="22" ry="14" fill={scene === "scan" ? "#fff5dc" : "#b4a394"} /><path d="M467 311V252H532" fill="none" strokeDasharray="5 7" /><rect x="466" y="171" width="135" height="67" rx="12" fill="#f9efd8" /><path d="M482 213H502L509 189L518 220L527 197L537 213H585" stroke="#657d6f" fill="none" /></g>}
        {scene === "earth" && <g><circle cx="140" cy="80" r="5" fill="#fff9d9" /><path d="M152 84L205 104" stroke="#e9d4b5" strokeWidth="2" /><text x="214" y="112" fill="#fff1d3" fontSize="19">Earth</text><path d="M291 141L151 85" stroke="#ddc2ab" strokeWidth="2" strokeDasharray="4 8" /></g>}
        {scene === "wind" && <g stroke="#f5e6c9" strokeWidth="5" strokeLinecap="round"><path d="M43 116Q112 85 185 117M25 142Q132 107 219 148M400 117Q490 78 593 112M458 145Q521 119 613 141" /><path d="M100 203Q75 223 99 253T90 294" stroke="#b18e7d" strokeWidth="9" /></g>}
        {scene === "wheel" && <g stroke="#b86a54" strokeWidth="4"><circle cx="228" cy="329" r="33" /><path d="M205 313L146 233H58" fill="none" /><text x="42" y="214" fill="#75483f" stroke="none" fontSize="19">A wheel stops</text></g>}
        {scene === "testbed" && <g stroke="#66505b" strokeWidth="3"><path d="M104 335L475 340L573 380L171 393Z" fill="#bc916d" fillOpacity=".5" /><path d="M104 335V365L171 419L573 406V380M171 393V419" /><path d="M40 100H604M59 100V247M585 100V247" strokeDasharray="6 7" /><text x="66" y="74" fill="#574455" stroke="none" fontSize="21">Test the idea on Earth</text></g>}
        {scene === "archive" && <g stroke="#e1cba9" strokeWidth="3"><path d="M316 177Q363 119 446 133" strokeDasharray="5 8" /><rect x="451" y="123" width="123" height="177" rx="10" fill="#d7c8b1" /><path d="M472 155H555M472 180H555M472 205H539M472 230H548M472 256H534" stroke="#80647c" /><text x="442" y="335" fill="#fff0d2" stroke="none" fontSize="20">The record remains</text></g>}
      </>}
  </svg>;
}
