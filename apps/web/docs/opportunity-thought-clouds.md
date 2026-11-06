# Opportunity thought-cloud reader

## Reader and source content

Open `/heroes/opportunity/story`. The existing 20 story beats are shown one at a time in thought clouds. Scroll or use Previous/Next; arrow keys work when the cloud itself has keyboard focus. Chapter links and the old `#chapter-beat-N` anchors remain available.

The small cloud is not the entire factual record. **More to this moment** preserves its full explanation, discovery, hardware context and sources. The complete prose book and comic remain linked. Eagle's scroll reader is not replaced by this implementation.

## Stable IDs versus serial numbers

- Stable ID: `opportunity.airbag-landing.b01`.
- Display serial: `01 / 20`, computed from chronological order.
- Deep link: `/heroes/opportunity/story#opportunity.airbag-landing.b01`.
- Narration and visuals use that same ID. Reordering a chapter changes its display serial, not its identity.
- The placement/key map lives in `lib/opportunity-thoughts.ts`.

## Producing audio later

1. Download `/api/stories/opportunity/narration`.
2. Read each entry’s exact `narrationText`. It includes the short cloud line and its complete context.
3. Produce an English clip named using `suggestedAudioFilename`.
4. Measure its actual duration; do not guess a duration from the text.
5. Add the clip to `lib/opportunity-narration.ts`, keyed by `beatId`, with its `language`, `textRevision`, `textFingerprint`, `src`, and `durationMs`.
6. A clip becomes playable only when all identifiers match. Revised text invalidates the old clip even if a manual revision increment was missed.

No produced audio is attached yet. Where an English browser voice exists, the reader provides a clearly labelled synthetic preview. Starting another moment, opening notes, reaching the ending or hiding the tab stops that preview/clip. No narration autoplays because of scrolling.

## Motion and accessibility

- Cloud placement changes between moments; the text settles while the reader reads.
- Portrait layouts can put the cloud above or below the visual, with safe internal padding.
- Previous/Next controls are alternatives to scrolling.
- Native reading dialogs provide keyboard focus containment, Escape, focus return and scroll locking.
- Reduced-motion disables cloud entry and visual-position animations.
- All source text is retained for screen readers and print; the full prose book remains the straightforward reading alternative.
