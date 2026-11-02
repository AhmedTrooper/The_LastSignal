# 2026 NASA Space Apps Challenge: Master Dossier & Guidelines

## Core Challenge Statement: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"

### Challenge Overview
Since the 1960s, NASA has left hardware across the solar system—on the Moon, on Mars, and in deep space. From rovers and instruments that completed their science missions to probes still traveling away from Earth, this hardware varies widely in both its purpose and current level of functionality.

**Your challenge is to tell the story of some or all of this equipment that introduces school-age space enthusiasts to the hardware and the science it made possible.**

---

### Challenge Background & The "Anti-Textbook" Mandate
- **Problem:** People looking to learn about past space missions often work through **dense technical websites or historical textbooks** that lack the spark of imagination and storytelling needed to capture a younger or more casual audience's attention.
- **Audience:** School-age space enthusiasts (ages 10–16) and casual learners.
- **The Core Mandate:** Translate complex historical and scientific data into an engaging narrative. Draw a clear, exciting connection between the engineering of the hardware and the scientific knowledge humanity gained from it.
- **Tactile & Gamified Alternatives:** Interactive hardware replays, clickable "ghost rovers", countdown simulators, interactive descent dives, visual before-and-after timelines, and game mechanics that 10-to-16-year-olds can play through without friction.
- **Dual Layer Architecture:**
  1. **Gamified / Story Front-End:** Highly accessible, story-driven, bite-sized, interactive, inspiring personal connection.
  2. **Verified NASA Telemetry Layer:** Strict factual accuracy underneath for judges to inspect raw coordinates, camera frames, and engineering specs (COSPAR/NSSDCA IDs, LROC frames, Vidicon/telecom telemetry).

---

### Essential Development & Project Rules
1. **Web (`apps/web`) & Mobile (`apps/mobile`):**
   - Support both web and mobile experiences, maintaining shared data consistency across `@thelastsignal/data`.
2. **Facts Only & Verified Sources:**
   - Every date, number, coordinate, and quote must derive from authentic sources (NSSDCA, NASA Science, LPI, LROC). Never invent quotes or fictionalize telemetry.
3. **No NASA Logo or Branding:**
   - No official NASA logo or implying NASA endorsement. Clearly label AI-generated placeholder assets.
4. **No Hardcoded Secret Credentials:**
   - Keep environment credentials in local `.env.local` files only. Never hardcode credentials into source files.
5. **Simplicity & Accessibility Over Dense Walls of Text:**
   - Break down complex history into interactive chapters, tactile controls (sliders, scrubbers, camera toggles), and visual storytelling.
