"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/header";
import { ArrowLeft, ArrowRight } from "@/app/components/icons";
import { assetUrl } from "@/lib/heroes";
import { calculateIngenuityAerodynamics } from "@/lib/ingenuity-mission";

interface BookSpread {
  id: string;
  chapterNumber: number | null; // null for cover/toc/prologue/epilogue
  machineName: string;
  spreadTitle: string;
  spreadSubtitle: string;
  dateAndLocation: string;
  cosparId?: string;
  heroSlug?: string;
  badge?: string;
  image?: string;
  imageCaption?: string;
  telemetrySummary?: { label: string; value: string }[];
  leftPage: {
    heading?: string;
    subheading?: string;
    paragraphs: string[];
    calloutBox?: { title: string; text: string; badge?: string };
  };
  rightPage: {
    heading?: string;
    subheading?: string;
    paragraphs?: string[];
    quote?: { text: string; author: string };
    takeaway?: string;
  };
}

const TOC_ITEMS = [
  { spread: 0, title: "Front Cover & Master Table of Contents", page: 1, machine: "Master Edition" },
  { spread: 1, title: "Prologue: Monuments in the Dust — The Silent Sentinels", page: 3, machine: "Introduction" },
  { spread: 2, title: "Chapter 1: Ranger 7 (1964) — The Blind Diver [Part I & II]", page: 5, machine: "Ranger 7" },
  { spread: 4, title: "Chapter 2: Surveyor 1 (1966) — The Soft Landing Pioneer [Part I & II]", page: 9, machine: "Surveyor 1" },
  { spread: 6, title: "Chapter 3: Apollo 11 Eagle (1969) — Tranquility Base [Part I & II]", page: 13, machine: "Apollo 11 Eagle" },
  { spread: 8, title: "Chapter 4: Apollo 12 & Surveyor 3 (1969) — The Moon Rendezvous [Part I & II]", page: 17, machine: "Surveyor 3" },
  { spread: 10, title: "Chapter 5: Apollo 15 LRV (1971) — The First Moon Buggy [Part I & II]", page: 21, machine: "Apollo 15 LRV" },
  { spread: 12, title: "Chapter 6: Viking 1 (1976) — The Red Planet Pioneer [Part I & II]", page: 25, machine: "Viking 1" },
  { spread: 14, title: "Chapter 7: Mars Pathfinder & Sojourner (1997) — The Microrover [Part I & II]", page: 29, machine: "Pathfinder" },
  { spread: 16, title: "Chapter 8: Spirit & Opportunity (2004) — The Indomitable Twins [Part I & II]", page: 33, machine: "Spirit & Oppy" },
  { spread: 18, title: "Chapter 9: Phoenix (2008) — The Arctic Digger [Part I & II]", page: 37, machine: "Phoenix" },
  { spread: 20, title: "Chapter 10: LCROSS & GRAIL (2009–2012) — The Kinetic Impactors [Part I & II]", page: 41, machine: "LCROSS & GRAIL" },
  { spread: 22, title: "Chapter 11: InSight (2018–2022) — The Stethoscope of Mars [Part I–IV]", page: 45, machine: "InSight" },
  { spread: 26, title: "Chapter 12: Ingenuity (2021–2024) — Wings Over Mars [Part I & II]", page: 53, machine: "Ingenuity" },
  { spread: 28, title: "Epilogue: The Guardians of Tomorrow — Celestial Archaeology", page: 57, machine: "Epilogue" },
];

const SPREADS: BookSpread[] = [
  // =========================================================================
  // SPREAD 0: COVER & TABLE OF CONTENTS (Pages 1 & 2)
  // =========================================================================
  {
    id: "cover-toc",
    chapterNumber: null,
    machineName: "Master Edition",
    spreadTitle: "The Last Signal",
    spreadSubtitle: "Monuments in the Dust",
    dateAndLocation: "The Story of NASA's Discarded Equipment on the Moon and Mars",
    leftPage: {
      heading: "The Last Signal",
      subheading: "Monuments in the Dust",
      paragraphs: [
        "Since the dawn of interplanetary exploration in the 1960s, humanity has dispatched robotic emissaries across the inner solar system. These machines did not return. They descended through alien atmospheres, touched down on cratered plains, transmitted their revelations, and fell silent.",
        "Today, hundreds of tons of authentic human hardware rest in the vacuum of the Moon and beneath the red dust storms of Mars. They are not forgotten debris; they are monuments to the curiosity and audacity of our species.",
        "Turn the pages to walk chronologically through sixty years of off-world science—from Ranger 7's high-speed dive into Mare Cognitum to InSight's seismic discoveries and Ingenuity's final airfield in Jezero Crater.",
      ],
      calloutBox: {
        title: "2026 NASA Space Apps Challenge",
        text: "Official Entry for 'Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars.' All coordinates, dates, and engineering specs derive strictly from NASA NSSDCA, PDS Geosciences, and HiRISE mission archives.",
        badge: "Official Entry",
      },
    },
    rightPage: {
      heading: "Table of Contents",
      subheading: "Chronological Field Guide (Pages 1–58)",
      paragraphs: [
        "Each chapter chronicles a milestone machine across multiple dedicated pages, balancing human-centered narrative with verified engineering telemetry.",
      ],
      takeaway: "12 Chapters · 15 Machines · 200+ Tons of Extraterrestrial Heritage · 58 Numbered Pages",
    },
  },

  // =========================================================================
  // SPREAD 1: PROLOGUE (Pages 3 & 4)
  // =========================================================================
  {
    id: "prologue",
    chapterNumber: 0,
    machineName: "Introduction",
    spreadTitle: "Prologue",
    spreadSubtitle: "The Whisper Across the Void",
    dateAndLocation: "The Moon & Mars · The Silent Monuments",
    leftPage: {
      heading: "The Silent Sentinel",
      subheading: "Where Metal Meets Martian Sand",
      paragraphs: [
        "Across the desolate orange plains of Elysium Planitia, an eerie stillness reigns. A faint breeze sweeps from the northwest, lifting microscopic grains of oxidized iron dust into the thin carbon-dioxide atmosphere.",
        "The dust grains settle softly upon a six-meter-wide expanse of dark silicon solar cells. Beneath the blanket of red soil sits a three-legged metal body, its robotic arm outstretched, resting its scoop against the ground.",
        "This is InSight. For 1,440 Martian days, it pressed a sensitive stethoscope against the breast of Mars, listening to the rumblings of deep magma chambers, the acoustic cracks of falling meteoroids, and the distant shudder of marsquakes.",
      ],
      calloutBox: {
        title: "The Anti-Textbook Mandate",
        text: "Space history is often locked behind dense encyclopedias. This book translates raw telemetry into a living, tactile journey designed for school-age explorers and casual dreamers.",
      },
    },
    rightPage: {
      heading: "The Artifacts We Leave Behind",
      subheading: "From Ranger to Ingenuity",
      paragraphs: [
        "InSight is not alone. Just a few thousand kilometers away, the twin rovers Spirit and Opportunity sleep under blankets of Martian silt. In Ares Vallis, tiny Sojourner sits beside the petals of Pathfinder. On the Moon, Ranger 7's shattered cameras lie embedded in Mare Cognitum, while Eagle's golden descent stage stands immutable in Tranquility Base.",
        "Every single nut, bolt, solar cell, and radio transmitter left on an alien surface tells a story of triumph, failure, sacrifice, and survival.",
      ],
      quote: {
        text: "We went to explore the Moon and Mars, and in doing so, we left pieces of our civilization scattered among the stars.",
        author: "Carl Sagan, Cosmos",
      },
      takeaway: "Every machine left behind is an open scientific time capsule waiting for future generations.",
    },
  },

  // =========================================================================
  // SPREAD 2: CHAPTER 1 - RANGER 7 (PART I, Pages 5 & 6)
  // =========================================================================
  {
    id: "ranger-7-part-1",
    chapterNumber: 1,
    machineName: "Ranger 7",
    spreadTitle: "Chapter 1: Ranger 7",
    spreadSubtitle: "Part I: The Suicide Dive & 6 Vidicon TV Cameras",
    dateAndLocation: "July 31, 1964 · Mare Cognitum, The Moon",
    cosparId: "1964-041A",
    heroSlug: "ranger-7",
    badge: "First Close-ups",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1964-041A" },
      { label: "Impact Velocity", value: "2.62 km/s (5,860 mph)" },
      { label: "Frames Sent", value: "4,308 TV frames" },
      { label: "Final Photo Alt", value: "480 meters (0.28s before impact)" },
    ],
    leftPage: {
      heading: "The Suicide Dive",
      subheading: "NASA's High-Stakes Gamble After Six Failures",
      paragraphs: [
        "Between 1961 and 1964, NASA launched six consecutive Ranger missions to photograph the lunar surface. Every single one failed—guidance thrusters jammed, rocket stages tumbled, or battery packs died in deep space. The agency was under immense pressure.",
        "On July 28, 1964, Ranger 7 climbed into the Florida sky atop an Atlas-Agena B rocket with one non-negotiable objective: crash directly into the Moon at bullet speed while transmitting real-time television frames until the instant of destruction.",
        "Ranger 7 had no landing legs, no retro-rockets, and no parachutes. It was an 800-pound kinetic camera pointed like a spear at the lunar plains.",
      ],
      calloutBox: {
        title: "The Pre-Apollo Question",
        text: "Before Ranger 7, astrophysicists warned that the lunar surface might be an ocean of loose, electrostatically charged dust 10 meters deep. If true, Apollo landing modules would sink and vanish.",
      },
    },
    rightPage: {
      heading: "The Vidicon Transmission",
      subheading: "4,308 Pictures in 17 Minutes",
      paragraphs: [
        "At 13:08 UTC on July 31, 1964, at an altitude of 2,110 kilometers above the Moon, Ranger 7's camera sequencer activated six Vidicon television cameras—two full-scan and four partial-scan.",
        "Radio signals took 1.3 seconds to cross the vacuum to Goldstone Deep Space Station in California. In the JPL control room, engineers held their breath as monitors flickered with crisp, high-contrast imagery.",
        "Craters within craters emerged with razor-sharp clarity, showing smooth basalt surfaces and gentle crater rims.",
      ],
      quote: {
        text: "We have pictures! Excellent pictures! All the way down to the surface!",
        author: "Dr. William Pickering, JPL Director, July 31, 1964",
      },
      takeaway: "Ranger 7 proved the Moon possessed a solid basalt crust that could bear the weight of Apollo landing gear.",
    },
  },

  // =========================================================================
  // SPREAD 3: CHAPTER 1 - RANGER 7 (PART II, Pages 7 & 8)
  // =========================================================================
  {
    id: "ranger-7-part-2",
    chapterNumber: 1,
    machineName: "Ranger 7",
    spreadTitle: "Chapter 1: Ranger 7",
    spreadSubtitle: "Part II: 480 Meters Above Mare Cognitum & The Crater",
    dateAndLocation: "July 31, 1964 · Impact Site: 10.63° S, 20.61° W",
    cosparId: "1964-041A",
    heroSlug: "ranger-7",
    badge: "Kinetic Tomb",
    image: "images/card-ranger.webp",
    imageCaption: "Ranger 7 Block III lunar impactor with high-gain directional dish and solar arrays.",
    leftPage: {
      heading: "The 480-Meter Split Second",
      subheading: "0.28 Seconds Before Annihilation",
      paragraphs: [
        "As Ranger 7 plummeted through the final seconds at 2.62 kilometers per second (5,860 mph), camera P3 scanned a patch of ground only 30 meters wide.",
        "The final frame was captured at an altitude of just 480 meters. The top half of the television scan arrived cleanly at Earth before the spacecraft struck the basalt plain, vaporizing its antenna and cutting the signal mid-raster.",
        "The impact excavated a fresh 14-meter-wide crater that sits in Mare Cognitum today, surrounded by a bright halo of lunar regolith.",
      ],
      calloutBox: {
        title: "Mare Cognitum: The Sea That Has Become Known",
        text: "In honor of Ranger 7's sacrifice, the International Astronomical Union officially renamed the impact region Mare Cognitum—The Known Sea.",
      },
    },
    rightPage: {
      heading: "Rediscovered by LROC in 2010",
      subheading: "A 14-Meter Monument in the Vacuum",
      paragraphs: [
        "Forty-six years after the impact, NASA's Lunar Reconnaissance Orbiter (LROC) flew low over Mare Cognitum and photographed the exact impact crater and dark ejecta halo created by Ranger 7.",
        "Its shattered aluminum bus, gold plating, and Vidicon glass tubes are permanently embedded in the lunar regolith—the very first American hardware resting on an alien world.",
      ],
      quote: {
        text: "Ranger 7 showed us that the Moon was a place you could land on, walk on, and return from.",
        author: "NASA Chief Scientist Homer Newell",
      },
      takeaway: "Ranger 7 sacrificed itself to give Apollo 11 a safe place to touch down five years later.",
    },
  },

  // =========================================================================
  // SPREAD 4: CHAPTER 2 - SURVEYOR 1 (PART I, Pages 9 & 10)
  // =========================================================================
  {
    id: "surveyor-1-part-1",
    chapterNumber: 2,
    machineName: "Surveyor 1",
    spreadTitle: "Chapter 2: Surveyor 1",
    spreadSubtitle: "Part I: The Radar Descent & Touchdown",
    dateAndLocation: "June 2, 1966 · Oceanus Procellarum, The Moon",
    cosparId: "1966-045A",
    heroSlug: "surveyor-1",
    badge: "First Soft Landing",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1966-045A" },
      { label: "Touchdown Speed", value: "3.5 m/s (7.8 mph)" },
      { label: "Surface Mass", value: "294.3 kg (649 lbs)" },
      { label: "Landing Coordinates", value: "2.474° S, 43.340° W" },
    ],
    leftPage: {
      heading: "The Soft Landing Gamble",
      subheading: "Autonomous Terminal Descent Without An Atmosphere",
      paragraphs: [
        "Ranger 7 had smashed into the Moon, but could human technology land gently? With no lunar atmosphere to slow a spacecraft with parachutes, Surveyor 1 had to decelerate from 9,000 km/h to zero using rocket thrusters alone.",
        "Engineers at Hughes Aircraft and JPL created a triangular three-legged spider with a solid-propellant retrorocket to bleed off 95% of its orbital velocity, followed by three throttleable liquid-fueled vernier engines controlled by Doppler radar.",
        "On June 2, 1966, Surveyor 1 plummeted toward Oceanus Procellarum—the Ocean of Storms.",
      ],
      calloutBox: {
        title: "The Radar-Triggered Free Fall",
        text: "At 3.4 meters above the surface, the Doppler radar system cut the engines to avoid blowing abrasive lunar dust into the lander's camera mirrors. Surveyor 1 free-fell through the final feet in gentle lunar gravity.",
      },
    },
    rightPage: {
      heading: "The Soil Bearing Strength",
      subheading: "Footpads Sink Only 5 Centimeters",
      paragraphs: [
        "Surveyor 1 touched down at 06:17:36 UTC with a velocity of 3.5 meters per second. Strain gauges on its three crushable aluminum honeycomb footpads recorded the shock: the surface compressed only 5 centimeters.",
        "The telemetry showed a surface bearing strength of 0.38 kg/cm²—reassuring NASA that an Apollo Lunar Module would rest solidly on the surface without toppling or sinking.",
      ],
      quote: {
        text: "Surveyor has landed! The feet are firm in the soil! The surface is solid!",
        author: "JPL Mission Control Announcement, June 2, 1966",
      },
      takeaway: "Surveyor 1 proved that autonomous radar-controlled rocket landings on the Moon were fully achievable.",
    },
  },

  // =========================================================================
  // SPREAD 5: CHAPTER 2 - SURVEYOR 1 (PART II, Pages 11 & 12)
  // =========================================================================
  {
    id: "surveyor-1-part-2",
    chapterNumber: 2,
    machineName: "Surveyor 1",
    spreadTitle: "Chapter 2: Surveyor 1",
    spreadSubtitle: "Part II: 11,237 Photos & The Lunar Chill",
    dateAndLocation: "June 2, 1966 – Jan 7, 1967 · Oceanus Procellarum",
    cosparId: "1966-045A",
    heroSlug: "surveyor-1",
    badge: "Procellarum Ghost",
    image: "images/card-surveyor.webp",
    imageCaption: "Surveyor 1 tripod lander showing steerable planar antenna and solar panel mast.",
    leftPage: {
      heading: "11,237 Televised Frames",
      subheading: "A 360-Degree Panoramic Eye on the Horizon",
      paragraphs: [
        "Mounted atop Surveyor 1 was a television camera aimed upward into a rotating mirror that could tilt and pan 360 degrees. Over the next six weeks, it transmitted 11,237 sharp television frames.",
        "It captured panoramic views of rolling crater rims, rocks cast in stark relief by the low sun, and the first photographs of the solar corona seen from another world during lunar twilight.",
      ],
      calloutBox: {
        title: "Surviving the 14-Day Lunar Night",
        text: "Lunar night lasts 354 continuous Earth hours. Temperatures drop from +120°C in sunlight to -180°C in darkness. Surveyor's silver-zinc battery froze solid, yet the spacecraft revived when sunrise returned on July 6!",
      },
    },
    rightPage: {
      heading: "The Ghost Lander of Procellarum",
      subheading: "Still Standing in the Vacuum",
      paragraphs: [
        "Surveyor 1 finally fell silent on January 7, 1967, after battery voltages decayed permanently. Without wind or water, its white paint and gold foil remain pristine.",
        "In 2009, the LROC orbiter photographed Surveyor 1 casting a crisp triangular shadow across Oceanus Procellarum, standing as steady as the morning it touched down.",
      ],
      quote: {
        text: "A silent, silver three-legged monument standing in the blackness of space.",
        author: "NASA Mission Archive",
      },
      takeaway: "Surveyor 1 gave human astronauts the confidence to step out onto the lunar dust.",
    },
  },

  // =========================================================================
  // SPREAD 6: CHAPTER 3 - APOLLO 11 EAGLE (PART I, Pages 13 & 14)
  // =========================================================================
  {
    id: "apollo-11-part-1",
    chapterNumber: 3,
    machineName: "Apollo 11 Eagle",
    spreadTitle: "Chapter 3: Apollo 11 LM Eagle",
    spreadSubtitle: "Part I: Tranquility Base & 1202 Program Alarm",
    dateAndLocation: "July 20, 1969 · Mare Tranquillitatis, The Moon",
    cosparId: "1969-059C",
    heroSlug: "apollo-11-lander",
    badge: "First Footsteps",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1969-059C" },
      { label: "Touchdown Time", value: "July 20, 1969, 20:17:40 UTC" },
      { label: "Residual Fuel", value: "25 seconds remaining" },
      { label: "Descent Mass", value: "2,034 kg (Descent Stage)" },
    ],
    leftPage: {
      heading: "Tranquility Base",
      subheading: "The 1202 Program Alarm at 1,800 Meters",
      paragraphs: [
        "At 102 hours into the flight of Apollo 11, Neil Armstrong and Buzz Aldrin separated the Lunar Module Eagle from Columbia and began their powered descent toward the Sea of Tranquility.",
        "At 1,800 meters above the lunar surface, the computer display flickered with a yellow warning: 1202 PROGRAM ALARM. The radar was overloading the Apollo Guidance Computer with data cycles.",
        "In Houston, 26-year-old guidance officer Steve Bales instantly checked his notes, verified the computer was shedding non-critical tasks, and shouted: 'GO!'",
      ],
      calloutBox: {
        title: "25 Seconds of Fuel",
        text: "Armstrong saw the autopilot steering Eagle toward a football-field-sized crater filled with Volkswagen-sized boulders. He grabbed semi-manual control, pitched forward, and skimmed over the rocks with only 25 seconds of descent fuel left.",
      },
    },
    rightPage: {
      heading: "Contact Light",
      subheading: "The Eagle Has Landed",
      paragraphs: [
        "At 20:17:39 UTC, blue lunar dust billowed as the descent engine bell hovered feet above the soil. Aldrin called out: 'Contact light! Okay, engine stop.'",
        "Eagle had settled into Tranquility Base at 0.674° N, 23.473° E. Armstrong keyed his microphone and spoke the words that echoed across Earth: 'Houston, Tranquility Base here. The Eagle has landed.'",
      ],
      quote: {
        text: "That's one small step for man, one giant leap for mankind.",
        author: "Neil Armstrong, July 20, 1969",
      },
      takeaway: "Manual piloting and human calm prevented an abort in the final seconds of Apollo 11's landing.",
    },
  },

  // =========================================================================
  // SPREAD 7: CHAPTER 3 - APOLLO 11 EAGLE (PART II, Pages 15 & 16)
  // =========================================================================
  {
    id: "apollo-11-part-2",
    chapterNumber: 3,
    machineName: "Apollo 11 Eagle",
    spreadTitle: "Chapter 3: Apollo 11 LM Eagle",
    spreadSubtitle: "Part II: The Descent Stage Monument & The Plaque",
    dateAndLocation: "July 20–21, 1969 · Tranquility Base, The Moon",
    cosparId: "1969-059C",
    heroSlug: "apollo-11-lander",
    badge: "Historic Site #1",
    image: "images/card-apollo-11.webp",
    imageCaption: "Apollo Lunar Module descent stage resting in tranquility with golden Kapton insulation.",
    leftPage: {
      heading: "The Plaque on the Strut",
      subheading: "We Came In Peace For All Mankind",
      paragraphs: [
        "When Armstrong and Aldrin fired Eagle's ascent engine to return to orbit, the 2,034-kilogram octagonal Descent Stage remained behind as their launch pad.",
        "Bolted to landing strut #1 on the ladder is a stainless steel plaque measuring 23 by 28 centimeters. It depicts the two hemispheres of Earth, signed by the three astronauts and the President.",
        "Nearby sits the Laser Ranging Retroreflector (LRRR)—a quartz prism array that scientists on Earth still bounce laser pulses off today to measure lunar orbit with millimeter accuracy.",
      ],
      calloutBox: {
        title: "The Footprints in the Regolith",
        text: "In 2012, LROC low-altitude photography resolved the individual dark foot trails beaten into the dust between Eagle, the television camera tripod, and the seismic experiment package.",
      },
    },
    rightPage: {
      heading: "A Golden Monument in the Vacuum",
      subheading: "No Wind, No Rain, No Erosion",
      paragraphs: [
        "In the airless void of the Moon, there is no wind to flutter the Kapton foil, no rain to wash away the bootprints, and no oxidation to rust the titanium struts.",
        "Eagle's descent stage stands exactly as it was left on July 21, 1969—humanity's first extraterrestrial monument.",
      ],
      quote: {
        text: "Here Men From The Planet Earth First Set Foot Upon the Moon, July 1969 A.D. We Came In Peace For All Mankind.",
        author: "Apollo 11 Plaque Inscription",
      },
      takeaway: "Tranquility Base is legally recognized as humanity's premiere cultural heritage site off Earth.",
    },
  },

  // =========================================================================
  // SPREAD 8: CHAPTER 4 - APOLLO 12 & SURVEYOR 3 (PART I, Pages 17 & 18)
  // =========================================================================
  {
    id: "apollo-12-surveyor-part-1",
    chapterNumber: 4,
    machineName: "Surveyor 3",
    spreadTitle: "Chapter 4: Apollo 12 & Surveyor 3",
    spreadSubtitle: "Part I: Pinpoint Lunar Landing: Walking to a Robot",
    dateAndLocation: "November 19, 1969 · Oceanus Procellarum, The Moon",
    cosparId: "1967-035A",
    heroSlug: "surveyor-1",
    badge: "Moon Rendezvous",
    telemetrySummary: [
      { label: "Surveyor 3 COSPAR", value: "1967-035A" },
      { label: "Intrepid COSPAR", value: "1969-099C" },
      { label: "Landing Distance", value: "160 meters (525 ft)" },
      { label: "Surveyor Surface Age", value: "942 Earth days" },
    ],
    leftPage: {
      heading: "Pinpoint Precision",
      subheading: "Landing Within Walking Distance of a Dead Probe",
      paragraphs: [
        "Four months after Apollo 11, Pete Conrad and Alan Bean rode Apollo 12's Lunar Module Intrepid down into Oceanus Procellarum with an audacious challenge: land right next to an uncrewed robotic probe.",
        "Surveyor 3 had touched down inside a crater on April 20, 1967, and fallen silent after two weeks. Could human pilots navigate with enough accuracy to visit a 2.5-year-old machine?",
        "Conrad looked out his window, spotted the distinctive crater, and brought Intrepid down just 160 meters from Surveyor 3.",
      ],
      calloutBox: {
        title: "The First Extraterrestrial Archaeology",
        text: "This was the first—and remains the only—time human beings have visited and salvaged parts from an uncrewed spacecraft resting on another celestial body.",
      },
    },
    rightPage: {
      heading: "Walking Down the Crater Rim",
      subheading: "Severing Surveyor's Camera with Bolt Cutters",
      paragraphs: [
        "On their second moonwalk, Conrad and Bean walked down the gentle 12-degree slope of Surveyor Crater. The gleaming white probe was now coated with a fine layer of tan dust kicked up by micrometeoroids and solar radiation.",
        "Using bolt cutters, the astronauts carefully sliced off Surveyor 3's television camera, its soil sampling scoop, and sections of aluminum tubing to bring them back to Earth for analysis.",
      ],
      quote: {
        text: "Hey, look at that! There it is! Right on the edge of the crater! How about that!",
        author: "Pete Conrad, Apollo 12 Commander",
      },
      takeaway: "Apollo 12 proved that pinpoint landings on other worlds were completely feasible.",
    },
  },

  // =========================================================================
  // SPREAD 9: CHAPTER 4 - APOLLO 12 & SURVEYOR 3 (PART II, Pages 19 & 20)
  // =========================================================================
  {
    id: "apollo-12-surveyor-part-2",
    chapterNumber: 4,
    machineName: "Surveyor 3",
    spreadTitle: "Chapter 4: Apollo 12 & Surveyor 3",
    spreadSubtitle: "Part II: The Harvested Camera & The Microbe Debate",
    dateAndLocation: "November 1969 · Oceanus Procellarum & Houston Cleanroom",
    cosparId: "1967-035A",
    heroSlug: "surveyor-1",
    badge: "Microbe Mystery",
    image: "images/card-surveyor.webp",
    imageCaption: "Surveyor 3 standing inside Surveyor Crater visited by Apollo 12 astronauts.",
    leftPage: {
      heading: "The Streptococcus Mitis Debate",
      subheading: "Did Earth Bacteria Survive on the Moon?",
      paragraphs: [
        "When NASA microbiologists disassembled Surveyor 3's camera inside a cleanroom at Johnson Space Center, bacterial cultures of Streptococcus mitis grew from a tiny sample of polyurethane foam.",
        "For decades, this was celebrated as proof that terrestrial bacteria could survive 2.5 years of hard vacuum, radiation, and -180°C freeze cycles.",
        "Later investigations by NASA astrobiologists revealed the sample was likely contaminated by cleanroom technicians during dissection, leading to the establishment of strict modern planetary protection cleanrooms.",
      ],
      calloutBox: {
        title: "Space Weathering Lessons",
        text: "Analysis of the returned aluminum tubes showed that micrometeoroids and solar UV radiation rapidly darkened white paint and embrittled plastics, informing all future spacecraft designs.",
      },
    },
    rightPage: {
      heading: "A Dual Monument in Procellarum",
      subheading: "Robot and Human Landing Stage Side-by-Side",
      paragraphs: [
        "Surveyor 3 still rests inside its crater with its severed camera arm held open. Just 160 meters to the north stands the golden Descent Stage of Intrepid.",
        "Together, they form a two-vessel museum display commemorating the moment human astronauts shook hands with the robotic pioneers that paved their way.",
      ],
      quote: {
        text: "They went to the Moon to find out if robots could pave the way for men; then men went to the Moon to visit the robot.",
        author: "NASA Historical Office",
      },
      takeaway: "Surveyor 3 provided the foundational baseline for modern planetary protection and material science.",
    },
  },

  // =========================================================================
  // SPREAD 10: CHAPTER 5 - APOLLO 15 LRV (PART I, Pages 21 & 22)
  // =========================================================================
  {
    id: "apollo-15-rover-part-1",
    chapterNumber: 5,
    machineName: "Apollo 15 LRV",
    spreadTitle: "Chapter 5: Apollo 15 LRV-1",
    spreadSubtitle: "Part I: The First Moon Buggy at Hadley Rille",
    dateAndLocation: "July 31, 1971 · Hadley-Apennine, The Moon",
    cosparId: "1971-063C",
    heroSlug: "apollo-15-rover",
    badge: "First Wheels",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1971-063C" },
      { label: "Total Distance", value: "27.8 km (17.3 miles)" },
      { label: "Top Speed", value: "13.0 km/h (8.0 mph)" },
      { label: "Chassis Mass", value: "210 kg (Earth) / 35 kg (Moon)" },
    ],
    leftPage: {
      heading: "The First Wheels on the Moon",
      subheading: "Unfolding an Electric Car from the Descent Stage",
      paragraphs: [
        "On Apollo 11, 12, and 14, astronauts were tethered to foot travel within a few hundred meters of their lander. Apollo 15 revolutionized lunar exploration by bringing a car: the Lunar Roving Vehicle (LRV-1).",
        "Built by Boeing and Delco, the 210-kilogram buggy was folded like an origami puzzle into quadrant 1 of the Falcon Lunar Module. When David Scott pulled deployment lanyards, torsion springs snapped the chassis and wheels into position.",
        "David Scott and James Irwin had wheels on the Moon.",
      ],
      calloutBox: {
        title: "Spun Wire-Mesh Tires",
        text: "Rubber tires would have burst in the vacuum. Delco built wheels out of woven zinc-coated piano wire mesh with titanium chevron treads for traction in soft lunar sand.",
      },
    },
    rightPage: {
      heading: "Driving Along Hadley Rille",
      subheading: "Four 0.25-Horsepower Hub Motors",
      paragraphs: [
        "Powered by two 36-volt silver-zinc batteries, LRV-1 was propelled by four independent 0.25-horsepower electric motors inside each wheel hub, steered by a central T-shaped hand controller.",
        "Scott and Irwin cruised across the undulating Apennine plains, driving right up to the rim of Hadley Rille—a 300-meter-deep volcanic canyon carving across the Moon.",
      ],
      quote: {
        text: "Man, this is really a rocking chair ride! Look at that gorge!",
        author: "David Scott, Apollo 15 Commander",
      },
      takeaway: "LRV-1 increased Apollo's exploration range tenfold, enabling the discovery of the 4.1-billion-year-old Genesis Rock.",
    },
  },

  // =========================================================================
  // SPREAD 11: CHAPTER 5 - APOLLO 15 LRV (PART II, Pages 23 & 24)
  // =========================================================================
  {
    id: "apollo-15-rover-part-2",
    chapterNumber: 5,
    machineName: "Apollo 15 LRV",
    spreadTitle: "Chapter 5: Apollo 15 LRV-1",
    spreadSubtitle: "Part II: The 100-Meter Parking Spot & The Liftoff TV",
    dateAndLocation: "August 2, 1971 · Hadley Rille: 26.13° N, 3.63° E",
    cosparId: "1971-063C",
    heroSlug: "apollo-15-rover",
    badge: "100-Year Parking",
    image: "images/card-apollo-15.webp",
    imageCaption: "Apollo 15 Lunar Roving Vehicle parked in the lunar dust at Hadley Rille.",
    leftPage: {
      heading: "The 100-Meter Parking Spot",
      subheading: "A Live Television Seat for Falcon's Liftoff",
      paragraphs: [
        "At the conclusion of their third EVA, Scott drove LRV-1 to a position precisely 100 meters east of Falcon, parked it, and aimed the RCA color television camera directly at the lander.",
        "Operated remotely from Houston by controller Ed Fendell with a 2.6-second radio delay, the camera tracked upward as Falcon's ascent engine fired—broadcasting the burst of golden exhaust live to television viewers on Earth.",
      ],
      calloutBox: {
        title: "The Fallen Astronaut Memorial",
        text: "Before parking the rover, Scott placed an aluminum sculpture named 'Fallen Astronaut' and a plaque honoring 14 American astronauts and Soviet cosmonauts who died in the pursuit of space exploration.",
      },
    },
    rightPage: {
      heading: "Parked for Eternity",
      subheading: "Tires That Will Never Go Flat",
      paragraphs: [
        "LRV-1 still rests at coordinates 26.13° N, 3.63° E. Its odometer stands frozen at 27.8 kilometers. Because its wire-mesh wheels contain no air, they will never deflate.",
        "It sits patiently in the lunar vacuum, its seat belts resting across the mesh seats, waiting for future travelers to read its dashboard gauges.",
      ],
      quote: {
        text: "It's the best set of wheels in the solar system.",
        author: "James Irwin, Apollo 15 Lunar Module Pilot",
      },
      takeaway: "LRV-1 established the operational model for all planetary rovers that followed.",
    },
  },

  // =========================================================================
  // SPREAD 12: CHAPTER 6 - VIKING 1 (PART I, Pages 25 & 26)
  // =========================================================================
  {
    id: "viking-1-part-1",
    chapterNumber: 6,
    machineName: "Viking 1",
    spreadTitle: "Chapter 6: Viking 1",
    spreadSubtitle: "Part I: Bicentennial Touchdown at Chryse Planitia",
    dateAndLocation: "July 20, 1976 · Chryse Planitia, Mars",
    cosparId: "1975-075C",
    heroSlug: "viking-1",
    badge: "First Mars Lander",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1975-075C" },
      { label: "Touchdown Speed", value: "2.4 m/s (5.4 mph)" },
      { label: "Power Source", value: "Dual SNAP-19 RTGs (70W)" },
      { label: "Operational Life", value: "2,245 Martian Sols (~6.2 yrs)" },
    ],
    leftPage: {
      heading: "Touchdown on Mars",
      subheading: "July 20, 1976 · The Golden Plains of Chryse",
      paragraphs: [
        "Seven years to the exact day after Apollo 11 landed on the Moon, NASA's Viking 1 descended into the thin carbon-dioxide atmosphere of Mars.",
        "After shedding its heat shield and deploying a 16-meter supersonic parachute, three throttleable hydrazine terminal descent engines slowed the lander to 2.4 m/s, touching down softly on the plains of Chryse Planitia.",
        "Within 25 seconds of touchdown, its scanning facsimile camera began sweeping vertically, transmitting the first photograph ever taken from the surface of Mars: footpad #3 resting in red Martian dust.",
      ],
      calloutBox: {
        title: "A Pink Sky Discovered",
        text: "Science fiction had predicted dark purple Martian skies. Viking 1 revealed that suspended airborne iron oxide dust scattered sunlight, turning the Martian daytime sky a warm salmon-pink.",
      },
    },
    rightPage: {
      heading: "The Golden Plains",
      subheading: "Rust, Basalt, and Sub-Zero Winds",
      paragraphs: [
        "Powered by two SNAP-19 Radioisotope Thermoelectric Generators (RTGs) fueled by Plutonium-238, Viking 1 operated day and night regardless of dust storms.",
        "Its meteorology boom recorded surface pressures below 1% of Earth's atmosphere and winter temperatures plunging to -120°C, recording daily weather on an alien world for over six years.",
      ],
      quote: {
        text: "Touchdown! We have touchdown! Viking 1 is on the surface of Mars!",
        author: "JPL Operations Director, July 20, 1976",
      },
      takeaway: "Viking 1 delivered humanity's first long-duration operational presence on the surface of Mars.",
    },
  },

  // =========================================================================
  // SPREAD 13: CHAPTER 6 - VIKING 1 (PART II, Pages 27 & 28)
  // =========================================================================
  {
    id: "viking-1-part-2",
    chapterNumber: 6,
    machineName: "Viking 1",
    spreadTitle: "Chapter 6: Viking 1",
    spreadSubtitle: "Part II: The Biology Mystery & The Uplink Typo",
    dateAndLocation: "1976–1982 · Chryse Planitia: 22.48° N, 312.05° E",
    cosparId: "1975-075C",
    heroSlug: "viking-1",
    badge: "Mutch Memorial",
    image: "images/card-viking-1.webp",
    imageCaption: "Viking 1 lander resting on Chryse Planitia with robotic sampler arm extended.",
    leftPage: {
      heading: "The Life Detection Mystery",
      subheading: "Labeled Release vs. Organic Chemistry",
      paragraphs: [
        "Viking 1's robotic scoop dug trenches into Chryse Planitia and dropped soil into three automated biological incubators. When nutrient broth tagged with radioactive Carbon-14 was injected, radioactive gas surged upward—a classic sign of metabolism!",
        "However, the Gas Chromatograph-Mass Spectrometer (GCMS) detected zero organic molecules. NASA concluded that hyper-reactive perchlorates and soil oxidizers, not living microbes, drove the reaction.",
      ],
      calloutBox: {
        title: "The Fatal Uplink Typo (Nov 1982)",
        text: "In November 1982, ground controllers sent an uplink command to patch battery charging code. A typo in memory address pointers accidentally overwrote antenna pointing instructions, pointing the dish away from Earth forever.",
      },
    },
    rightPage: {
      heading: "Thomas Mutch Memorial Station",
      subheading: "Rediscovered by HiRISE in 2006",
      paragraphs: [
        "NASA renamed the site the Thomas A. Mutch Memorial Station. In December 2006, the Mars Reconnaissance Orbiter photographed Viking 1 from orbit, still resting among the rocks of Chryse Planitia.",
        "Its RTG heat has decayed to a whisper, but its titanium bus stands intact, waiting for the day human explorers restore its radio antenna.",
      ],
      quote: {
        text: "Even if there is no life on Mars, Mars remains the crucible of our understanding of planetary survival.",
        author: "Carl Sagan, Cosmos",
      },
      takeaway: "Viking 1 provided the definitive physical and biological baseline for all 21st-century Mars missions.",
    },
  },

  // =========================================================================
  // SPREAD 14: CHAPTER 7 - PATHFINDER & SOJOURNER (PART I, Pages 29 & 30)
  // =========================================================================
  {
    id: "pathfinder-part-1",
    chapterNumber: 7,
    machineName: "Pathfinder & Sojourner",
    spreadTitle: "Chapter 7: Mars Pathfinder & Sojourner",
    spreadSubtitle: "Part I: Airbag Bounces & The 10.6 kg Skateboard",
    dateAndLocation: "July 4, 1997 · Ares Vallis, Mars",
    cosparId: "1996-068A",
    heroSlug: "pathfinder-sojourner",
    badge: "First Rover",
    telemetrySummary: [
      { label: "COSPAR ID", value: "1996-068A" },
      { label: "Rover Mass", value: "10.6 kg (23 lbs)" },
      { label: "Airbag Bounces", value: "15 bounces (1 km roll)" },
      { label: "Landing Coordinates", value: "19.33° N, 335.53° E" },
    ],
    leftPage: {
      heading: "Bouncing Across Ares Vallis",
      subheading: "Faster, Better, Cheaper Exploration",
      paragraphs: [
        "Twenty years after Viking, NASA proved that exploring Mars did not require billion-dollar budgets. Under the 'Faster, Better, Cheaper' doctrine, Mars Pathfinder plummeted into Mars cushioned by clusters of 24 interconnected Kevlar airbags.",
        "Impacting at 12 meters per second, Pathfinder bounced 15 times—rebounding three stories into the air—before rolling across a kilometer of ancient flood plain in Ares Vallis.",
        "When the airbags deflated and the lander's three solar petals opened like a lotus, the world caught its first glimpse of Sojourner: a six-wheeled rover the size of a microwave oven.",
      ],
      calloutBox: {
        title: "Named for Sojourner Truth",
        text: "The 10.6 kg microrover was named in honor of abolitionist and women's rights activist Sojourner Truth, chosen through a worldwide student essay competition.",
      },
    },
    rightPage: {
      heading: "Rolling Down the Ramp",
      subheading: "Rocker-Bogie Suspension in Action",
      paragraphs: [
        "On Sol 2, Sojourner crawled down Pathfinder's deployment ramp at a measured speed of 1 centimeter per second. Powered by a 16-watt solar panel, it relied on an innovative rocker-bogie suspension system.",
        "Sojourner was equipped with an Alpha Particle X-ray Spectrometer (APXS) mounted on a rear deployment arm. It snuggled against volcanic rocks informally named 'Barnacle Bill' and 'Yogi', confirming andesitic volcanic rock.",
      ],
      quote: {
        text: "The small rover that could! Sojourner has rolled onto Mars!",
        author: "Donna Shirley, JPL Mars Program Manager, July 1997",
      },
      takeaway: "Pathfinder validated the rocker-bogie mobility architecture used on Spirit, Opportunity, Curiosity, and Perseverance.",
    },
  },

  // =========================================================================
  // SPREAD 15: CHAPTER 7 - PATHFINDER & SOJOURNER (PART II, Pages 31 & 32)
  // =========================================================================
  {
    id: "pathfinder-part-2",
    chapterNumber: 7,
    machineName: "Pathfinder & Sojourner",
    spreadTitle: "Chapter 7: Mars Pathfinder & Sojourner",
    spreadSubtitle: "Part II: 83 Sols & Circling the Carl Sagan Station",
    dateAndLocation: "July 4 – Sept 27, 1997 · Ares Vallis, Mars",
    cosparId: "1996-068A",
    heroSlug: "pathfinder-sojourner",
    badge: "Carl Sagan Station",
    image: "images/card-pathfinder.webp",
    imageCaption: "Pathfinder lander petals and Sojourner microrover on the rusty plains of Ares Vallis.",
    leftPage: {
      heading: "83 Sols in Ares Vallis",
      subheading: "Designed for 7 Days, Thriving for 3 Months",
      paragraphs: [
        "Designed to survive only 7 sols, Sojourner operated for 83 sols, traversing 100 meters around the lander and sending back 550 rover photographs. Pathfinder transmitted 16,500 images and 8.5 million weather observations.",
        "On September 27, 1997 (Sol 83), Pathfinder's primary battery pack failed from severe thermal cycling. Communications ceased abruptly.",
      ],
      calloutBox: {
        title: "Sojourner's Programmed Reflex",
        text: "Sojourner's autonomous flight software contained a safeguard: if communications with the base station were lost for more than 5 days, the rover would autonomously drive in slow circles around the lander, waiting for a signal.",
      },
    },
    rightPage: {
      heading: "The Carl Sagan Memorial Station",
      subheading: "Resting in the Ancient Outflow Channel",
      paragraphs: [
        "The Pathfinder base station was posthumously renamed the Carl Sagan Memorial Station. In 2007, HiRISE satellite imagery confirmed the lander and Sojourner still resting side by side in Ares Vallis.",
        "The tiny rover is parked just meters from the petal that cradled it across 500 million kilometers of space.",
      ],
      quote: {
        text: "Sojourner proved that agile, low-cost robots could unlock the chemistry of other planets.",
        author: "NASA Discovery Program Review",
      },
      takeaway: "Pathfinder sparked global fascination, generating over 500 million website hits in the dawn of the internet.",
    },
  },

  // =========================================================================
  // SPREAD 16: CHAPTER 8 - SPIRIT & OPPORTUNITY (PART I, Pages 33 & 34)
  // =========================================================================
  {
    id: "mer-part-1",
    chapterNumber: 8,
    machineName: "Spirit & Opportunity",
    spreadTitle: "Chapter 8: Spirit & Opportunity",
    spreadSubtitle: "Part I: Gusev Crater, Meridiani & The Seized Wheel",
    dateAndLocation: "January 2004 · Gusev Crater & Meridiani Planum",
    cosparId: "2003-027A / 2003-032A",
    heroSlug: "opportunity",
    badge: "Indomitable Twins",
    telemetrySummary: [
      { label: "Design Life", value: "90 Martian Sols (each)" },
      { label: "Spirit Duration", value: "2,210 Sols (6.1 years)" },
      { label: "Opportunity Distance", value: "45.16 km (28.06 miles)" },
      { label: "Opportunity Duration", value: "5,111 Sols (14.5 years)" },
    ],
    leftPage: {
      heading: "The Indomitable Twins",
      subheading: "Warranted for 90 Days, Exploring for 15 Years",
      paragraphs: [
        "In January 2004, twin golf-cart-sized rovers named Spirit (MER-A) and Opportunity (MER-B) bounced down onto opposite sides of Mars inside giant airbag cocoons. Each was warranted for a 90-sol design lifespan.",
        "Spirit investigated the rocky volcanic floor of Gusev Crater, while Opportunity scored an interplanetary hole-in-one, rolling to a stop inside the 22-meter Eagle Crater on the smooth plains of Meridiani Planum.",
      ],
      calloutBox: {
        title: "Hematite 'Blueberries'",
        text: "Within days, Opportunity discovered millimeter-sized gray spheres nicknamed 'blueberries'—hematite concretions that formed inside gentle, liquid acidic groundwater billions of years ago.",
      },
    },
    rightPage: {
      heading: "The Dragging Wheel Breakthrough",
      subheading: "Turning Mechanical Failure into Discovery",
      paragraphs: [
        "In March 2006, Spirit's right front drive wheel motor seized up. Rather than abandon the rover, engineers drove Spirit backward, dragging the jammed wheel through the red soil like a plow.",
        "The dragging wheel churned up bright white soil with 90% pure silica content—the unmistakable chemical hallmark of ancient volcanic hot springs and steam vents!",
      ],
      quote: {
        text: "Opportunity has touched down in an ancient Martian lakebed. The evidence of water is incontrovertible.",
        author: "Steve Squyres, MER Principal Investigator",
      },
      takeaway: "The MER twins proved that liquid water once flowed across Mars for sustained geological epochs.",
    },
  },

  // =========================================================================
  // SPREAD 17: CHAPTER 8 - SPIRIT & OPPORTUNITY (PART II, Pages 35 & 36)
  // =========================================================================
  {
    id: "mer-part-2",
    chapterNumber: 8,
    machineName: "Spirit & Opportunity",
    spreadTitle: "Chapter 8: Spirit & Opportunity",
    spreadSubtitle: "Part II: The Troy Sand Trap & Marathon Valley Tomb",
    dateAndLocation: "2010–2019 · Gusev Crater & Perseverance Valley",
    cosparId: "2003-027A / 2003-032A",
    heroSlug: "opportunity",
    badge: "Marathon Record",
    image: "images/card-opportunity.webp",
    imageCaption: "Mars Exploration Rover Opportunity with solar wings outstretched in Marathon Valley.",
    leftPage: {
      heading: "The Sand Trap at Troy",
      subheading: "Spirit's Stationary Winter (2009–2010)",
      paragraphs: [
        "In April 2009, Spirit broke through a brittle crust of soil and sank into a hidden sand trap of soft iron sulfate at a site named 'Troy'. With its stuck wheel, escape was impossible.",
        "Converted into a stationary observatory, Spirit studied seasonal soil variations until the bitter Martian winter dropped solar output below 134 watt-hours. On March 22, 2010 (Sol 2210), Spirit transmitted its final words.",
      ],
      calloutBox: {
        title: "The 45.16-Kilometer Martian Marathon",
        text: "Opportunity kept driving for another eight years, crossing Victoria and Endeavour craters. In 2015, it surpassed 42.195 km—completing the first off-world marathon in human history.",
      },
    },
    rightPage: {
      heading: "My Battery Is Low and It Is Getting Dark",
      subheading: "The Planet-Encircling Storm of June 2018",
      paragraphs: [
        "On June 10, 2018, a massive global dust storm plunged Perseverance Valley into perpetual twilight. Opportunity's atmospheric opacity (tau) surged past 10.8, cutting solar power to 22 watt-hours.",
        "Science reporter Jacob Margolis captured the emotional essence of its final telemetry: 'My battery is low and it is getting dark.' For eight months, NASA beamed thousands of songs toward Mars. On February 13, 2019, NASA declared Opportunity's mission complete.",
      ],
      quote: {
        text: "To the rover that turned 90 days into 15 years: thank you, Opportunity. You showed us the red planet.",
        author: "Thomas Zurbuchen, NASA Associate Administrator",
      },
      takeaway: "Opportunity holds the all-time off-world driving record: 45.16 km across the Martian surface.",
    },
  },

  // =========================================================================
  // SPREAD 18: CHAPTER 9 - PHOENIX (PART I, Pages 37 & 38)
  // =========================================================================
  {
    id: "phoenix-part-1",
    chapterNumber: 9,
    machineName: "Phoenix",
    spreadTitle: "Chapter 9: Phoenix",
    spreadSubtitle: "Part I: Scraping Ice at Vastitas Borealis",
    dateAndLocation: "May 25, 2008 · Vastitas Borealis, Mars (68.2° N)",
    cosparId: "2007-034A",
    heroSlug: "phoenix",
    badge: "Arctic Digger",
    telemetrySummary: [
      { label: "COSPAR ID", value: "2007-034A" },
      { label: "Landing Coordinates", value: "68.2188° N, 234.2508° E" },
      { label: "Depth to Ice", value: "5 centimeters (2 inches)" },
      { label: "Operational Life", value: "161 Martian Sols" },
    ],
    leftPage: {
      heading: "The Arctic Touchdown",
      subheading: "Pulsed Hydrazine Thrusters on Martian Permafrost",
      paragraphs: [
        "While rovers explored the Martian equator, NASA launched Phoenix to the far northern arctic plains of Vastitas Borealis. Touching down with pulsed hydrazine descent thrusters, Phoenix landed safely on smooth polygonal permafrost.",
        "Equipped with a 2.35-meter robotic trenching arm, Phoenix scraped away a few centimeters of reddish soil, exposing patches of bright white material inside trenches nicknamed 'Dodo' and 'Goldilocks'.",
      ],
      calloutBox: {
        title: "Sublimating Ice in the Trench",
        text: "Over four days, Phoenix's stereo cameras watched the white chunks vanish without melting. They were sublimating directly from solid ice into vapor—direct proof of pure subsurface water ice on Mars!",
      },
    },
    rightPage: {
      heading: "Tasting Martian Water",
      subheading: "Baking Permafrost in Thermal Ovens",
      paragraphs: [
        "Phoenix scooped soil into the TEGA (Thermal and Evolved Gas Analyzer) mass spectrometer ovens, baking the samples to 1,000°C. Sensors verified pure H2O vapor along with calcium carbonate.",
        "For the first time in human history, a spacecraft had dug up and directly tasted water on another world.",
      ],
      quote: {
        text: "It is with great pride that I report: we have found water ice on Mars!",
        author: "Peter Smith, Phoenix Principal Investigator, June 2008",
      },
      takeaway: "Phoenix confirmed that northern Mars harbors vast reserves of accessible ice for future astronauts.",
    },
  },

  // =========================================================================
  // SPREAD 19: CHAPTER 9 - PHOENIX (PART II, Pages 39 & 40)
  // =========================================================================
  {
    id: "phoenix-part-2",
    chapterNumber: 9,
    machineName: "Phoenix",
    spreadTitle: "Chapter 9: Phoenix",
    spreadSubtitle: "Part II: Perchlorates & The Crushed Polar Wing",
    dateAndLocation: "2008–2010 · Vastitas Borealis: 68.22° N",
    cosparId: "2007-034A",
    heroSlug: "phoenix",
    badge: "Polar Winter",
    image: "images/card-phoenix.webp",
    imageCaption: "Phoenix Mars Lander showing octagonal solar panels and robotic digging arm.",
    leftPage: {
      heading: "The Perchlorate Discovery",
      subheading: "Natural Anti-Freeze in Martian Soil",
      paragraphs: [
        "Phoenix dissolved soil samples inside its Wet Chemistry Laboratory (MECA). To scientists' astonishment, the soil contained magnesium and calcium perchlorate salts at concentrations near 1%.",
        "Perchlorates act as a potent natural anti-freeze, dropping the freezing point of water to -70°C and explaining how microscopic brines could exist temporarily on Mars.",
      ],
      calloutBox: {
        title: "The Polar Winter Burial",
        text: "At 68° North, winter brings perpetual darkness. Temperatures plunged to -150°C, and hundreds of kilograms of solid carbon dioxide (dry ice) froze directly out of the sky onto the lander.",
      },
    },
    rightPage: {
      heading: "The Crushed Solar Wing",
      subheading: "HiRISE 2010 Forensics",
      paragraphs: [
        "Phoenix fell silent on November 2, 2008. In May 2010, when the spring sun melted the dry ice cover, NASA's MRO HiRISE camera photographed the lander.",
        "The images showed that the immense weight of the solid dry ice blanket had snapped Phoenix's eastern circular solar array, breaking its back beneath the polar snow.",
      ],
      quote: {
        text: "Phoenix gave its life to give us water.",
        author: "NASA Polar Exploration Team",
      },
      takeaway: "Phoenix completed its mission in the harshest polar environment ever survived by a planetary lander.",
    },
  },

  // =========================================================================
  // SPREAD 20: CHAPTER 10 - LCROSS & GRAIL (PART I, Pages 41 & 42)
  // =========================================================================
  {
    id: "lcross-grail-part-1",
    chapterNumber: 10,
    machineName: "LCROSS & GRAIL",
    spreadTitle: "Chapter 10: LCROSS & GRAIL",
    spreadSubtitle: "Part I: Piercing the Shadows of Cabeus Crater",
    dateAndLocation: "October 9, 2009 · South Pole, The Moon",
    cosparId: "2009-035A",
    heroSlug: "lcross",
    badge: "Cabeus Plume",
    telemetrySummary: [
      { label: "Centaur Mass", value: "2,305 kg (5,081 lbs)" },
      { label: "Impact Velocity", value: "2.5 km/s (5,600 mph)" },
      { label: "Plume Height", value: "10 km above the rim" },
      { label: "Water Detected", value: "155 ± 12 kg in the vapor" },
    ],
    leftPage: {
      heading: "Piercing Cabeus Crater",
      subheading: "A Centaur Rocket Crashing at Mach 7.3",
      paragraphs: [
        "At the Moon's south pole, deep crater floors have sat in perpetual darkness for over two billion years, frozen at temperatures colder than Pluto (-250°C). Scientists theorized that water ice lay trapped in these eternal shadows.",
        "To find out, NASA launched LCROSS guided by a spent 2,305 kg Centaur upper stage rocket on a direct collision course into Cabeus crater.",
      ],
      calloutBox: {
        title: "Flying Through the Plume",
        text: "The Centaur rocket struck Cabeus at 2.5 km/s, vaporizing ice into an expanding plume. Four minutes behind it, the LCROSS shepherding spacecraft flew straight through the plume, sniffing the vapor before its own impact.",
      },
    },
    rightPage: {
      heading: "Buckets of Lunar Water",
      subheading: "Infrared Spectrometers Confirm H2O",
      paragraphs: [
        "LCROSS's spectrometers detected the unmistakable spectral absorption bands of water vapor, hydroxyl radicals, methane, and ammonia, proving that 5.6% of Cabeus crater floor was frozen water ice!",
      ],
      quote: {
        text: "We didn't just find a little bit of water; we found buckets of it!",
        author: "Anthony Colaprete, LCROSS Project Scientist, 2009",
      },
      takeaway: "LCROSS confirmed the Moon's polar cold traps harbor billions of tons of water ice for future Artemis bases.",
    },
  },

  // =========================================================================
  // SPREAD 21: CHAPTER 10 - LCROSS & GRAIL (PART II, Pages 43 & 44)
  // =========================================================================
  {
    id: "lcross-grail-part-2",
    chapterNumber: 10,
    machineName: "LCROSS & GRAIL",
    spreadTitle: "Chapter 10: LCROSS & GRAIL",
    spreadSubtitle: "Part II: GRAIL Ebb & Flow: Sally Ride Crater Impact",
    dateAndLocation: "2012 · Moon Orbit & Goldschmidt Crater",
    cosparId: "2011-046A / 2011-046B",
    heroSlug: "grail",
    badge: "Sally Ride Site",
    image: "images/card-lcross.webp",
    imageCaption: "LCROSS kinetic impactor and GRAIL lunar gravity mapping satellites.",
    leftPage: {
      heading: "GRAIL: Ebb and Flow",
      subheading: "Mapping Gravity with Sub-Micron Precision",
      paragraphs: [
        "In 2012, twin washing-machine-sized satellites named GRAIL-A (Ebb) and GRAIL-B (Flow) flew tandem orbits just 55 km above the Moon. Bouncing radio waves between them, they measured distance changes down to one-tenth of a micron.",
        "They constructed the most detailed gravity map of any celestial body in history, revealing that the Moon's crust is far thinner and more porous than previously modeled.",
      ],
      calloutBox: {
        title: "The Sally Ride Impact Site",
        text: "With fuel exhausted, NASA deliberately guided Ebb and Flow into an unnamed mountain ridge near Goldschmidt crater on Dec 17, 2012, naming the impact site in honor of Sally Ride, the first American woman in space.",
      },
    },
    rightPage: {
      heading: "The Kinetic Sacrifice",
      subheading: "Scars That Taught Us Planetary Physics",
      paragraphs: [
        "LROC cameras pinpointed the two dark impact craters left by Ebb and Flow just 2.2 kilometers apart on the northern mountain ridge.",
        "These kinetic impactors gave their physical existence to unlock the internal structure of the Moon, leaving behind craters that bear the names of pioneers.",
      ],
      quote: {
        text: "Ebb and Flow taught us that the Moon's crust is fractured all the way down to the mantle.",
        author: "Maria Zuber, GRAIL Principal Investigator",
      },
      takeaway: "GRAIL provided the gravitational blueprints essential for future crewed landings.",
    },
  },

  // =========================================================================
  // SPREAD 22: CHAPTER 11 - INSIGHT (PART I, Pages 45 & 46)
  // =========================================================================
  {
    id: "insight-part-1",
    chapterNumber: 11,
    machineName: "InSight",
    spreadTitle: "Chapter 11: InSight",
    spreadSubtitle: "Part I: Elysium Planitia & Interactive Mars Stethoscope",
    dateAndLocation: "Nov 26, 2018 · Homestead Hollow: 4.5024° N, 135.6234° E",
    cosparId: "2018-042A",
    heroSlug: "insight",
    badge: "The Stethoscope",
    telemetrySummary: [
      { label: "COSPAR ID", value: "2018-042A" },
      { label: "Landing Date", value: "Nov 26, 2018 (19:52 UTC)" },
      { label: "Sol 1 Clean Power", value: "4,588 Wh/sol (Record)" },
      { label: "Total Quakes", value: "1,319 marsquakes detected" },
    ],
    leftPage: {
      heading: "The Stethoscope of Mars",
      subheading: "Listening to the Internal Heartbeat of an Alien Planet",
      paragraphs: [
        "While previous landers carried cameras to photograph the red surface, InSight (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport) pressed an ear against the ground.",
        "Landing inside Homestead Hollow on Nov 26, 2018, its UltraFlex wings unfurled to generate 4,588 Wh/sol—the highest solar output ever achieved by any vehicle on Mars.",
        "Its French SEIS seismometer, protected by a white Wind and Thermal Shield, was sensitive enough to detect ground vibrations smaller than the width of a single hydrogen atom.",
      ],
      calloutBox: {
        title: "Homestead Hollow Location",
        text: "Pinpointed by MRO HiRISE at 4.5024° N, 135.6234° E inside a shallow 27-meter sand-filled crater at a gentle 4-degree tilt.",
      },
    },
    rightPage: {
      heading: "Interactive Mars Stethoscope",
      subheading: "Tap Below to Listen to Authentic SEIS Sonifications",
      paragraphs: [
        "Select an authentic vibration recorded on Mars. Sped up 100x into the human audible range, these frequencies let you hear the Red Planet:",
      ],
      takeaway: "SEIS operated as the primary seismic observatory of the inner solar system from 2018 to 2022.",
    },
  },

  // =========================================================================
  // SPREAD 23: CHAPTER 11 - INSIGHT (PART II, Pages 47 & 48)
  // =========================================================================
  {
    id: "insight-part-2",
    chapterNumber: 11,
    machineName: "InSight",
    spreadTitle: "Chapter 11: InSight",
    spreadSubtitle: "Part II: P-to-S Wave Triangulation & The Sol 884 Sand Hack",
    dateAndLocation: "2019–2021 · Elysium Planitia & Cerberus Fossae",
    cosparId: "2018-042A",
    heroSlug: "insight",
    badge: "Seismic Triangulator",
    leftPage: {
      heading: "The Duricrust Mole & The Sand Hack",
      subheading: "Sol 884: Cleaning Solar Arrays With Dirt",
      paragraphs: [
        "The German HP³ 'Mole' self-hammering heat probe struck cemented duricrust at just a few centimeters. For two years, JPL engineers used the robotic scoop to pin the probe and shovel sand until burying it 37 cm deep.",
        "No dust devil ever cleaned InSight's panels. On Sol 884, engineers devised a genius counter-intuitive trick: they scooped coarse sand and trickled it above the solar wing into a wind gust. The bouncing grains knocked fine dust off, restoring +30 Wh/sol!",
      ],
      calloutBox: {
        title: "The 20 cm Duricrust Struggle",
        text: "Homestead Hollow's cemented soil provided zero friction against the probe's recoil. Though it never reached 5 meters, it gathered a full Martian year of ground thermal data.",
      },
    },
    rightPage: {
      heading: "P-to-S Wave Triangulation",
      subheading: "Calculating Epicenter Distance Across Mars",
      paragraphs: [
        "Compressional P-waves race ahead at 7.3 km/s; shear S-waves follow at 4.1 km/s. The arrival delay between P and S waves reveals the exact distance: d = Δt × 9.35 km/s.",
        "Approximately half of InSight's strongest quakes originated 1,600 km east in Cerberus Fossae, proving active magma plumes exist under Mars today.",
      ],
      takeaway: "InSight proved that Mars is seismically active, with magma plumes cracking the crust today.",
    },
  },

  // =========================================================================
  // SPREAD 24: CHAPTER 11 - INSIGHT (PART III, Pages 49 & 50)
  // =========================================================================
  {
    id: "insight-part-3",
    chapterNumber: 11,
    machineName: "InSight",
    spreadTitle: "Chapter 11: InSight",
    spreadSubtitle: "Part III: Hardware Blueprint Drawer & 2024 HiRISE",
    dateAndLocation: "2018–2026 · Elysium Planitia, Mars",
    cosparId: "2018-042A",
    heroSlug: "insight",
    badge: "Hardware Blueprint",
    leftPage: {
      heading: "Hardware Blueprint Inspector",
      subheading: "Built on Phoenix Heritage Bus by Lockheed Martin",
      paragraphs: [
        "Built upon the heritage of the Phoenix lander, InSight carries precision avionics designed to withstand cosmic radiation and Martian temperature swings of 80°C every day.",
        "On its deck sits LaRRI: a palm-sized laser retroreflector dome from the Italian Space Agency. Because it is 100% passive, future orbiters can bounce laser pulses off it for centuries to track tectonic drift.",
      ],
      calloutBox: {
        title: "2,429,807 Human Names",
        text: "Two 8mm silicon wafers carrying 2.4 million public submissions were etched with an electron beam in letters smaller than 1/1000th the width of a human hair and bolted to InSight's deck.",
      },
    },
    rightPage: {
      heading: "HiRISE Calibration & Living Science",
      subheading: "Dec 2024: Silent Satellite Dust Target",
      paragraphs: [
        "In December 2024, the HiRISE camera on MRO photographed InSight's dormant body to measure how fast rocket scorch marks fade and how passing dust devil tracks resurface Mars.",
        "In August 2024, a landmark paper in PNAS analyzed InSight's seismic wave velocities and concluded that a vast reservoir of liquid water lies fractured within the mid-crust at depths of 11.5 to 20 kilometers—enough water to fill a global ocean 1 to 2 kilometers deep!",
      ],
      takeaway: "InSight's seismic legacy continues to rewrite textbooks years after its batteries died.",
    },
  },

  // =========================================================================
  // SPREAD 25: CHAPTER 11 - INSIGHT (PART IV, Pages 51 & 52)
  // =========================================================================
  {
    id: "insight-part-4",
    chapterNumber: 11,
    machineName: "InSight",
    spreadTitle: "Chapter 11: InSight",
    spreadSubtitle: "Part IV: Disabling Survival Heaters & Sol 1436 Last Words",
    dateAndLocation: "Dec 15–21, 2022 · Loss of Signal: Sol 1440",
    cosparId: "2018-042A",
    heroSlug: "insight",
    badge: "Final Transmission",
    leftPage: {
      heading: "The Selfless Choice",
      subheading: "Turning Off Survival Heaters for Science",
      paragraphs: [
        "Every solar vehicle on Mars races against dust. From a record 4,588 Wh/sol on Sol 1, dust accumulation steadily choked InSight's UltraFlex arrays down to 275 Wh during the Sol 1350 storm.",
        "In May 2022, engineers made a deliberate sacrifice: they turned off InSight's internal survival heaters so every remaining milliampere of electricity could keep SEIS listening. Turning heaters off risked bus freeze at -95°C, but bought six precious months of seismic science!",
      ],
      calloutBox: {
        title: "November 2022 Reflection",
        text: "'I’ve been lucky enough to live on two planets. Four years ago, I arrived safely at the second one, to the delight of my family back on the first. Thanks to my team for sending me on this journey. Hope I’ve done you proud.'",
      },
    },
    rightPage: {
      heading: "The Final Transmission",
      subheading: "Sol 1436: December 11, 2022",
      paragraphs: [
        "On December 11, 2022 (Sol 1436), InSight aimed its arm-mounted camera toward SEIS for the last time. The image transfer cut out midway, leaving the lower frame black as battery voltage collapsed.",
        "On December 15 (Sol 1440), InSight missed two consecutive communication passes with the Mars Reconnaissance Orbiter. On December 21, 2022, NASA declared the mission complete.",
      ],
      quote: {
        text: "My power’s really low, so this may be the last image I can send. Don’t worry about me though: my time here has been both productive and serene. Thanks for staying with me.",
        author: "InSight's Verbatim Farewell, Sol 1436",
      },
      takeaway: "InSight died doing exactly what it was built for: listening to Mars until the final electron faded.",
    },
  },

  // =========================================================================
  // SPREAD 26: CHAPTER 12 - INGENUITY (PART I, Pages 53 & 54)
  // =========================================================================
  {
    id: "ingenuity-part-1",
    chapterNumber: 12,
    machineName: "Ingenuity",
    spreadTitle: "Chapter 12: Ingenuity",
    spreadSubtitle: "Part I: First Powered Flight on Another World",
    dateAndLocation: "April 19, 2021 · Wright Brothers Field (JZRO), Jezero Crater",
    cosparId: "2020-052B / MARS2020H (ICAO: IGY)",
    heroSlug: "ingenuity",
    badge: "Wings Over Mars",
    telemetrySummary: [
      { label: "COSPAR / NSSDCA", value: "2020-052B / MARS2020H" },
      { label: "Mass & Weight", value: "1.80 kg (0.68 kg / 6.70 N)" },
      { label: "Rotor Dynamics", value: "Coaxial 1.21 m, 2,400–2,900 RPM" },
      { label: "Flight Record", value: "72 flights · 17.02 km · 128.8 min" },
    ],
    leftPage: {
      heading: "Wings Over Mars",
      subheading: "Defying the 1% Atmospheric Density Paradox",
      paragraphs: [
        "Aerospace textbooks once declared powered flight on Mars nearly impossible: atmospheric density at Jezero Crater is only 0.014 to 0.017 kg/m³—less than 1% of Earth's sea-level density, equivalent to flying an aircraft at 30,500 meters (100,000 feet) on Earth.",
        "Ingenuity arrived strapped horizontally under the belly of the Perseverance rover. With a featherweight mass of 1.80 kg (effective Mars weight 0.68 kg / 6.70 N), it spun two 1.21-meter counter-rotating carbon fiber rotors at 2,400 to 2,900 RPM—five times faster than an Earth helicopter.",
      ],
      calloutBox: {
        title: "The 1903 Wright Flyer Swatch",
        text: "Tucked beneath Ingenuity's solar panel was a 1.5 cm × 1.5 cm swatch of unbleached muslin fabric from the lower left wing of Orville and Wilbur Wright's 1903 Wright Flyer, carrying a century of aviation heritage to Mars.",
        badge: "Historic Relic",
      },
    },
    rightPage: {
      heading: "Interactive Rotor Aerodynamics & Soundboard",
      subheading: "Drag RPM & Density to Balance 6.70 N Mars Gravity",
      paragraphs: [
        "Ingenuity must generate at least 6.70 N of lift while keeping rotor blade tips below Mach 0.70 in cold Martian CO₂. Tweak the controls below to test seasonal flight margins and listen to authentic acoustic telemetry:",
      ],
      takeaway: "Ingenuity proved that controlled aerodynamic flight in Mars's 1% atmosphere was fully achievable.",
    },
  },

  // =========================================================================
  // SPREAD 27: CHAPTER 12 - INGENUITY (PART II, Pages 55 & 56)
  // =========================================================================
  {
    id: "ingenuity-part-2",
    chapterNumber: 12,
    machineName: "Ingenuity",
    spreadTitle: "Chapter 12: Ingenuity",
    spreadSubtitle: "Part II: Discarded Monuments & The 20-Year Time Capsule",
    dateAndLocation: "Jan 18, 2024 – Present · Valinor Hills (Airfield Chi), Neretva Vallis",
    cosparId: "2020-052B / MARS2020H (ICAO: IGY)",
    heroSlug: "ingenuity",
    badge: "Valinor Hills",
    image: "images/card-ingenuity.webp",
    imageCaption: "Ingenuity Mars Helicopter standing upright at Valinor Hills with damaged rotor tips.",
    leftPage: {
      heading: "3 Discarded Hardware Monuments",
      subheading: "The Physical Heritage Across Jezero Crater",
      paragraphs: [
        "Over its 17.02-kilometer odyssey, Ingenuity left behind three distinct physical monuments across Jezero Crater, from the crater floor to the ancient river delta:",
      ],
      calloutBox: {
        title: "Flight 72 Dune Strike (Sol 1035)",
        text: "On Jan 18, 2024, featureless sand ripples in Neretva Vallis starved the downward Navcam of contrast, causing a tilted touchdown that snapped all four rotor blade tips.",
        badge: "Mission End",
      },
    },
    rightPage: {
      heading: "The 20-Year Autonomous Time Capsule",
      subheading: "Sol 1121 Final Firmware Patch (April 16, 2024 – Present)",
      paragraphs: [
        "Unlike almost every other dead rover whose electronics froze, Ingenuity is still alive on Mars right now. On April 16, 2024, before Perseverance drove out of radio range, JPL beamed a final software update turning Ingenuity into a stationary autonomous testbed.",
        "Every single morning when sunlight hits its solar array, Ingenuity wakes up, checks its battery health, logs the daily internal and external Martian temperatures, and snaps a color image with its 13MP Sony IMX214 camera into flash memory.",
        "With capacity to record roughly 20 years of daily Martian weather (through ~2044), it waits silently at Valinor Hills until future human astronauts walk up to retrieve the data.",
      ],
      quote: {
        text: "To the little helicopter that could: you gave us wings over another world.",
        author: "Bill Nelson, NASA Administrator, Jan 2024",
      },
      takeaway: "Directly validated the aerodynamic flight models now used for the Mars Sample Return helicopters and the Dragonfly nuclear octocopter to Titan.",
    },
  },

  // =========================================================================
  // SPREAD 28: EPILOGUE (Pages 57 & 58)
  // =========================================================================
  {
    id: "epilogue",
    chapterNumber: null,
    machineName: "Epilogue",
    spreadTitle: "Epilogue: The Guardians of Tomorrow",
    spreadSubtitle: "Celestial Archaeology & The Heritage of Humanity",
    dateAndLocation: "The Moon & Mars · The Next Frontier",
    leftPage: {
      heading: "Monuments in the Dust",
      subheading: "Why We Must Preserve Our Off-World Heritage",
      paragraphs: [
        "Across the Moon and Mars, more than 200 tons of human machinery rest in silence. They are not trash, nor are they discarded junk; they are monuments to the audacity of our species.",
        "From Ranger 7's shattered cameras in Mare Cognitum to Eagle's descent stage in Tranquility Base and InSight's silent solar wings in Homestead Hollow, every bolt represents the dreams of thousands of scientists and engineers.",
      ],
      calloutBox: {
        title: "Celestial Heritage Treaties",
        text: "Historians and space agencies are establishing off-world preservation zones around Apollo 11, Viking 1, and Opportunity so future tourist rockets and rover treads never disturb their bootprints.",
      },
    },
    rightPage: {
      heading: "The Last Signal Is Not The End",
      subheading: "A Message to the Explorers of Tomorrow",
      paragraphs: [
        "When an interplanetary machine sends its last signal, its mission is not over. It enters history. The scientific discoveries they made will be read by generations yet unborn.",
        "One day, human boots will kick up the dust of Elysium Planitia and Hadley Rille. Human hands will wipe the red dust from InSight's solar panels and read the names etched on its silicon chips. They were abandoned—but they will never be forgotten.",
      ],
      quote: {
        text: "They went where we could not go; they showed us who we might become.",
        author: "The Last Signal Dossier",
      },
      takeaway: "The story of NASA's discarded equipment is the opening chapter of humanity becoming an interplanetary civilization.",
    },
  },
];

export default function StoryBookPage() {
  const [spreadIndex, setSpreadIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [mobilePage, setMobilePage] = useState<"left" | "right">("left");
  const [showTocDrawer, setShowTocDrawer] = useState<boolean>(false);

  // InSight interactive states
  const [insightActiveAudio, setInsightActiveAudio] = useState<"wind" | "bloop" | "quake" | null>(null);
  const [insightGlitchFilter, setInsightGlitchFilter] = useState<boolean>(true);
  const [insightDeltaT, setInsightDeltaT] = useState<number>(180);
  const [insightSaltationBonus, setInsightSaltationBonus] = useState<number>(0);
  const [insightSaltationSparkle, setInsightSaltationSparkle] = useState<boolean>(false);
  const [insightBlueprintPart, setInsightBlueprintPart] = useState<"larri" | "names" | "cpu" | "seis">("larri");

  // Ingenuity interactive states
  const [ingenuityRpm, setIngenuityRpm] = useState<number>(2537);
  const [ingenuityDensity, setIngenuityDensity] = useState<number>(0.015);
  const [ingenuityAudioPlaying, setIngenuityAudioPlaying] = useState<boolean>(false);
  const [ingenuityHardwareId, setIngenuityHardwareId] = useState<"shield" | "blade" | "chassis">("blade");

  const ingenuityAero = calculateIngenuityAerodynamics(ingenuityDensity, ingenuityRpm);

  const playIngenuityHum = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const baseFreq = (ingenuityRpm / 60) * 2;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 2.25);
      osc2.stop(ctx.currentTime + 2.25);
      setIngenuityAudioPlaying(true);
      setTimeout(() => setIngenuityAudioPlaying(false), 2200);
    } catch {
      // AudioContext unavailable
    }
  }, [ingenuityRpm]);

  const totalSpreads = SPREADS.length;
  const currentSpread = SPREADS[spreadIndex];

  // Calculated distance for P-to-S wave triangulation
  const calculatedQuakeDistanceKm = Math.round(insightDeltaT * 9.35);
  const calculatedQuakeDegrees = (calculatedQuakeDistanceKm / 59.2).toFixed(1);

  // Synthesize realistic sound effects via Web Audio API
  const playPageTurnSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);

      osc.type = "sine";
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // AudioContext not allowed or unsupported
    }
  }, []);

  const playInSightSound = (type: "wind" | "bloop" | "quake") => {
    setInsightActiveAudio(type);
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "wind") {
        const bufferSize = ctx.sampleRate * 2.0;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 2.5;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(260, ctx.currentTime + 1.0);
        filter.frequency.linearRampToValueAtTime(90, ctx.currentTime + 2.0);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === "bloop") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(90, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.22);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.55);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.56);
      } else if (type === "quake") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(45, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(65, ctx.currentTime + 0.8);
        osc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 1.8);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.95);
      }
    } catch {
      // AudioContext unavailable
    }
    setTimeout(() => setInsightActiveAudio(null), 2000);
  };

  const handleSaltationTrick = () => {
    setInsightSaltationSparkle(true);
    setInsightSaltationBonus((prev) => Math.min(prev + 15, 60));
    playPageTurnSound();
    setTimeout(() => {
      setInsightSaltationSparkle(false);
    }, 1200);
  };

  const goToNextSpread = useCallback(() => {
    if (spreadIndex < totalSpreads - 1) {
      setIsFlipping(true);
      playPageTurnSound();
      setTimeout(() => {
        setSpreadIndex((prev) => prev + 1);
        setMobilePage("left");
        setIsFlipping(false);
      }, 150);
    }
  }, [spreadIndex, totalSpreads, playPageTurnSound]);

  const goToPrevSpread = useCallback(() => {
    if (spreadIndex > 0) {
      setIsFlipping(true);
      playPageTurnSound();
      setTimeout(() => {
        setSpreadIndex((prev) => prev - 1);
        setMobilePage("left");
        setIsFlipping(false);
      }, 150);
    }
  }, [spreadIndex, playPageTurnSound]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        goToNextSpread();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        goToPrevSpread();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSpread, goToPrevSpread]);

  const leftPageNumber = spreadIndex * 2 + 1;
  const rightPageNumber = spreadIndex * 2 + 2;

  return (
    <div className="min-h-screen bg-[#070510] text-[#f4ede0] flex flex-col selection:bg-rose-900 selection:text-white">
      <Header />

      {/* Main Reading Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-4 sm:py-6">
        {/* Top Control Bar (Jump, Chapter Indicator, Mobile Switcher) */}
        <div className="w-full max-w-5xl mb-3 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Back to story overview & Chapter pill */}
          <div className="flex items-center gap-2">
            <Link
              href="/story"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-mono text-white/80 hover:text-white transition-colors border border-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Story Hub
            </Link>

            <button
              onClick={() => setShowTocDrawer(!showTocDrawer)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 px-3 py-1.5 text-xs font-mono font-bold text-rose-300 transition-colors border border-rose-800/30 cursor-pointer"
            >
              📖 Table of Contents ({TOC_ITEMS.length} Chapters)
            </button>
          </div>

          {/* Center / Right: Progress & Mobile Page Switcher */}
          <div className="flex items-center gap-2">
            {/* Mobile Left/Right Page Toggle (Visible only on < md screens) */}
            <div className="flex md:hidden items-center rounded-xl bg-white/10 p-0.5 border border-white/15">
              <button
                onClick={() => setMobilePage("left")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  mobilePage === "left" ? "bg-rose-700 text-white shadow" : "text-white/60 hover:text-white"
                }`}
              >
                Left (Pg {leftPageNumber})
              </button>
              <button
                onClick={() => setMobilePage("right")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  mobilePage === "right" ? "bg-rose-700 text-white shadow" : "text-white/60 hover:text-white"
                }`}
              >
                Right (Pg {rightPageNumber})
              </button>
            </div>

            {/* Desktop Spread Indicator */}
            <span className="hidden md:inline font-mono text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              Spread {spreadIndex + 1} of {totalSpreads} · Pages {leftPageNumber}–{rightPageNumber} of 58
            </span>
          </div>
        </div>

        {/* Quick Drawer: Table of Contents */}
        {showTocDrawer && (
          <div className="w-full max-w-5xl mb-4 rounded-2xl border border-rose-900/40 bg-[#120b20] p-4 shadow-2xl z-30">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold">
                Jump Directly to Any Chapter
              </span>
              <button
                onClick={() => setShowTocDrawer(false)}
                className="text-xs font-mono text-white/60 hover:text-white cursor-pointer px-2 py-0.5 rounded bg-white/10"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto no-scrollbar">
              {TOC_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSpreadIndex(item.spread);
                    setMobilePage("left");
                    setShowTocDrawer(false);
                    playPageTurnSound();
                  }}
                  className={`text-left p-2 rounded-xl text-xs font-mono transition-all border ${
                    spreadIndex === item.spread
                      ? "bg-rose-900/40 text-rose-200 border-rose-700 font-bold shadow"
                      : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border-white/5"
                  }`}
                >
                  <div className="text-[10px] text-rose-400 uppercase">{item.machine}</div>
                  <div className="truncate font-sans font-medium">{item.title}</div>
                  <div className="text-[9px] text-white/50">Page {item.page}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* THE PHYSICAL BOOK CONTAINER (STRICT FIXED DIMENSIONS)                      */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-5xl mx-auto select-none">
          {/* Floating Outer Turn Arrows (Desktop) */}
          <button
            onClick={goToPrevSpread}
            disabled={spreadIndex === 0}
            className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95 cursor-pointer z-40"
            title="Turn backward"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNextSpread}
            disabled={spreadIndex === totalSpreads - 1}
            className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95 cursor-pointer z-40"
            title="Turn forward"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Silk Bookmark Ribbon hanging from top center */}
          <div className="absolute left-1/2 -top-3 -translate-x-1/2 w-4 sm:w-5 h-14 sm:h-16 bg-gradient-to-b from-rose-700 via-rose-600 to-rose-800 rounded-b shadow-lg z-30 pointer-events-none border-x border-rose-900/40">
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#070510] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
          </div>

          {/* Hardcover Outer Cosmic Leather Binding */}
          <div className="relative rounded-3xl border-4 border-[#2b1f3d] bg-gradient-to-r from-[#170e28] via-[#201538] to-[#170e28] p-2.5 sm:p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(244,63,94,0.15)]">
            {/* Dual Page Spread: EXACT FIXED HEIGHT ON ALL SPREADS */}
            <div
              className={`relative grid grid-cols-1 md:grid-cols-2 rounded-2xl bg-[#faf6ee] shadow-inner overflow-hidden transition-all duration-200 h-[640px] sm:h-[680px] md:h-[700px] min-h-[640px] md:min-h-[700px] max-h-[640px] md:max-h-[700px] ${
                isFlipping ? "scale-[0.998] opacity-95" : "scale-100 opacity-100"
              }`}
            >
              {/* Spine Crease / Center Gutter Shadow on Desktop */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-black/15 via-black/5 to-black/15 pointer-events-none z-20 shadow-inner" />

              {/* ----------------------------------------------------------------- */}
              {/* LEFT PAGE (PAGES: 1, 3, 5, 7, 9 ... 57)                           */}
              {/* ----------------------------------------------------------------- */}
              <div
                onClick={() => {
                  if (spreadIndex > 0) goToPrevSpread();
                }}
                className={`relative p-5 sm:p-6 md:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e3dac9] h-full cursor-pointer group overflow-hidden ${
                  mobilePage === "left" ? "flex" : "hidden md:flex"
                }`}
                title="Click to turn backward"
              >
                {/* Running Header */}
                <div className="flex items-center justify-between border-b border-[#e5dcce] pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8c7b70]">
                  <span>The Last Signal</span>
                  <span className="font-bold text-rose-900">{currentSpread.machineName}</span>
                </div>

                {/* Left Page Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-2.5 pr-1">
                  {/* Chapter / Machine Identifier */}
                  <div>
                    {currentSpread.chapterNumber !== null && (
                      <span className="font-mono text-xs uppercase tracking-widest text-rose-800 font-bold block mb-0.5">
                        {currentSpread.chapterNumber === 0 ? "Introduction" : `Chapter ${currentSpread.chapterNumber}`}
                      </span>
                    )}
                    <h2 className="display text-xl sm:text-2xl font-bold text-[#231815] leading-snug">
                      {currentSpread.leftPage.heading || currentSpread.spreadTitle}
                    </h2>
                    {currentSpread.leftPage.subheading && (
                      <p className="font-serif italic text-xs sm:text-sm text-[#736357] mt-0.5">
                        {currentSpread.leftPage.subheading}
                      </p>
                    )}
                  </div>

                  {/* Body Paragraphs or Custom Left Page Widgets */}
                  {currentSpread.id === "ingenuity-part-2" ? (
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.leftPage.paragraphs[0]}
                      </p>

                      {/* 3 Hardware Monuments Selector */}
                      <div className="rounded-xl border border-cyan-900/30 bg-[#edf5f7] p-2.5 shadow-sm text-[#1e2f33]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-cyan-950">
                            Hardware Monuments in Jezero
                          </span>
                          <span className="text-[9px] font-mono text-cyan-800 font-bold">
                            3 Sites Verified
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 mb-2">
                          {[
                            { id: "shield", label: "Debris Shield", sol: "Sol 30" },
                            { id: "blade", label: "Sheared Blade", sol: "Sol 1035" },
                            { id: "chassis", label: "Valinor Hills", sol: "Sol 1035+" },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setIngenuityHardwareId(item.id as typeof ingenuityHardwareId)}
                              className={`py-1 px-1 rounded font-mono text-[9px] font-bold cursor-pointer transition-colors text-center ${
                                ingenuityHardwareId === item.id
                                  ? "bg-cyan-900 text-white shadow"
                                  : "bg-[#d8e7ea] text-[#2c3e42] hover:bg-cyan-900 hover:text-white"
                              }`}
                            >
                              <span className="block truncate">{item.label}</span>
                              <span className="text-[8px] opacity-75">{item.sol}</span>
                            </button>
                          ))}
                        </div>

                        {ingenuityHardwareId === "shield" && (
                          <div className="text-[11px] font-serif leading-relaxed text-[#2c3e42] space-y-1">
                            <div className="flex justify-between font-mono text-[9px] text-cyan-900 font-bold">
                              <span>Coords: 18.4449° N, 77.4510° E</span>
                              <span>PIA24542</span>
                            </div>
                            <p>
                              Molded 0.81 m × 0.45 m graphite shell dropped to protect Ingenuity during Sky Crane landing. Rests upright 60 m east of Wright Brothers Field.
                            </p>
                            <a
                              href="https://photojournal.jpl.nasa.gov/catalog/PIA24542"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block font-mono text-[9px] text-cyan-900 font-bold hover:underline"
                            >
                              View JPL Photojournal PIA24542 ↗
                            </a>
                          </div>
                        )}

                        {ingenuityHardwareId === "blade" && (
                          <div className="text-[11px] font-serif leading-relaxed text-[#2c3e42] space-y-1">
                            <div className="flex justify-between font-mono text-[9px] text-cyan-900 font-bold">
                              <span>Coords: 18.4972° N, 77.3196° E</span>
                              <span>PIA26244</span>
                            </div>
                            <p>
                              A 15 cm outer blade tip severed during Flight 72 touchdown impact on a sand ripple, flung 15 m west of the chassis in Neretva Vallis.
                            </p>
                            <a
                              href="https://photojournal.jpl.nasa.gov/catalog/PIA26244"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block font-mono text-[9px] text-cyan-900 font-bold hover:underline"
                            >
                              View SuperCam RMI Close-up PIA26244 ↗
                            </a>
                          </div>
                        )}

                        {ingenuityHardwareId === "chassis" && (
                          <div className="text-[11px] font-serif leading-relaxed text-[#2c3e42] space-y-1">
                            <div className="flex justify-between font-mono text-[9px] text-cyan-900 font-bold">
                              <span>Coords: 18.4972° N, 77.3198° E</span>
                              <span>PIA26243</span>
                            </div>
                            <p>
                              Standing upright on all four titanium legs at Airfield Chi, elevation -2,320 m. Houses Snapdragon 801 CPU, Garmin LIDAR, and the 1903 Wright Flyer fabric swatch.
                            </p>
                            <a
                              href="https://photojournal.jpl.nasa.gov/catalog/PIA26243"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block font-mono text-[9px] text-cyan-900 font-bold hover:underline"
                            >
                              View Mastcam-Z Telephoto PIA26243 ↗
                            </a>
                          </div>
                        )}
                      </div>

                      {currentSpread.leftPage.calloutBox && (
                        <div className="rounded-xl border border-rose-900/20 bg-rose-950/5 p-2 text-[11px] text-[#4a3b32]">
                          <span className="font-bold text-rose-950 block text-[10px] uppercase mb-0.5">
                            {currentSpread.leftPage.calloutBox.title}
                          </span>
                          <p className="font-serif italic leading-relaxed text-[#5c4a3f]">
                            {currentSpread.leftPage.calloutBox.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 font-serif text-xs sm:text-sm leading-relaxed text-[#3b2d26]">
                        {currentSpread.leftPage.paragraphs.map((p, idx) => (
                          <p
                            key={idx}
                            className={
                              idx === 0
                                ? "first-letter:float-left first-letter:text-3xl first-letter:font-serif first-letter:mr-2 first-letter:font-bold first-letter:text-rose-900"
                                : ""
                            }
                          >
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Verified Telemetry Stamp Box */}
                      {currentSpread.telemetrySummary && (
                        <div className="rounded-xl border border-[#dcd1be] bg-[#f2ecde] p-2 text-[11px] font-mono text-[#4a3b32]">
                          <p className="text-[10px] uppercase font-bold text-rose-900 tracking-wider mb-1">
                            Verified Mission Telemetry
                          </p>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                            {currentSpread.telemetrySummary.map((item, idx) => (
                              <div key={idx}>
                                <span className="text-[#8c7b70] block text-[9px]">{item.label}</span>
                                <span className="font-bold text-[#231815] truncate block">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Callout Box */}
                      {currentSpread.leftPage.calloutBox && (
                        <div className="rounded-xl border border-rose-900/20 bg-rose-950/5 p-2 text-[11px] text-[#4a3b32]">
                          <div className="flex items-center justify-between mb-0.5">
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
                    </>
                  )}

                  {/* Spread 0 Cover CTA */}
                  {spreadIndex === 0 && (
                    <div className="pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNextSpread();
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-900 px-4 py-2.5 font-mono text-xs font-bold text-white shadow-lg shadow-rose-950/30 transition-all hover:bg-rose-800 cursor-pointer"
                      >
                        Open Book &amp; Start Reading 📖 <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Left Page Footer (Page Number Even) */}
                <div className="border-t border-[#e5dcce] pt-1.5 flex justify-between items-center text-[10px] font-mono text-[#8c7b70]">
                  <span>Page {leftPageNumber}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ◂ Turn Previous
                  </span>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* RIGHT PAGE (PAGES: 2, 4, 6, 8, 10 ... 58)                          */}
              {/* ----------------------------------------------------------------- */}
              <div
                onClick={() => {
                  if (spreadIndex < totalSpreads - 1) goToNextSpread();
                }}
                className={`relative p-5 sm:p-6 md:p-7 flex flex-col justify-between h-full cursor-pointer group overflow-hidden ${
                  mobilePage === "right" ? "flex" : "hidden md:flex"
                }`}
                title="Click to turn forward"
              >
                {/* Running Header */}
                <div className="flex items-center justify-between border-b border-[#e5dcce] pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8c7b70]">
                  <span>{currentSpread.spreadTitle}</span>
                  <span>{currentSpread.cosparId || "Master Chronology"}</span>
                </div>

                {/* Right Page Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-2.5 pr-1">
                  {/* Right Page Header */}
                  <div>
                    <h3 className="display text-lg sm:text-xl font-bold text-[#231815]">
                      {currentSpread.rightPage.heading || currentSpread.spreadSubtitle}
                    </h3>
                    {currentSpread.rightPage.subheading && (
                      <p className="font-serif italic text-xs sm:text-sm text-[#736357] mt-0.5">
                        {currentSpread.rightPage.subheading}
                      </p>
                    )}
                  </div>

                  {/* SPREAD 0: MASTER TABLE OF CONTENTS */}
                  {spreadIndex === 0 ? (
                    <div className="space-y-1 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-rose-900 font-bold mb-1">
                        Select a chapter to jump directly:
                      </p>
                      <div className="space-y-1 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                        {TOC_ITEMS.slice(1).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSpreadIndex(item.spread);
                              setMobilePage("left");
                              playPageTurnSound();
                            }}
                            className="w-full text-left rounded-lg p-1.5 font-serif text-xs text-[#3b2d26] hover:bg-rose-900/10 hover:text-rose-900 transition-all flex items-center justify-between border border-transparent hover:border-rose-900/20 group cursor-pointer"
                          >
                            <span className="font-medium group-hover:translate-x-0.5 transition-transform truncate mr-2">
                              {item.title}
                            </span>
                            <span className="font-mono text-[10px] text-rose-800 font-bold shrink-0">
                              p. {item.page}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : currentSpread.id === "insight-part-1" ? (
                    /* DEDICATED SPREAD 22: INSIGHT PART I (STETHOSCOPE SOUNDBOARD) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.rightPage.paragraphs?.[0]}
                      </p>
                      <div className="rounded-xl border border-rose-900/30 bg-[#f4ede0] p-2.5 shadow-sm">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-rose-900">
                            🎧 Interactive Mars Stethoscope
                          </span>
                          <span className="text-[9px] font-mono text-[#8c7b70]">Real SEIS Audio</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => playInSightSound("wind")}
                            className={`rounded-lg p-1.5 text-left font-mono text-[10px] transition-all cursor-pointer border ${
                              insightActiveAudio === "wind"
                                ? "bg-cyan-700 text-white border-cyan-800 shadow"
                                : "bg-[#ded5c5] text-[#2c221e] hover:bg-cyan-900 hover:text-white border-transparent"
                            }`}
                          >
                            <span className="block font-bold">Sol 5 Wind</span>
                            <span className="text-[8px] opacity-80">10-15 mph</span>
                          </button>
                          <button
                            onClick={() => playInSightSound("bloop")}
                            className={`rounded-lg p-1.5 text-left font-mono text-[10px] transition-all cursor-pointer border ${
                              insightActiveAudio === "bloop"
                                ? "bg-amber-700 text-white border-amber-800 shadow"
                                : "bg-[#ded5c5] text-[#2c221e] hover:bg-amber-900 hover:text-white border-transparent"
                            }`}
                          >
                            <span className="block font-bold">Sol 988 Bloop</span>
                            <span className="text-[8px] opacity-80">Meteoroid</span>
                          </button>
                          <button
                            onClick={() => playInSightSound("quake")}
                            className={`rounded-lg p-1.5 text-left font-mono text-[10px] transition-all cursor-pointer border ${
                              insightActiveAudio === "quake"
                                ? "bg-rose-700 text-white border-rose-800 shadow"
                                : "bg-[#ded5c5] text-[#2c221e] hover:bg-rose-900 hover:text-white border-transparent"
                            }`}
                          >
                            <span className="block font-bold">Sol 1222 Quake</span>
                            <span className="text-[8px] opacity-80">Mag 4.7</span>
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#736357]">Filter:</span>
                          <button
                            onClick={() => setInsightGlitchFilter(!insightGlitchFilter)}
                            className="text-rose-900 font-bold hover:underline cursor-pointer"
                          >
                            {insightGlitchFilter ? "Glitch Filter: ON (0.05–1.0 Hz)" : "Raw Clicks: ACTIVE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.id === "insight-part-2" ? (
                    /* DEDICATED SPREAD 23: INSIGHT PART II (P-S WAVE TRIANGULATION & SAND HACK) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <div className="rounded-xl border border-rose-900/30 bg-[#f4ede0] p-2.5 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-rose-900">
                            📐 P-to-S Wave Triangulator
                          </span>
                          <span className="font-mono text-xs font-bold text-rose-950">
                            {calculatedQuakeDistanceKm} km ({calculatedQuakeDegrees}°)
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[9px] text-[#736357]">
                            <span>Delay Δt: <b>{insightDeltaT}s</b></span>
                            <span className="text-rose-900 font-bold">d = Δt × 9.35 km/s</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="600"
                            value={insightDeltaT}
                            onChange={(e) => setInsightDeltaT(parseInt(e.target.value, 10))}
                            className="w-full accent-rose-900 h-1.5 bg-[#ded5c5] rounded cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Saltation Bonus Button */}
                      <div className="rounded-xl border border-amber-900/30 bg-[#f6f0e4] p-2.5 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-amber-950">
                            Sol 884 Sand Hack:
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-900">
                            +{30 + insightSaltationBonus} Wh/sol
                          </span>
                        </div>
                        <button
                          onClick={handleSaltationTrick}
                          disabled={insightSaltationSparkle}
                          className="w-full rounded-lg bg-amber-900 hover:bg-amber-800 text-white font-mono text-xs py-1.5 font-bold transition-all shadow cursor-pointer disabled:opacity-60"
                        >
                          {insightSaltationSparkle ? "Trickling Sand Over Panel..." : "Tap to Pour Sand on Panel (+30 Wh)"}
                        </button>
                      </div>
                    </div>
                  ) : currentSpread.id === "insight-part-3" ? (
                    /* DEDICATED SPREAD 24: INSIGHT PART III (HARDWARE BLUEPRINTS) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <div className="rounded-xl border border-[#dcd1be] bg-[#f2ecde] p-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-rose-950">
                            Hardware Blueprint Inspector
                          </span>
                          <span className="text-[9px] font-mono text-emerald-800 font-bold">
                            LaRRI: FUNCTIONAL
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 mb-2">
                          {[
                            { id: "larri", label: "LaRRI" },
                            { id: "names", label: "2.4M Names" },
                            { id: "cpu", label: "RAD750" },
                            { id: "seis", label: "SEIS" },
                          ].map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setInsightBlueprintPart(b.id as typeof insightBlueprintPart)}
                              className={`py-1 rounded font-mono text-[9px] font-bold cursor-pointer transition-colors ${
                                insightBlueprintPart === b.id
                                  ? "bg-rose-900 text-white"
                                  : "bg-[#ded6c7] text-[#42342c] hover:bg-rose-900 hover:text-white"
                              }`}
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>
                        <div className="font-serif text-xs text-[#42342c] min-h-[60px] leading-relaxed">
                          {insightBlueprintPart === "larri" &&
                            "Eight quartz corner cubes from Italian Space Agency (ASI). 100% passive, requires zero Watts. Future orbiters can bounce laser pulses off it for centuries."}
                          {insightBlueprintPart === "names" &&
                            "Two 8mm silicon wafers carrying 2,429,807 human names, etched with an electron beam in letters smaller than 1/1000th the width of a human hair."}
                          {insightBlueprintPart === "cpu" &&
                            "BAE Systems RAD750 radiation-hardened 32-bit PowerPC running at 115.5 MHz on VxWorks, with 128 MB DRAM and 4 GB non-volatile flash memory."}
                          {insightBlueprintPart === "seis" &&
                            "Three inverted-pendulum leaf-spring sensors inside a titanium vacuum sphere evacuated to <10⁻⁵ mbar, measuring motion down to 2.5×10⁻¹⁰ meters."}
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.id === "ingenuity-part-1" ? (
                    /* DEDICATED SPREAD 26: INGENUITY PART I (ROTOR AERODYNAMICS & 84.6 HZ HUM) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.rightPage.paragraphs?.[0]}
                      </p>

                      {/* Interactive Aerodynamics Cockpit */}
                      <div className="rounded-xl border border-cyan-900/30 bg-[#edf5f7] p-2.5 shadow-sm text-[#1e2f33]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-cyan-950">
                            ⚙️ 1% Atmosphere Aerodynamics Lab
                          </span>
                          <span className={`font-mono text-xs font-bold ${ingenuityAero.canFly ? "text-emerald-800" : "text-rose-800"}`}>
                            {ingenuityAero.liftNewtons} N ({ingenuityAero.canFly ? "LIFT OFF" : "NO LIFT"})
                          </span>
                        </div>

                        {/* Real-time Thrust & Tip Mach Readouts */}
                        <div className="grid grid-cols-2 gap-1.5 my-1.5 font-mono text-[10px]">
                          <div className="bg-white/60 p-1.5 rounded border border-cyan-900/10">
                            <span className="text-[#62777c] block text-[9px]">Generated Lift</span>
                            <span className="font-bold text-[#142327] text-xs">{ingenuityAero.liftNewtons} N</span>
                            <span className="text-[9px] text-[#738589] block">Req: 6.70 N weight</span>
                          </div>
                          <div className="bg-white/60 p-1.5 rounded border border-cyan-900/10">
                            <span className="text-[#62777c] block text-[9px]">Blade Tip Speed</span>
                            <span className="font-bold text-[#142327] text-xs">Mach {ingenuityAero.tipMach}</span>
                            <span className="text-[9px] text-[#738589] block">{ingenuityAero.tipSpeedMs} m/s (Max &lt;0.70)</span>
                          </div>
                        </div>

                        {/* Dual Sliders: RPM & Density */}
                        <div className="space-y-1.5 font-mono text-[9px]">
                          <div>
                            <div className="flex justify-between text-[#4d6368]">
                              <span>Rotor Speed: <b>{ingenuityRpm} RPM</b></span>
                              <span>2,400–2,900 RPM</span>
                            </div>
                            <input
                              type="range"
                              min="2400"
                              max="2900"
                              step="25"
                              value={ingenuityRpm}
                              onChange={(e) => setIngenuityRpm(parseInt(e.target.value, 10))}
                              className="w-full accent-cyan-900 h-1.5 bg-[#d4e4e7] rounded cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[#4d6368]">
                              <span>Air Density (ρ): <b>{ingenuityDensity.toFixed(4)} kg/m³</b></span>
                              <span>Summer 0.0115 – Winter 0.017</span>
                            </div>
                            <input
                              type="range"
                              min="0.0115"
                              max="0.0170"
                              step="0.0005"
                              value={ingenuityDensity}
                              onChange={(e) => setIngenuityDensity(parseFloat(e.target.value))}
                              className="w-full accent-cyan-900 h-1.5 bg-[#d4e4e7] rounded cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* 84.6 Hz Blade Hum Audio Player */}
                        <div className="mt-2 pt-1.5 border-t border-cyan-900/15 flex items-center justify-between">
                          <button
                            onClick={playIngenuityHum}
                            disabled={ingenuityAudioPlaying}
                            className="rounded-lg bg-cyan-900 hover:bg-cyan-800 text-white font-mono text-[10px] py-1 px-2.5 font-bold transition-all shadow cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                          >
                            <span>{ingenuityAudioPlaying ? "🔊 Playing 84.6 Hz Hum..." : "🎧 Play 84.6 Hz Blade Hum"}</span>
                          </button>
                          <a
                            href="https://pds-imaging.jpl.nasa.gov/data/mars2020/mars2020_helicam/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[9px] text-cyan-900 font-bold hover:underline"
                          >
                            PDS helicam Archive ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.id === "ingenuity-part-2" ? (
                    /* DEDICATED SPREAD 27: INGENUITY PART II (20-YEAR TIME CAPSULE & PDS ENDPOINTS) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.rightPage.paragraphs?.[0]}
                      </p>

                      {/* 20-Year Time Capsule Terminal Plate */}
                      <div className="rounded-xl border border-cyan-900/30 bg-[#edf5f7] p-2.5 shadow-sm text-[#1e2f33]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-cyan-950">
                            Autonomous 20-Year Time Capsule
                          </span>
                          <span className="text-[9px] font-mono text-emerald-800 font-bold">
                            Active Daily Through ~2044
                          </span>
                        </div>
                        <p className="font-serif text-[11px] leading-relaxed text-[#2c3e42] mb-2">
                          Wakes every morning upon sunrise, checks battery voltage, logs daily temperatures, and stores a 13 MP Sony IMX214 photo into flash memory.
                        </p>

                        {/* Official Master Link Endpoints */}
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                          <a
                            href="https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MARS2020H"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 bg-[#dbe8eb] hover:bg-cyan-900 hover:text-white transition-colors text-cyan-950 font-bold truncate text-center"
                          >
                            NSSDCA MARS2020H ↗
                          </a>
                          <a
                            href="https://naif.jpl.nasa.gov/pub/naif/MARS2020/kernels/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 bg-[#dbe8eb] hover:bg-cyan-900 hover:text-white transition-colors text-cyan-950 font-bold truncate text-center"
                          >
                            NAIF SPICE 3D Trajectory ↗
                          </a>
                          <a
                            href="https://github.com/nasa/fprime"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 bg-[#dbe8eb] hover:bg-cyan-900 hover:text-white transition-colors text-cyan-950 font-bold truncate text-center"
                          >
                            NASA F&apos; Framework ↗
                          </a>
                          <a
                            href="https://an.rsl.wustl.edu/m20/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 bg-[#dbe8eb] hover:bg-cyan-900 hover:text-white transition-colors text-cyan-950 font-bold truncate text-center"
                          >
                            Analyst&apos;s Notebook ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.image ? (
                    /* General Machine Image Plate */
                    <div className="my-2 rounded-xl overflow-hidden border border-[#e5dcce] bg-[#efe9dc] p-1.5 shadow-sm">
                      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#ded6c7]">
                        <Image
                          src={assetUrl(currentSpread.image)}
                          alt={currentSpread.spreadTitle}
                          fill
                          sizes="(min-width:768px) 400px, 100vw"
                          className="object-cover"
                        />
                      </div>
                      {currentSpread.imageCaption && (
                        <p className="mt-1 text-[10px] font-mono text-[#736357] text-center italic">
                          {currentSpread.imageCaption}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Default Paragraphs */
                    <div className="space-y-2 font-serif text-xs sm:text-sm leading-relaxed text-[#3b2d26]">
                      {currentSpread.rightPage.paragraphs?.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Quote Plate */}
                  {currentSpread.rightPage.quote && (
                    <blockquote className="my-2 border-l-2 border-rose-900 pl-2.5 italic font-serif text-xs text-[#523d32] bg-[#f4ede0] py-1.5 rounded-r">
                      &ldquo;{currentSpread.rightPage.quote.text}&rdquo;
                      <span className="block mt-0.5 font-mono not-italic text-[9px] text-[#8c7b70]">
                        — {currentSpread.rightPage.quote.author}
                      </span>
                    </blockquote>
                  )}

                  {/* Core Takeaway */}
                  {currentSpread.rightPage.takeaway && (
                    <div className="mt-2 rounded-xl border border-[#dcd1be] bg-[#f0e8d8] p-2 text-xs font-mono text-[#42342c]">
                      <span className="font-bold text-rose-900 block mb-0.5">Core Discovery:</span>
                      {currentSpread.rightPage.takeaway}
                    </div>
                  )}

                  {/* Hero Profile Deep Link */}
                  {currentSpread.heroSlug && (
                    <div className="mt-2 pt-2 border-t border-[#e5dcce] flex items-center justify-between">
                      <Link
                        href={`/heroes/${currentSpread.heroSlug}`}
                        className="font-mono text-xs text-rose-900 hover:text-rose-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Inspect Full Telemetry Dossier ➔
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right Page Footer (Page Number Odd) */}
                <div className="border-t border-[#e5dcce] pt-1.5 flex justify-between items-center text-[10px] font-mono text-[#8c7b70]">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Turn Next ▸
                  </span>
                  <span>Page {rightPageNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Ribbon */}
        <div className="w-full max-w-5xl mt-3 flex items-center justify-between text-xs font-mono text-white/50">
          <button
            onClick={goToPrevSpread}
            disabled={spreadIndex === 0}
            className="inline-flex items-center gap-1 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous Spread
          </button>

          <span className="text-center text-[11px] text-white/40">
            Use Left / Right arrow keys or tap pages to flip
          </span>

          <button
            onClick={goToNextSpread}
            disabled={spreadIndex === totalSpreads - 1}
            className="inline-flex items-center gap-1 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            Next Spread <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
