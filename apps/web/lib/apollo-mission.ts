/**
 * Strictly Verified Master Dossier & Telemetry for Apollo 11 Lunar Module Eagle (LM-5)
 * COSPAR / NSSDCA ID: 1969-059C · NORAD SATCAT: 04041
 * Sources: NASA NSSDCA, LPI Apollo 11 Catalog, NASA ALSJ (MSC-00171 / NASA SP-238), LROC ASU (M175124932R)
 */

export interface ApolloKeyframe {
  id: string;
  frameId: string;
  mag: string;
  frame: string;
  get: string;
  utc: string;
  title: string;
  description: string;
  hardware: string;
  browseUrl: string;
  printUrl: string;
  metaUrl: string;
  category: "orbit" | "descent" | "surface" | "science" | "ascent" | "orbit-today" | "memorial";
}

export interface DiscardedArtifact {
  id: string;
  name: string;
  nssdcaId?: string;
  category: "structure" | "science" | "life-support" | "memorial" | "tools";
  status: "active" | "dormant" | "discarded" | "degraded";
  coordsDelta: { x: number; y: number }; // Relative position in meters from Descent Stage (X: East, Y: North)
  distanceMeters: number;
  direction: string;
  massKg?: number;
  summary: string;
  scienceOrStory: string;
  frameId?: string;
  browseUrl?: string;
}

export const APOLLO_11_MISSION = {
  cosparId: "1969-059C",
  noradCat: "04041",
  name: "Apollo 11 Lunar Module",
  callSign: "Eagle",
  tailNumber: "LM-5",
  builder: "Grumman Aircraft Engineering Corporation (Bethpage, New York)",
  crew: {
    commander: "Neil A. Armstrong",
    lmPilot: "Edwin E. 'Buzz' Aldrin Jr.",
    cmPilot: "Michael Collins (Command Module Columbia, 1969-059A)",
  },
  launch: {
    utc: "1969-07-16T13:32:00Z",
    site: "Kennedy Space Center LC-39A",
    rocket: "Saturn V (SA-506)",
    fueledMassKg: 15095,
  },
  descentStage: {
    dryMassKg: 2033,
    propellantMassKg: 8248,
    status: "Permanently intact at Tranquility Base",
    landingUtc: "1969-07-20T20:17:39.9Z",
    landingGet: "102:45:39.9",
    shutdownGet: "102:45:41.4",
    coordinates: {
      lat: 0.67416,
      lon: 23.47314,
      dms: "0° 40' 26.98\" N, 23° 28' 23.30\" E",
      region: "Mare Tranquillitatis (Tranquility Base)",
      elevationMeters: -1900,
    },
    attitude: "4.5° pitch up, 0.4° roll left, yawed 13° south of west (Azimuth 257°)",
    lrocImageId: "M175124932R",
    lrocResolution: "25 cm/pixel (from 24 km altitude)",
    lrocUrl: "https://www.lroc.asu.edu/images/482",
  },
  ascentStage: {
    dryMassKg: 2180,
    propellantMassKg: 2376,
    liftoffUtc: "1969-07-21T17:54:00.8Z",
    liftoffGet: "124:22:00.8",
    burnDurationSec: 434.9,
    jettisonUtc: "1969-07-21T23:41:31Z",
    jettisonGet: "130:09:31",
    jettisonOrbit: "114.1 km × 116.1 km (1.25° inclination)",
    status: "Officially logged as crashed at unknown site; 2021 GRAIL study indicates it may remain in stable lunar orbit today",
    orbitalStudy: {
      author: "James Meador (2021)",
      journal: "Planetary and Space Science, Vol. 205",
      finding:
        "Using GRAIL GRGM1200B gravitational models, simulations showed perilune/apolune resonances could preserve LM-5's ascent stage in lunar orbit for decades without crashing.",
    },
  },
  plaque: {
    material: "304 Brushed Stainless Steel (22.9 cm × 19.4 cm × 1.6 mm)",
    mount: "Forward (+Z) landing gear strut between ladder rungs 3 and 4",
    verbatim:
      "HERE MEN FROM THE PLANET EARTH\nFIRST SET FOOT UPON THE MOON\nJULY 1969, A.D.\nWE CAME IN PEACE FOR ALL MANKIND",
    signatures: "Neil A. Armstrong, Michael Collins, Edwin E. Aldrin Jr., Richard M. Nixon",
  },
  siliconDisc: {
    specs: "3.8 cm (1.5 in) silicon wafer with 1/200th micro-etched messages",
    nationsCount: 73,
    maker: "Sprague Electric Company",
    text: "Goodwill messages from around the world brought to the Moon by the astronauts of Apollo 11.",
  },
};

export const getLpiApolloBrowseUrl = (mag: string, frame: string): string =>
  `https://www.lpi.usra.edu/resources/apollo/images/browse/AS11/${mag}/${frame}.jpg`;

export const getLpiApolloPrintUrl = (mag: string, frame: string): string =>
  `https://www.lpi.usra.edu/resources/apollo/images/print/AS11/${mag}/${frame}.jpg`;

export const getLpiApolloMetaUrl = (mag: string, frame: string): string =>
  `https://www.lpi.usra.edu/resources/apollo/frame/?AS11-${mag}-${frame}`;

export const APOLLO_KEYFRAMES: ApolloKeyframe[] = [
  {
    id: "orbit-inspection",
    frameId: "AS11-44-6581",
    mag: "44",
    frame: "6581",
    get: "100:15:00",
    utc: "1969-07-20T17:47:00Z",
    title: "Eagle Has Wings",
    description: "Eagle inspected from Columbia in lunar orbit after undocking. Landing gear and surface sensing probes fully extended.",
    hardware: "Full LM-5 (Ascent + Descent stages)",
    browseUrl: getLpiApolloBrowseUrl("44", "6581"),
    printUrl: getLpiApolloPrintUrl("44", "6581"),
    metaUrl: getLpiApolloMetaUrl("44", "6581"),
    category: "orbit",
  },
  {
    id: "first-surface",
    frameId: "AS11-40-5850",
    mag: "40",
    frame: "5850",
    get: "109:30:00",
    utc: "1969-07-21T03:02:00Z",
    title: "First Ground Contact",
    description: "First surface photograph taken by Neil Armstrong. Shows Eagle's footpad resting in fine Mare Tranquillitatis dust and the contingency sample bag.",
    hardware: "Forward (+Z) Landing Footpad",
    browseUrl: getLpiApolloBrowseUrl("40", "5850"),
    printUrl: getLpiApolloPrintUrl("40", "5850"),
    metaUrl: getLpiApolloMetaUrl("40", "5850"),
    category: "surface",
  },
  {
    id: "ladder-descent",
    frameId: "AS11-40-5868",
    mag: "40",
    frame: "5868",
    get: "109:43:00",
    utc: "1969-07-21T03:15:00Z",
    title: "Descending the Ladder",
    description: "Buzz Aldrin backing down the nine-rung ladder attached to Eagle's forward strut, stepping onto the 79 cm circular footpad.",
    hardware: "LM-5 Ladder & Forward Strut",
    browseUrl: getLpiApolloBrowseUrl("40", "5868"),
    printUrl: getLpiApolloPrintUrl("40", "5868"),
    metaUrl: getLpiApolloMetaUrl("40", "5868"),
    category: "surface",
  },
  {
    id: "commemorative-plaque",
    frameId: "AS11-40-5863",
    mag: "40",
    frame: "5863",
    get: "109:42:00",
    utc: "1969-07-21T03:14:00Z",
    title: "We Came In Peace For All Mankind",
    description: "The brushed stainless steel commemorative plaque permanently affixed between the 3rd and 4th rungs of Eagle's ladder.",
    hardware: "Commemorative Plaque (Descent Stage)",
    browseUrl: getLpiApolloBrowseUrl("40", "5863"),
    printUrl: getLpiApolloPrintUrl("40", "5863"),
    metaUrl: getLpiApolloMetaUrl("40", "5863"),
    category: "memorial",
  },
  {
    id: "visor-portrait",
    frameId: "AS11-40-5903",
    mag: "40",
    frame: "5903",
    get: "110:15:00",
    utc: "1969-07-21T03:47:00Z",
    title: "Visor Reflection",
    description: "Iconic portrait of Buzz Aldrin. Eagle's descent stage, Neil Armstrong, the U.S. flag, and scientific gear are reflected in his gold visor.",
    hardware: "LM-5 Profile & Reflection",
    browseUrl: getLpiApolloBrowseUrl("40", "5903"),
    printUrl: getLpiApolloPrintUrl("40", "5903"),
    metaUrl: getLpiApolloMetaUrl("40", "5903"),
    category: "surface",
  },
  {
    id: "lrrr-closeup",
    frameId: "AS11-40-5952",
    mag: "40",
    frame: "5952",
    get: "111:00:00",
    utc: "1969-07-21T04:32:00Z",
    title: "Laser Reflector (Active Today)",
    description: "Close-up of the 100 fused-silica corner-cube prisms of the Laser Ranging Retroreflector. Still ranged by observatories on Earth in 2026.",
    hardware: "LRRR (1969-059C-02)",
    browseUrl: getLpiApolloBrowseUrl("40", "5952"),
    printUrl: getLpiApolloPrintUrl("40", "5952"),
    metaUrl: getLpiApolloMetaUrl("40", "5952"),
    category: "science",
  },
  {
    id: "easep-pan",
    frameId: "AS11-40-5948",
    mag: "40",
    frame: "5948",
    get: "110:58:00",
    utc: "1969-07-21T04:30:00Z",
    title: "EASEP Science Station",
    description: "Passive Seismic Experiment (foreground) and Laser Reflector deployed ~20m south of Eagle. Plutonium-238 heaters kept PSEP warm.",
    hardware: "PSEP (1969-059C-01) & LRRR",
    browseUrl: getLpiApolloBrowseUrl("40", "5948"),
    printUrl: getLpiApolloPrintUrl("40", "5948"),
    metaUrl: getLpiApolloMetaUrl("40", "5948"),
    category: "science",
  },
  {
    id: "ascent-earthrise",
    frameId: "AS11-44-6642",
    mag: "44",
    frame: "6642",
    get: "127:35:00",
    utc: "1969-07-21T21:07:00Z",
    title: "Ascent Stage & Earthrise",
    description: "Eagle's Ascent Stage returning toward Columbia with 21.55 kg of lunar samples. The Descent Stage remained behind as their launch pad.",
    hardware: "Ascent Stage (LM-5)",
    browseUrl: getLpiApolloBrowseUrl("44", "6642"),
    printUrl: getLpiApolloPrintUrl("44", "6642"),
    metaUrl: getLpiApolloMetaUrl("44", "6642"),
    category: "ascent",
  },
];

export const DISCARDED_ARTIFACTS: DiscardedArtifact[] = [
  {
    id: "descent-stage",
    name: "LM-5 Descent Stage & TRW DPS Engine",
    nssdcaId: "1969-059C",
    category: "structure",
    status: "active",
    coordsDelta: { x: 0, y: 0 },
    distanceMeters: 0,
    direction: "Tranquility Base Center",
    massKg: 2033,
    summary: "The octagonal lower half clad in gold Kapton thermal foil. Served as the launch pad for the Ascent Stage.",
    scienceOrStory:
      "Engineered with crushable aluminum-honeycomb shock absorbers in four landing struts and a deep-throttling 45 kN rocket engine. The base remains completely intact at 0.67416° N, 23.47314° E, photographed at 25 cm resolution by LROC.",
    frameId: "AS11-40-5902",
    browseUrl: getLpiApolloBrowseUrl("40", "5902"),
  },
  {
    id: "lrrr",
    name: "Laser Ranging Retroreflector (LRRR)",
    nssdcaId: "1969-059C-02",
    category: "science",
    status: "active",
    coordsDelta: { x: -6, y: -19 },
    distanceMeters: 19.9,
    direction: "South-Southwest",
    massKg: 21.1,
    summary: "100 fused-silica corner-cube prisms in an aluminum pallet. Still actively targeted by lasers from Earth in 2026.",
    scienceOrStory:
      "Requires zero electrical power. By timing the two-way bounce of green laser pulses, scientists proved the Moon is spiraling away from Earth at 3.8 cm per year, confirmed the Moon has a fluid core, and tested Einstein's General Relativity to parts per trillion.",
    frameId: "AS11-40-5952",
    browseUrl: getLpiApolloBrowseUrl("40", "5952"),
  },
  {
    id: "psep",
    name: "Passive Seismic Experiment Package (PSEP)",
    nssdcaId: "1969-059C-01",
    category: "science",
    status: "dormant",
    coordsDelta: { x: -5, y: -16 },
    distanceMeters: 16.8,
    direction: "South-Southwest",
    massKg: 47.7,
    summary: "First lunar seismometer array. Kept warm during lunar night by two 15-watt Plutonium-238 atomic heaters.",
    scienceOrStory:
      "Sensitive to displacements of 0.03 nanometers. Recorded the astronauts' footsteps, the impact of jettisoned backpacks hitting the ground, and confirmed the Moon lacks active plate tectonics but has a deeply fractured crust that rings like a bell.",
    frameId: "AS11-40-5948",
    browseUrl: getLpiApolloBrowseUrl("40", "5948"),
  },
  {
    id: "tv-camera",
    name: "Westinghouse Lunar TV Camera",
    nssdcaId: "1969-059C-04",
    category: "science",
    status: "discarded",
    coordsDelta: { x: -14, y: 7 },
    distanceMeters: 15.6,
    direction: "West-Northwest",
    massKg: 3.3,
    summary: "Slow-scan black-and-white vidicon camera (10 fps, 320 scan lines) that broadcast Armstrong's first step to 650 million people.",
    scienceOrStory:
      "Initially deployed from the MESA bay, Armstrong moved it onto a tripod 15 meters away so Mission Control could observe the entire 2.5-hour moonwalk. Left standing on its tripod in the regolith.",
    frameId: "AS11-40-5875",
    browseUrl: getLpiApolloBrowseUrl("40", "5875"),
  },
  {
    id: "solar-wind-staff",
    name: "Solar Wind Composition (SWC) Staff",
    nssdcaId: "1969-059C-03",
    category: "science",
    status: "discarded",
    coordsDelta: { x: 1, y: 6 },
    distanceMeters: 6.1,
    direction: "North",
    summary: "Five-section aluminum staff designed by Johannes Geiss (University of Bern, Switzerland).",
    scienceOrStory:
      "Held an ultra-pure aluminum foil sheet for 77 minutes to trap solar wind noble gases (Helium-3, Neon, Argon). Aldrin rolled up the foil for return to Switzerland and discarded the staff in the regolith.",
    frameId: "AS11-40-5873",
    browseUrl: getLpiApolloBrowseUrl("40", "5873"),
  },
  {
    id: "plss-pile",
    name: "Jettisoned PLSS Backpacks & Galoshes",
    category: "life-support",
    status: "discarded",
    coordsDelta: { x: 2, y: -3 },
    distanceMeters: 3.6,
    direction: "Below Forward Hatch",
    massKg: 95,
    summary: "Two 38-kg Portable Life Support System backpacks, woven steel Chromel-R galoshes, and Hasselblad 500EL camera body.",
    scienceOrStory:
      "Prior to liftoff, the cabin was depressurized a second time to toss out unnecessary gear and reduce takeoff weight. The seismic shock of the first backpack hitting the soil was detected live by the PSEP seismometer.",
    frameId: "AS11-40-5850",
    browseUrl: getLpiApolloBrowseUrl("40", "5850"),
  },
  {
    id: "flag",
    name: "U.S. Nylon Flag & Telescoping Pole",
    category: "memorial",
    status: "degraded",
    coordsDelta: { x: -6, y: 5 },
    distanceMeters: 8.2,
    direction: "Northwest",
    summary: "3 × 5 ft nylon flag on an anodized aluminum pole.",
    scienceOrStory:
      "Aldrin observed through Eagle's window that the Ascent Propulsion exhaust plume blew the flagpole over during liftoff. Over 55+ years of intense solar ultraviolet radiation and 250°C thermal swings, the nylon fabric has completely bleached and disintegrated, while the aluminum pole remains.",
    frameId: "AS11-40-5875",
    browseUrl: getLpiApolloBrowseUrl("40", "5875"),
  },
  {
    id: "plaque-disc",
    name: "Commemorative Plaque & Goodwill Silicon Disc",
    category: "memorial",
    status: "active",
    coordsDelta: { x: 1, y: 1 },
    distanceMeters: 1.4,
    direction: "Forward Strut (+Z)",
    summary: "Stainless steel plaque on ladder + Sprague silicon wafer with messages from 73 heads of state.",
    scienceOrStory:
      "Includes miniature micro-etched goodwill statements from 73 nations, Apollo 1 memorial patch (Grissom, White, Chaffee), Soviet medals honoring Gagarin and Komarov, and a Cartier solid gold olive branch.",
    frameId: "AS11-40-5863",
    browseUrl: getLpiApolloBrowseUrl("40", "5863"),
  },
];

export const DESCENT_CHRONOLOGY = [
  {
    get: "100:12:00",
    utc: "17:44:00 UTC",
    altKm: 111.0,
    velocityKmh: 5800,
    event: "Undocking in Lunar Orbit",
    quote: "Armstrong: 'The Eagle has wings.'",
    alarm: null,
    dsky: { prog: "00", verb: "37", noun: "00" },
  },
  {
    get: "102:33:05",
    utc: "20:05:05 UTC",
    altKm: 14.88,
    velocityKmh: 6010,
    event: "Powered Descent Initiation (PDI)",
    quote: "DPS engine ignites at 10% throttle for 26s, then ramps to 92.6% maximum thrust.",
    alarm: null,
    dsky: { prog: "63", verb: "06", noun: "61" },
  },
  {
    get: "102:38:22",
    utc: "20:10:22 UTC",
    altKm: 10.21,
    velocityKmh: 4200,
    event: "Program Alarm 1202 (Executive Overflow)",
    quote: "Armstrong: 'Program Alarm.' / Aldrin: 'It's a 1202.' / Duke: 'We got you, Eagle. It's a Go on that alarm.'",
    alarm: "1202 EXECUTIVE OVERFLOW",
    alarmNote:
      "Rendezvous radar slewing switch fed 800 Hz noise, stealing 15% CPU. Margaret Hamilton's priority executive software dropped low-priority displays to preserve throttle control.",
    dsky: { prog: "63", verb: "99", noun: "05", alarmCode: "1202" },
  },
  {
    get: "102:41:37",
    utc: "20:13:37 UTC",
    altKm: 2.13,
    velocityKmh: 1850,
    event: "High Gate (P64 Approach Pitchover)",
    quote: "Eagle pitches upright to 46° so Armstrong can sight the landing field through the window reticle.",
    alarm: null,
    dsky: { prog: "64", verb: "06", noun: "64" },
  },
  {
    get: "102:42:18",
    utc: "20:14:18 UTC",
    altKm: 1.52,
    velocityKmh: 1200,
    event: "Program Alarm 1201 (Core Sets Full)",
    quote: "Duke: 'Roger. 1201 alarm. We're Go. Same type. We're Go, Flight.'",
    alarm: "1201 CORE OVERFLOW",
    alarmNote: "Guidance Officer Steve Bales & Jack Garman confirm system recovery in real-time.",
    dsky: { prog: "64", verb: "99", noun: "05", alarmCode: "1201" },
  },
  {
    get: "102:43:13",
    utc: "20:15:13 UTC",
    altKm: 0.335,
    velocityKmh: 60,
    event: "Low Gate & Manual P66 Takeover",
    quote: "Armstrong spots 180m boulder-strewn West Crater directly ahead and switches to manual attitude hold (P66).",
    alarm: null,
    dsky: { prog: "66", verb: "06", noun: "68" },
  },
  {
    get: "102:44:27",
    utc: "20:16:27 UTC",
    altKm: 0.068,
    velocityKmh: 18,
    event: "Propellant Low Warning Light",
    quote: "Duke: '60 seconds!' (Countdown to mandatory abort before unporting oxidizer).",
    alarm: "PROPELLANT LOW",
    alarmNote: "Only 25 seconds of usable hover fuel remaining.",
    dsky: { prog: "66", verb: "06", noun: "68", lowFuel: true },
  },
  {
    get: "102:45:39",
    utc: "20:17:39 UTC",
    altKm: 0.0017,
    velocityKmh: 2,
    event: "Contact Light (Surface Sensing Probe)",
    quote: "Aldrin: 'Contact Light! Engine stop. ACA out of detent. Mode control, both Auto.'",
    alarm: null,
    dsky: { prog: "66", verb: "06", noun: "68", contact: true },
  },
  {
    get: "102:45:58",
    utc: "20:17:58 UTC",
    altKm: 0.0,
    velocityKmh: 0,
    event: "Touchdown at Tranquility Base",
    quote: "Armstrong: 'Houston, Tranquility Base here. The Eagle has landed.' / Duke: 'Roger, Tranquility. We copy you on the ground. You got a bunch of guys about to turn blue. We're breathing again. Thanks a lot.'",
    alarm: null,
    dsky: { prog: "68", verb: "37", noun: "68", landed: true },
  },
];
