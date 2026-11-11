import type { MachineBook } from "./types";
import { LRV_SOURCES as S } from "../lrv-sources";

export const LRV_BOOK: MachineBook = {
  slug: "apollo-15-rover", name: "Apollo 15 Rover", title: "The car that unfolded a bigger adventure",
  introduction: "I arrived folded against a lunar lander. Then two astronauts opened my chassis, tested my wheels, and drove toward rocks they could not have explored so easily on foot. My story ends on the Moon—but the samples came home.",
  chapters: [
    {
      id: "a-car-in-a-cupboard", title: "A car in a cupboard", event: "Designing and stowing a folding lunar vehicle before Apollo 15", hardware: "Hinged chassis, mesh wheels, individual drive motors and two silver-zinc batteries", source: S.hardware.url,
      relatedSources: [{ label: S.summary.title, url: S.summary.url }], telemetry: [{ label: "Development", value: "17 months", note: "NSSDCA's reported development duration; not an exact assembly birthday.", source: S.hardware.url }],
      beats: [
        { line: "Before I could explore the Moon, I had to fit beside a lander.", detail: "I am Apollo 15's Lunar Roving Vehicle. Boeing developed the rover with Delco as a major subcontractor. My three-part aluminum chassis could fold into the descent stage's Quad 1 equipment bay. A larger exploration range began with a smaller package." },
        { line: "My wheels were not filled with air. They were woven from metal.", detail: "Steel-strand mesh formed the tyres, with titanium chevrons supplying traction. Each wheel had its own electric drive motor. This was hardware designed for the Moon's low-gravity vacuum, not an ordinary road car carried into space." },
        { line: "Two batteries had to travel with us. Recharging was not the plan.", detail: "Two non-rechargeable 36-volt silver-zinc batteries powered the drive and steering systems. Passive thermal control helped manage battery temperatures. Energy and heat mattered together; the rover did not carry a solar charging array." },
        { line: "I was built to carry explorers—and bring their samples back to the lander.", detail: "Seats, life-support equipment, cameras, tools and sample storage were part of the vehicle's job. The crew would do the geology. I would extend their reach. First, the folded machine needed a ride all the way to the Moon." },
      ], discovery: "A spacecraft's packing, power and mobility are linked engineering choices. A folding chassis made a larger surface exploration tool possible.", question: "Why does a lunar car need to be designed around its journey before anyone drives it?",
    },
    {
      id: "the-wheels-unfold", title: "The wheels unfold", event: "Launch on 26 July, Falcon landing on 30 July, and rover deployment on 31 July 1971", hardware: "Falcon equipment bay, deployment reels and tapes, locking chassis and crew controller", source: S.surface.url,
      relatedSources: [{ label: S.hardware.title, url: S.hardware.url }, { label: S.catalog.title, url: S.catalog.url }],
      beats: [
        { line: "On July 26, 1971, I left Earth as folded equipment aboard Apollo 15.", detail: "David Scott, James Irwin and Alfred Worden travelled with the mission. On July 30, Scott and Irwin landed Falcon at Hadley-Apennine. Worden remained in lunar orbit. The rover had not driven a metre yet." },
        { line: "On July 31, Scott and Irwin opened my place in the lander.", detail: "Reels, pulleys, ropes and cloth tapes controlled deployment. The chassis and wheels unfolded and locked as the vehicle was lowered. NSSDCA warns that its early deployment artwork does not exactly reproduce the final flight sequence." },
        { line: "Seats rose. Footrests rose. A packed machine became a vehicle.", detail: "The astronauts removed deployment hardware, raised the seats and footrests, and switched on the electronics. I was being prepared to carry people, not to choose my own route. Scott would operate the hand controller." },
        { line: "The first test drive should have been a beginning. A steering fault made it a puzzle.", detail: "Scott became the first person to drive on the Moon. But during checkout, the crew found that the front steering was not working. The rover had another steering system. Could the first excursion still go ahead?" },
      ], discovery: "Folding mechanisms and controlled deployment turn launch packaging into working surface hardware. Checkout reveals which systems are actually available.", question: "What would you test before taking a newly unfolded vehicle away from its lander?",
    },
    {
      id: "another-way-to-steer", title: "Another way to steer", event: "First-EVA front steering fault and rear-steering operation on 31 July 1971", hardware: "Separate front/rear steering motors, hand controller, gyro and odometer", source: S.summary.url,
      relatedSources: [{ label: S.hardware.title, url: S.hardware.url }], telemetry: [{ label: "Steering response", value: "Rear steering for EVA 1", note: "The front system was unavailable; a cause is not invented.", source: S.summary.url }],
      beats: [
        { line: "My front wheels would not steer. My rear wheels still could.", detail: "The vehicle had separate front and rear steering systems. After troubleshooting, the crew and Mission Control chose to make the first excursion with rear-wheel steering. One failed function did not remove every way to manoeuvre." },
        { line: "Scott's hand controller still commanded the drive, turns and brakes.", detail: "A T-shaped controller between the seats operated the vehicle. The astronauts drove it themselves. This was not a robotic rover taking commands one metre at a time from Earth." },
        { line: "Moving farther away also meant keeping track of the way back.", detail: "A directional gyro and wheel-distance measurements fed the navigation computer. A Sun-shadow device supplied a manual heading check. This system tracked the direction and distance back to Falcon; it was not GPS." },
        { line: "We set off toward Elbow Crater with a working way to turn—and a way home.", detail: "Scott and Irwin described the geology during the first traverse. At stops, they aimed the high-gain antenna toward Earth so scientists and controllers could follow the television pictures. The wheels and the radio link were helping the same investigation." },
      ], discovery: "Redundant functions and navigation can preserve useful exploration after a fault. Getting there and returning safely are parts of the same plan.", question: "Why is a working backup steering system useful only if the crew also knows how to get back?",
    },
    {
      id: "the-seatbelt-passenger", title: "The seatbelt passenger", event: "Sample 15016's reported collection during the first traverse's return", hardware: "Crew seatbelt, sample collection equipment and later rock-analysis tools", source: S.seatbelt.url,
      relatedSources: [{ label: S.surface.title, url: S.surface.url }], telemetry: [{ label: "Sample", value: "15016,0 · Seatbelt Rock", note: "NASA curator account; precise collection documentation was missing.", source: S.seatbelt.url }],
      beats: [
        { line: "A seatbelt stop brought an unexpected passenger: a Moon rock.", detail: "NASA's sample curators recount that Scott spotted a rock while the crew was hurrying back toward Falcon. He reported a stop to adjust his seatbelt and collected the rock. This is an attributed historical account—not invented rover dialogue." },
        { line: "No field photograph recorded the stop.", detail: "No collection photograph or field description documented the stop. Curators initially could not identify when or where the sample had been collected. Scott's later explanation connected the rock with the seatbelt stop." },
        { line: "The small holes in the rock held a much older story.", detail: "Sample 15016 became known as Seatbelt Rock. NASA classifies it as low-titanium olivine basalt. Numerous cavities, called vesicles, preserve evidence of gas bubbles in magma as the rock formed." },
        { line: "What could one extra rock help people learn about the Moon?", detail: "NASA's later sample studies report an age of 3.4 billion years. Its sample page now offers photographs, a three-dimensional model and X-ray CT views. These later research resources explain the sample's scientific value; they are not observations the rover made during the drive." },
      ], discovery: "A sample can preserve a geological history, but its collection context is evidence too. A memorable story must not fill gaps in that record with invented coordinates.", question: "Why should a rock collector record where a sample was found, not just bring it home?",
    },
    {
      id: "uphill-to-a-white-rock", title: "Uphill to a white rock", event: "Restored front steering and the second traverse on 1 August 1971", hardware: "Circuit breakers, steering systems, brakes, sample bags and camera antenna", source: S.surface.url,
      relatedSources: [{ label: S.summary.title, url: S.summary.url }],
      beats: [
        { line: "On August 1, my front steering worked again.", detail: "Before the second excursion, the astronauts recycled the circuit breakers. NASA's mission summary records that the front steering became completely operational. That documents the recovery; it does not establish an invented failure cause." },
        { line: "A slope changed the work from driving to holding still.", detail: "At Station 6a, Scott sampled a greenish boulder while Irwin held the rover steady. NASA describes a 15-degree slope at this particular stop. The vehicle's position mattered while the astronaut worked beside it." },
        { line: "At Spur Crater, a white crystalline rock caught the crew's attention.", detail: "Among their samples, Scott and Irwin collected the rock later dubbed the Genesis Rock. Their geology training, observations and collection work made the discovery possible. The rover delivered the team to the site; it did not identify the rock for them." },
        { line: "My cargo was becoming a set of questions for scientists on Earth.", detail: "The crew packed the samples and headed back toward Falcon, stopping for more geology along the way. Photographs, sample labels and the rocks themselves would let researchers examine the observations after the journey ended." },
      ], discovery: "Mobility extends the places a trained scientist can investigate. Vehicle handling, observations and sample context all contribute to the science.", question: "What does the rover make possible that a photograph of the same hillside cannot?",
    },
    {
      id: "a-wall-with-layers", title: "A wall with layers", event: "Third traverse to Hadley Rille on 2 August 1971", hardware: "Rover navigation, cameras, core-sampling equipment and cargo storage", source: S.summary.url,
      relatedSources: [{ label: S.surface.title, url: S.surface.url }],
      beats: [
        { line: "Our last drive led toward a canyon called Hadley Rille.", detail: "Scott and Irwin visited stops near the rille during their third excursion. They collected samples and photographed the opposite wall. The rover was carrying people and tools between different geological settings—not racing toward a finish line." },
        { line: "The wall showed layers. A picture could preserve their arrangement.", detail: "NASA's mission summary records exposed layering in the west wall of Hadley Rille. The images supplied evidence about the terrain, while collected material supplied evidence that could be examined in laboratories." },
        { line: "The return trip also carried a core sample from the experiment site.", detail: "The astronauts retrieved the remaining sections of the deep-core sample on their way back. Driving, walking, drilling and sampling were different jobs working toward the same scientific record." },
        { line: "There was one job left for me, and it did not need moving wheels.", detail: "Back near Falcon, the crew unloaded the vehicle. The rover had helped extend exploration beyond walking-only missions. Now Scott selected a parking place for a ground-controlled television view of the coming ascent." },
      ], discovery: "Pictures describe where rocks sit; samples reveal properties that pictures cannot. Transportation connects these observations across a landscape.", question: "Why collect both photographs and samples when investigating a layered canyon wall?",
    },
    {
      id: "parked-to-watch", title: "Parked to watch", event: "Final parking and television coverage of Falcon's ascent on 2 August 1971", hardware: "Ground-controlled television assembly, communications relay and high-gain antenna", source: S.summary.url,
      relatedSources: [{ label: S.surface.title, url: S.surface.url }],
      beats: [
        { line: "My last assignment was to stay parked and help Earth watch.", detail: "Scott chose elevated terrain for a better view and left the rover away from Falcon. The television camera and communications equipment could provide ground-controlled coverage of the ascent. Parking was part of the mission, not an accidental abandonment." },
        { line: "The antenna connected a quiet vehicle with people far away.", detail: "The high-gain antenna and lunar communications relay carried the television link. Earlier, the camera had helped people on Earth follow scientific work at the stops. Now the crew prepared to leave the surface." },
        { line: "Falcon's ascent stage left on August 2. My wheels did not go with it.", detail: "The rover, camera and relay equipment remained on the Moon. These were different pieces of hardware from Falcon's ascent stage and the command module that returned the crew to Earth." },
        { line: "My driving ended. That is not an exact time of battery death.", detail: "NASA documents the three excursions and final parking task. The cited records do not supply a uniquely verified final rover radio timestamp, present battery condition, or spoken goodbye from the machine. Those values remain unknown." },
      ], discovery: "Equipment left behind can finish a deliberate task. Ending crew use, losing a radio link and proving electrical failure are not the same event.", question: "Why should a mission's last recorded activity not automatically be labelled the moment every component died?",
    },
    {
      id: "the-wheels-stayed-the-clues-travelled", title: "The wheels stayed. The clues travelled.", event: "The rover's scientific record and later study of the returned samples", hardware: "Archived photographs, sample collections, laboratory analysis and mission records", source: S.legacy.url,
      relatedSources: [{ label: S.hardware.title, url: S.hardware.url }, { label: S.seatbelt.title, url: S.seatbelt.url }, { label: S.catalog.title, url: S.catalog.url }],
      beats: [
        { line: "The crew's journeys covered about twenty-eight kilometres—not one straight road.", detail: "NSSDCA gives 27.8 kilometres and three hours, two minutes of driving. NASA's mission summary gives about 27.9 kilometres and three hours. We retain their attribution instead of manufacturing a falsely exact combined total." },
        { line: "A landing-site coordinate is not automatically my parking coordinate.", detail: "NSSDCA publishes an LRO-derived position for Falcon in a stated reference frame. That identifies the lunar module's landing location. This edition does not relabel it as the rover's exact final wheel position." },
        { line: "On Earth, researchers can still look inside Seatbelt Rock.", detail: "NASA's Astromaterials 3D collection provides a model and X-ray CT imagery of sample 15016. The hardware stayed on the Moon; the physical samples and documented observations became material for further investigation." },
        { line: "I did not need to come home to change what people could learn.", detail: "The lunar rovers helped crews reach more varied geology on Apollo 15, 16 and 17. The scientific legacy is in the evidence: photographs, sample context, laboratory results and a record of the engineering that made those journeys possible." },
      ], discovery: "An exploration vehicle's lasting value is not just its distance travelled. It is the evidence people could collect because the vehicle worked.", question: "If you could keep one rover record for a future scientist, what would you choose—and why?",
    },
  ],
};
