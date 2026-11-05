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
        "Eagle landed in the Sea of Tranquility at 4:17 p.m. EDT, at 0°41′15″ N, 23°26′ E, about four miles downrange of the planned point and almost a minute and a half early. Post-flight analysis in the Apollo 11 Mission Report put usable propellant at about 45 seconds. Armstrong radioed: \"Houston, Tranquility Base here. The Eagle has landed.\"",
      ],
    },
    {
      id: "surface",
      title: "21 hours at Tranquility Base",
      paras: [
        "Armstrong’s first step is referenced at 109:24:15 GET in the Apollo Lunar Surface Journal. A lanyard lowered the MESA equipment bay, giving the television camera a view of the ladder. During the moonwalk the crew deployed a seismic package, a laser reflector and a solar-wind collector, and gathered samples.",
        "They spent 21 hours 36 minutes on the surface in all.",
      ],
    },
    {
      id: "left-behind",
      title: "Left behind",
      paras: [
        "After the surface work and a rest period, the ascent stage lifted off at about 124:22:00 GET, carrying Armstrong and Aldrin back toward Columbia. The descent stage served as its launch platform. The ascent stage was later jettisoned in lunar orbit; its eventual fate is not directly observed here.",
        "The descent stage stayed where it landed, with the commemorative plaque signed by President Richard M. Nixon and the three astronauts attached to it. NASA's Lunar Reconnaissance Orbiter has since photographed it at the landing site.",
      ],
    },
    {
      id: "computer-and-breaker",
      title: "Software, a circuit breaker, and human judgment",
      paras: [
        "During descent, executive-overflow alarms interrupted the crew. The guidance software preserved essential tasks while Mission Control assessed the recovery and called GO. ALSJ’s corrected transcript and the Mission Report’s event table do not use identical timestamps for every alarm; the interactive story identifies the transcript call it uses.",
        "Before ascent, Aldrin used a felt-tip pen to push a damaged engine-arm circuit breaker in. ALSJ places that breaker on his Panel 16. Houston’s confirmation that the circuitry looked fine is at 123:20:43 GET, rather than an exact timestamp for inserting the pen.",
      ],
    },
    {
      id: "scientific-legacy",
      title: "What the equipment made possible",
      paras: [
        "Apollo 11’s laser reflector contains 100 corner cubes and needs no power. Long-term measurements from the lunar arrays have measured the Moon’s recession at about 3.8 centimetres per year and provided evidence of a fluid lunar core. This is an ongoing measurement technique, not a radio signal from Eagle.",
        "The seismic experiment detected ground motion, including the crew’s footsteps during deployment. A thin aluminium foil collector was exposed to the solar wind for 77 minutes; the foil returned to Earth for analysis while its supporting staff remained on the Moon.",
      ],
    },
  ],
  timeline: [
    { date: "25 May 1961", text: "President Kennedy sets the goal of a crewed lunar landing." },
    { date: "16 July 1969", text: "Apollo 11 launches on a Saturn V, 9:32 a.m. EDT." },
    { date: "19 July 1969", text: "Lunar orbit insertion." },
    { date: "20 July 1969", text: "Eagle lands in the Sea of Tranquility." },
    { date: "21 July 1969 · UTC", text: "Armstrong and Aldrin explore the surface and deploy experiments." },
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
    { label: "Passive experiment", value: "LRRR · 100 corner cubes · no power required" },
    { label: "First-step reference", value: "21 July 1969, 02:56:15 UTC · 109:24:15 GET" },
    { label: "Engine-arm breaker", value: "Panel 16 · felt-tip pen used to push the breaker in" },
  ],
  sources: [
    { label: "NASA NSSDCA Master Spacecraft Record (1969-059C)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C" },
    { label: "NASA NSSDCA Laser Ranging Retroreflector (1969-059C-04)", url: "https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=1969-059C-04" },
    { label: "Apollo Lunar Surface Journal (ALSJ) Master Index", url: "https://apollojournals.org/alsj/a11/a11.html" },
    { label: "ALSJ: First steps and the solar-wind collector", url: "https://apollojournals.org/alsj/a11/a11.step.html" },
    { label: "ALSJ: The engine-arm breaker and ascent", url: "https://apollojournals.org/alsj/a11/a11.launch.html#1232043" },
    { label: "NASA / JPL: The Apollo Experiment That Keeps on Giving", url: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/" },
    { label: "NASA / LROC: Apollo 11, Second Look", url: "https://science.nasa.gov/photojournal/apollo-11-second-look/" },
    { label: "LPI Apollo 11 Mission Hub & 70mm Magazine Catalog", url: "https://www.lpi.usra.edu/lunar/missions/apollo/apollo_11/" },
    { label: "LROC High-Resolution Overhead Imagery (M175124932R)", url: "https://www.lroc.asu.edu/images/482" },
    { label: "NASA Official Apollo 11 Mission Report (MSC-00171 / NASA SP-238)", url: "https://www.nasa.gov/history/alsj/a11/A11_MissionReport.pdf" },
    { label: "NASA Catalogue of Manmade Material on the Moon", url: "https://www.nasa.gov/wp-content/uploads/2015/01/718438main_final_catalogue_of_manmade_material_on_the_moon.pdf" },
  ],
};
