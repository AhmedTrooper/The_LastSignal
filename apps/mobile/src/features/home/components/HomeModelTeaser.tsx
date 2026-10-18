import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, assetUrl } from "@thelastsignal/data";
import { haptic } from "@/utils/haptics";

export function HomeModelTeaser() {
  const oppy = HEROES.find((h) => h.slug === "opportunity");
  if (!oppy) return null;

  const cutoutUrl = assetUrl(`images/${oppy.card ?? "card-opportunity"}.webp`);

  const handlePress = () => {
    haptic.light();
    router.push(`/heroes/${oppy.slug}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Ionicons name="cube-outline" size={13} color="#c084fc" />
            <ThemedText style={styles.eyebrow} type="small">3D MODEL STUDIO</ThemedText>
          </View>
          <View style={styles.liveTag}>
            <ThemedText style={styles.liveTagText} type="small">INTERACTIVE 3D</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.title}>Turn Opportunity in your hands.</ThemedText>
        <ThemedText style={styles.summary} type="small">
          Explore interactive models with labeled scientific instruments, cameras, and solar arrays.
        </ThemedText>

        <View style={styles.statsRow}>
          {oppy.stats.map((s) => (
            <View key={s.label} style={styles.statBadge}>
              <ThemedText style={styles.statValue}>{s.value}</ThemedText>
              <ThemedText style={styles.statLabel} type="small">{s.label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.imageWrap}>
          <Image source={{ uri: cutoutUrl }} style={styles.image} contentFit="contain" />
        </View>

        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [styles.exploreBtn, pressed && styles.exploreBtnPressed]}
        >
          <ThemedText style={styles.exploreText}>Launch 3D Explorer</ThemedText>
          <Ionicons name="scan-outline" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: "#0d0f22",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(192, 132, 252, 0.2)",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },
  content: {
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(192, 132, 252, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  eyebrow: {
    color: "#c084fc",
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 10,
  },
  liveTag: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveTagText: {
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: "700",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
    color: "#ffffff",
  },
  summary: {
    color: "#94a3b8",
    lineHeight: 18,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  statBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  statValue: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13,
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  imageWrap: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  exploreBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  exploreText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
