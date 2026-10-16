/**
 * Asset URL resolver for both Web (Next.js) and Mobile (Expo).
 *
 * Configurable via:
 * - Next.js: process.env.NEXT_PUBLIC_ASSET_URL
 * - Expo: process.env.EXPO_PUBLIC_ASSET_URL
 */

declare const process: { env?: Record<string, string | undefined> } | undefined;

export function getAssetBaseUrl(): string {
  let url: string | undefined;
  try {
    // Literal property access is required for Turbopack/Webpack/Metro to inline NEXT_PUBLIC_* / EXPO_PUBLIC_*
    if (typeof process !== "undefined" && process.env) {
      url = process.env.NEXT_PUBLIC_ASSET_URL || process.env.EXPO_PUBLIC_ASSET_URL;
    }
  } catch {
    // Process not available
  }
  return (url || "").replace(/\/+$/, "");
}

export function assetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = getAssetBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
}
