"use client";

import { useState } from "react";
import {
  SURVEYOR_SPECS,
  SURVEYOR_TOUCHDOWN_CURVE,
  SURVEYOR_DISCARDED_RELICS,
} from "@/lib/surveyor-mission";

interface SurveyorSimulatorProps {
  standalone?: boolean;
}

export default function SurveyorSimulator({ standalone = false }: SurveyorSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"touchdown" | "night" | "relics">("touchdown");
  const [timeIndex, setTimeIndex] = useState<number>(4); // Index 4 = 100ms peak impact spike

  const currentStep = SURVEYOR_TOUCHDOWN_CURVE[timeIndex] ?? SURVEYOR_TOUCHDOWN_CURVE[4];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-line bg-[#0c0a1a] text-white shadow-2xl transition-all ${
        standalone ? "mx-auto max-w-6xl p-5 sm:p-8" : "p-4 sm:p-6"
      }`}
    >
      {/* Background Moon Ambience */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, rgba(160, 174, 192, 0.25), transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border bg-slate-500/20 text-slate-300 border-slate-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              NASA Surveyor 1 ({SURVEYOR_SPECS.cosparId})
            </span>
            <span className="font-mono text-xs text-white/50">NORAD: {SURVEYOR_SPECS.noradId}</span>
          </div>
          <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            First Soft Touchdown on the Moon: Strain Gauges & Night Survival
          </h2>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            Flamsteed P, Oceanus Procellarum · Certified lunar regolith safe for Apollo 11
          </p>
        </div>

        {/* Telemetry Badge */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
          <p className="font-mono text-[10px] text-white/50 uppercase">Landing Site</p>
          <p className="font-mono text-xs font-bold text-amber-300">
            {SURVEYOR_SPECS.touchdownCoordinates.feature}
          </p>
          <p className="font-mono text-[10px] text-white/60">
            {SURVEYOR_SPECS.touchdownCoordinates.lat}° S, {SURVEYOR_SPECS.touchdownCoordinates.lon}° W
          </p>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="relative z-10 mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">TV Frames Returned</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {SURVEYOR_SPECS.telemetryMetrics.totalPhotos.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400">
            {SURVEYOR_SPECS.telemetryMetrics.secondDayPhotosAfterNight} after waking from -150°C night
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Soil Bearing Capacity</p>
          <p className="mt-1 font-mono text-sm font-bold text-cyan-300">
            35 to 55 kPa
          </p>
          <p className="text-[11px] text-white/60">Proved solid footing for Apollo LM</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Footpad Penetration</p>
          <p className="mt-1 font-mono text-lg font-bold text-amber-300">
            {SURVEYOR_SPECS.telemetryMetrics.soilPenetrationCm} cm
          </p>
          <p className="text-[11px] text-white/60">Aluminum crush honeycomb</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">LROC Frame</p>
          <p className="mt-1 font-mono text-xs font-bold text-white truncate">
            {SURVEYOR_SPECS.touchdownCoordinates.lrocFrame}
          </p>
          <p className="text-[11px] text-white/60">Lunar Reconnaissance Orbiter</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("touchdown")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "touchdown"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            📉 Millisecond Touchdown Dynamics
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("night")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "night"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            ❄️ 14-Day Lunar Night Survival
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
            🏺 Flamsteed P Relics ({SURVEYOR_DISCARDED_RELICS.length})
          </button>
        </div>
      </div>

      {/* TAB 1: TOUCHDOWN DYNAMICS */}
      {activeTab === "touchdown" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="font-mono text-xs text-amber-400 uppercase tracking-wider">
                  Authentic Strain Gauge Telemetry (JPL TR 32-1023)
                </span>
                <h3 className="display mt-1 text-xl font-bold">
                  The Rebound Hop: Landing at 3.4 m/s
                </h3>
                <p className="mt-1 text-xs text-white/70 max-w-2xl">
                  Before Surveyor 1, astronomer Thomas Gold theorized that the Moon was covered in a deep sea of powdery dust that would swallow any landing probe. Surveyor’s crushable footpads and strain gauges settled the question in 600 milliseconds.
                </p>
              </div>
            </div>

            {/* Scrubber */}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">
                  Touchdown Event Time:{" "}
                  <strong className="text-amber-300">
                    {currentStep.timeOffsetMs >= 0 ? `+${currentStep.timeOffsetMs}` : currentStep.timeOffsetMs} ms
                  </strong>
                </span>
                <span className="text-cyan-300">
                  Leg 1 Strain: {currentStep.leg1StrainLbf} lbf
                </span>
                <span className="text-white/60">
                  Vertical Velocity: {currentStep.verticalVelocityMs} m/s
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={SURVEYOR_TOUCHDOWN_CURVE.length - 1}
                value={timeIndex}
                onChange={(e) => setTimeIndex(parseInt(e.target.value, 10))}
                className="mt-3 w-full accent-amber-400 h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
                <span>-200 ms (Approach)</span>
                <span>0 ms (Contact)</span>
                <span>+100 ms (Peak Force: 920 lbf)</span>
                <span>+300 ms (5cm Rebound Hop)</span>
                <span>+600 ms (Resting in Regolith)</span>
              </div>
            </div>

            {/* SVG Strain Curve */}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/60 p-4">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-white/80 font-semibold">
                  Landing Leg Strain Gauge Response Curve (Force in Pounds-Force)
                </span>
                <span className="text-amber-400">Peak Strain: 920 lbf on Leg 1</span>
              </div>

              <div className="relative h-44 w-full">
                <svg viewBox="0 0 500 180" className="h-full w-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="0" y1="160" x2="500" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                  <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                  {/* Strain Curve */}
                  <polyline
                    points="0,160 50,160 100,157 150,90 200,20 250,75 300,145 350,160 420,140 500,145"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                  />

                  {/* Current Position Marker */}
                  <circle
                    cx={(timeIndex / (SURVEYOR_TOUCHDOWN_CURVE.length - 1)) * 500}
                    cy={160 - (currentStep.leg1StrainLbf / 950) * 140}
                    r="6"
                    fill="#38bdf8"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-white/60">
                <span>0 ms Contact: Footpad hits regolith</span>
                <span className="text-amber-300">100 ms: Aluminum honeycomb crushes 3.5 cm</span>
                <span>300 ms: Springs cause brief 5 cm bounce</span>
                <span className="text-emerald-400">600 ms: Spacecraft rests permanently</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 14-DAY LUNAR NIGHT SURVIVAL */}
      {activeTab === "night" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <h3 className="display text-xl font-bold text-white">
              Surviving the 336-Hour Lunar Night (-150°C)
            </h3>
            <p className="mt-1 text-xs text-white/70 max-w-2xl">
              Surveyor 1 had no radioisotope heater units or nuclear generator—only a solar panel and silver-zinc batteries. As sunset approached on June 14, 1966, JPL engineers shut down non-essential electronics to prepare for the deep freeze.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <span className="font-mono text-[10px] text-amber-400 uppercase">First Lunar Day</span>
                <p className="mt-1 text-2xl font-bold text-white">10,622 Photos</p>
                <p className="mt-1 text-xs text-white/70">
                  June 2 to June 14, 1966. Returned complete 360° panoramas, starry skies, and footpad indentation frames.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <span className="font-mono text-[10px] text-cyan-300 uppercase">The 14-Day Night</span>
                <p className="mt-1 text-2xl font-bold text-cyan-300">-150°C Deep Freeze</p>
                <p className="mt-1 text-xs text-white/70">
                  Solar cells frozen solid for 336 hours of total darkness. No telemetry received; batteries chilled to terminal limits.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                <span className="font-mono text-[10px] text-emerald-300 uppercase">July 6 Re-Awakening</span>
                <p className="mt-1 text-2xl font-bold text-emerald-300">618 Bonus Photos</p>
                <p className="mt-1 text-xs text-white/70">
                  At sunrise on July 6, sunlight warmed the panels. Surveyor 1 woke up, answered JPL’s radio ping, and sent 618 more images!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RELICS */}
      {activeTab === "relics" && (
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SURVEYOR_DISCARDED_RELICS.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-amber-400 uppercase">{r.type}</span>
                  <span className="text-white/50">{r.coordinates}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{r.name}</h4>
                <p className="text-white/80 leading-relaxed">{r.significance}</p>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-200">
                  <span className="font-mono text-[10px] uppercase font-bold block mb-0.5">
                    Youth Takeaway
                  </span>
                  {r.youthTakeaway}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
