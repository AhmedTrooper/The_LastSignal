/**
 * Strictly Verified Master Dossier & Telemetry for Ranger 7 (1964-041A)
 * Sources: NASA SP-61, SP-62, SP-63, NSSDCA (1964-041A), LPI Ranger Archive, LROC NAC M153014430L
 */

export interface RangerKeyframe {
  id: string;
  camera: "A" | "B" | "P";
  cameraLabel: string;
  plate: number;
  utc: string;
  tMinusSec: number;
  altitudeKm: number;
  slantRangeKm?: number;
  spacecraftLat?: number;
  spacecraftLon?: number;
  targetLat?: number;
  targetLon?: number;
  scaleKm?: number;
  browseUrl: string;
  printUrl?: string;
  metaUrl: string;
  featureNote: string;
  isImpactFrame?: boolean;
}

export const RANGER_7_MISSION = {
  cosparId: "1964-041A",
  noradCat: "00842",
  name: "Ranger 7",
  block: "Block III Lunar Impactor",
  launchUtc: "1964-07-28T16:50:07Z",
  launchPad: "Cape Canaveral LC-12 (Atlas LV-3 Agena-B)",
  impactUtc: "1964-07-31T13:25:48.820Z",
  impactVelocityKms: 2.62,
  impactVelocityKmh: 9432,
  impactCoordinates: {
    lat: -10.6340,
    lon: -20.6771,
    eastLon: 339.323,
    region: "Mare Cognitum",
    namedMeaning: "The Sea That Has Become Known",
  },
  crater: {
    diameterMeters: 14,
    lrocFrame: "M153014430L",
    lowSunFrame: "M132963565R",
    apollo16Frame: "AS16-P-5430",
    lrocImageUrl: "https://lroc.im-ldi.com/news/uploads/LROCiotw/M153014430L_thumb.png",
    lrocAnalysisUrl: "https://lroc.im-ldi.com/images/52",
    description: "Bright fresh 14-meter impact crater with asymmetric ejecta rays excavated on impact in Mare Cognitum.",
  },
  telecom: [
    { freq: "959.52 MHz", channel: "Channel F (Full-Scan Video)", power: "60 W", station: "DSS-11 Goldstone, CA" },
    { freq: "960.58 MHz", channel: "Channel P (Partial-Scan Video)", power: "60 W", station: "DSS-12 Goldstone, CA" },
    { freq: "960.05 MHz", channel: "Tracking Transponder", power: "3 W", station: "Deep Space Network" },
  ],
  cameras: [
    {
      id: "F-a",
      name: "Camera F-a (Full-Scan Wide-Angle)",
      lens: "25 mm, f/0.95 Angénieux M1",
      fov: "25° × 25°",
      scanLines: 1150,
      exposure: "2.56 s frame exposure",
      target: "11 × 11 mm vidicon target",
    },
    {
      id: "F-b",
      name: "Camera F-b (Full-Scan Narrow-Angle)",
      lens: "76 mm, f/2.0",
      fov: "8.4° × 8.4°",
      scanLines: 1150,
      exposure: "2.56 s frame exposure",
      target: "11 × 11 mm vidicon target",
    },
    {
      id: "P1-P2",
      name: "Cameras P1 & P2 (Partial-Scan Narrow-Angle)",
      lens: "76 mm, f/2.0",
      fov: "2.1° × 2.1°",
      scanLines: 300,
      exposure: "0.2 s rapid exposure",
      target: "2.8 × 2.8 mm vidicon target",
    },
    {
      id: "P3-P4",
      name: "Cameras P3 & P4 (Partial-Scan Wide-Angle)",
      lens: "25 mm, f/0.95",
      fov: "6.3° × 6.3°",
      scanLines: 300,
      exposure: "0.2 s rapid exposure",
      target: "2.8 × 2.8 mm vidicon target",
    },
  ],
  luckyPeanuts: {
    origin: "Origin of NASA's 'Lucky Peanuts' Tradition",
    date: "July 31, 1964",
    story:
      "After six consecutive Ranger failures (Rangers 1–6 either failed to leave orbit, missed the Moon, or had cameras short out), JPL Mission Trajectory Engineer Dick Wallace passed around jars of peanuts in the Space Flight Operations Facility to calm nerves. Ranger 7 worked flawlessly, establishing a beloved 60-year JPL tradition where engineers eat lucky peanuts during every critical planetary launch and landing.",
  },
};

export const getLpiBrowseUrl = (cam: "A" | "B" | "P", plate: number): string =>
  `https://www.lpi.usra.edu/resources/ranger/images/browse/7/${cam}/${String(plate).padStart(3, "0")}.jpg`;

export const getLpiPrintUrl = (cam: "A" | "B" | "P", plate: number): string =>
  `https://www.lpi.usra.edu/resources/ranger/images/print/7/${cam}/${String(plate).padStart(3, "0")}.jpg`;

export const getLpiMetaUrl = (cam: "A" | "B" | "P", plate: number): string =>
  `https://www.lpi.usra.edu/resources/ranger/frame/?msn=7&cam=${cam}&plt=${plate}`;

export const RANGER_KEYFRAMES: RangerKeyframe[] = [
  {
    id: "f1",
    camera: "A",
    cameraLabel: "Camera F-a (Wide-Angle)",
    plate: 1,
    utc: "13:08:45.000",
    tMinusSec: 1023.82,
    altitudeKm: 2110.0,
    browseUrl: getLpiBrowseUrl("A", 1),
    printUrl: getLpiPrintUrl("A", 1),
    metaUrl: getLpiMetaUrl("A", 1),
    featureNote: "First U.S. close-up photograph of the Moon. Centered near 13° S, 10° W showing 108-km crater Alphonsus.",
  },
  {
    id: "f2",
    camera: "A",
    cameraLabel: "Camera F-a (Wide-Angle)",
    plate: 41,
    utc: "13:12:17.360",
    tMinusSec: 811.46,
    altitudeKm: 1707.35,
    slantRangeKm: 1770.24,
    spacecraftLat: -4.07,
    spacecraftLon: -34.23,
    targetLat: -13.09,
    targetLon: -27.92,
    scaleKm: 177.4,
    browseUrl: getLpiBrowseUrl("A", 41),
    printUrl: getLpiPrintUrl("A", 41),
    metaUrl: getLpiMetaUrl("A", 41),
    featureNote: "Wide-scan frame crossing onto Mare Nubium. Resolving primary ejecta blanket structures.",
  },
  {
    id: "f3",
    camera: "P",
    cameraLabel: "Camera P-1 (High-Speed Partial)",
    plate: 1,
    utc: "13:12:20.400",
    tMinusSec: 808.42,
    altitudeKm: 1700.12,
    spacecraftLat: -4.10,
    spacecraftLon: -34.21,
    browseUrl: getLpiBrowseUrl("P", 1),
    printUrl: getLpiPrintUrl("P", 1),
    metaUrl: getLpiMetaUrl("P", 1),
    featureNote: "First high-speed P-channel exposure (300 scan lines, 0.2 s exposure) initiated 13.5 minutes before impact.",
  },
  {
    id: "f4",
    camera: "B",
    cameraLabel: "Camera F-b (Narrow-Angle)",
    plate: 104,
    utc: "13:17:32.240",
    tMinusSec: 496.58,
    altitudeKm: 1083.01,
    slantRangeKm: 1287.10,
    spacecraftLat: -5.73,
    spacecraftLon: -30.97,
    targetLat: -12.54,
    targetLon: -14.00,
    scaleKm: 45.0,
    browseUrl: getLpiBrowseUrl("B", 104),
    printUrl: getLpiPrintUrl("B", 104),
    metaUrl: getLpiMetaUrl("B", 104),
    featureNote: "Narrow-angle telephoto view of Guericke crater and northern Mare Nubium.",
  },
  {
    id: "f5",
    camera: "B",
    cameraLabel: "Camera F-b (Narrow-Angle)",
    plate: 143,
    utc: "13:20:51.920",
    tMinusSec: 296.90,
    altitudeKm: 665.29,
    slantRangeKm: 798.96,
    spacecraftLat: -7.19,
    spacecraftLon: -27.97,
    targetLat: -11.91,
    targetLon: -16.31,
    scaleKm: 27.7,
    browseUrl: getLpiBrowseUrl("B", 143),
    printUrl: getLpiPrintUrl("B", 143),
    metaUrl: getLpiMetaUrl("B", 143),
    featureNote: "Closing in on the target basin. Small secondary impact craters become clearly distinguishable.",
  },
  {
    id: "f6",
    camera: "P",
    cameraLabel: "Camera P-1 (High-Speed Partial)",
    plate: 150,
    utc: "13:25:14.840",
    tMinusSec: 33.98,
    altitudeKm: 74.50,
    spacecraftLat: -10.12,
    spacecraftLon: -21.79,
    browseUrl: getLpiBrowseUrl("P", 150),
    printUrl: getLpiPrintUrl("P", 150),
    metaUrl: getLpiMetaUrl("P", 150),
    featureNote: "T-34 seconds: Spacecraft plunging at 2.62 km/s. Altitude drops below 75 km.",
  },
  {
    id: "f7",
    camera: "A",
    cameraLabel: "Camera F-a (Wide-Angle)",
    plate: 199,
    utc: "13:25:46.320",
    tMinusSec: 2.50,
    altitudeKm: 5.85,
    slantRangeKm: 6.46,
    spacecraftLat: -10.55,
    spacecraftLon: -20.76,
    targetLat: -10.60,
    targetLon: -20.69,
    scaleKm: 0.6,
    browseUrl: getLpiBrowseUrl("A", 199),
    printUrl: getLpiPrintUrl("A", 199),
    metaUrl: getLpiMetaUrl("A", 199),
    featureNote: "Final full Camera A frame. Shows smooth regolith peppered with small craters, proving Apollo can land safely.",
  },
  {
    id: "f8",
    camera: "P",
    cameraLabel: "Camera P-3 (Partial-Scan Final)",
    plate: 200,
    utc: "13:25:48.630",
    tMinusSec: 0.19,
    altitudeKm: 0.519,
    spacecraftLat: -10.6340,
    spacecraftLon: -20.6771,
    browseUrl: getLpiBrowseUrl("P", 200),
    printUrl: getLpiPrintUrl("P", 200),
    metaUrl: getLpiMetaUrl("P", 200),
    featureNote: "Final transmission. Captured at 519 m altitude. Mid-scan transmission terminates into receiver static noise at 13:25:48.82 UTC upon impact.",
    isImpactFrame: true,
  },
];
