import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { assetUrl } from "@thelastsignal/data";

interface HomeGameStripProps {
  onPlayPress?: () => void;
}

export function HomeGameStrip({ onPlayPress }: HomeGameStripProps) {
  const iconUrl = assetUrl("images/icon-touchdown.webp");

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPlayPress}
        style={({ pressed }) => [styles.strip, pressed && styles.stripPressed]}
      >
        <Image source={{ uri: iconUrl }} style={styles.gameIcon} contentFit="cover" />
        <View style={styles.info}>
          <ThemedText style={styles.gameTitle}>Touchdown</ThemedText>
          <ThemedText style={styles.gameSubtitle} type="small">
            A landing simulator on Mars &amp; the Moon
          </ThemedText>
        </View>
        <View style={styles.actionBtn}>
          <ThemedText style={styles.actionText}>Play</ThemedText>
          <Ionicons name="arrow-forward" size={16} color={Colors.light.violet} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  strip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  stripPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  gameIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.text,
  },
  gameSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.violet,
  },
});
