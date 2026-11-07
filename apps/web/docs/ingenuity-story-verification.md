# Ingenuity: five stories, not an unverified status feed

Public entry is `/heroes/ingenuity/story`; the comic/prose reader uses `/heroes/ingenuity/book?read=1&format=…`. The profile route is unchanged and remains unlisted. No dialogue hub, separate game, live control, or automatic commit has been added.

The five chapters cover first flight, Flight 6’s timing anomaly, Flight 26’s photographs of discarded landing equipment, the winter sensor fallback, and the final flight/possible stationary testbed. They use twenty common beats across story, comic, prose and narration scripts. The new edition is available from `/story`; the homepage remains capped at its existing three stories.

## Downloadable records

- `/api/stories/ingenuity/evidence`: NASA source summaries/locators, chapters, image credits, media URLs and omitted/qualified draft claims. Summaries are not verbatim quotations.
- `/api/stories/ingenuity/narration`: exact imagined narration text and stable moment IDs. No produced narration recordings or durations have been invented.

## Corrections to the supplied draft

- **Twenty years is possible storage capacity, not guaranteed operation.** NASA’s April 16, 2024 report confirms a previously uploaded stationary-testbed patch and explicitly discusses electrical failure and dust-related loss of power. This does not verify activity in 2026.
- **Flight 72’s cause is qualified.** NASA’s December 2024 investigation describes its most likely chain of events and acknowledges other viable scenarios. The edition does not present an eyewitness account of blades striking the ground.
- **Flight 6 does not establish a 50 ms shift.** The NASA account gives approximate onset at 54 seconds and inaccurate subsequent timestamps, not the draft’s exact offset or frame number. Navigation ignored camera images near touchdown; it did not physically switch off or repair the camera.
- **The sensor workaround was prepared earlier.** NASA’s June 2022 report says the fallback patch was prepared before Mars arrival. A failed inclinometer and cold-cycle risks do not prove a chip physically cracked or electronics “froze solid.”
- **Mass is not lower on Mars.** The story uses 1.8 kg mass and avoids confusing a weight-equivalent conversion with mass.
- **Registry fields are not imported.** The supplied `2020-052A-11` NSSDCA experiment URL returned “no data found” during inspection. An independent COSPAR/NORAD record for the helicopter has not been asserted.
- **Photo IDs and viewpoints must be checked.** PIA26243 is a color shadow image; PIA26244 is the helicopter’s navigation-camera rotor-shadow sequence, not the rover’s farewell view. This edition uses the verified PIA26238 rover mosaic for that viewpoint.
- **The original campaign was a demonstration, not a warranty.** NASA describes up to five test flights over thirty days.
- **No precise airfield coordinates or certification.** Unverified geodetic values, fictional instrument IDs and “officially certified” quiz feedback are not published.

## NASA evidence

The full ledger is `lib/ingenuity-sources.ts`, inspected on 2026-11-07. Core sources:

1. [Mission summary and key facts](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/)
2. [First-flight NASA release](https://www.nasa.gov/news-release/nasas-ingenuity-mars-helicopter-succeeds-in-historic-first-flight/)
3. [Wright Flyer fabric](https://science.nasa.gov/photojournal/pride-of-the-west-and-mars/)
4. [Flight 6 anomaly](https://science.nasa.gov/blog/surviving-an-in-flight-anomaly-what-happened-on-ingenuitys-sixth-flight/)
5. [Discarded entry hardware from Flight 26](https://www.nasa.gov/missions/mars-2020-perseverance/ingenuity-helicopter/nasas-mars-helicopter-spots-gear-that-helped-perseverance-rover-land/)
6. [Failed inclinometer and fallback plan](https://science.nasa.gov/blog/keeping-our-sense-of-direction-dealing-with-a-dead-sensor/)
7. [Final-flight investigation](https://www.jpl.nasa.gov/news/nasa-performs-first-aircraft-accident-investigation-on-another-world/)
8. [Final team downlink and potential data storage](https://www.nasa.gov/missions/mars-2020-perseverance/ingenuity-helicopter/nasas-ingenuity-mars-helicopter-team-says-goodbye-for-now/)

Media links were extracted from NASA pages, not generated from guessed PIA templates. The first-flight and Flight 6 sequences have written descriptions; the Flight 4 audio is labelled as a filtered/amplified microphone recording, separate from synthetic story narration. Teaching drawings show concepts without pretending to be measured telemetry or a real-time flight-control system.

## Mobile QA

Checked using BrowserOS neo's Chromium device emulation, not a physical iOS/Android device:

- Phone widths 320, 375 and 414 CSS pixels, plus a 768-pixel tablet layout; no horizontal overflow in the story or comic reader.
- Compact 320×568 and landscape 812×375 story stages, with reduced motion enabled; clouds, art and controls remain within their intended areas.
- Chapter selection, notes, selectable explanations and keyboard activation/closing work. Comic/book switching preserves the chapter when returning to the scroll story.
- All four comic panels and all four prose paragraphs render; text enlargement to 140% does not cause horizontal overflow.
- First-flight and Flight 6 videos and the rotor-hum MP3 loaded and played in muted decoding checks without media errors. Native controls remain available; media does not autoplay on page entry.
- The story back arrow returns to `/story`; checked reader links do not point at hidden profile or game routes.
- Changed the cover to the clearer, source-verified [PIA24581 preflight view](https://science.nasa.gov/photojournal/ingenuitys-blades-are-released/), photographed **April 8, 2021**. That date is distinct from the blade-unlocking event and the image publication date.
- Enlarged the top-bar Comic/Book targets to approximately 44×44 CSS pixels with compact phone spacing.

The working format/overflow/return-navigation flow is saved in BrowserOS as `check-mobile-machine-formats` for repeat checks.
