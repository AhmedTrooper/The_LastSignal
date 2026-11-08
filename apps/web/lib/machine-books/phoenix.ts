import type { MachineBook } from "./types";
import { PHOENIX_SOURCES as S } from "../phoenix-sources";

export const PHOENIX_BOOK: MachineBook = {
  slug: "phoenix", name: "Phoenix", title: "The Arctic ice-hunter that rose again.",
  introduction: "Built from spare parts of earlier Mars missions, Phoenix landed in the northern plains to dig for water ice, taste it in tiny ovens, and watch snow fall from clouds.",
  chapters: [
    {
      id: "risen-from-the-ashes", title: "Risen from the ashes", event: "Resurrected hardware, HiRISE descent photograph and Arctic touchdown", hardware: "Mars Surveyor 2001-derived lander, Delta II, parachute, heat shield and pulsed descent thrusters",
      source: S.mission.url, relatedSources: [S.registry, S.descent].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Launch", value: "4 August 2007 / 09:26:34 UT", note: "Delta II from Cape Canaveral; cruise about 681 million km over roughly 10 months (NSSDCA).", source: S.registry.url },
        { label: "Touchdown", value: "25 May 2008 / 23:38:38 UT spacecraft time", note: "NSSDCA lists 23:53:44 UT Earth-received time after about 15 minutes of light travel.", source: S.registry.url },
        { label: "Descent photograph", value: "PSP_008579_9020 / PIA10705", note: "MRO at 310 km altitude and about 760 km away; Phoenix about 13 km up just after parachute opening.", source: S.descent.url },
      ],
      beats: [
        { line: "I was built from missions that did not finish.", detail: "I am Phoenix, a Mars lander assembled from spare hardware shaped by the canceled Mars Polar Lander and Mars Surveyor 2001 work. I launched on August 4, 2007, on a Delta II from Cape Canaveral. After a cruise of about 681 million kilometres, I arrived at Mars in May 2008." },
        { line: "Another spacecraft caught my descent.", detail: "As I fell through the thin Martian air beneath my parachute, NASA’s Mars Reconnaissance Orbiter photographed me with HiRISE from about 760 km away. The perspective places a large crater behind me, but I was actually about 20 kilometres in front of that crater, above a flatter plain." },
        { line: "The parachute did the first braking.", detail: "The heat shield slowed me first, then the parachute opened, the heat shield was dropped, the legs deployed, and radar joined the descent. Only near the ground did the pulsing thrusters take over for the final soft landing." },
        { line: "I touched down in Green Valley.", detail: "On May 25, 2008, I landed at about 68.22 degrees north latitude and 234.25 degrees east longitude in Vastitas Borealis. NASA Science gives 23:38:38 UT spacecraft time; the signal reached Earth about 15 minutes later. It was the first successful stationary soft landing on Mars since Viking 2, about 32 years earlier." },
      ], discovery: "Spare hardware and a careful descent sequence can turn an old design into a new Arctic science mission.", question: "Why photograph a descending lander from another orbiter instead of relying only on its own cameras?",
    },
    {
      id: "holy-cow-and-vanishing-ice", title: "Holy Cow and vanishing ice", event: "Seeing ice beneath the lander and watching trench material disappear", hardware: "Robotic Arm, Robotic Arm Camera, Surface Stereo Imager and trenching scoop",
      source: S.mission.url, relatedSources: [S.sublimation, S.panorama].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Ice layers expected", value: "About 2 to 5 cm deep", note: "NSSDCA mission description; the exact trench depth varied by digging location.", source: S.registry.url },
        { label: "Bright trench material", value: "Vaporized within four days", note: "NASA Science’s wording for the Dodo Goldilocks conclusion; see the evidence JSON for the qualified reading.", source: S.mission.url },
      ],
      beats: [
        { line: "The ground looked like cracked pavement.", detail: "From my deck, the Arctic soil formed flat polygons cut by shallow troughs. There were no huge boulders for the first panorama to worry about, and the stereo camera could map where my arm could dig safely." },
        { line: "I looked underneath myself.", detail: "The robotic arm camera examined the ground beneath the lander. In the shadowed area near a footpad, the team saw exposed icy material that became known as Holy Cow, with a nearby area called Snow Queen. The picture was evidence, but not by itself a chemical proof." },
        { line: "I dug the Dodo Goldilocks trench.", detail: "My arm scooped into the polygon soil and exposed bright clumps in the Dodo Goldilocks trench. Scientists had to ask whether the white material was water ice, salt, or another bright mineral." },
        { line: "Four days later, the bright clumps were gone.", detail: "When the trench was photographed again, the bright clumps had vaporized. NASA’s summary concludes they were probably water ice. That disappearing act was a strong clue, but the team still wanted an oven test before declaring the water tasted." },
      ], discovery: "A surface change over time can identify a volatile that a single photograph cannot.", question: "What else could make bright chunks disappear in four days besides water ice?",
    },
    {
      id: "tasting-the-water", title: "Tasting the water", event: "Soil delivery problems and the TEGA water identification", hardware: "TEGA single-use ovens, mass spectrometer, vibrating screen and robotic arm scoop",
      source: S.water.url, relatedSources: [S.registry, S.mission].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Water confirmation", value: "31 July 2008", note: "NASA press release reports laboratory identification of water in a TEGA soil sample.", source: S.water.url },
        { label: "Sample depth", value: "About 2 inches (5 cm)", note: "The July release describes the trench sample as approximately 2 inches deep.", source: S.water.url },
      ],
      beats: [
        { line: "My ovens were tiny and single-use.", detail: "TEGA had small ovens that could heat a soil sample once and measure the gases released. A failed delivery was not just disappointing — it used up a precious chance to learn what was in the soil." },
        { line: "Some soil did not want to fall in.", detail: "Clumpy soil could sit on the oven screen instead of dropping through. NASA’s July release also describes icy samples sticking in the scoop when the arm moved into sunlight. The team adjusted its handling instead of forcing every delivery the same way." },
        { line: "A trench sample finally got into an oven.", detail: "A sample from a trench about two inches deep reached TEGA, and heating released water vapor that the instrument identified. The result matched earlier orbital and trench clues, but now it came from a laboratory measurement on the surface." },
        { line: "The mission earned more time.", detail: "NASA called the water result a confirmation and extended operations through September 30. The original three-month mission had already done what it was built to do: find and identify water ice near the northern surface." },
      ], discovery: "Delivery technique matters: even a perfect instrument needs a sample that actually reaches it.", question: "Why is getting soil into an oven sometimes harder than heating it?",
    },
    {
      id: "friendly-soil-and-laser-snow", title: "Friendly soil and laser snow", event: "Wet chemistry, perchlorate, carbonate evidence and falling snow", hardware: "MECA wet-chemistry lab, TEGA, Canadian meteorological station and lidar",
      source: S.snowSoil.url, relatedSources: [S.mission, S.snowGraphic].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Soil chemistry", value: "Alkaline soil; carbonate evidence", note: "NASA reports calcium carbonate evidence from both TEGA and MECA; no single pH value is asserted in the children’s prose.", source: S.snowSoil.url },
        { label: "Laser snow height", value: "About 2.5 miles (4 km)", note: "NASA’s September release says snow vaporized before reaching the ground.", source: S.snowSoil.url },
      ],
      beats: [
        { line: "My wet lab mixed dirt with Earth water.", detail: "MECA’s wet-chemistry experiment added liquid water to Martian soil and measured the dissolved chemicals. The soil was mildly alkaline rather than strongly acidic, and it contained salts such as perchlorate, sodium, magnesium, chloride and potassium." },
        { line: "Carbonate pointed to liquid water in the past.", detail: "TEGA saw carbon dioxide released at a temperature consistent with calcium carbonate breaking down, while MECA saw the buffering behavior expected from a carbonate solution. On Earth, most carbonates and clays form only where liquid water has acted." },
        { line: "Perchlorate changed old Viking questions.", detail: "Phoenix found perchlorate salts on the surface. Those salts do not by themselves prove life, but they can affect chemistry, freeze water into salty brines, and help scientists re-examine why Viking’s heated soil tests behaved as they did." },
        { line: "Then my laser found snow.", detail: "The Canadian meteorological station’s laser detected snow falling from clouds about 2.5 miles above the landing site. The snow vaporized before reaching the ground, but it proved that water-ice particles were falling through the northern sky." },
      ], discovery: "Soil chemistry and laser sky measurements answer different questions: one reads the ground’s history, the other watches today’s weather.", question: "Why can a soil test and a laser both study water in very different ways?",
    },
    {
      id: "a-winter-farewell", title: "A winter farewell", event: "Last signal, winter frost and the Visions of Mars artifact", hardware: "Solar wings, batteries, UHF relay and HiRISE orbital imaging",
      source: S.registry.url, relatedSources: [S.afterWinter, S.visions].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Last signal", value: "2 November 2008", note: "NSSDCA records the last signal on this date; mission energy declined through the northern autumn.", source: S.registry.url },
        { label: "After-winter image", value: "ESP_017716_2485 / 7 May 2010", note: "HiRISE interprets the missing west-panel shadow as likely collapse under winter CO2 frost.", source: S.afterWinter.url },
        { label: "Archival names", value: "250,000 names", note: "The Planetary Society describes the Visions of Mars DVD as containing 250,000 names; exact contents and lifetime are not asserted here.", source: S.visions.url },
      ],
      beats: [
        { line: "Autumn took away my sunlight.", detail: "Phoenix was built for the bright northern summer, when the Sun stayed above the horizon for weeks. As autumn deepened, the Sun dipped below the horizon each night and solar output fell. The mission curtailment ended with the last signal on November 2, 2008." },
        { line: "Winter covered the whole north.", detail: "At this latitude, carbon-dioxide frost can blanket the landscape for months. HiRISE’s later image shows the hardware dust-covered and less colorful than in 2008, and the lander’s shadow suggests the west solar panel had likely collapsed under the frost." },
        { line: "The before-and-after shadow told the story.", detail: "Comparing the changed shadow with the 2008 views helped HiRISE interpret what winter had done. The panel was not designed for that snow load, so the missing shadow became evidence about the season’s weight." },
        { line: "A library still waits on my deck.", detail: "The Planetary Society’s Visions of Mars DVD was attached to Phoenix before launch. I did not carry a cockpit or a farewell voice, but I did carry an archive for future explorers — a quiet monument in Green Valley." },
      ], discovery: "Orbital before-and-after images can reveal what a silent lander experienced through winter.", question: "How can a shadow in a later photograph tell us about a winter no camera witnessed?",
    },
  ],
};
