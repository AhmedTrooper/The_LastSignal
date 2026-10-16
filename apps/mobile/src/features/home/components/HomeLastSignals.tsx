import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, assetUrl } from "@thelastsignal/data";

const POLAROIDS = [
  { slug: "apollo-15-rover", image: "nasa/S71-41509", date: "2 Aug 1971", text: "Its camera watched the crew leave." },
  { slug: "phoenix", image: "nasa/PIA12338", date: "2 Nov 2008", text: "Last signal, as the arctic winter set in." },
  { slug: "spirit", image: "nasa/PIA12007", date: "22 Mar 2010", text: "Stuck at Troy, it last called home." },
  { slug: "opportunity", image: "nasa/PIA22222", date: "10 Jun 2018", text: "Very low power and a darkening sky." },
  { slug: "insight", image: "nasa/PIA25680", date: "15 Dec 2022", text: "Its last word to Earth." },
];

export function HomeLastSignals() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">LAST SIGNALS</ThemedText>
        <ThemedText style={styles.title} type="title">
          They had names, birthdays and last words,{"\n"}
          <ThemedText style={styles.titleViolet} type="title">just like us.</ThemedText>
        </ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      >
        {POLAROIDS.map((p) => {
          const hero = HEROES.find((h) => h.slug === p.slug);
          if (!hero || !p?.image) return null;
          const imageUrl = assetUrl(`images/${p.image}.jpg`);

          return (
            <Pressable
              key={p.slug}
              onPress={() => router.push(`/heroes/${hero.slug}`)}
              style={({ pressed }) => [styles.polaroid, pressed && styles.polaroidPressed]}
            >
              <View style={styles.photoWrap}>
                <Image source={{ uri: imageUrl }} style={styles.photo} contentFit="cover" />
              </View>
              <ThemedText style={styles.polaroidCaption}>{p.text}</ThemedText>
              <ThemedText style={styles.polaroidMeta} type="small">
                {hero.name} · {p.date}
              </ThemedText>
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
  titleViolet: {
    color: Colors.light.violet,
    fontSize: 26,
    fontWeight: "800",
  },
  carousel: {
    paddingHorizontal: 16,
    gap: 14,
  },
  polaroid: {
    width: 220,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
    shadowColor: "#0c0a22",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  polaroidPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  photoWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.light.backgroundElement,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  polaroidCaption: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    lineHeight: 20,
    color: Colors.light.text,
  },
  polaroidMeta: {
    fontFamily: "monospace",
    color: Colors.light.textSecondary,
    fontSize: 11,
    marginTop: 6,
  },
});
