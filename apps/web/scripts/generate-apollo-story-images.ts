/** Run from apps/web: bun scripts/generate-apollo-story-images.ts [chapter.beat | --sync]
 * Authored shot recipes, not random template variations. Existing b01/b02 originals are preserved.
 * Originals live in video/story-scroll/; only the temporary public copies are gitignored.
 */
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { APOLLO_BOOK } from "../lib/machine-books/apollo";
import { SCENES } from "./apollo-art/scenes";
import { MOTION_PLAN } from "./apollo-art/motion-plan";
import { escape, frame, W, H } from "./apollo-art/drawing";
import type { StoryIllustration } from "../lib/thought-clouds";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const imagePath = "video/story-scroll/apollo11";
const r2Path = "images/story-scroll/apollo11";
const output = join(root, imagePath);
const preview = join(root, "public", imagePath);
const metadataDir = join(root, "lib/story-images/apollo11");
const graphDir = join(root, "docs/context/lib/story-images/apollo11");
await Promise.all([output, preview, metadataDir, graphDir].map(dir => mkdir(dir, { recursive: true })));
const selected = process.argv[2];
const syncOnly = selected === "--sync";
assert(!selected || syncOnly || SCENES.some(scene => scene.key === selected), "Unknown scene key");
assert.equal(SCENES.length, 38, "Two existing originals plus 38 authored scenes");
assert.equal(new Set(SCENES.map(scene => scene.key)).size, 38, "Duplicate scene key");

for (const scene of SCENES) {
  if (syncOnly) continue;
  if (selected && selected !== scene.key) continue;
  const [chapterId, cue] = scene.key.split(".");
  const chapter = APOLLO_BOOK.chapters.find(item => item.id === chapterId);
  assert(chapter && /^b0[1-4]$/.test(cue), `Unknown chapter or beat: ${scene.key}`);
  const beatId = `${APOLLO_BOOK.slug}.${scene.key}`;
  const svg = frame(scene.title, scene.alt, scene.draw(), scene.tone);
  // Source IDs and context are carried by the sidecar; artwork contains no external resources.
  await writeFile(join(output, `${beatId}.svg`), svg);
  const rendered = await sharp(Buffer.from(svg)).webp({ quality: 92 }).toBuffer();
  await writeFile(join(output, `${beatId}.webp`), rendered);
  const record = {
    schemaVersion: 1, beatId, title: scene.title,
    src: `/${imagePath}/${beatId}.webp`, r2Key: `${r2Path}/${beatId}.webp`,
    width: W, height: H, alt: scene.alt, credit: "RoverVilla · AI-assisted illustration",
    motion: MOTION_PLAN[scene.key],
    context: scene.context,
    interpretation: "Original story illustration. Viewpoint, lighting, pose, geometry and apparent distances are interpretive. Scientific arrows, waves, cutaways and displays explain principles; they are not recorded telemetry, a literal instrument diagram or a historical photograph.",
    sources: [{ label: `Apollo mission record · ${chapterId}`, url: chapter.source }, ...(chapter.relatedSources ?? []), { label: "NASA · Apollo 11 Mission Overview", url: "https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/" }],
    assetSha256: createHash("sha256").update(rendered).digest("hex"),
  } satisfies StoryIllustration & { schemaVersion: number; r2Key: string; assetSha256: string };
  await writeFile(join(metadataDir, `${beatId}.json`), JSON.stringify(record, null, 2) + "\n");
  await writeFile(join(graphDir, `${beatId}.json.md`), `# ${beatId}\n\nAbsolute: \`${join(metadataDir, `${beatId}.json`)}\`.\n\n${scene.title}: ${scene.context}\n\n[Registry](index.md) · [schema](../../thought-clouds.md) · [parent](_index.md) · [shot recipe](../../../scripts/apollo-art/scenes.md).\n\nOriginal SVG/WebP live in \`video/story-scroll/apollo11/\`; only temporary copies in \`public/video/story-scroll/\` are gitignored. Update this record and its registry/context links when the asset changes.\n`);
  console.log(`${beatId} — ${scene.title} (${Math.round(rendered.length / 1024)} KiB)`);
}

// Explicit stable keys, in story order. Only text/schema data is imported by the application.
const ids = APOLLO_BOOK.chapters.flatMap(chapter => ["b01", "b02", "b03", "b04"].map(key => `${APOLLO_BOOK.slug}.${chapter.id}.${key}`));
const records = await Promise.all(ids.map(async id => {
  const record = JSON.parse(await readFile(join(metadataDir, `${id}.json`), "utf8"));
  const preset = MOTION_PLAN[id.replace(`${APOLLO_BOOK.slug}.`, "")];
  assert(preset, `Missing motion direction for ${id}`);
  record.src = `/${imagePath}/${id}.webp`;
  record.r2Key = `${r2Path}/${id}.webp`;
  record.motion = preset;
  const rendered = await readFile(join(output, `${id}.webp`));
  record.assetSha256 = createHash("sha256").update(rendered).digest("hex");
  await writeFile(join(metadataDir, `${id}.json`), JSON.stringify(record, null, 2) + "\n");
  return record as StoryIllustration;
}));
records.forEach((record, i) => assert.equal(record.beatId, ids[i]));
const registry = `// Generated by scripts/generate-apollo-story-images.ts. Originals: video/story-scroll/; public copies are gitignored.\nimport { assetUrl } from "../../heroes";\nimport type { StoryIllustration } from "../../thought-clouds";\n${ids.map((id, i) => `import image${i} from "./${id}.json";`).join("\n")}\n\nconst images = [\n${Array.from({ length: 4 }, (_, row) => `  ${ids.slice(row * 10, row * 10 + 10).map((_, index) => `image${row * 10 + index}`).join(", ")},`).join("\n")}\n];\n\n/** Runtime uses R2; JSON src values and public copies are for local artwork review only. */\nexport const APOLLO_STORY_ILLUSTRATIONS: Record<string, StoryIllustration> = Object.fromEntries(\n  images.map(image => [image.beatId, { ...image, src: assetUrl(image.r2Key) }]),\n);\n`;
await writeFile(join(metadataDir, "index.ts"), registry);

// Update remote keys without redrawing or changing the already uploaded artwork.
if (syncOnly) {
  console.log(`Synced ${records.length} R2 image keys under ${r2Path}/; original artwork unchanged.`);
  process.exit(0);
}

// A local-only visual index for review before upload, with no app route or scroll/audio changes.
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Apollo story image contact sheet</title><style>body{margin:0;padding:32px;background:#101c2b;color:#e7e3ce;font:16px system-ui}h1{font-size:28px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}article{border:1px solid #4d6470;border-radius:16px;overflow:hidden;background:#1d3143}img{width:100%;height:auto;display:block}h2,p{margin:14px 16px}h2{font-size:17px}p{font-size:12px;line-height:1.6;color:#b9c9c3}a{color:inherit}code{overflow-wrap:anywhere}</style><h1>Apollo · 40 distinct story moments</h1><p>Local previews · AI-assisted illustrations, not photographs · not yet uploaded to R2</p><div class="grid">${records.map((record, i) => `<article><a href="./${record.beatId}.webp"><img loading="lazy" width="${W}" height="${H}" src="./${record.beatId}.webp" alt="${escape(record.alt)}"></a><h2>${String(i + 1).padStart(2, "0")} · ${escape(record.title)}</h2><p><code>${record.beatId}</code></p><p>${escape(record.context)}</p><p><a href="/heroes/apollo-11-lander/story#${record.beatId}">Open this story moment →</a></p></article>`).join("")}</div></html>`;
await writeFile(join(output, "index.html"), html);

// Per-chapter four-up sheets make actual composition differences easy to inspect.
for (const chapter of APOLLO_BOOK.chapters) {
  const chapterRecords = records.filter(record => record.beatId.startsWith(`${APOLLO_BOOK.slug}.${chapter.id}.`));
  const inputs = await Promise.all(chapterRecords.map(async (record, i) => ({ input: await sharp(join(output, `${record.beatId}.webp`)).resize(540, 450).png().toBuffer(), left: i % 2 * 558 + 12, top: Math.floor(i / 2) * 494 + 12 })));
  const captions = `<svg width="1128" height="1000">${chapterRecords.map((record, i) => `<text x="${i % 2 * 558 + 24}" y="${Math.floor(i / 2) * 494 + 486}" fill="#dfddcc" font-family="Arial" font-size="18">${i + 1}. ${escape(record.title)}</text>`).join("")}</svg>`;
  await sharp({ create: { width: 1128, height: 1000, channels: 4, background: "#122537" } }).composite([...inputs, { input: Buffer.from(captions), left: 0, top: 0 }]).webp({ quality: 88 }).toFile(join(output, `${chapter.id}.contact-sheet.webp`));
}

// The local gallery uses disposable public copies. The reader's registry points to R2.
const previewFiles = [...ids.map(id => `${id}.webp`), ...APOLLO_BOOK.chapters.map(chapter => `${chapter.id}.contact-sheet.webp`), "index.html"];
await Promise.all(previewFiles.map(file => copyFile(join(output, file), join(preview, file))));

await writeFile(join(graphDir, "_index.md"), `# Apollo image metadata\n\nAbsolute folder: \`${metadataDir}\`.\n\n40 authored images keyed to story/audio beat IDs. [Registry](index.md) · [Eagle edition](../../eagle-thoughts.md) · [generator](../../../scripts/generate-apollo-story-images.md). Originals and review sheets live in \`video/story-scroll/apollo11/\`. Only temporary copies under \`public/video/story-scroll/\` are gitignored.\n\n${records.map(record => `- [${record.beatId}](${record.beatId}.json.md): ${record.title}`).join("\n")}\n`);
console.log(`Ready: ${records.length} originals and metadata records, 10 four-up sheets and temporary public copies.`);
