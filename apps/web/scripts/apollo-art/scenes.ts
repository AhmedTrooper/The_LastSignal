import { arrow, astronaut, boot, box, breakerPanel, cabin, circle, collector, csm, descent, dish, dsky, earth, ellipse, footprint, glove, gold, group, ink, label, lander, mint, orbiter, paper, path, pen, reflector, rock, seismometer, stars, terrain, text, tvCamera, wave, type Tone } from "./drawing";

export type StoryScene = {
  key: string;
  title: string;
  alt: string;
  context: string;
  tone?: Tone;
  draw: () => string;
};

const grid = (color = "#738f91") => `<g opacity=".16" stroke="${color}" stroke-width="1">${Array.from({ length: 18 }, (_, i) => path(`M${i * 85} 120v965M50 ${130 + i * 58}h1340`, "none", color, 1)).join("")}</g>`;
const note = (x: number, y: number, lines: string[], color = ink) => lines.map((line, i) => text(x, y + i * 36, line, 25, color)).join("");
const printout = (x: number, y: number, s: number, signal = true) => group(x, y, s, box(0, 0, 440, 300, "#e7dec2", 3, "#7a877f") + `<g opacity=".2">${Array.from({ length: 10 }, (_, i) => path(`M0 ${i * 30}h440M${i * 44} 0v300`, "none", "#738b80", 1)).join("")}</g>` + (signal ? wave(15, 140, 405, 70, "#374f5a") : path("M20 140h400", "none", "#374f5a", 3)));
const moonDisk = (x: number, y: number, r: number) => circle(x, y, r, "#7d9699", "#dce1cb", 3) + ellipse(x - r * .35, y - r * .16, r * .23, r * .32, "#536f7d", "#a1b7b1", 3) + ellipse(x + r * .37, y + r * .28, r * .13, r * .18, "#587480", "#9bb1aa", 2);
const circuit = (x: number, y: number, s: number, closed: boolean) => group(x, y, s, path("M0 90h120m130 0h140v180H0V90", "none", "#718f8e", 6) + circle(120, 90, 10, gold) + circle(250, 90, 10, gold) + path(closed ? "M120 90h130" : "M120 90 232 21", "none", closed ? gold : paper, 8) + box(116, 233, 163, 68, "#304959", 8, mint) + label(145, 274, "CIRCUIT", mint));

/** Each record is a separate shot/action. Hardware symbols are reused for identity, not whole compositions. */
export const SCENES: StoryScene[] = [
  {
    key: "undocking.b03", title: "Two stages. Two jobs.", tone: "paper",
    alt: "An exploded educational diagram separates Eagle's silver crew cabin above its gold landing stage. Fine alignment lines join the two, with callouts explaining the return engine and landing gear.",
    context: "The ascent and descent stages performed different jobs. This exploded view explains their design; the stages remained joined during undocking.",
    draw: () => grid() + group(342, 121, 1.42, cabin()) + group(342, 353, 1.42, descent()) +
      path("M568 488v192m205-192v189", "none", "#789591", 2, 'stroke-dasharray="5 11"') +
      label(1020, 239, "ASCENT", ink) + note(1020, 280, ["Crew cabin", "Return engine"]) + path("M1000 285H931l-70 55", "none", "#708c8b", 2) +
      label(91, 764, "DESCENT", ink) + note(91, 806, ["Landing engine", "Legs and footpads"]) + path("M324 808h88l81-92", "none", "#708c8b", 2) +
      label(843, 1081, "EXPLODED DESIGN VIEW", "#667d79"),
  },
  {
    key: "undocking.b04", title: "Two spacecraft, different paths",
    alt: "A broad Moon fills the lower right while small Columbia remains high above it. Eagle is angled toward the lunar world on a separate, illustrative descending route.",
    context: "Collins stayed in Columbia in lunar orbit as Eagle began its landing journey. The routes in this drawing are conceptual, not plotted mission trajectories.",
    draw: () => stars(4) + moonDisk(1170, 1040, 650) + csm(187, 219, .8, -12) + lander(632, 381, .88, "all", 20) +
      arrow("M203 442Q251 684 486 781", "m469 758 20 25-32 3") +
      path("M75 510Q540-19 1296 395", "none", "#88aaa9", 2, 'stroke-dasharray="8 12"') +
      label(116, 682, "COLUMBIA STAYS IN ORBIT") + label(527, 1019, "EAGLE BEGINS ITS DESCENT", gold),
  },
  {
    key: "alarm.b01", title: "An alarm inside the cabin",
    alt: "A close-up guidance-computer display dominates the dark cockpit. The code 1202 glows beside a warning indicator; a suited arm reaches toward the keypad.",
    context: "A 1202 executive-overflow alarm appeared during powered descent. The drawing is a simplified display illustration; the other readout fields are not fabricated telemetry.",
    draw: () => path("M70 153 1199 130 1410 1100H14Z", "#263e4b", "#6b8485", 6) +
      group(170, 190, 1, dsky(0, 0, 1.3), -5) +
      box(966, 278, 292, 198, "#20303b", 16, "#69827c") + circle(1030, 345, 32, "#dcb763", "#f4d69a", 5) +
      label(1080, 350, "ALARM", gold) + path("M993 415h226", "none", "#90a79a", 3) +
      glove(1060, 958, 1.8, 170) + label(943, 611, "1202", gold) + note(943, 663, ["Too much work.", "Guidance must continue."], paper),
  },
  {
    key: "alarm.b02", title: "Keep the work that matters", tone: "paper",
    alt: "A schematic priority switchboard shows incoming work dividing into a bright route toward guidance and thrusters and a dim route for deferred work.",
    context: "Restart protection preserved essential guidance while lower-priority work was set aside. Arrows and work cards are explanatory metaphors, not a literal circuit diagram.",
    draw: () => grid() + Array.from({ length: 5 }, (_, i) => box(111, 243 + i * 115, 230, 68, i < 2 ? "#c9b379" : "#becbc0", 8) + path(`M138 ${270 + i * 115}h166m-166 18h95`, "none", "#5f7d7b", 3)).join("") +
      arrow("M367 506H491", "m470 489 25 17-25 17", "#4f7478") + box(526, 335, 330, 420, "#233e50", 18) +
      label(558, 399, "PRIORITY", gold) + path("M551 440h280", "none", "#688b92", 3) +
      path("M562 691 809 487M562 595l247 74", "none", "#6b898d", 5) +
      arrow("M879 484H987V290h177", "m1142 274 24 16-24 16", "#97723d") +
      arrow("M879 687H992v163h172", "m1140 834 24 16-24 16", "#708b87") +
      box(1032, 309, 284, 150, "#c5d3b1", 14) + note(1060, 361, ["GUIDANCE", "Protected first"]) +
      box(1032, 865, 284, 139, "#d6d9c9", 14) + note(1060, 916, ["OTHER WORK", "Can wait"]),
  },
  {
    key: "alarm.b03", title: "People behind the decision",
    alt: "A wide Mission Control interpretation shows headset-wearing engineers at rows of consoles, with Earth-to-space communication drawn above them.",
    context: "Mission Control assessed the alarms and relayed the decision to continue. The people and room layout are stylized; this is not a portrait or a reconstruction of a particular photograph.",
    draw: () => box(87, 164, 1261, 403, "#142e40", 8, "#5f8087") + moonDisk(1125, 345, 122) + earth(344, 355, 127) +
      wave(521, 354, 404, 37, gold) + label(551, 476, "ASSESS. DECIDE. RELAY.", mint) +
      Array.from({ length: 3 }, (_, i) => {
        const x = 98 + i * 418;
        return box(x, 665, 387, 238, "#759085", 10) + box(x + 25, 693, 167, 120, "#102e3b", 7, "#bac7ae") +
          wave(x + 35, 755, 145, 17, "#95baa4") + path(`M${x + 220} 716h122m-122 30h104m-104 30h112`, "none", "#274f59", 4) +
          circle(x + 256, 638, 51, "#a6b3a5", "#153044", 4) + path(`M${x + 211} 637q-2-64 71-57m-64 61v31h42`, "none", "#d8d1b1", 5) +
          path(`M${x + 197} 914q-24-175 117-175l48 175Z`, "#294759", "#142b3c", 4);
      }).join("") + path("M0 1078 1440 1009V1200H0Z", "#0c1d2c", "none"),
  },
  {
    key: "alarm.b04", title: "Then the window filled with rocks",
    alt: "Inside Eagle, a large angled forward window reveals a crater and boulders. A small guidance display sits in the foreground, shifting attention from the alarm to the landing terrain.",
    context: "As the landing approach continued, Armstrong assessed the terrain ahead. The cockpit view is interpretive; no targeting crosshair or invented live altitude is shown.",
    draw: () => path("M205 128 1260 180 1131 887 175 923Z", "#a6b3a1", "#080f1a", 24) +
      ellipse(771, 527, 328, 167, "#4e626a", "#d5d5b9", 9) + ellipse(800, 556, 251, 112, "#778c85", "#294554", 5) +
      [rock(418, 277, 1.5), rock(989, 326, 1.35), rock(317, 573, 1.2), rock(1069, 659, 1.15), rock(584, 757, 1.3)].join("") +
      path("M205 128 1260 180 1131 887 175 923Z", "none", "#1b3345", 28) +
      path("M0 919 920 842 1440 973V1200H0Z", "#1c3546", "#55717b", 5) + dsky(89, 833, .44, false) +
      label(772, 1020, "THE NEXT PROBLEM: THE GROUND", gold),
  },
  {
    key: "touchdown.b01", title: "Beyond the boulder field",
    alt: "An aerial view looks down over a wide crater rim lined with angular boulders. Small Eagle is offset above a clear patch, showing the need to choose a safer landing area.",
    context: "Armstrong guided Eagle beyond rough terrain during the final approach. The crater relief, aircraft position and apparent distances are illustrative.",
    draw: () => terrain(275, "warm", 6) + ellipse(683, 671, 497, 264, "#3d5662", "#d1c2a0", 10) + ellipse(720, 715, 381, 171, "#75857d", "#253f4f", 5) +
      [rock(174, 438, 2), rock(1034, 414, 1.9), rock(187, 781, 1.6), rock(1042, 829, 1.6), rock(628, 392, 1.1)].join("") +
      lander(913, 142, .59, "all", -14) + arrow("M1121 472q160 89 124 306", "m1228 751 16 30 21-25") +
      label(117, 1029, "FIND A CLEAR PATCH", paper),
  },
  {
    key: "touchdown.b02", title: "Hands on the approach",
    alt: "A foreground gloved hand grips a spacecraft hand controller. Through a wide upper window the horizon passes and dust streaks sideways, while a second crew figure watches instruments.",
    context: "Armstrong used partial manual control while Aldrin called out observations from the instruments. Dust movement is an artistic cue, not recorded descent telemetry.",
    draw: () => box(98, 165, 1234, 500, "#7f9593", 42, "#0b1829") + path("M113 570Q590 360 1315 565v86H113Z", "#bdbaa1", "none") +
      path("M183 592h650m-550 24h775m-640-60h747", "none", "#e1d5b0", 5) +
      path("M-50 836 652 596 1480 788V1200H-50Z", "#304b5a", "#849b98", 5) +
      path("M367 946 419 731l53-31 55 52-88 221Z", "#112b3e", "#aec0b0", 6) + ellipse(451, 724, 57, 34, "#76928b", "#152e40", 5) +
      glove(255, 906, 1.6, -30) + dsky(948, 715, .55, false) + label(83, 1091, "STEER. WATCH. CALL OUT.", gold),
  },
  {
    key: "touchdown.b03", title: "The first touch was a probe", tone: "paper",
    alt: "A macro side view shows a broad landing footpad suspended over the soil while its thin contact probe reaches down to touch first. An inset shows the contact lamp.",
    context: "A lunar contact probe touching the surface triggered the contact indication. This drawing separates the probe from the footpad to explain their different roles without inventing exact timing.",
    draw: () => terrain(914, "cool", 2) + path("M546 129 697 523 760 751M992 192 867 564 760 751", "none", ink, 38) +
      path("M546 129 697 523 760 751M992 192 867 564 760 751", "none", "#a6b9ad", 27) +
      path("m683 484 49 125", "none", gold, 49) + ellipse(759, 791, 240, 70, "url(#metal)", ink, 7) + ellipse(759, 775, 205, 45, "#c8d1bb", ink, 3) +
      path("M635 814v168l19 13", "none", "#334f5b", 6) + circle(644, 987, 24, "none", "#b78742", 3) +
      box(99, 223, 286, 231, "#263f4d", 22) + circle(161, 298, 24, "#aecfdb", "#e7ede0", 4) + note(133, 368, ["LUNAR", "CONTACT"], paper) +
      label(942, 934, "PROBE TOUCHES FIRST", ink),
  },
  {
    key: "touchdown.b04", title: "Four feet, a steady outpost",
    alt: "A low ground-level viewpoint looks up at Eagle settled on its footpads. Settling dust forms broad foreground strokes, and a small cutaway inset explains crushable honeycomb inside the landing strut.",
    context: "The landing gear supported Eagle after touchdown. The honeycomb inset illustrates energy absorption, not a measurement of the exact compression during Apollo 11's landing.",
    draw: () => stars(8) + terrain(867, "warm", 2) + lander(376, 187, 1.38) +
      path("M106 1031q229-60 426-16m122 28q170-47 517-38M84 989q121-48 280-22", "none", "#d0c4a5", 10) +
      box(1020, 199, 301, 341, "#ded6b7", 20) + label(1048, 246, "INSIDE A STRUT", ink) +
      Array.from({ length: 12 }, (_, i) => { const x = 1075 + i % 3 * 68; const y = 287 + Math.floor(i / 3) * 51; return path(`m${x} ${y} 27-15 27 15v28l-27 15-27-15Z`, "#b99353", "#f0d8a0", 3); }).join("") +
      label(130, 754, "A PLACE TO WORK", gold),
  },
  {
    key: "first-step.b01", title: "A hatch opens onto another world",
    alt: "From inside a dark cabin hatch we see a suited astronaut backing onto Eagle's porch, with a ladder disappearing below and the bright lunar surface beyond.",
    context: "Armstrong emerged from Eagle before descending the ladder. The body pose, interior surfaces and camera position are artistic interpretations.",
    draw: () => path("M248 155 1152 152 1231 955 160 950Z", "#8d9e98", "#0b1829", 39) + terrain(735, "warm", 1) +
      path("M233 794 1014 737 1170 893 191 954Z", "#6c858a", ink, 7) + path("M455 817v264m89-274v274m-88-237h88m-88 50h88m-88 50h88m-88 50h88m-88 50h88", "none", "#c4c6aa", 7) +
      astronaut(591, 353, 1.18, "kneel", 11) +
      path("M0 0h1440v1200H0ZM248 155 160 950l1071 5-79-803Z", "#102333", "none", 0, 'fill-rule="evenodd"') +
      path("M248 155 1152 152 1231 955 160 950Z", "none", "#9bab9f", 13) + label(401, 1042, "THE VIEW THROUGH THE HATCH", mint),
  },
  {
    key: "first-step.b02", title: "A small pull opens the view", tone: "paper",
    alt: "A close-up of a gloved hand pulling a D-shaped handle leads diagonally to a hinged equipment shelf swinging down from Eagle's side. The camera is visible inside the bay.",
    context: "A lanyard operated the MESA deployment mechanism. This schematic pairs the pull with the lowered camera bay without claiming exact dimensions or mechanical routing.",
    draw: () => grid() + box(587, 166, 616, 553, "#a48545", 10) + box(627, 219, 531, 422, "#173446", 5) +
      path("M628 641 1158 641 1290 896 741 928Z", "url(#foil)", ink, 7) + path("M631 633 748 922m408-289 130 258", "none", "#e0d3a5", 6) +
      tvCamera(778, 709, 1.2, false) + path("M656 288Q311 241 189 465", "none", "#587977", 5) +
      path("M170 438h47v65q-53 25-60-15Z", "none", "#334f59", 8) + glove(28, 463, 1.53, -10) +
      arrow("M1181 339q124 56 100 285", "m1263 601 17 28 26-18", "#94713d") + label(86, 885, "PULL → UNFOLD → SEE", ink),
  },
  {
    key: "first-step.b03", title: "The camera's first window",
    alt: "A camera mounted in the opened equipment bay fills the foreground. Thin view lines point toward the ladder, while a radio-wave motif connects the scene to Earth.",
    context: "The deployed television camera viewed the ladder and footpad, and communications equipment carried the scene to Earth. View lines and radio rings are explanatory graphics.",
    draw: () => terrain(866, "cool", 7) + path("M40 1067 368 446 994 937Z", "#253f50", "#6d918e", 4) +
      group(825, 558, 2.5, `<g transform="scale(-1 1)">${tvCamera(0, 0, 1, false)}</g>`) +
      path("M947 179 955 804m130-639 16 623M948 260l137-15m-136 86 138-15m-136 86 138-15m-136 86 138-15m-136 86 138-15m-136 86 138-15m-136 86 138-15", "none", "#bac6b6", 8) +
      path("M740 781 895 390m-155 391 159 120", "none", "#d1b776", 2, 'stroke-dasharray="10 12"') + earth(267, 273, 96) +
      [117, 143, 169].map(r => path(`M${267 + r * .6} ${273 + r * .7}q${r * .9} ${-r * .4} ${r * .5} ${-r * 1.1}`, "none", mint, 2)).join(""),
  },
  {
    key: "first-step.b04", title: "A footprint. A world watching.", tone: "paper",
    alt: "A huge boot and fresh tread impression fill the foreground. Behind them, an illustrated television screen carries a small ladder scene, connecting the first step to viewers on Earth.",
    context: "The television system let people on Earth follow the first steps. The television insert is an original drawing, not an archival broadcast frame.",
    draw: () => terrain(761, "warm", 3) + boot(660, 670, 2.6, -11) + footprint(296, 727, 2.55, 26) +
      box(207, 190, 626, 399, "#657b7b", 38) + box(231, 214, 483, 326, "#172f42", 44, "#c9ccb2") +
      group(270, 223, .54, astronaut(153, 30, 1, "stand") + path("M51 0v478m64-478v478m-64-408h64m-64 49h64m-64 49h64m-64 49h64m-64 49h64m-64 49h64", "none", "#c8c9ae", 6)) +
      circle(764, 285, 25, "#273f4f", "#bcc5b0", 4) + circle(764, 369, 25, "#273f4f", "#bcc5b0", 4) + label(957, 381, "A VIEW FOR EARTH", ink),
  },
  {
    key: "first-vibrations.b01", title: "Listening through the ground",
    alt: "A science bay opens like a treasure chest to reveal a compact gold seismic package. A ground cutaway beneath the scene carries a drawn wave, contrasting ground vibration with the silent sky.",
    context: "Eagle carried a seismic experiment for deployment on the surface. The cutaway wave illustrates ground motion and is not recorded lunar data.",
    draw: () => stars(16) + terrain(819, "cool", 6) + box(353, 270, 709, 550, "#9a7b42", 25) + box(397, 305, 625, 447, "#152e40", 16) +
      path("M397 752 1022 752 1155 909 313 909Z", "url(#foil)", ink, 7) + seismometer(624, 376, 1.14, false) +
      wave(106, 1034, 1210, 71, "#d3c699") + label(90, 207, "NOT AIR. THE GROUND.", mint),
  },
  {
    key: "first-vibrations.b02", title: "Level it. Open its wings.", tone: "paper",
    alt: "An astronaut kneels beside the seismic instrument with its two solar panels open. A large circular inset magnifies the leveling bubble on the instrument.",
    context: "Deployment included positioning and leveling the instrument and opening its solar panels. The inset magnifies the setup principle rather than showing a measured level reading.",
    draw: () => terrain(831, "warm", 4) + astronaut(270, 401, 1.48, "kneel") + seismometer(849, 515, 1.03) +
      circle(1120, 304, 127, "#b9c8ad", "#405e69", 6) + circle(1120, 304, 89, "#dae1bd", "#799786", 4) +
      circle(1120, 304, 34, "#a2bb8f", "#486d65", 3) + path("M1025 304h190m-95-95v190", "none", "#698b76", 2) +
      path("M1015 397 935 558", "none", "#64847b", 2, 'stroke-dasharray="6 9"') + label(877, 1053, "POWER + PLACEMENT", ink),
  },
  {
    key: "first-vibrations.b03", title: "Footsteps become a signal",
    alt: "A trail of large bootprints crosses the lunar soil toward a seismic package. The right half of the artwork cuts to a paper recorder with a stylized waveform.",
    context: "The instrument detected nearby crew activity, which gave engineers and scientists context for interpreting its output. The displayed waveform is illustrative, not a flight recording.",
    draw: () => terrain(390, "cool", 8) + [footprint(189, 745, 1.1, -26), footprint(329, 655, .9, -16), footprint(427, 553, .75, -25), footprint(523, 484, .55, -15)].join("") +
      seismometer(700, 281, .87) +
      path("M922 142 864 1121h576V142Z", "#132b3e", "#8eaaa2", 4) + group(940, 429, .8, printout(0, 0, 1), -5) +
      path("M1001 655v138h297v-34", "none", "#c5c5a7", 4) + wave(954, 844, 338, 37, gold) +
      label(118, 998, "A STEP IN THE DUST", paper) + label(949, 343, "A TRACE ON EARTH", gold),
  },
  {
    key: "first-vibrations.b04", title: "The listener stays behind",
    alt: "A low, solitary seismic instrument stands in lunar twilight. A large conceptual cross-section beneath it shows a wave traveling through layers of ground.",
    context: "The deployed seismic package remained after the crew left. The subsurface bands and wave are explanatory, not a geological section inferred specifically from this instrument alone.",
    draw: () => stars(19) + path("M0 509Q700 430 1440 549V1200H0Z", "#8fa295", "none") +
      path("M0 640q610-109 1440 20v540H0Z", "#627e80", "none") + path("M0 815q660-132 1440 9v376H0Z", "#385767", "none") +
      seismometer(653, 229, .91) +
      [100, 190, 285].map(r => path(`M${720 - r * 1.6} ${589 + r * .7}q${r * 1.6} ${r * 1.1} ${r * 3.2} 0`, "none", "#ddcea0", 3)).join("") +
      label(109, 981, "AFTER THE FOOTSTEPS FADE", paper),
  },
  {
    key: "reflector.b01", title: "An experiment with no battery",
    alt: "A low-angle portrait of the reflector array shows a field of glass corner cubes facing the sky. Eagle is small in the distance behind the instrument.",
    context: "The passive reflector array returns incoming light without onboard power. This is an illustration of the deployed instrument, not a present-day photograph.",
    draw: () => stars(20) + terrain(824, "cool", 6) + lander(1014, 505, .58) + reflector(247, 387, 2.15, -4) +
      label(91, 208, "NO BATTERY. NO TRANSMITTER.", gold),
  },
  {
    key: "reflector.b02", title: "Three surfaces, one return", tone: "paper",
    alt: "A large transparent corner-cube diagram fills the page, showing a light ray reflecting across three internal surfaces. A small observatory drawing shows where the light begins.",
    context: "Corner-cube geometry returns incoming light toward its source. The ray path is an explanatory construction, not an actual laser observation.",
    draw: () => grid() + path("M705 217 1162 447 972 903 528 633Z", "#8db6b5", "#345c6c", 5) +
      path("M705 217 819 546 1162 447M819 546 972 903M819 546 528 633", "none", "#d9e5d3", 5) +
      path("M245 350 819 546 968 763 699 673 235 494", "none", "#a57736", 7) +
      path("m612 482 30 27-39 3m-204-64-36-3 18 31", "none", "#a57736", 5) + dish(136, 709, .8) +
      label(861, 1019, "CORNER-CUBE GEOMETRY", ink),
  },
  {
    key: "reflector.b03", title: "Light makes a round trip",
    alt: "Earth and Moon occupy opposite corners connected by separate outward and return light paths. An observatory and small reflector anchor the two ends.",
    context: "Timing the outward and return journey of laser light allows distance measurement. Distances and timing are not to scale and no numerical reading is invented.",
    draw: () => stars(22) + earth(291, 797, 215) + moonDisk(1108, 333, 164) +
      dish(124, 566, .6, -14) + reflector(1034, 308, .32, 15) +
      arrow("M400 693 976 386", "m945 384 33-1-15 26", gold) + arrow("M1003 469 468 771", "m484 743-21 32 38-5", mint) +
      label(412, 427, "OUTWARD LIGHT", gold) + label(733, 768, "RETURNING LIGHT", mint) +
      box(611, 901, 561, 128, "#1b3548", 14, "#6f9394") + note(650, 952, ["Travel time becomes", "a distance measurement."], paper),
  },
  {
    key: "reflector.b04", title: "A long conversation made of light",
    alt: "A large passive reflector in the foreground is paired with a fan of successive observation cards and an orbit diagram, conveying repeated measurements across time.",
    context: "Repeated lunar laser-ranging observations support studies of lunar motion and interior properties. The notebook pages and arcs represent accumulation of evidence, not a measured data series.",
    draw: () => terrain(901, "cool", 2) + reflector(119, 607, 1.18, -5) + earth(353, 325, 132) +
      path("M616 238q423-238 678 288M665 335q319-205 555 154M731 424q220-152 423 90", "none", "#87abaa", 3, 'stroke-dasharray="8 10"') +
      moonDisk(1179, 427, 62) +
      [0, 1, 2].map(i => group(690 + i * 105, 666 - i * 75, .74, printout(0, 0, 1, false) + label(27, 251, "OBSERVATION", ink), -12 + i * 10)).join("") +
      label(121, 1043, "ONE RETURN IS A MEASUREMENT. MANY REVEAL A PATTERN.", paper),
  },
  {
    key: "solar-wind.b01", title: "A foil sheet faces the Sun", tone: "paper",
    alt: "An astronaut plants the slender solar-wind collector beside Eagle. The vertical reflective foil, rather than a flag, dominates the composition.",
    context: "The solar-wind composition experiment used exposed foil to collect material for later laboratory analysis. The scene illustrates deployment and does not depict a national flag.",
    draw: () => terrain(872, "warm", 9) + collector(878, 247, 1.51) + astronaut(534, 393, 1.38, "reach") +
      lander(73, 584, .57) + path("M1148 253h193m-160 44h153m-134 44h130", "none", "#ad8849", 4) +
      label(959, 1021, "COLLECTOR FOIL", ink),
  },
  {
    key: "solar-wind.b02", title: "Catching an invisible stream",
    alt: "A macro scientific illustration shows stylized solar particles approaching a folded sheet of foil. A magnified material cross-section illustrates particles becoming trapped.",
    context: "Solar-wind particles were collected in the exposed foil. Particles, colors, spacing and the magnified material layers are schematic, not visible particles in a photograph.",
    draw: () => circle(68, 423, 286, "#b48542", "#e3c079", 5) +
      path("M826 192 1169 311 1108 897 762 733Z", "url(#metal)", "#d6ddc7", 5) +
      [0,1,2,3,4].map(i => path(`M${855 + i * 57} ${214 + i * 20}l-58 552`, "none", "#8caaa7", 2)).join("") +
      Array.from({ length: 22 }, (_, i) => { const x = 375 + i % 6 * 70; const y = 280 + Math.floor(i / 6) * 126 + (i % 3) * 17; return circle(x, y, i % 3 + 4, i % 2 ? mint : gold) + path(`M${x - 25} ${y}h15`, "none", "#d5bf81", 2); }).join("") +
      box(898, 862, 403, 192, "#1a3143", 18, "#acbbb0") + path("M919 916h359m-359 40h359m-359 40h359", "none", "#8fa8a2", 8) +
      [958, 1033, 1160, 1249].map((x, i) => circle(x, 927 + i % 2 * 40, 8, gold)).join("") + label(382, 1008, "PARTICLES TRAPPED IN METAL", paper),
  },
  {
    key: "solar-wind.b03", title: "Roll up the evidence", tone: "paper",
    alt: "A pair of large gloved hands gathers the foil into a compact roll above an open sample container. The empty support pole remains in the background.",
    context: "The foil was recovered and packed for return to Earth. The container and handling pose are interpretive, emphasizing physical sample recovery rather than a radio transmission.",
    draw: () => terrain(966, "warm", 2) + collector(1201, 438, 1.08, false) +
      path("M227 762 953 677 1200 933 421 1042Z", "#879d98", ink, 6) + path("M227 762v167l194 113v-128Z", "#425e6d", ink, 6) +
      path("m227 762 0-196 667-70 59 181Z", "#bac6b5", ink, 6) + box(405, 751, 448, 109, "#1e3a4d", 15) +
      path("M563 348h189v328H563Z", "url(#metal)", "#dfe0c9", 3) + ellipse(658, 349, 96, 31, "#c2d3c8", "#3e626d", 4) + ellipse(658, 349, 70, 20, "#839f9f", "#cfdbc7", 3) +
      glove(388, 390, 1.19, -10) + glove(965, 657, 1.1, 172) + label(169, 230, "THIS SAMPLE HAS TO GO HOME", ink),
  },
  {
    key: "solar-wind.b04", title: "Two endings for one experiment",
    alt: "A split composition contrasts an empty collector staff resting in lunar dust at left with a sealed foil sample and laboratory apparatus on Earth at right.",
    context: "The collected foil returned for laboratory analysis; the support hardware remained on the Moon. The laboratory is a conceptual illustration, not a particular analysis apparatus.",
    draw: () => terrain(793, "cool", 2) + group(155, 940, 1.65, collector(0, 0, 1, false), -78) +
      path("M752 126 685 1108h755V126Z", "#d6dccb", "#9eafa5", 4) +
      box(817, 652, 452, 254, "#78968f", 18) + box(849, 692, 167, 137, "#e7e1c6", 7) + label(878, 749, "FOIL", ink) +
      path("M1067 271v353h150m-95-353v353", "none", "#4d6f76", 10) + ellipse(1095, 268, 68, 27, "url(#metal)", ink, 4) +
      box(1049, 399, 93, 154, "#97b9b5", 8, "#425e6a") + circle(1097, 473, 24, gold) +
      label(92, 291, "STAFF STAYS", mint) + label(841, 1028, "FOIL RETURNS", ink),
  },
  {
    key: "breaker.b01", title: "Something small on the floor",
    alt: "A dramatic floor-level close-up shows a broken dark control knob between an astronaut's boots. Panel wiring and a cropped backpack edge establish the cramped cabin.",
    context: "Aldrin found the damaged engine-arm circuit-breaker knob. The composition focuses on discovering the loose piece, without asserting an exact moment or cause of the damage.",
    draw: () => path("M0 455 1440 342v858H0Z", "#506b72", "none") +
      path("M0 669 1440 531M0 906 1440 742M335 452 427 1200M984 380l-118 820", "none", "#2c485a", 5) +
      boot(158, 169, 2.55, 18) + boot(1048, 285, 2.23, -10) +
      group(649, 693, 2.1, path("M0 0h62l13 24-31 32-51-17Z", "#1a3043", "#a5b8af", 3) + circle(30, 24, 12, "#0b1e30", "#738c8d", 3), -18) +
      path("M486 769q162 145 363 20", "none", gold, 3, 'stroke-dasharray="7 10"') + label(490, 1019, "A SMALL PART. AN IMPORTANT QUESTION.", paper),
  },
  {
    key: "breaker.b02", title: "Find the damaged control",
    alt: "A large Engine Arm panel is paired with a circular magnification of the recessed stem where its knob should be. A conceptual open circuit explains why the control mattered.",
    context: "The damaged knob made the engine-arm breaker difficult to operate. The enlarged stem and circuit illustration explain the control, not the full ascent wiring or an actual panel photograph.",
    draw: () => breakerPanel(87, 253, 1.31) + circle(1107, 389, 169, "#6e898b", "#c9c4a5", 8) + circle(1107, 389, 117, "#132d40", "#c9b789", 5) +
      circle(1107, 389, 43, "#aec0b4", "#354f5e", 4) + path("M818 480 947 467", "none", "#d8bf84", 3, 'stroke-dasharray="5 9"') +
      circuit(865, 745, .96, false) + label(123, 887, "A KNOB IS NOT THE WHOLE CIRCUIT", mint),
  },
  {
    key: "breaker.b03", title: "An ordinary tool, a careful idea", tone: "paper",
    alt: "A large felt-tip pen lies diagonally across an illustrated engineering workbench. A crew sleeve pocket and a small circuit sketch connect the everyday tool with the damaged control.",
    context: "A felt-tip pen was used to operate the damaged breaker. The composition emphasizes the tool choice without depicting a spark, fire or engine ignition.",
    draw: () => grid() + box(93, 231, 464, 497, "#c5ccba", 29) + path("M122 425h391v271H122Z", "#e6e4cd", "#798f84", 5) +
      path("M120 426 312 532 515 425", "none", "#7b9588", 5) + path("M149 688h332m-332-21h332", "none", "#b1bfaa", 2, 'stroke-dasharray="7 7"') +
      pen(297, 348, 3.02, 22) + circuit(850, 628, 1, false) +
      label(653, 261, "FELT-TIP PEN", ink) + note(126, 930, ["A familiar object.", "An unfamiliar problem."], ink),
  },
  {
    key: "breaker.b04", title: "A small push, a useful solution",
    alt: "An extreme close-up shows the blunt end of a pen engaging a recessed breaker stem. Beneath it, a simple circuit changes to a connected path.",
    context: "Aldrin used the pen to push the breaker in during ascent preparations. The pen operated a control; it did not power the engine or replace the circuit.",
    draw: () => box(711, 174, 592, 697, "#758c88", 25) + box(752, 229, 503, 590, "#1e3a4c", 15) +
      label(841, 313, "ENGINE ARM", paper) + circle(947, 505, 123, "#819990", "#c9cbb0", 6) + circle(947, 505, 76, "#10293d", "#d9caa3", 5) +
      pen(947, 505, 2, 180) + glove(152, 474, 1.7, -8) +
      arrow("M422 730h213", "m610 711 30 19-30 19", gold) + circuit(723, 820, .73, true) +
      note(96, 1015, ["Operate the control.", "Continue the preparations."], mint),
  },
  {
    key: "liftoff.b01", title: "The connection has one last job", tone: "paper",
    alt: "A macro mechanical cutaway isolates the connection between the silver ascent stage and gold descent stage, with a separated cable path and an inset of the intact lander.",
    context: "Stage connections had to release for ascent. The drawing is a simplified separation-system explanation, not a literal wiring diagram or a count of cut cables and bolts.",
    draw: () => grid() + box(146, 192, 1116, 241, "#acbdb1", 12) + box(146, 687, 1116, 244, "url(#foil)", 12) +
      path("M395 384v133m0 104v123m648-360v133m0 104v123", "none", "#26485a", 36) +
      path("M395 384v133m0 104v123m648-360v133m0 104v123", "none", "#899f99", 20) +
      path("M538 415v74q78 46 30 93m219-167v61q-96 60-23 96M568 659l-23 71m223-89 23 89", "none", "#546d7c", 13) +
      arrow("M148 555h179", "m303 537 26 18-26 18", "#9d7b3e") + arrow("M1268 555h-161", "m1130 537-26 18 26 18", "#9d7b3e") +
      label(222, 1008, "RELEASE THE STAGES FOR THE RETURN JOURNEY", ink),
  },
  {
    key: "liftoff.b02", title: "Take only what must go home",
    alt: "A vertical split contrasts the ascent cabin and sample container lifting upward with the heavy descent engine and landing legs remaining on the lunar ground.",
    context: "The ascent stage could return the crew and samples without carrying the descent engine and legs. This is a design comparison, not a mass or performance chart.",
    draw: () => stars(32) + terrain(940, "warm", 8) + path("M707 155v850", "none", "#748f8c", 2, 'stroke-dasharray="5 11"') +
      lander(137, 220, 1.03, "upper") + box(311, 605, 186, 129, "#aebca8", 12) + box(335, 630, 136, 78, "#263f50", 4) +
      lander(799, 472, 1.02, "lower") + arrow("M504 857V610", "m487 635 17-27 17 27", mint) +
      label(214, 177, "RETURNS TO ORBIT", gold) + label(866, 368, "STAYS ON THE MOON", gold),
  },
  {
    key: "liftoff.b03", title: "The lander becomes a launchpad",
    alt: "Eagle's ascent cabin rises dramatically into the upper left, leaving its golden descent stage low on the surface. A stylized pale engine plume crosses the gap between the stages.",
    context: "The descent stage served as the launch platform for the ascent stage. Exhaust and displaced dust are illustrative; the image does not specify an ascent speed or reproduce a film frame.",
    draw: () => stars(34) + terrain(874, "warm", 7) + lander(699, 443, 1.17, "lower") +
      path("M562 514q76 202 204 404l125-58Q710 675 633 481Z", "#c7b57d", "none", 0, 'opacity=".34"') +
      path("M582 519 731 848 656 504Z", "#e9d8a4", "none", 0, 'opacity=".66"') +
      lander(274, 147, 1.39, "upper", -9) + path("M482 995q359-104 788-9", "none", "#d7c59f", 9) +
      label(901, 284, "UPPER STAGE: DEPARTURE", paper),
  },
  {
    key: "liftoff.b04", title: "The part that stayed",
    alt: "The gold descent stage stands alone under a huge dark sky. A small departing cabin is nearly lost above it, and its long shadow spreads over the quiet ground.",
    context: "Eagle's descent stage remained at Tranquility Base after the ascent stage left with the crew. The shadow direction and distant cabin size are interpretive.",
    draw: () => stars(35) + terrain(837, "cool", 2) + path("M602 944 329 1090 1359 1104 884 904Z", "#253f53", "none") +
      lander(469, 456, 1.16, "lower") + lander(890, 172, .2, "upper", -15) +
      label(104, 438, "THE CREW GOES HOME.", paper) + label(104, 482, "THE LANDING STAGE STAYS.", gold),
  },
  {
    key: "seen-again.b01", title: "Sunlight returns to the same place",
    alt: "Three long vertical panels show a solitary descent stage under changing light: low sunlight and a long shadow, bright daylight, then lunar night.",
    context: "The landing stage remained while lighting at the site changed over time. These three views are an artistic passage-of-time device, not a photographic time sequence.",
    draw: () => [0,1,2].map(i => {
      const x = 83 + i * 430;
      return box(x, 187, 397, 846, ["#65533f", "#78918d", "#0a1c2f"][i], 18, "#9baca0") +
        path(`M${x + 10} 815h377v203H${x + 10}Z`, ["#95866a", "#b4b9a1", "#233f51"][i], "none") +
        path(`M${x + 195} 880 ${x + 23} 967 ${x + 338} 1012 ${x + 296} 881Z`, "#1b3448", "none", 0, `opacity="${i === 1 ? .25 : .7}"`) +
        lander(x + 56, 572, .6, "lower") + circle(x + 299, 310, 22, i === 2 ? "#0a1c2f" : "#e6ce97") + label(x + 44, 258, ["LOW SUN", "DAYLIGHT", "NIGHT"][i], paper);
    }).join(""),
  },
  {
    key: "seen-again.b02", title: "A new explorer looks down",
    alt: "Lunar Reconnaissance Orbiter fills the upper foreground, with a long solar array and downward-looking camera above the broad Moon. A faint viewing cone links it to the surface.",
    context: "LRO photographed the Apollo landing sites from orbit. The instrument, viewing cone and apparent scale are simplified; no resolution or altitude is asserted by the image.",
    draw: () => stars(37) + terrain(763, "cool", 7) +
      path("M588 601 247 1010 1105 1010Z", "#87a8a4", "none", 0, 'opacity=".12"') +
      path("M588 601 247 1010M588 601l517 409", "none", "#88afa6", 2, 'stroke-dasharray="8 12"') +
      orbiter(470, 254, 1.7, -12) + box(627, 927, 111, 58, "#657e7a", 5, "#bdd1b8") +
      label(88, 680, "ANOTHER MACHINE. A NEW VIEW.", paper),
  },
  {
    key: "seen-again.b03", title: "A small shape, a long shadow", tone: "paper",
    alt: "An overhead illustrative site map shows the small octagonal descent stage, its long shadow and scuffed paths. An offset magnifying panel enlarges the stage and four feet.",
    context: "Later orbital imagery can be interpreted alongside mission records to study the landing site. This is a diagram of how to read such a view, not an actual LROC photograph or a surveyed equipment map.",
    draw: () => box(86, 166, 894, 866, "#8b9b91", 12, "#6b847f") +
      path("M573 591 327 353 439 345 678 578Z", "#2a4557", "none") +
      path("M553 558h81l37 47-37 46h-81l-33-46Z", "#c2a167", ink, 4) +
      path("M552 570 501 535m135 35 48-35m-136 104-48 39m136-40 47 35", "none", "#dde0c1", 8) +
      path("M601 659q-110 81-79 222m107-220q163 74 91 237", "none", "#526e72", 13, 'stroke-dasharray="4 9"') +
      circle(1052, 355, 215, "#d9d8bd", "#3b6170", 9) + group(903, 224, .58, path("M91 122h224l67 89-67 95H91l-61-95Z", "url(#foil)", ink, 5) + path("M110 138 21 58m285 79 89-75M110 281 17 354m291-71 83 65", "none", "#31586c", 16)) +
      path("M678 552 872 439", "none", "#456b74", 3, 'stroke-dasharray="7 10"') + note(1058, 725, ["Shape", "Shadow", "Surface traces"], ink) +
      label(126, 985, "ILLUSTRATED SITE-READING DIAGRAM", ink),
  },
  {
    key: "seen-again.b04", title: "Still a story worth finding",
    alt: "A close foreground view of a landing leg and commemorative plaque leads toward the quiet descent stage. A small Earth hangs above the horizon, closing the story on the hardware that stayed.",
    context: "The descent stage and its commemorative plaque remained at the landing site. The plaque is represented without invented signatures or a recreated inscription; the composition is illustrative.",
    draw: () => stars(39) + terrain(842, "cool", 9) + lander(997, 641, .59, "lower") + earth(1064, 313, 91) +
      path("M177 126 618 1048M486 132 616 1048", "none", ink, 51) + path("M177 126 618 1048M486 132 616 1048", "none", "#a9bcae", 37) +
      path("M400 419 730 404 763 682 423 694Z", "url(#metal)", "#253f52", 7) +
      ellipse(494, 515, 42, 43, "none", "#637d7b", 2) + ellipse(663, 513, 42, 43, "none", "#637d7b", 2) +
      path("M454 508h80m-40-36v78m128-43h79m-39-36v78", "none", "#819a8f", 1.5) +
      path("M466 588h230m-216 23h205m-193 23h181", "none", "#779086", 3) +
      ellipse(616, 1050, 195, 51, "url(#metal)", ink, 7) + label(839, 685, "HARDWARE STAYS.", gold) + label(839, 727, "KNOWLEDGE TRAVELS.", paper),
  },
];
