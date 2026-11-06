# Eagle thought-cloud reader

Open `/heroes/apollo-11-lander/story` for Eagle's ten chapters as forty chronological thoughts. The cloud contour, safe internal padding, mobile placement, keyboard navigation and narration controls are shared with Opportunity's tested reader.

## What stays intact

- Every short line and full explanation comes directly from `lib/machine-books/apollo.ts`.
- **More to this moment** keeps the detailed narrative, scientific takeaway, hardware and sources accessible.
- The complete book and comic editions remain linked to the current Eagle chapter.
- Existing chapter and `#chapter-beat-N` links remain available.
- The old Eagle bookmark key is preserved. The new reader converts its saved chapter and beat into the appropriate serial out of forty moments.
- The paired-console story link continues to report progress by chapter and supports the existing return-to-Eagle behavior.

## Audio production

Download `/api/stories/apollo-11-lander/narration` to get the forty-moment production manifest. IDs begin with `apollo-11-lander`, for example `apollo-11-lander.alarm.b01`; they cannot collide with Opportunity's IDs.

The manifest includes full narration text, text revision, a spoken-text fingerprint, suggested filename and recording status. Add actual clips to `lib/eagle-narration.ts` using those fields and measured durations. No recorded clips or timings are invented. English browser-voice preview is synthetic and optional.

This implementation changes presentation, not mission facts. Reflectors return light rather than radio signals, Panel 16 remains the breaker location in the sourced story, and later photographs remain clearly identified as archival observations.
