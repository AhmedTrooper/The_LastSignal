import type { IngenuityScene } from "@/lib/ingenuity-scenes";

/** Stylized teaching drawing, not an engineering reconstruction or live flight diagram. */
export default function IngenuityIllustration({ scene = "hover" }: { scene?: IngenuityScene }) {
  const flying = ["hover", "scout", "camera", "tilt", "rotors"].includes(scene);
  const damaged = scene === "damage";
  return <svg viewBox="0 0 640 380" fill="none" aria-hidden="true" className="ingenuity-art" data-scene={scene}>
    <path d={scene === "sand" || damaged ? "M12 306Q95 227 170 288T337 283T486 285T625 269V368H12Z" : "M12 305Q170 267 340 302T625 292V368H12Z"} fill="#d3b29b" />
    <g stroke="#514b61" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="314" cy="318" rx="77" ry="9" fill="#a58c8e" stroke="none" />
      {scene === "winter" && <><circle cx="540" cy="74" r="31" fill="#e5dcd0" /><path d="M31 270H116M58 286H143" stroke="#a5b6ca" /><path d="M59 89v31m-14-24l28 18m-28 0l28-18M563 208v31m-14-24l28 18m-28 0l28-18" stroke="#9aacc6" /></>}
      <g transform={scene === "tilt" ? "rotate(-13 315 210)" : flying ? "translate(0 -24)" : undefined}>
        <path d="M261 217L226 293M282 229L276 310M365 217L405 291M344 229L354 309" strokeWidth="5" />
        <path d="M220 295H238M268 312H285M397 293H416M346 311H365" strokeWidth="4" />
        <path d="M267 169L324 158L370 176V221L314 238L266 220Z" fill="#e7bd7a" />
        <path d="M267 192L315 210L369 195V221L314 239L267 220Z" fill="#bd9978" />
        <rect x="303" y="212" width="20" height="14" rx="3" fill="#72849c" /><circle cx="313" cy="219" r="4" fill="#dce5ed" />
        <path d="M318 171V70" strokeWidth="8" />
        <path d="M277 76L339 68L365 77L301 86Z" fill="#7e9ba9" />
        <path d="M291 72L317 82M310 70L337 79M330 70L353 77" stroke="#d6e4e5" strokeWidth="2" />
        <path d={damaged ? "M238 104L377 109L390 119L369 122L241 117Z" : "M123 99L453 108L503 123L157 114Z"} fill="#747583" />
        <path d={damaged ? "M261 126L351 132L390 144L274 139Z" : "M173 121L470 133L486 146L149 135Z"} fill="#9997a3" />
        <circle cx="318" cy="111" r="7" fill="#c8b8ad" /><circle cx="318" cy="133" r="6" fill="#c8b8ad" />
      </g>
      {scene === "fabric" && <g><circle cx="517" cy="193" r="62" fill="#f4e5cd" /><path d="M481 164l64-7 9 60-65 8Z" fill="#c7bca4" />{[0,1,2,3,4].map(i=><path key={i} d={`M${488+i*12} 164l7 50`} stroke="#a28c78" strokeWidth="1.5" />)}<path d="M369 82L469 152" strokeDasharray="5 8" /></g>}
      {(scene === "camera" || scene === "scout") && <><path d="M313 227L185 300M323 227L442 300" stroke="#88a9a5" strokeDasharray="5 8" /><path d="M160 309l25-13 26 18M434 311l23-12 28 17" fill="#bc9d8e" /></>}
      {scene === "timing" && <g><rect x="65" y="40" width="89" height="65" rx="8" fill="#dae6df" /><rect x="178" y="40" width="89" height="65" rx="8" fill="#f1e0dc" /><rect x="291" y="40" width="89" height="65" rx="8" fill="#dae6df" /><path d="M194 54l50 36m0-36l-50 36" stroke="#b77c82" /><circle cx="485" cy="70" r="34" fill="#f7ecdc" /><path d="M485 46v24l17 13" /></g>}
      {(scene === "sensor" || scene === "backup" || scene === "patch") && <g><rect x="466" y="175" width="111" height="105" rx="13" fill="#eee7d8" /><rect x="486" y="192" width="29" height="29" rx="4" fill={scene === "sensor" ? "#dab4af" : "#b6c7c1"} /><rect x="532" y="234" width="29" height="29" rx="4" fill="#91afa8" /><path d={scene === "sensor" ? "M488 195l24 23m0-23l-24 23" : "M515 205h32v29"} stroke={scene === "sensor" ? "#b06f78" : "#638d81"} /><path d="M490 251h41" stroke="#638d81" strokeDasharray="3 5" /></g>}
      {(scene === "parachute" || scene === "backshell") && <g><path d="M45 288Q61 251 111 272L146 290L101 306Z" fill="#efe3d1" /><path d="M61 275l46 23m-29-30l46 25" stroke="#b78775" /><path d="M132 296L196 326M148 290L203 320" strokeWidth="1.5" /><path d="M463 321l40-42 40 41-39 14Z" fill="#d8c4a8" /></g>}
      {(scene === "memory" || scene === "records") && <g><rect x="466" y="159" width="112" height="120" rx="12" fill="#e4ded2" /><path d="M486 184H555M486 205H555M486 226H536M486 247H548" stroke="#9b8da0" strokeWidth="3" /><path d="M383 211L451 211" stroke="#92aaa7" strokeDasharray="5 7" /></g>}
      {damaged && <path d="M99 328l62 5 9 11-47-5Z" fill="#87818a" />}
    </g>
  </svg>;
}
