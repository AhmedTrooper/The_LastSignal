export type EagleComponent = {
  name: string;
  belongsTo: "Lunar module" | "Deployed experiment" | "Flight software" | "Memorial";
  job: string;
  why: string;
  source: string;
};

const LANDING = "https://apollojournals.org/alsj/a11/a11.landing.html";
const STEP = "https://apollojournals.org/alsj/a11/a11.step.html";
const ASCENT = "https://apollojournals.org/alsj/a11/a11.launch.html";
const SCIENCE = "https://apollojournals.org/alsj/a11/a11.clsout.html";
const REPORT = "https://www.nasa.gov/wp-content/uploads/static/apollo50th/pdf/A11_MissionReport.pdf";

/** One web narrative ledger: component descriptions are reused across Eagle's formats. */
export const EAGLE_COMPONENTS = {
  ascent: { name: "Crew cabin / ascent stage", belongsTo: "Lunar module", job: "Neil and Buzz travelled inside the upper stage. It had its own engine for the return to orbit.", why: "The cabin could leave without taking the landing engine, landing legs, and other equipment back up.", source: ASCENT },
  descent: { name: "Landing stage", belongsTo: "Lunar module", job: "The lower stage carried the landing equipment and later served as the ascent stage's launch platform.", why: "It supported the crew's surface work and departure. This is the part of Eagle left at Tranquility Base.", source: ASCENT },
  legs: { name: "Landing legs and footpads", belongsTo: "Lunar module", job: "Four legs with round footpads supported Eagle on the lunar ground. Long contact probes signalled surface contact.", why: "A stable landing gave the crew and their instruments a place to work.", source: LANDING },
  engine: { name: "Descent engine", belongsTo: "Lunar module", job: "The landing engine could change its thrust to slow Eagle and control the descent.", why: "Managing the approach helped the crew reach clear ground with the equipment they would use for science.", source: LANDING },
  ladder: { name: "Ladder and front leg", belongsTo: "Lunar module", job: "The astronauts used the ladder to travel between the cabin, footpad, and lunar surface.", why: "It gave them a route to the place where they would explore and deploy their experiments.", source: STEP },
  sband: { name: "Earth-link antenna", belongsTo: "Lunar module", job: "The steerable S-band antenna helped carry voice, data, and television between Eagle and Earth.", why: "People far away could follow the crew's work and receive information from the mission.", source: LANDING },
  rcs: { name: "Steering rocket clusters", belongsTo: "Lunar module", job: "Small rocket clusters turned and steadied Eagle as it flew.", why: "Keeping Eagle pointed the right way helped with the landing and the later meeting with Columbia.", source: REPORT },
  guidance: { name: "Guidance computer and flight software", belongsTo: "Flight software", job: "The computer calculated guidance. Its restart protection preserved essential work during overload alarms.", why: "Software recovery and Mission Control's assessment let the crew continue the descent instead of treating every warning as a total failure.", source: LANDING },
  mesa: { name: "MESA equipment bay and television camera", belongsTo: "Lunar module", job: "A lanyard lowered the hinged equipment bay, opening the camera's view toward the ladder and footpad.", why: "This helped Earth watch the first steps. Later the crew moved the camera to a tripod for the surface work.", source: STEP },
  reflector: { name: "Laser ranging reflector", belongsTo: "Deployed experiment", job: "A panel of 100 corner cubes returns incoming light toward its source. It needs no electrical power.", why: "Long-term observations of the lunar arrays measure the Moon's motion and provide evidence of a fluid core. A reflector returns light; it does not send radio telemetry.", source: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/" },
  seismometer: { name: "Passive seismic package", belongsTo: "Deployed experiment", job: "The crew levelled this instrument on the ground and opened its solar panels so it could observe tiny ground motions.", why: "Early observations picked up the crew's footsteps and began a new way to investigate the Moon through vibrations.", source: SCIENCE },
  solarWind: { name: "Solar-wind foil collector", belongsTo: "Deployed experiment", job: "An aluminium foil sheet caught particles from the solar wind. The foil was rolled up and returned for laboratory analysis.", why: "The foil let laboratories study helium, neon, and argon from the solar wind. The collector came home, while its supporting staff stayed on the Moon.", source: STEP },
  dust: { name: "Lunar dust detector", belongsTo: "Deployed experiment", job: "Solar cells mounted on the seismic package helped study how exposure to the lunar environment changed their output.", why: "Understanding instrument performance helps engineers design equipment for a harsh, unfamiliar surface.", source: "https://apollojournals.org/alsj/a11/a11psr.html" },
  breaker: { name: "Engine-arm circuit breaker", belongsTo: "Lunar module", job: "This control helped prepare the ascent engine. Aldrin used a felt-tip pen to push the breaker in after its knob was damaged on Panel 16.", why: "A small control still had an important job. The pen helped operate it; it did not replace the engine or instantly cause liftoff.", source: `${ASCENT}#1232043` },
  insulation: { name: "Multilayer thermal insulation", belongsTo: "Lunar module", job: "Thin insulation layers helped manage heat exchange around the spacecraft. Gold-coloured surfaces were not a solid-gold wrapper.", why: "Equipment had to work in an environment very different from Earth. Managing heat was part of protecting that equipment.", source: REPORT },
  honeycomb: { name: "Crushable landing-gear honeycomb", belongsTo: "Lunar module", job: "Aluminium honeycomb in the landing gear was designed to absorb energy by crushing during landing.", why: "Shock absorption helped the structure take landing loads. Our drawings do not claim a measured compression distance for Eagle's actual touchdown.", source: REPORT },
  plaque: { name: "Commemorative plaque", belongsTo: "Memorial", job: "A plaque attached to the ladder strut commemorated the first crewed lunar landing.", why: "It stayed with the descent stage: a message from the visitors, beside equipment that had helped them explore.", source: STEP },
} satisfies Record<string, EagleComponent>;

export type EagleComponentId = keyof typeof EAGLE_COMPONENTS;
