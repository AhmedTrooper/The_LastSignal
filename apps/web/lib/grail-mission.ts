/**
 * Verified technical and archival mission data for GRAIL Ebb & Flow (COSPAR: 2011-046A/B).
 * Sources:
 * - NASA Space Science Data Coordinated Archive (NSSDCA) ID: 2011-046A (Ebb) & 2011-046B (Flow)
 * - Science Magazine GRAIL Special Issue (Zuber et al., Science Vol 339, Feb 2013 "Gravity Field of the Moon from GRAIL")
 * - Wieczorek et al., Science Vol 339, Feb 2013 "The Crust of the Moon as Seen by GRAIL"
 * - Arizona State University LROC Operations Center (Image M1115786064R - Sally K. Ride Impact Site)
 */

export interface GRAILSpecs {
  name: string;
  cosparIdA: string;
  cosparIdB: string;
  noradIdA: number;
  noradIdB: number;
  launchDateUtc: string;
  impactDateUtc: string;
  impactTarget: {
    siteName: string;
    feature: string;
    lat: number;
    lon: number;
    elevationMeters: number;
    lrocFrame: string;
  };
  spacecraftMassKg: {
    ebbLaunchKg: number;
    flowLaunchKg: number;
    impactMassKg: number;
  };
  gravityRangingPrecision: {
    frequencyBand: string;
    velocityPrecisionMicrometersPerSec: number;
    separationDistanceKm: string;
    sphericalHarmonicDegree: number;
  };
  crustalDiscoveries: {
    averageThicknessKm: string;
    previousApolloEstimateKm: number;
    crustalPorosityPct: number;
    subsurfaceMagmaDikesLengthKm: string;
  };
  moonkamEngagement: {
    programLeader: string;
    participatingStudents: number;
    imagesTakenByKids: number;
  };
}

export const GRAIL_SPECS: GRAILSpecs = {
  name: "GRAIL (Gravity Recovery and Interior Laboratory) - Ebb & Flow",
  cosparIdA: "2011-046A",
  cosparIdB: "2011-046B",
  noradIdA: 37801,
  noradIdB: 37802,
  launchDateUtc: "2011-09-10T13:08:52 UTC",
  impactDateUtc: "2012-12-17T22:28:51 UTC (Ebb) & 22:29:21 UTC (Flow)",
  impactTarget: {
    siteName: "Sally K. Ride Impact Site",
    feature: "2,500-meter mountain ridge between Philolaus and Mouchez craters",
    lat: 75.62,
    lon: 333.4, // 26.6° W
    elevationMeters: 2500,
    lrocFrame: "M1115786064R",
  },
  spacecraftMassKg: {
    ebbLaunchKg: 202.4,
    flowLaunchKg: 202.4,
    impactMassKg: 130, // Dry mass at empty tank impact
  },
  gravityRangingPrecision: {
    frequencyBand: "Ka-band (32 GHz) Lunar Gravity Ranging System (LGRS)",
    velocityPrecisionMicrometersPerSec: 0.02, // 20 nanometers per second!
    separationDistanceKm: "75 to 225 km tandem separation",
    sphericalHarmonicDegree: 660,
  },
  crustalDiscoveries: {
    averageThicknessKm: "34 to 43 km (Mean: 38 km)",
    previousApolloEstimateKm: 60, // Slashed Apollo estimate in half!
    crustalPorosityPct: 12, // Deeply fractured regolith
    subsurfaceMagmaDikesLengthKm: "Up to 500 km linear dikes",
  },
  moonkamEngagement: {
    programLeader: "Dr. Sally K. Ride (First American Woman in Space)",
    participatingStudents: 100000,
    imagesTakenByKids: 119830,
  },
};

export interface GravityAnomalyRecord {
  featureName: string;
  type: "Mascon Basin" | "Magma Dike" | "Impact Crater" | "Highland Crust";
  freeAirAnomalyMGal: number;
  crustalThicknessKm: number;
  significance: string;
}

export const GRAIL_ANOMALIES: GravityAnomalyRecord[] = [
  {
    featureName: "Mare Serenitatis Mascon",
    type: "Mascon Basin",
    freeAirAnomalyMGal: +380,
    crustalThicknessKm: 28,
    significance: "Intense gravitational bullseye caused by dense uncompensated mantle uplift beneath flood basalts.",
  },
  {
    featureName: "Procellarum Magma Dikes",
    type: "Magma Dike",
    freeAirAnomalyMGal: +65,
    crustalThicknessKm: 32,
    significance: "Subsurface linear structures up to 500 km long, proving the Moon underwent thermal expansion billions of years ago.",
  },
  {
    featureName: "South Pole-Aitken Basin",
    type: "Impact Crater",
    freeAirAnomalyMGal: -140,
    crustalThicknessKm: 18,
    significance: "The thinnest crust on the Moon; giant impact punched deep into the lower crust and mantle.",
  },
  {
    featureName: "Far Side Lunar Highlands",
    type: "Highland Crust",
    freeAirAnomalyMGal: -80,
    crustalThicknessKm: 55,
    significance: "Thick anorthositic 'flotation crust' formed as ancient magma ocean cooled and solidified.",
  },
];
