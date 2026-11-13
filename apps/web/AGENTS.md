<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# RoverVilla: Web Guidelines

## Challenge: Abandoned but not Forgotten (NASA Space Apps 2026)
- **Target Audience:** School-age space enthusiasts (ages 10–16) and casual learners.
- **Mandate:** Rejects dry, encyclopedia-style textbooks in favor of **interactive, story-driven, or game-like experiences** with a **verified NASA telemetry layer** underneath.
- **Tone:** Make the stories and details sections frictionless, visually rich, and bite-sized. Connect hardware engineering directly to what humans learned.
- **Strict Scope:** Focus strictly on `apps/web`. Never touch `apps/mobile`.

## Ground Rules
- Read `CONCEPT.md` first. Final designs live in `final-design /` (note the trailing space in the folder name).
- **Facts only.** Every date, number, coordinate, and quote in `lib/heroes.ts` and `lib/wiki` must come from verified sources (NSSDCA, NASA Science, LPI, LROC). Never invent quotes.
- No NASA logo or branding, and nothing that implies official endorsement. Label anything AI-made.
- Never hardcode credentials into source files.
