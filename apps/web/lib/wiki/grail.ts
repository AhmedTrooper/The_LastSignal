import type { WikiEntry } from "./types";

export const GRAIL: WikiEntry = {
  lead: "GRAIL flew two identical spacecraft, Ebb and Flow, in tandem around the Moon to map its gravity. They made the highest-resolution gravity map of any world at the time, and on 17 December 2012 they were flown into a mountain near the Moon's north pole, at a site named for Sally K. Ride.",
  sections: [
    {
      id: "why",
      title: "Why it was built",
      paras: [
        "GRAIL, the Gravity Recovery and Interior Laboratory, set out to map the Moon's gravity field in detail to work out its internal structure. It was the 11th mission in NASA's Discovery Program, managed by JPL and built by Lockheed Martin.",
        "The method copied NASA's GRACE mission at Earth. As the twins flew over areas of stronger gravity they drifted slightly toward and away from each other, and an instrument measured the tiny changes in their relative speed.",
      ],
    },
    {
      id: "flight",
      title: "Ebb and Flow",
      paras: [
        "The twins, 202.4 kg each, launched together on a Delta II from Cape Canaveral on 10 September 2011 and took a slow, low-energy route past the Sun-Earth L1 point. Ebb reached lunar orbit on 31 December 2011 and Flow about 25 hours later (NASA's mission page lists 2 January 2012). Fourth-graders at Emily Dickinson Elementary School in Bozeman, Montana, won the contest to name them.",
        "Each also carried MoonKAM cameras that let middle-school students choose images to take, an outreach project led by Sally Ride Science, founded by America's first woman in space.",
      ],
    },
    {
      id: "science",
      title: "Mascons",
      paras: [
        "The primary science phase ran from 7 March to 29 May 2012, and an extended mission began on 8 August. Over nine months the twins mapped the Moon's interior in unprecedented detail and pinpointed mass concentrations, or mascons: dense regions with a strong pull, hidden under the surface. GRAIL data confirmed that mascons formed when large asteroids or comets struck the ancient Moon while its interior was much hotter.",
      ],
    },
    {
      id: "end",
      title: "The Sally K. Ride Impact Site",
      paras: [
        "At the end of the mission the twins were decommissioned and deliberately flown into the Moon on 17 December 2012, hitting at 75.62° N, 26.63° W at about 1.68 km per second. NASA named the spot the Sally K. Ride Impact Site, on the southern face of a mountain about 2.5 km tall near the crater Goldschmidt.",
      ],
    },
  ],
  timeline: [
    { date: "10 September 2011", text: "Launch on a Delta II." },
    { date: "31 December 2011", text: "Ebb enters lunar orbit." },
    { date: "January 2012", text: "Flow enters lunar orbit, about 25 hours after Ebb." },
    { date: "7 March – 29 May 2012", text: "Primary gravity mapping." },
    { date: "8 August 2012", text: "Extended mission begins." },
    { date: "17 December 2012", text: "Both spacecraft impact a mountain near the north pole." },
  ],
  facts: [
    { label: "Built by", value: "Lockheed Martin Space / NASA JPL / MIT (Discovery Program #11)" },
    { label: "COSPAR / NORAD", value: "GRAIL-A (Ebb): 2011-046A (37801) · GRAIL-B (Flow): 2011-046B (37802)" },
    { label: "Launch", value: "10 September 2011 at 13:08:52 UTC, Delta II 7920H (SLC-17B)" },
    { label: "Lunar orbit insertion", value: "Ebb: 31 December 2011 · Flow: 1 January 2012" },
    { label: "Mass breakdown", value: "202.4 kg dry / 307 kg fueled each (total 614 kg stack)" },
    { label: "Payload", value: "Lunar Gravity Ranging System (LGRS, micron-precision Ka-band link) & MoonKAM education camera suite" },
    { label: "Ebb impact", value: "17 December 2012 at 22:28:51 UTC (velocity: 1.68 km/s / 3,760 mph)" },
    { label: "Flow impact", value: "17 December 2012 at 22:29:21 UTC (30 seconds after Ebb)" },
    { label: "Impact site", value: "Sally K. Ride Impact Site, 75.62° N, 26.63° W (333.37° E, 2.5 km tall massif between Philolaus & Mouchez)" },
    { label: "Key science", value: "First global high-resolution gravity map of a planetary body; revealed thin crust (34–43 km) and dense subterranean mascons" },
  ],
  sources: [
    { label: "NSSDCA Master Catalog: GRAIL-A (Ebb)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-046A" },
    { label: "NSSDCA Master Catalog: GRAIL-B (Flow)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-046B" },
    { label: "NASA Science: GRAIL", url: "https://science.nasa.gov/mission/grail/" },
    { label: "NASA Science: GRAIL Lunar Impact Site Named for Astronaut Sally Ride", url: "https://science.nasa.gov/solar-system/moon/grail-lunar-impact-site-named-for-astronaut-sally-ride/" },
    { label: "LROC: Impact Craters of GRAIL Ebb and Flow (M1115786064R)", url: "https://www.lroc.asu.edu/posts/587" },
    { label: "NASA Science: GRAIL's Final Resting Spot", url: "https://science.nasa.gov/photojournal/grails-final-resting-spot/" },
  ],
};
