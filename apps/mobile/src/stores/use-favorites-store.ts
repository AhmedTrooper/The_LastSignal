import { create } from "zustand";

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  toggleFavorite: (slug: string) => {
    const { favorites } = get();
    const next = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug];
    set({ favorites: next });
  },
  isFavorite: (slug: string) => get().favorites.includes(slug),
}));
