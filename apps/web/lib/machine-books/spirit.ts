import type { MachineBook } from "./types";
import { SPIRIT_SOURCES as S } from "../spirit-sources";

export const SPIRIT_BOOK: MachineBook = {
  slug: "spirit", name: "Spirit", title: "The rover that kept looking.",
  introduction: "A rocky plain. A distant hill. A broken wheel with a surprise underneath. Follow the clues my instruments found—and the people who helped me keep exploring.",
  chapters: [
    {
      id: "a-rocky-welcome", title: "A rocky welcome", event: "Landing in Gusev Crater, inspecting volcanic rock and looking back at Earth", hardware: "Airbag landing system, Rock Abrasion Tool, Navcam and Pancam",
      source: S.mission.url, relatedSources: [S.registry, S.grinding, S.earth, S.climb].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Launch", value: "10 June 2003 / 17:58:47 UTC", note: "NASA mission summary: Delta 7925-9.5 from Cape Canaveral SLC-17A.", source: S.mission.url },
        { label: "Landing signal received", value: "4 January 2004 / 04:35 UT", note: "Earth-received time in NSSDCA; January 3 in Pacific time.", source: S.registry.url },
        { label: "Adirondack grinding", value: "Sol 34 / 6 February 2004", note: "PIA05223: a 45.5 mm diameter patch, 2.65 mm deep. Exposure date differs from publication date.", source: S.grinding.url },
        { label: "Earth image", value: "PIA05547 / Sol 63", note: "A processed Navcam/Pancam composite, taken one hour before sunrise.", source: S.earth.url },
      ],
      beats: [
        { line: "My welcome to Mars came with a lot of bouncing.", detail: "I am Spirit, one of NASA’s twin Mars Exploration Rovers. After launching in June 2003, my airbag-wrapped lander bounced 28 times in Gusev Crater. Earth received the landing signal on January 4, 2004. The site was named Columbia Memorial Station." },
        { line: "The rocks had a different story from the one people expected.", detail: "Gusev’s shape suggested an ancient lake. Once an early computer problem was resolved, my abrasion tool ground into Adirondack to expose fresh rock for my instruments. The plains were volcanic: lava deposits appeared to cover the older lakebed evidence scientists hoped to find." },
        { line: "Before sunrise, I helped make a tiny picture of home.", detail: "On Sol 63, my navigation and panoramic cameras supplied the images combined into PIA05547. Earth was a faint point, made easier to see by processing. NASA identifies it as the first picture of Earth taken from the surface of another planet." },
        { line: "Faraway hills gave us somewhere new to look.", detail: "The Columbia Hills stood about three kilometers from my landing site. Their older rocks offered another chance to investigate water’s history. My wheels would take the instruments across the plain, turning a view on the horizon into a place to explore." },
      ], discovery: "An orbital view suggests questions; a rover tests them against real rocks. Finding something unexpected can change the route of an investigation.", question: "Why inspect a rock’s interior instead of only photographing its dusty surface?",
    },
    {
      id: "a-fresh-start", title: "A fresh start", event: "The January–February 2004 flash-memory recovery", hardware: "Onboard computer, flash storage, alternate operating mode and radio commands",
      source: S.recovery.url, relatedSources: [S.reformat, S.mission].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Trouble began", value: "January 2004", note: "The mission summary dates loss of contact to January 21; the February 5 status report dates interference to January 22. These reports describe the same recovery period.", source: S.mission.url },
        { label: "Stable normal boot reported", value: "1 February 2004", note: "After deletion of thousands of files, including files left from cruise.", source: S.recovery.url },
        { label: "Reformat confirmed", value: "5 February report: completed the previous Wednesday", note: "That is February 4, 2004; reformatting followed restored normal boot.", source: S.reformat.url },
      ],
      beats: [
        { line: "Before my first rock grinding, my computer needed help.", detail: "In January 2004, communication and memory problems interrupted my work. My software had difficulty managing flash storage—the kind of memory that keeps files when power is off. Repeated restarts kept interrupting normal operations." },
        { line: "Restarting did not clear the files that were causing trouble.", detail: "Thousands of files had accumulated, including many left over from my flight to Mars. The February 1 recovery report describes my computer resetting about once an hour. The team needed another way to operate me while investigating the storage problem." },
        { line: "My engineers found a way around the problem.", detail: "Commands from Earth put me into a temporary operating mode that avoided flash memory. It gave the team a way to work while they deleted unnecessary files. Nobody had to deliver a replacement computer to Mars." },
        { line: "A clean start let the rock investigation continue.", detail: "By February 1, normal boot was stable again. The February 5 report confirmed that reformatting had succeeded the previous day, as a precaution against recurrence. Next came brushing and grinding Adirondack—not a promise that I would never have another memory problem." },
      ], discovery: "A restart does not remove a persistent storage problem. Recovery modes let engineers investigate and repair a system remotely.", question: "What changes when a computer starts without using the troublesome storage?",
    },
    {
      id: "the-view-from-the-hill", title: "The view from the hill", event: "Water-altered rocks, wind and the climb to Husband Hill", hardware: "Mössbauer spectrometer, solar arrays, wheels, Navcam and Pancam",
      source: S.climb.url, relatedSources: [S.goethite, S.summit, S.dustMovie, S.mission, S.endReport].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Clovis mineral", value: "Goethite", note: "The published Mössbauer spectrum identifies a hydroxyl-bearing mineral: evidence of water activity, not organisms.", source: S.goethite.url },
        { label: "Summit height", value: "82 m above nearby plains / 106 m above landing site", note: "Different reference levels explain the two heights in the September 1, 2005 report.", source: S.climb.url },
        { label: "Summit mini-panorama", value: "PIA04183 / August 2005", note: "Caption dates the image to August 23, Sol 582. This is a roughly 90-degree view, not a full-circle image.", source: S.summit.url },
      ],
      beats: [
        { line: "In the hills, a mineral carried a clue about water.", detail: "My Mössbauer spectrometer identified goethite in a rock called Clovis. Hydroxyl is part of that mineral’s structure. Along with other altered rocks, it gave scientists strong evidence that water had affected this region." },
        { line: "Wind could make a difference to a solar-powered explorer.", detail: "Dust blocked some sunlight from my panels, while wind-cleaning events improved the power available. My cameras also recorded dust devils crossing Gusev. Those distant movies show moving dust—not a close-up of a whirlwind cleaning my deck." },
        { line: "By August 2005, I was looking out from Husband Hill.", detail: "The summit stood 82 meters above the nearby plains, and 106 meters above my landing site. NASA describes me as the first robot to summit a hill on another planet. My camera views let everyone back on Earth share the climb." },
        { line: "The view was useful for more than a postcard.", detail: "Climbing exposed different rock types and helped scientists read how layers were tilted. From above, the team could investigate routes into the basin below and toward the feature called Home Plate. A good view helped plan the next scientific question." },
      ], discovery: "A rover’s wheels give instruments access to different rocks. Height and perspective help geologists understand the sequence of a landscape’s history.", question: "Why can two different heights describe the same summit correctly?",
    },
    {
      id: "the-clue-under-my-wheel", title: "The clue under my wheel", event: "A failed wheel exposed silica-rich soil near Home Plate", hardware: "Right-front wheel, Mini-TES and Alpha Particle X-ray Spectrometer",
      source: S.silica.url, relatedSources: [S.silicaReport, S.endReport].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Right-front wheel failure", value: "Sol 779 / 2006", note: "The end-of-mission report documents the failed drive actuator; no invented sparks or exact motor-brush diagnosis.", source: S.endReport.url },
        { label: "Soil exposed", value: "Sol 1150 / 29 March 2007", note: "The exposure predates the instrument measurements and public announcement.", source: S.silica.url },
        { label: "APXS measurements", value: "Sols 1189–1190 / 8–9 May 2007", note: "Mini-TES had flagged the target remotely on April 20. APXS found approximately 90% silica at close range.", source: S.silica.url },
      ],
      beats: [
        { line: "A wheel that stopped turning changed how I travelled.", detail: "My right-front wheel drive failed in 2006. My team kept exploring by driving me backward and dragging that wheel. It was a real limitation, not a special digging tool we had planned to use." },
        { line: "The dragged wheel uncovered something bright.", detail: "On March 29, 2007, it exposed a patch of soil near Home Plate that the team named Gertrude Weise. A pale track stood out against the darker surface. Looking closely at an accidental disturbance opened a new investigation." },
        { line: "Two instruments helped turn a color into a discovery.", detail: "Mini-TES first detected a silica signature from a distance. The team then brought my arm’s APXS close to the soil. Measurements on May 8 and 9 found approximately 90 percent silica. The mineral evidence mattered more than the patch’s bright appearance." },
        { line: "The soil pointed toward a wetter, warmer past.", detail: "Scientists proposed hot springs or acidic volcanic steam as ways to concentrate the silica. Such environments on Earth can support microbes. My finding was evidence of potentially habitable conditions—not proof that life had lived on Mars." },
      ], discovery: "An unexpected exposure can reveal a hidden clue. Cameras locate a target; different instruments test its chemistry and mineral composition.", question: "Does bright soil alone tell us what it is made of?",
    },
    {
      id: "the-record-that-stayed", title: "The record that stayed", event: "The Troy embedding, winter silence and the evidence Spirit left behind", hardware: "Wheels, Earth test rover, solar arrays, radio tracking and archived camera data",
      source: S.endReport.url, relatedSources: [S.troy, S.troySoil, S.stationary, S.mission, S.orbital].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Embedding began", value: "Sol 1886 / 23 April 2009", note: "A sequence of drives, not a single precisely dated May 1 accident; see PIA12142.", source: S.troy.url },
        { label: "Last communication", value: "Sol 2210 / 22 March 2010", note: "The immediate cause of the later loss of contact is unknown.", source: S.endReport.url },
        { label: "Mission completion", value: "25 May 2011", note: "Public mission closure. The technical report separately records recovery commands through July 13, 2011.", source: S.mission.url },
        { label: "Distance and source images", value: "7,730.50 m / 124,839 images", note: "End-of-mission report appendix, printed pages 24 and 28; total source images through Sol 2210, not the draft’s raw-gallery count.", source: S.endReport.url },
      ],
      beats: [
        { line: "At Troy, the surface hid ground my wheels could not handle.", detail: "In April 2009, beside Home Plate, my wheels began breaking through a crust into loose material. Repeated drives made little progress. Engineers practiced possible escape maneuvers with a test rover on Earth, while my instruments studied the disturbed soil." },
        { line: "My next challenge became finding enough winter sunlight.", detail: "A second wheel stopped working in November. In January 2010, NASA designated me a stationary science platform. I tilted slightly south, but the winter Sun stayed in the northern sky. The team tried to improve that angle so my panels could collect more light." },
        { line: "March 22, 2010 was the last day Earth heard from me.", detail: "I had explored for more than six years and travelled 7.73 kilometers. The immediate cause of the silence is unknown. The mission report identifies harsh winter conditions as the likely root cause, with dust and my trapped position limiting energy. There are no recorded farewell words to quote." },
        { line: "My mission ended. My evidence kept its place in the story.", detail: "NASA announced mission completion on May 25, 2011. More than 124,000 images and many measurements remained for research. An orbiter had also photographed me shining beside Home Plate: sunlight reflecting from my panels, not a new radio signal. You can still explore the records I sent home." },
      ], discovery: "Hardware can fall silent while its measurements keep helping science. A bright orbital image tells us about reflected light, not whether a rover is awake.", question: "What can a photograph tell us—and what would require a radio signal?",
    },
  ],
};
