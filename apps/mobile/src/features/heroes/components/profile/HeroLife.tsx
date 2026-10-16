import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { storyChapters, assetUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroLife({ hero }: Props) {
  const chapters = storyChapters(hero);

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">LIFE&apos;S WORK</ThemedText>
      <ThemedText style={styles.title} type="subtitle">Mission Chapters</ThemedText>

      {/* Discoveries */}
      {hero.discoveries && hero.discoveries.length > 0 && (
        <View style={styles.discoveriesSection}>
          <ThemedText style={styles.sectionHeader} type="small">KEY DISCOVERIES</ThemedText>
          <View style={styles.discoveriesGrid}>
            {hero.discoveries.map((d) => (
              <View key={d.title} style={styles.discoveryCard}>
                {d?.image ? (
                  <Image source={{ uri: assetUrl(`images/${d.image}.jpg`) }} style={styles.discoveryImg} contentFit="cover" />
                ) : null}
                <ThemedText style={styles.discoveryTitle} type="small">{d.title}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Route */}
      {hero.route && (
        <View style={styles.routeSection}>
          <ThemedText style={styles.sectionHeader} type="small">EXPLORATION ROUTE</ThemedText>
          <View style={styles.routeCard}>
            <ThemedText style={styles.routeDistance}>{hero.route.km} driven</ThemedText>
            <View style={styles.pointsRow}>
              {hero.route.points.map((p, i) => (
                <View key={p.name} style={styles.pointChip}>
                  <ThemedText style={styles.pointIndex} type="small">0{i + 1}</ThemedText>
                  <ThemedText style={styles.pointName} type="small">{p.name}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Chapters */}
      <View style={styles.chaptersList}>
        {chapters.map((ch, idx) => {
          const imgUrl = ch?.image ? assetUrl(`images/${ch.image}.jpg`) : null;
          return (
            <View key={`${ch.title}-${idx}`} style={styles.chapterItem}>
              {imgUrl && (
                <View style={styles.chapterImgWrap}>
                  <Image source={{ uri: imgUrl }} style={styles.chapterImg} contentFit="cover" />
                </View>
              )}
              <View style={styles.chapterTextContent}>
                <View style={styles.chapterHeader}>
                  <ThemedText style={styles.chapterTitle}>{ch.title}</ThemedText>
                  <ThemedText style={styles.chapterYear} type="small">{ch.year}</ThemedText>
                </View>
                <ThemedText style={styles.chapterText} type="small">{ch.text}</ThemedText>
              </View>
            </View>
          );
        })}
      </View>
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
    gap: 14,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  sectionHeader: {
    fontWeight: "800",
    color: Colors.light.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  discoveriesSection: {
    gap: 6,
  },
  discoveriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  discoveryCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  discoveryImg: {
    width: "100%",
    height: 90,
  },
  discoveryTitle: {
    fontWeight: "700",
    padding: 8,
    fontSize: 12,
  },
  routeSection: {
    gap: 6,
  },
  routeCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 8,
  },
  routeDistance: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.violet,
  },
  pointsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pointChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  pointIndex: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "700",
  },
  pointName: {
    fontWeight: "600",
    color: Colors.light.text,
  },
  chaptersList: {
    gap: 14,
  },
  chapterItem: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  chapterImgWrap: {
    width: "100%",
    height: 140,
    backgroundColor: "#0c0a22",
  },
  chapterImg: {
    width: "100%",
    height: "100%",
  },
  chapterTextContent: {
    padding: 14,
    gap: 4,
  },
  chapterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  chapterYear: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "600",
  },
  chapterText: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
});
