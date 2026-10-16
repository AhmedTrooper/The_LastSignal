import { HEROES, type Body, type Hero } from "@thelastsignal/data";

export interface IHeroRepository {
  getAll(): Hero[];
  getBySlug(slug: string): Hero | undefined;
  getByBody(body: Body): Hero[];
  search(query: string, body?: Body | "all"): Hero[];
}

export class HeroRepository implements IHeroRepository {
  getAll(): Hero[] {
    return HEROES;
  }

  getBySlug(slug: string): Hero | undefined {
    return HEROES.find((h) => h.slug === slug);
  }

  getByBody(body: Body): Hero[] {
    return HEROES.filter((h) => h.body === body);
  }

  search(query: string, body: Body | "all" = "all"): Hero[] {
    const q = query.trim().toLowerCase();
    return HEROES.filter((h) => {
      const matchesBody = body === "all" || h.body === body;
      if (!matchesBody) return false;
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        (h.nickname && h.nickname.toLowerCase().includes(q)) ||
        h.designation.toLowerCase().includes(q) ||
        h.restingPlace.toLowerCase().includes(q)
      );
    });
  }
}

export const heroRepository = new HeroRepository();
