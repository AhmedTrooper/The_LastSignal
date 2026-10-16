import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, type Body, type Category, assetUrl } from "@thelastsignal/data";
import { RestingCard } from "./RestingCard";

type WorldFilter = Body;

const CATEGORIES: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All Types" },
  { id: "rover", label: "Rovers" },
  { id: "lander", label: "Landers" },
  { id: "helicopter", label: "Helicopter" },
  { id: "impactor", label: "Impactors" },
  { id: "lost", label: "Lost on Arrival" },
];

export function RestingList() {
  const [world, setWorld] = useState<WorldFilter>("mars");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [selectedSlug, setSelectedSlug] = useState<string>("opportunity");

  const onWorld = HEROES.filter((h) => h.body === world);
  const filtered = onWorld.filter((h) => category === "all" || h.category === category);

  const globeUrl = assetUrl(`images/${world === "mars" ? "mars-globe" : "moon-globe"}.jpg`);

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => (
        <RestingCard
          hero={item}
          isSelected={item.slug === selectedSlug}
          onSelect={() => setSelectedSlug(item.slug)}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow} type="small">WHERE THEY REST</ThemedText>
          <ThemedText style={styles.title} type="title">Resting among the stars.</ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Explore landing sites and coordinates where each rover, lander and probe came to rest.
          </ThemedText>

          {/* World Switcher */}
          <View style={styles.worldSwitchRow}>
            {(["mars", "moon"] as WorldFilter[]).map((w) => {
              const active = world === w;
              const count = HEROES.filter((h) => h.body === w).length;
              return (
                <Pressable
                  key={w}
                  onPress={() => {
                    setWorld(w);
                    setCategory("all");
                    const firstOnWorld = HEROES.find((h) => h.body === w);
                    if (firstOnWorld) setSelectedSlug(firstOnWorld.slug);
                  }}
                  style={[styles.worldBtn, active && styles.worldBtnActive]}
                >
                  <ThemedText style={[styles.worldBtnText, active && styles.worldBtnTextActive]}>
                    {w === "mars" ? "Mars" : "Moon"} ({count})
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Planetary Surface Graphic */}
          <View style={styles.globeBanner}>
            <Image source={{ uri: globeUrl }} style={styles.globeBannerImg} contentFit="cover" />
            <View style={styles.globeOverlay} />
            <View style={styles.globeTextWrap}>
              <ThemedText style={styles.globeTitle}>
                {world === "mars" ? "Martian Surface Map" : "Lunar Surface Map"}
              </ThemedText>
              <ThemedText style={styles.globeSubtitle} type="small">
                {filtered.length} resting sites mapped across {world === "mars" ? "Mars" : "the Moon"}
              </ThemedText>
            </View>
          </View>

          {/* Category Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                >
                  <ThemedText style={[styles.categoryChipText, active && styles.categoryChipTextActive]} type="small">
                    {cat.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <ThemedText style={styles.resultsCount} type="small">
            Showing {filtered.length} locations
          </ThemedText>
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
    marginBottom: 16,
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
  worldSwitchRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  worldBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  worldBtnActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  worldBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
  },
  worldBtnTextActive: {
    color: "#ffffff",
  },
  globeBanner: {
    width: "100%",
    height: 120,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 6,
    position: "relative",
    justifyContent: "flex-end",
  },
  globeBannerImg: {
    ...StyleSheet.absoluteFill,
  },
  globeOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(12, 10, 34, 0.5)",
  },
  globeTextWrap: {
    padding: 16,
    gap: 2,
  },
  globeTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  globeSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  categoryRow: {
    gap: 8,
    paddingVertical: 6,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  categoryChipText: {
    fontWeight: "600",
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: "#ffffff",
  },
  resultsCount: {
    color: Colors.light.textSecondary,
    fontWeight: "600",
    marginTop: 4,
  },
});
