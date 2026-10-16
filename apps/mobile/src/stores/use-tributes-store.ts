import { create } from "zustand";

export interface Tribute {
  id: string;
  heroSlug: string;
  name: string;
  message: string;
  date: string;
}

const INITIAL_TRIBUTES: Tribute[] = [
  {
    id: "1",
    heroSlug: "opportunity",
    name: "A fellow wanderer",
    message: "Thank you for showing us what perseverance and hope look like across 45 kilometres of Martian dust.",
    date: "2019-02-14",
  },
  {
    id: "2",
    heroSlug: "ingenuity",
    name: "Skywatcher",
    message: "72 flights through an alien sky. You proved that the impossible was just waiting to take off.",
    date: "2024-01-26",
  },
  {
    id: "3",
    heroSlug: "insight",
    name: "Earth Seismology Team",
    message: "You heard the heartbeat of Mars when nobody else could. Rest easy beneath the dust.",
    date: "2022-12-20",
  },
  {
    id: "4",
    heroSlug: "spirit",
    name: "Stargazer",
    message: "From Husband Hill to Troy, you fought for every centimetre. We will never forget you.",
    date: "2010-04-01",
  },
];

interface TributesState {
  tributes: Tribute[];
  addTribute: (heroSlug: string, name: string, message: string) => void;
  getTributesForHero: (heroSlug: string) => Tribute[];
}

export const useTributesStore = create<TributesState>((set, get) => ({
  tributes: INITIAL_TRIBUTES,
  addTribute: (heroSlug: string, name: string, message: string) => {
    const newTribute: Tribute = {
      id: Date.now().toString(),
      heroSlug,
      name: name.trim() || "Anonymous",
      message: message.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ tributes: [newTribute, ...state.tributes] }));
  },
  getTributesForHero: (heroSlug: string) => {
    return get().tributes.filter((t) => t.heroSlug === heroSlug);
  },
}));
