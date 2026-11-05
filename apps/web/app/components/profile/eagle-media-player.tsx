"use client";

import { useEffect, useRef, useState } from "react";
import type Amplitude from "amplitudejs";
import EagleVideoPlayer from "./eagle-video-player";
import type { EagleMedia } from "@/lib/eagle-media";
import { Play } from "@/app/components/icons";

function timeLabel(seconds: number) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

/** Amplitude manages the recording. All visible audio controls belong to the exhibit. */
export default function EagleMediaPlayer({ media, onPlay, compact = false, pauseSignal = 0 }: { media: EagleMedia; onPlay?: () => void; compact?: boolean; pauseSignal?: number }) {
  const video = media.kind === "video";
  const player = useRef<HTMLMediaElement | null>(null);
  const amplitude = useRef<typeof Amplitude | null>(null);
  const attempt = useRef(0);
  const lastVolume = useRef(70);
  const [ready, setReady] = useState(video);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const progress = duration > 0 ? Math.min(100, elapsed / duration * 100) : 0;

  useEffect(() => { player.current?.pause(); }, [pauseSignal]);

  useEffect(() => {
    if (video) return;
    let disposed = false;
    let cleanup = () => {};
    // The package constructs browser Audio objects, so import it only on the client.
    void import("amplitudejs").then(({ default: engine }) => {
      if (disposed) return;
      engine.getAudio().pause();
      engine.init({
        songs: [{ name: media.title, artist: media.credit, url: media.src }],
        preload: "none",
        continue_next: false,
        volume: 70,
      });
      const audio = engine.getAudio();
      amplitude.current = engine;
      player.current = audio;
      const play = () => { setPlaying(true); onPlay?.(); };
      const playing = () => setLoading(false);
      const pause = () => { setPlaying(false); setLoading(false); };
      const error = () => { setError(true); setPlaying(false); setLoading(false); };
      const time = () => {
        setElapsed(audio.currentTime);
        setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      };
      const volume = () => setVolume(Math.round(audio.volume * 100));
      const events = { play, playing, pause, ended: pause, error, timeupdate: time, loadedmetadata: time, durationchange: time, volumechange: volume };
      for (const [event, listener] of Object.entries(events)) audio.addEventListener(event, listener);
      const hide = () => { if (document.hidden) audio.pause(); };
      document.addEventListener("visibilitychange", hide);
      setReady(true);
      cleanup = () => {
        attempt.current += 1;
        for (const [event, listener] of Object.entries(events)) audio.removeEventListener(event, listener);
        document.removeEventListener("visibilitychange", hide);
        if (engine.getAudio() === audio) engine.stop();
        else audio.pause();
        audio.removeAttribute("src");
        audio.load();
        amplitude.current = null;
        player.current = null;
      };
    }).catch(() => { if (!disposed) setError(true); });
    return () => { disposed = true; cleanup(); };
  }, [video, media.src, media.title, media.credit, onPlay]);

  const start = async () => {
    if (!player.current) return;
    const started = ++attempt.current;
    setError(false);
    setLoading(true);
    onPlay?.();
    try { await player.current.play(); } catch {
      if (started !== attempt.current) return;
      setLoading(false);
      setPlaying(false);
      setError(true);
    }
  };
  const pause = () => {
    attempt.current += 1;
    if (!video && amplitude.current) amplitude.current.pause();
    else player.current?.pause();
    setPlaying(false);
    setLoading(false);
  };
  const stop = () => {
    attempt.current += 1;
    amplitude.current?.stop();
    setPlaying(false);
    setElapsed(0);
    setLoading(false);
  };
  const seek = (seconds: number) => {
    if (!amplitude.current || !player.current || !duration) return;
    const target = Math.max(0, Math.min(seconds, duration));
    if (target > 0 && target < duration) amplitude.current.setSongPlayedPercentage(target / duration * 100);
    else player.current.currentTime = target;
    setElapsed(target);
  };
  const changeVolume = (value: number) => {
    amplitude.current?.setVolume(value);
    setVolume(value);
    if (value > 0) lastVolume.current = value;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#100e20]" data-audio-state={loading ? "loading" : playing ? "playing" : "paused"}>
      {video ? (
        <EagleVideoPlayer key={media.src} src={media.src} title={media.title} onPlay={onPlay} pauseSignal={pauseSignal} />
      ) : (
        <div className="relative border-b border-white/10 bg-[radial-gradient(ellipse_at_50%_100%,#302044_0%,transparent_75%)] px-5 pt-5 sm:px-7">
          <div className="flex items-center justify-between gap-3">
            <span className="eagle-eyebrow text-[#c1b4ff]!">Mission audio / original recording</span>
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-white/60" role="status">
              <span className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-[#c1b4ff]" : "bg-white/35"}`} aria-hidden="true" />
              {loading ? "Loading" : playing ? "Playing" : elapsed > 0 ? "Paused" : "Ready"}
            </span>
          </div>
          <div className={`eagle-audio-art relative flex items-center justify-center gap-1.5 ${compact ? "h-20 sm:h-24" : "h-36 sm:h-44"}`} aria-hidden="true" data-playing={playing && !loading}>
            <span className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
            {Array.from({ length: 49 }, (_, i) => (
              <span key={i} style={{ height: `${10 + ((i * 37) % 55)}%`, animationDelay: `${i * -0.09}s` }} className="relative w-1 rounded-full bg-[#baaaff]/75 sm:w-1.5" />
            ))}
          </div>
        </div>
      )}

      <div className={compact ? "p-4 sm:p-5" : "p-5 sm:p-7"}>
        {video && <p className="eagle-eyebrow">Archival film</p>}
        <h3 className={compact ? "text-lg font-semibold" : "text-xl font-semibold sm:text-2xl"}>{media.title}</h3>
        {media.perspective && <p className="mt-1 font-mono text-[10px] text-[#c1b4ff]">{media.perspective}</p>}
        <p className="mt-2 text-sm leading-relaxed text-white/65">{media.description}</p>

        {!video && (
          <div className="mt-6">
            <input
              type="range" min={0} max={duration || 1} step={0.1} value={elapsed} disabled={!duration}
              onChange={event => seek(Number(event.target.value))}
              aria-label={`Seek within ${media.title}`} aria-valuetext={`${timeLabel(elapsed)} of ${duration ? timeLabel(duration) : "unknown duration"}`}
              className="eagle-audio-range w-full disabled:opacity-35"
              style={{ "--audio-progress": `${progress}%` } as React.CSSProperties}
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-white/65" aria-hidden="true">
              <span>{timeLabel(elapsed)}</span><span>{duration ? timeLabel(duration) : "—:—"}</span>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
          {!video && <button
            type="button" onClick={() => playing || loading ? pause() : void start()} disabled={!ready}
            aria-label={playing || loading ? "Pause recording" : "Start audio"}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#d9ceff] px-5 text-xs font-semibold text-[#171025] transition-colors hover:bg-white disabled:opacity-40"
          >
            {playing || loading ? <span aria-hidden="true" className="font-mono text-lg">Ⅱ</span> : <Play className="h-4 w-4" />}
            {!ready ? error ? "Audio unavailable" : "Preparing audio…" : playing || loading ? "Pause" : elapsed > 0 ? "Resume audio" : "Start audio"}
          </button>}
          {!video && <button type="button" onClick={stop} disabled={!playing && !loading && !elapsed} className="eagle-utility min-h-12! disabled:opacity-35"><span aria-hidden="true" className="text-[10px]">■</span>Stop</button>}
          {!video && (
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={() => changeVolume(volume === 0 ? lastVolume.current : 0)} aria-label={volume === 0 ? "Unmute recording" : "Mute recording"} aria-pressed={volume === 0} className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:bg-white/5 hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" />{volume === 0 ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M15 9c2 1.5 2 4.5 0 6m3-9c4 3 4 9 0 12" />}</svg>
              </button>
              <input type="range" min={0} max={100} value={volume} onChange={event => changeVolume(Number(event.target.value))} aria-label="Recording volume" aria-valuetext={`${volume} percent`} className="eagle-audio-range w-16 sm:w-20" style={{ "--audio-progress": `${volume}%` } as React.CSSProperties} />
            </div>
          )}
        </div>

        {error && <p role="status" className="mt-4 text-sm leading-relaxed text-amber-200">This recording couldn’t load. {ready && "Try Start again, or "}open the archive source below.</p>}
        {media.transcript && <details className="mt-4 rounded-lg border border-white/10 px-3 text-xs text-white/65"><summary className="cursor-pointer py-3">Words to listen for · transcript highlights</summary><div className="space-y-3 pb-3">{media.transcript.map(line => <blockquote key={line.get}><p className="font-mono text-[10px] text-[#c1b4ff]">{line.get} GET · {line.who}</p><p className="mt-1 leading-relaxed text-white/85">“{line.text}”</p></blockquote>)}</div></details>}
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3 border-t border-white/10 pt-4">
          <p className="max-w-[34ch] font-mono text-[10px] leading-relaxed text-white/55">{media.credit}</p>
          <a href={media.source} target="_blank" rel="noopener noreferrer" className="py-2 text-xs text-[#c1b4ff] underline underline-offset-4">Transcript &amp; source ↗</a>
        </div>
      </div>
    </div>
  );
}
