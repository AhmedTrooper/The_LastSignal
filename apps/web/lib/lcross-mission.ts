/**
 * Verified technical and scientific data for LCROSS (COSPAR: 2009-031B/C).
 * Sources:
 * - NASA Space Science Data Coordinated Archive (NSSDCA) ID: 2009-031B (Shepherding Spacecraft) & 2009-031C (Centaur)
 * - Science Magazine LCROSS Special Issue (Colaprete et al., Science Vol 330, Oct 2010 "Detection of Water in the LCROSS Ejecta Plume")
 * - Schultz et al., Science Vol 330, Oct 2010 "The LCROSS Cratering Experiment"
 * - Arizona State University LROC Operations Center (Image M119827295RE)
 */

export interface LCROSSSpecs {
  name: string;
  cosparId: string;
  noradId: number;
  launchDateUtc: string;
  impactDateUtc: string;
  impactTarget: {
    crater: string;
    feature: string;
    lat: number;
    lon: number;
    temperatureKelvin: number;
    temperatureCelsius: number;
    lrocFrame: string;
  };
  hardwareStages: {
    centaurStage: {
      massKg: number;
      impactSpeedMs: number;
      impactSpeedKmh: number;
      kineticEnergyGJ: number;
      craterDiameterMeters: number;
      craterDepthMeters: number;
      ejectaPlumeMassKg: number;
    };
    shepherdingCraft: {
      massKg: number;
      instrumentsCount: number;
      separationDelaySeconds: number;
      impactTimeOffsetSeconds: number;
    };
  };
  waterDiscoveryMetrics: {
    waterVaporMassExcavatedKg: number;
    waterPercentageByMass: string;
    spectralBandsAnalyzed: string[];
  };
}

export const LCROSS_SPECS: LCROSSSpecs = {
  name: "LCROSS (Lunar Crater Observation and Sensing Satellite)",
  cosparId: "2009-031B",
  noradId: 35316,
  launchDateUtc: "2009-06-18T21:32:00 UTC",
  impactDateUtc: "2009-10-09T11:31:19 UTC (Centaur) / 11:35:36 UTC (S-SC)",
  impactTarget: {
    crater: "Cabeus Crater",
    feature: "Permanently Shadowed Region (PSR) floor near South Pole",
    lat: -84.9,
    lon: 315.1, // 44.9° W
    temperatureKelvin: 40,
    temperatureCelsius: -233,
    lrocFrame: "M119827295RE",
  },
  hardwareStages: {
    centaurStage: {
      massKg: 2305,
      impactSpeedMs: 2500,
      impactSpeedKmh: 9000,
      kineticEnergyGJ: 7.2, // ~1.72 tons of TNT equivalent
      craterDiameterMeters: 20,
      craterDepthMeters: 4,
      ejectaPlumeMassKg: 350000, // 350 metric tons
    },
    shepherdingCraft: {
      massKg: 566,
      instrumentsCount: 9, // 5 cameras, 3 spectrometers, 1 radiometer
      separationDelaySeconds: 240, // 4 minutes behind
      impactTimeOffsetSeconds: 257,
    },
  },
  waterDiscoveryMetrics: {
    waterVaporMassExcavatedKg: 155, // 155 ± 12 kg
    waterPercentageByMass: "5.6 ± 2.9% by mass of excavated regolith",
    spectralBandsAnalyzed: [
      "1.4 µm (H2O vibrational absorption)",
      "1.9 µm (H2O overtone band)",
      "308 nm (OH radical UV fluorescence)",
    ],
  },
};

export interface VolatileMolecule {
  name: string;
  formula: string;
  relativeAbundanceToWaterPct: number;
  scienceSignificance: string;
}

export const LCROSS_VOLATILES: VolatileMolecule[] = [
  {
    name: "Water Ice / Vapor",
    formula: "H2O",
    relativeAbundanceToWaterPct: 100.0,
    scienceSignificance: "Proved pure water ice exists inside ultra-cold lunar shadow traps, essential for rocket fuel (LH2/LOX) and future bases.",
  },
  {
    name: "Carbon Monoxide",
    formula: "CO",
    relativeAbundanceToWaterPct: 5.7,
    scienceSignificance: "Cometary origin indicator, showing ancient comets bombarded the Moon billions of years ago.",
  },
  {
    name: "Hydrogen Gas",
    formula: "H2",
    relativeAbundanceToWaterPct: 3.7,
    scienceSignificance: "Solar wind protons implanted into lunar minerals over eons.",
  },
  {
    name: "Ammonia",
    formula: "NH3",
    relativeAbundanceToWaterPct: 6.0,
    scienceSignificance: "Vital nitrogen source for lunar agriculture and life support systems.",
  },
  {
    name: "Hydrogen Sulfide",
    formula: "H2S",
    relativeAbundanceToWaterPct: 1.6,
    scienceSignificance: "Volatile sulfur compound preserved since primitive solar nebula condensation.",
  },
  {
    name: "Methane",
    formula: "CH4",
    relativeAbundanceToWaterPct: 0.65,
    scienceSignificance: "Simple organic hydrocarbon preserved in the -233°C cold trap.",
  },
  {
    name: "Sulfur Dioxide",
    formula: "SO2",
    relativeAbundanceToWaterPct: 0.5,
    scienceSignificance: "Evidence of lunar volcanic outgassing and primordial interior volatiles.",
  },
];
