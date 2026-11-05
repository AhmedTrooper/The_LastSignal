"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/header";
import { ArrowLeft, ArrowRight } from "@/app/components/icons";
import { assetUrl } from "@/lib/heroes";
import { calculateIngenuityAerodynamics } from "@/lib/ingenuity-mission";
import { calculateDustImpact } from "@/lib/mer-mission";

import { SPREADS, TOC_ITEMS, type BookSpread } from "@thelastsignal/data";
export default function StoryBookPage() {
  const [spreadIndex, setSpreadIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [mobilePage, setMobilePage] = useState<"left" | "right">("left");
  const [showTocDrawer, setShowTocDrawer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // InSight interactive states
  const [insightActiveAudio, setInsightActiveAudio] = useState<"wind" | "bloop" | "quake" | null>(null);
  const [insightGlitchFilter, setInsightGlitchFilter] = useState<boolean>(true);
  const [insightDeltaT, setInsightDeltaT] = useState<number>(180);
  const [insightSaltationBonus, setInsightSaltationBonus] = useState<number>(0);
  const [insightSaltationSparkle, setInsightSaltationSparkle] = useState<boolean>(false);
  const [insightBlueprintPart, setInsightBlueprintPart] = useState<"larri" | "names" | "cpu" | "seis">("larri");

  // Ingenuity interactive states
  const [ingenuityRpm, setIngenuityRpm] = useState<number>(2537);
  const [ingenuityDensity, setIngenuityDensity] = useState<number>(0.015);
  const [ingenuityAudioPlaying, setIngenuityAudioPlaying] = useState<boolean>(false);
  const [ingenuityHardwareId, setIngenuityHardwareId] = useState<"shield" | "blade" | "chassis">("blade");

  const ingenuityAero = calculateIngenuityAerodynamics(ingenuityDensity, ingenuityRpm);

  const playIngenuityHum = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const baseFreq = (ingenuityRpm / 60) * 2;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 2.25);
      osc2.stop(ctx.currentTime + 2.25);
      setIngenuityAudioPlaying(true);
      setTimeout(() => setIngenuityAudioPlaying(false), 2200);
    } catch {
      // AudioContext unavailable
    }
  }, [ingenuityRpm]);

  // MER Twin interactive states
  const [merRockType, setMerRockType] = useState<"sulfate" | "basalt">("sulfate");
  const [merGrindingAudioPlaying, setMerGrindingAudioPlaying] = useState<boolean>(false);
  const [merRelicTab, setMerRelicTab] = useState<"wtc" | "memorials" | "marsdial" | "lego">("wtc");
  const [merDustTau, setMerDustTau] = useState<number>(10.8);
  const [merBillieHolidayPlaying, setMerBillieHolidayPlaying] = useState<boolean>(false);

  // Synthesize Rock Abrasion Tool (RAT) grinding motor vibration
  const playMerRatGrinding = useCallback((rock: "sulfate" | "basalt") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const isBasalt = rock === "basalt";
      const baseFreq = isBasalt ? 195 : 390;
      const duration = 2.2;

      const osc = ctx.createOscillator();
      osc.type = isBasalt ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq * (isBasalt ? 0.86 : 0.94), ctx.currentTime + 0.6);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.05, ctx.currentTime + 1.4);
      osc.frequency.linearRampToValueAtTime(baseFreq, ctx.currentTime + duration);

      const bufferSize = Math.floor(ctx.sampleRate * 2.2);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (isBasalt ? 0.7 : 0.3);
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(isBasalt ? 650 : 1350, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.001, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.15);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(isBasalt ? 0.07 : 0.03, ctx.currentTime + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      noiseSrc.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start();
      noiseSrc.start();
      osc.stop(ctx.currentTime + duration);
      noiseSrc.stop(ctx.currentTime + duration);

      setMerGrindingAudioPlaying(true);
      setTimeout(() => setMerGrindingAudioPlaying(false), duration * 1000);
    } catch {
      // AudioContext unavailable
    }
  }, []);

  // Synthesize Billie Holiday "I'll Be Seeing You" opening motif for Opportunity
  const playMerBillieHoliday = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const notes = [
        { freq: 311.13, duration: 0.40 }, // Eb4
        { freq: 392.00, duration: 0.40 }, // G4
        { freq: 466.16, duration: 0.50 }, // Bb4
        { freq: 523.25, duration: 0.65 }, // C5
        { freq: 466.16, duration: 0.45 }, // Bb4
        { freq: 392.00, duration: 0.40 }, // G4
        { freq: 311.13, duration: 0.50 }, // Eb4
        { freq: 349.23, duration: 0.95 }, // F4
      ];

      let startTime = ctx.currentTime + 0.05;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.freq, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.07, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + n.duration);
        startTime += n.duration;
      });

      setMerBillieHolidayPlaying(true);
      setTimeout(() => setMerBillieHolidayPlaying(false), (startTime - ctx.currentTime) * 1000 + 100);
    } catch {
      // AudioContext unavailable
    }
  }, []);

  const totalSpreads = SPREADS.length;
  const currentSpread = SPREADS[spreadIndex];

  // Calculated distance for P-to-S wave triangulation
  const calculatedQuakeDistanceKm = Math.round(insightDeltaT * 9.35);
  const calculatedQuakeDegrees = (calculatedQuakeDistanceKm / 59.2).toFixed(1);

  // Synthesize realistic sound effects via Web Audio API
  const playPageTurnSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);

      osc.type = "sine";
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // AudioContext not allowed or unsupported
    }
  }, []);

  const playInSightSound = (type: "wind" | "bloop" | "quake") => {
    setInsightActiveAudio(type);
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "wind") {
        const bufferSize = ctx.sampleRate * 2.0;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 2.5;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(260, ctx.currentTime + 1.0);
        filter.frequency.linearRampToValueAtTime(90, ctx.currentTime + 2.0);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === "bloop") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(90, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.22);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.55);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.56);
      } else if (type === "quake") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(45, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(65, ctx.currentTime + 0.8);
        osc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 1.8);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.95);
      }
    } catch {
      // AudioContext unavailable
    }
    setTimeout(() => setInsightActiveAudio(null), 2000);
  };

  const handleSaltationTrick = () => {
    setInsightSaltationSparkle(true);
    setInsightSaltationBonus((prev) => Math.min(prev + 15, 60));
    playPageTurnSound();
    setTimeout(() => {
      setInsightSaltationSparkle(false);
    }, 1200);
  };

  const goToNextSpread = useCallback(() => {
    if (spreadIndex < totalSpreads - 1) {
      setIsFlipping(true);
      playPageTurnSound();
      setTimeout(() => {
        setSpreadIndex((prev) => prev + 1);
        setMobilePage("left");
        setIsFlipping(false);
      }, 150);
    }
  }, [spreadIndex, totalSpreads, playPageTurnSound]);

  const goToPrevSpread = useCallback(() => {
    if (spreadIndex > 0) {
      setIsFlipping(true);
      playPageTurnSound();
      setTimeout(() => {
        setSpreadIndex((prev) => prev - 1);
        setMobilePage("left");
        setIsFlipping(false);
      }, 150);
    }
  }, [spreadIndex, playPageTurnSound]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        goToNextSpread();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        goToPrevSpread();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSpread, goToPrevSpread]);

  const leftPageNumber = spreadIndex * 2 + 1;
  const rightPageNumber = spreadIndex * 2 + 2;

  return (
    <div className={`min-h-screen bg-[#070510] text-[#f4ede0] flex flex-col selection:bg-rose-900 selection:text-white ${isFullscreen ? "fixed inset-0 z-50 overflow-y-auto" : ""}`}>
      {!isFullscreen && <Header />}

      {/* Main Reading Stage */}
      <main className={`flex-1 flex flex-col items-center justify-center px-2 sm:px-4 ${isFullscreen ? "py-2 sm:py-3" : "py-4 sm:py-6"}`}>
        {/* Top Control Bar (Jump, Chapter Indicator, Mobile Switcher, Fullscreen Toggle) */}
        <div className="w-full max-w-5xl mb-3 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Back to story hub, Chapter TOC, & Fullscreen */}
          <div className="flex flex-wrap items-center gap-2">
            {!isFullscreen && (
              <Link
                href="/story"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-mono text-white/80 hover:text-white transition-colors border border-white/10"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Story Hub
              </Link>
            )}

            <button
              onClick={() => setShowTocDrawer(!showTocDrawer)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 px-3 py-1.5 text-xs font-mono font-bold text-rose-300 transition-colors border border-rose-800/30 cursor-pointer"
            >
              📖 Table of Contents ({TOC_ITEMS.length} Chapters)
            </button>

            {/* Fullscreen Reading Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition-all border cursor-pointer shadow-sm ${
                isFullscreen
                  ? "bg-rose-900/60 hover:bg-rose-800 text-rose-200 border-rose-700"
                  : "bg-white/10 hover:bg-white/15 text-white border-white/15"
              }`}
              title={isFullscreen ? "Exit Fullscreen Reading Mode (Esc)" : "Enter Immersive Fullscreen Reading Mode"}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
              <span>{isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Mode"}</span>
            </button>
          </div>

          {/* Center / Right: Progress & Mobile Page Switcher */}
          <div className="flex items-center gap-2">
            {/* Mobile Left/Right Page Toggle (Visible only on < md screens) */}
            <div className="flex md:hidden items-center rounded-xl bg-white/10 p-0.5 border border-white/15">
              <button
                onClick={() => setMobilePage("left")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  mobilePage === "left" ? "bg-rose-700 text-white shadow" : "text-white/60 hover:text-white"
                }`}
              >
                Left (Pg {leftPageNumber})
              </button>
              <button
                onClick={() => setMobilePage("right")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  mobilePage === "right" ? "bg-rose-700 text-white shadow" : "text-white/60 hover:text-white"
                }`}
              >
                Right (Pg {rightPageNumber})
              </button>
            </div>

            {/* Desktop Spread Indicator */}
            <span className="hidden md:inline font-mono text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              Spread {spreadIndex + 1} of {totalSpreads} · Pages {leftPageNumber}–{rightPageNumber} of 58
            </span>
          </div>
        </div>

        {/* Quick Drawer: Table of Contents */}
        {showTocDrawer && (
          <div className="w-full max-w-5xl mb-4 rounded-2xl border border-rose-900/40 bg-[#120b20] p-4 shadow-2xl z-30">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold">
                Jump Directly to Any Chapter
              </span>
              <button
                onClick={() => setShowTocDrawer(false)}
                className="text-xs font-mono text-white/60 hover:text-white cursor-pointer px-2 py-0.5 rounded bg-white/10"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto no-scrollbar">
              {TOC_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSpreadIndex(item.spread);
                    setMobilePage("left");
                    setShowTocDrawer(false);
                    playPageTurnSound();
                  }}
                  className={`text-left p-2 rounded-xl text-xs font-mono transition-all border ${
                    spreadIndex === item.spread
                      ? "bg-rose-900/40 text-rose-200 border-rose-700 font-bold shadow"
                      : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border-white/5"
                  }`}
                >
                  <div className="text-[10px] text-rose-400 uppercase">{item.machine}</div>
                  <div className="truncate font-sans font-medium">{item.title}</div>
                  <div className="text-[9px] text-white/50">Page {item.page}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* THE PHYSICAL BOOK CONTAINER (STRICT FIXED DIMENSIONS)                      */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-5xl mx-auto select-none">
          {/* Floating Outer Turn Arrows (Desktop) */}
          <button
            onClick={goToPrevSpread}
            disabled={spreadIndex === 0}
            className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95 cursor-pointer z-40"
            title="Turn backward"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNextSpread}
            disabled={spreadIndex === totalSpreads - 1}
            className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95 cursor-pointer z-40"
            title="Turn forward"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Silk Bookmark Ribbon hanging from top center */}
          <div className="absolute left-1/2 -top-3 -translate-x-1/2 w-4 sm:w-5 h-14 sm:h-16 bg-gradient-to-b from-rose-700 via-rose-600 to-rose-800 rounded-b shadow-lg z-30 pointer-events-none border-x border-rose-900/40">
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#070510] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
          </div>

          {/* Hardcover Outer Cosmic Leather Binding */}
          <div className="relative rounded-3xl border-4 border-[#2b1f3d] bg-gradient-to-r from-[#170e28] via-[#201538] to-[#170e28] p-2.5 sm:p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(244,63,94,0.15)]">
            {/* Dual Page Spread: EXACT FIXED HEIGHT ON ALL SPREADS */}
            <div
              className={`relative grid grid-cols-1 md:grid-cols-2 rounded-2xl bg-[#faf6ee] shadow-inner overflow-hidden transition-all duration-200 h-[640px] sm:h-[680px] md:h-[700px] min-h-[640px] md:min-h-[700px] max-h-[640px] md:max-h-[700px] ${
                isFlipping ? "scale-[0.998] opacity-95" : "scale-100 opacity-100"
              }`}
            >
              {/* Spine Crease / Center Gutter Shadow on Desktop */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-black/15 via-black/5 to-black/15 pointer-events-none z-20 shadow-inner" />

              {/* ----------------------------------------------------------------- */}
              {/* LEFT PAGE (PAGES: 1, 3, 5, 7, 9 ... 57)                           */}
              {/* ----------------------------------------------------------------- */}
              <div
                onClick={() => {
                  if (spreadIndex > 0) goToPrevSpread();
                }}
                className={`relative p-5 sm:p-6 md:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e3dac9] h-full cursor-pointer group overflow-hidden ${
                  mobilePage === "left" ? "flex" : "hidden md:flex"
                }`}
                title="Click to turn backward"
              >
                {/* Running Header */}
                <div className="flex items-center justify-between border-b border-[#e5dcce] pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8c7b70]">
                  <span>RoverVilla</span>
                  <span className="font-bold text-rose-900">{currentSpread.machineName}</span>
                </div>

                {/* Left Page Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-2.5 pr-1">
                  {/* Chapter / Machine Identifier */}
                  <div>
                    {currentSpread.chapterNumber !== null && (
                      <span className="font-mono text-xs uppercase tracking-widest text-rose-800 font-bold block mb-0.5">
                        {currentSpread.chapterNumber === 0 ? "Introduction" : `Chapter ${currentSpread.chapterNumber}`}
                      </span>
                    )}
                    <h2 className="display text-xl sm:text-2xl font-bold text-[#231815] leading-snug">
                      {currentSpread.leftPage.heading || currentSpread.spreadTitle}
                    </h2>
                    {currentSpread.leftPage.subheading && (
                      <p className="font-serif italic text-xs sm:text-sm text-[#736357] mt-0.5">
                        {currentSpread.leftPage.subheading}
                      </p>
                    )}
                  </div>

                  {/* Body Paragraphs or Custom Left Page Widgets */}
                  {currentSpread.id === "ingenuity-part-2" ? (
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.leftPage.paragraphs[0]}
                      </p>

                      {/* 3 Hardware Monuments Selector */}
                      <div className="rounded-xl border border-cyan-900/30 bg-[#edf5f7] p-2.5 shadow-sm text-[#1e2f33]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-cyan-950">
                            Hardware Monuments in Jezero
                          </span>
                          <span className="text-[9px] font-mono text-cyan-800 font-bold">
                            3 Sites Verified
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 mb-2">
                          {[
                            { id: "shield", label: "Debris Shield", sol: "Sol 30" },
                            { id: "blade", label: "Sheared Blade", sol: "Sol 1035" },
                            { id: "chassis", label: "Valinor Hills", sol: "Sol 1035+" },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setIngenuityHardwareId(item.id as typeof ingenuityHardwareId)}
                              className={`py-1 px-1 rounded font-mono text-[9px] font-bold cursor-pointer transition-colors text-center ${
                                ingenuityHardwareId === item.id
                                  ? "bg-cyan-900 text-white shadow"
                                  : "bg-[#d8e7ea] text-[#2c3e42] hover:bg-cyan-900 hover:text-white"
                              }`}
                            >
                              <span className="block truncate">{item.label}</span>
                              <span className="text-[8px] opacity-75">{item.sol}</span>
                            </button>
                          ))}
                        </div>

                        {ingenuityHardwareId === "shield" && (
                          <div className="text-[11px] font-serif leading-relaxed text-[#2c3e42] space-y-1">
                            <div className="flex justify-between font-mono text-[9px] text-cyan-900 font-bold">
                              <span>Coords: 18.4449° N, 77.4510° E</span>
                              <span>PIA24542</span>
                            </div>
                            <p>
                              Molded 0.81 m × 0.45 m graphite shell dropped to protect Ingenuity during Sky Crane landing. Rests upright 60 m east of Wright Brothers Field.
                            </p>
                            <a
                              href="https://photojournal.jpl.nasa.gov/catalog/PIA24542"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block font-mono text-[9px] text-cyan-900 font-bold hover:underline"
                            >
                              View JPL Photojournal PIA24542 ↗
                            </a>
                          </div>
                        )}

                        {ingenuityHardwareId === "blade" && (
                          <div className="text-[11px] font-serif leading-relaxed text-[#2c3e42] space-y-1">
                            <div className="flex justify-between font-mono text-[9px] text-cyan-900 font-bold">
                              <span>Coords: 18.4972° N, 77.3196° E</span>
                              <span>PIA26244</span>
                            </div>
                            <p>
                              A 15 cm outer blade tip severed during Flight 72 touchdown impact on a sand ripple, flung 15 m west of the chassis in Neretva Vallis.
                            </p>
                            <a
                              href="https://photojournal.jpl.nasa.gov/catalog/PIA26244"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block font-mono text-[9px] text-cyan-900 font-bold hover:underline"
                            >
                              View SuperCam RMI Close-up PIA26244 ↗
                            </a>
                          </div>
                        )}

                        {ingenuityHardwareId === "chassis" && (
                          <div className="text-[11px] font-serif leading-relaxed text-[#2c3e42] space-y-1">
                            <div className="flex justify-between font-mono text-[9px] text-cyan-900 font-bold">
                              <span>Coords: 18.4972° N, 77.3198° E</span>
                              <span>PIA26243</span>
                            </div>
                            <p>
                              Standing upright on all four titanium legs at Airfield Chi, elevation -2,320 m. Houses Snapdragon 801 CPU, Garmin LIDAR, and the 1903 Wright Flyer fabric swatch.
                            </p>
                            <a
                              href="https://photojournal.jpl.nasa.gov/catalog/PIA26243"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block font-mono text-[9px] text-cyan-900 font-bold hover:underline"
                            >
                              View Mastcam-Z Telephoto PIA26243 ↗
                            </a>
                          </div>
                        )}
                      </div>

                      {currentSpread.leftPage.calloutBox && (
                        <div className="rounded-xl border border-rose-900/20 bg-rose-950/5 p-2 text-[11px] text-[#4a3b32]">
                          <span className="font-bold text-rose-950 block text-[10px] uppercase mb-0.5">
                            {currentSpread.leftPage.calloutBox.title}
                          </span>
                          <p className="font-serif italic leading-relaxed text-[#5c4a3f]">
                            {currentSpread.leftPage.calloutBox.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 font-serif text-xs sm:text-sm leading-relaxed text-[#3b2d26]">
                        {currentSpread.leftPage.paragraphs.map((p, idx) => (
                          <p
                            key={idx}
                            className={
                              idx === 0
                                ? "first-letter:float-left first-letter:text-3xl first-letter:font-serif first-letter:mr-2 first-letter:font-bold first-letter:text-rose-900"
                                : ""
                            }
                          >
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Verified Telemetry Stamp Box */}
                      {currentSpread.telemetrySummary && (
                        <div className="rounded-xl border border-[#dcd1be] bg-[#f2ecde] p-2 text-[11px] font-mono text-[#4a3b32]">
                          <p className="text-[10px] uppercase font-bold text-rose-900 tracking-wider mb-1">
                            Verified Mission Telemetry
                          </p>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                            {currentSpread.telemetrySummary.map((item, idx) => (
                              <div key={idx}>
                                <span className="text-[#8c7b70] block text-[9px]">{item.label}</span>
                                <span className="font-bold text-[#231815] truncate block">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Callout Box */}
                      {currentSpread.leftPage.calloutBox && (
                        <div className="rounded-xl border border-rose-900/20 bg-rose-950/5 p-2 text-[11px] text-[#4a3b32]">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-rose-950">
                              {currentSpread.leftPage.calloutBox.title}
                            </span>
                            {currentSpread.leftPage.calloutBox.badge && (
                              <span className="bg-rose-900/10 text-rose-900 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                                {currentSpread.leftPage.calloutBox.badge}
                              </span>
                            )}
                          </div>
                          <p className="font-serif italic leading-relaxed text-[#5c4a3f]">
                            {currentSpread.leftPage.calloutBox.text}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Spread 0 Cover CTA */}
                  {spreadIndex === 0 && (
                    <div className="pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNextSpread();
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-900 px-4 py-2.5 font-mono text-xs font-bold text-white shadow-lg shadow-rose-950/30 transition-all hover:bg-rose-800 cursor-pointer"
                      >
                        Open Book &amp; Start Reading 📖 <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Left Page Footer (Page Number Even) */}
                <div className="border-t border-[#e5dcce] pt-1.5 flex justify-between items-center text-[10px] font-mono text-[#8c7b70]">
                  <span>Page {leftPageNumber}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ◂ Turn Previous
                  </span>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* RIGHT PAGE (PAGES: 2, 4, 6, 8, 10 ... 58)                          */}
              {/* ----------------------------------------------------------------- */}
              <div
                onClick={() => {
                  if (spreadIndex < totalSpreads - 1) goToNextSpread();
                }}
                className={`relative p-5 sm:p-6 md:p-7 flex flex-col justify-between h-full cursor-pointer group overflow-hidden ${
                  mobilePage === "right" ? "flex" : "hidden md:flex"
                }`}
                title="Click to turn forward"
              >
                {/* Running Header */}
                <div className="flex items-center justify-between border-b border-[#e5dcce] pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8c7b70]">
                  <span>{currentSpread.spreadTitle}</span>
                  <span>{currentSpread.cosparId || "Master Chronology"}</span>
                </div>

                {/* Right Page Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-2.5 pr-1">
                  {/* Right Page Header */}
                  <div>
                    <h3 className="display text-lg sm:text-xl font-bold text-[#231815]">
                      {currentSpread.rightPage.heading || currentSpread.spreadSubtitle}
                    </h3>
                    {currentSpread.rightPage.subheading && (
                      <p className="font-serif italic text-xs sm:text-sm text-[#736357] mt-0.5">
                        {currentSpread.rightPage.subheading}
                      </p>
                    )}
                  </div>

                  {/* SPREAD 0: MASTER TABLE OF CONTENTS */}
                  {spreadIndex === 0 ? (
                    <div className="space-y-1 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-rose-900 font-bold mb-1">
                        Select a chapter to jump directly:
                      </p>
                      <div className="space-y-1 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                        {TOC_ITEMS.slice(1).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSpreadIndex(item.spread);
                              setMobilePage("left");
                              playPageTurnSound();
                            }}
                            className="w-full text-left rounded-lg p-1.5 font-serif text-xs text-[#3b2d26] hover:bg-rose-900/10 hover:text-rose-900 transition-all flex items-center justify-between border border-transparent hover:border-rose-900/20 group cursor-pointer"
                          >
                            <span className="font-medium group-hover:translate-x-0.5 transition-transform truncate mr-2">
                              {item.title}
                            </span>
                            <span className="font-mono text-[10px] text-rose-800 font-bold shrink-0">
                              p. {item.page}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : currentSpread.id === "insight-part-1" ? (
                    /* DEDICATED SPREAD 22: INSIGHT PART I (STETHOSCOPE SOUNDBOARD) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.rightPage.paragraphs?.[0]}
                      </p>
                      <div className="rounded-xl border border-rose-900/30 bg-[#f4ede0] p-2.5 shadow-sm">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-rose-900">
                            🎧 Interactive Mars Stethoscope
                          </span>
                          <span className="text-[9px] font-mono text-[#8c7b70]">Real SEIS Audio</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => playInSightSound("wind")}
                            className={`rounded-lg p-1.5 text-left font-mono text-[10px] transition-all cursor-pointer border ${
                              insightActiveAudio === "wind"
                                ? "bg-cyan-700 text-white border-cyan-800 shadow"
                                : "bg-[#ded5c5] text-[#2c221e] hover:bg-cyan-900 hover:text-white border-transparent"
                            }`}
                          >
                            <span className="block font-bold">Sol 5 Wind</span>
                            <span className="text-[8px] opacity-80">10-15 mph</span>
                          </button>
                          <button
                            onClick={() => playInSightSound("bloop")}
                            className={`rounded-lg p-1.5 text-left font-mono text-[10px] transition-all cursor-pointer border ${
                              insightActiveAudio === "bloop"
                                ? "bg-amber-700 text-white border-amber-800 shadow"
                                : "bg-[#ded5c5] text-[#2c221e] hover:bg-amber-900 hover:text-white border-transparent"
                            }`}
                          >
                            <span className="block font-bold">Sol 988 Bloop</span>
                            <span className="text-[8px] opacity-80">Meteoroid</span>
                          </button>
                          <button
                            onClick={() => playInSightSound("quake")}
                            className={`rounded-lg p-1.5 text-left font-mono text-[10px] transition-all cursor-pointer border ${
                              insightActiveAudio === "quake"
                                ? "bg-rose-700 text-white border-rose-800 shadow"
                                : "bg-[#ded5c5] text-[#2c221e] hover:bg-rose-900 hover:text-white border-transparent"
                            }`}
                          >
                            <span className="block font-bold">Sol 1222 Quake</span>
                            <span className="text-[8px] opacity-80">Mag 4.7</span>
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#736357]">Filter:</span>
                          <button
                            onClick={() => setInsightGlitchFilter(!insightGlitchFilter)}
                            className="text-rose-900 font-bold hover:underline cursor-pointer"
                          >
                            {insightGlitchFilter ? "Glitch Filter: ON (0.05–1.0 Hz)" : "Raw Clicks: ACTIVE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.id === "insight-part-2" ? (
                    /* DEDICATED SPREAD 23: INSIGHT PART II (P-S WAVE TRIANGULATION & SAND HACK) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <div className="rounded-xl border border-rose-900/30 bg-[#f4ede0] p-2.5 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-rose-900">
                            📐 P-to-S Wave Triangulator
                          </span>
                          <span className="font-mono text-xs font-bold text-rose-950">
                            {calculatedQuakeDistanceKm} km ({calculatedQuakeDegrees}°)
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[9px] text-[#736357]">
                            <span>Delay Δt: <b>{insightDeltaT}s</b></span>
                            <span className="text-rose-900 font-bold">d = Δt × 9.35 km/s</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="600"
                            value={insightDeltaT}
                            onChange={(e) => setInsightDeltaT(parseInt(e.target.value, 10))}
                            className="w-full accent-rose-900 h-1.5 bg-[#ded5c5] rounded cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Saltation Bonus Button */}
                      <div className="rounded-xl border border-amber-900/30 bg-[#f6f0e4] p-2.5 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-amber-950">
                            Sol 884 Sand Hack:
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-900">
                            +{30 + insightSaltationBonus} Wh/sol
                          </span>
                        </div>
                        <button
                          onClick={handleSaltationTrick}
                          disabled={insightSaltationSparkle}
                          className="w-full rounded-lg bg-amber-900 hover:bg-amber-800 text-white font-mono text-xs py-1.5 font-bold transition-all shadow cursor-pointer disabled:opacity-60"
                        >
                          {insightSaltationSparkle ? "Trickling Sand Over Panel..." : "Tap to Pour Sand on Panel (+30 Wh)"}
                        </button>
                      </div>
                    </div>
                  ) : currentSpread.id === "insight-part-3" ? (
                    /* DEDICATED SPREAD 24: INSIGHT PART III (HARDWARE BLUEPRINTS) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <div className="rounded-xl border border-[#dcd1be] bg-[#f2ecde] p-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-rose-950">
                            Hardware Blueprint Inspector
                          </span>
                          <span className="text-[9px] font-mono text-emerald-800 font-bold">
                            LaRRI: FUNCTIONAL
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 mb-2">
                          {[
                            { id: "larri", label: "LaRRI" },
                            { id: "names", label: "2.4M Names" },
                            { id: "cpu", label: "RAD750" },
                            { id: "seis", label: "SEIS" },
                          ].map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setInsightBlueprintPart(b.id as typeof insightBlueprintPart)}
                              className={`py-1 rounded font-mono text-[9px] font-bold cursor-pointer transition-colors ${
                                insightBlueprintPart === b.id
                                  ? "bg-rose-900 text-white"
                                  : "bg-[#ded6c7] text-[#42342c] hover:bg-rose-900 hover:text-white"
                              }`}
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>
                        <div className="font-serif text-xs text-[#42342c] min-h-[60px] leading-relaxed">
                          {insightBlueprintPart === "larri" &&
                            "Eight quartz corner cubes from Italian Space Agency (ASI). 100% passive, requires zero Watts. Future orbiters can bounce laser pulses off it for centuries."}
                          {insightBlueprintPart === "names" &&
                            "Two 8mm silicon wafers carrying 2,429,807 human names, etched with an electron beam in letters smaller than 1/1000th the width of a human hair."}
                          {insightBlueprintPart === "cpu" &&
                            "BAE Systems RAD750 radiation-hardened 32-bit PowerPC running at 115.5 MHz on VxWorks, with 128 MB DRAM and 4 GB non-volatile flash memory."}
                          {insightBlueprintPart === "seis" &&
                            "Three inverted-pendulum leaf-spring sensors inside a titanium vacuum sphere evacuated to <10⁻⁵ mbar, measuring motion down to 2.5×10⁻¹⁰ meters."}
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.id === "ingenuity-part-1" ? (
                    /* DEDICATED SPREAD 26: INGENUITY PART I (ROTOR AERODYNAMICS & 84.6 HZ HUM) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.rightPage.paragraphs?.[0]}
                      </p>

                      {/* Interactive Aerodynamics Cockpit */}
                      <div className="rounded-xl border border-cyan-900/30 bg-[#edf5f7] p-2.5 shadow-sm text-[#1e2f33]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-cyan-950">
                            ⚙️ 1% Atmosphere Aerodynamics Lab
                          </span>
                          <span className={`font-mono text-xs font-bold ${ingenuityAero.canFly ? "text-emerald-800" : "text-rose-800"}`}>
                            {ingenuityAero.liftNewtons} N ({ingenuityAero.canFly ? "LIFT OFF" : "NO LIFT"})
                          </span>
                        </div>

                        {/* Real-time Thrust & Tip Mach Readouts */}
                        <div className="grid grid-cols-2 gap-1.5 my-1.5 font-mono text-[10px]">
                          <div className="bg-white/60 p-1.5 rounded border border-cyan-900/10">
                            <span className="text-[#62777c] block text-[9px]">Generated Lift</span>
                            <span className="font-bold text-[#142327] text-xs">{ingenuityAero.liftNewtons} N</span>
                            <span className="text-[9px] text-[#738589] block">Req: 6.70 N weight</span>
                          </div>
                          <div className="bg-white/60 p-1.5 rounded border border-cyan-900/10">
                            <span className="text-[#62777c] block text-[9px]">Blade Tip Speed</span>
                            <span className="font-bold text-[#142327] text-xs">Mach {ingenuityAero.tipMach}</span>
                            <span className="text-[9px] text-[#738589] block">{ingenuityAero.tipSpeedMs} m/s (Max &lt;0.70)</span>
                          </div>
                        </div>

                        {/* Dual Sliders: RPM & Density */}
                        <div className="space-y-1.5 font-mono text-[9px]">
                          <div>
                            <div className="flex justify-between text-[#4d6368]">
                              <span>Rotor Speed: <b>{ingenuityRpm} RPM</b></span>
                              <span>2,400–2,900 RPM</span>
                            </div>
                            <input
                              type="range"
                              min="2400"
                              max="2900"
                              step="25"
                              value={ingenuityRpm}
                              onChange={(e) => setIngenuityRpm(parseInt(e.target.value, 10))}
                              className="w-full accent-cyan-900 h-1.5 bg-[#d4e4e7] rounded cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[#4d6368]">
                              <span>Air Density (ρ): <b>{ingenuityDensity.toFixed(4)} kg/m³</b></span>
                              <span>Summer 0.0115 – Winter 0.017</span>
                            </div>
                            <input
                              type="range"
                              min="0.0115"
                              max="0.0170"
                              step="0.0005"
                              value={ingenuityDensity}
                              onChange={(e) => setIngenuityDensity(parseFloat(e.target.value))}
                              className="w-full accent-cyan-900 h-1.5 bg-[#d4e4e7] rounded cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* 84.6 Hz Blade Hum Audio Player */}
                        <div className="mt-2 pt-1.5 border-t border-cyan-900/15 flex items-center justify-between">
                          <button
                            onClick={playIngenuityHum}
                            disabled={ingenuityAudioPlaying}
                            className="rounded-lg bg-cyan-900 hover:bg-cyan-800 text-white font-mono text-[10px] py-1 px-2.5 font-bold transition-all shadow cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                          >
                            <span>{ingenuityAudioPlaying ? "🔊 Playing 84.6 Hz Hum..." : "🎧 Play 84.6 Hz Blade Hum"}</span>
                          </button>
                          <a
                            href="https://pds-imaging.jpl.nasa.gov/data/mars2020/mars2020_helicam/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[9px] text-cyan-900 font-bold hover:underline"
                          >
                            PDS helicam Archive ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.id === "ingenuity-part-2" ? (
                    /* DEDICATED SPREAD 27: INGENUITY PART II (20-YEAR TIME CAPSULE & PDS ENDPOINTS) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.rightPage.paragraphs?.[0]}
                      </p>

                      {/* 20-Year Time Capsule Terminal Plate */}
                      <div className="rounded-xl border border-cyan-900/30 bg-[#edf5f7] p-2.5 shadow-sm text-[#1e2f33]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-cyan-950">
                            Autonomous 20-Year Time Capsule
                          </span>
                          <span className="text-[9px] font-mono text-emerald-800 font-bold">
                            Active Daily Through ~2044
                          </span>
                        </div>
                        <p className="font-serif text-[11px] leading-relaxed text-[#2c3e42] mb-2">
                          Wakes every morning upon sunrise, checks battery voltage, logs daily temperatures, and stores a 13 MP Sony IMX214 photo into flash memory.
                        </p>

                        {/* Official Master Link Endpoints */}
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                          <a
                            href="https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MARS2020H"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 bg-[#dbe8eb] hover:bg-cyan-900 hover:text-white transition-colors text-cyan-950 font-bold truncate text-center"
                          >
                            NSSDCA MARS2020H ↗
                          </a>
                          <a
                            href="https://naif.jpl.nasa.gov/pub/naif/MARS2020/kernels/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 bg-[#dbe8eb] hover:bg-cyan-900 hover:text-white transition-colors text-cyan-950 font-bold truncate text-center"
                          >
                            NAIF SPICE 3D Trajectory ↗
                          </a>
                          <a
                            href="https://github.com/nasa/fprime"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 bg-[#dbe8eb] hover:bg-cyan-900 hover:text-white transition-colors text-cyan-950 font-bold truncate text-center"
                          >
                            NASA F&apos; Framework ↗
                          </a>
                          <a
                            href="https://an.rsl.wustl.edu/m20/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 bg-[#dbe8eb] hover:bg-cyan-900 hover:text-white transition-colors text-cyan-950 font-bold truncate text-center"
                          >
                            Analyst&apos;s Notebook ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.id === "mer-part-1" ? (
                    /* DEDICATED SPREAD 16: MER TWINS PART I (RAT GRINDING ACOUSTIC LAB & 4 HUMAN RELICS) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.rightPage.paragraphs?.[0]}
                      </p>

                      {/* Interactive RAT Grinding Sonifier */}
                      <div className="rounded-xl border border-amber-900/30 bg-[#fbf6ec] p-2.5 shadow-sm text-[#3b2d26]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-amber-950">
                            ⚙️ RAT Acoustic &amp; Motor Torque Lab
                          </span>
                          <span className="font-mono text-[9px] text-[#736357] font-bold">
                            Honeybee Robotics
                          </span>
                        </div>

                        {/* Rock selector */}
                        <div className="grid grid-cols-2 gap-1.5 my-1.5 font-mono text-[9px]">
                          <button
                            type="button"
                            onClick={() => setMerRockType("sulfate")}
                            className={`p-1.5 rounded border text-left cursor-pointer transition-colors ${
                              merRockType === "sulfate"
                                ? "border-amber-900 bg-amber-900/10 font-bold text-amber-950"
                                : "border-[#e0d6c5] bg-white/70 text-[#615248] hover:bg-white"
                            }`}
                          >
                            <span className="block font-bold">Sulfate Sandstone</span>
                            <span className="text-[8px] text-[#857467] block">Meridiani · Soft ~390 Hz</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMerRockType("basalt")}
                            className={`p-1.5 rounded border text-left cursor-pointer transition-colors ${
                              merRockType === "basalt"
                                ? "border-rose-900 bg-rose-900/10 font-bold text-rose-950"
                                : "border-[#e0d6c5] bg-white/70 text-[#615248] hover:bg-white"
                            }`}
                          >
                            <span className="block font-bold">Volcanic Basalt</span>
                            <span className="text-[8px] text-[#857467] block">Gusev · Hard ~195 Hz</span>
                          </button>
                        </div>

                        {/* Grinding Audio Button */}
                        <div className="flex items-center justify-between pt-1 border-t border-amber-900/10">
                          <button
                            type="button"
                            onClick={() => playMerRatGrinding(merRockType)}
                            disabled={merGrindingAudioPlaying}
                            className="rounded-lg bg-amber-900 hover:bg-amber-800 text-white font-mono text-[10px] py-1 px-2.5 font-bold transition-all shadow cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                          >
                            <span>{merGrindingAudioPlaying ? "🔊 Grinding Telemetry..." : `🎧 Sonify ${merRockType === "sulfate" ? "Sulfate" : "Basalt"} Grind`}</span>
                          </button>
                          <span className="font-mono text-[9px] text-[#857467]">
                            {merRockType === "sulfate" ? "Low torque / smooth tone" : "High torque / burr bite"}
                          </span>
                        </div>

                        {/* Relic Mini-Inspector */}
                        <div className="mt-2 pt-2 border-t border-amber-900/15">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[9px] uppercase font-bold text-amber-950">
                              Hidden Relics &amp; Memorials
                            </span>
                            <span className="font-mono text-[8px] text-[#857467]">4 Left on Mars</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 mb-1.5">
                            {[
                              { id: "wtc", label: "WTC Cuffs" },
                              { id: "memorials", label: "Plaques" },
                              { id: "marsdial", label: "MarsDial" },
                              { id: "lego", label: "LEGO DVDs" },
                            ].map((r) => (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => setMerRelicTab(r.id as typeof merRelicTab)}
                                className={`py-0.5 rounded font-mono text-[8px] font-bold cursor-pointer transition-colors ${
                                  merRelicTab === r.id
                                    ? "bg-amber-900 text-white"
                                    : "bg-[#ded6c7] text-[#42342c] hover:bg-amber-900/20"
                                }`}
                              >
                                {r.label}
                              </button>
                            ))}
                          </div>
                          <p className="font-serif text-[10px] text-[#42342c] min-h-[34px] leading-tight">
                            {merRelicTab === "wtc" &&
                              "WTC Ground Zero aluminum machined into cable-shield cuffs on both rovers' RATs with a laser-etched American flag."}
                            {merRelicTab === "memorials" &&
                              "Columbia Memorial Station (STS-107) in Gusev & Challenger Memorial Station (STS-51-L) in Eagle Crater honor fallen astronauts."}
                            {merRelicTab === "marsdial" &&
                              "MarsDial sundial engraved with 'TWO WORLDS, ONE SUN' in 22 languages and stick figures drawn by schoolchildren."}
                            {merRelicTab === "lego" &&
                              "3,553,268 names on silica-glass mini-DVDs clamped by LEGO minifigures 'Biff Starling' and 'Sandy Moondust'."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.id === "mer-part-2" ? (
                    /* DEDICATED SPREAD 17: MER TWINS PART II (SOL 5111 DUST STORM TAU SIMULATOR & BILLIE HOLIDAY UPLINK) */
                    <div className="space-y-2.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="font-serif text-xs leading-relaxed text-[#3b2d26]">
                        {currentSpread.rightPage.paragraphs?.[0]}
                      </p>

                      {/* Interactive Dust Storm Tau & Power Cockpit */}
                      <div className="rounded-xl border border-rose-900/30 bg-[#fcf6f4] p-2.5 shadow-sm text-[#3b2d26]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-rose-950">
                            🌪️ Dust Storm Opacity &amp; Power Simulator
                          </span>
                          <span className={`font-mono text-xs font-bold ${merDustTau >= 10 ? "text-rose-900" : merDustTau >= 5 ? "text-amber-800" : "text-emerald-800"}`}>
                            τ = {merDustTau.toFixed(1)} ({calculateDustImpact(merDustTau).powerWh} Wh)
                          </span>
                        </div>

                        {/* Real-time Telemetry Readout */}
                        <div className="grid grid-cols-2 gap-1.5 my-1.5 font-mono text-[10px]">
                          <div className="bg-white/80 p-1.5 rounded border border-rose-900/10">
                            <span className="text-[#736357] block text-[9px]">Solar Array Output</span>
                            <span className="font-bold text-rose-950 text-xs">{calculateDustImpact(merDustTau).powerWh} Watt-Hours</span>
                            <span className="text-[8px] text-[#8c7b70] block">Nominal: ~620 Wh · Min: 100 Wh</span>
                          </div>
                          <div className="bg-white/80 p-1.5 rounded border border-rose-900/10">
                            <span className="text-[#736357] block text-[9px]">Direct Sunlight Transmittance</span>
                            <span className="font-bold text-rose-950 text-xs">{calculateDustImpact(merDustTau).sunVisibilityPercent}%</span>
                            <span className="text-[8px] text-[#8c7b70] block">T = e^{`{-τ}`} (99.998% blocked at 10.8)</span>
                          </div>
                        </div>

                        {/* Tau Scrubber Slider */}
                        <div className="space-y-1 font-mono text-[9px]">
                          <div className="flex justify-between text-[#615248]">
                            <span>Optical Depth: <b>τ = {merDustTau.toFixed(1)}</b></span>
                            <span>Clear 0.5 → Blackout 10.8</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="10.8"
                            step="0.1"
                            value={merDustTau}
                            onChange={(e) => setMerDustTau(parseFloat(e.target.value))}
                            className="w-full accent-rose-900 h-1.5 bg-[#ecdcd6] rounded cursor-pointer"
                          />
                          <div className="flex justify-between text-[8px] text-[#8c7b70]">
                            <span>Clear Sky (620 Wh)</span>
                            <button
                              type="button"
                              onClick={() => setMerDustTau(10.8)}
                              className="text-rose-900 font-bold underline cursor-pointer"
                            >
                              Jump to Sol 5111 (22 Wh)
                            </button>
                          </div>
                        </div>

                        {/* Status Flags & Billie Holiday Uplink Button */}
                        <div className="mt-2 pt-1.5 border-t border-rose-900/15 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={playMerBillieHoliday}
                            disabled={merBillieHolidayPlaying}
                            className="rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-mono text-[10px] py-1 px-2.5 font-bold transition-all shadow cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                          >
                            <span>{merBillieHolidayPlaying ? "📡 Uplinking Jazz..." : "🎶 Play Final Song Uplink"}</span>
                          </button>
                          <span className="font-mono text-[9px] text-[#8c7b70] font-bold">
                            Billie Holiday · Feb 12, 2019
                          </span>
                        </div>

                        {/* Archival Links */}
                        <div className="mt-2 pt-1.5 border-t border-rose-900/15 grid grid-cols-2 gap-1 font-mono text-[9px]">
                          <a
                            href="https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 bg-[#f0e4df] hover:bg-rose-900 hover:text-white transition-colors text-rose-950 font-bold truncate text-center"
                          >
                            NSSDCA 2003-032A ↗
                          </a>
                          <a
                            href="https://www.uahirise.org/ESP_056955_1775"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 bg-[#f0e4df] hover:bg-rose-900 hover:text-white transition-colors text-rose-950 font-bold truncate text-center"
                          >
                            HiRISE ESP_056955_1775 ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : currentSpread.image ? (
                    /* General Machine Image Plate */
                    <div className="my-2 rounded-xl overflow-hidden border border-[#e5dcce] bg-[#efe9dc] p-1.5 shadow-sm">
                      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#ded6c7]">
                        <Image
                          src={assetUrl(currentSpread.image)}
                          alt={currentSpread.spreadTitle}
                          fill
                          sizes="(min-width:768px) 400px, 100vw"
                          className="object-cover"
                        />
                      </div>
                      {currentSpread.imageCaption && (
                        <p className="mt-1 text-[10px] font-mono text-[#736357] text-center italic">
                          {currentSpread.imageCaption}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Default Paragraphs */
                    <div className="space-y-2 font-serif text-xs sm:text-sm leading-relaxed text-[#3b2d26]">
                      {currentSpread.rightPage.paragraphs?.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Quote Plate */}
                  {currentSpread.rightPage.quote && (
                    <blockquote className="my-2 border-l-2 border-rose-900 pl-2.5 italic font-serif text-xs text-[#523d32] bg-[#f4ede0] py-1.5 rounded-r">
                      &ldquo;{currentSpread.rightPage.quote.text}&rdquo;
                      <span className="block mt-0.5 font-mono not-italic text-[9px] text-[#8c7b70]">
                        — {currentSpread.rightPage.quote.author}
                      </span>
                    </blockquote>
                  )}

                  {/* Core Takeaway */}
                  {currentSpread.rightPage.takeaway && (
                    <div className="mt-2 rounded-xl border border-[#dcd1be] bg-[#f0e8d8] p-2 text-xs font-mono text-[#42342c]">
                      <span className="font-bold text-rose-900 block mb-0.5">Core Discovery:</span>
                      {currentSpread.rightPage.takeaway}
                    </div>
                  )}

                  {/* Hero Profile Deep Link */}
                  {currentSpread.heroSlug && (
                    <div className="mt-2 pt-2 border-t border-[#e5dcce] flex items-center justify-between">
                      <Link
                        href={`/heroes/${currentSpread.heroSlug}`}
                        className="font-mono text-xs text-rose-900 hover:text-rose-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Inspect Full Telemetry Dossier ➔
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right Page Footer (Page Number Odd) */}
                <div className="border-t border-[#e5dcce] pt-1.5 flex justify-between items-center text-[10px] font-mono text-[#8c7b70]">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Turn Next ▸
                  </span>
                  <span>Page {rightPageNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Ribbon */}
        <div className="w-full max-w-5xl mt-3 flex items-center justify-between text-xs font-mono text-white/50">
          <button
            onClick={goToPrevSpread}
            disabled={spreadIndex === 0}
            className="inline-flex items-center gap-1 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous Spread
          </button>

          <span className="text-center text-[11px] text-white/40">
            {isFullscreen
              ? "Immersive Fullscreen Reading Mode · Press Esc or click Exit to return"
              : "Use Left / Right arrow keys or tap pages to flip · Fullscreen option available"}
          </span>

          <button
            onClick={goToNextSpread}
            disabled={spreadIndex === totalSpreads - 1}
            className="inline-flex items-center gap-1 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            Next Spread <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
