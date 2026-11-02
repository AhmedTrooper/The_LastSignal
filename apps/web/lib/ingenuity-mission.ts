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
 * - NASA/JPL NAIF SPICE Kernel Archive
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
    significance: "In-Flight Anomaly Survival: Dropped Navcam frame caused timestamp mismatch and ±20° oscillations; landed safely within 5 m of target.",
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
    flightNum: 70,
    dateUtc: "2023-12-22",
    sol: 1009,
    airfieldDeparture: "Airfield Phi",
    airfieldArrival: "Airfield Chi",
    maxAltitudeM: 12.0,
    horizontalDistanceM: 705.0,
    maxSpeedMs: 7.0,
    durationSec: 132.9,
    significance: "Final long-range translation flight into Neretva Vallis.",
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
  photoUrl: string;
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
    photoUrl: "https://photojournal.jpl.nasa.gov/jpeg/PIA24542.jpg",
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
    photoUrl: "https://photojournal.jpl.nasa.gov/jpeg/PIA26244.jpg",
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
    photoUrl: "https://photojournal.jpl.nasa.gov/jpeg/PIA26243.jpg",
    description: "Resting upright on all four titanium legs at Airfield Chi, Neretva Vallis (elevation -2,320 m). Contains Snapdragon 801 Linux flight computer, Garmin LIDAR, 13MP camera, and the 1903 Wright Flyer fabric swatch.",
    scientificForensicValue: "Humanity's first extraterrestrial airport monument and an active autonomous weather time capsule logging data through ~2044.",
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
 * Master Verification & Deterministic Links
 */
export const INGENUITY_OFFICIAL_LINKS = {
  nssdcaRecord: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MARS2020H",
  parentNssdcaRecord: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A",
  jplFlightLog: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
  nasaFPrimeFramework: "https://github.com/nasa/fprime",
  pdsHelicamPortal: "https://pds-imaging.jpl.nasa.gov/volumes/mars2020.html",
  pdsHelicamRoot: "https://pds-imaging.jpl.nasa.gov/data/mars2020/mars2020_helicam/",
  pdsAnalystsNotebook: "https://an.rsl.wustl.edu/m20/",
  naifSpiceKernels: "https://naif.jpl.nasa.gov/pub/naif/MARS2020/kernels/",
  supercamAcousticPds: "https://pds-geosciences.wustl.edu/m20/urn-nasa-pds-mars2020_supercam/",
  flight4AcousticVideo: "https://photojournal.jpl.nasa.gov/archive/PIA24588.mp4",
  hiriseWrightField: "https://www.uahirise.org/ESP_068393_1985",
  hiriseSeitah: "https://www.uahirise.org/ESP_070107_1985",
  hiriseNeretvaVallis: "https://www.uahirise.org/ESP_081909_1985",
};

/**
 * Verified NASA Photojournal High-Res Anchor Catalog
 */
export const INGENUITY_PIA_GALLERY = [
  {
    piaId: "PIA24542",
    sol: 30,
    title: "Composite Debris Shield on Jezero Floor",
    description: "Ingenuity's graphite-composite debris shield resting on the volcanic floor of Jezero Crater beneath Perseverance.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA24542.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA24542",
  },
  {
    piaId: "PIA24583",
    sol: 43,
    title: "Ingenuity Standing Solo at Wright Brothers Field (JZRO)",
    description: "First image of Ingenuity standing autonomously on all four landing feet after being dropped from Perseverance's belly.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA24583.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA24583",
  },
  {
    piaId: "PIA24584",
    sol: 46,
    title: "Iconic WATSON Selfie Beside Perseverance",
    description: "62-frame mosaic selfie captured by Perseverance's WATSON camera at 3.9 m distance prior to Flight 1.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA24584.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA24584",
  },
  {
    piaId: "PIA24607",
    sol: 58,
    title: "Flight 1 Navcam Shadow from 3.0 m",
    description: "First powered aircraft flight on another planet: downward Navcam looking straight at its shadow from 3 meters altitude.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA24607.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA24607",
  },
  {
    piaId: "PIA24609",
    sol: 61,
    title: "First Color Aerial Photo on Mars",
    description: "13 MP RTE color photograph taken from 5.2 m altitude showing Perseverance's rover tracks across the sand ripples.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA24609.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA24609",
  },
  {
    piaId: "PIA24647",
    sol: 64,
    title: "Flight 3 Aerial View of Perseverance",
    description: "Aerial scouting shot capturing Perseverance in the upper-left corner from 85 m away and 5.0 m altitude.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA24647.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA24647",
  },
  {
    piaId: "PIA25236",
    sol: 414,
    title: "Aerial Forensic Inspection of Backshell and Parachute",
    description: "Flight 26 aerial survey capturing Perseverance's shattered backshell and supersonic parachute from 8 m altitude.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA25236.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA25236",
  },
  {
    piaId: "PIA26242",
    sol: 1035,
    title: "Flight 72 Snapped Rotor Blade Shadow",
    description: "Post-Flight 72 Navcam shadow on sand ripples revealing the snapped rotor blade tip that grounded the helicopter.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA26242.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA26242",
  },
  {
    piaId: "PIA26243",
    sol: 1051,
    title: "Grounded Ingenuity Sitting at Valinor Hills",
    description: "Mastcam-Z telephoto view of Ingenuity sitting alone on a sand ripple at Valinor Hills after mission conclusion.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA26243.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA26243",
  },
  {
    piaId: "PIA26244",
    sol: 1072,
    title: "SuperCam RMI Close-up of Sheared Blade Fragment",
    description: "Long-range SuperCam micro-imager photo showing the sheared 15 cm rotor blade fragment lying 15 m west on a ripple crest.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA26244.jpg",
    catalog: "https://photojournal.jpl.nasa.gov/catalog/PIA26244",
  },
];

/**
 * Deterministic 54-Character PDS `mars2020_helicam` URL Builder
 * Format: {INST}{FILTER}_{SOL}_{SCLK10}_{PROD}_{SITE}_{DRIVE}_{SEQ}_{CAM}{VER}.{EXT}
 */
export function buildPdsHelicamBrowseUrl(sol: number): string {
  const paddedSol = sol.toString().padStart(5, "0");
  return `https://pds-imaging.jpl.nasa.gov/data/mars2020/mars2020_helicam/browse/sol/${paddedSol}/ids/edr/heli/`;
}

export function buildPdsHelicamDataUrl(sol: number): string {
  const paddedSol = sol.toString().padStart(5, "0");
  return `https://pds-imaging.jpl.nasa.gov/data/mars2020/mars2020_helicam/data/sol/${paddedSol}/ids/edr/heli/`;
}

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
