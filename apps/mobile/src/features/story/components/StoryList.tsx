import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, catNo, lifespan, portrait, storyChapters, assetUrl, type Hero } from "@thelastsignal/data";

function StoryCard({ hero }: { hero: Hero }) {
  const chapters = storyChapters(hero);
  const imageUrl = assetUrl(`images/${portrait(hero)}.jpg`);

  return (
    <Pressable
      onPress={() => router.push(`/heroes/${hero.slug}/story` as any)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.overlay} />
      <View style={styles.cardContent}>
        <View style={styles.tagRow}>
          <ThemedText style={styles.badge} type="small">
            {catNo(hero.no)} · {chapters.length} chapters
          </ThemedText>
        </View>
        <ThemedText style={styles.name}>{hero.name}</ThemedText>
        <ThemedText style={styles.lifespan} type="small">{lifespan(hero)}</ThemedText>
        <View style={styles.readRow}>
          <ThemedText style={styles.readText}>Read the story</ThemedText>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </View>
      </View>
    </Pressable>
  );
}

export function StoryList() {
  return (
    <FlatList
      data={HEROES}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <StoryCard hero={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow} type="small">STORY</ThemedText>
          <ThemedText style={styles.title} type="title">Their lives, chapter by chapter.</ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Pick a machine. Its story unfolds from the cleanroom on Earth to its last signal across space.
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    gap: 6,
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
    marginTop: 2,
  },
  card: {
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#0c0a22",
    position: "relative",
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(12, 10, 34, 0.55)",
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },
  tagRow: {
    marginBottom: 4,
  },
  badge: {
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "monospace",
    fontSize: 12,
  },
  name: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
  },
  lifespan: {
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "monospace",
    marginTop: 2,
  },
  readRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  readText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
