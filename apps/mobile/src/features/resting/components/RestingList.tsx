import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, type Body } from "@thelastsignal/data";
import { RestingCard } from "./RestingCard";

type Filter = "all" | Body;

export function RestingList() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? HEROES : HEROES.filter((h) => h.body === filter);

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <RestingCard hero={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={styles.title} type="title">Where They Rest</ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Find where every rover, lander and probe came to rest on Mars and the Moon.
          </ThemedText>

          <View style={styles.filterRow}>
            {(["all", "mars", "moon"] as Filter[]).map((b) => {
              const active = filter === b;
              const label = b === "all" ? "All Worlds" : b === "mars" ? "Mars (10)" : "Moon (5)";
              return (
                <Pressable
                  key={b}
                  onPress={() => setFilter(b)}
                  style={[styles.tab, active && styles.tabActive]}
                >
                  <ThemedText style={[styles.tabText, active && styles.tabTextActive]} type="small">
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
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
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  tabActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  tabText: {
    fontWeight: "600",
    color: Colors.light.text,
  },
  tabTextActive: {
    color: "#ffffff",
  },
});
