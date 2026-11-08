import type { MachineBook } from "./types";
import { GRAIL_SOURCES as S } from "../grail-sources";

export const GRAIL_BOOK: MachineBook = {
  slug: "grail", name: "GRAIL", title: "Two twins that X-rayed the Moon.",
  introduction: "We were too small to land and too careful to crash by accident. Ebb and Flow flew side by side, measured how gravity tugged them apart, and showed students the Moon from inside out.",
  chapters: [
    {
      id: "a-long-way-to-the-moon", title: "A long way to the Moon", event: "Launch, a low-energy L1 cruise, lunar orbit insertion and student names", hardware: "Delta II Heavy, low-energy trajectory, Sun–Earth L1 route and lunar orbit insertion burns",
      source: S.mission.url, relatedSources: [S.registryA, S.registryB].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Launch", value: "10 September 2011 / 13:08:52 UT", note: "Delta 7920H (D356) from Cape Canaveral SLC-17B.", source: S.mission.url },
        { label: "Ebb orbit insertion", value: "31 December 2011", note: "NSSDCA and NASA Science agree on Ebb’s date.", source: S.registryA.url },
        { label: "Flow orbit insertion", value: "NSSDCA: 1 January 2012 / NASA Science: 2 January 2012", note: "The story says about a day after Ebb; the date table difference is retained in the evidence JSON.", source: S.registryB.url },
      ],
      beats: [
        { line: "We were twins, built to fly together.", detail: "I am one of GRAIL’s two identical spacecraft. We launched together on September 10, 2011, on a Delta II Heavy from Cape Canaveral. Each of us was small enough to fit through a classroom door, yet we carried clocks and radios precise enough to listen to gravity." },
        { line: "We took the slow road on purpose.", detail: "Instead of sprinting straight to the Moon, we cruised for about three and a half months on a low-energy path that went near the Sun–Earth L1 point. That gentler route helped our ultra-stable clocks settle and needed less braking fuel than a fast, steep arrival." },
        { line: "A new year began our orbit.", detail: "Ebb entered lunar orbit on December 31, 2011. I followed about a day later — NSSDCA lists January 1 for me, while NASA Science’s date table lists January 2. Either way, the twins arrived around the turn of the year and began their careful dance." },
        { line: "Schoolchildren gave us our names.", detail: "Fourth-graders at Emily Dickinson Elementary School in Bozeman, Montana, won a nationwide contest and named us Ebb and Flow. The names came from the tides, which the Moon pulls across Earth — a perfect hint for two spacecraft that would measure the Moon’s own pull." },
      ], discovery: "A slower, low-energy route can be smarter than a sprint when clocks must settle and fuel must be saved.", question: "Why would a spacecraft take months to reach a place a crewed ship reached in days?",
    },
    {
      id: "cosmic-tag", title: "Cosmic tag", event: "Tandem gravity ranging and student MoonKAM imaging", hardware: "Lunar Gravity Ranging System (Ka-band link), ultra-stable oscillators and MoonKAM cameras",
      source: S.mission.url, relatedSources: [S.registryA, S.scienceConcept].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "What LGRS measures", value: "Range-rate (meters per second)", note: "NSSDCA describes high-precision range-rate between the twins; PDS describes instantaneous relative range-rate. It is not a single distance in microns.", source: S.registryA.url },
        { label: "MoonKAM images", value: "More than 115,000 total images", note: "NASA’s impact article counts total MoonKAM images from student-selected targets.", source: S.impact.url },
      ],
      beats: [
        { line: "We flew single file over both poles.", detail: "Once in orbit, we flew one behind the other in polar paths, separated by roughly 175 to 225 kilometres. We did not point our main science instrument down at the ground like a camera. Instead, we stared at each other." },
        { line: "Gravity changed the game between us.", detail: "Our Ka-band radio link measured how fast the distance between the twins changed — called range-rate. When one of us was pulled by extra mass below, our separation speed changed for a moment, then changed again as the other twin reached the same place. Those tiny speed changes became a gravity map." },
        { line: "We could map the far side too.", detail: "Because the twins measured each other directly, they did not need to be seen from Earth at every instant to keep working. Their paired signals kept recording how lunar gravity tugged their dance, including over the far side." },
        { line: "Students helped us take pictures.", detail: "Alongside the gravity instrument, each of us carried MoonKAM cameras for middle-school students. NASA reports more than 115,000 total MoonKAM images of the lunar surface from targets proposed by students. The pictures were education payload, not the gravity measurement itself." },
      ], discovery: "Gravity can be measured by watching how it changes the motion between two spacecraft, not only by photographing the surface.", question: "If two satellites only measure each other, how can they learn where hidden mass is?",
    },
    {
      id: "lower-and-sharper", title: "Lower and sharper", event: "Primary and extended science phases at lower altitude", hardware: "Lunar orbit insertion burns, lower polar orbits and sustained tandem ranging",
      source: S.mission.url, relatedSources: [S.registryA, S.impact].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Primary science phase", value: "7 March – 29 May 2012", note: "NASA Science date table; the draft’s March 1 boundary is not used.", source: S.mission.url },
        { label: "Second science phase", value: "Began 8 August 2012", note: "NASA Science says the extended-mission second phase was initiated then; the draft’s August 30 boundary is not used.", source: S.mission.url },
      ],
      beats: [
        { line: "Our first science season lasted about three months.", detail: "NASA Science dates the primary science phase from March 7 to May 29, 2012. During that season we kept our tandem formation and accumulated the measurements that became the gravity map." },
        { line: "Then we were asked to fly closer.", detail: "For the extended mission, the team lowered our orbits. Flying nearer the Moon lets small gravity signals stand out more clearly, but it also means the Moon’s lumpy pull matters more on every loop." },
        { line: "Closer meant sharper detail.", detail: "A lower pass can reveal finer features than a higher pass, because gravity signals from small buried structures fade faster with altitude. The trade-off was more careful flying for a longer time." },
        { line: "Nine months built the map.", detail: "Across both science phases, our paired measurements produced the highest-resolution gravity map of any celestial body to date. The map was the science product — the spacecraft themselves were always the measuring tool." },
      ], discovery: "Lower orbits can sharpen gravity measurements, but only if the spacecraft can keep flying safely in the Moon’s uneven pull.", question: "Why does flying closer to a world sharpen the map of what is hidden below?",
    },
    {
      id: "the-x-ray-moon", title: "The X-ray Moon", event: "Crust thickness, porosity and buried magma dikes from GRAIL gravity", hardware: "LGRS range-rate time series, gravity-field models and topography comparison",
      source: S.gravityMap.url, relatedSources: [S.porosity, S.highlandDensity].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Gravity-field map", value: "PIA16587", note: "NASA’s image is the lunar gravity field; far side centered in Mercator view.", source: S.gravityMap.url },
        { label: "Porosity image", value: "PIA16588", note: "PIA16588 depicts highland-crust porosity, not crust thickness.", source: S.porosity.url },
        { label: "Average crust thickness", value: "34 to 43 km", note: "Used here as a GRAIL-reported range; the prior Apollo-era estimate and Giant Impact interpretation are described cautiously, not as proof.", source: S.highlandDensity.url },
      ],
      beats: [
        { line: "Our map was not a photograph.", detail: "PIA16587 shows the Moon’s gravity field as measured by GRAIL. Red and blue areas mark where gravity is stronger or weaker than average. Surface cameras cannot see those hidden differences directly." },
        { line: "The crust turned out thinner.", detail: "GRAIL results pointed to an average lunar crust of about 34 to 43 kilometres thick. That is thinner than many earlier estimates, and it helped scientists test ideas about how the Moon formed and cooled." },
        { line: "The highlands were more like a sponge.", detail: "A separate GRAIL product, PIA16588, depicts porosity in the lunar highland crust. The number matters because it says the upper crust is fractured and contains pore space, not one solid slab of rock." },
        { line: "Buried cracks held old lava.", detail: "Gravity signatures also revealed long, buried features interpreted as ancient magma dikes — cracks filled with lava long ago. They were invisible in ordinary surface pictures, which is why a gravity X-ray was needed." },
      ], discovery: "Gravity maps can reveal crust thickness, pore space and buried lava features that ordinary cameras cannot see.", question: "How can a map made from motion reveal the thickness of rock?",
    },
    {
      id: "a-place-named-for-sally", title: "A place named for Sally", event: "Final fuel-gauge burn and controlled impact at the Sally K. Ride Impact Site", hardware: "Main hydrazine thrusters, propellant depletion burn and deliberate lunar impact",
      source: S.impact.url, relatedSources: [S.targetMountain, S.flightPath, S.restingSpot, S.lrocCrater].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Fuel-gauge burn", value: "Ebb 4 min 3 s / Flow 5 min 7 s", note: "Fired about 50 minutes before impact until propellant was depleted, to measure remaining fuel.", source: S.impact.url },
        { label: "Impact speed", value: "3,760 mph (about 1.68 km/s)", note: "NASA impact article; Ebb at 22:28:51 UTC and Flow at 22:29:21 UTC.", source: S.impact.url },
        { label: "LROC craters", value: "About 5 m (15 ft) each", note: "LROC caption reports about 5 m craters with dark, irregular ejecta.", source: S.lrocCrater.url },
      ],
      beats: [
        { line: "Our tanks were almost empty.", detail: "By mid-December 2012, low fuel and a low orbit meant we could not continue science safely. The team chose a controlled ending far from historic landing sites: the southern face of a mountain near Goldschmidt Crater at the lunar north pole." },
        { line: "We spent the last fuel on purpose.", detail: "About fifty minutes before impact, we fired our main engines until the propellant ran out. Ebb burned for 4 minutes 3 seconds and Flow for 5 minutes 7 seconds. That final burn measured how much fuel truly remained, helping engineers validate fuel models for future missions." },
        { line: "Then we fell together.", detail: "On December 17, 2012, Ebb struck at 22:28:51 UTC and Flow followed 30 seconds later at 22:29:21 UTC, both at about 1.68 kilometres per second. NASA named the mountain the Sally K. Ride Impact Site for astronaut Dr. Sally Ride, who led the MoonKAM education work." },
        { line: "Later, another orbiter found our marks.", detail: "When LRO imaged the site later, it found two fresh craters about 5 metres across with dark, irregular ejecta. The spacecraft were gone, but their measured gravity map — and the students’ MoonKAM pictures — remained." },
      ], discovery: "A controlled ending can still return engineering data, and later orbiters can verify the new craters after the mission ends.", question: "Why burn the last fuel before impact instead of saving it?",
    },
  ],
};
