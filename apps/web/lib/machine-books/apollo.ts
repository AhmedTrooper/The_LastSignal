import type { MachineBook } from "./types";

const LANDING = "https://apollojournals.org/alsj/a11/a11.landing.html";
const STEP = "https://apollojournals.org/alsj/a11/a11.step.html";
const SCIENCE = "https://apollojournals.org/alsj/a11/a11.clsout.html";
const ASCENT = "https://apollojournals.org/alsj/a11/a11.launch.html";

export const APOLLO_BOOK: MachineBook = {
  slug: "apollo-11-lander", name: "Eagle", title: "The part that stayed",
  introduction: "I carried Neil and Buzz to the Moon. Each chapter remembers one real event—and the equipment that helped it happen.",
  chapters: [
    {
      id: "undocking", title: "Two spacecraft, one promise", event: "Leaving Columbia before the lunar landing", hardware: "Docking connection, landing gear, ascent and descent stages", memory: "undocking",
      source: "https://apollojournals.org/afj/ap11fj/17day5-undock-doi.html#1001203",
      beats: [
        { line: "I am Eagle. Neil and Buzz were coming down to the Moon with me.", detail: "Michael Collins would stay above us in Columbia. Before the landing could begin, our two spacecraft had to separate.", art: "body" },
        { line: "Michael watched as I turned outside his window.", detail: "My landing gear was already extended. He checked it and filmed the little spacecraft that would carry his crewmates toward the surface.", art: "body" },
        { line: "I had two stages, and each carried a different job.", detail: "My lower stage held the landing engine and legs. My upper stage held the cabin and another engine for the return to orbit.", art: "thermal" },
        { line: "Columbia stayed in orbit. My landing journey could begin.", detail: "The two parts of me remained joined. Separating from Columbia was the start of a carefully planned trip down—and a meeting in orbit to come.", art: "body" },
      ], discovery: "The mission divided its work between spacecraft, and Eagle divided its work between two stages.", question: "Why would the crew need a separate engine for the trip back up?",
    },
    {
      id: "alarm", title: "The warning that did not stop me", event: "A 1202 computer alarm during powered descent", hardware: "Guidance computer and restart-protection software", memory: "alarm", source: `${LANDING}#1023826`,
      beats: [
        { line: "I was descending toward the Moon with Neil and Buzz when 1202 lit my display.", detail: "My guidance computer had more work than it could handle. The warning reached the crew while the landing was still unfolding.", art: "alarm" },
        { line: "Too much work did not mean that all my work had stopped.", detail: "Restart protection preserved essential guidance tasks. My software could recover important calculations while lower-priority work was set aside.", art: "priorities" },
        { line: "People in Houston listened, checked, and made a decision.", detail: "Steve Bales and the guidance team assessed the recovery. Charlie Duke passed the decision to continue to the astronauts.", art: "priorities" },
        { line: "I kept guiding. The crew kept flying.", detail: "The landing could continue because software protection and human judgment worked together. Understanding the warning mattered as much as noticing it.", art: "boulders" },
      ], discovery: "A computer can protect essential work during overload; Mission Control still had to assess what the recovery meant.", question: "Which job should a landing computer protect first?",
    },
    {
      id: "touchdown", title: "A place for my feet", event: "The final approach and landing at Tranquility Base", hardware: "Descent engine, contact probes, legs and footpads", memory: "touchdown", source: `${LANDING}#1024540`,
      beats: [
        { line: "I was Eagle, close to the lunar ground—and boulders lay ahead.", detail: "Neil Armstrong needed somewhere the lander could settle. Reaching the Moon was not enough; the final patch of ground mattered.", art: "boulders" },
        { line: "Neil guided me beyond the rough ground while Buzz called out our motion.", detail: "Armstrong used partial manual control. My descent engine could change its thrust as the crew managed the approach.", art: "boulders" },
        { line: "A long probe reached the surface before my footpad did.", detail: "The contact-light call told the crew a probe had touched. The engine-shutdown calls followed as the landing was completed.", art: "thermal" },
        { line: "My legs had a new job: hold our little outpost steady.", detail: "The landing stage supported the cabin and the equipment the astronauts would use outside. Tranquility Base was ready for their surface work.", art: "body" },
      ], discovery: "Controlled descent and stable support made the exploration possible. Landing was an engineering step toward doing science.", question: "Why is touching the ground different from being ready to work on it?",
    },
    {
      id: "first-step", title: "The box that opened a window", event: "Lowering the MESA camera bay before the first steps", hardware: "Lanyard, hinged MESA bay, television camera and radio link", memory: "first-step", source: STEP,
      beats: [
        { line: "Neil was climbing down my ladder. People on Earth were waiting to see.", detail: "I was Eagle, standing at Tranquility Base. A television camera travelled inside my equipment bay, but its view had to be opened.", art: "camera" },
        { line: "A pull on a lanyard lowered the hinged bay.", detail: "The bay was called MESA. Lowering it exposed the camera's view toward my ladder and footpad.", art: "camera" },
        { line: "My camera and radio equipment helped carry the view home.", detail: "As Neil moved toward the surface, people far away could follow the first steps through equipment beside the ladder.", art: "camera" },
        { line: "An equipment box had become a window for Earth.", detail: "Later the astronauts moved the television camera to a tripod to show their work. The same camera could tell more of the visit from a new position.", art: "unpack" },
      ], discovery: "A camera needed a useful viewpoint, a deployment mechanism, and a communication path—not just a lens.", question: "What would happen if the camera worked but its bay never opened?",
    },
    {
      id: "first-vibrations", title: "The footsteps we could measure", event: "Deploying the passive seismic package", hardware: "Seismic sensors, levelling system and solar panels", memory: "science", source: SCIENCE,
      relatedSources: [{ label: "NASA · The seismometer detects the crew’s footsteps", url: "https://www.nasa.gov/history/50-years-ago-one-small-step-one-giant-leap/" }],
      beats: [
        { line: "I had carried a way to listen beneath the quiet lunar ground.", detail: "Eagle's crew brought a passive seismic package outside. This instrument measured ground motion rather than listening through air like a microphone.", art: "unpack" },
        { line: "The astronauts set it down, levelled it, and opened its solar panels.", detail: "Placement and power mattered. The instrument needed to be ready before tiny movements could become useful observations.", art: "seismic" },
        { line: "Even the crew's footsteps became something the instrument could detect.", detail: "Their movements nearby produced signals. Engineers and scientists could examine what the seismic package recorded.", art: "seismic" },
        { line: "The visitors would leave. A new way to study the Moon had begun.", detail: "The package remained on the surface. Its observations joined the mission's scientific record, connecting an instrument on the ground to questions on Earth.", art: "seismic" },
      ], discovery: "Seismic instruments turn ground movements into evidence. Their setup is part of the science.", question: "Why might scientists want to know when astronauts were walking nearby?",
    },
    {
      id: "reflector", title: "A reply made of light", event: "Placing Apollo 11's laser reflector on the surface", hardware: "A passive array of 100 corner cubes", memory: "science", source: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/",
      beats: [
        { line: "Among the experiments I carried was a panel that needed no battery.", detail: "The Apollo 11 astronauts placed it on the Moon. Its hundred corner cubes were shaped to return incoming light toward its source.", art: "unpack" },
        { line: "An observatory on Earth supplied the light.", detail: "Scientists could send a laser pulse toward the lunar array and measure how long its return took. The reflector itself did not send a radio message.", art: "mirror" },
        { line: "One return was a measurement. Many returns could reveal a pattern.", detail: "Repeated observations from the lunar arrays let scientists investigate the Moon's motion over time, instead of guessing from one flash.", art: "mirror" },
        { line: "Something left in the dust became part of a very long experiment.", detail: "Lunar laser ranging has helped measure the Moon's recession and provided evidence about its interior, including a fluid core.", art: "mirror" },
      ], discovery: "A simple passive instrument can support long-term science when its observations are repeated and compared.", question: "Why would a single laser return be insufficient to measure a yearly change?",
    },
    {
      id: "solar-wind", title: "The foil that caught the Sun", event: "Recovering the solar-wind collector near the end of the moonwalk", hardware: "Aluminium collector foil and supporting staff", memory: "science", source: `${SCIENCE}#1112011`,
      relatedSources: [{ label: "NASA · How the solar-wind collector worked", url: "https://www.nasa.gov/history/50-years-ago-on-the-way-to-the-moon-lunar-science-announced/" }],
      beats: [
        { line: "Before the moonwalk ended, one experiment needed a ride home.", detail: "Buzz returned to the solar-wind collector he had set up earlier. Its aluminium foil had been catching particles streaming from the Sun.", art: "unpack" },
        { line: "While the crew worked, the foil had been doing a job of its own.", detail: "Solar-wind particles became trapped in the exposed metal. The next part of this experiment would happen in a laboratory on Earth.", art: "unpack" },
        { line: "Buzz rolled the foil up and packed it for the return flight.", detail: "The collector went into a protective bag and then a sample container. Unlike the reflector, this experiment depended on bringing its evidence home.", art: "unpack" },
        { line: "The foil came home. Its supporting staff stayed behind.", detail: "Scientists studied solar-wind material, including helium, neon, and argon. Different pieces of one experiment had different endings.", art: "quiet" },
      ], discovery: "Some instruments send measurements home; others bring back samples that laboratories can examine.", question: "Why did this collector need to return when the reflector could stay?",
    },
    {
      id: "breaker", title: "A small control, a way home", event: "Operating the damaged engine-arm breaker before ascent", hardware: "Engine-arm circuit breaker on Panel 16", memory: "breaker", source: `${ASCENT}#1232043`,
      beats: [
        { line: "Neil and Buzz were preparing my cabin to leave the Moon when a small control mattered greatly.", detail: "Buzz Aldrin had found the engine-arm circuit breaker's knob broken off. The crew still needed to prepare the ascent system.", art: "broken" },
        { line: "The damaged knob made an ordinary action difficult.", detail: "The breaker was on Panel 16. A problem with its control did not mean that a pen could replace an engine or supply electricity.", art: "broken" },
        { line: "Buzz used a felt-tip pen to push the breaker in.", detail: "The pen helped him operate the damaged control. Houston later confirmed that the engine-arm circuitry looked fine.", art: "pen" },
        { line: "A small problem had been handled. The preparations could continue.", detail: "The crew still followed the ascent preparations. Their everyday tool had helped with one important step toward leaving the surface.", art: "pen" },
      ], discovery: "A large system depends on small controls. Understanding the damaged part made a practical workaround possible.", question: "What did the pen actually do—and what did it not do?",
    },
    {
      id: "liftoff", title: "My last job was to stay", event: "Eagle's ascent from the lunar surface", hardware: "Stage connections, ascent engine and descent-stage launch platform", memory: "liftoff", source: `${ASCENT}#1242202`,
      beats: [
        { line: "I was Eagle, and it was time to send Neil and Buzz back toward Columbia.", detail: "They were inside my upper stage. The landing engine and legs below them had already done their work on the surface.", art: "body" },
        { line: "My two stages were built to part when the return journey began.", detail: "The upper stage carried its own engine. It could leave without lifting the landing engine, landing legs, and other equipment back to orbit.", art: "body" },
        { line: "My ascent engine fired. The cabin rose from the platform beneath it.", detail: "The descent stage served as the launch platform. Neil and Buzz departed for their rendezvous with Michael Collins.", art: "goodbye" },
        { line: "One part of me went with them. One part of me had finished its journey.", detail: "My landing stage remained at Tranquility Base. Staying was part of the design that helped the crew leave.", art: "quiet" },
      ], discovery: "Leaving hardware behind can be a purposeful part of a mission's engineering.", question: "Which equipment would have been unnecessary weight on the return to orbit?",
    },
    {
      id: "seen-again", title: "The shadow that gave me away", event: "A later orbital photograph of the Apollo 11 landing site", hardware: "Eagle's descent stage and LRO's camera", memory: "monument", source: "https://science.nasa.gov/photojournal/apollo-11-second-look/",
      beats: [
        { line: "Long after my crew left, another spacecraft looked toward Tranquility Base.", detail: "Lunar Reconnaissance Orbiter carried a camera above the Moon. It could photograph the place where Eagle's landing stage remained.", art: "quiet" },
        { line: "From orbit, I was a small shape with a shadow.", detail: "The archived image showed the landing site from a different viewpoint. It was a later observation, not a live camera beside me.", art: "quiet" },
        { line: "A newer machine helped people study an older machine's visit.", detail: "The photograph could be considered alongside the crew's recordings and mission records. Different sources preserved different parts of the story.", art: "quiet" },
        { line: "I no longer needed to speak for people to find my story.", detail: "My descent stage had stayed where its work ended. The camera's record gave another generation a way to look back at that place.", art: "quiet" },
      ], discovery: "Later observations can add evidence to a mission whose original hardware has gone quiet.", question: "What can an orbital photograph show that an astronaut's close-up cannot?",
    },
  ],
};
