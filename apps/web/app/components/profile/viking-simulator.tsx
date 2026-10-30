"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  VIKING_SPECS,
  VIKING_BIOLOGY_EXPERIMENTS,
  FACSIMILE_CAMERA_SPECS,
  VIKING_DISCARDED_RELICS,
  type DiscardedVikingRelic,
} from "@/lib/viking-mission";

interface VikingSimulatorProps {
  lander: "viking-1" | "viking-2";
  standalone?: boolean;
}

export default function VikingSimulator({
  lander,
  standalone = false,
}: VikingSimulatorProps) {
  const isViking1 = lander === "viking-1";
  const specs = VIKING_SPECS[lander];

  const [activeTab, setActiveTab] = useState<"biology" | "camera" | "relics">("biology");

  // Biology Lab State
  const [incubationDay, setIncubationDay] = useState<number>(3.5);
  const [explanationMode, setExplanationMode] = useState<"historical" | "perchlorates">("perchlorates");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Facsimile Camera State
  const [scanProgress, setScanProgress] = useState<number>(35); // 0% to 100%
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Discarded Relics State (strictly for this lander)
  const landerRelics = VIKING_DISCARDED_RELICS.filter((r) => r.lander === lander);
  const [selectedRelicId, setSelectedRelicId] = useState<string>(landerRelics[0]?.id ?? "");
  const activeRelic: DiscardedVikingRelic =
    landerRelics.find((r) => r.id === selectedRelicId) ?? landerRelics[0];

  // Calculate simulated 14CO2 gas evolution (Counts Per Minute, CPM)
  const calculateCpm = (day: number, isSterilized: boolean) => {
    if (isSterilized) return 15 + Math.sin(day * 2) * 5; // Flat background baseline
    if (day <= 0) return 0;
    // Initial exponential surge up to ~10,800 CPM on Day 1.5, plateauing around 11,500 CPM
    const primaryPulse = 11200 * (1 - Math.exp(-day * 2.2));
    // Second injection on Day 7 caused a slight drop / gas dissolution
    const secondInjectionEffect = day > 7 ? -700 * (1 - Math.exp(-(day - 7) * 1.5)) : 0;
    return Math.max(0, primaryPulse + secondInjectionEffect);
  };

  const activeCpm = Math.round(calculateCpm(incubationDay, false));
  const controlCpm = Math.round(calculateCpm(incubationDay, true));

  // Synthesize realistic Geiger-Muller radiation crackles via Web Audio
  const playGeigerClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800 + Math.random() * 600, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Audio timer trigger based on CPM rate
  useEffect(() => {
    if (!soundEnabled || activeTab !== "biology") return;
    // Rate: higher CPM => more frequent clicks
    const intervalMs = Math.max(35, 1200 - (activeCpm / 11500) * 1150);
    const timer = setInterval(() => {
      if (Math.random() < 0.8) {
        playGeigerClick();
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [soundEnabled, activeTab, activeCpm, playGeigerClick]);

  // Automated camera scanner progression
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-line bg-[#0c0a1a] text-white shadow-2xl transition-all ${
        standalone ? "mx-auto max-w-6xl p-5 sm:p-8" : "p-4 sm:p-6"
      }`}
    >
      {/* Background Ambience */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background: isViking1
            ? "radial-gradient(ellipse at 50% 15%, rgba(225,112,85,0.25), transparent 70%)"
            : "radial-gradient(ellipse at 50% 15%, rgba(9,132,227,0.22), transparent 70%)",
        }}
      />

      {/* Header — Strictly Dedicated to this Viking Lander */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border ${
                isViking1
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-sky-500/20 text-sky-300 border-sky-500/30"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-ping ${
                  isViking1 ? "bg-amber-400" : "bg-sky-400"
                }`}
              />
              NASA {specs.name} ({specs.cosparId})
            </span>
            <span className="font-mono text-xs text-white/50">NORAD: {specs.noradId}</span>
          </div>
          <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {specs.name}
          </h2>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            {isViking1
              ? "First successful Mars long-duration station · Thomas Mutch Memorial Station · Chryse Planitia"
              : "Sub-polar research station · Tilted 8.5° on volcanic rocks · Utopia Planitia"}
          </p>
        </div>

        {/* Telemetry Badge */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
          <p className="font-mono text-[10px] text-white/50 uppercase">Resting Site</p>
          <p
            className={`font-mono text-xs font-bold ${
              isViking1 ? "text-amber-300" : "text-sky-300"
            }`}
          >
            {specs.landingCoordinates.region}
          </p>
          <p className="font-mono text-[10px] text-white/60">
            {specs.landingCoordinates.lat.toFixed(3)}° N, {specs.landingCoordinates.lon.toFixed(3)}° E
          </p>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="relative z-10 mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Surface Lifespan</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {specs.activeSols.toLocaleString()} Sols
          </p>
          <p className="text-[11px] text-emerald-400">
            {(specs.activeSols / 365.25).toFixed(1)} Earth years active
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Power Source</p>
          <p className="mt-1 font-mono text-sm font-bold text-white">2× SNAP-19 RTG</p>
          <p className="text-[11px] text-amber-300">70 Watts (Plutonium-238)</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">HiRISE Imagery</p>
          <p className="mt-1 font-mono text-sm font-bold text-cyan-300 truncate">
            {specs.landingCoordinates.hiriseFrame}
          </p>
          <p className="text-[11px] text-white/60 truncate">Resolved from 280 km orbit</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Lander Mass</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {specs.dimensions.landerMassKg} kg
          </p>
          <p className="text-[11px] text-white/60">572 kg touchdown dry mass</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("biology")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "biology"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            🧪 Biology Lab & Perchlorates
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("camera")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "camera"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            📷 Facsimile Scanning Camera
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("relics")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "relics"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            🪐 Discarded Relics ({landerRelics.length})
          </button>
        </div>

        {/* Sonification Sound Toggle */}
        {activeTab === "biology" && (
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all ${
              soundEnabled
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <span>{soundEnabled ? "🔊 Geiger Audio: ON" : "🔇 Geiger Audio: OFF"}</span>
          </button>
        )}
      </div>

      {/* TAB 1: BIOLOGY LAB & PERCHLORATE SIMULATOR */}
      {activeTab === "biology" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="font-mono text-xs text-amber-400 uppercase tracking-wider">
                  The Greatest Biology Debate in Space Exploration History
                </span>
                <h3 className="display mt-1 text-xl font-bold">
                  Labeled Release (LR) Radioactive Gas Simulator
                </h3>
                <p className="mt-1 text-xs text-white/70 max-w-2xl">
                  In 1976, Viking dropped a broth of nutrients tagged with radioactive Carbon-14 (¹⁴C) into Martian soil. The response shocked the scientific world.
                </p>
              </div>

              {/* Viewpoint Toggle */}
              <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setExplanationMode("historical")}
                  className={`rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold transition-all ${
                    explanationMode === "historical"
                      ? "bg-amber-500 text-black shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  1976 Life Hypothesis
                </button>
                <button
                  type="button"
                  onClick={() => setExplanationMode("perchlorates")}
                  className={`rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold transition-all ${
                    explanationMode === "perchlorates"
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  2008 Perchlorates Solution
                </button>
              </div>
            </div>

            {/* Interactive Timeline Scrubber */}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">Incubation Timeline: Day {incubationDay.toFixed(1)}</span>
                <span className="text-amber-300 font-bold">
                  Active ¹⁴CO₂: {activeCpm.toLocaleString()} CPM
                </span>
                <span className="text-sky-300">
                  Control (160°C): {controlCpm.toLocaleString()} CPM
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={incubationDay}
                onChange={(e) => setIncubationDay(parseFloat(e.target.value))}
                className="mt-3 w-full accent-amber-400 h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
                <span>Day 0 (Nutrient Injected)</span>
                <span>Day 1.5 (Initial Exponential Spike)</span>
                <span>Day 7 (2nd Inoculation)</span>
                <span>Day 10 (Saturation Plateau)</span>
              </div>
            </div>

            {/* Graphical Telemetry Display */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/60 p-4 lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-white/80">
                    Radioactivity Rate Telemetry (Beta Emission Detector)
                  </span>
                  <span className="font-mono text-[11px] text-amber-400">
                    Max: ~11,500 CPM
                  </span>
                </div>

                {/* SVG Telemetry Curve */}
                <div className="relative h-44 w-full">
                  <svg viewBox="0 0 500 180" className="h-full w-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="170" x2="500" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                    <line x1="0" y1="10" x2="500" y2="10" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                    {/* Heat Control Curve (Flat line near 15 CPM) */}
                    <polyline
                      points="0,168 100,168 200,167 300,168 400,168 500,168"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />

                    {/* Active Soil Surge Curve */}
                    <path
                      d="M 0,170 C 30,165 60,35 150,22 C 250,18 350,24 370,30 C 400,28 450,25 500,24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                    />

                    {/* Current Scrubber Point */}
                    <circle
                      cx={(incubationDay / 10) * 500}
                      cy={170 - (activeCpm / 11500) * 150}
                      r="6"
                      fill="#f59e0b"
                      className="animate-pulse"
                    />
                  </svg>
                </div>

                <div className="mt-3 flex items-center justify-between font-mono text-[11px]">
                  <span className="flex items-center gap-2 text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Raw Martian Regolith (Spike to 10,800+ CPM)
                  </span>
                  <span className="flex items-center gap-2 text-sky-400">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    Sterilized Soil Control (160°C, flat ~15 CPM)
                  </span>
                </div>
              </div>

              {/* Explanatory Context Card */}
              <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
                {explanationMode === "historical" ? (
                  <div>
                    <span className="font-mono text-[10px] text-amber-300 uppercase tracking-wider">
                      The 1976 Puzzle
                    </span>
                    <h4 className="mt-1 font-bold text-sm text-white">
                      Did Viking Detect Martian Life?
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-white/80">
                      Before launch, NASA agreed that if a soil sample generated ¹⁴CO₂ gas when fed, and stopped generating gas when baked at 160°C, it would be considered proof of living microbes.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-rose-300">
                      However, the onboard GCMS instrument detected zero organic carbon down to 1 part per billion! How could living microbes exist without organic molecules?
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-wider">
                      The 2008 Resolution
                    </span>
                    <h4 className="mt-1 font-bold text-sm text-white">
                      The Perchlorate Salt Revolution
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-white/80">
                      32 years later, Phoenix discovered perchlorate salts (ClO₄⁻) across Mars. Surface radiation turns perchlorates into superoxides.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-emerald-300">
                      When the nutrient broth was poured, the superoxides chemically ripped the amino acids apart into ¹⁴CO₂—explaining the spike completely without needing living biology!
                    </p>
                  </div>
                )}

                <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-white/60">
                  <span>Instrument: Labeled Release (LR)</span>
                  <br />
                  <span>PI: Gilbert V. Levin & Patricia Ann Straat</span>
                </div>
              </div>
            </div>

            {/* Biology Experiments Catalog Accordion */}
            <div className="mt-6">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white/60 mb-3">
                The 4 Onboard Soil Instruments
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VIKING_BIOLOGY_EXPERIMENTS.map((exp) => (
                  <div
                    key={exp.name}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{exp.name}</span>
                      <span className="font-mono text-[10px] text-amber-400 font-normal">
                        {exp.principalInvestigator}
                      </span>
                    </div>
                    <p className="text-white/70">{exp.technique}</p>
                    <p className="text-emerald-400 font-mono text-[11px]">
                      Outcome: {exp.whatHappened}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACSIMILE SCANNING CAMERA */}
      {activeTab === "camera" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="font-mono text-xs text-sky-400 uppercase tracking-wider">
                  Mechanical Telemetry Scanner
                </span>
                <h3 className="display mt-1 text-xl font-bold">
                  Itek Mechanical Nodding-Mirror Facsimile Camera
                </h3>
                <p className="mt-1 text-xs text-white/70 max-w-2xl">
                  Viking did not use a digital CCD chip or film. A motorized mirror physically tilted vertically to sweep a single pinhole line across a photodiode, then rotated horizontally for the next line!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setScanProgress(0);
                  setIsScanning(true);
                }}
                disabled={isScanning}
                className="rounded-xl bg-violet px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-violet-deep disabled:opacity-50"
              >
                {isScanning ? "Scanning Line-by-Line..." : "Initiate 60° Line Scan"}
              </button>
            </div>

            {/* Interactive Visual Scan Mirror */}
            <div className="mt-6 relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/15 bg-black">
              {/* Historical First Footpad Image Preview */}
              <div className="relative h-full w-full">
                <Image
                  src={
                    isViking1
                      ? "https://photojournal.jpl.nasa.gov/jpeg/PIA00563.jpg"
                      : "https://photojournal.jpl.nasa.gov/jpeg/PIA00570.jpg"
                  }
                  alt={`${specs.name} first image on Mars`}
                  fill
                  className="object-cover grayscale contrast-125 brightness-95"
                  unoptimized
                />

                {/* Scan Overlay Mask */}
                <div
                  className="absolute inset-y-0 right-0 bg-black/90 backdrop-blur-xs transition-all duration-75"
                  style={{ width: `${100 - scanProgress}%` }}
                />

                {/* Active Line Laser Beam */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-amber-400 shadow-[0_0_12px_#f59e0b]"
                  style={{ left: `${scanProgress}%` }}
                />

                {/* Telemetry HUD on Scan */}
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 px-3 py-1.5 font-mono text-[10px] text-white/80 border border-white/10">
                  <span>Line: {Math.round((scanProgress / 100) * 1500)} / 1500</span> ·{" "}
                  <span>Azimuth: {((scanProgress / 100) * 60).toFixed(1)}°</span> ·{" "}
                  <span>Resolution: {FACSIMILE_CAMERA_SPECS.instantaneousFieldOfViewDeg}°/pixel</span>
                </div>
              </div>
            </div>

            {/* Slider Scrubber */}
            <div className="mt-4">
              <input
                type="range"
                min="0"
                max="100"
                value={scanProgress}
                onChange={(e) => {
                  setIsScanning(false);
                  setScanProgress(parseInt(e.target.value, 10));
                }}
                className="w-full accent-amber-400 h-2 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
                <span>0° Azimuth (Start Line)</span>
                <span>30° Azimuth</span>
                <span>60° Full Swath Completed</span>
              </div>
            </div>

            {/* Camera Technical Telemetry Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-white/50 text-[10px] uppercase">Aperture</span>
                <p className="font-bold text-white mt-1">{FACSIMILE_CAMERA_SPECS.apertureMm} mm</p>
                <p className="text-[10px] text-white/60">Focal length {FACSIMILE_CAMERA_SPECS.focalLengthMm} mm</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-white/50 text-[10px] uppercase">Elevation Nod</span>
                <p className="font-bold text-white mt-1">{FACSIMILE_CAMERA_SPECS.mirrorElevationRangeDeg}</p>
                <p className="text-[10px] text-white/60">Motorized nodding mirror</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-white/50 text-[10px] uppercase">Sweep Rate</span>
                <p className="font-bold text-white mt-1">{FACSIMILE_CAMERA_SPECS.lineRateSeconds} s / line</p>
                <p className="text-[10px] text-white/60">10.7 min for 60° frame</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-white/50 text-[10px] uppercase">Bit Depth</span>
                <p className="font-bold text-cyan-300 mt-1">{FACSIMILE_CAMERA_SPECS.encodingBits}-Bit Telemetry</p>
                <p className="text-[10px] text-white/60">Silicon PIN photodiodes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISCARDED RELICS MANIFEST */}
      {activeTab === "relics" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: Relics List strictly for this lander */}
            <div className="space-y-2 lg:col-span-1">
              <p className="font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Discarded Hardware Artifacts
              </p>
              {landerRelics.map((r) => {
                const isSelected = r.id === selectedRelicId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRelicId(r.id)}
                    className={`w-full text-left rounded-xl p-3 border transition-all ${
                      isSelected
                        ? "border-amber-400/50 bg-amber-500/15 text-white"
                        : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="uppercase text-amber-300">{r.classification}</span>
                      <span>{r.distanceFromLanderMeters} m from lander</span>
                    </div>
                    <p className="mt-1 font-bold text-sm text-white">{r.name}</p>
                    <p className="text-[11px] text-white/60 truncate mt-0.5">{r.coordinates}</p>
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Relic Deep Dive */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
                    {activeRelic.classification}
                  </span>
                  <h3 className="display mt-1 text-2xl font-bold">{activeRelic.name}</h3>
                </div>
                <div className="text-right font-mono text-xs">
                  <p className="text-white/50">Distance</p>
                  <p className="text-base font-bold text-amber-300">
                    {activeRelic.distanceFromLanderMeters} meters
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-xs leading-relaxed text-white/80">
                <div>
                  <h4 className="font-mono text-[11px] font-semibold text-white/50 uppercase">
                    Location Coordinates
                  </h4>
                  <p className="font-mono text-sm font-bold text-cyan-300 mt-0.5">
                    {activeRelic.coordinates}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-[11px] font-semibold text-white/50 uppercase">
                    Condition on Mars Today
                  </h4>
                  <p className="mt-0.5 text-white/90">{activeRelic.condition}</p>
                </div>

                <div>
                  <h4 className="font-mono text-[11px] font-semibold text-white/50 uppercase">
                    Historical & Scientific Significance
                  </h4>
                  <p className="mt-0.5 text-white/90">{activeRelic.significance}</p>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <h4 className="font-mono text-[11px] font-semibold text-amber-300 uppercase">
                    Youth Space Takeaway (Ages 10–16)
                  </h4>
                  <p className="mt-1 text-xs text-white/90">{activeRelic.youthInsight}</p>
                </div>
              </div>

              {/* HiRISE Orbital Verification Link */}
              <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">
                  HiRISE Archive: {specs.landingCoordinates.hiriseFrame}
                </span>
                <a
                  href={`https://hirise.lpl.arizona.edu/${specs.landingCoordinates.hiriseFrame}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-amber-300 hover:bg-white/20 transition-all flex items-center gap-1.5"
                >
                  <span>Inspect HiRISE Frame</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
