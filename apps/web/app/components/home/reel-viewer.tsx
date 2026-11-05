"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import "@videojs/react/video/skin.css";
import { HOME_REELS, reelPoster, reelUrl, type HomeReel } from "@/lib/home-reels";
import { ArrowLeft, ArrowRight, Close } from "@/app/components/icons";

function ReelPlayback({ reel }: { reel: HomeReel }) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = video.current;
    const hide = () => { if (document.hidden) element?.pause(); };
    document.addEventListener("visibilitychange", hide);
    return () => { element?.pause(); document.removeEventListener("visibilitychange", hide); };
  }, []);
  return <><VideoPlayer poster={reelPoster(reel)}><VideoSkin className="rv-reel-video" style={{ "--media-accent-color": "#ffab48", "--media-accent-text-color": "#17203a", "--media-border-radius": "12px", "--media-object-fit": "contain", "--media-font-family": "var(--font-sans)" } as CSSProperties}><Video ref={video} src={reelUrl(reel)} playsInline preload="metadata" aria-label={reel.title} onError={() => setError(true)} onPlaying={() => setError(false)} /></VideoSkin></VideoPlayer>{error && <p role="status" className="mt-3 text-xs leading-relaxed text-amber-200">This reel couldn’t load. <a href={reelUrl(reel)} target="_blank" rel="noopener noreferrer" className="underline">Try the original video ↗</a></p>}</>;
}

export default function ReelViewer({ initialIndex, onClose }: { initialIndex: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const reel = HOME_REELS[index];
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal(); document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  return (
    <dialog ref={dialog} aria-labelledby="reel-title" className="rv-reel-dialog" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="rv-reel-dialog-inner">
        <div className="flex items-center justify-between gap-3"><span className="font-mono text-[9px] uppercase tracking-widest text-[#f4ca93]">RoverVilla / Little space stories</span><button autoFocus type="button" onClick={onClose} aria-label="Close reel" className="rv-reel-close"><Close className="h-4 w-4" /></button></div>
        <div className="mt-3"><ReelPlayback key={reel.id} reel={reel} /></div>
        <div className="mt-4 flex items-start justify-between gap-4"><div><h2 id="reel-title" className="text-lg font-bold leading-snug">{reel.title}</h2><p className="mt-2 text-[10px] leading-relaxed text-white/55">Animated storytelling with imagined dialogue—not original NASA footage or a mission transmission.</p></div><span className="shrink-0 font-mono text-[10px] text-white/50">{index + 1} / {HOME_REELS.length}</span></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button type="button" aria-label="Previous reel" disabled={index === 0} onClick={() => setIndex(i => i - 1)} className="rv-reel-arrow"><ArrowLeft className="h-4 w-4" /></button><button type="button" aria-label="Next reel" disabled={index === HOME_REELS.length - 1} onClick={() => setIndex(i => i + 1)} className="rv-reel-arrow"><ArrowRight className="h-4 w-4" /></button></div><Link href={reel.href} onClick={onClose} className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#ffc986]">Continue the adventure <ArrowRight className="h-3.5 w-3.5" /></Link></div>
      </div>
    </dialog>
  );
}
