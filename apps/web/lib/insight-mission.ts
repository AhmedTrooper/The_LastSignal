/**
 * 2026 NASA Space Apps Challenge - Master InSight Mission Dossier
 * "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"
 *
 * InSight Mars Geophysical Lander (COSPAR: 2018-042A / Discovery Program #12)
 * Verified sources:
 * - NASA Space Science Data Coordinated Archive (NSSDCA)
 * - PDS Geosciences Node (SEIS, HP3, RISE)
 * - IRIS / EarthScope FDSN Station ELYSE (Network Code XB)
 * - University of Arizona HiRISE Operations Center (ESP_057939_1845, ESP_061684_1845)
 * - NASA/JPL Photojournal & SEIS Science Team (IPGP / CNES)
 */

export interface MarsquakeEvent {
  id: string;
  sol: number;
  dateUtc: string;
  magnitude: number;
  type: "low-frequency" | "high-frequency" | "monster" | "impact";
  distanceKm?: number;
  durationMin: number;
  description: string;
  sonifiedAudioPia?: string;
}

export const INSIGHT_SPECS = {
  officialName: "InSight",
  fullName: "Interior Exploration using Seismic Investigations, Geodesy and Heat Transport",
  cosparId: "2018-042A",
  noradId: 43457,
  discoveryMissionNumber: 12,
  manufacturer: "Lockheed Martin Space (Littleton, Colorado)",
  heritage: "Derived from the 2008 Phoenix Mars Polar Lander architecture",
  accompanyingCubeSats: "MarCO-A (EVE, 2018-042B) & MarCO-B (WALL-E, 2018-042C) — first interplanetary CubeSats",
  launchDateUtc: "2018-05-05T11:05:01Z",
  launchVehicle: "Atlas V 401 (AV-078)",
  launchPad: "Vandenberg Space Force Base SLC-3E (first interplanetary mission from US West Coast)",
  massBreakdownKg: {
    totalLaunch: 694,
    landedDry: 358,
    aeroshell: 189,
    cruiseStage: 79,
    propellant: 67,
  },
  dimensions: {
    deckWidthM: 1.56,
    deckHeightM: "0.83 to 1.08 m (on crushable titanium legs)",
    solarWingSpanM: 6.0, // Twin decagonal UltraFlex fan-out wings, 2.15 m diameter each
    roboticArmReachM: 2.4, // Instrument Deployment Arm (IDA) with 5-finger grapple
  },
  landingDateUtc: "2018-11-26T19:52:59Z", // Spacecraft Event Time
  landingSite: {
    name: "Homestead Hollow, Western Elysium Planitia",
    description: "Degraded 27-meter wide sand-filled impact crater",
    coordinates: {
      lat: 4.502384,
      lon: 135.623447,
      elevationM: -2655,
    },
    deckTiltDeg: 4.0,
  },
  operationalLifespan: {
    solsActive: 1440,
    earthDaysActive: 1480, // 4 years, 19 days (>2× its 709-sol primary mission)
    finalTransmissionDate: "December 15, 2022 (Sol 1440)",
    formalConclusionDate: "December 20, 2022",
  },
  interiorStructureModel: {
    crustThicknessKm: "24 to 72 km global average (~39–47 km beneath Homestead Hollow, multi-layered)",
    lithosphereDepthKm: "400 to 600 km thick rigid single-plate cap (explaining lack of plate tectonics)",
    coreRadiusKm: 1830, // ±40 km, completely liquid Fe-Ni alloy enriched with 20% light elements (S, O, C, H)
    basalSilicateLayerKm: "~150 km molten silicate jacket surrounding the metallic core",
  },
};

export const MARSQUAKE_CATALOG: MarsquakeEvent[] = [
  {
    id: "S0128a",
    sol: 128,
    dateUtc: "2019-04-06",
    magnitude: 2.1,
    type: "low-frequency",
    durationMin: 12,
    description: "First confirmed Marsquake in history: faint trembling detected by SEIS Very Broad Band (VBB) sensors.",
    sonifiedAudioPia: "PIA23209",
  },
  {
    id: "S0173a",
    sol: 173,
    dateUtc: "2019-05-22",
    magnitude: 3.7,
    type: "low-frequency",
    distanceKm: 1600,
    durationMin: 35,
    description: "Originating in Cerberus Fossae fault system, showing clear P-wave and S-wave phase separation.",
    sonifiedAudioPia: "PIA23354",
  },
  {
    id: "S1003a",
    sol: 1003,
    dateUtc: "2021-09-18",
    magnitude: 4.0,
    type: "impact",
    durationMin: 18,
    description: "Acoustic meteoroid impact chirp ('Bloop!'): exploding bolide excavating a fresh 150 m crater with ice blocks.",
    sonifiedAudioPia: "PIA25563",
  },
  {
    id: "S1222a",
    sol: 1222,
    dateUtc: "2022-05-04",
    magnitude: 4.7,
    type: "monster",
    distanceKm: 2200,
    durationMin: 360, // 6 hours
    description: "Largest Marsquake ever recorded: magnitude 4.7 monster reverberating globally through the crust for six hours.",
    sonifiedAudioPia: "PIA25285",
  },
];

export const INSIGHT_HARDWARE_MANIFEST = [
  {
    id: "seis-wts",
    name: "SEIS & Wind/Thermal Shield (WTS)",
    location: "1.636 m SSW of lander deck",
    deployedDate: "December 19, 2018 (Sol 22) / WTS on Sol 66",
    massKg: 11.5,
    description: "Three Very Broad Band (VBB) inverted pendulums in a vacuum sphere inside a white aerodynamic dome fringed with gold Kapton chainmail. Detected 1,319 marsquakes.",
  },
  {
    id: "hp3-mole",
    name: "HP³ 'The Mole' & Subsurface Sensor",
    location: "~1.2 m SE of lander deck",
    deployedDate: "February 12, 2019 (Sol 76) / Buried Sol 754",
    massKg: 3.1,
    description: "Self-hammering tungsten spike designed to penetrate 3–5 m. Overcame 20 cm thick cohesive duricrust with robotic arm scoop pinning, resting buried ~37 cm underground.",
  },
  {
    id: "larri-retroreflector",
    name: "LaRRI Laser Retroreflector Dome",
    location: "Mounted on lander deck",
    deployedDate: "Active permanently (passive optical target)",
    massKg: 0.1,
    description: "8 fused-silica corner cubes from Italian Space Agency (ASI). Requires zero power and remains optically functional for future laser-ranging orbiters.",
  },
  {
    id: "public-microchips",
    name: "Silicon Microchips (2,429,807 Names)",
    location: "Bolted to lander deck",
    deployedDate: "Etched 2015 & 2017 (PIA22101)",
    massKg: 0.02,
    description: "Two 8 mm electron-beam-etched silicon wafers carrying 2.43 million human names submitted worldwide.",
  },
  {
    id: "aeroshell-heatshield",
    name: "Aeroshell Heat Shield & Parachute",
    location: "Heat shield ~760 m NE; Parachute ~610 m S",
    deployedDate: "November 26, 2018 (Landing Day)",
    massKg: 189,
    description: "2.64 m diameter thermal protection shield and 11.8 m disk-gap-band parachute resolved in HiRISE image ESP_057939_1845.",
  },
];
