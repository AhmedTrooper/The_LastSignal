# NASA references to RoverVilla code

This document is a traceability map for reviewers, educators, and contributors. It shows which authentic mission records RoverVilla uses, what information is taken from them, and where that information enters the codebase.

RoverVilla is an independent educational project and is not affiliated with or endorsed by NASA. First-person machine voices, illustrations, game timing, and game physics are presentation devices. Dates, identifiers, coordinates, hardware descriptions, mission events, measurements, and scientific findings must remain linked to the records below.

## How to trace a claim

A reviewed story claim normally follows this path:

1. **Original record** — NSSDCA, NASA Science, NASA/JPL, NTRS, PDS, an instrument-team archive, or a mission journal.
2. **Evidence ledger** — a `*-sources.ts` file records the source URL, the relevant section, the supported evidence, conflicts, and limits.
3. **Shared story record** — `apps/web/lib/machine-books/*.ts` connects an event, hardware, readings, narrative beats, and sources.
4. **Evidence API** — reviewed editions expose the same record through `apps/web/app/api/stories/*/evidence/route.ts` where available.
5. **Reader or game** — UI code presents a shortened story, activity, or source-linked fact.

Do not treat an illustration, animation, generated waveform, procedural model, or game readout as telemetry.

## Authentic source families used

| Source family | What RoverVilla uses it for | Main code locations |
|---|---|---|
| [NASA Space Science Data Coordinated Archive (NSSDCA)](https://nssdc.gsfc.nasa.gov/nmc/) | COSPAR/catalog identity, launch and mission chronology, spacecraft and instrument descriptions, mission outcomes, and published coordinates | `packages/data/src/heroes.ts`, `apps/web/lib/*-sources.ts`, `apps/web/lib/machine-books/*.ts` |
| [NASA Science mission pages](https://science.nasa.gov/missions/) | Mission summaries, key dates, science results, hardware explanations, and end-of-mission context | Catalog, source ledgers, machine books, and game fact panels |
| [NASA/JPL](https://www.jpl.nasa.gov/) and [NASA Photojournal](https://science.nasa.gov/photojournal/) | Engineering updates, discoveries, operations, final-contact reporting, captions, and archive media identifiers | `apps/web/lib/*-sources.ts`, `apps/web/lib/*-media.ts`, `packages/data/src/nasa-photos.json` |
| [NASA Technical Reports Server (NTRS)](https://ntrs.nasa.gov/) | Mission reports, review-board findings, instrument/operations papers, and numerical qualifications | LCROSS, Surveyor, Mars Polar Lander, and other source ledgers and verification notes |
| [Apollo Lunar Surface Journal and Apollo Flight Journal](https://www.nasa.gov/history/alsj/) | Apollo 11/15 transcripts, elapsed times, hardware actions, alarms, surface science, and ascent | `apps/web/lib/machine-books/apollo.ts`, `apps/web/lib/lrv-sources.ts`, `apps/web/docs/apollo-nasa-source-pack.json` |
| [Planetary Data System](https://pds.nasa.gov/) and [NAIF SPICE](https://naif.jpl.nasa.gov/naif/) | Archived images/data, instrument products, geometry kernels, and machine-readable mission records | Shared catalog source links, Ingenuity and MER records, media manifests |
| [Lunar Reconnaissance Orbiter Camera](https://www.lroc.asu.edu/) and [HiRISE](https://www.uahirise.org/) | Later orbital observations of landing/impact sites and the limits of present-day identification | Source ledgers, media manifests, landing-location notes |
| [NASA Image and Video Library](https://images.nasa.gov/) | Archive-image IDs, captions, credits, and original media links | `packages/data/src/nasa-photos.json`, `packages/data/src/photos.ts`, `apps/web/lib/*-media.ts` |
| [NASA Astromaterials 3D](https://ares.jsc.nasa.gov/astromaterials3d/) | Apollo sample records and downloadable sample models | `apps/web/lib/lrv-sources.ts`, hardware/source links |

## Canonical code layers

| Layer | Data held there |
|---|---|
| `packages/data/src/heroes.ts` | Fifteen-machine catalog: identity, body, mission dates, coordinates, profile facts, hardware summaries, source links, and archive references shared by web and mobile |
| `packages/data/src/wiki/*.ts` | Longer mission background and timelines used by profile views |
| `packages/data/src/nasa-photos.json` | NASA/JPL image identifiers, captions, credits, and source URLs |
| `apps/web/lib/*-sources.ts` | Reviewed evidence ledgers with source, locator, evidence summary, uncertainty, and rejected/qualified claims |
| `apps/web/lib/machine-books/*.ts` | Source-backed chapter events, hardware, readings, related sources, discoveries, and narrative beats |
| `apps/web/lib/*-media.ts` | Mission-specific archive media and source attribution |
| `apps/web/app/api/stories/*/evidence/route.ts` | Machine-readable evidence packages for reviewed editions |
| `apps/web/docs/*verification*.md` and `apps/web/docs/*source*.md` | Human review notes, source checks, and unresolved limitations |

## Mission-by-mission traceability

### Moon missions

| Explorer | Authentic records and data used | Evidence and story code |
|---|---|---|
| **Ranger 7** | [NSSDCA 1964-041A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1964-041A), its [television experiment record](https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=1964-041A-01), [NASA Science](https://science.nasa.gov/mission/ranger-7/), [NASA History](https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/), LPI Ranger frames, and LROC. Used for identity, six-camera/Vidicon hardware, image cadence/count, approach, impact, and archive frames. | Catalog: `packages/data/src/heroes.ts`; inline ledger and chapters: `apps/web/lib/machine-books/ranger.ts`; flight/frame data: `apps/web/lib/ranger-dive.ts`; media: `apps/web/lib/ranger-media.ts` |
| **Surveyor 1** | [NSSDCA 1966-045A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A), [NASA Science](https://science.nasa.gov/mission/surveyor-1/), JPL landing/mission reports, NTRS technical reports, and LROC. Used for propulsion and landing sequence, camera operation, soil interaction, thermal/power survival, later contact, and orbital identification. | Ledger: `apps/web/lib/surveyor-sources.ts`; chapters: `apps/web/lib/machine-books/surveyor.ts`; evidence API: `apps/web/app/api/stories/surveyor-1/evidence/route.ts`; review: `apps/web/docs/surveyor-nasa-verification.md` |
| **Apollo 11 Lunar Module Eagle** | [NSSDCA 1969-059C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C), [NASA Apollo 11](https://www.nasa.gov/mission/apollo-11/), Apollo Flight Journal, Apollo Lunar Surface Journal, and NASA archive imagery. Used for LM stages, undocking, 1201/1202 alarms, descent/landing, surface hardware and experiments, ascent, and what remained on the Moon. | Catalog: `packages/data/src/heroes.ts`; chapters and transcript locators: `apps/web/lib/machine-books/apollo.ts`; source pack: `apps/web/docs/apollo-nasa-source-pack.json`; media: `apps/web/lib/eagle-media.ts` |
| **Apollo 15 Lunar Roving Vehicle** | [NSSDCA LRV record](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html), [NSSDCA Apollo 15](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C), NASA SP-4029, NASA Apollo 15 history, Apollo journals, and NASA Astromaterials sample 15016. Used for chassis, wheels, batteries, steering, navigation, deployment, traverses, samples, distance/time totals, and final parking qualifications. | Ledger and typed facts: `apps/web/lib/lrv-sources.ts`; chapters: `apps/web/lib/machine-books/apollo-15-rover.ts`; evidence API: `apps/web/app/api/stories/apollo-15-rover/evidence/route.ts`; media: `apps/web/lib/lrv-media.ts` |
| **LCROSS** | [NSSDCA 2009-031B](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-031B), [NASA Science](https://science.nasa.gov/mission/lcross/), NTRS flight-operations/results records, NASA visualizations, and later instrument-team work. Used for Centaur/LCROSS sequence, impact timing and speed, plume observation, spectroscopy, water estimate with uncertainty, and later crater research. | Ledger: `apps/web/lib/lcross-sources.ts`; chapters: `apps/web/lib/machine-books/lcross.ts`; evidence API: `apps/web/app/api/stories/lcross/evidence/route.ts`; review: `apps/web/docs/lcross-nasa-verification.md` |
| **GRAIL Ebb and Flow** | [NSSDCA GRAIL-A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-046A), [NSSDCA GRAIL-B](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-046B), [NASA Science](https://science.nasa.gov/mission/grail/), NASA image records, and LROC. Used for twin identities, masses, orbit insertion, range-rate method, MoonKAM, gravity products, source-date conflict, and controlled impacts. | Ledger: `apps/web/lib/grail-sources.ts`; chapters: `apps/web/lib/machine-books/grail.ts`; evidence API: `apps/web/app/api/stories/grail/evidence/route.ts`; review: `apps/web/docs/grail-nasa-verification.md` |

### Mars missions

| Explorer | Authentic records and data used | Evidence and story code |
|---|---|---|
| **Viking 1** | [NSSDCA 1975-075C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C), [NASA Science](https://science.nasa.gov/mission/viking-1/), NASA/JPL biology-experiment and imaging records. Used for landing, cameras, meteorology, sampler/biology instruments, experimental outcomes, uncertainty, and mission end. | Ledger: `apps/web/lib/viking-sources.ts`; chapters: `apps/web/lib/machine-books/viking.ts`; evidence API: `apps/web/app/api/stories/viking-1/evidence/route.ts`; review: `apps/web/docs/viking-1-nasa-verification.md` |
| **Viking 2** | [NSSDCA 1975-083C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C), [NASA Science](https://science.nasa.gov/mission/viking-2/), NASA/JPL experiment, frost, weather, and imaging records. Used for Utopia Planitia operations, biology/chemistry context, seasonal frost, power/communications, and mission end. | Ledger: `apps/web/lib/viking-two-sources.ts`; chapters: `apps/web/lib/machine-books/viking-two.ts`; evidence API: `apps/web/app/api/stories/viking-2/evidence/route.ts`; review: `apps/web/docs/viking-2-nasa-verification.md` |
| **Mars Pathfinder and Sojourner** | [NSSDCA 1996-068A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A), [NASA Science](https://science.nasa.gov/mission/mars-pathfinder/), NASA history, and contemporary JPL releases. Used for airbag landing, rollout, rover/lander roles, APXS, hazard avoidance, travel/images/weather totals, last data, later carrier detections, and unknown final rover motion. | Ledger: `apps/web/lib/pathfinder-sources.ts`; chapters: `apps/web/lib/machine-books/pathfinder-sojourner.ts`; evidence API: `apps/web/app/api/stories/pathfinder-sojourner/evidence/route.ts`; media: `apps/web/lib/pathfinder-media.ts` |
| **Mars Polar Lander** | [NSSDCA 1999-001A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1999-001A), [NASA Science](https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/), and the Mars Polar Lander/Deep Space 2 loss review. Used for mission sequence, loss of contact, absence of descent telemetry, the review board's probable sensor/software sequence, and uncertainty about the final site. | Ledger: `apps/web/lib/mpl-sources.ts`; chapters: `apps/web/lib/machine-books/mars-polar-lander.ts`; evidence API: `apps/web/app/api/stories/mars-polar-lander/evidence/route.ts`; review: `apps/web/docs/mars-polar-lander-nasa-verification.md` |
| **Spirit** | [NSSDCA 2003-027A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A), [NASA Science](https://science.nasa.gov/mission/mer-spirit/), JPL releases, NASA Photojournal, PDS, and HiRISE. Used for landing/traverse, instruments, wheel failure, exposed silica and its interpretation, winter operations, final contact, and later orbital imaging. | Ledger: `apps/web/lib/spirit-sources.ts`; chapters: `apps/web/lib/machine-books/spirit.ts`; evidence API: `apps/web/app/api/stories/spirit/evidence/route.ts`; review: `apps/web/docs/spirit-nasa-verification.md` |
| **Opportunity** | [NSSDCA 2003-032A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A), [NASA Science](https://science.nasa.gov/mission/mer-opportunity/), JPL engineering/science releases, Photojournal, PDS, and HiRISE. Used for airbag landing, hematite-rich spherules, Purgatory recovery, marathon distance, memory/power operations, 2018 dust opacity, final contact, and mission closeout. | Catalog: `packages/data/src/heroes.ts`; inline ledger and chapters: `apps/web/lib/machine-books/opportunity.ts`; review: `apps/web/docs/opportunity-source-review.md`; media: `apps/web/lib/opportunity-media.ts` |
| **Phoenix** | [NSSDCA 2007-034A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A), [NASA Science](https://science.nasa.gov/mission/phoenix/), NASA/JPL releases, Photojournal, and HiRISE. Used for landing, robotic-arm/TEGA/MECA operations, exposed ice and sublimation, water/perchlorate/snow findings, declining power, last signal, and later orbital views. | Ledger: `apps/web/lib/phoenix-sources.ts`; chapters: `apps/web/lib/machine-books/phoenix.ts`; evidence API: `apps/web/app/api/stories/phoenix/evidence/route.ts`; review: `apps/web/docs/phoenix-nasa-verification.md` |
| **InSight** | [NSSDCA 2018-042A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A), [NASA Science](https://science.nasa.gov/mission/insight/), NASA/JPL mission releases, Photojournal, and published mission results. Used for landing, SEIS deployment, marsquakes, HP3, interior findings, dust/power decline, and final contact. | Ledger: `apps/web/lib/insight-sources.ts`; chapters: `apps/web/lib/machine-books/insight.ts`; evidence API: `apps/web/app/api/stories/insight/evidence/route.ts`; review: `apps/web/docs/insight-story-verification.md` |
| **Ingenuity** | [NSSDCA MARS2020H](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MARS2020H), [NASA Science](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/), JPL flight/end reports, PDS Helicam, NAIF SPICE, Photojournal, and HiRISE. Used for hardware/mass, first flight, 72-flight record, flight geometry/media, final blade damage, and post-flight investigation. | Ledger: `apps/web/lib/ingenuity-sources.ts`; chapters: `apps/web/lib/machine-books/ingenuity.ts`; evidence API: `apps/web/app/api/stories/ingenuity/evidence/route.ts`; review: `apps/web/docs/ingenuity-story-verification.md` |

## Game fact traceability

The game mechanics are illustrative. Source-backed facts shown around each game are defined in its server page, while the interactive mechanics live in the neighboring `game.tsx`.

| Game | Authentic data shown | Source/code location |
|---|---|---|
| **Touchdown** | The shared fifteen-machine catalog, mission locations, mission echoes, archive photos, and wiki summaries; flight/drive mechanics are fictionalized practice | `apps/web/app/games/landing/page.tsx`, `story.ts`, and the shared `packages/data` catalog |
| **Last Pictures** | Ranger 7's 4,308 images, 17-minute sequence, first-image altitude, impact speed, and Mare Cognitum | `apps/web/app/games/ranger-7-dive/page.tsx`; NSSDCA, NASA History, NASA Science |
| **Ebb & Flow** | Two-spacecraft range-rate method, mascons, mission chronology, and controlled impact | `apps/web/app/games/grail-gravity/page.tsx`; NSSDCA and NASA Science |
| **Into the Plume** | LCROSS/Centaur impact sequence, timing/speed, water estimate with uncertainty, and result announcement | `apps/web/app/games/lcross-impact/page.tsx`; NSSDCA, NASA Science, NTRS |
| **Trust the Signal** | Mars Polar Lander's last contact, missing descent telemetry, probable leg-sensor/software sequence, and zero surface signals | `apps/web/app/games/polar-lander-forensics/page.tsx`; NASA Science and loss-review report |
| **Is Anything Alive?** | Viking biology experiment set, organic-chemistry context, inconclusive interpretation, and later perchlorate context | `apps/web/app/games/viking-biology/page.tsx`; NASA Science and JPL |
| **Marsquake Hunter** | SEIS deployment, first likely marsquake, published detection total, and final contact | `apps/web/app/games/insight-seismology/page.tsx`; NASA Science, NASA/JPL, Photojournal |
| **Thin Air** | Ingenuity mass, first-flight date/height/duration, 72-flight total, final flight, and blade damage | `apps/web/app/games/ingenuity-flight/page.tsx`; NASA Science, NASA/JPL |
| **Chasing Sunshine** | MER design life, Spirit's last contact, Opportunity's distance, and 2018 atmospheric optical depth | `apps/web/app/games/mer-twins/page.tsx`; NASA Science and NASA/JPL |

Every game shell states that compressed speeds, timings, drawings, and controls are not real spacecraft telemetry.

## Media, coordinates, and uncertainty

- **Archive photographs:** IDs, captions, credits, and original links live in `packages/data/src/nasa-photos.json`; mission selections live in `apps/web/lib/*-media.ts`.
- **Coordinates:** catalog coordinates live in `packages/data/src/heroes.ts`. Mission ledgers record reference-frame, approximation, conversion, and “applies to” limits where reviewed.
- **Later orbital images:** LROC and HiRISE records can identify a site or candidate hardware without proving present electronic health.
- **Conflicting published values:** source-specific values remain attributed rather than averaged into a new number.
- **Unknown values:** exact final rover positions, unobserved failure moments, and current electronics remain `null` or explicitly unknown when the cited source does not establish them.
- **AI-assisted media:** illustration metadata and context are separate from archive-photo records. AI art is not evidence for geometry, terrain, telemetry, or hardware state.

## Reviewer checklist

For any date, number, coordinate, quote, or engineering claim:

1. Find the mission in the matrix above.
2. Open its source ledger or inline source table.
3. Follow the original URL and locator.
4. Confirm the UI wording does not claim more precision than the source.
5. Confirm imagined narration is not presented as a recorded transmission.
6. Confirm game values are labelled as illustrative unless they are explicitly displayed as a cited fact.

When a claim cannot complete that chain, it should be qualified, marked unknown, or removed.
