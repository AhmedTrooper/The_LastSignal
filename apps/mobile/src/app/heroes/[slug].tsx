import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useHero } from "@/features/heroes/hooks/useHeroes";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { HeroSpecs } from "@/features/heroes/components/HeroSpecs";
import { HeroChapters } from "@/features/heroes/components/HeroChapters";
import { assetUrl, catNo, fmtCoords, fmtLong, lifespan, portrait } from "@thelastsignal/data";

export default function HeroDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const hero = useHero(slug ?? "");
  const isFav = useFavoritesStore((s) => s.isFavorite(slug ?? ""));
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite);

  if (!hero) {
    return (
      <View style={styles.center}>
        <ThemedText type="subtitle">Hero not found</ThemedText>
      </View>
    );
  }

  const isCutout = Boolean(hero.card);
  const imageUrl = isCutout
    ? assetUrl(`images/${hero.card}.webp`)
    : assetUrl(`images/${portrait(hero)}.jpg`);

  return (
    <>
      <Stack.Screen
        options={{
          title: hero.name,
          headerRight: () => (
            <Pressable onPress={() => toggleFav(hero.slug)} style={styles.favBtn}>
              <Ionicons
                name={isFav ? "bookmark" : "bookmark-outline"}
                size={22}
                color={Colors.light.violet}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.imageWrap, isCutout && styles.cutoutWrap]}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            contentFit={isCutout ? "contain" : "cover"}
          />
        </View>

        <View style={styles.body}>
          <ThemedText style={styles.cat} type="small">{catNo(hero.no)}</ThemedText>
          <ThemedText style={styles.title} type="title">{hero.name}</ThemedText>
          {hero.nickname && <ThemedText style={styles.nickname}>&ldquo;{hero.nickname}&rdquo;</ThemedText>}
          <ThemedText style={styles.meta} type="small">{hero.designation} · {lifespan(hero)}</ThemedText>

          <View style={styles.card}>
            <ThemedText style={styles.cardHeader} type="subtitle">Resting Place</ThemedText>
            <ThemedText style={styles.cardText}>📍 {hero.restingPlace}</ThemedText>
            <ThemedText style={styles.coords} type="small">{fmtCoords(hero.coords)}</ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText style={styles.cardHeader} type="subtitle">Mission Summary</ThemedText>
            <ThemedText style={styles.summary}>{hero.summary}</ThemedText>
          </View>

          <View style={[styles.card, styles.lastSignalCard]}>
            <ThemedText style={styles.lastSignalTitle} type="subtitle">
              {hero.end.label} · {fmtLong(hero.end.date)}
            </ThemedText>
            <ThemedText style={styles.lastSignalStory}>{hero.end.story}</ThemedText>
          </View>

          <HeroSpecs hero={hero} />
          <HeroChapters hero={hero} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  favBtn: { padding: 4 },
  imageWrap: { width: "100%", aspectRatio: 16 / 10, backgroundColor: "#f7f7fb" },
  cutoutWrap: { padding: 18, backgroundColor: "#f7f6fc" },
  heroImage: { width: "100%", height: "100%" },
  body: { padding: 18, gap: 14 },
  cat: { color: Colors.light.violet, fontWeight: "700" },
  title: { fontSize: 30, fontWeight: "800", marginTop: -6 },
  nickname: { fontSize: 18, fontStyle: "italic", color: Colors.light.textSecondary, marginTop: -8 },
  meta: { color: Colors.light.textSecondary },
  card: { backgroundColor: "#f7f7fb", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.light.line },
  cardHeader: { fontSize: 17, fontWeight: "700", marginBottom: 6 },
  cardText: { fontSize: 15, fontWeight: "500" },
  coords: { color: Colors.light.textSecondary, marginTop: 4 },
  summary: { fontSize: 15, lineHeight: 22, color: Colors.light.text },
  lastSignalCard: { borderColor: Colors.light.violet, backgroundColor: "#ece7ff" },
  lastSignalTitle: { color: Colors.light.violet, fontWeight: "700" },
  lastSignalStory: { fontSize: 15, lineHeight: 22, color: Colors.light.text, marginTop: 4 },
});
