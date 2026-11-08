import { useId } from "react";
import type { MplScene } from "@/lib/mpl-scenes";

const TITLES: Record<MplScene, string> = {
  launch: "A Delta II launches Mars Polar Lander", target: "South polar layered terrain", microchip: "A names artifact on the deck", microphone: "A microphone inside the laser package", drop: "Deep Space 2 probes separate", shatter: "A ceramic aeroshell shatters on impact", pierce: "A forebody penetrates the ice", drill: "A buried drill tests for water", descent: "Under the parachute before powered descent", snap: "Landing legs unfold in the air", latch: "A sensor state survives into descent", cutoff: "Engines stop before touchdown", fall: "Unpowered fall to the surface", silence: "No signal after descent", search: "Orbital cameras search the ellipse", frost: "Seasonal frost changes the view", hirise: "Sharper orbital search images", twin: "A twin chassis tests the logic", rules: "Later missions keep descent telemetry on", reborn: "Spare hardware flies as Phoenix", memory: "An archive still rests in the ice",
};

function Lander({ firing = false, dish = true }: { firing?: boolean; dish?: boolean }) {
  return <g stroke="#4a4d4a" strokeWidth="3" strokeLinejoin="round"><path d="M-58-18h116l14 36-24 18h-96l-24-18Z" fill="#cfc9b8" /><path d="M-46 36l-20 34M-14 36l-8 34M18 36l8 34M50 36l20 34" stroke="#4a4d4a" strokeWidth="4" /><path d="M-58-6H-150V22H-58M58-6H150V22H58" fill="#8ea6ac" /><path d="M-124-6V22M-96-6V22M122-6V22M94-6V22" stroke="#e6ecd8" />{dish && <path d="M0-46V-78M-24-60Q0-26 24-60Z" fill="#e0d8bd" stroke="#4a4d4a" />}{firing && <path d="M-34 78v32M0 84v36M34 78v32" stroke="#f3cf8d" strokeWidth="10" strokeLinecap="round" />}</g>;
}

function Probe({ split = false }: { split?: boolean }) {
  return <g stroke="#4a4d4a" strokeWidth="3" strokeLinejoin="round"><path d="M-22-38h44l10 28-14 40h-36l-14-40Z" fill={split ? "#d8d6bd" : "#e7e2cf"} />{split && <path d="M-30 8h60" stroke="#4a4d4a" />}<path d="M0 30v28" stroke="#f3cf8d" strokeWidth="7" strokeLinecap="round" /></g>;
}

/** Teaching diagrams for Mars Polar Lander; not recovered descent imagery or executable procedures. */
export default function MplIllustration({ scene = "fall" }: { scene?: MplScene }) {
  const id = useId().replaceAll(":", "");
  return <svg viewBox="0 0 640 440" fill="none" className="mpl-art" data-scene={scene} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${TITLES[scene]} · stylized teaching diagram, not to scale`}</title>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#25334d" /><stop offset="1" stopColor="#a7b0aa" /></linearGradient></defs>
    <rect width="640" height="440" fill={`url(#${id}-sky)`} />
    <path d="M0 330Q160 292 320 316Q480 294 640 326V440H0Z" fill="#d8d4c6" />
    <path d="M0 384Q210 348 420 370Q540 356 640 380V440H0Z" fill="#b9b4a5" />
    <g stroke="#9b9487" strokeWidth="2"><path d="M24 354l56-7M116 386l64-8M254 392l70-7M430 388l66-6M82 410l52-5M512 406l58-6" /></g>

    {scene === "launch" && <><g transform="translate(320 244)"><path d="M-28-74h56l13 105-23 57h-52l-9-57Z" fill="#d7d2bd" stroke="#465257" strokeWidth="3" /><path d="M-12 88l-18 52h54l-16-52M32 88l18 52H-4l16-52" fill="#c9804d" /><path d="M0 150v54" stroke="#f3cf8d" strokeWidth="14" strokeLinecap="round" /></g><text x="66" y="84" fill="#f7eed7" fontSize="21">Delta II leaves Cape Canaveral</text></>}
    {scene === "target" && <><path d="M88 314h464v58H88Z" fill="#dce4d2" stroke="#465257" strokeWidth="3" /><path d="M88 330h464M88 346h464" stroke="#8fa0a0" /><ellipse cx="320" cy="342" rx="128" ry="16" stroke="#c85c4a" strokeWidth="3" /><text x="96" y="292" fill="#f7eed7" fontSize="21">Layered polar target</text></>}
    {scene === "microchip" && <><rect x="160" y="160" width="320" height="150" rx="18" fill="#d8d6bd" stroke="#465257" strokeWidth="4" /><circle cx="320" cy="235" r="52" fill="#a9a58d" stroke="#465257" strokeWidth="3" /><circle cx="320" cy="235" r="13" fill="#f4ecd2" stroke="#465257" strokeWidth="3" /><text x="204" y="190" fill="#465257" fontSize="21">1,000,000 names</text><text x="160" y="360" fill="#f7eed7" fontSize="19">Names artifact, not a signal</text></>}
    {scene === "microphone" && <><rect x="92" y="104" width="456" height="148" rx="16" fill="#d9d6c8" stroke="#465257" strokeWidth="3" /><path d="M180 178v66M320 178v66M460 178v66M180 211h280" stroke="#8fa0a0" strokeWidth="4" /><path d="M138 244c18-30 36-30 52 0M292 244c18-30 36-30 52 0M448 244c18-30 36-30 52 0" stroke="#4f7fa8" strokeWidth="4" /><text x="96" y="282" fill="#465257" fontSize="19">A tiny microphone, inside a laser package</text></>}

    {scene === "drop" && <><g transform="translate(235 210) scale(.72)"><Probe /></g><g transform="translate(398 268) scale(.72)"><Probe /></g><path d="M150 320h340" stroke="#465257" strokeWidth="4" /><text x="96" y="104" fill="#f7eed7" fontSize="21">Two probes, no parachutes</text></>}
    {scene === "shatter" && <><path d="M188 260l64-58 58 48 52-54" stroke="#d8d6bd" strokeWidth="8" strokeLinecap="round" /><g transform="translate(320 300) scale(.8)"><Probe split /></g><text x="96" y="104" fill="#f7eed7" fontSize="21">Shell shatters; parts separate</text></>}
    {scene === "pierce" && <><g transform="translate(320 296) scale(.86)"><Probe split /></g><path d="M300 356v52M340 356v52" stroke="#465257" strokeWidth="4" /><text x="96" y="104" fill="#f7eed7" fontSize="21">Forebody burrows underground</text></>}
    {scene === "drill" && <><path d="M120 320h400v64H120Z" fill="#b9b4a5" stroke="#465257" strokeWidth="3" /><g transform="translate(320 284) scale(.66)"><Probe split /></g><path d="M374 288l52 26" stroke="#c85c4a" strokeWidth="5" /><text x="96" y="104" fill="#f7eed7" fontSize="21">A drill intended to test buried ice</text></>}

    {scene === "descent" && <><g stroke="#d8e2c8" strokeWidth="3"><path d="M228 71Q328-9 428 71L413 90Q328 57 244 90Z" fill="#ccc9ae" /><path d="M244 89L297 187M413 89L361 187" /></g><g transform="translate(329 240) scale(.62)"><Lander dish={false} /></g><text x="66" y="414" fill="#f7eed7" fontSize="18">Under the parachute · no descent voice yet</text></>}
    {scene === "snap" && <><g stroke="#d8e2c8" strokeWidth="3"><path d="M228 71Q328-9 428 71L413 90Q328 57 244 90Z" fill="#ccc9ae" /><path d="M244 89L297 187M413 89L361 187" /></g><g transform="translate(329 240) scale(.62)"><Lander dish={false} /></g><circle cx="512" cy="304" r="14" fill="#c85c4a" /><text x="66" y="414" fill="#f7eed7" fontSize="18">Deployment can trip a touchdown sensor</text></>}
    {scene === "latch" && <><rect x="92" y="96" width="456" height="148" rx="16" fill="#d9d6c8" stroke="#465257" strokeWidth="3" /><rect x="150" y="140" width="340" height="62" rx="10" fill="#eef0de" stroke="#c85c4a" strokeWidth="4" /><text x="172" y="179" fill="#8e3f35" fontSize="21">TOUCHDOWN = TRUE</text><text x="96" y="270" fill="#465257" fontSize="19">Old state must not survive</text></>}
    {scene === "cutoff" && <><g transform="translate(320 250) scale(.78)"><Lander /></g><path d="M220 322h200" stroke="#c85c4a" strokeWidth="5" /><text x="96" y="104" fill="#f7eed7" fontSize="21">Cutoff before contact</text></>}
    {scene === "fall" && <><g transform="translate(320 258) scale(.78)"><Lander /></g><path d="M320 330v58" stroke="#d8e2c8" strokeWidth="4" strokeDasharray="8 9" /><text x="96" y="104" fill="#f7eed7" fontSize="21">Unpowered fall</text></>}

    {scene === "silence" && <><g transform="translate(320 268) scale(.72)"><Lander dish={false} /></g><path d="M410 178L458 226M458 178L410 226" stroke="#c85c4a" strokeWidth="6" strokeLinecap="round" /><text x="96" y="104" fill="#f7eed7" fontSize="21">No descent voice to hear</text></>}
    {scene === "search" && <><rect x="88" y="96" width="464" height="196" rx="16" fill="#d9d6c8" stroke="#465257" strokeWidth="3" /><path d="M120 132h400M120 176h400M120 220h400M208 112v164M320 112v164M432 112v164" stroke="#8fa0a0" /><circle cx="392" cy="238" r="28" stroke="#c85c4a" strokeWidth="4" /><text x="96" y="314" fill="#465257" fontSize="19">Search grid, tiny target</text></>}
    {scene === "frost" && <><path d="M70 352Q190 286 320 318Q450 286 570 340V440H0V352Z" fill="#dfe8dd" opacity=".88" /><g transform="translate(320 292) scale(.7)"><Lander dish={false} /></g><text x="96" y="104" fill="#f7eed7" fontSize="21">Seasonal frost changes the view</text></>}
    {scene === "hirise" && <><rect x="88" y="96" width="464" height="196" rx="16" fill="#d9d6c8" stroke="#465257" strokeWidth="3" /><path d="M128 128h384M128 162h384M128 196h384M128 230h384" stroke="#8fa0a0" /><circle cx="320" cy="214" r="24" stroke="#465257" strokeWidth="4" /><text x="96" y="314" fill="#465257" fontSize="19">Sharper images, still a hard search</text></>}

    {scene === "twin" && <><g transform="translate(320 258) scale(.78)"><Lander dish={false} /></g><path d="M210 178h220" stroke="#d8e2c8" strokeWidth="3" strokeDasharray="7 8" /><text x="96" y="104" fill="#f7eed7" fontSize="21">Test the logic on spare hardware</text></>}
    {scene === "rules" && <><path d="M320 320v-150M286 136l34 34 34-34" stroke="#8ee6a8" strokeWidth="6" fill="none" /><path d="M180 322h280" stroke="#d8e2c8" strokeWidth="3" /><text x="96" y="104" fill="#f7eed7" fontSize="21">Live telemetry during descent</text></>}
    {scene === "reborn" && <><g transform="translate(320 266) scale(.8)"><Lander firing /></g><text x="96" y="104" fill="#f7eed7" fontSize="21">Patched hardware flies again</text></>}
    {scene === "memory" && <><circle cx="320" cy="250" r="96" fill="#d8d6bd" stroke="#465257" strokeWidth="4" /><circle cx="320" cy="250" r="58" fill="#a9a58d" stroke="#465257" strokeWidth="3" /><circle cx="320" cy="250" r="13" fill="#f4ecd2" stroke="#465257" strokeWidth="3" /><text x="214" y="396" fill="#f7eed7" fontSize="19">An archive rests in the ice</text></>}
  </svg>;
}
