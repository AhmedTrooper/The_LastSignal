import { assetUrl } from "./heroes";

export type HomeReel = { id: string; file: string; title: string; duration: string; tag: string; href: string };

/** The user's uploaded reels. Filenames match the public R2 reels/ objects exactly. */
export const HOME_REELS: HomeReel[] = [
  { id: "oppy-tour", file: "Oppy's tour of Rovervilla.mp4", title: "Oppy’s tour of RoverVilla", duration: "1:26", tag: "Meet your host", href: "/heroes" },
  { id: "why-mars", file: "Why did you go to Mars_.mp4", title: "Why did you go to Mars?", duration: "1:06", tag: "A big question", href: "/story" },
  { id: "spirit-wheel", file: "Spirit's lucky broken wheel.mp4", title: "Spirit’s lucky broken wheel", duration: "1:02", tag: "A surprising discovery", href: "/heroes/spirit/story" },
  { id: "oppy-signal", file: "Oppy's last signal.mp4", title: "Oppy’s last signal", duration: "1:04", tag: "A memory from Mars", href: "/heroes/opportunity/story" },
  { id: "seven-minutes", file: "Seven minutes of terror.mp4", title: "Seven minutes of terror", duration: "0:50", tag: "The landing adventure", href: "/games/landing" },
  { id: "buggy", file: "Never tell Buggy it was staged.mp4", title: "Never tell Buggy it was staged", duration: "0:55", tag: "A RoverVilla story", href: "/story/book" },
  { id: "the-leak", file: "The leak.mp4", title: "The leak", duration: "1:03", tag: "The rover clubhouse", href: "/story/book" },
  { id: "night-call", file: "The night call.mp4", title: "The night call", duration: "0:49", tag: "One more memory", href: "/story/book" },
];

export const reelUrl = (reel: HomeReel): string => assetUrl(`reels/${encodeURIComponent(reel.file)}`);
export const reelPoster = (reel: HomeReel): string => `/reels/${reel.id}.webp`;
