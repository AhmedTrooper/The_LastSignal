import type { WikiEntry } from "./types";

export const SURVEYOR_1: WikiEntry = {
  lead: "Surveyor 1 was the first American spacecraft to soft-land on the Moon. It touched down in the Ocean of Storms on 2 June 1966, on NASA's first attempt, and showed that a spacecraft could land safely on the lunar surface and send back useful science, three years before Apollo 11.",
  sections: [
    {
      id: "why",
      title: "Why it was built",
      paras: [
        "Before people could land on the Moon, scientists needed to know what the surface was like up close. The Surveyor landers, managed by NASA's Jet Propulsion Laboratory, were the robotic precursors of Apollo: they gave a ground-level view of possible landing sites, while the Lunar Orbiters mapped them from above.",
        "In January 1961 NASA selected Hughes Aircraft Company to build seven soft-landing vehicles, under JPL's technical direction, to \"land gently on the Moon, perform chemical analyses of the lunar surface and subsurface and relay back to Earth television pictures of lunar features.\"",
      ],
    },
    {
      id: "spacecraft",
      title: "The spacecraft",
      paras: [
        "Surveyor stood about 3 m tall on a thin-walled aluminium triangle weighing 27 kg, with a leg at each corner. A large solid-propellant retro-rocket in the centre made up more than 60% of its mass. A Doppler velocity-sensing system fed the spacecraft computer for a controlled descent, and each landing pad carried aircraft-type shock absorbers and strain gauges to record the landing, data that mattered for Apollo.",
        "Its television camera could see detail down to one millimetre at a distance of four metres, and a filter wheel with red, green and blue filters let engineers build colour images.",
      ],
    },
    {
      id: "landing",
      title: "First try",
      paras: [
        "Surveyor 1 launched on an Atlas-Centaur from Cape Kennedy on 30 May 1966. After a 63.6-hour coast it landed in the Ocean of Storms at 06:17:36 UT on 2 June, inside the crater Flamsteed P, bouncing once before settling, about 9 miles (14 km) from its target. Having used its descent fuel and dropped its retro-rocket, it weighed 294.3 kg.",
        "Thirty-six minutes after landing it sent its first picture, showing part of the spacecraft, one landing pad and the dark lunar soil.",
      ],
    },
    {
      id: "nights",
      title: "Surviving the night",
      paras: [
        "It returned 10,622 images, including the first colour photo, before the first lunar nightfall on 14 June. With only a solar panel and batteries, no one knew if it would survive the 14-Earth-day night, and contact attempts on 28 June failed. On 6 July it answered, and sent another 618 images in its second lunar day: 11,240 in all.",
        "After its second sunset on 13 July the battery voltage dropped sharply. Controllers kept intermittent contact until 7 January 1967.",
      ],
    },
    {
      id: "legacy",
      title: "Legacy",
      paras: [
        "Besides pictures, Surveyor 1 sent information on the bearing strength of the lunar soil, its radar reflectivity and temperature. Over the next two years NASA launched six more Surveyors, four of which landed. In 2009 the Lunar Reconnaissance Orbiter photographed Surveyor 1 and its shadow, still standing in Flamsteed P.",
      ],
    },
  ],
  timeline: [
    { date: "January 1961", text: "NASA selects Hughes Aircraft to build seven Surveyor landers." },
    { date: "30 May 1966", text: "Launch on an Atlas-Centaur from Cape Kennedy." },
    { date: "2 June 1966", text: "Soft landing in the Ocean of Storms, 63.6 hours after launch." },
    { date: "14 June 1966", text: "First lunar nightfall, after 10,622 images." },
    { date: "6 July 1966", text: "Answers again after the night; 618 more images follow." },
    { date: "14 July 1966", text: "Primary mission complete." },
    { date: "7 January 1967", text: "Final contact." },
    { date: "2009", text: "The Lunar Reconnaissance Orbiter photographs it from orbit." },
  ],
  facts: [
    { label: "Built by", value: "Hughes Aircraft Company, under JPL technical direction" },
    { label: "COSPAR / NORAD", value: "1966-045A / SATCAT 02185" },
    { label: "Launch", value: "30 May 1966 at 14:41:01 UTC, Atlas-Centaur (AC-10, LC-36A)" },
    { label: "Touchdown", value: "2 June 1966 at 06:17:36 UT (63.6 h transit)" },
    { label: "Landing site", value: "Flamsteed P crater, Oceanus Procellarum (2.4745° S, 43.3399° W, elev. -2,060 m)" },
    { label: "Launch mass", value: "995.2 kg" },
    { label: "Landed mass", value: "294.3 kg (dry spacecraft after retro jettison)" },
    { label: "Dimensions", value: "3.0 m tall, 4.2 m landing tripod footprint" },
    { label: "Touchdown velocity", value: "3.0 m/s (10 ft/s)" },
    { label: "Television images", value: "11,240 frames returned across 2 lunar days" },
    { label: "Final contact", value: "7 January 1967 (operational for 7 months)" },
    { label: "Orbital recovery", value: "Photographed by LROC on LRO (M175357472R)" },
  ],
  sources: [
    { label: "NSSDCA Master Catalog: Surveyor 1", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A" },
    { label: "NASA Science: Surveyor 1", url: "https://science.nasa.gov/mission/surveyor-1/" },
    { label: "NASA History: 55 Years Ago, Surveyor 1 Makes a Soft Landing on the Moon", url: "https://www.nasa.gov/history/55-years-ago-surveyor-1-makes-a-soft-landing-on-the-moon/" },
    { label: "LROC Featured Site: Surveyor 1 Landing Site", url: "https://www.lroc.asu.edu/featured_sites/view_site/4" },
    { label: "NASA Science: Lunar Ranger and Surveyor Programs", url: "https://science.nasa.gov/mission/lunar-rangers-and-surveyors/" },
  ],
};
