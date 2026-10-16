import { create } from "zustand";
import type { Body } from "@thelastsignal/data";

interface HeroState {
  selectedBody: Body | "all";
  searchQuery: string;
  setSelectedBody: (body: Body | "all") => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  selectedBody: "all",
  searchQuery: "",
  setSelectedBody: (selectedBody) => set({ selectedBody }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () => set({ selectedBody: "all", searchQuery: "" }),
}));
