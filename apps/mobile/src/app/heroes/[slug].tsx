import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useHero } from "@/features/heroes/hooks/useHeroes";
import {
  assetUrl,
  catNo,
  fmtCoords,
  fmtLong,
  lifespan,
  portrait,
} from "@thelastsignal/data";

export default function HeroDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const hero = useHero(slug ?? "");

  if (!hero) {
    return (
      <View style={styles.center}>
        <ThemedText type="subtitle">Hero not found</ThemedText>
      </View>
    );
  }

  const imageUrl = assetUrl(`images/${portrait(hero)}.jpg`);

  return (
    <>
      <Stack.Screen options={{ title: hero.name, headerBackTitle: "Heroes" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Image source={{ uri: imageUrl }} style={styles.heroImage} contentFit="cover" />

        <View style={styles.body}>
          <ThemedText style={styles.cat} type="small">{catNo(hero.no)}</ThemedText>
          <ThemedText style={styles.title} type="title">{hero.name}</ThemedText>
          {hero.nickname && <ThemedText style={styles.nickname}>"{hero.nickname}"</ThemedText>}
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
              Last Signal · {fmtLong(hero.end.date)}
            </ThemedText>
            <ThemedText style={styles.lastSignalStory}>{hero.end.story}</ThemedText>
          </View>

          {hero.stats && (
            <View style={styles.statsRow}>
              {hero.stats.map((s) => (
                <View key={s.label} style={styles.statBox}>
                  <ThemedText style={styles.statVal}>{s.value}</ThemedText>
                  <ThemedText style={styles.statLabel} type="small">{s.label}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroImage: { width: "100%", aspectRatio: 16 / 10, backgroundColor: "#f7f7fb" },
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
  statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  statBox: { flex: 1, minWidth: 100, backgroundColor: "#f7f7fb", padding: 12, borderRadius: 12, alignItems: "center" },
  statVal: { fontSize: 18, fontWeight: "800", color: Colors.light.violet },
  statLabel: { color: Colors.light.textSecondary, textAlign: "center", marginTop: 2 },
});
