"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/header";
import { ArrowLeft, ArrowRight } from "@/app/components/icons";
import { assetUrl } from "@/lib/heroes";

interface ChapterSpread {
  chapterNumber: number | null; // null for cover/toc/prologue/epilogue
  title: string;
  subtitle: string;
  dateAndLocation: string;
  cosparId?: string;
  heroSlug?: string;
  image?: string;
  imageCaption?: string;
  telemetrySummary?: { label: string; value: string }[];
  leftPage: {
    heading?: string;
    subheading?: string;
    paragraphs: string[];
    calloutBox?: {
      title: string;
      text: string;
      badge?: string;
    };
  };
  rightPage: {
    heading?: string;
    subheading?: string;
    paragraphs: string[];
    quote?: {
      text: string;
      author: string;
    };
    takeaway?: string;
  };
}

const SPREADS: ChapterSpread[] = [
  // SPREAD 0: COVER & TABLE OF CONTENTS
  {
    chapterNumber: null,
    title: "The Last Signal",
    subtitle: "Monuments in the Dust",
    dateAndLocation: "The Story of NASA's Discarded Equipment on the Moon and Mars",
    leftPage: {
      heading: "The Last Signal",
      subheading: "Monuments in the Dust",
      paragraphs: [
        "A living storybook dedicated to the quiet sentinels of space exploration.",
        "Since the dawn of the space age in the 1960s, humanity has dispatched robotic emissaries into the black void. They braved solar storms, freezing planetary nights, and unforgiving impact landings.",
        "They never returned to Earth. But in their silence, they stand as the most courageous monuments humanity has ever built.",
        "Written for young explorers, school-age space enthusiasts, and casual dreamers who look up at the night sky and wonder what stands in the silence.",
      ],
      calloutBox: {
        title: "2026 NASA Space Apps Challenge",
        text: "Challenge Theme: 'Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars.' All telemetry, coordinates, and historical events derive strictly from NASA NSSDCA, PDS Geosciences, and HiRISE mission archives.",
        badge: "Official Entry",
      },
    },
    rightPage: {
      heading: "Table of Contents",
      subheading: "Chronicles of 12 Pioneer Machines",
      paragraphs: [
        "1. Prologue: The Whisper Across the Void",
        "2. Ranger 7 (1964) — The Blind Diver (The Moon)",
        "3. Surveyor 1 (1966) — The Soft Step (The Moon)",
        "4. Apollo 11 'Eagle' (1969) — Tranquility Base (The Moon)",
        "5. Apollo 15 Rover (1971) — The Moon Buggy (The Moon)",
        "6. Viking 1 (1976) — The Red Frontier (Mars)",
        "7. Pathfinder & Sojourner (1997) — The Skateboard (Mars)",
        "8. Mars Polar Lander (1999) — The Polar Mystery (Mars)",
        "9. Spirit & Opportunity (2004) — The Indomitable Twins (Mars)",
        "10. Phoenix (2008) — The Arctic Digger (Mars)",
        "11. LCROSS & GRAIL (2009–2012) — The Kinetic Impactors (The Moon)",
        "12. InSight (2018–2022) — The Planetary Stethoscope (Mars)",
        "13. Ingenuity (2021–2024) — Wings Over Mars (Mars)",
        "14. Epilogue: The Guardians of Tomorrow",
      ],
      quote: {
        text: "They went where our bodies could not. They did not return. But they showed us the way.",
        author: "The Last Signal Dossier",
      },
    },
  },

  // SPREAD 1: PROLOGUE
  {
    chapterNumber: 0,
    title: "Prologue",
    subtitle: "The Whisper Across the Void",
    dateAndLocation: "The Moon & Mars · The Silent Monuments",
    leftPage: {
      heading: "The Silent Sentinel",
      subheading: "Looking Up at the Night Sky",
      paragraphs: [
        "If you could walk across the surface of the Moon tonight, there would be no wind to greet you. No rain has ever fallen there. Footprints pressed into the gray regolith half a century ago remain as sharp as the second the boot was lifted.",
        "And if you traveled another hundred million miles to Mars, you would find a different world—a rusted, terracotta wilderness swept by towering dust devils and bone-chilling nights of minus one hundred degrees.",
        "Across these two silent worlds sit solitary machines. Some have solar panels caked with terracotta dust. Some have crumpled aluminum legs that crushed deliberately into the dirt to cushion a human landing. Others have tiny titanium wheels frozen in place inside shallow sand dunes.",
      ],
      calloutBox: {
        title: "The Question of Discarded Hardware",
        text: "Space agencies often label past spacecraft as 'dormant surface hardware' or 'mission debris.' But to the school-age explorer, they are not junk—they are time capsules of human bravery, curiosity, and engineering triumph.",
        badge: "Philosophy",
      },
    },
    rightPage: {
      heading: "Why We Remember",
      subheading: "Bridging Science and Memory",
      paragraphs: [
        "Every machine left on another world completed a task once thought impossible. They tasted water ice beneath arctic soil. They listened to the tremors of deep volcanic faults. They relayed television frames seconds before vaporizing in explosive kinetic impacts.",
        "This book tells their stories in chronological order. We start in 1964 with the terrifying, blind dive of Ranger 7, and journey across sixty years to the little 4-pound helicopter that unlocked the skies of Mars.",
        "Turn the page. The engines are firing, the antennas are locked, and the journey is about to begin.",
      ],
      quote: {
        text: "Somewhere, something incredible is waiting to be known.",
        author: "Carl Sagan",
      },
      takeaway: "Key Lesson: Every active mission today stands on the shoulders of the hardware left sleeping in the dirt.",
    },
  },

  // SPREAD 2: CHAPTER 1 - RANGER 7
  {
    chapterNumber: 1,
    title: "Ranger 7",
    subtitle: "The Blind Diver",
    dateAndLocation: "July 31, 1964 · Mare Cognitum, The Moon",
    cosparId: "1964-041A",
    heroSlug: "ranger-7",
    image: "images/card-ranger-7.webp",
    imageCaption: "Ranger 7 with solar panels deployed before its terminal lunar trajectory.",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1964-041A" },
      { label: "Impact Velocity", value: "2.62 km/s (5,860 mph)" },
      { label: "Frames Transmitted", value: "4,308 television frames" },
      { label: "Final Photo Altitude", value: "480 meters (0.28 sec before impact)" },
    ],
    leftPage: {
      heading: "The Suicide Dive",
      subheading: "A Desperate Leap in 1964",
      paragraphs: [
        "In the summer of 1964, humanity had never seen the surface of the Moon up close. Prominent astronomers argued in prestigious journals that the lunar surface was a treacherous ocean of dust hundreds of feet deep—a quicksand trap that would swallow any human spacecraft whole.",
        "Six previous Ranger probes had failed. Cameras jammed, guidance systems misfired, and signals vanished into cold oblivion. The entire Apollo program hung by a thread.",
        "Ranger 7 was built with no retro-rockets and no landing gear. Its entire purpose was a suicide plunge: dive straight into the Moon at 2.62 kilometers per second and beam television frames back to Earth until the instant of total obliteration.",
      ],
      calloutBox: {
        title: "The 17-Minute Countdown",
        text: "Seventeen minutes before impact, at an altitude of 2,110 kilometers, Ranger 7's six vidicon cameras warmed up and locked onto Goldstone tracking station in California.",
        badge: "Critical Telemetry",
      },
    },
    rightPage: {
      heading: "The Sea That Became Known",
      subheading: "Frame 4308 and the Solid Ground",
      paragraphs: [
        "Frame 0001 flashed onto monitors at JPL: blurry, distant craters. Then Frame 1000: sharp ridges and boulder fields. With every passing second, the lunar surface rushed upward with terrifying speed.",
        "Frame 4308 was snapped at an altitude of just 480 meters—less than one-third of a second before impact. It showed a small crater just a few feet across, its shadows crisp and firm. Milliseconds later, the telemetry flatlined as Ranger 7 vaporized into a 14-meter crater.",
        "In that final split second, Ranger 7 delivered the most important discovery of early space exploration: the Moon was solid. Human boots would not sink into quicksand. In honor of Ranger 7's sacrifice, the plain was renamed Mare Cognitum—The Sea That Has Become Known.",
      ],
      quote: {
        text: "We have answered the question that stood between humanity and the Moon.",
        author: "NASA Jet Propulsion Laboratory, July 1964",
      },
      takeaway: "Scientific Gain: Proved lunar regolith bearing strength, paving the direct path for Apollo 11.",
    },
  },

  // SPREAD 3: CHAPTER 2 - SURVEYOR 1
  {
    chapterNumber: 2,
    title: "Surveyor 1",
    subtitle: "The Soft Step",
    dateAndLocation: "June 2, 1966 · Oceanus Procellarum, The Moon",
    cosparId: "1966-045A",
    heroSlug: "surveyor-1",
    image: "images/card-surveyor-1.webp",
    imageCaption: "Surveyor 1 resting on its three crushable honeycomb footpads in the Ocean of Storms.",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1966-045A" },
      { label: "Touchdown Speed", value: "3.6 m/s on crushable pads" },
      { label: "Sink Depth", value: "Just 5 centimeters into dust" },
      { label: "Photos Beamed", value: "11,237 facsimile photos" },
    ],
    leftPage: {
      heading: "Cushioning the Fall",
      subheading: "First Soft Touchdown on Another World",
      paragraphs: [
        "Ranger 7 proved the ground was hard. But could a delicate machine decelerate from 9,700 km/h and touch down gently without tipping over, exploding, or snapping its legs?",
        "On June 2, 1966, Surveyor 1 plummeted toward Oceanus Procellarum—the vast Ocean of Storms. Its altitude-marking radar fired its solid retrorocket, bringing the craft to a hover three meters above the dust before shutting off engines to prevent blowing debris into the sensors.",
        "Three crushable aluminum honeycomb footpads struck the gray soil at 3.6 meters per second. Strain gauges on its shock absorbers recorded a gentle rebound: the pads sank a mere 5 centimeters into the lunar regolith.",
      ],
      calloutBox: {
        title: "The -150°C Lunar Night",
        text: "During the brutal two-week lunar night, temperatures plunged past -150°C. Engineers assumed its chemical batteries would burst. Yet when dawn broke, Surveyor 1 absorbed sunlight and woke back up!",
        badge: "Thermal Resilience",
      },
    },
    rightPage: {
      heading: "Eyes of the Surveyor",
      subheading: "11,237 Photos of Moon Dust",
      paragraphs: [
        "Surveyor 1's rotating mirror camera beamed 11,237 high-resolution photos of rolling plains, crater rims, and lunar pebbles. It even photographed the faint glow of the solar corona through the lunar vacuum.",
        "When astronauts Pete Conrad and Alan Bean landed Apollo 12 three years later, they deliberately touched down within walking distance of Surveyor 3 to retrieve its camera and inspect how years of lunar exposure affected aluminum and glass.",
        "Surveyor 1 still stands in Oceanus Procellarum, its tripod legs firmly planted, its solar mast catching the light of every new Moon.",
      ],
      quote: {
        text: "Surveyor's footpads confirmed what Apollo needed to know: the Moon was ready for astronauts.",
        author: "NASA Mission Summary",
      },
      takeaway: "Scientific Gain: Measured thermal inertia, soil cohesion, and radar reflectivity for human landing.",
    },
  },

  // SPREAD 4: CHAPTER 3 - APOLLO 11 "EAGLE"
  {
    chapterNumber: 3,
    title: "Apollo 11 'Eagle'",
    subtitle: "Tranquility Base",
    dateAndLocation: "July 20, 1969 · Mare Tranquillitatis, The Moon",
    cosparId: "1969-059C",
    heroSlug: "apollo-11-lander",
    image: "images/card-apollo-11-lander.webp",
    imageCaption: "The descent stage of Lunar Module Eagle, permanent historical monument at Tranquility Base.",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1969-059C" },
      { label: "Coordinates", value: "0.67408° N, 23.47297° E" },
      { label: "Remaining Fuel", value: "Under 25 seconds of propellant" },
      { label: "Active Laser Retro", value: "Still operating with 0 Watts!" },
    ],
    leftPage: {
      heading: "The 1202 Alarm",
      subheading: "Dodging Boulders at West Crater",
      paragraphs: [
        "Everyone remembers the words: 'Houston, Tranquility Base here. The Eagle has landed.'",
        "Few remember how close Eagle came to disaster. Three minutes before touchdown, the guidance computer overloaded with radar data, flashing the infamous 1202 and 1201 program alarms.",
        "Neil Armstrong looked out his triangular window and saw the autopilot guiding them directly into a football-field-sized crater filled with Volkswagen-sized boulders. Armstrong grabbed the manual control stick, pitched the craft forward, and skimmed across the crater, searching for smooth dirt while the fuel gauge ticked down to under thirty seconds.",
      ],
      calloutBox: {
        title: "The Stainless Steel Plaque",
        text: "Bolted between the rungs of Eagle's ladder: 'HERE MEN FROM THE PLANET EARTH FIRST SET FOOT UPON THE MOON / JULY 1969, A.D. / WE CAME IN PEACE FOR ALL MANKIND.'",
        badge: "Human Heritage",
      },
    },
    rightPage: {
      heading: "The Base That Stays Behind",
      subheading: "A Laser Mirror Still Working Today",
      paragraphs: [
        "When the ascent stage blasted off to return Neil Armstrong and Buzz Aldrin to orbit, Eagle's four-legged descent stage stayed behind, serving as the launch pad.",
        "Beside the golden stage sits the Laser Ranging Retroreflector (LRRR)—a completely passive bank of 100 fused-silica corner-cube prisms provided by Bendix.",
        "Because it requires zero electricity, observatories on Earth still fire green laser pulses at Tranquility Base today. By timing the round-trip laser reflection, scientists prove that the Moon drifts 3.8 centimeters away from Earth every year.",
      ],
      quote: {
        text: "That's one small step for a man, one giant leap for mankind.",
        author: "Neil Armstrong, July 20, 1969",
      },
      takeaway: "Scientific Gain: Placed passive optical reflectors that still refine Einstein's General Relativity today.",
    },
  },

  // SPREAD 5: CHAPTER 4 - APOLLO 15 ROVER
  {
    chapterNumber: 4,
    title: "Apollo 15 LRV",
    subtitle: "The Moon Buggy",
    dateAndLocation: "July 31, 1971 · Hadley Rille, The Moon",
    cosparId: "1971-063C",
    heroSlug: "apollo-15-rover",
    image: "images/card-apollo-15-rover.webp",
    imageCaption: "Apollo 15 Lunar Roving Vehicle parked along the gorge of Hadley Rille.",
    telemetrySummary: [
      { label: "Hardware ID", value: "LRV-001 (Boeing/Delco)" },
      { label: "Earth/Moon Mass", value: "210 kg on Earth / 35 kg on Moon" },
      { label: "Tire Material", value: "Woven zinc-coated steel wire" },
      { label: "Total Distance", value: "27.76 kilometers traversed" },
    ],
    leftPage: {
      heading: "Wheels of Piano Wire",
      subheading: "Driving Across Hadley Rille",
      paragraphs: [
        "In July 1971, astronauts Dave Scott and Jim Irwin unfolded a bizarre contraption from the side of the Apollo 15 lunar module: the first automobile ever driven on another world.",
        "The Lunar Roving Vehicle had no steering wheel—it was driven with an airplane-style T-handle joystick. Its tires were not rubber, which would turn brittle in vacuum, but woven zinc-coated steel piano wire with titanium chevrons for grip.",
        "Over three days, Scott and Irwin drove 27.8 kilometers across lunar boulders at 10 km/h, venturing into the foothills of the towering Apennine Mountains and peering into the yawning canyon of Hadley Rille.",
      ],
      calloutBox: {
        title: "The Genesis Rock",
        text: "Using the mobility of the rover, Dave Scott spotted a brilliant white rock perched on a boulder: sample 15415, the 4.5-billion-year-old anorthosite 'Genesis Rock' proving the Moon once had a magma ocean.",
        badge: "Geology Milestone",
      },
    },
    rightPage: {
      heading: "The Final Cameraman",
      subheading: "Parked 90 Meters Away to Film History",
      paragraphs: [
        "When the mission ended, Dave Scott didn't just abandon the rover anywhere. He drove it exactly 90 meters away from the Lunar Module, parked it facing the spacecraft, and left the color TV camera powered on.",
        "Hours later, Ed Fendell, a camera operator sitting in Mission Control in Houston, sent radio commands timed to match the speed of light delay.",
        "As the ascent stage ignited, Fendell tilted the rover's camera upward, broadcasting the first live color footage of humans blasting off from the surface of another celestial body. The rover remains parked there, its camera pointing into eternity.",
      ],
      quote: {
        text: "There's a fundamental beauty about the Moon... but the rover let us be true field geologists.",
        author: "Dave Scott, Apollo 15 Commander",
      },
      takeaway: "Scientific Gain: Expanded human geological range by 10x, enabling deep lunar sample returns.",
    },
  },

  // SPREAD 6: CHAPTER 5 - VIKING 1
  {
    chapterNumber: 5,
    title: "Viking 1",
    subtitle: "The Red Frontier",
    dateAndLocation: "July 20, 1976 · Chryse Planitia, Mars",
    cosparId: "1976-067C",
    heroSlug: "viking-1",
    image: "images/card-viking-1.webp",
    imageCaption: "Viking 1's three-legged lander on the golden gravel plains of Chryse Planitia.",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1976-067C" },
      { label: "Operational Life", value: "2,245 Martian Sols (6+ years)" },
      { label: "Biology Lab Size", value: "3 experiments in 1 cubic foot" },
      { label: "Perchlorate Mystery", value: "Solved 32 years later by Phoenix" },
    ],
    leftPage: {
      heading: "Touchdown in Gold Plains",
      subheading: "The First Successful Mars Colony of One",
      paragraphs: [
        "On July 20, 1976—exactly seven years after Apollo 11 landed on the Moon—Viking 1 slammed into the upper atmosphere of Mars at 16,000 km/h inside a protective aeroshell.",
        "Mars had swallowed dozens of Soviet and American spacecraft before. Its atmosphere was treacherous: thick enough to burn up a descending ship, but too thin for parachutes to stop it.",
        "Viking 1 fired terminal retro-rockets, throttling hydrazine thrusters to avoid digging a pit beneath itself, and settled onto the gravelly desert of Chryse Planitia—the Plains of Gold.",
      ],
      calloutBox: {
        title: "The First Color Panorama",
        text: "Minutes after touchdown, Viking's scanner camera swept across the horizon. Line by line, humanity saw Mars for the first time: red sand, scattered basalt boulders, and an eerie salmon-pink sky.",
        badge: "First Sight",
      },
    },
    rightPage: {
      heading: "The Great Biology Debate",
      subheading: "Radioactive Nutrients and Perchlorate Salts",
      paragraphs: [
        "Inside Viking's belly sat an engineering miracle: three automated biology labs crammed into a one-cubic-foot container.",
        "When the robotic arm scooped soil and added carbon-14 radioactive nutrients in the Labeled Release experiment, the soil released a burst of radioactive gas—a classic indicator of microbial metabolism! But the GCMS instrument found zero organic molecules.",
        "The contradiction baffled scientists for 32 years, until 2008 when the Phoenix lander discovered oxidizing perchlorate salts in Martian soil that destroyed organics when heated. Viking 1 operated for 2,245 sols before a software command accidentally severed communication in 1982.",
      ],
      quote: {
        text: "Mars is not dead rock. It is a world of complex, alien surface chemistry.",
        author: "Viking Science Team",
      },
      takeaway: "Scientific Gain: First multi-year weather station on Mars, proving atmospheric pressure fluctuates by 30% seasonally.",
    },
  },

  // SPREAD 7: CHAPTER 6 - PATHFINDER & SOJOURNER
  {
    chapterNumber: 6,
    title: "Pathfinder & Sojourner",
    subtitle: "The Skateboard That Conquered Mars",
    dateAndLocation: "July 4, 1997 · Ares Vallis, Mars",
    cosparId: "1996-068A",
    heroSlug: "pathfinder-sojourner",
    image: "images/card-pathfinder-sojourner.webp",
    imageCaption: "The tiny 11.5 kg Sojourner rover rolling down the petal ramp of Pathfinder.",
    telemetrySummary: [
      { label: "Rover Mass", value: "11.5 kg (25 lbs)" },
      { label: "Landing System", value: "24 giant Kevlar airbags" },
      { label: "Planned vs Actual", value: "7 days planned / 83 days lived" },
      { label: "Target Boulders", value: "Barnacle Bill, Yogi, Casper" },
    ],
    leftPage: {
      heading: "The Bouncing Cocoon",
      subheading: "Independence Day 1997",
      paragraphs: [
        "Before 1997, scientists believed a rover on Mars was an impossible luxury that would require billions of dollars and heavy retro-rockets.",
        "NASA's engineers at JPL had a wild idea: wrap the spacecraft in a giant cocoon of 24 pressurized Kevlar airbags, drop it from 30 meters, and let it bounce across the planet.",
        "On July 4, 1997, Mars Pathfinder hit the floodplains of Ares Vallis at 50 km/h, bounced fifteen times over a kilometer of Martian rocks, and rolled to a stop. When the airbags deflated and the lander's petals opened, there sat Sojourner—a six-wheeled rover barely bigger than a microwave oven.",
      ],
      calloutBox: {
        title: "Named for Civil Rights",
        text: "The rover was named after Sojourner Truth, the African-American abolitionist and women's rights champion, selected through an international school essay contest.",
        badge: "Inspiration",
      },
    },
    rightPage: {
      heading: "The Little Rover That Could",
      subheading: "83 Days of Rock Sniffing",
      paragraphs: [
        "Sojourner rolled down the ramp at just 1 centimeter per second using a patented 'rocker-bogie' suspension that allowed its titanium wheels to climb boulders bigger than themselves.",
        "Equipped with an Alpha Proton X-ray Spectrometer, Sojourner pressed its nose against rocks nicknamed Barnacle Bill and Yogi. Its chemical measurements proved that Ares Vallis had once been carved by catastrophic, Mississippi-scale torrents of liquid water.",
        "Sojourner was built to survive only 7 days. It survived 83. Somewhere in Ares Vallis, the little 11-kg pioneer rests alongside the lander, frozen in a gentle turn toward the horizon.",
      ],
      quote: {
        text: "Sojourner proved that Mars was not just a world to look at, but a world to explore on wheels.",
        author: "Dr. Donna Shirley, Pathfinder Manager",
      },
      takeaway: "Scientific Gain: Validated airbag landing and rocker-bogie mobility for Spirit, Opportunity, and Curiosity.",
    },
  },

  // SPREAD 8: CHAPTER 7 - MARS POLAR LANDER
  {
    chapterNumber: 7,
    title: "Mars Polar Lander",
    subtitle: "The Polar Mystery",
    dateAndLocation: "December 3, 1999 · Planum Chronium, South Pole of Mars",
    cosparId: "1999-001A",
    heroSlug: "mars-polar-lander",
    image: "images/card-mars-polar-lander.webp",
    imageCaption: "Mars Polar Lander descending toward the carbon-dioxide frost of the Martian South Pole.",
    telemetrySummary: [
      { label: "Target Site", value: "Planum Chronium (~76° S, 195° W)" },
      { label: "Anomaly Altitude", value: "40 meters above ground" },
      { label: "Failure Root Cause", value: "Leg microswitch electrical shudder" },
      { label: "Heritage Impact", value: "Mandated telemetry on Phoenix/MSL" },
    ],
    leftPage: {
      heading: "Into the Southern Freeze",
      subheading: "Aiming for the Carbon Snow",
      paragraphs: [
        "Not every heroic journey ends in celebration. True space exploration involves heartbreak, vulnerability, and lessons purchased at enormous cost.",
        "On December 3, 1999, Mars Polar Lander aimed for the frozen dunes of the Martian South Pole. It carried the first microphone sent to another planet, miniature deep-space penetrator probes, and cameras designed to photograph polar ice layering.",
        "As it entered the atmosphere, telemetry ceased as planned for the ionization blackout. But when the landing window opened, the Deep Space Network heard nothing. Just silence.",
      ],
      calloutBox: {
        title: "The 40-Meter Glitch",
        text: "Post-flight forensic testing revealed that when the landing legs deployed at 40 meters, their mechanical switches vibrated. The computer mistook this shudder for touchdown and shut off the retrorockets.",
        badge: "Forensic Lesson",
      },
    },
    rightPage: {
      heading: "The Price of Discovery",
      subheading: "The Failure That Saved Future Landers",
      paragraphs: [
        "Mars Polar Lander fell forty meters in total silence, striking the ice-scoured plain at high velocity.",
        "Engineers grieved. But they did not hide the truth. An independent review board redesigned NASA's entire entry and descent architecture. Never again would a spacecraft land without real-time telemetry.",
        "The software fixes developed from Polar Lander's loss directly enabled the flawless touchdowns of Phoenix in 2008, Curiosity's Sky Crane in 2012, and Perseverance in 2021. The machine was lost, but its lesson saved billions of dollars and protected future human lives.",
      ],
      quote: {
        text: "Failure is not the opposite of success; it is the laboratory where success is forged.",
        author: "Thomas Young, NASA Mishap Investigation Board",
      },
      takeaway: "Scientific Gain: Revolutionized EDL telemetry protocols, proving that transparent engineering saves missions.",
    },
  },

  // SPREAD 9: CHAPTER 8 - SPIRIT & OPPORTUNITY
  {
    chapterNumber: 8,
    title: "Spirit & Opportunity",
    subtitle: "The Indomitable Twins",
    dateAndLocation: "2004–2018 · Gusev Crater & Meridiani Planum, Mars",
    cosparId: "2003-027A & 2003-032A",
    heroSlug: "opportunity",
    image: "images/card-opportunity.webp",
    imageCaption: "Opportunity looking back across 45 kilometers of rover tracks in the sands of Meridiani Planum.",
    telemetrySummary: [
      { label: "Planned Life", value: "90 Sols each" },
      { label: "Spirit Sols / Km", value: "2,210 Sols / 7.73 km" },
      { label: "Opportunity Sols / Km", value: "5,352 Sols / 45.16 km (Marathon!)" },
      { label: "Final Words", value: "'My battery is low and it's getting dark'" },
    ],
    leftPage: {
      heading: "Spirit: Dragging a Broken Leg",
      subheading: "The Discovery in Gusev Crater",
      paragraphs: [
        "Built to last only 90 days, the twin Mars Exploration Rovers gave humanity a fifteen-year masterclass in grit.",
        "In 2006, Spirit's right-front wheel motor died permanently. Instead of giving up, engineers commanded Spirit to drive in reverse everywhere it went, dragging its seized wheel like a broken leg.",
        "As that dragging wheel gouged deep trenches in the red dirt, it scraped away topsoil and uncovered brilliant white deposits of 90% pure silica. On Earth, pure silica only forms around boiling hydrothermal springs—proving ancient Mars once had warm, bubbly hot springs where microbes could flourish!",
      ],
      calloutBox: {
        title: "Trapped at Troy",
        text: "In 2009, Spirit broke through a crust of bright sulfate dirt at Troy and became trapped in loose sand. It worked as a stationary station until winter darkness silenced it on Sol 2210.",
        badge: "Spirit's Stand",
      },
    },
    rightPage: {
      heading: "Opportunity: The 45 km Marathon",
      subheading: "Blueberries and the Final Dust Storm",
      paragraphs: [
        "On the other side of Mars, Opportunity rolled into Eagle crater and immediately found hematite spheres nicknamed 'blueberries' that precipitated out of ancient acidic water.",
        "Opportunity kept driving for 5,352 sols—crossing 45.16 kilometers, an Olympic marathon on another planet. It survived wheel failures, flash memory amnesia, and global storms.",
        "In June 2018, a continent-spanning dust storm blacked out the sky over Perseverance Valley. Daily solar power plunged from 650 to 22 Watt-hours. Its final transmission was poetically translated: 'My battery is low and it's getting dark.' Opportunity rests in the valley, its marathon complete.",
      ],
      quote: {
        text: "I'll be seeing you in all the old familiar places that this heart of mine embraces...",
        author: "Billie Holiday (Final song beamed by NASA, Feb 2019)",
      },
      takeaway: "Scientific Gain: Proved liquid water once flowed across Mars for millions of years.",
    },
  },

  // SPREAD 10: CHAPTER 9 - PHOENIX
  {
    chapterNumber: 9,
    title: "Phoenix Mars Lander",
    subtitle: "The Arctic Digger",
    dateAndLocation: "May 25, 2008 · Vastitas Borealis, Northern Plains of Mars",
    cosparId: "2007-034A",
    heroSlug: "phoenix",
    image: "images/card-phoenix.webp",
    imageCaption: "Phoenix digging into the polygon-patterned arctic permafrost of Vastitas Borealis.",
    telemetrySummary: [
      { label: "COSPAR ID", value: "2007-034A" },
      { label: "Landing Latitude", value: "68.22° N (Arctic Circle)" },
      { label: "Discovery", value: "Pure water ice sublimating in sunlight" },
      { label: "Demise", value: "Crushed under carbon dioxide polar ice" },
    ],
    leftPage: {
      heading: "Rising From the Ashes",
      subheading: "Refurbished Hardware in the Arctic",
      paragraphs: [
        "Rising like its mythological namesake from cancelled projects, Phoenix utilized spare instruments and refurbished structures from the mothballed Mars Surveyor 2001 mission.",
        "Its target was the frozen, polygon-patterned permafrost of the Martian arctic: Vastitas Borealis.",
        "On May 25, 2008, Phoenix touched down softly on pulsed thrusters. Its backhoe robotic arm sliced a trench into the hard soil called Dodo-Goldilocks, scraping away topsoil to expose chunks of brilliant white material.",
      ],
      calloutBox: {
        title: "Disappearing Ice",
        text: "Over four days, scientists watched the white chunks vanish from camera frames. They did not melt—they sublimated into vapor. It was 100% pure water ice, confirmed by thermal analysis.",
        badge: "Water Confirmed",
      },
    },
    rightPage: {
      heading: "Crushed Under Carbon Snow",
      subheading: "The Polar Winter of 2009",
      paragraphs: [
        "Phoenix worked tirelessly through the continuous daylight of the northern summer, tasting soil chemistry, detecting snowfall in the clouds, and measuring perchlorate salts.",
        "But in late 2008, the Sun sank below the horizon. The temperature plunged past -120°C. Solid carbon dioxide frost—dry ice—began coating the lander.",
        "During the polar winter, hundreds of kilograms of dry-ice snow piled onto its UltraFlex solar panels. HiRISE satellite images in 2010 confirmed that the massive weight of polar ice had snapped the solar wings. Phoenix died buried under ice, but it proved Mars holds vast water reserves.",
      ],
      quote: {
        text: "We have touched water on Mars, and it is abundant.",
        author: "Peter Smith, Phoenix Principal Investigator",
      },
      takeaway: "Scientific Gain: Direct isotopic confirmation of water ice and discovery of perchlorate chemistry.",
    },
  },

  // SPREAD 11: CHAPTER 10 - LCROSS & GRAIL
  {
    chapterNumber: 10,
    title: "LCROSS & GRAIL",
    subtitle: "The Kinetic Impactors",
    dateAndLocation: "2009 & 2012 · Cabeus & Sally Ride Impact Sites, The Moon",
    cosparId: "2009-031B & 2011-046A",
    heroSlug: "lcross",
    image: "images/card-lcross.webp",
    imageCaption: "LCROSS observing the kinetic plume blasted from Cabeus Crater before its own impact.",
    telemetrySummary: [
      { label: "LCROSS Impact Energy", value: "7.2 Gigajoules at 9,000 km/h" },
      { label: "Water Ice Detected", value: "155 kg in Cabeus plume" },
      { label: "GRAIL Satellites", value: "Ebb & Flow (Microwave ranging)" },
      { label: "Final Resting Place", value: "Sally K. Ride Impact Site (Moon)" },
    ],
    leftPage: {
      heading: "LCROSS: A 9,000 km/h Plume",
      subheading: "Hunting Water in Permanent Shadows",
      paragraphs: [
        "At the lunar South Pole lie craters where sunlight has not shone for two billion years. In these Permanently Shadowed Regions, temperatures hover at -240°C—colder than Pluto.",
        "On October 9, 2009, NASA crashed a 2.3-ton spent Centaur rocket into Cabeus crater at 9,000 km/h, releasing 7.2 gigajoules of kinetic energy.",
        "Flying four minutes behind, the LCROSS Shepherding Spacecraft sniffed the 8-mile-high plume with spectrometers before crashing into the crater itself. The plume contained 155 kilograms of pure water ice, proving the lunar poles hold millions of tons of rocket-fuel reserves.",
      ],
      calloutBox: {
        title: "GRAIL: Ebb & Flow",
        text: "In 2012, twin spacecraft named Ebb and Flow measured the Moon's gravity by tracking changes in their separation distance to the width of a human hair, mapping lunar lava tubes.",
        badge: "Gravity Twins",
      },
    },
    rightPage: {
      heading: "The Sally Ride Impact Site",
      subheading: "Honoring America's First Woman in Space",
      paragraphs: [
        "When GRAIL's propellant was exhausted on December 17, 2012, NASA commanded both spacecraft to dive into a 2.5-kilometer mountain rim near the lunar north pole at 6,050 km/h.",
        "The impact site was officially named the Sally K. Ride Impact Site, honoring America's first woman in space, who had led GRAIL's MoonKAM student camera program.",
        "Both missions proved that an intentional kinetic sacrifice can unlock secrets deep beneath planetary surfaces that no orbiter could see.",
      ],
      quote: {
        text: "The Moon's craters are not barren rock; they are frozen fuel tanks for future deep-space voyages.",
        author: "Anthony Colaprete, LCROSS Project Scientist",
      },
      takeaway: "Scientific Gain: Confirmed pure water ice reservoirs and mapped the thin, heavily fractured lunar crust.",
    },
  },

  // SPREAD 12: CHAPTER 11 - INSIGHT
  {
    chapterNumber: 11,
    title: "InSight",
    subtitle: "The Planetary Stethoscope",
    dateAndLocation: "2018–2022 · Homestead Hollow, Elysium Planitia, Mars",
    cosparId: "2018-042A",
    heroSlug: "insight",
    image: "images/card-insight.webp",
    imageCaption: "InSight's solar panels blanketed in terracotta dust on Sol 1211 in Elysium Planitia.",
    telemetrySummary: [
      { label: "COSPAR ID", value: "2018-042A (Discovery #12)" },
      { label: "Total Marsquakes", value: "1,319 confirmed seismic events" },
      { label: "Monster Quake S1222a", value: "Magnitude 4.7 (Shook for 6+ hours)" },
      { label: "Core Radius", value: "~1,650–1,830 km liquid Fe-Ni core" },
    ],
    leftPage: {
      heading: "Listening to the Core",
      subheading: "1,319 Marsquakes Detected",
      paragraphs: [
        "While rovers examined surface rocks, InSight looked straight down—into the deep, rumbling heart of Mars.",
        "Using its 2.4-meter robotic arm, InSight set the French SEIS seismometer onto the dirt of Homestead Hollow and covered it with a white wind dome. SEIS was so sensitive it could detect ground motion smaller than a single hydrogen atom.",
        "Over four years, InSight detected 1,319 marsquakes: from the faint tremor of S0128a, to the acoustic 'bloop' of a meteoroid strike on Sol 988, to the monster Magnitude 4.7 quake S1222a that reverberated globally for six hours.",
      ],
      calloutBox: {
        title: "2024 Water Ocean Discovery",
        text: "In August 2024, geophysicists analyzing InSight's seismic shear waves proved that fractured rock at 11.5 to 20 km depth is saturated with liquid water—enough to form an ocean covering all of Mars 1–2 km deep!",
        badge: "Post-Mission Breakthrough",
      },
    },
    rightPage: {
      heading: "The Final Sacrifice",
      subheading: "Turning Off Survival Heaters to Listen",
      paragraphs: [
        "Unlike rovers that were cleaned by whirlwinds, dust accumulated relentlessly on InSight's panels. Daily power plummeted from 4,588 Watt-hours to under 300.",
        "Engineers commanded InSight to drop sand above its panels on Sol 884: bouncing sand knocked dust off, buying extra months of science. But by late 2022, power was failing.",
        "JPL engineers intentionally disabled InSight's survival heaters so every micro-ampere of energy could feed SEIS. On December 19, 2022, InSight sent its final partial image and whispered: 'My power's really low, so this may be the last image I can send... Thanks for staying with me.'",
      ],
      quote: {
        text: "I've been lucky enough to live on two planets... Hope I've done you proud.",
        author: "InSight Mission Farewell Message",
      },
      takeaway: "Scientific Gain: Direct proof of liquid Martian core and discovery of mid-crust liquid water ocean.",
    },
  },

  // SPREAD 13: CHAPTER 12 - INGENUITY
  {
    chapterNumber: 12,
    title: "Ingenuity",
    subtitle: "Wings Over the Red Planet",
    dateAndLocation: "2021–2024 · Jezero Crater, Mars",
    cosparId: "2020-052T",
    heroSlug: "ingenuity",
    image: "images/card-ingenuity.webp",
    imageCaption: "Ingenuity hovering over Jezero Crater during its historic 72-flight campaign.",
    telemetrySummary: [
      { label: "Helicopter Mass", value: "1.8 kg (4.0 lbs)" },
      { label: "Rotor RPM", value: "2,400 to 2,700 RPM" },
      { label: "Planned vs Flown", value: "Up to 5 planned / 72 flights achieved" },
      { label: "Total Distance", value: "17.0 km (128.8 minutes airborne)" },
    ],
    leftPage: {
      heading: "Thin Air and Carbon Wings",
      subheading: "The Wright Brothers on Mars",
      paragraphs: [
        "The atmospheric density of Mars is less than 1% of Earth's sea-level air. Aerodynamic textbooks said flying a helicopter on Mars was impossible—the equivalent of flying at 100,000 feet on Earth.",
        "Engineers designed twin counter-rotating carbon-fiber blades spinning at 2,700 RPM—ten times faster than a terrestrial helicopter. Tucked beneath its solar panel was a postage-stamp piece of muslin fabric from the wing of the 1903 Wright Flyer.",
        "On April 19, 2021, Ingenuity spun its rotors, climbed three meters into the thin Martian morning, hovered for 39 seconds, and landed softly. Humanity had achieved powered flight on an alien world.",
      ],
      calloutBox: {
        title: "From Test to Scout",
        text: "Ingenuity was funded for only 5 flights. Instead, it flew 72 times, traveled 17 kilometers, and served as an aerial scout for Perseverance, mapping safe rover routes through Jezero Crater.",
        badge: "72 Flights",
      },
    },
    rightPage: {
      heading: "Airfield Nefertiti",
      subheading: "The Sheared Rotor Blade and Permanent Beacon",
      paragraphs: [
        "On January 18, 2024, during Flight 72 over the rippled sand dunes of Valinor Hills, Ingenuity executed an emergency landing in featureless terrain. Shadow analysis from its nav camera showed the tip of one carbon-fiber blade had broken off.",
        "It could never fly again. On January 25, 2024, flight operations concluded.",
        "Yet Ingenuity remains alive as a permanent weather beacon: its avionics wake up daily at Airfield Nefertiti, logging temperature, test-cycling systems, and storing photos in flash memory, waiting for human astronauts to walk out, download its logs, and bring it to a museum.",
      ],
      quote: {
        text: "Ingenuity has completely changed our paradigm of what exploration looks like in the solar system.",
        author: "Laurie Leshin, JPL Director",
      },
      takeaway: "Scientific Gain: Proved aerial exploration is viable on other planets, inspiring the Dragonfly mission to Titan.",
    },
  },

  // SPREAD 14: EPILOGUE & GUARDIANS OF TOMORROW
  {
    chapterNumber: 99,
    title: "Epilogue",
    subtitle: "The Guardians of Tomorrow",
    dateAndLocation: "The Solar System · Monuments in the Dust",
    leftPage: {
      heading: "The Sentinels",
      subheading: "A Message to the Youth of Earth",
      paragraphs: [
        "Next time you step outside under the evening sky, look at the bright pearl of the Moon, and look at the amber ember of Mars.",
        "They are not barren, empty stones. Resting in their craters and across their frozen plains stand these twelve guardians: Ranger's shattered rim in Mare Cognitum; Surveyor's tripod in Oceanus Procellarum; the golden descent stage of Apollo 11; the roving buggy of Hadley Rille; Viking's weather bench; Pathfinder's petals; Spirit and Opportunity's tire tracks; Phoenix under polar frost; LCROSS and GRAIL in shadow; InSight listening to quakes; and Ingenuity standing tall on Airfield Nefertiti.",
      ],
      calloutBox: {
        title: "To the Next Generation",
        text: "These machines were built by human hands, dreamed by human minds, and powered by human curiosity. They will never fly home. But they will never be forgotten.",
        badge: "Our Promise",
      },
    },
    rightPage: {
      heading: "When We Return",
      subheading: "Walking Up to the Monuments",
      paragraphs: [
        "Wherever humanity travels in the centuries ahead—to build habitats beneath pressurized lunar domes or walk the valleys of Mars—astronauts will travel out across the red and gray dirt.",
        "They will kneel down beside these dormant machines, wipe the dust from their titanium nameplates, inspect their solar panels, and whisper the words these brave pioneers earned:",
        "'Thank you. You showed us the way.'",
      ],
      quote: {
        text: "Exploration is in our nature. We began as wanderers, and we are wanderers still.",
        author: "Carl Sagan",
      },
      takeaway: "Master Truth: The machines we leave behind are not our trash. They are our monuments.",
    },
  },
];

const TOC_ITEMS = [
  { spread: 1, title: "Prologue: The Whisper Across the Void", page: 3 },
  { spread: 2, title: "Ch 1: Ranger 7 (1964) — The Blind Diver", page: 5 },
  { spread: 3, title: "Ch 2: Surveyor 1 (1966) — The Soft Step", page: 7 },
  { spread: 4, title: "Ch 3: Apollo 11 'Eagle' (1969) — Tranquility Base", page: 9 },
  { spread: 5, title: "Ch 4: Apollo 15 Rover (1971) — The Moon Buggy", page: 11 },
  { spread: 6, title: "Ch 5: Viking 1 (1976) — The Red Frontier", page: 13 },
  { spread: 7, title: "Ch 6: Pathfinder & Sojourner (1997) — The Skateboard", page: 15 },
  { spread: 8, title: "Ch 7: Mars Polar Lander (1999) — The Polar Mystery", page: 17 },
  { spread: 9, title: "Ch 8: Spirit & Opportunity (2004) — The Indomitable Twins", page: 19 },
  { spread: 10, title: "Ch 9: Phoenix (2008) — The Arctic Digger", page: 21 },
  { spread: 11, title: "Ch 10: LCROSS & GRAIL (2009–2012) — Kinetic Impactors", page: 23 },
  { spread: 12, title: "Ch 11: InSight (2018–2022) — The Stethoscope", page: 25 },
  { spread: 13, title: "Ch 12: Ingenuity (2021–2024) — Wings Over Mars", page: 27 },
  { spread: 14, title: "Epilogue: The Guardians of Tomorrow", page: 29 },
];

export default function StoryBookPage() {
  const [spreadIndex, setSpreadIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tocOpen, setTocOpen] = useState<boolean>(false);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play realistic paper page-turn sound using Web Audio API pink noise flutter
  const playPageTurnSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.25; // 250ms soft paper flutter
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.05 * white) / 1.05;
        last = data[i];
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 0.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(now);
      source.stop(now + 0.25);
    } catch {
      // Audio not permitted or supported
    }
  }, [soundEnabled]);

  const goToNextSpread = useCallback(() => {
    if (spreadIndex < SPREADS.length - 1) {
      setIsFlipping(true);
      playPageTurnSound();
      setSpreadIndex((prev) => prev + 1);
      setTimeout(() => setIsFlipping(false), 300);
    }
  }, [playPageTurnSound, spreadIndex]);

  const goToPrevSpread = useCallback(() => {
    if (spreadIndex > 0) {
      setIsFlipping(true);
      playPageTurnSound();
      setSpreadIndex((prev) => prev - 1);
      setTimeout(() => setIsFlipping(false), 300);
    }
  }, [playPageTurnSound, spreadIndex]);

  // Keyboard Navigation: Arrow Left / Arrow Right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goToNextSpread();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevSpread();
      } else if (e.key === "Home") {
        e.preventDefault();
        setSpreadIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setSpreadIndex(SPREADS.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSpread, goToPrevSpread]);

  const currentSpread = SPREADS[spreadIndex];
  const totalSpreads = SPREADS.length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#070510] text-[#2c221e] px-2 py-4 sm:px-6 sm:py-8 flex flex-col justify-between items-center selection:bg-rose-200">
        {/* Top Floating Utility Bar */}
        <div className="w-full max-w-6xl mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
          <Link
            href="/story"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Stories
          </Link>

          <div className="flex items-center gap-3">
            {/* Quick Table of Contents Toggle */}
            <div className="relative">
              <button
                onClick={() => setTocOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/80 hover:bg-white/10 hover:text-white transition-all"
              >
                <span>📖 Chapters</span>
                <span className="text-[10px] text-white/40">▾</span>
              </button>

              {tocOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto rounded-2xl border border-white/20 bg-[#120d24] p-3 text-white shadow-2xl z-50 backdrop-blur-xl">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-rose-300 mb-2">
                    Jump to Chapter
                  </p>
                  <div className="space-y-1">
                    {SPREADS.map((sp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSpreadIndex(idx);
                          setTocOpen(false);
                          playPageTurnSound();
                        }}
                        className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-all ${
                          spreadIndex === idx
                            ? "bg-rose-500 font-bold text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">{sp.title}</span>
                          <span className="font-mono text-[10px] text-white/40 ml-2">
                            {idx === 0 ? "Cover" : `Ch ${idx}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/80 hover:bg-white/10 hover:text-white transition-all"
              title="Toggle Page Turning Audio"
            >
              {soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off"}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE PHYSICAL BOOK CONTAINER                                               */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-6xl">
          {/* Floating Outer Page Turn Buttons */}
          <button
            onClick={goToPrevSpread}
            disabled={spreadIndex === 0}
            className="hidden lg:flex absolute -left-14 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95 cursor-pointer z-40"
            title="Turn to previous page"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNextSpread}
            disabled={spreadIndex === totalSpreads - 1}
            className="hidden lg:flex absolute -right-14 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95 cursor-pointer z-40"
            title="Turn to next page"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Silk Bookmark Ribbon hanging from top center */}
          <div className="absolute left-1/2 -top-3 -translate-x-1/2 w-5 h-16 bg-gradient-to-b from-rose-700 via-rose-600 to-rose-800 rounded-b shadow-lg z-30 pointer-events-none border-x border-rose-900/40">
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#070510] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
          </div>

          {/* Hardcover Outer Leather / Cosmic Binding */}
          <div className="relative rounded-3xl border-4 border-[#2b1f3d] bg-gradient-to-r from-[#170e28] via-[#201538] to-[#170e28] p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(244,63,94,0.15)]">
            {/* Book Pages Spread (Two Pages on Desktop, Single on Mobile) */}
            <div
              className={`relative grid grid-cols-1 md:grid-cols-2 rounded-2xl bg-[#faf6ee] shadow-inner overflow-hidden transition-all duration-300 ${
                isFlipping ? "scale-[0.995] opacity-95" : "scale-100 opacity-100"
              }`}
            >
              {/* Spine Crease / Center Gutter Shadow */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/15 via-black/5 to-black/15 pointer-events-none z-20 shadow-inner" />

              {/* ----------------------------------------------------------------- */}
              {/* LEFT PAGE                                                         */}
              {/* ----------------------------------------------------------------- */}
              <div
                onClick={goToPrevSpread}
                className="relative p-6 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e3dac9] min-h-[540px] sm:min-h-[620px] cursor-pointer group"
                title="Click left page to turn backward"
              >
                <div>
                  {/* Running Header */}
                  <div className="flex items-center justify-between border-b border-[#e5dcce] pb-2 text-[10px] font-mono uppercase tracking-widest text-[#8c7b70]">
                    <span>The Last Signal</span>
                    <span>{currentSpread.dateAndLocation.split("·")[0]}</span>
                  </div>

                  {/* Title Plate or Header */}
                  <div className="mt-6 mb-4">
                    {currentSpread.chapterNumber !== null && (
                      <span className="font-mono text-xs uppercase tracking-widest text-rose-800 font-bold block mb-1">
                        {currentSpread.chapterNumber === 0 ? "Introduction" : `Chapter ${currentSpread.chapterNumber}`}
                      </span>
                    )}
                    <h2 className="display text-2xl sm:text-3xl font-bold text-[#231815] leading-tight">
                      {currentSpread.leftPage.heading || currentSpread.title}
                    </h2>
                    {currentSpread.leftPage.subheading && (
                      <p className="font-serif italic text-xs sm:text-sm text-[#736357] mt-1">
                        {currentSpread.leftPage.subheading}
                      </p>
                    )}
                  </div>

                  {/* Optional Image Plate */}
                  {currentSpread.image && (
                    <div className="my-4 rounded-xl overflow-hidden border border-[#e5dcce] bg-[#efe9dc] p-1.5 shadow-sm">
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#ded6c7]">
                        <Image
                          src={assetUrl(currentSpread.image)}
                          alt={currentSpread.title}
                          fill
                          sizes="(min-width:768px) 400px, 100vw"
                          className="object-cover"
                        />
                      </div>
                      {currentSpread.imageCaption && (
                        <p className="mt-1.5 text-[10px] font-mono text-[#736357] text-center italic">
                          {currentSpread.imageCaption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Left Page Body Paragraphs */}
                  <div className="space-y-3 font-serif text-xs sm:text-sm leading-relaxed text-[#3b2d26]">
                    {currentSpread.leftPage.paragraphs.map((p, idx) => (
                      <p key={idx} className={idx === 0 && !currentSpread.image ? "first-letter:float-left first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:font-bold first-letter:text-rose-900" : ""}>
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Telemetry Summary Box if present */}
                  {currentSpread.telemetrySummary && (
                    <div className="mt-4 rounded-xl border border-[#dcd1be] bg-[#f2ecde] p-3 text-[11px] font-mono text-[#4a3b32]">
                      <p className="text-[10px] uppercase font-bold text-rose-900 tracking-wider mb-1.5">
                        Verified Mission Telemetry
                      </p>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {currentSpread.telemetrySummary.map((item, idx) => (
                          <div key={idx}>
                            <span className="text-[#8c7b70] block text-[9px]">{item.label}</span>
                            <span className="font-bold text-[#231815]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Left Page Callout Box */}
                  {currentSpread.leftPage.calloutBox && (
                    <div className="mt-4 rounded-xl border border-rose-900/20 bg-rose-950/5 p-3 text-[11px] text-[#4a3b32]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-rose-950">
                          {currentSpread.leftPage.calloutBox.title}
                        </span>
                        {currentSpread.leftPage.calloutBox.badge && (
                          <span className="bg-rose-900/10 text-rose-900 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                            {currentSpread.leftPage.calloutBox.badge}
                          </span>
                        )}
                      </div>
                      <p className="font-serif italic leading-relaxed text-[#5c4a3f]">
                        {currentSpread.leftPage.calloutBox.text}
                      </p>
                    </div>
                  )}

                  {/* Spread 0 Cover: Prominent "Open Book & Start Reading" Button */}
                  {spreadIndex === 0 && (
                    <div className="mt-6 pt-4 border-t border-[#e5dcce]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNextSpread();
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-rose-900 px-6 py-3.5 font-mono text-sm font-bold text-white shadow-xl shadow-rose-950/30 transition-all hover:bg-rose-800 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Open Book &amp; Start Reading 📖 <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Left Page Footer (Page Number Even) */}
                <div className="mt-6 pt-3 border-t border-[#e5dcce] flex justify-between items-center text-[10px] font-mono text-[#8c7b70]">
                  <span>{spreadIndex * 2 + 1}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ◂ Turn Previous
                  </span>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* RIGHT PAGE                                                        */}
              {/* ----------------------------------------------------------------- */}
              <div
                onClick={goToNextSpread}
                className="relative p-6 sm:p-10 flex flex-col justify-between min-h-[540px] sm:min-h-[620px] cursor-pointer group"
                title="Click right page to turn forward"
              >
                <div>
                  {/* Running Header */}
                  <div className="flex items-center justify-between border-b border-[#e5dcce] pb-2 text-[10px] font-mono uppercase tracking-widest text-[#8c7b70]">
                    <span>{currentSpread.title}</span>
                    <span>{currentSpread.cosparId || "Master Chronology"}</span>
                  </div>

                  {/* Right Page Header */}
                  <div className="mt-6 mb-4">
                    <h3 className="display text-xl sm:text-2xl font-bold text-[#231815]">
                      {currentSpread.rightPage.heading || currentSpread.subtitle}
                    </h3>
                    {currentSpread.rightPage.subheading && (
                      <p className="font-serif italic text-xs sm:text-sm text-[#736357] mt-1">
                        {currentSpread.rightPage.subheading}
                      </p>
                    )}
                  </div>

                  {/* Right Page Body or Interactive Table of Contents */}
                  {spreadIndex === 0 ? (
                    <div className="space-y-1.5 my-2">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-rose-900 font-bold mb-2">
                        Select a chapter to jump directly:
                      </p>
                      {TOC_ITEMS.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSpreadIndex(item.spread);
                            playPageTurnSound();
                          }}
                          className="w-full text-left rounded-lg p-2 font-serif text-xs sm:text-sm text-[#3b2d26] hover:bg-rose-900/10 hover:text-rose-900 transition-all flex items-center justify-between border border-transparent hover:border-rose-900/20 group cursor-pointer"
                        >
                          <span className="font-medium group-hover:translate-x-1 transition-transform truncate mr-2">
                            {item.title}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-[#8c7b70] bg-[#efe7da] px-2 py-0.5 rounded group-hover:bg-rose-900 group-hover:text-white transition-colors">
                            Pg {item.page} ➔
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 font-serif text-xs sm:text-sm leading-relaxed text-[#3b2d26]">
                      {currentSpread.rightPage.paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Quote Plate */}
                  {currentSpread.rightPage.quote && (
                    <blockquote className="my-4 border-l-2 border-rose-900 pl-3 italic font-serif text-xs sm:text-sm text-[#523d32] bg-[#f4ede0] py-2 rounded-r-lg">
                      &ldquo;{currentSpread.rightPage.quote.text}&rdquo;
                      <span className="block mt-1 font-mono not-italic text-[10px] text-[#8c7b70]">
                        — {currentSpread.rightPage.quote.author}
                      </span>
                    </blockquote>
                  )}

                  {/* Core Takeaway */}
                  {currentSpread.rightPage.takeaway && (
                    <div className="mt-4 rounded-xl border border-[#dcd1be] bg-[#f0e8d8] p-3 text-xs font-mono text-[#42342c]">
                      <span className="font-bold text-rose-900 block mb-0.5">Core Discovery:</span>
                      {currentSpread.rightPage.takeaway}
                    </div>
                  )}

                  {/* Bottom Actions on Right Page */}
                  <div className="mt-6 pt-3 border-t border-[#e5dcce] flex items-center justify-between">
                    {currentSpread.heroSlug ? (
                      <Link
                        href={`/heroes/${currentSpread.heroSlug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-rose-900 hover:text-rose-700 underline transition-colors"
                      >
                        Inspect Telemetry Dossier ↗
                      </Link>
                    ) : <span />}

                    {spreadIndex < totalSpreads - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNextSpread();
                        }}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-white bg-rose-900 hover:bg-rose-800 px-3.5 py-1.5 rounded-lg shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Turn Page ▸
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Page Footer (Page Number Odd) */}
                <div className="mt-6 pt-3 border-t border-[#e5dcce] flex justify-between items-center text-[10px] font-mono text-[#8c7b70]">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Turn Next ▸
                  </span>
                  <span>{spreadIndex * 2 + 2}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM BOOKSHELF CONTROLS                                                 */}
        {/* ========================================================================= */}
        <div className="w-full max-w-2xl mt-6 flex flex-col items-center gap-3">
          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToPrevSpread}
              disabled={spreadIndex === 0}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-mono text-xs text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" /> Previous Spread
            </button>

            <span className="font-mono text-xs text-white/70">
              Spread {spreadIndex + 1} of {totalSpreads} (Pages {spreadIndex * 2 + 1}–{spreadIndex * 2 + 2})
            </span>

            <button
              onClick={goToNextSpread}
              disabled={spreadIndex === totalSpreads - 1}
              className="flex items-center gap-1.5 rounded-full bg-rose-600 px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-rose-500 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-rose-600/30"
            >
              Next Spread <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Reading Progress Slider */}
          <div className="w-full px-4">
            <input
              type="range"
              min="0"
              max={totalSpreads - 1}
              value={spreadIndex}
              onChange={(e) => {
                setSpreadIndex(parseInt(e.target.value, 10));
                playPageTurnSound();
              }}
              className="w-full accent-rose-500 h-1.5 bg-white/20 rounded cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-white/40 mt-1">
              <span>Cover &amp; TOC</span>
              <span>1964: Ranger 7</span>
              <span>1976: Viking</span>
              <span>2004: MER</span>
              <span>2024: Ingenuity</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
