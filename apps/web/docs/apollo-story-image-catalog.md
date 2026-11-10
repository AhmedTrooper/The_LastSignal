# Apollo — complete story-image set

All 40 story moments now have individually composed AI-assisted illustrations. Identity is the same `apollo-11-lander.<chapter>.<beat>` used by narration. Images are interpretive drawings, not NASA photographs, observed telemetry or exact hardware reconstructions.

## Review

- Complete static gallery: `/video/story-scroll/apollo11/index.html`.
- Four-image chapter sheets: `/video/story-scroll/apollo11/<chapter>.contact-sheet.webp`.
- Animated reader: `/heroes/apollo-11-lander/story#<beatId>`.

The gallery and chapter sheets show the actual image assets. The story reader applies the per-image entrance motion after image loading and viewport entry.

## Storyboard

| Chapter | b01 | b02 | b03 | b04 |
|---|---|---|---|---|
| undocking | Wide separation | Underside through Columbia's window | Exploded two-stage design | Diverging spacecraft journeys |
| alarm | DSKY close-up | Priority-work schematic | Mission Control | Terrain through the cockpit window |
| touchdown | Aerial boulder field | Hand controller | Contact probe macro | Landed Eagle / strut inset |
| first-step | Through the hatch | D-ring / hinged MESA | Camera viewpoint | Bootprint / television insert |
| first-vibrations | Packed instrument / ground wave | Leveling / solar panels | Footsteps / paper recorder | Solitary instrument / subsurface diagram |
| reflector | Passive array portrait | Corner-cube optics | Earth–Moon light journey | Accumulating observations |
| solar-wind | Collector deployment | Particle/foil macro | Gloved recovery / sample box | Staff stays / foil returns |
| breaker | Loose knob on cabin floor | Recessed stem magnification | Pen / sleeve pocket | Blunt pen end operating control |
| liftoff | Separation-system macro | Return/stay comparison | Cabin launch / lower-stage platform | Quiet descent stage |
| seen-again | Passage of light and time | Orbiter camera view | Overhead shape/shadow diagram | Leg/plaque / distant Earth |

## Per-image motion

Every metadata JSON contains a `motion` preset assigned by `scripts/apollo-art/motion-plan.ts`. Twelve entrance types run for 1.6–2 seconds: `bloom`, `shutter`, `unfold`, `drift`, `scan`, `focus`, `rise`, `settle`, `trace`, `orbit`, `sweep`, `hinge`.

Examples: inspection rotates gently; the two-stage diagram unfolds; the guidance display scans down; touchdown bounces and settles; the cabin lifts into view; the final memory blooms from its center. These are frame presentations, not claims of simulated spacecraft motion.

`app/components/story/story-illustration.tsx` observes the **unclipped figure**, not the animated image. The active image uses eager loading: a closed reveal mask otherwise blocks native lazy loading, while clipped pictures never meet the 15% visibility threshold. Both circular waits caused permanently hidden frames. Only one moment's image is mounted. A failed image falls back to Eagle's existing diagram. Reduced motion immediately shows the full frame. Multi-keyframe effects use tweens. Audio lifecycle and raw story text are unchanged.

Eagle-only caption and long-line fitting rules live in `app/components/story/eagle-story-art.css`; the shared cloud shape and other stories' layouts are unchanged. Scroll, comic and prose still derive from `lib/machine-books/apollo.ts`.

The shared reader's reduced-motion preference uses `useSyncExternalStore` with a deterministic server/hydration snapshot, then subscribes to the browser setting. This fixes reduced-motion hydration warnings without suppressing them or changing page geometry.

## Files and R2

- **Preserved originals:** `video/story-scroll/apollo11/<beatId>.svg` and `.webp`.
- **Ignored temporary copies:** `public/video/story-scroll/apollo11/<beatId>.webp` and review sheets.
- **Source/context records:** `lib/story-images/apollo11/<beatId>.json`.
- **Registry:** `lib/story-images/apollo11/index.ts`, imported by `lib/eagle-thoughts.ts`.
- **Source geometry:** `scripts/apollo-art/drawing.ts`.
- **38 additional authored compositions:** `scripts/apollo-art/scenes.ts`; the first two SVG originals remain separately authored.
- **Generation:** `bun scripts/generate-apollo-story-images.ts`; optionally append `chapter.bNN` to redraw one of the 38 generated scenes. This refreshes metadata, registry, gallery and chapter sheets, then copies the WebPs and review files into the ignored public folder. The first two originals are preserved outside `public`.

Upload only the forty `apollo-11-lander.*.webp` files using keys:

```text
images/story-scroll/apollo11/<beatId>.webp
```

The runtime registry uses **`assetUrl(record.r2Key)`**, resolving all forty Eagle images from the configured R2/CDN base, never local public copies. JSON `src` paths remain local review metadata only. The user uploaded the forty `apollo-11-lander.*.webp` images under **`images/story-scroll/apollo11/`**; this remote prefix differs from the preserved local `video/story-scroll/apollo11/` folder. Narration remains separately under `audio/story-scroll/apollo11/`. SVGs, contact sheets and `index.html` are not used by the reader. Use the generator's `--sync` option to update remote keys without changing uploaded image bytes. Uploads are user-managed; commits and pushes require explicit permission.

## Verification

- Tests check all 40 stable IDs, metadata, source hashes, originals and matching public copies, plus unclipped visibility frames and eager loading.
- Live BrowserOS review reproduced both visibility/loading deadlocks and verified the corrected rendering.
- All 40 image entrances render and settle on desktop; all 40 phone images load with visible attribution, usable image area and no text/control overlap.
- All 40 moments pass fitting checks at 375 × 812, 375 × 667, 1280 × 800, 900 × 700 and landscape 812 × 375.
- Eagle's comic/prose format switching and return to scroll story pass desktop/phone checks. All twelve other shared story readers pass browser smoke checks, retaining their existing archive/diagram paths without Eagle artwork or browser issue badges.
- Reduced-motion reload shows no hydration issue badge. An intentionally blocked image shows the existing diagram fallback, and restoring the request restores the artwork.
- 145 tests pass across 29 files; web TypeScript and production build pass (97 prerendered pages). ESLint has no errors and one pre-existing auth-bridge hook warning. No mobile files were changed.
- The exhaustive entrance/fitting checks above were completed before the R2 switch. After the user's upload, all forty objects under `images/story-scroll/apollo11/` return HTTP 200 (2,609,278 total bytes). Post-upload desktop/phone checks of the first four moments confirm the actual rendered image URLs use R2, with no image/text/control errors. All forty moments also pass tablet fitting at 768 × 1024 and 1024 × 768, with usable image area and no heading/control overlap.

## Graph

[Metadata and registry](../lib/story-images/apollo11/) → [Eagle edition](../lib/eagle-thoughts.ts) → [image renderer](../app/components/story/story-illustration.tsx) → [motion recipes](../lib/story-image-motion.ts).
