import { useId } from "react";
import type { PhoenixScene } from "@/lib/phoenix-scenes";

const TITLES: Record<PhoenixScene, string> = {
  launch: "A Delta II launches Phoenix", descent: "Phoenix descends through the atmosphere", parachute: "Phoenix hangs from its parachute", touchdown: "Phoenix touches down in the Arctic", panorama: "Polygon ground around the lander", underneath: "An arm camera looks under the deck", trench: "A trench exposes bright material", vanished: "Bright material disappears over days", clump: "Clumpy soil sits on an oven screen", vibrator: "Shaking soil through a screen", sticky: "Icy shavings stick in the scoop", melt: "Heating releases water vapor", beakers: "Wet chemistry mixes soil and water", perchlorate: "Perchlorate salts in the soil", brine: "Salty brine lowers freezing point", laser: "A laser profiles falling snow", lazarus: "Last signal in winter twilight", frost: "Winter frost covers the lander", shadow: "A later orbital shadow changes", dvd: "An archival DVD waits on the deck",
};

function Phoenix({ firing = false, fan = true }: { firing?: boolean; fan?: boolean }) {
  return <g stroke="#4a4d4a" strokeWidth="3" strokeLinejoin="round"><path d="M-58-18h116l14 36-24 18h-96l-24-18Z" fill="#cfc9b8" /><path d="M-46 36l-20 34M-14 36l-8 34M18 36l8 34M50 36l20 34" stroke="#4a4d4a" strokeWidth="4" />{fan && <><path d="M-58-6H-150V22H-58M58-6H150V22H58" fill="#8ea6ac" /><path d="M-124-6V22M-96-6V22M122-6V22M94-6V22" stroke="#e6ecd8" /></>}<rect x="-26" y="-46" width="52" height="28" rx="6" fill="#b9b29d" /><path d="M0-46V-78" stroke="#4a4d4a" />{firing && <path d="M-34 78v32M0 84v36M34 78v32" stroke="#f3cf8d" strokeWidth="10" strokeLinecap="round" />}</g>;
}

/** Teaching diagrams for Phoenix; not recovered flight imagery or laboratory traces. */
export default function PhoenixIllustration({ scene = "touchdown" }: { scene?: PhoenixScene }) {
  const id = useId().replaceAll(":", "");
  const trench = ["trench", "vanished"].includes(scene);
  const oven = ["clump", "vibrator", "sticky", "melt"].includes(scene);
  const chemistry = ["beakers", "perchlorate", "brine"].includes(scene);
  return <svg viewBox="0 0 640 440" fill="none" className="phoenix-art" data-scene={scene} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${TITLES[scene]} · stylized teaching diagram, not to scale`}</title>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#27334d" /><stop offset="1" stopColor="#a7b0aa" /></linearGradient></defs>
    <rect width="640" height="440" fill={`url(#${id}-sky)`} />
    <path d="M0 330Q160 292 320 316Q480 294 640 326V440H0Z" fill="#b8b1a2" />
    <path d="M0 384Q210 348 420 370Q540 356 640 380V440H0Z" fill="#989280" />
    <g stroke="#80796e" strokeWidth="2"><path d="M24 354l56-7M116 386l64-8M254 392l70-7M430 388l66-6M82 410l52-5M512 406l58-6" /></g>

    {scene === "launch" && <><g transform="translate(320 244)"><path d="M-28-74h56l13 105-23 57h-52l-9-57Z" fill="#d7d2bd" stroke="#465257" strokeWidth="3" /><path d="M-12 88l-18 52h54l-16-52M32 88l18 52H-4l16-52" fill="#c9804d" /><path d="M0 150v54" stroke="#f3cf8d" strokeWidth="14" strokeLinecap="round" /></g><text x="66" y="84" fill="#f7eed7" fontSize="21">Delta II leaves Cape Canaveral</text></>}
    {scene === "descent" && <><path d="M86 112Q320 34 554 104" stroke="#d8e2c8" strokeWidth="4" strokeDasharray="9 10" /><g transform="translate(150 260) scale(.48)"><Phoenix fan={false} /></g><circle cx="74" cy="86" r="10" fill="#f7eed7" /><text x="66" y="414" fill="#f7eed7" fontSize="18">Entry, parachute, then powered descent</text></>}
    {scene === "parachute" && <><g stroke="#d8e2c8" strokeWidth="3"><path d="M228 71Q328-9 428 71L413 90Q328 57 244 90Z" fill="#ccc9ae" /><path d="M244 89L297 187M413 89L361 187" /></g><g transform="translate(329 240) scale(.62)"><Phoenix fan={false} /></g><text x="66" y="414" fill="#f7eed7" fontSize="18">Perspective photo · lander was 20 km ahead of crater</text></>}
    {scene === "touchdown" && <><g transform="translate(319 278) scale(.86)"><Phoenix firing /></g><text x="66" y="86" fill="#f7eed7" fontSize="21">First powered soft landing since Viking 2</text><text x="66" y="414" fill="#f7eed7" fontSize="18">Illustrated touchdown · not a photograph</text></>}

    {trench && <><path d="M92 318h456v62H92Z" fill="#8f8678" stroke="#6f675c" strokeWidth="3" /><path d="M120 318l54-34h250l62 34" stroke="#f4ecd2" strokeWidth="5" />{scene === "trench" && <g fill="#f4ecd2"><rect x="196" y="330" width="18" height="16" /><rect x="224" y="335" width="15" height="14" /><rect x="400" y="332" width="17" height="15" /></g>}<text x="96" y="296" fill="#f4ecd2" fontSize="19">{scene === "trench" ? "Bright material after digging" : "The bright material is gone days later"}</text><text x="96" y="414" fill="#f7eed7" fontSize="18">Teaching trench · not the flight image</text></>}

    {oven && <><rect x="70" y="96" width="500" height="190" rx="16" fill="#d9d6c8" stroke="#465257" strokeWidth="3" /><rect x="112" y="128" width="150" height="78" rx="10" fill="#b9b29d" stroke="#465257" /><path d="M112 143h150M112 158h150M112 173h150M112 188h150" stroke="#8fa0a0" /><path d="M150 206l38-30 26 24 35-28" stroke="#8a6548" strokeWidth="7" strokeLinecap="round" />{scene === "melt" && <g stroke="#4f7fa8" strokeWidth="4"><path d="M360 132c12 18 12 30 0 42-12-12-12-24 0-42ZM410 132c12 18 12 30 0 42-12-12-12-24 0-42ZM460 132c12 18 12 30 0 42-12-12-12-24 0-42Z" /></g>}<text x="92" y="262" fill="#465257" fontSize="19">{scene === "melt" ? "Heating releases water vapor" : "Sample delivery is part of the measurement"}</text></>}

    {chemistry && <><rect x="92" y="104" width="456" height="168" rx="16" fill="#d9d6c8" stroke="#465257" strokeWidth="3" />{[150, 280, 410].map((x, index) => <g key={x}><rect x={x} y="136" width="84" height="96" rx="10" fill="#eef0de" stroke="#465257" strokeWidth="3" /><path d={`M${x + 12} 204q14-30 28 0t28 0`} stroke={index === 1 ? "#c85c4a" : "#4f7fa8"} strokeWidth="5" /></g>)}<text x="96" y="254" fill="#465257" fontSize="19">{scene === "laser" ? "Sky measurements are separate" : "Soil and water chemistry"}</text></>}

    {scene === "laser" && <><path d="M320 330V112" stroke="#8ee6a8" strokeWidth="5" /><path d="M272 132Q320 112 368 132M288 162Q320 150 352 162M304 192Q320 184 336 192" stroke="#dcead2" strokeWidth="3" /><text x="96" y="96" fill="#f7eed7" fontSize="21">Laser profiles falling snow</text><text x="96" y="414" fill="#f7eed7" fontSize="18">Snow vaporizes before the ground</text></>}
    {scene === "lazarus" && <g transform="translate(320 266)"><Phoenix /></g>}
    {scene === "frost" && <><path d="M70 352Q190 286 320 318Q450 286 570 340V440H0V352Z" fill="#dfe8dd" opacity=".88" /><g transform="translate(320 292) scale(.8)"><Phoenix /></g></>}
    {scene === "shadow" && <><g transform="translate(250 266) scale(.7)"><Phoenix /></g><path d="M300 316q90 28 188 8" stroke="#3f4545" strokeWidth="18" strokeLinecap="round" /><path d="M382 308q58 18 112 6" stroke="#3f4545" strokeWidth="10" strokeLinecap="round" /><text x="76" y="92" fill="#f7eed7" fontSize="21">A changed shadow is evidence to interpret</text></>}
    {scene === "dvd" && <><circle cx="320" cy="250" r="96" fill="#d8d6bd" stroke="#465257" strokeWidth="4" /><circle cx="320" cy="250" r="58" fill="#a9a58d" stroke="#465257" strokeWidth="3" /><circle cx="320" cy="250" r="13" fill="#f4ecd2" stroke="#465257" strokeWidth="3" /><text x="214" y="396" fill="#f7eed7" fontSize="19">Archival DVD on the deck</text></>}
    {(scene === "panorama" || scene === "underneath") && <><g transform="translate(320 278) scale(.8)"><Phoenix /></g>{scene === "underneath" && <path d="M210 362h220v28H210Z" fill="#f4ecd2" opacity=".8" />}</>}
  </svg>;
}
