/**
 * Asset URL resolver for both Web (Next.js) and Mobile (Expo).
 *
 * Configurable via:
 * - Next.js: process.env.NEXT_PUBLIC_ASSET_URL
 * - Expo: process.env.EXPO_PUBLIC_ASSET_URL
 *
 * When no remote CDN URL is provided, falls back to local relative paths ("/images/...", etc.).
 */

export const CDN_BASE_URL = "https://pub-89b67d288ba046e79e1350d4115fd96b.r2.dev";

declare const process: { env?: Record<string, string | undefined> } | undefined;

export function getAssetBaseUrl(): string {
  let url: string | undefined;
  try {
    // Literal property access is required for Turbopack/Webpack/Metro to inline NEXT_PUBLIC_* / EXPO_PUBLIC_*
    if (typeof process !== "undefined" && process.env) {
      url = process.env.NEXT_PUBLIC_ASSET_URL || process.env.EXPO_PUBLIC_ASSET_URL;
    }
  } catch {
    // Fall back to CDN_BASE_URL
  }
  return (url || CDN_BASE_URL).replace(/\/+$/, "");
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
