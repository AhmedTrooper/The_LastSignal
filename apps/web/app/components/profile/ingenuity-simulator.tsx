"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  INGENUITY_SPECS,
  INGENUITY_KEY_FLIGHTS,
  INGENUITY_HARDWARE_SITES,
  INGENUITY_ARTIFACTS,
  INGENUITY_OFFICIAL_LINKS,
  INGENUITY_PIA_GALLERY,
  buildPdsHelicamBrowseUrl,
  buildPdsHelicamDataUrl,
  calculateIngenuityAerodynamics,
  type IngenuityFlightMilestone,
} from "@/lib/ingenuity-mission";

interface IngenuitySimulatorProps {
  standalone?: boolean;
}

export default function IngenuitySimulator({ standalone = false }: IngenuitySimulatorProps) {
  const [activeTab, setActiveTab] = useState<"aero" | "flights" | "hardware" | "pds">("aero");

  // Aerodynamics Lab State
  const [density, setDensity] = useState<number>(0.015);
  const [rpm, setRpm] = useState<number>(2537);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Flight Log State
  const [selectedFlight, setSelectedFlight] = useState<IngenuityFlightMilestone>(INGENUITY_KEY_FLIGHTS[0]);

  // Hardware State
  const [selectedSiteId, setSelectedSiteId] = useState<string>("sheared-blade");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const aero = calculateIngenuityAerodynamics(density, rpm);
  const activeSite = INGENUITY_HARDWARE_SITES.find((s) => s.id === selectedSiteId) ?? INGENUITY_HARDWARE_SITES[0];

  // Synthesize authentic 84.6 Hz blade-pass frequency (recorded by SuperCam on Flight 4)
  const stopAudio = useCallback(() => {
    try {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
        osc2Ref.current = null;
      }
      if (gainRef.current) {
        gainRef.current.disconnect();
        gainRef.current = null;
      }
      setIsAudioPlaying(false);
    } catch {
      // Ignore
    }
  }, []);

  const startAudio = useCallback(() => {
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

      // Fundamental blade-pass frequency: 2 blades * (RPM / 60)
      // At nominal 2,537 RPM: 2 * (2537 / 60) ≈ 84.57 Hz (SuperCam recorded 84.6 Hz)
      const baseFreq = (rpm / 60) * 2;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime); // 1st harmonic

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      gainRef.current = gain;
      setIsAudioPlaying(true);
    } catch {
      setIsAudioPlaying(false);
    }
  }, [rpm, stopAudio]);

  useEffect(() => {
    if (isAudioPlaying && osc1Ref.current && audioCtxRef.current) {
      const baseFreq = (rpm / 60) * 2;
      osc1Ref.current.frequency.setValueAtTime(baseFreq, audioCtxRef.current.currentTime);
      if (osc2Ref.current) {
        osc2Ref.current.frequency.setValueAtTime(baseFreq * 2, audioCtxRef.current.currentTime);
      }
    }
  }, [rpm, isAudioPlaying]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-line bg-[#090814] text-white shadow-2xl transition-all ${
        standalone ? "mx-auto max-w-6xl p-5 sm:p-8" : "p-4 sm:p-6"
      }`}
    >
      {/* Background Aerial Atmosphere Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_50%_10%,rgba(56,189,248,0.2),transparent_70%)]" />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 font-mono text-xs font-semibold text-cyan-300 border border-cyan-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              ICAO: {INGENUITY_SPECS.icaoDesignator} · Call Sign: {INGENUITY_SPECS.callSign}
            </span>
            <span className="font-mono text-xs text-white/50">{INGENUITY_SPECS.cosparId} · {INGENUITY_SPECS.nssdcaId}</span>
          </div>
          <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Ingenuity Mars Helicopter
          </h2>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            First powered aircraft on another world · 72 Flights · 17.02 km · Resting at Valinor Hills (Airfield Chi)
          </p>
        </div>

        {/* Airport Badge */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
          <p className="font-mono text-[10px] text-white/50 uppercase">First Extraterrestrial Airport</p>
          <p className="font-mono text-base font-bold text-cyan-300">{INGENUITY_SPECS.firstAirportCode}</p>
          <p className="text-[10px] text-white/60">Jezero Crater, Mars (18.4449° N, 77.4510° E)</p>
        </div>
      </div>

      {/* Flight Odyssey Stats Banner */}
      <div className="relative z-10 mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[11px] text-white/50 uppercase">Total Distance</p>
          <p className="mt-1 font-mono text-lg font-bold text-cyan-300">
            {INGENUITY_SPECS.odysseyTotals.totalDistanceMeters.toLocaleString()} m
          </p>
          <p className="text-[11px] text-white/60">10.56 miles across Jezero</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[11px] text-white/50 uppercase">Total Air Time</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            128.8 min
          </p>
          <p className="text-[11px] text-emerald-400">72 Flights (14.4× life)</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[11px] text-white/50 uppercase">Peak Altitude</p>
          <p className="mt-1 font-mono text-lg font-bold text-amber-300">
            {INGENUITY_SPECS.odysseyTotals.peakAltitudeMeters.toFixed(1)} m
          </p>
          <p className="text-[11px] text-white/60">Flight 61 Record (78.7 ft)</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[11px] text-white/50 uppercase">Peak Speed</p>
          <p className="mt-1 font-mono text-lg font-bold text-orange-400">
            {INGENUITY_SPECS.odysseyTotals.peakSpeedMs.toFixed(1)} m/s
          </p>
          <p className="text-[11px] text-white/60">22.4 mph / 36 km/h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("aero")}
            className={`rounded-xl px-3.5 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "aero"
                ? "bg-cyan-500 text-night shadow-md shadow-cyan-500/20"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            1% Atmosphere Aerodynamics Lab
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("flights")}
            className={`rounded-xl px-3.5 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "flights"
                ? "bg-cyan-500 text-night shadow-md shadow-cyan-500/20"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Flight Log Explorer (72 Flights)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hardware")}
            className={`rounded-xl px-3.5 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "hardware"
                ? "bg-cyan-500 text-night shadow-md shadow-cyan-500/20"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Discarded Sites &amp; 20-Yr Time Capsule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pds")}
            className={`rounded-xl px-3.5 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "pds"
                ? "bg-cyan-500 text-night shadow-md shadow-cyan-500/20"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            PDS Archives &amp; Direct Data Endpoints
          </button>
        </div>

        {/* Audio Blade Hum Button */}
        <button
          type="button"
          onClick={() => (isAudioPlaying ? stopAudio() : startAudio())}
          className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all ${
            isAudioPlaying
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 animate-pulse"
              : "border-white/10 bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isAudioPlaying ? "bg-emerald-400" : "bg-white/30"}`} />
          {isAudioPlaying ? `Playing ${(rpm / 60 * 2).toFixed(1)} Hz Hum ⏹` : "Play 84.6 Hz Blade Hum ▶"}
        </button>
      </div>

      {/* TAB 1: 1% ATMOSPHERE AERODYNAMICS LAB */}
      {activeTab === "aero" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Visual Gauge & Physics Engine */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Mars Aerodynamic Paradox (&lt; 1% Earth Density)
                </span>
                <h3 className="display mt-2 text-2xl font-bold">
                  Lift vs. Martian Weight
                </h3>
                <p className="mt-1 text-xs text-white/70">
                  To lift 1.80 kg on Mars (0.68 kg Martian weight = 6.70 N required thrust) in air equivalent to 30,500 m altitude on Earth.
                </p>

                {/* Main Thrust Comparison Dial */}
                <div className="mt-6 flex items-baseline justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="font-mono text-[11px] text-white/50 uppercase">Generated Lift Thrust</p>
                    <p className="font-mono text-4xl font-extrabold text-white">
                      {aero.liftNewtons} <span className="text-xl font-normal text-white/50">N</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[11px] text-white/50 uppercase">Required (Weight)</p>
                    <p className="font-mono text-2xl font-bold text-amber-400">
                      {aero.marsWeightNewtons} <span className="text-base font-normal text-white/50">N</span>
                    </p>
                  </div>
                </div>

                {/* Progress Bar of Thrust Margin */}
                <div className="mt-4">
                  <div className="flex justify-between font-mono text-xs text-white/60 mb-1">
                    <span>Thrust Margin: {aero.thrustMargin > 0 ? `+${aero.thrustMargin}%` : `${aero.thrustMargin}%`}</span>
                    <span className={aero.canFly ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {aero.canFly ? "FLIGHT POSSIBLE" : "UNABLE TO FLY"}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full transition-all duration-300 ${
                        aero.canFly ? "bg-emerald-400" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, (aero.liftNewtons / 10) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Tip Speed & Mach Number */}
                <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <span className="text-white/50 block">Blade Tip Speed</span>
                    <span className="text-base font-bold text-white block mt-0.5">{aero.tipSpeedMs} m/s</span>
                    <span className="text-[10px] text-white/40">~{Math.round(aero.tipSpeedMs * 2.237)} mph</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <span className="text-white/50 block">Tip Mach Number</span>
                    <span className={`text-base font-bold block mt-0.5 ${aero.tipMach >= 0.70 ? "text-red-400" : "text-cyan-300"}`}>
                      Mach {aero.tipMach}
                    </span>
                    <span className="text-[10px] text-white/40">Limit: Mach 0.70</span>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-5 rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white/80">
                {aero.aerostatus}
              </div>
            </div>

            {/* Tactile Sliders & Seasonal Presets */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400">
                  Atmospheric &amp; Rotor Controls
                </h3>
                <p className="mt-1 text-xs text-white/70">
                  Tweak atmospheric density and rotor RPM to see why seasonal temperature changes forced JPL to boost RPM in Martian summer.
                </p>

                {/* Slider 1: Air Density */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between font-mono text-xs text-white/60">
                    <span>Density (ρ)</span>
                    <span className="text-cyan-300 font-bold">{density.toFixed(4)} kg/m³</span>
                  </div>
                  <input
                    type="range"
                    min="0.010"
                    max="0.018"
                    step="0.0005"
                    value={density}
                    onChange={(e) => setDensity(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-white/20 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-white/40">
                    <span>0.010 (Hot Summer)</span>
                    <span>0.018 (Cold Winter)</span>
                  </div>
                </div>

                {/* Slider 2: RPM */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between font-mono text-xs text-white/60">
                    <span>Rotor Speed (RPM)</span>
                    <span className="text-cyan-300 font-bold">{rpm} RPM</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="3000"
                    step="25"
                    value={rpm}
                    onChange={(e) => setRpm(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-400 h-2 bg-white/20 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-white/40">
                    <span>2,000 RPM</span>
                    <span>2,537 Baseline</span>
                    <span>3,000 RPM Max</span>
                  </div>
                </div>

                {/* Historic Presets */}
                <div className="mt-6">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-white/50 mb-2">
                    Verified Flight Presets
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDensity(0.015);
                        setRpm(2537);
                      }}
                      className="rounded-lg border border-white/10 bg-white/5 p-2 text-left hover:bg-white/10 cursor-pointer"
                    >
                      <p className="font-mono text-[11px] font-bold text-white">Flight 1 Baseline</p>
                      <p className="text-[10px] text-white/50">0.015 kg/m³ · 2,537 RPM</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDensity(0.0115);
                        setRpm(2800);
                      }}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-left hover:bg-cyan-500/20 cursor-pointer"
                    >
                      <p className="font-mono text-[11px] font-bold text-cyan-300">Summer Thin Air</p>
                      <p className="text-[10px] text-white/50">0.0115 kg/m³ · 2,800 RPM</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDensity(0.0115);
                        setRpm(2537);
                      }}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-left hover:bg-red-500/20 cursor-pointer"
                    >
                      <p className="font-mono text-[11px] font-bold text-red-300">Summer Stall Bug</p>
                      <p className="text-[10px] text-white/50">Under-thrust condition</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Acoustic Science Callout */}
              <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/70">
                <span className="font-bold text-cyan-300">SuperCam Acoustic Discovery:</span> On Flight 4, Perseverance recorded Ingenuity&apos;s blade hum at exactly 84.6 Hz. Planetary acousticians used this to measure sound wave attenuation in cold CO₂.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLIGHT LOG EXPLORER */}
      {activeTab === "flights" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
            {/* Flights List */}
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
                Key Milestone Flights (From 72 Total)
              </p>
              <div className="space-y-1.5 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
                {INGENUITY_KEY_FLIGHTS.map((f) => (
                  <button
                    key={f.flightNum}
                    type="button"
                    onClick={() => setSelectedFlight(f)}
                    className={`w-full text-left rounded-xl border p-3 transition-all cursor-pointer ${
                      selectedFlight.flightNum === f.flightNum
                        ? "border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20"
                        : "border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">Flight {f.flightNum} (Sol {f.sol})</span>
                      <span className="font-mono text-[11px] text-cyan-300">{f.horizontalDistanceM} m · {f.durationSec}s</span>
                    </div>
                    <p className="mt-1 text-[11px] text-white/50 truncate">{f.airfieldDeparture} → {f.airfieldArrival}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Flight Detailed Dossier */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Sol {selectedFlight.sol} · {selectedFlight.dateUtc}
                  </span>
                  <h3 className="display mt-1 text-2xl font-bold">Flight {selectedFlight.flightNum}</h3>
                </div>
                {selectedFlight.isKeyRecord && (
                  <span className="rounded-full bg-amber-400/20 px-3 py-1 font-mono text-[11px] text-amber-300 border border-amber-400/30">
                    Record Milestone
                  </span>
                )}
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-4">
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <dt className="text-white/50 text-[10px]">Altitude</dt>
                  <dd className="font-bold text-white text-base mt-0.5">{selectedFlight.maxAltitudeM} m</dd>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <dt className="text-white/50 text-[10px]">Distance</dt>
                  <dd className="font-bold text-cyan-300 text-base mt-0.5">{selectedFlight.horizontalDistanceM} m</dd>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <dt className="text-white/50 text-[10px]">Speed</dt>
                  <dd className="font-bold text-white text-base mt-0.5">{selectedFlight.maxSpeedMs} m/s</dd>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <dt className="text-white/50 text-[10px]">Duration</dt>
                  <dd className="font-bold text-amber-300 text-base mt-0.5">{selectedFlight.durationSec} s</dd>
                </div>
              </dl>

              <div className="mt-4 space-y-3 text-xs leading-relaxed text-white/80">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-mono text-[11px] text-cyan-300 font-bold uppercase">
                    Airfield Route
                  </p>
                  <p className="mt-0.5 text-white">{selectedFlight.airfieldDeparture} to {selectedFlight.airfieldArrival}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-mono text-[11px] text-emerald-400 font-bold uppercase">
                    Engineering Significance
                  </p>
                  <p className="mt-1 text-white/90">{selectedFlight.significance}</p>
                </div>

                {/* Direct PDS Telemetry Links for this Sol */}
                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-mono text-[11px] text-cyan-300 font-bold uppercase mb-2">
                    Verified PDS Data Endpoints for Flight {selectedFlight.flightNum} (Sol {selectedFlight.sol})
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <a
                      href={buildPdsHelicamBrowseUrl(selectedFlight.sol)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-300 border border-cyan-700/50 px-2.5 py-1 transition-all"
                    >
                      PDS Browse Images (Sol {selectedFlight.sol}) ↗
                    </a>
                    <a
                      href={buildPdsHelicamDataUrl(selectedFlight.sol)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-2.5 py-1 transition-all"
                    >
                      Raw Science &amp; XML Labels ↗
                    </a>
                    <a
                      href={INGENUITY_OFFICIAL_LINKS.naifSpiceKernels}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-2.5 py-1 transition-all"
                    >
                      NAIF SPICE 3D Trajectory (SPK) ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISCARDED HARDWARE & 20-YEAR TIME CAPSULE */}
      {activeTab === "hardware" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
            {/* Sites List */}
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
                Hardware Sites Across Jezero Crater
              </p>
              {INGENUITY_HARDWARE_SITES.map((site) => (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`w-full text-left rounded-xl border p-3 transition-all cursor-pointer ${
                    activeSite.id === site.id
                      ? "border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20"
                      : "border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-white block">{site.name}</span>
                  <span className="text-[11px] text-cyan-300">Sol {site.sol} · {site.date}</span>
                </button>
              ))}

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="font-mono text-xs uppercase tracking-wider text-white/50 mb-2">
                  Physical Relics &amp; Time Capsule
                </p>
                {INGENUITY_ARTIFACTS.map((art) => (
                  <div key={art.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 mb-2">
                    <p className="font-mono text-xs font-bold text-amber-300">{art.title}</p>
                    <p className="mt-1 text-[11px] text-white/70 leading-relaxed">{art.story}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Hardware Site Details */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
              <div className="border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Site Coordinates: {activeSite.coordinates.lat.toFixed(4)}° N, {activeSite.coordinates.lon.toFixed(4)}° E
                </span>
                <h3 className="display mt-1 text-2xl font-bold">{activeSite.name}</h3>
                <p className="text-xs text-white/60">Jezero Crater, Mars · Sol {activeSite.sol} ({activeSite.date})</p>
              </div>

              <div className="mt-4 space-y-3 text-xs leading-relaxed text-white/80">
                <p>{activeSite.description}</p>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <p className="font-mono text-[11px] text-emerald-400 font-bold uppercase">
                    Forensic &amp; Scientific Value
                  </p>
                  <p className="mt-1 text-white/90">{activeSite.scientificForensicValue}</p>
                </div>
              </div>

              {activeSite.photoPia && (
                <div className="mt-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={activeSite.photoUrl}
                      alt={activeSite.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 500px, 100vw"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-white/50">
                    <span>NASA/JPL Photojournal {activeSite.photoPia}</span>
                    <a
                      href={`https://photojournal.jpl.nasa.gov/catalog/${activeSite.photoPia}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      View High-Res Archive Catalog ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PDS ARCHIVES & DIRECT DATA ENDPOINTS */}
      {activeTab === "pds" && (
        <div className="relative z-10 space-y-6">
          {/* PDS Header & 54-char Schema */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 backdrop-blur-md">
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
              Planetary Data System (PDS) Cartography and Imaging Sciences Node
            </span>
            <h3 className="display mt-1 text-2xl font-bold text-white">
              Deterministic 54-Character helicam Filename Schema
            </h3>
            <p className="mt-1 text-xs text-white/70 leading-relaxed">
              Every raw photograph, calibrated RDR, and PDS4 XML telemetry record follows NASA&apos;s deterministic 54-character identifier:
            </p>

            <div className="mt-4 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto">
              &#123;INST&#125;&#123;FILTER&#125;_&#123;SOL&#125;_&#123;SCLK10&#125;_&#123;PROD&#125;_&#123;SITE&#125;_&#123;DRIVE&#125;_&#123;SEQ&#125;_&#123;CAM&#125;&#123;VER&#125;.&#123;EXT&#125;
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                <span className="text-cyan-400 font-bold block mb-0.5">HN (Navcam Identifier):</span>
                <span className="text-white/80 text-[11px] block">
                  Omnivision OV7251 VGA CMOS (640 × 480, 133° × 100° FOV, 30 fps visual odometry tracker).
                </span>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                <span className="text-cyan-400 font-bold block mb-0.5">HS (Return-to-Earth Camera):</span>
                <span className="text-white/80 text-[11px] block">
                  Sony IMX214 color CMOS (4208 × 3120, 13 MP, 47° × 47° FOV oblique aerial survey).
                </span>
              </div>
            </div>
          </div>

          {/* Master Portal Link Grid */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
              Official Master Records &amp; Scientific Data Endpoints
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <a
                href={INGENUITY_OFFICIAL_LINKS.nssdcaRecord}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-3 transition-all group"
              >
                <p className="font-mono text-xs font-bold text-cyan-300 group-hover:underline">
                  NSSDCA Record: MARS2020H ↗
                </p>
                <p className="mt-1 text-[11px] text-white/60">
                  NASA Space Science Data Coordinated Archive master spacecraft record.
                </p>
              </a>

              <a
                href={INGENUITY_OFFICIAL_LINKS.pdsHelicamRoot}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-3 transition-all group"
              >
                <p className="font-mono text-xs font-bold text-cyan-300 group-hover:underline">
                  PDS helicam Archive Root ↗
                </p>
                <p className="mt-1 text-[11px] text-white/60">
                  urn:nasa:pds:mars2020_helicam root directory with unauthenticated HTTP access.
                </p>
              </a>

              <a
                href={INGENUITY_OFFICIAL_LINKS.naifSpiceKernels}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-3 transition-all group"
              >
                <p className="font-mono text-xs font-bold text-cyan-300 group-hover:underline">
                  NAIF SPICE 3D Kernels ↗
                </p>
                <p className="mt-1 text-[11px] text-white/60">
                  Exact 3D flight trajectory (SPK), attitude quaternions (CK), and clock (SCLK).
                </p>
              </a>

              <a
                href={INGENUITY_OFFICIAL_LINKS.nasaFPrimeFramework}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-3 transition-all group"
              >
                <p className="font-mono text-xs font-bold text-cyan-300 group-hover:underline">
                  NASA F&apos; Flight Framework (GitHub) ↗
                </p>
                <p className="mt-1 text-[11px] text-white/60">
                  The actual open-source flight software framework running on Snapdragon 801.
                </p>
              </a>

              <a
                href={INGENUITY_OFFICIAL_LINKS.supercamAcousticPds}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-3 transition-all group"
              >
                <p className="font-mono text-xs font-bold text-cyan-300 group-hover:underline">
                  SuperCam Acoustic Archive (PDS) ↗
                </p>
                <p className="mt-1 text-[11px] text-white/60">
                  Raw acoustic microphone recordings of the 84.6 Hz blade hum on Mars.
                </p>
              </a>

              <a
                href={INGENUITY_OFFICIAL_LINKS.pdsAnalystsNotebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-3 transition-all group"
              >
                <p className="font-mono text-xs font-bold text-cyan-300 group-hover:underline">
                  Analyst&apos;s Notebook (M20) ↗
                </p>
                <p className="mt-1 text-[11px] text-white/60">
                  Interactive Sol-by-Sol traverse maps and coordinated rover/helicopter data.
                </p>
              </a>
            </div>
          </div>

          {/* Photojournal High-Res Anchor Catalog */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
              Verified NASA Photojournal (PIA) High-Res Image Catalog
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {INGENUITY_PIA_GALLERY.map((item) => (
                <div key={item.piaId} className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2 bg-white/5">
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 300px, 100vw"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-cyan-400 font-bold">{item.piaId}</span>
                    <span className="text-white/50">Sol {item.sol}</span>
                  </div>
                  <p className="font-bold text-xs text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-white/60 mt-0.5 line-clamp-2">{item.description}</p>
                  <a
                    href={item.catalog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-mono text-[10px] text-cyan-300 hover:underline"
                  >
                    View Official JPL Catalog ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
