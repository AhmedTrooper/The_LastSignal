# PIA04155: Spirit dust-devil sequence

- Source: https://science.nasa.gov/photojournal/gusev-dust-devil-sol-543/
- Original GIF: https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia04/pia04155/PIA04155.gif
- Credit: **NASA/JPL/Texas A&M**
- Acquisition: **Sol 543 / July 13, 2005**; the frames cover **8 minutes 21 seconds**.
- NASA processing: changing features (moving dust) have enhanced contrast.
- Local derivative: `PIA04155.mp4`, H.264/yuv420p, 1024×256, 21 frames, 10.5 seconds, no audio.

The conversion keeps the GIF’s playback timing. It is an accelerated camera sequence, not real-time footage or a recording of a dust devil cleaning Spirit. MP4 compression is lossy; use NASA’s original for scientific inspection. The native video player provides play, pause and seeking; no autoplay is requested.

Conversion (FFmpeg):

```sh
ffmpeg -i PIA04155.gif -an -c:v libx264 -crf 20 -pix_fmt yuv420p -fps_mode passthrough -movflags +faststart PIA04155.mp4
```

SHA-256, verified 2026-11-08:

- Original GIF: `ca4505cb5483466e47da4fced7244bb1f98dff7b48990a4b1869582e9656d5b3`
- Local MP4: `fc19a92920cf8a8e871d5d69dd107c09dccbdde00d536437abbcf36a96f56982`
