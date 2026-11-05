import { useId } from "react";

type Props = { machine: string; stage: "journey" | "hardware" | "science" | "legacy"; moon: boolean };

/** Original comic art, intentionally stylized rather than a hardware reconstruction. */
export default function ComicScene({ machine, stage, moon }: Props) {
  const id = useId().replaceAll(":", "");
  const dark = stage === "legacy" || stage === "journey";
  const ranger = machine.includes("ranger");
  const surveyor = machine.includes("surveyor");
  const apollo = machine.includes("apollo-11");
  const rover = /mer|pathfinder|rover|spirit|opportunity/.test(machine);
  const helicopter = machine.includes("ingenuity");
  const orbital = machine.includes("lcross") || ranger;
  const separating = apollo && machine.endsWith("part-2") && stage === "journey";
  const ground = moon ? "#b2a9ad" : "#d99a6f";

  const craft = (
    <g stroke="#2b2037" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
      {helicopter ? <>
        <path d="M215 196h70v17h-70z" fill="#617f96" /><path d="m227 213-16 14 47 13 30-21-13-7" fill="#c7ac72" /><path d="M249 174v41m-87-35h174m-162 11h150" strokeWidth="5" /><path d="m217 227-24 37m39-31-10 42m55-45 27 34m-44-27 12 39" /><path d="M183 265h27m81 1h29" /><path d="m172 170 28-7m107 7 29-7" stroke="#ebe3c2" strokeWidth="3" />
      </> : rover ? <>
        <path d="m150 199 118-16 73 43-116 19z" fill="#dab777" /><path d="m153 199 7 22 67 36 1-13m113-18-2 22-111 9" fill="#ad865d" /><path d="m234 190-1-40m-17-17 27-13 24 17-28 17z" fill="#e4d8c5" /><path d="m221 136 9-2m12-4 9-2" stroke="#547e9c" strokeWidth="6" /><path d="m335 223 37-29 17 2m-18-1 22 24" />
        {[168, 223, 290].map((x, i) => <g key={x}><path d={`M${x + 6} 228v26`} /><ellipse cx={x} cy={i === 1 ? 269 : 254} rx="23" ry="25" fill="#51434d" /><ellipse cx={x} cy={i === 1 ? 269 : 254} rx="12" ry="15" fill="#baad93" /><path d={`m${x - 8} ${i === 1 ? 258 : 243} 16 21m-16 0 16-21`} strokeWidth="2" /></g>)}
        <path d="m182 207 49-5m-21 13 49-6m-34 11 50-7" stroke="#674d46" strokeWidth="2" />
      </> : apollo ? <>
        <g transform={separating ? "translate(12,-45)" : undefined}>
        <path d="m219 145 46-4 24 31-7 35-80 3-8-36z" fill="#e2d6c2" /><path d="m211 160 18-2-5 16-22 2m50-18 18 4 4 16-20-5" fill="#567b98" /><path d="m239 209-5 10h20l-4-11" fill="#594755" />
        {separating && <path d="m239 220-9 25 15-5 9 7 7-28" fill="#efc47d" stroke="#9a6650" />}
        </g>
        <path d="m190 215 98-6 21 40-101 10-24-17z" fill="#d6ad61" /><path d="m190 221-42 48m154-45 39 40m-119-10-17 37m53-38 12 37" /><path d="M135 272h28m166-6h27m-164 28h26m40-1h25" strokeWidth="5" /><path d="m217 227-9 48m16-36-11-1m9 12-11-1m9 12-11-1" strokeWidth="2" />
      </> : machine.includes("insight") ? <>
        <ellipse cx="139" cy="222" rx="58" ry="25" fill="#6479a4" /><ellipse cx="355" cy="217" rx="59" ry="25" fill="#6479a4" />
        {[0, 1, 2, 3, 4, 5].map(i => <g key={i} stroke="#d6d4d5" strokeWidth="1.5"><path d={`M139 222l${Math.cos(i * Math.PI / 3) * 53} ${Math.sin(i * Math.PI / 3) * 22}`} /><path d={`M355 217l${Math.cos(i * Math.PI / 3) * 54} ${Math.sin(i * Math.PI / 3) * 22}`} /></g>)}
        <path d="m203 189 79-5 24 34-83 17-35-21z" fill="#dbb872" /><path d="m208 215-37 62m116-66 46 63m-87-45-8 58" /><path d="M159 278h29m132-3h30m-126 15h26" strokeWidth="5" />
        <path d="m244 190 1-26 19-3 9 18-7 12" fill="#e3d7bc" /><path d="m250 173 11-2" stroke="#567b98" strokeWidth="5" />
        <path d={stage === "hardware" || stage === "science" ? "m286 204 40 14 20 38-15 8" : "m286 204 17-17 17 11"} fill="none" stroke="#d9c5a1" strokeWidth="7" /><path d={stage === "hardware" || stage === "science" ? "m286 204 40 14 20 38-15 8" : "m286 204 17-17 17 11"} fill="none" stroke="#2b2037" strokeWidth="2" />
      </> : orbital ? <>
        <path d="m216 175 59-9 23 50-62 8z" fill="#d5b26d" /><path d="m190 190-71-19-7 31 78 19m103-45 71-22 9 31-77 23" fill="#59679b" /><path d="m130 177-5 24m13-20-5 24m-18-12 68 19m130-43 3 25m12-29 4 26" stroke="#e5d6bd" strokeWidth="1.5" /><path d="M245 171v-30m-38-16q38 69 80 0z" fill="#e4d7c3" /><path d="m246 134 4-30" />
      </> : <>
        <path d="m207 193 66-8 35 28-80 22-38-27z" fill="#d4b779" /><path d="m225 185 15-37 17 6 6 34" fill="#ded6c8" /><path d="M247 147v-36m-12-14 27-4 10 19-28 6z" fill="#d4cab9" /><path d="m243 105 13-2" stroke="#567a9b" strokeWidth="5" /><path d="m203 213-49 60m138-59 58 57m-102-40-10 59" /><path d="M143 273h30m164-1h29m-142 21h30" strokeWidth="5" />
        {!surveyor && !machine.includes("viking") && <><path d="m197 205-72-17-29 33 88 18m119-38 66-24 35 34-87 23" fill="#6276a0" /><path d="m118 202 65 24m163-27 26 17" stroke="#d7cfb8" strokeWidth="2" /></>}
        {machine.includes("phoenix") && <path d="m299 217 65 30-19 25h-32" />}
      </>}
      {stage === "science" && <><path d="M385 230v47m-20-45h39v10h-39z" fill="#ddd2ba" /><path d="M362 279h45" /><path d="M410 244q25-6 24-22m-25 15q14-5 14-13" stroke="#769496" strokeWidth="3" /></>}
    </g>
  );

  return (
    <svg viewBox="0 -60 500 380" className="comic-scene-art" role="img" aria-label={`Stylized ${machine.replaceAll("-", " ")} illustration: ${stage}`}>
      <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor={dark ? "#31233f" : moon ? "#716681" : "#efa57f"} /><stop offset="1" stopColor={dark ? "#776078" : moon ? "#cbbdcc" : "#f8d5a8"} /></linearGradient><pattern id={`${id}-dots`} width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#34273e" opacity="0.1" /></pattern></defs>
      <path d="M0-60h500v380H0z" fill={`url(#${id}-sky)`} />
      {dark && Array.from({ length: 25 }, (_, i) => <path key={i} d={`M${(i * 83.1) % 500} ${(i * 39.3) % 180}h3`} stroke="#f3e6c5" strokeWidth={i % 4 === 0 ? 3 : 1.5} />)}
      <circle cx="415" cy="69" r="28" fill={moon ? "#cfcec7" : "#ffd9a2"} stroke="#3b2a43" strokeWidth="2" /><circle cx="406" cy="63" r="5" fill="#766a7c" opacity="0.2" />
      <path d="M-20 229q86-73 186-19t171-12q88-34 181 30v100H-20z" fill={moon ? "#8c8295" : "#b87962"} stroke="#4b3347" strokeWidth="2" />
      <path d="M-20 265q132-46 260-15t286-6v90H-20z" fill={ground} stroke="#5b4053" strokeWidth="2" />
      <path d="M0 240h500v80H0z" fill={`url(#${id}-dots)`} />
      <path d="m37 279 22-10 25 9-28 6zm364 17 32-14 35 11-23 11z" fill="#977583" stroke="#4e3b51" strokeWidth="2" />
      {stage === "journey" && orbital ? <g transform="translate(15,-15) rotate(-20 250 200)">{craft}<path d="m241 229-17 33 7-34" fill="#e9c897" /><path d="m98 167-40-29m60 15-21-28" stroke="#e6d2b9" strokeWidth="3" /></g> : <g transform={stage === "hardware" ? "translate(-68,-39) scale(1.25)" : "translate(0,0)"}>{craft}</g>}
      {stage === "legacy" && <><path d="m275 276 42 38 171 5-203-49" fill="#31243b" opacity="0.4" /><path d="m90 288 60-1m-57 9 58-1" stroke="#795867" strokeWidth="2" strokeDasharray="7 6" /></>}
      {stage === "science" && <g stroke="#fae9b0" strokeWidth="3" fill="none"><path d="m351 181 22-20m-10 45 33-8m-45 25 14 9" /></g>}
      {apollo && stage === "science" && <g><path d="m333 261 60-11 26 18-61 10z" fill="#e0c691" stroke="#2b2037" strokeWidth="2" />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={345 + i % 6 * 8} cy={260 + Math.floor(i / 6) * 6} r="2.5" fill="#dddfea" />)}<path d="m443 125-59 139 33-11 31-75" stroke="#faf0b3" strokeWidth="2" fill="none" strokeDasharray="7 5" /></g>}
      {machine.includes("insight") && stage === "science" && <g><path d="M346 274q25-51 49-4z" fill="#e1d8c0" stroke="#2b2037" strokeWidth="2" /><path d="m351 254 6-8 4 11 6-17 5 22 5-16 5 10 5-5" fill="none" stroke="#faf0b3" strokeWidth="2" /></g>}
      <path d="M0-60h500v380H0z" stroke="#2b2037" strokeWidth="5" fill="none" />
    </svg>
  );
}
