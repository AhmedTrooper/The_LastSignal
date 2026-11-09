# Audio Fingerprint Firewall — master note

> Absolute: `/home/ahmedtrooper/Coding/Hackathon/Ourhackathon/apps/web/docs/audio-fingerprint-firewall.md`
> Scope: `apps/web` only. Related code: `lib/thought-clouds.ts`, `app/components/story/thought-narration.tsx`, `app/api/stories/[slug]/narration/route.ts`.
> Rule: document-and-commit only when explicitly asked. Work on `dev`, never create a new branch.

## What happened

Text rewrite changed every `line` / `detail`, so **every fingerprint changed**. The saved clip still exists under the same `beatId`, but its stored fingerprint no longer matches → status flips `ready → stale`, `src` / `durationMs` are nulled, and the player refuses to play it on purpose. That's the firewall we built so wrong audio never plays for new text.

## Why

Each narration clip is validated against **three keys** (`buildThoughtMoments`):

- `beatId` — stable, e.g. `apollo-11-lander.undocking.b01`
- `textRevision` — authored revision number (unchanged here)
- `textFingerprint` — FNV-1a hash of `narrationText = line + " " + detail` (e.g. `a1b2c3d4`)

Any mismatch on revision or fingerprint → **stale**, even if the file is right there under the same `beatId`. This protects kids from hearing narration that doesn't match the on-screen text.

## UI fallout

- `thought-narration.tsx` shows "the recorded clip needs updating before it can play" and falls back to **synthetic preview** (`speechSynthesis`, clearly labeled) — never silently wrong audio.
- Manifest (`GET /api/stories/:slug/narration`) reports `staleClips` and `suggestedAudioFilename: ${beatId}.en.r${rev}.${fingerprint}.mp3`.
- Tests asserting 40 ready clips will fail until new clips are recorded — that's expected after a text rewrite, not a code bug.

## To restore `ready`

1. Read the manifest for the new `textFingerprint` per `beatId`.
2. Record with *exact* `line + " " + detail` text.
3. Add clip `{ beatId, language:"en", textRevision, textFingerprint, src: "/audio/...mp3", durationMs }`.
4. Rebuild → clip validates to `ready`.

## History

- Story rewrite (`lib/machine-books/apollo.ts`, 2026-11-09) caused the fingerprint shift. Imports and structure unchanged (10 chapters × 4 beats); only copy changed.
