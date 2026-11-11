import type { MachineBook } from "./types";
import { PATHFINDER_SOURCES as S } from "../pathfinder-sources";

export const PATHFINDER_BOOK: MachineBook = {
  slug: "pathfinder-sojourner", name: "Pathfinder & Sojourner", title: "One stayed. One rolled. Both changed the story.",
  introduction: "One of us became a listening station on Mars. One rolled toward the rocks. Follow the airbag landing, a ramp that needed clearing, the measurements behind the pictures, and the silence that left real questions unanswered.",
  chapters: [
    {
      id: "two-jobs-one-journey", title: "Two jobs. One journey.", event: "Preparing Mars Pathfinder and launching on 4 December 1996", hardware: "Pathfinder lander, Sojourner rover, science instruments and Delta II launch vehicle", source: S.history.url,
      relatedSources: [{ label: S.catalog.title, url: S.catalog.url }],
      beats: [
        { line: "We travelled together, but we were built for different jobs.", detail: "Mars Pathfinder would become a stationary lander. Sojourner would explore nearby terrain. The mission tested a lower-cost way to land science equipment on Mars and operate a small rover. Both machines also carried tools for scientific observations." },
        { line: "A twelve-year-old helped give the rover its name.", detail: "NASA named Sojourner after Sojourner Truth, inspired by the winning essay of twelve-year-old Valerie Ambrose. A real naming contest connected a young person on Earth with a machine preparing to explore another planet." },
        { line: "On December 4, 1996, a Delta rocket carried us away from Florida.", detail: "The mission launched from Cape Canaveral's Launch Complex 17B. Course corrections refined the trajectory during the journey to Mars. We were not yet a station and a moving explorer—both were still travelling inside one spacecraft system." },
        { line: "The plan called for a month for the lander and a week for the rover.", detail: "Those were design mission goals, not dates when the machines were guaranteed to stop. First came a harder requirement: reaching the ground with the instruments and the rover intact." },
      ], discovery: "One mission can divide its work between different machines. Landing, local exploration and communications require different capabilities.", question: "Why send a rover and a stationary lander instead of making one machine do every job?",
    },
    {
      id: "the-landing-that-bounced", title: "The landing that bounced", event: "Atmospheric entry and airbag landing on 4 July 1997", hardware: "Heat shield, parachute, tether, radar, retrorockets and multi-lobed airbags", source: S.catalog.url,
      relatedSources: [{ label: S.mission.title, url: S.mission.url }],
      beats: [
        { line: "On July 4, our arrival began with a heat shield—not with wheels.", detail: "Pathfinder entered the Martian atmosphere directly from its approach trajectory. The shield reduced speed and protected the vehicle. The lander's instruments also recorded information about the atmosphere during descent." },
        { line: "A parachute slowed us. Rockets helped. Airbags took the final impacts.", detail: "The descent sequence handed work from one system to the next. After parachute deployment, the lander hung below the backshell on a tether. Radar measurements helped time the airbags and retrorockets before release near the surface." },
        { line: "We bounced and rolled before becoming a place where science could begin.", detail: "The inflated airbags cushioned the landing loads. NASA summaries differ in their detailed bounce counts and heights, so this illustration is not an exact replay. The documented outcome is clear: the lander came to rest and could operate." },
        { line: "The airbags deflated. The petals opened. A rover was still waiting inside.", detail: "Pathfinder opened its three triangular petals after landing. Solar cells, the camera and other instruments could begin their surface tasks. The airbags had protected the spacecraft—but one of them would now be in the rover's way." },
      ], discovery: "Landing is a sequence of different engineering jobs. Protecting a payload during arrival does not automatically make it ready to deploy.", question: "Why can't a parachute or an airbag do every part of a Mars landing on its own?",
    },
    {
      id: "a-ramp-not-yet-a-road", title: "A ramp, not yet a road", event: "Airbag clearing and rover rollout on 5 July US time / 6 July UTC", hardware: "Retracting airbags, deployment ramps, six wheels and rover-to-lander radio", source: S.catalog.url,
      relatedSources: [{ label: S.mission.title, url: S.mission.url }, { label: S.history.title, url: S.history.url }],
      beats: [
        { line: "An airbag had helped us land. Now it needed to move out of the way.", detail: "NASA's catalog records maneuvers to clear an airbag before rover deployment. The team checked the surroundings and prepared a usable ramp. A safe landing and a safe rollout were separate problems." },
        { line: "Sojourner stood up on six wheels before taking the slope to Mars.", detail: "The rover deployed from its stowed position and backed down a ramp. The catalog gives July 6 around 05:40 UTC. NASA Science describes the night of July 5 in US time. Those descriptions do not require two different rollouts." },
        { line: "Small wheels reached the ground. The lander stayed where it had landed.", detail: "Sojourner became the first wheeled vehicle operated on another planet. Pathfinder, renamed the Carl Sagan Memorial Station, remained the imaging, weather and communications station beside it." },
        { line: "The rover's next journey would still depend on the station behind it.", detail: "Sojourner exchanged information with Pathfinder, and the lander relayed rover data to Earth. Moving out onto Mars did not give the rover an independent Earth communications link. That partnership matters all the way to the end of this story." },
      ], discovery: "Deployment and communications are part of mobility. A rover can move separately while still relying on another spacecraft to send its evidence home.", question: "Which part of a rover mission stops being visible from Earth if its relay station cannot communicate?",
    },
    {
      id: "the-rocks-with-nicknames", title: "The rocks with nicknames", event: "Sojourner's early rock investigations in July 1997", hardware: "Rover cameras, wheels, hazard avoidance and Alpha Proton X-ray Spectrometer", source: S.history.url,
      relatedSources: [{ label: S.mission.title, url: S.mission.url }, { label: S.primary.title, url: S.primary.url }],
      beats: [
        { line: "Barnacle Bill. Yogi. Scooby Doo. The rock names were only the beginning.", detail: "The team gave memorable nicknames to targets near the lander. Pictures showed where to investigate. The names did not tell anyone which elements the rocks contained; measurements had to answer that question." },
        { line: "A camera could show a rock. Another instrument could investigate its chemistry.", detail: "Sojourner carried an Alpha Proton X-ray Spectrometer, or APXS. It measured elemental composition in rocks and soil. It was not a microphone or a detector that could announce life on Mars." },
        { line: "The rover's wheels also became part of the experiment.", detail: "The mission performed wheel technology experiments and tested semi-autonomous hazard avoidance. NASA's contemporary report describes learning about Martian soil as well as the rover's ability to operate around obstacles." },
        { line: "A useful answer needed more than one interesting-looking stone.", detail: "The instruments found differences in rock chemistry. Scientists compared the measurements with images and geological context. NASA's later history describes rocks generally resembling volcanic rocks on Earth—not proof that every Martian rock had the same history." },
      ], discovery: "An image, a composition measurement and a terrain observation answer different questions. Together they provide stronger evidence than a nickname or photograph alone.", question: "Why could two similar-looking rocks still need separate chemical measurements?",
    },
    {
      id: "the-station-watched-the-sky", title: "The station watched the sky", event: "Lander imaging, weather measurements and radio science during surface operations", hardware: "Imager for Mars Pathfinder, meteorology package, radio system and solar-powered lander", source: S.mission.url,
      relatedSources: [{ label: S.history.title, url: S.history.url }],
      beats: [
        { line: "While the rover visited rocks, the lander watched a changing world.", detail: "Pathfinder photographed the terrain and recorded atmospheric pressure, temperature and winds. Its scientific job was not limited to holding a ramp or passing along rover messages." },
        { line: "Clouds and sunsets became photographs—not guesses about the weather.", detail: "The camera recorded clouds and sunsets. NASA's descriptions interpret the morning clouds as likely ice crystals. That is a scientific interpretation of observations, not a claim that the camera touched a cloud." },
        { line: "A gust could leave clues in several measurements at once.", detail: "Temperature, wind and pressure signatures helped investigators identify dust-devil events. The mission also examined magnetic airborne dust. Our teaching diagrams illustrate these methods; their curves are not recovered weather telemetry." },
        { line: "The radio link was carrying science even when the rover was not moving.", detail: "Radio tracking constrained the lander's location and Mars' rotation. Geological observations also suggested running water in a warmer Martian past. Neither result was a direct sighting of liquid water or life at the 1997 landing site." },
      ], discovery: "A stationary spacecraft can investigate both the landscape and the environment. Observations and the explanations scientists draw from them must remain distinguishable.", question: "What can a weather sensor add to a dramatic photograph of the Martian sky?",
    },
    {
      id: "the-week-became-a-longer-journey", title: "The week became a longer journey", event: "Primary-mission completion and energy conservation in August 1997", hardware: "Rover hazard avoidance, lander solar cells and battery-management operations", source: S.primary.url,
      relatedSources: [{ label: S.history.title, url: S.history.url }],
      beats: [
        { line: "The first week ended. Sojourner's exploration did not.", detail: "The rover had been designed to operate for at least a week. NASA's August report described it as healthy after thirty days, having travelled fifty-two metres. That is an interim report, not the final mission distance." },
        { line: "On August 3, the lander's thirty-day primary mission was complete.", detail: "The mission had met its primary objectives and returned atmospheric, geological and engineering information. Continuing operations meant deciding how to use hardware that had already fulfilled its minimum goals." },
        { line: "Sometimes continuing meant powering down and waiting.", detail: "The lander entered a two-day hibernation period to recharge, and the team planned nighttime battery conservation. Sojourner's batteries were not rechargeable. The two spacecraft's power arrangements must not be confused." },
        { line: "The longer journey produced more evidence. It did not promise endless power.", detail: "NASA later reported eighty-three days of rover operation and about one hundred metres of travel. Those published figures do not establish a countdown to a particular component's death. The mission would end with a communications problem, not a recorded rover goodbye." },
      ], discovery: "Design goals are not automatic failure dates. Extending a mission requires careful energy management and honest distinctions between interim reports and final totals.", question: "Why might a team deliberately put a successful lander to sleep?",
    },
    {
      id: "a-carrier-is-not-a-conversation", title: "A carrier is not a conversation", event: "Final successful data on 27 September and later carrier detections in October 1997", hardware: "Main and auxiliary transmitters, lander battery and the rover's relay dependency", source: S.ending.url,
      relatedSources: [{ label: S.catalog.title, url: S.catalog.url }],
      beats: [
        { line: "On September 27, the last successful data cycle reached Earth.", detail: "The November JPL report identifies that final transmission cycle. Its review of the rover's last science describes an APXS study of a rock called Chimp. We do not invent an acquisition time for that study." },
        { line: "The team kept listening—and detected a carrier again.", detail: "Signals from the auxiliary transmitter were detected on October 1 and October 6. But the team could not recover lander health data. Detecting the radio carrier was not the same as receiving a new picture, a science result or a complete status report." },
        { line: "Without the lander link, Earth could not keep following the little rover.", detail: "Battery depletion and deeper day-night thermal cycling were considered probable explanations for the outage. JPL explicitly kept the true cause uncertain. The lander problem also left Sojourner's status unknown." },
        { line: "Did the rover move afterward? The record does not let us watch that ending.", detail: "The team discussed probable backup behavior, but had no observed post-outage rover movement. This story does not turn a prediction about circling into a witnessed final drive. Sometimes the authentic ending contains a question." },
      ], discovery: "A radio signal, usable data and a known spacecraft condition are different levels of evidence. Losing a relay can also hide the condition of another machine.", question: "Why is hearing a carrier signal not enough to tell whether a rover is still driving?",
    },
    {
      id: "the-record-outlived-the-link", title: "The record outlived the link", event: "The November 1997 mission review and a later orbital image in 2006", hardware: "Returned images, rock and weather data, archived mission reports and an orbital camera", source: S.history.url,
      relatedSources: [{ label: S.ending.title, url: S.ending.url }, { label: S.mission.title, url: S.mission.url }],
      beats: [
        { line: "Two silent machines had already sent a great deal home.", detail: "NASA records hundreds of rover photographs, thousands of lander images, rock chemistry and extensive weather observations. A panorama may combine many frames, so a beautiful stitched view is not a single instantaneous exposure." },
        { line: "Even the totals need their source labels.", detail: "The later NASA Science page reports 2.3 billion bits; the contemporary ending report gives 2.6 billion. We show both in the evidence ledger, not an invented combined figure. Source differences remain visible to readers and judges." },
        { line: "In 2006, an orbiter looked back at the lander's site.", detail: "NASA's history article includes a Mars Reconnaissance Orbiter view identifying the Pathfinder lander. It does not establish Sojourner's exact final position or prove that either spacecraft's electronics still work." },
        { line: "One stayed. One rolled. Their evidence helped the next explorers.", detail: "Pathfinder demonstrated landing technology and Sojourner demonstrated surface mobility and science. Both became predecessors of later Mars exploration. Their authentic legacy is what the record supports—not an invented final message from the dust." },
      ], discovery: "Mission records can continue teaching after the link ends. Their value includes discoveries, engineering lessons and clearly preserved limits on what is known.", question: "Which unanswered question would you preserve for a future investigator rather than fill with a guess?",
    },
  ],
};
