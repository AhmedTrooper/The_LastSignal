import { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { HEROES, type Body } from "@thelastsignal/data";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { HeroCard } from "@/features/heroes/components/HeroCard";

export function FavoritesList() {
  const router = useRouter();
  const favorites = useFavoritesStore((s) => s.favorites);
  const [filter, setFilter] = useState<"all" | Body>("all");
  const [refreshing, setRefreshing] = useState(false);

  const savedHeroes = HEROES.filter((h) => favorites.includes(h.slug));
  const filtered = savedHeroes.filter((h) => filter === "all" || h.body === filter);

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 500);
  };

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <HeroCard hero={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.light.violet}
          colors={[Colors.light.violet]}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.eyebrowRow}>
            <View style={styles.beaconDot} />
            <ThemedText style={styles.eyebrow} type="small">
              PERSONAL MEMORIAL ARCHIVE
            </ThemedText>
          </View>
          <ThemedText style={styles.title} type="title">
            Saved Explorers
          </ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Your personal digital memorial. Planetary explorers and probes you have bookmarked to remember across time.
          </ThemedText>

          {/* Quick World Filter Chips */}
          {savedHeroes.length > 0 && (
            <View style={styles.filterRow}>
              {(["all", "mars", "moon"] as const).map((b) => {
                const active = filter === b;
                const count =
                  b === "all"
                    ? savedHeroes.length
                    : savedHeroes.filter((h) => h.body === b).length;

                return (
                  <Pressable
                    key={b}
                    onPress={() => {
                      haptic.selection();
                      setFilter(b);
                    }}
                    style={({ pressed }) => [
                      styles.filterChip,
                      active && styles.filterChipActive,
                      pressed && styles.btnPressed,
                    ]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                  >
                    <ThemedText
                      style={[
                        styles.filterChipText,
                        active && styles.filterChipTextActive,
                      ]}
                      type="small"
                    >
                      {b === "all" ? "All Saved" : b === "mars" ? "Mars" : "Moon"} ({count})
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bookmark-outline" size={36} color={Colors.light.violet} />
          </View>
          <ThemedText style={styles.emptyTitle} type="subtitle">
            No saved explorers yet
          </ThemedText>
          <ThemedText style={styles.emptyText} type="small">
            Tap the bookmark icon on any explorer&apos;s memorial profile to add them to your personal constellation here.
          </ThemedText>

          <Pressable
            onPress={() => {
              haptic.light();
              router.push("/" as any);
            }}
            style={({ pressed }) => [
              styles.browseBtn,
              pressed && styles.btnPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Browse all explorers on home screen"
          >
            <Ionicons name="compass-outline" size={16} color="#ffffff" />
            <ThemedText style={styles.browseBtnText}>
              Discover Memorial Fleet
            </ThemedText>
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 16,
    gap: 8,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.violet,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  filterChipActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  filterChipText: {
    fontWeight: "600",
    color: Colors.light.text,
  },
  filterChipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  emptyContainer: {
    padding: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 24,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 10,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#edeaff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  emptyText: {
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    fontSize: 13,
    maxWidth: 280,
  },
  browseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.violet,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  browseBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
});
