# GRAIL (Ebb & Flow): verified story editions

Reviewed **2026-11-08**. The supplied GRAIL master/dialogue JSON and legacy GRAIL files were treated as drafts. The new edition preserves the legacy cinematic story and uses inspected NASA/NSSDCA/JPL/LROC sources instead.

## Routes and shared content

- `/heroes/grail/story`
- `/heroes/grail/book` and `?read=1&format=comic` / `?read=1&format=book`
- `/api/stories/grail/evidence`
- `/api/stories/grail/narration`

Five chapters, twenty shared beats. Comic captions, prose and narration scripts come from the same text. All twenty produced narration clips remain missing; no archival recording or farewell is fabricated.

| Chapter | Hardware-to-science connection |
| --- | --- |
| A long way to the Moon | Delta II launch, low-energy L1 cruise, orbit insertion and student names |
| Cosmic tag | Ka-band range-rate between the twins plus MoonKAM education imaging |
| Lower and sharper | Primary and extended science phases at lower altitude |
| The X-ray Moon | Gravity map, crust thickness, highland porosity and buried dikes |
| A place named for Sally | Fuel-gauge depletion burn and controlled impact at the Sally K. Ride Impact Site |

Exact source URLs and evidence locators are in `lib/grail-sources.ts`. NASA Science, NSSDCA, exact NASA Image Library API items and NASA's impact naming article were inspected.

## Corrections and uncertainty

1. **Masses:** NSSDCA gives dry mass 132.6 kg and fully fueled mass 202.4 kg each. The draft's 202 kg dry / 307 kg fueled split is not adopted.
2. **Ranging units:** NSSDCA describes LGRS as high-precision *range-rate* measurement and the PDS data description says relative range-rate. The story therefore says tiny changes in separation speed; it does not assert a 0.02-micron distance.
3. **Flow orbit insertion:** NSSDCA lists 1 January 2012; NASA Science's date table lists 2 January. The story says about a day after Ebb and the evidence JSON retains both values.
4. **Science dates:** Primary phase March 7–May 29, 2012 and second phase beginning August 8, 2012 follow NASA Science, not the draft's March 1 / August 30 boundaries.
5. **PIA IDs:** PIA16588 is highland-crust porosity (not thickness); PIA16600 is highland bulk density (not the impact-site map); PIA14886 is a Kepler chart; PIA16842 is Saturn. Correct GRAIL assets are used instead.
6. **Eclipse:** The unverified pre-heat/thermal-brick rescue sequence is omitted. The chapter covers the verified move to a lower extended-mission orbit.
7. **MoonKAM:** NASA reports more than 115,000 total images from student-selected targets; no exact 119,830 count is asserted.
8. **Impact coordinates:** NSSDCA values are used. Draft elevations, slopes and separation distance are not reproduced because they were not independently verified.
9. **Dark ejecta:** LROC's caption reports about 5 m craters with dark, irregular ejecta. No carbon-coating thickness or composition measurement is asserted.

## Media and teaching controls

The cover and science concept are artist concepts (PIA13965, PIA13966), not flight photographs. The gravity map (PIA16587), porosity map (PIA16588), target mountain (PIA16493), final flight path (PIA16492) and resting-spot map (PIA16603) keep their own captions, sources and credits.

The mascon lesson requires approaching, stretching and recovering the separation; the fuel lesson requires starting the burn, depleting the tanks and then impacting. Drawings use exaggerated gaps and are labelled as teaching diagrams, not measured telemetry.

No conversational profile hub, fake archive audio, external game or official scientist certification was added. Scope is `apps/web` only. The homepage still features only its existing three stories.

## Checks completed

- `bun run build`: passed, with book and both JSON routes.
- `bun test scripts/`: **124 passed / 0 failed**, including the previous 117 checks.
- Lint: no errors; existing unrelated `app/auth/mobile/page.tsx` hook warning remains.
- HTTP checks: story, comic, book, evidence and narration routes returned **200**; the GRAIL JPEG assets used by the edition returned **200**.
