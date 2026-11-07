import type { MachineBook } from "./types";
import { VIKING_SOURCES as S } from "../viking-sources";

export const VIKING_BOOK: MachineBook = {
  slug: "viking-1", name: "Viking 1", title: "A laboratory far from home.",
  introduction: "A safer landing site, a stuck scoop, and soil that surprised the scientists. Meet the stationary Mars explorer whose long mission taught us to ask better questions.",
  chapters: [
    {
      id: "a-careful-arrival", title: "A careful arrival", event: "Protecting the experiment before touching Mars", hardware: "Bioshield, heat-tested instruments, heat shield, parachute and three terminal engines",
      source: S.registry.url, relatedSources: [S.launchHistory, S.landingHistory, S.design].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Launch", value: "20 August 1975 / 21:22 UT", note: "Titan IIIE-Centaur from Cape Canaveral Launch Complex 41.", source: S.mission.url },
        { label: "Touchdown", value: "20 July 1976 / 11:53:06 UT", note: "Western Chryse Planitia; approximately 22.27° N, 312.05° E, planetocentric. Not the draft's unverified four-decimal artifact coordinates.", source: S.registry.url },
        { label: "Terminal engines", value: "Three engines / 18 nozzles each", note: "Designed to disperse exhaust and minimize disturbance of the soil.", source: S.registry.url },
      ],
      beats: [
        { line: "Before I could look for life, my team had to protect the question.", detail: "I am Viking 1, a lander built to study Mars from one place. Before launch, my lander assembly was enclosed in a bioshield and heat-treated to reduce the risk of carrying Earth microbes. Discovering our own hitchhikers would not answer a question about Mars." },
        { line: "A birthday landing had to wait for safer ground.", detail: "After entering Mars orbit in June 1976, my orbiter photographed the planned landing region. It looked rougher than expected. The team postponed the July 4 landing and searched for a safer site. A celebration was less important than a working explorer." },
        { line: "Even my landing engines were designed with the soil in mind.", detail: "A heat shield, a parachute and then three terminal engines slowed my descent. Each engine used eighteen small nozzles to spread its exhaust, and the fuel was purified to reduce contamination. Engineers wanted to disturb the material I would later examine as little as possible." },
        { line: "My feet reached Mars. My first picture began its trip to Earth.", detail: "I touched Chryse Planitia on July 20, 1976, the seventh anniversary of Apollo 11's Moon landing. NSSDCA records first-image transmission beginning twenty-five seconds after touchdown. Viking became the first truly successful Mars surface mission; Mars 3 had made an earlier landing but lost contact almost immediately." },
      ], discovery: "A good experiment begins before the measurement. Clean hardware, a safer site and less-disturbing engines helped protect the science question.", question: "Why might carrying Earth microbes make a Mars life experiment misleading?",
    },
    {
      id: "a-picture-and-a-stuck-pin", title: "A picture and a stuck pin", event: "Seeing the landing site and repairing a sampler from Earth", hardware: "Two facsimile cameras, calibration targets, seismometer and surface sampler",
      source: S.discoveries.url, relatedSources: [S.registry, S.firstPhoto, S.colorPhoto, S.mission].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "First surface photograph", value: "PIA00381 / 20 July 1976", note: "Camera 2; the NASA caption identifies part of footpad 2 at the right.", source: S.firstPhoto.url },
        { label: "Sampler recovery", value: "Stuck locking pin / about five days", note: "NSSDCA summary. Exact pin number, bracket temperature and midday maneuver from the draft are not asserted.", source: S.registry.url },
        { label: "First soil sampling", value: "28 July 1976", note: "Samples delivered to the instruments after the sampler was recovered.", source: S.mission.url },
      ],
      beats: [
        { line: "My first view was built one strip at a time.", detail: "My facsimile camera scanned the scene rather than snapping it all at once. The first photograph shows rocks, fine material and part of footpad two. Later color images added another view. Scientists used calibration targets to interpret images, not just to make Mars look familiar." },
        { line: "Two instruments needed help. One would never get it.", detail: "My seismometer failed to unlock from its travel restraint, so it could not carry out its intended measurements. My sampler had a different problem: a locking pin was stuck. Without a working scoop, the soil experiments could not receive their samples." },
        { line: "My team tried the repair on Earth before asking me to try it on Mars.", detail: "Engineers tested carefully planned commands on a duplicate lander. My cameras helped them check progress remotely. The sampler was freed, and images showed the troublesome pin on the ground. A repair across space needed evidence and testing, not a bigger shove." },
        { line: "At last, my scoop could bring the soil inside.", detail: "On July 28, my robot arm collected the first soil samples for the instruments. The recovered sampler turned distant photographs into hands-on chemistry. The locked seismometer was still a limitation: a silent instrument did not mean a quake-free planet." },
      ], discovery: "Cameras can be engineering tools as well as science tools. Testing a command on a duplicate helps reduce risk when the real machine is far away.", question: "What should engineers check before moving a jammed mechanism again?",
    },
    {
      id: "soil-with-a-surprise", title: "Soil with a surprise", event: "Comparing biology experiments without jumping to a life verdict", hardware: "Gas Exchange, Labeled Release, Pyrolytic Release and a separate GCMS",
      source: S.launchHistory.url, relatedSources: [S.science, S.mission, S.biologyReview].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Biology experiments", value: "Three complementary tests", note: "GEx, LR and PR; GCMS separately investigated organic compounds.", source: S.science.url },
        { label: "Later chemical clue", value: "Phoenix: 2008 / laboratory reanalysis: 2010", note: "Perchlorate can alter organics when heated. This did not establish life or definitively solve every Viking biology result.", source: S.biologyReview.url },
      ],
      beats: [
        { line: "One scoop of soil met more than one kind of question.", detail: "Gas Exchange looked for changes in gases around a treated sample. Labeled Release added carbon-tagged nutrients and watched for tagged gas. Pyrolytic Release investigated whether carbon from tagged gases became incorporated into the soil. My GCMS separately looked for organic compounds." },
        { line: "The soil reacted. That was exciting—but it was not a verdict.", detail: "The biology tests found surprising chemical activity. A gas signal can be consistent with a biological process, but chemistry without organisms can also produce a reaction. Scientists had to compare tests and controls rather than label every response a discovery of life." },
        { line: "A test that did not detect something could not prove it was absent everywhere.", detail: "Viking's organic analysis did not establish the expected Martian organic compounds at its detection limits. Chlorinated compounds were initially interpreted as contaminants. That result complicated the biology interpretation; it was not a measurement of zero carbon in all Martian soil." },
        { line: "Later missions gave scientists a new way to question my old result.", detail: "Phoenix found perchlorate in 2008. Laboratory work showed that heating perchlorate-bearing soil could destroy organics and form compounds like those Viking had detected. This suggested a new interpretation, not a complete solution to every life test. Organic molecules themselves can come from non-living sources." },
      ], discovery: "Observation, interpretation and proof are different. Multiple tests and new knowledge help revisit an old result without turning uncertainty into a claim of life.", question: "If a soil sample releases gas, what else must we test before calling it alive?",
    },
    {
      id: "a-patient-weather-watcher", title: "A patient weather watcher", event: "Long-lived power made repeated measurements possible", hardware: "Two plutonium-238 RTGs, rechargeable batteries, weather sensors and radio links",
      source: S.project.url, relatedSources: [S.registry, S.science, S.launchHistory, S.discoveries, S.monitor].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Surface endurance", value: "2,245 Martian sols", note: "NASA History's reported duration. More than six Earth years; no exact Earth-day conversion or four-Martian-year claim is added.", source: S.launchHistory.url },
        { label: "Power", value: "Two RTGs plus rechargeable batteries", note: "Heat from natural plutonium-238 decay supplies electricity. The catalog's nominal 70 W total and 30 W-per-unit prose are retained as differing descriptions, not a constant-output guarantee.", source: S.registry.url },
        { label: "Radio experiment", value: "November 1976 / solar conjunction", note: "Viking radio links tested the predicted additional travel time near the Sun. Not a proof of every aspect of relativity.", source: S.discoveries.url },
      ],
      beats: [
        { line: "I could keep working without waiting for sunlight on a solar panel.", detail: "Two radioisotope thermoelectric generators supplied electricity from heat released by plutonium's natural decay. Rechargeable batteries helped with higher power demands. My energy budget still mattered: useful power did not mean every instrument could run at once forever." },
        { line: "Staying in one place let me notice Mars changing around me.", detail: "My weather instruments measured temperature, wind and pressure. Repeating observations through changing seasons and dust storms helped scientists study an atmosphere in motion. A single exciting landing-day picture could not provide that long record." },
        { line: "Even a radio message could become a science instrument.", detail: "During the November 1976 solar conjunction, Viking radio links helped test a prediction of general relativity: a signal passing near the Sun has extra travel time. Carefully timed communications could investigate physics as well as carry photographs home." },
        { line: "My short planned visit became a long watch.", detail: "NASA History reports 2,245 Martian sols of Viking 1 surface operations—more than six Earth years. I outlasted the other Viking spacecraft and continued returning weather and imaging data in the monitor mission. I also became known as the Thomas Mutch Memorial Station, honoring the imaging team's leader." },
      ], discovery: "Reliable power and repeated observations turn a snapshot into a record. Communications hardware can also make precise scientific measurements.", question: "What can a year of weather measurements tell us that one photograph cannot?",
    },
    {
      id: "a-silent-link-a-lasting-record", title: "A silent link, a lasting record", event: "A memory error, unsuccessful recovery and later orbital identification", hardware: "Aging batteries, computer memory, high-gain antenna, Deep Space Network and HiRISE",
      source: S.monitor.url, relatedSources: [S.mission, S.registry, S.hirise, S.stereo, S.landingHistory].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Communication loss", value: "November 1982 / sources differ on exact dates", note: "NASA Science: November 11 final transmission/operations. NSSDCA: November 13 contact loss. JPL's recovery account dates a battery-change command November 19 and emergency November 20.", source: S.monitor.url },
        { label: "Orbital observation", value: "PSP_001521_2025 / 22 November 2006", note: "Lander identification confirmed; entry-hardware locations described as candidates. Stereo partner acquired December 8.", source: S.hirise.url },
        { label: "Endurance milestone", value: "Opportunity passed Viking on 19 May 2010", note: "NASA History attribution; not an unqualified 34-year interval after Viking's mission ended.", source: S.landingHistory.url },
      ],
      beats: [
        { line: "My batteries were aging, and the team tried to help.", detail: "The monitor mission needed careful battery management. JPL's operations report describes a command sequence meant to change battery charging in November 1982. The expected radio downlink did not appear. Simplified NASA mission summaries and the detailed report differ on the exact dates." },
        { line: "Instructions meant for one job had overwritten information for another.", detail: "The JPL report says the battery sequence was written into memory occupied by antenna-pointing parameters. Engineers used a simulation to infer where the dish might be pointing. They could not watch the antenna move or directly inspect the computer from Earth." },
        { line: "The team kept investigating, but the link did not return.", detail: "Recovery attempts tried new pointing commands, battery procedures and other possibilities. An antenna error was not the only failure mode considered. The efforts were unsuccessful. Silence could not tell us exactly which parts remained working, and it did not leave a recorded goodbye." },
        { line: "Years later, another camera helped find the hardware I left behind.", detail: "HiRISE photographed my site in 2006 and confirmed my location by comparing orbital images with surface topography. Entry hardware nearby had candidate identifications. Opportunity later surpassed my endurance record in 2010. My mission ended, but the pictures, measurements and questions stayed with the explorers who followed." },
      ], discovery: "A command needs testing for unintended effects. Archived observations can keep teaching after a link is lost, but an orbital photograph cannot diagnose a silent computer.", question: "Why is identifying a lander in an orbital image different from proving it still works?",
    },
  ],
};
