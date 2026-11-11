import type { WikiEntry } from "./types";
import { PATHFINDER_SOURCES as S } from "../pathfinder-sources";

export const PATHFINDER: WikiEntry = {
  lead: "Mars Pathfinder was a NASA lander that tested a new way to land on Mars, bouncing down inside airbags, and delivered Sojourner, the first wheeled vehicle to operate on another planet. Both landed in Ares Vallis on 4 July 1997 and worked until contact was lost on 27 September 1997.",
  sections: [
    {
      id: "why",
      title: "Why it was built",
      paras: [
        "After the Viking landers fell silent, robotic exploration of the Martian surface paused for nearly 15 years, and the Mars Observer orbiter was lost in 1993. Pathfinder was designed as a technology demonstration: a low-cost way to deliver an instrumented lander and a free-ranging rover to Mars. Its landing began an unbroken period, continuing today, with at least one spacecraft working at Mars.",
      ],
    },
    {
      id: "landing",
      title: "A bouncing landing",
      paras: [
        "Pathfinder launched on a Delta II from Cape Canaveral on 4 December 1996 and reached Mars on 4 July 1997 after a 212-day cruise. It entered the atmosphere at 14,000 mph inside an aeroshell derived from Viking's, slowed under a supersonic parachute, inflated its airbags 1,165 feet above the ground, fired three solid rockets, then cut itself free 71 feet up.",
        "The airbags cushioned the final impacts as Pathfinder bounced and rolled before stopping. NASA summaries differ in detailed bounce heights and counts, so this edition does not present an exact reconstructed trajectory. The airbags deflated and the lander opened its three petals after landing.",
      ],
    },
    {
      id: "sojourner",
      title: "Sojourner",
      paras: [
        "Sojourner weighed 10.6 kg and stood about 30 cm tall. It was named after the civil-rights campaigner Sojourner Truth, following a winning essay by 12-year-old Valerie Ambrose. On sol 2 it stood up on its six wheels and rolled down the lander's rear ramp (on 5 July in U.S. time; NASA's history article gives 6 July).",
        "Drivers at JPL steered it at up to 0.39 inch per second. It travelled about 330 feet in total, never more than 39 feet from the lander, and analysed rocks the team nicknamed after cartoon characters, such as Barnacle Bill, Yogi and Scooby Doo. They resembled volcanic rocks on Earth.",
      ],
    },
    {
      id: "science",
      title: "What they found",
      paras: [
        "The landing site, Ares Vallis, is an ancient flood plain thought to have been cut by a volume of water like North America's Great Lakes in about two weeks. Rounded pebbles and cobbles suggested conglomerates formed in running water during a warmer past. The findings suggested Mars was once warm and wet.",
        "Radio tracking supplied constraints on Mars' rotation and an early model of its core. NASA's mission summary reports a suggested core-radius range of about 1,300–2,000 km from that investigation; this is not asserted as today's best estimate. The lander observed magnetic dust, dust-devil signatures and morning temperature changes. NASA History reports 8.5 million weather measurements.",
      ],
    },
    {
      id: "end",
      title: "The last transmission",
      paras: [
        "The lander was expected to work for a month and the rover for a week. NASA History reports 83 days of rover operation, not 83 sols. The contemporary JPL report identifies the last successful data cycle on 27 September 1997, followed by auxiliary carrier detections on 1 and 6 October without recovered health data.",
        "Battery depletion and deeper thermal cycling were probable explanations, not a uniquely proven loss cause. Sojourner's condition and movements after the link failed remain unknown. Predictions of circling must not be presented as observed final drives. Later NASA Science reports 2.3 billion bits; the contemporary ending report gives 2.6 billion. Those source-specific totals are retained separately.",
        "The lander was renamed the Carl Sagan Memorial Station.",
      ],
    },
  ],
  timeline: [
    { date: "4 December 1996", text: "Launch on a Delta II from Launch Complex 17B." },
    { date: "4 July 1997", text: "Airbag landing in Ares Vallis." },
    { date: "5–6 July 1997", text: "Sojourner rolls onto the surface." },
    { date: "27 September 1997", text: "Last successful data transmission." },
  ],
  facts: [
    { label: "Mission management", value: "NASA Jet Propulsion Laboratory; Discovery mission" },
    { label: "Lander COSPAR ID", value: "1996-068A. No independently verified rover COSPAR or SATCAT is assigned here" },
    { label: "Launch", value: "4 December 1996; NSSDCA time 06:58:00 UT; Delta II 7925 from LC-17B" },
    { label: "Touchdown", value: "4 July 1997; NSSDCA reports 16:56:55 UT" },
    { label: "Landing site", value: "Ares Vallis: 19.33° N, 33.55° W. 326.45° E is the conversion 360 − 33.55; the cited passage does not specify a frame" },
    { label: "Rover", value: "10.6 kg (NASA Science); about 30 cm high; six wheels" },
    { label: "Power distinction", value: "Lander battery recharging/conservation and non-rechargeable rover batteries are different systems" },
    { label: "Rover distance", value: "NASA History: 330 feet, approximately 100 metres; reported operating life 83 days, not 83 sols" },
    { label: "Returned data", value: "16,500+ lander images, 550 rover images, 8.5 million weather records" },
    { label: "Last successful data", value: "27 September 1997; JPL reports 3:23 a.m. PDT and calls the cycle Sol 83" },
    { label: "Later radio detections", value: "1 and 6 October 1997: carrier only, not recovered lander health data" },
    { label: "Memorial station", value: "Carl Sagan Memorial Station (named post-landing)" },
  ],
  sources: [
    ...Object.values(S).map(source => ({ label: source.title, url: source.url })),
  ],
};
