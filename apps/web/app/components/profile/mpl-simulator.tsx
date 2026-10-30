"use client";

import { useState } from "react";
import {
  MPL_SPECS,
  calculateMPLFreeFall,
  CASANI_FINDINGS,
  MPL_DISCARDED_RELICS,
} from "@/lib/mpl-mission";

interface MPLSimulatorProps {
  standalone?: boolean;
}

export default function MPLSimulator({ standalone = false }: MPLSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"forensics" | "casani" | "relics">("forensics");
  const [altitudeM, setAltitudeM] = useState<number>(40);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simAnimPos, setSimAnimPos] = useState<number>(0); // 0 = at altitude, 100 = ground

  const physics = calculateMPLFreeFall(altitudeM);

  const runDropAnimation = () => {
    setIsSimulating(true);
    setSimAnimPos(0);
    const durationMs = Math.max(400, physics.fallTimeSeconds * 800);
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Quadratic acceleration curve: s = 0.5 * a * t^2
      setSimAnimPos(progress * progress * 100);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setIsSimulating(false);
      }
    };
    requestAnimationFrame(frame);
  };

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
            "radial-gradient(ellipse at 50% 15%, rgba(235, 77, 75, 0.25), transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border bg-rose-500/20 text-rose-300 border-rose-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              NASA Mars Polar Lander ({MPL_SPECS.cosparId})
            </span>
            <span className="font-mono text-xs text-white/50">NORAD: {MPL_SPECS.noradId}</span>
          </div>
          <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            The 40-Meter Sensor Bug & Forensic Reconstruction
          </h2>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            Investigating the December 3, 1999 descent cutoff over Planum Australe. Sourced from the NASA Casani Board Report.
          </p>
        </div>

        {/* Telemetry Target Badge */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
          <p className="font-mono text-[10px] text-white/50 uppercase">Target Site</p>
          <p className="font-mono text-xs font-bold text-rose-300">Planum Australe</p>
          <p className="font-mono text-[10px] text-white/60">
            {MPL_SPECS.landingTarget.targetLat}° S, {MPL_SPECS.landingTarget.targetLon}° E
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("forensics")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "forensics"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            📉 40-Meter Free Fall Simulator
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("casani")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "casani"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            🔍 Casani Board Findings
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
            💿 1M Names & Deep Space 2
          </button>
        </div>
      </div>

      {/* TAB 1: 40-METER FREE FALL FORENSIC SIMULATOR */}
      {activeTab === "forensics" && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="font-mono text-xs text-rose-400 uppercase tracking-wider">
                  Orbital Mechanics & Impact Physics
                </span>
                <h3 className="display mt-1 text-xl font-bold">
                  Premature Descent Engine Shutdown Calculator
                </h3>
                <p className="mt-1 text-xs text-white/70 max-w-2xl">
                  Adjust the engine cutoff altitude to calculate fall duration, terminal impact speed, and kinetic energy under Martian gravity (3.72 m/s²).
                </p>
              </div>

              <button
                type="button"
                onClick={runDropAnimation}
                disabled={isSimulating}
                className="rounded-xl bg-rose-600 px-5 py-2.5 font-mono text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isSimulating ? "Simulating Impact..." : "▶ Simulate Free Fall Drop"}
              </button>
            </div>

            {/* Altitude Scrubber */}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">Engine Cutoff Altitude:</span>
                <span className="text-rose-400 font-bold text-base">
                  {altitudeM} Meters ({Math.round(altitudeM * 3.28084)} feet)
                </span>
                <span className="text-white/50">
                  Nominal Cutoff: 0.0 m (At Soil Touchdown)
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={altitudeM}
                onChange={(e) => setAltitudeM(parseInt(e.target.value, 10))}
                className="mt-3 w-full accent-rose-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
                <span>0m (Safe Soft Landing)</span>
                <span className="text-rose-300 font-bold">40m (Actual Fatal Bug Altitude)</span>
                <span>100m (Parachute Jettison Altitude)</span>
              </div>
            </div>

            {/* Dynamic Results Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-black/50 p-4">
                <span className="text-white/50 text-[10px] uppercase">Fall Duration</span>
                <p className="text-2xl font-bold text-white mt-1">
                  {physics.fallTimeSeconds.toFixed(2)} s
                </p>
                <p className="text-[10px] text-white/60">Free fall in Mars gravity</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/50 p-4">
                <span className="text-white/50 text-[10px] uppercase">Impact Velocity</span>
                <p className="text-2xl font-bold text-rose-400 mt-1">
                  {physics.terminalImpactSpeedMs.toFixed(1)} m/s
                </p>
                <p className="text-[10px] text-white/60">
                  {physics.terminalImpactSpeedKmh.toFixed(1)} km/h ({(physics.terminalImpactSpeedKmh * 0.621371).toFixed(1)} mph)
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/50 p-4">
                <span className="text-white/50 text-[10px] uppercase">Kinetic Energy</span>
                <p className="text-2xl font-bold text-amber-300 mt-1">
                  {Math.round(physics.impactKineticEnergyJoules).toLocaleString()} J
                </p>
                <p className="text-[10px] text-white/60">Chassis crush threshold: ~3,000 J</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/50 p-4">
                <span className="text-white/50 text-[10px] uppercase">Chassis Survival</span>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    physics.structuralSurvivalProbabilityPct > 50
                      ? "text-emerald-400"
                      : "text-rose-500"
                  }`}
                >
                  {physics.structuralSurvivalProbabilityPct.toFixed(0)}%
                </p>
                <p className="text-[10px] text-white/60">
                  {altitudeM <= 2 ? "Landing gear absorbs shock" : "Catastrophic structural failure"}
                </p>
              </div>
            </div>

            {/* Visual Drop Chamber & Code Inspection */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Graphic Simulation Box */}
              <div className="relative h-64 overflow-hidden rounded-xl border border-white/10 bg-linear-to-b from-indigo-950/60 to-black p-4">
                <div className="absolute top-3 left-3 font-mono text-[11px] text-white/60">
                  Trajectory Simulation Box
                </div>

                {/* Ground plane */}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-amber-950/80 border-t border-amber-600/40 flex items-center justify-center font-mono text-[10px] text-amber-300">
                  Planum Australe Permafrost Surface
                </div>

                {/* Falling Lander Marker */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-75"
                  style={{
                    top: `${15 + (simAnimPos / 100) * 165}px`,
                  }}
                >
                  {/* Thruster exhaust (only if engines on, i.e. when not free falling) */}
                  <div
                    className={`h-4 w-1 bg-amber-400 blur-xs transition-opacity ${
                      altitudeM === 0 && !isSimulating ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="rounded-md border border-white/40 bg-zinc-700 px-3 py-1 font-mono text-[10px] text-white shadow-lg flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    MPL Chassis (290 kg)
                  </div>
                  {/* Landing legs */}
                  <div className="flex gap-4 mt-0.5">
                    <span className="h-2 w-0.5 bg-zinc-400 rotate-25" />
                    <span className="h-2 w-0.5 bg-zinc-400 -rotate-25" />
                  </div>
                </div>
              </div>

              {/* Forensic Code Dissection */}
              <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs">
                <div className="flex items-center justify-between text-white/60 border-b border-white/10 pb-2 mb-3">
                  <span className="text-rose-400 font-bold">The Fatal Code Flaw</span>
                  <span className="text-[10px]">C / Assembly Logic</span>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed">
                  <p className="text-white/40">{"// Step 1: Leg deployment at 1,500m creates spring pulse"}</p>
                  <p className="text-amber-300">
                    void on_leg_deployed() &#123;
                    <br />
                    &nbsp;&nbsp;touchdown_flag = TRUE;{" "}
                    <span className="text-rose-400 font-bold">&larr; LATCHED ON SPRING BOUNCE!</span>
                    <br />
                    &#125;
                  </p>

                  <p className="text-white/40 mt-2">{"// Step 2: Terminal descent at 40m enables monitor"}</p>
                  <p className="text-emerald-400">
                    void terminal_descent_monitor() &#123;
                    <br />
                    &nbsp;&nbsp;enable_touchdown_interrupt();{" "}
                    <span className="text-white/40">{"// Missing: reset_flag();"}</span>
                    <br />
                    &nbsp;&nbsp;if (touchdown_flag == TRUE) &#123;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="text-rose-400 font-bold">command_engine_cutoff();</span>{" "}
                    <span className="text-white/40">{"// Cut off at 40m!"}</span>
                    <br />
                    &nbsp;&nbsp;&#125;
                    <br />
                    &#125;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CASANI REVIEW BOARD FINDINGS */}
      {activeTab === "casani" && (
        <div className="relative z-10 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <h3 className="display text-xl font-bold text-white">
              The NASA Casani Failure Review Board
            </h3>
            <p className="mt-1 text-xs text-white/70 max-w-2xl">
              Following the simultaneous losses of Mars Climate Orbiter and Mars Polar Lander in 1999, NASA commissioned an independent board led by Tony Casani and Thomas Young to identify the root causes.
            </p>

            <div className="mt-6 space-y-4">
              {CASANI_FINDINGS.map((f) => (
                <div
                  key={f.system}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-rose-400 uppercase tracking-wider">
                      {f.system}
                    </span>
                    <span className="font-mono text-white/50 text-[10px]">
                      Finding & Recommendation
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{f.findingTitle}</h4>
                  <p className="text-white/80 leading-relaxed">
                    <strong className="text-rose-300">Root Cause:</strong> {f.rootCause}
                  </p>
                  <p className="text-emerald-300 leading-relaxed">
                    <strong className="text-emerald-400">NASA Reform:</strong> {f.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 1M NAMES & DEEP SPACE 2 */}
      {activeTab === "relics" && (
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MPL_DISCARDED_RELICS.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-amber-400 uppercase">{r.classification}</span>
                  <span className="text-white/50">{r.expectedCoordinates}</span>
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
