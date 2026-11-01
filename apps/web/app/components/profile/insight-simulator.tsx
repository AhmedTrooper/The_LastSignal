"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  INSIGHT_SPECS,
  MARSQUAKE_CATALOG,
  POWER_SURVIVAL_CURVE,
  FLIGHT_DIRECTOR_BUDGET,
  POST_MISSION_DISCOVERIES,
  INSIGHT_HARDWARE_MANIFEST,
  AVIONICS_SPECS,
  VERBATIM_TRANSMISSIONS,
  OFFICIAL_REPOSITORIES,
  SEISMIC_PHYSICS,
  type MarsquakeEvent,
  type HardwareArtifact,
} from "@/lib/insight-mission";

interface InSightSimulatorProps {
  standalone?: boolean;
}

export default function InSightSimulator({ standalone = false }: InSightSimulatorProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"seismo" | "power" | "discoveries" | "hardware" | "final-signal">("seismo");

  // TAB 1: SEISMIC STATE
  const [selectedQuake, setSelectedQuake] = useState<MarsquakeEvent>(MARSQUAKE_CATALOG[5]); // Default S1222a Monster Quake
  const [caliperP, setCaliperP] = useState<number>(30); // Seconds relative to waveform start
  const [caliperS, setCaliperS] = useState<number>(265); // Seconds
  const [glitchFilterEnabled, setGlitchFilterEnabled] = useState<boolean>(true);
  const [soundMode, setSoundMode] = useState<"seismic" | "wind" | "bloop">("seismic");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // TAB 2: POWER & SOL SCRUBBER STATE
  const [selectedSolIndex, setSelectedSolIndex] = useState<number>(0);
  const [subsystemStates, setSubsystemStates] = useState<{ [id: string]: boolean }>({
    heaters: true,
    seis: true,
    apss: true,
    arm: false,
  });
  const [saltationCleanedBonus, setSaltationCleanedBonus] = useState<number>(0);
  const [saltationAnimating, setSaltationAnimating] = useState<boolean>(false);

  // TAB 4: HARDWARE BLUEPRINT STATE
  const [selectedArtifact, setSelectedArtifact] = useState<HardwareArtifact>(INSIGHT_HARDWARE_MANIFEST[0]);
  const [blueprintSubsystem, setBlueprintSubsystem] = useState<"cpu" | "cams" | "seis" | "mole" | "larri">("cpu");

  // Web Audio Context & Nodes Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<{ stop: () => void } | null>(null);

  // Derived Seismic Values
  const measuredDeltaT = Math.max(1, caliperS - caliperP);
  const measuredDistanceKm = Math.round(measuredDeltaT * SEISMIC_PHYSICS.triangulationFactor);
  const measuredDegrees = (measuredDistanceKm * SEISMIC_PHYSICS.degreesPerKm).toFixed(1);
  const distanceAccuracyPercent = useMemo(() => {
    const error = Math.abs(measuredDistanceKm - selectedQuake.distanceKm);
    const accuracy = Math.max(0, 100 - (error / Math.max(selectedQuake.distanceKm, 100)) * 100);
    return Math.round(accuracy);
  }, [measuredDistanceKm, selectedQuake.distanceKm]);

  // Derived Flight Director Power Draw
  const currentTotalDrawWh = useMemo(() => {
    let sum = 0;
    FLIGHT_DIRECTOR_BUDGET.subsystems.forEach((sub) => {
      if (subsystemStates[sub.id]) {
        sum += sub.drawWh;
      }
    });
    return sum;
  }, [subsystemStates]);

  const powerSurplusWh = FLIGHT_DIRECTOR_BUDGET.dailyBatteryBudgetWh + saltationCleanedBonus - currentTotalDrawWh;

  // Sync default calipers when quake changes
  const handleSelectQuake = useCallback((quake: MarsquakeEvent) => {
    setSelectedQuake(quake);
    const startP = 30;
    setCaliperP(startP);
    setCaliperS(startP + quake.deltaTSeconds);
  }, []);

  // Stop any active Web Audio
  const stopAudio = useCallback(() => {
    try {
      if (activeNodesRef.current) {
        activeNodesRef.current.stop();
        activeNodesRef.current = null;
      }
      setIsPlayingAudio(false);
    } catch {
      // Ignore
    }
  }, []);

  // Web Audio Synthesizer: Real Martian Wind, Bloop Chirp, & Filtered Seismic Waves
  const playSound = useCallback(
    (mode: "seismic" | "wind" | "bloop") => {
      stopAudio();
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

        const now = ctx.currentTime;

        if (mode === "wind") {
          // Pink/Brown Noise Martian Wind (Sol 5 / Sol 4)
          const bufferSize = ctx.sampleRate * 4;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Gain
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(140, now); // Low Martian atmospheric cutoff

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.8);
          gain.gain.linearRampToValueAtTime(0.01, now + 3.8);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          noise.start(now);
          noise.stop(now + 4);

          activeNodesRef.current = {
            stop: () => {
              try {
                noise.stop();
              } catch {
                // Ignore
              }
            },
          };
        } else if (mode === "bloop") {
          // Acoustic Meteoroid Impact Bloop (Sol 1003 / 988)
          // Atmospheric bass-reflex effect: low frequencies arrive BEFORE high frequencies
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(45, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.8); // Bloop chirp up

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.exponentialRampToValueAtTime(0.25, now + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 1.2);

          activeNodesRef.current = {
            stop: () => {
              try {
                osc.stop();
              } catch {
                // Ignore
              }
            },
          };
        } else {
          // Seismic Rumble Sonification (Speeded up into human-audible 40-120 Hz)
          const baseFreq = 45 + selectedQuake.magnitude * 14;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc1.type = "triangle";
          osc1.frequency.setValueAtTime(baseFreq, now);

          osc2.type = "sine";
          osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

          // Low-pass filter toggle (glitch filter removes thermal pops > 1.0 Hz in real-time)
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(glitchFilterEnabled ? 120 : 800, now);

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
          gain.gain.linearRampToValueAtTime(0.08, now + 2.5);
          gain.gain.linearRampToValueAtTime(0.001, now + 4.5);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 4.5);
          osc2.stop(now + 4.5);

          activeNodesRef.current = {
            stop: () => {
              try {
                osc1.stop();
                osc2.stop();
              } catch {
                // Ignore
              }
            },
          };
        }

        setIsPlayingAudio(true);
        setTimeout(() => {
          setIsPlayingAudio(false);
        }, mode === "bloop" ? 1200 : mode === "wind" ? 4000 : 4500);
      } catch {
        setIsPlayingAudio(false);
      }
    },
    [glitchFilterEnabled, selectedQuake, stopAudio]
  );

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Saltation Hack Interactive Trigger
  const triggerSaltationHack = () => {
    if (saltationAnimating) return;
    setSaltationAnimating(true);
    setTimeout(() => {
      setSaltationCleanedBonus((prev) => Math.min(prev + 30, 90));
      setSaltationAnimating(false);
    }, 1200);
  };

  const currentSolData = POWER_SURVIVAL_CURVE[selectedSolIndex];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-rose-500/20 bg-[#090614] text-white shadow-2xl transition-all ${
        standalone ? "mx-auto max-w-6xl p-5 sm:p-8" : "p-4 sm:p-6"
      }`}
    >
      {/* Background Geophysics Radial Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_50%_10%,rgba(244,63,94,0.35),transparent_70%)]" />

      {/* Top Mission Control Bar */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 font-mono text-xs font-semibold text-rose-300 border border-rose-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
              NASA Discovery Program #12 · Living Artifact Command Station
            </span>
            <span className="font-mono text-xs text-white/50">{INSIGHT_SPECS.cosparId} · SATCAT {INSIGHT_SPECS.noradId}</span>
          </div>
          <h2 className="display mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl text-white">
            InSight Mars Lander (2018–2022)
          </h2>
          <p className="mt-0.5 text-xs text-rose-200/80 sm:text-sm">
            Homestead Hollow, Elysium Planitia · 4.5024° N, 135.6234° E · 1,319 Marsquakes Detected
          </p>
        </div>

        {/* Status Callout Badge */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-right backdrop-blur-md">
          <p className="font-mono text-[10px] uppercase tracking-wider text-rose-300">Surface Mission Duration</p>
          <p className="font-mono text-lg font-bold text-white">1,440 Sols <span className="text-xs text-white/60">(1,480 Days)</span></p>
          <p className="font-mono text-[10px] text-white/50">Dec 21, 2022 Formal Conclusion</p>
        </div>
      </div>

      {/* Interactive Feature Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: "seismo", label: "Marsquake Lab & P–S Calipers", badge: "Playable Telemetry" },
          { id: "power", label: "1,440-Sol Power & Budget", badge: "Flight Director" },
          { id: "discoveries", label: "Post-Mission Science (2023–2026)", badge: "New Discoveries" },
          { id: "hardware", label: "Homestead Hollow & Blueprint", badge: "7 Artifacts" },
          { id: "final-signal", label: "Verbatim Final Signal", badge: "Dec 2022" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/25 border border-rose-400"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[9px] font-mono uppercase ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/5 text-rose-300"
              }`}
            >
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MARSQUAKE LAB & P-S WAVE TRIANGULATION                             */}
      {/* ========================================================================= */}
      {activeTab === "seismo" && (
        <div className="relative z-10 space-y-6">
          {/* Top Seismology Overview & Formula Bar */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
              <span className="font-mono text-[10px] uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Geophysical Triangulation Engine
              </span>
              <h3 className="display mt-2 text-xl font-bold">Act as Mars Seismologist</h3>
              <p className="mt-1 text-xs text-white/70 leading-relaxed">
                Primary compressional waves (<span className="text-cyan-300 font-mono">P-waves, v_P ≈ 7.3 km/s</span>) race ahead through the mantle. Slower shear waves (<span className="text-amber-300 font-mono">S-waves, v_S ≈ 4.1 km/s</span>) follow behind. Slide the calipers below to measure the time delay <span className="font-mono text-rose-300">Δt = t_S - t_P</span> and compute the quake&apos;s distance across Mars!
              </p>

              {/* Real Mathematical Formula Card */}
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-black/50 p-3 font-mono text-xs">
                <div className="text-[11px] text-white/50 mb-1">Authentic Travel-Time Formula:</div>
                <div className="text-rose-300 font-bold text-sm">
                  d ≈ Δt × [ (v_P · v_S) / (v_P - v_S) ] = Δt × 9.35 km/s
                </div>
                <div className="mt-1 text-[11px] text-white/60">
                  Every 100 seconds between P and S arrivals equals ~935 km across the surface of Mars.
                </div>
              </div>
            </div>

            {/* Quake Selector */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
              <span className="font-mono text-[10px] uppercase text-white/50">Select One of the 6 Landmark Quakes</span>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MARSQUAKE_CATALOG.map((quake) => (
                  <button
                    key={quake.id}
                    onClick={() => handleSelectQuake(quake)}
                    className={`rounded-xl p-2.5 text-left transition-all border ${
                      selectedQuake.id === quake.id
                        ? "border-rose-400 bg-rose-500/20 shadow-md shadow-rose-500/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{quake.id}</span>
                      <span className="font-mono text-[10px] text-rose-300">M{quake.magnitude}</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-white/60">Sol {quake.sol}</p>
                    <p className="text-[10px] text-white/70 truncate">{quake.milestone.split(".")[0]}</p>
                  </button>
                ))}
              </div>

              {/* Selected Quake Metadata */}
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="font-mono text-xs text-rose-300 font-bold">{selectedQuake.id} — {selectedQuake.milestone}</p>
                <p className="mt-1 text-xs text-white/70">{selectedQuake.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] text-white/60">
                  <span>True Distance: <b className="text-white">{selectedQuake.distanceKm} km</b> ({selectedQuake.distanceDeg || (selectedQuake.distanceKm * SEISMIC_PHYSICS.degreesPerKm).toFixed(1)}°)</span>
                  <span>Azimuth: <b className="text-white">{selectedQuake.backAzimuth || "N/A"}</b></span>
                  <span>Duration: <b className="text-white">{selectedQuake.durationMin} min</b></span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Draggable Waveform Canvas Simulation */}
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  SEIS VBB Seismogram Calipers (Station XB.ELYSE)
                </h4>
                <p className="text-[11px] text-white/60">
                  Drag the P-Arrival and S-Arrival sliders to match the wave phase onsets.
                </p>
              </div>

              {/* Glitch & Donk Filter Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGlitchFilterEnabled((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono transition-all border ${
                    glitchFilterEnabled
                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                      : "border-amber-500/50 bg-amber-500/20 text-amber-300"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${glitchFilterEnabled ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                  {glitchFilterEnabled ? "Glitch & Donk Filter: ON (0.05–1.0 Hz)" : "Raw Wave (Thermal Pops Active)"}
                </button>
              </div>
            </div>

            {/* Simulated Seismogram Canvas */}
            <div className="relative h-44 w-full rounded-xl bg-[#05030b] border border-white/10 overflow-hidden flex items-center">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_20px]" />

              {/* Seismic waveform SVG */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <path
                  d={`M 0 50 
                     Q 20 ${50 + (glitchFilterEnabled ? 0 : 35)}, 40 50 
                     L 100 50 
                     Q 120 ${50 - (glitchFilterEnabled ? 0 : 40)}, 140 50 
                     L 200 50 
                     Q 240 ${35 - selectedQuake.magnitude * 2}, 280 50 
                     Q 320 ${65 + selectedQuake.magnitude * 2}, 360 50 
                     Q 400 45, 450 50
                     Q 520 ${20 - selectedQuake.magnitude * 4}, 580 50 
                     Q 640 ${80 + selectedQuake.magnitude * 4}, 700 50
                     Q 780 40, 840 50
                     L 1000 50`}
                  fill="none"
                  stroke={selectedQuake.type === "monster" ? "#f43f5e" : "#38bdf8"}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </svg>

              {/* P-Wave Caliper Line */}
              <div
                className="absolute top-0 bottom-0 border-l-2 border-cyan-400 z-10 pointer-events-none"
                style={{ left: `${Math.min(95, Math.max(5, (caliperP / 1000) * 100))}%` }}
              >
                <span className="absolute top-2 left-1 bg-cyan-500 text-black font-mono font-bold text-[9px] px-1 rounded">
                  P-Wave ({caliperP}s)
                </span>
              </div>

              {/* S-Wave Caliper Line */}
              <div
                className="absolute top-0 bottom-0 border-l-2 border-amber-400 z-10 pointer-events-none"
                style={{ left: `${Math.min(95, Math.max(5, (caliperS / 1000) * 100))}%` }}
              >
                <span className="absolute top-2 left-1 bg-amber-500 text-black font-mono font-bold text-[9px] px-1 rounded">
                  S-Wave ({caliperS}s)
                </span>
              </div>

              {/* Measured Delta T band */}
              <div
                className="absolute top-0 bottom-0 bg-rose-500/10 pointer-events-none border-y border-rose-500/30"
                style={{
                  left: `${Math.min(95, Math.max(5, (caliperP / 1000) * 100))}%`,
                  width: `${Math.max(2, ((caliperS - caliperP) / 1000) * 100)}%`,
                }}
              />
            </div>

            {/* Sliders for P and S Calipers */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-cyan-300 font-bold">P-Wave Arrival Time</span>
                  <span className="text-white">{caliperP} seconds</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  value={caliperP}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setCaliperP(val);
                    if (val >= caliperS) setCaliperS(val + 10);
                  }}
                  className="w-full accent-cyan-400 h-2 bg-white/20 rounded cursor-pointer"
                />
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-amber-300 font-bold">S-Wave Arrival Time</span>
                  <span className="text-white">{caliperS} seconds</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={caliperS}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setCaliperS(val);
                    if (val <= caliperP) setCaliperP(Math.max(0, val - 10));
                  }}
                  className="w-full accent-amber-400 h-2 bg-white/20 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Real-Time Calculation Outcome Card */}
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase text-rose-300">Live Triangulation Result</p>
                <p className="display text-xl font-bold text-white">
                  Δt = {measuredDeltaT}s ➔ Calculated Distance: <span className="text-rose-400">{measuredDistanceKm} km</span> ({measuredDegrees}°)
                </p>
                <p className="text-xs text-white/70">
                  NASA Catalog True Distance: <b className="text-white">{selectedQuake.distanceKm} km</b>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-center font-mono">
                  <span className="text-[10px] text-white/50 block">Accuracy</span>
                  <span className={`text-base font-bold ${distanceAccuracyPercent > 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    {distanceAccuracyPercent}%
                  </span>
                </div>

                <button
                  onClick={() => {
                    setCaliperP(30);
                    setCaliperS(30 + selectedQuake.deltaTSeconds);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono hover:bg-white/10"
                >
                  Snap to Exact Telemetry
                </button>
              </div>
            </div>
          </div>

          {/* Authentic Mars Soundboard & Sonification */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h4 className="display text-lg font-bold">Authentic Mars Audio Soundboard</h4>
                <p className="text-xs text-white/70">
                  Listen to real vibrations sensed by SEIS on the Martian surface, sped up into human-audible frequencies.
                </p>
              </div>

              {isPlayingAudio && (
                <button
                  onClick={stopAudio}
                  className="rounded-xl border border-rose-500/50 bg-rose-500/20 px-4 py-1.5 font-mono text-xs text-rose-300 hover:bg-rose-500/30"
                >
                  ■ Stop Audio
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={() => {
                  setSoundMode("wind");
                  playSound("wind");
                }}
                className={`rounded-xl border p-4 text-left transition-all ${
                  soundMode === "wind" && isPlayingAudio
                    ? "border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-cyan-300">Martian Wind (Sol 5)</span>
                  <span>10–15 mph</span>
                </div>
                <p className="mt-1 text-xs text-white/70">
                  Breeze vibrating the twin solar panels like giant eardrums. First authentic audio from Mars.
                </p>
                <span className="mt-2 inline-block font-mono text-[10px] text-cyan-400">▶ Play Wind Rumble</span>
              </button>

              <button
                onClick={() => {
                  setSoundMode("bloop");
                  playSound("bloop");
                }}
                className={`rounded-xl border p-4 text-left transition-all ${
                  soundMode === "bloop" && isPlayingAudio
                    ? "border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-amber-300">Meteoroid &apos;Bloop!&apos; (Sol 988)</span>
                  <span>Impact Acoustic</span>
                </div>
                <p className="mt-1 text-xs text-white/70">
                  Exploding meteoroid shockwave chirp arriving before cratering shock.
                </p>
                <span className="mt-2 inline-block font-mono text-[10px] text-amber-400">▶ Play Meteoroid Bloop</span>
              </button>

              <button
                onClick={() => {
                  setSoundMode("seismic");
                  playSound("seismic");
                }}
                className={`rounded-xl border p-4 text-left transition-all ${
                  soundMode === "seismic" && isPlayingAudio
                    ? "border-rose-400 bg-rose-500/20 shadow-lg shadow-rose-500/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-rose-300">Monster Quake S1222a</span>
                  <span>Magnitude 4.7</span>
                </div>
                <p className="mt-1 text-xs text-white/70">
                  Sonified deep mantle reverberation that rang through the Martian crust for 6 hours.
                </p>
                <span className="mt-2 inline-block font-mono text-[10px] text-rose-400">▶ Sonify Quake Wave</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 1,440-SOL POWER SCRUBBER & FLIGHT DIRECTOR SIMULATOR              */}
      {/* ========================================================================= */}
      {activeTab === "power" && (
        <div className="relative z-10 space-y-6">
          {/* Timeline Scrubber */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  1,440-Sol Telemetry Scrubber
                </span>
                <h3 className="display mt-1 text-xl font-bold">The Dust Blanket &amp; Power Decay</h3>
                <p className="text-xs text-white/70">
                  Scrub across InSight&apos;s 4-year lifespan to inspect real daily Watt-hour output and dust opacity (τ).
                </p>
              </div>

              {/* Daily Output Readout */}
              <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-right">
                <span className="font-mono text-[10px] text-white/50 block">Output on Sol {currentSolData.sol}</span>
                <span className="font-mono text-xl font-bold text-amber-400">
                  {currentSolData.powerWh} Wh/sol
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={POWER_SURVIVAL_CURVE.length - 1}
                value={selectedSolIndex}
                onChange={(e) => setSelectedSolIndex(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 h-2 bg-white/20 rounded cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-white/50">
                <span>Sol 1 (4,588 Wh)</span>
                <span>Sol 884 (Sand Hack)</span>
                <span>Sol 1211 (Selfie)</span>
                <span>Sol 1440 (Final Signal)</span>
              </div>
            </div>

            {/* Current Sol Status Card */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-black/30 p-3.5">
                <span className="font-mono text-[10px] text-white/50 block">Milestone Event</span>
                <p className="font-mono text-xs font-bold text-amber-300 mt-1">{currentSolData.event}</p>
                <p className="text-[11px] text-white/70 mt-1">{currentSolData.description}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/30 p-3.5">
                <span className="font-mono text-[10px] text-white/50 block">Dust Opacity (Tau τ)</span>
                <p className="display text-2xl font-bold text-white mt-1">τ = {currentSolData.tauOpacity}</p>
                <p className="text-[11px] text-white/70 mt-1">
                  {currentSolData.tauOpacity > 1.2 ? "Heavy regional dust storm blocking sunlight." : "Clear atmospheric conditions."}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/30 p-3.5">
                <span className="font-mono text-[10px] text-white/50 block">Array Efficiency Remaining</span>
                <p className="display text-2xl font-bold text-rose-400 mt-1">{Math.round(currentSolData.dustFactor * 100)}%</p>
                <p className="text-[11px] text-white/70 mt-1">
                  Dropped from 100% (4.6 kWh/sol) down to ~5% at loss of signal.
                </p>
              </div>
            </div>
          </div>

          {/* Sol 1200 Flight Director Simulator */}
          <div className="rounded-2xl border border-rose-500/20 bg-white/[0.02] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Flight Director Roleplay
                </span>
                <h3 className="display mt-1 text-xl font-bold">Sol 1200 Power Budget Crisis</h3>
                <p className="text-xs text-white/70">
                  You have only <span className="font-mono font-bold text-rose-300">500 Wh</span> of daily electricity. Toggle subsystems to keep InSight alive without freezing the bus!
                </p>
              </div>

              {/* Saltation Cleaning Hack Button */}
              <button
                onClick={triggerSaltationHack}
                disabled={saltationAnimating || saltationCleanedBonus >= 90}
                className="flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/20 px-4 py-2 font-mono text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-all disabled:opacity-50"
              >
                <span>{saltationAnimating ? "Trickling Sand..." : "Execute Sand-Pouring Saltation Hack (+30 Wh)"}</span>
              </button>
            </div>

            {/* Subsystem Toggles */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FLIGHT_DIRECTOR_BUDGET.subsystems.map((sub) => {
                const active = subsystemStates[sub.id];
                return (
                  <button
                    key={sub.id}
                    onClick={() =>
                      setSubsystemStates((prev) => ({
                        ...prev,
                        [sub.id]: !prev[sub.id],
                      }))
                    }
                    className={`rounded-xl border p-4 text-left transition-all ${
                      active
                        ? "border-rose-400 bg-rose-500/20 shadow-md shadow-rose-500/10"
                        : "border-white/10 bg-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-white">{sub.name}</span>
                      <span className={active ? "text-rose-300 font-bold" : "text-white/40"}>
                        {sub.drawWh} Wh
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-white/70 leading-relaxed">{sub.description}</p>
                    <div className="mt-3 font-mono text-[10px] uppercase font-bold">
                      Status: <span className={active ? "text-emerald-400" : "text-rose-400"}>{active ? "ACTIVE" : "SHED / OFF"}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Power Balance Summary */}
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-between font-mono text-xs">
              <div>
                <span className="text-white/50 block">Current Energy Balance:</span>
                <span className="text-sm">
                  Budget: <b className="text-amber-300">{FLIGHT_DIRECTOR_BUDGET.dailyBatteryBudgetWh + saltationCleanedBonus} Wh</b> | Draw: <b className="text-white">{currentTotalDrawWh} Wh</b>
                </span>
              </div>

              <div>
                {powerSurplusWh < 0 ? (
                  <span className="text-rose-400 font-bold bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/40">
                    ⚠ BATTERY BROWNOUT DEFICIT: {powerSurplusWh} Wh (Mission Fails Tonight)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/40">
                    ✓ NOMINAL SURPLUS: +{powerSurplusWh} Wh (Survives Martian Night)
                  </span>
                )}
              </div>
            </div>

            {!subsystemStates.heaters && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
                <b>Historical Note:</b> In late 2022, JPL engineers made the exact sacrifice you just did—they intentionally disabled InSight&apos;s survival heaters so every remaining drop of electricity could feed the SEIS seismometer until the very end.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: POST-MISSION DISCOVERIES (2023–2026)                               */}
      {/* ========================================================================= */}
      {activeTab === "discoveries" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
            <span className="font-mono text-[10px] uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Living Science from Dead Hardware
            </span>
            <h3 className="display mt-1 text-xl font-bold">What Humanity Continues to Learn (2023–2026)</h3>
            <p className="text-xs text-white/70">
              The NASA challenge prompt asks what discoveries silent machines &quot;continue to make.&quot; Even after power loss in December 2022, InSight&apos;s archived data and resting chassis yielded five groundbreaking discoveries.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POST_MISSION_DISCOVERIES.map((disc) => (
              <div
                key={disc.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-cyan-500/40"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {disc.date}
                    </span>
                    <span className="text-white/50">{disc.keyMetric}</span>
                  </div>
                  <h4 className="display mt-3 text-base font-bold text-white">{disc.title}</h4>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">{disc.summary}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-[10px] font-mono text-cyan-300"><b>Significance:</b> {disc.significance}</p>
                  <a
                    href={disc.doiOrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-white/50 hover:text-cyan-300 transition-colors"
                  >
                    <span>Source: {disc.journal}</span> ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HOMESTEAD HOLLOW & BLUEPRINT INSPECTOR                             */}
      {/* ========================================================================= */}
      {activeTab === "hardware" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* 7 Resting Artifacts at Homestead Hollow */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
              <span className="font-mono text-[10px] uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Surface &amp; Deep-Space Manifest
              </span>
              <h3 className="display mt-1 text-xl font-bold">The 7 Left-Behind Artifacts</h3>
              <p className="text-xs text-white/70 mb-4">
                4.5024° N, 135.6234° E · Homestead Hollow, Western Elysium Planitia
              </p>

              <div className="space-y-2">
                {INSIGHT_HARDWARE_MANIFEST.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedArtifact(item)}
                    className={`w-full rounded-xl p-3 text-left transition-all border ${
                      selectedArtifact.id === item.id
                        ? "border-rose-400 bg-rose-500/20 shadow-md shadow-rose-500/10"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="text-rose-300">{item.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/70">{item.description}</p>
                    <div className="mt-1 flex justify-between font-mono text-[10px] text-white/40">
                      <span>Mass: {item.massKg} kg</span>
                      <span>Location: {item.location}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Avionics Blueprint Inspector */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <span className="font-mono text-[10px] uppercase text-white/50">Engineering Blueprint Inspector</span>
              <h3 className="display mt-1 text-xl font-bold">Inside the 2018-042A Bus</h3>

              {/* Subsystem Select Buttons */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  { id: "cpu", label: "RAD750 CPU" },
                  { id: "cams", label: "IDC/ICC Cameras" },
                  { id: "seis", label: "SEIS Pendulums" },
                  { id: "larri", label: "LaRRI Mirror Dome" },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setBlueprintSubsystem(btn.id as typeof blueprintSubsystem)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                      blueprintSubsystem === btn.id
                        ? "bg-rose-500 text-white font-bold"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Blueprint Details */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                {blueprintSubsystem === "cpu" && (
                  <div className="space-y-2">
                    <p className="font-mono text-rose-300 font-bold">{AVIONICS_SPECS.computer.processor}</p>
                    <p className="text-white/80">Clock Speed: <b className="text-white">{AVIONICS_SPECS.computer.clockSpeed}</b></p>
                    <p className="text-white/80">Operating System: <b className="text-white">{AVIONICS_SPECS.computer.os}</b></p>
                    <p className="text-white/80">Storage: <b className="text-white">{AVIONICS_SPECS.computer.memory}</b></p>
                    <p className="text-white/80">Power Architecture: <b className="text-white">{AVIONICS_SPECS.computer.powerBus}</b></p>
                  </div>
                )}

                {blueprintSubsystem === "cams" && (
                  <div className="space-y-2">
                    <p className="font-mono text-cyan-300 font-bold">Dual Engineering Imaging System</p>
                    <p className="text-white/80"><b className="text-white">IDC:</b> {AVIONICS_SPECS.cameras.idc}</p>
                    <p className="text-white/80"><b className="text-white">ICC:</b> {AVIONICS_SPECS.cameras.icc}</p>
                  </div>
                )}

                {blueprintSubsystem === "seis" && (
                  <div className="space-y-2">
                    <p className="font-mono text-amber-300 font-bold">Ultra-Sensitive Pendulum Vacuum Sphere</p>
                    <p className="text-white/80"><b className="text-white">VBB Sensors:</b> {AVIONICS_SPECS.seismologySensors.vbb}</p>
                    <p className="text-white/80"><b className="text-white">SP Sensors:</b> {AVIONICS_SPECS.seismologySensors.sp}</p>
                    <p className="text-white/80"><b className="text-white">Limit:</b> {AVIONICS_SPECS.seismologySensors.sensitivity}</p>
                  </div>
                )}

                {blueprintSubsystem === "larri" && (
                  <div className="space-y-2">
                    <p className="font-mono text-emerald-300 font-bold">LaRRI Laser Retroreflector (Still Functional)</p>
                    <p className="text-white/80">
                      Eight fused-silica corner-cube prisms mounted inside a palm-sized aluminum housing.
                    </p>
                    <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-emerald-200 text-[11px]">
                      Because it requires zero electricity, future Mars orbiters can bounce laser pulses off LaRRI centuries from now to measure surface tectonic drift.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: VERBATIM FINAL TRANSMISSIONS & CITATIONS                           */}
      {/* ========================================================================= */}
      {activeTab === "final-signal" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* November 2022 Reflection */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <span className="font-mono text-[10px] uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                {VERBATIM_TRANSMISSIONS.reflectionQuote.date}
              </span>
              <h3 className="display mt-2 text-xl font-bold">Living on Two Planets</h3>
              <blockquote className="mt-3 border-l-2 border-rose-400 pl-4 italic text-sm text-white/90 leading-relaxed">
                &ldquo;{VERBATIM_TRANSMISSIONS.reflectionQuote.text}&rdquo;
              </blockquote>
              <p className="mt-3 font-mono text-[11px] text-white/50">
                {VERBATIM_TRANSMISSIONS.reflectionQuote.context}
              </p>
            </div>

            {/* December 19, 2022 Final Transmission */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-6 backdrop-blur-md">
              <span className="font-mono text-[10px] uppercase text-white bg-rose-500 px-2 py-0.5 rounded font-bold">
                {VERBATIM_TRANSMISSIONS.finalMessage.date}
              </span>
              <h3 className="display mt-2 text-xl font-bold text-white">The Last Sign-Off</h3>
              <blockquote className="mt-3 border-l-2 border-white pl-4 italic text-sm text-white leading-relaxed">
                &ldquo;{VERBATIM_TRANSMISSIONS.finalMessage.text}&rdquo;
              </blockquote>
              <p className="mt-3 font-mono text-[11px] text-white/70">
                {VERBATIM_TRANSMISSIONS.finalMessage.context}
              </p>
            </div>
          </div>

          {/* Official Verification Archive Citations */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
              Official NASA, IRIS &amp; Peer-Reviewed Data Registry
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {OFFICIAL_REPOSITORIES.map((repo) => (
                <a
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-white/80 hover:border-rose-500/40 hover:text-white transition-all"
                >
                  <p className="font-medium">{repo.label}</p>
                  <p className="mt-1 font-mono text-[10px] text-rose-300 truncate">{repo.url}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
