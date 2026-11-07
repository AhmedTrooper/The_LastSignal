# RoverVilla: story-first research brief

## Product direction

Design for school-age readers, with ages 10–16 as RoverVilla's working audience. This age range is a product choice; the challenge specifies school-age and casual space enthusiasts without prescribing that range.

- `/story` is the machine list. A machine opens its scroll story.
- Story, Comic, and Book are different presentations of the same verified record.
- Keep Space map in the main menu. Its machine links lead to stories.
- Teach through small actions: examine a part, compare an image, replay a recording, explain what an instrument measured.
- Connect **hardware → what it enabled → what people learned → what happened to the equipment**.
- Use emotional stakes supported by events: separation, problem-solving, the return journey, equipment that remained. An imagined narrator's words are never historical quotations or telemetry.
- Keep transcript alternatives, captions, keyboard controls and reduced-motion support alongside multimedia. Do not autoplay narration.
- No official NASA logo, implied endorsement, or unlabeled AI artwork/voice.

Challenge brief, read on 2026-11-07:
https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/

## Evidence rules

1. Use NASA-hosted mission evidence: `nasa.gov` and its subdomains. Check the final destination of redirects. A NASA link to an external website does not make that website NASA-hosted.
2. Each factual claim needs a source URL and a precise locator: section, page, image identifier or transcript time. Preserve the source's units, date/time system and stated precision.
3. Keep mission, spacecraft and individual component records distinct. The crew's return date is not automatically a machine's end date. An image upload date is not its acquisition date.
4. Store a short supporting excerpt separately from the child-friendly paraphrase. A paraphrase is not a quotation.
5. Mark uncertainty and conflicting records explicitly. Do not fabricate missing values or choose an apparently more precise coordinate without evidence about the reference frame.
6. Label historical recording, modern explanation, simulation and synthetic narration separately. Record the speaker and verified clip boundaries before publishing a quotation or synchronized transcript.
7. Preserve asset-specific credits. NASA hosting alone does not establish that every third-party image on a page has the same reuse conditions.
8. A discovered media URL is not verified streaming. Test the actual file, format, captions, seek/range behavior and browser playback before wiring it into the reader.

## Apollo / Eagle: verified starting sources

The accompanying [`apollo-nasa-source-pack.json`](./apollo-nasa-source-pack.json) is a research handoff, not a complete or production-approved mission dataset. It contains sourced facts, original media links and explicit gaps.

| Source | What it supplies |
|---|---|
| [NASA Apollo 11 mission](https://www.nasa.gov/mission/apollo-11/) | Mission purpose, crew, launch/return dates and official resource entry points |
| [NASA mission overview](https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/) | LM-5 identity, prelaunch milestones, launch, separation, surface work and ascent sequence |
| [NASA audio highlights](https://www.nasa.gov/history/apollo-11-audio-highlights/) | Flight-day MP3 recordings paired with transcript PDFs |
| [NASA HD videos](https://www.nasa.gov/history/apollo-11-hd-videos/) | Moonwalk, ladder descent, plaque and mission videos, with captioned download links |
| [NASA/JPL laser-ranging explanation](https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/) | How the passive reflector works and what lunar laser ranging has revealed; report is dated 2019 |
| [NASA Photojournal PIA12909](https://science.nasa.gov/photojournal/apollo-11-second-look/) | A later orbital view, instrument metadata, image credit and image downloads |

### Gaps that must remain visible

- **Coordinates conflict:** the mission overview's narrative reports `0°41′15″ N, 23°26′ E`; its Orbit section reports `.71° N, 23.63° E`. These are recorded as conflicting source values, not an approved map pin. Resolve with a NASA-hosted geodetic source identifying the reference frame and epoch.
- **Whole lifespan:** the current Apollo book begins at undocking. NASA's overview supplies earlier test, delivery and launch milestones, but those are not a verified manufacturing start or a machine's “birthday.” Research those before adding a birth chapter.
- **Different endings:** the overview documents the ascent stage returning to lunar orbit and later being jettisoned. That does not establish its present location, survival, impact date or a final transmission. Those fields remain unverified here.
- **Existing citations:** `lib/machine-books/apollo.ts` contains `apollojournals.org` sources. They have not been silently replaced or described as NASA-hosted. Their claims need NASA-hosted corroboration under the new requirement.
- **Media:** the links in the JSON were found on the cited NASA pages. Playback, clip timing and transcript contents have not yet been audited. No speech excerpts have been approved from those files.

## Interaction concepts to develop from evidence

These are proposed teaching activities, not descriptions of historical controls:

- **One spacecraft, different jobs:** follow the documented separation/ascent sequence; source the detailed stage diagram before making parts draggable.
- **A reply made of light:** send an illustrative laser pulse, then open the source explaining timing-based distance measurement. Do not present animation timing as measured telemetry.
- **Listen, then inspect:** play a verified excerpt beside its transcript; let the reader identify the equipment or action being discussed.
- **A later look:** compare mission imagery with PIA12909, preserving dates, viewpoints and credits. Explain what each image can and cannot show.

The immediate priority is the brief and evidence collection. The existing story text has not been rewritten from this starter pack.
