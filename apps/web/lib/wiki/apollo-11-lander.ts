import type { WikiEntry } from "./types";

export const APOLLO_11_LANDER: WikiEntry = {
  lead: "Eagle was the Apollo 11 Lunar Module, built by Grumman, that carried Neil Armstrong and Buzz Aldrin to the first crewed landing on the Moon on 20 July 1969. Its descent stage, with a commemorative plaque on one leg, served as the launch pad for their return and still stands at Tranquility Base.",
  sections: [
    {
      id: "why",
      title: "Why it was built",
      paras: [
        "Apollo 11's primary objective was to complete the national goal President John F. Kennedy set on 25 May 1961: land people on the Moon and return them to Earth. The Lunar Module was the part of the spacecraft built to make the landing; the command module Columbia stayed in lunar orbit with Michael Collins.",
      ],
    },
    {
      id: "spacecraft",
      title: "Two stages",
      paras: [
        "The Lunar Module had a descent stage, with the landing engine, legs and footpads, and an ascent stage, the crew cabin with its own engine. Long rods under the footpads were surface-sensing probes: on contact they signalled the crew to shut down the descent engine.",
      ],
    },
    {
      id: "landing",
      title: "The landing",
      paras: [
        "Apollo 11 launched from Cape Kennedy at 9:32 a.m. EDT on 16 July 1969. On 20 July, Eagle undocked from Columbia and began its powered descent, the engine firing for 756.3 seconds. Near the bottom, Armstrong took partial manual control and steered past an area littered with boulders.",
        "Eagle landed in the Sea of Tranquility at 4:17 p.m. EDT, at 0°41′15″ N, 23°26′ E, about four miles downrange of the planned point and almost a minute and a half early. NASA's account says only 30 seconds of fuel remained. Armstrong radioed: \"Houston, Tranquility Base here. The Eagle has landed.\"",
      ],
    },
    {
      id: "surface",
      title: "21 hours at Tranquility Base",
      paras: [
        "Armstrong stepped onto the Moon at about 109 hours 42 minutes into the mission, and Aldrin followed about 20 minutes later. In a moonwalk of more than two and a half hours they ranged up to 300 feet from Eagle, set up a seismic experiment, a laser reflector and a solar wind experiment, and gathered samples. Aldrin described the view as \"magnificent desolation.\"",
        "They spent 21 hours 36 minutes on the surface in all.",
      ],
    },
    {
      id: "left-behind",
      title: "Left behind",
      paras: [
        "After a rest that included seven hours of sleep, the ascent stage engine fired at 124 hours 22 minutes and burned for 435 seconds, lifting Armstrong and Aldrin off the descent stage and into lunar orbit to dock with Columbia. The ascent stage was later jettisoned and left in lunar orbit.",
        "The descent stage stayed where it landed, with the commemorative plaque signed by President Richard M. Nixon and the three astronauts attached to it. NASA's Lunar Reconnaissance Orbiter has since photographed it at the landing site.",
      ],
    },
  ],
  timeline: [
    { date: "25 May 1961", text: "President Kennedy sets the goal of a crewed lunar landing." },
    { date: "16 July 1969", text: "Apollo 11 launches on a Saturn V, 9:32 a.m. EDT." },
    { date: "19 July 1969", text: "Lunar orbit insertion." },
    { date: "20 July 1969", text: "Eagle lands at 4:17 p.m. EDT; Armstrong and Aldrin walk on the Moon." },
    { date: "21 July 1969", text: "The ascent stage lifts off, leaving the descent stage at Tranquility Base." },
    { date: "24 July 1969", text: "Splashdown in the Pacific Ocean." },
    { date: "2009", text: "The Lunar Reconnaissance Orbiter photographs the landing site." },
  ],
  facts: [
    { label: "Vehicle", value: "Grumman LM-5 (Eagle)" },
    { label: "COSPAR / NORAD", value: "1969-059C / SATCAT 04041" },
    { label: "Crew landed", value: "Neil A. Armstrong, Edwin E. 'Buzz' Aldrin Jr." },
    { label: "Command Module Pilot", value: "Michael Collins (Columbia, 1969-059A)" },
    { label: "Launch", value: "16 July 1969 at 13:32:00 UTC (Saturn V, LC-39A)" },
    { label: "Touchdown", value: "20 July 1969 at 20:17:39.9 UTC (102:45:39.9 GET)" },
    { label: "Landing site", value: "Tranquility Base, 0.67416° N, 23.47314° E (elevation -1,900 m)" },
    { label: "Descent Stage Mass", value: "2,033 kg dry / 8,248 kg propellant" },
    { label: "Ascent Stage Mass", value: "2,180 kg dry / 2,376 kg propellant" },
    { label: "Time on surface", value: "21 h 36 m 21 s (EVA duration 2 h 31 m 40 s)" },
    { label: "Left on the Moon", value: "Descent Stage, LRRR, PSEP, TV camera, 100+ discarded tools & plaques" },
    { label: "Active Experiment", value: "LRRR (1969-059C-02) laser array still active in 2026" },
  ],
  sources: [
    { label: "NASA NSSDCA Master Spacecraft Record (1969-059C)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C" },
    { label: "NASA NSSDCA Laser Ranging Retroreflector (1969-059C-02)", url: "https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=1969-059C-02" },
    { label: "Apollo Lunar Surface Journal (ALSJ) Master Index", url: "https://www.nasa.gov/history/alsj/a11/a11.html" },
    { label: "LPI Apollo 11 Mission Hub & 70mm Magazine Catalog", url: "https://www.lpi.usra.edu/lunar/missions/apollo/apollo_11/" },
    { label: "LROC High-Resolution Overhead Imagery (M175124932R)", url: "https://www.lroc.asu.edu/images/482" },
    { label: "NASA Official Apollo 11 Mission Report (MSC-00171 / NASA SP-238)", url: "https://www.nasa.gov/history/alsj/a11/A11_MissionReport.pdf" },
    { label: "NASA Catalogue of Manmade Material on the Moon", url: "https://www.nasa.gov/wp-content/uploads/2015/01/718438main_final_catalogue_of_manmade_material_on_the_moon.pdf" },
  ],
};
