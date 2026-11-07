# LCROSS: verified story editions

Reviewed **2026-11-08**. The supplied master/story/dialogue datasets and earlier local records were treated as drafts. The new edition follows NASA mission publications and a NASA-coauthored LPI instrument-team abstract, with uncertainty retained.

## Published routes

- Scroll: `/heroes/lcross/story`
- Chapter shelf: `/heroes/lcross/book`
- Comic: `/heroes/lcross/book?read=1&format=comic`
- Prose: `/heroes/lcross/book?read=1&format=book`
- Sources, facts, chapters, images, media and research notes: `/api/stories/lcross/evidence`
- Narration production manifest: `/api/stories/lcross/narration`

Five chapters × four shared beats = twenty scroll moments and comic panels. Prose comes from the same beats through `chapterParagraphs()`. No recorded machine narration is fabricated: all twenty production audio entries remain missing until matching recordings exist. The NASA archive visualization is separate from narration.

| Chapter | Hardware-to-science connection | Primary sources |
| --- | --- | --- |
| A stage with another job | Structural reuse, a spent launch stage, nine complementary instruments and an experiment | [NASA overview](https://www.nasa.gov/general/what-is-lcross-the-lunar-crater-observation-and-sensing-satellite/), [Mission](https://science.nasa.gov/mission/lcross/), [NSSDCA](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-031B) |
| The fuel scare | Sensor fallback, rate noise, excessive thruster firing, restored measurements and new safeguards | [Flight operations](https://ntrs.nasa.gov/api/citations/20100026403/downloads/20100026403.pdf), [Shooting the Moon](https://ntrs.nasa.gov/api/citations/20130014470/downloads/20130014470.pdf) |
| Two impacts, one experiment | Separation, a braking maneuver, impact energy and the observing interval | [Mission](https://science.nasa.gov/mission/lcross/), [Registry](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-031B), [Operations](https://ntrs.nasa.gov/api/citations/20100026403/downloads/20100026403.pdf) |
| Light with a water clue | Spectroscopy, independent observations and a local estimate with uncertainty | [NASA results release](https://www.nasa.gov/news-release/nasa-missions-uncover-the-moons-buried-treasures/), [NASA water-extraction report](https://ntrs.nasa.gov/api/citations/20120009955/downloads/20120009955.pdf), [Overview](https://www.nasa.gov/general/what-is-lcross-the-lunar-crater-observation-and-sensing-satellite/) |
| The impact that kept teaching | Downlink limits, preserved records, radar, sensitive imaging and later crater research | [Operations](https://ntrs.nasa.gov/api/citations/20100026403/downloads/20100026403.pdf), [LAMP visualization](https://svs.gsfc.nasa.gov/3785/), [LPI 2024 instrument-team abstract](https://www.hou.usra.edu/meetings/lpsc2024/pdf/1913.pdf), [ShadowCam](https://www.nasa.gov/missions/lro/nasa-moon-camera-mosaic-sheds-light-on-lunar-south-pole/) |

Full evidence summaries and locators are in `lib/lcross-sources.ts`. NASA's full-text versions of the [operations paper](https://ntrs.nasa.gov/api/citations/20100026403/downloads/20100026403.txt), [project-manager book](https://ntrs.nasa.gov/api/citations/20130014470/downloads/20130014470.txt) and [water-extraction report](https://ntrs.nasa.gov/api/citations/20120009955/downloads/20120009955.txt) were inspected. Both pages of the instrument-team conference abstract were inspected in the browser PDF viewer.

## Corrections and qualifications

1. **Identity:** NSSDCA confirms shepherding spacecraft **2009-031B**. The proposed separate Centaur **2009-031C** catalog lookup returned no data. Its independent COSPAR and SATCAT fields remain null, rather than claiming a verified ID from the draft.
2. **Hardware:** The payload contains **five cameras, three spectrometers and a photometer**, not nine cameras. The ring was an engineered structural starting point, not packing foam. Design-summary mass, power and battery figures differ from flight-report values; unsupported single-number specifications are not copied.
3. **Fuel crisis:** A brief IRU fault triggered fallback to noisier star-tracker rate estimates without suitable filtering. The controller over-corrected with nearly continuous thruster firing. The IRU remained functional; restoring its rates, revising fault-persistence rules, improving backup control, and changing operations all mattered. It was not a verified punctured fuel tank or Earth hiding the star tracker.
4. **Fuel amount:** NASA's summary says **140 kg**; the operations paper says **nearly 152 of 202 kg remaining**. The narrative uses **more than half**, and the evidence JSON preserves both attributed values. The manager's **40 grams / about 33 thimbles per day** description is not a guaranteed rate or player-generated telemetry.
5. **Target and timing:** September 11 announced Cabeus A; Cabeus proper was selected later in September. The narrative keeps the selection process without an incorrect September 11 switch. Separation is recorded at **01:50 UT on October 9**, followed by a braking maneuver and roughly four minutes between impacts. Observing between impacts is not the same as spending every second inside one uniform cloud.
6. **Impact math:** The draft combines a 6.5 GJ value with parameters whose kinetic-energy calculation is about 7.2 GJ. No mixed-parameter energy, TNT equivalent, exact excavated depth or spectacle is treated as measured telemetry. The experiment used motion to expose material.
7. **Plume geometry:** Width, height, illuminated fraction and field of view are different quantities. No unverified 833 m boundary or 6–8 km height is assigned to the visible-camera frame. The plume slider reveals a drawing; it does not reproduce altitude or elapsed time.
8. **Water:** **5.6 ± 2.9% by mass** is a reported estimate for regolith at the studied impact site, not a purity claim or a uniform concentration for the whole south pole. The uncertainty is in percentage points. Pure ice grains in a plume do not mean a crater is pure ice. The draft's inconsistent water-mass/bucket conversions are omitted.
9. **Other materials:** NASA's 2010 release describes additional volatiles and light metals, with silver qualified as possible. Exact spectral band centers, guaranteed metal identifications, a single cometary origin and an exact two-billion-year age are not invented.
10. **Downlink:** The operations paper describes oversubscription, dropped images and reduced sampling rates. The story does not claim every frame or byte reached Earth.
11. **Later crater:** The 2024 instrument-team work identifies a roughly **22 m candidate Centaur crater**, compared with larger earlier interpretations. It does not confirm two newly photographed LCROSS craters. No unvalidated twin-crater coordinates/elevations are published.
12. **Different sensors:** ShadowCam is on **Danuri**, not LRO, and uses faint reflected light. Mini-RF supplies radar illumination; thermal instruments sense emitted radiation. Switching among teaching modes does not turn a drawing into a real ShadowCam image.
13. **Resources:** Detection is not a working extraction plant, available rocket fuel or a guaranteed Artemis schedule. Further mapping and engineering are needed. No flight-director certification or NASA endorsement is implied.

## Media provenance

`lib/lcross-media.ts` keeps four kinds of media separate:

- The NASA **artist's concept** of LCROSS/Centaur separation, labelled as a rendering.
- NASA's actual **visible-camera plume image**, captioned approximately 20 seconds after impact.
- A NASA-released **near-infrared lunar view**, used as a context image. Its exposure date is not established here and it is not assigned to a terminal-impact moment.
- A NASA SVS **data-driven LAMP visualization**, not a camera frame. The signal is enhanced by subtracting the previous orbit's observations.

The 30-second silent SVS movie and its still were downloaded with BrowserOS neo and copied locally without transcoding. The player has native play/pause/seek, does not autoplay, and pauses when its component unmounts or the page becomes hidden. See `public/media/lcross/README.md` for source URLs, credit and hashes.

Teaching art is AI-assisted and labelled by the shared readers. Illustrative signals, paths and lighting are not recovered telemetry. No conversational profile hub, fake archive audio, external game route or change to other mission stories was added. The homepage still features only its existing three editions.

## Checks completed

- `bun run build`: passed, including LCROSS book and both JSON routes.
- `bun test scripts/`: **102 passed / 0 failed**. Tests cover shared text, source hosts, unique SVG IDs, reading links/bookmarks, recovery ordering, native controls, media files and rejected draft claims.
- Lint/type checks: passed; the unrelated existing hook warning in `app/auth/mobile/page.tsx` remains.
- BrowserOS neo: all **twenty moments** checked at **320×568**, **375×812** and **812×375**, with no page/header overflow or cloud overlap with bottom controls.
- Comic/prose switching and return to scroll passed; each format retained all four beats.
- Recovery controls restored rate measurements before safeguards could be revised.
- Impact controls advanced through observing interval, Centaur impact, observation/transmission and shepherd impact.
- Keyboard End revealed the full plume drawing; the location choice explained the local scope of the water estimate.
- Chapter chooser, notes modal, reported-number choice and close action passed. Reduced motion disabled progress transitions.
- The native video played at ready state 4 with **30-second duration**, and paused when leaving its chapter.
- Both evidence/narration HTTP routes returned **200**, with five chapters and twenty moments respectively.

The browser sometimes throttled animation-frame checks in a background tab; the dedicated QA tab was brought forward for those measurements. Inline PDF downloads did not finish, so the paper was inspected in the native viewer rather than claiming a downloaded archive copy.
