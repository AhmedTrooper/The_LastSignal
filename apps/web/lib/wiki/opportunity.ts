import type { WikiEntry } from "./types";
import { OPPORTUNITY_BOOK, OPPORTUNITY_SOURCES as S } from "../machine-books/opportunity";
import { OPPORTUNITY_ARTIFACTS, OPPORTUNITY_ARCHIVE_LINKS, OPPORTUNITY_HARDWARE } from "../opportunity-resources";

export const OPPORTUNITY: WikiEntry = {
  lead: "Opportunity was NASA’s MER-B Mars rover. Its short primary mission became a long geological investigation: cameras, instruments and wheels gathered evidence of ancient water across Meridiani Planum and Endeavour Crater. The rover’s final communication was received on 10 June 2018; mission completion was announced on 13 February 2019. The 2026 distance record handoff is a later event, not a signal from the retired rover.",
  sections: [
    { id: "instruments", title: "A travelling geology laboratory", paras: OPPORTUNITY_HARDWARE.map(part => `${part.name}: ${part.job} ${part.learned}`) },
    { id: "arrival", title: "Landing equipment and the machine that drove away", paras: ["Four interconnected Vectran airbags had six lobes each: 24 lobes, not 24 separate bags. The landing equipment helped deliver a rover that could move away from its platform.", ...OPPORTUNITY_ARTIFACTS.map(item => `${item.name}: ${item.note}`)] },
    { id: "evidence", title: "Evidence with its context intact", paras: ["Hematite was identified as the major iron-bearing mineral in the Berry Bowl spherules. Their arrangement and rock setting supported a water-formed concretion interpretation; the mineral name alone does not prove how any rock formed.", "Solar-array output and battery charge are different quantities. Optical depth is not a direct percentage of all sunlight on a panel. After contact ceased, possible internal faults were engineering inferences, not continuing telemetry.", "PIA22521 is a simulated darkness graphic. The final faint-Sun thumbnails are PIA22930; the last incomplete image transmitted is PIA22929. An image taken last is not necessarily the image received last."] },
    { id: "legacy", title: "The trail outlasted the transmission", paras: ["Opportunity accumulated 45.16 kilometres of driving. On 11 October 2026, Perseverance’s odometer reached 45.22 kilometres and passed that off-world record.", "The rover’s observations continue to support research. The machine left behind, the returned data and a later rover’s record are different parts of the legacy."] },
  ],
  timeline: [
    { date: "January 2004", text: "Airbag-cushioned landing inside Eagle Crater." },
    { date: "March 2004", text: "Berry Bowl mineral comparison strengthens the evidence for past water." },
    { date: "April–June 2005", text: "Earth tests and carefully monitored driving free Opportunity from Purgatory Dune." },
    { date: "24 March 2015", text: "Cumulative driving exceeds the 42.195 km marathon distance." },
    { date: "10 June 2018", text: "Final received communication during the dust storm." },
    { date: "13 February 2019", text: "NASA announces mission completion after recovery efforts brought no reply." },
    { date: "11 October 2026", text: "Perseverance passes Opportunity’s 45.16 km distance record." },
  ],
  facts: [{ label: "Rover", value: "Opportunity / MER-B" }, { label: "Surface rover mass", value: "185 kg" }, { label: "Primary mission design", value: "90 Martian days / 1,000 metres" }, { label: "Final working location", value: "Perseverance Valley" }, { label: "Last contact", value: "10 June 2018" }, { label: "Odometer", value: "45.16 km" }, { label: "Reading room", value: `${OPPORTUNITY_BOOK.chapters.length} standalone event chapters` }],
  sources: [...OPPORTUNITY_ARCHIVE_LINKS, { label: "JPL · Airbag architecture", url: S.airbags }, { label: "JPL · Berry Bowl mineral comparison", url: S.berries }, { label: "JPL · Purgatory Dune", url: S.purgatory }, { label: "JPL · Marathon milestone", url: S.marathon }, { label: "JPL · Recovery and inferred faults", url: S.recovery }, { label: "NASA · Last images", url: S.lastImages }, { label: "JPL · Mission completion", url: S.end }],
};
