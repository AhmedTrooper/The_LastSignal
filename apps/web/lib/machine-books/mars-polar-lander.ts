import type { MachineBook } from "./types";
import { MPL_SOURCES as S } from "../mpl-sources";

export const MPL_BOOK: MachineBook = {
  slug: "mars-polar-lander", name: "Mars Polar Lander", title: "The South Pole pioneer that taught landers how to land.",
  introduction: "We were the first explorer aimed at Mars’s icy south pole. We carried a microphone, student names, and two tiny penetrators — and our missing landing taught every rover and lander after us.",
  chapters: [
    {
      id: "carrying-names-and-a-microphone", title: "Carrying names and a microphone", event: "Launch to Mars’s south polar layered terrain with education cargo", hardware: "Delta II, Mars Volatiles and Climate Surveyor, Russian lidar, Planetary Society microphone and student names artifact",
      source: S.mission.url, relatedSources: [S.registry].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Launch", value: "3 January 1999", note: "Delta II from Cape Canaveral; cruise about 11 months to Mars.", source: S.registry.url },
        { label: "Target terrain", value: "Between 73° S and 76° S", note: "Southern polar layered terrain, less than 1000 km from the south pole (NSSDCA).", source: S.registry.url },
        { label: "Last telemetry", value: "3 December 1999, just before entry", note: "NSSDCA records final tracking about 19:45–20:00 UT; the turn to entry attitude followed about 20:04.", source: S.registry.url },
      ],
      beats: [
        { line: "I was bound for the bottom of Mars.", detail: "I am Mars Polar Lander. I launched on January 3, 1999, on a Delta II toward the southern polar layered terrain, between 73 and 76 degrees south. No earlier lander had aimed so close to a pole, where stacked ice and dust might record the climate history of Mars." },
        { line: "I carried a lander full of firsts.", detail: "My science package included a robotic arm and camera, a stereo imager and weather mast, a gas analyzer, and a Russian laser ranger. I also carried a microphone — an attempt to let Earth hear Mars for the first time — and a tiny artifact bearing schoolchildren’s names." },
        { line: "My touchdown was planned in late spring light.", detail: "The plan called for a direct atmospheric entry in late southern spring, when the Sun would stay above the horizon at the landing site. That daylight was meant to give the solar-powered lander time to work before polar darkness returned." },
        { line: "Then my radio went quiet by design.", detail: "My medium-gain antenna was turned for entry, and the last telemetry was sent just before atmospheric entry on December 3, 1999. After that, JPL had to wait in silence for the post-landing signal that was due about 24 minutes after touchdown." },
      ], discovery: "Exploring a hostile polar site requires planning for darkness, cold, and the data that will prove the spacecraft survived.", question: "Why aim a lander at a pole instead of a warmer place?",
    },
    {
      id: "amundsen-and-scott", title: "Amundsen and Scott", event: "Two Deep Space 2 microprobes designed for hard impact and subsurface sampling", hardware: "Deep Space 2 forebody penetrators, aftbodies, ceramic aeroshells and lithium batteries",
      source: S.ds2.url, relatedSources: [S.registry].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Probe mass", value: "3.572 kg each", note: "NSSDCA Deep Space 2 profile; aeroshell 1.165 kg, forebody 0.670 kg.", source: S.ds2.url },
        { label: "Impact design", value: "160 to 200 m/s", note: "NSSDCA range; penetration 0.3 to 1 m depending on material. No single speed or peak-G value is asserted.", source: S.ds2.url },
        { label: "Target area", value: "Near 73° S, 210° W", note: "About 50 to 100 km from the lander touchdown site.", source: S.ds2.url },
      ],
      beats: [
        { line: "I traveled with two small daredevils.", detail: "Under my cruise stage rode two Deep Space 2 microprobes named Amundsen and Scott. Each weighed about 3.6 kilograms and was built to test whether tiny instruments could survive a hard impact and still measure underground properties." },
        { line: "They were built to split on impact.", detail: "Each probe had a ceramic aeroshell, an aftbody that would stay on the surface for radio communication, and a thin forebody penetrator. On impact the aeroshell would shatter and the forebody would separate, carrying instruments into the ground." },
        { line: "The bullet was meant to burrow.", detail: "The forebody was designed to penetrate roughly 0.3 to 1 metre into subsurface material. Inside were instruments to study soil, temperature and water-bearing minerals — a miniature laboratory buried by the crash itself." },
        { line: "Neither probe answered.", detail: "No signals were received from either Deep Space 2 probe after landing. Because they sent no descent telemetry, the exact fate of Amundsen and Scott remains unknown; they may have been damaged, buried, or simply unable to communicate." },
      ], discovery: "Some instruments must survive being buried, so impact survival and communication are part of the science design.", question: "How can a falling probe measure soil if it has no parachute?",
    },
    {
      id: "the-fatal-latch", title: "The fatal latch", event: "Leg-deployment signals, missing software handling and premature engine cutoff", hardware: "Landing-leg touchdown sensors, flight software, radar altimeter and pulsed descent engines",
      source: S.failureReview.url, relatedSources: [S.hallLesson, S.registry].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Descent engines", value: "Three groups of four 266 N engines", note: "NSSDCA profile; 12 engines total.", source: S.registry.url },
        { label: "Entry speed", value: "6.8 km/s", note: "NSSDCA mission profile for direct atmospheric entry.", source: S.registry.url },
        { label: "Investigation finding", value: "False landed signal shut engines down", note: "NASA mission page summarizes the investigation; the story does not reproduce an exact second-by-second reconstruction.", source: S.mission.url },
      ],
      beats: [
        { line: "My entry had no live radio voice.", detail: "I entered the atmosphere directly at about 6.8 kilometres per second. The heat shield slowed me, the parachute opened, the heat shield was dropped, and the landing legs deployed before the powered descent. During this whole sequence, Earth received no live descent telemetry." },
        { line: "My legs spoke before we landed.", detail: "Each landing leg carried a touchdown sensor. When the legs unfolded in the air, the mechanical motion could briefly trip those sensors — a false momentary signal that the ground had already been touched." },
        { line: "The software remembered the wrong moment.", detail: "The review found that this leg-deployment transient was not properly accounted for before the touchdown check. Later, when radar control ended and the computer trusted the leg-sensor state, it could read an old landed signal as if touchdown had already happened." },
        { line: "The engines stopped in the air.", detail: "With the false landed state latched, the descent engines could shut down before the lander reached the ground. The spacecraft then fell unpowered to the surface. The investigation concluded that a false signal indicating landing shut down the main engines and caused the crash." },
      ], discovery: "Software must distinguish a deployment transient from real contact — and high-risk descents need live telemetry to reveal hidden states.", question: "Why can a sensor be correct in hardware yet wrong in timing?",
    },
    {
      id: "searching-the-ice", title: "Searching the ice", event: "Radio searches and orbital imaging of the polar landing zone", hardware: "Deep Space Network, Mars Global Surveyor camera and later MRO HiRISE",
      source: S.mission.url, relatedSources: [S.site, S.searchMosaic, S.scale].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Search imaging", value: "MGS December 1999 – January 2000", note: "NASA mission page lists the first MGS search on December 16, 1999.", source: S.mission.url },
        { label: "Termination", value: "17 January 2000", note: "NASA terminated all attempts to establish contact on this date.", source: S.mission.url },
        { label: "Landing-zone scale", value: "Terrain like buildings at JPL", note: "PIA02347 compares landing-zone terrain with JPL buildings at the same scale.", source: S.scale.url },
      ],
      beats: [
        { line: "Silence was the first data point.", detail: "The first post-landing signal was due about 24 minutes after touchdown, but it never arrived. For weeks, NASA listened with Earth dishes and orbiting spacecraft. Silence could mean many things: a failed entry, a crash, a wrong antenna direction, or a safe-mode lander waiting for a command." },
        { line: "Orbiters started looking, not just listening.", detail: "Mars Global Surveyor imaged the polar landing zone in December 1999 and January 2000. At the available resolution, a roughly 3.6-metre lander on rough, frost-covered terrain could be only a pixel or two — easy to miss among shadows and seasonal frost." },
        { line: "A bright dot was not the parachute.", detail: "Later re-examination of an orbital image raised hope that a bright feature might be the parachute. A new image showed the feature had changed, consistent with seasonal frost rather than a spacecraft part. HiRISE searches continued, but the lander has not been positively found." },
        { line: "The search itself became a lesson.", detail: "The missing spacecraft showed why future landers needed live descent telemetry and better end-to-end testing. Even a well-built spacecraft can become a mystery if its highest-risk minutes are silent." },
      ], discovery: "Orbital search resolution and seasonal surface change determine whether small hardware can be found after a silent landing.", question: "Why is finding a lander from orbit harder than finding a rover?",
    },
    {
      id: "lessons-and-phoenix", title: "Lessons and Phoenix", event: "Investigation, telemetry reforms and later polar landings", hardware: "Flight-software testing, descent telemetry, spare hardware and MRO orbital imaging",
      source: S.mission.url, relatedSources: [S.failureReview, S.registry].map(({ title: label, url }) => ({ label, url })),
      telemetry: [
        { label: "Phoenix landing", value: "25 May 2008", note: "NASA Science calls it the first successful stationary soft landing since Viking 2, about 32 years earlier.", source: "https://science.nasa.gov/mission/mars-phoenix/" },
        { label: "Phoenix site", value: "68.22° N, 234.25° E", note: "Green Valley, Vastitas Borealis; a northern polar site with shallow water ice.", source: "https://science.nasa.gov/mission/mars-phoenix/" },
      ],
      beats: [
        { line: "The twin in the lab told the truth.", detail: "Engineers tested the same descent logic on hardware kept for the canceled 2001 lander. That test environment helped expose how leg-deployment signals could be mishandled before touchdown checking." },
        { line: "Later landers learned to talk during descent.", detail: "After Mars Polar Lander, NASA missions placed much greater emphasis on live descent telemetry and integrated testing. Spirit, Opportunity, Phoenix, Curiosity, InSight and Perseverance all benefited from those reforms, even though each mission was different." },
        { line: "Phoenix carried the second chance.", detail: "Phoenix used spare hardware and instruments descended from the Mars Surveyor era. It landed in the Martian north in 2008, confirmed water ice, tasted water in TEGA, found perchlorate salts, and measured falling snow with a laser." },
        { line: "The south pole still keeps my secrets.", detail: "Mars Polar Lander and Deep Space 2 have not been positively located. Their value now is partly scientific, partly historical: they mark the cost of a missing line of code and the work that made later polar exploration safer." },
      ], discovery: "A failed mission can still improve the next one when investigation, testing and telemetry are treated as one system.", question: "What does Phoenix prove about the value of spare hardware?",
    },
  ],
};
