export const PROLOGUE = [
  "This is Ground. Can you hear me? Good.",
  "Between 1964 and 2024 we sent machines to the Moon and to Mars. This archive remembers them.",
  "Some landed softly. Some were flown into the ground on purpose. One went quiet after a dust storm.",
  "Every one of them, one day, transmitted their final signal home.",
  "Your lander is small and your fuel is short. Land near each one, drive across the dust, and bear witness to their final resting places.",
];

export const BRIEF: Record<string, string[]> = {
  "ranger-7": [
    "Ranger 7 came down on 31 July 1964, on the northern rim of the Sea of Clouds (Mare Cognitum).",
    "It ended a run of 13 failed attempts at the Moon. Its TV cameras switched on as planned.",
    "It took pictures all the way down. The last one was taken 2.3 seconds before impact. There's no lander, only its crater. Come in gentler than it did.",
  ],
  "surveyor-1": [
    "Oceanus Procellarum, the Ocean of Storms. Surveyor 1 touched down on 2 June 1966.",
    "It was America's first soft landing on the Moon, proving the lunar soil could hold a heavy lander.",
    "It slept through freezing lunar nights and answered again for seven months.",
  ],
  "apollo-11-lander": [
    "Tranquility Base. Eagle landed at 4:17 p.m. Eastern time on 20 July 1969 with Neil Armstrong and Buzz Aldrin.",
    "On 21 July they flew home in the ascent stage. The descent stage stayed behind with a plaque on its leg.",
    "It is still standing. Land in the target zone, not on history, and drive over.",
  ],
  "apollo-15-rover": [
    "Hadley–Apennine, between the mountains and Hadley Rille. Falcon landed on 30 July 1971.",
    "The crew brought the first car ever driven on the Moon. When front steering jammed, they steered with the rear wheels.",
    "On 2 August its color camera broadcast Falcon's liftoff to Earth. Then it stayed parked where they left it.",
  ],
  "viking-1": [
    "Chryse Planitia. Viking 1 touched down at 11:53:06 UT on 20 July 1976.",
    "It sent back the first color panoramas from the surface of Mars and scooped soil for biology tests.",
    "It operated for over six years until a command uplink error in November 1982 cut the carrier wave.",
  ],
  "viking-2": [
    "Utopia Planitia, about 6,460 km from its twin. Viking 2 landed on 3 September 1976.",
    "In winter it photographed carbon-dioxide frost on red boulders.",
    "Its batteries depleted in April 1980, and it fell silent beneath the Martian sky.",
  ],
  "pathfinder-sojourner": [
    "Ares Vallis. Pathfinder bounced down inside giant airbags on 4 July 1997.",
    "It deployed Sojourner, the first wheeled rover on Mars, rolling down twin ramps onto alien rock.",
    "Its last full transmission reached Deep Space Network on 27 September 1997.",
  ],
  "mars-polar-lander": [
    "Near the edge of the south polar cap. Mars Polar Lander was meant to dig for subsurface water ice.",
    "Contact ended as planned before atmospheric entry on 3 December 1999. It never called home.",
    "A false touchdown sensor spike likely shut its descent thrusters off 40m high. Watch your altitude.",
  ],
  spirit: [
    "Gusev Crater. Spirit bounced down inside airbags in January 2004.",
    "Designed for 90 sols, it climbed the Columbia Hills. Even with a dragging right-front wheel, it churned up pure silica.",
    "In 2009 it became embedded in soft sulfate sand at Troy. It last called Earth on 22 March 2010.",
  ],
  opportunity: [
    "Meridiani Planum, on the rim of Endeavour crater. Opportunity explored for over 14 years.",
    "Designed to drive 1 km over 90 Martian days, it traversed 45.16 km.",
    "In June 2018 a global dust storm darkened the sky: 'My battery is low and it is getting dark.'",
  ],
  phoenix: [
    "Vastitas Borealis, the Martian arctic. Phoenix landed on 25 May 2008.",
    "Its robotic scoop dug down to pure water ice millimeters beneath the permafrost.",
    "When polar winter arrived, sunlight sank too low. Its last signal was received on 2 November 2008.",
  ],
  lcross: [
    "Cabeus crater, near the Moon's south pole. The crater floor is in permanent shadow.",
    "On 9 October 2009 LCROSS flew into the plume of its Centaur stage impact to analyze water vapor.",
    "Four minutes later, it impacted the crater floor. Trust your radar altitude.",
  ],
  grail: [
    "A mountain ridge near the Moon's north pole, now the Sally K. Ride Impact Site.",
    "Ebb and Flow mapped lunar gravity at unprecedented resolution.",
    "Low on fuel, they were deliberately guided into this mountain on 17 December 2012.",
  ],
  insight: [
    "Elysium Planitia. InSight landed on 26 November 2018 to listen to the deep Martian interior.",
    "Its ultra-sensitive seismometer recorded 1,319 marsquakes, revealing the core and mantle.",
    "Dust coated its solar arrays. Its final heartbeat transmission came on 15 December 2022.",
  ],
  ingenuity: [
    "Jezero crater. Ingenuity landed folded beneath Perseverance on 18 February 2021.",
    "Built as a 5-flight tech demo, the solar rotorcraft completed 72 flights across Mars.",
    "On flight 72, a navigation anomaly damaged a carbon-fiber rotor tip. Its mission concluded.",
  ],
};

export const RADIO: Record<string, string> = {
  chute: "Chute deployed. Aeroshell separated. You have manual thruster control.",
  control: "Guidance computer online. Keep descent speed in the green band.",
  fuel: "Propellant level at 25%. Make every pulse count.",
  fuelOut: "Propellant exhausted! You are on ballistic trajectory.",
  fast: "Descent rate excessive! Fire main retro-thrusters now!",
  wind: "Martian crosswind gust detected. Correct your lateral drift.",
  landed: "Contact light confirmed. Engine shutdown. Outstanding landing.",
  landedHard: "Contact confirmed. Hard touchdown, but landing struts held.",
  crashed: "Telemetry lost. Structural failure on impact. Resetting simulation.",
  deploy: "Surface rover deployed. Follow the radio beacon to the explorer.",
  echo: "Telemetry echo received. Decoding mission log milestone.",
  arriveMachine: "Visual confirmation. There it is, standing in eternal silence.",
  arriveCrater: "Arrived at impact coordinates. Historical crater verified.",
  arriveLost: "Arrived at designated coordinates. Where it was meant to rest.",
  beaconLit: "Memorial beacon ignited. Its memory will shine across space.",
};
