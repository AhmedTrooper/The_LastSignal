"use client";

import { useId, type ReactNode } from "react";
import type { RangerScene } from "@/lib/ranger-scenes";

const INK = "#2d2932";
const PAPER = "#f1e7d5";
const SILVER = "#d8d2c4";
const SILVER_DARK = "#aaa294";
const NIGHT = "#1c2432";
const GOLD = "#d3a052";
const RUST = "#b96b47";
const BLUE = "#4d648c";
const PALE = "#f7f1e5";
const RED = "#bd5a4c";
const GREEN = "#6f8b68";

const TITLES: Record<RangerScene, string> = {
  telescope: "An Earth telescope tries to resolve the Moon’s surface",
  tower: "Ranger 7’s conical camera tower and solar panels",
  cameras: "A cutaway of the six RCA Vidicon cameras",
  radio: "Two independent television channels send pictures to Earth",
  failures: "The six Rangers before Ranger 7",
  spark: "The television system switches on during Ranger 6’s ascent",
  corona: "High voltage arcs in the thin upper atmosphere",
  lockout: "Engineers protect the television turn-on circuit",
  launch: "Ranger 7 lifts off on an Atlas-Agena",
  peanuts: "The JPL control room shares lucky peanuts",
  sunlock: "Ranger 7 locks its solar panels on the Sun and antenna on Earth",
  burn: "The hydrazine engine makes a midcourse correction",
  "first-photo": "The first close-up television frame of the Moon",
  guericke: "Guericke Crater grows in the camera frames",
  soil: "A cross-section of the lunar surface",
  downlink: "Ranger 7 sends a stream of pictures to Goldstone",
  "final-frame": "The last full frame from low above the Moon",
  static: "The final transmission is cut by impact",
  cognitum: "A map of Mare Cognitum",
  crater: "Ranger 7’s 14-meter impact crater",
};

function Label({ x, y, children, fill = INK, size = 11, anchor = "start" }: { x: number; y: number; children: ReactNode; fill?: string; size?: number; anchor?: "start" | "middle" | "end" }) {
  return <text x={x} y={y} fill={fill} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize={size} letterSpacing=".04em" textAnchor={anchor}>{children}</text>;
}

function Craft({ x = 0, y = 0, scale = 1, wings = true, dish = true, cameras = true, burn = false }: { x?: number; y?: number; scale?: number; wings?: boolean; dish?: boolean; cameras?: boolean; burn?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
    {wings && <>
      <rect x="104" y="247" width="138" height="58" fill={BLUE} />
      <path d="m104 266 138 0m-138 21 138 0m46-40 0 58m-46-58 0 58" stroke={PALE} strokeWidth="1.2" opacity=".8" />
      <rect x="398" y="247" width="138" height="58" fill={BLUE} />
      <path d="m398 266 138 0m-138 21 138 0m46-40 0 58m-46-58 0 58" stroke={PALE} strokeWidth="1.2" opacity=".8" />
      <path d="M242 258h26m130 0h26M242 294h26m130 0h26" strokeWidth="4" />
    </>}
    <path d="m270 250 50-155 50 155z" fill={SILVER} />
    <path d="M294 167h52m-62 40h72m-82 43h92" stroke={SILVER_DARK} strokeWidth="1.5" />
    <path d="m274 216 92 0 10 36-112 0z" fill={NIGHT} />
    {cameras && [288, 304, 320, 336, 352].map((cx, i) => <g key={cx}><circle cx={cx} cy={232} r="6.5" fill={i === 1 || i === 3 ? GOLD : "#9fa9b8"} stroke={INK} strokeWidth="1.4" /><circle cx={cx - 2} cy={230} r="1.7" fill={PALE} stroke="none" /></g>)}
    <path d="m242 250 78-5 78 5 26 35-26 33H268l-26-33z" fill={SILVER} />
    <path d="M268 285h104m-130 0h10m142 0h10" stroke={SILVER_DARK} strokeWidth="1.5" />
    <circle cx="286" cy="300" r="4" fill={NIGHT} /><circle cx="354" cy="300" r="4" fill={NIGHT} />
    <path d="M305 318h30l11 26h-52z" fill="#6f6872" />
    {burn && <path d="M297 346q23 55 46 0q-7 48-23 62q-16-14-23-62z" fill={GOLD} stroke={RUST} />}
    {dish && <g>
      <path d="M320 95V66" strokeWidth="3" />
      <path d="M274 66q46-36 92 0q-46 28-92 0z" fill={PALE} />
      <path d="M274 66q46 28 92 0" fill="none" />
      <path d="M320 50v15" strokeWidth="2" /><circle cx="320" cy="47" r="3" fill={GOLD} />
    </g>}
    <path d="M250 270h-14v-30" fill="none" strokeWidth="1.8" />
    <circle cx="236" cy="235" r="4" fill={GOLD} />
  </g>;
}

function Moon({ cx = 480, cy = 205, r = 122, dark = false, blur = false }: { cx?: number; cy?: number; r?: number; dark?: boolean; blur?: boolean }) {
  return <g>
    {blur && [1, 2, 3].map(ring => <circle key={ring} cx={cx} cy={cy} r={r + ring * 14} fill="none" stroke={dark ? "#9ea9b8" : "#b8ae9c"} strokeWidth="1.2" opacity={0.28 / ring} />)}
    <circle cx={cx} cy={cy} r={r} fill={dark ? "#8e8a80" : "#d9d1c0"} stroke={INK} strokeWidth="2.4" />
    <g fill={dark ? "#6e6c66" : "#b3aa99"} stroke={dark ? "#5d5b56" : "#8f8574"} strokeWidth="1.4">
      <circle cx={cx - 44} cy={cy - 30} r={23} /><circle cx={cx - 10} cy={cy - 44} r={13} /><circle cx={cx + 34} cy={cy - 10} r={27} />
      <circle cx={cx + 4} cy={cy + 41} r={18} /><circle cx={cx - 59} cy={cy + 39} r={12} /><circle cx={cx + 64} cy={cy + 48} r={9} />
      <circle cx={cx + 45} cy={cy - 58} r={8} /><circle cx={cx - 28} cy={cy + 8} r={6} />
    </g>
    <path d={`M${cx - 34} ${cy - 54}q32-22 63-3`} fill="none" stroke={PALE} strokeWidth="1.2" opacity=".45" />
  </g>;
}

function Earth({ cx = 112, cy = 94, r = 34 }: { cx?: number; cy?: number; r?: number }) {
  return <g>
    <circle cx={cx} cy={cy} r={r} fill="#5a7fa0" stroke={INK} strokeWidth="2" />
    <path d={`M${cx - 25} ${cy - 8}q18-19 36-2t22 3q-8 18-26 19t-32-20z`} fill="#8dad83" opacity=".9" />
    <path d={`M${cx - 18} ${cy + 17}q18-7 32 5`} fill="none" stroke="#b9d1de" strokeWidth="1.4" opacity=".7" />
  </g>;
}

/** AI-assisted illustrative panels. Apparent scale, motion and readouts are not flight telemetry. */
export default function RangerIllustration({ scene, step = 0 }: { scene: RangerScene; step?: number }) {
  const id = useId().replaceAll(":", "");
  const dark = ["failures", "spark", "corona", "launch", "sunlock", "burn", "first-photo", "guericke", "downlink", "final-frame", "static", "cognitum", "crater"].includes(scene);
  return <svg viewBox="0 0 640 440" role="img" aria-label={`Illustrative Ranger 7 scene: ${TITLES[scene]}`} className={`ranger-art ranger-art-${scene}`} data-step={step}>
    <defs>
      <linearGradient id={`${id}-bg`} x2="0" y2="1"><stop stopColor={dark ? "#151c28" : "#f5edde"} /><stop offset="1" stopColor={dark ? "#2a3548" : "#e1d4c0"} /></linearGradient>
      <linearGradient id={`${id}-flame`} x2="0" y2="1"><stop stopColor="#f6d27a" /><stop offset="1" stopColor="#bf5b3f" /></linearGradient>
      <pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke={dark ? "#ffffff" : "#2d2932"} strokeWidth=".5" opacity={dark ? ".06" : ".07"} /></pattern>
    </defs>
    <rect width="640" height="440" fill={`url(#${id}-bg)`} />
    <rect width="640" height="440" fill={`url(#${id}-grid)`} />
    {scene === "telescope" ? <>
      <path d="M0 372q130-54 280-11t360-12v91H0z" fill={dark ? "#222b3b" : "#d6c6ae"} />
      <Moon cx={480} cy={204} r={126} blur />
      <g stroke={INK} strokeWidth="4" fill={SILVER} strokeLinejoin="round">
        <path d="M70 350 110 264l40 86" fill="none" /><path d="M110 264 96 350m14-86 18 86" fill="none" />
        <rect x="58" y="210" width="178" height="42" rx="21" transform="rotate(-18 147 231)" />
        <rect x="218" y="185" width="34" height="56" rx="8" transform="rotate(-18 235 213)" fill={GOLD} />
      </g>
      <path d="M64 390h230" stroke={INK} strokeWidth="3" />
      <Label x={58} y={76} fill={dark ? PALE : INK} size={13}>EARTH TELESCOPE</Label>
      <Label x={58} y={96} fill={dark ? "#b9c2d0" : "#6b655d"}>small surface details blurred together</Label>
      <Label x={384} y={372} fill={dark ? PALE : INK} size={12}>THE MOON</Label>
      <path d="M366 344q-20 0-31 14" fill="none" stroke={dark ? "#b9c2d0" : "#6b655d"} strokeWidth="1.5" strokeDasharray="4 5" />
    </> : scene === "tower" ? <>
      <path d="M0 393q180-48 320-22t320-9v78H0z" fill={dark ? "#2c3648" : "#d9cab4"} />
      <Craft x={0} y={20} scale={0.92} />
      <g stroke={INK} strokeWidth="1.2" fill="none">
        <path d="M320 90 470 62M480 72l-158 35" /><path d="M242 276 92 265" /><path d="M398 276 548 265" /><path d="M305 318 204 342" />
      </g>
      <Label x={482} y={58} fill={INK} size={11}>HIGH-GAIN ANTENNA</Label>
      <Label x={302} y={348} fill={INK} size={11}>HYDRAZINE ENGINE</Label>
      <Label x={22} y={258} fill={INK} size={11}>9,792 SOLAR CELLS</Label>
      <Label x={558} y={258} fill={INK} size={11} anchor="end">4.57 m SPAN</Label>
      <Label x={22} y={62} fill={INK} size={20}>RANGER 7</Label>
      <Label x={22} y={84} fill="#6b655d" size={11}>3.6 m tall · 365.7 kg</Label>
    </> : scene === "cameras" ? <>
      <path d="M0 360h640v80H0z" fill={dark ? "#232c3d" : "#d9cab4"} />
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M180 350h280l-38-250H218z" fill={SILVER} />
        <path d="M218 100h204l-20 90H238z" fill={NIGHT} />
        <path d="M238 190h164l18 160H220z" fill="#c9c2b4" />
      </g>
      {[0, 1, 2, 3, 4, 5].map(i => {
        const x = 248 + (i % 3) * 56;
        const y = 118 + Math.floor(i / 3) * 46;
        return <g key={i} stroke={INK} strokeWidth="2">
          <circle cx={x} cy={y} r="19" fill={i < 2 ? GOLD : "#8d9aab"} />
          <circle cx={x} cy={y} r="10" fill="#3c4657" />
          <circle cx={x - 4} cy={y - 4} r="3" fill={PALE} stroke="none" />
          <Label x={x} y={y + 33} fill={INK} size={9} anchor="middle">{i < 2 ? ["F-a", "F-b"][i] : ["P-1", "P-2", "P-3", "P-4"][i - 2]}</Label>
        </g>;
      })}
      <Label x={36} y={66} fill={INK} size={18}>SIX RCA VIDICON CAMERAS</Label>
      <Label x={36} y={88} fill="#6b655d">2 full-scan · 4 partial-scan</Label>
      <path d="M244 94 206 76M396 94l38-18" stroke={INK} strokeWidth="1.2" />
      <Label x={36} y={390} fill={INK} size={10}>ONE WINDOW · TWO INDEPENDENT TV CHAINS</Label>
    </> : scene === "radio" ? <>
      <path d="M0 370h640v70H0z" fill={dark ? "#242e40" : "#d9cab4"} />
      <Craft x={-8} y={16} scale={0.7} />
      <g stroke={INK} strokeWidth="2" fill={PALE}>
        <rect x={472} y={96} width="120" height="72" rx="7" /><rect x={472} y={196} width="120" height="72" rx="7" />
      </g>
      <Label x={488} y={124} fill={INK} size={10}>CHANNEL F</Label>
      <Label x={488} y={142} fill="#6b655d" size={9}>FULL-SCAN</Label>
      <Label x={488} y={224} fill={INK} size={10}>CHANNEL P</Label>
      <Label x={488} y={242} fill="#6b655d" size={9}>PARTIAL-SCAN</Label>
      <path d="M438 278q26-74 36-150m-36 150q28-54 34-112" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="6 7" />
      <path d="M430 296q-20 12-42 10m42-10q-20 24-50 26m50-26q-20 36-58 42" fill="none" stroke={BLUE} strokeWidth="2" />
      <Label x={36} y={62} fill={INK} size={18}>TWO WAYS TO SEND A PICTURE</Label>
      <Label x={36} y={84} fill="#6b655d">Each channel had its own power, timer and transmitter.</Label>
      <Label x={474} y={318} fill={INK} size={10}>60 W EACH</Label>
    </> : scene === "failures" ? <>
      <rect x="30" y="34" width="580" height="372" rx="8" fill="#18202d" stroke="#66717f" strokeWidth="1.5" />
      <Label x={54} y={68} fill={PALE} size={15}>SIX RANGERS BEFORE ME</Label>
      <Label x={54} y={90} fill="#aeb7c4" size={10}>Block I · Block II · Ranger 6</Label>
      {[1, 2, 3, 4, 5, 6].map((n, i) => {
        const x = 54 + (i % 3) * 184;
        const y = 126 + Math.floor(i / 3) * 112;
        return <g key={n}>
          <rect x={x} y={y} width="152" height="82" rx="6" fill="#232d3e" stroke="#677381" strokeWidth="1.5" />
          <Label x={x + 12} y={y + 24} fill={PALE} size={12}>RANGER {n}</Label>
          <Label x={x + 12} y={y + 45} fill="#aeb7c4" size={9}>{["ORBIT", "ORBIT", "MISSED", "NO DATA", "MISSED", "NO PICTURES"][i]}</Label>
          <path d={`M${x + 98} ${y + 50}l34 18m0-18-34 18`} stroke={RED} strokeWidth="3" />
        </g>;
      })}
      <path d="M54 344h532" stroke="#66717f" strokeWidth="1" />
      <Label x={54} y={370} fill="#d6deda" size={10}>NASA: Ranger 7 was the first clear success after 13 failed U.S. Moon attempts.</Label>
    </> : scene === "spark" ? <>
      <path d="M0 380q140-30 280-12t360-20v92H0z" fill="#202b3c" />
      <g stroke={INK} strokeWidth="2.4" fill={SILVER}>
        <path d="M314 62h40l-6 220h-28z" /><path d="m314 62 20-34 20 34z" fill={RUST} />
        <path d="m308 282 52 0 14 42-80 0z" fill="#7c838e" />
      </g>
      <path d="M330 324q14 52 28 0q-4 44-14 58q-10-14-14-58z" fill={`url(#${id}-flame)`} stroke={RUST} />
      <path d="M348 214q38-16 66-4" fill="none" stroke={GOLD} strokeWidth="2" />
      <path d="m398 198 16 12-18 8" fill="none" stroke={GOLD} strokeWidth="2" />
      <path d="m401 202-14-18m14 18 4-23m-4 23 22-7" stroke={GOLD} strokeWidth="2.4" />
      <circle cx="400" cy="204" r="18" fill="none" stroke={GOLD} strokeWidth="1.2" strokeDasharray="4 5" />
      <Label x={54} y={74} fill={PALE} size={18}>RANGER 6: THE 67-SECOND TURN-ON</Label>
      <Label x={54} y={98} fill="#b9c2d0">About two minutes after launch, the television telemetry switched on.</Label>
      <Label x={54} y={128} fill={GOLD} size={12}>T + ~2 MIN · TV ON 67 s</Label>
      <Label x={430} y={366} fill={PALE} size={10}>ATLAS / AGENA ASCENT</Label>
    </> : scene === "corona" ? <>
      <rect x="36" y="54" width="364" height="294" rx="8" fill="#202a3a" stroke="#788494" strokeWidth="2" />
      <Label x={58} y={86} fill={PALE} size={13}>TELEVISION POWER SUPPLY</Label>
      <g stroke="#9aa6b6" strokeWidth="1.4" fill="none">
        <path d="M60 126h110v64H60m0 32h140v58H60" /><path d="M190 158h78m-78 96h78" />
        <circle cx="286" cy="158" r="17" /><circle cx="286" cy="254" r="17" />
        <path d="M302 158h64v96h-64m0-96v96" />
      </g>
      {[0, 1, 2].map(i => <path key={i} d={`M${272 + i * 14} ${180 + i * 20}q18-24 34 0t30-6`} fill="none" stroke="#c798dc" strokeWidth="2.4" />)}
      <path d="M330 188q22-18 44 0t40-8" fill="none" stroke="#e6c6f0" strokeWidth="2" />
      <Label x={58} y={324} fill="#d8dee8" size={10}>HIGH VOLTAGE CAN ARC IN THE THIN UPPER ATMOSPHERE</Label>
      <g transform="translate(438 62)">
        <rect width="166" height="278" rx="8" fill={PAPER} stroke={INK} strokeWidth="2" />
        <Label x={16} y={28} fill={INK} size={11}>ARC RISK</Label>
        <path d="M22 226h124M22 226V56" stroke={INK} strokeWidth="1.4" />
        <path d="M24 218q34-118 62-62t58-30" fill="none" stroke={RUST} strokeWidth="3" />
        <Label x={26} y={248} fill="#6b655d" size={8}>THIN AIR</Label>
        <Label x={104} y={248} fill="#6b655d" size={8}>SEA LEVEL</Label>
        <Label x={16} y={272} fill="#6b655d" size={9}>Pressure affects breakdown.</Label>
      </g>
    </> : scene === "lockout" ? <>
      <rect x="28" y="38" width="584" height="364" rx="8" fill={PAPER} stroke={INK} strokeWidth="2" />
      <Label x={52} y={74} fill={INK} size={18}>SEAL IT. LOCK IT. WAIT.</Label>
      <Label x={52} y={96} fill="#6b655d">Changes made after Ranger 6</Label>
      <g transform="translate(64 132)" stroke={INK} strokeWidth="2.4">
        <circle cx="96" cy="96" r="78" fill={SILVER} />
        <circle cx="96" cy="96" r="58" fill="#a9b2be" />
        {Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * Math.PI * 2;
          return <circle key={i} cx={96 + Math.cos(a) * 42} cy={96 + Math.sin(a) * 42} r="3.2" fill={INK} />;
        })}
        <path d="M96 38v-18m0 134v18M38 96H20m134 0h18" stroke={GOLD} strokeWidth="3" />
        <path d="M150 154q28 16 46 40" fill="none" stroke={GOLD} strokeWidth="3" />
      </g>
      <g transform="translate(306 126)">
        {["Shield exposed pins", "Lock out TV turn-on", "Activate after separation"].map((text, i) => <g key={text} transform={`translate(0 ${i * 62})`}>
          <rect width="266" height="46" rx="5" fill="#e4d8c5" stroke={INK} strokeWidth="1.6" />
          <rect x="12" y="12" width="22" height="22" rx="4" fill={i === 2 ? GREEN : GOLD} stroke={INK} strokeWidth="1.4" />
          <path d="m17 23 6 7 11-15" fill="none" stroke={PALE} strokeWidth="2.4" />
          <Label x={46} y={28} fill={INK} size={10}>{text}</Label>
        </g>)}
      </g>
      <Label x={52} y={374} fill="#6b655d" size={10}>Not one proven cause — several protections for the next flight.</Label>
    </> : scene === "launch" ? <>
      <path d="M0 300q140-42 270-8t370-20v168H0z" fill="#33465c" />
      <path d="M0 340q180-34 330-6t310-18v124H0z" fill="#25364c" />
      <g stroke={INK} strokeWidth="2.4">
        <path d="M302 74h36l-5 210h-26z" fill={SILVER} />
        <path d="m302 74 18-34 18 34z" fill={RUST} />
        <path d="m296 284 48 0 10 34-68 0z" fill="#6f7884" />
        <path d="M313 318q8 66 14 84q6-18 14-84z" fill={`url(#${id}-flame)`} stroke={RUST} />
      </g>
      <path d="M296 340q-34 24-58 30m90-30q34 24 58 30" fill="none" stroke="#b7c0cc" strokeWidth="12" opacity=".42" />
      <path d="M250 390h140" stroke={GOLD} strokeWidth="4" />
      <Label x={52} y={70} fill={PALE} size={20}>28 JULY 1964</Label>
      <Label x={52} y={94} fill="#c5ced9">16:50:07 UTC · LC-12</Label>
      <Label x={52} y={124} fill={GOLD} size={12}>ATLAS LV-3 AGENA-B</Label>
      <Label x={470} y={366} fill={PALE} size={10}>CAPE CANAVERAL</Label>
      <path d="M470 344q-12-18-2-38" fill="none" stroke={PALE} strokeWidth="1.4" strokeDasharray="4 5" />
    </> : scene === "peanuts" ? <>
      <rect x="22" y="30" width="596" height="380" rx="8" fill="#efe4d0" stroke={INK} strokeWidth="2" />
      <path d="M22 300h596v110H22z" fill="#c9b89e" />
      <g stroke={INK} strokeWidth="2" fill="#354154">
        <rect x="54" y="166" width="180" height="112" rx="5" /><rect x="404" y="166" width="180" height="112" rx="5" />
      </g>
      <path d="M66 190h156M66 210h102M66 230h136M416 190h156M416 210h102M416 230h136" stroke="#8aa0b6" strokeWidth="3" />
      <g stroke={INK} strokeWidth="2.4" fill="#5b4a3d">
        <circle cx="292" cy="116" r="28" /><path d="M264 144q28 16 56 0v82q-28 16-56 0z" />
        <circle cx="366" cy="132" r="24" /><path d="M342 156q24 14 48 0v78q-24 12-48 0z" />
      </g>
      <g transform="translate(286 252)">
        <path d="M0 0h46l-5 54H5z" fill={GOLD} stroke={INK} strokeWidth="2" />
        <path d="M0 14q-16-18 2-24t22 8 22-8 2 24" fill="none" stroke={INK} strokeWidth="2" />
        <Label x={9} y={36} fill={INK} size={8}>PEANUTS</Label>
      </g>
      <Label x={54} y={66} fill={INK} size={18}>JPL CONTROL ROOM</Label>
      <Label x={54} y={88} fill="#6b655d">A small ritual on a high-stakes morning</Label>
      <Label x={54} y={414} fill={INK} size={10}>DICK WALLACE BROUGHT THE PEANUTS · 1964</Label>
    </> : scene === "sunlock" ? <>
      <circle cx="94" cy="86" r="38" fill={GOLD} stroke={INK} strokeWidth="2" />
      <g stroke={GOLD} strokeWidth="2" opacity=".5"><path d="M94 28v-14m0 144v-14M36 86H22m144 0h-14M53 45 43 35m102 102-10-10M135 45l10-10M53 127l-10 10" /></g>
      <Craft x={26} y={22} scale={0.78} />
      <Earth cx={548} cy={344} r={30} />
      <path d="M218 116 468 322" stroke={GOLD} strokeWidth="1.8" strokeDasharray="5 7" fill="none" />
      <path d="M468 322l-18-4m18 4-6-17" stroke={GOLD} strokeWidth="1.8" fill="none" />
      <Label x={30} y={62} fill={PALE} size={13}>SUN LOCK</Label>
      <Label x={474} y={402} fill={PALE} size={13}>EARTH LOCK</Label>
      <Label x={30} y={414} fill="#c4cdd9" size={10}>cold-gas jets turn the spacecraft</Label>
      <path d="M250 286q-18 8-34 4m34-4q-18 18-40 18" fill="none" stroke={PALE} strokeWidth="2" opacity=".7" />
    </> : scene === "burn" ? <>
      <Moon cx={512} cy={228} r={156} dark />
      <Earth cx={70} cy={300} r={26} />
      <path d="M96 288q172-160 356-92" fill="none" stroke={PALE} strokeWidth="1.6" strokeDasharray="5 8" opacity=".55" />
      <Craft x={-46} y={38} scale={0.74} burn />
      <path d="M216 130q86 10 160 64" fill="none" stroke={GOLD} strokeWidth="2.4" />
      <path d="m370 188 18 8-17 10" fill="none" stroke={GOLD} strokeWidth="2.4" />
      <Label x={36} y={72} fill={PALE} size={18}>29 JULY 1964</Label>
      <Label x={36} y={96} fill="#c4cdd9" size={11}>MIDCOURSE CORRECTION</Label>
      <Label x={36} y={126} fill={GOLD} size={12}>50-SECOND BURN</Label>
      <Label x={36} y={396} fill="#c4cdd9" size={10}>A small push changes the arrival point.</Label>
    </> : scene === "first-photo" ? <>
      <rect x="42" y="34" width="556" height="372" rx="10" fill="#151c28" stroke="#8e99a8" strokeWidth="2" />
      <rect x="64" y="58" width="512" height="324" fill="#a6a196" stroke={PALE} strokeWidth="2" />
      <ellipse cx="342" cy="238" rx="166" ry="112" fill="#777369" stroke="#5e5a52" strokeWidth="3" />
      <ellipse cx="342" cy="238" rx="104" ry="68" fill="#8d897e" />
      <path d="M342 178v120m-60-60h120" stroke={PALE} strokeWidth="1" opacity=".55" />
      <circle cx="342" cy="238" r="12" fill="#c9c2b3" stroke="#5e5a52" strokeWidth="2" />
      <path d="M64 58h54M64 58v54M576 58h-54M576 58v54M64 382h54M64 382v-54M576 382h-54M576 382v-54" stroke={PALE} strokeWidth="3" fill="none" />
      <path d="M576 150q30-18 34-44" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="5 7" />
      <Label x={80} y={90} fill={PALE} size={11}>13:08:45 UTC</Label>
      <Label x={80} y={112} fill={PALE} size={11}>2,110 KM</Label>
      <Label x={174} y={360} fill={PALE} size={10}>ALPHONSUS · 108 KM</Label>
    </> : scene === "guericke" ? <>
      <rect width="640" height="440" fill="#151c28" />
      {[0, 1, 2].map(i => {
        const size = 160 + i * 128;
        const x = 90 + i * 86;
        const y = 210 - size / 2;
        return <g key={i} opacity={1 - i * 0.18}>
          <rect x={x} y={y} width={size} height={size} fill="#8f8a80" stroke={PALE} strokeWidth="1.5" />
          <circle cx={x + size / 2} cy={y + size / 2} r={size * 0.27} fill="#6b675f" stroke="#4f4c46" strokeWidth="2" />
          <circle cx={x + size / 2} cy={y + size / 2} r={size * 0.1} fill="#a9a397" />
          <path d={`M${x + 10} ${y + size - 12}h${size - 20}`} stroke={PALE} strokeWidth="1" opacity=".45" />
        </g>;
      })}
      <Label x={36} y={66} fill={PALE} size={18}>GUERICKE CRATER</Label>
      <Label x={36} y={90} fill="#bdc6d2" size={11}>frame after frame · about 63 km across</Label>
      <Label x={36} y={408} fill={PALE} size={10}>illustrative frame sequence, not an exact camera match</Label>
    </> : scene === "soil" ? <>
      <rect x="28" y="36" width="584" height="368" rx="8" fill={PAPER} stroke={INK} strokeWidth="2" />
      <path d="M52 118h536v250H52z" fill="#b9aa93" />
      <path d="M52 148q120-18 230 0t306-6v30q-180 20-300 0t-236 6z" fill="#8f816e" />
      <path d="M52 228q150-26 268 0t268-8v35q-138 22-264 0t-272 8z" fill="#a2937d" />
      {[0, 1, 2, 3, 4, 5, 6].map(i => <circle key={i} cx={100 + i * 76} cy={300 + (i % 3) * 28} r={8 + (i % 4) * 4} fill="#72675a" stroke="#5c5348" strokeWidth="1.5" />)}
      <path d="M52 368h536" stroke={INK} strokeWidth="3" />
      <g transform="translate(408 258)" stroke={INK} strokeWidth="3" fill={SILVER}>
        <path d="M0 48h82l-10 42H10z" /><path d="M18 48V22h46v26" fill="none" /><circle cx="41" cy="10" r="12" fill={GOLD} />
      </g>
      <path d="M404 112v52m0-52h54" stroke={INK} strokeWidth="2" />
      <Label x={54} y={80} fill={INK} size={18}>NOT A SEA OF DUST</Label>
      <Label x={54} y={102} fill="#6b655d">rounded craters · compacted surface material</Label>
      <Label x={54} y={396} fill={INK} size={10}>The images gave confidence for Apollo; Surveyor tested the surface directly.</Label>
      <Label x={414} y={228} fill={INK} size={9}>future lander footpad</Label>
      <path d="M466 240q30 4 40 22" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="4 5" />
    </> : scene === "downlink" ? <>
      <Craft x={-58} y={12} scale={0.7} />
      <g transform="translate(420 258)" stroke={INK} strokeWidth="2.4">
        <path d="M0 60q62-90 124 0q-62 24-124 0z" fill={PALE} />
        <path d="M62 60v52m-34 0h68" fill="none" />
        <circle cx="62" cy="52" r="7" fill={GOLD} />
      </g>
      <path d="M244 142q138 30 236 108" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="6 7" />
      {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${292 + i * 42} ${188 + i * 22})`} opacity={0.55 + i * 0.12}>
        <rect width="38" height="30" fill="#7e8b99" stroke={PALE} strokeWidth="1.2" />
        <path d="M5 22 14 14l8 5 11-9" fill="none" stroke={PALE} strokeWidth="1.2" />
      </g>)}
      <Label x={30} y={62} fill={PALE} size={18}>A STREAM OF PICTURES</Label>
      <Label x={30} y={86} fill="#c4cdd9" size={11}>two 60 W television channels</Label>
      <Label x={446} y={396} fill={PALE} size={10}>GOLDSTONE RECEIVING STATION</Label>
      <Label x={30} y={406} fill={GOLD} size={11}>4,308 FRAMES · ABOUT 17 MINUTES</Label>
    </> : scene === "final-frame" ? <>
      <rect width="640" height="440" fill="#777369" />
      <path d="M0 88q170-40 320-10t320-18v380H0z" fill="#9a9589" />
      <path d="M0 150q160-26 306 0t334-12" fill="none" stroke="#b8b1a4" strokeWidth="2" opacity=".6" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <circle key={i} cx={76 + i * 74} cy={214 + (i % 3) * 54} r={7 + (i % 4) * 5} fill="#6b675f" stroke="#57534c" strokeWidth="2" />)}
      <rect x="48" y="48" width="544" height="344" fill="none" stroke={PALE} strokeWidth="2" />
      <path d="M48 48h54M48 48v54M592 48h-54M592 48v54M48 392h54M48 392v-54M592 392h-54M592 392v-54" stroke={PALE} strokeWidth="4" fill="none" />
      <path d="M468 396v-33" stroke={PALE} strokeWidth="2" /><path d="M468 368h64" stroke={PALE} strokeWidth="2" />
      <Label x={476} y={362} fill={PALE} size={9}>0.5 m</Label>
      <Label x={70} y={88} fill={PALE} size={12}>FINAL FULL FRAME</Label>
      <Label x={70} y={110} fill={PALE} size={10}>about 1,600 ft above the Moon</Label>
      <Label x={70} y={366} fill={PALE} size={10}>small craters · smooth regolith</Label>
    </> : scene === "static" ? <>
      <rect width="640" height="440" fill="#111722" />
      <rect x="34" y="42" width="284" height="356" fill="#8b867b" stroke={PALE} strokeWidth="2" />
      <path d="M34 132q72-22 146 0t138-8v48q-76 20-146 0t-138 8z" fill="#736f66" />
      {[0, 1, 2, 3, 4].map(i => <circle key={i} cx={74 + i * 54} cy={244 + (i % 3) * 38} r={10 + (i % 3) * 5} fill="#5c5851" stroke="#4c4842" strokeWidth="2" />)}
      <g fill={PALE}>
        {Array.from({ length: 34 }, (_, i) => <rect key={i} x={328} y={42 + i * 10.5} width={278} height={i % 4 === 0 ? 6 : i % 3 === 0 ? 3 : 1.5} opacity={i % 5 === 0 ? 0.9 : 0.55} />)}
      </g>
      <path d="M318 42v356" stroke={GOLD} strokeWidth="2" strokeDasharray="5 7" />
      <Label x={54} y={76} fill={PALE} size={11}>SURFACE</Label>
      <Label x={350} y={76} fill={PALE} size={11}>STATIC</Label>
      <Label x={54} y={422} fill={PALE} size={10}>13:25:48.82 UTC · TRANSMISSION CUT BY IMPACT</Label>
    </> : scene === "cognitum" ? <>
      <circle cx="320" cy="228" r="178" fill="#c9c2b3" stroke={INK} strokeWidth="2.4" />
      <g fill="#7f7b71" stroke="#6b675f" strokeWidth="1.2">
        <path d="M194 162q48-42 106-22t62 60q-28 34-82 30t-86-68z" />
        <path d="M344 126q46 8 64 50t-8 72q-40 0-66-38t10-84z" />
        <path d="M184 300q44 18 70 58t92 22q-18 34-64 34t-70-42-28-72z" />
      </g>
      <path d="M320 228v-70m0 140v-70m-70 0h140" stroke={INK} strokeWidth="1.2" opacity=".45" />
      <circle cx="320" cy="228" r="16" fill="none" stroke={RUST} strokeWidth="3" />
      <circle cx="320" cy="228" r="4" fill={RUST} />
      <path d="M338 214 470 148" stroke={RUST} strokeWidth="1.6" />
      <Label x={476} y={142} fill={INK} size={12}>MARE COGNITUM</Label>
      <Label x={476} y={162} fill="#6b655d" size={9}>THE SEA THAT HAS BECOME KNOWN</Label>
      <Label x={58} y={62} fill={INK} size={18}>A NEW PLACE ON THE MAP</Label>
      <Label x={58} y={84} fill="#6b655d">31 July 1964 · 10.6340° S, 339.3230° E</Label>
      <Label x={58} y={410} fill={INK} size={10}>Illustrative map · not a navigation chart</Label>
    </> : scene === "crater" ? <>
      <rect width="640" height="440" fill="#8e8a80" />
      <path d="M0 0h640v440H0z" fill={`url(#${id}-grid)`} opacity=".5" />
      <g stroke="#6f6b63" strokeWidth="2" fill="#77736b">
        {[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={70 + i * 102} cy={80 + (i % 2) * 250} r={12 + (i % 3) * 7} />)}
      </g>
      <ellipse cx="320" cy="220" rx="92" ry="74" fill="#b9b2a5" stroke="#5c5851" strokeWidth="3" />
      <ellipse cx="320" cy="220" rx="56" ry="42" fill="#6f6b63" stroke="#4e4a44" strokeWidth="2" />
      <ellipse cx="320" cy="220" rx="24" ry="16" fill="#8a867c" />
      <g stroke="#d9d2c3" strokeWidth="2" opacity=".55">
        <path d="M320 146v-42m0 232v-42M228 220h-42m268 0h-42M254 154l-30-30m162 192 30 30M386 154l30-30M254 286l-30 30" />
      </g>
      <path d="M470 394h108" stroke={PALE} strokeWidth="2" /><path d="M470 380v28m108-28v28" stroke={PALE} strokeWidth="2" />
      <Label x={470} y={370} fill={PALE} size={10}>14 m</Label>
      <Label x={36} y={60} fill={PALE} size={18}>THE CRATER I LEFT</Label>
      <Label x={36} y={84} fill="#e0d8c8" size={10}>LROC M153014430L · 2010</Label>
      <Label x={36} y={410} fill={PALE} size={10}>Bright ejecta marks a fresh impact in Mare Cognitum.</Label>
    </> : null}
  </svg>;
}
