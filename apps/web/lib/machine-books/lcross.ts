import type { MachineBook } from "./types";
import { LCROSS_SOURCES as S } from "../lcross-sources";

export const LCROSS_BOOK: MachineBook = {
  slug: "lcross", name: "LCROSS", title: "One more job for a rocket stage.",
  introduction: "A used rocket stage. A dark crater. A few minutes to watch what an impact revealed. Follow the clever hardware, a fuel scare, and the evidence for lunar water.",
  chapters: [
    {
      id: "a-stage-with-another-job", title: "A stage with another job", event: "Reusing launch hardware for a lunar experiment", hardware: "ESPA-ring spacecraft, spent Centaur stage, solar array and nine science instruments",
      source: S.overview.url, relatedSources: [S.registry, S.mission, S.operations, S.manager].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Launch", value: "18 June 2009 / 21:32 UT", note: "Atlas V 401 from Cape Canaveral SLC-41, launched with LRO.", source: S.mission.url },
        { label: "Science payload", value: "Nine instruments", note: "Five cameras, three spectrometers and one photometer—not nine cameras.", source: S.overview.url },
      ],
      beats: [
        { line: "A rocket stage that had finished launching us still had a job to do.", detail: "I am LCROSS, the Lunar Crater Observation and Sensing Satellite. NASA launched me with Lunar Reconnaissance Orbiter in June 2009. Instead of immediately abandoning the used Centaur upper stage, my mission kept it as a partner for an experiment." },
        { line: "My own body began with a different use for a strong metal ring.", detail: "NASA Ames and Northrop Grumman built the shepherding spacecraft around an ESPA payload-adapter ring. Equipment panels, a solar array, propulsion and instruments turned that structure into a working spacecraft. Reuse still required engineering and tests." },
        { line: "The question was hiding where ordinary sunlight could not reach.", detail: "Earlier lunar observations had detected hydrogen near the poles. Water was one possible form of that hydrogen, but it was not the only explanation. Cold, shadowed crater floors offered places where volatile materials might remain trapped." },
        { line: "We planned to bring a little hidden material into view.", detail: "After a lunar swingby and a long looping flight, the Centaur would strike a shadowed crater. I would follow, watching the debris with complementary instruments. The purpose was not simply a crash: it was to make a measurement." },
      ], discovery: "Hardware that has completed one task can support another. A useful experiment connects the physical action with a question the instruments can answer.", question: "Why keep the used rocket stage instead of discarding it after launch?",
    },
    {
      id: "the-fuel-scare", title: "The fuel scare", event: "Recovering from excessive attitude-thruster firing", hardware: "Inertial reference unit, star tracker, attitude-control software and hydrazine thrusters",
      source: S.operations.url, relatedSources: [S.mission, S.manager].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Emergency discovered", value: "22 August 2009", note: "The team discovered the problem after reacquiring communications.", source: S.mission.url },
        { label: "Propellant loss", value: "More than half the amount remaining", note: "Mission summary: 140 kg; later operations report: nearly 152 of 202 kg. The narrative does not silently choose or combine estimates.", source: S.operations.url },
      ],
      beats: [
        { line: "During the long flight, my thrusters began working much too hard.", detail: "On August 22, the team regained contact and discovered that I had used more than half my remaining propellant. The problem was excessive control-thruster firing—not a confirmed hole in my fuel tank." },
        { line: "A brief sensor fault had sent my controller down a noisy path.", detail: "Fault-management software switched from my inertial reference unit to rate estimates from the star tracker. Those estimates were noisier, and the controller lacked the needed filtering. It treated the noise as motion and kept firing thrusters to correct it." },
        { line: "My engineers restored the useful measurements and changed the safeguards.", detail: "The inertial unit was still functional. Returning to its rate information reduced propellant use. The team also revised the rules for switching sensors, improved the backup control mode and added protection against excessive fuel consumption." },
        { line: "Saving the mission also meant changing the remaining plan.", detail: "Some calibrations were cancelled or redesigned to conserve propellant. Meanwhile, scientists refined the impact target using lunar observations and terrain models. The experiment could still go ahead, but the team had to spend its remaining resources carefully." },
      ], discovery: "A backup sensor needs compatible software, not just a place on a checklist. Noisy measurements can cause real hardware to consume precious resources.", question: "Can a controller waste fuel correcting motion that is only sensor noise?",
    },
    {
      id: "two-impacts-one-experiment", title: "Two impacts, one experiment", event: "Separating the Centaur and observing its impact", hardware: "Separation mechanism, braking thrusters, Centaur stage and payload cameras",
      source: S.mission.url, relatedSources: [S.registry, S.operations, S.overview].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Separation", value: "9 October 2009 / 01:50 UT", note: "The shepherd then performed a braking maneuver to arrive later.", source: S.registry.url },
        { label: "Centaur impact", value: "9 October 2009 / approximately 11:31 UT", note: "Cabeus crater. The catalog gives 11:31:19.5 UT and an approximate speed of 2.5 km/s.", source: S.registry.url },
        { label: "Observation interval", value: "Approximately four minutes", note: "Time between impacts, not a claim of four minutes inside a uniform cloud.", source: S.mission.url },
      ],
      beats: [
        { line: "On October 9, I let my heavy partner travel ahead.", detail: "At 01:50 UT, the Centaur and shepherding spacecraft separated. A braking maneuver created time between our arrivals. My instruments could watch the first impact before my own mission ended." },
        { line: "The Centaur's motion supplied the punch for the experiment.", detail: "It struck Cabeus near 11:31 UT, at approximately two and a half kilometers per second. The deliberate impact excavated lunar material. We were using the energy of a moving rocket body to expose material from beneath the surface." },
        { line: "Different instruments watched different parts of what happened.", detail: "The payload's cameras, spectrometers and photometer observed the impact and its aftermath. Debris rising into sunlight could be studied for composition; thermal views offered information ordinary visible-light pictures could not." },
        { line: "The time between the impacts was my chance to send the evidence home.", detail: "I followed the Centaur and observed the plume while transmitting data to Earth. These were short, carefully planned observations. The later scientific results would come from analysing those records—not from the size of a televised splash." },
      ], discovery: "Timing is part of instrument design. Separating the impactor from the observer made a destructive event into a brief scientific experiment.", question: "Why did the spacecraft carrying the instruments need to arrive later?",
    },
    {
      id: "light-with-a-water-clue", title: "Light with a water clue", event: "Spectroscopic evidence and a local water estimate", hardware: "Near-infrared spectrometers, ultraviolet/visible spectrometer, cameras and LRO support",
      source: S.results.url, relatedSources: [S.overview, S.water, S.lamp].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Water estimate", value: "5.6 ± 2.9% by mass", note: "Reported for regolith at the LCROSS impact site in Cabeus. Not a whole-pole concentration, purity claim or guaranteed mining yield.", source: S.water.url },
        { label: "Results", value: "Preliminary announcement: November 2009 / further results: October 2010", note: "Impact observations preceded the analysis and announcements.", source: S.mission.url },
      ],
      beats: [
        { line: "A bright plume alone could not tell us what it contained.", detail: "My visible camera showed the debris cloud, but identifying water needed more than its appearance. Spectrometers examined light absorbed or emitted by materials, giving scientists clues about composition." },
        { line: "Different patterns in the light supported the same water story.", detail: "Near-infrared observations supported water ice and vapor. Ultraviolet observations of hydroxyl fragments added another line of evidence. Instruments on LRO also watched the event, helping scientists compare independent observations." },
        { line: "After analysis, scientists reported a number with an uncertainty.", detail: "The LCROSS result was an estimated 5.6 percent water by mass, with a reported uncertainty of 2.9 percentage points, for material at the studied impact site. That did not mean every shadowed crater had the same concentration or the whole crater was pure ice." },
        { line: "Water was important, but it was not the only new question.", detail: "Other volatile compounds and light metals were discussed in the results, with some identifications tentative. NASA described a patchy distribution and a chemically active environment. Evidence of a resource still leaves questions about where it is and how it could be used." },
      ], discovery: "A measurement includes its uncertainty and its sampling location. Multiple instruments help test an interpretation without turning one site into a claim about the whole Moon.", question: "Does finding water at one impact site tell us how much is in every crater?",
    },
    {
      id: "the-impact-that-kept-teaching", title: "The impact that kept teaching", event: "The shepherd's final impact, archived data and later crater research", hardware: "Data handling and downlink, LRO LAMP, Mini-RF radar and Danuri's ShadowCam",
      source: S.operations.url, relatedSources: [S.registry, S.lamp, S.laterCrater, S.shadowcam, S.water].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Shepherd impact", value: "9 October 2009 / approximately 11:35:36 UT", note: "NSSDCA timing. Exact twin-crater positions are not independently adopted from the draft.", source: S.registry.url },
        { label: "Later crater study", value: "2024 / roughly 22 m candidate Centaur crater", note: "Instrument-team abstract combines Mini-RF and ShadowCam. It does not certify two freshly identified impact craters.", source: S.laterCrater.url },
      ],
      beats: [
        { line: "My own impact ended the observing window.", detail: "Roughly four minutes after the Centaur, my shepherding spacecraft struck the Moon too. My instruments could no longer send observations, but the measurements already returned were preserved for analysis." },
        { line: "Sending the record home had required choices right to the end.", detail: "The downlink could carry only so much data. During the final approach, camera sampling rates were reduced because images were not compressing as efficiently as expected. The operations report does not claim every picture reached Earth." },
        { line: "Later observers asked what our impact had left behind.", detail: "In 2024, instrument-team research combined Mini-RF radar with ShadowCam images to identify a likely impact crater at the Centaur site. Radar supplies its own illumination; ShadowCam, on Danuri, uses very faint reflected light. Neither technique is a switch that makes all darkness disappear." },
        { line: "The used hardware was gone, but the questions had not run out.", detail: "The impact helped establish evidence for water in lunar polar material. Future explorers still need to learn its distribution, accessibility and extraction requirements. The records left on Earth—and the crater left on the Moon—are parts of the same continuing investigation." },
      ], discovery: "A mission can end while its evidence keeps supporting new research. Identifying a resource is different from demonstrating a safe, working way to extract it.", question: "What must we learn after discovering water before anyone can use it?",
    },
  ],
};
