# Phoenix (2007-034A): verified story editions

Reviewed **2026-11-08**. The supplied Phoenix master/dialogue JSON and legacy Phoenix files are drafts. The new edition preserves the legacy cinematic story and uses inspected NASA/NSSDCA/JPL/HiRISE sources instead.

## Routes and shared content

- `/heroes/phoenix/story`
- `/heroes/phoenix/book` and `?read=1&format=comic` / `?read=1&format=book`
- `/api/stories/phoenix/evidence`
- `/api/stories/phoenix/narration`

Five chapters, twenty shared beats. Comic captions, prose and narration scripts come from the same text. All twenty produced narration clips remain missing; no archival recording or farewell is fabricated.

| Chapter | Hardware-to-science connection |
| --- | --- |
| Risen from the ashes | Resurrected hardware, HiRISE descent photograph and Arctic touchdown |
| Holy Cow and vanishing ice | Under-lander ice and Dodo Goldilocks sublimation |
| Tasting the water | Soil delivery problems and TEGA water identification |
| Friendly soil and laser snow | MECA chemistry, perchlorate, carbonate evidence and lidar snow |
| A winter farewell | Last signal, winter frost, HiRISE after-view and archival DVD |

Exact source URLs and evidence locators are in `lib/phoenix-sources.ts`. NASA Science, NSSDCA, exact NASA Image Library API items, NASA press releases and HiRISE captions were inspected.

## Corrections and uncertainty

1. **Touchdown clocks:** NASA Science gives 23:38:38 UT spacecraft time; NSSDCA gives 23:53:44 UT Earth-received time. Both are retained and labelled.
2. **Thrusters:** NSSDCA’s profile describes pulsed propulsion with 8 thrusters. The draft’s 12-thruster / 302 N specification is not asserted.
3. **Descent geometry:** HiRISE gives MRO altitude 310 km, distance about 760 km, and Phoenix about 13 km up just after parachute opening. The draft’s 310 km distance and exact 20-second timing are not adopted.
4. **MARDI:** Descent-imager status and the gyro-interface explanation are not independently established in the sources used, so they are not asserted as a safety sequence.
5. **Ice identity:** Holy Cow/Snow Queen and Dodo Goldilocks are presented as image-supported observations. The four-day disappearance is strong evidence, and TEGA later added laboratory identification.
6. **Soil chemistry:** Soil is described as mildly alkaline with carbonate evidence. Exact pH 7.7, 3–5% calcium carbonate and 0.6% perchlorate are not asserted as unique measured values in the children’s prose.
7. **Snow:** The laser detected snow about 2.5 miles up, vaporizing before the ground. It is not presented as surface accumulation.
8. **Winter panel:** HiRISE interprets the 2010 shadow as likely west-panel collapse under perhaps 30 cm of CO2 frost. The draft’s 150–200 kg load and 80 cm depth are not asserted.
9. **DVD:** The Visions of Mars DVD is described as carrying 250,000 names; exact archive contents and survival lifetime are not asserted.
10. **Coordinates:** NASA Science landing-site caption values (68.22 N, 234.25 E) are used; draft four-decimal artifact coordinates are not reproduced as independently verified positions.

## Media and teaching controls

The cover is an artist concept (PIA09344), not a flight photograph. The parachute image (PIA10705), panorama (PIA10908), sublimation image (PIA10911), on-ground image (PIA10685), and HiRISE detail/after-winter frames keep their own captions, sources and credits.

The trench lesson requires comparing the two times; the winter lesson requires moving from summer to darkness to spring. Drawings are labelled as teaching diagrams, not recovered telemetry or laboratory traces.

No conversational profile hub, fake archive audio, external game or official scientist certification was added. Scope is `apps/web` only.

## Checks completed

- `bun run build`: passed, with book and both JSON routes.
- `bun test scripts/`: **131 passed / 0 failed**, including the previous 124 checks.
- Lint: no errors; existing unrelated `app/auth/mobile/page.tsx` hook warning remains.
- HTTP checks: story, comic, book, evidence and narration routes returned **200**; the Phoenix JPEG assets used by the edition returned **200**.
