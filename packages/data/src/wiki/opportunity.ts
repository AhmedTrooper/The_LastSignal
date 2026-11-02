import type { WikiEntry } from "./types";

export const OPPORTUNITY: WikiEntry = {
  lead: "Opportunity (MER-B / MER-1, COSPAR ID: 2003-032A, NORAD: 27849) was the second of NASA's twin Mars Exploration Rovers. Landing in Eagle Crater at Challenger Memorial Station on 25 January 2004, it operated for 5,111 sols (5,250 Earth days / 14 years, 138 days)—56.8 times its 90-sol design life. It drove 45.16 km (humanity's first interplanetary marathon), discovered hematite blueberries and jarosite confirming ancient liquid water, conducted the first forensic study of a discarded heat shield, and transmitted its final Sol 5111 telemetry packet during a planet-encircling dust storm in June 2018.",
  sections: [
    {
      id: "identity",
      title: "Spacecraft identity & science payload",
      paras: [
        "In NASA's internal build sequence, Opportunity was manufactured first and designated MER-1, but launched second on 8 July 2003 at 03:18:15 UTC (7 July 20:18:15 PDT) aboard a Delta II 7925H Heavy rocket from Cape Canaveral SLC-17B. Total launch mass was 1,063 kg, with 185 kg rover mass.",
        "Opportunity carried nine NSSDCA-catalogued science and engineering experiments: Pancam (2003-032A-01, Jim Bell), Mini-TES (2003-032A-02, Phil Christensen), Mössbauer Spectrometer (2003-032A-03, Göstar Klingelhöfer), APXS (2003-032A-04, Rudolf Rieder/Ralf Gellert), Microscopic Imager (2003-032A-05, Ken Herkenhoff), Rock Abrasion Tool (2003-032A-06, Stephen Gorevan, Honeybee Robotics), and the Magnetic Properties Experiment (2003-032A-07, Morten Bo Madsen).",
      ],
    },
    {
      id: "memorials",
      title: "World Trade Center aluminum & Challenger memorial",
      paras: [
        "Like its twin, the cable-shield cuff on Opportunity's Rock Abrasion Tool was machined in Lower Manhattan by Honeybee Robotics from recovered World Trade Center (9/11) aluminum, bearing a laser-etched U.S. flag.",
        "Opportunity's landing platform in Eagle Crater was formally dedicated as Challenger Memorial Station in honor of the STS-51-L Space Shuttle crew (Dick Scobee, Michael Smith, Judith Resnik, Ellison Onizuka, Ronald McNair, Gregory Jarvis, and Christa McAuliffe).",
        "The solar deck carried the MarsDial sundial inscribed with 'TWO WORLDS, ONE SUN' and 'MARS' in 22 languages alongside stick-figure drawings from children. Inside the lander petals, an archival silica-glass mini-DVD held 3,553,268 names fastened by LEGO Astrobot figures Biff Starling and Sandy Moondust.",
      ],
    },
    {
      id: "landing",
      title: "The interplanetary hole-in-one",
      paras: [
        "On 25 January 2004 at 05:05:11 UTC (Earth Received Time), Opportunity rolled to a stop inside the 22-meter bowl of Eagle Crater at 1.9462° S, 354.4734° E (elevation -1,384 m). It was hailed as an interplanetary 'hole-in-one' because the airbag-cushioned rover rolled directly into an exposed outcrop of layered sulfate bedrock.",
        "During Sol 325–355, Opportunity drove to its own discarded heat shield (1.959° S, 354.480° E, PIA07217), conducting humanity's first forensic study of an aeroshell thermal protection system on another planet. Right beside the debris, it discovered Heat Shield Rock (PIA07269), a 31 cm iron-nickel meteorite—the first meteorite ever identified on another world.",
      ],
    },
    {
      id: "science",
      title: "Jarosite, blueberries, and the marathon",
      paras: [
        "Within weeks of touchdown, Mössbauer spectroscopy detected Jarosite in Eagle Crater bedrock—a mineral requiring liquid, acidic water to form. The Microscopic Imager discovered spherical hematite concretions ('Martian blueberries') precipitated by ancient groundwater.",
        "On 24 March 2015, Opportunity crossed 42.195 km near Marathon Valley on the rim of 22 km Endeavour Crater, becoming the first vehicle in history to complete a marathon on another planet. At Endeavour, APXS identified the Homestake vein as pure hydrated calcium sulfate (gypsum), deposited by life-friendly, neutral-pH groundwater.",
      ],
    },
    {
      id: "end",
      title: "Sol 5111 telemetry & final farewell",
      paras: [
        "In June 2018, a planet-encircling dust storm swept across Perseverance Valley on Endeavour's rim. Atmospheric optical depth skyrocketed to tau = 10.8 (blocking 99.998% of sunlight), reducing solar array power from 600+ Wh to 22 Wh.",
        "While a poetic paraphrase went viral ('My battery is low and it's getting dark'), authentic NASA telemetry on Sol 5111 (10 June 2018) consisted of Low-Power Fault and Master Clock Fault flags alongside noisy dark frame PIA22949 (1P581919922EFFD212P2685L8M1).",
        "Following 1,000+ recovery commands, JPL flight controllers transmitted Billie Holiday's 'I\\'ll Be Seeing You' across the Goldstone DSS-14 70-meter dish on 12 February 2019 before concluding operations. Opportunity traveled 45,161.08 meters across Mars.",
      ],
    },
  ],
  timeline: [
    { date: "8 July 2003", text: "Liftoff from Cape Canaveral SLC-17B on Delta II Heavy 7925H." },
    { date: "25 January 2004", text: "Touchdown in Eagle Crater (Challenger Memorial Station, 1.9462° S, 354.4734° E)." },
    { date: "February 2004", text: "Mössbauer discovers Jarosite (acid water); MI discovers hematite blueberries." },
    { date: "January 2005", text: "Forensic study of discarded heat shield (PIA07217) & discovery of Heat Shield Rock meteorite (PIA07269)." },
    { date: "September 2006", text: "Arrives at 800-meter wide Victoria Crater." },
    { date: "9 August 2011", text: "Arrives at 22-kilometer wide Endeavour Crater." },
    { date: "24 March 2015", text: "Surpasses marathon distance (42.195 km) in Marathon Valley." },
    { date: "10 June 2018", text: "Final Sol 5111 transmission during tau=10.8 dust storm in Perseverance Valley (22 Wh, PIA22949)." },
    { date: "12 February 2019", text: "Final uplink of Billie Holiday's 'I'll Be Seeing You' from Goldstone DSS-14." },
    { date: "13 February 2019", text: "NASA formally declares mission complete after 45.16 km." },
  ],
  facts: [
    { label: "COSPAR ID", value: "2003-032A" },
    { label: "NORAD Catalog", value: "27849" },
    { label: "Internal Designation", value: "MER-1 (launched as MER-B)" },
    { label: "Landing Site", value: "Challenger Memorial Station, Eagle Crater (-1.9462°, 354.4734°)" },
    { label: "Resting Site", value: "Perseverance Valley, Endeavour Crater (-2.284°, 354.652°)" },
    { label: "Total Odometer", value: "45,161.08 m (28.06 miles / 45.16 km marathon+)" },
    { label: "Operational Life", value: "5,111 Sols (56.8× warranty)" },
    { label: "Key Discovery", value: "Jarosite, hematite blueberries & Homestake gypsum vein" },
  ],
  sources: [
    { label: "NASA NSSDCA Master Spacecraft: Opportunity (2003-032A)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A" },
    { label: "PDS Geosciences Node MER Master Portal", url: "https://pds-geosciences.wustl.edu/missions/mer/index.htm" },
    { label: "NASA Science Mission: Opportunity", url: "https://science.nasa.gov/mission/mer-opportunity/" },
    { label: "HiRISE: Opportunity Rover in Perseverance Valley (ESP_056955_1775)", url: "https://www.uahirise.org/ESP_056955_1775" },
    { label: "NASA Release 19-004: Opportunity Mission Concluded", url: "https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/" },
  ],
};
