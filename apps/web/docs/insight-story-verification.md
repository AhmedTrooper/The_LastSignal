# InSight story edition: evidence and limits

This is a five-chapter adaptation of the supplied concept, **not a direct import of its JSON or its route recommendations**. Public entry is `/heroes/insight/story`; comic and prose readers use `/heroes/insight/book?read=1&format=…`. The legacy `/heroes/insight` page is untouched and unlisted. Homepage discovery remains capped at its existing three stories; InSight appears in `/story`.

The chapters run from Earth testing and the 2018 journey through deployment, the unsuccessful mole experiment, sand cleaning, retirement and later orbital observations. Each chapter has four shared story beats. Comic captions, prose and twenty scroll moments derive from the same text.

## Machine-readable records

- `/api/stories/insight/evidence`: NASA source summaries with locators, chapter records, image credits, media provenance and qualified or omitted draft claims. Summaries are **not verbatim quotations**.
- `/api/stories/insight/narration`: exact imagined-narration scripts and stable moment IDs. Recording URLs and durations remain null until real matching clips are attached. Browser speech, when available, is explicitly synthetic.
- `lib/insight-sources.ts`: source ledger inspected on 2026-11-07.
- `lib/insight-media.ts`: asset URLs extracted from NASA pages, not constructed from a presumed PIA naming scheme. NASA’s wind video is delivered by its linked JPL CDN; it is distinguished from story narration.

## Significant corrections to the supplied draft

| Draft claim | Treatment in this edition |
|---|---|
| PIA23047 depicts InSight’s shield | NASA identifies it as **Curiosity on the Clay Unit**. Replaced with InSight deployment image PIA22977, observed on NASA Photojournal. |
| The mole’s failure became a successful year-long deep thermometer | NASA reports the required depth was not achieved. The story explains soil/friction lessons without claiming completion of the intended heat-flow experiment. Probe length and the depth of its top are distinguished. |
| Sand cleaning bought exactly an extra year | The 2021 report gives **about 30 watt-hours per sol** and describes a helpful margin and delay of weeks, not that causal guarantee. |
| 1,830 km is Mars’s definitive current core radius | Later NASA reporting refines the core model. The story explains a liquid iron core and continuing analysis without treating an earlier estimate as timeless exact data. |
| LaRRI is “100% active in 2026” | Omitted. NASA describes intended use by possible future laser-equipped orbiters. No ranging result or current-condition verification is asserted. |
| Exact coordinates for instruments and debris | Omitted rather than interpolated. Independent geodetic/component evidence would be required. |
| PIA25686 is the final twilight photograph | Not imported. NASA’s retirement article calls PIA25680 **one of the last images**. This edition uses verified first/final selfie records and the 2024 orbital image instead. |
| The machine chose its fate or spoke the quoted dialogue | All first-person text is a labelled imagined retelling. Mission controllers made operational decisions. No fictional dialogue is stored as a historical quote. |
| MarCO escorted InSight on the same trajectory | NASA says the CubeSats flew on their own paths; the story preserves that distinction. |

## Evidence used

1. [NSSDCA InSight record](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A): identity and historical contact/end dates.
2. [NASA mission page](https://science.nasa.gov/mission/insight/): cleanroom caption, launch, landing and separate MarCO paths.
3. [NASA spacecraft description](https://science.nasa.gov/mission/insight/spacecraft/): solar span, grapple and intended versus achieved measurement.
4. [Wind measurements](https://www.jpl.nasa.gov/news/nasa-insight-lander-hears-martian-winds/) and [video with transcript](https://www.jpl.nasa.gov/videos/sounds-of-mars-nasas-insight-senses-martian-wind/): sensor roles and pitch/speed processing.
5. [SEIS deployment](https://www.jpl.nasa.gov/news/nasas-insight-places-first-instrument-on-mars/) and [Sol 128 record](https://science.nasa.gov/photojournal/insights-sol-128-seismic-event/): observation versus release dates; “likely” wording.
6. [Mole campaign end](https://www.nasa.gov/centers-and-facilities/jpl/nasa-insights-mole-ends-its-journey-on-mars/): friction, required depth and unsuccessful final attempt.
7. [Sand-cleaning trial](https://www.jpl.nasa.gov/news/nasas-insight-mars-lander-gets-a-power-boost/): technique and qualified energy gain.
8. [Mission retirement](https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/): two failed contact attempts, last contact and 1,319-marsquake tally.
9. [2023 core analysis](https://www.nasa.gov/missions/insight/nasa-insight-study-provides-clearest-look-ever-at-martian-core/) and [2024 orbital observation](https://www.nasa.gov/missions/insight/nasa-mars-orbiter-spots-retired-insight-lander-to-study-dust-movement/): science after contact ended.
10. [Future reflector concept](https://www.nasa.gov/solar-system/nasas-new-mars-rover-is-ready-for-space-lasers/): capability is not current-use evidence.

The teaching drawings and short selectable explanations are illustrations, not simulations of measured telemetry or controls for real equipment. Archived photos retain their own NASA credits and sources. No NPC “certification,” invented scientific instruments IDs, or separate game/profile route has been added.
