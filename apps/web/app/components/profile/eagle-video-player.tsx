"use client";

import type { CSSProperties } from "react";
import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import "@videojs/react/video/skin.css";

/** Packaged Video.js skin, themed to belong to the Eagle exhibit. */
export default function EagleVideoPlayer({ src, title, onPlay }: { src: string; title: string; onPlay?: () => void }) {
  return (
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
        <Video src={src} aria-label={title} playsInline preload="metadata" onPlay={onPlay} />
      </VideoSkin>
    </VideoPlayer>
  );
}
