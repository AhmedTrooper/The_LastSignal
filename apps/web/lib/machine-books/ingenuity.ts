import type { MachineBook } from "./types";
import { INGENUITY_SOURCES as S } from "../ingenuity-sources";

export const INGENUITY_BOOK: MachineBook = {
  slug: "ingenuity", name: "Ingenuity", title: "A little helicopter. A new sky.",
  introduction: "I began as a short flight experiment. My cameras, my challenges, and the people behind me helped open a new way to explore Mars.",
  chapters: [
    {
      id: "a-new-sky", title: "A new sky", event: "From riding with Perseverance to the first powered flight on another planet", hardware: "Lightweight helicopter, counter-rotating rotors, solar panel, onboard guidance and Wright Flyer fabric",
      source: S.firstFlight.url, relatedSources: [{ label: S.mission.title, url: S.mission.url }, { label: S.fabric.title, url: S.fabric.url }],
      telemetry: [{ label: "Mass", value: "1.8 kilograms", note: "Mass remains the same on Earth and Mars. Weight changes with gravity.", source: S.mission.url }, { label: "First flight", value: "19 April 2021 / 39.1 seconds", note: "Total flight time; the hover alone lasted 30 seconds.", source: S.firstFlight.url }, { label: "First-flight altitude", value: "3 meters", note: "Prescribed maximum altitude reported from altimeter data.", source: S.firstFlight.url }],
      beats: [
        { line: "I reached Mars tucked beneath a rover.", detail: "Perseverance carried me on the mission launched July 30, 2020, and landed with me on February 18, 2021. I was a technology experiment, built to test a new way of moving through the thin Martian air." },
        { line: "Under my solar panel, a small piece of an older adventure came along.", detail: "A swatch of muslin from the Wright brothers’ first airplane was attached beneath my panel. It connected an Earth flight milestone with a test on another world." },
        { line: "No one on Earth could steer me through that first hover.", detail: "My onboard guidance, navigation and control algorithms flew me autonomously. The communication journey was too long for a live joystick; the team checked the returned data afterward." },
        { line: "On April 19, 2021, I lifted into a new sky.", detail: "At Wright Brothers Field, I rose three meters, hovered for 30 seconds and landed after 39.1 seconds in the air. It was the first powered, controlled flight on another planet." },
      ], discovery: "A small autonomous aircraft demonstrated flight in Mars’s thin atmosphere. Short does not mean unimportant.", question: "Why did this flight need its own onboard guidance?",
    },
    {
      id: "the-missing-picture", title: "The missing picture", event: "A navigation-timing anomaly during Flight 6", hardware: "Downward navigation camera, IMU, onboard control and stability margin",
      source: S.glitch.url,
      telemetry: [{ label: "Flight 6", value: "22 May 2021", note: "Event date, not the May 27 report publication date.", source: S.glitch.url }, { label: "Anomaly onset", value: "Approximately 54 seconds", note: "Time after takeoff. The report does not specify a 50-millisecond timestamp shift.", source: S.glitch.url }, { label: "Attitude excursions", value: "More than 20 degrees", note: "Reported roll and pitch excursions; not a perfectly symmetric ±20-degree oscillation.", source: S.glitch.url }],
      beats: [
        { line: "My downward eye helped me work out how I was moving.", detail: "The camera tracked features on the ground while my inertial measurement unit measured acceleration and rotation. The navigation system combined the information to estimate my motion." },
        { line: "On my sixth flight, the pictures lost their timing.", detail: "Approximately 54 seconds after takeoff, an image-pipeline glitch lost an image and gave later images inaccurate timestamps. The system began correcting motion estimates using the wrong times." },
        { line: "I tilted back and forth while my systems worked harder.", detail: "The record shows roll and pitch excursions beyond 20 degrees, large control inputs and power spikes. The team had designed stability margin to help the aircraft tolerate errors." },
        { line: "The landing design helped me reach the ground safely.", detail: "During final descent, the navigation algorithm stopped using camera images as designed. The oscillation stopped, and I landed within about five meters of the target. The flight exposed a timing problem for engineers to investigate." },
      ], discovery: "Sensors need correct timing as well as correct measurements. Robust design can help a robot survive an unexpected error.", question: "Can a clear picture mislead a robot if its timestamp is wrong?",
    },
    {
      id: "the-gear-left-behind", title: "The gear left behind", event: "Flight 26 photographed the rover’s discarded entry equipment", hardware: "Color camera, Perseverance backshell, supersonic parachute and suspension lines",
      source: S.debris.url,
      telemetry: [{ label: "Flight 26", value: "19 April 2022", note: "The one-year anniversary of first flight.", source: S.debris.url }, { label: "Aerial color images", value: "10", note: "Images requested for assessment of entry, descent and landing hardware; not proof of every component’s performance.", source: S.debris.url }],
      beats: [
        { line: "My short test grew into a job as an aerial scout.", detail: "After the original flight demonstration, my images offered scientists and rover planners another viewpoint. One flight would look back at equipment that had helped bring us to Mars." },
        { line: "A parachute and backshell had finished their journey on the ground.", detail: "They had protected Perseverance during entry and descent, then separated before the rover’s landing. The rover went on exploring; those components were left behind." },
        { line: "On April 19, 2022, I photographed them from the air.", detail: "During Flight 26, I returned ten color images. Engineers had asked for this perspective because it could reveal details harder to inspect from the rover’s viewpoint." },
        { line: "Used equipment could become evidence for a future landing.", detail: "Engineers examined the backshell, suspension lines and parachute. NASA’s report described promising observations while noting that more analysis was needed. A photograph begins an investigation; it does not answer everything." },
      ], discovery: "Discarded equipment is not just debris: observing it can help engineers learn how a mission’s hardware performed.", question: "What could an aerial photograph reveal that a distant surface picture might miss?",
    },
    {
      id: "a-backup-sense", title: "A backup sense", event: "Winter energy limits and a failed preflight sensor", hardware: "Solar power, heater, inclinometer, IMU accelerometers and flight software",
      source: S.sensor.url,
      telemetry: [{ label: "Sensor report", value: "6 June 2022", note: "The report describes an update being uploaded; it is not a timestamp for a completed repair.", source: S.sensor.url }],
      beats: [
        { line: "Mars’s winter changed how the team had to operate me.", detail: "Dust, shorter days and lower temperatures reduced the energy available to keep my electronics warm overnight. Night-time shutdowns and resets introduced risks to my components." },
        { line: "A sensor that checked my starting tilt stopped working.", detail: "The inclinometer measured gravity before takeoff so the navigation algorithms could start with an orientation estimate. It was not the sensor used to guide me during flight." },
        { line: "Another sensor could help provide that missing estimate.", detail: "The IMU also contained accelerometers. The team could use them to estimate initial orientation, although the estimate would generally be less accurate than the purpose-built inclinometer’s." },
        { line: "The backup was software, not a new part delivered to Mars.", detail: "Engineers had prepared the fallback patch before my arrival. It was designed to supply replacement packets derived from IMU data. The failed sensor was not physically repaired; the patch offered another way to initialize navigation." },
      ], discovery: "Redundancy can come from reusing information a robot already has. A workaround still has limitations.", question: "How can software help when nobody can replace a broken component?",
    },
    {
      id: "a-record-for-the-future", title: "A record for the future", event: "The final flight, accident investigation and a planned stationary testbed", hardware: "Navigation camera, damaged rotors, solar power, onboard memory and Perseverance radio relay",
      source: S.investigation.url, relatedSources: [{ label: S.farewell.title, url: S.farewell.url }, { label: S.mission.title, url: S.mission.url }],
      telemetry: [{ label: "Final flight", value: "18 January 2024 / Flight 72", note: "Flight ending and mission-end announcement on January 25 are different dates.", source: S.investigation.url }, { label: "Flight record", value: "72 flights / 128.8 minutes / 17.0 kilometers", note: "NASA’s mission summary; distance is the flown path, not straight-line displacement.", source: S.mission.url }, { label: "Final team downlink", value: "16 April 2024", note: "Confirmed a previously uploaded stationary-testbed patch. This does not establish current activity in 2026.", source: S.farewell.url }],
      beats: [
        { line: "My last flight ended on sand that was hard for my camera to read.", detail: "Flight 72 took place on January 18, 2024. Investigators identified too few surface features for navigation as the likely start of a chain of events ending in a hard landing and damaged rotors." },
        { line: "The broken blades ended my flying, not the questions people could ask.", detail: "The team studied the returned measurements and pictures. Their most-likely scenario involved fast attitude changes overloading the rotor blades. They acknowledged that more than one scenario remained possible." },
        { line: "My team’s final shared shift checked a new job for my remaining equipment.", detail: "On April 16, 2024, a transmission confirmed a previously uploaded patch for stationary tests, temperature measurements and daily photos. Those commands were intended to keep collecting records after the rover moved out of radio range." },
        { line: "My next pages were a possibility—not a promise of twenty years.", detail: "NASA calculated that my memory could potentially hold about twenty years of daily records. Power loss or electronics failure could stop collection sooner. We cannot claim what I am recording today without new evidence." },
      ], discovery: "A mission’s remaining hardware can be given a new purpose, but future capability is not proof of current operation.", question: "Why is storage capacity different from a guaranteed operating lifetime?",
    },
  ],
};
