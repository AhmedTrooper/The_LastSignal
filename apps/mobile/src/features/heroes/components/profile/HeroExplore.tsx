import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import type { Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroExplore({ hero }: Props) {
  if (!hero.links || hero.links.length === 0) return null;

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">EXPLORE FURTHER</ThemedText>
      <ThemedText style={styles.title} type="subtitle">Mission Catalogues &amp; Archives</ThemedText>
      <View style={styles.linksList}>
        {hero.links.map((link) => (
          <Pressable
            key={link.url}
            onPress={() => Linking.openURL(link.url)}
            style={({ pressed }) => [styles.linkItem, pressed && styles.pressed]}
          >
            <ThemedText style={styles.linkLabel} numberOfLines={1}>{link.label}</ThemedText>
            <Ionicons name="open-outline" size={16} color={Colors.light.violet} />
          </Pressable>
        ))}
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
  linksList: {
    gap: 8,
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.violet,
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
});
