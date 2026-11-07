# Ranger 7 story, book and conversation hub

## Thought-cloud reader

Open `/heroes/ranger-7/story`. Ranger 7's five chapters are shown as twenty chronological thoughts using the same tested reader as Opportunity and Eagle: scroll or Previous/Next, arrow keys when the cloud has keyboard focus, and **More to this moment** for the full explanation, discovery, hardware context and sources.

- Stable ID: `ranger-7.<chapter>.<key>`, for example `ranger-7.mare-cognitum.b03`.
- Deep link: `/heroes/ranger-7/story#ranger-7.mare-cognitum.b03`.
- Display serial (`01 / 20`), narration and visuals all use the stable ID; reordering a chapter would change serials, not identity.
- Existing `#chapter-beat-N` style anchors keep working through the legacy anchor spans in each marker.

## Book and comic nook

`/heroes/ranger-7/book` links to the current chapter in prose-book and comic formats with chapter navigation, and the local bookmark resumes at the saved moment. The page keeps NASA and NSSDCA source links for the hardware record.

## Narration production

Download `/api/stories/ranger-7/narration` for the twenty-moment manifest. IDs begin with `ranger-7`, so they cannot collide with Opportunity's or Eagle's. No clips are recorded yet; the manifest carries narration text, revision, fingerprint and suggested filename. Any browser-voice preview is synthetic and clearly labelled.

## Conversation hub on the hero page

`/heroes/ranger-7` has a **Talk to Ranger 7** section (`#ranger-hub`) driven by a small state machine:

- Data lives in `lib/ranger7-dialogue.ts` (27 nodes, `ranger-7.<BANK>_<n>` ids); the client component is `app/components/profile/ranger7-dialogue.tsx`.
- Flow: emotional handshake (one affirmative button per line) → memory hub with seven numbered banks → sequential banks (audio logs 3, films 2, gallery 6, systems record 4, coordinates 3) → three-round quiz → back to the hub.
- The story action is a real `target="_blank"` link to `/heroes/ranger-7/story`. Returning to the tab greets the reader as if they finished the journey (`RANGER7_STORY_RETURN_NODE`), after a short guard so an instant return does not skip the "story tab opened" reply.
- Gallery frames use the LPI `print/7/...` scans (3072 px) with NASA/JPL/LPI credits; films are the JPL and Cosmosphere uploads, privacy-enhanced embeds.
- Read-aloud uses the synthetic browser voice and shows "unavailable" when the browser has none. It is never presented as an archival recording; every reply lists its sources and the section carries the imagined-voice, non-endorsement note.

## Fact corrections enforced by tests

`scripts/ranger7-dialogue.test.ts` walks the graph (no dangling or unreachable nodes, banks in order), and bans values that early drafts got wrong: video carrier 960.58 MHz (it is the 3 W transponder; the carriers are 959.52/960.05 MHz at 60 W), a 222 N engine (it is 224 N), the "0.18 s final photo" (~2.3 s / t−2.5 s), the IAU naming attribution and invented quotes. It also asserts the corrected values that must stay: first image 13:08:45 UTC, impact 13:25:48.82 UTC at 10.6340° S / 339.3230° E, 4,308 photographs, 2.62 km/s, the 67-second Ranger 6 TV-on event whose cause was never definitively established, and the Mare Cognitum location.
