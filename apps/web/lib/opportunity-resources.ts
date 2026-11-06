import { OPPORTUNITY_SOURCES as S } from "./machine-books/opportunity";

export const OPPORTUNITY_REGISTRY = "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A";
export const OPPORTUNITY_IDENTITY = [
  { label: "Official designation", value: "Mars Exploration Rover B / MER-1", source: OPPORTUNITY_REGISTRY },
  { label: "NSSDCA / COSPAR", value: "2003-032A", source: OPPORTUNITY_REGISTRY },
  { label: "Launch", value: "8 July 2003 / 03:18:15 UT", source: OPPORTUNITY_REGISTRY },
  { label: "Rover mass", value: "185 kg", source: S.mission },
  { label: "Final working location", value: "Perseverance Valley", source: S.end },
];

/** Deliberately excludes unsourced coordinate precision and uncertain final internal states. */
export const OPPORTUNITY_HARDWARE = [
  { name: "Pancam", where: "Camera mast", job: "Stereo and colour views gave the team a way to examine terrain. Images of the Sun also helped estimate dust opacity.", learned: "The last faint-Sun thumbnails were used to estimate tau. They are not the same file as the last image transmitted.", source: S.lastImages },
  { name: "Mössbauer spectrometer", where: "Robotic-arm instrument turret", job: "Measured iron-bearing minerals close to a rock or soil target.", learned: "The Berry Bowl comparison identified hematite as the major iron-bearing mineral in the spheres.", source: S.berries },
  { name: "Microscopic Imager", where: "Robotic arm", job: "Provided close-up views, like a geologist’s hand lens.", learned: "The appearance and arrangement of small features could be compared with composition measurements.", source: S.mission },
  { name: "APXS", where: "Robotic arm", job: "Investigated elemental composition at selected targets.", learned: "Chemical measurements added evidence that a landscape photograph could not supply.", source: S.mission },
  { name: "Rock Abrasion Tool", where: "Robotic arm", job: "Removed weathered material so the instruments could examine a fresher rock surface.", learned: "The tool’s cable-shield cuff included aluminium recovered from the World Trade Center site: a memorial carried with the science hardware.", source: S.mission },
  { name: "Mini-TES", where: "Mast viewing system", job: "Studied thermal infrared light from the surrounding rocks and soil.", learned: "Remote observations helped the team choose places for closer investigation.", source: S.mission },
  { name: "Solar arrays and onboard memory", where: "Rover deck and electronics", job: "Supplied electrical power and held observations until they could be returned.", learned: "Wind cleaning and changes to memory operations helped the long mission continue. RAM-only operation required returning data before power-down.", source: S.mission },
];

export const OPPORTUNITY_ARTIFACTS = [
  { name: "Challenger Memorial Station", note: "The landing platform remained in Eagle Crater. The site was named for the Challenger crew.", source: S.mission },
  { name: "Heat shield, backshell and parachute", note: "Arrival hardware stayed in Meridiani Planum. Opportunity later photographed discarded equipment near its landing area.", source: S.mission },
  { name: "The rover and attached instruments", note: "Opportunity’s final working location was Perseverance Valley. Contact ended, but its returned observations remain available on Earth.", source: S.end },
];

export const OPPORTUNITY_ARCHIVE_LINKS = [
  { label: "NSSDCA · Spacecraft registry", url: OPPORTUNITY_REGISTRY },
  { label: "NASA Science · Mission overview", url: S.mission },
  { label: "PDS · MER observations and documents", url: "https://pds-geosciences.wustl.edu/missions/mer/index.htm" },
  { label: "PDS · Analyst’s Notebook", url: "https://an.rsl.wustl.edu/mer/" },
  { label: "JPL · Verified 2026 record handoff", url: S.handoff },
];
