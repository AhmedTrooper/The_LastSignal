import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { fmtLong, assetUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroJourney({ hero }: Props) {
  const launchPhoto = hero.photos?.launch ? assetUrl(`images/${hero.photos.launch}.jpg`) : null;
  const landingPhoto = hero.photos?.landing ? assetUrl(`images/${hero.photos.landing}.jpg`) : null;

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">MISSION JOURNEY</ThemedText>
      <ThemedText style={styles.title} type="subtitle">Launch &amp; Landing</ThemedText>

      {/* Launch */}
      <View style={styles.subCard}>
        {launchPhoto && (
          <View style={styles.photoWrap}>
            <Image source={{ uri: launchPhoto }} style={styles.photo} contentFit="cover" />
          </View>
        )}
        <View style={styles.details}>
          <ThemedText style={styles.stepTitle}>🚀 Liftoff from Earth</ThemedText>
          <ThemedText style={styles.dateText}>{fmtLong(hero.launch.date)}{hero.launch.time ? ` · ${hero.launch.time}` : ""}</ThemedText>
          <View style={styles.metaRow}>
            <ThemedText style={styles.metaLabel} type="small">Rocket: </ThemedText>
            <ThemedText style={styles.metaValue} type="small">{hero.launch.rocket}</ThemedText>
          </View>
          <View style={styles.metaRow}>
            <ThemedText style={styles.metaLabel} type="small">Pad: </ThemedText>
            <ThemedText style={styles.metaValue} type="small">{hero.launch.pad}</ThemedText>
          </View>
        </View>
      </View>

      {/* Landing */}
      {hero.landing && (
        <View style={styles.subCard}>
          {landingPhoto && (
            <View style={styles.photoWrap}>
              <Image source={{ uri: landingPhoto }} style={styles.photo} contentFit="cover" />
            </View>
          )}
          <View style={styles.details}>
            <ThemedText style={styles.stepTitle}>📍 Arrival on {hero.body === "mars" ? "Mars" : "the Moon"}</ThemedText>
            <ThemedText style={styles.dateText}>{fmtLong(hero.landing.date)}</ThemedText>
            <View style={styles.metaRow}>
              <ThemedText style={styles.metaLabel} type="small">Site: </ThemedText>
              <ThemedText style={styles.metaValue} type="small">{hero.landing.site}</ThemedText>
            </View>
            <View style={styles.metaRow}>
              <ThemedText style={styles.metaLabel} type="small">Method: </ThemedText>
              <ThemedText style={styles.metaValue} type="small">{hero.landing.method}</ThemedText>
            </View>
          </View>
        </View>
      )}
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
    gap: 12,
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
  subCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  photoWrap: {
    width: "100%",
    height: 140,
    backgroundColor: "#0c0a22",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  details: {
    padding: 14,
    gap: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  dateText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: Colors.light.violet,
    fontWeight: "600",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    color: Colors.light.textSecondary,
    width: 60,
  },
  metaValue: {
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
});
