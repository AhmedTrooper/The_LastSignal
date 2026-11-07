/**
 * Homepage-only decorative AI-assisted SVG art — not a spacecraft reconstruction
 * or a mission photograph. Kept local to the homepage so shared room drawings
 * elsewhere are untouched.
 */
export default function HeroScene({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 480 340" className={`rv-hero-art ${className}`} fill="none" aria-hidden="true">
    <g stroke="#594b78" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <g fill="#b79fce" stroke="none">
        <path d="M84 58l2.6 6.4 6.4 2.6-6.4 2.6-2.6 6.4-2.6-6.4-6.4-2.6 6.4-2.6z" />
        <path d="M322 32l2.2 5.4 5.4 2.2-5.4 2.2-2.2 5.4-2.2-5.4-5.4-2.2 5.4-2.2z" />
        <path d="M446 176l2 4.8 4.8 2-4.8 2-2 4.8-2-4.8-4.8-2 4.8-2z" />
        <path d="M58 186l1.8 4.4 4.4 1.8-4.4 1.8-1.8 4.4-1.8-4.4-4.4-1.8 4.4-1.8z" />
        <circle cx="140" cy="36" r="2.6" /><circle cx="380" cy="166" r="2.4" /><circle cx="36" cy="108" r="2.2" />
      </g>
      <circle cx="392" cy="78" r="44" fill="#fdf3dd" stroke="#c9b3dd" strokeWidth="2.5" />
      <ellipse cx="392" cy="78" rx="74" ry="26" fill="none" stroke="#b9a4cc" strokeWidth="2.5" strokeDasharray="2 8" transform="rotate(-18 392 78)" />
      <circle cx="86" cy="120" r="17" fill="#c3cfee" strokeWidth="2.5" />
      <path d="M74 112q7-5 13 0t9 3M78 127q6 3 12 1" fill="none" stroke="#9db88f" strokeWidth="2.5" />
      <ellipse cx="237" cy="284" rx="131" ry="20" fill="#d6c9df" stroke="none" />
      <ellipse cx="140" cy="290" rx="22" ry="6" fill="#c4b2d4" stroke="#ae98c4" strokeWidth="2" />
      <ellipse cx="350" cy="298" rx="16" ry="4.5" fill="#c4b2d4" stroke="#ae98c4" strokeWidth="2" />
      <path d="m146 175 132-15 76 47-127 27z" fill="#e9c68a" /><path d="m147 195 80 46 121-26v27l-119 27-81-48z" fill="#ba8f77" />
      <path d="M240 168v-63" strokeWidth="7" /><rect x="211" y="70" width="67" height="43" rx="12" fill="#fcf6df" />
      <circle cx="230" cy="88" r="6" fill="#746190" /><circle cx="258" cy="88" r="6" fill="#746190" /><path d="M237 104q9 7 16-1" strokeWidth="2" />
      <circle cx="228" cy="85.5" r="1.7" fill="#fff9ed" stroke="none" /><circle cx="256" cy="85.5" r="1.7" fill="#fff9ed" stroke="none" />
      <path d="M290 76q11 8 0 17m10-21q15 12 0 25" fill="none" stroke="#a58bbd" strokeWidth="2.5" />
      {[165, 228, 300].map((x, i) => <g key={x}><path d={`M${x} 222v36`} /><ellipse cx={x} cy={i === 1 ? 271 : 252} rx="22" ry="25" fill="#81738f" /><ellipse cx={x} cy={i === 1 ? 271 : 252} rx="10" ry="13" fill="#d9c8b2" /></g>)}
      <path d="m338 217 29 19 11 28-27 8" stroke="#bfa488" strokeWidth="7" /><circle cx="351" cy="272" r="4" fill="#e6a45f" strokeWidth="2" />
    </g>
  </svg>;
}
