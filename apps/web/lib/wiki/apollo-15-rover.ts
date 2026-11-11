import type { WikiEntry } from "./types";
import { LRV_SOURCES as S } from "../lrv-sources";

export const APOLLO_15_ROVER: WikiEntry = {
  lead: "The Lunar Roving Vehicle was a lightweight, battery-powered electric car built to carry two astronauts and their equipment across the Moon. Apollo 15's rover was the first one driven on the lunar surface, in July and August 1971, and it was left parked at Hadley–Apennine.",
  sections: [
    {
      id: "why",
      title: "Why it was built",
      paras: [
        "A folding, battery-powered vehicle allowed astronauts to reach more varied geology while carrying tools, cameras and samples. The Lunar Roving Vehicle was used on Apollo 15, 16 and 17.",
        "NSSDCA describes a three-part aluminum chassis, mesh tyres, individual electric wheel drives, front and rear steering, and two non-rechargeable 36-volt batteries. Boeing developed the rover with Delco as a major subcontractor.",
      ],
    },
    {
      id: "hadley",
      title: "Three drives at Hadley",
      paras: [
        "Apollo 15 launched on 26 July 1971 with David Scott, Alfred Worden and James Irwin. Scott and Irwin landed the lunar module Falcon at Hadley–Apennine, between the Apennine mountains and Hadley Rille, while Worden stayed in lunar orbit.",
        "The rover was deployed on 31 July. Front steering was inoperative during initial checkout, so the first excursion used rear-wheel steering. Recycling the circuit breakers restored front steering before the second excursion. NASA's summary also records a battery-meter readout issue; the steering fault should not be labelled the mission's only anomaly.",
        "NSSDCA reports 27.8 km and three hours, two minutes of driving; NASA SP-4029 reports about 27.9 km and three hours. These are attributed totals, not an exact combined measurement. Driving time is different from Falcon's total surface stay.",
      ],
    },
    {
      id: "last-broadcast",
      title: "The last broadcast",
      paras: [
        "When the crew left on 2 August 1971, the rover was parked away from the lander so its colour television camera, controlled from Earth, could show Mission Control the liftoff of Falcon's ascent stage. Then it stayed behind on the Moon.",
        "The reviewed records do not establish the rover's current electronic health or a precise final battery-death timestamp. Falcon's published landing coordinates identify the lander, not the rover's exact parking position.",
      ],
    },
    {
      id: "legacy",
      title: "Legacy",
      paras: [
        "The rover enabled access to geological sites, while the crew collected photographs and samples. NASA's Astromaterials 3D collection now offers a model and X-ray CT imagery of sample 15016, the rock associated with Scott's reported seatbelt stop. Missing field documentation remains part of that sample's history.",
      ],
    },
  ],
  timeline: [
    { date: "26 July 1971", text: "Apollo 15 launches with the rover stowed aboard Falcon." },
    { date: "30 July 1971", text: "Falcon lands at Hadley–Apennine." },
    { date: "31 July 1971", text: "Deployment and first excursion, using rear-wheel steering." },
    { date: "1 August 1971", text: "Second drive; the front steering works again." },
    { date: "2 August 1971", text: "Third and final drive; the rover's TV camera broadcasts Falcon's liftoff." },
  ],
  facts: [
    { label: "Development", value: "17 months reported by NSSDCA; Boeing, with Delco as a major subcontractor" },
    { label: "Parent mission identity", value: "1971-063C identifies Falcon / lunar surface mission; no separate rover COSPAR or SATCAT is asserted" },
    { label: "Drivers", value: "David R. Scott (Commander), James B. Irwin (LMP)" },
    { label: "Mass & capacity", value: "210 kg rover mass; 490 kg design payload. Mass does not change to 35 kg on the Moon" },
    { label: "Dimensions", value: "3.1 m frame length; 2.3 m wheelbase; 1.14 m maximum height (NSSDCA)" },
    { label: "Electric powertrain", value: "4 × 0.25 hp DC series-wound electric motors (1 per wheel, 10,000 RPM)" },
    { label: "Power supply", value: "Two 36-volt silver-zinc non-rechargeable batteries (121 Ah each)" },
    { label: "Total distance driven", value: "NSSDCA: 27.8 km / 3 h 2 min driving. SP-4029: about 27.9 km / 3 h" },
    { label: "Maximum range from LM", value: "5.0 km reported by NSSDCA; not the total route length" },
    { label: "Falcon landing position", value: "26.13239° N, 3.63330° E; DE421 mean Earth/polar rotation-axis frame. Not a rover parking fix" },
    { label: "Left on Moon", value: "LRV-1 chassis, LCRU radio relay, GCTA camera, High-Gain antenna" },
  ],
  sources: [
    ...Object.values(S).map(source => ({ label: source.title, url: source.url })),
  ],
};
