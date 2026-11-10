# Eagle story artwork

- `apollo11/`: preserved SVG originals, forty WebP upload assets and review sheets.
- Temporary reader copies: `public/video/story-scroll/apollo11/` (gitignored).
- Metadata: `lib/story-images/apollo11/`.
- R2 key: `images/story-scroll/apollo11/<beatId>.webp` (the remote prefix differs from the local source folder).

From `apps/web`, run `bun scripts/generate-apollo-story-images.ts` to regenerate authored scenes and refresh temporary public copies. The first two SVG/WebP originals are preserved.

Use `bun scripts/generate-apollo-story-images.ts --sync` to update R2 keys and the registry without redrawing or changing already uploaded files.

Upload only the forty `apollo-11-lander.*.webp` files. SVGs, contact sheets and the gallery are source/review files, not upload assets. The reader already resolves `assetUrl(record.r2Key)` from R2; it does not use temporary public copies. Objects must be uploaded before the new artwork can appear remotely. Missing images use the existing diagram fallback.

See [the catalog](../../docs/apollo-story-image-catalog.md). No upload, commit or push is automatic.
