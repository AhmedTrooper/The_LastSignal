export type ClubScene = "explorers" | "stories" | "games" | "map" | "photos" | "timeline" | "messages" | "about";

/** Decorative AI-assisted SVG art, not a spacecraft reconstruction or mission photograph. */
export default function WorldIllustration({ scene = "explorers", className = "" }: { scene?: ClubScene; className?: string }) {
  return <svg viewBox="0 0 480 340" className={`club-world-art ${className}`} fill="none" aria-hidden="true">
    {scene === "stories" ? <g stroke="#594b78" strokeWidth="3" strokeLinejoin="round">
      <path d="M102 102q66-26 136 7 70-33 138-7v158q-62-26-138 6-70-32-136-6z" fill="#fff9ed" />
      <path d="M238 109v157m-99-121q39-10 69 3m-69 22q39-10 69 3m-69 23q39-10 69 3m66-51q43-15 70-7m-70 29q43-15 70-7m-70 29q43-15 70-7" stroke="#b29dc6" />
      <path d="M316 97v77l15-13 15 13V94" fill="#dba566" /><path d="m205 272 17 27m35-27 17 27" stroke="#b29dc6" />
    </g> : scene === "photos" ? <g stroke="#594b78" strokeWidth="3" strokeLinejoin="round">
      <g transform="rotate(-9 168 190)"><path d="M77 86h170v210H77z" fill="#fffaf0" /><path d="M91 100h142v148H91z" fill="#9cafd0" /><circle cx="185" cy="142" r="25" fill="#f4d591" /><path d="m92 230 48-68 40 49 51-23v60H92z" fill="#b5bdab" /></g>
      <g transform="rotate(10 312 190)"><path d="M244 111h152v190H244z" fill="#fffaf0" /><path d="M257 126h126v131H257z" fill="#d9aa80" /><path d="M258 224q63-62 125-12v45H258z" fill="#b78064" /><path d="M284 269h67m-56 12h45" stroke="#b29dc6" /></g>
    </g> : scene === "messages" ? <g stroke="#594b78" strokeWidth="3" strokeLinejoin="round">
      <path d="M115 122h254v153H115z" fill="#e6b075" /><path d="m115 125 127 90 127-90m-254 150 89-86m165 86-89-86" />
      <path d="M157 72h171v116l-85 51-86-51z" fill="#fffaf0" /><path d="M199 117q-14-28 8-32 16-4 28 15 14-23 30-15 21 8 4 30l-33 33z" fill="#c493b8" /><path d="M192 166h98m-82 15h66" stroke="#b29dc6" />
    </g> : scene === "map" ? <g stroke="#594b78" strokeWidth="3">
      <circle cx="237" cy="176" r="108" fill="#d9b18d" /><path d="M129 181q102-95 215-2m-184 73q73-71 165-13M225 69q-68 109 0 215m18-215q96 114 3 215" opacity=".5" />
      <path d="M211 140a26 26 0 1 1 52 0c0 23-26 47-26 47s-26-24-26-47z" fill="#8160b8" /><circle cx="237" cy="139" r="9" fill="#fff9ed" />
      <path d="M355 181a19 19 0 1 1 38 0c0 17-19 35-19 35s-19-18-19-35z" fill="#d6965c" /><path d="M374 216q-7 56-92 75" strokeDasharray="5 9" />
    </g> : scene === "timeline" ? <g stroke="#594b78" strokeWidth="3" strokeLinecap="round">
      <path d="M88 222h281q58-3 52-62-3-40-66-40H214" strokeDasharray="5 10" />
      <circle cx="133" cy="222" r="31" fill="#dab786" /><circle cx="264" cy="222" r="40" fill="#a49aca" /><circle cx="359" cy="120" r="27" fill="#d4adbd" />
      <path d="m119 222 9 10 17-22m106 12 9 10 17-22m69-100 8 8 16-19" stroke="#fff9ed" strokeWidth="4" />
      <path d="M99 82h153m-153 21h91m-14 177h147" stroke="#b8a6cc" />
    </g> : <g stroke="#594b78" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="237" cy="284" rx="131" ry="20" fill="#d6c9df" stroke="none" />
      <path d="m146 175 132-15 76 47-127 27z" fill="#e9c68a" /><path d="m147 195 80 46 121-26v27l-119 27-81-48z" fill="#ba8f77" />
      <path d="M240 168v-63" strokeWidth="7" /><rect x="211" y="70" width="67" height="43" rx="12" fill="#fcf6df" />
      <circle cx="230" cy="88" r="6" fill="#746190" /><circle cx="258" cy="88" r="6" fill="#746190" /><path d="M237 104q9 7 16-1" strokeWidth="2" />
      {[165, 228, 300].map((x, i) => <g key={x}><path d={`M${x} 222v36`} /><ellipse cx={x} cy={i === 1 ? 271 : 252} rx="22" ry="25" fill="#81738f" /><ellipse cx={x} cy={i === 1 ? 271 : 252} rx="10" ry="13" fill="#d9c8b2" /></g>)}
      <path d="m338 217 29 19 11 28-27 8" stroke="#bfa488" strokeWidth="7" />
      {scene === "games" && <><path d="M90 48h101v64H90z" fill="#fff9ed" /><path d="M114 71v19m-9-9h19m39-7h.01m11 12h.01" stroke="#8160b8" strokeWidth="5" /><path d="m115 123 16 19" stroke="#b29dc6" /></>}
    </g>}
  </svg>;
}
