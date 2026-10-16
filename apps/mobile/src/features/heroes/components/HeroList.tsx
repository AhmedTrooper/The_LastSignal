import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { BodyFilterTabs } from "./BodyFilterTabs";
import { HeroCard } from "./HeroCard";
import { SearchBar } from "./SearchBar";
import { useHeroes } from "../hooks/useHeroes";

export function HeroList() {
  const { heroes, filteredCount } = useHeroes();

  return (
    <FlatList
      data={heroes}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <HeroCard hero={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={styles.title} type="title">
            The Last Signal
          </ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Their mission ended. Their story didn't.
          </ThemedText>
          <SearchBar />
          <BodyFilterTabs />
          <ThemedText style={styles.count} type="small">
            Showing {filteredCount} machines
          </ThemedText>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <ThemedText type="subtitle">No machines found</ThemedText>
          <ThemedText style={styles.emptySubtitle} type="small">
            Try adjusting your search or world filter.
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    paddingVertical: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#5d5a78",
    marginTop: -8,
    marginBottom: 4,
  },
  count: {
    color: "#5d5a78",
    fontWeight: "600",
  },
  empty: {
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptySubtitle: {
    color: "#5d5a78",
  },
});
