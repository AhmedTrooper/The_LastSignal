"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  RANGER_7_MISSION,
  RANGER_KEYFRAMES,
  type RangerKeyframe,
} from "@/lib/ranger-dive";

interface RangerDiveProps {
  standalone?: boolean;
}

export default function RangerDive({ standalone = false }: RangerDiveProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<1 | 3 | 5>(3);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [showPeanutsModal, setShowPeanutsModal] = useState(false);
  const [crtFilter, setCrtFilter] = useState(true);
  const [viewMode, setViewMode] = useState<"descent" | "crater">("descent");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const toneOscRef = useRef<OscillatorNode | null>(null);
  const toneGainRef = useRef<GainNode | null>(null);

  const totalSteps = RANGER_KEYFRAMES.length; // 8 descent frames
  const isCraterView = viewMode === "crater";
  const currentKeyframe: RangerKeyframe = RANGER_KEYFRAMES[frameIndex];

  // Synthesize authentic 1960s telemetry carrier tone & static crackle via Web Audio API
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(960, ctx.currentTime); // 960 Hz carrier simulation
      gain.gain.setValueAtTime(0.015, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      toneOscRef.current = osc;
      toneGainRef.current = gain;
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  const playStaticBurst = useCallback(() => {
    if (!audioCtxRef.current || !soundEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // Audio playback suppressed
    }
  }, [soundEnabled]);

  // Adjust telemetry tone pitch with altitude descent
  useEffect(() => {
    if (!soundEnabled) {
      if (toneGainRef.current && audioCtxRef.current) {
        toneGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
      return;
    }
    initAudio();
    if (toneOscRef.current && toneGainRef.current && audioCtxRef.current) {
      const baseFreq = 900 + (1 - frameIndex / (totalSteps - 1)) * 400;
      toneOscRef.current.frequency.setTargetAtTime(baseFreq, audioCtxRef.current.currentTime, 0.05);
      toneGainRef.current.gain.setValueAtTime(isCraterView ? 0 : 0.02, audioCtxRef.current.currentTime);
    }
  }, [soundEnabled, frameIndex, totalSteps, isCraterView, initAudio]);

  // Autoplay descent simulation loop
  useEffect(() => {
    if (!isPlaying || viewMode === "crater") return;

    const intervalTime = Math.max(700, 2400 / playSpeed);
    const timer = setInterval(() => {
      setFrameIndex((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        } else {
          // Reached final frame: trigger impact sound and reveal crater
          playStaticBurst();
          setViewMode("crater");
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, totalSteps, viewMode, playStaticBurst]);

  const handleSeek = (newIndex: number) => {
    setViewMode("descent");
    setFrameIndex(newIndex);
  };

  const jumpToImpact = () => {
    setViewMode("descent");
    setFrameIndex(totalSteps - 1); // Plate 200 (519 m)
    playStaticBurst();
  };

  const formatCountdown = (tMinus: number) => {
    const mins = Math.floor(tMinus / 60);
    const secs = (tMinus % 60).toFixed(2);
    return `T-${String(mins).padStart(2, "0")}:${secs.padStart(5, "0")}`;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-[#090814] text-white ${standalone ? "p-4 sm:p-8" : "p-4 sm:p-6"}`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Live Mission Replay · NASA Ranger 7
            </span>
          </div>
          <h3 className="display mt-1 text-2xl sm:text-3xl">17-Minute Lunar Impact Dive</h3>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            Drag the altitude scrubber or click Play to relive humanity&apos;s first close-up descent into the Moon.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {/* Lucky Peanuts Badge Button */}
          <button
            type="button"
            onClick={() => setShowPeanutsModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/20"
            title="Read about NASA's Lucky Peanuts tradition"
          >
            <span>🥜</span>
            <span className="hidden sm:inline">Lucky Peanuts</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              if (!soundEnabled) initAudio();
              setSoundEnabled(!soundEnabled);
            }}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
              soundEnabled
                ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-300"
                : "border-white/15 bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <span>{soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF"}</span>
          </button>

          {/* Telemetry Inspector Toggle */}
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${
              showInspector
                ? "border-violet bg-violet text-white"
                : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
            }`}
          >
            {showInspector ? "Hide Telemetry" : "Inspector (Judges)"}
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CRT Vidicon Display Screen (8 cols on desktop) */}
        <div className="lg:col-span-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-white/20 bg-black shadow-[inset_0_0_80px_rgba(0,0,0,0.8),0_0_30px_rgba(91,46,255,0.15)]">
            {/* View Mode: Descent Frame vs Today's LROC Crater */}
            {!isCraterView ? (
              <div className="relative h-full w-full">
                {/* LPI Ranger 7 Keyframe Image */}
                <Image
                  src={currentKeyframe.browseUrl}
                  alt={`Ranger 7 ${currentKeyframe.cameraLabel} Plate ${currentKeyframe.plate}`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                  unoptimized
                  className={`object-contain transition-opacity duration-300 ${
                    crtFilter ? "contrast-115 brightness-95" : ""
                  }`}
                />

                {/* Split Static Simulation for Final Impact Frame (Plate 200) */}
                {currentKeyframe.isImpactFrame && (
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-[46%] bg-[radial-gradient(circle,rgba(255,255,255,0.85)_1px,transparent_1px)] bg-[size:3px_3px] opacity-90 mix-blend-screen"
                    title="Mid-transmission carrier cut at moment of impact"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    <div className="absolute bottom-4 right-4 rounded bg-black/80 px-2 py-1 font-mono text-[10px] text-amber-300">
                      SIGNAL LOST · IMPACT (13:25:48.82 UTC)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Crater Reveal View: Modern LROC NAC Image */
              <div className="relative h-full w-full bg-[#111]">
                <Image
                  src={RANGER_7_MISSION.crater.lrocImageUrl}
                  alt="Modern LROC NAC orbital image of Ranger 7 impact crater"
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                  unoptimized
                  className="object-contain"
                />
                <div className="absolute top-4 left-4 rounded bg-black/75 px-3 py-1.5 font-mono text-xs text-white border border-white/20">
                  <span className="text-violet-bright font-bold">LROC NAC M153014430L</span> · 14m Crater Today
                </div>
                <div className="absolute bottom-4 inset-x-4 rounded-lg bg-black/85 p-3 text-xs text-white/90 border border-white/10 backdrop-blur-sm">
                  <p className="font-semibold text-amber-300">Where Ranger 7 rests forever:</p>
                  <p className="mt-1 leading-relaxed">
                    Ranger 7 excavated a 14-meter-wide fresh crater in <em>Mare Cognitum</em> at 10.6340° S, 20.6771° W. Photographed by Apollo 16 in 1972 and mapped at 0.5m/pixel by NASA&apos;s Lunar Reconnaissance Orbiter.
                  </p>
                </div>
              </div>
            )}

            {/* CRT Scanline & Reticle Overlay */}
            {crtFilter && (
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[size:100%_4px] opacity-70"
                aria-hidden
              />
            )}

            {/* Vidicon Tube Corner Marks & Center Reticle Crosshair */}
            <div className="pointer-events-none absolute inset-0 border border-white/10 p-4" aria-hidden>
              {/* Center Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative h-6 w-6">
                  <span className="absolute top-0 bottom-0 left-1/2 w-px bg-white/40" />
                  <span className="absolute top-1/2 inset-x-0 h-px bg-white/40" />
                </div>
              </div>

              {/* Top HUD Telemetry */}
              <div className="flex justify-between font-mono text-[11px] text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                <div>
                  <span className="text-emerald-400 font-bold">
                    {!isCraterView ? currentKeyframe.cameraLabel : "LROC NAC M153014430L"}
                  </span>
                  {!isCraterView && (
                    <span className="ml-2 text-white/60">
                      Plate #{String(currentKeyframe.plate).padStart(3, "0")}
                    </span>
                  )}
                </div>
                <div className="tabular-nums">
                  {!isCraterView ? currentKeyframe.utc : "Orbital Verification"}
                </div>
              </div>

              {/* Bottom HUD Telemetry */}
              {!isCraterView && (
                <div className="absolute bottom-4 inset-x-4 flex justify-between items-end font-mono text-[11px] text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  <div>
                    <div className="text-amber-300 font-bold">
                      ALT:{" "}
                      {currentKeyframe.altitudeKm >= 1
                        ? `${currentKeyframe.altitudeKm.toLocaleString()} km`
                        : `${Math.round(currentKeyframe.altitudeKm * 1000)} meters`}
                    </div>
                    <div className="text-[10px] text-white/70">
                      SPEED: {RANGER_7_MISSION.impactVelocityKms} km/s ({RANGER_7_MISSION.impactVelocityKmh.toLocaleString()} km/h)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-300 font-bold">
                      {formatCountdown(currentKeyframe.tMinusSec)}
                    </div>
                    <div className="text-[10px] text-white/70">
                      DOWNLINK: 959.52 MHz (DSS-11)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CRT Effect Toggle Button */}
            <button
              type="button"
              onClick={() => setCrtFilter(!crtFilter)}
              className="absolute top-4 right-4 rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white/70 hover:text-white"
            >
              CRT FX: {crtFilter ? "ON" : "OFF"}
            </button>
          </div>

          {/* Quick Switcher: Descent vs Modern Crater */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("descent")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  !isCraterView
                    ? "bg-violet text-white shadow-sm"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                1964 Vidicon Descent
              </button>
              <button
                type="button"
                onClick={() => setViewMode("crater")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isCraterView
                    ? "bg-violet text-white shadow-sm"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                2026 LROC Crater Site
              </button>
            </div>

            {/* Feature Note for Current Frame */}
            <p className="hidden text-right font-mono text-xs text-white/70 sm:block max-w-sm truncate">
              {!isCraterView ? currentKeyframe.featureNote : "Excavated crater mapped from lunar orbit."}
            </p>
          </div>
        </div>

        {/* Tactile Flight Controls & Telemetry Column (4 cols on desktop) */}
        <div className="flex flex-col justify-between space-y-4 lg:col-span-4">
          {/* Real-Time Flight Instrumentation Cards */}
          <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-mono text-[11px] tracking-wider text-white/50 uppercase">Flight Telemetry</p>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
                <span className="block font-mono text-[10px] text-white/50 uppercase">Altitude</span>
                <span className="display text-xl sm:text-2xl text-amber-300 tabular-nums">
                  {!isCraterView
                    ? currentKeyframe.altitudeKm >= 1
                      ? `${currentKeyframe.altitudeKm.toLocaleString()} km`
                      : `${Math.round(currentKeyframe.altitudeKm * 1000)} m`
                    : "0 m"}
                </span>
              </div>

              <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
                <span className="block font-mono text-[10px] text-white/50 uppercase">Velocity</span>
                <span className="display text-xl sm:text-2xl text-emerald-400 tabular-nums">
                  {!isCraterView ? `${RANGER_7_MISSION.impactVelocityKms} km/s` : "Impact"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
                <span className="block font-mono text-[10px] text-white/50 uppercase">Countdown</span>
                <span className="display text-lg sm:text-xl text-white tabular-nums">
                  {!isCraterView ? formatCountdown(currentKeyframe.tMinusSec) : "T+00:00.00"}
                </span>
              </div>

              <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
                <span className="block font-mono text-[10px] text-white/50 uppercase">Camera</span>
                <span className="font-mono text-sm font-semibold text-white/90">
                  {!isCraterView ? `Cam ${currentKeyframe.camera}` : "LROC NAC"}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-black/40 p-2.5 border border-white/5 font-mono text-[11px] leading-snug text-white/70">
              <span className="text-white/40">Target:</span> {RANGER_7_MISSION.impactCoordinates.region} (
              {RANGER_7_MISSION.impactCoordinates.lat.toFixed(4)}°, {RANGER_7_MISSION.impactCoordinates.lon.toFixed(4)}°)
            </div>
          </div>

          {/* Tactile Altitude Rail & Scrubber */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <label htmlFor="altitude-scrubber" className="font-mono text-[11px] text-white/60 uppercase">
                Altitude Scrubber
              </label>
              <span className="font-mono text-[11px] text-amber-300">
                Step {frameIndex + 1} of {totalSteps}
              </span>
            </div>

            {/* Range Slider */}
            <input
              id="altitude-scrubber"
              type="range"
              min={0}
              max={totalSteps - 1}
              value={frameIndex}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-violet"
            />

            {/* Altitude Step Milestones */}
            <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
              <span>2,110 km</span>
              <span>1,083 km</span>
              <span>74 km</span>
              <span className="text-amber-400">519 m</span>
            </div>

            {/* Playback Controls */}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!isPlaying && isCraterView) setViewMode("descent");
                  setIsPlaying(!isPlaying);
                }}
                className={`flex-1 rounded-lg py-2.5 font-semibold text-sm transition ${
                  isPlaying
                    ? "bg-amber-500 text-black hover:bg-amber-400"
                    : "bg-violet text-white hover:bg-violet-deep"
                }`}
              >
                {isPlaying ? "⏸ Pause Dive" : "▶ Play Descent"}
              </button>

              <button
                type="button"
                onClick={jumpToImpact}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 font-mono text-xs text-white/80 hover:bg-white/20 hover:text-white"
                title="Jump directly to final 519-meter frame"
              >
                T-0s Impact
              </button>
            </div>

            {/* Speed Selector */}
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-xs">
              <span className="text-white/50">Speed:</span>
              <div className="flex gap-1.5">
                {([1, 3, 5] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaySpeed(spd)}
                    className={`rounded px-2 py-0.5 transition ${
                      playSpeed === spd
                        ? "bg-white/30 text-white font-bold"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Feature Note (Mobile visible) */}
      <div className="mt-3 block rounded-lg border border-white/10 bg-white/5 p-3 sm:hidden font-mono text-xs text-white/80">
        <span className="font-semibold text-amber-300">Observation:</span>{" "}
        {!isCraterView ? currentKeyframe.featureNote : "Modern LROC NAC orbital photo of the 14-meter impact crater."}
      </div>

      {/* Verified NASA Telemetry Layer / Inspector (Judges & Researchers) */}
      {showInspector && (
        <div className="mt-6 rounded-xl border border-violet/40 bg-black/70 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="display text-lg sm:text-xl text-violet-bright">
                Verified Telemetry Inspector · NSSDCA ID: 1964-041A
              </h4>
              <p className="font-mono text-xs text-white/60">
                Official flight telemetry derived from NASA SP-61, SP-62, SP-63 and the Lunar & Planetary Institute.
              </p>
            </div>
            <a
              href="https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1964-041A"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-violet-bright hover:underline"
            >
              NSSDCA Record ↗
            </a>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Spec 1: Impactor Mechanics */}
            <div className="rounded-lg border border-white/5 bg-white/5 p-3 font-mono text-xs space-y-1.5">
              <span className="block font-bold text-amber-300 uppercase">Impactor Mechanics</span>
              <p><span className="text-white/50">COSPAR / NSSDCA:</span> 1964-041A</p>
              <p><span className="text-white/50">NORAD SATCAT:</span> 00842</p>
              <p><span className="text-white/50">Impact Time:</span> July 31, 1964 at 13:25:48.82 UTC</p>
              <p><span className="text-white/50">Terminal Velocity:</span> 2.62 km/s (9,432 km/h)</p>
              <p><span className="text-white/50">Coordinates:</span> 10.6340° S, 20.6771° W (339.323° E)</p>
              <p><span className="text-white/50">Excavated Basin:</span> 14 m crater in Mare Cognitum</p>
            </div>

            {/* Spec 2: Telecom & DSN */}
            <div className="rounded-lg border border-white/5 bg-white/5 p-3 font-mono text-xs space-y-1.5">
              <span className="block font-bold text-emerald-400 uppercase">Radio Downlink (Goldstone)</span>
              {RANGER_7_MISSION.telecom.map((t) => (
                <div key={t.freq} className="border-b border-white/5 pb-1">
                  <p className="font-semibold text-white">{t.freq} · {t.power}</p>
                  <p className="text-[11px] text-white/60">{t.channel} → {t.station}</p>
                </div>
              ))}
            </div>

            {/* Spec 3: Primary Data Sources */}
            <div className="rounded-lg border border-white/5 bg-white/5 p-3 font-mono text-xs space-y-1.5">
              <span className="block font-bold text-sky-400 uppercase">Primary Data Repositories</span>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="https://www.lpi.usra.edu/resources/ranger/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-bright hover:underline block truncate"
                  >
                    LPI Ranger 7 Photo Archive (599 Plates) ↗
                  </a>
                </li>
                <li>
                  <a
                    href={currentKeyframe.metaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-bright hover:underline block truncate"
                  >
                    Current Plate Telemetry (LPI Cam {currentKeyframe.camera} Plt {currentKeyframe.plate}) ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://lroc.im-ldi.com/images/52"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-bright hover:underline block truncate"
                  >
                    LROC NAC M153014430L Crater Analysis ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.nasa.gov/history/alsj/alsj-ranger.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-bright hover:underline block truncate"
                  >
                    NASA SP-4210: Project Ranger History ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Lucky Peanuts Modal */}
      {showPeanutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-w-lg rounded-2xl border border-amber-400/30 bg-[#161224] p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥜</span>
              <div>
                <h4 className="display text-2xl text-amber-300">{RANGER_7_MISSION.luckyPeanuts.origin}</h4>
                <p className="font-mono text-xs text-white/60">JPL Mission Control · July 31, 1964</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/85">
              {RANGER_7_MISSION.luckyPeanuts.story}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPeanutsModal(false)}
                className="rounded-full bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300 transition"
              >
                Understood!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
