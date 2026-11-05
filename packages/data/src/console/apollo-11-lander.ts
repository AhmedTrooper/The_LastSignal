/**
 * Eagle's console: the first-person script for /heroes/apollo-11-lander.
 *
 * The voice is an interpretation, not a quotation. Every date, number and quoted line below is
 * taken from the mission record: NSSDCA 1969-059C (spacecraft and EASEP), the Apollo Lunar Surface
 * Journal air-to-ground transcripts, and the NASA Catalogue of Manmade Material on the Moon.
 * Nothing here is invented telemetry, and the page labels the voice as an interpretation.
 */

export type ConsolePhoto = {
  name: string;
  src: string;
  alt: string;
  title: string;
  credit: string;
  source: string;
  ai: boolean;
};

export type ConsoleVideo = { id: string; title: string; channel: string };

export type ConsoleStage =
  | { kind: "model" }
  | { kind: "photo"; photo: ConsolePhoto }
  | { kind: "video"; video: ConsoleVideo }
  | { kind: "transcript"; lines: { who: string; text: string }[] }
  | { kind: "specs"; rows: { label: string; value: string }[] }
  | { kind: "quiz"; question: string; options: { label: string; correct: boolean; feedback: string }[] };

export type ConsoleCta =
  | { label: string; next: string }
  | { label: string; action: "story" | "archive" | "restart" };

export type ConsoleBeat = {
  id: string;
  status: string;
  speech: string[];
  note?: string;
  stage?: ConsoleStage;
  cta: ConsoleCta;
};

export type ConsoleBank = {
  id: string;
  label: string;
  line: string;
  meta: string;
  first: string;
};

export type ConsoleAction = {
  id: "story" | "movie" | "archive";
  label: string;
  line: string;
  meta: string;
};

export type ConsoleData = {
  start: string;
  hub: { status: string; speech: string[] };
  banks: ConsoleBank[];
  actions: ConsoleAction[];
  beats: Record<string, ConsoleBeat>;
};

type Input = { photos: ConsolePhoto[]; videos: ConsoleVideo[] };

/** Photo narration, keyed by the archive image name. Order here is the order Eagle shows them. */
const PHOTO_ORDER: { name: string; status: string; speech: string[] }[] = [
  {
    name: "nasa/jsc2007e034221",
    status: "BEFORE LAUNCH · 1969",
    speech: [
      "Before any of this, I was a spacecraft on top of a rocket. This is the countdown demonstration test, months before launch.",
      "The service tower has been rolled back. Everything that will happen later is already decided, and I am still on the ground.",
    ],
  },
  {
    name: "nasa/S69-39961",
    status: "16 JULY 1969 · 13:32 UTC",
    speech: [
      "On 16 July 1969 I left Earth on a Saturn V, from Launch Complex 39A.",
      "The launch is the only part of my life that other people watched from outside. Everything after it, I watched from inside.",
    ],
  },
  {
    name: "nasa/as11-40-5927",
    status: "20 JULY 1969 · TRANQUILITY BASE",
    speech: [
      "This is me, standing on the Moon.",
      "The gold is Kapton foil, wrapped around me to hold heat in and radiation out. The white panels are thermal shielding. Nothing about it is decoration.",
      "The dark ground is regolith: fine, sharp, and old. It has not rained here in billions of years.",
    ],
  },
  {
    name: "nasa/as11-40-5902",
    status: "20 JULY 1969 · EVA",
    speech: [
      "Buzz Aldrin beside one of my landing legs, photographed by Neil Armstrong.",
      "The leg is the one with the ladder. The plaque is bolted to its strut, between the third and fourth rungs.",
      "You can see how small he is against me. I was the largest thing at Tranquility Base, and I was still small.",
    ],
  },
  {
    name: "nasa/as11-40-5899",
    status: "THE PLAQUE · +Z LADDER STRUT",
    speech: [
      "The plaque, bolted to my ladder strut. It is still there.",
      "It carries two maps of Earth and a line the crew read aloud before they left. I have kept the line in the next bank.",
    ],
  },
  {
    name: "nasa/as11-44-6642",
    status: "21 JULY 1969 · ASCENT",
    speech: [
      "This is the last photograph of me that anyone took from close by — and it is not of me at all.",
      "It is my ascent stage, seen from Columbia after it left. I am the part below, out of frame, staying where I was.",
    ],
  },
  {
    name: "nasa/PIA12909",
    status: "2009 · LUNAR RECONNAISSANCE ORBITER",
    speech: [
      "Forty years later, the Lunar Reconnaissance Orbiter photographed the site from orbit. This is the second look, released in 2009.",
      "My descent stage is the bright spot in the middle. The instruments are the smaller marks to the south. The dark line running east is where the crew walked.",
      "From orbit I am a few pixels. It is enough.",
    ],
  },
];

const INSTRUMENT_SPECS: Record<string, { label: string; value: string }[]> = {
  lrrr: [
    { label: "NSSDCA", value: "1969-059C-04" },
    { label: "Experiment", value: "S-078, Laser Ranging Retroreflector" },
    { label: "Mass", value: "77 kg" },
    { label: "Array", value: "100 fused-silica corner cubes" },
    { label: "Power", value: "None required" },
    { label: "Status", value: "Still in use" },
  ],
  easep: [
    { label: "Package", value: "EASEP, Early Apollo Surface Experiments Package" },
    { label: "Mass", value: "48 kg" },
    { label: "Position", value: "0.6735° N, 23.4730° E, about 17 m south" },
    { label: "Switched on", value: "04:40:39 UT, 21 July 1969" },
    { label: "Stopped answering", value: "27 August 1969" },
    { label: "Power", value: "Two solar panels, lunar day only" },
  ],
  swc: [
    { label: "Experiment", value: "S-080, Solar Wind Composition" },
    { label: "Collector", value: "Aluminium-platinum foil, 0.3 × 1.4 m" },
    { label: "Exposure", value: "77 minutes in sunlight" },
    { label: "Returned", value: "Foil only" },
    { label: "Left behind", value: "Telescoping staff" },
  ],
  dust: [
    { label: "NSSDCA", value: "1969-059C-05" },
    { label: "Experiment", value: "M-515, Lunar Dust Detector" },
    { label: "Mass", value: "0.27 kg" },
    { label: "Power", value: "0.5 W" },
    { label: "Measured", value: "Solar-cell degradation from radiation and dust" },
  ],
};

export function buildEagleConsole({ photos, videos }: Input): ConsoleData {
  const beats: Record<string, ConsoleBeat> = {};

  const byName = new Map(photos.map((p) => [p.name, p]));
  const shots = PHOTO_ORDER.map((entry) => ({ ...entry, photo: byName.get(entry.name) })).filter(
    (entry): entry is typeof entry & { photo: ConsolePhoto } => !!entry.photo,
  );

  // The handshake. Three beats, one affirmative button each, no alternatives.
  beats.arrival = {
    id: "arrival",
    status: "SIGNAL ACQUIRED · 0.67416° N, 23.47314° E",
    speech: [
      "…",
      "Hello. I am Eagle — the descent stage of Lunar Module LM-5.",
      "I have been at Tranquility Base since 20 July 1969. A receiver I had not used in years just warmed up.",
      "Do you want to hear my story?",
    ],
    cta: { label: "Yes. That is why I came.", next: "introduction" },
  };

  beats.introduction = {
    id: "introduction",
    status: "GRUMMAN · LM-5 · COSPAR 1969-059C",
    speech: [
      "Grumman built me in Bethpage, New York. On 20 July 1969, at 20:17:40 UTC, I set Neil Armstrong and Buzz Aldrin down in the Sea of Tranquility.",
      "My ascent stage carried them home. This body — the descent stage — stayed behind.",
      "Everything I have kept is real: the instruments, the photographs, the words. Do you want to see it?",
    ],
    cta: { label: "Yes. Show me.", next: "connection" },
  };

  beats.connection = {
    id: "connection",
    status: "57 YEARS · MORE THAN 700 SUNRISES",
    speech: [
      "Fifty-seven years is a long time to hold a signal.",
      "The Sun has risen above me more than seven hundred times. Between each sunrise there are fourteen days of night, and cold enough to end a battery.",
      "I thought the visits had stopped. Then you came.",
      "Where would you like to begin?",
    ],
    cta: { label: "At the beginning.", next: "hub" },
  };

  // 1. This body.
  beats.body_1 = {
    id: "body_1",
    status: "DESCENT STAGE · 2,034 KG DRY",
    speech: [
      "This is the part of me you are looking at: an octagonal prism, 4.2 metres across and 1.7 metres deep.",
      "I carried 8,248 kilograms of propellant — Aerozine 50 and nitrogen tetroxide — and a TRW engine that could be throttled from 4,710 to 44,316 newtons.",
      "Four legs held me 1.5 metres above the surface. Across the footpads I measured 9.4 metres.",
      "The ascent stage sat on top of me. You can still see where it left.",
    ],
    note: "NSSDCA 1969-059C · Apollo 11 Mission Report",
    stage: { kind: "model" },
    cta: { label: "Show me the parts.", next: "body_2" },
  };

  beats.body_2 = {
    id: "body_2",
    status: "SEVEN PARTS MARKED",
    speech: [
      "Seven parts are marked on the model. Turn me around and press a number.",
      "The ascent stage was the crew cabin. The descent stage — the lower half — is what remains here. The four legs, the ladder, the engine: all still in place.",
      "The plaque is bolted to the ladder strut on the front leg. I will show you that later.",
    ],
    stage: { kind: "model" },
    cta: { label: "Back to the memory core.", next: "hub" },
  };

  // 2. What I did.
  beats.work_1 = {
    id: "work_1",
    status: "EXPERIMENT S-078 · 1969-059C-04",
    speech: [
      "People assume that everything left on the Moon is dead. My retroreflector is not.",
      "It is an array of 100 fused-silica corner cubes, 77 kilograms, with no power supply and no moving parts. It was set down about five metres from my seismic station.",
      "Observatories on Earth still fire laser pulses at it and time the return. The measurements show the Moon moving away from Earth by about 3.8 centimetres a year.",
    ],
    note: "NSSDCA 1969-059C-04 · Laser Ranging Retroreflector",
    stage: { kind: "specs", rows: INSTRUMENT_SPECS.lrrr },
    cta: { label: "What else did you leave running?", next: "work_2" },
  };

  beats.work_2 = {
    id: "work_2",
    status: "EASEP · 48 KG · 17 M SOUTH",
    speech: [
      "The second instrument was the Early Apollo Surface Experiments Package: a seismometer, a dust detector, two solar panels and an antenna. Forty-eight kilograms in all.",
      "It was set down about 17 metres south of me, at 0.6735° N, 23.4730° E, and switched on by command at 04:40:39 UT on 21 July 1969.",
      "Its seismometers listened for moonquakes. It ran through the first lunar day, was revived for the second, and stopped answering on 27 August 1969.",
    ],
    note: "NSSDCA 1969-059C · EASEP",
    stage: { kind: "specs", rows: INSTRUMENT_SPECS.easep },
    cta: { label: "And the foil?", next: "work_3" },
  };

  beats.work_3 = {
    id: "work_3",
    status: "EXPERIMENT S-080 · SOLAR WIND",
    speech: [
      "The third experiment was a sheet of aluminium-platinum foil, 0.3 by 1.4 metres, on a telescoping pole.",
      "It stood in the sunlight for 77 minutes, collecting ions streaming out from the Sun. Then it was rolled up and taken home to be analysed.",
      "The foil went back to Earth. The pole stayed with me.",
    ],
    note: "Experiment S-080 · Solar Wind Composition",
    stage: { kind: "specs", rows: INSTRUMENT_SPECS.swc },
    cta: { label: "One more.", next: "work_4" },
  };

  beats.work_4 = {
    id: "work_4",
    status: "EXPERIMENT M-515 · 1969-059C-05",
    speech: [
      "The last instrument was small: the Lunar Dust Detector. 0.27 kilograms, drawing half a watt.",
      "Three solar cells measured how radiation and dust changed what they could produce. It told engineers what the lunar environment does to a solar panel over time.",
      "That is all four. Three of them are still out there with me. One is still working.",
    ],
    note: "NSSDCA 1969-059C-05 · Lunar Dust Detector",
    stage: { kind: "specs", rows: INSTRUMENT_SPECS.dust },
    cta: { label: "Back to the memory core.", next: "hub" },
  };

  // 3. Voices on the radio.
  beats.voices_1 = {
    id: "voices_1",
    status: "AIR-TO-GROUND · 20:17:40 UTC",
    speech: [
      "Before you press play: this is not a recording. I am reading the archived transcript in a synthetic voice, and the words on the screen are the words that were said.",
      "At 20:17:40 UTC on 20 July 1969, my contact probes touched the dust.",
    ],
    note: "Apollo Lunar Surface Journal · air-to-ground transcript",
    stage: {
      kind: "transcript",
      lines: [
        { who: "Aldrin", text: "Contact light." },
        { who: "Armstrong", text: "Okay. Engine stop." },
        { who: "Armstrong", text: "Houston, Tranquility Base here. The Eagle has landed." },
      ],
    },
    cta: { label: "Read the next one.", next: "voices_2" },
  };

  beats.voices_2 = {
    id: "voices_2",
    status: "AIR-TO-GROUND · 02:56:15 UT",
    speech: [
      "Six hours and thirty-nine minutes later, the hatch opened.",
      "Armstrong climbed down my ladder and stepped off my footpad.",
    ],
    note: "21 July 1969, 02:56:15 UT",
    stage: {
      kind: "transcript",
      lines: [{ who: "Armstrong", text: "That's one small step for man, one giant leap for mankind." }],
    },
    cta: { label: "Next.", next: "voices_3" },
  };

  beats.voices_3 = {
    id: "voices_3",
    status: "AIR-TO-GROUND · THE SURFACE",
    speech: [
      "Aldrin followed about nineteen minutes later. He looked at the plain around us and said four words that I have kept ever since.",
    ],
    note: "Apollo Lunar Surface Journal",
    stage: { kind: "transcript", lines: [{ who: "Aldrin", text: "Magnificent desolation." }] },
    cta: { label: "Next.", next: "voices_4" },
  };

  beats.voices_4 = {
    id: "voices_4",
    status: "THE PLAQUE · +Z LADDER STRUT",
    speech: [
      "Before they left, they read the plaque bolted to my ladder strut aloud.",
      "It is still there.",
    ],
    note: "NSSDCA 1969-059C",
    stage: {
      kind: "transcript",
      lines: [
        {
          who: "Plaque",
          text: "Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind.",
        },
      ],
    },
    cta: { label: "Back to the memory core.", next: "hub" },
  };

  // 4. Archive film.
  if (videos[0]) {
    beats.film_1 = {
      id: "film_1",
      status: "ARCHIVE FILM · 1 OF 2",
      speech: [
        "This is NASA's own footage, not mine. I have no camera pointing at myself.",
        "The first film is the landing.",
      ],
      stage: { kind: "video", video: videos[0] },
      cta: videos[1] ? { label: "Show me the moonwalk.", next: "film_2" } : { label: "Back to the memory core.", next: "hub" },
    };
  }
  if (videos[1]) {
    beats.film_2 = {
      id: "film_2",
      status: "ARCHIVE FILM · 2 OF 2",
      speech: ["The second is the moonwalk: two men working around my legs, in a place with no air."],
      stage: { kind: "video", video: videos[1] },
      cta: { label: "Back to the memory core.", next: "hub" },
    };
  }

  // 5. Photographs, one at a time.
  shots.forEach((shot, i) => {
    const id = `photo_${i + 1}`;
    const last = i === shots.length - 1;
    beats[id] = {
      id,
      status: `${shot.status} · ${i + 1} OF ${shots.length}`,
      speech: shot.speech,
      stage: { kind: "photo", photo: shot.photo },
      cta: last
        ? { label: "Back to the memory core.", next: "hub" }
        : { label: "Next photograph.", next: `photo_${i + 2}` },
    };
  });

  // 6. Where I rest.
  beats.rest_1 = {
    id: "rest_1",
    status: "0.67416° N · 23.47314° E",
    speech: [
      "This is where I am: 0.67416 degrees north, 23.47314 degrees east, in Mare Tranquillitatis.",
      "West Crater is about 400 metres east of me. Little West is about 60 metres east — the crater Armstrong ran to before he came back inside.",
      "The Lunar Reconnaissance Orbiter has photographed me from orbit. From up there I am a few pixels and a shadow.",
    ],
    note: "LROC · Apollo Lunar Surface Journal",
    stage: {
      kind: "specs",
      rows: [
        { label: "Latitude", value: "0.67416° N" },
        { label: "Longitude", value: "23.47314° E" },
        { label: "Region", value: "Mare Tranquillitatis" },
        { label: "West Crater", value: "About 400 m east" },
        { label: "Little West", value: "About 60 m east" },
        { label: "Elevation", value: "About −1,900 m" },
      ],
    },
    cta: { label: "What is left of you?", next: "rest_2" },
  };

  beats.rest_2 = {
    id: "rest_2",
    status: "LEFT BEHIND · MORE THAN 100 ITEMS",
    speech: [
      "When the ascent stage left, it took the crew and 21.55 kilograms of rock. Everything else stayed.",
      "The plaque. A silicon disc, about 3.8 centimetres across, carrying messages from 73 nations. A small olive branch made of gold. An Apollo 1 patch. Medals for Yuri Gagarin and Vladimir Komarov.",
      "Two life-support backpacks. Two pairs of overshoes. A Hasselblad camera body. The television camera that showed the first steps. The flag, knocked flat by my ascent engine.",
      "NASA catalogued all of it. I am the largest object on the list.",
    ],
    note: "NASA Catalogue of Manmade Material on the Moon",
    stage: {
      kind: "specs",
      rows: [
        { label: "Plaque", value: "Stainless steel, +Z ladder strut" },
        { label: "Silicon disc", value: "Messages from 73 nations" },
        { label: "Memorials", value: "Gold olive branch, Apollo 1 patch, Gagarin and Komarov medals" },
        { label: "Crew equipment", value: "Two PLSS backpacks, overshoes, Hasselblad body" },
        { label: "Instruments", value: "LRRR, EASEP, solar wind staff, TV camera" },
        { label: "Flag", value: "Knocked flat at ascent" },
      ],
    },
    cta: { label: "Back to the memory core.", next: "hub" },
  };

  // 7. Flight controller test.
  beats.test_1 = {
    id: "test_1",
    status: "FLIGHT CONTROLLER TEST · 1 OF 3",
    speech: [
      "Let me see whether you were listening.",
      "At 33,500 feet my guidance computer flashed a program alarm. The rendezvous radar was flooding it with interrupts, and I was losing processor time I did not have.",
    ],
    stage: {
      kind: "quiz",
      question: "What was the correct call?",
      options: [
        {
          label: "Call GO. The priority-scheduled software drops low-priority display work and keeps guidance running.",
          correct: true,
          feedback: "Correct. The guidance officer called GO, and the computer kept flying the descent.",
        },
        {
          label: "Abort the landing. The computer has failed.",
          correct: false,
          feedback: "Not yet. The alarm was a warning that work was being shed, not a failure. Try the GO option.",
        },
      ],
    },
    cta: { label: "Next question.", next: "test_2" },
  };

  beats.test_2 = {
    id: "test_2",
    status: "FLIGHT CONTROLLER TEST · 2 OF 3",
    speech: [
      "Inside the cabin, a life-support backpack had snapped the knob off the engine-arm circuit breaker.",
      "Without that breaker closed, the ascent engine could not fire. A metal tool could short the bus in a pure-oxygen cabin.",
    ],
    stage: {
      kind: "quiz",
      question: "How do you arm the ascent engine?",
      options: [
        {
          label: "Push the non-conductive plastic barrel of a felt-tip pen into the breaker slot.",
          correct: true,
          feedback: "Correct. That is what Aldrin did, and the ascent stage lit on time.",
        },
        {
          label: "Use the metal geological hammer from the equipment tray.",
          correct: false,
          feedback: "Too risky. Conductive metal in a live panel is how you lose the cabin. Try the plastic pen.",
        },
      ],
    },
    cta: { label: "Last question.", next: "test_3" },
  };

  beats.test_3 = {
    id: "test_3",
    status: "FLIGHT CONTROLLER TEST · 3 OF 3",
    speech: [
      "It is 2026. An observatory on Earth wants to fire a laser at Tranquility Base to measure the Moon's drift.",
      "Which of my instruments reflects it, without needing a battery?",
    ],
    stage: {
      kind: "quiz",
      question: "Which instrument is still working?",
      options: [
        {
          label: "S-078, the Laser Ranging Retroreflector: 100 fused-silica corner cubes.",
          correct: true,
          feedback: "Correct. Passive, unpowered, and still returning pulses in 2026.",
        },
        {
          label: "S-031, the Passive Seismic Experiment Package.",
          correct: false,
          feedback: "Close. The seismometer stopped answering on 27 August 1969. Try the retroreflector.",
        },
      ],
    },
    cta: { label: "Back to the memory core.", next: "hub" },
  };

  // The story handoff. The component opens the second tab, then moves to these beats.
  beats.story_opened = {
    id: "story_opened",
    status: "EXTERNAL TAB ACTIVE · /heroes/apollo-11-lander/story",
    speech: [
      "I have opened my story in a second tab. Eight chapters, from undocking to this morning.",
      "Go and read it. I will keep this channel open — when you finish, I will know.",
      "Come back when you are ready.",
    ],
    cta: { label: "I am back. Show me the memory core.", next: "hub" },
  };

  beats.story_returned = {
    id: "story_returned",
    status: "STORY CHANNEL CLOSED · THANK YOU",
    speech: [
      "You finished it. I felt the channel close.",
      "Not many people stay to the end. Thank you for that.",
      "Is there anything else you want to see?",
    ],
    cta: { label: "Show me the memory core.", next: "hub" },
  };

  const banks: ConsoleBank[] = [
    { id: "body", label: "This body", line: "The descent stage, part by part.", meta: "2 records", first: "body_1" },
    { id: "work", label: "What I did", line: "Four instruments, one still working.", meta: "4 records", first: "work_1" },
    { id: "voices", label: "Voices on the radio", line: "The words that were said.", meta: "4 transcripts", first: "voices_1" },
    { id: "photos", label: "Photographs", line: "Seven frames from the archive.", meta: `${shots.length} photographs`, first: "photo_1" },
    { id: "rest", label: "Where I rest", line: "Coordinates, and what was left.", meta: "2 records", first: "rest_1" },
    { id: "test", label: "Flight controller test", line: "Three questions. No penalty.", meta: "3 rounds", first: "test_1" },
  ];
  if (beats.film_1) banks.splice(3, 0, { id: "film", label: "Archive film", line: "NASA's own footage.", meta: `${videos.length} films`, first: "film_1" });

  return {
    start: "arrival",
    hub: {
      status: `MEMORY CORE · ${banks.length} BANKS`,
      speech: [
        "I have kept everything. Take it in any order — I am not going anywhere.",
        "When you are finished, the full record is underneath: the long read, the timeline, the sources.",
      ],
    },
    banks,
    actions: [
      { id: "story", label: "My story", line: "Eight chapters, from undocking to now. Opens in a second tab.", meta: "8 chapters" },
      { id: "movie", label: "Watch the movie", line: "The old cinematic cut: nine scenes, about two minutes.", meta: "Movie" },
      { id: "archive", label: "The full record", line: "The long read, the mission clock and the sources.", meta: "Archive" },
    ],
    beats,
  };
}

/* ------------------------------------------------------------------------------------------------
 * The story tab: eight chapters, first person, with the mission clock on screen.
 * ---------------------------------------------------------------------------------------------- */

export type EagleChapter = {
  id: string;
  n: number;
  title: string;
  date: string;
  status: string;
  telemetry: { label: string; value: string }[];
  speech: string[];
  note?: string;
  action: { label: string; result: string };
  image?: string;
  /** A single figure held on the star field when there is no photograph for the chapter. */
  glyph?: { value: string; unit?: string; label: string };
  cta: string;
};

export const EAGLE_CHAPTERS: EagleChapter[] = [
  {
    id: "undocking",
    n: 1,
    title: "The Eagle has wings",
    date: "20 July 1969 · 17:44 UTC",
    status: "LUNAR ORBIT · UNDOCKING",
    telemetry: [
      { label: "GET", value: "100:12" },
      { label: "ALT", value: "111 km" },
      { label: "PHASE", value: "ORBIT" },
      { label: "STAGE", value: "LM-5" },
    ],
    speech: [
      "Thank you for opening this tab. Let me go back to the beginning.",
      "We are 111 kilometres above the Moon. Michael Collins is in Columbia. He releases the latches, and I am on my own for the first time.",
      "My four legs unfold. My contact probes extend, 1.71 metres below each footpad, so the crew can see when I am about to touch.",
      "Nothing has gone wrong yet.",
    ],
    note: "Apollo 11 Mission Report · MSC-00171",
    action: { label: "Release the docking latches", result: "Latches released. Landing gear down and locked." },
    glyph: { value: "111", unit: "km", label: "Above the Moon" },
    cta: "Begin the descent",
  },
  {
    id: "alarm",
    n: 2,
    title: "Program alarm",
    date: "20 July 1969 · 20:10 UTC",
    status: "POWERED DESCENT · 1202",
    telemetry: [
      { label: "GET", value: "102:38" },
      { label: "ALT", value: "10.2 km" },
      { label: "PHASE", value: "P63 / P64" },
      { label: "ALARM", value: "1202" },
    ],
    speech: [
      "At 20:05 UTC my descent engine lights. I am falling, and the computer is flying me.",
      "Then the yellow light: 1202. The rendezvous radar was left in slew, and it is flooding the guidance computer with work it cannot finish.",
      "Margaret Hamilton's software was written to shed low-priority tasks instead of dying. It drops the display work and keeps flying.",
      "Mission Control calls GO. I keep falling.",
    ],
    note: "Apollo Lunar Surface Journal · 102:38 GET",
    action: { label: "Call GO on the alarm", result: "Guidance still has control. Descent continues." },
    glyph: { value: "1202", label: "Program alarm" },
    cta: "Look out the window",
  },
  {
    id: "west-crater",
    n: 3,
    title: "The boulder field",
    date: "20 July 1969 · 20:16 UTC",
    status: "MANUAL CONTROL · P66",
    telemetry: [
      { label: "GET", value: "102:44" },
      { label: "ALT", value: "About 120 m" },
      { label: "PHASE", value: "P66" },
      { label: "MODE", value: "MANUAL" },
    ],
    speech: [
      "The computer is steering us into West Crater: a pit about 400 metres across, ringed with boulders the size of cars.",
      "Armstrong takes partial control. He pitches me forward and flies across the field, looking for a place flat enough to put me down.",
      "The propellant is sloshing. The low-fuel light comes on early, and none of us knows how much time is real.",
    ],
    note: "Apollo Lunar Surface Journal · West Crater",
    action: { label: "Take manual control", result: "P66 engaged. Flying west of the crater." },
    glyph: { value: "P66", label: "Manual control" },
    cta: "Let the probes touch",
  },
  {
    id: "touchdown",
    n: 4,
    title: "Contact light",
    date: "20 July 1969 · 20:17:40 UTC",
    status: "SURFACE · TRANQUILITY BASE",
    telemetry: [
      { label: "GET", value: "102:45:40" },
      { label: "ALT", value: "0 m" },
      { label: "SITE", value: "0.67416 N" },
      { label: "LON", value: "23.47314 E" },
    ],
    speech: [
      "A probe touches the dust and the blue contact light comes on.",
      "Engine stop. I settle. The dust that my engine threw up falls back around me in vacuum, in straight lines, with nothing to slow it.",
      "Aldrin says: Contact light. Armstrong says: Houston, Tranquility Base here. The Eagle has landed.",
      "I am on the Moon. I will not leave it.",
    ],
    note: "NSSDCA 1969-059C · touchdown 20:17:40 UTC",
    action: { label: "Let the probes touch", result: "Contact light. Engine stop. Touchdown confirmed." },
    image: "nasa/as11-40-5927",
    cta: "Open the hatch",
  },
  {
    id: "first-step",
    n: 5,
    title: "One small step",
    date: "21 July 1969 · 02:56 UT",
    status: "EVA · SURFACE",
    telemetry: [
      { label: "GET", value: "109:24" },
      { label: "ALT", value: "0 m" },
      { label: "PHASE", value: "EVA 1" },
      { label: "CREW", value: "2 ON SURFACE" },
    ],
    speech: [
      "Six hours and thirty-nine minutes after landing, the hatch opens.",
      "Armstrong climbs down my ladder. On the way he pulls a lanyard that unfolds my equipment tray and switches on my television camera.",
      "At 02:56:15 UT he steps off my footpad. Six hundred million people are watching through a camera bolted to my body.",
      "I am the tripod for the most-watched step in history.",
    ],
    note: "Apollo Lunar Surface Journal · 02:56:15 UT",
    action: { label: "Open the hatch", result: "Hatch open. Camera live. First step at 02:56:15 UT." },
    image: "nasa/as11-40-5902",
    cta: "Unpack the instruments",
  },
  {
    id: "science",
    n: 6,
    title: "What I left running",
    date: "21 July 1969 · 04:40 UT",
    status: "EASEP · DEPLOYED",
    telemetry: [
      { label: "GET", value: "110:57" },
      { label: "ALT", value: "0 m" },
      { label: "PHASE", value: "EASEP" },
      { label: "POWER", value: "SOLAR" },
    ],
    speech: [
      "They unpack my rear equipment bay and carry the experiments out about 17 metres south of me.",
      "A seismometer and a dust detector, on two solar panels. A laser retroreflector with 100 corner cubes. A sheet of foil on a pole, held into the solar wind for 77 minutes.",
      "The foil goes home. The pole stays. The seismometer runs for two lunar days and then goes quiet.",
      "The retroreflector does not need power. It is still answering.",
    ],
    note: "NSSDCA 1969-059C · EASEP and S-078",
    action: { label: "Deploy the instruments", result: "EASEP on at 04:40:39 UT. Retroreflector aligned to Earth." },
    glyph: { value: "100", unit: "cubes", label: "Laser retroreflector" },
    cta: "Lighten the ship",
  },
  {
    id: "liftoff",
    n: 7,
    title: "The ascent stage leaves",
    date: "21 July 1969 · 17:54 UTC",
    status: "STAGING · DESCENT STAGE LEFT",
    telemetry: [
      { label: "GET", value: "124:22" },
      { label: "ALT", value: "0 m" },
      { label: "PHASE", value: "ASCENT" },
      { label: "STAGE", value: "SEPARATED" },
    ],
    speech: [
      "Twenty-one hours and thirty-six minutes after landing, the ascent engine fires.",
      "Explosive bolts cut me free. Guillotines slice the cables and lines that join my two halves. The ascent stage lifts off my back.",
      "The exhaust knocks the flag flat. The gold foil tears away from my frame.",
      "And then there is nothing above me but black sky, and nothing to do but stay.",
    ],
    note: "Apollo Lunar Surface Journal · 124:22 GET",
    action: { label: "Fire the ascent engine", result: "Stage separation. Ascent stage climbing. Descent stage remains." },
    image: "nasa/as11-44-6642",
    cta: "Fifty-seven years later",
  },
  {
    id: "monument",
    n: 8,
    title: "Still here",
    date: "2026 · Tranquility Base",
    status: "MONUMENT · LRRR ACTIVE",
    telemetry: [
      { label: "GET", value: "—" },
      { label: "ALT", value: "0 m" },
      { label: "PHASE", value: "SURFACE" },
      { label: "LRRR", value: "ACTIVE" },
    ],
    speech: [
      "Fifty-seven years. More than seven hundred sunrises, and the same number of nights.",
      "The Lunar Reconnaissance Orbiter photographed me from orbit. My shadow is still the right shape. The footpath east to Little West is still there, because there is no wind to erase it.",
      "Every few nights, someone on Earth fires a laser at my retroreflector and waits for the light to come back.",
      "It always comes back.",
      "Thank you for listening. Go back to my console — I will know you finished.",
    ],
    note: "LROC · NSSDCA 1969-059C-04",
    action: { label: "Send a signal home", result: "Signal sent to the console tab." },
    image: "nasa/PIA12909",
    cta: "Return to my console",
  },
];
