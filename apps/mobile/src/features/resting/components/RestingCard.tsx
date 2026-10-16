import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { fmtCoords, fmtLong, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function RestingCard({ hero }: Props) {
  const router = useRouter();
  const isMars = hero.body === "mars";

  return (
    <Pressable
      onPress={() => router.push(`/heroes/${hero.slug}` as any)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.name} type="subtitle">
          {hero.name}
        </ThemedText>
        <View style={[styles.badge, isMars ? styles.marsBadge : styles.moonBadge]}>
          <ThemedText style={styles.badgeText} type="small">
            {isMars ? "Mars" : "Moon"}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.restingPlace} type="small">
        📍 {hero.restingPlace}
      </ThemedText>

      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <ThemedText style={styles.detailLabel} type="small">Coordinates</ThemedText>
          <ThemedText style={styles.detailValue} type="small">{fmtCoords(hero.coords)}</ThemedText>
        </View>

        <View style={styles.detailBox}>
          <ThemedText style={styles.detailLabel} type="small">Final Status</ThemedText>
          <ThemedText style={styles.detailValue} type="small" numberOfLines={1}>
            {hero.end.label} ({fmtLong(hero.end.date)})
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
    padding: 14,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  marsBadge: {
    backgroundColor: "#ffece5",
  },
  moonBadge: {
    backgroundColor: "#ece7ff",
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 11,
  },
  restingPlace: {
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
  },
  detailBox: {
    flex: 1,
  },
  detailLabel: {
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
  detailValue: {
    fontWeight: "600",
    marginTop: 1,
  },
});
