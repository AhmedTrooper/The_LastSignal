import { apolloPhoto } from "./eagle-story";
import type { Photo } from "./photos";

export type EagleMission = {
  id: string;
  name: string;
  code: string;
  status: string;
  hardware: string;
  discovery: string;
  leftBehind: string;
  facts: { label: string; value: string }[];
  source: string;
  photo: Photo;
};

export const EAGLE_MISSIONS: EagleMission[] = [
  {
    id: "reflector", name: "A mirror that still answers.", code: "S-078 / Laser ranging", status: "Passive reflector",
    hardware: "A panel of corner-cube prisms returns incoming light toward its source. No battery, motor or radio transmitter is needed.",
    discovery: "Decades of observations of the lunar arrays measure the Moon’s retreat from Earth, reveal its fluid core and test gravity.",
    leftBehind: "The reflector array remains on the surface. Observatories on Earth supply the laser light and measure its return.",
    facts: [{ label: "Optics", value: "100 corner cubes" }, { label: "Power", value: "None required" }, { label: "Long-term result", value: "3.8 cm/year lunar recession" }],
    source: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/",
    photo: apolloPhoto("AS11-40-5952", "Apollo 11’s laser ranging retroreflector array on the lunar surface."),
  },
  {
    id: "seismometer", name: "We listened to the Moon.", code: "S-031 / Passive seismic experiment", status: "Historical measurements",
    hardware: "The seismic package was carefully levelled and its solar panels unfolded. Its instruments sensed tiny motions of the ground.",
    discovery: "The first observations even picked up the astronauts’ footsteps. The experiment helped scientists begin studying the Moon through vibrations.",
    leftBehind: "The seismic package and its solar panels stayed at Tranquility Base. Its radio record survives on Earth.",
    facts: [{ label: "Power", value: "Solar panels" }, { label: "Measured", value: "Ground motion" }, { label: "Deployment", value: "Levelled on the surface" }],
    source: "https://apollojournals.org/alsj/a11/a11.clsout.html#1111231",
    photo: apolloPhoto("AS11-40-5948", "The deployed passive seismic experiment, with Eagle in the background."),
  },
  {
    id: "solar-wind", name: "A little piece of the Sun.", code: "S-080 / Solar wind composition", status: "Foil returned · staff left",
    hardware: "A thin aluminium foil collector faced the Sun. It caught ions from the solar wind while the crew worked on the surface.",
    discovery: "The returned foil let laboratories examine helium, neon and argon from the solar wind. A very simple collector brought home material from the Sun.",
    leftBehind: "Buzz rolled up the foil for the return flight. The supporting staff remained on the Moon.",
    facts: [{ label: "Collector", value: "30 × 140 cm aluminium foil" }, { label: "Exposure", value: "77 minutes" }, { label: "Returned to Earth", value: "The foil collector" }],
    source: "https://apollojournals.org/alsj/a11/a11.step.html#1095832",
    photo: apolloPhoto("AS11-40-5873", "Buzz Aldrin with the solar wind composition experiment on the surface."),
  },
  {
    id: "dust", name: "Dust had a story, too.", code: "M-515 / Lunar dust detector", status: "Detector left on the surface",
    hardware: "Solar cells on the seismic package helped investigate how exposure to the lunar environment changed their output.",
    discovery: "Understanding solar-cell performance helps engineers design instruments that can keep working in the harsh lunar environment.",
    leftBehind: "The detector stayed with the seismic package. This small engineering experiment is part of the hardware story around Eagle.",
    facts: [{ label: "Mounted on", value: "Passive seismic package" }, { label: "Sensor", value: "Solar cells" }, { label: "Engineering question", value: "How does output change?" }],
    source: "https://apollojournals.org/alsj/a11/a11psr.html",
    photo: apolloPhoto("AS11-40-5948", "The passive seismic package that carried the lunar dust detector."),
  },
];

export const EAGLE_GALLERY = [
  apolloPhoto("AS11-40-5903", "Buzz Aldrin’s portrait. His visor reflects Armstrong and the lunar module."),
  apolloPhoto("AS11-40-5899", "The commemorative plaque attached to Eagle’s ladder strut."),
  apolloPhoto("AS11-40-5877", "Aldrin’s bootprint study of the lunar soil; not Neil’s first footstep."),
  apolloPhoto("AS11-40-5927", "Aldrin preparing to remove the surface experiments from the SEQ bay."),
  apolloPhoto("AS11-40-5948", "The seismic experiment and its deployed solar panels, with Eagle behind it."),
  apolloPhoto("AS11-40-5952", "The 100-corner-cube lunar laser ranging retroreflector array."),
];
