/**
 * Verified technical and archival mission data for Viking 1 & Viking 2 Mars Landers.
 * Sources:
 * - NASA Space Science Data Coordinated Archive (NSSDCA) ID: 1975-075C (Viking 1 Lander) & 1975-083C (Viking 2 Lander)
 * - NASA JPL Viking Project Documents (SP-4212 "On Mars: Exploration of the Red Planet 1958-1978")
 * - University of Arizona HiRISE Operations Center (Frames PSP_001521_2025 & PSP_001501_2280)
 * - Nature / Science publications on Viking Biology (Levin & Straat, 1976; Klein et al., 1976; Biemann et al., 1977; Hecht et al. Science 2009 perchlorates)
 */

export interface VikingLanderSpecs {
  name: string;
  cosparId: string;
  nssdcaId: string;
  noradId: number;
  memorialName: string;
  landingDateUtc: string;
  lastContactUtc: string;
  activeSols: number;
  landingCoordinates: {
    region: string;
    lat: number;
    lon: number;
    elevationMeters: number;
    hiriseFrame: string;
  };
  dimensions: {
    heightM: number;
    spanM: number;
    landerMassKg: number;
    entryAeroshellMassKg: number;
  };
  powerSystem: string;
  powerOutputWatts: number;
  primaryCauseOfLoss: string;
}

export const VIKING_SPECS: Record<"viking-1" | "viking-2", VikingLanderSpecs> = {
  "viking-1": {
    name: "Viking 1 Lander",
    cosparId: "1975-075C",
    nssdcaId: "1975-075C",
    noradId: 8108,
    memorialName: "Thomas A. Mutch Memorial Station",
    landingDateUtc: "1976-07-20T11:53:06 UTC",
    lastContactUtc: "1982-11-11T20:30:00 UTC",
    activeSols: 2245,
    landingCoordinates: {
      region: "Chryse Planitia (The Golden Plain)",
      lat: 22.271,
      lon: 312.049, // 47.951° W
      elevationMeters: -2690,
      hiriseFrame: "PSP_001521_2025",
    },
    dimensions: {
      heightM: 2.1,
      spanM: 3.0,
      landerMassKg: 572,
      entryAeroshellMassKg: 978,
    },
    powerSystem: "2× SNAP-19 Radioisotope Thermoelectric Generators (Plutonium-238)",
    powerOutputWatts: 70, // 35W per RTG
    primaryCauseOfLoss:
      "A ground flight command uplink on Nov 11, 1982 intended to patch battery charging algorithms inadvertently overwritten the radio memory pointers controlling high-gain antenna orientation.",
  },
  "viking-2": {
    name: "Viking 2 Lander",
    cosparId: "1975-083C",
    nssdcaId: "1975-083C",
    noradId: 8261,
    memorialName: "Gerald A. Soffen Memorial Station",
    landingDateUtc: "1976-09-03T22:37:50 UTC",
    lastContactUtc: "1980-04-11T00:00:00 UTC",
    activeSols: 1281,
    landingCoordinates: {
      region: "Utopia Planitia",
      lat: 47.668,
      lon: 134.28, // 225.72° W
      elevationMeters: -4230,
      hiriseFrame: "PSP_001501_2280",
    },
    dimensions: {
      heightM: 2.1,
      spanM: 3.0,
      landerMassKg: 572,
      entryAeroshellMassKg: 978,
    },
    powerSystem: "2× SNAP-19 Radioisotope Thermoelectric Generators (Plutonium-238)",
    powerOutputWatts: 70,
    primaryCauseOfLoss:
      "Terminal battery depletion after nearly 4 years of continuous automated operations in sub-arctic Martian winters, ending telemetry relay to the orbiter.",
  },
};

export interface BiologyExperimentModel {
  name: string;
  principalInvestigator: string;
  technique: string;
  radioisotope: string;
  whatHappened: string;
  historicalDebate: string;
  modernPerchlorateExplanation: string;
}

export const VIKING_BIOLOGY_EXPERIMENTS: BiologyExperimentModel[] = [
  {
    name: "Labeled Release (LR)",
    principalInvestigator: "Gilbert V. Levin & Patricia Ann Straat",
    technique: "0.115 ml of carbon-14 labeled nutrient broth injected into 0.5 cm³ surface regolith",
    radioisotope: "14C (Carbon-14 formate, lactate, glycine, alanine, glucose)",
    whatHappened:
      "Immediate, explosive evolution of radioactive 14CO2 gas (>10,000 counts per minute). When pre-heated to 160°C (control), the soil produced virtually zero gas.",
    historicalDebate:
      "Dr. Levin maintained for 40+ years that this met NASA's pre-launch operational definition of life detection.",
    modernPerchlorateExplanation:
      "In 2008, NASA's Phoenix lander discovered 0.5% perchlorate salts (ClO4-) in Martian soil. Cosmic rays create hypochlorite and superoxides in perchlorates. When hydrated by the liquid nutrient, these superoxides rapidly combust organic acids into 14CO2 chemically, without living cells.",
  },
  {
    name: "Gas Chromatograph-Mass Spectrometer (GCMS)",
    principalInvestigator: "Klaus Biemann (MIT)",
    technique: "Soil heated in an oven to 50°C, 200°C, 350°C, and 500°C to volatilize organic molecules",
    radioisotope: "None (Molecular mass fragmentation spectrum)",
    whatHappened:
      "Found zero organic molecules above the instrument detection threshold of 1 part per billion (even less than Apollo Moon rocks).",
    historicalDebate:
      "Because the GCMS saw no carbon building blocks of life, NASA officially concluded that the Labeled Release result was a non-biological chemical reaction.",
    modernPerchlorateExplanation:
      "Heating Martian soil containing perchlorates inside the GCMS oven causes the perchlorates to thermal-decompose into pure oxygen and chlorine gas at 300°C+, immediately flash-incinerating any trace organics present in the chamber into undetectable CO2.",
  },
  {
    name: "Gas Exchange (GEX)",
    principalInvestigator: "Vance Oyama (NASA Ames)",
    technique: "Regolith exposed first to moisture (humidity) and then submerged in rich 'chicken soup' nutrient medium",
    radioisotope: "None (Gas chromatography of O2, CO2, N2, Ar, CH4)",
    whatHappened:
      "A sudden pulse of oxygen (O2) was released the moment humidity touched the soil, but adding liquid nutrient produced no sustained gas output.",
    historicalDebate:
      "The rapid oxygen pulse stopped after a few hours, inconsistent with multiplying bacteria.",
    modernPerchlorateExplanation:
      "Water vapor decomposed surface inorganic peroxides and titanium/iron complexes produced by solar ultraviolet irradiation.",
  },
  {
    name: "Pyrolytic Release (PR)",
    principalInvestigator: "Norman Horowitz (Caltech)",
    technique: "Soil illuminated by simulated solar light in an atmosphere of 14CO2 and 14CO to test for photosynthesis",
    radioisotope: "14CO2 / 14CO",
    whatHappened:
      "A tiny amount of carbon was incorporated into the soil, but similar weak synthesis was observed in control tests held at high temperatures.",
    historicalDebate:
      "Regarded by Horowitz as likely inorganic photocatalytic carbon fixation.",
    modernPerchlorateExplanation:
      "Iron oxides (hematite, maghemite) in the soil act as mild photocatalysts under UV light to fix atmospheric carbon monoxide into formates.",
  },
];

export interface FacsimileCameraSpec {
  cameraType: string;
  manufacturer: string;
  apertureMm: number;
  focalLengthMm: number;
  instantaneousFieldOfViewDeg: number;
  mirrorElevationRangeDeg: string;
  lineRateSeconds: number;
  encodingBits: number;
  firstPhotoDescription: string;
}

export const FACSIMILE_CAMERA_SPECS: FacsimileCameraSpec = {
  cameraType: "Dual Mechanical Nodding-Mirror Facsimile Scanner",
  manufacturer: "Itek Corporation (Optical Systems Division)",
  apertureMm: 9.5,
  focalLengthMm: 53.7,
  instantaneousFieldOfViewDeg: 0.04, // High-res mode (0.12° low-res)
  mirrorElevationRangeDeg: "-40° to +60° across vertical horizon",
  lineRateSeconds: 1.8, // Seconds per vertical line scan
  encodingBits: 12, // 6-bit compressed to 12-bit dynamic range
  firstPhotoDescription:
    "Viking 1 Lander Footpad 2, taken just 25 seconds after touchdown on July 20, 1976. Showed fine Martian sand, pitted volcanic pebbles, and proving the lander had settled stably on solid ground.",
};

export interface DiscardedVikingRelic {
  id: string;
  lander: "viking-1" | "viking-2";
  name: string;
  classification: "Lander Structure" | "Aeroshell" | "Parachute & Backshell" | "Excavation Trench" | "Time Capsule";
  distanceFromLanderMeters: number;
  coordinates: string;
  condition: string;
  significance: string;
  youthInsight: string;
}

export const VIKING_DISCARDED_RELICS: DiscardedVikingRelic[] = [
  {
    id: "v1-lander",
    lander: "viking-1",
    name: "Viking 1 Lander (Thomas Mutch Memorial Station)",
    classification: "Lander Structure",
    distanceFromLanderMeters: 0,
    coordinates: "22.271° N, 312.049° E",
    condition: "Intact on 3 footpads; RTGs cold; meteorology boom deployed; fine dust coating.",
    significance: "First operational spacecraft to perform long-duration science from the surface of Mars (1976–1982).",
    youthInsight: "It stood completely alone on Mars for 21 years until Mars Pathfinder arrived in 1997.",
  },
  {
    id: "v1-microfilm-disc",
    lander: "viking-1",
    name: "10,000-Name Microfilm Time Capsule",
    classification: "Time Capsule",
    distanceFromLanderMeters: 0,
    coordinates: "Mounted on the Viking 1 lander equipment bus",
    condition: "Hermetically sealed inside an aluminum casing; pristine.",
    significance: "Holds high-reduction photographic microfilms with the names of over 10,000 engineers, scientists, machinists, and support staff.",
    youthInsight: "Even before digital flash drives existed, humans used micro-photography to etch the names of everyone who built the machine into metal on Mars.",
  },
  {
    id: "v1-heat-shield",
    lander: "viking-1",
    name: "Viking 1 Beryllium-Ablator Heat Shield",
    classification: "Aeroshell",
    distanceFromLanderMeters: 850,
    coordinates: "22.26° N, 312.06° E",
    condition: "Impacted at ~300 m/s after jettison at 6 km altitude; fragmented into a small debris field.",
    significance: "Protected the lander from 1,500°C entry heating as it slammed into Mars's upper atmosphere at 16,000 km/h.",
    youthInsight: "Discarded 4 miles above the ground so the radar and landing retrorockets could see the surface.",
  },
  {
    id: "v1-backshell-parachute",
    lander: "viking-1",
    name: "Dacron Parachute & Aeroshell Backshell",
    classification: "Parachute & Backshell",
    distanceFromLanderMeters: 1400,
    coordinates: "22.28° N, 312.03° E",
    condition: "53-foot diameter disc-gap-band parachute draped across the Chryse rocks; visible on HiRISE frame PSP_001521_2025.",
    significance: "Slowed the lander from supersonic speed down to 60 m/s before the terminal descent engines fired.",
    youthInsight: "The parachute fabric was made of heat-sterilized Dacron polyester so no Earth microbes could hitch a ride to Mars.",
  },
  {
    id: "v1-trenches",
    lander: "viking-1",
    name: "Deep Sandy Trenches (The First Digs on Mars)",
    classification: "Excavation Trench",
    distanceFromLanderMeters: 1.5,
    coordinates: "Directly in front of Viking 1 Lander Footpad 3",
    condition: "Trenches still carved into the duricrust; slightly softened by 50 years of seasonal Martian dust storms.",
    significance: "The very first robotic trenches dug into the soil of another planet, testing soil mechanics and gathering biology samples.",
    youthInsight: "A small motorized backhoe scoop at the end of a 3-meter boom dug down 10 centimeters and dropped soil into the onboard mini-labs.",
  },
  {
    id: "v2-lander",
    lander: "viking-2",
    name: "Viking 2 Lander",
    classification: "Lander Structure",
    distanceFromLanderMeters: 0,
    coordinates: "47.668° N, 134.280° E",
    condition: "Rests tilted at an 8.5° angle westward because one footpad settled onto a volcanic boulder.",
    significance: "Operated for 1,281 sols in Utopia Planitia, recording over 50 marsquakes and detecting winter water frost on rocks.",
    youthInsight: "Landed tilted like the Leaning Tower of Pisa! Because of the tilt, its cameras captured panoramic views of horizon dunes.",
  },
  {
    id: "v2-heat-shield",
    lander: "viking-2",
    name: "Viking 2 Heat Shield Impact Crater",
    classification: "Aeroshell",
    distanceFromLanderMeters: 1200,
    coordinates: "47.68° N, 134.26° E",
    condition: "Small kinetic crater and scattered thermal tile fragments identified in HiRISE image PSP_001501_2280.",
    significance: "Shed 90% of the spacecraft's orbital kinetic energy through atmospheric aerocapture.",
    youthInsight: "Hit the ground hard like an artificial meteorite after doing its job saving the lander.",
  },
  {
    id: "v2-backshell-parachute",
    lander: "viking-2",
    name: "Viking 2 Parachute & Backshell",
    classification: "Parachute & Backshell",
    distanceFromLanderMeters: 900,
    coordinates: "47.66° N, 134.30° E",
    condition: "Parachute canopy spread across the boulder field in Utopia Planitia.",
    significance: "Deployed at Mach 1.1 at 6,000 meters altitude to decelerate the lander.",
    youthInsight: "Still visible today from orbit through the high-resolution HiRISE camera on NASA's Mars Reconnaissance Orbiter.",
  },
];
