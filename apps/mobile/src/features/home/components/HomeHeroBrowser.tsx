import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { SearchBar } from "@/features/heroes/components/SearchBar";
import { BodyFilterTabs } from "@/features/heroes/components/BodyFilterTabs";
import { HeroCard } from "@/features/heroes/components/HeroCard";
import { useHeroes } from "@/features/heroes/hooks/useHeroes";

export function HomeHeroBrowser() {
  const { heroes, filteredCount } = useHeroes();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">THE ARCHIVE</ThemedText>
        <ThemedText style={styles.title} type="title">Meet the heroes.</ThemedText>
        <ThemedText style={styles.subtitle} type="small">
          Browse all {filteredCount} rovers, landers and probes in the memorial collection.
        </ThemedText>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar />
        <BodyFilterTabs />
      </View>

      {heroes.length === 0 ? (
        <View style={styles.empty}>
          <ThemedText style={styles.emptyTitle} type="subtitle">No machines found</ThemedText>
          <ThemedText style={styles.emptySubtitle} type="small">
            Try adjusting your search query or world filter.
          </ThemedText>
        </View>
      ) : (
        <View style={styles.cardsGrid}>
          {heroes.map((hero) => (
            <HeroCard key={hero.slug} hero={hero} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 14,
    gap: 4,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  searchWrap: {
    gap: 12,
    marginBottom: 16,
  },
  cardsGrid: {
    gap: 12,
  },
  empty: {
    padding: 32,
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    gap: 6,
  },
  emptyTitle: {
    fontWeight: "700",
  },
  emptySubtitle: {
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
});
