import type { WikiEntry } from "./types";

export const INGENUITY: WikiEntry = {
  lead: "Ingenuity (COSPAR ID: 2020-052B / NSSDCA: MARS2020H / ICAO: IGY) was the first aircraft in history to achieve powered, controlled aerodynamic flight on another planet. Built as a 30-day technology demonstration to fly in Mars's thin 1% atmosphere, it completed 72 flights across 1,002 sols (17.02 km, 128.8 minutes)—exceeding its design lifespan by 14.4×. Grounded by a rotor strike in Neretva Vallis on 18 January 2024, it continues operating autonomously at Valinor Hills as a 20-year weather time capsule.",
  sections: [
    {
      id: "identity",
      title: "Aircraft registry & aerodynamic engineering",
      paras: [
        "In international aviation records, the International Civil Aviation Organization (ICAO) designated Ingenuity as aircraft type IGY, call sign INGENUITY, and officially designated its deployment patch as Wright Brothers Field (JZRO)—the first official aerodrome outside Earth.",
        "To fly in Mars's 1% air density (~0.015 kg/m³, equivalent to 30,500 meters altitude on Earth), Ingenuity's 1.21-meter coaxial carbon-fiber blades spun at 2,400 to 2,900 RPM. Powered by six Sony/Murata Li-Ion cells charged by a SolAero solar array, it executed 30 Hz visual odometry using a Qualcomm Snapdragon 801 processor running Linux and NASA's open-source F' framework, monitored by dual radiation-tolerant TI Hercules safety watchdogs.",
      ],
    },
    {
      id: "artifacts",
      title: "Wright Flyer fabric & historical relics",
      paras: [
        "Taped under Ingenuity's solar panel with orange Kapton film is an authentic 1.5 cm × 1.5 cm swatch of unbleached 'Pride of the West' muslin fabric from the bottom-left wing of Orville and Wilbur Wright's 1903 Wright Flyer, connecting Kitty Hawk directly to Jezero Crater.",
        "Ingenuity left behind three physical sites in Jezero: its graphite-composite Debris Shield dropped on Sol 30 near Octavia E. Butler Landing (PIA24542), a sheared 15-centimeter carbon-fiber rotor blade tip resting 15 meters west of the rotorcraft in Neretva Vallis (PIA26244), and the grounded rotorcraft chassis itself standing upright on all four legs at Valinor Hills (PIA26243).",
      ],
    },
    {
      id: "scout",
      title: "Aerial scout & record flights",
      paras: [
        "On Flight 4 (Sol 69), Perseverance's SuperCam acoustic microphone recorded Ingenuity's 84.6 Hz blade-pass hum from 80 meters away—the first recording of an aircraft flying on another planet (PIA24588).",
        "During Flight 25, it set a distance record of 708.9 meters across the delta. On Flight 26, it performed aerial forensics on Perseverance's discarded backshell and supersonic parachute (PIA25236). On Flight 61 and 62, it pushed its flight envelope to a peak altitude of 24.0 meters and a record groundspeed of 10.0 m/s (22.4 mph).",
      ],
    },
    {
      id: "end",
      title: "Flight 72 and the 20-year time capsule",
      paras: [
        "On 18 January 2024 (Sol 1035, Flight 72), during a vertical positioning hop, its downward Navcam lost visual tracking over featureless sand ripples just a meter above the slope. The blades struck an inclined dune, shearing off blade tips and terminating flight capabilities.",
        "On 16 April 2024 (Sol 1121), before Perseverance drove permanently out of 914 MHz radio range, JPL uploaded a final firmware patch. Resting at Valinor Hills (18.4972° N, 77.3198° E), Ingenuity wakes daily upon sunrise, logs internal and external Martian temperatures, and records periodic color photos into onboard flash memory with storage capacity lasting through roughly 2044.",
      ],
    },
  ],
  timeline: [
    { date: "30 July 2020", text: "Liftoff from Cape Canaveral SLC-41 aboard Atlas V 541." },
    { date: "18 February 2021", text: "Touchdown at Octavia E. Butler Landing inside Perseverance's belly." },
    { date: "3 April 2021", text: "Deployed onto Wright Brothers Field (JZRO) on four legs." },
    { date: "19 April 2021", text: "Flight 1: First powered aerodynamic flight on another planet (3 m hover)." },
    { date: "30 April 2021", text: "Flight 4: SuperCam mic records first aircraft acoustic audio (84.6 Hz)." },
    { date: "19 April 2022", text: "Flight 26: Aerial inspection of Perseverance's discarded backshell & parachute." },
    { date: "5 October 2023", text: "Flight 61: Sets all-time altitude record of 24.0 meters." },
    { date: "12 October 2023", text: "Flight 62: Sets all-time speed record of 10.0 m/s (22.4 mph)." },
    { date: "18 January 2024", text: "Flight 72: Rotor blade tip strike on sand dune in Neretva Vallis." },
    { date: "16 April 2024", text: "Final Sol 1121 software patch uploaded; begins 20-year autonomous archive." },
  ],
  facts: [
    { label: "COSPAR ID", value: "2020-052B (MARS2020H)" },
    { label: "ICAO Designator", value: "IGY (Call sign: INGENUITY)" },
    { label: "First Airport", value: "JZRO (Wright Brothers Field, Jezero Crater)" },
    { label: "Mass", value: "1.80 kg (0.68 kg / 6.70 N on Mars)" },
    { label: "Rotor Span & Speed", value: "1.21 m coaxial; 2,400–2,900 RPM" },
    { label: "Total Flights", value: "72 flights (14.4× 5-flight warranty)" },
    { label: "Total Distance", value: "17,019 meters (10.56 miles)" },
    { label: "Resting Site", value: "Valinor Hills, Neretva Vallis (18.4972° N, 77.3198° E)" },
  ],
  sources: [
    { label: "NASA NSSDCA Record: Ingenuity (MARS2020H / 2020-052B)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MARS2020H" },
    { label: "NASA JPL Ingenuity Flight Log (Flights 1 to 72)", url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/" },
    { label: "PDS Cartography & Imaging Node (mars2020_helicam)", url: "https://pds-imaging.jpl.nasa.gov/data/mars2020/mars2020_helicam/" },
    { label: "HiRISE: Ingenuity in Neretva Vallis (ESP_081909_1985)", url: "https://www.uahirise.org/ESP_081909_1985" },
  ],
};
