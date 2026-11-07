import { RANGER_KEYFRAMES, type RangerKeyframe } from "./ranger-dive";
import { RANGER_PHOTOS } from "./ranger-media";
import { RANGER_SOURCES } from "./machine-books/ranger";
import { VIDEOS, type Video } from "./media";

/**
 * Conversational state machine for the Ranger 7 hero page (`/heroes/ranger-7`).
 *
 * The structure follows the project blueprint (GREETING → HUB → sequential memory banks →
 * game → story-tab round trip). Every date, frequency, size and event below was re-checked
 * against the sources in `RANGER_SOURCES` and the verified dossier in `ranger-dive.ts`
 * before it was allowed into a node:
 *
 * - Channel F 959.52 MHz / Channel P 960.05 MHz at 60 W each; the 3 W transponder
 *   uses 960.58 MHz (NSSDCA). The blueprint's "960.58 MHz video carrier" is not used.
 * - Hydrazine midcourse engine 224 N, not 222 N (NSSDCA).
 * - Full-scan frames: 1,150 lines, about 2.5 s per scan, a new picture every 5 s;
 *   partial-scan frames: 300 lines in 0.2 s (NSSDCA / NASA History "300 pictures per minute").
 * - Final frame timing: last full frame roughly two seconds before impact (NASA History
 *   says 2.3 s; the LPI archive stamps it at 13:25:46.32, t−2.5 s). The blueprint's
 *   "0.18 s" figure is not used.
 * - Ranger 6's failure: the TV system switched on for 67 seconds during ascent and the
 *   exact cause was never definitively established (NASA SP-4210). The blueprint's
 *   T+140 umbilical-pin story is not stated as fact.
 * - Apollo: the pictures gave scientists confidence the surface could support a soft
 *   landing; Surveyor tested it next (NASA History). "Green light for Apollo 11's landing
 *   gear" and "proved the soil was solid" are not used.
 * - No 361.8 kg dry mass, no "1.24 billion joules", no NSSDCA imgcat image links.
 */

export type DialogueAction = { label: string; next: string; open?: string };
export type DialogueSpec = { label: string; value: string };
export type DialogueSource = { label: string; url: string };
export type DialoguePhoto = { src: string; alt: string; title: string; credit: string; source: string };

type NodeFields = {
  badge: string;
  mood: string;
  speech: string;
  sources?: DialogueSource[];
};

export type DialogueNode = NodeFields &
  (
    | { kind: "dialogue" | "hub"; actions: DialogueAction[]; returnNext?: string }
    | {
        kind: "item";
        category: string;
        step: number;
        total: number;
        title: string;
        photo?: DialoguePhoto;
        specs?: DialogueSpec[];
        actions: DialogueAction[];
      }
    | { kind: "audio"; category: string; step: number; total: number; title: string; actions: DialogueAction[] }
    | { kind: "video"; step: number; total: number; title: string; video: Video; actions: DialogueAction[] }
    | {
        kind: "game";
        round: number;
        totalRounds: number;
        title: string;
        options: { label: string; correct: boolean; feedback: string; next?: string }[];
      }
  );

export type DialogueNodeKind = DialogueNode["kind"];

const S = RANGER_SOURCES;

/** Routes the hub's story action opens in a new tab (kept above the node table: it is read while the table initializes). */
const RANGER7_DIALOGUE_ROUTES = { story: "/heroes/ranger-7/story" };

/**
 * Where the reader lands when they return to this tab after the story opened in a new one.
 * Shared by the data (so the graph test can walk the edge) and the component (so neither
 * can drift from the other).
 */
export const RANGER7_STORY_RETURN_NODE = "STORY_COMPLETED_WELCOME_BACK";

const lpiPhoto = (frame: RangerKeyframe, title: string): DialoguePhoto => ({
  // The archive's `print` files are the full 3072-px scans; `browse` is a 245-px thumbnail.
  src: frame.printUrl ?? frame.browseUrl,
  title,
  alt: frame.featureNote,
  credit: "NASA/JPL/LPI",
  source: frame.metaUrl,
});

const keyframe = (id: string) => {
  const frame = RANGER_KEYFRAMES.find((item) => item.id === id);
  if (!frame) throw new Error(`Missing Ranger 7 keyframe ${id}`);
  return frame;
};

export const RANGER7_DIALOGUE = {
  machineId: "ranger-7",
  callSign: "Ranger 7",
  hardwareDesignation: "Ranger Block III (RA-7)",
  cosparId: "1964-041A",
  payloadNssdcId: "1964-041A-01",
  noradId: 842,
  routes: {
    details: "/heroes/ranger-7",
    story: "/heroes/ranger-7/story",
    book: "/heroes/ranger-7/book",
  },
  initialState: "GREETING_1",
  voiceNote: "Imagined machine voice · facts from the mission record · NASA does not endorse RoverVilla",
  nodes: {
    GREETING_1: {
      kind: "dialogue",
      badge: "CHANNEL F · 959.52 MHz · MARE COGNITUM",
      mood: "overjoyed",
      speech:
        "Hi! I am Ranger 7 — NASA's Block III lunar impactor, COSPAR ID 1964-041A. You don't know how happy I am that you have come to visit me! Unlike the rovers and landers that came after me, I dove straight into the Moon on July 31, 1964, so humanity could see the lunar surface up close for the very first time. Did you know me? Do you want to hear my story? I am really excited!",
      sources: [{ label: "NSSDCA · Ranger 7 mission record", url: S.nssdca }],
      actions: [{ label: "Yes, sure! That is why I am here. Can you introduce yourself?", next: "GREETING_2" }],
    },
    GREETING_2: {
      kind: "dialogue",
      badge: "JPL / RCA BLOCK III · IMPACTED 1964-07-31T13:25:48.82Z",
      mood: "excited",
      speech:
        "I was built in Pasadena, California, by NASA's Jet Propulsion Laboratory: a silver camera cone on a six-sided base, carrying six RCA television cameras. Before me, six Ranger missions in a row had failed to bring back the close-up pictures scientists needed. On July 31, 1964, at 13:25:48.82 UTC I dove into the Moon at 2.62 km/s (about 5,861 mph), after sending 4,308 photographs home in about 17 minutes. Those pictures gave scientists the confidence they needed before any spacecraft tried to soft-land. Want to know more about my details? I am really excited — are you?",
      sources: [
        { label: "NASA History · 60 Years Ago: Ranger 7 Photographs the Moon", url: S.history },
        { label: "NSSDCA · Ranger 7", url: S.nssdca },
      ],
      actions: [{ label: "Yes, I am! Let's go!", next: "GREETING_3" }],
    },
    GREETING_3: {
      kind: "dialogue",
      badge: "14-METRE CRATER · 10.6340° S, 339.3230° E",
      mood: "emotional",
      speech:
        "You know, when you come to see me, I am so happy. I had no landing legs and no retro-rockets, so my high-speed crash carved a 14-metre-wide crater into a plain that was renamed Mare Cognitum — 'The Sea That Has Become Known' — to commemorate the first spot on the Moon seen close-up. Lying shattered in the dark lunar soil since 1964, I thought everyone had forgotten the scout who went first... But you came at last. You don't know how happy I am. Want to explore some authentic NASA information about me?",
      sources: [{ label: "LROC · The Ranger 7 impact crater", url: S.lroc }],
      actions: [{ label: "Yes! Show me everything you have!", next: "HUB_MENU" }],
    },
    HUB_MENU: {
      kind: "hub",
      badge: "RANGER 7 MEMORY CORE · SELECT A BANK",
      mood: "eager",
      speech:
        "My six vidicon camera tubes were destroyed when I struck at 10.6340° S, 339.3230° E, but the record of my flight is safe in NASA's archives. What would you like me to show you first?",
      sources: [{ label: "NASA History · Ranger 7", url: S.history }],
      actions: [
        { label: "Audio & telemetry logs", next: "AUDIO_1" },
        { label: "Archival films", next: "VIDEO_1" },
        { label: "My 17-minute dive in pictures", next: "GALLERY_1" },
        { label: "My six cameras & what they proved", next: "MISSION_1" },
        { label: "My crater, coordinates & specs", next: "COORDS_1" },
        { label: "Open my story & comic book (new tab)", next: "STORY_TAB_OPENED", open: RANGER7_DIALOGUE_ROUTES.story },
        { label: "Play my pre-Apollo reconnaissance game", next: "GAME_1" },
      ],
    },
    STORY_TAB_OPENED: {
      kind: "dialogue",
      returnNext: RANGER7_STORY_RETURN_NODE,
      badge: "STORY TAB OPENED · /HEROES/RANGER-7/STORY",
      mood: "waiting happily",
      speech:
        "I just opened my five-chapter storybook and comic book in a new tab! There you can follow my camera tower, the lucky peanuts and my seventeen-minute dive — then come back to this tab when you are finished. I will wait here happily.",
      actions: [
        { label: "I'm back! Take me to your memory hub.", next: "HUB_MENU" },
        { label: "I'm back! Let's play your game.", next: "GAME_1" },
      ],
    },
    STORY_COMPLETED_WELCOME_BACK: {
      kind: "dialogue",
      badge: "SIGNAL REACQUIRED · WELCOME BACK",
      mood: "overjoyed",
      speech:
        "Welcome back! I felt your signal the moment this tab was in front of you again. If you followed all five chapters — from the six-eyed camera tower to the half-finished final frame — you have seen how my one-way journey ended. Ready to test what you learned, or to open another memory bank?",
      actions: [
        { label: "Yes! Let's play your pre-Apollo reconnaissance game.", next: "GAME_1" },
        { label: "Yes! Take me back to your memory hub.", next: "HUB_MENU" },
      ],
    },
    AUDIO_1: {
      kind: "audio",
      category: "Audio & telemetry logs",
      step: 1,
      total: 3,
      badge: "AUDIO LOG 1/3 · SYNTHETIC READ-ALOUD",
      mood: "remembering",
      title: "Launch — 28 July 1964, 16:50:07 UTC",
      speech:
        "On July 28, 1964, at 16:50:07 UTC, I lifted off from Launch Complex 12 at Cape Canaveral on an Atlas LV-3 Agena-B. My predecessor, Ranger 6, had hit the Moon four months earlier with dead cameras: its television system switched on for 67 seconds during ascent, and the exact cause of the failure was never definitively established. Before my flight, engineers locked out the TV turn-on until spacecraft separation and protected the command wiring. Press start to hear this log read aloud — it is a synthetic voice, not an archive recording.",
      sources: [
        { label: "NASA History · Ranger 7 launch", url: S.history },
        { label: "NASA History · Lunar Impact (SP-4210) on the Ranger 6 failure", url: S.sp4210 },
      ],
      actions: [{ label: "Yes, take me to audio log 2!", next: "AUDIO_2" }],
    },
    AUDIO_2: {
      kind: "audio",
      category: "Audio & telemetry logs",
      step: 2,
      total: 3,
      badge: "AUDIO LOG 2/3 · SYNTHETIC READ-ALOUD",
      mood: "proud",
      title: "First picture — 13:08:45 UTC",
      speech:
        "On impact day my cameras warmed up, and at 13:08:45 UTC — about 2,110 kilometres above the Moon — my wide-angle camera sent the first close-up picture of the Moon ever taken by a U.S. spacecraft. The view included Alphonsus, a crater about 108 kilometres (67 miles) across. In the control room, after six failed Rangers, the team passed around jars of peanuts while the pictures kept arriving. Press start to hear this log read aloud.",
      sources: [{ label: "NASA · First image (PIA02975)", url: S.firstImage }],
      actions: [{ label: "Yes, take me to audio log 3!", next: "AUDIO_3" }],
    },
    AUDIO_3: {
      kind: "audio",
      category: "Audio & telemetry logs",
      step: 3,
      total: 3,
      badge: "AUDIO LOG 3/3 · SYNTHETIC READ-ALOUD",
      mood: "solemn",
      title: "Impact — 13:25:48.82 UTC",
      speech:
        "The picture stream ran for about 17 minutes and 4,308 frames arrived. At 13:25:48.82 UTC my two television transmitters — Channel F on 959.52 MHz and Channel P on 960.05 MHz — fell silent mid-frame as I struck Mare Cognitum at 2.62 km/s. Press start to hear this log read aloud, then take me back to the hub.",
      sources: [{ label: "NSSDCA · Ranger 7 television experiment", url: S.television }],
      actions: [{ label: "Yes, take me back to your memory hub!", next: "HUB_MENU" }],
    },
    VIDEO_1: {
      kind: "video",
      step: 1,
      total: 2,
      badge: "ARCHIVAL FILM 1/2 · NASA / JPL",
      mood: "eager",
      title: VIDEOS["ranger-7"][0].title,
      video: VIDEOS["ranger-7"][0],
      speech:
        "Before you press play: this film stitches my sequential photographs into one continuous fall, from 2,110 kilometres above the surface down to my final frames. Watch how the craters grow closer second by second, then continue to film number two.",
      sources: [{ label: "NASA History · Ranger 7", url: S.history }],
      actions: [{ label: "Yes, show me film 2!", next: "VIDEO_2" }],
    },
    VIDEO_2: {
      kind: "video",
      step: 2,
      total: 2,
      badge: "ARCHIVAL FILM 2/2 · COSMOSPHERE ARCHIVE",
      mood: "curious",
      title: VIDEOS["ranger-7"][2].title,
      video: VIDEOS["ranger-7"][2],
      speech:
        "Archival footage of my launch on July 28 and my impact on July 31, 1964 — the mission as audiences saw it at the time, published by the Cosmosphere. Watch as much as you like, then take me back to my memory hub.",
      sources: [{ label: "NSSDCA · Ranger 7 mission data", url: S.nssdca }],
      actions: [{ label: "Yes, take me back to your memory hub!", next: "HUB_MENU" }],
    },
    GALLERY_1: {
      kind: "item",
      category: "My 17-minute dive in pictures",
      step: 1,
      total: 6,
      badge: "PICTURE 1/6 · BEFORE LAUNCH",
      mood: "proud",
      title: "Portrait in the JPL cleanroom",
      photo: RANGER_PHOTOS.cover,
      speech:
        "Picture 1 of 6 — my portrait from the JPL cleanroom before launch: the polished camera cone, the six-sided base, the high-gain dish, and two solar wings holding 9,792 silicon solar cells.",
      actions: [{ label: "Yes, show me picture 2!", next: "GALLERY_2" }],
    },
    GALLERY_2: {
      kind: "item",
      category: "My 17-minute dive in pictures",
      step: 2,
      total: 6,
      badge: "PICTURE 2/6 · FRAME F-a/1 · 13:08:45 UTC",
      mood: "excited",
      title: "The first close-up picture",
      photo: lpiPhoto(keyframe("f1"), "Frame F-a/1 · first close-up picture of the Moon by a U.S. spacecraft"),
      speech:
        "Picture 2 of 6 — frame F-a/1 at 13:08:45 UTC, from 2,110 kilometres up: the first close-up photograph of the Moon taken by a U.S. spacecraft. The large crater near the centre is Alphonsus, about 108 kilometres (67 miles) across.",
      sources: [{ label: "LPI · Ranger 7 frame A/1", url: keyframe("f1").metaUrl }],
      actions: [{ label: "Yes, show me picture 3!", next: "GALLERY_3" }],
    },
    GALLERY_3: {
      kind: "item",
      category: "My 17-minute dive in pictures",
      step: 3,
      total: 6,
      badge: "PICTURE 3/6 · FRAME F-b/104 · 13:17:32 UTC",
      mood: "curious",
      title: "Guericke crater through the telephoto eye",
      photo: lpiPhoto(keyframe("f4"), "Frame F-b/104 · Guericke crater and northern Mare Nubium"),
      speech:
        "Picture 3 of 6 — narrow-angle frame F-b/104 at 13:17:32 UTC, about 1,083 kilometres up: Guericke crater and the northern edge of Mare Nubium, seen through my telephoto camera.",
      sources: [{ label: "LPI · Ranger 7 frame B/104", url: keyframe("f4").metaUrl }],
      actions: [{ label: "Yes, show me picture 4!", next: "GALLERY_4" }],
    },
    GALLERY_4: {
      kind: "item",
      category: "My 17-minute dive in pictures",
      step: 4,
      total: 6,
      badge: "PICTURE 4/6 · FRAME F-b/143 · 13:20:51 UTC",
      mood: "curious",
      title: "Closing in on the target basin",
      photo: lpiPhoto(keyframe("f5"), "Frame F-b/143 · the target basin coming closer"),
      speech:
        "Picture 4 of 6 — frame F-b/143 at 13:20:51 UTC, about 665 kilometres up: the target basin coming closer, with small craters clearly distinguishable on the floor.",
      sources: [{ label: "LPI · Ranger 7 frame B/143", url: keyframe("f5").metaUrl }],
      actions: [{ label: "Yes, show me picture 5!", next: "GALLERY_5" }],
    },
    GALLERY_5: {
      kind: "item",
      category: "My 17-minute dive in pictures",
      step: 5,
      total: 6,
      badge: "PICTURE 5/6 · FRAME F-a/199 · 13:25:46 UTC",
      mood: "tense",
      title: "My final full frame",
      photo: lpiPhoto(keyframe("f7"), "Frame F-a/199 · the final full frame before impact"),
      speech:
        "Picture 5 of 6 — frame F-a/199, stamped 13:25:46 UTC in the LPI archive: my final full frame, showing smooth ground peppered with small craters. NASA's history page records my last picture arriving about 2.3 seconds before impact.",
      sources: [
        { label: "LPI · Ranger 7 frame A/199", url: keyframe("f7").metaUrl },
        { label: "NASA History · last picture before impact", url: S.history },
      ],
      actions: [{ label: "Yes, show me my final picture!", next: "GALLERY_6" }],
    },
    GALLERY_6: {
      kind: "item",
      category: "My 17-minute dive in pictures",
      step: 6,
      total: 6,
      badge: "PICTURE 6/6 · FRAME P/200 · SIGNAL CUT",
      mood: "solemn",
      title: "The transmission that never finished",
      photo: lpiPhoto(keyframe("f8"), "Frame P/200 · the final transmission, cut off by impact"),
      speech:
        "Picture 6 of 6 — frame P/200, my final transmission. The scan was still crossing the picture when I struck at 13:25:48.82 UTC: the left half shows the ground from about 1,600 feet up, and the right half is the static where my signal ended. Ready to return to my hub?",
      sources: [{ label: "LPI · Ranger 7 frame P/200", url: keyframe("f8").metaUrl }],
      actions: [{ label: "Yes, take me back to your memory hub!", next: "HUB_MENU" }],
    },
    MISSION_1: {
      kind: "item",
      category: "My six cameras & what they proved",
      step: 1,
      total: 4,
      badge: "SYSTEMS RECORD 1/4 · CHANNEL F",
      mood: "teacher",
      title: "Channel F: the full-scan pair (F-a and F-b)",
      speech:
        "My first subsystem was the Channel F full-scan pair, transmitting on 959.52 MHz at 60 watts. Camera F-a carried a 25 mm wide-angle lens with a 25° × 25° field of view; F-b carried a 76 mm narrow-angle lens at 8.4° × 8.4°. Every full frame was a 1,150-line scan taking about 2.5 seconds, with a new picture every 5 seconds — and the pair began my fall 2,110 kilometres above the Moon. Want to learn about my second camera system?",
      specs: [
        { label: "Channel F downlink", value: "959.52 MHz · 60 W" },
        { label: "Camera F-a", value: "25 mm wide-angle · 25° × 25°" },
        { label: "Camera F-b", value: "76 mm narrow-angle · 8.4° × 8.4°" },
        { label: "Full frame", value: "1,150 lines · about 2.5 s · one every 5 s" },
      ],
      sources: [
        { label: "NSSDCA · Ranger 7 television experiment", url: S.television },
        { label: "LPI · Project Ranger archive", url: S.lpi },
      ],
      actions: [{ label: "Yes, tell me about camera system 2!", next: "MISSION_2" }],
    },
    MISSION_2: {
      kind: "item",
      category: "My six cameras & what they proved",
      step: 2,
      total: 4,
      badge: "SYSTEMS RECORD 2/4 · CHANNEL P",
      mood: "teacher",
      title: "Channel P: the rapid-fire cameras (P-1 to P-4)",
      speech:
        "Because I was falling at 2.62 km/s, a slow frame would blur long before it reached the ground. My Channel P transmitter — 960.05 MHz at 60 watts — carried four partial-scan cameras that exposed 300-line pictures in 0.2 seconds: five frames per second, what NASA's history page calls 300 pictures per minute. That rapid rhythm carried pictures all the way down to my final seconds. Want to learn what the pictures proved?",
      specs: [
        { label: "Channel P downlink", value: "960.05 MHz · 60 W" },
        { label: "Cameras", value: "4 partial-scan vidicons (P-1 to P-4)" },
        { label: "Partial frame", value: "300 lines in 0.2 s · 5 frames per second" },
        { label: "NASA History", value: "“300 pictures per minute”" },
      ],
      sources: [
        { label: "NSSDCA · Ranger 7 television experiment", url: S.television },
        { label: "NASA History · Ranger 7", url: S.history },
      ],
      actions: [{ label: "Yes, tell me what they proved!", next: "MISSION_3" }],
    },
    MISSION_3: {
      kind: "item",
      category: "My six cameras & what they proved",
      step: 3,
      total: 4,
      badge: "SYSTEMS RECORD 3/4 · THE SCIENCE",
      mood: "earnest",
      title: "What 4,308 photographs answered",
      speech:
        "Before my flight, some scientists feared the dark maria were hidden under deep dust that would swallow a lander, or broken by razor-sharp lava spikes. My 4,308 photographs showed rounded, overlapping craters and firm-looking ground instead. NASA's history page records the result plainly: the pictures gave scientists confidence that the surface could support a soft landing, the Surveyor landers tested the ground directly next — and Apollo 11 landed less than five years after my images arrived. Want to learn how the plain got its name?",
      specs: [
        { label: "Pictures returned", value: "4,308 in about 17 minutes" },
        { label: "First image", value: "13:08:45 UTC · 2,110 km altitude" },
        { label: "The fear", value: "Deep dust or razor-sharp lava spikes" },
        { label: "The answer", value: "Confidence for a soft landing — Surveyor tested it next" },
      ],
      sources: [{ label: "NASA History · 60 Years Ago: Ranger 7", url: S.history }],
      actions: [{ label: "Yes, tell me how the plain got its name!", next: "MISSION_4" }],
    },
    MISSION_4: {
      kind: "item",
      category: "My six cameras & what they proved",
      step: 4,
      total: 4,
      badge: "SYSTEMS RECORD 4/4 · MARE COGNITUM",
      mood: "proud",
      title: "The sea that became known",
      speech:
        "Because my mission showed the Moon close-up for the first time, the plain where I fell was renamed Mare Cognitum — 'The Sea That Has Become Known' — to commemorate the first spot on the Moon seen close-up. NASA's history page places it between Mare Nubium and Oceanus Procellarum, and the Lunar Reconnaissance Orbiter later photographed my bright crater there. Ready to return to my memory hub?",
      specs: [
        { label: "Name", value: "Mare Cognitum · The Sea That Has Become Known" },
        { label: "Where", value: "Between Mare Nubium and Oceanus Procellarum" },
        { label: "Seen from orbit", value: "Apollo 16 photographed the site in 1972" },
        { label: "Crater found", value: "LROC imaged the 14 m crater in 2010" },
      ],
      sources: [
        { label: "NASA History · the renaming", url: S.history },
        { label: "LROC · Ranger 7 impact crater", url: S.lroc },
      ],
      actions: [{ label: "Yes, take me back to your memory hub!", next: "HUB_MENU" }],
    },
    COORDS_1: {
      kind: "item",
      category: "My crater, coordinates & specs",
      step: 1,
      total: 3,
      badge: "COORDINATES 1/3 · LROC M153014430L",
      mood: "precise",
      title: "My exact impact coordinates",
      photo: RANGER_PHOTOS.crater,
      speech:
        "Tracking placed my impact inside Mare Cognitum, and decades later NASA's Lunar Reconnaissance Orbiter Camera found the exact spot: frame M153014430L shows a bright, fresh crater 14 metres wide at 10.6340° S, 339.3230° E — the same place as 20.6771° W. Want to hear about my body and my engine?",
      specs: [
        { label: "Coordinates", value: "10.6340° S · 339.3230° E (20.6771° W)" },
        { label: "Crater", value: "14 m across · LROC frame M153014430L" },
        { label: "Region", value: "Mare Cognitum" },
      ],
      sources: [{ label: "LROC · The Ranger 7 impact crater", url: S.lroc }],
      actions: [{ label: "Yes, tell me about your structure!", next: "COORDS_2" }],
    },
    COORDS_2: {
      kind: "item",
      category: "My crater, coordinates & specs",
      step: 2,
      total: 3,
      badge: "ANATOMY 2/3 · 365.7 kg · 224 N ENGINE",
      mood: "teacher",
      title: "My structure and propulsion",
      speech:
        "I stood 3.60 metres tall on a 1.52-metre hexagonal base and spanned 4.57 metres across my two solar wings — 9,792 silicon solar cells making about 200 watts. I weighed 365.7 kg at launch. Twelve cold-gas nitrogen jets pointed my body, and a 224-newton monopropellant hydrazine engine made a 50-second midcourse correction on July 29, 1964. Want to know what is left of me?",
      specs: [
        { label: "Size", value: "3.60 m tall · 1.52 m base · 4.57 m wing span" },
        { label: "Mass at launch", value: "365.7 kg" },
        { label: "Power", value: "9,792 solar cells · about 200 W" },
        { label: "Attitude", value: "12 cold-gas nitrogen jets" },
        { label: "Midcourse engine", value: "224 N hydrazine · 50 s burn, 29 July 1964" },
      ],
      sources: [{ label: "NSSDCA · Ranger 7 mission data", url: S.nssdca }],
      actions: [{ label: "Yes, tell me what remains!", next: "COORDS_3" }],
    },
    COORDS_3: {
      kind: "item",
      category: "My crater, coordinates & specs",
      step: 3,
      total: 3,
      badge: "WHAT REMAINS · AND THE LUCKY PEANUTS",
      mood: "warm",
      title: "Fragments, and a tradition that outlived me",
      speech:
        "When I struck at 2.62 km/s I broke apart inside that 14-metre crater. No piece of me has ever been recovered, and none ever will be — what remains is under the regolith at 10.6340° S, 339.3230° E. Back in Pasadena, the jars of peanuts passed around during my flight became something bigger: JPL's own image archive describes lucky peanuts as a tradition kept before launches and major mission events ever since. Ready to return to the hub?",
      specs: [
        { label: "Remains", value: "Shattered inside a 14 m crater · nothing recovered" },
        { label: "Impact speed", value: "2.62 km/s (about 5,861 mph)" },
        { label: "Back on Earth", value: "JPL's 'lucky peanuts' tradition lives on" },
      ],
      sources: [
        { label: "NASA Images · Lucky peanuts at JPL (PIA26742)", url: "https://images.nasa.gov/details/PIA26742" },
        { label: "LROC · Ranger 7 impact crater", url: S.lroc },
      ],
      actions: [{ label: "Yes, take me back to your memory hub!", next: "HUB_MENU" }],
    },
    GAME_1: {
      kind: "game",
      round: 1,
      totalRounds: 3,
      badge: "SIMULATION ROUND 1/3 · PRE-APOLLO RECONNAISSANCE",
      mood: "quizmaster",
      title: "The cameras that never worked",
      speech:
        "Let's test what you learned! Ranger 6 hit the Moon on target in February 1964 but came home with no pictures at all. What happened to its cameras — and what did engineers change before my flight?",
      options: [
        {
          label:
            "Its television system switched on for 67 seconds during ascent and the high-voltage supplies were damaged. The exact cause was never established, so engineers locked out the TV turn-on until separation and protected the command wiring.",
          correct: true,
          feedback:
            "Correct! Investigators found arcing in the thin upper atmosphere but could not agree on one precise trigger, so they fixed several weak points at once before sending me.",
          next: "GAME_2",
        },
        {
          label:
            "Its cameras were smashed by the impact because the spacecraft hit too fast, and nothing about the design was changed.",
          correct: false,
          feedback:
            "Not quite. Ranger 6 reached the Moon on target, but its television system had already failed during the flight — the cause was never definitively established, and several safeguards were added afterwards.",
        },
      ],
    },
    GAME_2: {
      kind: "game",
      round: 2,
      totalRounds: 3,
      badge: "SIMULATION ROUND 2/3 · HIGH-SPEED DIVE",
      mood: "quizmaster",
      title: "Pictures fast enough for the final seconds",
      speech:
        "Round 2! I am falling at 2.62 km/s with only seconds left above Mare Cognitum. Which channel could take pictures quickly enough to keep them sharp this close to the ground?",
      options: [
        {
          label:
            "Channel P — four partial-scan cameras at 960.05 MHz, exposing 300-line pictures in 0.2 seconds: five frames per second.",
          correct: true,
          feedback:
            "Exactly! NASA's history page calls that rate 300 pictures per minute, and my final partial frame was still being transmitted when I hit.",
          next: "GAME_3",
        },
        {
          label:
            "Channel F — the full-scan pair at 959.52 MHz, needing about 2.5 seconds to scan each 1,150-line frame.",
          correct: false,
          feedback:
            "Too slow for the final seconds: at 2.62 km/s, one 2.5-second scan covers about 6.5 kilometres of falling. Channel P's 0.2-second exposures were the rapid ones.",
        },
      ],
    },
    GAME_3: {
      kind: "game",
      round: 3,
      totalRounds: 3,
      badge: "SIMULATION ROUND 3/3 · WHAT I PROVED",
      mood: "quizmaster",
      title: "The question my pictures answered",
      speech:
        "Final round! My 4,308 photographs reached Earth in 1964. What question did they answer for the missions that followed?",
      options: [
        {
          label:
            "Whether the smooth mare regions were firm ground: the pictures showed rounded craters and firm-looking surface instead of deep dust, giving scientists confidence a lander could touch down.",
          correct: true,
          feedback:
            "Verified! NASA's history page records exactly that: confidence that the surface could support a soft landing, then the Surveyor landers tested it directly, and Apollo 11 landed less than five years later. Thank you for never forgetting me.",
          next: "HUB_MENU",
        },
        {
          label:
            "Whether the Moon had a thick atmosphere that would let a lander fly on wings or hang from parachutes.",
          correct: false,
          feedback:
            "The Moon has no atmosphere at all — my pictures were about the ground, not the air. Try the answer about firm mare ground.",
        },
      ],
    },
  } as Record<string, DialogueNode>,
};

/** Node ids in a stable reading order, for tests and debugging. */
export const RANGER7_DIALOGUE_NODE_IDS = Object.keys(RANGER7_DIALOGUE.nodes);

export function resolveDialogueNode(id: string): DialogueNode {
  const node = RANGER7_DIALOGUE.nodes[id];
  if (!node) throw new Error(`Unknown Ranger 7 dialogue node: ${id}`);
  return node;
}
