import type { WikiEntry } from "./types";

export const INSIGHT: WikiEntry = {
  lead: "InSight (COSPAR ID: 2018-042A / Discovery Program #12) was NASA's first geophysical observatory on another planet. Landing at Homestead Hollow in Elysium Planitia on 26 November 2018, it operated for 1,440 sols (more than double its primary mission). Across 1,319 confirmed marsquakes, its French SEIS instrument mapped Mars's crust (24 to 72 km), thick lithosphere (400 to 600 km), and liquid metallic core (1,830 km radius). It fell silent in December 2022 after thick dust choked its UltraFlex solar panels.",
  sections: [
    {
      id: "identity",
      title: "Spacecraft registry & instruments",
      paras: [
        "InSight was launched on 5 May 2018 aboard an Atlas V 401 from Vandenberg Space Force Base SLC-3E—the first interplanetary launch from the U.S. West Coast. It flew alongside twin 6U CubeSats MarCO-A ('Eve') and MarCO-B ('Wall-E'), which provided real-time 8 kbps UHF bent-pipe telemetry relay during landing.",
        "InSight carried six NSSDCA-indexed investigations: SEIS (2018-042A-01, IPGP/CNES France), HP³ Heat Flow and Physical Properties Package (2018-042A-02, DLR Germany), RISE Doppler Geodesy (2018-042A-03, JPL), TWINS/APSS Meteorology (2018-042A-04, CAB Spain), IDC/ICC cameras (2018-042A-05), and the passive Italian LaRRI Laser Retroreflector (2018-042A-06).",
      ],
    },
    {
      id: "landing",
      title: "Touchdown at Homestead Hollow",
      paras: [
        "On 26 November 2018 at 19:52:59 UTC, InSight touched down at Homestead Hollow (a degraded 27-meter wide impact crater in western Elysium Planitia) at 4.502384° N, 135.623447° E (elevation -2,655 m).",
        "Its twin decagonal UltraFlex solar wings unfurled to a 6.0-meter span. On Sol 4 (1 December 2018), before instruments were deployed, SEIS sensors recorded the low rumble of 5 to 7 m/s Martian wind vibrating the solar panels (PIA22876)—the first audio of Martian wind ever captured.",
      ],
    },
    {
      id: "science",
      title: "Marsquakes & core discovery",
      paras: [
        "Using its 2.4-meter Instrument Deployment Arm (IDA), InSight lifted SEIS off the deck on Sol 22 and placed it directly onto the soil, later enclosing it under a white Wind and Thermal Shield. Over four years, SEIS detected 1,319 confirmed marsquakes, including the magnitude 4.7 monster quake S1222a on 4 May 2022 that reverberated globally for six hours.",
        "Seismic waveforms and RISE radio nutation tracking proved that Mars possesses a large, completely liquid iron-nickel core (1,830 ± 40 km radius) enriched with ~20% light elements (sulfur, oxygen, carbon, and hydrogen), jacketed by a thin molten silicate basal layer.",
      ],
    },
    {
      id: "mole",
      title: "The HP³ Mole & duricrust struggle",
      paras: [
        "The German HP³ self-hammering heat probe was designed to burrow 3 to 5 meters deep. Instead, it encountered an unexpected 20-centimeter cohesive cemented duricrust that caused the Mole to bounce in place due to a lack of friction against recoil.",
        "After hundreds of robotic arm maneuvers using the scoop to pin the probe against the hole wall, engineers successfully buried the Mole ~37 cm deep on Sol 754 (9 January 2021), where it recorded the thermal conductivity of the upper regolith.",
      ],
    },
    {
      id: "end",
      title: "Final transmission & time capsule",
      paras: [
        "Bolted to InSight's deck are two silicon microchips etched via electron-beam lithography carrying 2,429,807 human names submitted worldwide (PIA22101).",
        "Gradual dust buildup eventually reduced power output from 5,000 Wh/sol to less than 300 Wh/sol. InSight transmitted its final view of Homestead Hollow on 11 December 2022 (PIA25686) and fell silent after Sol 1440 (15 December 2022). NASA formally declared operations concluded on 20 December 2022.",
      ],
    },
  ],
  timeline: [
    { date: "5 May 2018", text: "Launch from Vandenberg SLC-3E on Atlas V with MarCO CubeSats." },
    { date: "26 November 2018", text: "Touchdown at Homestead Hollow, Elysium Planitia (4.5024° N, 135.6234° E)." },
    { date: "1 December 2018", text: "Sol 4: Records first authentic audio of Martian wind." },
    { date: "19 December 2018", text: "Sol 22: Robotic arm places SEIS seismometer onto Martian soil." },
    { date: "6 April 2019", text: "Sol 128: First confirmed marsquake in history (S0128a, Mag 2.1)." },
    { date: "9 January 2021", text: "Sol 754: Concludes HP³ Mole hammering after burying probe 37 cm." },
    { date: "18 September 2021", text: "Sol 1003: Records acoustic 'bloop' of a meteoroid impact excavating crater." },
    { date: "4 May 2022", text: "Sol 1222: Records magnitude 4.7 monster quake ringing for 6 hours." },
    { date: "15 December 2022", text: "Sol 1440: Final communication before dust ends mission." },
    { date: "20 December 2022", text: "NASA formally declares mission concluded after 1,440 sols." },
  ],
  facts: [
    { label: "COSPAR ID", value: "2018-042A (Discovery #12)" },
    { label: "Landing Site", value: "Homestead Hollow, Elysium Planitia (4.5024° N, 135.6234° E)" },
    { label: "Total Mass", value: "694 kg launch / 358 kg landed dry" },
    { label: "Solar Span", value: "6.0 m across deployed UltraFlex wings" },
    { label: "Total Marsquakes", value: "1,319 confirmed events" },
    { label: "Largest Quake", value: "Magnitude 4.7 (Sol 1222, 4 May 2022)" },
    { label: "Core Discovery", value: "1,830 km radius liquid Fe-Ni core" },
    { label: "Names on Deck", value: "2,429,807 on 2 silicon microchips" },
  ],
  sources: [
    { label: "NASA NSSDCA Master Record: InSight (2018-042A)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A" },
    { label: "PDS Geosciences Node: InSight Mission", url: "https://pds-geosciences.wustl.edu/missions/insight/" },
    { label: "IRIS / EarthScope Marsquake Archive (Station ELYSE)", url: "https://ds.iris.edu/mda/XB/ELYSE/" },
    { label: "HiRISE: InSight at Homestead Hollow (ESP_061684_1845)", url: "https://www.uahirise.org/ESP_061684_1845" },
  ],
};
