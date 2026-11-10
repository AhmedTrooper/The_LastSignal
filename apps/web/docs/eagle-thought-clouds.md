# Eagle thought-cloud reader

Open `/heroes/apollo-11-lander/story` for Eagle's ten chapters as forty chronological thoughts. The cloud contour, safe internal padding, mobile placement, keyboard navigation and narration controls are shared with Opportunity's tested reader.

## What stays intact

- Every short line and full explanation comes directly from `lib/machine-books/apollo.ts`.
- **More to this moment** keeps the detailed narrative, scientific takeaway, hardware and sources accessible.
- The complete book and comic editions remain linked to the current Eagle chapter.
- Existing chapter and `#chapter-beat-N` links remain available.
- The old Eagle bookmark key is preserved. The new reader converts its saved chapter and beat into the appropriate serial out of forty moments.
- The paired-console story link continues to report progress by chapter and supports the existing return-to-Eagle behavior.

## Story illustrations

All forty Apollo moments now have individually composed story illustrations and assigned entrance motion. See the [complete image catalog](apollo-story-image-catalog.md) for the storyboard, stable beat-ID mapping, twelve motion recipes and R2 keys. Originals live in `video/story-scroll/apollo11/`; temporary public copies and review sheets are gitignored under `public/video/story-scroll/`. Source/context JSON lives in `lib/story-images/apollo11/`. Captions identify the images as AI-assisted art, with historical sources in “More to this moment”. The unclipped outer frame gates the entrance, and only the active image loads eagerly, preventing masked images from remaining hidden.

## Audio production

Download `/api/stories/apollo-11-lander/narration` to get the forty-moment production manifest. IDs begin with `apollo-11-lander`, for example `apollo-11-lander.alarm.b01`; they cannot collide with Opportunity's IDs.

The forty current moments are attached to recorded imagined-voice clips in R2 at `audio/story-scroll/apollo11/<beatId>.mp3`. `lib/eagle-narration.ts` keys each clip by the same beat ID used by the scroll story and stores the measured duration and text fingerprint. The manifest reports those forty clips as ready. In the scroll reader, the matching recorded clip starts automatically when a moment becomes active—including Previous/Next, chapter selection, keyboard navigation and scrolling—so readers do not have to press “Listen” for each moment. Browser-voice preview remains synthetic and manual for moments without a recorded clip.

Earlier local audio files named `apollo-11-lander.epilogue.b01` through `b04` exist under `videos/audio/story-scroll/apollo11/`, but the current shared Apollo book has no epilogue chapter, so those four clips are not wired into the forty-moment scroll story.

This implementation changes presentation, not mission facts. Reflectors return light rather than radio signals, Panel 16 remains the breaker location in the sourced story, and later photographs remain clearly identified as archival observations.
