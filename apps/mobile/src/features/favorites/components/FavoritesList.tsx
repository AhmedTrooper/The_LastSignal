import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES } from "@thelastsignal/data";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { HeroCard } from "@/features/heroes/components/HeroCard";

export function FavoritesList() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const heroes = HEROES.filter((h) => favorites.includes(h.slug));

  return (
    <FlatList
      data={heroes}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <HeroCard hero={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={styles.title} type="title">Saved Explorers</ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Your personal digital memorial. Heroes you have bookmarked to remember.
          </ThemedText>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>★</ThemedText>
          <ThemedText style={styles.emptyTitle} type="subtitle">No saved heroes yet</ThemedText>
          <ThemedText style={styles.emptyText} type="small">
            Tap the bookmark button on any hero profile to save them here for quick access.
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    marginTop: 20,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 32,
    color: Colors.light.violet,
  },
  emptyTitle: {
    fontWeight: "700",
  },
  emptyText: {
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
