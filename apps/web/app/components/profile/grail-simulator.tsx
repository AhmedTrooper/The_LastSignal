"use client";

import { useState } from "react";
import {
  GRAIL_SPECS,
  GRAIL_ANOMALIES,
  type GravityAnomalyRecord,
} from "@/lib/grail-mission";

interface GRAILSimulatorProps {
  standalone?: boolean;
}

export default function GRAILSimulator({ standalone = false }: GRAILSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"ranging" | "anomalies" | "sallyride">("ranging");
  const [tandemSeparationKm, setTandemSeparationKm] = useState<number>(150);
  const [selectedAnomalyIndex, setSelectedAnomalyIndex] = useState<number>(0);

  const activeAnomaly: GravityAnomalyRecord = GRAIL_ANOMALIES[selectedAnomalyIndex];

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
            "radial-gradient(ellipse at 50% 15%, rgba(168, 85, 247, 0.25), transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border bg-purple-500/20 text-purple-300 border-purple-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              NASA GRAIL: Ebb ({GRAIL_SPECS.cosparIdA}) & Flow ({GRAIL_SPECS.cosparIdB})
            </span>
            <span className="font-mono text-xs text-white/50">Degree 660 Field</span>
          </div>
          <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            0.02 µm/s Microwave Ranging & The Sally K. Ride Site
          </h2>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            Tandem Lunar Orbiters · Slashed Apollo crust estimate in half · 100,000+ MoonKAM Students
          </p>
        </div>

        {/* Telemetry Badge */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
          <p className="font-mono text-[10px] text-white/50 uppercase">Impact Site</p>
          <p className="font-mono text-xs font-bold text-purple-300">
            {GRAIL_SPECS.impactTarget.siteName}
          </p>
          <p className="font-mono text-[10px] text-white/60">
            {GRAIL_SPECS.impactTarget.lat}° N, {GRAIL_SPECS.impactTarget.lon}° E
          </p>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="relative z-10 mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Ranging Precision</p>
          <p className="mt-1 font-mono text-lg font-bold text-purple-300">
            0.02 µm / s
          </p>
          <p className="text-[11px] text-white/60">1/400th of a red blood cell/sec</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Mean Crust Thickness</p>
          <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
            38 km
          </p>
          <p className="text-[11px] text-white/60">Down from Apollo 60 km guess</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">MoonKAM Student Photos</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {GRAIL_SPECS.moonkamEngagement.imagesTakenByKids.toLocaleString()}
          </p>
          <p className="text-[11px] text-white/60">Led by Dr. Sally Ride</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Impact Speed</p>
          <p className="mt-1 font-mono text-sm font-bold text-amber-300 truncate">
            1.68 km/s (6,050 km/h)
          </p>
          <p className="text-[11px] text-white/60 truncate">LROC M1115786064R</p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("ranging")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "ranging"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            📡 Ka-Band Tandem Ranging Lab
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("anomalies")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "anomalies"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            🗺️ Crustal Thickness & Mascons
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sallyride")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "sallyride"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            🌟 Sally K. Ride Site & MoonKAM
          </button>
        </div>
      </div>

      {/* TAB 1: KA-BAND TANDEM RANGING */}
      {activeTab === "ranging" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <h3 className="display text-xl font-bold text-white">
              The 0.02 Micrometer-per-Second Ranging Instrument
            </h3>
            <p className="mt-1 text-xs text-white/70 max-w-2xl">
              As Ebb and Flow flew tandem over craters and mountain ridges, gravity pulled the lead spacecraft forward, stretching the distance between them. The Lunar Gravity Ranging System measured this stretch with Ka-band microwaves.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">Tandem Spacecraft Separation:</span>
                <span className="text-purple-300 font-bold text-base">
                  {tandemSeparationKm} Kilometers
                </span>
                <span className="text-cyan-300">
                  Microwave Signal Round-Trip: {((tandemSeparationKm * 2) / 300).toFixed(2)} ms
                </span>
              </div>

              <input
                type="range"
                min="75"
                max="225"
                step="5"
                value={tandemSeparationKm}
                onChange={(e) => setTandemSeparationKm(parseInt(e.target.value, 10))}
                className="mt-3 w-full accent-purple-400 h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
                <span>75 km (High-Resolution Near-Pass Mode)</span>
                <span>150 km (Nominal Mapping Separation)</span>
                <span>225 km (Primary Science Orbit)</span>
              </div>
            </div>

            {/* Visual Tandem Flight Chamber */}
            <div className="mt-6 relative h-56 overflow-hidden rounded-xl border border-white/10 bg-linear-to-b from-indigo-950 to-black p-4">
              <div className="absolute top-3 left-3 font-mono text-[11px] text-white/60">
                Tandem Skimming Flight at 15–55 km Altitude
              </div>

              {/* Microwave Link Beam */}
              <div className="absolute top-20 inset-x-20 h-0.5 border-b border-dashed border-purple-400/80 animate-pulse" />

              {/* Ebb Spacecraft */}
              <div className="absolute top-16 left-24 flex flex-col items-center">
                <div className="rounded-lg border border-purple-400 bg-purple-950/80 px-3 py-1 font-mono text-xs font-bold text-purple-200">
                  Ebb (GRAIL-A)
                </div>
                <span className="text-[10px] font-mono text-white/50 mt-1">Lead Craft</span>
              </div>

              {/* Flow Spacecraft */}
              <div className="absolute top-16 right-24 flex flex-col items-center">
                <div className="rounded-lg border border-cyan-400 bg-cyan-950/80 px-3 py-1 font-mono text-xs font-bold text-cyan-200">
                  Flow (GRAIL-B)
                </div>
                <span className="text-[10px] font-mono text-white/50 mt-1">Trailing Craft</span>
              </div>

              {/* Lunar Crater Terrain Horizon */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-neutral-900 border-t border-white/10">
                <svg viewBox="0 0 600 60" preserveAspectRatio="none" className="h-full w-full opacity-60">
                  <path
                    d="M 0,40 Q 50,15 100,45 Q 160,5 220,40 Q 300,55 360,20 Q 420,5 480,35 Q 540,55 600,40 L 600,60 L 0,60 Z"
                    fill="#334155"
                  />
                </svg>
              </div>

              <div className="absolute bottom-2 left-4 font-mono text-[10px] text-white/40">
                Ka-band 32 GHz carrier · Relative Velocity Shift Precision: 0.00002 mm/s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CRUSTAL THICKNESS & GRAVITY ANOMALIES */}
      {activeTab === "anomalies" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <h3 className="display text-xl font-bold text-white">
              Lunar Interior Model: The Mascon & Magma Dike Atlas
            </h3>
            <p className="mt-1 text-xs text-white/70 max-w-2xl">
              GRAIL proved the Moon’s crust is only 34 to 43 km thick—almost 40% thinner than scientists believed after Apollo. Select a feature below to view its gravity signature.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
              {GRAIL_ANOMALIES.map((a, i) => (
                <button
                  key={a.featureName}
                  type="button"
                  onClick={() => setSelectedAnomalyIndex(i)}
                  className={`rounded-xl p-3 text-left border transition-all ${
                    selectedAnomalyIndex === i
                      ? "border-purple-400 bg-purple-500/20 text-white"
                      : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className="font-mono text-[10px] text-purple-300 uppercase block">
                    {a.type}
                  </span>
                  <p className="font-bold text-xs mt-1 text-white truncate">{a.featureName}</p>
                  <p className="font-mono text-[11px] text-emerald-400 mt-1">
                    {a.freeAirAnomalyMGal > 0 ? `+${a.freeAirAnomalyMGal}` : a.freeAirAnomalyMGal} mGal
                  </p>
                </button>
              ))}
            </div>

            {/* Selected Anomaly Inspection Card */}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/60 p-5 font-mono text-xs">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center border-b border-white/10 pb-3">
                <div>
                  <span className="text-purple-400 text-[10px] uppercase">{activeAnomaly.type}</span>
                  <h4 className="text-lg font-bold text-white">{activeAnomaly.featureName}</h4>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-white/50 text-[10px] uppercase">Gravity Anomaly</span>
                    <p className="text-base font-bold text-amber-300">
                      {activeAnomaly.freeAirAnomalyMGal > 0 ? `+${activeAnomaly.freeAirAnomalyMGal}` : activeAnomaly.freeAirAnomalyMGal} mGal
                    </p>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] uppercase">Crustal Thickness</span>
                    <p className="text-base font-bold text-cyan-300">
                      {activeAnomaly.crustalThicknessKm} km
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-white/80 font-sans text-xs leading-relaxed">
                {activeAnomaly.significance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SALLY K. RIDE SITE & MOONKAM */}
      {activeTab === "sallyride" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <h3 className="display text-xl font-bold text-white">
              The Sally K. Ride Impact Site
            </h3>
            <p className="mt-1 text-xs text-white/70 max-w-2xl">
              On December 17, 2012, with fuel completely exhausted, NASA commanded Ebb and Flow into a 2,500-meter mountain ridge between Philolaus and Mouchez craters at 6,050 km/h. NASA dedicated the site in honor of Dr. Sally K. Ride.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
                <span className="font-mono text-[10px] text-purple-300 uppercase">A Historic Tribute</span>
                <h4 className="font-bold text-base text-white mt-1">Dr. Sally K. Ride (1951–2012)</h4>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  First American woman in space. Dr. Ride founded Sally Ride Science to inspire young people—especially girls—in science and technology, and personally led the GRAIL MoonKAM project.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                <span className="font-mono text-[10px] text-emerald-300 uppercase">MoonKAM Student Program</span>
                <h4 className="font-bold text-base text-white mt-1">119,830 Photos by Schoolchildren</h4>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  More than 100,000 middle school students across America selected specific Moon craters and landmarks for Ebb and Flow to photograph, making GRAIL one of NASA&apos;s most participatory youth science missions.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-mono">
              <span className="text-white/60">
                LROC Impact Site Frame: {GRAIL_SPECS.impactTarget.lrocFrame}
              </span>
              <a
                href={`https://www.lroc.asu.edu/featured_sites/view_site/${GRAIL_SPECS.impactTarget.lrocFrame}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/10 px-3 py-1.5 text-purple-300 hover:bg-white/20 transition-all flex items-center gap-1.5"
              >
                <span>Inspect LROC Impact Frame</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
