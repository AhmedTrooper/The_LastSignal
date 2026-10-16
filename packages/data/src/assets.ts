/**
 * Asset URL resolver for both Web (Next.js) and Mobile (Expo).
 *
 * Configurable via:
 * - Next.js: process.env.NEXT_PUBLIC_ASSET_URL
 * - Expo: process.env.EXPO_PUBLIC_ASSET_URL
 *
 * When no remote CDN URL is provided, falls back to local relative paths ("/images/...", etc.).
 */

declare const process: { env?: Record<string, string | undefined> } | undefined;

function getEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

export function getAssetBaseUrl(): string {
  const url = getEnv("NEXT_PUBLIC_ASSET_URL") || getEnv("EXPO_PUBLIC_ASSET_URL") || "";
  return url.replace(/\/+$/, "");
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
