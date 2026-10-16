import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, assetUrl } from "@thelastsignal/data";

export function HomeModelTeaser() {
  const oppy = HEROES.find((h) => h.slug === "opportunity");
  if (!oppy) return null;

  const cutoutUrl = assetUrl(`images/${oppy.card ?? "card-opportunity"}.webp`);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.eyebrow} type="small">3D MODEL STUDIO</ThemedText>
        <ThemedText style={styles.title} type="title">Turn Opportunity in your hands.</ThemedText>
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
          onPress={() => router.push(`/heroes/${oppy.slug}`)}
          style={({ pressed }) => [styles.exploreBtn, pressed && styles.exploreBtnPressed]}
        >
          <ThemedText style={styles.exploreText}>Explore Opportunity&apos;s 3D Model</ThemedText>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: "#f3f0ff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e4dcff",
  },
  content: {
    gap: 8,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  summary: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  imageWrap: {
    width: "100%",
    height: 180,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 16,
    marginTop: 6,
  },
  exploreBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  exploreText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
