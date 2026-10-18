import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { assetUrl } from "@thelastsignal/data";
import { haptic } from "@/utils/haptics";

interface HomeGameStripProps {
  onPlayPress?: () => void;
}

export function HomeGameStrip({ onPlayPress }: HomeGameStripProps) {
  const iconUrl = assetUrl("images/icon-touchdown.webp");

  const handlePress = () => {
    haptic.light();
    if (onPlayPress) {
      onPlayPress();
    } else {
      router.push("/games" as any);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.strip, pressed && styles.stripPressed]}
      >
        <View style={styles.iconWrap}>
          <Image source={{ uri: iconUrl }} style={styles.gameIcon} contentFit="cover" />
          <View style={styles.badge}>
            <Ionicons name="game-controller" size={12} color="#ffffff" />
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.tagRow}>
            <ThemedText style={styles.eyebrow} type="small">SIMULATOR HUB</ThemedText>
            <View style={styles.activeDot} />
            <ThemedText style={styles.tagText} type="small">3 MINIGAMES</ThemedText>
          </View>
          <ThemedText style={styles.gameTitle}>Touchdown &amp; Flight Simulators</ThemedText>
          <ThemedText style={styles.gameSubtitle} type="small">
            Mars/Moon lander, transmission delay &amp; photo quiz
          </ThemedText>
        </View>

        <View style={styles.playBtn}>
          <ThemedText style={styles.playText}>Play</ThemedText>
          <Ionicons name="arrow-forward" size={14} color="#ffffff" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  strip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d0f22",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
    gap: 14,
  },
  stripPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    position: "relative",
  },
  gameIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
  },
  badge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: Colors.light.violet,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0d0f22",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eyebrow: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  activeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  tagText: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "600",
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
  },
  gameSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 16,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.violet,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
  },
  playText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
});
