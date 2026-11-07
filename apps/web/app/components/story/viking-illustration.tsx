import { useId } from "react";
import type { VikingScene } from "@/lib/viking-scenes";

const TITLES: Record<VikingScene, string> = {
  protect: "A bioshield and heat treatment protect a science experiment", site: "Orbital reconnaissance helps choose safer ground", descent: "A parachute and terminal engines slow a Mars lander", touchdown: "Viking's three feet reach Chryse Planitia", scan: "A camera builds an image in strips", jam: "A locking pin prevents the sampler moving", testbed: "Engineers test a repair on an Earth duplicate", scoop: "The sampler transfers soil to the instruments", laboratory: "Different experiments ask different questions of soil", reaction: "A gas signal invites more than one interpretation", organics: "Organic analysis has a detection limit", perchlorate: "Heated sample chemistry can alter organic compounds", power: "RTGs use radioactive-decay heat rather than sunlight", weather: "Repeated observations reveal changing weather", relativity: "A radio link can test additional travel time near the Sun", endurance: "A stationary explorer builds a long record", battery: "Battery capacity matters during a long mission", memory: "A command update must not overlap another subsystem's information", recovery: "Earth attempts to recover a missing downlink", orbit: "Orbital and surface topography help identify a lander",
};

function Lander({ arm = false, firing = false, dishAway = false }: { arm?: boolean; firing?: boolean; dishAway?: boolean }) {
  return <g stroke="#59463f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M-87-3L-49-34H56L93 1L62 46H-58Z" fill="#d6c3a3" />
    <path d="M-87-3L-58 15H62L93 1M-58 15V46M62 15V46" fill="none" stroke="#f8e1b5" />
    <path d="M-64 32L-100 82M65 32L105 82M-4 40L-4 98" strokeWidth="7" />
    <g fill="#b0b5ac"><ellipse cx="-102" cy="86" rx="24" ry="7" /><ellipse cx="107" cy="86" rx="24" ry="7" /><ellipse cx="-4" cy="102" rx="25" ry="7" /></g>
    <g fill="#b7a584"><path d="M-85-14V-48Q-64-76-45-48V-20Z" /><path d="M49-22V-55Q69-80 90-55V-10Z" /></g>
    <g fill="#e5d4b6"><path d="M-75-17V-48M-61-20V-49M62-22V-53M77-17V-50" /></g>
    <path d="M27-25V-90" strokeWidth="6" />
    <g transform={dishAway ? "translate(27 -94) rotate(48)" : "translate(27 -94) rotate(-25)"}><path d="M-31-15Q0 27 31-15Z" fill="#e4dfca" /><path d="M0 9V-28M-9-23H9" /></g>
    <g fill="#cbd6cc"><path d="M-28-29V-69Q-19-80-11-69V-29Z" /><path d="M0-29V-60Q8-70 16-60V-29Z" /></g>
    <path d="M78 8L136-29L139-62" fill="none" stroke="#b9cbb8" />
    <rect x="-58" y="-7" width="23" height="17" rx="3" fill="#846b54" />
    {arm && <><path d="M-52 6L-144 37L-177 68" stroke="#b7bdba" strokeWidth="8" /><path d="M-178 66L-191 74L-177 84L-160 75Z" fill="#dbb881" /></>}
    {firing && <g fill="#ebc08b" stroke="#ca8f66" strokeWidth="2"><path d="M-58 48L-83 102L-47 78L-36 106L-38 48Z" /><path d="M40 49L26 99L51 78L70 105L61 48Z" /></g>}
  </g>;
}

/** AI-assisted teaching art. All diagrams are stylized; no flight telemetry is reconstructed. */
export default function VikingIllustration({ scene = "touchdown", reveal = 100 }: { scene?: VikingScene; reveal?: number }) {
  const id = useId().replaceAll(":", "");
  const progress = Number.isFinite(reveal) ? Math.max(0, Math.min(100, reveal)) : 0;
  const lab = ["laboratory", "reaction", "organics", "perchlorate", "memory"].includes(scene);
  return <svg viewBox="0 0 640 440" fill="none" className="viking-art" data-scene={scene} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${TITLES[scene]} · stylized teaching diagram, not to scale`}</title>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#665767" /><stop offset="1" stopColor="#d0a68b" /></linearGradient><clipPath id={`${id}-scan`}><rect width={640 * progress / 100} height="440" /></clipPath></defs>
    <rect width="640" height="440" fill={`url(#${id}-sky)`} />
    {scene === "relativity" ? <>
      <rect width="640" height="440" fill="#343847" /><circle cx="103" cy="292" r="38" fill="#91b4b1" /><circle cx="319" cy="182" r="60" fill="#e8bd78" /><circle cx="534" cy="106" r="28" fill="#b88068" />
      <path d="M130 263Q269 146 508 101M508 126Q298 271 130 315" stroke="#d9e3c8" strokeWidth="4" strokeDasharray="8 10" />
      <text x="71" y="362" fill="#f5e8d1" fontSize="20">Earth</text><text x="298" y="97" fill="#f5e8d1" fontSize="20">Sun</text><text x="513" y="166" fill="#f5e8d1" fontSize="20">Mars</text>
      <text x="48" y="407" fill="#f5e8d1" fontSize="19">Extra travel time · exaggerated teaching paths</text>
    </> : lab ? <g stroke="#655449" strokeWidth="3" strokeLinejoin="round">
      <rect x="52" y="87" width="536" height="266" rx="20" fill="#ddd1b6" />
      {scene === "memory" ? <>
        {[0,1,2].map(row => [0,1,2,3].map(col => <rect key={`${row}-${col}`} x={83+col*122} y={124+row*64} width="102" height="44" rx="6" fill={col < 2 ? "#9cbeb9" : "#d8b894"} />))}
        <path d="M417 52V101M407 87L417 101L427 87" stroke="#f3e2b9" strokeWidth="5" /><path d="M393 118L444 168M444 118L393 168" stroke="#965646" strokeWidth="6" />
        <text x="94" y="328" fill="#435952" stroke="none" fontSize="19">Radio information</text><text x="348" y="328" fill="#655449" stroke="none" fontSize="19">Update region</text>
        <text x="75" y="399" fill="#fff0d8" stroke="none" fontSize="18">Teaching regions · not the flight memory map</text>
      </> : <>
        {[0,1,2].map(i => <g key={i}><path d={`M${111+i*160} 170V285Q${137+i*160} 320 ${163+i*160} 285V170`} fill={scene === "perchlorate" ? "#c89b85" : "#b7c7b4"} /><ellipse cx={137+i*160} cy="170" rx="26" ry="9" fill="#f1e5ce" /><path d={`M${120+i*160} 271H${155+i*160}`} stroke="#9c7258" strokeWidth="10" />{scene === "reaction" && [0,1,2].map(b => <circle key={b} cx={127+i*160+b*9} cy={237-b*17} r="5" fill="#f0e4c0" />)}</g>)}
        <path d="M149 127H437M310 127V163" stroke="#8c9b85" />
        {scene === "organics" ? <><circle cx="451" cy="214" r="39" fill="#e8d6a8" /><text x="451" y="226" textAnchor="middle" fill="#715746" stroke="none" fontSize="37">?</text></> : scene === "perchlorate" ? <g stroke="#dba873" strokeWidth="5"><path d="M434 241Q421 219 433 203M454 241Q443 219 455 203M474 241Q463 219 475 203" /></g> : null}
        <text x="76" y="393" fill="#fff0d8" stroke="none" fontSize="18">{scene === "reaction" ? "A reaction is a clue, not a life verdict" : scene === "organics" ? "Not detected is not the same as absent" : scene === "perchlorate" ? "Heating can change the sample" : "Different tests. Different questions."}</text>
      </>}
    </g> : <>
      <path d="M0 298Q104 248 221 283Q338 266 440 280Q544 241 640 291V440H0Z" fill="#a7775f" /><path d="M0 356Q169 307 320 346Q468 329 640 356V440H0Z" fill="#bd9373" />
      <g fill="#735d50" stroke="#635147" strokeWidth="2"><path d="M66 351L91 323L119 331L133 356Z" /><path d="M472 337L492 318L525 320L543 341Z" /><path d="M181 390L194 377L218 381L225 393Z" /></g>
      {scene === "site" ? <>
        <path d="M51 51L591 98L552 239L91 201Z" fill="#d6c8aa" stroke="#735a4c" strokeWidth="3" /><path d="M76 79L205 90L217 194L111 178Z" fill="#9c735c" /><path d="M288 103L513 121L497 205L299 193Z" fill="#adc3ad" /><path d="M320 150L340 174L398 135" stroke="#506754" strokeWidth="6" />
        <text x="106" y="145" fill="#fff1d5" fontSize="20">Rougher</text><text x="431" y="171" fill="#455a49" fontSize="20">Safer</text>
        <g transform="translate(323 333) scale(.5)"><Lander /></g>
      </> : scene === "orbit" ? <>
        <path d="M74 82L142 110L119 148L53 123Z" fill="#dacbac" stroke="#635248" strokeWidth="3" /><path d="M74 50L98 59L62 155L38 146M151 83L175 93L139 186L115 177" fill="#729a98" stroke="#635248" strokeWidth="3" />
        <path d="M116 164L333 333M94 164L278 350" stroke="#e8d6ae" strokeWidth="3" strokeDasharray="7 9" /><g transform="translate(334 311) scale(.42)"><Lander /></g><circle cx="332" cy="311" r="79" stroke="#e9d9b6" strokeWidth="3" /><text x="242" y="72" fill="#fff0d8" fontSize="19">Compare orbital and surface views</text>
      </> : scene === "scan" ? <>
        <rect width="640" height="440" fill="#504f53" fillOpacity=".5" /><g clipPath={`url(#${id}-scan)`}><path d="M0 298Q189 251 345 290L640 289V440H0Z" fill="#c5bba6" /><g transform="translate(388 284) scale(.86)"><Lander /></g><path d="M23 351L105 288L147 353ZM453 340L499 287L542 350" fill="#89867b" /></g>
        {progress < 100 && <path d={`M${640*progress/100} 70V410`} stroke="#f1d8a5" strokeWidth="4" />}
        <text x="35" y="47" fill="#fff0d8" fontSize="20">Strip-by-strip teaching reveal</text>
      </> : <>
        {scene === "protect" && <rect x="165" y="96" width="329" height="261" rx="56" fill="#e4d9bd" fillOpacity=".35" stroke="#f2dfb4" strokeWidth="4" />}
        {scene === "descent" && <g stroke="#e9d8b8" strokeWidth="3"><path d="M202 79Q319-2 435 79L412 101Q321 70 224 101Z" fill="#d4be9a" /><path d="M225 100L292 219M411 100L347 219" /></g>}
        <g transform={scene === "descent" ? "translate(325 237) scale(.65)" : "translate(337 279) scale(.9)"}><Lander arm={["scoop","testbed","jam"].includes(scene)} firing={scene === "descent"} dishAway={scene === "recovery"} /></g>
        {scene === "jam" && <><circle cx="199" cy="287" r="29" fill="#dec79b" stroke="#6c5546" strokeWidth="3" /><path d="M191 272L208 301M210 272L191 302" stroke="#995f4d" strokeWidth="5" /><text x="42" y="95" fill="#fff0d8" fontSize="21">Inspect before moving again</text></>}
        {scene === "testbed" && <><path d="M156 348H482M190 365H448" stroke="#d9dbc3" strokeWidth="4" /><rect x="42" y="92" width="148" height="112" rx="12" fill="#d1d9c2" stroke="#5e6b5c" strokeWidth="3" /><path d="M70 139L93 165L152 118" stroke="#68876f" strokeWidth="7" /></>}
        {scene === "power" && <><circle cx="89" cy="87" r="28" fill="#eac68e" /><path d="M255 188Q238 164 256 141M400 181Q382 157 400 134" stroke="#edc08a" strokeWidth="4" /><text x="27" y="409" fill="#fff0d8" fontSize="18">RTG heat → electricity · batteries support peaks</text></>}
        {scene === "weather" && <g stroke="#edd3ad" strokeWidth="3"><path d="M27 68Q126 26 234 67M421 110Q509 66 618 107M47 192Q116 165 170 180" /><path d="M514 216H607M575 200L607 216L575 231" /></g>}
        {scene === "battery" && <g stroke="#586350" strokeWidth="3"><rect x="47" y="66" width="180" height="89" rx="12" fill="#d8d8b9" /><path d="M227 91H240V127H227" fill="#d8d8b9" /><rect x="63" y="83" width="34" height="54" rx="4" fill="#a88c6c" /><text x="115" y="119" fill="#6d604e" stroke="none" fontSize="24">?</text></g>}
        {scene === "recovery" && <><circle cx="97" cy="87" r="26" fill="#97b6b0" /><path d="M129 111L275 193M143 83L292 158" stroke="#e1dcb9" strokeWidth="3" strokeDasharray="8 10" /><text x="43" y="406" fill="#fff0d8" fontSize="18">Search for a downlink · outcome uncertain</text></>}
        {scene === "endurance" && <g fill="#d9cfaa" stroke="#6d6453" strokeWidth="2">{[0,1,2,3].map(i=><rect key={i} x={65+i*128} y="60" width="95" height="59" rx="6" />)}<path d="M90 81H135M218 81H263M346 81H391M474 81H519" /></g>}
      </>}
    </>}
  </svg>;
}
