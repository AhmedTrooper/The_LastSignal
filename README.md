# The Last Signal

> **A digital memorial for the machines we left behind on Mars and the Moon.**
> 
> *Their mission ended. Their story didn't.*

[![CI](https://github.com/asfi50/thelastsignal/actions/workflows/ci.yml/badge.svg)](https://github.com/asfi50/thelastsignal/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Workspace Structure

The project is structured as a Bun monorepo:

| Workspace | Description | Documentation |
|---|---|---|
| **Web App** (`apps/web`) | Next.js 15 application with 3D interactive globes, story narration, and archive profiles | [apps/web/README.md](apps/web/README.md) |
| **Mobile App** (`apps/mobile`) | Expo / React Native mobile application for Android and iOS | [apps/mobile/README.md](apps/mobile/README.md) |
| **Shared Data** (`packages/data`) | Shared TypeScript types, catalog data, mission telemetry, and Cloudflare R2 asset resolvers | [packages/data](packages/data) |

---

## Repository & Clone Instructions

> [!IMPORTANT]
> Because `main` is the default branch on GitHub, you **must** specify `-b dev` when cloning the repository for development.

```bash
# Clone the dev branch (required)
git clone -b dev https://github.com/asfi50/thelastsignal.git

# Enter the project directory
cd thelastsignal

# Install all monorepo dependencies
bun install
```

---

## Git Workflow & Branching Policy

To maintain code quality and stability, all contributors must adhere to the following workflow:

> [!CAUTION]
> - **DO NOT push directly to `main` under any circumstances.**
> - **DO NOT push directly to `dev` under any circumstances.**
> - `main` is strictly reserved for verified, stable production releases.
> - `dev` is the integration branch for ongoing development.

### Contribution Steps

1. **Pull the latest `dev` branch:**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create a temporary feature or fix branch:**
   ```bash
   # For new features
   git checkout -b feature/your-feature-name

   # For bug fixes
   git checkout -b fix/your-fix-name
   ```

3. **Develop and verify locally:**
   Run lint and type checks before committing:
   ```bash
   bun run check
   ```

4. **Commit and push your feature branch:**
   ```bash
   git add .
   git commit -m "feat(scope): concise description of changes"
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request targeting `dev`:**
   Once reviewed and CI checks pass, your changes will be merged into `dev`. Stable milestones will then be promoted from `dev` to `main`.

---

## Development Commands

All commands are run with [Bun](https://bun.sh) from the repository root:

### Running Applications

```bash
# Start Web application dev server (http://localhost:3000)
bun run web

# Start Mobile Expo development server
bun run mobile

# Launch Mobile on Android device / emulator
bun run mobile:android

# Launch Mobile on iOS simulator (macOS only)
bun run mobile:ios

# Launch Mobile on web preview
bun run mobile:web
```

### Building & Code Quality

```bash
# Run linting across all packages (web, mobile, data)
bun run lint

# Lint specific packages
bun run lint:web
bun run lint:mobile
bun run lint:data

# Run TypeScript type check across all packages
bun run typecheck

# Run full pre-commit verification (lint + typecheck)
bun run check

# Build Next.js web application
bun run web:build
```

---

## Release & Deployment (Tag-Controlled GitHub Actions)

Deployments and production builds are **never automated on regular branch pushes**. They are strictly controlled via **Git release tags** to ensure stability:

| Tag Pattern | Action Triggered | Target |
|---|---|---|
| `web-v*` (e.g. `web-v1.0.0`) | Builds & deploys the **Web application** | Cloudflare Pages / Workers |
| `mobile-v*` (e.g. `mobile-v1.0.0`) | Builds & bundles the **Mobile Expo app** | Android APK / iOS / EAS |
| `v*` (e.g. `v1.0.0`) | Full release: deploys Web **and** builds Mobile | Both Web & Mobile |

### Creating a Release Tag

```bash
# Deploy Web application only
git tag web-v1.0.0
git push origin web-v1.0.0

# Build Mobile application only
git tag mobile-v1.0.0
git push origin mobile-v1.0.0

# Deploy full production release (Web + Mobile)
git tag v1.0.0
git push origin v1.0.0
```

Workflows can also be manually dispatched at any time via the **GitHub Actions** tab in the repository.

---

## Environment Variables

Copy `.env.example` to `.env` in the repository root:

```bash
cp .env.example .env
```

```env
# Cloudflare R2 Public Bucket CDN URL
NEXT_PUBLIC_ASSET_URL=https://pub-89b67d288ba046e79e1350d4115fd96b.r2.dev
EXPO_PUBLIC_ASSET_URL=https://pub-89b67d288ba046e79e1350d4115fd96b.r2.dev
```

---

## Sub-Package Readmes

- **[Web README](apps/web/README.md)**: Architecture, pages, routes, three.js globes, and AI image notes.
- **[Mobile README](apps/mobile/README.md)**: Expo Router tabs, Android/iOS setup, and theme details.
- **[Commit Rules](COMMIT_RULES.md)**: Repository commit title guidelines and formatting standards.
