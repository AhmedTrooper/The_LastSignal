# The Last Signal

A memorial for the machines we left behind on Mars and the Moon. See `CONCEPT.md` for the idea and `final-design /` for the approved designs.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Docker: `docker build -t thelastsignal . && docker run -p 3000:3000 thelastsignal` (standalone output, health check at `/api/health`).

## Where things live

| Path | What |
|---|---|
| `lib/heroes.ts` | The archive: every hero's facts, chapters and sources. Add a hero here and every page picks it up. |
| `app/page.tsx` | Home (Standard mode) |
| `app/heroes/[slug]/` | Hero profile, and `story/` for Story mode |
| `app/timeline/`, `app/where-they-rest/` | Timeline mode and the resting-place globe |
| `app/gallery/`, `app/tributes/`, `app/about/` | Other pages |
| `app/components/` | Shared UI: header, mobile tab bar, waveform, hero card, planet |
| `scripts/generate-assets.mjs` | Placeholder image generator (costs money, see below) |

## Images

Everything in `public/images/` is an **AI-generated placeholder**, made with `openai/gpt-image-2.5-sunburst` at low quality via OpenRouter (about $0.005 each; see `scripts/asset-costs.log`). Before launch, swap them for credited NASA public-domain photos, keeping the same file names.

`npm run assets -- <name>` regenerates one image. It needs `OPENROUTER_API_KEY` in `.env.local`, skips files that already exist, and stops at a $0.45 budget.

## Globes

`app/components/globe.tsx` renders Mars and the Moon with three.js, using real public-domain surface maps in `public/textures/` (2048px for desktop, 1024px for phones):

- **Mars:** USGS Astrogeology, Viking MDIM 2.1 colour mosaic (public domain).
- **Moon:** NASA/GSFC/Arizona State University LROC WAC global mosaic, via NASA Moon Trek tiles (public domain; credit the LROC team).

Both are equirectangular with 0° longitude at the centre, so pins use each hero's real `coords`. three.js and the texture load only when a globe nears the viewport, and rendering pauses when it is off screen.

## Not built yet

- **Tributes** are saved in the visitor's browser only. A shared wall needs a backend.
- **Documentary and narration**: the players are in place but say "in production" until real AI-narrated media exists.
- **3D model**: labelled hotspots with zoom; a rotatable model needs a public-domain mesh.
