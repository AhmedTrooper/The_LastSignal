/** Navigation labels are UI copy, never a replacement for mission facts. */
export const CLUB_LINKS = [
  { href: "/our-hero", label: "Our heroes", short: "Heroes", icon: "explorers", description: "Meet the machines and follow their real adventures." },
  { href: "/story", label: "Story room", short: "Stories", icon: "stories", description: "Scroll, read a book, or follow the panels." },
  { href: "/where-they-rest", label: "Space map", short: "Map", icon: "map", description: "Find our explorers on the Moon and Mars." },
] as const;
export const CLUB_MORE_LINKS = [
  { href: "/heroes", label: "Explorer archive" },
  { href: "/games", label: "Mission playground" },
  { href: "/games/landing", label: "Play Touchdown" },
  { href: "/gallery", label: "Photo album" },
  { href: "/timeline", label: "Time machine" },
  { href: "/tributes", label: "Messages to the explorers" },
  { href: "/about", label: "About RoverVilla" },
] as const;

export function isClubLinkActive(path: string, href: string) {
  if (href === "/story") return path.startsWith("/story") || /^\/heroes\/[^/]+\/(story|book|movie)$/.test(path);
  if (href === "/heroes") return path.startsWith("/heroes") && !/^\/heroes\/[^/]+\/(story|book|movie)$/.test(path);
  return path === href || path.startsWith(`${href}/`);
}

export const EXPLORER_TRAITS: Record<string, string> = {
  "apollo-11-lander": "The Moon’s little launch pad", opportunity: "The rock detective", spirit: "The determined climber",
  "ranger-7": "The Moon photographer", "surveyor-1": "The gentle landing", "apollo-15-rover": "The astronauts’ ride",
  "viking-1": "A laboratory on Mars", "viking-2": "Another window onto Mars", "pathfinder-sojourner": "The little trailblazer",
  "mars-polar-lander": "An arrival with questions", phoenix: "The ice explorer", insight: "The planet listener",
  ingenuity: "The little flyer", lcross: "Clues in the shadows", grail: "A pair with a purpose",
};
