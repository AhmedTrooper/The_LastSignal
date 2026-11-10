# Eagle — undocking story images

The complete forty-image set and scene-specific motion system are now documented in [Apollo story-image catalog](apollo-story-image-catalog.md). This page retains the first two images' individual art-direction notes.

- **Moment:** `apollo-11-lander.undocking.b01`
- **Preview:** `/heroes/apollo-11-lander/story#apollo-11-lander.undocking.b01`
- **Source story:** [`lib/machine-books/apollo.ts`](../lib/machine-books/apollo.ts), `undocking`, first beat.
- **Artwork:** [`apollo-11-lander.undocking.b01.webp`](../video/story-scroll/apollo11/apollo-11-lander.undocking.b01.webp) — 1440 × 1200, about 102 KiB.
- **Editable original:** [SVG](../video/story-scroll/apollo11/apollo-11-lander.undocking.b01.svg).
- **Source/context record:** [JSON](../lib/story-images/apollo11/apollo-11-lander.undocking.b01.json).

## Second image: the inspection

- **Moment:** `apollo-11-lander.undocking.b02`
- **Preview:** `/heroes/apollo-11-lander/story#apollo-11-lander.undocking.b02`
- **Artwork:** [WebP](../video/story-scroll/apollo11/apollo-11-lander.undocking.b02.webp), 1440 × 1200, about 148 KiB.
- **Editable original:** [SVG](../video/story-scroll/apollo11/apollo-11-lander.undocking.b02.svg).
- **Source/context record:** [JSON](../lib/story-images/apollo11/apollo-11-lander.undocking.b02.json).

This is a new underside drawing through a thick, stylized Columbia window: the extended landing legs, footpads and descent-engine bell dominate the view. The Moon's limb is at the left edge, and the window rim places the viewer aboard Columbia. The journal provides the inspection context. Window geometry, viewpoint and the turn arc are expressly interpretive.

## Composition and historical context

In `b01`, Eagle is prominent in the foreground, with its two stages still joined, extended landing legs, forward windows and ladder. Columbia recedes to the upper left, with a visible gap between the spacecraft. The curved Moon underneath establishes the orbital setting. `b02` changes the viewpoint to the observer inside Columbia and focuses on the underside inspection. The images use distinct drawings and compositions.

Sources already associated with the repository's Apollo story/research:

- [Apollo 11 Flight Journal — undocking](https://apollojournals.org/afj/ap11fj/17day5-undock-doi.html#1001203).
- [NASA — Apollo 11 Mission Overview](https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/); the local [source pack](apollo-nasa-source-pack.json) records the undocking and crew context.

The artwork is explicitly **AI-assisted illustration, not a photograph**. Viewpoint, lighting, relative spacing, simplified geometry and lunar relief are interpretive. It does not claim an exact latch count, altitude or attitude. Attribution appears both in the artwork and the reader caption. The reader's **More to this moment → About this illustration** panel contains context and source links.

## Wiring and R2 handoff

`lib/eagle-thoughts.ts` imports the complete registry from `lib/story-images/apollo11/` into `ThoughtEdition.illustrations`, keyed by the **stable beat ID**, just like the audio registry. All forty Apollo moments now have individual images. `MomentVisual` delegates them to `StoryIllustrationView`; archive/diagram fallbacks remain available for editions without an override.

Current local preview files (gitignored):

```text
apps/web/public/video/story-scroll/apollo11/apollo-11-lander.undocking.b01.webp
apps/web/public/video/story-scroll/apollo11/apollo-11-lander.undocking.b02.webp
```

The uploaded illustrations use these exact R2 keys, separately from `audio/story-scroll/apollo11/`:

```text
images/story-scroll/apollo11/apollo-11-lander.undocking.b01.webp
images/story-scroll/apollo11/apollo-11-lander.undocking.b02.webp
```

`apps/web/.gitignore` excludes only `/public/video/story-scroll/`. SVG/WebP originals are preserved in `apps/web/video/story-scroll/apollo11/`, and source/context JSON stays in `lib/story-images/`. The generator refreshes the disposable public copies; originals are never kept solely inside an ignored folder.

The registry now overrides the JSON preview `src` with `assetUrl(record.r2Key)`, so the reader points to R2 already. Upload the WebPs to the exact keys above; the temporary public files are only for the local gallery. SVG is the editable source, WebP is the displayed image. No MP3 rename or narration fingerprint change is required. Post-upload checks are recorded in the complete catalog. Do not commit or push without explicit user authorization.

## Verification

- Rasterized and visually inspected both finished images.
- Server-render checks confirm every moment selects its own image with illustration attribution.
- Live browser review reproduced and fixed the clipping/visibility and masked lazy-loading deadlocks; see the [catalog](apollo-story-image-catalog.md).
- Tests verify original/public byte equality, metadata hashes and the narrow public ignore rule. Recorded audio IDs and raw story text are unchanged.
- Uploads are user-managed; commits and pushes require explicit permission.

## Context graph

[Artwork originals](../video/story-scroll/apollo11/) → [Eagle edition](../lib/eagle-thoughts.ts) → [shared renderer](../app/components/story/machine-thought-story.tsx).
