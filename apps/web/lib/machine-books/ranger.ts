import type { MachineBook } from "./types";

export const RANGER_SOURCES = {
  mission: "https://science.nasa.gov/mission/ranger-7/",
  nssdca: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1964-041A",
  television: "https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=1964-041A-01",
  history: "https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/",
  ranger6: "https://science.nasa.gov/mission/ranger-6/",
  sp4210: "https://www.nasa.gov/history/alsj/alsj-ranger.html",
  lpi: "https://www.lpi.usra.edu/resources/ranger/",
  lroc: "https://lroc.im-ldi.com/images/52",
  firstImage: "https://images.nasa.gov/details/PIA02975",
  guericke: "https://images.nasa.gov/details/PIA02974",
} as const;

const S = RANGER_SOURCES;

/** Imagined first-person retellings. Every event detail, number and limitation keeps its source context. */
export const RANGER_BOOK: MachineBook = {
  slug: "ranger-7",
  name: "Ranger 7",
  title: "Pictures before goodbye",
  introduction:
    "I had no landing legs and no way home. My job was to fall toward the Moon, look closely, and send the pictures back before I arrived. These are five true events from that one-way journey.",
  chapters: [
    {
      id: "six-eyed-tower",
      title: "The six-eyed camera tower",
      event: "Ranger 7 is built to photograph the Moon during a deliberate impact",
      hardware: "RCA Vidicon television system, two solar panels, high-gain antenna and a hydrazine midcourse engine",
      source: S.nssdca,
      relatedSources: [
        { label: "NSSDCA · The Ranger 7 television experiment", url: S.television },
        { label: "NASA Science · Ranger 7 mission overview", url: S.mission },
        { label: "NASA History · 60 Years Ago: Ranger 7 Photographs the Moon", url: S.history },
      ],
      telemetry: [
        {
          label: "Spacecraft size",
          value: "3.6 m tall · 1.52 m across the base · 4.57 m solar-panel span",
          note: "The hexagonal base carried the spacecraft systems; the conical tower carried the cameras.",
          source: S.nssdca,
        },
        {
          label: "Mass and power",
          value: "365.7 kg · 9,792 silicon solar cells · 200 W nominal",
          note: "NSSDCA lists 365.7 kg. NASA Science's mission overview rounds the same spacecraft to 365.6 kg.",
          source: S.nssdca,
        },
        {
          label: "Camera system",
          value: "6 RCA Vidicon cameras · 2 full-scan + 4 partial-scan",
          note: "One full-scan camera was wide-angle and one was narrow-angle. The four partial-scan cameras could return rapid sequences of smaller frames.",
          source: S.television,
        },
        {
          label: "Television mass",
          value: "173 kg",
          note: "The television package was a large share of the 365.7 kg spacecraft because it included cameras, power supplies, timers and transmitters.",
          source: S.television,
        },
      ],
      beats: [
        {
          line: "I am Ranger 7. I had no landing legs, because I was not built to land.",
          detail:
            "My job was to fall toward the Moon and keep taking pictures. My cameras would send what they saw to Earth while my spacecraft rushed closer to the surface. The journey was one-way by design.",
          sfx: "TARGET: MOON",
        },
        {
          line: "My body was a tall silver cone on a six-sided base, with two solar wings.",
          detail:
            "The cone held my cameras. The base carried my power, guidance and communications systems. My solar panels spread wide to catch sunlight and make electricity for the journey.",
        },
        {
          line: "Six television cameras looked out through a window in my cone.",
          detail:
            "Two full-scan cameras could record broad views. Four partial-scan cameras could return rapid close-ups. Together they were meant to show the Moon at growing detail as I approached.",
        },
        {
          line: "I could not bring my pictures home in my hands. I had to send them by radio.",
          detail:
            "My television system turned light into electrical signals. Transmitters and a high-gain antenna sent those signals across space to receiving stations on Earth.",
          sfx: "SIGNAL → EARTH",
        },
      ],
      discovery:
        "Ranger 7 was designed around a one-way journey. Its cameras and radio had to do the work while the spacecraft could not return.",
      question:
        "Why would a camera on a spacecraft need a radio system as much as it needed a lens?",
    },
    {
      id: "six-failures",
      title: "Six Rangers before me",
      event: "The Ranger 6 television failure and the changes made before Ranger 7",
      hardware: "Television power supply, command circuitry and the Agena umbilical connector",
      source: S.ranger6,
      relatedSources: [
        { label: "NASA History · Lunar Impact (NASA SP-4210)", url: S.sp4210 },
        { label: "NSSDCA · Ranger 7 television experiment", url: S.television },
        { label: "NASA History · 60 Years Ago: Ranger 7 Photographs the Moon", url: S.history },
      ],
      telemetry: [
        {
          label: "Ranger 6 mission",
          value: "Launched 30 January 1964 · impacted 2 February 1964",
          note: "Ranger 6 reached the Moon on target. Its television system returned no pictures.",
          source: S.ranger6,
        },
        {
          label: "Television turn-on",
          value: "67 seconds during ascent",
          note: "Telemetry showed the TV system switching on about two minutes after launch, then switching off again. Investigators focused on that period.",
          source: S.sp4210,
        },
        {
          label: "Cause",
          value: "Never definitively established",
          note: "JPL's board found that arcing in the thin upper atmosphere damaged the high-voltage supplies, but could not agree on the precise trigger. It recommended several safeguards rather than one single fix.",
          source: S.sp4210,
        },
        {
          label: "Earlier Ranger outcomes",
          value: "Block I: 2 Earth-orbit failures · Block II: 3 lunar failures · Ranger 6: no pictures",
          note: "NASA describes Ranger 7 as the first success after 13 failed U.S. Moon attempts. The Ranger program itself had different blocks and different failure modes.",
          source: S.history,
        },
      ],
      beats: [
        {
          line: "Before me, six Rangers had tried. None of them brought back the pictures scientists needed.",
          detail:
            "Rangers 1 and 2 never left Earth orbit. Rangers 3 and 5 missed the Moon. Ranger 4 hit the far side but could not return data. Ranger 6 reached the Moon, but its television system failed.",
        },
        {
          line: "Ranger 6's cameras were dead before it arrived.",
          detail:
            "A short circuit disabled the television system during the flight. The spacecraft still hit the Moon on target, but it returned no pictures. The exact cause of the failure was never definitively established.",
          sfx: "NO PICTURE",
        },
        {
          line: "Engineers could not agree on one exact cause, so they made several safeguards.",
          detail:
            "During Ranger 6's ascent, its television system had switched on for 67 seconds in the thin upper atmosphere. Investigators found that high voltage could arc there. They locked out the TV turn-on until separation and protected the command wiring.",
        },
        {
          line: "I would have to show that the changes worked.",
          detail:
            "Ranger 7 carried the same kind of six-camera system, but with fixes meant to prevent an early turn-on. The team had one more chance to make the Ranger camera experiment succeed.",
          sfx: "TRY AGAIN",
        },
      ],
      discovery:
        "When a failure has more than one possible cause, engineers may fix several weak points at once and then test the whole system in flight.",
      question:
        "Why might a team add several safeguards when it cannot prove which one caused a failure?",
    },
    {
      id: "lucky-peanuts",
      title: "Peanuts and a steering burn",
      event: "Ranger 7 launches, cruises to the Moon and fires its midcourse engine",
      hardware: "Atlas LV-3 Agena-B, solar arrays, cold-gas jets and a hydrazine engine",
      source: S.history,
      relatedSources: [
        { label: "NSSDCA · Ranger 7 launch and mission profile", url: S.nssdca },
        { label: "NASA Science · Ranger 7 mission overview", url: S.mission },
        { label: "NASA History · Lunar Impact (NASA SP-4210)", url: S.sp4210 },
      ],
      telemetry: [
        {
          label: "Launch",
          value: "28 July 1964 · 16:50:07 UTC",
          note: "Atlas LV-3 Agena-B from Launch Complex 12 at Cape Canaveral. A faulty telemetry battery and a ground-guidance problem had delayed the first attempt by a day.",
          source: S.history,
        },
        {
          label: "Earth orbit",
          value: "192 km parking orbit",
          note: "The Atlas and Agena first placed Ranger in low Earth orbit. Half an hour after launch, a second Agena burn sent it toward the Moon.",
          source: S.nssdca,
        },
        {
          label: "Midcourse correction",
          value: "29 July 1964 · 50-second burn",
          note: "A 224-N monopropellant hydrazine engine made the course correction. The exact burn time and thrust are NSSDCA values; contemporary descriptions sometimes round them.",
          source: S.nssdca,
        },
        {
          label: "Attitude control",
          value: "12 nitrogen jets · 3 gyros · Sun and Earth sensors",
          note: "Small cold-gas jets turned the spacecraft so the solar panels could face the Sun and the antenna could face Earth.",
          source: S.nssdca,
        },
      ],
      beats: [
        {
          line: "On 28 July 1964, my Atlas-Agena rocket lifted off from Cape Canaveral.",
          detail:
            "The launch came after a one-day delay. My rocket first placed me in Earth orbit, then sent me onto a path toward the Moon.",
          sfx: "LIFTOFF",
        },
        {
          line: "In the control room, the team shared a bag of peanuts.",
          detail:
            "After six Ranger failures, the mission team was anxious. Trajectory engineer Dick Wallace brought peanuts into the JPL control room. The small tradition continued after Ranger 7 succeeded.",
        },
        {
          line: "In space, I turned my solar panels toward the Sun and my antenna toward Earth.",
          detail:
            "Small cold-gas jets helped adjust my orientation. My solar arrays made electricity, and my high-gain antenna gave me a way to talk with stations on Earth.",
          sfx: "SUN LOCK · EARTH LOCK",
        },
        {
          line: "A small engine fired for 50 seconds and nudged me toward my target.",
          detail:
            "On 29 July, my hydrazine engine made a midcourse correction. A small change in speed and direction far from the Moon could shift my arrival point by many kilometers.",
          sfx: "BURN 50 s",
        },
      ],
      discovery:
        "A long journey can be steered by small, carefully timed changes, and a team's shared ritual can carry a story of its own.",
      question:
        "Why does a tiny engine burn far from the Moon change where the spacecraft arrives?",
    },
    {
      id: "seventeen-minutes",
      title: "Seventeen minutes of pictures",
      event: "Ranger 7 transmits the first close-up images of the Moon by a U.S. spacecraft",
      hardware: "Six RCA Vidicon cameras, two television channels and the Goldstone receiving stations",
      source: S.history,
      relatedSources: [
        { label: "NASA · First image of the Moon from a U.S. spacecraft (PIA02975)", url: S.firstImage },
        { label: "NASA · Guericke Crater from Ranger 7 (PIA02974)", url: S.guericke },
        { label: "LPI · Ranger 7 photographic archive", url: S.lpi },
        { label: "NSSDCA · Ranger 7 television experiment", url: S.television },
      ],
      telemetry: [
        {
          label: "First image",
          value: "13:08:45 UTC · 2,110 km altitude",
          note: "The wide-angle F-a camera returned a view that included the 108-km crater Alphonsus.",
          source: S.history,
        },
        {
          label: "Picture total",
          value: "4,308 photographs in about 17 minutes",
          note: "NASA History and NSSDCA list 4,308. NASA Science's short mission overview sometimes gives 4,316; this book uses the archive and history figure.",
          source: S.history,
        },
        {
          label: "Final full frame",
          value: "About 2.3 seconds before impact · 1,600 ft",
          note: "NASA History describes detail down to about 15 inches. NSSDCA lists the final image resolution as 0.5 m, a slightly different measure.",
          source: S.history,
        },
        {
          label: "Television downlink",
          value: "Channel F 959.52 MHz · Channel P 960.05 MHz · 60 W each",
          note: "A separate 3 W transponder used 960.58 MHz. The two TV channels had independent power supplies, timers and transmitters.",
          source: S.nssdca,
        },
      ],
      beats: [
        {
          line: "My cameras warmed up, and at 13:08:45 UTC the first picture left for Earth.",
          detail:
            "I was about 2,110 kilometers above the Moon. My wide-angle camera sent a view that included the 108-kilometer crater Alphonsus.",
          sfx: "FIRST FRAME",
        },
        {
          line: "As I fell, my cameras kept looking and my radio kept sending.",
          detail:
            "Different cameras offered wide views and tighter close-ups. The partial-scan cameras could return rapid sequences, and the images reached Earth through two television channels.",
        },
        {
          line: "The pictures showed a surface covered with craters, not a sea of deep dust.",
          detail:
            "Scientists saw rounded, overlapping craters and bright rays of material. The images gave them confidence that the smoother mare regions could support an Apollo landing, though later Surveyor landers would test the surface directly.",
        },
        {
          line: "In about 17 minutes, I sent 4,308 pictures.",
          detail:
            "My last full frame came about 2.3 seconds before impact, from roughly 1,600 feet above the ground. It could show details as small as 15 inches across.",
          sfx: "4,308 FRAMES",
        },
      ],
      discovery:
        "A series of images at increasing resolution can turn a distant, fuzzy world into a place with measurable features.",
      question:
        "Why would scientists want both wide views and close-up views of the same surface?",
    },
    {
      id: "mare-cognitum",
      title: "The half-finished final frame",
      event: "Ranger 7's final transmission and its impact in Mare Cognitum",
      hardware: "Vidicon camera, radio transmitter and the impact crater left behind",
      source: S.history,
      relatedSources: [
        { label: "LPI · Ranger 7 frame P/200 (final transmission)", url: "https://www.lpi.usra.edu/resources/ranger/frame/?msn=7&cam=P&plt=200" },
        { label: "LROC · Ranger 7 impact crater M153014430L", url: S.lroc },
        { label: "NSSDCA · Ranger 7 mission data", url: S.nssdca },
      ],
      telemetry: [
        {
          label: "Impact",
          value: "31 July 1964 · 13:25:48.82 UTC",
          note: "Ranger 7 struck the Moon at about 2.62 km/s (9,432 km/h).",
          source: S.nssdca,
        },
        {
          label: "Impact site",
          value: "Mare Cognitum · 10.6340° S, 339.3230° E",
          note: "The same location is 20.6771° W. The region was renamed Mare Cognitum, the Sea That Has Become Known.",
          source: S.lroc,
        },
        {
          label: "Crater",
          value: "14 m across · LROC frame M153014430L",
          note: "The Lunar Reconnaissance Orbiter imaged the fresh crater in 2010. Apollo 16 photographed the site from lunar orbit in 1972.",
          source: S.lroc,
        },
        {
          label: "Final transmission",
          value: "Cut off during the last partial frame",
          note: "The last full frame was taken about 2.3 seconds before impact. A final partial-scan exposure was still being transmitted when the spacecraft struck.",
          source: S.history,
        },
      ],
      beats: [
        {
          line: "My last picture was still being sent when I reached the Moon.",
          detail:
            "The final exposure caught the ground from very low altitude. The spacecraft struck at 13:25:48.82 UTC, while part of the image was still traveling to Earth.",
          sfx: "SIGNAL CUT",
        },
        {
          line: "The right side of that last picture became a wall of static.",
          detail:
            "The impact stopped the scan before the frame was complete. The left side showed small craters; the right side recorded the sudden end of the transmission.",
        },
        {
          line: "The area where I fell was named Mare Cognitum: the Sea That Has Become Known.",
          detail:
            "The name marked the first part of the Moon seen close-up. My pictures had turned an unknown plain into a place scientists could study.",
        },
        {
          line: "Years later, a camera in orbit found the crater I left behind.",
          detail:
            "Apollo 16 photographed the site in 1972. In 2010, NASA's Lunar Reconnaissance Orbiter imaged a bright, 14-meter-wide crater at 10.6340° S, 339.3230° E.",
          sfx: "CRATER FOUND",
        },
      ],
      discovery:
        "The impact ended the spacecraft, but the images and the crater became evidence that later missions could revisit.",
      question:
        "How can a place where a machine was destroyed become a useful scientific site?",
    },
  ],
};
