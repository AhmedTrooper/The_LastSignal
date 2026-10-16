# The Last Signal - Mobile App

Mobile application for **The Last Signal** — a digital memorial for the robots, landers, rovers, and orbiters left behind on Mars and the Moon. Built with [Expo](https://expo.dev), [React Native](https://reactnative.dev), and [Expo Router](https://docs.expo.dev/router/introduction).

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- [Expo Go](https://expo.dev/go) app installed on your physical Android or iOS device (or Android Studio / Xcode for emulators)

### Environment Setup

Ensure environment variables are configured in `.env` at the root of the repository or in `.env.local`:

```bash
# Cloudflare R2 public asset bucket
EXPO_PUBLIC_ASSET_URL=https://<your-r2-subdomain>.r2.dev
```

---

## Development Commands

All commands use `bun` as the package manager and runner.

### Running from `apps/mobile` directory

```bash
cd apps/mobile

# Install workspace dependencies
bun install

# Start the Expo development server
bun run start

# Launch on connected Android device / emulator
bun run android

# Launch on iOS simulator (macOS required)
bun run ios

# Launch Expo mobile web version
bun run web

# Run ESLint on the mobile workspace
bun run lint
```

### Running from Monorepo Root

```bash
# Start Expo development server
bun run mobile

# Target specific platforms directly
bun run mobile:android
bun run mobile:ios
bun run mobile:web

# Run lint and type checking
bun run lint:mobile
bun run typecheck
```

---

## Testing on Physical Devices & Emulators

- **Expo Go (Easiest):** Run `bun run start`, open the **Expo Go** app on your phone, and scan the QR code displayed in the terminal.
- **Android Emulator:** Ensure Android Studio and an AVD (Android Virtual Device) are configured, then run `bun run android`.
- **iOS Simulator:** Ensure Xcode and Command Line Tools are installed (macOS only), then run `bun run ios`.

---

## Project Structure

```
apps/mobile/
├── src/
│   ├── app/                    # Expo Router file-based navigation
│   │   ├── (tabs)/             # Bottom tab navigation (Memorial, Resting, Timeline, Saved)
│   │   │   ├── _layout.tsx     # Tab bar styling & safe area inset handling
│   │   │   ├── index.tsx       # Memorial view
│   │   │   ├── resting.tsx     # Where they rest view
│   │   │   ├── timeline.tsx    # Chronological timeline view
│   │   │   └── favorites.tsx   # Saved / bookmarked machines
│   │   ├── heroes/[slug].tsx   # Hero detail & mission profile
│   │   └── _layout.tsx         # Root stack layout, splash screen & status bar
│   ├── components/             # Reusable UI components
│   ├── constants/              # Theme definitions & layout constants
│   ├── features/               # Feature-based business logic & UI components
│   │   ├── favorites/          # Bookmarks & favorites list
│   │   ├── heroes/             # Hero cards, filters, and detail specs
│   │   ├── resting/            # Resting place locations and coordinate cards
│   │   └── timeline/           # Chronological mission timeline
│   ├── hooks/                  # Custom hooks (useAppBarTheme, useTheme, etc.)
│   └── stores/                 # Zustand stores (useFavoritesStore with persistence)
├── app.json                    # Expo configuration (icons, splash, navigation bar)
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

---

## Design System & Theme Notes

- **Memorial Aesthetic:** The app strictly adheres to the clean, signature white memorial design matching the web app.
- **Adaptive Appbar:** The status bar and appbar header dynamically adapt to device dark/light mode so Wi-Fi, battery, and Bluetooth indicators always have high-contrast visibility.
- **Asset Streaming:** All heavy media assets (portraits, cutouts, telemetry waveforms) stream from Cloudflare R2 via `@thelastsignal/data` resolver rather than bloating the local bundle.
