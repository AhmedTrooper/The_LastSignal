import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { HEROES, lifespan, assetUrl, type Hero } from "@thelastsignal/data";
import { haptic } from "@/utils/haptics";

const FAMOUS_ENTRIES = [
  { slugs: ["spirit", "opportunity"], title: "Spirit & Opportunity", label: "Mars Exploration Rovers", body: "Mars" },
  { slugs: ["ingenuity"], title: "Ingenuity", label: "Mars Helicopter", body: "Mars" },
  { slugs: ["apollo-11-lander"], title: "Apollo 11 Eagle", label: "Lunar Module LM-5", body: "Moon" },
  { slugs: ["insight"], title: "InSight", label: "Mars Seismic Lander", body: "Mars" },
  { slugs: ["apollo-15-rover"], title: "Apollo 15 Rover", label: "Lunar Roving Vehicle", body: "Moon" },
];

function getCutout(h?: Hero) {
  if (!h) return "";
  return h.card ? assetUrl(`images/${h.card}.webp`) : assetUrl(`images/${h.photo ?? h.image}.jpg`);
}

const CARD_WIDTH = 220;
const CARD_GAP = 12;

export function HomeFamous() {
  const handlePress = (slug: string) => {
    haptic.light();
    router.push(`/heroes/${slug}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">THE FAMOUS ONES</ThemedText>
        <ThemedText style={styles.title} type="title">Different worlds.{"\n"}Same curiosity.</ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.carousel}
      >
        {FAMOUS_ENTRIES.map((entry) => {
          const hero = HEROES.find((h) => h.slug === entry.slugs[0]);
          if (!hero) return null;
          const imageUrl = getCutout(hero);
          const years = lifespan(hero);

          return (
            <Pressable
              key={entry.title}
              onPress={() => handlePress(hero.slug)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              {/* Badge Header */}
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText} type="small">{entry.body.toUpperCase()}</ThemedText>
                </View>
                <ThemedText style={styles.cardYears} type="small">{years}</ThemedText>
              </View>

              {/* Probe Image Cutout */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.cutoutImage}
                  contentFit="contain"
                  transition={250}
                />
              </View>

              {/* Card Meta & Waveform */}
              <View style={styles.cardInfo}>
                <ThemedText style={styles.cardTitle} numberOfLines={1}>{entry.title}</ThemedText>
                <ThemedText style={styles.cardLabel} numberOfLines={1} type="small">{entry.label}</ThemedText>
                <Waveform seed={hero.slug} bars={16} height={12} style={styles.waveform} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 4,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
  },
  carousel: {
    paddingHorizontal: 16,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "rgba(124, 58, 237, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: Colors.light.violet,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: "100%",
    height: 125,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  cutoutImage: {
    width: "100%",
    height: "100%",
  },
  cardInfo: {
    marginTop: 6,
    gap: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.light.text,
  },
  cardLabel: {
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  cardYears: {
    fontFamily: "monospace",
    color: Colors.light.textSecondary,
    fontWeight: "600",
    fontSize: 11,
  },
  waveform: {
    marginTop: 6,
    opacity: 0.7,
  },
});
