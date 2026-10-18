import { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { HEROES, portrait, assetUrl, type Body, type Hero } from "@thelastsignal/data";
import { useGameStore } from "@/stores/use-game-store";

interface JournalModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSite: (hero: Hero) => void;
}

export function JournalModal({
  visible,
  onClose,
  onSelectSite,
}: JournalModalProps) {
  const insets = useSafeAreaInsets();
  const { sites, landings } = useGameStore();
  const [filterBody, setFilterBody] = useState<"all" | Body>("all");

  const filteredHeroes = useMemo(() => {
    if (filterBody === "all") return HEROES;
    return HEROES.filter((h) => h.body === filterBody);
  }, [filterBody]);

  const litCount = useMemo(
    () => Object.values(sites).filter((s) => s?.light).length,
    [sites]
  );
  const foundCount = useMemo(
    () => Object.values(sites).filter((s) => s?.found).length,
    [sites]
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View
        style={[
          styles.root,
          { paddingTop: Math.max(insets.top + 8, 16), paddingBottom: insets.bottom + 8 },
        ]}
      >
        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.topBarTitleRow}>
            <Ionicons name="book-outline" size={18} color="#38bdf8" />
            <Text style={styles.topBarTitle}>PILOT FLIGHT LOG &amp; JOURNAL</Text>
          </View>
          <Pressable
            onPress={() => {
              haptic.light();
              onClose();
            }}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>

        {/* Global Stats Summary Bar */}
        <View style={styles.statsSummaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{landings}</Text>
            <Text style={styles.summaryLabel}>TOUCHDOWNS</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: "#38bdf8" }]}>
              {foundCount} / 15
            </Text>
            <Text style={styles.summaryLabel}>LOCATED</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: "#f59e0b" }]}>
              {litCount} / 15
            </Text>
            <Text style={styles.summaryLabel}>BEACONS LIT</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(["all", "mars", "moon"] as const).map((b) => (
            <Pressable
              key={b}
              onPress={() => {
                haptic.selection();
                setFilterBody(b);
              }}
              style={[
                styles.filterPill,
                filterBody === b && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterBody === b && styles.filterPillTextActive,
                ]}
              >
                {b === "all"
                  ? "ALL EXPLORERS"
                  : b === "mars"
                  ? "MARS (8)"
                  : "MOON (7)"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Explorers List */}
        <FlatList
          data={filteredHeroes}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const siteState = sites[item.slug];
            const isLanded = !!siteState?.landed;
            const isFound = !!siteState?.found;
            const isLit = !!siteState?.light;

            return (
              <Pressable
                onPress={() => {
                  haptic.light();
                  onSelectSite(item);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.itemCard,
                  pressed && styles.itemCardPressed,
                  isLit && styles.itemCardLit,
                ]}
              >
                <Image
                  source={{ uri: assetUrl(`images/${portrait(item)}.jpg`) }}
                  style={styles.avatar}
                  contentFit="cover"
                />

                <View style={styles.infoCol}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.place} numberOfLines={1}>
                    {item.restingPlace}
                  </Text>
                  <Text style={styles.coords}>
                    {item.coords.lat.toFixed(2)}°, {item.coords.lon.toFixed(2)}° • {item.body.toUpperCase()}
                  </Text>
                </View>

                {/* Status Badges */}
                <View style={styles.badgesCol}>
                  <View
                    style={[
                      styles.statusPill,
                      isLanded && styles.statusPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isLanded && styles.statusPillTextActive,
                      ]}
                    >
                      {isLanded ? "LANDED" : "UNEXPLORED"}
                    </Text>
                  </View>

                  {isFound && (
                    <View style={styles.locatedBadge}>
                      <Ionicons
                        name="hardware-chip-outline"
                        size={11}
                        color="#60a5fa"
                      />
                      <Text style={styles.locatedBadgeText}>FOUND</Text>
                    </View>
                  )}

                  {isLit && (
                    <View style={styles.beaconLitBadge}>
                      <Ionicons name="flame" size={11} color="#f59e0b" />
                      <Text style={styles.beaconLitBadgeText}>LIT</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#070814",
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  topBarTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topBarTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsSummaryBar: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    paddingVertical: 12,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  summaryDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignSelf: "center",
  },
  summaryVal: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  summaryLabel: {
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  filterPillActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  filterPillText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  filterPillTextActive: {
    color: "#ffffff",
  },
  listContent: {
    paddingBottom: 24,
    gap: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  itemCardPressed: {
    opacity: 0.85,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  itemCardLit: {
    borderColor: "rgba(245, 158, 11, 0.3)",
    backgroundColor: "rgba(245, 158, 11, 0.04)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  place: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 11,
    fontWeight: "600",
  },
  coords: {
    color: "#38bdf8",
    fontSize: 9,
    fontWeight: "700",
  },
  badgesCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusPill: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    borderWidth: 1,
  },
  statusPillText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 8,
    fontWeight: "800",
  },
  statusPillTextActive: {
    color: "#10b981",
  },
  locatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(96, 165, 250, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  locatedBadgeText: {
    color: "#60a5fa",
    fontSize: 8,
    fontWeight: "800",
  },
  beaconLitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  beaconLitBadgeText: {
    color: "#f59e0b",
    fontSize: 8,
    fontWeight: "800",
  },
});
