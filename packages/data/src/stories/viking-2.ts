import type { Story } from "./types";

/**
 * Viking 2 Mars Lander (COSPAR: 1975-083C)
 * Sub-polar expedition on Utopia Planitia (1976 - 1980).
 * Sourced directly from NASA NSSDCA, NASA History SP-4212, and HiRISE frame PSP_001501_2280.
 */
export const VIKING_2: Story = {
  slug: "viking-2",
  title: "Viking 2",
  lede: "Landed near the Martian ice cap, tilted 8.5 degrees across volcanic boulders. It felt the frost freeze on the rocks and recorded the first possible marsquake.",
  scenes: [
    {
      id: "title",
      year: 1975,
      date: "NASA Project Viking · 1975 – 1980",
      title: "Viking 2",
      text: "While Viking 1 landed on the equatorial plains, Viking 2 was sent far north to Utopia Planitia, where scientists hoped subsurface ice would reveal active signs of water and life.",
      image: "viking-2",
      from: { s: 1.4, x: 0.5, y: 0.4 },
      to: { s: 1, x: 0.5, y: 0.5 },
      len: 1.2,
    },
    {
      id: "launch",
      year: 1975,
      date: "9 September 1975 · LC-41",
      title: "The backup that flew second",
      text: "Originally scheduled to fly first as Viking A, a battery defect caused engineers to swap it for Viking B. Re-designated Viking 2, it launched 20 days later into a sweeping interplanetary orbit.",
      image: "launch",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.5, x: 0.6, y: 0.4 },
    },
    {
      id: "touchdown-tilt",
      year: 1976,
      date: "3 September 1976 · 22:37:50 UTC",
      title: "The 8.5-degree westward tilt",
      text: "Touchdown was rougher than its twin's: one of the lander's footpads landed directly atop a volcanic rock, causing the entire lander to sit at a permanent 8.5° westward tilt in Utopia Planitia.",
      image: "viking-2",
      from: { s: 1.2, x: 0.4, y: 0.6 },
      to: { s: 1.5, x: 0.6, y: 0.4 },
      len: 1.2,
    },
    {
      id: "seismometer",
      year: 1976,
      date: "Sol 80 · 23 November 1976",
      title: "The Sol 80 Marsquake",
      text: "While Viking 1's seismometer uncaging pin jammed and never worked, Viking 2's seismometer functioned on the lander body. On Sol 80, during a quiet wind lull, it recorded an event consistent with a magnitude 2.8 marsquake.",
      image: "viking-2",
      from: { s: 1.1, x: 0.5, y: 0.5 },
      to: { s: 1.4, x: 0.5, y: 0.5 },
    },
    {
      id: "frost",
      year: 1977,
      date: "May 1977 · Sol 260 Northern Winter",
      title: "Water frost on the rocks",
      text: "As northern winter plunged temperatures to -120°C, Camera 2 photographed a delicate white dusting of water-ice frost coating the red basalt rocks—the first visual confirmation of Martian surface ice.",
      image: "viking-2",
      from: { s: 1.2, x: 0.5, y: 0.7 },
      to: { s: 1.6, x: 0.5, y: 0.5 },
      len: 1.3,
    },
    {
      id: "end-battery",
      year: 1980,
      date: "11 April 1980 · Sol 1281",
      title: "Winter darkness & battery drain",
      text: "After 1,281 Martian sols (nearly four Earth years), Viking 2's nickel-cadmium batteries degraded under harsh winter cold. Telemetry ceased on April 11, 1980, leaving the tilted lander silent in Utopia.",
      image: "viking-2",
      from: { s: 1.3, x: 0.5, y: 0.4 },
      to: { s: 1, x: 0.5, y: 0.5 },
    },
    {
      id: "hirise-utopia",
      year: 2006,
      date: "HiRISE Frame PSP_001501_2280",
      title: "Found in Utopia Planitia",
      text: "Thirty years later, the HiRISE camera pinpointed Viking 2 at 47.668° N, 134.280° E, identifying the bright lander deck, parachute, and heat shield impact site scattered across the ancient northern lowlands.",
      image: "viking-2",
      from: { s: 1.5, x: 0.5, y: 0.5 },
      to: { s: 1, x: 0.5, y: 0.5 },
      len: 1.2,
    },
  ],
  sources: [
    { label: "NASA NSSDCA Master Record: Viking 2 Lander (1975-083C)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C" },
    { label: "NASA History SP-4212: On Mars - Exploration of the Red Planet", url: "https://history.nasa.gov/SP-4212/on-mars.html" },
    { label: "HiRISE: Viking 2 Lander in Utopia Planitia (PSP_001501_2280)", url: "https://www.uahirise.org/PSP_001501_2280" },
  ],
};
