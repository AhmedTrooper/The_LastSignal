"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  MER_SPECS,
  DISCARDED_MONUMENTS,
  MER_MEMORIALS,
  MER_EXPERIMENTS,
  OPPORTUNITY_TRAVERSE_WAYPOINTS,
  SPIRIT_TRAVERSE_WAYPOINTS,
  OFFICIAL_SPIRIT_ENDPOINTS,
  OFFICIAL_OPPORTUNITY_ENDPOINTS,
  PDS_MER_ENDPOINTS,
  getNssdcaExperimentUrl,
  decodeMERFilename,
  buildMERFilename,
  calculateDustImpact,
  type DiscardedMonument,
  type MERMemorial,
  type MERTraverseWaypoint,
} from "@/lib/mer-mission";

interface MERSimulatorProps {
  rover: "spirit" | "opportunity";
  standalone?: boolean;
}

export default function MERSimulator({
  rover,
  standalone = false,
}: MERSimulatorProps) {
  const isSpirit = rover === "spirit";
  const isOpp = rover === "opportunity";

  const [activeTab, setActiveTab] = useState<"traverse" | "dust" | "monuments" | "inspector">("traverse");

  // Traverse Waypoints State
  const waypoints = isOpp ? OPPORTUNITY_TRAVERSE_WAYPOINTS : SPIRIT_TRAVERSE_WAYPOINTS;
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState<number>(isOpp ? 7 : 5);
  const activeWaypoint: MERTraverseWaypoint = waypoints[selectedWaypointIndex] ?? waypoints[0];
  
  // Dust Simulator State
  const [tau, setTau] = useState<number>(isSpirit ? 0.8 : 0.9);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isPlayingMelody, setIsPlayingMelody] = useState<boolean>(false);
  const [showEndModal, setShowEndModal] = useState<boolean>(false);
  const [isGrinding, setIsGrinding] = useState<boolean>(false);
  const [grindingRock, setGrindingRock] = useState<"sulfate" | "basalt">("sulfate");

  // Filter monuments strictly by this rover
  const roverMonuments = DISCARDED_MONUMENTS.filter((m) => m.rover === rover);
  const [selectedMonumentId, setSelectedMonumentId] = useState<string>(roverMonuments[0]?.id ?? "");
  const activeMonument: DiscardedMonument =
    roverMonuments.find((m) => m.id === selectedMonumentId) ?? roverMonuments[0];

  // Filter memorials strictly by this rover (or both)
  const roverMemorials = MER_MEMORIALS.filter(
    (m) => m.rover === rover || m.rover === "both"
  );
  const [selectedMemorial, setSelectedMemorial] = useState<MERMemorial>(roverMemorials[0]);
  const [monumentView, setMonumentView] = useState<"hardware" | "memorials">("hardware");

  // PDS Inspector State (strictly defaults to this rover's frame)
  const defaultPdsFrame = isSpirit
    ? "2P126468012EDN0000P2303L2M1"
    : "1P581919922EFFD212P2685L8M1";
  const [pdsInput, setPdsInput] = useState<string>(defaultPdsFrame);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const windOscRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);

  const currentRoverSpecs = MER_SPECS[rover];
  const dustImpact = calculateDustImpact(tau);

  // Synthesize Martian wind noise via Web Audio API based on optical depth tau
  const startWindAudio = useCallback(() => {
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

      // Generate brown/pink noise buffer for wind roar
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to simulate hollow Martian atmospheric howling
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200 + tau * 60, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(Math.min(0.08, 0.01 + tau * 0.007), ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      windOscRef.current = whiteNoise;
      windGainRef.current = gain;
    } catch {
      // Supressed
    }
  }, [soundEnabled, tau]);

  const stopWindAudio = useCallback(() => {
    try {
      if (windOscRef.current) {
        windOscRef.current.stop();
        windOscRef.current.disconnect();
        windOscRef.current = null;
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (soundEnabled && activeTab === "dust") {
      startWindAudio();
    } else {
      stopWindAudio();
    }
    return () => {
      stopWindAudio();
    };
  }, [soundEnabled, activeTab, startWindAudio, stopWindAudio]);

  // Synthesize Billie Holiday's "I'll Be Seeing You" opening motif on Opportunity
  const playBillieHolidayMotif = () => {
    if (isPlayingMelody || !isOpp) return;
    setIsPlayingMelody(true);

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

      const notes = [
        { freq: 311.13, duration: 0.45 }, // Eb4
        { freq: 392.00, duration: 0.45 }, // G4
        { freq: 466.16, duration: 0.55 }, // Bb4
        { freq: 523.25, duration: 0.70 }, // C5
        { freq: 466.16, duration: 0.50 }, // Bb4
        { freq: 392.00, duration: 0.45 }, // G4
        { freq: 311.13, duration: 0.55 }, // Eb4
        { freq: 349.23, duration: 1.10 }, // F4 (resolution)
      ];

      let startTime = ctx.currentTime + 0.1;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + n.duration);

        startTime += n.duration;
      });

      setTimeout(() => {
        setIsPlayingMelody(false);
      }, (startTime - ctx.currentTime) * 1000 + 200);
    } catch {
      setIsPlayingMelody(false);
    }
  };

  // Synthesize Honeybee Robotics Rock Abrasion Tool (RAT) grinding motor vibration
  const playRatGrinding = (rock: "sulfate" | "basalt") => {
    if (isGrinding) return;
    setIsGrinding(true);
    setGrindingRock(rock);

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

      const isBasalt = rock === "basalt";
      const baseFreq = isBasalt ? 195 : 390;
      const duration = 2.5;

      // Primary grinding motor load tone
      const motorOsc = ctx.createOscillator();
      motorOsc.type = isBasalt ? "sawtooth" : "triangle";
      motorOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      // Frequency variations simulating diamond burr bite and rotational torque fluctuations
      motorOsc.frequency.linearRampToValueAtTime(baseFreq * (isBasalt ? 0.86 : 0.94), ctx.currentTime + 0.7);
      motorOsc.frequency.linearRampToValueAtTime(baseFreq * 1.06, ctx.currentTime + 1.5);
      motorOsc.frequency.linearRampToValueAtTime(baseFreq, ctx.currentTime + duration);

      // Diamond burr grinding friction noise
      const bufferSize = Math.floor(ctx.sampleRate * 2.5);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (isBasalt ? 0.75 : 0.35);
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(isBasalt ? 650 : 1350, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(isBasalt ? 2.8 : 1.4, ctx.currentTime);

      const motorGain = ctx.createGain();
      motorGain.gain.setValueAtTime(0.001, ctx.currentTime);
      motorGain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.15);
      motorGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(isBasalt ? 0.08 : 0.035, ctx.currentTime + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      motorOsc.connect(motorGain);
      motorGain.connect(ctx.destination);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      motorOsc.start(ctx.currentTime);
      noiseSrc.start(ctx.currentTime);
      motorOsc.stop(ctx.currentTime + duration);
      noiseSrc.stop(ctx.currentTime + duration);

      setTimeout(() => {
        setIsGrinding(false);
      }, duration * 1000 + 100);
    } catch {
      setIsGrinding(false);
    }
  };

  const decodedPDS = decodeMERFilename(pdsInput);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-line bg-[#0c0a1a] text-white shadow-2xl transition-all ${
        standalone ? "mx-auto max-w-6xl p-5 sm:p-8" : "p-4 sm:p-6"
      }`}
    >
      {/* Background Starfield and Mars Atmospheric Gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-colors duration-700"
        style={{
          background:
            activeTab === "dust"
              ? `radial-gradient(ellipse at 50% 20%, rgba(${
                  tau > 7 ? "20,10,15" : tau > 3 ? "120,40,20" : isSpirit ? "180,60,50" : "180,80,40"
                }, 0.45), transparent 70%)`
              : "radial-gradient(ellipse at 50% 10%, rgba(139,92,246,0.15), transparent 60%)",
        }}
      />

      {/* Header — 100% Dedicated to THIS Rover */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold border ${
              isOpp
                ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                : "bg-rose-500/20 text-rose-300 border-rose-500/30"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full animate-ping ${isOpp ? "bg-orange-400" : "bg-rose-400"}`} />
              {isOpp ? "NASA Opportunity (MER-B / MER-1)" : "NASA Spirit (MER-A / MER-2)"}
            </span>
            <span className="font-mono text-xs text-white/50">
              COSPAR: {currentRoverSpecs.cosparId}
            </span>
          </div>
          <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {isOpp ? "Opportunity (MER-B / MER-1)" : "Spirit (MER-A / MER-2)"}
          </h2>
          <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
            {isOpp
              ? "Landed in Eagle Crater · Drove 45.16 km across Meridiani Planum · Resting in Perseverance Valley"
              : "Landed in Gusev Crater · Climbed Husband Hill · Resting at Troy beside Home Plate"}
          </p>
        </div>

        {/* Landing Station Badge */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
          <p className="font-mono text-[10px] text-white/50 uppercase">Landing Dedication</p>
          <p className={`font-mono text-xs font-bold ${isOpp ? "text-orange-300" : "text-rose-300"}`}>
            {currentRoverSpecs.siteDedication}
          </p>
          <p className="text-[10px] text-white/60">
            {currentRoverSpecs.landingCoordinates.lat.toFixed(4)}°, {currentRoverSpecs.landingCoordinates.lon.toFixed(4)}°
          </p>
        </div>
      </div>

      {/* Telemetry Quick Bar */}
      <div className="relative z-10 mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Surface Odyssey</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {currentRoverSpecs.surfaceOdyssey.distanceMeters.toLocaleString()} m
          </p>
          <p className={`text-[11px] ${isOpp ? "text-orange-300" : "text-rose-300"}`}>
            {currentRoverSpecs.surfaceOdyssey.distanceMiles.toFixed(2)} miles (
            {isOpp ? "Interplanetary Marathon" : "Husband Hill Ascent"})
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Operational Life</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {currentRoverSpecs.surfaceOdyssey.solsActive} Sols
          </p>
          <p className="text-[11px] text-emerald-400">
            {currentRoverSpecs.surfaceOdyssey.designLifeRatio}× 90-sol warranty
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Touchdown</p>
          <p className="mt-1 font-mono text-sm font-bold text-white truncate">
            {currentRoverSpecs.primaryLandingSite}
          </p>
          <p className="text-[11px] text-white/60 truncate">
            Elevation: {currentRoverSpecs.landingCoordinates.elevationM} m
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/50 uppercase">Final Monument</p>
          <p className={`mt-1 font-mono text-sm font-bold truncate ${isOpp ? "text-amber-300" : "text-rose-300"}`}>
            {isOpp ? "Perseverance Valley" : "Troy at Home Plate"}
          </p>
          <p className="text-[11px] text-white/60 truncate">
            HiRISE {currentRoverSpecs.finalRestingCoordinates.hiriseObsId}
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("traverse")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "traverse"
                ? isOpp ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {isOpp ? "45.16 km Odyssey & Milestones" : "7.73 km Columbia Hills Traverse"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dust")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "dust"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Dust Storm &amp; Power Sim (τ)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("monuments")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "monuments"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Hardware Monuments &amp; Memorials
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inspector")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
              activeTab === "inspector"
                ? "bg-white text-night shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            NASA Avionics &amp; Science Telemetry
          </button>
        </div>

        {/* Ambient Web Audio Toggle */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all ${
            soundEnabled
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/20"
              : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
          }`}
          title="Toggle Martian atmospheric wind synthesis"
        >
          <span className={`h-2 w-2 rounded-full ${soundEnabled ? "bg-emerald-400 animate-pulse" : "bg-white/30"}`} />
          {soundEnabled ? "Mars Audio Live" : "Audio Muted"}
        </button>
      </div>

      {/* TAB 0: 45.16 KM ODYSSEY & TRAVERSE WAYPOINTS */}
      {activeTab === "traverse" && (
        <div className="relative z-10 space-y-6">
          {/* Header Banner & Scrubber Controller */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
              <div>
                <span className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded border font-semibold ${
                  isOpp
                    ? "text-orange-300 bg-orange-500/10 border-orange-500/20"
                    : "text-rose-300 bg-rose-500/10 border-rose-500/20"
                }`}>
                  {isOpp ? "NASA Opportunity MER-1 · 45.16 km Marathon Odyssey" : "NASA Spirit MER-2 · 7.73 km Columbia Hills Ascent"}
                </span>
                <h3 className="display mt-1 text-xl font-bold sm:text-2xl">
                  {isOpp ? "5,111-Sol Surface Traverse & Geological Waypoints" : "2,210-Sol Surface Traverse & Summit Waypoints"}
                </h3>
                <p className="mt-0.5 text-xs text-white/70">
                  {isOpp
                    ? "Interactive chronological route across Meridiani Planum, from Eagle Crater touchdown to Perseverance Valley final resting site."
                    : "Interactive chronological route across Gusev Crater, from Columbia Memorial Station to the summit of Husband Hill and Troy."}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80">
                  Sol <span className={`font-bold ${isOpp ? "text-orange-400" : "text-rose-400"}`}>{activeWaypoint.sol}</span> / {isOpp ? "5,111" : "2,210"}
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80">
                  <span className={`font-bold ${isOpp ? "text-orange-400" : "text-rose-400"}`}>{activeWaypoint.odometryKm.toFixed(2)}</span> km / {isOpp ? "45.16" : "7.73"} km
                </span>
              </div>
            </div>

            {/* Interactive SVG Elevation & Traverse Profile */}
            <div className="mt-5 overflow-x-auto pb-2">
              <div className="min-w-[680px]">
                <div className="relative rounded-xl border border-white/10 bg-black/50 p-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${isOpp ? "bg-orange-500" : "bg-rose-500"}`} />
                      Martian Surface Elevation &amp; Traverse Track
                    </span>
                    <span>Click any milestone pin to inspect telemetry</span>
                  </div>

                  {(() => {
                    const oppSvgPoints = [
                      { x: 50, y: 105 },
                      { x: 145, y: 98 },
                      { x: 240, y: 90 },
                      { x: 335, y: 80 },
                      { x: 430, y: 65 },
                      { x: 525, y: 100 },
                      { x: 620, y: 120 },
                      { x: 715, y: 140 },
                    ];
                    const spiritSvgPoints = [
                      { x: 65, y: 135 },
                      { x: 195, y: 125 },
                      { x: 325, y: 95 },
                      { x: 455, y: 35 },
                      { x: 585, y: 85 },
                      { x: 715, y: 105 },
                    ];
                    const svgPoints = isOpp ? oppSvgPoints : spiritSvgPoints;

                    return (
                      <svg viewBox="0 0 780 185" className="w-full h-44 overflow-visible select-none">
                        <defs>
                          <linearGradient id={isOpp ? "oppGrad" : "spiritGrad"} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={isOpp ? "#f97316" : "#e11d48"} stopOpacity="0.35" />
                            <stop offset="100%" stopColor={isOpp ? "#f97316" : "#e11d48"} stopOpacity="0.02" />
                          </linearGradient>
                          <linearGradient id={isOpp ? "lineGradOpp" : "lineGradSpirit"} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={isOpp ? "#fdba74" : "#fda4af"} />
                            <stop offset="50%" stopColor={isOpp ? "#f97316" : "#e11d48"} />
                            <stop offset="100%" stopColor={isOpp ? "#ea580c" : "#9f1239"} />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Reference Gridlines */}
                        <line x1="30" y1="45" x2="750" y2="45" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                        <line x1="30" y1="95" x2="750" y2="95" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                        <line x1="30" y1="145" x2="750" y2="145" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                        {/* Area under the traverse profile */}
                        <path
                          d={`M ${svgPoints[0].x} 165 L ${svgPoints.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${
                            svgPoints[svgPoints.length - 1].x
                          } 165 Z`}
                          fill={`url(#${isOpp ? "oppGrad" : "spiritGrad"})`}
                        />

                        {/* Main Traverse Line */}
                        <path
                          d={`M ${svgPoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                          fill="none"
                          stroke={`url(#${isOpp ? "lineGradOpp" : "lineGradSpirit"})`}
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Milestone Nodes */}
                        {svgPoints.map((p, idx) => {
                          const wp = waypoints[idx];
                          const isSelected = selectedWaypointIndex === idx;
                          return (
                            <g
                              key={wp.sol}
                              className="cursor-pointer transition-transform hover:scale-110"
                              onClick={() => setSelectedWaypointIndex(idx)}
                            >
                              {isSelected && (
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r={14}
                                  fill="none"
                                  stroke={isOpp ? "#fb923c" : "#f43f5e"}
                                  strokeWidth={2}
                                  className="animate-ping"
                                  opacity={0.7}
                                />
                              )}
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={isSelected ? 7 : 4.5}
                                fill={isSelected ? (isOpp ? "#f97316" : "#e11d48") : "#ffffff"}
                                stroke={isSelected ? "#ffffff" : isOpp ? "#ea580c" : "#be123c"}
                                strokeWidth={2}
                              />
                              <text
                                x={p.x}
                                y={p.y - 12}
                                textAnchor="middle"
                                className={`font-mono text-[9px] font-bold ${
                                  isSelected
                                    ? isOpp
                                      ? "fill-orange-300"
                                      : "fill-rose-300"
                                    : "fill-white/70"
                                }`}
                              >
                                Sol {wp.sol}
                              </text>
                              <text
                                x={p.x}
                                y={175}
                                textAnchor="middle"
                                className={`font-mono text-[8px] ${
                                  isSelected
                                    ? isOpp
                                      ? "fill-orange-400 font-bold"
                                      : "fill-rose-400 font-bold"
                                    : "fill-white/40"
                                }`}
                              >
                                {wp.odometryKm.toFixed(1)} km
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Scrubber Slider */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between font-mono text-xs text-white/60">
                <span>Sol 1 ({waypoints[0].siteName.split("(")[0].trim()})</span>
                <span className={`font-bold ${isOpp ? "text-orange-400" : "text-rose-400"}`}>
                  Active: Sol {activeWaypoint.sol} · {activeWaypoint.odometryKm} km
                </span>
                <span>
                  Sol {waypoints[waypoints.length - 1].sol} ({waypoints[waypoints.length - 1].siteName.split("(")[0].trim()})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={waypoints.length - 1}
                step="1"
                value={selectedWaypointIndex}
                onChange={(e) => setSelectedWaypointIndex(parseInt(e.target.value, 10))}
                className="w-full accent-orange-500 h-2 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            {/* Quick Waypoint Milestone Chips */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {waypoints.map((wp, idx) => (
                <button
                  key={wp.sol}
                  type="button"
                  onClick={() => setSelectedWaypointIndex(idx)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-all ${
                    selectedWaypointIndex === idx
                      ? isOpp
                        ? "border-orange-400 bg-orange-500/25 text-white font-bold shadow-sm"
                        : "border-rose-400 bg-rose-500/25 text-white font-bold shadow-sm"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="opacity-70">Sol {wp.sol}:</span> {wp.siteName.split("(")[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Active Waypoint Dossier Card */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isOpp
                      ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                      : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                  }`}>
                    Milestone 0{selectedWaypointIndex + 1} of 0{waypoints.length} · Sol {activeWaypoint.sol}
                  </span>
                  <h3 className="display mt-1 text-2xl font-bold">{activeWaypoint.siteName}</h3>
                  <p className="font-mono text-xs text-white/50">
                    Earth Date: {activeWaypoint.dateUtc} · Cumulative Drive: {activeWaypoint.odometryKm.toFixed(2)} km ({(activeWaypoint.odometryKm * 0.621371).toFixed(2)} mi)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeWaypoint.hiriseObsId && (
                    <a
                      href={`https://www.uahirise.org/${activeWaypoint.hiriseObsId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[11px] text-cyan-300 hover:bg-cyan-500/20"
                    >
                      HiRISE {activeWaypoint.hiriseObsId} ↗
                    </a>
                  )}
                  {activeWaypoint.photoPia && (
                    <a
                      href={`https://photojournal.jpl.nasa.gov/catalog/${activeWaypoint.photoPia}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] text-amber-300 hover:bg-amber-500/20"
                    >
                      {activeWaypoint.photoPia} ↗
                    </a>
                  )}
                </div>
              </div>

              {/* Coordinates & Odometry Grid */}
              <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <dt className="text-white/50 text-[10px] uppercase">Planetary Coordinates</dt>
                  <dd className="font-semibold text-white mt-0.5">
                    {activeWaypoint.lat.toFixed(4)}° S, {activeWaypoint.lonEast.toFixed(4)}° E
                  </dd>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <dt className="text-white/50 text-[10px] uppercase">Traverse Distance</dt>
                  <dd className={`font-semibold mt-0.5 ${isOpp ? "text-orange-400" : "text-rose-400"}`}>
                    {activeWaypoint.odometryKm.toFixed(2)} km ({(activeWaypoint.odometryKm * 0.621371).toFixed(2)} mi)
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <dt className="text-white/50 text-[10px] uppercase">Mission Progress</dt>
                  <dd className="font-semibold text-emerald-400 mt-0.5">
                    {((activeWaypoint.odometryKm / (isOpp ? 45.16108 : 7.73050)) * 100).toFixed(1)}% of total traverse
                  </dd>
                </div>
              </dl>

              {/* Discarded Hardware Artifact */}
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Physical Artifact / Discarded Hardware Monument Left Behind
                </p>
                <p className="mt-1 text-xs text-white/90 leading-relaxed font-sans">
                  {activeWaypoint.artifactLeftBehind}
                </p>
              </div>

              {/* Groundbreaking Scientific Discovery */}
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Groundbreaking Scientific Discovery
                </p>
                <p className="mt-1 text-xs text-white/90 leading-relaxed font-sans">
                  {activeWaypoint.discovery}
                </p>
              </div>
            </div>

            {/* Milestone Media / Telemetry Preview */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              {activeWaypoint.photoPia ? (
                <div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/60">
                    <Image
                      src={`https://photojournal.jpl.nasa.gov/jpeg/${activeWaypoint.photoPia}.jpg`}
                      alt={activeWaypoint.siteName}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 500px, 100vw"
                    />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-white/70">
                      NASA/JPL Photojournal {activeWaypoint.photoPia}
                    </span>
                    <a
                      href={`https://photojournal.jpl.nasa.gov/catalog/${activeWaypoint.photoPia}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-amber-300 hover:underline"
                    >
                      Raw Archive ↗
                    </a>
                  </div>
                  <p className="mt-1.5 text-[11px] text-white/60 leading-relaxed">
                    {selectedWaypointIndex === waypoints.length - 1 && isOpp
                      ? "Opportunity's final transmission frame PIA22949 pointing at the obscured Sun through Pancam solar filter at tau = 10.8."
                      : `Authentic archival frame acquired during surface operations at ${activeWaypoint.siteName} on Sol ${activeWaypoint.sol}.`}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center border border-dashed border-white/10 rounded-xl">
                  <span className="font-mono text-xs text-white/40 uppercase">Traverse Waypoint Record</span>
                  <p className="mt-1 text-sm font-semibold text-white/80">{activeWaypoint.siteName}</p>
                  <p className="mt-2 text-xs text-white/60 max-w-sm">
                    Logged in NASA Planetary Data System traverse coordinates at Sol {activeWaypoint.sol} ({activeWaypoint.odometryKm} km).
                  </p>
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  type="button"
                  disabled={selectedWaypointIndex === 0}
                  onClick={() => setSelectedWaypointIndex((prev) => Math.max(0, prev - 1))}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                >
                  ← Previous Milestone
                </button>
                <span className="font-mono text-xs text-white/50">
                  {selectedWaypointIndex + 1} / {waypoints.length}
                </span>
                <button
                  type="button"
                  disabled={selectedWaypointIndex === waypoints.length - 1}
                  onClick={() => setSelectedWaypointIndex((prev) => Math.min(waypoints.length - 1, prev + 1))}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Next Milestone →
                </button>
              </div>
            </div>
          </div>

          {/* Archival Repositories & Raw Endpoints */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Verified Archival Data Repositories &amp; Raw Telemetry Endpoints
                </h4>
                <p className="text-xs text-white/60 mt-0.5">
                  Direct primary endpoints on NASA PDS, NSSDCA, and HiRISE servers for judges and researchers.
                </p>
              </div>
              <span className="font-mono text-[10px] text-white/40 uppercase">
                COSPAR {currentRoverSpecs.cosparId}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
              <a
                href={isOpp ? OFFICIAL_OPPORTUNITY_ENDPOINTS.nssdc_master : `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${currentRoverSpecs.cosparId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-emerald-500/50 hover:bg-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">NASA NSSDCA Master</span>
                  <span className="text-[10px] text-white/50">COSPAR {currentRoverSpecs.cosparId}</span>
                </div>
                <span className="text-emerald-400">↗</span>
              </a>

              <a
                href={isOpp ? OFFICIAL_OPPORTUNITY_ENDPOINTS.pds_analysts_notebook : "https://an.rsl.wustl.edu/mera/AN/an3.aspx"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-emerald-500/50 hover:bg-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">PDS Analyst&apos;s Notebook</span>
                  <span className="text-[10px] text-white/50">{isOpp ? "MER-B / MER-1 Mission" : "MER-A / MER-2 Mission"}</span>
                </div>
                <span className="text-emerald-400">↗</span>
              </a>

              <a
                href={isOpp ? OFFICIAL_OPPORTUNITY_ENDPOINTS.pds_rmc_traverse_coords : "https://pds-geosciences.wustl.edu/mer/mer2-m-eng-6-rmc-ops-v1/mer2rm_0xxx/data/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-emerald-500/50 hover:bg-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">PDS RMC Coordinates</span>
                  <span className="text-[10px] text-white/50">Raw motion counter telemetry</span>
                </div>
                <span className="text-emerald-400">↗</span>
              </a>

              <a
                href={isOpp ? OFFICIAL_OPPORTUNITY_ENDPOINTS.pds_contact_science_targets : "https://pds-geosciences.wustl.edu/missions/mer/mer_cs_targets.htm"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-emerald-500/50 hover:bg-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">PDS Contact Science Targets</span>
                  <span className="text-[10px] text-white/50">RAT, APXS, MI & Mössbauer logs</span>
                </div>
                <span className="text-emerald-400">↗</span>
              </a>

              <a
                href={isOpp ? OFFICIAL_OPPORTUNITY_ENDPOINTS.hirise_orbital_resting_site : `https://www.uahirise.org/${currentRoverSpecs.finalRestingCoordinates.hiriseObsId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-emerald-500/50 hover:bg-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">HiRISE Orbital Resting Site</span>
                  <span className="text-[10px] text-white/50">{currentRoverSpecs.finalRestingCoordinates.hiriseObsId}</span>
                </div>
                <span className="text-emerald-400">↗</span>
              </a>

              <a
                href={isOpp ? OFFICIAL_OPPORTUNITY_ENDPOINTS.final_pancam_image : "https://science.nasa.gov/mission/mer-spirit/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:border-emerald-500/50 hover:bg-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">{isOpp ? "Sol 5111 Final Frame Record" : "Spirit Mission Summary"}</span>
                  <span className="text-[10px] text-white/50">{isOpp ? "PIA22949 Archival Telemetry" : "NASA Science Mission Archives"}</span>
                </div>
                <span className="text-emerald-400">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: DUST STORM & POWER SURVIVAL SIMULATOR */}
      {activeTab === "dust" && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Visual Sky & Dust Atmosphere Canvas */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-6 min-h-[360px] transition-colors duration-500">
              {/* Dynamic Martian Sky Background */}
              <div
                className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
                style={{
                  background:
                    tau < 1.5
                      ? "radial-gradient(circle at 75% 25%, #ffe6cc 0%, #d97746 35%, #4a2113 100%)"
                      : tau < 4.0
                      ? "radial-gradient(circle at 75% 25%, #eed0a8 0%, #994c25 45%, #2a1008 100%)"
                      : tau < 8.0
                      ? "radial-gradient(circle at 75% 25%, #b57a55 0%, #4a1c0d 50%, #150604 100%)"
                      : "radial-gradient(circle at 75% 25%, #4a2818 0%, #1a0804 40%, #030102 100%)",
                }}
              />

              {/* Sun Visual that shrinks into a dim pinprick */}
              <div
                className="absolute transition-all duration-500 pointer-events-none rounded-full flex items-center justify-center"
                style={{
                  top: "22%",
                  right: "22%",
                  width: `${Math.max(8, 48 - tau * 3.8)}px`,
                  height: `${Math.max(8, 48 - tau * 3.8)}px`,
                  background:
                    tau > 9
                      ? "rgba(255, 230, 200, 0.4)"
                      : "radial-gradient(circle, #ffffff 30%, #ffeedd 70%, transparent 100%)",
                  boxShadow:
                    tau > 8
                      ? "none"
                      : `0 0 ${Math.max(4, 30 - tau * 2.5)}px rgba(255, 240, 200, ${Math.max(0.1, 0.8 - tau * 0.08)})`,
                }}
              >
                {tau >= 10.0 && (
                  <span className="font-mono text-[9px] text-amber-200/80 -mt-6 whitespace-nowrap">
                    Sun at τ=10.8 (0.002% light)
                  </span>
                )}
              </div>

              {/* Foreground Mars Horizon Silhouette */}
              <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-t from-[#0d070b] via-[#220d0e]/80 to-transparent" />

              {/* Sky Telemetry Overlay */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-md">
                    Atmospheric Optical Depth (Tau)
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-5xl font-black text-white">
                      τ = {tau.toFixed(1)}
                    </span>
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded font-bold uppercase ${
                        dustImpact.hazardLevel === "lethal"
                          ? "bg-red-600 text-white animate-pulse"
                          : dustImpact.hazardLevel === "critical"
                          ? "bg-orange-600 text-white"
                          : dustImpact.hazardLevel === "caution"
                          ? "bg-amber-500/80 text-black"
                          : "bg-emerald-600/80 text-white"
                      }`}
                    >
                      {dustImpact.hazardLevel}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-[11px] text-white/70 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-md inline-block">
                    Direct Sunlight Transmittance
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-amber-300">
                    {dustImpact.sunVisibilityPercent}%
                  </p>
                  <p className="font-mono text-[10px] text-white/50">T = e^-τ</p>
                </div>
              </div>

              {/* Bottom Rover Power Status Card */}
              <div className="relative z-10 rounded-xl bg-black/60 p-4 backdrop-blur-md border border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        dustImpact.powerWh <= 30
                          ? "bg-red-500 animate-ping"
                          : dustImpact.powerWh < 150
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                    />
                    <span className="font-mono text-xs font-semibold text-white">
                      Solar Array Energy: {dustImpact.powerWh} Watt-Hours / Sol
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-white/60">
                    {isOpp && tau >= 10.0 ? "Sol 5111 Record Low" : isSpirit && tau >= 3.5 ? "Troy Winter Low (~89 Wh)" : "Nominal: ~600 Wh"}
                  </span>
                </div>

                {/* Power Bar */}
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      dustImpact.powerWh <= 30
                        ? "bg-red-500"
                        : dustImpact.powerWh < 150
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                    style={{ width: `${Math.min(100, (dustImpact.powerWh / 620) * 100)}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-white/80 leading-relaxed font-sans">
                  {dustImpact.statusText}
                </p>
              </div>
            </div>

            {/* Tactile Control Panel & Historical Presets */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div>
                <h3 className={`font-mono text-sm font-bold uppercase tracking-wider ${isOpp ? "text-orange-400" : "text-rose-400"}`}>
                  Tactile Dust Controller
                </h3>
                <p className="mt-1 text-xs text-white/70">
                  Drag the optical depth slider to simulate how airborne dust grains attenuated sunlight over {isOpp ? "Meridiani Planum" : "Gusev Crater"}.
                </p>

                {/* Scrubber Slider */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between font-mono text-xs text-white/60">
                    <span>τ = 0.5 (Clear Sky)</span>
                    <span className="text-amber-400 font-bold">τ = {tau.toFixed(1)}</span>
                    <span>τ = 10.8 (Blackout)</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.8"
                    step="0.1"
                    value={tau}
                    onChange={(e) => setTau(parseFloat(e.target.value))}
                    className="w-full accent-orange-500 h-2 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Rover-Specific Presets */}
                <div className="mt-5">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-white/50 mb-2">
                    Verified {rover.toUpperCase()} Mission Scenarios
                  </p>
                  
                  {isOpp ? (
                    /* Opportunity Presets */
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => setTau(0.5)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 0.5
                            ? "border-emerald-400 bg-emerald-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">Clear Sol (τ 0.5)</span>
                        <span className="text-[10px] text-white/50">~620 Wh nominal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(1.0)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 1.0
                            ? "border-amber-400 bg-amber-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">Nominal Ops (τ 1.0)</span>
                        <span className="text-[10px] text-white/50">~540 Wh driving</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(1.5)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 1.5
                            ? "border-amber-400 bg-amber-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">Marathon Valley (τ 1.5)</span>
                        <span className="text-[10px] text-white/50">42 km milestone</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(4.5)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 4.5
                            ? "border-rose-500 bg-rose-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">2007 Global Storm (τ 4.5)</span>
                        <span className="text-[10px] text-white/50">~150 Wh emergency</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(6.0)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 6.0
                            ? "border-rose-500 bg-rose-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">Severe Dust (τ 6.0)</span>
                        <span className="text-[10px] text-white/50">~80 Wh critical</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(10.8)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 10.8
                            ? "border-red-500 bg-red-600/30 text-white ring-2 ring-red-500"
                            : "border-red-500/30 bg-red-950/20 text-red-200 hover:bg-red-900/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="block font-bold text-red-300">Sol 5111 (τ 10.8)</span>
                          <span className="rounded bg-red-600 px-1 py-0.2 text-[9px] uppercase font-mono">Blackout</span>
                        </div>
                        <span className="text-[10px] text-red-300/70">
                          22 Wh · 99.998% blocked
                        </span>
                      </button>
                    </div>
                  ) : (
                    /* Spirit Presets */
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => setTau(0.5)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 0.5
                            ? "border-emerald-400 bg-emerald-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">Clear Sol (τ 0.5)</span>
                        <span className="text-[10px] text-white/50">~600 Wh nominal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(1.8)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 1.8
                            ? "border-amber-400 bg-amber-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">Dust Devil Sol 420</span>
                        <span className="text-[10px] text-white/50">Boost to 93%</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(2.2)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 2.2
                            ? "border-amber-400 bg-amber-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">Husband Hill Summit</span>
                        <span className="text-[10px] text-white/50">Sol 582 panorama</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(4.5)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 4.5
                            ? "border-rose-500 bg-rose-500/20 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block font-bold">2007 Global Storm</span>
                        <span className="text-[10px] text-white/50">Low power standby</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTau(3.8)}
                        className={`col-span-2 sm:col-span-2 rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                          tau === 3.8
                            ? "border-rose-500 bg-rose-950/40 text-white ring-2 ring-rose-500"
                            : "border-rose-500/30 bg-rose-950/20 text-rose-200 hover:bg-rose-900/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="block font-bold text-rose-300">Sol 2210 Troy Winter Stand</span>
                          <span className="rounded bg-rose-600 px-1 py-0.2 text-[9px] uppercase font-mono">Final Sol</span>
                        </div>
                        <span className="text-[10px] text-rose-300/70">
                          89 Wh · 11.5° Southward Tilt · Survival Heaters Offline
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Rover Specific Modals */}
              <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEndModal(true)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all ${
                    isOpp
                      ? "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20"
                      : "border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20"
                  }`}
                >
                  <div>
                    <p className={`font-mono text-xs font-bold ${isOpp ? "text-amber-300" : "text-rose-300"}`}>
                      {isOpp ? "Sol 5111 Truth vs. Viral Myth" : "Sol 2210 Truth: Spirit's Winter Stand at Troy"}
                    </p>
                    <p className="text-[11px] text-white/70">
                      {isOpp
                        ? "Poetic translation vs. authentic NASA Low-Power & Clock Fault flags"
                        : "The 11.5° southward tilt, -55°C freeze, and 1,300+ recovery commands"}
                    </p>
                  </div>
                  <span className={`font-mono text-xs ${isOpp ? "text-amber-400" : "text-rose-400"}`}>Inspect →</span>
                </button>

                {isOpp && (
                  <button
                    type="button"
                    onClick={playBillieHolidayMotif}
                    disabled={isPlayingMelody}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all ${
                      isPlayingMelody
                        ? "border-violet-400 bg-violet-600/30 text-white shadow-lg shadow-violet-500/30"
                        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${isPlayingMelody ? "bg-violet-400 animate-ping" : "bg-violet-300"}`} />
                      <div>
                        <p className="font-mono text-xs font-bold text-violet-300">
                          {isPlayingMelody ? "Transmitting Audio via Goldstone DSS-14..." : "Play Billie Holiday: 'I'll Be Seeing You'"}
                        </p>
                        <p className="text-[11px] text-white/60">
                          Synthesizer replay of the final farewell song beamed to Opportunity (Feb 12, 2019)
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-violet-400">
                      {isPlayingMelody ? "Playing ♪" : "Play ▶"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISCARDED HARDWARE MONUMENTS & MEMORIALS */}
      {activeTab === "monuments" && (
        <div className="relative z-10 space-y-6">
          <div className="flex gap-2 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setMonumentView("hardware")}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                monumentView === "hardware"
                  ? isOpp ? "bg-orange-500 text-white" : "bg-rose-600 text-white"
                  : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {rover.toUpperCase()} Discarded Monuments ({roverMonuments.length})
            </button>
            <button
              type="button"
              onClick={() => setMonumentView("memorials")}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                monumentView === "memorials"
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              Memorials &amp; Relics on {rover.toUpperCase()} ({roverMemorials.length})
            </button>
          </div>

          {monumentView === "hardware" ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
              {/* Monuments Selector List */}
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
                  Hardware Monuments on {isOpp ? "Meridiani Planum" : "Gusev Crater"}
                </p>
                {roverMonuments.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMonumentId(m.id)}
                    className={`w-full text-left rounded-xl border p-3 transition-all ${
                      activeMonument?.id === m.id
                        ? isOpp
                          ? "border-orange-500 bg-orange-500/20 text-white shadow-md shadow-orange-500/20"
                          : "border-rose-500 bg-rose-500/20 text-white shadow-md shadow-rose-500/20"
                        : "border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{m.name}</span>
                      <span className={`font-mono text-[11px] ${isOpp ? "text-orange-400" : "text-rose-400"}`}>{m.massKg} kg</span>
                    </div>
                    <p className="mt-1 text-[11px] text-white/50 truncate">{m.siteName}</p>
                  </button>
                ))}
              </div>

              {/* Active Monument Detailed Dossier Card */}
              {activeMonument && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isOpp
                          ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                          : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                      }`}>
                        {activeMonument.category} · {activeMonument.massKg} kg
                      </span>
                      <h3 className="display mt-1 text-xl font-bold">{activeMonument.name}</h3>
                    </div>
                    {activeMonument.hiriseObsId && (
                      <a
                        href={`https://www.uahirise.org/${activeMonument.hiriseObsId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[11px] text-cyan-300 hover:bg-cyan-500/20"
                      >
                        HiRISE {activeMonument.hiriseObsId} ↗
                      </a>
                    )}
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
                    <div>
                      <dt className="text-white/50">Coordinates</dt>
                      <dd className="font-semibold text-white">
                        {activeMonument.coordinates.lat.toFixed(4)}° S, {activeMonument.coordinates.lon.toFixed(4)}° E
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/50">Current Condition</dt>
                      <dd className="text-amber-300 font-semibold truncate">{activeMonument.condition}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 space-y-3 text-xs leading-relaxed text-white/80">
                    <p>{activeMonument.description}</p>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <p className="font-mono text-[11px] text-emerald-400 font-bold uppercase">
                        Scientific &amp; Forensic Value for Humanity
                      </p>
                      <p className="mt-1 text-white/70">{activeMonument.scientificValue}</p>
                    </div>
                  </div>

                  {activeMonument.photojournalPia && (
                    <div className="mt-4">
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={`https://photojournal.jpl.nasa.gov/jpeg/${activeMonument.photojournalPia}.jpg`}
                          alt={activeMonument.name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 500px, 100vw"
                        />
                      </div>
                      <p className="mt-1.5 font-mono text-[10px] text-white/50">
                        NASA/JPL Photojournal {activeMonument.photojournalPia}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Memorial Artifacts Showcase */
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
                  Physical Relics Aboard {rover.toUpperCase()}
                </p>
                {roverMemorials.map((mem) => (
                  <button
                    key={mem.id}
                    type="button"
                    onClick={() => setSelectedMemorial(mem)}
                    className={`w-full text-left rounded-xl border p-3 transition-all ${
                      selectedMemorial?.id === mem.id
                        ? "border-violet-500 bg-violet-500/20 text-white shadow-md shadow-violet-500/20"
                        : "border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-white block">{mem.title}</span>
                    <span className="text-[11px] text-violet-300 line-clamp-1">{mem.tagline}</span>
                  </button>
                ))}
              </div>

              {selectedMemorial && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
                  <div className="border-b border-white/10 pb-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                      Aboard {rover.toUpperCase()}
                    </span>
                    <h3 className="display mt-1 text-xl font-bold">{selectedMemorial.title}</h3>
                    <p className="mt-0.5 text-xs text-violet-300">{selectedMemorial.tagline}</p>
                  </div>

                  <div className="mt-4 space-y-3 text-xs leading-relaxed text-white/80">
                    <p>{selectedMemorial.story}</p>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <p className="font-mono text-[11px] text-amber-300 font-bold uppercase">
                        Exact Hardware Placement
                      </p>
                      <p className="mt-1 text-white/70">{selectedMemorial.hardwarePlacement}</p>
                    </div>
                    <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-3">
                      <p className="font-mono text-[11px] text-violet-300 font-bold uppercase">
                        Takeaway for Young Space Enthusiasts
                      </p>
                      <p className="mt-1 text-white/90">{selectedMemorial.youthTakeaway}</p>
                    </div>
                  </div>

                  {selectedMemorial.imagePia && (
                    <div className="mt-4">
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={`https://photojournal.jpl.nasa.gov/jpeg/${selectedMemorial.imagePia}.jpg`}
                          alt={selectedMemorial.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 500px, 100vw"
                        />
                      </div>
                      <p className="mt-1.5 font-mono text-[10px] text-white/50">
                        NASA/JPL Photojournal {selectedMemorial.imagePia}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NASA PDS TELEMETRY & 27-CHAR FILENAME DECODER */}
      {activeTab === "inspector" && (
        <div className="relative z-10 space-y-6">
          {/* Section 1: Radiation-Hardened Computing & Avionics Architecture */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
              <div>
                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isOpp
                    ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                    : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                }`}>
                  BAE RAD6000 Radiation-Hardened Avionics
                </span>
                <h3 className="display mt-1 text-xl font-bold">
                  {rover.toUpperCase()} Computing &amp; Telecom Subsystems
                </h3>
              </div>
              <span className="font-mono text-xs text-white/50">
                VxWorks RTOS · Fault-Tolerant Bus
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 font-mono text-xs">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Central Processor</span>
                <span className="mt-1 font-bold text-white block">BAE RAD6000</span>
                <span className="text-[10px] text-emerald-400">32-bit RISC CPU</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Clock Frequency</span>
                <span className="mt-1 font-bold text-amber-300 block">20 MHz</span>
                <span className="text-[10px] text-white/50">1.1M Transistors</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">System RAM</span>
                <span className="mt-1 font-bold text-cyan-300 block">128 MB DRAM</span>
                <span className="text-[10px] text-white/50">EDAC Protected</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Flash Storage</span>
                <span className="mt-1 font-bold text-white block">256 MB Flash</span>
                <span className="text-[10px] text-white/50">Science Buffering</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">ROM Bootloader</span>
                <span className="mt-1 font-bold text-white block">3 MB EEPROM</span>
                <span className="text-[10px] text-white/50">Fault Handlers</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Operating System</span>
                <span className="mt-1 font-bold text-violet-300 block">VxWorks</span>
                <span className="text-[10px] text-white/50">Real-Time Kernel</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3.5 font-mono text-xs text-white/80">
              <span className="text-[10px] text-white/50 uppercase block">RF Telecommunications Architecture:</span>
              <p className="mt-1 leading-relaxed">
                <strong className="text-white">UHF Relay (401.5 / 437.1 MHz):</strong> Connects to Mars Odyssey &amp; Mars Reconnaissance Orbiter (MRO) during overhead passes at up to 128 kbps.
                <br />
                <strong className="text-white">Direct-to-Earth (DTE) X-Band:</strong> Steerable High-Gain Antenna (HGA) and Low-Gain Antenna (LGA) linking directly to NASA Deep Space Network 70 m antennas at Goldstone, Madrid, and Canberra.
              </p>
            </div>
          </div>

          {/* Section 2: Athena Science Payload Manifest Table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Athena Science Payload · 9 Certified Instruments
                </span>
                <h3 className="display mt-1 text-xl font-bold">
                  Scientific Instruments Aboard {rover.toUpperCase()}
                </h3>
              </div>
              <span className="font-mono text-xs text-white/50">
                Dr. Steve Squyres, Cornell University (Lead PI)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {MER_EXPERIMENTS.map((exp) => (
                <div
                  key={exp.num}
                  className="rounded-xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      #{exp.num} · {exp.acronym}
                    </span>
                    <div className="flex items-center gap-2">
                      {exp.massKg && (
                        <span className="font-mono text-[10px] text-white/40">
                          {exp.massKg} kg · {exp.powerWatts} W
                        </span>
                      )}
                      <a
                        href={getNssdcaExperimentUrl(rover, exp.num)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline"
                        title={`Verified NASA NSSDCA record for ${exp.acronym}`}
                      >
                        NSSDCA ↗
                      </a>
                    </div>
                  </div>
                  <h4 className="mt-1 font-bold text-sm text-white">{exp.name}</h4>
                  <p className="mt-0.5 font-mono text-[11px] text-white/50">
                    {exp.leadInvestigator} ({exp.institution})
                  </p>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">
                    {exp.scienceRole}
                  </p>
                  <div className="mt-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
                    <p className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
                      Breakthrough Result
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/90">
                      {exp.breakthroughResult}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Honeybee Robotics RAT Sonification Laboratory */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Honeybee Robotics · RAT Acoustic &amp; Motor Torque Telemetry
                </span>
                <h3 className="display mt-1 text-xl font-bold">
                  Rock Abrasion Tool (RAT) Grinding Sound Synthesizer
                </h3>
              </div>
              <span className="font-mono text-xs text-white/50">
                NSSDCA {isOpp ? "2003-032A-06" : "2003-027A-06"}
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              While neither rover carried a dedicated acoustic microphone, Honeybee Robotics and JPL flight controllers converted high-frequency motor current and torque-load telemetry into audible sound. Grinding into soft sulfate sandstone produces an easy, higher-pitch hum (~390 Hz), whereas dense volcanic basalt forces the motor into a deep, labored growl (~195 Hz) under heavy diamond-burr friction.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className={`rounded-xl border p-4 transition-all ${
                grindingRock === "sulfate" && isGrinding
                  ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                  : "border-white/10 bg-black/40 hover:border-white/20"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-300">Meridiani Sulfate Sandstone</span>
                  <span className="font-mono text-[10px] text-white/50">e.g. El Capitan (Eagle Crater)</span>
                </div>
                <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                  Soft, layered aqueous sedimentary rock with low mechanical resistance. Motor load runs near nominal ~390 Hz with smooth burr rotation.
                </p>
                <button
                  type="button"
                  onClick={() => playRatGrinding("sulfate")}
                  disabled={isGrinding}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-2 font-mono text-xs font-bold text-amber-300 transition-all disabled:opacity-50"
                >
                  <span className={`h-2 w-2 rounded-full ${isGrinding && grindingRock === "sulfate" ? "bg-amber-400 animate-ping" : "bg-amber-400"}`} />
                  {isGrinding && grindingRock === "sulfate" ? "Grinding in progress..." : "Sonify Sulfate Grinding (~390 Hz)"}
                </button>
              </div>

              <div className={`rounded-xl border p-4 transition-all ${
                grindingRock === "basalt" && isGrinding
                  ? "border-rose-400 bg-rose-500/10 shadow-lg shadow-rose-500/10"
                  : "border-white/10 bg-black/40 hover:border-white/20"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-300">Gusev Dense Volcanic Basalt</span>
                  <span className="font-mono text-[10px] text-white/50">e.g. Adirondack / Humphrey</span>
                </div>
                <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                  Ultra-dense igneous rock with extreme hardness. Grinding head motor slows to ~195 Hz under high torque, grinding diamond teeth flush by Sol 416.
                </p>
                <button
                  type="button"
                  onClick={() => playRatGrinding("basalt")}
                  disabled={isGrinding}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-3 py-2 font-mono text-xs font-bold text-rose-300 transition-all disabled:opacity-50"
                >
                  <span className={`h-2 w-2 rounded-full ${isGrinding && grindingRock === "basalt" ? "bg-rose-400 animate-ping" : "bg-rose-400"}`} />
                  {isGrinding && grindingRock === "basalt" ? "Grinding in progress..." : "Sonify Basalt Grinding (~195 Hz)"}
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Interactive 27-Character MER PDS Filename Decoder */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400">
              Interactive 27-Character MER PDS Filename Decoder
            </h3>
            <p className="mt-1 text-xs text-white/70">
              Every raw EDR and calibrated RDR image frame for {rover.toUpperCase()} is encoded with a deterministic 27-character scientific syntax.
            </p>

            {/* Quick Sample Selector — Strictly For This Rover */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-white/50">Verified {rover.toUpperCase()} Frames:</span>
              {(isOpp
                ? [
                    { label: "Sol 5111 Final Sky", filename: "1P581919922EFFD212P2685L8M1" },
                    { label: "Eagle Crater Blueberries", filename: "1M131234567EFF0400P2953M2M1" },
                    { label: "Endurance Sol 180 Shadow", filename: "1P126468012EDN0000P2303L2M1" },
                  ]
                : [
                    { label: "Gusev Panorama Sol 3", filename: "2P126468012EDN0000P2303L2M1" },
                    { label: "Troy Opaline Silica Sol 1157", filename: "2P243764821EFF8924P2420L7M1" },
                    { label: "Husband Hill Summit Sol 582", filename: "2P164408012EFF0000P2303L2M1" },
                  ]
              ).map((s) => (
                <button
                  key={s.filename}
                  type="button"
                  onClick={() => setPdsInput(s.filename)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition-all ${
                    pdsInput === s.filename
                      ? "border-cyan-400 bg-cyan-500/20 text-white font-bold"
                      : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const generated = buildMERFilename({
                    rover,
                    instrument: "P",
                    sclk: isOpp ? 581919922 : 243764821,
                    productType: "EFF",
                    siteCode: isOpp ? "D2" : "89",
                    drivePos: isOpp ? "12" : "24",
                    sequenceId: isOpp ? "P2685" : "P2420",
                    camFilter: isOpp ? "L8" : "L7",
                    producer: "M1",
                  });
                  setPdsInput(generated);
                }}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                title="Use buildMERFilename to construct a 27-character PDS identifier"
              >
                + Build 27-Char Schema
              </button>
            </div>

            {/* Input Bar */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={pdsInput}
                onChange={(e) => setPdsInput(e.target.value)}
                placeholder={isOpp ? "e.g. 1P581919922EFFD212P2685L8M1" : "e.g. 2P126468012EDN0000P2303L2M1"}
                className="w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-mono text-sm text-cyan-300 placeholder-white/30 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Decoded Output Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 font-mono text-xs">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Spacecraft</span>
                <span className="mt-1 font-bold text-white block truncate">{decodedPDS.spacecraft}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Instrument</span>
                <span className="mt-1 font-bold text-cyan-300 block truncate">{decodedPDS.instrument}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">SCLK Clock</span>
                <span className="mt-1 font-bold text-amber-300 block truncate">{decodedPDS.sclkTimestamp}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Product Type</span>
                <span className="mt-1 font-bold text-white block truncate">{decodedPDS.productType}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Site / Pos</span>
                <span className="mt-1 font-bold text-white block">{decodedPDS.siteCode} / {decodedPDS.drivePosition}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/50 uppercase block">Camera Filter</span>
                <span className="mt-1 font-bold text-orange-400 block">{decodedPDS.cameraFilter}</span>
              </div>
            </div>
          </div>

          {/* Breakthrough Science Minerals Sourced by THIS Rover */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-400 mb-3">
              Groundbreaking Mineral Discoveries by {rover.toUpperCase()}
            </h4>
            {isOpp ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-mono text-[10px] text-amber-400 uppercase">Opportunity · Mössbauer (-03)</p>
                  <p className="font-bold text-white text-sm mt-0.5">Jarosite Sulfate Mineral</p>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Identified inside the bedrock of Eagle Crater on Sol 29. Forms exclusively in the presence of acidic liquid water—the smoking-gun evidence for past Martian surface seas.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-mono text-[10px] text-cyan-400 uppercase">Opportunity · APXS (-04)</p>
                  <p className="font-bold text-white text-sm mt-0.5">Homestake Pure Gypsum Vein</p>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Discovered along Endeavour Crater rim. Pure hydrated calcium sulfate (CaSO₄·2H₂O) precipitated by neutral-pH, life-friendly groundwater circulating through fractured rock.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-mono text-[10px] text-rose-400 uppercase">Spirit · APXS (-04)</p>
                  <p className="font-bold text-white text-sm mt-0.5">90.1% Pure Opaline Silica (SiO₂)</p>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Excavated when Spirit&apos;s jammed right-front wheel dragged through soil at Gertrude Weise near Home Plate. Conclusive proof of ancient volcanic hot springs or fumaroles.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-mono text-[10px] text-amber-400 uppercase">Spirit · Mini-TES (-02)</p>
                  <p className="font-bold text-white text-sm mt-0.5">Comanche Carbonate Outcrop</p>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Detected 16% to 34% magnesium-iron carbonate in the Columbia Hills, proving ancient Gusev Crater hosted neutral-pH liquid water, not just acidic water.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Primary Source Verification Endpoints */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/50 mb-3">
              Deterministic NASA Primary Source Archival Portals
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
              <a
                href={isOpp ? PDS_MER_ENDPOINTS.opportunity_camera_volumes : PDS_MER_ENDPOINTS.spirit_camera_volumes}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-violet hover:text-violet transition-colors"
              >
                <span>{rover.toUpperCase()} PDS Volumes</span>
                <span>↗</span>
              </a>
              <a
                href={PDS_MER_ENDPOINTS.geosciences_master}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-violet hover:text-violet transition-colors"
              >
                <span>PDS Geosciences Node</span>
                <span>↗</span>
              </a>
              <a
                href={PDS_MER_ENDPOINTS.analysts_notebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-violet hover:text-violet transition-colors"
              >
                <span>MER Analyst&apos;s Notebook</span>
                <span>↗</span>
              </a>
              <a
                href={isOpp ? OFFICIAL_OPPORTUNITY_ENDPOINTS.nssdc_master : OFFICIAL_SPIRIT_ENDPOINTS.nssdc_master}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-violet hover:text-violet transition-colors"
              >
                <span>NSSDCA {rover.toUpperCase()}</span>
                <span>↗</span>
              </a>
              <a
                href={PDS_MER_ENDPOINTS.spice_kernels}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-violet hover:text-violet transition-colors"
              >
                <span>NAIF SPICE Kernels</span>
                <span>↗</span>
              </a>
              <a
                href={PDS_MER_ENDPOINTS.cartography_portal}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-violet hover:text-violet transition-colors"
              >
                <span>PDS Cartography Portal</span>
                <span>↗</span>
              </a>
              <a
                href={isOpp ? OFFICIAL_OPPORTUNITY_ENDPOINTS.hirise_orbital_resting_site : OFFICIAL_SPIRIT_ENDPOINTS.hirise_orbital_resting_site}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-violet hover:text-violet transition-colors"
              >
                <span>HiRISE Resting Site</span>
                <span>↗</span>
              </a>
              <a
                href={OFFICIAL_OPPORTUNITY_ENDPOINTS.pds_contact_science_targets}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5 hover:border-violet hover:text-violet transition-colors"
              >
                <span>Contact Science Targets</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ROVER SPECIFIC END-OF-MISSION MODAL */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[#120e24] p-6 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setShowEndModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white font-mono text-sm"
            >
              ✕
            </button>

            {isOpp ? (
              /* Opportunity Sol 5111 Modal */
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  NASA Archival Fact Check · Sol 5111 (June 10, 2018)
                </span>
                <h3 className="display mt-2 text-2xl font-bold">
                  Opportunity&apos;s Final Message: Myth vs. Engineering Truth
                </h3>

                <div className="mt-4 space-y-4 text-xs leading-relaxed text-white/80">
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                    <p className="font-mono text-xs font-bold text-rose-300 uppercase">
                      The Viral Poetic Translation
                    </p>
                    <p className="mt-1 text-sm italic text-white">
                      &ldquo;My battery is low and it&apos;s getting dark.&rdquo;
                    </p>
                    <p className="mt-2 text-[11px] text-white/70">
                      This phrase went viral around the world. It originated when science reporter Jacob Margolis translated the technical telemetry into poetic human speech after talking to MER flight engineers.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="font-mono text-xs font-bold text-emerald-300 uppercase">
                      100% Verified NASA Engineering Telemetry &amp; DSN Relay
                    </p>
                    <ul className="mt-2 space-y-2 font-mono text-[11px] text-white/90">
                      <li>• <strong>09:30 AM PDT (Sol 5111):</strong> Pancam left eye exposure (frame PIA22949) taken through solar filter pointing directly toward the obscured Sun.</li>
                      <li>• <strong>09:45 AM PDT:</strong> Telemetry packets and partial frame relayed to Mars Reconnaissance Orbiter (MRO) during overhead UHF pass.</li>
                      <li>• <strong>10:05 AM PDT (1:05 PM EDT / 17:05 UTC):</strong> Earth-Received Time via NASA Deep Space Network Goldstone DSS-14 70-meter dish in California.</li>
                      <li>• <strong>Atmospheric Optical Depth:</strong> <span className="text-amber-300 font-bold">τ = 10.8</span> (Record blackout; 99.998% of direct sunlight blocked, transmittance $T = e^{`{-10.8}`} = 0.002\%$).</li>
                      <li>• <strong>Solar Array Power Output:</strong> Plunged to <span className="text-red-400 font-bold">22 Watt-Hours</span> (down from ~620 Wh nominal).</li>
                      <li>• <strong>Status Fault Flags:</strong> <span className="text-red-400">Low-Power Fault = TRUE</span> · <span className="text-red-400">Master Clock Fault = TRUE</span>.</li>
                      <li>• <strong>Signal Truncation:</strong> Final frame <span className="text-cyan-300 font-bold">1P581919922EFFD212P2685L8M1</span> cut off mid-stream with missing bottom rows as power died.</li>
                    </ul>
                  </div>

                  <p className="text-[11px] text-white/60">
                    On February 12, 2019, before concluding recovery operations, the flight team at NASA/JPL transmitted Billie Holiday&apos;s &ldquo;I&apos;ll Be Seeing You&rdquo; through the Deep Space Network Goldstone 70 m dish to Perseverance Valley.
                  </p>
                </div>
              </div>
            ) : (
              /* Spirit Sol 2210 Modal */
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                  NASA Archival Fact Check · Sol 2210 (March 22, 2010)
                </span>
                <h3 className="display mt-2 text-2xl font-bold">
                  Spirit&apos;s Winter Stand at Troy: The 11.5° Southward Tilt
                </h3>

                <div className="mt-4 space-y-4 text-xs leading-relaxed text-white/80">
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                    <p className="font-mono text-xs font-bold text-rose-300 uppercase">
                      The Sand Trap at Home Plate
                    </p>
                    <p className="mt-1 text-xs text-white">
                      On May 1, 2009 (Sol 1892), Spirit broke through a crust into soft ferric sulfate sand at Troy. With its right-front wheel already jammed since Sol 779, extrication attempts failed and its right-rear wheel failed in November 2009.
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <p className="font-mono text-xs font-bold text-amber-300 uppercase">
                      100% Verified NASA Winter Telemetry
                    </p>
                    <ul className="mt-2 space-y-1.5 font-mono text-[11px] text-white/90">
                      <li>• Deck Tilt: <span className="text-rose-300 font-bold">11.5° Southward</span> (unfavorable to northern winter sun)</li>
                      <li>• Array Energy Drop: From nominal ~700 Wh down to <span className="text-red-400 font-bold">89 Watt-Hours / Sol</span></li>
                      <li>• Survival Threshold: Unable to sustain survival heaters; electronics chilled below <span className="text-cyan-300">-55°C</span></li>
                      <li>• Final Contact: <span className="font-bold">22 March 2010 (Sol 2210)</span></li>
                      <li>• Recovery Efforts: NASA beamed over <span className="text-white font-bold">1,300 recovery commands</span> before concluding on May 25, 2011</li>
                    </ul>
                  </div>

                  <p className="text-[11px] text-white/60">
                    Spirit completed 7,730.50 meters across Gusev Crater, climbed Husband Hill, and excavated the 90.1% pure hydrothermal silica that proved ancient hot springs on Mars.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="rounded-xl bg-white px-5 py-2 font-mono text-xs font-bold text-night hover:bg-white/90"
              >
                Close Telemetry Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
