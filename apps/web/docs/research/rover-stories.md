# Two real journeys, one shared format

These editions use the existing `MachineBook` structure: eight chronological event chapters, each with four short lines and four factual details. Scroll moments, comic captions and prose paragraphs all derive from that one source. First-person wording is an attributed retelling, not a spacecraft transmission. No machine emotions, farewell quotations or recovered telemetry are invented.

## Read them

| Machine | Scroll | Comic / book | Source JSON |
|---|---|---|---|
| Apollo 15 rover | `/heroes/apollo-15-rover/story` | `/heroes/apollo-15-rover/book?read=1&format=comic` or `format=book` | `/api/stories/apollo-15-rover/evidence` |
| Pathfinder & Sojourner | `/heroes/pathfinder-sojourner/story` | `/heroes/pathfinder-sojourner/book?read=1&format=comic` or `format=book` | `/api/stories/pathfinder-sojourner/evidence` |

The `.json` files beside this document are exports of those evidence endpoints. Regenerate them from `apps/web` with `bun scripts/export-rover-evidence.ts`.

## Apollo 15's chapter spine

1. A car in a cupboard — folding, metal wheels and finite stored power.
2. The wheels unfold — launch, lunar arrival, deployment and checkout.
3. Another way to steer — the actual first-EVA front steering fault and rear steering response.
4. The seatbelt passenger — NASA's sample-curator account of 15016 and the missing field documentation.
5. Uphill to a white rock — steering recovery, holding the rover at Station 6a and the Spur Crater sample.
6. A wall with layers — the final traverse and the complementary roles of images and samples.
7. Parked to watch — the deliberate final television task and equipment left behind.
8. The wheels stayed. The clues travelled. — attributed totals, coordinate limits and returned evidence.

### Inspected NASA sources

- [NSSDCA: rover design, operation, deployment and development](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html).
- [NASA SP-4029: Apollo 15 mission summary](https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_15a_Summary.htm).
- [NASA: Hadley-Apennine surface activities and captioned photographs](https://www.nasa.gov/history/50-years-ago-apollo-15-on-the-moon-at-hadley-apennine/).
- [NASA Astromaterials 3D: sample 15016,0, Seatbelt Rock, model and XCT](https://ares.jsc.nasa.gov/astromaterials3d/sample-details.htm?sample=15016-0).
- [NSSDCA: Falcon / ALSEP parent mission and LRO-derived lander position](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C).
- [NASA: the first lunar rover's final cruise and scientific reach](https://www.nasa.gov/history/50-years-ago-first-apollo-astronauts-to-drive-on-the-moon-took-final-cruise/).

**Limits:** 1971-063C and the published 26.13239° N / 3.63330° E position apply to Falcon, not an independently catalogued rover or exact parking fix. NSSDCA's 27.8 km / 3 h 2 min and SP-4029's about 27.9 km / 3 h remain source-specific. Crew-use dates do not establish battery death. Apollo 17's taped-map fender repair is not reused as an Apollo 15 event.

## Pathfinder's chapter spine

1. Two jobs. One journey. — the lander/rover partnership, naming entry and launch.
2. The landing that bounced — the real descent-system handover.
3. A ramp, not yet a road — airbag clearing, rollout and relay dependence.
4. The rocks with nicknames — cameras, APXS and wheel/hazard experiments.
5. The station watched the sky — weather, images, radio science and interpretations.
6. The week became a longer journey — primary goals, extension and different battery systems.
7. A carrier is not a conversation — September data, October carrier detections and the unknown rover condition.
8. The record outlived the link — source-attributed totals, the later orbital view and the scientific legacy.

### Inspected NASA sources

- [NASA Science: mission, instruments, science and official embedded 360-degree view](https://science.nasa.gov/mission/mars-pathfinder/).
- [NSSDCA: launch, descent, airbag clearing, rollout and lander position](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A).
- [NASA History: launch, naming contest, rover operations and captioned images](https://www.nasa.gov/history/25-years-ago-mars-pathfinder-launches-to-mars-to-deploy-sojourner-the-first-planetary-rover-2/).
- [NASA/JPL, 8 August 1997: primary completion, hazard avoidance and battery management](https://www.jpl.nasa.gov/news/mars-pathfinder-concludes-primary-science-mission/).
- [NASA/JPL, 4 November 1997: last data, later carriers and qualified failure explanation](https://www.jpl.nasa.gov/news/mars-pathfinder-winds-down-after-phenomenal-mission/).

**Limits:** last successful data on September 27 differs from the October 1/6 carrier detections. Battery depletion/thermal cycling is a probable explanation, not a uniquely proven cause. Predicted circling is not observed final rover motion. The earlier local `1996-068B` / SATCAT attribution is not repeated. NASA History's 83-day wording is not changed to 83 sols. NASA Science's 2.3 billion bits and contemporary JPL's 2.6 billion are not added or silently reconciled. The catalog's 19.33° N / 33.55° W is a lander-site estimate; 326.45° E is an explicitly derived conversion, and the cited passage does not state a frame.

## Art, interaction and audio

- Sixty-four named inline SVG scenes, with different Moon/Mars compositions and per-scene finite entrance motion. Schematic wheel/airbag counts, map paths, layer drawings and weather curves must not be interpreted as exact engineering meshes, surveyed routes or telemetry. Real NASA photographs are credited and kept in the evidence panels.
- Native buttons compare actual engineering/science concepts. No guessed instrument values, live-command claims or fabricated mission-score telemetry.
- The NASA-linked hammer/feather video contains historical lunar sound; the Pathfinder 360 view is assembled mission imagery, not live Mars footage. Embeds require a user action and have source links alongside them.
- Narration endpoints publish 32 scripts per machine with stable IDs. Recorded clips and durations remain null until real audio is supplied; browser read-aloud is explicitly synthetic.
- No NASA logo or implied endorsement. No paid image generation or R2 upload is required for these SVG editions.

The original thirteen stories and Eagle's R2 artwork are unchanged. Only these two previously legacy story routes and their audited web wiki facts are replaced.
