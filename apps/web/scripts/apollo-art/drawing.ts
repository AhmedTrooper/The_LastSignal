/** Original SVG drawing vocabulary for the Apollo storyboards. Coordinates are illustration units. */
export const W = 1440;
export const H = 1200;
export const ink = "#11283b";
export const gold = "#e9bc68";
export const mint = "#bdd3c9";
export const paper = "#eee6cf";
export type Tone = "night" | "paper" | "rust";
export const escape = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
export const group = (x: number, y: number, scale: number, body: string, angle = 0) => `<g transform="translate(${x} ${y}) scale(${scale}) rotate(${angle})">${body}</g>`;
export const text = (x: number, y: number, s: string, size = 26, color = paper, extra = "") => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, sans-serif" font-size="${size}" ${extra}>${escape(s)}</text>`;
export const label = (x: number, y: number, s: string, color = mint) => `<text x="${x}" y="${y}" fill="${color}" font-family="monospace" font-size="19" letter-spacing="2">${escape(s)}</text>`;
export const path = (d: string, fill = "none", stroke = ink, width = 3, extra = "") => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
export const box = (x: number, y: number, w: number, h: number, fill: string, radius = 12, stroke = ink) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
export const circle = (x: number, y: number, r: number, fill: string, stroke = "none", sw = 2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
export const ellipse = (x: number, y: number, rx: number, ry: number, fill: string, stroke = ink, sw = 3) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
export const arrow = (d: string, end: string, color = gold) => path(d, "none", color, 4, 'stroke-dasharray="8 10"') + path(end, "none", color, 4);
export const stars = (seed = 0) => `<g opacity=".65">${Array.from({ length: 28 }, (_, i) => circle(80 + ((i * 149 + seed * 31) % 1270), 130 + ((i * 97 + seed * 53) % 780), i % 7 === 0 ? 2.3 : 1.1, mint)).join("")}</g>`;
export const frame = (title: string, alt: string, body: string, tone: Tone = "night") => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
<title id="title">${escape(title)}</title><desc id="desc">${escape(alt)} AI-assisted illustration, not a photograph or a to-scale reconstruction.</desc>
<defs>
<linearGradient id="sky" x2=".7" y2="1"><stop stop-color="${tone === "paper" ? "#f4ecd7" : tone === "rust" ? "#3e2e30" : "#081525"}"/><stop offset="1" stop-color="${tone === "paper" ? "#d4dac9" : tone === "rust" ? "#684b3c" : "#233b4e"}"/></linearGradient>
<linearGradient id="metal" x2=".8" y2="1"><stop stop-color="#eff0d6"/><stop offset=".45" stop-color="#a8bcb4"/><stop offset="1" stop-color="#496575"/></linearGradient>
<linearGradient id="foil" x2=".8" y2="1"><stop stop-color="#fae3a5"/><stop offset=".45" stop-color="#d2a04d"/><stop offset="1" stop-color="#84572b"/></linearGradient>
<linearGradient id="visor" x2="1" y2="1"><stop stop-color="#f0cd75"/><stop offset=".5" stop-color="#ad782c"/><stop offset="1" stop-color="#182738"/></linearGradient>
<radialGradient id="earth"><stop stop-color="#73a6a5"/><stop offset=".75" stop-color="#254e70"/><stop offset="1" stop-color="#142b47"/></radialGradient>
<pattern id="grain" width="31" height="29" patternUnits="userSpaceOnUse"><circle cx="4" cy="7" r=".85" fill="#f4e4b9" opacity=".16"/><circle cx="23" cy="21" r=".7" fill="#071725" opacity=".18"/></pattern>
<clipPath id="round"><rect width="1440" height="1200" rx="36"/></clipPath>
</defs><g clip-path="url(#round)"><path d="M0 0h1440v1200H0z" fill="url(#sky)"/>${body}
<g transform="translate(70 73)">${path("M0 0h30", "none", gold, 4)}${label(48, 6, title.toUpperCase(), tone === "paper" ? ink : paper)}</g>
${box(65, 1128, 715, 36, tone === "paper" ? "#d4d6c1" : "#0b1c2c", 18, "none")}${text(84, 1152, "AI-assisted illustration · not a photograph · explanatory scene", 16, tone === "paper" ? ink : mint)}</g></svg>`;

export function terrain(y = 800, tone: "cool" | "warm" = "cool", seed = 0) {
  const top = tone === "cool" ? "#899f9d" : "#b8a88c";
  return path(`M0 ${y}Q360 ${y - 70} 760 ${y + 15}T1500 ${y - 15}V1200H0Z`, top, "none") +
    path(`M0 ${y + 130}Q400 ${y + 15} 850 ${y + 170}T1500 ${y + 100}V1200H0Z`, tone === "cool" ? "#536f79" : "#847960", "none") +
    Array.from({ length: 8 }, (_, i) => ellipse(60 + (i * 197 + seed * 63) % 1320, y + 44 + (i * 43) % Math.max(60, 1080 - y), 10 + (i % 4) * 18, 4 + (i % 4) * 6, "#435d69", "#bfc9b4", 2)).join("") + path(`M0 ${y}h1440v500H0Z`, "url(#grain)", "none");
}
export const rock = (x: number, y: number, s: number) => group(x, y, s, path("M0 38 24 0 75 8 98 44 55 64Z", "#63757a", "#162d40", 3) + path("m24 0 19 36 55 8M43 36l12 28M0 38l43-2", "none", "#b4b9a6", 2));
export function cabin() {
  return path("M148 84 226 38 328 62 370 138 340 245 169 252 125 185Z", "url(#metal)", ink, 5) +
    path("m226 38 102 24 42 76-75-36-64-41-83 23Z", "#d5decc") +
    path("m295 102 75 36-30 107-57-19Z", "#405e70") +
    path("m162 119 66-21-14 74-67 24Z", "#0b1d32", "#677f83", 6) +
    path("m169 122 49-17-58 76Z", "#213d55", "#ece4bb", 3) +
    path("m254 104 43 12 35 71-68-7Z", "#10253a", "#677f83", 6) +
    path("m262 114 30 8 28 51Z", "#254359", "#e1dabb", 3) +
    path("m183 201 78-6 11 46-84 3Z", "#9fb2a8", "#263f50", 4) + path("m194 211 55-4 8 29-61 3Z", "#c4caba", "#e2d2a8", 2) + path("m231 221 12-1", "none", ink, 3) +
    path("m130 153-33 9-7 70 46 7m220-91 43 18 11 62-58 14", "#112a3e", "#8ba3a1", 3) +
    path("m209 50-2-33 53-5 4 31", "url(#metal)") + ellipse(235, 17, 29, 10, "#082032", "#d9d6b5", 4) +
    path("m168 91-28-50m-33-9q29 38 65 5Z", "#a6bcb5", "#d7d9bf", 3) + path("m115 33 23-29 28 33m-28-33 1 37", "none", "#d6be88", 2) +
    path("m111 153-24-22m24 22-31 8m288-12 26-23m-26 23 31 8", "none", "#b9c9bb", 6) +
    path("m289 246-11 22h39l-10-24", "#344b5e", ink, 3);
}
export function descent() {
  return path("m125 261 193-20 79 47-10 88-67 33-199-22-36-82Z", "url(#foil)", ink, 5) +
    path("m318 241 79 47-10 88-67 33-20-83Z", "#927036") +
    path("m125 261 34 44-38 82m38-82 42 27 29-76 37 57 40-21m-127 54 50 27 37-60 47 74m-4-117 49 24 40-9", "none", "#f5d798", 3) +
    path("m153 259 14 130m94-140 12 153m71-147 6 143", "none", "#182e3b", 13) +
    path("m208 389 55 3 11 24-66 4Z", "#182c3a", "#b3a576", 3) +
    path("M119 319 92 371 47 456M188 374 113 400 47 456M353 325 391 375 447 449M313 391l91 11 43 47M231 383l-19 98M141 280 57 326 30 344", "none", ink, 13) +
    path("M119 319 92 371 47 456M188 374 113 400 47 456M353 325 391 375 447 449M313 391l91 11 43 47M231 383l-19 98M141 280 57 326 30 344", "none", "#b3c1af", 7) +
    path("m75 405-12 26m346-24 17 23m-209 0-3 28", "none", gold, 12) +
    ellipse(44, 462, 38, 11, "url(#metal)") + ellipse(451, 454, 41, 12, "url(#metal)") + ellipse(209, 487, 34, 11, "url(#metal)") + ellipse(26, 349, 25, 8, "url(#metal)") +
    path("m201 254 8 215m47-218-22 219m-29-194 48-3m-47 23 44-2m-43 23 41-2m-40 23 38-2m-37 23 34-2m-33 23 31-2m-30 23 27-2m-26 23 23-2m-22 23 20-2", "none", "#d6ceb0", 3);
}
export const lander = (x: number, y: number, s: number, stage: "all" | "upper" | "lower" = "all", angle = 0) => group(x, y, s, (stage !== "upper" ? descent() : "") + (stage !== "lower" ? cabin() : ""), angle);
export const csm = (x: number, y: number, s: number, angle = 0) => group(x, y, s,
  path("M0 50h150v120H0q-25-60 0-120Z", "url(#metal)", ink, 4) + path("m150 50 100 48v25l-100 47Z", "url(#metal)", ink, 4) + path("m4 133 138 4 8 33H0Z", "#40596b") + box(20, 75, 103, 38, "#173247", 0) + path("m35 75v38m18-38v38m18-38v38m18-38v38m18-38v38", "none", mint, 2) + path("m169 74 24 9-3 16-26-8Z", "#102a41", paper, 2) + path("M-8 83-43 74v65l37-8", "#243d51", "#92aaa8", 3), angle);

export function astronaut(x: number, y: number, s: number, pose: "stand" | "reach" | "kneel" | "walk" = "stand", angle = 0) {
  const legs = pose === "kneel" ? "M88 217 32 273 112 288M138 217 187 269 230 266" : pose === "walk" ? "M88 217 53 296 20 333M133 217 167 278 209 305" : "M88 217 80 323M133 217 151 318";
  const arms = pose === "reach" ? "M63 119 11 156-47 108M143 119 197 146 249 111" : pose === "kneel" ? "M63 119 28 165 5 214M143 119 186 185 229 193" : "M63 119 29 179 47 218M143 119 177 175 164 212";
  return group(x, y, s, box(120, 90, 52, 126, "#afb6a1", 14) + path(legs, "none", ink, 44) + path(legs, "none", "#d8ddc9", 35) +
    path(arms, "none", ink, 35) + path(arms, "none", "#e7e5cf", 27) +
    path("M62 109q45-20 81 0l7 118q-53 22-90-1Z", "#e9e5cf", ink, 4) +
    ellipse(102, 65, 54, 61, "#e5e7d0", ink, 4) + ellipse(105, 63, 42, 45, "url(#visor)", "#c3ad74", 4) + path("M82 41q22-18 43-3", "none", "#fce9ad", 5) +
    box(76, 130, 47, 48, "#9da99e", 5) + circle(88, 143, 4, "#31586c") + circle(108, 143, 4, "#b9964d") +
    path("m143 135q49 74-23 80m-5-37q15 34 28 32", "none", "#6a8583", 8) +
    path("M69 192h71M74 200h63m-66-78h16m37 0h12", "none", "#869991", 4) +
    (pose === "stand" ? path("M51 323h46v22H48ZM129 318h58v22h-63Z", "#a8b8ae") : ""), angle);
}
export const glove = (x: number, y: number, s: number, angle = 0) => group(x, y, s,
  path("M-20 89 60 33l65-25 19 13-23 30 35-12 28 7-1 22-30 11-4 56-50 26-30-19-42 31Z", "#e8e3cd", ink, 4) + path("m69 57 27 76m30-76 8 33m-38 49 30-14M3 84l53 74", "none", "#91a299", 5), angle);
export const boot = (x: number, y: number, s: number, angle = 0) => group(x, y, s,
  path("M12 0h130l-5 84q48 9 72 36l-3 43H-4l-4-40 13-42Z", "#d4d8c1", ink, 5) + path("M-4 142h210v24H-4Z", "#435c64") + path("m28 6 8 75m34-75 5 75m35-74-7 76m-87 21h123m-129 17h155", "none", "#8da39d", 4), angle);
export const footprint = (x: number, y: number, s: number, angle = 0) => group(x, y, s,
  path("M15 0q39-8 50 16l-4 83q-24 30-56 8L0 29Z", "#344e5d", "none") + Array.from({ length: 7 }, (_, i) => path(`M10 ${17 + i * 12}h44`, "none", "#8fa29a", 4)).join(""), angle);

export function dsky(x: number, y: number, s: number, alarm = true) {
  return group(x, y, s, box(0, 0, 500, 590, "#8d9e91", 22) + box(23, 23, 454, 543, "#263b45", 12) +
    box(45, 48, 130, 245, "#1e3540", 4, "#516b6d") + Array.from({ length: 5 }, (_, i) => box(59, 66 + i * 42, 100, 28, i === 1 && alarm ? "#e7be60" : "#68796d", 3)).join("") +
    box(195, 48, 251, 245, "#071f27", 4, "#768e7d") + label(215, 85, "PROG", "#8aa88b") + text(219, 160, alarm ? "1202" : "— — —", 62, "#d6d784") + label(215, 212, "VERB   NOUN", "#7d9e88") + path("M215 242h211m-211 32h211", "none", "#517565", 2) +
    Array.from({ length: 20 }, (_, i) => box(48 + i % 5 * 80, 329 + Math.floor(i / 5) * 53, 62, 39, "#b6c0ab", 4, "#172f3e") + text(65 + i % 5 * 80, 356 + Math.floor(i / 5) * 53, ["VERB", "+", "7", "8", "9", "NOUN", "−", "4", "5", "6", "CLR", "0", "1", "2", "3", "KEY", "REL", "ENTR", "PRO", "RSET"][i], 14, ink)).join("") +
    [circle(14, 15, 4, ink), circle(486, 15, 4, ink), circle(14, 575, 4, ink), circle(486, 575, 4, ink)].join(""));
}
export function seismometer(x: number, y: number, s: number, open = true) {
  const wing = (dx: number) => box(dx, 143, 148, 130, "#365c73", 1, "#b5c3ae") + Array.from({ length: 6 }, (_, i) => path(`M${dx + i * 25} 145v124`, "none", "#839d9c", 1.5)).join("") + path(`M${dx} 176h148m-148 32h148m-148 32h148`, "none", "#a1b7aa", 1.5);
  return group(x, y, s, (open ? wing(-128) + wing(136) : "") + path("M25 82h103v216H25Z", "url(#foil)", ink, 4) + ellipse(76, 83, 52, 15, "#e0c284") + ellipse(76, 298, 53, 14, "#a7894e") + path("M61 83V13h31m-16 3V-15M20 274l-24 43m124-41 29 39m-73-12 1 22", "none", "#cbd2bd", 5) + circle(82, 82, 11, "#aec8a0", ink, 2) + path("M43 159h66m-66 27h66m-66 27h66", "none", "#b79558", 2));
}
export function reflector(x: number, y: number, s: number, angle = 0) {
  return group(x, y, s, path("M12 255 0 307m300-52 31 45M0 310h334", "none", "#b4bfb0", 6) + box(0, 0, 320, 270, "#bb9b60", 10) + box(15, 15, 290, 239, "#2b3942", 3) +
    Array.from({ length: 100 }, (_, i) => { const cx = 31 + i % 10 * 28.5; const cy = 29 + Math.floor(i / 10) * 23.2; return circle(cx, cy, 8, "#d1d8cf", "#91b5ba", 1) + path(`m${cx - 5} ${cy + 4} 5-9 5 9z`, "#a1bfc1", "#e7e8cf", .8); }).join(""), angle);
}
export const tvCamera = (x: number, y: number, s: number, tripod = true) => group(x, y, s,
  (tripod ? path("M117 123v60M117 166 39 314m78-148 71 149m-71-149 4 164", "none", "#b8c5b8", 7) : "") + path("m32 30 134-17 54 37-137 20Z", "#bbc7bd") + path("M32 30v92l51 26V70Z", "#4b6371") + path("m83 70 137-20v91L83 148Z", "#8caaa7") + box(35, 61, 45, 63, "#203e53", 3) + ellipse(34, 89, 15, 30, "#07192c", "#c5d0bd", 3) + path("M123 80v36m12-39v36m12-39v36m12-39v36", "none", "#4a6876", 3) + path("m157 23 6-39 65 5", "none", "#c1c9b5", 4));
export const earth = (x: number, y: number, r: number) => group(x, y, r / 100, circle(0, 0, 100, "url(#earth)", "#a6c5c0", 2) + path("m-52-75-10 42 28 26 9 23 36 3 13 41 25-15-7-38-27-26 4-27-20-21Z", "#96b9a4", "none") + path("M-89-15Q-3-76 83-18M-78 40Q0-3 86 38", "none", "#d3ded0", 7, 'opacity=".5"'));
export const dish = (x: number, y: number, s: number, angle = 0) => group(x, y, s, path("M60 197 28 322h149l-47-127", "#637b81", ink, 4) + path("M-32 67q130 188 253 7Z", "#a8bcb7", ink, 4) + ellipse(94, 69, 126, 28, "#ced3be", ink, 3) + path("M-13 66 93-55 201 66M93-55v128", "none", "#d7c8a1", 4) + circle(93, -55, 8, gold) + path("M42 288h115M52 244h89m-59-45-22 107m50-106 33 108", "none", "#243f51", 3), angle);
export const collector = (x: number, y: number, s: number, foil = true) => group(x, y, s, path("M0 0v440m-29 0h58", "none", "#c8d0bb", 7) + (foil ? path("M0 25h158v259H0Z", "url(#metal)", "#eff0da", 3) + path("M23 30v246m26-246v246m27-246v246m30-246v246m28-246v246", "none", "#b7c9c2", 2) : ""));
export const breakerPanel = (x: number, y: number, s: number, broken = true) => group(x, y, s,
  box(0, 0, 520, 350, "#8fa199", 15) + box(18, 20, 484, 300, "#273e4e", 8) + label(38, 62, "ENGINE ARM", "#e4dec0") +
  Array.from({ length: 6 }, (_, i) => circle(64 + i * 76, 109, 16, "#152737", "#b5b8a0", 3)).join("") +
  Array.from({ length: 5 }, (_, i) => circle(70 + i * 92, 250, 13, "#172a3a", "#9ea992", 3)).join("") +
  circle(260, 180, 44, "#627c83", "#bfc7b3", 4) + circle(260, 180, 26, "#112538", "#c9ba95", 3) + (broken ? circle(260, 180, 9, "#acb8ab") : box(245, 147, 30, 65, "#152c3e", 5, "#aebead")));
export const pen = (x: number, y: number, s: number, angle = 0) => group(x, y, s, path("M0 0h265l31 9-31 9H0Z", "#b596bc", ink, 3) + path("M9 0v18m29-18v18M247 0v18", "none", "#313c52", 4) + path("M42 4h166", "none", "#e0d7d6", 2), angle);
export const orbiter = (x: number, y: number, s: number, angle = 0) => group(x, y, s,
  path("M0 45 106 8 186 70 76 103Z", "url(#foil)") + path("M0 45v102l77 58V103Z", "#8d7039") + path("m76 103 110-33v94l-109 41Z", "#b7c5b8") +
  path("m99 101 29 239 175-39-35-244Z", "#153b59", "#a8bcb1", 4) + path("m108 158 168-41m-159 107 168-38m-159 106 168-39m-127-182 33 244m18-255 33 244m20-258 33 244", "none", "#75999d", 2) +
  path("m24 57-9-92m-68 0q69 75 135-9Z", "#b9cabe", "#132e43", 3) + path("m-32-34 43-37 48 35", "none", "#e5d3a5", 3) +
  path("m19 148-12 65 40 9 7-52", "#19364c", "#c3c5ae", 3) + ellipse(27, 215, 20, 10, "#071528", "#a2b7af", 3), angle);
export const wave = (x: number, y: number, w: number, h: number, color = mint) => path(`M${x} ${y}h${w * .15}l${w * .04} ${-h * .25} ${w * .04} ${h * .65} ${w * .05} ${-h * 1.25} ${w * .05} ${h * 1.8} ${w * .05} ${-h * 1.5} ${w * .06} ${h * .85} ${w * .06} ${-h * .5} ${w * .06} ${h * .2}H${x + w}`, "none", color, 4);
