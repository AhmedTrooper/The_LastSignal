/**
 * The archive. Facts only: every date and number here must trace to a source in `sources`.
 * Images in /public/images are AI-made placeholders (see scripts/generate-assets.mjs) and
 * should be replaced with credited NASA public-domain photos before launch.
 */

export type Body = "mars" | "moon";
export type Category = "rover" | "lander" | "helicopter" | "impactor" | "lost";

export type Chapter = { title: string; year: string; text: string; image: string };

export type Hero = {
  slug: string;
  no: number;
  name: string;
  nickname?: string;
  designation: string;
  kind: string;
  category: Category;
  body: Body;
  builder: string;
  summary: string;
  image: string;
  /** Transparent studio cut-out for exhibit cards (public/images/card-*.webp), when one exists. */
  card?: string;
  launch: { date: string; time?: string; rocket: string; pad: string };
  landing?: { date: string; site: string; method: string };
  end: { date: string; label: string; story: string };
  restingPlace: string;
  coords: { lat: number; lon: number; approx?: boolean };
  stats: { value: string; label: string; icon: "route" | "timer" | "calendar" | "spark" }[];
  specs?: { label: string; value: string }[];
  parts?: { label: string; x: number; y: number; side: "left" | "right" }[];
  chapters?: Chapter[];
  story?: Chapter[];
  discoveries?: { title: string; image: string }[];
  route?: { km: string; points: { name: string; x: number; y: number }[] };
  gallery: string[];
  twin?: string;
  sources: { label: string; url: string }[];
};

const NSSDCA = (id: string) => `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${id}`;

export const HEROES: Hero[] = [
  {
    slug: "ranger-7",
    no: 1,
    name: "Ranger 7",
    designation: "Ranger Block III lunar impactor",
    kind: "Impactor",
    category: "impactor",
    body: "moon",
    builder: "JPL",
    summary:
      "The first American spacecraft to send back close-up pictures of the Moon. It took 4,308 photographs in its last 17 minutes before striking the surface on purpose.",
    image: "ranger",
    card: "card-ranger",
    launch: { date: "1964-07-28", rocket: "Atlas LV-3 Agena-B", pad: "Launch Complex 12" },
    end: {
      date: "1964-07-31",
      label: "Impact",
      story: "Ranger 7 kept its cameras running all the way down and hit the Moon in the region later named Mare Cognitum, the Known Sea.",
    },
    restingPlace: "Mare Cognitum, Moon",
    coords: { lat: -10.6, lon: -20.7 },
    stats: [
      { value: "4,308", label: "photos sent", icon: "spark" },
      { value: "3 days", label: "Earth to Moon", icon: "timer" },
      { value: "1964", label: "first US close-ups", icon: "calendar" },
    ],
    gallery: ["ranger", "moon-globe"],
    sources: [{ label: "NSSDCA: Ranger 7", url: NSSDCA("1964-041A") }],
  },
  {
    slug: "surveyor-1",
    no: 2,
    name: "Surveyor 1",
    designation: "Surveyor lunar lander",
    kind: "Lander",
    category: "lander",
    body: "moon",
    builder: "Hughes Aircraft",
    summary:
      "The first American spacecraft to soft-land on the Moon. It proved the ground could hold a lander, three years before Apollo 11.",
    image: "surveyor",
    card: "card-surveyor",
    launch: { date: "1966-05-30", rocket: "Atlas-Centaur", pad: "Launch Complex 36A" },
    landing: { date: "1966-06-02", site: "Oceanus Procellarum", method: "Retro-rocket soft landing" },
    end: {
      date: "1967-01-07",
      label: "Last signal",
      story: "Surveyor 1 survived the long lunar nights and answered Earth on and off for seven months before its final contact in January 1967.",
    },
    restingPlace: "Oceanus Procellarum, Moon",
    coords: { lat: -2.47, lon: -43.34 },
    stats: [
      { value: "11,000+", label: "photos sent", icon: "spark" },
      { value: "7 months", label: "of contact", icon: "timer" },
      { value: "1966", label: "first US soft landing", icon: "calendar" },
    ],
    gallery: ["surveyor", "moon-globe"],
    sources: [{ label: "NSSDCA: Surveyor 1", url: NSSDCA("1966-045A") }],
  },
  {
    slug: "apollo-11-lander",
    no: 3,
    name: "Apollo 11 lander",
    nickname: "Eagle",
    designation: "Lunar Module LM-5, descent stage",
    kind: "Lander",
    category: "lander",
    body: "moon",
    builder: "Grumman",
    summary:
      "The descent stage of the Lunar Module Eagle carried the first people to land on the Moon. It stayed behind as the launch pad for their trip home and still stands at Tranquility Base.",
    image: "apollo",
    card: "card-apollo",
    launch: { date: "1969-07-16", time: "09:32 EDT", rocket: "Saturn V", pad: "Launch Complex 39A" },
    landing: { date: "1969-07-20", site: "Mare Tranquillitatis", method: "Crewed powered descent" },
    end: {
      date: "1969-07-21",
      label: "Left behind",
      story: "On 21 July 1969 the ascent stage lifted off from the descent stage and left it at Tranquility Base, with a plaque on one leg.",
    },
    restingPlace: "Tranquility Base, Moon",
    coords: { lat: 0.67, lon: 23.47 },
    stats: [
      { value: "21.5 h", label: "on the surface", icon: "timer" },
      { value: "2", label: "astronauts landed", icon: "spark" },
      { value: "1969", label: "first crewed landing", icon: "calendar" },
    ],
    gallery: ["apollo", "moon-globe"],
    sources: [{ label: "NSSDCA: Apollo 11 Lunar Module", url: NSSDCA("1969-059C") }],
  },
  {
    slug: "apollo-15-rover",
    no: 4,
    name: "Lunar Roving Vehicle",
    nickname: "LRV-1",
    designation: "Apollo 15 Lunar Roving Vehicle",
    kind: "Rover",
    category: "rover",
    body: "moon",
    builder: "Boeing",
    summary:
      "The first car driven on the Moon. Apollo 15's rover let astronauts travel far beyond the lander, to the edge of Hadley Rille.",
    image: "lrv",
    card: "card-lrv",
    launch: { date: "1971-07-26", rocket: "Saturn V", pad: "Launch Complex 39A" },
    landing: { date: "1971-07-30", site: "Hadley–Apennine", method: "Folded on the Lunar Module" },
    end: {
      date: "1971-08-02",
      label: "Last signal",
      story: "Parked away from the lander, the rover's TV camera broadcast the crew's liftoff to Earth, then stayed behind.",
    },
    restingPlace: "Hadley–Apennine, Moon",
    coords: { lat: 26.13, lon: 3.63 },
    stats: [
      { value: "27.8 km", label: "driven", icon: "route" },
      { value: "3", label: "moonwalks", icon: "spark" },
      { value: "1971", label: "first car on the Moon", icon: "calendar" },
    ],
    gallery: ["lrv", "apollo", "moon-globe"],
    sources: [{ label: "NSSDCA: Apollo 15", url: NSSDCA("1971-063C") }],
  },
  {
    slug: "viking-1",
    no: 5,
    name: "Viking 1",
    designation: "Viking 1 lander",
    kind: "Lander",
    category: "lander",
    body: "mars",
    builder: "Martin Marietta",
    summary:
      "The first American spacecraft to land on Mars and work there. It sent back the first pictures from the surface and searched the soil for signs of life.",
    image: "viking-1",
    card: "card-viking-1",
    launch: { date: "1975-08-20", rocket: "Titan IIIE-Centaur", pad: "Launch Complex 41" },
    landing: { date: "1976-07-20", site: "Chryse Planitia", method: "Parachute and retro-rockets" },
    end: {
      date: "1982-11-11",
      label: "Last signal",
      story: "After more than six years on Mars, a faulty command sent from Earth cut the link. Viking 1 was never heard from again.",
    },
    restingPlace: "Chryse Planitia, Mars",
    coords: { lat: 22.27, lon: -47.95 },
    stats: [
      { value: "2,245", label: "sols on Mars", icon: "timer" },
      { value: "6+ years", label: "on Mars", icon: "calendar" },
      { value: "1976", label: "first US Mars landing", icon: "spark" },
    ],
    gallery: ["viking-1", "viking-2", "crater"],
    twin: "viking-2",
    sources: [{ label: "NSSDCA: Viking 1 Lander", url: NSSDCA("1975-075C") }],
  },
  {
    slug: "viking-2",
    no: 6,
    name: "Viking 2",
    designation: "Viking 2 lander",
    kind: "Lander",
    category: "lander",
    body: "mars",
    builder: "Martin Marietta",
    summary:
      "Viking 1's twin landed on the far side of Mars, on the plains of Utopia Planitia, and photographed frost on the ground in winter.",
    image: "viking-2",
    card: "card-viking-2",
    launch: { date: "1975-09-09", rocket: "Titan IIIE-Centaur", pad: "Launch Complex 41" },
    landing: { date: "1976-09-03", site: "Utopia Planitia", method: "Parachute and retro-rockets" },
    end: {
      date: "1980-04-11",
      label: "Last signal",
      story: "Its batteries failed in April 1980 and Viking 2 fell silent.",
    },
    restingPlace: "Utopia Planitia, Mars",
    coords: { lat: 47.64, lon: 134.29 },
    stats: [
      { value: "1,281", label: "sols on Mars", icon: "timer" },
      { value: "3+ years", label: "on Mars", icon: "calendar" },
      { value: "Frost", label: "seen on Mars", icon: "spark" },
    ],
    gallery: ["viking-2", "viking-1"],
    twin: "viking-1",
    sources: [{ label: "NSSDCA: Viking 2 Lander", url: NSSDCA("1975-083C") }],
  },
  {
    slug: "pathfinder-sojourner",
    no: 7,
    name: "Pathfinder & Sojourner",
    nickname: "Carl Sagan Memorial Station",
    designation: "Mars Pathfinder lander and Sojourner rover",
    kind: "Lander + rover",
    category: "rover",
    body: "mars",
    builder: "JPL",
    summary:
      "Pathfinder bounced to a stop on airbags and released Sojourner, the first wheeled rover to drive on another planet.",
    image: "pathfinder",
    card: "card-pathfinder",
    launch: { date: "1996-12-04", rocket: "Delta II 7925", pad: "Space Launch Complex 17B" },
    landing: { date: "1997-07-04", site: "Ares Vallis", method: "Airbag landing" },
    end: {
      date: "1997-09-27",
      label: "Last signal",
      story: "The lander's last full transmission came on 27 September 1997. Sojourner, which talked to Earth through the lander, went quiet with it.",
    },
    restingPlace: "Ares Vallis, Mars",
    coords: { lat: 19.13, lon: -33.22 },
    stats: [
      { value: "83", label: "sols of contact", icon: "timer" },
      { value: "10.6 kg", label: "rover mass", icon: "spark" },
      { value: "1997", label: "first rover on Mars", icon: "calendar" },
    ],
    gallery: ["pathfinder", "sojourner", "landing"],
    sources: [{ label: "NSSDCA: Mars Pathfinder", url: NSSDCA("1996-068A") }],
  },
  {
    slug: "mars-polar-lander",
    no: 8,
    name: "Mars Polar Lander",
    designation: "Mars Surveyor '98 lander",
    kind: "Lander",
    category: "lost",
    body: "mars",
    builder: "Lockheed Martin",
    summary:
      "Built to dig near the south pole of Mars, it went silent as it began its descent and was never heard from again.",
    image: "polar-lander",
    card: "card-polar-lander",
    launch: { date: "1999-01-03", rocket: "Delta II 7425", pad: "Space Launch Complex 17B" },
    end: {
      date: "1999-12-03",
      label: "Lost on arrival",
      story: "Contact ended as planned before atmospheric entry and never came back. The likeliest cause is that the engines shut off too early, before touchdown.",
    },
    restingPlace: "Planum Australe, Mars (presumed)",
    coords: { lat: -76, lon: 165, approx: true },
    stats: [
      { value: "11 months", label: "in flight", icon: "timer" },
      { value: "0", label: "signals from the surface", icon: "spark" },
      { value: "1999", label: "lost on arrival", icon: "calendar" },
    ],
    gallery: ["polar-lander"],
    sources: [{ label: "NSSDCA: Mars Polar Lander", url: NSSDCA("1999-001A") }],
  },
  {
    slug: "spirit",
    no: 9,
    name: "Spirit",
    designation: "Mars Exploration Rover A",
    kind: "Rover",
    category: "rover",
    body: "mars",
    builder: "JPL",
    summary:
      "Opportunity's twin. Spirit climbed the Columbia Hills and, even with one wheel dragging, uncovered nearly pure silica that pointed to ancient hot springs.",
    image: "spirit",
    card: "card-spirit",
    launch: { date: "2003-06-10", rocket: "Delta II 7925", pad: "Space Launch Complex 17A" },
    landing: { date: "2004-01-04", site: "Gusev crater", method: "Airbag landing" },
    end: {
      date: "2010-03-22",
      label: "Last signal",
      story: "Stuck in soft sand at a spot called Troy since 2009, Spirit could not tilt its panels toward the winter sun. It last called home on 22 March 2010.",
    },
    restingPlace: "Gusev crater, Mars",
    coords: { lat: -14.57, lon: 175.48 },
    stats: [
      { value: "7.73 km", label: "driven", icon: "route" },
      { value: "90", label: "sols planned", icon: "timer" },
      { value: "6+ years", label: "on Mars", icon: "calendar" },
    ],
    specs: [
      { label: "Builder", value: "JPL" },
      { label: "Mass", value: "185 kg" },
      { label: "Height", value: "1.5 m" },
    ],
    chapters: [
      { title: "Gusev crater", year: "2004", text: "Landed on 4 January 2004 in a crater thought to hold an ancient lake bed.", image: "crater" },
      { title: "Columbia Hills", year: "2004–2005", text: "Climbed the hills and reached the summit of Husband Hill in 2005.", image: "spirit" },
      { title: "Silica", year: "2007", text: "A dragging wheel churned up soil that was nearly pure silica.", image: "tracks" },
      { title: "Troy", year: "2009–2010", text: "Wheels broke through a crust into soft sand and Spirit could not get free.", image: "story-storm" },
    ],
    gallery: ["spirit", "crater", "tracks", "landing"],
    twin: "opportunity",
    sources: [{ label: "NASA Science: Spirit", url: "https://science.nasa.gov/mission/mer-spirit/" }],
  },
  {
    slug: "opportunity",
    no: 10,
    name: "Opportunity",
    nickname: "Oppy",
    designation: "Mars Exploration Rover B",
    kind: "Rover",
    category: "rover",
    body: "mars",
    builder: "JPL",
    summary:
      "Planned for 90 sols, Opportunity drove for more than 14 years. It crossed 45 km of Mars and found clear evidence that water once soaked its rocks.",
    image: "opportunity",
    card: "card-opportunity",
    launch: { date: "2003-07-07", time: "23:18 EDT", rocket: "Delta II 7925H", pad: "Space Launch Complex 17B" },
    landing: { date: "2004-01-25", site: "Eagle crater", method: "Airbag landing" },
    end: {
      date: "2018-06-10",
      label: "Last signal",
      story:
        "A planet-wide dust storm blotted out the Sun. Opportunity's final data, sent on 10 June 2018, showed very low power and a darkening sky. Engineers sent more than a thousand commands without a reply and declared the mission complete on 13 February 2019. The often-shared line \"My battery is low and it's getting dark\" is a journalist's paraphrase of that data, not a transmission.",
    },
    restingPlace: "Meridiani Planum, Mars",
    coords: { lat: -1.95, lon: -5.53 },
    stats: [
      { value: "45.16 km", label: "driven", icon: "route" },
      { value: "90", label: "sols planned", icon: "timer" },
      { value: "14+ years", label: "on Mars", icon: "calendar" },
    ],
    specs: [
      { label: "Builder", value: "JPL" },
      { label: "Mass", value: "185 kg" },
      { label: "Height", value: "1.5 m" },
    ],
    parts: [
      { label: "Pancam mast", x: 33, y: 8, side: "left" },
      { label: "High-gain antenna", x: 66, y: 34, side: "right" },
      { label: "Solar arrays", x: 22, y: 45, side: "left" },
      { label: "Rocker-bogie wheels", x: 58, y: 78, side: "right" },
      { label: "Robotic arm", x: 30, y: 62, side: "left" },
    ],
    chapters: [
      { title: "Eagle crater", year: "2004", text: "Rolled to a stop inside a small crater beside exposed bedrock.", image: "landing" },
      { title: "Endurance crater", year: "2004", text: "Drove down inside to read layer after layer of rock.", image: "crater" },
      { title: "Victoria crater", year: "2006–2008", text: "Spent two years exploring the rim and walls of a crater 750 m wide.", image: "route" },
      { title: "Endeavour crater", year: "2011", text: "Reached a crater 22 km wide and found a bright vein of gypsum.", image: "crater" },
      { title: "Marathon", year: "2015", text: "Passed the length of a marathon, 42.2 km, in March 2015.", image: "tracks" },
      { title: "The storm", year: "2018", text: "A planet-wide dust storm cut off the sunlight it needed for power.", image: "story-storm" },
    ],
    story: [
      { title: "Launch", year: "July 2003", text: "A Delta II carried Opportunity off Cape Canaveral at 23:18 EDT on 7 July 2003.", image: "launch" },
      { title: "Landing", year: "January 2004", text: "Wrapped in airbags, it bounced across Meridiani Planum and rolled into Eagle crater.", image: "landing" },
      { title: "Water evidence", year: "2004", text: "Tiny hematite spheres and layered bedrock showed that liquid water once soaked these rocks.", image: "crater" },
      { title: "Endeavour crater", year: "2011", text: "After three years of driving, it reached a crater 22 km wide and found a vein of gypsum left by water.", image: "route" },
      { title: "The storm", year: "June 2018", text: "A planet-wide dust storm blocks the sunlight Opportunity needs for power.", image: "story-storm" },
      { title: "Last signal", year: "10 June 2018", text: "Its final data showed very low power and a dark sky. Then silence. The mission was declared complete on 13 February 2019.", image: "tracks" },
    ],
    discoveries: [
      { title: "Hematite spherules", image: "crater" },
      { title: "Evidence of past water", image: "landing" },
      { title: "Record distance off Earth", image: "tracks" },
    ],
    route: {
      km: "45.16 km",
      points: [
        { name: "Eagle", x: 10, y: 28 },
        { name: "Endurance", x: 34, y: 44 },
        { name: "Victoria", x: 56, y: 66 },
        { name: "Endeavour", x: 86, y: 56 },
      ],
    },
    gallery: ["opportunity", "hero-opportunity", "story-storm", "crater", "tracks", "landing"],
    twin: "spirit",
    sources: [
      { label: "NASA Science: Opportunity", url: "https://science.nasa.gov/mission/mer-opportunity/" },
      { label: "NSSDCA: MER-B", url: NSSDCA("2003-032A") },
    ],
  },
  {
    slug: "phoenix",
    no: 11,
    name: "Phoenix",
    designation: "Phoenix Mars lander",
    kind: "Lander",
    category: "lander",
    body: "mars",
    builder: "Lockheed Martin",
    summary:
      "The first spacecraft to land in the Martian arctic. Its robotic arm dug down to water ice just under the soil.",
    image: "phoenix",
    card: "card-phoenix",
    launch: { date: "2007-08-04", rocket: "Delta II 7925", pad: "Space Launch Complex 17A" },
    landing: { date: "2008-05-25", site: "Vastitas Borealis", method: "Powered descent" },
    end: {
      date: "2008-11-02",
      label: "Last signal",
      story: "As the arctic winter set in, the Sun sank too low to power the lander. Its last signal came on 2 November 2008.",
    },
    restingPlace: "Vastitas Borealis, Mars",
    coords: { lat: 68.22, lon: -125.75 },
    stats: [
      { value: "90", label: "sols planned", icon: "timer" },
      { value: "5 months", label: "on Mars", icon: "calendar" },
      { value: "Ice", label: "touched on Mars", icon: "spark" },
    ],
    gallery: ["phoenix", "crater"],
    sources: [{ label: "NASA Science: Phoenix", url: "https://science.nasa.gov/mission/phoenix/" }],
  },
  {
    slug: "lcross",
    no: 12,
    name: "LCROSS",
    designation: "Lunar Crater Observation and Sensing Satellite",
    kind: "Impactor",
    category: "impactor",
    body: "moon",
    builder: "Northrop Grumman",
    summary:
      "LCROSS steered its spent rocket stage into a dark polar crater, flew through the plume and found water.",
    image: "lcross",
    card: "card-lcross",
    launch: { date: "2009-06-18", rocket: "Atlas V 401", pad: "Space Launch Complex 41" },
    end: {
      date: "2009-10-09",
      label: "Impact",
      story: "The Centaur stage struck Cabeus crater first. LCROSS followed four minutes later, sending data until the moment it hit.",
    },
    restingPlace: "Cabeus crater, Moon",
    coords: { lat: -84.7, lon: -48.7 },
    stats: [
      { value: "4 min", label: "behind the Centaur", icon: "timer" },
      { value: "Water", label: "found in the plume", icon: "spark" },
      { value: "2009", label: "impact", icon: "calendar" },
    ],
    gallery: ["lcross", "moon-globe"],
    sources: [{ label: "NSSDCA: LCROSS", url: NSSDCA("2009-031B") }],
  },
  {
    slug: "grail",
    no: 13,
    name: "GRAIL",
    nickname: "Ebb & Flow",
    designation: "Gravity Recovery and Interior Laboratory",
    kind: "Twin orbiters",
    category: "impactor",
    body: "moon",
    builder: "Lockheed Martin",
    summary:
      "Twin spacecraft that flew in formation to map the Moon's gravity in more detail than ever before.",
    image: "grail",
    card: "card-grail",
    launch: { date: "2011-09-10", rocket: "Delta II 7920H", pad: "Space Launch Complex 17B" },
    end: {
      date: "2012-12-17",
      label: "Impact",
      story: "Low on fuel, Ebb and Flow were flown into a mountain near the north pole. The site was named after Sally K. Ride.",
    },
    restingPlace: "Sally K. Ride Impact Site, Moon",
    coords: { lat: 75.6, lon: -26.6 },
    stats: [
      { value: "2", label: "spacecraft", icon: "spark" },
      { value: "1 year", label: "in lunar orbit", icon: "timer" },
      { value: "2012", label: "impact", icon: "calendar" },
    ],
    gallery: ["grail", "moon-globe"],
    sources: [{ label: "NSSDCA: GRAIL-A", url: NSSDCA("2011-046A") }],
  },
  {
    slug: "insight",
    no: 14,
    name: "InSight",
    designation: "Interior Exploration using Seismic Investigations, Geodesy and Heat Transport",
    kind: "Lander",
    category: "lander",
    body: "mars",
    builder: "Lockheed Martin",
    summary:
      "InSight listened to Mars. Its seismometer recorded more than 1,300 marsquakes and revealed the planet's crust, mantle and core.",
    image: "insight",
    card: "card-insight",
    launch: { date: "2018-05-05", rocket: "Atlas V 401", pad: "Vandenberg SLC-3E" },
    landing: { date: "2018-11-26", site: "Elysium Planitia", method: "Powered descent" },
    end: {
      date: "2022-12-15",
      label: "Last signal",
      story: "Dust slowly covered its solar panels. InSight last spoke to Earth on 15 December 2022, and the mission ended six days later.",
    },
    restingPlace: "Elysium Planitia, Mars",
    coords: { lat: 4.5, lon: 135.62 },
    stats: [
      { value: "1,319", label: "marsquakes", icon: "spark" },
      { value: "4 years", label: "on Mars", icon: "calendar" },
      { value: "2018", label: "first West Coast launch to another planet", icon: "timer" },
    ],
    gallery: ["insight", "crater"],
    sources: [{ label: "NASA Science: InSight", url: "https://science.nasa.gov/mission/insight/" }],
  },
  {
    slug: "ingenuity",
    no: 15,
    name: "Ingenuity",
    nickname: "Ginny",
    designation: "Mars Helicopter",
    kind: "Helicopter",
    category: "helicopter",
    body: "mars",
    builder: "JPL",
    summary:
      "The first aircraft to make a powered, controlled flight on another planet. Planned for 5 flights, it flew 72.",
    image: "ingenuity",
    card: "card-ingenuity",
    launch: { date: "2020-07-30", rocket: "Atlas V 541", pad: "Space Launch Complex 41" },
    landing: { date: "2021-02-18", site: "Jezero crater", method: "Carried under Perseverance" },
    end: {
      date: "2024-01-18",
      label: "Final flight",
      story: "On its 72nd flight a rotor blade was damaged. Ingenuity could no longer fly, and the mission was declared over on 25 January 2024.",
    },
    restingPlace: "Jezero crater, Mars",
    coords: { lat: 18.44, lon: 77.45 },
    stats: [
      { value: "72", label: "flights", icon: "spark" },
      { value: "5", label: "flights planned", icon: "timer" },
      { value: "3 years", label: "on Mars", icon: "calendar" },
    ],
    gallery: ["ingenuity", "crater"],
    sources: [
      { label: "NASA Science: Ingenuity", url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/" },
    ],
  },
];

export const getHero = (slug: string) => HEROES.find((h) => h.slug === slug);

export const catNo = (n: number) => `No. ${String(n).padStart(2, "0")}`;

export const year = (iso: string) => Number(iso.slice(0, 4));

/** First year the machine reached its world (or launched, for those that never landed). */
export const startYear = (h: Hero) => year(h.landing?.date ?? h.launch.date);

export const lifespan = (h: Hero) => {
  const a = startYear(h);
  const b = year(h.end.date);
  return a === b ? String(a) : `${a}–${b}`;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "10 Jun 2018" */
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** "10 June 2018" */
export const fmtLong = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_LONG[m - 1]} ${y}`;
};

/** "10.06.2018" */
export const fmtDots = (iso: string) => iso.split("-").reverse().join(".");

export const fmtCoords = ({ lat, lon, approx }: Hero["coords"]) =>
  `${approx ? "~" : ""}${Math.abs(lat).toFixed(2)}° ${lat < 0 ? "S" : "N"}, ${Math.abs(lon).toFixed(2)}° ${lon < 0 ? "W" : "E"}`;

export const bodyName = (b: Body) => (b === "mars" ? "Mars" : "Moon");

export const img = (name: string) => `/images/${name}.jpg`;

/** Heroes featured on the home page, in display order. */
export const FEATURED = ["opportunity", "spirit", "viking-1", "ingenuity", "pathfinder-sojourner"];

/** Chapters for Story mode: the hand-written story when there is one, otherwise built from the record. */
export function storyChapters(h: Hero): Chapter[] {
  if (h.story) return h.story;
  return [
    { title: "Launch", year: fmtLong(h.launch.date), text: `${h.name} left Earth on a ${h.launch.rocket} from ${h.launch.pad}.`, image: "launch" },
    ...(h.landing
      ? [{ title: "Arrival", year: fmtLong(h.landing.date), text: `${h.landing.method} at ${h.landing.site}.`, image: h.image }]
      : []),
    ...(h.chapters ?? []),
    ...(h.chapters ? [] : [{ title: "Life’s work", year: lifespan(h), text: h.summary, image: h.gallery[1] ?? h.image }]),
    { title: h.end.label, year: fmtLong(h.end.date), text: h.end.story, image: h.image },
  ];
}

/** The next hero in the catalogue, wrapping around. */
export const nextHero = (h: Hero) => HEROES[(HEROES.indexOf(h) + 1) % HEROES.length];
