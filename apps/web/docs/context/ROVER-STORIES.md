# Apollo 15 rover and Pathfinder: source-to-reader map

Scope: `apps/web`, branch `dev`. [Research dossier](../research/rover-stories.md). No other raw machine stories were rewritten.

## One shared story per machine

- [Apollo 15 book](../../lib/machine-books/apollo-15-rover.ts) → [moments](../../lib/lrv-thoughts.ts) → [scroll wrapper](../../app/components/story/lrv-thought-story.tsx).
- [Pathfinder book](../../lib/machine-books/pathfinder-sojourner.ts) → [moments](../../lib/pathfinder-thoughts.ts) → [scroll wrapper](../../app/components/story/pathfinder-thought-story.tsx).
- Both retain `chapters → four { line, detail } beats`. [Comic renderer](../../app/components/story/event-comic-page.tsx) and [prose reader](../../app/components/story/machine-book-reader.tsx) consume the same objects.

## Provenance

- [LRV sources, facts and position limits](../../lib/lrv-sources.ts); [Pathfinder sources, facts and unknowns](../../lib/pathfinder-sources.ts); [fact schema](../../lib/rover-research.ts).
- [LRV media](../../lib/lrv-media.ts) and [Pathfinder media](../../lib/pathfinder-media.ts) contain inspected NASA photo URLs and NASA-linked resource context. No SVG upload or paid image generation is required.
- [LRV JSON route](../../app/api/stories/apollo-15-rover/evidence/route.ts) and [Pathfinder JSON route](../../app/api/stories/pathfinder-sojourner/evidence/route.ts) publish the raw shared source. [Exporter](../../scripts/export-rover-evidence.ts) writes exact snapshots under `docs/research/`.
- Narration routes publish scripts only; recordings/durations are null. The synthetic reader voice is not mission audio.

## Visuals and interaction

- [Storyboards](../../lib/rover-scenes.ts): 32 distinct named scenes per machine.
- [LRV SVG](../../app/components/story/lrv-illustration.tsx), [Pathfinder SVG](../../app/components/story/pathfinder-illustration.tsx), [unclipped SVG frame and finite entrance recipes](../../app/components/story/rover-svg-frame.tsx).
- [Investigations](../../lib/rover-investigations.ts) → [native controls, source media and source ledger](../../app/components/story/rover-chapter-extras.tsx).
- [Scoped styles](../../app/components/story/reviewed-rovers.css) affect only these two editions. Static shelf covers remain server-visible; story scenes animate when visible and clear under reduced motion.
- [Tests](../../scripts/reviewed-rovers.test.tsx) check NASA-only provenance, four-beat equality, 64 comic panels, narration IDs, unknowns, source disagreements and exported JSON equality.

When either story changes, regenerate JSON, preserve stable chapter/beat IDs, and review the SVG/interaction mappings. Never infer a recording, waveform, exact parked coordinate or failure cause from missing evidence. Do not commit or push without explicit permission.
