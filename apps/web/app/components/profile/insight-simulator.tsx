"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  INSIGHT_SPECS,
  MARSQUAKE_CATALOG,
  INSIGHT_HARDWARE_MANIFEST,
  type MarsquakeEvent,
} from "@/lib/insight-mission";

interface InSightSimulatorProps {
  standalone?: boolean;
}

export default function InSightSimulator({ standalone = false }: InSightSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"seismo" | "interior" | "mole">("seismo");
  const [selectedQuake, setSelectedQuake] = useState<MarsquakeEvent>(MARSQUAKE_CATALOG[3]); // Default monster quake S1222a
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [moleDepthCm, setMoleDepthCm] = useState<number>(37);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Stop seismic sonification
  const stopAudio = useCallback(() => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
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

  // Sonify seismic frequency into human audible range (accelerated P/S wave rumble)
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

      // Base rumble frequency scaled by quake magnitude
      const baseFreq = 50 + selectedQuake.magnitude * 15;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      // Low frequency rumble with pulse modulation
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsAudioPlaying(true);

      setTimeout(() => {
        stopAudio();
      }, 5000);
    } catch {
      setIsAudioPlaying(false);
    }
  }, [selectedQuake, stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-line bg-[#0c0818] text-white shadow-2xl transition-all ${
        standalone ? "mx-auto max-w-6xl p-5 sm:p-8" : "p-4 sm:p-6"
      }`}
    >
      {/* Background Geophysics Radial Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_50%_15%,rgba(244,63,94,0.25),transparent_70%)]" />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 font-mono text-xs font-semibold text-rose-300 border border-rose-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
              NASA Discovery #12 · Mars Geophysical Observatory
            </span>
            <span className="font-mono text-xs text-white/50">{INSIGHT_SPECS.cosparId}</span>
          </div>
          <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            InSight Mars Lander
          </h2>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            Homestead Hollow, Elysium Planitia · 1,319 Marsquakes Detected · Mapped the Martian Liquid Core
          </p>
        </div>

        {/* Coords & Sols Badge */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
          <p className="font-mono text-[10px] text-white/50 uppercase">Operational Span</p>
          <p className="font-mono text-base font-bold text-rose-300">{INSIGHT_SPECS.operationalLifespan.solsActive} Sols</p>
          <p className="text-[10px] text-white/60">4.5024° N, 135.6234° E</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="relative z-10 mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[11px] text-white/50 uppercase">Marsquakes</p>
          <p className="mt-1 font-mono text-lg font-bold text-rose-300">1,319 Events</p>
          <p className="text-[11px] text-white/60">SEIS VBB + SP Array</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[11px] text-white/50 uppercase">Liquid Core</p>
          <p className="mt-1 font-mono text-lg font-bold text-amber-300">
            {INSIGHT_SPECS.interiorStructureModel.coreRadiusKm} km
          </p>
          <p className="text-[11px] text-white/60">Confirmed Liquid Fe-Ni</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[11px] text-white/50 uppercase">Largest Quake</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">Mag 4.7</p>
          <p className="text-[11px] text-emerald-400">Sol 1222 (6-hr ring)</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[11px] text-white/50 uppercase">Names on Deck</p>
          <p className="mt-1 font-mono text-lg font-bold text-cyan-300">2,429,807</p>
          <p className="text-[11px] text-white/60">2 Silicon Microchips</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("seismo")}
            className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "seismo"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Marsquake Seismograph &amp; Audio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("interior")}
            className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "interior"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Deep Interior Core &amp; Crust
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mole")}
            className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "mole"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            HP³ Mole &amp; Hardware Sites
          </button>
        </div>

        {/* Audio Sonification Button */}
        <button
          type="button"
          onClick={() => (isAudioPlaying ? stopAudio() : startAudio())}
          className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all ${
            isAudioPlaying
              ? "border-rose-400 bg-rose-500/20 text-rose-300 animate-pulse"
              : "border-white/10 bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isAudioPlaying ? "bg-rose-400" : "bg-white/30"}`} />
          {isAudioPlaying ? "Sonifying Quake ⏹" : `Play ${selectedQuake.id} Audio ▶`}
        </button>
      </div>

      {/* TAB 1: MARSQUAKE SEISMOGRAPH & AUDIO */}
      {activeTab === "seismo" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
            {/* Animated Waveform Display */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-md">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      SEIS VBB Waveform Record · Sol {selectedQuake.sol}
                    </span>
                    <h3 className="display mt-1 text-2xl font-bold">{selectedQuake.id} — Magnitude {selectedQuake.magnitude}</h3>
                  </div>
                  <span className="font-mono text-xs text-white/50">{selectedQuake.dateUtc}</span>
                </div>

                {/* Simulated Seismogram Canvas */}
                <div className="relative mt-5 h-36 w-full overflow-hidden rounded-xl border border-rose-500/30 bg-[#0a050d] p-3 flex items-center justify-center">
                  <svg className="w-full h-full text-rose-400" preserveAspectRatio="none" viewBox="0 0 400 100">
                    <path
                      d={
                        selectedQuake.magnitude >= 4.5
                          ? "M0,50 L30,50 L40,48 L50,53 L60,45 L70,55 L80,30 L90,75 L100,10 L110,90 L120,20 L130,85 L140,25 L160,70 L180,35 L200,65 L240,40 L280,60 L320,45 L360,55 L400,50"
                          : selectedQuake.magnitude >= 3.5
                          ? "M0,50 L40,50 L55,48 L70,52 L85,38 L100,65 L115,25 L130,78 L145,35 L160,65 L180,42 L210,58 L250,46 L300,54 L400,50"
                          : "M0,50 L60,50 L80,48 L100,53 L120,44 L140,56 L160,42 L180,58 L200,47 L240,53 L300,49 L400,50"
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="absolute top-2 left-3 font-mono text-[10px] text-white/50">
                    P-Wave Arrival ➔ S-Wave Peak ➔ Coda Decay ({selectedQuake.durationMin} min duration)
                  </div>
                </div>

                <p className="mt-4 text-xs text-white/80 leading-relaxed">
                  {selectedQuake.description}
                </p>
              </div>

              {selectedQuake.sonifiedAudioPia && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs text-white/60">
                  <span>NASA Audio Record: {selectedQuake.sonifiedAudioPia}</span>
                  <a
                    href={`https://photojournal.jpl.nasa.gov/catalog/${selectedQuake.sonifiedAudioPia}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-400 hover:underline"
                  >
                    View Official Archive ↗
                  </a>
                </div>
              )}
            </div>

            {/* Quake Selector List */}
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
                Select Historic Martian Seismic Event
              </p>
              {MARSQUAKE_CATALOG.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setSelectedQuake(q);
                    stopAudio();
                  }}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${
                    selectedQuake.id === q.id
                      ? "border-rose-500 bg-rose-500/20 text-white shadow-md shadow-rose-500/20"
                      : "border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">{q.id} (Sol {q.sol})</span>
                    <span className="font-mono text-xs font-bold text-rose-300">Mag {q.magnitude}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/50 line-clamp-1">{q.description}</p>
                </button>
              ))}

              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/70">
                <span className="font-bold text-rose-300">Atmospheric Wind Discovery:</span> On Sol 4, before SEIS was placed on the ground, its sensors recorded the wind vibrating InSight&apos;s solar panels at 5 to 7 m/s (PIA22876)—the first sound of Martian wind ever captured.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEEP INTERIOR CORE & CRUST */}
      {activeTab === "interior" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
              <h3 className="display text-2xl font-bold">First Map of Another Planet&apos;s Interior</h3>
              <p className="mt-1 text-xs text-white/70">
                Prior to InSight, humanity only had direct seismic interior models for Earth and the Moon. InSight mapped all three layers of Mars.
              </p>

              {/* Layer Cards */}
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-amber-300 uppercase">1. Martian Crust</span>
                    <span className="text-white/60">24 to 72 km Thick</span>
                  </div>
                  <p className="mt-1 text-xs text-white/80">
                    Layered into two or three sub-units (~39–47 km beneath Homestead Hollow). Highly fractured volcanic basalt with low seismic velocity.
                  </p>
                </div>

                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-rose-300 uppercase">2. Lithospheric Mantle</span>
                    <span className="text-white/60">400 to 600 km Cap</span>
                  </div>
                  <p className="mt-1 text-xs text-white/80">
                    A thick, rigid single-plate lithosphere that prevents active plate tectonics. Lacks a high-pressure lower mantle bridgmanite layer.
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-cyan-300 uppercase">3. Metallic Liquid Core</span>
                    <span className="text-white/60">1,830 km Radius</span>
                  </div>
                  <p className="mt-1 text-xs text-white/80">
                    Completely liquid iron-nickel alloy enriched with ~20% light elements (S, O, C, H), surrounded by a thin ~150 km molten silicate basal layer.
                  </p>
                </div>
              </div>
            </div>

            {/* RISE Geodesy & Nutation */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div>
                <span className="font-mono text-[10px] uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  RISE Doppler Geodesy
                </span>
                <h4 className="display mt-2 text-xl font-bold">10-Centimeter Spin Axis Tracking</h4>
                <p className="mt-1 text-xs text-white/70">
                  By tracking radio Doppler shifts between Earth and InSight&apos;s X-band horn antennas, scientists measured Mars&apos;s wobble to within 10 centimeters, confirming the liquid core independently of seismic data.
                </p>
                <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-white/80">
                  <p className="font-bold text-white mb-1">Magnetic Anomaly:</p>
                  InSight&apos;s magnetometer measured a local crustal magnetic field 10× stronger than predicted from orbit, pulsing with mysterious midnight variations driven by solar wind interaction.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-xs text-white/50">
                Source: Nature (2021 &amp; 2023) InSight Science Team
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HP3 MOLE & HARDWARE SITES */}
      {activeTab === "mole" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
            {/* The Mole Duricrust Struggle */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <span className="font-mono text-[10px] uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                HP³ &apos;The Mole&apos; Soil Mechanics
              </span>
              <h3 className="display mt-1 text-xl font-bold">The 20 cm Duricrust Struggle</h3>
              <p className="mt-1 text-xs text-white/70">
                Designed to burrow 3 to 5 meters underground, the self-hammering spike encountered unexpected cemented duricrust that lacked side friction, causing it to bounce in place.
              </p>

              {/* Interactive Depth Slider */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between font-mono text-xs text-white/60">
                  <span>Current Depth</span>
                  <span className="text-amber-300 font-bold">{moleDepthCm} cm underground</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={moleDepthCm}
                  onChange={(e) => setMoleDepthCm(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 h-2 bg-white/20 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                  <span>0 cm (Surface)</span>
                  <span>37 cm (Final Buried Depth)</span>
                  <span>500 cm (Goal)</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-white/80">
                After hundreds of robotic arm pinning maneuvers with the scoop, engineers buried the mole ~37 cm deep, where it recorded thermal conductivity for the rest of the mission.
              </div>
            </div>

            {/* Hardware Manifest at Homestead Hollow */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
              <h3 className="display text-xl font-bold">Hardware Manifest at Homestead Hollow</h3>
              <p className="mt-0.5 text-xs text-white/60 mb-4">4.5024° N, 135.6234° E · Western Elysium Planitia</p>

              <div className="space-y-2.5">
                {INSIGHT_HARDWARE_MANIFEST.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="text-rose-300">{item.massKg} kg</span>
                    </div>
                    <p className="mt-1 text-xs text-white/70">{item.description}</p>
                    <p className="mt-1 font-mono text-[10px] text-white/40">Location: {item.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
