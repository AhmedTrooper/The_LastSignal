import type { WikiEntry } from "./types";
import { EAGLE_COMPONENTS } from "../eagle-components";
import { EAGLE_STORY_SOURCES } from "../eagle-story";

const component = EAGLE_COMPONENTS;

/** The readable record uses the same component explanations as the interactive pages. */
export const APOLLO_11_LANDER: WikiEntry = {
  lead: "Eagle was the Apollo 11 lunar module. It carried Neil Armstrong and Buzz Aldrin to the Moon on 20 July 1969. Its upper stage took them back to lunar orbit, while its landing stage served as the launch platform and stayed at Tranquility Base.",
  sections: [
    { id: "why", title: "Why Eagle was built", paras: ["Apollo 11's goal was to land people on the Moon and return them safely to Earth. Eagle handled the landing and return to lunar orbit. Michael Collins remained aboard Columbia, the command module.", "A mission is not just its landing date. The crew needed hardware that would help them reach the surface, work there, and leave again."] },
    { id: "spacecraft", title: "Two stages, with different jobs", paras: [component.descent.job, component.ascent.job, component.insulation.job, component.honeycomb.job] },
    { id: "landing", title: "How the landing worked", paras: [component.engine.job, component.guidance.job, "Mission Control assessed the computer's recovery and passed a GO decision to the crew. Armstrong used partial manual control to steer beyond rough ground.", "The corrected journal records the contact-light call at 102:45:40 GET. The engine-shutdown calls follow it. Post-flight fuel estimates are not instantaneous cockpit percentages."] },
    { id: "surface", title: "A ladder, a camera, and a science outpost", paras: [component.ladder.job, component.mesa.job, component.mesa.why, "The crew deployed different experiments from the equipment they carried. Each instrument answered a different kind of question."] },
    { id: "computer-and-breaker", title: "A small control that mattered", paras: [component.breaker.job, component.breaker.why, "The journal identifies the engine-arm breaker on Panel 16. Houston's circuitry-looks-fine call is a confirmation, not an asserted timestamp for inserting the pen."] },
    { id: "scientific-legacy", title: "What the equipment made possible", paras: [component.seismometer.job, component.seismometer.why, component.reflector.job, component.reflector.why, component.solarWind.job, component.solarWind.why, component.dust.job] },
    { id: "left-behind", title: "What stayed, and what went home", paras: [component.descent.why, component.plaque.job, "The solar-wind foil returned for analysis, while its supporting staff stayed. The seismic package, reflector, television camera, and other equipment were left on the surface.", "Later orbital photographs show the landing site. They are archived observations, not a live camera. The eventual fate of the jettisoned ascent stage is not directly observed by this exhibit."] },
  ],
  timeline: [
    { date: "16 July 1969", text: "Apollo 11 launches from Earth." },
    { date: "19 July 1969", text: "The mission enters lunar orbit." },
    { date: "20 July 1969", text: "Eagle separates from Columbia and lands in the Sea of Tranquility." },
    { date: "21 July 1969 · UTC", text: "The crew explores, deploys experiments, and returns to orbit in the ascent stage." },
    { date: "24 July 1969", text: "The crew returns to Earth." },
    { date: "2009", text: "LROC publishes an archived second look at the landing site." },
  ],
  facts: [
    { label: "Vehicle", value: "Apollo Lunar Module LM-5 / Eagle" },
    { label: "Catalogue identifier", value: "1969-059C" },
    { label: "Crew aboard Eagle", value: "Neil Armstrong and Buzz Aldrin" },
    { label: "Crew aboard Columbia", value: "Michael Collins" },
    { label: "Landing site", value: "Tranquility Base / Mare Tranquillitatis" },
    { label: "Contact-call reference", value: "102:45:40 GET · corrected ALSJ transcript" },
    { label: "First-step reference", value: "109:24:15 GET · ALSJ event reference" },
    { label: "Engine-arm breaker", value: "Panel 16 · felt-tip pen used to push the damaged control in" },
    { label: "Passive reflector", value: "100 corner cubes · no electrical power needed" },
    { label: "What the web illustrations show", value: "Hardware concepts and story scenes, not live measurements" },
  ],
  sources: [...EAGLE_STORY_SOURCES, { label: "Apollo 11 Mission Report", url: "https://www.nasa.gov/wp-content/uploads/static/apollo50th/pdf/A11_MissionReport.pdf" }],
};
