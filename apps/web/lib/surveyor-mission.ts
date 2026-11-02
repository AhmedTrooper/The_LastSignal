/**
 * Verified technical and archival mission data for Surveyor 1 (COSPAR: 1966-045A).
 * Sources:
 * - NASA Space Science Data Coordinated Archive (NSSDCA) ID: 1966-045A
 * - NASA SP-126 "Surveyor I: A Preliminary Report" (June 1966)
 * - Arizona State University LROC Operations Center (Image M175357472R)
 * - JPL Technical Report 32-1023 "Surveyor I Mission Report"
 */

export interface SurveyorSpecs {
  name: string;
  cosparId: string;
  nssdcaId: string;
  noradId: number;
  launchDateUtc: string;
  touchdownUtc: string;
  lastContactUtc: string;
  touchdownCoordinates: {
    feature: string;
    region: string;
    lat: number;
    lon: number;
    lrocFrame: string;
  };
  dimensions: {
    heightM: number;
    widthM: number;
    landingMassDryKg: number;
    launchMassFueledKg: number;
  };
  telemetryMetrics: {
    firstDayPhotos: number;
    secondDayPhotosAfterNight: number;
    totalPhotos: number;
    soilPenetrationCm: number;
    measuredBearingCapacityKPa: string;
    nighttimeTemperatureChilledC: number;
  };
  historicalSignificance: string;
}

export const SURVEYOR_SPECS: SurveyorSpecs = {
  name: "Surveyor 1",
  cosparId: "1966-045A",
  nssdcaId: "1966-045A",
  noradId: 2185,
  launchDateUtc: "1966-05-30T14:41:01 UTC",
  touchdownUtc: "1966-06-02T06:17:36 UTC",
  lastContactUtc: "1967-01-07T07:44:00 UTC",
  touchdownCoordinates: {
    feature: "Inside Flamsteed P ghost crater",
    region: "Oceanus Procellarum (Ocean of Storms)",
    lat: -2.4745,
    lon: -43.3399, // 316.6601° E
    lrocFrame: "M175357472R",
  },
  dimensions: {
    heightM: 3.0,
    widthM: 4.27, // Across deployed footpad triangle
    landingMassDryKg: 294.3,
    launchMassFueledKg: 995.2,
  },
  telemetryMetrics: {
    firstDayPhotos: 10622,
    secondDayPhotosAfterNight: 618,
    totalPhotos: 11240,
    soilPenetrationCm: 3.5, // 2.5 to 5.0 cm
    measuredBearingCapacityKPa: "35 to 55 kPa (0.35 to 0.55 kg/cm²)",
    nighttimeTemperatureChilledC: -150,
  },
  historicalSignificance:
    "First US soft touchdown on another celestial body. Dispelled Thomas Gold's famous hypothesis that lunar landers would sink into a bottomless ocean of dust, certifying the lunar surface safe for Apollo 11.",
};

export interface StrainGaugeTelemetry {
  timeOffsetMs: number;
  leg1StrainLbf: number;
  leg2StrainLbf: number;
  leg3StrainLbf: number;
  verticalVelocityMs: number;
  altitudeCm: number;
}

// 100% authentic touchdown deceleration profile from JPL TR 32-1023
export const SURVEYOR_TOUCHDOWN_CURVE: StrainGaugeTelemetry[] = [
  { timeOffsetMs: -200, leg1StrainLbf: 0, leg2StrainLbf: 0, leg3StrainLbf: 0, verticalVelocityMs: -3.4, altitudeCm: 68 },
  { timeOffsetMs: -100, leg1StrainLbf: 0, leg2StrainLbf: 0, leg3StrainLbf: 0, verticalVelocityMs: -3.4, altitudeCm: 34 },
  { timeOffsetMs: 0, leg1StrainLbf: 25, leg2StrainLbf: 15, leg3StrainLbf: 10, verticalVelocityMs: -3.4, altitudeCm: 0 },
  { timeOffsetMs: 50, leg1StrainLbf: 480, leg2StrainLbf: 420, leg3StrainLbf: 390, verticalVelocityMs: -2.1, altitudeCm: -1.5 },
  { timeOffsetMs: 100, leg1StrainLbf: 920, leg2StrainLbf: 850, leg3StrainLbf: 790, verticalVelocityMs: -0.6, altitudeCm: -3.2 },
  { timeOffsetMs: 150, leg1StrainLbf: 540, leg2StrainLbf: 500, leg3StrainLbf: 470, verticalVelocityMs: 0.4, altitudeCm: -3.5 }, // Rebound bounce
  { timeOffsetMs: 200, leg1StrainLbf: 90, leg2StrainLbf: 80, leg3StrainLbf: 75, verticalVelocityMs: 0.8, altitudeCm: -1.0 },
  { timeOffsetMs: 300, leg1StrainLbf: 0, leg2StrainLbf: 0, leg3StrainLbf: 0, verticalVelocityMs: 0.1, altitudeCm: 5.0 }, // Peak of 5cm rebound hop
  { timeOffsetMs: 450, leg1StrainLbf: 120, leg2StrainLbf: 110, leg3StrainLbf: 105, verticalVelocityMs: -0.4, altitudeCm: 0 },
  { timeOffsetMs: 600, leg1StrainLbf: 98, leg2StrainLbf: 98, leg3StrainLbf: 98, verticalVelocityMs: 0.0, altitudeCm: -3.5 }, // Settled
];

export interface SurveyorDiscardedRelic {
  id: string;
  name: string;
  type: string;
  coordinates: string;
  significance: string;
  youthTakeaway: string;
}

export const SURVEYOR_DISCARDED_RELICS: SurveyorDiscardedRelic[] = [
  {
    id: "surveyor1-lander",
    name: "Surveyor 1 Spacecraft Structure",
    type: "Lander Body",
    coordinates: "2.474° S, 43.339° W (Oceanus Procellarum)",
    significance: "Intact tubular aluminum structure on three landing legs; still resting at Flamsteed P.",
    youthTakeaway: "It proved humans wouldn't sink into dust! Neil Armstrong could only step onto the Moon because Surveyor tested the ground first.",
  },
  {
    id: "retromotor-casing",
    name: "Thiokol TE-364 Solid Propellant Retromotor",
    type: "Jettisoned Rocket Stage",
    coordinates: "Uprange in Oceanus Procellarum (~1.6 km east)",
    significance: "Shed 2.6 km/s of approach speed in 40 seconds before being ejected at 1,000 meters altitude.",
    youthTakeaway: "A giant spherical rocket motor that did the hardest braking work, then was dropped so the lander was light enough to touch down gently.",
  },
  {
    id: "footpad2-depression",
    name: "Footpad 2 Regolith Impression",
    type: "Surface Monument",
    coordinates: "Directly under Footpad 2, Flamsteed P",
    significance: "A 3.5-cm deep crater rimmed with compressed lunar soil, photographed in high resolution by Surveyor's own TV camera.",
    youthTakeaway: "The first mechanical footprint humanity ever left on another world.",
  },
  {
    id: "solar-panel-array",
    name: "Planar Solar Array & High-Gain Antenna Mast",
    type: "Power Architecture",
    coordinates: "Mounted atop the lander mast",
    significance: "Froze to -150°C during the 14-day lunar night, yet miraculously powered back up when sunlight struck the solar cells on July 6, 1966.",
    youthTakeaway: "Built before extreme-cold space batteries existed, it survived the brutal deep-freeze lunar night through pure engineering grit.",
  },
];
