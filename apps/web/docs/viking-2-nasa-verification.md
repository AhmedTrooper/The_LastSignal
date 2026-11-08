# Viking 2: verified story editions

Reviewed **2026-11-08**. The supplied master/story/dialogue JSON and existing Viking files were treated as drafts. The new edition preserves the legacy implementation and uses inspected NASA sources instead.

## Routes and shared content

- `/heroes/viking-2/story`
- `/heroes/viking-2/book` and `?read=1&format=comic` / `?read=1&format=book`
- `/api/stories/viking-2/evidence`
- `/api/stories/viking-2/narration`

Five chapters, twenty shared beats. Comic captions, prose and narration scripts come from the same text. All twenty produced narration clips remain missing; no archival recording or farewell is fabricated.

| Chapter | Hardware-to-science connection |
| --- | --- |
| A leaning arrival | Autonomous guidance, orbiter attitude backup and low-gain engineering data |
| Beneath Mister Badger | Camera-verified rock movement, sampling location and a later analysis plan |
| Ears that heard the wind | Instrument placement, environmental noise and an ambiguous seismic event |
| A winter postcard | Repeated images, frost and an attributed formation hypothesis |
| A relay and a resting place | Recording, orbital relay, batteries and later terrain-based identification |

Exact source URLs and evidence locators are in `lib/viking-two-sources.ts`. NASA Science, NSSDCA, exact image-library API items and the official HiRISE caption were inspected in BrowserOS neo. Full-text versions of [NASA's landing history](https://ntrs.nasa.gov/api/citations/19840027187/downloads/19840027187.txt) and [the final seismometry report](https://ntrs.nasa.gov/api/citations/19810013458/downloads/19810013458.txt) were inspected, including the Viking 2 descent account and Sol 80 interpretation.

## Corrections and uncertainty

1. **Not completely blind:** The detailed history describes orbiter gyro-power failure, high-gain link loss and automatic backup stabilization. A small stream of engineering information came through the low-gain antenna during descent. The supplied complete three-hour blackout and verified electrical short are not adopted.
2. **Dates and tilt:** NSSDCA and NASA Science differ on separation times, landing/received timing, April 11–12 mission end and **8.2° versus 8.5°** tilt. The JSON preserves attributed values. The story uses a leaning lander with a leg on a rock, not a unique footpad number or rock diameter.
3. **Mister Badger is the rock:** PIA00528's NASA caption names the **rock**, not the arm. It describes a verified October 8 push and sampling **planned for October 11**, with analysis later. There is no verified immediate scoop before sunlight destroyed the material, million-year shelter age or named Bonneville site in this caption.
4. **Unverified arm/chemistry details:** Exact shroud and temperature-sensor failure sequences, sulfate composition, bound-water percentage and perchlorate identification under the rock are omitted. Sampling context is not proof of life or zero carbon.
5. **Sol 80 remains ambiguous:** The final report states there was no wind measurement within **20 minutes** of the event, so a gust could not be excluded. Magnitude and distance comparisons depend on assumed properties. The report explicitly says the record did not permit direct interior inferences. No fake waveform or zero-wind reading is shown.
6. **Later lessons:** Ground placement, sensitivity and networks are recommendations, not proof that Viking established the planet's interior structure or all of its tectonic behavior. InSight's later measurements do not confirm Viking's event retrospectively.
7. **Frost dates and camera:** PIA00571 was taken **18 May 1979** and relayed by Viking Orbiter 1 **7 June**. NASA metadata lists **Camera 1**. The addition date in 1997 is not an exposure date.
8. **Frost interpretation:** NASA introduces the dust/water/CO₂ deposition mechanism as what scientists believe. The residue includes **water and dust**. The earlier about-100-day persistence is not an annual guarantee. No unique thermal threshold, pure-ice claim or confirmed deposit directly under the lander is invented.
9. **Relay and endurance:** The frost relay through Orbiter 1, 40 Mbit recorder, UHF link and **1,281 Mars days** are supported. The draft's exact seven-week schedule, TWT-switch diagnosis, zero battery meters and winter-only failure cause are not independently established here.
10. **HiRISE:** PSP_001501_2280 was acquired **21 November 2006**; its original scale is **31 cm/pixel**, versus **25 cm/pixel** after map projection. Lander identification is confirmed by terrain comparison, while entry hardware is described as likely/candidates. Some image blur is acknowledged. Image-center coordinates, exact MOLA elevations and electronics status are not inferred.

## Media and teaching controls

NASA's mission-page PIA01522 supplies the cover. PIA00528 and PIA00571 JPEG URLs were observed on their live NASA Photojournal pages. PIA00568 uses the exact API item's JPEG preview, because its canonical API original is TIFF. PIA00569 uses its observed original JPEG. Each image keeps its own caption, source and credit.

The rock push, low-gain backup, wind ambiguity and frost interpretations use native choice buttons. Frost reveal uses a keyboard-accessible range plus reveal/reset buttons; percentage denotes a drawing, not temperature or ice depth. The relay state model requires storing an observation, passing it to an orbiter and forwarding it to Earth. Teaching signals and paths are not measured telemetry.

No conversational profile hub, fake archive audio, external game or official scientist certification was added. The homepage still features only its existing three stories. Catalogue/navigation separation is unchanged. Scope is `apps/web` only.

## Checks completed

- `bun run build`: passed, with book and both JSON routes.
- `bun test scripts/`: **117 passed / 0 failed**, including Viking 1 regression checks.
- Lint: no errors; existing unrelated `app/auth/mobile/page.tsx` hook warning remains.
- BrowserOS neo: twenty moments passed at **320×568** and **375×812**, without page overflow, inner-cloud text overflow or overlap with heading/controls.
- Landscape **812×375**: twenty moments passed in a fixed responsive frame. BrowserOS sometimes reset device emulation mid-loop, so mixed-size batches were rejected rather than reported as valid landscape tests.
- Comic/prose switching and keyboard return to scroll retained four shared beats.
- Chapter chooser, notes, rock sampling-plan choice and close worked. The real rock image decoded.
- Keyboard End fully revealed the frost drawing; frost and summer media decoded.
- Relay controls reached the Earth-forwarding state in order.
- Evidence/narration endpoints returned **HTTP 200**, with five chapters and twenty missing recordings.

The reusable browser layout helper was updated to use a bounded responsive frame instead of relying on device-emulation persistence.
