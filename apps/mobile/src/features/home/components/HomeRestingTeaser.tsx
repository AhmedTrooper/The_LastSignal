import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { assetUrl } from "@thelastsignal/data";

export function HomeRestingTeaser() {
  const marsGlobe = assetUrl("images/mars-globe.jpg");
  const moonGlobe = assetUrl("images/moon-globe.jpg");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow} type="small">EXPLORATION MAP</ThemedText>
          <ThemedText style={styles.title} type="title">Resting among the stars.</ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Explore landing sites and coordinate locations where rovers and landers completed their journeys.
          </ThemedText>
        </View>

        <View style={styles.globesRow}>
          <View style={styles.globeWrap}>
            <Image source={{ uri: marsGlobe }} style={styles.globeImage} contentFit="cover" />
            <ThemedText style={styles.globeLabel} type="small">Mars · 10 sites</ThemedText>
          </View>
          <View style={styles.globeWrap}>
            <Image source={{ uri: moonGlobe }} style={styles.globeImage} contentFit="cover" />
            <ThemedText style={styles.globeLabel} type="small">Moon · 5 sites</ThemedText>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/(tabs)/resting")}
          style={({ pressed }) => [styles.mapBtn, pressed && styles.mapBtnPressed]}
        >
          <ThemedText style={styles.mapBtnText}>Open Landing Map</ThemedText>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 14,
  },
  header: {
    gap: 4,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  globesRow: {
    flexDirection: "row",
    gap: 14,
    marginVertical: 4,
  },
  globeWrap: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  globeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  globeLabel: {
    fontWeight: "700",
    color: Colors.light.text,
    fontSize: 12,
  },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },
  mapBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  mapBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
