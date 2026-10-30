/**
 * Verified forensic and engineering mission data for Mars Polar Lander (MPL) & Deep Space 2.
 * Sources:
 * - NASA Space Science Data Coordinated Archive (NSSDCA) ID: 1999-001A (MPL) & 1999-001B/C (Deep Space 2)
 * - NASA JPL Special Review Board: "Report on the Loss of the Mars Polar Lander and Deep Space 2 Missions" (Casani Board, March 2000)
 * - Mars Program Independent Assessment Team Summary Report (Thomas Young, Chairman, March 2000)
 * - The Planetary Society "Voices from Earth" 1-Million Names CD-ROM Archive
 */

export interface MPLSpecs {
  name: string;
  cosparId: string;
  nssdcaId: string;
  noradId: number;
  launchDateUtc: string;
  intendedLandingUtc: string;
  landingTarget: {
    region: string;
    targetLat: number;
    targetLon: number;
    elevationKm: number;
  };
  dimensions: {
    landerMassDryKg: number;
    fueledMassAtSeparationKg: number;
    heightM: number;
    diameterM: number;
  };
  telemetryStatus: string;
  primaryFailureMode: string;
}

export const MPL_SPECS: MPLSpecs = {
  name: "Mars Polar Lander",
  cosparId: "1999-001A",
  nssdcaId: "1999-001A",
  noradId: 25605,
  launchDateUtc: "1999-01-03T20:21:10 UTC",
  intendedLandingUtc: "1999-12-03T20:15:00 UTC",
  landingTarget: {
    region: "Planum Australe (South Pole Layered Terrains)",
    targetLat: -76.05,
    targetLon: 164.7, // 195.3° W
    elevationKm: 1.2,
  },
  dimensions: {
    landerMassDryKg: 290,
    fueledMassAtSeparationKg: 576,
    heightM: 1.06,
    diameterM: 3.6, // Leg span
  },
  telemetryStatus: "Carrier signal loss at 20:04 UTC (Entry interface); 0 telemetry received from surface",
  primaryFailureMode:
    "Spurious Hall-effect sensor transient on landing leg deployment latched Touchdown = TRUE in software. At 40 meters terminal altitude, software read the un-cleared bit and cut rocket engines in mid-air.",
};

export interface FreeFallCalculation {
  dropAltitudeMeters: number;
  initialVerticalSpeedMs: number;
  marsGravityMs2: number;
  fallTimeSeconds: number;
  terminalImpactSpeedMs: number;
  terminalImpactSpeedKmh: number;
  impactKineticEnergyJoules: number;
  structuralSurvivalProbabilityPct: number;
}

export function calculateMPLFreeFall(dropAltitudeM: number): FreeFallCalculation {
  const g = 3.72; // Mars surface gravity m/s²
  const v0 = 2.4; // Initial descent velocity at 40m under thrusters (m/s)
  const mass = 290; // Dry lander mass kg

  // v = sqrt(v0^2 + 2 * g * h)
  const vImpact = Math.sqrt(v0 * v0 + 2 * g * dropAltitudeM);
  // t = (vImpact - v0) / g
  const tFall = (vImpact - v0) / g;
  const energy = 0.5 * mass * vImpact * vImpact;

  // Honeycomb crush pads rated up to 3.0 m/s touchdown speed
  const survivalPct = dropAltitudeM <= 2 ? 95 : Math.max(0, 100 - (dropAltitudeM / 40) * 100);

  return {
    dropAltitudeMeters: dropAltitudeM,
    initialVerticalSpeedMs: v0,
    marsGravityMs2: g,
    fallTimeSeconds: tFall,
    terminalImpactSpeedMs: vImpact,
    terminalImpactSpeedKmh: vImpact * 3.6,
    impactKineticEnergyJoules: energy,
    structuralSurvivalProbabilityPct: survivalPct,
  };
}

export interface CasaniFinding {
  system: string;
  findingTitle: string;
  rootCause: string;
  recommendation: string;
}

export const CASANI_FINDINGS: CasaniFinding[] = [
  {
    system: "Touchdown Sensor & Software",
    findingTitle: "Premature Engine Cutoff at 40 Meters",
    rootCause:
      "When landing gear legs deployed at 1,500 m, spring extension bounce generated microsecond Hall-effect switch pulses. The flight software latched the pulse as touchdown = TRUE. Because the code lacked a reset command, enabling the sensor at 40 m altitude immediately shut down the descent engines.",
    recommendation:
      "Flight software must explicitly verify sustained ground contact for >100 ms and verify altitude radar confirmation before commanding thruster shutdown.",
  },
  {
    system: "Entry Telemetry Relay",
    findingTitle: "No Real-Time Entry Telemetry (The 'Silent Fall')",
    rootCause:
      "To save cost and weight under the 'Faster, Better, Cheaper' mandate, NASA eliminated the communications link during atmospheric entry. If anything failed, there was zero telemetry to diagnose the cause.",
    recommendation:
      "Mandate continuous real-time beacon or low-rate telemetry during all future Entry, Descent, and Landing (EDL) phases (adopted for MER, Phoenix, Curiosity, and Perseverance).",
  },
  {
    system: "Leg Deployment Ground Testing",
    findingTitle: "Inadequate End-to-End Hardware/Software Testing",
    rootCause:
      "The sensor switches were tested with separate wiring harnesses, and the flight software was tested with simulated inputs. The actual flight sensors were never wired to the flight computer during physical leg deployment tests.",
    recommendation:
      "Enforce mandatory full-system end-to-end testing with actual flight sensors and flight computers before launch.",
  },
];

export interface MPLDiscardedRelic {
  id: string;
  name: string;
  classification: "Lander Remains" | "Microprobe Penetrators" | "Time Capsule" | "Parachute" | "Heat Shield";
  expectedCoordinates: string;
  significance: string;
  youthTakeaway: string;
}

export const MPL_DISCARDED_RELICS: MPLDiscardedRelic[] = [
  {
    id: "mpl-crash-site",
    name: "Mars Polar Lander Impact Debris Field",
    classification: "Lander Remains",
    expectedCoordinates: "76.05° S, 164.70° E (Planum Australe)",
    significance: "Site where the lander impacted the polar layered deposits at ~63 km/h (17.4 m/s) on December 3, 1999.",
    youthTakeaway: "NASA engineers learned that testing every single wire and software line together is essential to exploring the solar system.",
  },
  {
    id: "deep-space-2-probes",
    name: "Deep Space 2 Microprobes ('Amundsen' & 'Scott')",
    classification: "Microprobe Penetrators",
    expectedCoordinates: "Within 50 km of MPL landing site",
    significance: "Two 3.57-kg penetrators designed to separate from the cruise stage and crash at 190 m/s without parachutes to sample subsurface ice.",
    youthTakeaway: "Miniature high-impact projectiles designed to survive a 30,000-G collision into frozen ground.",
  },
  {
    id: "planetary-society-cd",
    name: "1-Million Children's Names CD-ROM",
    classification: "Time Capsule",
    expectedCoordinates: "Attached to the MPL lander deck structure",
    significance: "Holds the digital names of over 1 million schoolchildren, space enthusiasts, and planetary society members collected worldwide in 1998.",
    youthTakeaway: "Even in tragedy, the names and dreams of one million children rest permanently beneath the Martian polar frost.",
  },
  {
    id: "mpl-parachute",
    name: "Dacron Parachute & Backshell",
    classification: "Parachute",
    expectedCoordinates: "Planum Australe, uprange from crash site",
    significance: "Slowed the lander through supersonic entry down to 2.4 m/s before discarding.",
    youthTakeaway: "The parachute performed nominally until the premature engine cut-off happened below it.",
  },
];
