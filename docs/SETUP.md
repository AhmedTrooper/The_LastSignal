# RoverVilla — Setup and Contributor Guide

[← Repository README](../README.md) · [Project description and report](ROVERVILLA_PROJECT_REPORT.md)

This guide covers local setup, development, contribution, and releases for the RoverVilla monorepo. Run commands from the repository root unless stated otherwise.

## Prerequisites

- [Bun](https://bun.sh) for workspace dependencies and scripts.
- Node.js 20.9 or later for the Next.js web application.
- Git for cloning and the contribution workflow.
- For mobile, follow the device and simulator requirements in the [Mobile README](../apps/mobile/README.md). The iOS simulator requires macOS.

## Workspace Structure

| Workspace | Description | Documentation |
|---|---|---|
| **Web App** (`apps/web`) | Next.js 16 application with interactive globes, story readers, archive profiles, and games | [Web README](../apps/web/README.md) |
| **Mobile App** (`apps/mobile`) | Expo / React Native application for Android and iOS | [Mobile README](../apps/mobile/README.md) |
| **Shared Data** (`packages/data`) | Shared TypeScript types, catalog data, mission telemetry, and Cloudflare R2 asset resolvers | [Shared data](../packages/data) |

## Repository & Clone Instructions

> [!IMPORTANT]
> Because `main` is the default branch on GitHub, specify `-b dev` when cloning for development.

```bash
# Clone the development branch
git clone -b dev https://github.com/asfi50/thelastsignal.git

# Enter the project directory
cd thelastsignal

# Install all monorepo dependencies
bun install
```

## Environment Variables

Copy the public asset example into the web application's local environment file:

```bash
cp .env.example apps/web/.env.local
```

For mobile development, also create its local environment file:

```bash
cp .env.example apps/mobile/.env.local
```

The example contains the shared public CDN configuration. To use your own asset bucket, set these values in the respective local files:

```env
# Cloudflare R2 public asset URLs — not secret credentials
NEXT_PUBLIC_ASSET_URL=https://<your-r2-subdomain>.r2.dev
EXPO_PUBLIC_ASSET_URL=https://<your-r2-subdomain>.r2.dev
```

Next.js loads environment files from `apps/web`, its application root. Keep credentials in ignored `.env.local` files, never in source files or committed documentation. Variables prefixed with `NEXT_PUBLIC_` or `EXPO_PUBLIC_` are public client configuration, not a place for secrets. Restart development servers after changing the environment, and set public values before production builds.

### Optional web authentication and tributes

Stories and games do not require an account. To enable Firebase authentication and the shared tribute wall, add your Firebase project's web app configuration to `apps/web/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=<firebase-web-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<firebase-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<firebase-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<firebase-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<firebase-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<firebase-web-app-id>
```

Enable Google sign-in, authorize your local/production domains in Firebase Authentication, and configure Firestore access rules before using the public tribute wall. Do not put Firebase service-account keys in public variables.

## Development Commands

### Running Applications

```bash
# Start the web dev server (http://localhost:3000)
bun run web

# Start the mobile Expo development server
bun run mobile

# Launch mobile on an Android device / emulator
bun run mobile:android

# Launch mobile on the iOS simulator (macOS only)
bun run mobile:ios

# Launch the mobile web preview
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

# Run TypeScript checks across all packages
bun run typecheck

# Run full pre-commit verification (lint + typecheck)
bun run check

# Build the Next.js web application
bun run web:build
```

For web-only type checking, run `bun x tsc --noEmit` inside `apps/web`.

## Git Workflow & Branching Policy

> [!CAUTION]
> - **Do not push directly to `main` or `dev`.**
> - `main` is reserved for verified, stable production releases.
> - `dev` is the integration branch for ongoing development.

### Contribution Steps

1. **Pull the latest `dev` branch** from a clean working tree:
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create a feature or fix branch:**
   ```bash
   # For new features
   git checkout -b feature/your-feature-name

   # For bug fixes
   git checkout -b fix/your-fix-name
   ```

3. **Develop and verify locally:**
   ```bash
   bun run check
   ```

4. **Stage your intended files, commit, and push the feature branch:**
   ```bash
   git add <changed-file-paths>
   git commit -m "feat(scope): concise description of changes"
   git push origin feature/your-feature-name
   ```
   Follow the [commit rules](../COMMIT_RULES.md).

5. **Open a pull request targeting `dev`.** After review and passing CI, changes merge into `dev`. Stable milestones are then promoted from `dev` to `main`.

## Release & Deployment

Deployment workflows are controlled by release tags or manual dispatch, not ordinary branch pushes. Pull-request CI still runs verification builds.

| Tag Pattern | Workflow | Target |
|---|---|---|
| `web-v*` (e.g. `web-v1.0.0`) | Builds and deploys the web application | Cloudflare Workers via OpenNext |
| `mobile-v*` (e.g. `mobile-v1.0.0`) | Exports the mobile web bundle; requests EAS binaries when configured | Expo web artifact / Android and iOS via EAS |
| `v*` (e.g. `v1.0.0`) | Runs both release workflows | Web and mobile |

Web deployment requires the GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The mobile binary build requires `EXPO_TOKEN`. Public asset URLs can be set as GitHub secrets or variables named `NEXT_PUBLIC_ASSET_URL` and `EXPO_PUBLIC_ASSET_URL`. Without deployment credentials, the workflows can still build/export, but skip their credential-dependent deployment or binary steps.

### Creating a Release Tag

Only tag a verified release commit; use the next unused version rather than copying these example versions literally.

```bash
# Deploy the web application only
git tag web-v1.0.0
git push origin web-v1.0.0

# Build the mobile application only
git tag mobile-v1.0.0
git push origin mobile-v1.0.0

# Release both web and mobile
git tag v1.0.0
git push origin v1.0.0
```

Workflows can also be manually dispatched through the repository's **GitHub Actions** tab. See [web deployment](../.github/workflows/deploy-web.yml), [mobile builds](../.github/workflows/build-mobile.yml), and [CI](../.github/workflows/ci.yml) for the exact current steps.
