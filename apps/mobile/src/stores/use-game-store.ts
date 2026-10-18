import { create } from "zustand";

export interface SiteProgress {
  landed: boolean;
  found: boolean;
  light: boolean;
  soft: boolean;
  echoes: number;
}

interface GameState {
  sites: Record<string, SiteProgress>;
  landings: number;
  crashes: number;
  recordLanding: (slug: string, soft: boolean) => void;
  recordCrash: (slug: string) => void;
  recordFound: (slug: string, echoesCount: number) => void;
  lightBeacon: (slug: string) => void;
  getSiteProgress: (slug: string) => SiteProgress;
}

export const useGameStore = create<GameState>((set, get) => ({
  sites: {
    opportunity: { landed: true, found: true, light: true, soft: true, echoes: 3 },
  },
  landings: 1,
  crashes: 0,
  recordLanding: (slug: string, soft: boolean) => {
    set((state) => {
      const current = state.sites[slug] ?? {
        landed: false,
        found: false,
        light: false,
        soft: false,
        echoes: 0,
      };
      return {
        landings: state.landings + 1,
        sites: {
          ...state.sites,
          [slug]: {
            ...current,
            landed: true,
            soft: soft || current.soft,
          },
        },
      };
    });
  },
  recordCrash: () => {
    set((state) => ({ crashes: state.crashes + 1 }));
  },
  recordFound: (slug: string, echoesCount: number) => {
    set((state) => {
      const current = state.sites[slug] ?? {
        landed: true,
        found: false,
        light: false,
        soft: true,
        echoes: 0,
      };
      return {
        sites: {
          ...state.sites,
          [slug]: {
            ...current,
            found: true,
            echoes: Math.max(current.echoes, echoesCount),
          },
        },
      };
    });
  },
  lightBeacon: (slug: string) => {
    set((state) => {
      const current = state.sites[slug] ?? {
        landed: true,
        found: true,
        light: false,
        soft: true,
        echoes: 3,
      };
      return {
        sites: {
          ...state.sites,
          [slug]: {
            ...current,
            light: true,
          },
        },
      };
    });
  },
  getSiteProgress: (slug: string) => {
    return (
      get().sites[slug] ?? {
        landed: false,
        found: false,
        light: false,
        soft: false,
        echoes: 0,
      }
    );
  },
}));
