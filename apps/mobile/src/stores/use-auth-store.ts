import { create } from "zustand";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  photoUrl?: string;
  isAnonymous: boolean;
  createdAt: string;
}

export const GOOGLE_WEB_CLIENT_ID =
  "1003209827567-d46941l3q7ffqehkth92kisf74q2j7dl.apps.googleusercontent.com";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => void;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const redirectUrl = Linking.createURL("auth");
      const authUrl = `https://the-last-signal-theta.vercel.app/auth/mobile?redirect_uri=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const name = (parsed.queryParams?.name as string) || "Verified Explorer";
        const email = (parsed.queryParams?.email as string) || "";
        const photoUrl = (parsed.queryParams?.photo as string) || undefined;
        const uid = (parsed.queryParams?.uid as string) || "";

        set({
          user: {
            id: uid || `usr_${Date.now()}`,
            name,
            email,
            photoUrl,
            isAnonymous: false,
            createdAt: new Date().toISOString(),
          },
          isLoading: false,
        });
        return;
      }

      set({ isLoading: false });
    } catch (err) {
      console.warn("Google sign-in error:", err);
      set({ isLoading: false });
      throw err;
    }
  },

  signInAnonymously: () => {
    const user: AuthUser = {
      id: `anon_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: "Anonymous Explorer",
      isAnonymous: true,
      createdAt: new Date().toISOString(),
    };
    set({ user, isLoading: false });
  },

  signOut: async () => {
    set({ user: null, isLoading: false });
  },

  deleteAccount: async () => {
    set({ user: null, isLoading: false });
  },
}));
