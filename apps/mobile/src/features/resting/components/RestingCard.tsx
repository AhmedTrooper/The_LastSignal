import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
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

  const handleCardPress = () => {
    haptic.light();
    onSelect?.();
    router.push(`/heroes/${hero.slug}` as any);
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View ${hero.name} resting place at ${hero.restingPlace}`}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" transition={200} />
          <View style={[styles.statusDot, isMars ? styles.marsDot : styles.moonDot]} />
        </View>

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
          <Ionicons name="location" size={15} color={Colors.light.violet} />
          <ThemedText style={styles.restingPlace} numberOfLines={1}>{hero.restingPlace}</ThemedText>
        </View>
        <ThemedText style={styles.coordsText} type="small">
          {fmtCoords(hero.coords)}
        </ThemedText>
        <Waveform
          seed={`${hero.slug}-rest-radar`}
          bars={28}
          fade={0.25}
          height={16}
          color={Colors.light.violet}
          style={{ marginTop: 6 }}
        />
      </View>

      <View style={styles.footerRow}>
        <ThemedText style={styles.endStatus} type="small">
          {hero.end.label}: {fmtLong(hero.end.date)}
        </ThemedText>
        <View style={styles.viewLink}>
          <ThemedText style={styles.viewLinkText}>Profile</ThemedText>
          <Ionicons name="arrow-forward" size={13} color={Colors.light.violet} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.light.line,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: Colors.light.violet,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: "#fafafc",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0c0a22",
  },
  statusDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  marsDot: {
    backgroundColor: Colors.light.mars,
  },
  moonDot: {
    backgroundColor: Colors.light.violet,
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
    fontSize: 11,
  },
  designation: {
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 9,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
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
    flex: 1,
  },
  coordsText: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    paddingLeft: 21,
    fontSize: 11,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 2,
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
