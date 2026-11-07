# Surveyor 1 archival derivatives

## Captioned NASA/JPL retrospective

- Source: https://www.jpl.nasa.gov/videos/americas-first-lunar-surveyor-turns-50/
- Original: https://d2pn8kiwq2w21t.cloudfront.net/media/videossurveyor20160602JPL-20160601-SURVEYf-0001-720cc.m4v
- Credit: **NASA/JPL-Caltech**
- Release: **June 2, 2016**
- Local derivative: `surveyor-retrospective.mp4`, H.264/AAC, 854×480, about 281 seconds, 15,390,340 bytes.
- Captions: `surveyor-retrospective.vtt`, 88 cues extracted from the original's embedded caption stream. Formatting-only `\h` padding markers were removed; cue times and wording are retained.

This is a retrospective mixing historical footage, illustrations and narration. It is not a live mission feed, continuous onboard descent recording or the lander's voice. Surveyor 1 made the first **US** lunar soft landing; Luna 9 preceded it. MP4 compression is lossy; use NASA's original for archival inspection.

Conversion:

```sh
ffmpeg -i retrospective.m4v -map 0:v:0 -map 0:a:0 -vf scale=854:-2 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 96k -sn -movflags +faststart surveyor-retrospective.mp4
ffmpeg -i retrospective.m4v -map 0:s:0 -c:s webvtt surveyor-retrospective.vtt
```

SHA-256, verified 2026-11-08:

- Original M4V: `594400dba484f6ed7b61ff7ea5b1c86c329a6aba999825186582e9433fb2cb48`
- MP4: `1ce2bb960224896c2d51f755c2e040f7e7445105194603baa25d52a455249912`
- Display-normalized VTT: `fd24c3749c681845bc09923156f707c98550785f2ff4d87c08d8d0fa5696d32f`

## Radiator report page

- Source: https://ntrs.nasa.gov/api/citations/19670000738/downloads/19670000738.pdf
- Credit: **NASA/JPL, TR 32-1023, Part II**
- `compartment-a-p95.jpg`: PDF page 104 / printed page 95, Fig. A-2.
- Shows Compartment A on **July 12, 1966** with one Vycor segment presumed broken during the lunar night. The original figure caption and page number are retained. This is a rendered report page, not an original camera file.

Rendering:

```sh
pdftoppm -f 104 -singlefile -scale-to 1500 -jpeg -jpegopt quality=88 report-part-ii.pdf compartment-a-p95
```

SHA-256: `f7aafd42047ff347f4d2f94df614fbcfadd1ffe2917ac0b76e8a3bfb47b9b08c`
