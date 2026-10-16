import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { catNo, fmtLong, lifespan, portrait, assetUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
  isLast: boolean;
}

const fy = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return y + (m - 1) / 12 + (d - 1) / 365;
};

function served(h: Hero) {
  const a = fy(h.landing?.date ?? h.launch.date);
  const b = fy(h.end.date);
  const years = b - a;
  if (years >= 1) return `${Math.floor(years)}${years % 1 > 0.05 ? "+" : ""} year${Math.floor(years) === 1 && years % 1 <= 0.05 ? "" : "s"}`;
  const months = Math.round(years * 12);
  if (months >= 1) return `${months} month${months === 1 ? "" : "s"}`;
  return `${Math.max(1, Math.round(years * 365))} days`;
}

export function TimelineItem({ hero, isLast }: Props) {
  const router = useRouter();
  const avatarUrl = assetUrl(`images/${portrait(hero)}.jpg`);
  const isMars = hero.body === "mars";
  const duration = served(hero);

  return (
    <Pressable
      onPress={() => router.push(`/heroes/${hero.slug}` as any)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {/* Timeline track and node */}
      <View style={styles.trackCol}>
        <View style={styles.avatarBorder}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
        </View>
        {!isLast && <View style={styles.trackLine} />}
      </View>

      {/* Content Card */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.titleCol}>
            <View style={styles.nameRow}>
              <ThemedText style={styles.name}>{hero.name}</ThemedText>
              <ThemedText style={styles.cat} type="small">{catNo(hero.no)}</ThemedText>
            </View>
            <ThemedText style={styles.yearsText} type="small">{lifespan(hero)}</ThemedText>
          </View>
          <View style={[styles.durationBadge, isMars ? styles.marsBadge : styles.moonBadge]}>
            <ThemedText style={[styles.durationText, isMars ? styles.marsText : styles.moonText]}>
              {duration}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.summary} numberOfLines={2} type="small">
          {hero.summary}
        </ThemedText>

        <View style={styles.metaBox}>
          <ThemedText style={styles.endInfo} type="small">
            <ThemedText style={styles.endLabel} type="small">{hero.end.label}: </ThemedText>
            {fmtLong(hero.end.date)}
          </ThemedText>
          <ThemedText style={styles.restingText} numberOfLines={1} type="small">
            📍 {hero.restingPlace}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  pressed: {
    opacity: 0.9,
  },
  trackCol: {
    alignItems: "center",
    width: 44,
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.light.violet,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  trackLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.light.line,
    marginVertical: 4,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.line,
    marginBottom: 16,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleCol: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
  },
  cat: {
    color: Colors.light.textSecondary,
    fontFamily: "monospace",
  },
  yearsText: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "600",
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  marsBadge: {
    backgroundColor: "#fff0ea",
  },
  moonBadge: {
    backgroundColor: "#edeaff",
  },
  durationText: {
    fontSize: 11,
    fontWeight: "800",
  },
  marsText: {
    color: Colors.light.mars,
  },
  moonText: {
    color: Colors.light.violet,
  },
  summary: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  metaBox: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 10,
    borderRadius: 12,
    gap: 2,
    marginTop: 2,
  },
  endInfo: {
    color: Colors.light.text,
  },
  endLabel: {
    fontWeight: "700",
    color: Colors.light.text,
  },
  restingText: {
    color: Colors.light.textSecondary,
  },
});
