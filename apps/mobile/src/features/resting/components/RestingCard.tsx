import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { fmtCoords, fmtLong, catNo, portrait, assetUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function RestingCard({ hero, isSelected, onSelect }: Props) {
  const router = useRouter();
  const isMars = hero.body === "mars";
  const avatarUrl = assetUrl(`images/${portrait(hero)}.jpg`);

  return (
    <Pressable
      onPress={() => {
        onSelect?.();
        router.push(`/heroes/${hero.slug}` as any);
      }}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.name} type="subtitle">{hero.name}</ThemedText>
            <ThemedText style={styles.catNo} type="small">{catNo(hero.no)}</ThemedText>
          </View>
          <ThemedText style={styles.designation} numberOfLines={1} type="small">
            {hero.designation}
          </ThemedText>
        </View>
        <View style={[styles.badge, isMars ? styles.marsBadge : styles.moonBadge]}>
          <ThemedText style={[styles.badgeText, isMars ? styles.marsBadgeText : styles.moonBadgeText]} type="small">
            {hero.category.toUpperCase()}
          </ThemedText>
        </View>
      </View>

      <View style={styles.locationSection}>
        <View style={styles.locRow}>
          <Ionicons name="location" size={16} color={Colors.light.violet} />
          <ThemedText style={styles.restingPlace}>{hero.restingPlace}</ThemedText>
        </View>
        <ThemedText style={styles.coordsText} type="small">
          Coordinates: {fmtCoords(hero.coords)}
        </ThemedText>
      </View>

      <View style={styles.footerRow}>
        <ThemedText style={styles.endStatus} type="small">
          {hero.end.label}: {fmtLong(hero.end.date)}
        </ThemedText>
        <View style={styles.viewLink}>
          <ThemedText style={styles.viewLinkText}>View Profile</ThemedText>
          <Ionicons name="arrow-forward" size={14} color={Colors.light.violet} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  cardSelected: {
    borderColor: Colors.light.violet,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0c0a22",
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
  },
  catNo: {
    color: Colors.light.textSecondary,
    fontFamily: "monospace",
  },
  designation: {
    color: Colors.light.textSecondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  marsBadge: {
    backgroundColor: "#fff0ea",
  },
  moonBadge: {
    backgroundColor: "#edeaff",
  },
  badgeText: {
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  marsBadgeText: {
    color: Colors.light.mars,
  },
  moonBadgeText: {
    color: Colors.light.violet,
  },
  locationSection: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 14,
    gap: 4,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  restingPlace: {
    fontWeight: "700",
    fontSize: 13,
    color: Colors.light.text,
  },
  coordsText: {
    fontFamily: "monospace",
    color: Colors.light.textSecondary,
    paddingLeft: 22,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  endStatus: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  viewLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.violet,
  },
});
