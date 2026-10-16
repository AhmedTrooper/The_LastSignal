import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { STORIES, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroFilmBanner({ hero }: Props) {
  const film = STORIES[hero.slug];
  const isCinematic = Boolean(film);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <Ionicons name="film-outline" size={16} color="#a78bfa" />
          <ThemedText style={styles.badge} type="small">
            {isCinematic ? "CINEMATIC FILM" : "MISSION STORY"}
          </ThemedText>
        </View>
        <ThemedText style={styles.title}>
          {isCinematic ? `The Story of ${hero.name}` : `Chaptered Life of ${hero.name}`}
        </ThemedText>
        <ThemedText style={styles.subtitle} type="small">
          {isCinematic
            ? `Experience ${film?.scenes.length} scroll-driven scenes from cleanroom to final signal.`
            : "Follow every milestone from launch and touchdown to their final transmission."}
        </ThemedText>
        <Pressable
          onPress={() => router.push(`/heroes/${hero.slug}/story` as any)}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <ThemedText style={styles.btnText}>{isCinematic ? "Watch the Film" : "Read the Story"}</ThemedText>
          <Ionicons name="arrow-forward" size={16} color="#0c0a22" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0c0a22",
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  content: {
    gap: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 11,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.75)",
    lineHeight: 18,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  btnText: {
    color: "#0c0a22",
    fontWeight: "700",
    fontSize: 14,
  },
});
