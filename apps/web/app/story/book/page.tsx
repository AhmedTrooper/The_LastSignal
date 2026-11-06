"use client";

import { Suspense, useState, useEffect, useCallback, useRef, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BookIcon } from "@/app/components/icons";
import { SignalMark } from "@/app/components/logo";
import { useEagleFullscreen } from "@/app/components/profile/use-eagle-fullscreen";
import BookCover from "@/app/components/story/book-cover";
import BookContents from "@/app/components/story/book-contents";
import ComicPage from "@/app/components/story/comic-page";
import { BOOKMARK_KEY, readBookPosition, turnBookPage, chapterTitle } from "@/lib/book-reader";
import { assetUrl, getHero } from "@/lib/heroes";
import { photo } from "@/lib/photos";
import { BOOK_SPREADS as SPREADS } from "@/lib/book-spreads";
import { calculateIngenuityAerodynamics } from "@/lib/ingenuity-mission";
import { calculateDustImpact } from "@/lib/mer-mission";
import { machineBookUrl } from "@/lib/machine-books";

import { TOC_ITEMS } from "@thelastsignal/data";
import "./book.css";
export default function StoryBookPage() {
  return <Suspense fallback={<main className="storybook-reader min-h-dvh p-8">Opening the book…</main>}><BookRoute /></Suspense>;
}

function BookRoute() {
  const query = useSearchParams();
  if (query.get("machine") === "apollo-11-lander") {
    const format = query.get("format");
    return <EagleBookRedirect href={machineBookUrl("apollo-11-lander", query.get("chapter") ?? undefined, format === "book" || format === "comic" ? format : undefined)} />;
  }
  return <LegacyStoryBookReader />;
}

function EagleBookRedirect({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => { router.replace(href); }, [href, router]);
  return <main className="storybook-reader min-h-dvh p-8" aria-busy="true">Opening Eagle’s event chapters…</main>;
}

function LegacyStoryBookReader() {
  const [spreadIndex, setSpreadIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [mobilePage, setMobilePage] = useState<"left" | "right">("left");
  const [showTocDrawer, setShowTocDrawer] = useState<boolean>(false);
  const { ref: reader, fullscreen: isFullscreen, toggle: toggleFullscreen } = useEagleFullscreen();
  const reduced = useReducedMotion();
  const [singlePage, setSinglePage] = useState(false);
  const [restored, setRestored] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [pageSound, setPageSound] = useState(false);
  const [readingMode, setReadingMode] = useState<"comic" | "notes">("comic");
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const position = useRef({ spread: 0, side: "left" as "left" | "right" });
  const audioContexts = useRef<Set<AudioContext>>(new Set());
  const content = useRef<HTMLDivElement>(null);
  const focusAfterTurn = useRef(false);

  useEffect(() => {
    const contexts = audioContexts.current;
    const query = window.matchMedia("(max-width: 767px)");
    const resize = () => setSinglePage(query.matches);
    resize(); query.addEventListener("change", resize);
    let saved = { spread: 0, side: "left" as "left" | "right" };
    try { saved = readBookPosition(localStorage.getItem(BOOKMARK_KEY), SPREADS.length); } catch { /* Optional bookmark. */ }
    const machine = new URLSearchParams(window.location.search).get("machine");
    const chapter = machine ? SPREADS.findIndex(spread => spread.heroSlug === machine) : -1;
    if (chapter >= 0) saved = { spread: chapter, side: "left" };
    position.current = saved;
    const frame = requestAnimationFrame(() => { setSpreadIndex(saved.spread); setMobilePage(saved.side); setRestored(true); });
    return () => { cancelAnimationFrame(frame); query.removeEventListener("change", resize); if (flipTimer.current) clearTimeout(flipTimer.current); contexts.forEach(ctx => { void ctx.close().catch(() => {}); }); };
  }, []);

  useEffect(() => {
    if (!restored) return;
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify({ spread: spreadIndex, side: mobilePage })); } catch { /* Reading works without persistence. */ }
    if (focusAfterTurn.current) {
      const page = content.current?.querySelector<HTMLElement>(`.book-page-${mobilePage} [data-book-heading]`);
      page?.focus({ preventScroll: true });
      reader.current?.scrollTo({ top: 0, behavior: "instant" });
      if (!isFullscreen) window.scrollTo({ top: 0, behavior: "instant" });
      focusAfterTurn.current = false;
    }
  }, [spreadIndex, mobilePage, restored, isFullscreen, reader]);

  const makeAudio = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    audioContexts.current.add(ctx);
    return ctx;
  }, []);

  const closeAudio = useCallback((ctx: AudioContext, seconds: number) => {
    setTimeout(() => { audioContexts.current.delete(ctx); void ctx.close().catch(() => {}); }, seconds * 1000 + 150);
  }, []);
  const stopAudio = useCallback(() => {
    audioContexts.current.forEach(ctx => { void ctx.close().catch(() => {}); });
    audioContexts.current.clear();
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
      const ctx = makeAudio();
      if (!ctx) return;
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
      closeAudio(ctx, 2.25);
      setIngenuityAudioPlaying(true);
      setTimeout(() => setIngenuityAudioPlaying(false), 2200);
    } catch {
      // AudioContext unavailable
    }
  }, [ingenuityRpm, makeAudio, closeAudio]);

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
      const ctx = makeAudio();
      if (!ctx) return;
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
      closeAudio(ctx, duration);

      setMerGrindingAudioPlaying(true);
      setTimeout(() => setMerGrindingAudioPlaying(false), duration * 1000);
    } catch {
      // AudioContext unavailable
    }
  }, [makeAudio, closeAudio]);

  // Synthesize Billie Holiday "I'll Be Seeing You" opening motif for Opportunity
  const playMerBillieHoliday = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = makeAudio();
      if (!ctx) return;

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
      closeAudio(ctx, startTime - ctx.currentTime);
      setTimeout(() => setMerBillieHolidayPlaying(false), (startTime - ctx.currentTime) * 1000 + 100);
    } catch {
      // AudioContext unavailable
    }
  }, [makeAudio, closeAudio]);

  const totalSpreads = SPREADS.length;
  const currentSpread = SPREADS[spreadIndex];
  const machine = currentSpread.heroSlug ? getHero(currentSpread.heroSlug) : undefined;
  const imagePlate = machine?.gallery[0] ? photo(machine.gallery[0]) : undefined;

  // Calculated distance for P-to-S wave triangulation
  const calculatedQuakeDistanceKm = Math.round(insightDeltaT * 9.35);
  const calculatedQuakeDegrees = (calculatedQuakeDistanceKm / 59.2).toFixed(1);

  // Synthesize realistic sound effects via Web Audio API
  const playPageTurnSound = useCallback(() => {
    if (!pageSound) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = makeAudio();
      if (!ctx) return;
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
      closeAudio(ctx, 0.13);
    } catch {
      // AudioContext not allowed or unsupported
    }
  }, [pageSound, makeAudio, closeAudio]);

  const playInSightSound = (type: "wind" | "bloop" | "quake") => {
    setInsightActiveAudio(type);
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = makeAudio();
      if (!ctx) return;
      closeAudio(ctx, 2.1);

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

  const turn = useCallback((direction: -1 | 1) => {
    const next = turnBookPage(position.current, direction, singlePage, totalSpreads);
    position.current = next;
    setSpreadIndex(next.spread); setMobilePage(next.side);
    focusAfterTurn.current = true;
    stopAudio();
    playPageTurnSound();
    if (flipTimer.current) clearTimeout(flipTimer.current);
    setIsFlipping(!reduced);
    flipTimer.current = setTimeout(() => setIsFlipping(false), reduced ? 0 : 180);
  }, [singlePage, totalSpreads, playPageTurnSound, reduced, stopAudio]);
  const goToNextSpread = useCallback(() => turn(1), [turn]);
  const goToPrevSpread = useCallback(() => turn(-1), [turn]);
  const jump = (spread: number) => {
    stopAudio();
    position.current = { spread, side: "left" };
    setSpreadIndex(spread); setMobilePage("left"); setShowTocDrawer(false);
    focusAfterTurn.current = true;
    playPageTurnSound();
  };

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (showTocDrawer || target.closest('input, textarea, select, [contenteditable="true"], [role="slider"], [role="tablist"]')) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goToNextSpread();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevSpread();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSpread, goToPrevSpread, showTocDrawer]);

  const leftPageNumber = spreadIndex * 2 + 1;
  const rightPageNumber = spreadIndex * 2 + 2;
  const totalPages = totalSpreads * 2;
  const chapter = [...TOC_ITEMS].reverse().find(item => item.spread <= spreadIndex)!;
  const atBeginning = spreadIndex === 0 && (!singlePage || mobilePage === "left");
  const atEnd = spreadIndex === totalSpreads - 1 && (!singlePage || mobilePage === "right");

  return (
    <div ref={reader} className={`storybook-reader min-h-dvh ${isFullscreen ? "book-reader-fullscreen" : ""}`} style={{ "--book-font-scale": fontScale } as CSSProperties}>
      <header className="book-reader-header">
        <Link href="/story" className="flex items-center gap-3"><SignalMark className="h-7 w-7 text-[#bcad8b]" /><span className="font-mono text-[10px] uppercase tracking-[0.2em]">RoverVilla<span className="mt-1 block text-[9px] tracking-[0.12em] text-white/45">A comic of forgotten explorers</span></span></Link>
        <div className="flex items-center gap-2"><button type="button" onClick={() => setShowTocDrawer(true)} className="book-reader-button"><BookIcon className="h-4 w-4" /><span>Chapters</span></button><button type="button" data-fullscreen-toggle onClick={toggleFullscreen} aria-pressed={isFullscreen} className="book-reader-button">{isFullscreen ? "Exit focus" : "Focus mode"}</button></div>
      </header>

      {/* Main Reading Stage */}
      <main className="book-reading-stage">
        {/* Top Control Bar (Jump, Chapter Indicator, Mobile Switcher, Fullscreen Toggle) */}
        <div className="book-reading-toolbar">
          <div><p className="book-kicker text-[#b8a989]!">{currentSpread.chapterNumber ? `Chapter ${currentSpread.chapterNumber}` : currentSpread.machineName}</p><h1 className="mt-1 text-sm font-medium text-[#e7dfd0]">{spreadIndex === 0 ? "Monuments in the Dust" : chapterTitle(chapter.title)}</h1></div>
          <div className="flex flex-wrap items-center gap-2"><div role="group" aria-label="Reading format" className="flex items-center rounded-lg border border-white/12"><button type="button" aria-pressed={readingMode === "comic"} onClick={() => setReadingMode("comic")} className={`book-reader-button border-0! ${readingMode === "comic" ? "bg-white/10!" : ""}`}>Comic</button><button type="button" aria-pressed={readingMode === "notes"} onClick={() => setReadingMode("notes")} className={`book-reader-button border-0! ${readingMode === "notes" ? "bg-white/10!" : ""}`}>Field notes</button></div><div role="group" aria-label="Reading text size" className="flex items-center rounded-lg border border-white/12"><button type="button" aria-label="Decrease text size" disabled={fontScale <= 1} onClick={() => setFontScale(value => Math.max(1, value - 0.1))} className="book-reader-button border-0! disabled:opacity-30">A−</button><button type="button" aria-label="Increase text size" disabled={fontScale >= 1.3} onClick={() => setFontScale(value => Math.min(1.3, value + 0.1))} className="book-reader-button border-0! disabled:opacity-30">A+</button></div><button type="button" onClick={() => setPageSound(value => !value)} aria-pressed={pageSound} className="book-reader-button">Sound {pageSound ? "on" : "off"}</button></div>
        </div>

        {/* Quick Drawer: Table of Contents */}
        {showTocDrawer && <BookContents current={chapter.spread} onSelect={jump} onClose={() => setShowTocDrawer(false)} />}

        {/* ========================================================================= */}
        {/* The book keeps a page-shaped minimum, but grows with its content. */}
        {/* ========================================================================= */}
        <div ref={content} className="book-binding relative w-full mx-auto" aria-label="Open storybook">
          {/* Floating Outer Turn Arrows (Desktop) */}
          <button
            onClick={goToPrevSpread}
            disabled={atBeginning}
            className="book-outer-arrow book-outer-arrow-left"
            aria-label="Previous pages"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNextSpread}
            disabled={atEnd}
            className="book-outer-arrow book-outer-arrow-right"
            aria-label="Next pages"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Silk Bookmark Ribbon hanging from top center */}
          <div className="book-ribbon" aria-hidden="true" />

          {/* Hardcover Outer Cosmic Leather Binding */}
          <div className="book-hardcover">
            {/* Two pages on desktop, sequential single pages on narrow screens. */}
            <div
              className={`book-paper-spread ${isFlipping ? "book-turning" : ""}`}
            >
              {/* Spine Crease / Center Gutter Shadow on Desktop */}
              <div className="book-gutter" aria-hidden="true" />

              {/* ----------------------------------------------------------------- */}
              {/* LEFT PAGE (PAGES: 1, 3, 5, 7, 9 ... 57)                           */}
              {/* ----------------------------------------------------------------- */}
              <div
                className={`book-paper-page book-page-left ${spreadIndex === 0 ? "book-cover-page" : readingMode === "comic" ? "book-comic-paper" : ""} ${
                  mobilePage === "left" ? "flex" : "hidden md:flex"
                }`}
              >
                {spreadIndex === 0 ? <BookCover onOpen={() => jump(1)} /> : readingMode === "comic" ? <ComicPage spread={currentSpread} side="left" page={leftPageNumber} onNotes={() => setReadingMode("notes")} /> : <>
                {/* Running Header */}
                <div className="flex items-center justify-between border-b border-[#e5dcce] pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8c7b70]">
                  <span>RoverVilla</span>
                  <span className="font-bold text-rose-900">{currentSpread.machineName}</span>
                </div>

                {/* Readable page content: no hidden inner scrolling. */}
                <div className="book-page-content">
                  {/* Chapter / Machine Identifier */}
                  <div>
                    {currentSpread.chapterNumber !== null && (
                      <span className="font-mono text-xs uppercase tracking-widest text-rose-800 font-bold block mb-0.5">
                        {currentSpread.chapterNumber === 0 ? "Introduction" : `Chapter ${currentSpread.chapterNumber}`}
                      </span>
                    )}
                    <h2 data-book-heading tabIndex={-1} className="book-page-heading outline-none">
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
                        <details className="rounded-xl border border-[#dcd1be] bg-[#f2ecde] p-3 text-[11px] font-mono text-[#4a3b32]">
                          <summary className="cursor-pointer py-1 text-[10px] uppercase font-bold text-rose-900 tracking-wider">Inspect the mission record</summary>
                          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                            {currentSpread.telemetrySummary.map((item, idx) => (
                              <div key={idx}>
                                <span className="text-[#8c7b70] block text-[9px]">{item.label}</span>
                                <span className="font-bold text-[#231815] break-words block">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </details>
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

                </div>

                {/* Left Page Footer (Page Number Even) */}
                <div className="border-t border-[#e5dcce] pt-1.5 flex justify-between items-center text-[10px] font-mono text-[#8c7b70]">
                  <span>Page {leftPageNumber}</span>
                  <span>RoverVilla field notes</span>
                </div>
                </>}
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* RIGHT PAGE (PAGES: 2, 4, 6, 8, 10 ... 58)                          */}
              {/* ----------------------------------------------------------------- */}
              <div
                className={`book-paper-page book-page-right ${readingMode === "comic" && spreadIndex > 0 ? "book-comic-paper" : ""} ${
                  mobilePage === "right" ? "flex" : "hidden md:flex"
                }`}
              >
                {readingMode === "comic" && spreadIndex > 0 ? <ComicPage spread={currentSpread} side="right" page={rightPageNumber} onNotes={() => setReadingMode("notes")} /> : <>
                {/* Running Header */}
                <div className="flex items-center justify-between border-b border-[#e5dcce] pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8c7b70]">
                  <span>{spreadIndex === 0 ? "RoverVilla" : currentSpread.machineName}</span>
                  <span>{currentSpread.cosparId || "Master Chronology"}</span>
                </div>

                {/* Right Page Scrollable Content */}
                <div className="book-page-content">
                  {/* Right Page Header */}
                  <div>
                    <h3 data-book-heading tabIndex={-1} className="book-page-heading outline-none">
                      {spreadIndex === 0 ? "A world on every page." : currentSpread.rightPage.heading || currentSpread.spreadSubtitle}
                    </h3>
                    {currentSpread.rightPage.subheading && (
                      <p className="font-serif italic text-xs sm:text-sm text-[#736357] mt-0.5">
                        {spreadIndex === 0 ? "A collection of machines, memories, and discoveries." : currentSpread.rightPage.subheading}
                      </p>
                    )}
                  </div>

                  {/* SPREAD 0: MASTER TABLE OF CONTENTS */}
                  {spreadIndex === 0 ? (
                    <div className="space-y-1 my-1" onClick={(e) => e.stopPropagation()}>
                      <p className="mb-4 font-serif text-sm leading-relaxed text-[#746857]">Meet the machines, follow their journeys, and discover what their hardware made possible. Start at the beginning, or choose a story.</p>
                      <div className="book-cover-contents">
                        {TOC_ITEMS.slice(1).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              jump(item.spread);
                            }}
                            className="book-cover-chapter"
                          >
                            <span className="font-medium group-hover:translate-x-0.5 transition-transform truncate mr-2">
                              {item.machine}
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
                          src={imagePlate?.src ?? assetUrl(currentSpread.image)}
                          alt={imagePlate?.alt ?? currentSpread.spreadTitle}
                          fill
                          sizes="(min-width:768px) 400px, 100vw"
                          className="object-cover"
                        />
                        {(!imagePlate || imagePlate.ai) && <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 font-mono text-[9px] text-white">AI-generated placeholder</span>}
                      </div>
                      {(imagePlate || currentSpread.imageCaption) && (
                        <p className="mt-1 text-[10px] font-mono text-[#736357] text-center italic">
                          {imagePlate ? <a href={imagePlate.source} target="_blank" rel="noopener noreferrer" className="hover:underline">{imagePlate.title} · {imagePlate.credit} ↗</a> : currentSpread.imageCaption}
                        </p>
                      )}
                      {currentSpread.rightPage.paragraphs?.map(paragraph => <p key={paragraph} className="mt-4 font-serif text-[#3b2d26]">{paragraph}</p>)}
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
                  {spreadIndex !== 0 && currentSpread.rightPage.takeaway && (
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
                        Meet {currentSpread.machineName} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right Page Footer (Page Number Odd) */}
                <div className="border-t border-[#e5dcce] pt-1.5 flex justify-between items-center text-[10px] font-mono text-[#8c7b70]">
                  <span>{spreadIndex === 0 ? `${SPREADS.filter(spread => spread.chapterNumber && spread.id.endsWith("part-1")).length} chapters to explore` : "Their mission ended. Their story didn’t."}</span>
                  <span>Page {rightPageNumber}</span>
                </div>
                </>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Ribbon */}
        <nav aria-label="Book pages" className="book-bottom-navigation">
          <button
            onClick={goToPrevSpread}
            disabled={atBeginning}
            className="book-reader-button"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="min-w-0 flex-1 text-center"><span role="status" className="font-mono text-[10px] text-[#d0c5b1]">{singlePage ? `Page ${mobilePage === "left" ? leftPageNumber : rightPageNumber}` : `Pages ${leftPageNumber}–${rightPageNumber}`} <span className="text-white/35">/ {totalPages}</span></span><div className="mx-auto mt-2 h-0.5 max-w-48 overflow-hidden rounded bg-white/10" aria-hidden="true"><div className="h-full bg-[#b9a67b] transition-[width] duration-200" style={{ width: `${(singlePage ? mobilePage === "left" ? leftPageNumber : rightPageNumber : rightPageNumber) / totalPages * 100}%` }} /></div></div>

          <button
            onClick={goToNextSpread}
            disabled={atEnd}
            className="book-reader-button book-reader-button-primary"
          >
            <span>Next</span> <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </nav>
        <p className="book-reading-note">Original SVG comic art and imagined machine voices, inspired by mission history—not original transmissions. Your place is saved on this device. Illustrative sounds are synthesized.</p>
      </main>
    </div>
  );
}
