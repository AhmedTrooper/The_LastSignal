"use client";

import { useState } from "react";
import {
  LCROSS_SPECS,
  LCROSS_VOLATILES,
} from "@/lib/lcross-mission";

interface LCROSSSimulatorProps {
  standalone?: boolean;
}

export default function LCROSSSimulator({ standalone = false }: LCROSSSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"impact" | "spectrum" | "volatiles">("impact");
  const [impactSpeedMs, setImpactSpeedMs] = useState<number>(2500);

  const centaurMass = LCROSS_SPECS.hardwareStages.centaurStage.massKg;
  // E = 0.5 * m * v^2 in Joules
  const energyJoules = 0.5 * centaurMass * impactSpeedMs * impactSpeedMs;
  const energyGJ = energyJoules / 1e9;
  const tntTons = energyJoules / 4.184e9;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-line bg-[#0c0a1a] text-white shadow-2xl transition-all ${
        standalone ? "mx-auto max-w-6xl p-5 sm:p-8" : "p-4 sm:p-6"
      }`}
    >
      {/* Background Ambience */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, rgba(56, 189, 248, 0.25), transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              NASA LCROSS ({LCROSS_SPECS.cosparId})
            </span>
            <span className="font-mono text-xs text-white/50">NORAD: {LCROSS_SPECS.noradId}</span>
          </div>
          <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            7.2 GJ Kinetic Impact & Water Ice Discovery
          </h2>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            Cabeus Crater Permanently Shadowed Region · Discovered 155 kg of water ice and volatile cocktail
          </p>
        </div>

        {/* Target Site Badge */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
          <p className="font-mono text-[10px] text-white/50 uppercase">Impact Site</p>
          <p className="font-mono text-xs font-bold text-cyan-300">
            {LCROSS_SPECS.impactTarget.crater} (PSR)
          </p>
          <p className="font-mono text-[10px] text-white/60">
            {LCROSS_SPECS.impactTarget.temperatureKelvin} K ({LCROSS_SPECS.impactTarget.temperatureCelsius}°C)
          </p>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="relative z-10 mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Centaur Impact Energy</p>
          <p className="mt-1 font-mono text-lg font-bold text-cyan-300">
            {energyGJ.toFixed(2)} GigaJoules
          </p>
          <p className="text-[11px] text-white/60">~{tntTons.toFixed(2)} tons TNT equivalent</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Water Vapor Detected</p>
          <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
            {LCROSS_SPECS.waterDiscoveryMetrics.waterVaporMassExcavatedKg} kg H₂O
          </p>
          <p className="text-[11px] text-white/60">5.6% of excavated regolith</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Plume Altitude</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">10 km High</p>
          <p className="text-[11px] text-white/60">Lit by solar rays above rim</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">LROC Frame</p>
          <p className="mt-1 font-mono text-xs font-bold text-white truncate">
            {LCROSS_SPECS.impactTarget.lrocFrame}
          </p>
          <p className="text-[11px] text-white/60">NAC Cabeus PSR observation</p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("impact")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "impact"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            💥 Kinetic Impact Simulator
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("spectrum")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "spectrum"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            🔬 1.4 µm & 1.9 µm Water Spectrum
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("volatiles")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "volatiles"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            🧪 The Volatile Cocktail ({LCROSS_VOLATILES.length})
          </button>
        </div>
      </div>

      {/* TAB 1: KINETIC IMPACT SIMULATOR */}
      {activeTab === "impact" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <h3 className="display text-xl font-bold text-white">
              Centaur Upper Stage Kinetic Energy Calculator
            </h3>
            <p className="mt-1 text-xs text-white/70 max-w-2xl">
              On October 9, 2009, NASA steered the spent 2,305 kg Centaur rocket body directly into Cabeus crater at 2.5 km/s (9,000 km/h). The kinetic explosion excavated a 20-meter crater and threw 350 tons of regolith into the sunlight.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">Impact Velocity:</span>
                <span className="text-cyan-300 font-bold text-base">
                  {impactSpeedMs.toLocaleString()} m/s ({(impactSpeedMs * 3.6).toLocaleString()} km/h)
                </span>
                <span className="text-amber-300 font-bold">
                  {energyGJ.toFixed(2)} GigaJoules
                </span>
              </div>

              <input
                type="range"
                min="1000"
                max="3500"
                step="50"
                value={impactSpeedMs}
                onChange={(e) => setImpactSpeedMs(parseInt(e.target.value, 10))}
                className="mt-3 w-full accent-cyan-400 h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
                <span>1,000 m/s (1.15 GJ)</span>
                <span className="text-cyan-300 font-bold">2,500 m/s (Actual LCROSS Velocity: 7.20 GJ)</span>
                <span>3,500 m/s (14.1 GJ)</span>
              </div>
            </div>

            {/* 4-Minute Dual-Impact Timeline */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <span className="text-amber-400 text-[10px] uppercase">T = 00:00 (11:31:19 UTC)</span>
                <h4 className="font-bold text-sm text-white mt-1">Centaur Kinetic Collision</h4>
                <p className="mt-2 text-white/70 text-[11px] leading-relaxed">
                  The 2,305 kg rocket slams into Cabeus crater floor at 9,000 km/h. Ejecta plume launches 10 km into sunlight above the crater rim.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <span className="text-cyan-300 text-[10px] uppercase">T + 04:00 (Plume Transit)</span>
                <h4 className="font-bold text-sm text-white mt-1">Shepherding Craft Dives In</h4>
                <p className="mt-2 text-white/70 text-[11px] leading-relaxed">
                  Trailing 4 minutes behind, the probe flies through the sunlit debris cloud, its 9 sensors capturing absorption dips of water ice.
                </p>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4">
                <span className="text-rose-300 text-[10px] uppercase">T + 04:17 (11:35:36 UTC)</span>
                <h4 className="font-bold text-sm text-white mt-1">Final Science Impact</h4>
                <p className="mt-2 text-white/70 text-[11px] leading-relaxed">
                  After streaming high-speed video and spectra until 2 seconds before collision, the shepherding spacecraft impacts Cabeus, leaving its own monument.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPECTROSCOPY PLUME & WATER DETECTION */}
      {activeTab === "spectrum" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <h3 className="display text-xl font-bold text-white">
              Near-Infrared (NIR) Water Absorption Fingerprint
            </h3>
            <p className="mt-1 text-xs text-white/70 max-w-2xl">
              As the Centaur debris plume ascended into solar rays, sunlight was absorbed by vibrational modes of water molecules at exactly 1.4 µm and 1.9 µm.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/60 p-4">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-cyan-300 font-bold">
                  LCROSS NIR Spectrometer Telemetry (Colaprete et al., Science 2010)
                </span>
                <span className="text-amber-400">H₂O Detection Confidence: &gt;99.9%</span>
              </div>

              {/* Spectral Curve SVG */}
              <div className="relative h-44 w-full">
                <svg viewBox="0 0 500 180" className="h-full w-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                  {/* Spectral baseline with deep absorption dips at 1.4um and 1.9um */}
                  <path
                    d="M 0,40 Q 80,45 130,50 Q 150,130 170,50 Q 230,52 280,55 Q 300,140 320,55 Q 400,60 500,65"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                  />

                  {/* 1.4 um marker */}
                  <circle cx="160" cy="130" r="5" fill="#f59e0b" />
                  <text x="135" y="155" fill="#f59e0b" fontSize="11" fontFamily="monospace">
                    1.4 µm (H₂O)
                  </text>

                  {/* 1.9 um marker */}
                  <circle cx="310" cy="140" r="5" fill="#f59e0b" />
                  <text x="285" y="165" fill="#f59e0b" fontSize="11" fontFamily="monospace">
                    1.9 µm (H₂O)
                  </text>
                </svg>
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-white/60">
                <span>1.0 µm Continuum</span>
                <span className="text-cyan-300">Deep absorption valleys confirm pure water ice</span>
                <span>2.5 µm Infrared End</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THE VOLATILE COCKTAIL */}
      {activeTab === "volatiles" && (
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LCROSS_VOLATILES.map((v) => (
              <div
                key={v.formula}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-base text-cyan-300">{v.formula}</span>
                  <span className="text-[11px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {v.relativeAbundanceToWaterPct}% relative to H₂O
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{v.name}</h4>
                <p className="text-white/80 leading-relaxed">{v.scienceSignificance}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
