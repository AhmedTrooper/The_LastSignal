import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, type Body } from "@thelastsignal/data";
import { TimelineItem } from "./TimelineItem";

export function TimelineList() {
  const [filter, setFilter] = useState<"all" | Body>("all");

  const filtered = HEROES.filter((h) => filter === "all" || h.body === filter).sort((a, b) => a.no - b.no);

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.slug}
      renderItem={({ item, index }) => (
        <TimelineItem hero={item} isLast={index === filtered.length - 1} />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow} type="small">CHRONOLOGY</ThemedText>
          <ThemedText style={styles.title} type="title">Exploration Timeline</ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            From Ranger 7 in 1964 to Ingenuity in 2024. Sixty years of robotic exploration across Mars and the Moon on one axis.
          </ThemedText>

          {/* Highlights Row */}
          <View style={styles.highlightsRow}>
            <View style={styles.highlightCard}>
              <ThemedText style={styles.hlLabel} type="small">LONGEST ACTIVE</ThemedText>
              <ThemedText style={styles.hlValue}>Opportunity</ThemedText>
              <ThemedText style={styles.hlSub} type="small">14+ years (45.16 km)</ThemedText>
            </View>
            <View style={styles.highlightCard}>
              <ThemedText style={styles.hlLabel} type="small">LATEST SIGNAL</ThemedText>
              <ThemedText style={styles.hlValue}>Ingenuity</ThemedText>
              <ThemedText style={styles.hlSub} type="small">Jan 2024 (72 flights)</ThemedText>
            </View>
          </View>

          {/* World Filters */}
          <View style={styles.filterRow}>
            {(["all", "mars", "moon"] as const).map((b) => {
              const active = filter === b;
              const count = b === "all" ? HEROES.length : HEROES.filter((h) => h.body === b).length;
              return (
                <Pressable
                  key={b}
                  onPress={() => setFilter(b)}
                  style={[styles.tab, active && styles.tabActive]}
                >
                  <ThemedText style={[styles.tabText, active && styles.tabTextActive]} type="small">
                    {b === "all" ? "All Worlds" : b === "mars" ? "Mars" : "Moon"} ({count})
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
    paddingBottom: 36,
  },
  header: {
    marginBottom: 20,
    gap: 8,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
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
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 2,
  },
  hlLabel: {
    fontWeight: "800",
    color: Colors.light.violet,
    letterSpacing: 0.5,
    fontSize: 10,
  },
  hlValue: {
    fontSize: 15,
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
    paddingVertical: 8,
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
