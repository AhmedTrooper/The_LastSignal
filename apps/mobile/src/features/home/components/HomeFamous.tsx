import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, lifespan, assetUrl, type Hero } from "@thelastsignal/data";

const FAMOUS_ENTRIES = [
  { slugs: ["spirit", "opportunity"], title: "Spirit & Opportunity", label: "Mars Exploration Rovers" },
  { slugs: ["ingenuity"], title: "Ingenuity", label: "Mars Helicopter" },
  { slugs: ["apollo-11-lander"], title: "Apollo 11 Eagle", label: "Lunar Module LM-5" },
  { slugs: ["insight"], title: "InSight", label: "Mars Seismic Lander" },
  { slugs: ["apollo-15-rover"], title: "Apollo 15 Rover", label: "Lunar Roving Vehicle" },
];

function getCutout(h?: Hero) {
  if (!h) return "";
  return h.card ? assetUrl(`images/${h.card}.webp`) : assetUrl(`images/${h.photo ?? h.image}.jpg`);
}

export function HomeFamous() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">THE FAMOUS ONES</ThemedText>
        <ThemedText style={styles.title} type="title">Different worlds.{"\n"}Same curiosity.</ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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
              onPress={() => router.push(`/heroes/${hero.slug}`)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.cutoutImage}
                  contentFit="contain"
                />
              </View>
              <View style={styles.cardInfo}>
                <ThemedText style={styles.cardTitle}>{entry.title}</ThemedText>
                <ThemedText style={styles.cardLabel} type="small">{entry.label}</ThemedText>
                <ThemedText style={styles.cardYears} type="small">{years}</ThemedText>
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
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 14,
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
    gap: 14,
  },
  card: {
    width: 200,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    overflow: "hidden",
    padding: 14,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: "100%",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  cutoutImage: {
    width: "100%",
    height: "100%",
  },
  cardInfo: {
    marginTop: 10,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.text,
  },
  cardLabel: {
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  cardYears: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "600",
    marginTop: 4,
  },
});
