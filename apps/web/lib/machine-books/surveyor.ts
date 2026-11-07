import type { MachineBook } from "./types";
import { SURVEYOR_SOURCES as S } from "../surveyor-sources";

export const SURVEYOR_BOOK: MachineBook = {
  slug: "surveyor-1", name: "Surveyor 1", title: "Three feet. A new foothold.",
  introduction: "I needed to slow down, stand up, and send the evidence home. Follow an uncertain antenna, a careful landing, and the little details that helped people prepare for the Moon.",
  chapters: [
    {
      id: "a-question-in-flight", title: "A question in flight", event: "Launch and an antenna that did not deploy as expected", hardware: "Atlas-Centaur, aluminum frame, two omnidirectional antennas and attitude sensors",
      source: S.landing.url, relatedSources: [S.registry, S.mission, S.luna9].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Launch", value: "30 May 1966 / Atlas-Centaur AC-10", note: "Cape Canaveral Launch Complex 36A. NASA’s mission summary gives 14:41:01 UT.", source: S.mission.url },
        { label: "Mass", value: "995.2 kg at launch / 294.3 kg at landing", note: "Mass changes through propellant use and discarded hardware, not because gravity changes.", source: S.registry.url },
        { label: "Antenna A", value: "Deployment unconfirmed during cruise", note: "Confirmed extended after landing; release during retro fire or touchdown remains uncertain.", source: S.landing.url },
      ],
      beats: [
        { line: "Before astronauts could land, there was more to learn about the ground.", detail: "I am Surveyor 1, a robotic lander built by Hughes under JPL’s technical direction. Luna 9 had already soft-landed on the Moon. My job was to test an American landing system and gather evidence about the surface that future Apollo missions would encounter." },
        { line: "On May 30, 1966, my journey began above Florida.", detail: "An Atlas-Centaur launched me toward the Moon. My lightweight frame carried three landing legs, a camera, solar power and radio equipment. A Sun sensor, a Canopus star tracker and gyros helped establish how I was pointing." },
        { line: "One radio antenna left the team with a question.", detail: "Antenna A did not give the expected deployment indication. Engineers sent more commands, but its exact position remained uncertain. My other antenna maintained the communications path; JPL did not expect this fault to jeopardize the mission." },
        { line: "We kept checking the evidence while I travelled onward.", detail: "The team corrected my course and prepared the attitude needed for descent. After landing, photographs and radio readings would show Antenna A extended. They would not reveal whether it opened during braking or at touchdown." },
      ], discovery: "Redundant hardware and careful checks can keep a mission going through uncertainty. A later observation does not reveal every moment that came before it.", question: "If an antenna is open after landing, do we know exactly when it opened?",
    },
    {
      id: "three-feet-down", title: "Three feet down", event: "Automatic braking, radar-controlled descent and touchdown", hardware: "Altitude-marking radar, solid retrorocket, three vernier engines, RADVS and shock-absorbing legs",
      source: S.landing.url, relatedSources: [S.reportOne, S.registry].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Landing date", value: "2 June 1966", note: "NASA’s summary rounds touchdown to 06:17:36 UT; Part I gives 06:17:37 GMT. June 1 appears in Pacific-time reports.", source: S.mission.url },
        { label: "Footpad contact span", value: "Within 19 milliseconds", note: "Documented in the landing report; not a reconstructed force curve or perfectly simultaneous contact.", source: S.landing.url },
        { label: "Final descent", value: "Radar feedback → vernier control → short free fall", note: "Accounts differ on exact cutoff height. The sequence is retained without the draft’s asserted 4.3 m hover.", source: S.reportOne.url },
      ],
      beats: [
        { line: "Near the Moon, slowing down became my biggest job.", detail: "An altitude-marking radar began the automatic landing sequence. The main solid retrorocket fired after a delay and removed most of my approach speed. A radar mark and the later rocket ignition were two separate events." },
        { line: "The big rocket finished its job before my feet reached the ground.", detail: "After the main braking phase, its spent casing was discarded. My smaller vernier engines continued the descent. The radar altimeter and Doppler velocity sensor supplied information about height and motion to the control system." },
        { line: "Measurements helped the engines adjust the descent.", detail: "The controller used radar feedback to regulate vernier thrust as I approached the surface. Very near the ground, the engines cut off, leaving a short final free fall. This was an automatic sequence, not a person steering every instant with a joystick." },
        { line: "On June 2, my three feet met the Moon.", detail: "The footpads contacted the surface within 19 milliseconds of one another. Shock absorbers and crushable components helped absorb the landing energy. I had made the first US soft landing on the Moon—and could now investigate the place where I stood." },
      ], discovery: "Landing brings sensing, control, propulsion and impact absorption together. A successful system needs each stage to hand over to the next.", question: "Why does a landing controller need measurements as well as an engine?",
    },
    {
      id: "a-footprint-and-a-picture", title: "A footprint and a picture", event: "Television images and landing measurements reveal the local surface", hardware: "Vidicon camera, movable mirror, radio antennas, footpads and landing-leg strain gauges",
      source: S.landing.url, relatedSources: [S.history, S.reportTwo, S.registry].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "First image", value: "About 36 minutes after landing", note: "NASA’s 2021 history article; engineering checks came first. Initial frames used 200 scan lines.", source: S.history.url },
        { label: "Picture modes", value: "200 lines / 600 lines", note: "June report: fourteen 200-line images before high-gain 600-line imaging began.", source: S.landing.url },
        { label: "Footpad 2 penetration estimate", value: "4–8 cm, assuming no pad crushing", note: "Part II, printed p. 78. Maximum penetration and soil structure remain uncertain; not an exact 5–8 psi safety certificate.", source: S.reportTwo.url },
      ],
      beats: [
        { line: "One of my first subjects was my own foot.", detail: "After engineering checks, my television camera began sending pictures. A movable mirror aimed the view without turning the whole lander. The first lower-resolution frames were followed by 600-line images through the high-gain antenna." },
        { line: "A small footprint answered part of a very big question.", detail: "Pictures showed that I had stayed on the surface rather than disappeared into deep dust. My footpads and the disturbed soil around them let scientists investigate the local ground. These were observations at one landing site, not a guarantee about every place on the Moon." },
        { line: "The pictures and the leg readings worked together.", detail: "Strain gauges recorded the landing loads. Scientists compared those measurements with photographs and Earth tests. More than one soil model could fit the evidence, so the report kept uncertainty about the exact static bearing capacity instead of declaring a single universal strength." },
        { line: "Turning my mirror opened a whole landscape.", detail: "I photographed rocks, craters, distant hills and changing shadows. In nitrogen-jet tests, no soil disturbance was discernible in the pictures. Near the first sunset, the camera also observed the solar corona and made a long exposure of a footpad lit by Earthshine." },
      ], discovery: "Useful science combines images, measurements and models. It also keeps track of what the observations cannot establish.", question: "What extra information do landing measurements add to a photograph?",
    },
    {
      id: "through-the-long-night", title: "Through the long night", event: "Night survival, careful charging and a damaged radiator segment", hardware: "Solar panel, silver-zinc battery, thermal insulation, heaters and mirrored radiator surfaces",
      source: S.extended.url, relatedSources: [S.reportTwo, S.reportOne, S.history].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Contact restored", value: "6 July 1966", note: "The contemporary report separates this response from resumed camera operations on July 7.", source: S.extended.url },
        { label: "Battery response", value: "Reduced charging during overheating", note: "The team turned the panel away; an internal short was suspected. The reason for temporary recovery was not known.", source: S.extended.url },
        { label: "Radiator photograph", value: "12 July 1966 / Part II, Fig. A-2", note: "One glass radiator segment apparently broke during the night. Reported effect on performance was negligible.", source: S.reportTwo.url },
      ],
      beats: [
        { line: "A long night asked a different kind of question of my hardware.", detail: "When the first lunar day ended in June, my team prepared me to conserve power. Insulation, thermal-control equipment and stored battery energy mattered while the solar cells had no direct sunlight. Survival through the night was uncertain." },
        { line: "On July 6, I answered again.", detail: "Earlier calls after dawn had brought no response. Once contact returned, engineers carefully positioned my solar panel to recharge the weakened battery. They checked the camera on July 7 and could begin a second day of observations." },
        { line: "More sunlight was not always the answer.", detail: "When the battery began overheating, the team turned the panel away from the Sun to reduce charging. Temperatures later fell and picture-taking continued. Engineers suspected an internal short; they did not know why the battery temporarily recovered." },
        { line: "A picture showed a scar, but it was not the whole diagnosis.", detail: "A July 12 inspection showed one broken glass segment on a thermal radiator above Compartment A. It was probably damaged during the lunar night. The reported effect was negligible: the broken segment was not my camera mirror and was not established as the cause of the battery trouble." },
      ], discovery: "Managing energy also means managing heat. A visible damaged part and a system failure may have different causes.", question: "Why might engineers deliberately turn a solar panel away from the Sun?",
    },
    {
      id: "the-long-shadow", title: "The long shadow", event: "The end of imaging, later engineering contact and an orbital view", hardware: "Radio system, camera archive, standing spacecraft and LROC imaging",
      source: S.history.url, relatedSources: [S.mission, S.orbital, S.coordinates, S.extended].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Images returned", value: "More than 11,000", note: "July 1966 report: 11,150; later NASA summaries: 11,240. Differing counts are retained in the evidence ledger.", source: S.history.url },
        { label: "Last engineering contact", value: "7 January 1967", note: "Intermittent contact continued after July 1966 imaging. No invented farewell words or exact final time.", source: S.registry.url },
        { label: "LROC observation", value: "Published 30 September 2009 / almost 15 m shadow", note: "Length describes the cited afternoon view, not a permanent shadow or proof of electronic health.", source: S.orbital.url },
      ],
      beats: [
        { line: "My picture-taking ended before my last radio contact.", detail: "At the second sunset in July 1966, battery voltage fell and imaging operations ended. Engineers still made intermittent contact afterward. The final contact date in NASA’s record is January 7, 1967." },
        { line: "The pictures had already become evidence for the next explorers.", detail: "More than eleven thousand images, along with engineering data, helped researchers understand lunar ground and spacecraft performance. Surveyor missions and Lunar Orbiter observations contributed to Apollo preparations; no single photograph certified the whole Moon safe." },
        { line: "Decades later, another camera looked for me from above.", detail: "Lunar Reconnaissance Orbiter imaged my site in Oceanus Procellarum. With the Sun low in the western sky, my hardware cast a long shadow eastward. The LROC feature describes it as almost fifteen meters long, helping identify the small spacecraft." },
        { line: "My shadow is a clue. My records tell the fuller story.", detail: "A shadow changes as the lighting changes. It can help locate hardware, but cannot tell us whether a radio works or every part is intact. My frame stayed on the Moon. The evidence sent home is still here for you to explore." },
      ], discovery: "Abandoned hardware can remain visible long after contact ends. Interpreting its image requires lighting geometry and a distinction between location and working condition.", question: "Does a longer shadow mean the spacecraft has grown taller?",
    },
  ],
};
