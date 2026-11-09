import type { MachineBook } from "./types";

const LANDING = "https://apollojournals.org/alsj/a11/a11.landing.html";
const STEP = "https://apollojournals.org/alsj/a11/a11.step.html";
const SCIENCE = "https://apollojournals.org/alsj/a11/a11.clsout.html";
const ASCENT = "https://apollojournals.org/alsj/a11/a11.launch.html";

export const APOLLO_BOOK: MachineBook = {
  slug: "apollo-11-lander",
  name: "Eagle",
  title: "The Half That Stayed Behind",
  introduction:
    "My name is LM-5, but the world knows me as Eagle. I carried Neil Armstrong and Buzz Aldrin down to the Sea of Tranquility—and half of me is still standing there in the lunar dust today. Turn the page to relive the real crises, clever fixes, and silent instruments that made my mission possible.",
  chapters: [
    {
      id: "undocking",
      title: "Two Halves, One One-Way Ticket",
      event: "Undocking from Command Module Columbia in lunar orbit (GET 100:12:00)",
      hardware: "Docking tunnel latch, four fold-out landing legs, Ascent and Descent stages",
      memory: "undocking",
      source: "https://apollojournals.org/afj/ap11fj/17day5-undock-doi.html#1001203",
      beats: [
        {
          line: "One Hundred Hours into the flight, twenty-eight latches snapped open—and I floated free in the dark above the Moon.",
          detail: "Inside my cramped aluminum cabin, Neil Armstrong and Buzz Aldrin stood strapped to the floor like trolley drivers. Sixty-nine miles above the gray craters, we had just let go of our only ride home: Command Module Columbia.",
          art: "body",
        },
        {
          line: "I spun slowly in front of Columbia's window so Michael Collins could inspect my legs.",
          detail: "My four spider-like landing legs had been folded tight inside the Saturn V rocket since launch. If even one lock had failed to click into place, touching the Moon would tip us over.",
          art: "body",
        },
        {
          line: "\"The Eagle has wings,\" Neil radioed—because I was built as two machines bolted together.",
          detail: "My golden lower half—the Descent Stage—held a throttleable rocket engine, four shock-absorbing legs, and hidden science bays. My silver upper half—the Ascent Stage—held the breathing air, the computers, and a separate escape engine.",
          art: "thermal",
        },
        {
          line: "Michael stayed alone in orbit, while both halves of me dived toward a world no human had ever touched.",
          detail: "Only my top half was ever meant to come back to him. My bottom half was flying toward the place where it would stay forever.",
          art: "body",
        },
      ],
      discovery:
        "Eagle was built as two separate spacecraft joined by explosive bolts: a golden Descent Stage to land and stay on the Moon, and a silver Ascent Stage to blast the crew back to orbit.",
      question:
        "Why was it safer and lighter to leave the landing legs and descent engine behind on the Moon instead of flying the whole lander back to orbit?",
    },
    {
      id: "alarm",
      title: "Code 1202: Forty Thousand Feet Above the Rocks",
      event: "Executive overflow alarms (1202 and 1201) during powered descent (GET 102:38:26)",
      hardware: "Apollo Guidance Computer (AGC), DSKY keypad, and MIT priority-scheduling software",
      memory: "alarm",
      source: `${LANDING}#1023826`,
      beats: [
        {
          line: "Six miles above the Moon, my master alarm buzzed inside the astronauts' headsets—and a yellow '1202' flashed on my screen.",
          detail: "My rocket was roaring at full throttle to slow us down. Suddenly, my Apollo Guidance Computer was being flooded with extra radar pulses from a switch left in the wrong position, stealing 13 percent of my brainpower.",
          art: "alarm",
        },
        {
          line: "My memory was overflowing—so I threw away the chores that didn't matter to save the ones that kept us alive.",
          detail: "Instead of freezing up like an ordinary computer, my MIT-designed software triggered an instantaneous lightning reboot. I dropped low-priority screen updates and poured every ounce of processing power into firing the engine and steering my thrusters.",
          art: "priorities",
        },
        {
          line: "Two hundred forty thousand miles away in Houston, a twenty-six-year-old engineer had seconds to call a liftoff abort—or let us keep falling.",
          detail: "Guidance Officer Steve Bales and computer specialist Jack Garman recognized the 1202 code immediately: as long as the alarm didn't fire continuously, my software was winning the fight. Charlie Duke radioed up: \"We're GO on that alarm.\"",
          art: "priorities",
        },
        {
          line: "Four more alarms flashed, I cleared every single one, and then Neil looked out my window—straight into a trap.",
          detail: "My computer had kept us flying through the overload, but when the lander pitched upright for the final approach, we saw what lay directly beneath my feet.",
          art: "boulders",
        },
      ],
      discovery:
        "Instead of crashing when overloaded, Eagle's computer used priority-scheduling software to drop minor tasks and protect engine guidance in real time.",
      question:
        "When a spacecraft computer runs out of processing room during landing, which job must it protect above all others?",
    },
    {
      id: "touchdown",
      title: "Sixty Seconds of Fuel and a Field of Boulders",
      event: "Manual fly-over of West Crater and touchdown at Tranquility Base (GET 102:45:40)",
      hardware: "Throttleable Descent Propulsion System, 67-inch lunar contact probes, and honeycomb crush struts",
      memory: "touchdown",
      source: `${LANDING}#1024540`,
      beats: [
        {
          line: "Four hundred feet up, my autopilot was steering us straight into a crater the size of a football stadium, rimmed with car-sized boulders.",
          detail: "It was West Crater. Landing on those jagged rocks would snap my legs or pierce my fuel tanks. With fuel burning away fast, Neil flipped my control switch to semi-manual mode.",
          art: "boulders",
        },
        {
          line: "Neil skimmed me horizontally like a helicopter while Buzz stared at my instruments, calling out our speed and height.",
          detail: "\"Forty feet, down two and a half... picking up some dust!\" My rocket plume blasted millions of years of loose gray soil across the ground as Houston called the sixty-second fuel warning, then thirty seconds.",
          art: "boulders",
        },
        {
          line: "Five feet below my saucer-shaped footpads, three thin metal feelers reached out for the Moon.",
          detail: " The instant one of my 67-inch wire probes brushed the soil, it closed a switch that lit a glowing blue 'LUNAR CONTACT' lamp on the dashboard. \"Contact light!\" Buzz called out.",
          art: "thermal",
        },
        {
          line: "My engine cut off, I dropped the last three feet into the dust with twenty-five seconds of fuel left, and my four legs locked into history.",
          detail: "Inside my legs, aluminum honeycomb cartridges crushed slightly to absorb the impact. \"Houston, Tranquility Base here. The Eagle has landed.\" My lower body had found its permanent home.",
          art: "body",
        },
      ],
      discovery:
        "Hanging 67-inch wire probes beneath the footpads warned the crew the exact millisecond they touched the ground, letting them shut the engine off safely before kicking up dangerous pressure underneath.",
      question:
        "Why did Eagle use long wire probes hanging below its footpads instead of waiting for the heavy legs themselves to hit the ground?",
    },
    {
      id: "first-step",
      title: "The Secret Door That Let Earth Watch",
      event: "Pulling the D-ring lanyard to deploy the MESA camera bay (GET 109:23:38)",
      hardware: "D-ring cable lanyard, hinged Quad IV MESA table, Westinghouse slow-scan TV camera, and S-band antenna",
      memory: "first-step",
      source: STEP,
      beats: [
        {
          line: "Six hours after landing, my cabin air hissed out into the vacuum, my front hatch swung open, and Neil crawled backward onto my porch.",
          detail: "Six hundred million people on Earth were listening to their radios and staring at their televisions—but right then, the Moon was still completely invisible to them.",
          art: "camera",
        },
        {
          line: "Before climbing down my nine-rung ladder, Neil reached to his left and yanked a metal D-ring handle.",
          detail: "That pull released a latch on my outer wall—Quad IV—dropping a hinged equipment shelf called the MESA straight down like a drawbridge.",
          art: "camera",
        },
        {
          line: "Bolted upside-down inside that folding shelf, a black-and-white television camera blinked open—aimed squarely at my ladder and footpad.",
          detail: "My radio transmitter beamed those ghostly 10-frame-per-second signals across space to giant dish antennas in Australia and California, flipping the image right-side up for the world.",
          art: "camera",
        },
        {
          line: "When Neil pressed his boot into the dark dust beside my footpad, a hidden equipment box turned the whole planet into eye-witnesses.",
          detail: "Later, the crew unbolted that camera and mounted it on a tripod sixty feet away—where it still stands today, pointing back at my silent golden legs.",
          art: "unpack",
        },
      ],
      discovery:
        "Nobody stood on the Moon waiting to film Neil Armstrong; pulling a cable on the porch unfolded the MESA equipment bay, aiming an onboard TV camera directly at the bottom of the ladder.",
      question:
        "How did NASA film the very first step on the Moon when no astronaut was on the ground yet to hold the camera?",
    },
    {
      id: "first-vibrations",
      title: "The Tin Can That Heard Footsteps in a Vacuum",
      event: "Unpacking and leveling the Passive Seismic Experiment Package (PSEP)",
      hardware: "Four ultra-sensitive seismometers, leveling bubble, two solar panels, and radio antenna",
      memory: "science",
      source: SCIENCE,
      relatedSources: [
        {
          label: "NASA · The seismometer detects the crew’s footsteps",
          url: "https://www.nasa.gov/history/50-years-ago-one-small-step-one-giant-leap/",
        },
      ],
      beats: [
        {
          line: "The Moon has no air to carry sound—you could shout right beside me and hear only your own breathing inside your helmet.",
          detail: "Yet tucked inside my rear cargo bay (Quad II), I carried a golden cylinder built to listen—not to the sky, but to the solid rock beneath my feet.",
          art: "unpack",
        },
        {
          line: "Buzz hauled the Passive Seismic Experiment fifty-five feet south of me, leveled it using a tiny bubble gauge, and popped open its two solar wings.",
          detail: "The moment sunlight hit those panels, nearly forty watts of electricity flowed in, waking up four pendulums inside that could feel vibrations smaller than the width of a single atom.",
          art: "seismic",
        },
        {
          line: "As Buzz walked back toward my ladder, pens on paper strip-charts in Houston began jumping wildly!",
          detail: "Every crunch of the astronauts' boots, every pebble they tossed, and even the thump of my cabin door closing sent tiny ripples through the lunar crust that the seismometer caught and radioed to Earth.",
          art: "seismic",
        },
        {
          line: "For twenty-one days after the astronauts left, that little cylinder sat beside me, recording the Moon's secret rumbles.",
          detail: "It detected meteorite strikes and weird, echoing 'moonquakes' that rang like a bell for minutes—proving the Moon wasn't a dead ball of rock after all.",
          art: "seismic",
        },
      ],
      discovery:
        "Even though sound cannot travel through the airless vacuum of space, vibrations travel straight through the lunar ground—allowing Eagle's seismic package to detect footsteps and moonquakes smaller than an atom.",
      question:
        "If there is no air on the Moon to carry sound waves, how was the seismic instrument able to 'hear' the astronauts walking?",
    },
    {
      id: "reflector",
      title: "The Mirror That Still Answers Earth Today",
      event: "Deploying the Laser Ranging Retroreflector (LRRR) at Tranquility Base",
      hardware: "Anodized aluminum panel holding 100 fused-silica corner-cube prisms",
      memory: "science",
      source: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/",
      beats: [
        {
          line: "Every battery on the Moon eventually dies—so I carried one scientific instrument that needed no electricity, no wires, and no radio at all.",
          detail: "Forty-five feet from my legs, the astronauts propped up a suitcase-sized panel tilted directly toward Earth, studded with one hundred sunken glass prisms.",
          art: "unpack",
        },
        {
          line: "Each glass prism was cut into a special 'corner cube'—shaped so that any beam of light hitting it bounces straight back to the exact spot it came from.",
          detail: "Giant telescopes on Earth began firing brief, powerful laser pulses at Tranquility Base, aiming for a target two hundred forty thousand miles away.",
          art: "mirror",
        },
        {
          line: "Two and a half seconds after a laser flash left Earth, a handful of reflected light particles arrived back home from our dusty mirror.",
          detail: "Because scientists know the exact speed of light, timing that two-way trip let them measure the distance between Earth and my landing site down to the thickness of a fingernail.",
          art: "mirror",
        },
        {
          line: "More than half a century later, my batteries are dead—but that mirror beside me is still working right now.",
          detail: "Decades of laser bounces proved two astonishing truths: the Moon has a fluid core deep inside, and it is slowly spiraling away from Earth by 3.8 centimeters (1.5 inches) every single year.",
          art: "mirror",
        },
      ],
      discovery:
        "Because the Laser Ranging Retroreflector uses pure geometry (100 glass corner-cube prisms) instead of batteries, astronomers still bounce lasers off it today—revealing that the Moon drifts 3.8 cm farther from Earth every year.",
      question:
        "Why is the Apollo 11 laser reflector still working more than 55 years later when every other Apollo 11 experiment went silent?",
    },
    {
      id: "solar-wind",
      title: "Rolling Up a Piece of the Sun",
      event: "Stowing the Solar Wind Composition (SWC) foil after 77 minutes of exposure (GET 111:20:11)",
      hardware: "Ultra-pure aluminum collector foil and a 5-foot telescoping metal pole",
      memory: "science",
      source: `${SCIENCE}#1112011`,
      relatedSources: [
        {
          label: "NASA · How the solar-wind collector worked",
          url: "https://www.nasa.gov/history/50-years-ago-on-the-way-to-the-moon-lunar-science-announced/",
        },
      ],
      beats: [
        {
          line: "You cannot catch the Sun's wind on Earth—our planet's magnetic shield deflects it—so Buzz planted a shiny metal banner in the dirt near me.",
          detail: "It wasn't a flag. It was a four-foot-long sheet of ultra-pure Swiss aluminum foil hung on a telescoping pole, facing directly into the blazing sunlight.",
          art: "unpack",
        },
        {
          line: "For exacty seventy-seven minutes, an invisible storm of atoms blown off the Sun slammed into that foil at a million miles per hour.",
          detail: "With no lunar atmosphere to slow them down, particles of solar helium, neon, and argon buried themselves straight into the microscopic metal layers of the sheet.",
          art: "unpack",
        },
        {
          line: "Right before climbing back up my ladder, Buzz rolled the foil up like a window shade and sealed it inside the heavy metal rock box.",
          detail: "Unlike the laser mirror or the seismometer, this instrument had zero sensors of its own—the foil itself had to fly back to laboratories on Earth to be melted and analyzed.",
          art: "unpack",
        },
        {
          line: "The foil rode home inside my cabin, while its empty metal pole was tossed into the lunar dust beside me.",
          detail: "That empty staff still lies at Tranquility Base today, while the atoms trapped in its foil revealed the exact chemical recipe of our Sun.",
          art: "quiet",
        },
      ],
      discovery:
        "Because the Moon lacks an atmosphere or global magnetic field, raw particles streaming from the Sun hit the lunar surface directly—allowing a simple sheet of aluminum foil to trap physical samples of the Sun.",
      question:
        "Why did scientists have to unroll this aluminum foil on the Moon instead of just holding it up on a high mountain on Earth?",
    },
    {
      id: "breaker",
      title: "The Broken Switch and the Felt-Tip Pen",
      event: "Using a felt-tip marker to engage the broken Engine Arm circuit breaker (GET 123:20:43)",
      hardware: "Panel 16 Engine Arm circuit breaker and a plastic Duro felt-tip marker",
      memory: "breaker",
      source: `${ASCENT}#1232043`,
      beats: [
        {
          line: "The moonwalk was over, my hatch was locked, and then Buzz looked down at the dusty floor—and spotted a tiny black plastic knob.",
          detail: "While turning around inside my tight cabin, one of the crew's bulky life-support backpacks had brushed against Panel 16 and snapped the knob right off a critical switch.",
          art: "broken",
        },
        {
          line: "Of all the hundreds of switches on my walls, that broken one was the 'Engine Arm' circuit breaker—the master switch that unlocks my liftoff rocket.",
          detail: "Without pushing that recessed metal stem inward to close the electrical circuit, the valves to my ascent engine could never open. Neil and Buzz would be stranded on the Moon.",
          art: "broken",
        },
        {
          line: "Poking a metal tool into the hole was too dangerous—a single spark inside my pure-oxygen cabin could short out the power or start a fire.",
          detail: "While the astronauts tried to rest, engineers in Houston tested backup wiring paths—until Buzz reached into the shoulder pocket of his spacesuit and pulled out an ordinary plastic felt-tip pen.",
          art: "pen",
        },
        {
          line: "Two hours before liftoff, Buzz pressed the plastic tail of his felt-tip pen straight into the broken slot—and the breaker clicked solidly into place.",
          detail: "Electricity surged safely to the ascent engine circuits. A multi-billion-dollar moonship was ready to fly again because of a humble pocket pen.",
          art: "pen",
        },
      ],
      discovery:
        "When a backpack snapped the plastic knob off the Engine Arm circuit breaker, Buzz Aldrin used the non-conductive plastic end of a felt-tip pen to push the recessed switch in without causing an electrical short.",
      question:
        "Why was it critical that Buzz used a plastic pen rather than a metal screwdriver or pocketknife to push the broken circuit breaker in?",
    },
    {
      id: "liftoff",
      title: "Explosive Bolts: Why My Bottom Half Had to Stay",
      event: "Stage separation and Ascent Stage liftoff from Tranquility Base (GET 124:22:01)",
      hardware: "Pyrotechnic guillotine blades, 3,500-lb-thrust Ascent Engine, and Descent Stage launchpad",
      memory: "liftoff",
      source: `${ASCENT}#1242202`,
      beats: [
        {
          line: "Twenty-one hours and thirty-six minutes after landing, the countdown reached zero—and explosive blades sliced right through my waist.",
          detail: "In a fraction of a second, pyrotechnic guillotines severed every thick wire bundle, pipe, and steel bolt holding my upper cabin to my lower legs.",
          art: "body",
        },
        {
          line: "Every pound counts when escaping the Moon, so my heavy landing engine, empty fuel tanks, and four wide legs were never coming home.",
          detail: "By leaving my golden Descent Stage behind on the ground, my small 3,500-pound-thrust ascent rocket only had to lift the lightweight cabin, the two astronauts, and forty-seven pounds of Moon rocks.",
          art: "body",
        },
        {
          line: "My ascent rocket ignited with a silent flash, turning my own lower body into a launchpad on another world!",
          detail: "The blast tore crinkly gold Kapton foil from my lower frame and knocked the American flag flat into the lunar dirt as my top half shot skyward at four thousand miles per hour to rejoin Michael Collins.",
          art: "goodbye",
        },
        {
          line: "As the silver cabin vanished into the black sky, the dust slowly settled back down around my four golden legs.",
          detail: "My dangerous job of carrying humans was finished. My new job—standing guard as humanity's first monument on another world—had just begun.",
          art: "quiet",
        },
      ],
      discovery:
        "Eagle's Descent Stage did not just land the crew; it served as a solid, level launchpad so the lightweight Ascent Stage could blast back into orbit without hauling heavy landing gear.",
      question:
        "How did Eagle's bottom half help the astronauts one final time at the exact moment of liftoff?",
    },
    {
      id: "seen-again",
      title: "Forty Years Later, a Camera in Orbit Found My Shadow",
      event: "Lunar Reconnaissance Orbiter (LRO) photographs Eagle's Descent Stage from 24 km above",
      hardware: "Eagle's octagonal Descent Stage and the LROC Narrow Angle Camera",
      memory: "monument",
      source: "https://science.nasa.gov/photojournal/apollo-11-second-look/",
      beats: [
        {
          line: "For more than forty years, I stood completely alone in the freezing two-week nights and boiling two-week days of the Sea of Tranquility.",
          detail: "With no wind or rain on the Moon, nothing moved around me. Every bootprint Neil and Buzz pressed into the dust stayed as sharp as the afternoon they left.",
          art: "quiet",
        },
        {
          line: "Then, just fifteen miles overhead, a new robot explorer named the Lunar Reconnaissance Orbiter swept across my sky with a telescopic camera.",
          detail: "Flying faster than a rifle bullet, LRO's Narrow Angle Camera snapped high-resolution photos sharp enough to spot objects just ten inches wide on the ground.",
          art: "quiet",
        },
        {
          line: "There I was in the photograph: a bright four-legged octagon casting a long, crisp black shadow across the gray dust.",
          detail: "Right beside me, the orbital camera captured the dark double-trails where Neil and Buzz walked, the glinting Laser Reflector, the Seismic Package, and the lonely TV camera tripod.",
          art: "quiet",
        },
        {
          line: "I don't have a working radio anymore, yet I am still telling our story to everyone who looks up at the Moon.",
          detail: "On my front leg sits a stainless-steel plaque, signed by the crew. The landing stage remained where its work ended, and the camera record gave another generation a way to look back at that place.",
          art: "quiet",
        },
      ],
      discovery:
        "Later observations can add evidence to a mission whose original hardware has gone quiet.",
      question:
        "What can an orbital photograph show that an astronaut's close-up cannot?",
    },
  ],
};
