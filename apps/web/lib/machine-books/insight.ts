import type { MachineBook } from "./types";
import { INSIGHT_SOURCES as S } from "../insight-sources";

export const INSIGHT_BOOK: MachineBook = {
  slug: "insight", name: "InSight", title: "The lander that listened",
  introduction: "I stayed in one place while my instruments explored beneath Mars. Follow the listening, the stubborn soil, and the people who kept trying.",
  chapters: [
    {
      id: "a-place-to-listen", title: "A place to listen", event: "From an Earth cleanroom to Elysium Planitia", hardware: "Stationary lander, two circular solar arrays, robotic arm and the separate MarCO CubeSats",
      source: S.mission.url, relatedSources: [{ label: S.registry.title, url: S.registry.url }, { label: S.spacecraft.title, url: S.spacecraft.url }],
      telemetry: [{ label: "Launch", value: "5 May 2018", note: "NASA mission chronology; Atlas V-401 from Vandenberg Air Force Base.", source: S.mission.url }, { label: "Landing", value: "26 November 2018", note: "Elysium Planitia. This story does not assign unverified component coordinates.", source: S.mission.url }, { label: "Open solar-array span", value: "6 meters", note: "Wingspan, not deck diameter; NASA spacecraft specifications.", source: S.spacecraft.url }],
      beats: [
        { line: "Before I listened to Mars, people tested my wings on Earth.", detail: "NASA’s cleanroom photograph shows my solar arrays open during a test on April 30, 2015. Lockheed Martin built me on the proven design of the Phoenix lander." },
        { line: "Two tiny spacecraft shared my launch, not my landing.", detail: "I launched on May 5, 2018. The MarCO CubeSats traveled on their own paths behind me; they were a separate technology demonstration, not passengers on my deck." },
        { line: "On November 26, I found my place on Mars.", detail: "I landed on the plain called Elysium Planitia. My job was to stay in one place and investigate the planet’s interior, rather than drive from rock to rock." },
        { line: "My round solar wings powered a laboratory that would not roam.", detail: "With both arrays open, I spanned six meters. My arm would move instruments from the deck to the ground so scientists could study what lay below me." },
      ], discovery: "A mission does not need wheels to explore: instruments can investigate beneath a stationary lander.", question: "What could a lander learn without driving anywhere?",
    },
    {
      id: "an-ear-on-the-ground", title: "An ear on the ground", event: "Wind vibrations, careful deployment and the first likely marsquake", hardware: "SEIS seismometer, five-finger grapple, tether, wind and thermal shield, and air-pressure sensor",
      source: S.deployment.url, relatedSources: [{ label: S.wind.title, url: S.wind.url }, { label: S.firstQuake.title, url: S.firstQuake.url }, { label: S.spacecraft.title, url: S.spacecraft.url }],
      telemetry: [{ label: "SEIS deployment", value: "19 December 2018", note: "Placed on the ground in front of the lander; NASA reports 1.636 meters away, without the draft’s invented map pins.", source: S.deployment.url }, { label: "First likely marsquake", value: "6 April 2019 / Sol 128", note: "Preserves the source’s word ‘likely’. This is an observation date, not the release date of the audio visualization.", source: S.firstQuake.url }],
      beats: [
        { line: "At first, my listening instrument felt the wind shaking my wings.", detail: "On December 1, 2018, SEIS was still on my deck. It recorded solar-panel vibrations while a pressure sensor measured changes in the air. Those measurements became the first released sounds of Martian wind." },
        { line: "My arm had to put that delicate ear on the ground.", detail: "On December 19, my grapple gently placed SEIS in front of me. Its five mechanical fingers grasped a handle; engineers tested the deployment commands on Earth before sending them." },
        { line: "To notice a tiny signal, we had to understand the noise.", detail: "A domed shield protected SEIS from wind and temperature changes. Scientists still compared the ground-motion records with weather and spacecraft activity; not every wiggle was a quake." },
        { line: "Then came a small trembling from inside the planet.", detail: "On April 6, 2019, the team recorded its first likely marsquake. Scientists studied how seismic waves moved through Mars to investigate layers they could not see from the surface." },
      ], discovery: "A seismometer measures motion, not feelings. Careful placement and noise checks turn a faint signal into evidence.", question: "Why might a wind gust look important on a seismometer?",
    },
    {
      id: "the-stubborn-soil", title: "The stubborn soil", event: "The heat probe’s struggle and the decision to stop digging", hardware: "HP³ self-hammering mole, temperature-sensor tether and robotic scoop",
      source: S.mole.url, relatedSources: [{ label: S.spacecraft.title, url: S.spacecraft.url }, { label: S.retirement.title, url: S.retirement.url }],
      telemetry: [{ label: "Probe length", value: "40 centimeters", note: "Length of the mole itself, not its achieved digging depth.", source: S.mole.url }, { label: "Required depth", value: "At least 3 meters", note: "Needed for the intended deep heat-flow measurement, which was not achieved.", source: S.mole.url }, { label: "Final attempt", value: "9 January 2021 / Sol 754", note: "500 additional hammer strokes made no progress; the top was about 2–3 centimeters below the surface.", source: S.mole.url }],
      beats: [
        { line: "One of my tools needed to go much deeper than my arm could reach.", detail: "The German-built HP³ mole was a self-hammering probe. Sensors in its tether were meant to measure heat flowing from inside Mars once it had dug at least three meters down." },
        { line: "The soil did not behave like the sand we expected.", detail: "Instead of collapsing around the probe, the soil clumped. That deprived the mole of the friction it needed to keep its hammering from making it bounce back." },
        { line: "People far away tried new jobs for my small scoop.", detail: "Engineers at JPL and DLR used my arm to help the mole and pack soil around it. Eventually its top was just below the surface—but being buried was not the same as reaching its science target." },
        { line: "We stopped the digging without pretending it had worked.", detail: "On January 9, 2021, another 500 strokes made no progress. The deep heat-flow measurement was not achieved. The effort still taught scientists about local soil and engineers about digging on another world." },
      ], discovery: "An honest result includes what did not work. Soil behavior is part of an instrument’s engineering, not just its surroundings.", question: "Why did a working hammer still need help from the soil?",
    },
    {
      id: "sand-in-the-wind", title: "Sand in the wind", event: "A careful dust-removal experiment during the extended mission", hardware: "Robotic scoop, solar cells and wind measurements",
      source: S.cleaning.url,
      telemetry: [{ label: "Cleaning trial", value: "22 May 2021 / Sol 884", note: "Sand was trickled near the panel around midday Mars time, not scraped across its cells.", source: S.cleaning.url }, { label: "Energy gain", value: "About 30 watt-hours per sol", note: "A reported additional daily energy yield, not an instantaneous power reading or a promise of a year’s survival.", source: S.cleaning.url }],
      beats: [
        { line: "Dust on my solar panels left less sunlight for my work.", detail: "As Mars approached the farthest part of its orbit from the Sun, the team planned to conserve energy. Less sunlight and dusty panels meant fewer resources for instruments and other equipment." },
        { line: "The surprising idea was to use sand—not a brush.", detail: "On May 22, 2021, my scoop trickled sand near a panel, rather than directly on top of it. Wind carried the larger grains across the surface." },
        { line: "Bouncing grains helped carry some smaller dust away.", detail: "The team explored a process called saltation: grains hop through the air and across a surface. The trial produced a gain of about 30 watt-hours of energy per Martian day." },
        { line: "A little extra energy gave the team more room to work.", detail: "NASA reported that the improvement could delay switching instruments off by a few weeks. It helped our power margin; it was not a permanent cleaning system or a guarantee of recovery." },
      ], discovery: "An unexpected material can help solve an engineering problem, but a measured improvement still has limits.", question: "Why was this different from dumping sand directly onto a solar panel?",
    },
    {
      id: "quiet-not-forgotten", title: "Quiet, not forgotten", event: "Final contact, retirement and science that continued from the records", hardware: "Dust-covered solar arrays, batteries, SEIS records and MRO’s HiRISE camera",
      source: S.retirement.url, relatedSources: [{ label: S.core.title, url: S.core.url }, { label: S.laterLook.title, url: S.laterLook.url }, { label: S.reflector.title, url: S.reflector.url }],
      telemetry: [{ label: "Last communication", value: "15 December 2022", note: "Last contact reported by NASA, not an invented final spoken message.", source: S.retirement.url }, { label: "Mission-end announcement", value: "21 December 2022", note: "After two failed contact attempts, controllers concluded the batteries had run out of energy.", source: S.retirement.url }, { label: "Marsquakes detected", value: "1,319", note: "NASA’s mission-end tally includes seismic events caused by meteoroid impacts.", source: S.retirement.url }],
      beats: [
        { line: "My last selfie showed how much dust had gathered.", detail: "On April 24, 2022, I photographed my dusty deck and wings. As energy dwindled, the seismometer became the last science instrument still powered." },
        { line: "My last contact reached Earth on December 15.", detail: "After two unsuccessful attempts to contact me, NASA announced the mission’s end on December 21, 2022. Controllers concluded that my solar-powered batteries had run out of energy." },
        { line: "My instruments went quiet. Their records did not disappear.", detail: "SEIS had detected 1,319 marsquakes. In 2023, scientists used recorded waves to refine their picture of Mars’ liquid iron core. A mission’s end does not freeze its scientific conclusions." },
        { line: "Another spacecraft looked back at the place where I stayed.", detail: "MRO photographed me on October 23, 2024. By comparing images, scientists could study changing dust around the retired lander. I no longer had to send a new signal to be part of a new investigation." },
      ], discovery: "Discarded hardware and preserved measurements can remain scientifically valuable after a mission stops communicating.", question: "How can a silent lander still help scientists ask a new question?",
    },
  ],
};
