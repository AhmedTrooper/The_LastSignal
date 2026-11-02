import type { WikiEntry } from "./types";

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
        "It hit the ground at 31 mph and bounced like a giant beach ball, about 15 times and as high as 15 m, coming to rest about 1 km from where it first struck. It was the first time a U.S. spacecraft had landed this way. After 87 minutes the airbags deflated and the lander opened like the petals of a flower.",
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
        "Radio tracking put the radius of Mars' metallic core between about 1,300 and 2,000 km. The lander saw magnetic dust, dust devils, and abrupt morning temperature swings, and made 8.5 million weather measurements.",
      ],
    },
    {
      id: "end",
      title: "The last transmission",
      paras: [
        "The lander was expected to work for a month and the rover for a week. The lander lasted nearly three times longer and Sojourner 83 days, 12 times its design life. The last successful data transmission came at 6:23 a.m. EDT on 27 September 1997, and contact was then lost for unknown reasons. In all they returned 2.3 billion bits of information, more than 16,500 images from the lander and 550 from the rover.",
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
    { label: "Built by", value: "NASA Jet Propulsion Laboratory (Discovery Program #2)" },
    { label: "COSPAR / NORAD", value: "1996-068A (Lander) / 1996-068B (Sojourner) / SATCAT 24680" },
    { label: "Launch", value: "4 December 1996 at 06:58:07 UTC, Delta II 7925 (SLC-17B)" },
    { label: "Touchdown", value: "4 July 1997 at 16:56:55 UTC (ERT 17:07:25 UTC)" },
    { label: "Landing site", value: "Ares Vallis (19.33° N, 33.55° W / 326.45° E, elev. -3,680 m)" },
    { label: "Lander mass", value: "360 kg landed dry / 570 kg deployed lander / 890 kg entry mass" },
    { label: "Rover specifications", value: "10.6 kg mass · 65 cm L × 48 cm W × 30 cm H (6-wheel rocker-bogie)" },
    { label: "Rover power & CPU", value: "0.22 m² solar array (16 W peak) + 150 Wh non-rechargeable LiSO2 battery · 80C85 CPU" },
    { label: "Rover distance", value: "100 meters (328 ft) total traverse across 83 sols" },
    { label: "Returned data", value: "16,500+ lander images, 550 rover images, 8.5 million weather records" },
    { label: "Last transmission", value: "27 September 1997 at 10:23 UTC (Sol 83)" },
    { label: "Memorial station", value: "Carl Sagan Memorial Station (named post-landing)" },
  ],
  sources: [
    { label: "NSSDCA Master Catalog: Mars Pathfinder", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A" },
    { label: "NSSDCA Master Catalog: Sojourner Rover (MESUR Pathfinder)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068B" },
    { label: "NASA Science: Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/" },
    { label: "NASA History: 25 Years Ago, Mars Pathfinder Launches", url: "https://www.nasa.gov/history/25-years-ago-mars-pathfinder-launches-to-mars-to-deploy-sojourner-the-first-planetary-rover-2/" },
    { label: "NASA: July 4, 1997, Sojourner Arrives on the Red Planet", url: "https://www.nasa.gov/image-article/july-4-1997-sojourner-arrives-red-planet/" },
  ],
};
