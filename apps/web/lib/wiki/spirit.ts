import type { WikiEntry } from "./types";

export const SPIRIT: WikiEntry = {
  lead: "Spirit (MER-A / MER-2, COSPAR ID: 2003-027A, NORAD: 27827) was the first of NASA's twin Mars Exploration Rovers. Landing at Columbia Memorial Station in Gusev Crater on 4 January 2004, it operated for 2,210 sols (2,269 Earth days)—24.5 times its 90-sol design life. It climbed 82 meters up Husband Hill, dragged a paralyzed wheel that uncovered 90% pure opaline silica from ancient hydrothermal steam vents, and fell silent at Troy beside Home Plate in March 2010.",
  sections: [
    {
      id: "identity",
      title: "Spacecraft identity & science payload",
      paras: [
        "In NASA's manufacturing build sequence, Spirit was designated MER-2 (built after Opportunity/MER-1), but launched first aboard a Delta II 7925 rocket from Cape Canaveral SLC-17A on 10 June 2003 at 17:58:47 UTC. Total launch mass was 1,063 kg, comprising the 185 kg rover inside a 533 kg entry aeroshell and lander with Vectran airbags.",
        "Spirit carried nine NSSDCA-catalogued science and engineering experiments: Pancam (2003-027A-01, Jim Bell), Mini-TES (2003-027A-02, Phil Christensen), Mössbauer Spectrometer (2003-027A-03, Göstar Klingelhöfer), APXS (2003-027A-04, Rudolf Rieder/Ralf Gellert), Microscopic Imager (2003-027A-05, Ken Herkenhoff), Rock Abrasion Tool (2003-027A-06, Stephen Gorevan, Honeybee Robotics), and the Magnetic Properties Experiment (2003-027A-07, Morten Bo Madsen).",
      ],
    },
    {
      id: "memorials",
      title: "World Trade Center aluminum & Columbia memorial",
      paras: [
        "The cable-shield cuff on Spirit's Rock Abrasion Tool was machined by Honeybee Robotics in Lower Manhattan from recovered September 11 World Trade Center aluminum, bearing a laser-etched U.S. flag to endure permanently on Mars.",
        "Spirit's High-Gain Antenna dish carried an aluminum memorial plaque dedicated to the seven astronauts lost aboard Space Shuttle Columbia (STS-107): Rick Husband, William McCool, Michael Anderson, Kalpana Chawla, David Brown, Laurel Clark, and Ilan Ramon. The peaks of the Columbia Hills were named in their honor.",
        "The rover deck also carried the MarsDial sundial with the phrase 'TWO WORLDS, ONE SUN' engraved alongside 'MARS' in 22 languages and drawings by schoolchildren. Inside the lander petals, an archival silica-glass mini-DVD with 3,553,268 names was fastened by LEGO Astrobot minifigures.",
      ],
    },
    {
      id: "landing",
      title: "Touchdown at Columbia Memorial Station",
      paras: [
        "On 4 January 2004 at 04:35:26 UTC (Earth Received Time), Spirit bounced 28 times enclosed within 24 deflated Vectran airbags before coming to rest at 14.5684° S, 175.472636° E (elevation -1,942 m).",
        "During descent, Spirit scattered hardware monuments across Gusev: the cruise stage debris uprange, its 78 kg heat shield at 14.565° S, 175.479° E, its backshell and parachute at 14.566° S, 175.470° E, and Columbia Memorial Station on the plain.",
      ],
    },
    {
      id: "science",
      title: "Husband Hill and hydrothermal opaline silica",
      paras: [
        "In March 2005 (Sol 420), passing dust devils swept dust from Spirit's solar panels, raising power from 60% to 93%. On 29 September 2005, Spirit conquered the 82-meter summit of Husband Hill, returning 360-degree panoramas of Gusev.",
        "On Sol 779, Spirit's right-front drive wheel failed. Driving backward and dragging the dead wheel, Spirit carved a trench at Gertrude Weise near Home Plate. On Sol 1157, APXS analysis of the bright furrow revealed 90.1% pure amorphous opaline silica (SiO2)—direct mineral proof of ancient volcanic hot springs or fumaroles.",
      ],
    },
    {
      id: "end",
      title: "Frozen at Troy",
      paras: [
        "On 1 May 2009 (Sol 1892), Spirit broke through a crust into soft ferric sulfate sand at Troy (14.5994° S, 175.5284° E) next to Home Plate. Stuck with an unfavorable 11.5° south panel tilt, Spirit could not generate enough power during the Martian winter.",
        "Spirit's final communication occurred on 22 March 2010 (Sol 2210). After more than 1,300 recovery commands via the Deep Space Network, NASA formally concluded operations on 25 May 2011. Spirit drove 7,730.50 meters across Mars.",
      ],
    },
  ],
  timeline: [
    { date: "10 June 2003", text: "Liftoff from Cape Canaveral SLC-17A on Delta II 7925." },
    { date: "4 January 2004", text: "Touchdown at Columbia Memorial Station, Gusev Crater (14.5684° S, 175.4726° E)." },
    { date: "21 January 2004", text: "Flash memory fault; recovered by 5 February." },
    { date: "6 February 2004", text: "First rock grinding on Mars with RAT on Adirondack." },
    { date: "March 2005", text: "Dust devils clean solar panels, boosting power from 60% to 93%." },
    { date: "29 September 2005", text: "Reaches summit of Husband Hill (82 m ascent)." },
    { date: "March 2006", text: "Right-front wheel motor seizes (Sol 779); begins driving backwards." },
    { date: "May 2007", text: "Dead wheel churns up 90.1% pure opaline silica at Gertrude Weise." },
    { date: "1 May 2009", text: "Stuck in ferric sulfate sand at Troy beside Home Plate." },
    { date: "22 March 2010", text: "Last transmission (Sol 2210); survival heaters freeze." },
    { date: "25 May 2011", text: "NASA formally concludes mission after 1,300+ commands." },
  ],
  facts: [
    { label: "COSPAR ID", value: "2003-027A" },
    { label: "NORAD Catalog", value: "27827" },
    { label: "Internal Designation", value: "MER-2 (launched as MER-A)" },
    { label: "Landing Site", value: "Columbia Memorial Station, Gusev Crater (-14.5684°, 175.4726°)" },
    { label: "Resting Site", value: "Troy, Home Plate (-14.5994°, 175.5284°)" },
    { label: "Total Odometer", value: "7,730.50 m (4.80 miles)" },
    { label: "Operational Life", value: "2,210 Sols (24.5× warranty)" },
    { label: "Key Discovery", value: "90.1% pure opaline silica (ancient volcanic steam vents)" },
  ],
  sources: [
    { label: "NASA NSSDCA Master Spacecraft: Spirit (2003-027A)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A" },
    { label: "PDS Geosciences Node MER Master Portal", url: "https://pds-geosciences.wustl.edu/missions/mer/index.htm" },
    { label: "NASA Science Mission: Spirit", url: "https://science.nasa.gov/mission/mer-spirit/" },
    { label: "HiRISE: Spirit Rover at Troy (ESP_021925_1650)", url: "https://www.uahirise.org/ESP_021925_1650" },
  ],
};
