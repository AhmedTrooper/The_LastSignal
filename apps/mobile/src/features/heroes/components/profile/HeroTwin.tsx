import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, portrait, lifespan, assetUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroTwin({ hero }: Props) {
  if (!hero.twin) return null;
  const twin = HEROES.find((h) => h.slug === hero.twin);
  if (!twin) return null;

  const twinImg = assetUrl(`images/${portrait(twin)}.jpg`);

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">TWIN SPACECRAFT</ThemedText>
      <Pressable
        onPress={() => router.push(`/heroes/${twin.slug}`)}
        style={({ pressed }) => [styles.twinContent, pressed && styles.pressed]}
      >
        <Image source={{ uri: twinImg }} style={styles.twinAvatar} contentFit="cover" />
        <View style={styles.twinInfo}>
          <ThemedText style={styles.twinName}>{twin.name}</ThemedText>
          <ThemedText style={styles.twinLifespan} type="small">{lifespan(twin)} · {twin.kind}</ThemedText>
          <ThemedText style={styles.twinResting} numberOfLines={1} type="small">📍 {twin.restingPlace}</ThemedText>
        </View>
        <Ionicons name="arrow-forward" size={18} color={Colors.light.violet} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 10,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  twinContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  twinAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0c0a22",
  },
  twinInfo: {
    flex: 1,
    gap: 2,
  },
  twinName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.text,
  },
  twinLifespan: {
    color: Colors.light.violet,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  twinResting: {
    color: Colors.light.textSecondary,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
