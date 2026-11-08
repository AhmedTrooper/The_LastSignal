import { useId } from "react";
import type { VikingTwoScene } from "@/lib/viking-two-scenes";
import { VikingLander } from "./viking-illustration";

const TITLES: Record<VikingTwoScene, string> = {
  twins: "Two Viking landers explore different sites", "link-loss": "An orbiter attitude problem disrupts a communications link", descent: "The lander controls descent autonomously", tilt: "A Viking lander leans with a leg on a rock", sampler: "A collector arm can transfer a soil sample", shelter: "A rock shelters a different sampling location", push: "The sampler moves the rock called Mister Badger", "sample-plan": "A moved rock permits a later sampling plan", seismometer: "A deck-mounted detector measures motion", wind: "Wind can shake the lander and its detector", uncertain: "Missing weather data leave a signal ambiguous", ground: "Instrument placement can reduce environmental interference", summer: "The same rocky site can be compared across seasons", frost: "A thin frost coating changes the appearance of the ground", grains: "A proposed deposition mechanism involves dust and ice", seasons: "Repeated pictures help compare seasonal change", relay: "An orbiter forwards stored lander observations", battery: "RTG electricity does not prevent batteries aging", memorial: "The lander memorial name remembers Gerald Soffen", orbit: "Orbital and surface topography help identify the hardware",
};

function Orbiter() {
  return <g stroke="#47565b" strokeWidth="3" strokeLinejoin="round"><path d="M-31-22H24L40 0L22 26H-28L-44 0Z" fill="#cbd0bd" /><path d="M-48-20H-106V21H-48M46-20H107V21H46" fill="#7298a1" /><path d="M-82-20V21M80-20V21" stroke="#c6dcd8" /><path d="M2-22V-43M-24-60Q0-26 24-60Z" fill="#e0d8bd" /></g>;
}

/** Shared lander geometry, with distinct Viking 2 teaching scenes; not recovered imagery. */
export default function VikingTwoIllustration({ scene = "tilt", reveal = 100 }: { scene?: VikingTwoScene; reveal?: number }) {
  const id = useId().replaceAll(":", "");
  const frost = Number.isFinite(reveal) ? Math.min(100, Math.max(0, reveal)) / 100 : 0;
  const science = ["seismometer", "wind", "uncertain", "ground"].includes(scene);
  return <svg viewBox="0 0 640 440" fill="none" className="viking-two-art" data-scene={scene} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${TITLES[scene]} · stylized teaching diagram, not to scale`}</title>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#384d61" /><stop offset="1" stopColor="#b7b1a5" /></linearGradient></defs>
    <rect width="640" height="440" fill={`url(#${id}-sky)`} />
    <path d="M0 292Q121 256 238 279Q370 250 494 280Q579 264 640 288V440H0Z" fill="#9e7b66" /><path d="M0 357Q195 315 380 342Q540 322 640 357V440H0Z" fill="#b89675" />
    <g fill="#746858" stroke="#655b4e" strokeWidth="2"><path d="M63 353L87 316L127 326L147 358Z" /><path d="M445 361L473 326L512 331L538 362Z" /><path d="M209 406L222 389L242 393L252 406Z" /></g>
    {science ? <>
      <g transform="translate(421 261) scale(.66)"><VikingLander /></g><g stroke="#4d5e5d" strokeWidth="3"><rect x="45" y="94" width="263" height="176" rx="17" fill="#d9dfc9" /><path d="M76 222H276M81 114V223" /><path d="M88 193L112 185L129 204L152 149L171 203L198 169L216 211L243 178L270 194" stroke={scene === "wind" ? "#a47b68" : "#729395"} strokeWidth="4" /></g>
      {scene === "uncertain" && <><rect x="166" y="105" width="70" height="148" rx="8" fill="#f0e4bb" /><text x="201" y="204" textAnchor="middle" fill="#7b634c" fontSize="48">?</text></>}
      {scene === "wind" && <path d="M335 116Q399 66 529 110M352 153Q491 127 601 157" stroke="#d8e4d2" strokeWidth="4" />}
      {scene === "ground" && <><path d="M118 319Q155 265 193 319Z" fill="#d1d5c0" stroke="#4d5e5d" strokeWidth="3" /><path d="M156 319V341M130 325H182" stroke="#4d5e5d" strokeWidth="3" /><path d="M125 341H185" stroke="#dbddc9" strokeWidth="6" /></>}
      <text x="34" y="408" fill="#f7eed7" fontSize="18">Illustrative signal · not the Sol 80 waveform</text>
    </> : scene === "grains" ? <g stroke="#526063" strokeWidth="3">
      {[0,1,2].map(i=><g key={i}><circle cx={135+i*185} cy="195" r={30+i*12} fill="#c9d8cb" /><circle cx={135+i*185} cy="195" r="13" fill="#a27658" /></g>)}
      <path d="M183 194H253M371 194H429M506 256V315M493 295L506 315L519 295" stroke="#e7e4c7" />
      <text x="105" y="286" fill="#f7eed7" stroke="none" fontSize="18">Dust</text><text x="280" y="286" fill="#f7eed7" stroke="none" fontSize="18">Water ice</text><text x="464" y="356" fill="#f7eed7" stroke="none" fontSize="18">Settling</text><text x="49" y="405" fill="#f7eed7" stroke="none" fontSize="18">Proposed mechanism · not guaranteed pure ice</text>
    </g> : <>
      {scene === "twins" ? <><g transform="translate(195 262) scale(.66)"><VikingLander /></g><g transform="translate(474 282) rotate(-7) scale(.66)"><VikingLander /></g><text x="83" y="96" fill="#f7eed7" fontSize="21">Two sites can tell different stories</text></>
        : <g transform={scene === "descent" ? "translate(334 222) scale(.67)" : "translate(360 272) rotate(-7) scale(.8)"}><VikingLander arm={["sampler","shelter","push","sample-plan"].includes(scene)} firing={scene === "descent"} /></g>}
      {scene === "tilt" && <path d="M449 352L469 318L485 353Z" fill="#7c6550" stroke="#605442" strokeWidth="3" />}
      {(scene === "shelter" || scene === "push" || scene === "sample-plan") && <>
        <path d={scene === "shelter" ? "M132 356L159 305L201 316L219 356Z" : "M76 351L101 303L149 317L170 352Z"} fill="#695d4b" stroke="#504b40" strokeWidth="3" /><ellipse cx="176" cy="359" rx="42" ry="10" fill="#6e5d49" />
        {scene === "push" && <path d="M219 309H168M187 296L168 309L187 322" stroke="#d8e4c8" strokeWidth="4" />}
        <text x="33" y="72" fill="#f7eed7" fontSize="19">{scene === "shelter" ? "A sheltered location is a question" : scene === "push" ? "Mister Badger names the rock" : "The caption describes a later sampling plan"}</text>
      </>}
      {scene === "link-loss" || scene === "relay" || scene === "orbit" ? <>
        <g transform="translate(175 117) scale(.67)"><Orbiter /></g><path d="M223 155L346 219" stroke="#d6dfc7" strokeWidth="3" strokeDasharray="7 9" />
        {scene !== "link-loss" && <><circle cx="530" cy="68" r="24" fill="#8badb2" /><path d="M249 116L500 69" stroke="#d6dfc7" strokeWidth="3" strokeDasharray="7 9" /></>}
        {scene === "link-loss" && <path d="M252 72L279 99M279 72L252 99" stroke="#d8ac83" strokeWidth="5" />}
      </> : null}
      {scene === "descent" && <g stroke="#d9e2cd" strokeWidth="3"><path d="M228 71Q328-9 428 71L413 90Q328 57 244 90Z" fill="#ccc9ae" /><path d="M244 89L297 187M413 89L361 187" /></g>}
      {scene === "frost" || scene === "seasons" ? <g fill="#e5e8cf" opacity={scene === "seasons" ? .7 : frost}>{[[80,345],[108,334],[478,345],[502,344],[34,376],[75,385],[148,383],[203,369],[263,399],[334,377],[415,392],[578,382],[610,369]].map(([cx,cy])=><ellipse key={cx} cx={cx} cy={cy} rx="19" ry="4" />)}</g> : null}
      {scene === "seasons" && <><circle cx="94" cy="86" r="29" fill="#ead0a0" /><path d="M133 91H230M209 79L230 91L209 103" stroke="#e3e8d0" strokeWidth="3" /><path d="M271 67L286 101L322 112L294 139L286 172L268 141L235 114L265 104Z" fill="#d6e5d9" /></>}
      {scene === "battery" && <g stroke="#52635b" strokeWidth="3"><rect x="41" y="86" width="185" height="91" rx="12" fill="#d4dcca" /><path d="M226 110H238V151H226" fill="#d4dcca" /><rect x="57" y="104" width="39" height="53" rx="5" fill="#9f977b" /><text x="140" y="146" fill="#756c53" stroke="none" fontSize="31">?</text></g>}
      {scene === "memorial" && <><rect x="69" y="71" width="270" height="79" rx="10" fill="#d4d6bb" stroke="#4e625e" strokeWidth="3" /><text x="90" y="107" fill="#4a5a55" fontSize="19">Gerald Soffen</text><text x="90" y="133" fill="#4a5a55" fontSize="16">Memorial Station</text></>}
      {(scene === "frost" || scene === "orbit" || scene === "tilt") && <text x="39" y="408" fill="#f7eed7" fontSize="18">{scene === "frost" ? "Illustrated coating · no temperature or thickness scale" : scene === "orbit" ? "Identification is not a check of electronics" : "Illustrated lean · sources differ on exact angle"}</text>}
    </>}
  </svg>;
}
