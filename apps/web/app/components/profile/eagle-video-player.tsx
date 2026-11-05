"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import "@videojs/react/video/skin.css";

/** Packaged Video.js skin, themed to belong to the Eagle exhibit. */
export default function EagleVideoPlayer({ src, title, onPlay, pauseSignal = 0 }: { src: string; title: string; onPlay?: () => void; pauseSignal?: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState(false);
  useEffect(() => { video.current?.pause(); }, [pauseSignal]);
  useEffect(() => {
    const hide = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  const watch = async () => {
    setPlayError(false);
    try { await video.current?.play(); } catch { setPlayError(true); }
  };
  return (
    <div>
    <VideoPlayer>
      <VideoSkin
        className="eagle-video-player"
        style={
          {
            "--media-accent-color": "#d9ceff",
            "--media-accent-text-color": "#171025",
            "--media-border-color": "transparent",
            "--media-border-radius": "0",
            "--media-font-family": "var(--font-sans)",
            "--media-object-fit": "contain",
            "--media-object-position": "50% 50%",
            "--media-scale-unit": "16px",
          } as CSSProperties
        }
      >
        <Video ref={video} src={src} aria-label={title} playsInline preload="metadata" onPlay={() => { setPlaying(true); setPlayError(false); onPlay?.(); }} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      </VideoSkin>
    </VideoPlayer>
    <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
      <button type="button" onClick={() => void watch()} disabled={playing} className="eagle-utility disabled:opacity-40">Watch film</button>
      <button type="button" onClick={() => video.current?.pause()} disabled={!playing} className="eagle-utility disabled:opacity-40">Pause</button>
      <span className="ml-auto font-mono text-[9px] text-white/50">ORIGINAL MISSION FILM</span>
    </div>
    {playError && <p role="status" className="px-4 py-3 text-xs text-amber-200">Playback couldn’t start. Try Watch film again, or open the original source below.</p>}
    </div>
  );
}
