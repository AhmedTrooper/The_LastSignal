import { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { HEROES, type Body } from "@thelastsignal/data";
import { TimelineItem } from "./TimelineItem";

export function TimelineList() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | Body>("all");
  const [eraFilter, setEraFilter] = useState<"all" | "60s" | "70s" | "90s" | "00s" | "modern">("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 600);
  };

  const filtered = HEROES.filter((h) => {
    if (filter !== "all" && h.body !== filter) return false;
    const year = parseInt(h.launch.date.slice(0, 4), 10);
    if (eraFilter === "60s" && (year < 1960 || year > 1969)) return false;
    if (eraFilter === "70s" && (year < 1970 || year > 1979)) return false;
    if (eraFilter === "90s" && (year < 1990 || year > 1999)) return false;
    if (eraFilter === "00s" && (year < 2000 || year > 2009)) return false;
    if (eraFilter === "modern" && year < 2010) return false;
    return true;
  }).sort((a, b) => a.no - b.no);

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.slug}
      renderItem={({ item, index }) => {
        const year = item.launch.date.slice(0, 4);
        return (
          <TimelineItem
            hero={item}
            isLast={index === filtered.length - 1}
            launchYear={year}
          />
        );
      }}
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
          <ThemedText style={styles.eyebrow} type="small">
            CHRONOLOGY
          </ThemedText>
          <ThemedText style={styles.title} type="title">
            Exploration Timeline
          </ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            From Ranger 7 in 1964 to Ingenuity in 2024. Sixty years of robotic exploration across Mars and the Moon on one axis.
          </ThemedText>

          {/* Key Historic Highlights Row */}
          <View style={styles.highlightsRow}>
            <Pressable
              onPress={() => {
                haptic.light();
                router.push("/heroes/opportunity" as any);
              }}
              style={({ pressed }) => [
                styles.highlightCard,
                pressed && styles.cardPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="View Opportunity: Longest Active mission"
            >
              <View style={styles.hlBadge}>
                <Ionicons name="timer-outline" size={12} color={Colors.light.violet} />
                <ThemedText style={styles.hlLabel} type="small">
                  LONGEST ACTIVE
                </ThemedText>
              </View>
              <ThemedText style={styles.hlValue}>Opportunity</ThemedText>
              <ThemedText style={styles.hlSub} type="small">
                14+ years (45.16 km)
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => {
                haptic.light();
                router.push("/heroes/ingenuity" as any);
              }}
              style={({ pressed }) => [
                styles.highlightCard,
                pressed && styles.cardPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="View Ingenuity: Latest Signal mission"
            >
              <View style={styles.hlBadge}>
                <Ionicons name="flash-outline" size={12} color={Colors.light.mars} />
                <ThemedText style={[styles.hlLabel, styles.hlLabelMars]} type="small">
                  LATEST SIGNAL
                </ThemedText>
              </View>
              <ThemedText style={styles.hlValue}>Ingenuity</ThemedText>
              <ThemedText style={styles.hlSub} type="small">
                Jan 2024 (72 flights)
              </ThemedText>
            </Pressable>
          </View>

          {/* World Filters */}
          <View style={styles.filterRow}>
            {(["all", "mars", "moon"] as const).map((b) => {
              const active = filter === b;
              const count =
                b === "all"
                  ? HEROES.length
                  : HEROES.filter((h) => h.body === b).length;
              return (
                <Pressable
                  key={b}
                  onPress={() => {
                    haptic.selection();
                    setFilter(b);
                  }}
                  style={({ pressed }) => [
                    styles.tab,
                    active && styles.tabActive,
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <ThemedText
                    style={[styles.tabText, active && styles.tabTextActive]}
                    type="small"
                  >
                    {b === "all" ? "All Worlds" : b === "mars" ? "Mars" : "Moon"} ({count})
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Era Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eraRow}
          >
            {[
              { id: "all", label: "All Eras" },
              { id: "60s", label: "1960s Pioneers" },
              { id: "70s", label: "1970s Giants" },
              { id: "90s", label: "1990s Revival" },
              { id: "00s", label: "2000s Rover Duos" },
              { id: "modern", label: "2010s–2020s" },
            ].map((era) => {
              const active = eraFilter === era.id;
              return (
                <Pressable
                  key={era.id}
                  onPress={() => {
                    haptic.light();
                    setEraFilter(era.id as any);
                  }}
                  style={({ pressed }) => [
                    styles.eraChip,
                    active && styles.eraChipActive,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <ThemedText
                    style={[styles.eraChipText, active && styles.eraChipTextActive]}
                    type="small"
                  >
                    {era.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.countRow}>
            <ThemedText style={styles.countText} type="small">
              Displaying {filtered.length} chronological milestones
            </ThemedText>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    gap: 8,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
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
  highlightsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 3,
  },
  hlBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hlLabel: {
    fontWeight: "800",
    color: Colors.light.violet,
    letterSpacing: 0.5,
    fontSize: 10,
  },
  hlLabelMars: {
    color: Colors.light.mars,
  },
  hlValue: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.text,
  },
  hlSub: {
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
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
    fontWeight: "700",
  },
  eraRow: {
    gap: 8,
    paddingVertical: 2,
  },
  eraChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  eraChipActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  eraChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.light.textSecondary,
  },
  eraChipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  countRow: {
    paddingTop: 2,
  },
  countText: {
    color: Colors.light.textSecondary,
    fontWeight: "600",
    fontSize: 11,
  },
});
