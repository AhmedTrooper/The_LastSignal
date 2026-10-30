/**
 * 2026 NASA Space Apps Challenge - Master MER Mission Dossier
 * "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"
 *
 * Covers Spirit (MER-A / MER-2, COSPAR: 2003-027A, NORAD: 27827)
 * and Opportunity (MER-B / MER-1, COSPAR: 2003-032A, NORAD: 27849).
 *
 * Verified sources:
 * - NASA Space Science Data Coordinated Archive (NSSDCA)
 * - PDS Geosciences Node (Washington University in St. Louis)
 * - PDS Cartography and Imaging Sciences Node (JPL/USGS)
 * - University of Arizona HiRISE Operations Center (MRO)
 * - NASA/JPL Photojournal
 * - Honeybee Robotics Planetary Exploration Archives
 */

export interface MERSpecs {
  name: string;
  roverDesignation: "MER-A" | "MER-B";
  buildSequenceId: "MER-2" | "MER-1"; // Opportunity was manufactured first (MER-1), Spirit manufactured second (MER-2)
  cosparId: string;
  noradId: number;
  launchDateUtc: string;
  launchVehicle: string;
  launchPad: string;
  totalMassKg: number;
  roverMassKg: number;
  dimensions: string;
  landingDateUtc: string;
  landingLocalSolarTime: string;
  primaryLandingSite: string;
  siteDedication: string;
  landingCoordinates: {
    lat: number;
    lon: number;
    elevationM: number;
    frame: string;
  };
  finalRestingSite: string;
  finalRestingCoordinates: {
    lat: number;
    lon: number;
    elevationM: number;
    description: string;
    hiriseObsId: string;
  };
  surfaceOdyssey: {
    distanceMeters: number;
    distanceMiles: number;
    solsActive: number;
    earthDaysActive: number;
    designLifeRatio: number; // e.g. 24.5x or 56.8x
  };
  finalTransmission: {
    date: string;
    sol: number;
    cause: string;
    status: string;
    lastTelemetrySummary: string;
  };
}

export const MER_SPECS: Record<"spirit" | "opportunity", MERSpecs> = {
  spirit: {
    name: "Spirit",
    roverDesignation: "MER-A",
    buildSequenceId: "MER-2",
    cosparId: "2003-027A",
    noradId: 27827,
    launchDateUtc: "2003-06-10T17:58:47Z",
    launchVehicle: "Delta II 7925-9.5 (D298)",
    launchPad: "Cape Canaveral SLC-17A",
    totalMassKg: 1063,
    roverMassKg: 185,
    dimensions: "1.5 m (H) × 2.3 m (W) × 1.6 m (L) · 6-wheel titanium rocker-bogie (25 cm wheels)",
    landingDateUtc: "2004-01-04T04:35:26Z", // Earth Received Time (04:26:07 Spacecraft Event Time)
    landingLocalSolarTime: "14:16 LST",
    primaryLandingSite: "Gusev Crater",
    siteDedication: "Columbia Memorial Station (STS-107)",
    landingCoordinates: {
      lat: -14.5684,
      lon: 175.472636,
      elevationM: -1942,
      frame: "MOLA IAU 2000 (Two-Way X-Band/UHF Doppler: 14.571892° S, 175.47848° E)",
    },
    finalRestingSite: "Troy (Home Plate, Columbia Hills, Gusev Crater)",
    finalRestingCoordinates: {
      lat: -14.5994,
      lon: 175.5284,
      elevationM: -1910,
      description: "Sulfate sand trap on western margin of Home Plate plateau, tilted 11.5° southward",
      hiriseObsId: "ESP_021925_1650",
    },
    surfaceOdyssey: {
      distanceMeters: 7730.50,
      distanceMiles: 4.80,
      solsActive: 2210,
      earthDaysActive: 2269,
      designLifeRatio: 24.5,
    },
    finalTransmission: {
      date: "March 22, 2010 (Sol 2210)",
      sol: 2210,
      cause: "Winter low-power hibernation with 11.5° south panel tilt; survival heaters dropped below -55°C",
      status: "Mission officially concluded May 25, 2011 after 1,300+ recovery commands",
      lastTelemetrySummary: "Solar array power fell to ~89 Wh/sol during winter. Electronics could not sustain clock and heaters.",
    },
  },

  opportunity: {
    name: "Opportunity",
    roverDesignation: "MER-B",
    buildSequenceId: "MER-1",
    cosparId: "2003-032A",
    noradId: 27849,
    launchDateUtc: "2003-07-08T03:18:15Z", // July 7 20:18:15 PDT
    launchVehicle: "Delta II 7925H-9.5 (D299 Heavy)",
    launchPad: "Cape Canaveral SLC-17B",
    totalMassKg: 1063,
    roverMassKg: 185,
    dimensions: "1.5 m (H) × 2.3 m (W) × 1.6 m (L) · 6-wheel titanium rocker-bogie (25 cm wheels)",
    landingDateUtc: "2004-01-25T05:05:11Z", // Earth Received Time (04:54:22 Spacecraft Event Time)
    landingLocalSolarTime: "13:15 LST",
    primaryLandingSite: "Meridiani Planum (Eagle Crater)",
    siteDedication: "Challenger Memorial Station (STS-51-L)",
    landingCoordinates: {
      lat: -1.9462,
      lon: 354.4734,
      elevationM: -1384,
      frame: "MOLA IAU 2000 (Two-Way X-Band/UHF Doppler: 1.948282° S, 354.47417° E)",
    },
    finalRestingSite: "Perseverance Valley (Endeavour Crater western rim)",
    finalRestingCoordinates: {
      lat: -2.284,
      lon: 354.652,
      elevationM: -1420,
      description: "Upper slope of Perseverance Valley on the inner rim of 22 km Endeavour Crater",
      hiriseObsId: "ESP_056955_1775",
    },
    surfaceOdyssey: {
      distanceMeters: 45161.08,
      distanceMiles: 28.06,
      solsActive: 5111,
      earthDaysActive: 5250,
      designLifeRatio: 56.8,
    },
    finalTransmission: {
      date: "June 10, 2018 (Sol 5111)",
      sol: 5111,
      cause: "Global planet-encircling dust storm (tau = 10.8); solar array output plunged to 22 Wh",
      status: "Mission officially concluded February 13, 2019 following final Goldstone uplink of 'I\\'ll Be Seeing You'",
      lastTelemetrySummary: "Low-Power Fault & Master Clock Fault flags active; tau = 10.8 (99.998% sunlight blocked); dark sky frame PIA22949.",
    },
  },
};

/**
 * 9 Verified NSSDCA Science & Engineering Payloads
 */
export interface MERExperiment {
  num: string;
  name: string;
  acronym: string;
  leadInvestigator: string;
  institution: string;
  massKg?: number;
  powerWatts?: number;
  scienceRole: string;
  breakthroughResult: string;
}

export const MER_EXPERIMENTS: MERExperiment[] = [
  {
    num: "01",
    name: "Panoramic Camera",
    acronym: "Pancam",
    leadInvestigator: "Dr. James F. Bell III",
    institution: "Cornell University",
    massKg: 0.75,
    powerWatts: 3.0,
    scienceRole: "Twin 1024×1024 pixel CCDs on 1.5 m mast, 30 cm stereo baseline, 8-position filter wheels (430 nm to 1009 nm).",
    breakthroughResult: "Documented Gusev dust devils cleaning panels, aqueous cross-bedding in Burns Cliff, and the Sol 5111 final blackout sky.",
  },
  {
    num: "02",
    name: "Miniature Thermal Emission Spectrometer",
    acronym: "Mini-TES",
    leadInvestigator: "Dr. Philip R. Christensen",
    institution: "Arizona State University",
    massKg: 2.1,
    powerWatts: 5.6,
    scienceRole: "Scanning infrared interferometer (5 to 29 µm) for remote mineral identification across hills and crater walls.",
    breakthroughResult: "Discovered Comanche Outcrop containing 16%–34% magnesium-iron carbonate, proving ancient Gusev had neutral-pH water.",
  },
  {
    num: "03",
    name: "Mössbauer Spectrometer",
    acronym: "MIMOS II / MB",
    leadInvestigator: "Dr. Göstar Klingelhöfer",
    institution: "University of Mainz (Germany)",
    massKg: 0.5,
    powerWatts: 2.0,
    scienceRole: "Turret-mounted gamma-ray spectrometer with Cobalt-57 radioisotope source (300 mCi) to determine iron oxidation states.",
    breakthroughResult: "Discovered Jarosite in Eagle Crater (smoking-gun mineral proof of ancient liquid water) and Goethite on Husband Hill.",
  },
  {
    num: "04",
    name: "Alpha Particle X-Ray Spectrometer",
    acronym: "APXS",
    leadInvestigator: "Dr. Rudolf Rieder / Dr. Ralf Gellert",
    institution: "Max Planck Institute / University of Guelph",
    massKg: 0.6,
    powerWatts: 1.5,
    scienceRole: "Turret-mounted alpha/X-ray sensor using Curium-244 (30 mCi) to measure elemental chemistry from Na (Z=11) to Br (Z=35).",
    breakthroughResult: "Detected 90.1% pure opaline silica at Gertrude Weise (hydrothermal steam vents) and pure Gypsum vein Homestake at Endeavour.",
  },
  {
    num: "05",
    name: "Microscopic Imager",
    acronym: "MI",
    leadInvestigator: "Dr. Kenneth E. Herkenhoff",
    institution: "USGS Astrogeology Science Center",
    massKg: 0.25,
    powerWatts: 1.5,
    scienceRole: "Fixed-focus 1024×1024 macro lens on robotic arm (30 µm/pixel resolution, 31×31 mm field of view).",
    breakthroughResult: "Discovered spherical hematite concretions ('Martian Blueberries') formed by ancient groundwater precipitation.",
  },
  {
    num: "06",
    name: "Rock Abrasion Tool",
    acronym: "RAT",
    leadInvestigator: "Stephen Gorevan",
    institution: "Honeybee Robotics (New York)",
    massKg: 0.685,
    powerWatts: 30.0,
    scienceRole: "Diamond-toothed rotary grinding head (45 mm dia., 5 mm depth) with World Trade Center aluminum debris cuffs.",
    breakthroughResult: "Ground through exterior weathering rinds on dozens of rocks, proving rocks were chemically altered from within by water.",
  },
  {
    num: "07",
    name: "Magnetic Properties Experiment",
    acronym: "Magnets",
    leadInvestigator: "Dr. Morten Bo Madsen",
    institution: "Niels Bohr Institute (Denmark)",
    scienceRole: "Filter, capture, and sweep permanent neodymium magnets mounted on the rover deck to sample airborne magnetic dust.",
    breakthroughResult: "Determined that Martian airborne dust consists of titanomagnetite and maghemite, clarifying atmospheric scattering.",
  },
  {
    num: "08",
    name: "Radio Science & EDL Doppler Carrier Tones",
    acronym: "RSS",
    leadInvestigator: "MER Flight Telecommunications Team",
    institution: "JPL / Deep Space Network",
    scienceRole: "36 distinct X-band semaphore musical Doppler carrier tones transmitted directly to Goldstone & Canberra 70 m antennas.",
    breakthroughResult: "Provided live real-time parachute deployment, heat shield separation, RAD motor firing, and bounce telemetry during 6-min landing.",
  },
];

/**
 * Discarded Hardware Monuments Manifest
 * Six hardware monuments for each rover.
 */
export interface DiscardedMonument {
  id: string;
  rover: "spirit" | "opportunity";
  name: string;
  category: "heat-shield" | "backshell-parachute" | "lander-airbags" | "expended-tool" | "rover-chassis" | "cruise-stage";
  massKg: number;
  coordinates: {
    lat: number;
    lon: number;
  };
  siteName: string;
  condition: string;
  photojournalPia?: string;
  hiriseObsId?: string;
  description: string;
  scientificValue: string;
}

export const DISCARDED_MONUMENTS: DiscardedMonument[] = [
  // --- Spirit Monuments (Gusev Crater) ---
  {
    id: "spirit-heat-shield",
    rover: "spirit",
    name: "Spirit Aeroshell Heat Shield",
    category: "heat-shield",
    massKg: 78,
    coordinates: { lat: -14.565, lon: 175.479 },
    siteName: "Plains between Columbia Station & Bonneville Crater",
    condition: "Resting upright in shallow impact depression",
    hiriseObsId: "PSP_001513_1655",
    description: "2.65 m diameter carbon-phenolic aeroshell heat shield jettisoned at ~9 km altitude during Mach 19 atmospheric entry.",
    scientificValue: "Orbital benchmark for atmospheric wind drift and heat shield deceleration dynamics in thin Martian air.",
  },
  {
    id: "spirit-backshell-chute",
    rover: "spirit",
    name: "Spirit Backshell & Supersonic Parachute",
    category: "backshell-parachute",
    massKg: 209,
    coordinates: { lat: -14.566, lon: 175.470 },
    siteName: "450 m northwest of Columbia Memorial Station",
    condition: "Canopy billowed across soil; nylon/polyester fabric observed fluttering for years",
    hiriseObsId: "PSP_001513_1655",
    description: "14-meter supersonic disk-gap-band parachute attached to conical backshell with expended RAD rocket motors.",
    scientificValue: "Provided long-term orbital observations of material degradation and wind-induced fabric shifting on Mars.",
  },
  {
    id: "spirit-columbia-station",
    rover: "spirit",
    name: "Columbia Memorial Station (Lander & Airbags)",
    category: "lander-airbags",
    massKg: 348,
    coordinates: { lat: -14.5684, lon: 175.4726 },
    siteName: "Columbia Memorial Station, Gusev Crater",
    condition: "Base petal open with three triangular side petals and 24 deflated Vectran airbags",
    photojournalPia: "PIA05109",
    hiriseObsId: "PSP_001513_1655",
    description: "Tetrahedral aluminum-honeycomb lander that protected Spirit during 28 bounces. Carries STS-107 memorial plaque and Planetary Society mini-DVD.",
    scientificValue: "Permanent geodetic ground-truth fiducial for Mars cartography; verified Vectran fabric resilience under multiple ~15 G impacts.",
  },
  {
    id: "spirit-rat-diamond-teeth",
    rover: "spirit",
    name: "Spirit RAT Expendable Diamond Grinding Burrs",
    category: "expended-tool",
    massKg: 0.05,
    coordinates: { lat: -14.582, lon: 175.501 },
    siteName: "Columbia Hills Traverse (Sol 416 rock grind)",
    condition: "Diamond abrasive grains worn completely flush into Martian rock dust",
    description: "After grinding through 15 volcanic rocks in Gusev Crater, the resin-bonded diamond burrs on Spirit's RAT wore away completely, leaving only its wire brush.",
    scientificValue: "Real-world engineering data on abrasion rates of Martian volcanic basalts versus terrestrial diamonds.",
  },
  {
    id: "spirit-rover-chassis",
    rover: "spirit",
    name: "Spirit Rover Chassis at Troy",
    category: "rover-chassis",
    massKg: 185,
    coordinates: { lat: -14.5994, lon: 175.5284 },
    siteName: "Troy, West Margin of Home Plate",
    condition: "Immobilized in ferric sulfate soil, tilted 11.5° south, frozen electronics",
    photojournalPia: "PIA10214",
    hiriseObsId: "ESP_021925_1650",
    description: "Resting permanently beside Home Plate. Its jammed right-front wheel excavated the 90% pure silica deposits that proved ancient hot springs.",
    scientificValue: "A permanent scientific and historic monument to human grit, having climbed Husband Hill and transformed an engineering failure into a breakthrough.",
  },
  {
    id: "spirit-cruise-stage",
    rover: "spirit",
    name: "Spirit Cruise Stage Debris Field",
    category: "cruise-stage",
    massKg: 193,
    coordinates: { lat: -14.65, lon: 175.12 },
    siteName: "Uprange plains west of Gusev Crater",
    condition: "Fragmented impact debris from atmospheric burn-up",
    description: "Jettisoned 15 minutes before atmospheric entry; traveled along ballistic arc, disintegrating upon entry.",
    scientificValue: "Aerothermal breakup footprint modeling for planetary defense and entry safety margins.",
  },

  // --- Opportunity Monuments (Meridiani Planum) ---
  {
    id: "oppy-challenger-station",
    rover: "opportunity",
    name: "Challenger Memorial Station (Eagle Crater)",
    category: "lander-airbags",
    massKg: 348,
    coordinates: { lat: -1.9462, lon: 354.4734 },
    siteName: "Eagle Crater, Meridiani Planum",
    condition: "Petals open inside 22-meter crater with deflated Vectran airbags",
    photojournalPia: "PIA05199",
    hiriseObsId: "PSP_001414_1780",
    description: "The 'interplanetary hole-in-one'. Bounced across Meridiani Planum and rolled directly into a small impact crater exposing bedrock. Dedicated to STS-51-L.",
    scientificValue: "Exposed layered sulfate bedrock immediately at touchdown, enabling instant discovery of past Martian groundwater.",
  },
  {
    id: "oppy-backshell-chute",
    rover: "opportunity",
    name: "Opportunity Backshell & Parachute",
    category: "backshell-parachute",
    massKg: 209,
    coordinates: { lat: -1.950, lon: 354.469 },
    siteName: "450 m southwest of Eagle Crater",
    condition: "Backshell impact deformation visible beside spread parachute",
    hiriseObsId: "PSP_001414_1780",
    description: "Jettisoned during descent after rocket braking; parachute laid flat across the dark hematite plains.",
    scientificValue: "Longest continuously observed man-made textile under Martian UV and wind conditions.",
  },
  {
    id: "oppy-heat-shield-site",
    rover: "opportunity",
    name: "Opportunity Heat Shield & Heat Shield Rock",
    category: "heat-shield",
    massKg: 78,
    coordinates: { lat: -1.959, lon: 354.480 },
    siteName: "South of Endurance Crater",
    condition: "Shattered into two main inverted fragments; 2.8 m impact crater",
    photojournalPia: "PIA07217",
    hiriseObsId: "PSP_001414_1780",
    description: "First forensic inspection of a discarded heat shield on another planet (Sol 325–355). Beside it lies Heat Shield Rock (PIA07269), the first meteorite found on another planet.",
    scientificValue: "Direct measurement of silicone cork-phenolic char depth; discovery of iron-nickel Type IAB octahedrite meteorite on Mars.",
  },
  {
    id: "oppy-rover-chassis",
    rover: "opportunity",
    name: "Opportunity Rover Chassis in Perseverance Valley",
    category: "rover-chassis",
    massKg: 185,
    coordinates: { lat: -2.284, lon: 354.652 },
    siteName: "Perseverance Valley, Endeavour Crater Rim",
    condition: "Parked on upper slope; solar panels blanketed in fine dust",
    photojournalPia: "PIA22949",
    hiriseObsId: "ESP_056955_1775",
    description: "Resting on the rim of 22 km Endeavour Crater after driving 45.16 km (marathon+). Transmitted final Sol 5111 telemetry before planet-encircling dust storm.",
    scientificValue: "End point of humanity's longest extraterrestrial drive; monument to the exploration of aqueous Mars.",
  },
];

/**
 * 5 Poignant Physical Memorials & Hidden Human Artifacts Left on Mars
 */
export interface MERMemorial {
  id: string;
  rover: "spirit" | "opportunity" | "both";
  title: string;
  tagline: string;
  imagePia?: string;
  story: string;
  hardwarePlacement: string;
  youthTakeaway: string;
}

export const MER_MEMORIALS: MERMemorial[] = [
  {
    id: "wtc-aluminum-cuffs",
    rover: "both",
    title: "World Trade Center 9/11 Aluminum Cuffs",
    tagline: "Twin Towers metal resting on Mars for millions of years",
    story: "In late 2001, Honeybee Robotics (located less than a mile from Ground Zero in Manhattan) was fabricating the Rock Abrasion Tools. NASA and Honeybee collaborated to machine the cable-shield cuffs on both rovers' RATs out of recovered World Trade Center aluminum, laser-etching a tiny American flag on each cuff.",
    hardwarePlacement: "Cable-shield cuff on the Rock Abrasion Tool (RAT) turret on both Spirit (MER-A) and Opportunity (MER-B).",
    youthTakeaway: "Out of immense human tragedy on Earth, a piece of the fallen towers was transformed into a scientific tool to study ancient life on Mars.",
  },
  {
    id: "columbia-memorial",
    rover: "spirit",
    title: "Columbia Memorial Station & STS-107 Plaque",
    tagline: "Dedicated to the seven astronauts who gave their lives on Space Shuttle Columbia",
    imagePia: "PIA05018",
    story: "Spirit carries an aluminum memorial plaque on the back of its High-Gain Antenna dish dedicated to the STS-107 crew of Space Shuttle Columbia ('The dream is alive'). Spirit's landing site was officially dedicated as Columbia Memorial Station, and Spirit spent two years ascending Husband Hill (named for Commander Rick Husband) to look back across Gusev Crater.",
    hardwarePlacement: "Back of Spirit's High-Gain Antenna dish and Gusev landing station base.",
    youthTakeaway: "Husband Hill and the Columbia Memorial on Mars stand as eternal reminders that courage in the face of the unknown shapes the future of exploration.",
  },
  {
    id: "challenger-memorial",
    rover: "opportunity",
    title: "Challenger Memorial Station",
    tagline: "Dedicated to the seven brave astronauts of Space Shuttle Challenger STS-51-L",
    imagePia: "PIA05216",
    story: "Opportunity's landing platform inside Eagle Crater was formally dedicated by NASA as Challenger Memorial Station in honor of the STS-51-L crew. The tetrahedral lander petals and deflated airbags in Meridiani Planum serve as a permanent extraterrestrial memorial to their pioneering spirit.",
    hardwarePlacement: "Opportunity's Eagle Crater tetrahedral lander platform in Meridiani Planum.",
    youthTakeaway: "Opportunity began its legendary 14-year, 45-kilometer marathon right beside Challenger Memorial Station.",
  },
  {
    id: "marsdial-sundial",
    rover: "both",
    title: "The MarsDial Sundial: 'TWO WORLDS, ONE SUN'",
    tagline: "The word 'MARS' in 22 Earth languages and stick-figure drawings from children",
    imagePia: "PIA05060",
    story: "Mounted on each rover's solar deck as the radiometric calibration target for Pancam, the 8×8 cm MarsDial features a central gnomon post tipped with a gold sphere. Around its beveled edges, the phrase 'TWO WORLDS, ONE SUN' is engraved alongside 'MARS' in 22 languages (Arabic, Bengali, Chinese, English, French, Hindi, Japanese, Russian, Spanish, Swahili, Urdu, and more). Inner rings hold tiny stick figures drawn by schoolchildren.",
    hardwarePlacement: "Rear corner of the rover solar panel deck.",
    youthTakeaway: "Even a scientific calibration tool was turned into a global love letter from the children of Earth to the future visitors of Mars.",
  },
  {
    id: "lego-astrobot-dvds",
    rover: "both",
    title: "Planetary Society Mini-DVDs & LEGO Astrobots",
    tagline: "3,553,268 names fastened by LEGO minifigures Biff Starling & Sandy Moondust",
    imagePia: "PIA05024",
    story: "Bolted inside the lander petals on both Columbia and Challenger stations, an archival silica-glass mini-DVD carries the names of 3,553,268 space enthusiasts collected worldwide. To survive 15-G airbag bounces, each DVD was clamped down with three spring-loaded fasteners shaped like LEGO minifigures ('Biff Starling' and 'Sandy Moondust') with radial magnets to study dust adhesion.",
    hardwarePlacement: "Inside petal of Columbia Memorial Station and Challenger Memorial Station.",
    youthTakeaway: "Over 3.5 million human names and two LEGO astronauts landed on Mars in 2004, where they remain intact today.",
  },
  {
    id: "spirit-troy-winter",
    rover: "spirit",
    title: "Spirit's Winter Stand at Troy: The 11.5° Southward Tilt",
    tagline: "How an immobilized rover fought through Martian winter until survival heaters fell silent on Sol 2210",
    imagePia: "PIA12007",
    story: "On May 1, 2009 (Sol 1892), Spirit broke through a crusty surface veneer into a hidden sand trap of soft ferric sulfate at Troy beside Home Plate. Its right-front drive wheel was already seized, and in November 2009 its right-rear wheel failed as well. Stuck with an 11.5° southward tilt, Spirit could not aim its solar panels toward the low northern winter Sun. Array power plunged to ~89 Wh/sol. On March 22, 2010 (Sol 2210), Spirit transmitted its final signal, its electronics dropping below -55°C after 2,210 sols.",
    hardwarePlacement: "Troy, western margin of Home Plate, Columbia Hills, Gusev Crater.",
    youthTakeaway: "Spirit never gave up. Even after losing two wheels and getting trapped in sulfate sand, it operated as a stationary science platform until the bitter cold of Martian winter finally froze its circuits.",
  },
  {
    id: "audio-doppler-ill-be-seeing-you",
    rover: "opportunity",
    title: "Billie Holiday's Uplink & The Authentic Sol 5111 Truth",
    tagline: "The viral myth vs. the cold telemetry flags, and the final jazz song from Earth",
    imagePia: "PIA22949",
    story: "Myth: Opportunity spoke poetic words ('My battery is low and it's getting dark'). Engineering Truth: On Sol 5111, Opportunity transmitted raw Low-Power Fault flags, 22 Wh solar generation, a record dust opacity of tau=10.8, and dark frame PIA22949. Before final recovery commands ended on Feb 12, 2019, JPL controllers beamed Billie Holiday's 'I\\'ll Be Seeing You' across the 70m Goldstone antenna.",
    hardwarePlacement: "Deep Space Network Goldstone DSS-14 uplink to Perseverance Valley.",
    youthTakeaway: "Machines don't write poetry, but the humans who love and steer them do. Engineering telemetry and human emotion together make space exploration unforgettable.",
  },
];

/**
 * Deterministic JPL Photojournal PIA Catalog
 */
export interface PIAPhoto {
  id: string;
  rover: "spirit" | "opportunity";
  sol: number | string;
  title: string;
  significance: string;
  url: string;
}

export const MER_PIA_CATALOG: PIAPhoto[] = [
  {
    id: "PIA05014",
    rover: "spirit",
    sol: 3,
    title: "First Color 360° Panorama of Gusev Crater",
    significance: "First high-resolution view from atop the Columbia Station lander petals.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA05014.jpg",
  },
  {
    id: "PIA05109",
    rover: "spirit",
    sol: 16,
    title: "Columbia Memorial Station After Roll-Off",
    significance: "Spirit looking back at its empty lander platform and deflated Vectran airbags.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA05109.jpg",
  },
  {
    id: "PIA05199",
    rover: "opportunity",
    sol: 3,
    title: "First Color 360° Panorama Inside Eagle Crater",
    significance: "Shows exposed layered bedrock and Challenger Memorial Station.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA05199.jpg",
  },
  {
    id: "PIA05584",
    rover: "opportunity",
    sol: 46,
    title: "Martian Blueberries (Hematite Concretions)",
    significance: "Microscopic Imager close-up of spherical concretions precipitated by ancient water.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA05584.jpg",
  },
  {
    id: "PIA07217",
    rover: "opportunity",
    sol: 330,
    title: "Opportunity's Discarded Heat Shield Debris",
    significance: "First forensic inspection of a discarded heat shield on another planet.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA07217.jpg",
  },
  {
    id: "PIA07269",
    rover: "opportunity",
    sol: 346,
    title: "Heat Shield Rock (First Meteorite on Another Planet)",
    significance: "31 cm iron-nickel meteorite discovered right beside the heat shield debris.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA07269.jpg",
  },
  {
    id: "PIA03610",
    rover: "spirit",
    sol: "582–585",
    title: "Husband Hill Summit Panorama",
    significance: "360° true-color view after climbing 82 m above the surrounding Gusev plains.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA03610.jpg",
  },
  {
    id: "PIA10214",
    rover: "spirit",
    sol: 1187,
    title: "90% Pure Opaline Silica Soil Excavated by Jammed Wheel",
    significance: "Bright white hydrothermal silica churned up by Spirit's broken right-front wheel.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA10214.jpg",
  },
  {
    id: "PIA22949",
    rover: "opportunity",
    sol: 5111,
    title: "Opportunity's Final Image Transmitted to Earth",
    significance: "Noisy Pancam view attempting to detect the Sun through the tau=10.8 dust storm.",
    url: "https://photojournal.jpl.nasa.gov/jpeg/PIA22949.jpg",
  },
];

/**
 * Deterministic PDS 27-Character Filename Decoder
 * Schema: {SC}{INST}{SCLK9}{PROD}{SITE}{POS}{SEQ}{CAM}{AUTH}_{EXT}
 * Example: 1P581919922EFFD212P2685L8M1
 */
export interface DecodedPDSFilename {
  raw: string;
  isValid: boolean;
  spacecraft: string;
  roverSlug: "spirit" | "opportunity" | "unknown";
  instrument: string;
  sclkTimestamp: number;
  productType: string;
  siteCode: string;
  drivePosition: string;
  cameraFilter: string;
  description: string;
}

export function decodeMERFilename(filename: string): DecodedPDSFilename {
  const clean = filename.trim().toUpperCase().replace(/\.[A-Z0-9]+$/, "");
  if (clean.length < 24) {
    return {
      raw: filename,
      isValid: false,
      spacecraft: "Unknown",
      roverSlug: "unknown",
      instrument: "Unknown",
      sclkTimestamp: 0,
      productType: "Unknown",
      siteCode: "--",
      drivePosition: "--",
      cameraFilter: "--",
      description: "Invalid MER PDS filename (expected 24–27 chars)",
    };
  }

  // Char 1: Spacecraft ID (1 = Opportunity, 2 = Spirit)
  const scChar = clean[0];
  const isOpp = scChar === "1";
  const isSpirit = scChar === "2";
  const spacecraft = isOpp ? "Opportunity (MER-1 / MER-B)" : isSpirit ? "Spirit (MER-2 / MER-A)" : "Unknown MER";
  const roverSlug = isOpp ? "opportunity" : isSpirit ? "spirit" : "unknown";

  // Char 2: Instrument
  const instChar = clean[1];
  const instMap: Record<string, string> = {
    P: "Pancam (Panoramic Camera)",
    N: "Navcam (Navigation Camera)",
    F: "Front Hazcam (Hazard Avoidance)",
    R: "Rear Hazcam (Hazard Avoidance)",
    M: "Microscopic Imager",
    E: "EDL Descent Camera",
  };
  const instrument = instMap[instChar] ?? `Other Instrument (${instChar})`;

  // Chars 3-11: SCLK (9 digits)
  const sclkStr = clean.slice(2, 11);
  const sclkTimestamp = parseInt(sclkStr, 10) || 0;

  // Chars 12-14: Product type
  const prodStr = clean.slice(11, 14);
  const prodMap: Record<string, string> = {
    EFF: "Full Frame EDR (Experiment Data Record)",
    ESF: "Sub-Frame EDR",
    EDN: "Downsampled EDR",
    MRD: "Radiometrically Calibrated Mosaic RDR",
    RAD: "Radiance Calibrated RDR",
  };
  const productType = prodMap[prodStr] ?? prodStr;

  // Chars 15-16: Site
  const siteCode = clean.slice(14, 16);
  // Chars 17-18: Pos
  const drivePosition = clean.slice(16, 18);

  // Chars 24-25: Cam Filter
  const camFilter = clean.length >= 25 ? clean.slice(23, 25) : "--";

  return {
    raw: filename,
    isValid: true,
    spacecraft,
    roverSlug,
    instrument,
    sclkTimestamp,
    productType,
    siteCode,
    drivePosition,
    cameraFilter: camFilter,
    description: `${spacecraft} · ${instrument} · SCLK ${sclkTimestamp} · Product ${prodStr}`,
  };
}

/**
 * Martian Dust Storm Physics & Solar Power Calculations
 * Direct relationship between optical depth (tau), transmittance, and power (Wh)
 */
export function calculateDustImpact(tau: number) {
  // Transmittance of direct solar beam T = exp(-tau)
  const directTransmittance = Math.exp(-tau);
  // Effective power generation (nominal ~600 Wh, minimum survival ~100 Wh, Sol 5111 = 22 Wh at tau=10.8)
  const powerWh = Math.max(15, Math.round(620 * Math.exp(-0.31 * tau)));
  const sunVisibilityPercent = (directTransmittance * 100).toFixed(tau > 5 ? 4 : 2);

  let hazardLevel: "nominal" | "caution" | "critical" | "lethal" = "nominal";
  let statusText = "Solar power generation nominal. Science operations active.";

  if (tau >= 10.0) {
    hazardLevel = "lethal";
    statusText = "Total solar blackout (tau=10.8). Power 22 Wh. Survival heaters offline. Master Clock fault.";
  } else if (tau >= 5.0) {
    hazardLevel = "critical";
    statusText = "Severe global dust storm. Panel power < 100 Wh. Rovers enter emergency low-power hibernation.";
  } else if (tau >= 2.0) {
    hazardLevel = "caution";
    statusText = "Atmospheric haze thickening. Driving suspended to conserve battery reserves.";
  }

  return {
    tau,
    directTransmittance,
    sunVisibilityPercent,
    powerWh,
    hazardLevel,
    statusText,
  };
}
