import { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import {
  HEROES,
  fmtCoords,
  catNo,
  portrait,
  type Body,
  type Category,
  assetUrl,
} from "@thelastsignal/data";
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
  const router = useRouter();
  const [world, setWorld] = useState<WorldFilter>("mars");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [selectedSlug, setSelectedSlug] = useState<string>("opportunity");
  const [refreshing, setRefreshing] = useState(false);

  const onWorld = HEROES.filter((h) => h.body === world);
  const filtered = onWorld.filter(
    (h) => category === "all" || h.category === category
  );
  const selectedHero = HEROES.find((h) => h.slug === selectedSlug);

  const globeUrl = assetUrl(
    `images/${world === "mars" ? "mars-globe" : "moon-globe"}.jpg`
  );

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 600);
  };

  const handleWorldSwitch = (w: WorldFilter) => {
    if (world === w) return;
    haptic.selection();
    setWorld(w);
    setCategory("all");
    const firstOnWorld = HEROES.find((h) => h.body === w);
    if (firstOnWorld) setSelectedSlug(firstOnWorld.slug);
  };

  const handlePinPress = (slug: string) => {
    haptic.selection();
    setSelectedSlug(slug);
  };

  const isMars = world === "mars";

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
            WHERE THEY REST
          </ThemedText>
          <ThemedText style={styles.title} type="title">
            Resting Among the Stars
          </ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Landing sites and final resting coordinates of probes, rovers, and landers across the solar system.
          </ThemedText>

          {/* Native World Switcher Tabs */}
          <View style={styles.worldSwitchRow}>
            {(["mars", "moon"] as WorldFilter[]).map((w) => {
              const active = world === w;
              const count = HEROES.filter((h) => h.body === w).length;
              const isTargetMars = w === "mars";

              return (
                <Pressable
                  key={w}
                  onPress={() => handleWorldSwitch(w)}
                  style={({ pressed }) => [
                    styles.worldBtn,
                    active && (isTargetMars ? styles.worldBtnActiveMars : styles.worldBtnActiveMoon),
                    pressed && styles.btnPressed,
                  ]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Filter by ${w === "mars" ? "Mars" : "Moon"} (${count} sites)`}
                >
                  <Ionicons
                    name={isTargetMars ? "planet" : "moon"}
                    size={16}
                    color={active ? "#ffffff" : Colors.light.textSecondary}
                  />
                  <ThemedText
                    style={[
                      styles.worldBtnText,
                      active && styles.worldBtnTextActive,
                    ]}
                  >
                    {w === "mars" ? "Mars" : "Moon"} ({count})
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Interactive Planetary Surface & Radar Viewport */}
          <View style={styles.globeBanner}>
            <Image
              source={{ uri: globeUrl }}
              style={styles.globeBannerImg}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.globeOverlay} />

            {/* Radar Grid Overlay Lines */}
            <View style={styles.radarGrid} pointerEvents="none">
              <View style={styles.gridLineH} />
              <View style={styles.gridLineV} />
              <View style={styles.gridRing} />
            </View>

            {/* Telemetry Radar Top Status Bar */}
            <View style={styles.radarTopBar}>
              <View style={styles.radarStatusWrap}>
                <View style={[styles.radarBeaconDot, isMars ? styles.marsBeacon : styles.moonBeacon]} />
                <ThemedText style={styles.radarStatusText} type="small">
                  {isMars ? "MARTIAN SURFACE HUD" : "LUNAR SURFACE HUD"}
                </ThemedText>
              </View>
              <ThemedText style={styles.radarSiteCount} type="small">
                {onWorld.length} SITES MAPPED
              </ThemedText>
            </View>

            {/* Interactive Pins on the surface */}
            {onWorld.map((h) => {
              const isSelected = h.slug === selectedSlug;
              const left = Math.min(
                86,
                Math.max(12, ((h.coords.lon + 180) / 360) * 100)
              );
              const top = Math.min(
                74,
                Math.max(26, ((90 - h.coords.lat) / 180) * 100)
              );

              return (
                <Pressable
                  key={h.slug}
                  onPress={() => handlePinPress(h.slug)}
                  style={[
                    styles.pinMarker,
                    { left: `${left}%`, top: `${top}%` },
                    isSelected && styles.pinMarkerSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${h.name} on radar`}
                >
                  {/* Outer Pulsing Radar Ring for Selected Site */}
                  {isSelected && <View style={styles.selectedRadarHalo} />}
                  <View
                    style={[
                      styles.pinDot,
                      isSelected && styles.pinDotSelected,
                    ]}
                  />
                  {isSelected && (
                    <View style={styles.pinBadge}>
                      <ThemedText
                        style={styles.pinBadgeText}
                        type="small"
                        numberOfLines={1}
                      >
                        {h.name}
                      </ThemedText>
                    </View>
                  )}
                </Pressable>
              );
            })}

            {/* Bottom Caption */}
            <View style={styles.globeTextWrap}>
              <ThemedText style={styles.globeSubtitle} type="small">
                Tap any pinpoint on the surface to inspect coordinates &amp; telemetry
              </ThemedText>
            </View>
          </View>

          {/* Selected Site Spotlight Telemetry Card */}
          {selectedHero && (
            <View style={styles.selectedSiteCard}>
              <View style={styles.spotlightTopRow}>
                <Image
                  source={{ uri: assetUrl(`images/${portrait(selectedHero)}.jpg`) }}
                  style={styles.spotlightAvatar}
                  contentFit="cover"
                />
                <View style={styles.spotlightHeaderInfo}>
                  <View style={styles.spotlightTitleRow}>
                    <ThemedText style={styles.selectedSiteTitle}>
                      {selectedHero.name}
                    </ThemedText>
                    <ThemedText style={styles.spotlightCatNo} type="small">
                      {catNo(selectedHero.no)}
                    </ThemedText>
                  </View>
                  <View style={styles.spotlightLocRow}>
                    <Ionicons name="location" size={13} color={Colors.light.violet} />
                    <ThemedText style={styles.spotlightResting} numberOfLines={1}>
                      {selectedHero.restingPlace}
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.spotlightCoordsBadge}>
                <Ionicons name="navigate-outline" size={13} color={Colors.light.violet} />
                <ThemedText style={styles.selectedSiteCoords} type="small">
                  Coordinates: {fmtCoords(selectedHero.coords)}
                </ThemedText>
              </View>

              <ThemedText style={styles.selectedSiteStory} type="small" numberOfLines={2}>
                {selectedHero.end.story}
              </ThemedText>

              <Pressable
                onPress={() => {
                  haptic.light();
                  router.push(`/heroes/${selectedHero.slug}` as any);
                }}
                style={({ pressed }) => [
                  styles.spotlightProfileBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <ThemedText style={styles.spotlightProfileBtnText}>
                  Open Memorial Profile
                </ThemedText>
                <Ionicons name="arrow-forward" size={14} color="#ffffff" />
              </Pressable>
            </View>
          )}

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              const count =
                cat.id === "all"
                  ? onWorld.length
                  : onWorld.filter((h) => h.category === cat.id).length;

              if (cat.id !== "all" && count === 0) return null;

              return (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    haptic.light();
                    setCategory(cat.id);
                  }}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                    pressed && styles.btnPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${cat.label}`}
                >
                  <ThemedText
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                    type="small"
                  >
                    {cat.label} ({count})
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.resultsCountRow}>
            <ThemedText style={styles.resultsCount} type="small">
              Showing {filtered.length} resting locations
            </ThemedText>
            <ThemedText style={styles.resultsSub} type="small">
              {world === "mars" ? "Surface of Mars" : "Surface of the Moon"}
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
    marginBottom: 16,
    gap: 8,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
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
  worldSwitchRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  worldBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  worldBtnActiveMars: {
    backgroundColor: Colors.light.mars,
    borderColor: Colors.light.mars,
  },
  worldBtnActiveMoon: {
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
    height: 220,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 6,
    position: "relative",
    justifyContent: "space-between",
    backgroundColor: "#070814",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  globeBannerImg: {
    ...StyleSheet.absoluteFill,
  },
  globeOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(10, 11, 26, 0.45)",
  },
  radarGrid: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  gridRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  radarTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    zIndex: 5,
  },
  radarStatusWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(10, 11, 26, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  radarBeaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  marsBeacon: {
    backgroundColor: Colors.light.mars,
  },
  moonBeacon: {
    backgroundColor: "#a78bfa",
  },
  radarStatusText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  radarSiteCount: {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
  },
  pinMarker: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    marginLeft: -16,
    marginTop: -16,
    zIndex: 10,
  },
  pinMarkerSelected: {
    zIndex: 25,
  },
  selectedRadarHalo: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(245, 158, 11, 0.3)",
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: Colors.light.violet,
  },
  pinDotSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#ffffff",
    borderColor: "#f59e0b",
    borderWidth: 3,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 5,
  },
  pinBadge: {
    position: "absolute",
    bottom: 24,
    backgroundColor: "rgba(10, 11, 26, 0.92)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  pinBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  globeTextWrap: {
    padding: 12,
    zIndex: 5,
    backgroundColor: "rgba(10, 11, 26, 0.55)",
  },
  globeSubtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 11,
    textAlign: "center",
  },
  selectedSiteCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.violet,
    gap: 10,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  spotlightTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  spotlightAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0c0a22",
  },
  spotlightHeaderInfo: {
    flex: 1,
    gap: 2,
  },
  spotlightTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  selectedSiteTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.light.text,
  },
  spotlightCatNo: {
    color: Colors.light.textSecondary,
    fontFamily: "monospace",
    fontSize: 11,
  },
  spotlightLocRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  spotlightResting: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.textSecondary,
  },
  spotlightCoordsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  selectedSiteCoords: {
    color: Colors.light.violet,
    fontWeight: "700",
    fontFamily: "monospace",
    fontSize: 11,
  },
  selectedSiteStory: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    fontSize: 12,
  },
  spotlightProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.light.violet,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 2,
  },
  spotlightProfileBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  categoryRow: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
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
    fontWeight: "700",
  },
  resultsCountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  resultsCount: {
    color: Colors.light.textSecondary,
    fontWeight: "700",
  },
  resultsSub: {
    color: Colors.light.violet,
    fontWeight: "600",
  },
});
