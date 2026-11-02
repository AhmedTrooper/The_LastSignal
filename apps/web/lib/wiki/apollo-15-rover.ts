import type { WikiEntry } from "./types";

export const APOLLO_15_ROVER: WikiEntry = {
  lead: "The Lunar Roving Vehicle was a lightweight, battery-powered electric car built to carry two astronauts and their equipment across the Moon. Apollo 15's rover was the first one driven on the lunar surface, in July and August 1971, and it was left parked at Hadley–Apennine.",
  sections: [
    {
      id: "why",
      title: "Why it was built",
      paras: [
        "On the early Apollo landings astronauts could only walk short distances from the lander; on Apollo 11 the total was a little over half a mile. A rover would let a crew carry tools and samples several miles from the landing site and reach much more varied geology. An LRV was used on each of the last three missions, Apollo 15, 16 and 17.",
        "The rover was developed under NASA's Marshall Space Flight Center and built by Boeing.",
      ],
    },
    {
      id: "hadley",
      title: "Three drives at Hadley",
      paras: [
        "Apollo 15 launched on 26 July 1971 with David Scott, Alfred Worden and James Irwin. Scott and Irwin landed the lunar module Falcon at Hadley–Apennine, between the Apennine mountains and Hadley Rille, while Worden stayed in lunar orbit.",
        "They deployed the rover on 31 July. Its only problem was that the front steering briefly did not work, so the first drive used rear-wheel steering only; it worked again the next day. On that first moonwalk they parked it on the edge of Hadley Rille. During their 67-hour stay they made three trips beyond the landing site, about 17.5 miles (28 km) in all, with three hours and two minutes of driving.",
      ],
    },
    {
      id: "last-broadcast",
      title: "The last broadcast",
      paras: [
        "When the crew left on 2 August 1971, the rover was parked away from the lander so its colour television camera, controlled from Earth, could show Mission Control the liftoff of Falcon's ascent stage. Then it stayed behind on the Moon.",
      ],
    },
    {
      id: "legacy",
      title: "Legacy",
      paras: [
        "With rovers, the distance Apollo astronauts covered grew from a little over half a mile on Apollo 11 to nearly 22.5 miles on Apollo 17. NASA is now reviving the idea for Artemis with a Lunar Terrain Vehicle.",
      ],
    },
  ],
  timeline: [
    { date: "26 July 1971", text: "Apollo 15 launches from Pad 39A at 9:34 a.m. EDT." },
    { date: "30 July 1971", text: "Falcon lands at Hadley–Apennine." },
    { date: "31 July 1971", text: "First drive on the Moon, steering with the rear wheels only; the rover is parked on the edge of Hadley Rille." },
    { date: "1 August 1971", text: "Second drive; the front steering works again." },
    { date: "2 August 1971", text: "Third and final drive; the rover's TV camera broadcasts Falcon's liftoff." },
  ],
  facts: [
    { label: "Developed by", value: "NASA Marshall Space Flight Center" },
    { label: "Prime contractor", value: "Boeing / Delco Electronics (mobility system)" },
    { label: "COSPAR / NORAD", value: "1971-063C / SATCAT 05358 (Falcon LM-10)" },
    { label: "Drivers", value: "David R. Scott (Commander), James B. Irwin (LMP)" },
    { label: "Mass & capacity", value: "210 kg Earth / 35 kg Moon (490 kg design payload capacity)" },
    { label: "Dimensions", value: "3.10 m length × 2.06 m width × 1.14 m height (2.30 m wheelbase)" },
    { label: "Electric powertrain", value: "4 × 0.25 hp DC series-wound electric motors (1 per wheel, 10,000 RPM)" },
    { label: "Power supply", value: "Two 36-volt silver-zinc non-rechargeable batteries (121 Ah each)" },
    { label: "Top speed", value: "13 km/h (8 mph) nominal, 12 km/h achieved" },
    { label: "Total distance driven", value: "27.76 km (17.25 mi) over 3 EVAs (3 h 02 min driving)" },
    { label: "Furthest range from LM", value: "5.0 km (3.1 mi) to Hadley Rille" },
    { label: "Parked VIP coordinates", value: "Hadley–Apennine, 26.1322° N, 3.6338° E (150 m east of Falcon)" },
    { label: "Left on Moon", value: "LRV-1 chassis, LCRU radio relay, GCTA camera, High-Gain antenna" },
  ],
  sources: [
    { label: "NSSDCA Master Catalog: Apollo 15 LM Falcon & LRV-1", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C" },
    { label: "NASA History: 50 Years Ago, First Apollo Astronauts to Drive on the Moon Took Final Cruise", url: "https://www.nasa.gov/history/50-years-ago-first-apollo-astronauts-to-drive-on-the-moon-took-final-cruise/" },
    { label: "NASA: Apollo 15 and the Lunar Roving Vehicle", url: "https://www.nasa.gov/image-article/apollo-15-lunar-roving-vehicle/" },
    { label: "Apollo Lunar Surface Journal: Apollo 15 Mobility Records", url: "https://www.nasa.gov/history/alsj/a15/" },
    { label: "NASA: Apollo 15", url: "https://www.nasa.gov/mission/apollo-15/" },
  ],
};
