import { useMemo } from "react";
import { heroRepository } from "@/repositories/hero.repository";
import { useHeroStore } from "@/stores/use-hero-store";
import type { Hero } from "@thelastsignal/data";

export function useHeroes(): {
  heroes: Hero[];
  totalCount: number;
  filteredCount: number;
} {
  const selectedBody = useHeroStore((state) => state.selectedBody);
  const searchQuery = useHeroStore((state) => state.searchQuery);

  const allHeroes = useMemo(() => heroRepository.getAll(), []);

  const heroes = useMemo(() => {
    return heroRepository.search(searchQuery, selectedBody);
  }, [searchQuery, selectedBody]);

  return {
    heroes,
    totalCount: allHeroes.length,
    filteredCount: heroes.length,
  };
}

export function useHero(slug: string): Hero | undefined {
  return useMemo(() => heroRepository.getBySlug(slug), [slug]);
}
