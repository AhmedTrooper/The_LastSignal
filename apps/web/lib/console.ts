import { buildEagleConsole as buildSharedConsole, type ConsoleData as SharedData, type ConsoleStage as SharedStage, type ConsoleBeat as SharedBeat } from "@thelastsignal/data";
import { ALSJ, EAGLE_AUDIO, EAGLE_FILMS, EAGLE_MEDIA, type EagleMedia } from "./eagle-media";
import { EAGLE_GALLERY, EAGLE_MISSIONS, type EagleMission } from "./eagle-missions";

export {
  EAGLE_CHAPTERS,
  type ConsoleAction,
  type ConsoleBank,
  type ConsoleCta,
  type ConsolePhoto,
  type ConsoleVideo,
  type EagleChapter,
} from "@thelastsignal/data";

export type ConsoleStage = SharedStage | { kind: "media"; media: EagleMedia } | { kind: "mission"; mission: EagleMission };
export type ConsoleBeat = Omit<SharedBeat, "stage"> & { stage?: ConsoleStage; title?: string };
export type ConsoleData = Omit<SharedData, "beats"> & { beats: Record<string, ConsoleBeat> };

/** Web presentation of the shared record. Historical data continues to come from @thelastsignal/data. */
export function buildEagleConsole(input: Parameters<typeof buildSharedConsole>[0]): ConsoleData {
  const shared = buildSharedConsole(input);
  const beats: Record<string, ConsoleBeat> = { ...shared.beats };
  const update = (id: string, patch: Partial<ConsoleBeat>) => { beats[id] = { ...beats[id], ...patch }; };

  update("arrival", {
    title: "Hi. I’m Eagle.", status: "A visitor at Tranquility Base",
    speech: ["You found me! I’m the Moon lander that carried Neil and Buzz.", "They went home. The part of me telling this story stayed on the Moon. I’m glad you stopped to say hello."],
    cta: { label: "Yes, of course. Introduce yourself.", next: "introduction" },
  });
  update("introduction", {
    title: "I brought them here.",
    speech: ["I had two halves, with two very different jobs.", "My lower half landed us. My upper half carried the crew back to orbit. Helping them leave was the last big job of the part that stayed."],
    cta: { label: "Yes, I would. Let’s go.", next: "connection" },
  });
  update("connection", {
    title: "I kept a few memories.", status: "Born on Earth. Resting among the stars.",
    speech: ["A ladder. A camera. Voices from Earth. There’s more to my story than a famous footprint.", "Come closer. Pick a memory, and I’ll show you why these little things mattered."],
    cta: { label: "Yes. Show me your memories.", next: "hub" },
  });
  update("body_1", { title: "What made me Eagle?", speech: ["Tap a part. Each one had a job, from slowing the landing to helping the crew get home.", "The drawing is my storybook self. You can also turn the real 3D model around."], cta: { label: "Show me a little more.", next: "body_2" } });
  update("body_2", { title: "Small parts. Big jobs.", speech: ["My ladder helped people reach the surface. My antenna helped their voices reach Earth.", "Which part would you like to explore?"], cta: { label: "Let’s explore another memory.", next: "hub" } });

  EAGLE_MISSIONS.forEach((mission, i) => update(`work_${i + 1}`, {
    title: mission.name,
    speech: ["Here’s one of the experiments I carried. Look closely at what it could do.", mission.discovery],
    stage: { kind: "mission", mission },
    cta: { label: `Continue after experiment ${i + 1}`, next: i < EAGLE_MISSIONS.length - 1 ? `work_${i + 2}` : "hub" },
  }));
  const audioSpeech = [
    ["Listen to the moment.", "This is what the landing sounded like. The alarms, the voices from Houston, and then the words that named this place Tranquility Base.", "Press Start when you’re ready. These are the real mission recordings. I’ll wait while you listen."],
    ["The step beside my footpad.", "Neil climbed down my ladder. The camera deployed from my equipment bay let people on Earth watch the first steps.", "Listen to the voices around that moment. It’s a long archive clip, so you can use the timeline to find your own way through."],
    ["Earth was listening.", "Buzz tried moving around in lunar gravity, and a call from the White House reached the crew across the distance.", "There was more to that moonwalk than a single famous sentence. Would you like to hear it for yourself?"],
    ["The goodbye in the recording.", "My ascent stage lifted the crew back toward Columbia. The descent stage became the launch pad they left behind.", "This recording combines the onboard voices and the Flight Director loop. Stay as long as you like. We can choose another memory when you’re ready."],
  ];
  EAGLE_AUDIO.forEach((audio, i) => {
    const media = EAGLE_MEDIA[["landing-audio", "first-step-audio", "surface-audio", "ascent-audio"][i]];
    update(`voices_${i + 1}`, { title: audioSpeech[i][0], speech: audioSpeech[i].slice(1), stage: { kind: "media", media }, note: audio.credit, cta: { label: i < 3 ? `Yes. Let me hear audio ${i + 2}.` : "Yes. Thank you for sharing that.", next: i < 3 ? `voices_${i + 2}` : "hub" } });
  });
  EAGLE_FILMS.forEach((media, i) => {
    beats[`film_${i}`] = { id: `film_${i}`, title: ["Watch us part in orbit.", "Look through my window.", "Watch the ground fall away."][i], status: media.phase!, speech: [media.description, "These are original mission frames. Watch at your own pace; the next memory will wait for you."], stage: { kind: "media", media }, order: i + 1, cta: { label: `Continue after film ${i + 1}`, next: i < EAGLE_FILMS.length - 1 ? `film_${i + 1}` : "hub" } };
  });
  update("rest_1", { title: "Here. In the Sea of Tranquility.", cta: { label: "Yes. Tell me what stayed with you.", next: "rest_2" } });
  update("rest_2", { title: "They left more than a machine.", speech: ["A plaque on my ladder. A disc with messages from around the world. Scientific instruments, camera equipment, and the things the crew could leave behind to lighten their return.", "Some objects were practical. Others were a way of saying who had come here, and why. Would you like to explore another memory?"], cta: { label: "Yes. There’s more I want to know.", next: "hub" } });
  update("story_opened", { title: "I’ll be right here.", status: "Story opened in another tab", speech: ["I’ve opened my story in a new tab for you. Eight memories, from lunar orbit to the part of me that stayed behind.", "Take your time. When you finish, come back here—we’ll still have more to talk about."], cta: { label: "I’m back. Show me your memories.", next: "hub" } });
  update("story_returned", { title: "You stayed to the end.", status: "Story complete · welcome back", speech: ["You saw why one half of me stayed, and what the equipment helped us learn. Thank you for listening.", "Want to try a few decisions with me? No timer. We’ll work them out together."], cta: { label: "Let’s try it together.", next: "test_1" } });
  beats.movie_opened = {
    id: "movie_opened", title: "See the journey through my eyes.", status: "Cinematic story opened in another tab",
    speech: ["My cinematic story is open in a new tab. The photographs carry you through the journey, from the machine on Earth to the part that stayed on the Moon.", "When the film ends, come back. There are little details we can explore together that a film can only glimpse."],
    cta: { label: "I’m back. Let’s look a little closer.", next: "hub" },
  };
  update("test_1", { title: "What would you call?", speech: ["Imagine you’re in Mission Control. During descent, my computer reports an overload—but its priority system is still keeping guidance running.", "Would you continue? Think it through. There’s no timer, and we can learn from either answer."] });
  update("test_2", { title: "A small tool. A way home.", speech: ["Buzz found a broken engine-arm circuit-breaker knob on his Panel 16.", "Which everyday object did he report using to push the breaker in?"], stage: { kind: "quiz", question: "What did Aldrin use to push the breaker in?", options: [{ label: "A felt-tip pen.", correct: true, feedback: "Aldrin described using a felt-tip pen. Houston later confirmed the circuit looked fine." }, { label: "The geological hammer.", correct: false, feedback: "That tool was for the lunar samples. The recorded solution was something used for writing." }] } });
  update("test_3", { title: "Which part still answers?", speech: ["An observatory on Earth sends a laser toward Tranquility Base.", "Which experiment can return that light without a battery?"] });
  // A technical challenge should explain choices, not claim a dangerous hypothetical is certain.
  for (const id of ["test_1", "test_2", "test_3"]) {
    const stage = beats[id].stage;
    if (stage?.kind === "quiz") update(id, { stage: { ...stage, options: stage.options.map(o => ({ ...o, feedback: o.feedback.replace("and still returning pulses in 2026", "and designed to return laser pulses") })) } });
  }
  for (const beat of Object.values(beats)) {
    if (beat.note?.includes("NSSDCA")) beat.note = "Mission record · NSSDCA / Apollo Lunar Surface Journal";
  }
  const replies: Record<string, string> = {
    arrival: "I came to meet you. Who are you, Eagle?",
    introduction: "I’d like to know the part that stayed.",
    connection: "I’m here. Share a memory with me.",
    body_1: "Let me see how you were put together.",
    body_2: "Every part mattered. What else have you kept?",
    work_1: "You’re still helping us. What else did you carry?",
    work_2: "A sheet of foil? I’m listening.",
    work_3: "And the smallest experiment?",
    work_4: "I’ll think of you differently now.",
    voices_1: "Let me hear the first steps.",
    voices_2: "What did they say to the people back home?",
    voices_3: "Stay with me. Let’s hear the goodbye.",
    voices_4: "That was something. Thank you, Eagle.",
    film_0: "Now show me the descent through your window.",
    film_1: "Let me see how they left the surface.",
    film_2: "I’m ready to come back to your memories.",
    rest_1: "What did they leave there with you?",
    rest_2: "I see why these things matter.",
    test_1: "I’m ready for the next decision.",
    test_2: "One more. I’m with you.",
    test_3: "I won’t forget what you taught me.",
    story_opened: "I’m back, Eagle. Let’s keep talking.",
    story_returned: "Let me try. I know you a little better now.",
  };
  const photoReplies = ["Show me the message on your ladder.", "Let me look a little closer.", "There’s a story in that footprint.", "Show me the instruments outside.", "And the mirror that answers Earth?"];
  for (const beat of Object.values(beats)) {
    if (replies[beat.id]) beat.cta = { ...beat.cta, label: replies[beat.id] };
  }
  for (const id of Object.keys(beats)) if (id.startsWith("photo_")) delete beats[id];
  EAGLE_GALLERY.forEach((picture, i) => {
    beats[`photo_${i + 1}`] = { id: `photo_${i + 1}`, title: ["Look in Buzz’s visor.", "A message on my ladder.", "A footprint, studied closely.", "Unpacking a science station.", "Listening from the surface.", "A small array. A long experiment."][i], status: `Archive photograph ${i + 1}`, speech: [picture.alt, "An archive photograph is more than a view. The source record lets you inspect the frame for yourself."], stage: { kind: "photo", photo: picture }, order: i + 1, cta: { label: i < 5 ? photoReplies[i] : "Thank you for letting me see these.", next: i < 5 ? `photo_${i + 2}` : "hub" } };
  });
  const banks = shared.banks.map(bank => bank.id === "film" ? { ...bank, first: "film_0", label: "My films", line: "Undocking, descent, and the return to orbit.", meta: "3 films" } : bank.id === "voices" ? { ...bank, label: "Voices I carried", line: "Real recordings from the mission.", meta: "4 recordings" } : bank.id === "photos" ? { ...bank, line: "Six frames. Six ways to see the hardware.", meta: "6 photographs" } : bank.id === "work" ? { ...bank, label: "My scientific missions", line: "What the equipment helped us learn." } : bank.id === "test" ? { ...bank, label: "Your turn at Mission Control", line: "Think through the decisions with me." } : bank).filter(bank => !!beats[bank.first]);
  if (!banks.some(bank => bank.id === "film")) banks.splice(3, 0, { id: "film", first: "film_0", label: "My films", line: "Undocking, descent, and the return to orbit.", meta: "3 films" });
  if (!banks.some(bank => bank.id === "photos")) banks.push({ id: "photos", first: "photo_1", label: "Photographs", line: "Six frames. Six ways to see the hardware.", meta: "6 photographs" });
  return {
    ...shared, beats,
    hub: { status: "Eagle’s memory bank", speech: ["Where shall we go first? Pick something you’re curious about. I’ll be right here with you."] },
    banks,
    actions: shared.actions.map(action => action.id === "story" ? { ...action, label: "Open my short story", line: "Eight memories. A new tab. I’ll wait here." } : action),
  };
}

export const EAGLE_RECORD_URL = `${ALSJ}a11.html`;
