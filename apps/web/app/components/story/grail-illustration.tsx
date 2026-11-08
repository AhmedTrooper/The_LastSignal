import { useId } from "react";
import type { GrailScene } from "@/lib/grail-scenes";

const TITLES: Record<GrailScene, string> = {
  launch: "A Delta II Heavy launches the GRAIL twins", cruise: "The twins cruise toward the Moon", l1: "A low-energy route passes near Sun-Earth L1", arrival: "Lunar orbit insertion around New Year", names: "Students name the twins Ebb and Flow", twins: "Two spacecraft fly in tandem", link: "A Ka-band link measures separation speed", mascon: "A hidden mass changes the twins’ motion", farside: "The twins also measure over the far side", moonkam: "Students target MoonKAM images", primary: "Primary science phase in 2012", descent: "The team lowers the orbit", low: "Extended mission at lower altitude", resolution: "Lower passes sharpen the gravity map", map: "A gravity-field map, not a photograph", crust: "Crust thickness from gravity models", porosity: "Porosity in the highland crust", dikes: "Buried magma dikes from gravity signatures", burn: "A final fuel-depletion burn", impact: "Controlled impact on the mountain", memorial: "The Sally K. Ride Impact Site", craters: "Later orbital images of fresh craters",
};

function Twin({ tone = "#cfd8c9", wing = "#9fb7a6" }: { tone?: string; wing?: string }) {
  return <g stroke="#3f4a4d" strokeWidth="3" strokeLinejoin="round"><rect x="-34" y="-24" width="68" height="48" rx="9" fill={tone} /><path d="M-34-18H-96V18H-34M34-18H96V18H34" fill={wing} /><path d="M-66-18V18M66-18V18" stroke="#e6ecd8" /><circle cx="0" cy="0" r="10" fill="#f4ecd2" /><path d="M0-24V-42" stroke="#3f4a4d" /></g>;
}

/** Teaching diagrams for GRAIL; not recovered flight imagery or measured telemetry. */
export default function GrailIllustration({ scene = "twins" }: { scene?: GrailScene }) {
  const id = useId().replaceAll(":", "");
  const ranging = ["link", "mascon"].includes(scene);
  const science = ["map", "crust", "porosity", "dikes"].includes(scene);
  return <svg viewBox="0 0 640 440" fill="none" className="grail-art" data-scene={scene} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${TITLES[scene]} · stylized teaching diagram, not to scale`}</title>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#17243d" /><stop offset="1" stopColor="#5a6d82" /></linearGradient></defs>
    <rect width="640" height="440" fill={`url(#${id}-sky)`} />
    <circle cx="505" cy="92" r="43" fill="#e8e2c8" /><circle cx="492" cy="83" r="38" fill="#dce4d2" />
    <path d="M0 330Q150 286 320 314Q500 292 640 326V440H0Z" fill="#b8b4a8" />
    <path d="M0 382Q210 342 420 368Q540 352 640 378V440H0Z" fill="#98948a" />
    <g fill="#74706a"><path d="M78 359l26-38 38 8 15 33Z" /><path d="M470 361l29-35 38 10 18 31Z" /></g>
    {science ? <>
      <rect x="58" y="82" width="524" height="214" rx="16" fill="#d9d6c8" stroke="#465257" strokeWidth="3" />
      {scene === "map" && <><path d="M74 130h492M74 178h492M74 226h492M120 92v190M250 92v190M380 92v190M505 92v190" stroke="#8fa0a0" /><circle cx="230" cy="150" r="42" fill="#c85c4a" /><circle cx="390" cy="220" r="52" fill="#4f7fa8" /><circle cx="500" cy="135" r="30" fill="#c85c4a" /></>}
      {scene === "crust" && <><path d="M74 130h492" stroke="#465257" strokeWidth="3" /><path d="M74 130h492" stroke="#c85c4a" strokeWidth="10" opacity=".7" /><path d="M120 92v190M310 92v190M500 92v190" stroke="#8fa0a0" /><text x="94" y="190" fill="#465257" fontSize="19">Thin outer crust</text><text x="94" y="252" fill="#465257" fontSize="19">Deep interior</text></>}
      {scene === "porosity" && <><path d="M100 108l46 22-20 42 48 18-16 44 50 8M310 96l34 34-28 42 46 24-18 40M470 110l50 20-18 42 44 22-20 42" stroke="#465257" strokeWidth="3" />{[150, 280, 430, 540].map(x => <g key={x} stroke="#c85c4a" strokeWidth="3"><circle cx={x} cy={150} r={13} /><circle cx={x + 54} cy={214} r={10} /></g>)}<text x="98" y="282" fill="#465257" fontSize="19">Fractured pore space</text></>}
      {scene === "dikes" && <><g stroke="#c85c4a" strokeWidth="12"><path d="M150 104v172M290 92v184M430 104v172" /></g><g stroke="#465257" strokeWidth="2"><path d="M96 92v184M214 92v184M360 92v184M505 92v184" /></g><text x="96" y="282" fill="#465257" fontSize="19">Long buried lava-filled cracks</text></>}
      <text x="72" y="414" fill="#f7eed7" fontSize="18">Illustrative map idea · not measured data</text>
    </> : scene === "launch" ? <>
      <g transform="translate(320 244)"><path d="M-28-74h56l13 105-23 57h-52l-9-57Z" fill="#d7d2bd" stroke="#465257" strokeWidth="3" /><path d="M-16-74h32v96H-16Z" fill="#8ea6ac" /><path d="M-12 88l-18 52h54l-16-52M32 88l18 52H-4l16-52" fill="#c9804d" /><path d="M0 150v54" stroke="#f3cf8d" strokeWidth="14" strokeLinecap="round" /></g>
      <text x="66" y="84" fill="#f7eed7" fontSize="21">Delta II Heavy carries the twins</text><text x="66" y="414" fill="#f7eed7" fontSize="18">Illustrated launch vehicle</text>
    </> : scene === "cruise" || scene === "l1" ? <>
      <path d="M92 324Q260 86 548 116" stroke="#d8e2c8" strokeWidth="4" strokeDasharray="9 10" /><g transform="translate(122 298) scale(.52)"><Twin /></g><g transform="translate(230 228) scale(.52)"><Twin /></g><circle cx="452" cy="126" r="24" fill="#ead0a0" />
      {scene === "l1" && <><circle cx="365" cy="174" r="34" stroke="#d8e2c8" strokeWidth="3" /><text x="342" y="150" fill="#f7eed7" fontSize="19">L1</text><text x="62" y="414" fill="#f7eed7" fontSize="18">Slow cruise route, not a sprint</text></>}
    </> : scene === "burn" || scene === "impact" || scene === "memorial" || scene === "craters" ? <>
      <path d="M88 356L190 258L284 302L386 214L492 286L574 250V440H0V356Z" fill="#a9a49b" stroke="#7d786f" strokeWidth="3" />
      {scene === "burn" && <><g transform="translate(205 211) scale(.44)"><Twin /></g><g transform="translate(385 169) scale(.44)"><Twin /></g><path d="M205 238l-10 34M385 196l-10 34" stroke="#f3cf8d" strokeWidth="9" strokeLinecap="round" /><text x="72" y="86" fill="#f7eed7" fontSize="21">Burn until the tanks run dry</text></>}
      {scene === "impact" && <><g transform="translate(235 202) scale(.5)"><Twin /></g><g transform="translate(418 240) scale(.5)"><Twin /></g><path d="M292 238l54 38M462 266l58 34" stroke="#f3cf8d" strokeWidth="8" strokeLinecap="round" /><circle cx="342" cy="292" r="17" fill="#5a554d" /><circle cx="526" cy="314" r="15" fill="#5a554d" /><text x="72" y="86" fill="#f7eed7" fontSize="21">Thirty seconds apart</text></>}
      {scene === "memorial" && <><rect x="78" y="78" width="290" height="86" rx="10" fill="#d8d6bd" stroke="#465257" strokeWidth="3" /><text x="100" y="112" fill="#465257" fontSize="20">Sally K. Ride</text><text x="100" y="140" fill="#465257" fontSize="16">Impact Site</text></>}
      {scene === "craters" && <><circle cx="275" cy="315" r="25" stroke="#4f5050" strokeWidth="5" /><circle cx="462" cy="330" r="22" stroke="#4f5050" strokeWidth="5" /><path d="M225 315l-28-10M255 340l-22 20M414 330l-28-10M444 352l-22 18" stroke="#2f3333" strokeWidth="4" /><text x="72" y="86" fill="#f7eed7" fontSize="21">Fresh craters, later photographed</text></>}
      <text x="66" y="414" fill="#f7eed7" fontSize="18">Illustrated mountain · not a crater photograph</text>
    </> : <>
      {scene === "names" && <><g transform="translate(205 235) scale(.62)"><Twin /></g><g transform="translate(430 267) scale(.62)"><Twin /></g><rect x="222" y="72" width="196" height="54" rx="8" fill="#d8d6bd" stroke="#465257" strokeWidth="3" /><text x="245" y="107" fill="#465257" fontSize="20">Ebb &amp; Flow</text><text x="72" y="414" fill="#f7eed7" fontSize="18">Names chosen by students</text></>}
      {scene !== "names" && <><g transform="translate(190 250) scale(.66)"><Twin /></g><g transform={scene === "mascon" ? "translate(423 250) scale(.66)" : "translate(420 250) scale(.66)"}><Twin /></g></>}
      {(scene === "link" || scene === "mascon") && <><path d="M266 250h72" stroke="#d8e2c8" strokeWidth="4" strokeDasharray="7 8" />{scene === "mascon" && <><circle cx="478" cy="336" r="46" fill="#c85c4a" opacity=".8" /><circle cx="478" cy="336" r="24" fill="#8e3f35" /></>}</>}
      {scene === "twins" && <path d="M248 250h142" stroke="#d8e2c8" strokeWidth="3" strokeDasharray="7 8" />}
      {scene === "farside" && <><path d="M250 252h140" stroke="#d8e2c8" strokeWidth="3" strokeDasharray="7 8" /><path d="M88 330h464" stroke="#5a6d82" strokeWidth="3" /></>}
      {scene === "moonkam" && <><rect x="74" y="76" width="190" height="62" rx="9" fill="#d8d6bd" stroke="#465257" strokeWidth="3" /><text x="92" y="104" fill="#465257" fontSize="17">Student target</text><text x="92" y="128" fill="#465257" fontSize="14">MoonKAM image</text><path d="M310 250L230 128" stroke="#d8e2c8" strokeWidth="3" strokeDasharray="7 8" /></>}
      {scene === "primary" && <text x="86" y="104" fill="#f7eed7" fontSize="21">Primary science season</text>}
      {scene === "descent" && <><path d="M86 112h180M106 112l-8 60M246 112l8 60" stroke="#d8e2c8" strokeWidth="3" /><text x="86" y="86" fill="#f7eed7" fontSize="21">Lowering the orbit</text></>}
      {scene === "low" && <><path d="M92 332Q320 292 548 332" stroke="#465257" strokeWidth="4" /><text x="86" y="96" fill="#f7eed7" fontSize="21">Extended lower orbit</text></>}
      {scene === "resolution" && <><circle cx="320" cy="250" r="104" stroke="#d8e2c8" strokeWidth="3" /><circle cx="320" cy="250" r="58" stroke="#c85c4a" strokeWidth="4" /><text x="88" y="104" fill="#f7eed7" fontSize="21">Closer can mean sharper</text></>}
      <text x="66" y="414" fill="#f7eed7" fontSize="18">{ranging ? "Illustrative link · not a measured trace" : "Illustrated spacecraft · not to scale"}</text>
    </>}
  </svg>;
}
