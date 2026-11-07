# Surveyor 1: verified story editions

Reviewed **2026-11-08**. The supplied master/story/dialogue JSON was treated as a draft, not imported verbatim. The new edition uses NASA records and the official NASA/GSFC/LROC instrument-team publications. Earlier local profile data and legacy story implementations remain separate and are not factual authority for this edition.

## Routes and shared text

- Scroll: `/heroes/surveyor-1/story`
- Chapter shelf: `/heroes/surveyor-1/book`
- Comic: `/heroes/surveyor-1/book?read=1&format=comic`
- Prose: `/heroes/surveyor-1/book?read=1&format=book`
- Sources, factual records, coordinates, media and chapter JSON: `/api/stories/surveyor-1/evidence`
- Narration production manifest: `/api/stories/surveyor-1/narration`

Five chapters share four beats each: twenty scroll moments and twenty comic panels. Prose is derived by `chapterParagraphs()` from the same text. Production narration entries remain missing until matching recordings are attached; the archive film is not the lander's voice.

| Chapter | Hardware connection | Primary sources |
| --- | --- | --- |
| A question in flight | Launch, attitude knowledge, antenna redundancy and uncertain deployment | [NSSDCA](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A), [June 16, 1966 report](https://www.jpl.nasa.gov/news/surveyor-i-lands-on-the-moon/), [Luna 9 precedence](https://apod.nasa.gov/apod/ap970907.html) |
| Three feet down | Radar marking, main braking, discarded casing, vernier control and shock absorption | [Landing report](https://www.jpl.nasa.gov/news/surveyor-i-lands-on-the-moon/), [TR 32-1023, Part I](https://ntrs.nasa.gov/api/citations/19690003886/downloads/19690003886.pdf) |
| A footprint and a picture | Camera mirror, scan modes, landing forces and local soil interpretation | [NASA history and images](https://www.nasa.gov/history/55-years-ago-surveyor-1-makes-a-soft-landing-on-the-moon/), [Part II scientific analysis](https://ntrs.nasa.gov/api/citations/19670000738/downloads/19670000738.pdf) |
| Through the long night | Power conservation, careful charging, battery overheating and one damaged radiator segment | [July 28, 1966 report](https://www.jpl.nasa.gov/news/surveyor-i-mission/), [Part II, Appendix A](https://ntrs.nasa.gov/api/citations/19670000738/downloads/19670000738.pdf) |
| The long shadow | Later contact, preserved imaging records and interpreting orbital illumination | [Mission summary](https://science.nasa.gov/mission/surveyor-1/), [LROC feature](https://www.lroc.asu.edu/images/13), [2016 coordinate table](https://lroc.im-ldi.com/data/support/downloads/2016_LROC_Coordinates_of_Human_Features.pdf) |

The full source ledger and locators are in `lib/surveyor-sources.ts`. Part I was inspected through NASA's [full-text transcription](https://ntrs.nasa.gov/api/citations/19690003886/downloads/19690003886.txt); Part II was downloaded and its relevant printed pages inspected, including the radiator photograph on printed p. 95 (PDF p. 104).

## Corrections that matter

1. **Source identities:** The draft NTRS ID `19660022949` describes launch-vehicle wind-induced oscillations, not Surveyor. Correct TR 32-1023 records are `19690003886` (Part I) and `19670000738` (Part II). LROC `/images/235` concerns Van de Graaff ejecta; the Surveyor feature is `/images/13`. `PIA00359` depicts Jupiter, not a footpad. NASA's history article provides the actual Surveyor images used here.
2. **First landing:** Surveyor 1 was the **first US lunar soft landing**. Luna 9 had already landed on February 3, 1966. Apollo Lunar Modules had **four legs**, not three-legged copies of Surveyor.
3. **Antenna:** A failed deployment indication is documented. Its exact cruise position and release time are unknown; the JPL report allows retro fire or touchdown. It was confirmed extended after landing. This was not reported as a fault likely to jeopardize the mission.
4. **Descent:** Radar marking and later retro ignition are different events. Accounts differ on cutoff heights and sub-second touchdown time. The edition gives June 2, 1966 and the documented **19 ms** contact span, without inventing an exact 4.3 m hover or recovered force curve.
5. **Soil:** Part II estimates footpad 2 bottom **4–8 cm below adjacent ground, assuming no crushing** (printed p. 78). The report explicitly says static bearing capacity was not conclusively determined from the dynamic landing data (pp. 83–84). Neither a universal 5–8 psi certificate nor safety at every Apollo landing site is asserted.
6. **Dust tests:** No disturbance was discernible in images during the cold nitrogen-jet tests. That does not establish that all rocket engines raise no lunar dust.
7. **Image counts:** The July 1966 release totals **11,150 = 10,338 + 812**. Later NASA accounts give **11,240 = 10,622 + 618**. The evidence ledger preserves both with their sources; the narrative says **more than 11,000** rather than silently merging them.
8. **Night and battery:** Contact returned **July 6**; photography resumed **July 7** in the contemporary report. A frozen-solid battery and thaw as the uniquely proven cause are not established. During overheating, operators reduced charging by turning the panel away. An internal short was suspected; temporary recovery was unexplained.
9. **Radiator:** A July 12 photograph shows **one broken Vycor thermal-radiator segment**, probably damaged during the night. The July report says its performance effect was negligible. It was **not the camera mirror**, and it was not established as the cause of battery overheating. Surface and electronics temperatures are not interchangeable.
10. **Commands and contact:** Part I's **over 100,000** refers to commands sent from Earth, not returned sensor samples. Final contact is **January 7, 1967**, distinct from July imaging completion. No exact farewell time, invented final words, warranty or lifetime multiplier is supplied.
11. **Position:** The LROC team's July 28, 2016 table gives mean latitude **-2.4745**, east longitude **316.6602**, elevation **-1889 m**, and tabulated uncertainty **5.6 m**, in the Mean Earth/polar-axis system. It uses GLD100 for the elevation model and separately describes LOLA-corrected orbital kernels. The draft's -1663 m and debris coordinates are not adopted.
12. **Shadow:** Almost 15 m describes the published orbital view, not a permanent length or evidence of working electronics. The shadow activity uses an ideal vertical mast on flat ground and reports **mast heights**, not measured lunar meters. It does not certify every leg's condition.

## Media and interaction design

Eight archival entries include launch, schematic, footpad, color composite, panorama, surface shadow, orbital view and the retained-caption mission-report page. Credits and meaningful text alternatives identify photographs, composites and diagrams separately. Images are not inferred from PIA URL templates.

The captioned 2016 NASA/JPL retrospective is compressed for the native video player. It includes historical footage, illustrations and narration—not continuous onboard footage or a live radio feed. It does not autoplay; it pauses on hidden-page events and component unmount. See `public/media/surveyor-1/README.md` for URLs, conversion commands and hashes.

The activities are integrated into chapter notes and both book formats:

- Compare what antenna evidence establishes before and after landing.
- Step through the hardware handover during descent, without a fictitious flight timer or telemetry.
- Aim a teaching camera view and compare images with landing measurements.
- Compare charging, overheating and the radiator evidence.
- Adjust the illustrative Sun elevation with a native slider or preset buttons; compare normalized shadow length.

No new profile hub, fake archive audio, independent game route or certification was added. Machine entry links continue opening the scroll story. Other editions and the homepage's three featured stories are preserved.

## Verification completed

- Production `bun run build`: passed, including Surveyor book and both JSON routes.
- `bun test scripts/`: **96 passed, 0 failed**; tests cover shared text, source hosts, SVG IDs, bookmarks, descent order, shadow geometry, media files and corrected draft claims.
- Lint/type checks: passed; the unrelated existing hook warning in `app/auth/mobile/page.tsx` remains.
- BrowserOS neo: twenty moments checked at **320×568**, **375×812** and **812×375**, with no page/header overflow or cloud overlap with bottom controls.
- Comic/prose format switching and return to scroll: passed. All four shared prose paragraphs/panels remained available.
- Native keyboard slider Home/End selected **15°/75°**, reporting **3.73/0.27 mast heights**.
- Descent buttons advanced through main braking, discarded casing, controlled descent and touchdown.
- Chapter chooser, notes modal, charging choice and modal close: passed.
- Video reached ready state 4, played with **88 caption cues**, and paused when its chapter was left.
- Comic text increased to **1.4×** at 320 px without overflow. Footpad, color composite and mosaic decoded after scrolling them into view, exercising lazy loading.
- Reduced-motion preference disabled progress transitions. Both JSON routes returned HTTP 200 with five chapters/twenty moments.

Browser emulation occasionally scaled pointer coordinates incorrectly, so keyboard activation was used for format/navigation checks. The saved mobile-format helper was corrected to use keyboard activation for the return link. Browser session reconnects required fresh own tabs; user tabs were not intentionally navigated.
