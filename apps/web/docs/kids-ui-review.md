# RoverVilla UI redesign — review draft

**Approved for commit after passing checks. No push requested.** The thought-cloud storytelling plan remains a separate, unimplemented next phase.

## Direction

Warm paper backgrounds, readable dark type, violet navigation, restrained peach and lilac surfaces, clear explorer pictures, and story-led language. The design should feel welcoming to children without looking like a baby game or a technical dashboard.

The existing RoverVilla logo is retained. Decorative sparkle/star icons, dotted brushes, and UI-level AI captions were removed after review feedback. Meaningful icons identify actual actions; generated mission illustrations and synthetic narration retain their factual disclosures.

## Review pages

- `/`: new welcome, direct entry to the completed Eagle and Opportunity editions, existing animated reels and explorer previews retained.
- `/heroes`: larger source-labelled explorer cards, world filters, search, and a useful empty state.
- `/story`: a shared story room with scroll, comic, and book links. The original collection remains accessible.
- `/games`: plain-language mission choices; game pages have clearer introductions. Existing simulation logic is unchanged.
- `/gallery`: photo-album cards and a native dialog with previous/next controls, source captions, Escape, focus return, and scroll locking.
- `/where-they-rest`: clearer world controls and a warmer frame around the existing interactive globe.
- `/timeline`: a time-machine introduction, preserved timeline controls, and explicit selection instead of selection changing on hover.
- `/tributes`: a warm message room. The existing backend and authentication are unchanged. Copy makes clear that this is a shared website wall, not a transmission to a spacecraft.
- `/heroes/opportunity`, `/heroes/apollo-11-lander`, and other profile pages: shared navigation, warmer surfaces, and larger section controls. Mission facts, chapters, sources, and media are not removed.
- `/about`, `/privacy`, `/terms`, `/delete-account`, and the missing-page screen: the shared page system and clear navigation. Legal terms and deletion behavior are unchanged.

## Preservation

- Eagle's ten chapters, Opportunity's five chapters, comic/prose conversion, bookmarks, and scroll-story synchronization are preserved.
- The immersive scroll stories keep their established layout rather than being replaced by the general page shell.
- No changes to `apps/mobile`, shared mission data, source dates, coordinates, measurements, or credentials.
- The existing untracked other-machine book draft is left untouched.
