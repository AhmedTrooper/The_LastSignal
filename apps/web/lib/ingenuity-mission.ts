/**
 * 2026 NASA Space Apps Challenge - Master Ingenuity Mission Dossier
 * "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"
 *
 * Ingenuity Mars Helicopter (COSPAR: 2020-052B / NSSDCA: MARS2020H / ICAO: IGY)
 * Verified sources:
 * - NASA Space Science Data Coordinated Archive (NSSDCA)
 * - PDS Cartography and Imaging Sciences Node (mars2020_helicam)
 * - NASA JPL Flight Operations Log (Flights 1 to 72)
 * - University of Arizona HiRISE Operations Center
 * - NASA/JPL Photojournal & SuperCam Acoustic Records
 */

export interface IngenuityFlightMilestone {
  flightNum: number;
  dateUtc: string;
  sol: number;
  airfieldDeparture: string;
  airfieldArrival: string;
  maxAltitudeM: number;
  horizontalDistanceM: number;
  maxSpeedMs: number;
  durationSec: number;
  significance: string;
  isKeyRecord?: boolean;
}

export const INGENUITY_SPECS = {
  officialName: "Ingenuity Mars Helicopter",
  engineeringName: "Mars Helicopter Scout (MHS)",
  nickname: "Ginny",
  cosparId: "2020-052B",
  nssdcaId: "MARS2020H",
  parentCosparId: "2020-052A (Perseverance)",
  icaoDesignator: "IGY",
  callSign: "INGENUITY",
  firstAirportCode: "JZRO (Wright Brothers Field)",
  launchDateUtc: "2020-07-30T11:50:00Z",
  launchVehicle: "Atlas V 541 (AV-088)",
  launchPad: "Cape Canaveral SLC-41",
  marsLandingDateUtc: "2021-02-18T20:55:26Z",
  landingSite: "Octavia E. Butler Landing, Jezero Crater (18.4447° N, 77.4508° E)",
  deploymentDateUtc: "2021-04-03", // Sol 43
  deploymentSite: "Wright Brothers Field (18.44486° N, 77.45102° E)",
  totalMassKg: 1.80, // Earth mass: 3.97 lb
  marsWeightKg: 0.68, // Effective weight under Mars gravity 3.721 m/s²: 1.50 lb (6.70 N)
  requiredThrustNewtons: 6.70,
  dimensions: {
    heightM: 0.49,
    coaxialRotorSpanM: 1.21, // 4.0 ft (48 in)
    avionicsBoxCm: "13.6 × 19.5 × 16.3 cm",
    landingGearFootprintM: "0.60 × 0.60 m (4 carbon-fiber/titanium legs, 0.384 m long)",
  },
  propulsion: {
    rotorType: "Twin counter-rotating 2-bladed molded carbon-fiber/foam-core rotors",
    motorType: "Custom hand-wound brushless DC motors (AeroVironment / JPL)",
    nominalRpm: "2,400 to 2,900 RPM (2,537 RPM baseline; 2,800–2,900 RPM in thin summer air)",
    bladeTipSpeedMach: "Kept below Mach 0.7 (~168 m/s in cold Martian CO2 atmosphere)",
  },
  powerSystem: {
    solarPanel: "Top-mounted SolAero IMM-alpha inverted metamorphic multi-junction panel (42.5 × 16.5 cm)",
    battery: "6 Sony/Murata US18650VTC4 Li-Ion cells (35.75 Wh / 2 Ah capacity)",
    nightlyHeaterDrainWh: "~21 Wh nightly to maintain -15°C threshold against -90°C ambient",
    peakFlightPowerWatts: "~350 W peak draw during flight",
  },
  avionics: {
    flightComputer: "Qualcomm Snapdragon 801 (APQ8074) Linux board executing 30 Hz visual odometry",
    safetyWatchdogs: "Dual TI Hercules TMS570 radiation-tolerant processors",
    framework: "NASA open-source F' (F Prime) flight software framework",
    laserAltimeter: "Garmin LIDAR-Lite v3",
    navcam: "Omnivision OV7251 global-shutter monochrome VGA CMOS (640 × 480, 133° × 100° FOV, 30 fps)",
    rteCamera: "Sony IMX214 color CMOS (4208 × 3120, 13 MP, 47° × 47° FOV)",
    radio: "SiFlex 914 MHz telemetry link to Perseverance",
  },
  odysseyTotals: {
    totalFlights: 72,
    totalSolsActive: 1002, // Sol 43 to Sol 1035
    earthDaysActive: 1035, // 14.4× its 5-flight / 30-sol design life
    totalFlightTimeSec: 7728, // 128.8 minutes (2 hr 8 min 48 sec)
    totalDistanceMeters: 17019, // 17.02 km / 10.56 miles
    peakAltitudeMeters: 24.0, // Flight 61
    peakSpeedMs: 10.0, // 22.4 mph / 36.0 km/h (Flight 62)
  },
  finalRestingSite: {
    name: "Valinor Hills (Airfield Chi)",
    region: "Southern margin of Neretva Vallis ancient river channel, western Jezero Crater",
    coordinates: {
      lat: 18.4972,
      lon: 77.3198,
      elevationM: -2320,
    },
    finalFlightDate: "January 18, 2024 (Sol 1035, Flight 72)",
    finalRadioContactDate: "April 16, 2024 (Sol 1121)",
  },
  activeStatus2026: {
    mode: "Autonomous 20-Year Stationary Weather & Image Archive",
    dailyBehavior: "Wakes every morning upon sunrise, checks battery health, logs daily temperature, and snaps a weekly color image into flash memory (capacity through ~2044).",
  },
};

/**
 * Key Milestones Across Flights 1 to 72
 */
export const INGENUITY_KEY_FLIGHTS: IngenuityFlightMilestone[] = [
  {
    flightNum: 1,
    dateUtc: "2021-04-19",
    sol: 58,
    airfieldDeparture: "Airfield A (Wright Brothers Field)",
    airfieldArrival: "Airfield A",
    maxAltitudeM: 3.0,
    horizontalDistanceM: 0.0,
    maxSpeedMs: 0.0,
    durationSec: 39.1,
    significance: "First powered, controlled flight on another planet. Climbed at 1 m/s, hovered 30s, executed 96° yaw turn, and landed.",
    isKeyRecord: true,
  },
  {
    flightNum: 3,
    dateUtc: "2021-04-25",
    sol: 64,
    airfieldDeparture: "Airfield A",
    airfieldArrival: "Airfield A",
    maxAltitudeM: 5.0,
    horizontalDistanceM: 100.0,
    maxSpeedMs: 2.0,
    durationSec: 80.3,
    significance: "First downrange excursion (50 m north and 50 m return), surpassing all chamber tests on Earth.",
  },
  {
    flightNum: 4,
    dateUtc: "2021-04-30",
    sol: 69,
    airfieldDeparture: "Airfield A",
    airfieldArrival: "Airfield A",
    maxAltitudeM: 5.0,
    horizontalDistanceM: 266.0,
    maxSpeedMs: 3.5,
    durationSec: 116.9,
    significance: "First interplanetary aircraft audio recorded: Perseverance's SuperCam mic (80 m away) recorded Ingenuity's 84.6 Hz blade hum.",
    isKeyRecord: true,
  },
  {
    flightNum: 6,
    dateUtc: "2021-05-22",
    sol: 91,
    airfieldDeparture: "Airfield B",
    airfieldArrival: "Airfield C",
    maxAltitudeM: 10.0,
    horizontalDistanceM: 215.0,
    maxSpeedMs: 4.0,
    durationSec: 139.9,
    significance: "In-Flight Anomaly Survival: Dropped Navcam frame caused timestamp glitch and ±20° oscillations; landed safely within 5 m of target.",
  },
  {
    flightNum: 9,
    dateUtc: "2021-07-05",
    sol: 133,
    airfieldDeparture: "Airfield D",
    airfieldArrival: "Airfield E",
    maxAltitudeM: 10.0,
    horizontalDistanceM: 625.0,
    maxSpeedMs: 5.0,
    durationSec: 166.4,
    significance: "High-risk shortcut across the treacherous sand dunes of South Séítah, demonstrating forward geological scouting.",
  },
  {
    flightNum: 12,
    dateUtc: "2021-08-16",
    sol: 174,
    airfieldDeparture: "Airfield G",
    airfieldArrival: "Airfield G",
    maxAltitudeM: 10.0,
    horizontalDistanceM: 450.0,
    maxSpeedMs: 4.3,
    durationSec: 169.5,
    significance: "All-time longest flight duration (2 min 49.5 sec airborne), capturing stereo images of South Séítah outcrops.",
    isKeyRecord: true,
  },
  {
    flightNum: 25,
    dateUtc: "2022-04-08",
    sol: 403,
    airfieldDeparture: "Airfield H",
    airfieldArrival: "Airfield Q",
    maxAltitudeM: 10.0,
    horizontalDistanceM: 708.9,
    maxSpeedMs: 5.5,
    durationSec: 161.3,
    significance: "All-time longest flight distance (708.91 meters), crossing the ridge toward the ancient river delta in under 3 minutes.",
    isKeyRecord: true,
  },
  {
    flightNum: 26,
    dateUtc: "2022-04-19",
    sol: 414,
    airfieldDeparture: "Airfield Q",
    airfieldArrival: "Airfield R",
    maxAltitudeM: 8.0,
    horizontalDistanceM: 360.0,
    maxSpeedMs: 3.8,
    durationSec: 159.0,
    significance: "Aerial inspection of Perseverance's discarded Backshell and Parachute (PIA25236) to aid Mars Sample Return engineering.",
  },
  {
    flightNum: 30,
    dateUtc: "2022-08-20",
    sol: 533,
    airfieldDeparture: "Airfield R",
    airfieldArrival: "Airfield R",
    maxAltitudeM: 5.0,
    horizontalDistanceM: 2.0,
    maxSpeedMs: 0.5,
    durationSec: 33.3,
    significance: "First winter hop after Murata inclinometer failure on Sol 447 due to -80°C nights; JPL patched software to spoof initialization.",
  },
  {
    flightNum: 61,
    dateUtc: "2023-10-05",
    sol: 933,
    airfieldDeparture: "Airfield Tau",
    airfieldArrival: "Airfield Tau",
    maxAltitudeM: 24.0,
    horizontalDistanceM: 129.0,
    maxSpeedMs: 5.3,
    durationSec: 129.5,
    significance: "All-time altitude record (24.0 meters above the Martian surface).",
    isKeyRecord: true,
  },
  {
    flightNum: 62,
    dateUtc: "2023-10-12",
    sol: 940,
    airfieldDeparture: "Airfield Tau",
    airfieldArrival: "Airfield Tau",
    maxAltitudeM: 18.0,
    horizontalDistanceM: 268.0,
    maxSpeedMs: 10.0,
    durationSec: 121.1,
    significance: "All-time groundspeed record (10.0 m/s / 22.4 mph / 36.0 km/h).",
    isKeyRecord: true,
  },
  {
    flightNum: 71,
    dateUtc: "2024-01-06",
    sol: 1023,
    airfieldDeparture: "Airfield Chi",
    airfieldArrival: "Airfield Chi",
    maxAltitudeM: 12.0,
    horizontalDistanceM: 71.0,
    maxSpeedMs: 7.0,
    durationSec: 35.0,
    significance: "Aborted early when featureless sand ripples in Neretva Vallis starved downward Navcam of trackable surface rocks.",
  },
  {
    flightNum: 72,
    dateUtc: "2024-01-18",
    sol: 1035,
    airfieldDeparture: "Airfield Chi (Valinor Hills)",
    airfieldArrival: "Airfield Chi",
    maxAltitudeM: 12.0,
    horizontalDistanceM: 0.0,
    maxSpeedMs: 0.0,
    durationSec: 32.0,
    significance: "Final Flight: Visual tracking lost at 1 m altitude during touchdown; rotor struck sloped sand ripple, snapping blade tips.",
    isKeyRecord: true,
  },
];

/**
 * Inventory of Discarded Hardware Sites in Jezero Crater
 */
export interface IngenuityHardwareSite {
  id: string;
  name: string;
  date: string;
  sol: number;
  coordinates: { lat: number; lon: number };
  photoPia: string;
  description: string;
  scientificForensicValue: string;
}

export const INGENUITY_HARDWARE_SITES: IngenuityHardwareSite[] = [
  {
    id: "debris-shield",
    name: "Graphite-Composite Debris Shield",
    date: "March 21, 2021",
    sol: 30,
    coordinates: { lat: 18.4449, lon: 77.4510 },
    photoPia: "PIA24542",
    description: "0.81 m × 0.45 m molded carbon-composite shell engineered by Lockheed Martin Space to shield Ingenuity from rock strikes during Sky Crane landing. Released via four pyrotechnic split-spool actuators.",
    scientificForensicValue: "Benchmark for pyrotechnic release behavior on volcanic regolith and long-term surface weathering in Jezero Crater.",
  },
  {
    id: "sheared-blade",
    name: "Sheared 15 cm Carbon-Fiber Blade Fragment",
    date: "January 18, 2024",
    sol: 1035,
    coordinates: { lat: 18.4972, lon: 77.3196 },
    photoPia: "PIA26244",
    description: "During Flight 72 touchdown, spinning rotors struck an inclined sand dune. A ~15 cm (6-inch) outer upper blade tip sheared clean off and was flung 15 meters west onto the ripple crest. Imaged from 300 m by Perseverance's SuperCam RMI.",
    scientificForensicValue: "First forensic physical evidence of an aerodynamic rotor impact failure on another planet.",
  },
  {
    id: "grounded-rotorcraft",
    name: "Ingenuity Chassis at Valinor Hills",
    date: "January 18, 2024 – Present",
    sol: 1035,
    coordinates: { lat: 18.4972, lon: 77.3198 },
    photoPia: "PIA26243",
    description: "Resting upright on all four titanium legs at Airfield Chi, Neretva Vallis. Contains Snapdragon 801 Linux flight computer, Garmin LIDAR, 13MP camera, and the 1903 Wright Flyer fabric swatch.",
    scientificForensicValue: "Humanity's first extraterrestrial airport monument and an active autonomous weather time capsule logging data until ~2044.",
  },
];

/**
 * Historical Artifacts & Hidden Relics
 */
export const INGENUITY_ARTIFACTS = [
  {
    title: "1903 Wright Flyer Wing Fabric Swatch",
    placement: "Taped with orange Kapton film around an electrical cable under the solar panel",
    provenance: "Carillon Historical Park, Dayton, Ohio (donated by the Wright family)",
    story: "A 1.5 cm × 1.5 cm postage-stamp-sized swatch of unbleached 'Pride of the West' muslin from the bottom-left wing of the Wright Brothers' 1903 flyer made the journey to Mars, connecting humanity's first powered flight on Earth to its first on Mars.",
  },
  {
    title: "ICAO Extraterrestrial Airport Certificate",
    placement: "Official Aviation Registry (Montreal, Canada)",
    provenance: "International Civil Aviation Organization (ICAO), April 19, 2021",
    story: "ICAO assigned aircraft designator IGY, call sign INGENUITY, and designated the 10 m × 10 m deployment zone at Jezero Crater as Wright Brothers Field (JZRO)—the first official aviation facility beyond Earth.",
  },
  {
    title: "The 20-Year Autonomous Time Capsule",
    placement: "Onboard flash memory aboard the Qualcomm Snapdragon 801 computer",
    provenance: "NASA JPL Final Firmware Patch (Sol 1121, April 16, 2024)",
    story: "When Perseverance drove out of radio range, JPL uploaded a firmware patch turning Ingenuity into an autonomous weather station. It wakes daily upon sunrise, checks battery voltage, logs temperature, and stores a photo into flash memory with capacity through ~2044.",
  },
];

/**
 * Aerodynamic Lift & Tip Speed Calculations in 1% Martian Air
 */
export function calculateIngenuityAerodynamics(densityKgM3: number, rpm: number) {
  // Blade radius R = 0.605 m (rotor span 1.21 m)
  const radius = 0.605;
  const omega = (rpm * 2 * Math.PI) / 60; // rad/s
  const tipSpeedMs = omega * radius;
  // Speed of sound in cold Martian CO2 (-40°C to -60°C) is ~240 m/s (vs 343 m/s on Earth)
  const speedOfSound = 240;
  const tipMach = tipSpeedMs / speedOfSound;

  // Approximate lift model calibrated to Ingenuity rotor geometry:
  // L = C_L_eff * density * (omega * R)^2 * area_effective
  // At density 0.015 kg/m3 and 2537 RPM, lift is ~6.70 N (matching 0.68 kg Mars weight)
  const baseLiftFactor = 6.70 / (0.015 * Math.pow((2537 * 2 * Math.PI * 0.605) / 60, 2));
  const liftNewtons = baseLiftFactor * densityKgM3 * Math.pow(tipSpeedMs, 2);

  const marsWeightNewtons = 6.70;
  const thrustMargin = ((liftNewtons - marsWeightNewtons) / marsWeightNewtons) * 100;
  const canFly = liftNewtons >= marsWeightNewtons && tipMach < 0.72;

  let aerostatus = "Nominal lift margin. Controlled aerodynamic flight possible.";
  if (tipMach >= 0.72) {
    aerostatus = "Compressibility stall: Blade tips exceed Mach 0.72 in thin Martian CO2.";
  } else if (liftNewtons < marsWeightNewtons) {
    aerostatus = "Insufficient lift: Thrust is less than Martian gravity (6.70 N required). Increase RPM or air density.";
  }

  return {
    densityKgM3,
    rpm,
    tipSpeedMs: Math.round(tipSpeedMs),
    tipMach: parseFloat(tipMach.toFixed(3)),
    liftNewtons: parseFloat(liftNewtons.toFixed(2)),
    marsWeightNewtons,
    thrustMargin: parseFloat(thrustMargin.toFixed(1)),
    canFly,
    aerostatus,
  };
}
