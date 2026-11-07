# Spirit: story, comic and book verification

Reviewed **2026-11-08**. The supplied master/story/dialogue datasets were research drafts. The published edition follows NASA mission records and the official NASA/JPL-Caltech/UArizona HiRISE team’s observation caption.

## Published edition

- Scroll: `/heroes/spirit/story`
- Comic: `/heroes/spirit/book?read=1&format=comic`
- Prose: `/heroes/spirit/book?read=1&format=book`
- Chapter shelf: `/heroes/spirit/book`
- Machine-readable evidence, facts, chapters, media and research notes: `/api/stories/spirit/evidence`
- Production narration script with stable IDs and fingerprints: `/api/stories/spirit/narration`

Five chapters × four shared beats = twenty scroll moments and twenty comic panels. `chapterParagraphs()` derives the prose from those same beats. No parallel dialogue script or produced narration recording is implied. Existing browser voice preview is synthetic and labelled; all production audio entries initially remain missing.

| Chapter | Hardware-to-science connection | Primary records |
| --- | --- | --- |
| A rocky welcome | Airbag landing, rock abrasion, camera evidence and choosing a new route | [Mission](https://science.nasa.gov/mission/mer-spirit/), [NSSDCA](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A), [PIA05223](https://science.nasa.gov/photojournal/first-grinding-of-a-rock-on-mars/), [PIA05547](https://science.nasa.gov/photojournal/you-are-here-earth-as-seen-from-mars/) |
| A fresh start | Persistent flash files, a bypass mode, file deletion and preventive reformatting | [February 1 recovery report](https://www.jpl.nasa.gov/news/mars-rover-spirit-restored-to-health/), [February 5 status](https://www.jpl.nasa.gov/news/mars-exploration-rover-mission-status-8/) |
| The view from the hill | Mineral measurements, solar energy and the geologist’s viewpoint | [September 1 report](https://www.jpl.nasa.gov/news/nasas-durable-spirit-sends-intriguing-new-images-from-mars/), [Clovis spectrum](https://science.nasa.gov/photojournal/water-signature-mineral-found-by-spirit/), [PIA04183](https://science.nasa.gov/photojournal/postcard-above-tennessee-valley/) |
| The clue under my wheel | A disturbance becomes a target; Mini-TES and APXS test its composition | [PIA09491](https://science.nasa.gov/photojournal/silica-rich-soil-found-by-spirit/), [May 21 report](https://www.jpl.nasa.gov/news/mars-rover-spirit-unearths-surprise-evidence-of-wetter-past/) |
| The record that stayed | Traction, panel orientation, uncertain loss mechanisms and preserved data | [PIA12142](https://science.nasa.gov/photojournal/spirits-view-from-troy/), [Stationary science announcement](https://www.jpl.nasa.gov/news/nasas-mars-rover-spirit-starts-a-new-chapter/), [End-of-mission report](https://ntrs.nasa.gov/api/citations/20160001767/downloads/20160001767.pdf), [HiRISE ESP_021925_1650](https://www.uahirise.org/ESP_021925_1650) |

The full source ledger, locators and factual summaries live in `lib/spirit-sources.ts` and are included in the evidence JSON.

## Important corrections and qualifications

1. **Identity:** NSSDCA directly identifies Spirit as MER-A / MER-2, COSPAR **2003-027A**, with rover mass **185 kg**. Its alternate-name list includes `27827`, but does not explicitly label that field SATCAT; the independent SATCAT field stays null.
2. **Landing time:** NSSDCA calls **04:35 UT on January 4, 2004** Earth-received time. January 3 is the corresponding Pacific date. It is not presented as a precisely timed onboard touchdown event.
3. **Coordinates:** Inspected NASA sources publish differing landing coordinates. The proposed IAU/MOLA landmark table is not independently validated, and exact locations/elevations are not copied into this edition. HiRISE image-center coordinates are not rover coordinates.
4. **Adirondack:** `PIA05200` depicts the Columbia memorial hills. **PIA05223** documents the first grinding: **Sol 34 / February 6**, patch **45.5 mm** wide and **2.65 mm** deep. February 8 is that image’s release date.
5. **Earth:** **PIA05547** combines a Navcam sky mosaic with contrast-enhanced Pancam imagery and an enlarged inset. Its caption says **Sol 63**, one hour before sunrise. The edition does not infer an exposure date from the March 11 publication date or call it one true-color exposure.
6. **Memory:** Normal boot was stable by **February 1**. The February 5 report says reformatting succeeded the previous Wednesday, **February 4**. Avoid the draft’s February 6 cure, exact reboot count, DOSFS mechanism, battery-at-zero claim and permanent repair guarantee. Flash bypass and removal of accumulated files are directly documented.
7. **Summit:** The NASA overview’s September 29 statement conflicts with contemporary August summit imagery and the September 1 report. Story text uses **August 2005**; PIA04183 keeps its own **August 23 / Sol 582** caption. **82 m above nearby plains** and **106 m above the landing site** use different reference levels. Do not combine uncertain dates or odometer figures into a falsely precise summit event.
8. **Wind:** Solar output and battery charge are different quantities. The archived July camera sequence is not evidence that the filmed vortex crossed the rover or cleaned its panels.
9. **Silica:** [PIA09714](https://science.nasa.gov/photojournal/large-lava-fan-on-the-northwestern-flank-of-olympus-mons/) is an Olympus Mons lava fan. **PIA09491** dates soil exposure to **March 29 / Sol 1150**, Mini-TES investigation to **April 20 / Sol 1172**, and APXS measurements to **May 8–9 / Sols 1189–1190**. The image itself is **May 6 / Sol 1187**. About **90% non-crystalline silica** is not pure quartz or proof of microbes; hot springs and acidic steam are proposed formation environments.
10. **Troy:** Embedding began **April 23 / Sol 1886** and developed over several drives. PIA12078 pairs **Sol 1892 with April 29**, not May 1. The technical report describes crust failure and loose material, rather than a single cinematic accident with precisely known timing.
11. **Last contact:** **March 22, 2010 / Sol 2210** is established. The report explicitly says the immediate loss cause is unknown, with harsh winter conditions the likely root cause. Exact final temperature, frost, power state and farewell words are not invented.
12. **Totals and closure:** The end-of-mission report appendix lists **7,730.50 m** (printed p. 24) and **124,839 source images** (p. 28), not the draft’s `128,224`. Public mission completion was **May 25, 2011**; the technical report separately records **1,411 commands from July 27, 2010 through July 13, 2011** (p. 20). Those milestones have different scopes.
13. **Orbital brightness:** HiRISE’s **March 31, 2011** observation explains Spirit’s glint using solar-panel specular reflection. It does not establish communication, power or present-day activity.
14. **3D and audio:** The supplied `spirit-and-opportunity-rover` model URL returned 404. [NASA VTAD’s working model page](https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/) supplies the glTF. Search API URLs are catalogs, not audio clips. No invented landing audio or rover voice was attached.

## Media provenance

`lib/spirit-media.ts` stores source pages, credits, meaningful alternatives and inspected asset URLs for seven images: **PIA04183, PIA05223, PIA05547, PIA07104, PIA09491, PIA12142, PIA12078**. All seven JPEG URLs returned HTTP 200 with `image/jpeg`; the model URL returned HTTP 200 with `model/gltf-binary` during verification.

**PIA04155** is a real, silent Navcam sequence. NASA enhanced changing features; acquisition spans **8 minutes 21 seconds**. The source GIF contains **21 frames over 10.5 seconds of playback**. A local MP4 retains that accelerated playback and frame count, with no audio, so visitors have ordinary play/pause/seek controls. See `public/media/spirit/README.md` for reproduction and hashes. It never autoplays and pauses when the page is hidden or the media component is unmounted.

Drawings are AI-assisted teaching illustrations, not spacecraft reconstructions, recovered telemetry or historical photographs. Their label is supplied by the shared readers. Buttons and the wheel-track slider alter those drawings only; no game score, remote command, current contact or certification is implied.

## Checks completed

- Production `bun run build`: passed, including Spirit’s book and both JSON routes.
- `bun test scripts/`: **90 passed / 0 failed**.
- Web lint: no errors; existing unrelated hook warning in `app/auth/mobile/page.tsx` remains.
- `git diff --check`: passed.
- HTTP smoke checks: `/story`, Spirit scroll, chapter shelf, comic/prose URLs and both JSON routes returned **200**. The MP4 served **206** range responses with a valid MP4 header.
- Server-rendered scroll content includes all twenty moments and all five chapter anchors; comic tests verify four Spirit illustrations per chapter and unique SVG IDs.
- Recovery-state tests reject skipping the bypass and file-cleanup stages. Bookmark tests preserve Spirit-specific chapter/format selection.
- Rendered the twenty SVG scenes to a contact sheet with local librsvg for artwork inspection.

**Live browser QA is pending:** BrowserOS neo tools were unavailable after the server restart. HTTP/static checks do not verify client-side scrolling, modal focus, video playback, text resizing or mobile layout. Reconnect Neo and check portrait/landscape readers, all format switches, chapter jumps, the recovery sequence, the slider via pointer and keyboard, and pause-on-close behavior before calling browser QA complete.
