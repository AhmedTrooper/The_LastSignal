# Next storytelling phase: scroll-driven thought clouds

**Implemented first for Opportunity after the UI redesign was committed as `725457a`.** Opportunity's cloud edition was committed as `6b1e5b3`. The user then requested the same presentation for Eagle; its forty moments now use the shared reader engine without changing the original chapter text.

## The idea

Treat a machine’s chapter like a comic scene unfolding on the web. Scrolling reveals one short thought or spoken line in a cloud-shaped bubble. The bubble’s position changes between beats around the machine or the relevant hardware. The next thought arrives in chronological order rather than presenting large paragraphs at once.

This is a new presentation of the existing source-backed machine books, not a second story dataset that can drift away from the prose and comic editions.

## Stable serial tracking

Give every beat two identifiers:

- **Stable beat ID:** based on machine slug, chapter ID and beat number. This is the audio/animation key and never changes merely because another chapter is inserted.
- **Display serial:** the chronological number shown to the reader, such as `01 / 40`. It can be recalculated when the book grows.

Example for existing Eagle content:

```json
{
  "beatId": "apollo-11-lander.alarm.b01",
  "chapterId": "alarm",
  "chapterSequence": 2,
  "beatSequence": 1,
  "displaySerial": 5,
  "voiceRole": "imagined-machine-thought",
  "bubbleText": "Existing source-backed story beat, edited for a short cloud.",
  "narrationText": "The matching narration, including any context needed for accuracy.",
  "textRevision": 1,
  "sourceUrl": "https://apollojournals.org/alsj/a11/a11.landing.html#1023826",
  "bubblePlacement": "beside-guidance-computer",
  "audio": {
    "beatId": "apollo-11-lander.alarm.b01",
    "language": "en",
    "textRevision": 1,
    "src": null,
    "durationMs": null
  }
}
```

This example describes the proposed schema. It does not create an audio asset or claim an exact event timestamp. Audio durations remain unset until actual clips exist.

## Narrative and audio pairing

1. One machine owns one chronological book with standalone event chapters.
2. Each cloud belongs to an existing chapter and beat.
3. The beat ID links its text, visual scene, cloud placement and narration clip.
4. Keep text revisions so old audio cannot silently play against revised words.
5. An optional production manifest lists beat IDs in sequence and flags missing or outdated narration.
6. Original mission recordings stay in their own clearly sourced players. Imagined machine narration is not represented as real astronaut dialogue or rover telemetry.

## Interaction direction

- Reveal short passages in sequence, not a wall of text or an endless typewriter effect.
- Move the cloud between beats; let it settle while the visitor reads.
- Use different thoughtful placements without covering the machine, its important parts, or controls.
- Let the reader choose narration, pause, replay, or continue silently. Do not surprise them with automatic sound.
- Keep a visible chapter/beat serial and a stable URL for returning to a moment.
- Preserve context and uncertainty when shortening factual explanations.
- Keep a straightforward book/text alternative, keyboard navigation, readable mobile text, and reduced-motion behavior.

## Current implementation and review

- Opportunity has 20 authored moments across five chapters, displayed on one continuous scroll stage.
- Each moment keeps the exact short line, complete explanation, sources and book/comic links.
- “More to this moment” opens the full explanation rather than removing it from the story.
- `/api/stories/opportunity/narration` downloads the production manifest, including stable IDs, display serials, narration text, revisions, fingerprints and suggested audio filenames.
- `lib/opportunity-narration.ts` is the registry for actual produced audio. No clips or invented timings are attached yet.
- Optional browser voice preview uses synthetic English narration. It does not claim to be a produced or archival recording.
- Eagle now has forty authored moments across its ten chapters, using the same padded cloud layout.
- `/api/stories/apollo-11-lander/narration` and `lib/eagle-narration.ts` provide Eagle's independent production manifest and clip registry.
- Review both readers' placement and pacing before producing a full set of recorded narration. No actual audio clips or fabricated durations have been added.
