import type { MachineBook } from "./types";

export const OPPORTUNITY_SOURCES = {
  mission: "https://science.nasa.gov/mission/mer-opportunity/",
  airbags: "https://www.jpl.nasa.gov/news/how-to-land-softly-on-a-hard-planet/",
  berries: "https://www.jpl.nasa.gov/news/mineral-in-mars-berries-adds-to-water-story/",
  purgatory: "https://www.jpl.nasa.gov/images/pia07999-looking-back-at-purgatory-dune/",
  engineering: "https://www.jpl.nasa.gov/edu/resources/teachable-moment/mars-rover-mission-comes-to-an-end-but-science-legacy-live-on/",
  marathon: "https://www.jpl.nasa.gov/news/nasas-opportunity-mars-rover-passes-marathon-distance/",
  storm: "https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/",
  recovery: "https://www.jpl.nasa.gov/news/six-things-about-opportunitys-recovery-efforts/",
  lastImages: "https://science.nasa.gov/photojournal/last-images-opportunity-took/",
  end: "https://www.jpl.nasa.gov/news/nasas-opportunity-rover-mission-on-mars-comes-to-end/",
  handoff: "https://www.jpl.nasa.gov/news/nasas-perseverance-sets-off-world-record-for-total-distance-driven/",
} as const;

const S = OPPORTUNITY_SOURCES;
/** Imagined first-person retellings. Event numbers and findings retain their source context. */
export const OPPORTUNITY_BOOK: MachineBook = {
  slug: "opportunity", name: "Opportunity", title: "Five stories from the red dust",
  introduction: "My first stop was a crater. My next stop was supposed to be nearby. Come along: the little rover built for a short visit had a much longer journey ahead.",
  chapters: [
    {
      id: "airbag-landing", title: "The landing that bounced", event: "Opportunity’s airbag-cushioned arrival inside Eagle Crater", hardware: "Heat shield, parachute, retrorockets, interconnected airbags and lander petals", source: S.mission,
      relatedSources: [{ label: "JPL · Four airbags, six lobes each", url: S.airbags }, { label: "JPL · The original mission plan", url: S.end }],
      telemetry: [
        { label: "Landing date", value: "25 January 2004 · UTC date", note: "The mission page also lists 24 January in Pacific time. A calendar date is not a continuous landing-time measurement.", source: S.mission },
        { label: "Cushioning system", value: "4 airbags / 24 lobes", note: "Four interconnected airbags, each with six lobes. Not 24 separate airbags.", source: S.airbags },
        { label: "Primary mission plan", value: "90 Martian days / 1,000 metres", note: "A design goal described in the mission-end release, not a warranty or a predicted date of failure.", source: S.end },
      ],
      beats: [
        { line: "I didn’t arrive on Mars with my wheels neatly touching the ground. I arrived wrapped in airbags.", detail: "A heat shield, parachute and retrorockets helped slow the spacecraft carrying me. Then the airbag system took the landing loads. Its four connected bags had six rounded lobes each, made from tough Vectran fabric.", roverArt: "airbags", sfx: "BOING!" },
        { line: "Bounce. Another bounce. And then a crater caught us.", detail: "The mission record describes at least 26 bounces before the lander came to rest in Meridiani Planum. My landing place was inside Eagle Crater. Instead of a distant rock hunt, there was exposed outcrop close by.", roverArt: "airbags", sfx: "BOING… SETTLE." },
        { line: "The bags deflated. The lander opened. Now there was room for a rover.", detail: "The protective landing equipment had done its job. My solar panels, camera mast and wheels could be prepared for surface operations. Cameras would show my team the ground before they chose where to drive.", roverArt: "rollout", sfx: "WHIRR—CLICK" },
        { line: "The plan was a short visit. The rocks had other plans for us.", detail: "My primary mission was designed for 90 Martian days and 1,000 metres of driving. That was a starting goal, not a countdown to certain failure. Getting the rover to the ground intact had put a travelling geology laboratory beside its first evidence.", roverArt: "rollout" },
      ], discovery: "Different landing systems did different jobs. Surviving the final bounces let cameras, wheels and instruments begin the science.", question: "Why did a rover need landing equipment that would never drive with it?",
    },
    {
      id: "blueberries", title: "The mystery in the Berry Bowl", event: "Comparing a cluster of Martian spherules with nearby rock in March 2004", hardware: "Microscopic Imager, robotic arm and Mössbauer spectrometer", source: S.berries,
      telemetry: [
        { label: "Published finding", value: "18 March 2004", note: "Date of JPL’s report on the Berry Bowl comparison, not an invented timestamp for one instrument reading.", source: S.berries },
        { label: "Major iron-bearing mineral", value: "Hematite", note: "The instrument result and the spheres’ geological context supported the interpretation of water-formed concretions. Hematite alone is not a universal proof of water.", source: S.berries },
      ],
      beats: [
        { line: "There were little grey spheres in the rocks. And little grey spheres on the ground. What were they?", detail: "My team nicknamed them blueberries. They were mineral spherules, not fruit, embedded in outcrop and scattered across soil inside Eagle Crater. Their shapes were interesting; their history was still a question.", roverArt: "berries" },
        { line: "One berry was too small for a good comparison. A bowlful gave us a better chance.", detail: "Individual spheres were too small for my composition-reading tools to analyse on their own. A shallow depression in a rock called Berry Bowl held a group close together. The team compared that cluster with a berry-free patch of the underlying rock.", roverArt: "minerals", sfx: "SCAN… COMPARE." },
        { line: "My spectrometer found a difference the camera couldn’t see.", detail: "The Mössbauer instrument identified iron-bearing minerals. Its comparison showed that hematite was the major iron-bearing mineral in the spheres. The arrangement of the spheres within the rocks had already pointed toward concretions growing in water-soaked deposits.", roverArt: "minerals" },
        { line: "The little spheres had kept clues from a much wetter Mars.", detail: "Hematite strengthened that interpretation when considered alongside the other evidence. Interlocking spheres and their distribution helped test alternatives such as volcanic droplets. The answer came from looking, comparing and measuring together—not from one photograph.", roverArt: "berries" },
      ], discovery: "A mineral measurement becomes more useful when scientists also know where the material sits and how it is arranged.", question: "Why did the team compare berries with a berry-free patch instead of measuring only the berries?",
    },
    {
      id: "purgatory", title: "The dune that wouldn’t let go", event: "Getting Opportunity out of Purgatory Dune in 2005", hardware: "Cleated wheels, cameras, rover-driving commands and an Earth test rover", source: S.purgatory,
      relatedSources: [{ label: "JPL Education · Testing a way out on Earth", url: S.engineering }],
      telemetry: [
        { label: "Became stuck", value: "26 April 2005 / Sol 446", note: "JPL identifies this as the day the wheels dug into the ripple.", source: S.purgatory },
        { label: "Sand ripple", value: "About one-third metre tall", note: "The image caption gives an approximate height, not an exact shape reconstructed by this illustration.", source: S.purgatory },
        { label: "Recovery effort", value: "More than five weeks", note: "Planning, Earth testing and carefully monitored driving—not a claim of identical centimetres gained every day.", source: S.purgatory },
      ],
      beats: [
        { line: "From my camera, it looked like another ripple to cross. Under my wheels, it was a trap.", detail: "On Sol 446, my wheels dug into soft sandy material in Meridiani Planum. The wind-shaped ripple was only about one-third of a metre tall. The team named it Purgatory Dune. Small terrain could still bring a long journey to a stop.", roverArt: "sand", sfx: "SPIN… SINK." },
        { line: "My team didn’t simply tell me to spin harder.", detail: "They used my pictures and instrument observations to study the sand, then tested escape ideas with a duplicate rover on Earth. They needed to understand what wheel motion would do before asking the machine on Mars to try it.", roverArt: "testbed" },
        { line: "A little movement. Check the pictures. Try again.", detail: "The recovery took more than five weeks of planning, testing and carefully monitored driving. Short advances mattered. Turning wheels did not necessarily mean the rover was travelling the same distance; slipping wheels could keep digging instead.", roverArt: "escape", sfx: "GRIP… INCH…" },
        { line: "At last, firmer ground. I could leave a picture of the trap behind me.", detail: "After escaping, my navigation camera looked back at the ripple and the deep wheel tracks. JPL’s archived view was taken on Sol 491, a week after the rover reached firmer ground. Those tracks preserved what the wheels and sand had done to each other.", roverArt: "escape", sfx: "FREE." },
      ], discovery: "Ground testing and feedback from the real spacecraft helped engineers make careful decisions far from the rover.", question: "Why can a spinning wheel report a long drive while the rover has barely moved?",
    },
    {
      id: "marathon", title: "A marathon without a finish line", event: "Opportunity passes 42.195 kilometres of cumulative driving on 24 March 2015", hardware: "Wheels, solar power, onboard memory and navigation cameras", source: S.marathon,
      relatedSources: [{ label: "NASA Science · Cleaning events and memory workarounds", url: S.mission }],
      telemetry: [
        { label: "Milestone date", value: "24 March 2015", note: "The day the cumulative odometer exceeded marathon distance.", source: S.marathon },
        { label: "Marathon distance", value: "42.195 km", note: "Accumulated across many drives over roughly eleven years and two months. Not one uninterrupted race.", source: S.marathon },
        { label: "Milestone drive", value: "46.5 metres", note: "JPL reports this drive as the one that carried the rover beyond marathon distance.", source: S.marathon },
      ],
      beats: [
        { line: "There was no ribbon stretched across Mars. There was a number my team had been watching.", detail: "I was approaching Marathon Valley on Endeavour Crater’s rim. Over many separate drives, my odometer was nearing 42.195 kilometres—the length of an Olympic marathon. Reaching rocks for science had brought me much farther than the original mission plan.", roverArt: "marathon" },
        { line: "A long journey had needed more than sturdy wheels.", detail: "Winds sometimes cleaned dust from my solar panels, helping restore the power available for work. Engineers also dealt with memory problems. They reformatted flash memory and later used RAM-only operations, which required returning data before the rover powered down.", roverArt: "solar" },
        { line: "On 24 March 2015, another ordinary drive made an extraordinary total.", detail: "A 46.5-metre drive carried me past marathon distance. The total had taken roughly eleven years and two months to build. I was the first human enterprise to exceed that distance on the surface of another world.", roverArt: "marathon", sfx: "42.195 KM" },
        { line: "The best part wasn’t winning a race. It was having another place to explore.", detail: "The team celebrated on Earth, but distance was not the mission’s main purpose. Moving between sites let instruments examine different rocks and ancient environments. At Endeavour, the rover had found evidence of wet conditions less acidic than those studied earlier.", roverArt: "marathon" },
      ], discovery: "A rover’s long life matters because it lets scientists compare more places. Maintenance and new operating strategies can keep that investigation going.", question: "Why is a long rover route useful even when the goal is geology rather than a distance record?",
    },
    {
      id: "dust-storm", title: "When daylight disappeared", event: "Opportunity’s final contact during the June 2018 dust storm", hardware: "Solar arrays, Pancam, batteries and Earth–Mars communications", source: S.recovery,
      relatedSources: [{ label: "JPL · The storm as it unfolded", url: S.storm }, { label: "NASA · Last images taken versus last image transmitted", url: S.lastImages }, { label: "JPL · The mission’s end", url: S.end }, { label: "JPL · The verified October 2026 record handoff", url: S.handoff }],
      telemetry: [
        { label: "Final contact", value: "10 June 2018", note: "The last communication received from Opportunity. Later internal fault states were inferred by engineers, not directly observed in a continuing feed.", source: S.end },
        { label: "Last measured optical depth", value: "Tau ≈10.8", note: "JPL compares this with a typical local value near 0.5. Optical depth is not a percentage of all sunlight reaching the solar panels.", source: S.recovery },
        { label: "Recovery attempts", value: "More than 1,000 commands", note: "The final attempt was on 12 February; mission completion was announced on 13 February 2019.", source: S.end },
      ],
      beats: [
        { line: "My solar panels needed the Sun. In June 2018, dust filled the space between us.", detail: "A growing storm darkened the sky above Perseverance Valley. Pancam observations helped scientists estimate atmospheric optical depth, called tau. My last measured tau was about 10.8; a typical value for this location was around 0.5.", roverArt: "dust" },
        { line: "Earth heard from me on 10 June. Then the calls met silence.", detail: "That was my final communication. Engineers expected a low-power fault as sunlight became scarce, but they could not directly read what happened inside the silent rover. The last images taken and the last incomplete image transmitted are different archive records.", roverArt: "signal" },
        { line: "My team kept listening long after the first unanswered call.", detail: "They sent more than a thousand recovery commands. The final attempt, on 12 February 2019, brought no reply. NASA announced the end of the mission the next day. The wheels stopped, but the photographs and measurements were already part of science on Earth.", roverArt: "quiet" },
        { line: "Another rover would roll farther. It couldn’t erase the trail we had made.", detail: "My final total was 45.16 kilometres. On 11 October 2026, Perseverance reached 45.22 kilometres and passed that off-world distance record. This later milestone belongs to the record on Earth—not a new signal or a witnessed salute from Opportunity.", roverArt: "handoff" },
      ], discovery: "Power, weather and communication determine what a rover can do. Its scientific record can continue helping explorers after contact ends.", question: "What can scientists know from the last received data, and what must remain uncertain after a spacecraft goes silent?",
      // The last beat is a dated legacy outcome of this event, not live rover telemetry.
    },
  ],
};

export const OPPORTUNITY_HANDOFF = { date: "11 October 2026", previousKm: 45.16, newKm: 45.22, source: S.handoff };
