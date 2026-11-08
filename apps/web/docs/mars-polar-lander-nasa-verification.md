# Mars Polar Lander (1999-001A): verified story editions

Reviewed **2026-11-08**. The supplied Mars Polar Lander master/dialogue JSON is a draft. The new edition preserves the legacy cinematic story and uses inspected NASA/NSSDCA/JPL/HiRISE sources instead.

## Routes and shared content

- `/heroes/mars-polar-lander/story`
- `/heroes/mars-polar-lander/book` and `?read=1&format=comic` / `?read=1&format=book`
- `/api/stories/mars-polar-lander/evidence`
- `/api/stories/mars-polar-lander/narration`

Five chapters, twenty shared beats. Comic captions, prose and narration scripts come from the same text. All twenty produced narration clips remain missing; no archival recording or farewell is fabricated.

| Chapter | Hardware-to-science connection |
| --- | --- |
| Carrying names and a microphone | South polar target, MVACS, Russian lidar, microphone and student-names artifact |
| Amundsen and Scott | Deep Space 2 penetrators designed for hard impact and subsurface sampling |
| The fatal latch | Leg-deployment signals, missing software handling and premature engine cutoff |
| Searching the ice | Radio silence, MGS search imaging, frost false alarm and HiRISE searches |
| Lessons and Phoenix | Investigation, telemetry reforms and later polar landings |

Exact source URLs and evidence locators are in `lib/mpl-sources.ts`. NASA Science, NSSDCA, exact NASA Image Library API items and NASA's lesson summary were inspected.

## Corrections and uncertainty

1. **Masses:** NSSDCA gives lander mass 290 kg and a profile total of about 583 kg including fuel, cruise stage, aeroshell and two 3.5 kg microprobes. The draft’s 576 kg total is not asserted.
2. **Descent propulsion:** NSSDCA describes three groups of four 266 N engines (12 total). No unique part-number specification is asserted.
3. **Deep Space 2:** NSSDCA gives impact 160–200 m/s and penetration 0.3–1 m, not a single 179 m/s or exact peak-G figure. The story uses the range.
4. **Fall mechanism:** The story follows the investigation finding that leg-deployment transients were not properly accounted for before touchdown checking. Exact altitudes, impact velocity and a second-by-second reconstruction are not asserted as directly measured.
5. **Radio silence:** NSSDCA says the cause was not known in its profile; NASA Science reports the false-signal investigation finding. The story presents the mechanism as the investigation finding and keeps the landing unlocated.
6. **Site coordinates:** NSSDCA target description (between 73 S and 76 S, less than 1000 km from the pole; landing zone 76 S, 195 W) is used. Draft four-decimal artifact positions are not reproduced.
7. **Payload details:** The 880 nm wavelength, 50-gram microphone mass/cost, 1,000,000-names count and 58+ HiRISE count are not independently verified in the sources used and are not asserted as exact facts in the children’s prose.
8. **PIA IDs:** PIA02348, PIA02353, PIA02347 and PIA02314 are used with their verified archive descriptions as site/search/scale/map imagery, not as lander photographs.

## Media and teaching controls

The cover is a NASA mission illustration, not a flight photograph. Site/search/scale/map images keep their own captions, sources and credits.

The latch lesson requires deploying, latching and clearing the transient in order; the telemetry lesson requires enabling tones before descending. Both are teaching sequences, not executable flight procedures.

No conversational profile hub, fake archive audio, external game or official scientist certification was added. Scope is `apps/web` only.

## Checks completed

- `bun run build`: passed, with book and both JSON routes.
- `bun test scripts/`: **138 passed / 0 failed**, including the previous 131 checks.
- Lint: no errors; existing unrelated `app/auth/mobile/page.tsx` hook warning remains.
- HTTP checks: story, comic, book, evidence and narration routes returned **200**.
