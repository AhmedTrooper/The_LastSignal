# RoverVilla: Turning Off-World Machines into Unforgettable Heroes

**[Download the concise five-page project report (PDF)](../assets/RoverVilla-2.pdf)**

> **2026 NASA Space Apps Challenge — Project Technical and Narrative Report**
>
> **Challenge:** *Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars*
>
> **Live platform:** [rovervilla.ahmedtrooper.me](https://rovervilla.ahmedtrooper.me/)
> **Audience:** School-age space enthusiasts, especially ages 10–16, and casual learners

RoverVilla is an independent educational project. It is not operated by, affiliated with, or endorsed by NASA or any other space agency. Archival media is credited to its source. AI-assisted illustrations and imagined machine voices are identified separately from the historical record.

---

## Executive summary

NASA's lunar and Martian missions left extraordinary machines far from Earth: impactors, landers, rovers, orbiters, scientific instruments, descent stages, and one pioneering helicopter. Their missions produced knowledge that changed planetary science, but their stories are often buried in technical catalogs, mission reports, image archives, and long historical articles.

**RoverVilla turns those records into approachable hero stories without replacing the facts underneath.** Each explorer's engineering, mission events, discoveries, difficulties, and final known state become a sequence of short, source-linked chapters. The same chapter record can be experienced as a scroll story, comic, or storybook. A reader can enjoy the narrative first, then open **More to this moment** to inspect the hardware explanation, scientific significance, uncertainties, and original sources.

The web experience combines:

- fifteen source-backed machine story editions;
- scroll, comic, and storybook reading formats;
- chapter-level factual notes and downloadable evidence records;
- an interactive Mars and Moon map using mission coordinates;
- a cross-mission timeline and credited photo album;
- interactive 3D hardware exploration;
- mission-inspired learning activities and games;
- labelled narration, archival media, and AI-assisted illustrations; and
- accessibility features including keyboard controls, reduced-motion handling, captions, transcripts, and text alternatives.

RoverVilla is not a single short film. It is a reusable story-and-evidence environment in which young people can meet a machine, follow its complete journey, try the engineering idea with their own hands, and continue into the real mission record.

![RoverVilla story room with scroll, comic, and storybook entries](../assets/Screenshot%20From%202026-11-12%2018-47-05.png)

---

## 1. Why we built RoverVilla

### 1.1 The challenge behind the challenge

Space agencies preserve detailed histories of past missions, but a curious young reader often encounters one of two extremes:

1. a dense technical archive designed for specialists; or
2. a very short summary that loses the engineering decisions and scientific chain of evidence.

The NASA Space Apps challenge asks teams to tell the stories of discarded equipment on the Moon and Mars. We interpreted that mandate as an educational design problem: **how can a learner remember the machine, understand what its hardware enabled, and still verify every important claim?**

### 1.2 Why we went beyond a single 240-second video

A short video can create an emotional introduction, but it cannot hold the full lives of fifteen explorers or let different learners move at their own pace. It also cannot give a judge, teacher, or curious student immediate access to the evidence behind every scene.

RoverVilla therefore treats the required video as a doorway into a larger experience. The platform addresses four barriers:

- **Archive accessibility:** mission facts are distributed across NSSDCA catalogs, NASA Science pages, JPL releases, mission journals, image archives, LROC and HiRISE instrument-team pages, and technical reports.
- **Resistance to textbook-style reading:** long walls of technical prose can make an extraordinary mission feel like compulsory study.
- **Different learning preferences:** some readers prefer pictures, some prefer prose, some prefer audio, and others understand by manipulating a control.
- **Trust:** emotional storytelling must never disguise imagined dialogue as telemetry or silently turn an uncertain interpretation into a fact.

### 1.3 The anti-textbook approach

RoverVilla uses episodic pacing, illustrated scenes, tactile controls, real photographs, short explanations, and game mechanics. Facts become memorable because they drive the action:

- a redundant steering system keeps a lunar journey possible;
- a broken rover wheel exposes scientifically important soil;
- a radio carrier is distinguished from usable data;
- a computer alarm becomes a lesson about task priority;
- a passive reflector becomes a conversation made of light; and
- a seismometer turns ground motion into knowledge about a planet's interior.

The result is **stealth learning**: learners encounter engineering and science as part of a story rather than as detached vocabulary.

---

## 2. Core philosophy: remember the machines as heroes

RoverVilla does not treat retired hardware as meaningless debris. These machines carried human questions into environments people could not safely reach. Calling them heroes is a narrative frame, not a license to invent history.

Our approach follows four rules:

1. **Humanize the stakes, not the telemetry.** First-person machine voices are clearly labelled as imagined retellings. Dates, measurements, coordinates, hardware descriptions, and mission outcomes remain tied to sources.
2. **Show a complete arc.** Stories connect purpose, construction, travel, operation, discoveries, problems, final known events, and lasting evidence.
3. **Connect hardware to knowledge.** Every chapter asks what a component did, what that enabled, and what people learned because it worked.
4. **Preserve uncertainty.** Unknown coordinates, exact failure moments, current electronic health, unrecorded farewells, and conflicting published values remain unknown or attributed—not filled with dramatic guesses.

---

## 3. What exists now: routes and content continuity

The experience evolved while retaining its major content. Some labels and URLs changed as the web application moved from profile-first navigation to story-first navigation.

### 3.1 Current route map

| Experience | Current route | Content status |
|---|---|---|
| Home journey | `/` | Implemented; introduces stories, reels, map, exploration, and learning paths. |
| Story room | `/story` | Implemented; contains all fifteen machine editions. |
| Scroll story | `/heroes/[slug]/story` | Implemented; current primary destination for machine cards. |
| Chapter shelf | `/heroes/[slug]/book` | Implemented; opens a machine's true-event chapter collection. |
| Comic edition | `/heroes/[slug]/book?read=1&format=comic&chapter=[chapter-id]` | Implemented; generated from the shared chapter beats. |
| Storybook edition | `/heroes/[slug]/book?read=1&format=book&chapter=[chapter-id]` | Implemented; generated from the same chapter beats. |
| Original illustrated collection | `/story/book` | Retained as a separate collection and legacy reading experience. |
| Factual bridge | **More to this moment** inside each scroll story | Implemented; this is the current form of the report's earlier **Real Story** concept. |
| Profile/archive | `/heroes/[slug]` | Retained and directly accessible, but no longer the primary card destination. |
| Explorer archive directory | `/heroes` | Available through **More → Explorer archive**; its cards open detailed machine profiles. |
| Eagle hardware film | `/heroes/apollo-11-lander/movie` | Retained for Eagle's source-labelled photographic and film experience. |
| Explorer directory | `/our-hero` | Implemented; lists all explorers and routes readers into their stories. |
| Space map | `/where-they-rest` | Implemented with Mars/Moon switching, category filters, coordinates, and machine details. |
| Timeline | `/timeline` | Implemented across the fifteen-machine catalog. |
| Photo album | `/gallery` | Implemented with credits, descriptions, and original source links. |
| Mission playground | `/games` | Implemented with multiple mission-specific learning activities. |
| Touchdown | `/games/landing` | Accessible directly through **More → Play Touchdown**, alongside the mission playground link. |
| Messages | `/tributes` | Implemented as a Firebase-backed public tribute wall when configured. |
| Machine-readable evidence | `/api/stories/[slug]/evidence` | Implemented for reviewed editions that publish an evidence package. |
| Narration manifest | `/api/stories/[slug]/narration` | Implemented for stable narration IDs, revisions, fingerprints, and clip status. |

### 3.2 What changed without losing the idea

- The report's three modes—**Story, Comic, and Book**—still exist. The current interface calls the narrative mode a **scroll story**, while Comic and Storybook share the machine book route.
- The proposed **Real Story** button became **More to this moment**. It reveals the full explanation, discovery, hardware context, sources, and links to the other reading editions.
- **Our heroes** cards open the story first. **More → Explorer archive** opens a separate directory whose cards lead to detailed profiles, galleries, signatures, 3D models, media, and additional interactions.
- The current story architecture is based on one shared machine book per explorer. This reduces factual drift between formats.
- Earlier cinematic story data and its renderer remain in the codebase. The current router prefers the newer thought-based readers for the fifteen published books, so the old cinematic presentation is preserved in source but is generally not the public story view.

**The content concept was not discarded; it was reorganized around a clearer story-first path.** Where an older presentation is no longer publicly routed, the report identifies that honestly rather than claiming it is currently visible.

---

## 4. The fifteen published machine editions

RoverVilla currently registers fifteen machine books: six lunar editions and nine Martian editions.

| World | Explorer | Primary story route | Chapters |
|---|---|---|---:|
| Moon | Ranger 7 | `/heroes/ranger-7/story` | 5 |
| Moon | Surveyor 1 | `/heroes/surveyor-1/story` | 5 |
| Moon | Apollo 11 Lunar Module Eagle | `/heroes/apollo-11-lander/story` | 10 |
| Moon | Apollo 15 Lunar Roving Vehicle | `/heroes/apollo-15-rover/story` | 8 |
| Moon | LCROSS | `/heroes/lcross/story` | 5 |
| Moon | GRAIL — Ebb and Flow | `/heroes/grail/story` | 5 |
| Mars | Viking 1 | `/heroes/viking-1/story` | 5 |
| Mars | Viking 2 | `/heroes/viking-2/story` | 5 |
| Mars | Mars Pathfinder and Sojourner | `/heroes/pathfinder-sojourner/story` | 8 |
| Mars | Mars Polar Lander | `/heroes/mars-polar-lander/story` | 5 |
| Mars | Spirit | `/heroes/spirit/story` | 5 |
| Mars | Opportunity | `/heroes/opportunity/story` | 5 |
| Mars | Phoenix | `/heroes/phoenix/story` | 5 |
| Mars | InSight | `/heroes/insight/story` | 5 |
| Mars | Ingenuity | `/heroes/ingenuity/story` | 5 |

This roster reflects the implemented web catalog. Examples from earlier planning documents that are not in this fifteen-machine catalog are not presented here as published RoverVilla editions.

---

## 5. One verified record, three reading experiences

### 5.1 Shared chapter architecture

Each published edition is represented as a `MachineBook`. A chapter contains:

- a stable chapter ID;
- the historical event;
- the relevant hardware;
- a primary source and optional related sources;
- optional attributed telemetry or engineering readings;
- four short narrative beats;
- the scientific or engineering discovery; and
- a question that encourages investigation.

The same beats feed the scroll story, comic panels, prose storybook, and narration scripts. A correction to the shared chapter can therefore flow to every mode instead of leaving separate scripts to drift apart.

### 5.2 Scroll story

The scroll reader shows one thought at a time, with stable moment IDs, chapter progress, keyboard navigation, optional narration, chapter selection, and **More to this moment**.

![Eagle scroll story with thought cloud and labelled AI-assisted illustration](../assets/Screenshot%20From%202026-11-12%2018-47-26.png)

### 5.3 Comic

Comic mode presents the four chapter beats as panels. Captions and explanations originate from the same source-backed chapter object used by the other editions.

![Eagle comic mode](../assets/Screenshot%20From%202026-11-12%2018-47-56.png)

### 5.4 Storybook

Storybook mode converts the same four beats into readable prose while retaining chapter navigation, text-size controls, bookmarks, narration controls, hardware activities, and source context.

![Eagle storybook mode](../assets/Screenshot%20From%202026-11-12%2018-48-08.png)

### 5.5 Narration integrity

Narration entries use:

- a stable beat ID;
- a text revision;
- a fingerprint of the spoken text; and
- a clip status and measured duration when a matching recording exists.

If the text changes, an old recording is treated as stale rather than silently played over new words. Eagle currently has matched recorded clips in its manifest. Other editions can offer a labelled synthetic browser-voice preview while produced clips remain missing. An empty audio entry is never presented as historical machine speech.

---

## 6. The factual bridge: More to this moment

**More to this moment** is the implemented version of the report's original Real Story concept. It prevents the emotional layer from replacing the evidence layer.

For the active beat, readers can inspect:

- the full detail behind the short thought;
- the chapter's hardware role;
- the scientific takeaway;
- primary and related source links;
- attributed readings where available;
- archive media and its credit;
- a link to the same chapter in Comic or Storybook mode; and
- mission-specific activities that make the engineering idea tangible.

Evidence endpoints expose reviewed facts, sources, chapters, media, known limitations, and explicit `null` values for unresolved questions. This gives judges a machine-readable path beneath the story front end.

---

## 7. Authenticity and provenance

### 7.1 Primary source families

The implemented editions draw primarily from:

- NASA Space Science Data Coordinated Archive / NSSDCA spacecraft and experiment records;
- NASA Science mission pages and Photojournal records;
- NASA and JPL mission histories, releases, and engineering accounts;
- Apollo Lunar Surface Journal and Apollo Flight Journal records;
- Lunar Reconnaissance Orbiter Camera publications;
- HiRISE instrument-team observations;
- NASA Astromaterials 3D sample records; and
- source-linked NASA scientific visualizations and archival films.

### 7.2 Fact discipline

RoverVilla distinguishes among:

- an observed event;
- a published interpretation;
- a source-specific rounded value;
- a derived conversion;
- a teaching illustration;
- a simplified gameplay model; and
- an unknown value.

Examples of preserved limits include:

- Falcon's published landing position is not relabelled as the Apollo 15 rover's exact parking coordinate;
- a detected Pathfinder radio carrier is not described as recovered health data;
- conflicting NASA totals remain attributed to their individual sources;
- a design life is not treated as an automatic failure date;
- an orbital identification does not establish current electronic health; and
- no machine is given a fabricated final spoken farewell.

### 7.3 AI and archival media

AI-assisted imagery is labelled as illustration, not photography. Its geometry, pose, lighting, distances, diagrams, waveforms, and apparent readouts are interpretive. Archival photographs and films carry their original credits and source links. The project avoids official NASA logos and does not imply NASA endorsement.

---

## 8. Interactive planetary geography

The space map lets readers switch between Mars and the Moon, filter by machine category, select sites, and connect each explorer to a planetary location. Coordinates are taken from the catalog record used by the project, with approximation and reference-frame limits retained where relevant.

The globes use source-attributed planetary map textures and place HTML markers over a Three.js sphere. A marker identifies the catalog location being represented; it does not create precision that the original source did not supply.

![Interactive Mars map with mission pins](../assets/Screenshot%20From%202026-11-12%2018-51-08.png)

---

## 9. Timeline and photo archive

The timeline places all fifteen explorers on a common 1960–2030 axis, with Mars/Moon filters, mission spans, and selected comparison cards. It gives learners an immediate sense of sequence: which machines arrived first, which overlapped, and how mission duration changed across decades.

![Cross-mission timeline](../assets/Screenshot%20From%202026-11-12%2018-52-00.png)

The gallery groups source-labelled photographs by explorer. A viewer can open an image to read its description, credit, and original source. AI artwork is not silently mixed into the photographic archive.

![Source-labelled mission photo album](../assets/Screenshot%20From%202026-11-12%2018-52-33.png)

---

## 10. Mission playground and active learning

The game area turns mission concepts into small experiments while stating that these are learning tools—not Mission Control, recovered telemetry, or exact flight replays.

Implemented game routes include:

| Activity | Route | Learning focus |
|---|---|---|
| Touchdown | `/games/landing` | Fictional lander/rover pilgrimage across fifteen real mission sites; real gravity values, source-backed mission echoes, and clearly labelled fictional framing. |
| GRAIL gravity lab | `/games/grail-gravity` | Tandem ranging and lunar gravity anomalies. |
| LCROSS impact lab | `/games/lcross-impact` | Impact energy, plume observations, spectra, and lunar volatiles. |
| Mars Polar Lander forensics | `/games/polar-lander-forensics` | Failure investigation, software-state reasoning, and uncertainty. |
| Viking biology lab | `/games/viking-biology` | Comparing experiment results and alternative chemical explanations. |
| InSight seismology | `/games/insight-seismology` | Seismic signals, noise, planetary layers, power decline, and hardware records. |
| Ingenuity flight lab | `/games/ingenuity-flight` | Thin-atmosphere aerodynamics, rotor behavior, flight history, and discarded landing equipment. |
| MER twins | `/games/mer-twins` | Dust optical depth, solar power, rover traverses, instruments, artifacts, and PDS identifiers. |
| Ranger 7 dive | `/games/ranger-7-dive` | Camera frames and a one-way lunar approach. |

---

## 11. Interactive hardware and archive profiles

The detailed profile implementation remains at `/heroes/[slug]`. It can include:

- a source-attributed machine identity and mission summary;
- a 3D model or a clearly labelled simplified procedural model;
- named component exploration;
- a machine-specific signature visualization;
- life-work chapters and journey records;
- long-form wiki material and timelines;
- archive photographs and official video links;
- NASA Eyes embeds loaded only on request;
- tribute interactions; and
- mission-specific simulators.

These profiles are accessible through **More → Explorer archive** at `/heroes`. The primary **Our heroes** directory and map links still prioritize `/heroes/[slug]/story` so the first encounter is narrative rather than encyclopedic.

---

## 12. Technical architecture

### 12.1 Web application

The web experience is a Next.js application using React, TypeScript, Three.js, Motion, Firebase, and Cloudflare/OpenNext deployment tooling.

Key layers include:

- `apps/web/app`: routes, readers, profiles, games, legal pages, and API responses;
- `apps/web/lib/machine-books`: shared source-backed chapter records;
- `apps/web/lib/*-sources.ts`: reviewed source ledgers and qualifications;
- `apps/web/lib/*-thoughts.ts`: stable moment IDs and narration manifests;
- `apps/web/lib/story-images`: illustration metadata, credits, hashes, and source context;
- `apps/web/lib/wiki`: long-form archive entries;
- `apps/web/app/components/story`: shared readers, comic renderers, illustrations, and factual dialogs;
- `apps/web/app/components/profile`: 3D models, archive media, tributes, and mission simulators; and
- `packages/data`: shared catalog data consumed by the web application.

### 12.2 Progressive loading

Heavy browser features are loaded only when needed:

- Three.js globes and model viewers initialize near or inside their interactive contexts;
- YouTube, NASA Eyes, and archive players load on user request;
- video sources use posters and avoid unnecessary autoplay;
- readers preserve useful server-rendered text when scripts fail; and
- games lower render resolution when sustained frame times are too slow.

### 12.3 Local progress and accounts

Reading bookmarks and Touchdown progress are stored locally in the browser. Public tributes and authentication use Firebase when configured. Exploring the stories does not require an account.

---

## 13. Accessibility and responsible experience design

RoverVilla includes:

- keyboard navigation for readers and games;
- reduced-motion behavior and motion-free server snapshots;
- visible source and media labels;
- semantic headings, lists, dialogs, and status regions;
- text alternatives for photographs and illustrations;
- captions for included archive video where available;
- no mandatory narration autoplay for synthetic previews;
- touch-friendly controls and responsive layouts; and
- prose, comic, and scroll alternatives for the same content.

Accessibility is an ongoing engineering responsibility, not a one-time checkbox. The project should continue to be tested with keyboard-only navigation, reduced-motion settings, screen readers, narrow screens, and low-power devices.

---

## 14. Representative case studies

### 14.1 Spirit: engineering difficulty becomes scientific opportunity

Spirit's wheel failure is told as a hardware-and-science chain. The damaged wheel affected mobility, but dragging it exposed bright soil. Instrument measurements—not color alone—supported the silica finding and water-related interpretations. The interactive lesson separates the visible clue from the chemical measurement.

### 14.2 Opportunity: one rover, several kinds of evidence

Opportunity's chapters connect airbag engineering, hematite-rich spherules, recovery from Purgatory, memory management, marathon-distance operations, and the 2018 dust storm. The edition explicitly distinguishes actual telemetry and mission records from the popular poetic paraphrase of its final condition.

### 14.3 Eagle: two stages, two fates

Eagle's ten chapters follow undocking, guidance alarms, landing, television deployment, seismic science, laser ranging, solar-wind collection, the damaged breaker, ascent, and later orbital observation. The story repeatedly connects a component's job with the knowledge or action it made possible.

### 14.4 Pathfinder and Sojourner: a relay is part of a rover's life

The lander and rover are treated as two machines with different jobs. The story shows why a successful landing still required airbag clearing, why a moving rover depended on a stationary relay, why a carrier signal was not a recovered conversation, and why Sojourner's final movement remains unknown.

### 14.5 Mars Polar Lander: teach from a probable failure without pretending to recover telemetry

The story and learning activity explain the review board's likely sensor/software sequence while preserving the difference between a probable failure mode and an observed final telemetry record. The orbital search is not presented as a confirmed discovery of the lander.

---

## 15. Educational impact

### For young space enthusiasts

- Short moments reduce reading friction.
- Characters and chapter arcs make machine names memorable.
- Visual comparisons make invisible engineering concepts easier to discuss.
- Questions and controls encourage prediction rather than passive consumption.

### For parents and educators

- More to this moment opens the factual explanation without breaking the story flow.
- Multiple reading modes support shared and independent reading.
- Original sources are one step away when a learner asks, “How do we know?”

### For older students and judges

- Evidence JSON exposes the reviewed data layer.
- Conflicting values and unknowns remain inspectable.
- Source-linked activities show how the interface translates evidence into teaching design.

---

## 16. Honest limitations and next steps

RoverVilla is extensive, but the report should not imply that every planned feature is complete or that every legacy presentation is publicly routed.

Current limitations include:

- produced narration is not available for every edition;
- some older profile, wiki, simulator, or cinematic claims require reconciliation with the newer reviewed story ledgers before reuse as authority;
- procedural models and teaching SVGs are not engineering replicas;
- several artifact coordinates and present electronic conditions are genuinely unknown;
- some mission media depends on external NASA or instrument-team servers;
- the older cinematic story implementation is retained but generally superseded by thought-based readers; and
- accessibility and device-performance testing should continue.

Future work can include more produced narration matched through the fingerprint firewall, broader classroom guides, deeper evidence visualization, additional reviewed machines, and stronger offline support. The Explorer archive now provides an explicit entry point for preserved detailed profiles.

---

## Conclusion

The machines resting on the Moon and Mars are among humanity's first permanent monuments beyond Earth. RoverVilla brings their evidence home through a story-first experience while keeping the source record close enough to inspect.

Its central contribution is not merely placing mission facts beside attractive pictures. RoverVilla creates a **dual-layer learning architecture**:

1. an inviting layer of heroes, chapters, comics, storybooks, voices, maps, and play; and
2. a disciplined layer of source links, evidence records, media credits, attributed values, and explicit uncertainty.

That combination allows a child to remember the explorer, an adult to explain the engineering, and a judge or researcher to inspect the evidence. Their missions ended. Their stories—and the knowledge their hardware made possible—did not.

---

## Screenshot assets used in this report

The report references the following project screenshots from the repository's root `assets/` directory:

1. `Screenshot From 2026-11-12 18-47-05.png` — story room and its three reading paths;
2. `Screenshot From 2026-11-12 18-47-26.png` — thought-based scroll story;
3. `Screenshot From 2026-11-12 18-47-56.png` — comic mode;
4. `Screenshot From 2026-11-12 18-48-08.png` — storybook mode;
5. `Screenshot From 2026-11-12 18-51-08.png` — interactive space map;
6. `Screenshot From 2026-11-12 18-52-00.png` — cross-mission timeline; and
7. `Screenshot From 2026-11-12 18-52-33.png` — source-labelled photo album.
