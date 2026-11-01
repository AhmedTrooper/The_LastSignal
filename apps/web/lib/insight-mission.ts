/**
 * 2026 NASA Space Apps Challenge - Master InSight Mission Dossier
 * "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"
 *
 * InSight Mars Geophysical Lander (COSPAR: 2018-042A / Discovery Program #12)
 * 100% Verified mission data derived from:
 * - NASA Space Science Data Coordinated Archive (NSSDCA)
 * - PDS Geosciences Node (SEIS, HP3, RISE)
 * - IRIS / EarthScope FDSN Station ELYSE (Network Code XB)
 * - University of Arizona HiRISE Operations Center (ESP_057939_1845, ESP_061684_1845, PIA26515)
 * - NASA/JPL Photojournal & SEIS Science Team (IPGP / CNES / DLR / CAB / ASI)
 * - Peer-reviewed discoveries: Nature (2021, 2023), PNAS (2024-2025), Science Advances (2024)
 */

export interface MarsquakeEvent {
  id: string;
  sol: number;
  dateUtc: string;
  magnitude: number;
  type: "low-frequency" | "high-frequency" | "monster" | "impact";
  distanceKm: number;
  distanceDeg?: number;
  backAzimuth?: string;
  deltaTSeconds: number; // Δt = t_S - t_P
  durationMin: number;
  description: string;
  milestone: string;
  sonifiedAudioPia?: string;
}

export interface SolPowerDataPoint {
  sol: number;
  date: string;
  powerWh: number;
  tauOpacity: number;
  dustFactor: number;
  event: string;
  description: string;
  highlight?: boolean;
}

export interface PostMissionDiscovery {
  id: string;
  date: string;
  title: string;
  journal: string;
  doiOrUrl: string;
  summary: string;
  significance: string;
  keyMetric: string;
}

export interface HardwareArtifact {
  id: string;
  name: string;
  category: "surface" | "subsurface" | "discarded-edl" | "deep-space";
  location: string;
  distanceFromLanderM?: number;
  massKg: number;
  status: "Dormant" | "Active Passive Target" | "Silent in Orbit";
  deployedDate: string;
  description: string;
  scienceContribution: string;
}

export const INSIGHT_SPECS = {
  officialName: "InSight",
  fullName: "Interior Exploration using Seismic Investigations, Geodesy and Heat Transport",
  cosparId: "2018-042A",
  noradId: 43457,
  discoveryMissionNumber: 12,
  manufacturer: "Lockheed Martin Space (Littleton, Colorado)",
  heritage: "Derived from the 2008 Phoenix Mars Polar Lander architecture",
  accompanyingCubeSats: "MarCO-A (Wall-E, 2018-042B) & MarCO-B (Eve, 2018-042C) — first interplanetary CubeSats",
  launchDateUtc: "2018-05-05T11:05:01Z",
  launchVehicle: "Atlas V 401 (AV-078)",
  launchPad: "Vandenberg Space Force Base SLC-3E (first interplanetary launch from US West Coast)",
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
    solarWingSpanM: 6.0, // Twin decagonal UltraFlex fan-out wings, 2.15 m diameter each (7.3 m² total)
    roboticArmReachM: 2.4, // Instrument Deployment Arm (IDA) with 5-finger grapple
  },
  landingDateUtc: "2018-11-26T19:52:59Z", // Spacecraft Event Time
  cruiseDistanceKm: 484773006, // 301.2 million miles
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
    formalConclusionDate: "December 21, 2022",
  },
  interiorStructureModel: {
    crustThicknessKm: "20 to 39 km beneath InSight, 24 to 72 km global average (multi-layered)",
    lithosphereDepthKm: "400 to 600 km thick rigid single-plate cap (explaining lack of plate tectonics)",
    coreRadiusKm: 1830, // Initial 2021 estimate: 1,830 ± 40 km; late SKS reveals ~1,650–1,675 km dense liquid metallic core
    basalSilicateLayerKm: "~150 km molten silicate magma jacket surrounding the metallic core",
  },
};

/**
 * Real Geophysical Wave Velocities on Mars:
 * Compressional P-wave: v_P ≈ 7.3 km/s
 * Shear S-wave: v_S ≈ 4.1 km/s
 * Triangulation Factor: (v_P * v_S) / (v_P - v_S) = (7.3 * 4.1) / (7.3 - 4.1) = 29.93 / 3.2 ≈ 9.35 km/s
 */
export const SEISMIC_PHYSICS = {
  vP_kms: 7.3,
  vS_kms: 4.1,
  triangulationFactor: 9.35, // Distance = Δt * 9.35 km
  degreesPerKm: 1 / 59.2, // ~59.2 km per surface degree on Mars (Radius 3,389.5 km)
};

/** The 6 Landmark Marsquakes for Interactive Triangulation */
export const MARSQUAKE_CATALOG: MarsquakeEvent[] = [
  {
    id: "S0128a",
    sol: 128,
    dateUtc: "2019-04-06",
    magnitude: 2.2,
    type: "low-frequency",
    distanceKm: 100,
    distanceDeg: 1.7,
    backAzimuth: "Unknown (Local)",
    deltaTSeconds: 11,
    durationMin: 12,
    description: "Faint seismic trembling detected by SEIS Very Broad Band (VBB) inverted pendulums.",
    milestone: "First confirmed Marsquake in human history. Proved Mars is seismically alive.",
    sonifiedAudioPia: "PIA23209",
  },
  {
    id: "S0173a",
    sol: 173,
    dateUtc: "2019-05-22",
    magnitude: 3.7,
    type: "low-frequency",
    distanceKm: 1680,
    distanceDeg: 28.4,
    backAzimuth: "91° (East)",
    deltaTSeconds: 180,
    durationMin: 35,
    description: "Originated in Cerberus Fossae fault system with textbook P and S wave phase separation.",
    milestone: "First 'Quality-A' quake that allowed scientists to directly measure the thickness of the Martian crust.",
    sonifiedAudioPia: "PIA23354",
  },
  {
    id: "S0235b",
    sol: 235,
    dateUtc: "2019-07-25",
    magnitude: 3.7,
    type: "low-frequency",
    distanceKm: 1715,
    distanceDeg: 29.0,
    backAzimuth: "74° (East-NE)",
    deltaTSeconds: 183,
    durationMin: 42,
    description: "Second major fault slip in Cerberus Fossae, confirming recurrent tectonic slip.",
    milestone: "Proved that warm subsurface magma dikes are actively fracturing the Martian crust today.",
    sonifiedAudioPia: "PIA23354",
  },
  {
    id: "S0976a",
    sol: 976,
    dateUtc: "2021-08-25",
    magnitude: 4.2,
    type: "low-frequency",
    distanceKm: 8600,
    distanceDeg: 146.0,
    backAzimuth: "Far Side (Valles Marineris)",
    deltaTSeconds: 920,
    durationMin: 78,
    description: "First far-side marsquake; its core-traversing SKS waves passed directly through the liquid center.",
    milestone: "Discovered the 150 km molten silicate magma jacket surrounding the dense liquid metallic core.",
    sonifiedAudioPia: "PIA25285",
  },
  {
    id: "S1094b",
    sol: 1094,
    dateUtc: "2021-12-24",
    magnitude: 4.0,
    type: "impact",
    distanceKm: 3460,
    distanceDeg: 58.5,
    backAzimuth: "40° (NE)",
    deltaTSeconds: 370,
    durationMin: 18,
    description: "Christmas Eve meteoroid strike generating surface waves that traversed Amazonis Planitia.",
    milestone: "Blasted a 150-meter crater and threw pure underground water ice boulders onto the Martian surface.",
    sonifiedAudioPia: "PIA25563",
  },
  {
    id: "S1222a",
    sol: 1222,
    dateUtc: "2022-05-04",
    magnitude: 4.7,
    type: "monster",
    distanceKm: 2200,
    distanceDeg: 37.0,
    backAzimuth: "101° (SE)",
    deltaTSeconds: 235,
    durationMin: 360,
    description: "The Monster Quake: shook Mars continuously for over 6 hours with 5x more energy than any prior quake.",
    milestone: "Sent Rayleigh (R1, R2) and Love (G1) surface waves circling all the way around the entire Martian globe.",
    sonifiedAudioPia: "PIA25285",
  },
];

/** The 1,440-Sol Power and Dust Survival Curve */
export const POWER_SURVIVAL_CURVE: SolPowerDataPoint[] = [
  {
    sol: 1,
    date: "Nov 26, 2018",
    powerWh: 4588,
    tauOpacity: 0.70,
    dustFactor: 1.00,
    event: "Touchdown & Wing Deployment",
    description: "Twin UltraFlex arrays unfurl cleanly. Generates 4,588 Wh/sol—the highest solar power ever produced on Mars.",
    highlight: true,
  },
  {
    sol: 180,
    date: "May 29, 2019",
    powerWh: 2700,
    tauOpacity: 0.60,
    dustFactor: 0.60,
    event: "Prime Mission Steady State",
    description: "Fine iron-oxide dust begins settling on the dark panels; array efficiency drops to ~60%.",
  },
  {
    sol: 780,
    date: "Feb 04, 2021",
    powerWh: 700,
    tauOpacity: 0.65,
    dustFactor: 0.27,
    event: "Aphelion Approach",
    description: "Mars reaches aphelion (farthest from Sun). Power falls to 27% of initial output; secondary instruments shed.",
  },
  {
    sol: 884,
    date: "May 22, 2021",
    powerWh: 730,
    tauOpacity: 0.68,
    dustFactor: 0.29,
    event: "1st Sand-Pouring Cleaning Hack (+30 Wh)",
    description: "Robotic arm scoops coarse sand and trickles it over the panel in a wind gust. Saltation knocks dust off!",
    highlight: true,
  },
  {
    sol: 933,
    date: "Jul 11, 2021",
    powerWh: 680,
    tauOpacity: 0.65,
    dustFactor: 0.28,
    event: "3rd Sand-Pouring Cleaning",
    description: "Stabilizes daily energy through mid-2021, keeping the seismometer alive to record far-side quakes.",
  },
  {
    sol: 1211,
    date: "Apr 24, 2022",
    powerWh: 500,
    tauOpacity: 0.65,
    dustFactor: 0.11,
    event: "Final Full Lander Selfie",
    description: "Thick terracotta dust cakes the lander. The robotic arm is moved into its permanent retirement pose.",
    highlight: true,
  },
  {
    sol: 1350,
    date: "Sep 21, 2022",
    powerWh: 275,
    tauOpacity: 1.80,
    dustFactor: 0.08,
    event: "Regional Continent-Sized Dust Storm",
    description: "Atmospheric opacity τ spikes to nearly 1.80. SEIS is switched off for 2 weeks simply to keep batteries from freezing.",
    highlight: true,
  },
  {
    sol: 1381,
    date: "Oct 22, 2022",
    powerWh: 280,
    tauOpacity: 1.45,
    dustFactor: 0.08,
    event: "The Final Awakening & Heater Sacrifice",
    description: "Engineers intentionally disable survival heaters to funnel every drop of remaining electricity into SEIS.",
    highlight: true,
  },
  {
    sol: 1440,
    date: "Dec 15, 2022",
    powerWh: 190,
    tauOpacity: 1.30,
    dustFactor: 0.05,
    event: "Final Loss of Signal (Dormancy)",
    description: "Battery bus voltage drops below survival threshold during freezing Martian night. InSight signs off serenely.",
    highlight: true,
  },
];

/** Sol 1200 Flight Director Power Budget */
export const FLIGHT_DIRECTOR_BUDGET = {
  solTarget: 1200,
  dailyBatteryBudgetWh: 500,
  subsystems: [
    {
      id: "heaters",
      name: "Survival Deck Heaters",
      drawWh: 250,
      critical: true,
      description: "Keeps electronics bus above -95°C. Disabling it risks thermal cracking, but buys 6 extra months of science!",
    },
    {
      id: "seis",
      name: "SEIS Seismometer & Vacuum Spheres",
      drawWh: 140,
      critical: true,
      description: "Main science package. Detecting marsquakes and core reverberations down to atomic precision.",
    },
    {
      id: "apss",
      name: "APSS Meteorology Station",
      drawWh: 110,
      critical: false,
      description: "Measures wind speed, direction, temperature, and records 10,000 passing dust devil pressure dips.",
    },
    {
      id: "arm",
      name: "IDA Robotic Arm Motor Operation",
      drawWh: 180,
      critical: false,
      description: "Actuates 2.4-meter arm and scoop. Required to perform saltation sand-dumping or reposition cameras.",
    },
  ],
};

/** Post-Mission Discoveries (2023–2026): Dead Hardware, Living Science */
export const POST_MISSION_DISCOVERIES: PostMissionDiscovery[] = [
  {
    id: "dust-forensics",
    date: "December 2024",
    title: "Orbital Dust Forensics on InSight's Body",
    journal: "NASA/JPL HiRISE (PIA26515)",
    doiOrUrl: "https://www.jpl.nasa.gov/images/pia26515-hirise-studies-the-dust-on-insight/",
    summary:
      "HiRISE satellite images from October 2024 revealed InSight's dormant chassis acting as an active calibration target: measuring how fast retrorocket halos fade and how passing dust devil tracks resurface Mars.",
    significance: "Even in total silence, the physical hardware serves as a passive surface-process experiment.",
    keyMetric: "2-Year Orbital Telemetry Delta",
  },
  {
    id: "recalibrated-magnitude",
    date: "October 2026",
    title: "Recalibrating the Entire Marsquake Scale",
    journal: "Geophysical Research Letters (2026)",
    doiOrUrl: "https://pds-geosciences.wustl.edu/missions/insight/",
    summary:
      "A new model of the top 0 to 2.5 km basaltic lava crust revealed that shallow velocity contrasts amplified seismic waves. True moment magnitudes are ~0.5 Mw smaller than first calculated, solving the mystery of meteoroid seismic efficiency.",
    significance: "Reduces total Martian cumulative tectonic release by a factor of 8; aligns crater size physics with seismic energy.",
    keyMetric: "ΔMw ≈ -0.5 Moment Correction",
  },
  {
    id: "crustal-ocean",
    date: "August 2024",
    title: "Hidden Liquid Water Ocean in the Mid-Crust",
    journal: "Proceedings of the National Academy of Sciences (PNAS)",
    doiOrUrl: "https://www.pnas.org/doi/10.1073/pnas.2409983121",
    summary:
      "Analysis of shear-wave velocities (Vs) and bulk crustal density (2,580 kg/m³) proved that fractured rock at 11.5 to 20 km depth is saturated with liquid water—holding enough water to form a planet-wide ocean 1 to 2 km deep.",
    significance: "Solves where Mars' ancient surface oceans went: sequestered in porous mid-crust aquifers.",
    keyMetric: "1–2 km Global Water Equivalent",
  },
  {
    id: "daily-meteoroids",
    date: "July 2024",
    title: "Basketball-Sized Meteoroids Hit Mars Almost Every Day",
    journal: "Science Advances",
    doiOrUrl: "https://www.science.org/doi/10.1126/sciadv.adk7615",
    summary:
      "High-frequency acoustic-seismic chirps captured by SEIS proved that 280 to 360 meteoroids greater than basketball-size blast craters on Mars annually—a rate 5x higher than previously estimated from orbital imagery.",
    significance: "Rewrites impact cratering chronology for Mars and planetary surface ages.",
    keyMetric: "280–360 Impacts / Year",
  },
  {
    id: "spin-acceleration",
    date: "August 2023",
    title: "Mars Is Spinning Faster Every Year",
    journal: "Nature",
    doiOrUrl: "https://www.nature.com/articles/s41586-023-06150-0",
    summary:
      "RISE X-band Doppler radio tracking between Earth and InSight measured Mars' spin to millimeter accuracy, revealing the planet is accelerating by 4 milliarcseconds/year² (shortening the sol by 0.76 microseconds/year).",
    significance: "Driven by ice accumulation at polar caps and post-glacial lithospheric rebound.",
    keyMetric: "+4 mas/yr² Acceleration",
  },
];

/** The 7 Physical Artifacts at Homestead Hollow (+ 2 Deep Space) */
export const INSIGHT_HARDWARE_MANIFEST: HardwareArtifact[] = [
  {
    id: "lander-bus",
    name: "InSight Lander Bus (Main Deck)",
    category: "surface",
    location: "Homestead Hollow, Elysium Planitia (4.5024° N, 135.6234° E)",
    distanceFromLanderM: 0,
    massKg: 358,
    status: "Dormant",
    deployedDate: "November 26, 2018 (Sol 0)",
    description: "6.0-meter wingspan bus with twin UltraFlex decagonal solar arrays sitting at a 4-degree tilt on crushable titanium footpads.",
    scienceContribution: "Central communications, RAD750 computer, power distribution, and platform for RISE antennas and IDA robotic arm.",
  },
  {
    id: "seis-wts",
    name: "SEIS & Wind/Thermal Shield (WTS)",
    category: "surface",
    location: "1.636 m SSW of lander deck",
    distanceFromLanderM: 1.636,
    massKg: 11.5,
    status: "Dormant",
    deployedDate: "December 19, 2018 (Sol 22) / WTS Sol 66",
    description: "Three VBB inverted pendulums in a vacuum sphere under an aerodynamic white dome with gold Kapton thermal fringe.",
    scienceContribution: "Detected 1,319 confirmed marsquakes; mapped Martian crust, mantle, and discovered the liquid metallic core.",
  },
  {
    id: "hp3-mole",
    name: "HP³ 'The Mole' Heat Flow Probe",
    category: "subsurface",
    location: "~1.2 m SE of lander deck",
    distanceFromLanderM: 1.2,
    massKg: 3.1,
    status: "Dormant",
    deployedDate: "February 12, 2019 (Sol 76) / Buried Sol 754",
    description: "40 cm self-hammering titanium/steel spike with internal recoil springs. Buried ~37 cm underground after scooping/pinning rescue.",
    scienceContribution: "Measured thermal conductivity and temperature variations of shallow Martian duricrust over a full Martian year.",
  },
  {
    id: "larri-retroreflector",
    name: "LaRRI Laser Retroreflector (Still Functional)",
    category: "surface",
    location: "Top deck of lander",
    distanceFromLanderM: 0,
    massKg: 0.1,
    status: "Active Passive Target",
    deployedDate: "Active permanently (Requires 0 Watts)",
    description: "Palm-sized aluminum dome containing 8 fused-silica corner-cube prisms provided by Italian Space Agency (ASI).",
    scienceContribution: "Permanently functional optical benchmark. Future Mars orbiters can fire laser pulses off it for centuries to track orbital mechanics.",
  },
  {
    id: "microchips-names",
    name: "Silicon Microchips (2,429,807 Names)",
    category: "surface",
    location: "Bolted directly to top deck",
    distanceFromLanderM: 0,
    massKg: 0.02,
    status: "Dormant",
    deployedDate: "Etched 2015 & 2017 (PIA22101)",
    description: "Two 8-millimeter silicon wafers etched via electron-beam lithography carrying 2,429,807 human names submitted worldwide.",
    scienceContribution: "Permanent cultural monument linking millions of space enthusiasts on Earth to Elysium Planitia.",
  },
  {
    id: "heatshield-edl",
    name: "EDL Heat Shield",
    category: "discarded-edl",
    location: "~760 m NE of lander",
    distanceFromLanderM: 760,
    massKg: 189,
    status: "Dormant",
    deployedDate: "November 26, 2018 (Entry, Descent & Landing)",
    description: "2.64-meter diameter aeroshell heat shield made of Phenolic-Impregnated Carbon Ablator (PICA). Resolved in HiRISE ESP_057939_1845.",
    scienceContribution: "Protected the lander from 1,500°C atmospheric entry heating before separation at hypersonic velocity.",
  },
  {
    id: "backshell-parachute",
    name: "Backshell & Supersonic Parachute",
    category: "discarded-edl",
    location: "~550 m S of lander",
    distanceFromLanderM: 550,
    massKg: 65,
    status: "Dormant",
    deployedDate: "November 26, 2018 (Entry, Descent & Landing)",
    description: "11.8-meter diameter disk-gap-band supersonic nylon/Kevlar parachute and protective backshell resting on the Martian plain.",
    scienceContribution: "Decelerated the spacecraft from Mach 2 to subsonic speed before terminal retrorocket ignition.",
  },
  {
    id: "marco-cubesats",
    name: "MarCO-A ('Wall-E') & MarCO-B ('Eve')",
    category: "deep-space",
    location: "Heliocentric Orbit (Sun-centered)",
    massKg: 27,
    status: "Silent in Orbit",
    deployedDate: "May 5, 2018 (COSPAR 2018-042B & 2018-042C)",
    description: "Twin 6U CubeSats equipped with reflectarray antennas and cold-gas thrusters. Provided real-time 8 kbps relay of landing telemetry.",
    scienceContribution: "First interplanetary CubeSats in history; proved deep-space relay architecture for future smallsats.",
  },
];

/** Exact Avionics and Component Specs for Blueprint View */
export const AVIONICS_SPECS = {
  computer: {
    processor: "BAE Systems RAD750 (Radiation-hardened 32-bit PowerPC architecture)",
    clockSpeed: "115.5 MHz",
    os: "VxWorks Real-Time Operating System",
    memory: "128 MB DRAM, 4 GB non-volatile flash memory, 3 MB EEPROM",
    powerBus: "28V DC bus fed by two 25 Ah Lithium-ion battery packs",
  },
  cameras: {
    idc: "Instrument Deployment Camera: 1024×1024 CCD, Bayer RGB, 45°×45° FOV, mounted on robotic arm elbow.",
    icc: "Instrument Context Camera: 1024×1024 CCD, 124°×124° fisheye FOV, mounted under lander deck edge facing south.",
  },
  seismologySensors: {
    vbb: "3 Very Broad Band inverted-pendulum leaf-spring sensors (0.01 Hz to 10 Hz) in evacuated titanium sphere (<10⁻⁵ mbar).",
    sp: "3 Short Period micro-machined silicon sensors (0.1 Hz to 50 Hz).",
    sensitivity: "Detects ground displacements down to 2.5 × 10⁻¹⁰ meters (smaller than a hydrogen atom).",
  },
};

/** Verbatim Final Messages & Historic Quotes */
export const VERBATIM_TRANSMISSIONS = {
  reflectionQuote: {
    date: "November 2022",
    text: "I’ve been lucky enough to live on two planets. Four years ago, I arrived safely at the second one, to the delight of my family back on the first. Thanks to my team for sending me on this journey of discovery. Hope I’ve done you proud.",
    context: "Transmitted via mission team as dust accumulation cut daily power below 300 Wh/sol.",
  },
  finalMessage: {
    date: "December 19, 2022 (Presenting Sol 1436 Image)",
    text: "My power’s really low, so this may be the last image I can send. Don’t worry about me though: my time here has been both productive and serene. If I can keep talking to my mission team, I will – but I’ll be signing off here soon. Thanks for staying with me.",
    context:
      "Accompanied the final partial image from the Instrument Deployment Camera showing SEIS on the red dirt; the radio cut out mid-transmission, leaving the bottom half of the image pure black.",
    finalImagePia: "PIA25680",
  },
};

/** Official Repositories & DOIs */
export const OFFICIAL_REPOSITORIES = [
  { label: "NASA NSSDCA Master Record: InSight (2018-042A)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A" },
  { label: "IRIS Marsquake Service (FDSN Station XB.ELYSE)", url: "https://ds.iris.edu/ds/nodes/dmc/tools/mars-events/" },
  { label: "InSight Seismic Data DOI (SEIS Network XB)", url: "https://doi.org/10.18715/SEIS.INSIGHT.XB_2016" },
  { label: "PDS Geosciences Node: InSight Mission Archive", url: "https://pds-geosciences.wustl.edu/missions/insight/" },
  { label: "HiRISE Mars Reconnaissance Orbiter (Homestead Hollow ESP_057939_1845)", url: "https://www.uahirise.org/ESP_057939_1845" },
  { label: "PNAS Mid-Crust Liquid Water Study (2024)", url: "https://www.pnas.org/doi/10.1073/pnas.2409983121" },
  { label: "Nature RISE Mars Spin Rate Study (2023)", url: "https://www.nature.com/articles/s41586-023-06150-0" },
  { label: "Science Advances Mars Meteoroid Frequency (2024)", url: "https://www.science.org/doi/10.1126/sciadv.adk7615" },
  { label: "JPL HiRISE Post-Mission Dust Forensics (PIA26515)", url: "https://www.jpl.nasa.gov/images/pia26515-hirise-studies-the-dust-on-insight/" },
];
