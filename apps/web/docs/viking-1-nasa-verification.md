# Viking 1: verified story editions

Reviewed **2026-11-08**. The supplied datasets and existing local Viking records were treated as drafts. This edition uses inspected NASA publications and the official MRO HiRISE instrument-team caption, retaining uncertainty rather than copying dramatic precision.

## Published routes

- Scroll: `/heroes/viking-1/story`
- Chapter shelf: `/heroes/viking-1/book`
- Comic: `/heroes/viking-1/book?read=1&format=comic`
- Prose: `/heroes/viking-1/book?read=1&format=book`
- Sources, facts, chapters, images and research notes: `/api/stories/viking-1/evidence`
- Narration production manifest: `/api/stories/viking-1/narration`

Five chapters × four shared beats = twenty scroll moments and comic panels. Prose and narration scripts use the same beats. All twenty produced audio entries remain missing: no archive recording, machine farewell or narration duration is invented.

| Chapter | Hardware-to-science connection | Source records |
| --- | --- | --- |
| A careful arrival | Contamination reduction, reconnaissance and less-disturbing descent engines | NSSDCA; NASA launch/landing histories; *On Mars*, chapter 8 |
| A picture and a stuck pin | Scanning cameras, Earth duplicate testing and sampler recovery | NASA EP-146; NSSDCA; exact PIA00381 and PIA00563 API items |
| Soil with a surprise | Different tests, controls, detection limits and later reanalysis | NASA launch history; Viking Science; JPL's 2010 perchlorate review |
| A patient weather watcher | RTG power, repeated weather observations and radio science | Viking Project; NASA EP-146; JPL monitor report |
| A silent link, a lasting record | Battery management, memory overlap, uncertain diagnosis and orbital identification | JPL Publication 82-107; NASA mission summary; HiRISE PSP_001521_2025 and stereo partner |

Exact URLs, evidence summaries and locators are in `lib/viking-sources.ts`. Full-text NTRS versions of [the design history](https://ntrs.nasa.gov/api/citations/19840027185/downloads/19840027185.txt), [EP-146](https://ntrs.nasa.gov/api/citations/19800009678/downloads/19800009678.txt) and [the monitor report](https://ntrs.nasa.gov/api/citations/19830017477/downloads/19830017477.txt) were read in BrowserOS neo. Relevant passages were inspected, including the repair and relativity sections and printed report pages 3-10 through 3-14.

## Important corrections

1. **First landing:** NASA calls Viking the first truly successful Mars landing, while acknowledging Mars 3's earlier brief survivable landing. The story preserves that distinction.
2. **Planetary protection:** Heat treatment reduces risk; it is not a verified zero-microbes guarantee. The 40,000 parts in NASA History refer to heat-compatibility work, not a count of parts in the biology laboratory.
3. **Images:** PIA00381 shows **footpad 2**, not 3. PIA00567 is **Sunset at the Viking Lander 1 Site**, not a trench image. PIA00383 is the first panorama; PIA00393 is titled *Martian Dune Field*; the PIA00570 query returned no item. Archive ingestion dates are not exposure dates.
4. **Sampler:** The stuck pin, duplicate-lander testing, camera checks, eventual recovery and July 28 sampling are supported. Exact pin number, Sol 2/Sol 5 commands, temperature and midday-Sun technique were not independently established and are omitted.
5. **Biology:** GEx, LR and PR are three biology tests; GCMS separately investigated organics. Unexpected reactions did not provide definitive life evidence. Non-detection is not 0 ppb everywhere. Phoenix prompted a new heating/organic-analysis hypothesis, not a complete solution to every Viking biology test.
6. **Endurance and power:** NASA History reports **2,245 sols** and Opportunity's **19 May 2010** milestone. No misleading 34-year interval after mission end or exact Earth-day conversion is published. Catalog power descriptions differ; nominal output is not constant forever. Radio timing tested a prediction, not every aspect of relativity.
7. **Final communications:** NASA Science gives **11 November 1982** for final operations/transmission; NSSDCA gives **13 November**. JPL's detailed report dates the battery-change command **19 November** and emergency **20 November**. These are separately attributed in JSON, not merged into a fabricated exact command or dish-motion timeline.
8. **Diagnosis:** JPL documents overwritten antenna-pointing parameters and a simulation-based diagnosis. It also considers battery, computer, receiver and mechanical possibilities. The story does not claim a healthy machine forever unable to receive a command or blame an individual engineer.
9. **Recovery and memorial:** JPL reports recovery ending in **March 1983**; the supplied May 21 date is not adopted. A pointing program valid through December 1994 is not a guaranteed lifetime. The memorial name is verified, but NASA and NSSDCA differ on January 1982 versus January 1981.
10. **HiRISE:** PSP_001521_2025 was acquired **22 November 2006**, with its caption published December 4. The stereo partner was acquired December 8. Original pixel scales differ from map-projected 25 cm/pixel. Image-center coordinates are not exact lander coordinates. The lander is confirmed; other entry-hardware locations are candidates.

The story uses approximate NSSDCA planetocentric coordinates rather than unverified four-decimal positions, artifact separations or MOLA elevations. It does not diagnose current electronics from an orbital image.

## Media and interaction

- Exact NASA API items supplied the original JPEG URLs for first, color and sunset images.
- The Earth sampler photograph and laboratory schematic are labelled as ground media/diagrams, not Mars repair photos or measured signals.
- The HiRISE lander cutout is an unmodified local copy downloaded through BrowserOS neo. See `public/media/viking-1/README.md` for provenance and hash. The remote source loaded in the browser but the development optimizer returned HTTP 500; the local optimized copy was verified to load. The large overview remains an original-source link.
- Sampler lesson: inspect → test on the Earth duplicate → try the tested command. Unsupported jumps are rejected.
- Scan reveal: native range input plus reveal/reset buttons; percent denotes drawing reveal, not elapsed mission time.
- Biology lesson: explore tests and compare interpretations; gas release is not a life verdict.
- Power comparison: clear/dustier illumination, without fake measured power.
- Memory lesson: a small overlap-check analogy, not the real flight memory map or a promise one check would have saved Viking.

No conversational profile hub, fake archive audio, external game, certification claim or change to legacy mission implementations was added. The homepage still features its existing three stories, and navigation/catalogue separation is unchanged. Scope is `apps/web` only.

## Checks completed

- `bun run build`: passed, including the book and both JSON endpoints.
- `bun test scripts/`: **110 passed / 0 failed**.
- Lint: no errors; the unrelated existing `app/auth/mobile/page.tsx` hook warning remains.
- BrowserOS neo: all twenty moments checked at **320×568**, **375×812** and **812×375**, with no page overflow, cloud/header or cloud/control overlap, or inner-cloud text overflow.
- Desktop visual check at **1280×900**; comic/prose switching and keyboard-activated return to scroll retained four shared beats.
- Chapter chooser, notes modal and close passed. Reduced motion set progress transition to `0s`.
- Keyboard End revealed the scan; sampler steps reached recovery; biology choices retained the qualified conclusion; dust/power comparison and blocked memory-overlap feedback passed.
- NASA color/ground-sampler media and the local HiRISE image decoded successfully in the reader.
- Evidence/narration endpoints returned **HTTP 200**, with five chapters and twenty missing recordings respectively.

Browser tab metadata sometimes lagged navigation; handles were re-derived and live snapshots verified. A naive overflow check counted decorative thought dots outside the cloud, so the corrected check measured the inner text container. An oversized browser batch timed out and was split into bounded checks.
