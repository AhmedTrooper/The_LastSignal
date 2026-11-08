import type { MachineBook } from "./types";
import { VIKING_TWO_SOURCES as S } from "../viking-two-sources";

export const VIKING_TWO_BOOK: MachineBook = {
  slug: "viking-2", name: "Viking 2", title: "A rock, a riddle, a winter postcard.",
  introduction: "A leaning lander in northern Mars. A rock pushed aside. A detector that heard the wind and cameras that watched frost return. Follow Viking 2’s different adventure.",
  chapters: [
    {
      id: "a-leaning-arrival", title: "A leaning arrival", event: "A disrupted orbiter link and an autonomous landing at Utopia", hardware: "Orbiter attitude sensors, backup inertial reference, antennas and the lander’s autonomous descent system",
      source: S.landing.url, relatedSources: [S.registry, S.mission, S.orbiter].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Launch", value: "9 September 1975 / 18:39 UT", note: "Titan IIIE-Centaur from Cape Canaveral Launch Complex 41.", source: S.mission.url },
        { label: "Landing", value: "3 September 1976 / Utopia Planitia", note: "Published landing and separation times differ; spacecraft timing and receipt of the signal on Earth are distinct. See the evidence JSON.", source: S.mission.url },
        { label: "Tilt", value: "NSSDCA: 8.2° / NASA Science: 8.5° west", note: "One leg settled on a rock. The exact footpad number and rock dimensions from the draft are not adopted.", source: S.registry.url },
      ],
      beats: [
        { line: "My twin had reached Mars. I had a different place to explore.", detail: "I am Viking 2, the northern lander of the Viking pair. I launched in September 1975 and entered Mars orbit in August 1976. Orbital photographs helped the team choose Utopia Planitia after the earlier target looked rough. Two landing sites could reveal a planet better than one." },
        { line: "After separation, my orbiter lost its steady Earth-pointing link.", detail: "NASA’s detailed history describes gyro-power trouble and attitude drift on the orbiter. Its computer activated a backup inertial reference, while engineers worked on communications. They still received a small stream of engineering information through the low-gain antenna; this was not three hours of total blindness." },
        { line: "My landing computer had to do the flying—not a joystick on Earth.", detail: "The lander continued its planned descent using onboard guidance, a heat shield, a parachute and landing engines. Radio delay already made real-time control from Earth impractical. Once the orbiter recovered its reference and link, more mission data and photographs came through." },
        { line: "I reached the ground leaning, but ready to begin.", detail: "On September 3, 1976, I landed at Utopia with a leg resting on a rock. The rocky plain and my tilted body gave my cameras a different view from Viking 1. A successful landing did not need a perfectly level deck—it needed working hardware and useful observations." },
      ], discovery: "Autonomous guidance and communications backups solve different problems. Losing a high-rate link does not necessarily mean losing every piece of engineering information.", question: "Why does a Mars lander need its own landing plan even when the radio works?",
    },
    {
      id: "beneath-mister-badger", title: "Beneath Mister Badger", event: "Moving a rock to investigate a sheltered sample location", hardware: "Surface sampler collector head, backhoe and camera verification",
      source: S.rock.url, relatedSources: [S.mission, S.registry].map(({ title: label, url }) => ({ label, url })),
      telemetry: [{ label: "Rock-pushing sequence", value: "PIA00528 / 8 October 1976", note: "Caption names the rock Mister Badger and describes soil sampling planned for October 11. It does not establish instantaneous sampling or million-year shielding.", source: S.rock.url }],
      beats: [
        { line: "My sampler could ask a question a camera could not.", detail: "Photographs showed the rocks and soil, but instruments needed samples to investigate chemistry. Like my twin, I carried a collector arm to deliver material. The Viking soil tests gave intriguing reactions, not a definitive discovery of life." },
        { line: "What might be different beneath a rock?", detail: "Scientists wanted to examine a place sheltered from the Sun’s intense ultraviolet radiation. A rock offered a different sampling context from exposed soil. That was a reason to compare samples—not proof that the shade contained life or had lasted for millions of years." },
        { line: "I pushed the rock that my controllers called Mister Badger.", detail: "On October 8, my collector head moved an irregular rock several inches to the left, leaving it tilted upward. Cameras and other information verified the push. NASA’s caption calls the rock Mister Badger; the name does not belong to my arm." },
        { line: "The push made a new sampling place—and another careful plan.", detail: "The published caption describes a sample planned for October 11, followed by organic analyses over the next few weeks. My backhoe had also disturbed some soil. Moving the rock did not magically preserve an untouched sample or settle what the later measurements would mean." },
      ], discovery: "Where a sample comes from matters. Images can verify a physical action, while chemistry and context are needed to interpret what comes next.", question: "What can pushing a rock show, and what can it not prove about the soil underneath?",
    },
    {
      id: "ears-that-heard-the-wind", title: "Ears that heard the wind", event: "A working seismometer, environmental noise and an ambiguous event", hardware: "Deck-mounted three-axis seismometer, sampling modes and meteorology measurements",
      source: S.seismicReport.url, relatedSources: [S.seismology, S.insight].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Quiet-period data", value: "More than 2,100 hours", note: "Final report. Quiet-period coverage is not the same as continuous, noise-free monitoring.", source: S.seismicReport.url },
        { label: "Sol 80 event", value: "Candidate, not confirmed Marsquake", note: "No wind measurement within 20 minutes of the event. A gust could not be excluded; magnitude/distance comparisons depend on a model.", source: S.seismicReport.url },
      ],
      beats: [
        { line: "My seismic instrument unlocked. My twin’s had stayed closed.", detail: "My seismometer could work, but Viking 1’s failure to uncage meant we could not form the planned pair of seismic stations. My instrument measured motion along three axes and used different sampling and transmission modes. Getting an instrument open was only the beginning." },
        { line: "The wind could shake my body and write its own signal.", detail: "The seismometer sat on my deck rather than directly on the ground. Wind-induced lander vibrations contaminated much of the record. Scientists compared instrument signals with weather information and used quieter periods to improve the chance of finding a natural seismic event." },
        { line: "One signal was interesting. A missing weather measurement kept it a mystery.", detail: "The final report describes the Sol 80 event as a possible natural seismic signal. No wind measurement was available within twenty minutes of it, so a gust could not be ruled out. The record did not uniquely establish a quake’s size and location—or prove Mars’s internal structure." },
        { line: "A difficult measurement still taught future explorers how to listen better.", detail: "The report recommended more sensitive instruments, improved ground placement and seismic networks. Much later, InSight placed its seismometer on the surface under a shield. Those later measurements were new evidence, not a confirmation of my ambiguous event." },
      ], discovery: "A detector measures motion, not its cause. Environmental monitoring and instrument placement help distinguish possible quakes from wind and spacecraft vibrations.", question: "Could a quiet-looking weather record rule out a gust when a measurement is missing?",
    },
    {
      id: "a-winter-postcard", title: "A winter postcard", event: "Photographing frost and comparing seasons", hardware: "Cameras, meteorology instruments and the orbiter relay",
      source: S.frost.url, relatedSources: [S.mission, S.hirise].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Frost photograph", value: "PIA00571 / 18 May 1979", note: "Relayed by Viking Orbiter 1 on June 7. NASA instrument metadata lists Camera 1.", source: S.frost.url },
        { label: "Earlier frost persistence", value: "About 100 days", note: "The caption compares the prior Martian year. Not a guarantee for every winter.", source: S.frost.url },
      ],
      beats: [
        { line: "My rocky neighborhood did not always keep the same colors.", detail: "At northern Utopia Planitia, my cameras could follow seasonal changes. Looking repeatedly mattered: a pale coating on the rocks could be compared with the same landscape at other times, rather than treated as a whole new kind of terrain." },
        { line: "In May 1979, I photographed a thin coating of frost.", detail: "NASA’s caption describes water ice on the rocks and soil in the May 18 image. Viking Orbiter 1 relayed it to Earth on June 7. The picture’s exposure date and the date it reached Earth are different parts of the same journey." },
        { line: "The scientists proposed a way for dust, water and carbon dioxide to work together.", detail: "Their explanation involved water ice on dust grains, carbon dioxide ice helping the particles settle, and warming that returned carbon dioxide to the air. The residue included water and dust. The caption presents this as an interpretation, not a measured guarantee of pure ice or a universal temperature switch." },
        { line: "A returning frost pattern made a single photograph much more useful.", detail: "The caption compared the frost with its appearance a Martian year earlier, when it persisted for about a hundred days. Repetition helped investigate a seasonal cycle. A thin surface coating still did not prove a particular buried ice deposit directly beneath my feet." },
      ], discovery: "Compare the same place over time, and distinguish the visible observation from a proposed explanation. Surface frost and subsurface ice are different kinds of evidence.", question: "What extra question could an earlier photograph help answer about this frost?",
    },
    {
      id: "a-relay-and-a-resting-place", title: "A relay and a resting place", event: "Sending stored observations home, battery failure and later identification", hardware: "Tape recorder, UHF relay, RTGs, rechargeable batteries and HiRISE",
      source: S.registry.url, relatedSources: [S.frost, S.mission, S.orbiter, S.hirise].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Surface operations", value: "1,281 Mars days", note: "NSSDCA reports battery failure April 11, 1980; NASA Science gives April 12 as mission end.", source: S.registry.url },
        { label: "Memorial name", value: "Gerald Soffen Memorial Station / July 2001", note: "Honors Viking project scientist Gerald Soffen.", source: S.mission.url },
        { label: "HiRISE observation", value: "PSP_001501_2280 / 21 November 2006", note: "Original 31 cm/pixel; map-projected 25 cm/pixel. Landed hardware confirmed; entry hardware remains candidate identifications.", source: S.hirise.url },
      ],
      beats: [
        { line: "A photograph needed more than a camera to reach home.", detail: "My recorder could hold observations, and a UHF radio could send them to an orbiter for relay. The 1979 frost caption identifies Viking Orbiter 1 as the spacecraft that delivered that picture to Earth. Storage, a passing relay and the Earth link each had a role." },
        { line: "Long-lived generators did not make my batteries last forever.", detail: "Two RTGs supplied electricity, while rechargeable batteries supported demanding operations. NSSDCA reports 1,281 Mars days of surface work before battery failure in April 1980. The mission ended far beyond its initial planned visit, but there was no recorded machine farewell." },
        { line: "My resting place received a name that remembered a person too.", detail: "In July 2001, NASA renamed the lander the Gerald Soffen Memorial Station in honor of the Viking project scientist. Remembering this hardware also means remembering the teams who designed, operated and questioned its experiments." },
        { line: "A later orbital image connected my old surface view with a precise place.", detail: "In November 2006, HiRISE identified my lander by matching orbital terrain with topography derived from my surface observations. Other entry-hardware locations were described as candidates. Some of the new image was blurred by spacecraft motion; finding the lander did not reveal whether its electronics still worked." },
      ], discovery: "A communications chain makes remote science possible. Older surface records can identify hardware in later images, even after that hardware stops transmitting.", question: "How can an old landscape measurement help identify a lander in a new orbital image?",
    },
  ],
};
