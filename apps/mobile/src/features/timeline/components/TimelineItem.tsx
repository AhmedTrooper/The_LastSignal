import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { catNo, fmtLong, lifespan, portrait, assetUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
  isLast: boolean;
  launchYear: string;
}

const fy = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return y + (m - 1) / 12 + (d - 1) / 365;
};

function served(h: Hero) {
  const a = fy(h.landing?.date ?? h.launch.date);
  const b = fy(h.end.date);
  const years = b - a;
  if (years >= 1) {
    return `${Math.floor(years)}${years % 1 > 0.05 ? "+" : ""} yr${Math.floor(years) === 1 && years % 1 <= 0.05 ? "" : "s"}`;
  }
  const months = Math.round(years * 12);
  if (months >= 1) return `${months} mo${months === 1 ? "" : "s"}`;
  return `${Math.max(1, Math.round(years * 365))} days`;
}

export function TimelineItem({ hero, isLast, launchYear }: Props) {
  const router = useRouter();
  const avatarUrl = assetUrl(`images/${portrait(hero)}.jpg`);
  const isMars = hero.body === "mars";
  const duration = served(hero);

  const handlePress = () => {
    haptic.light();
    router.push(`/heroes/${hero.slug}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`View mission timeline for ${hero.name}, launched ${launchYear}`}
    >
      {/* Timeline Track Column */}
      <View style={styles.trackCol}>
        <View style={styles.yearPill}>
          <ThemedText style={styles.yearText} type="small">
            {launchYear}
          </ThemedText>
        </View>

        <View style={styles.avatarBorder}>
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
          <View style={[styles.bodyDot, isMars ? styles.marsDot : styles.moonDot]} />
        </View>

        {!isLast && <View style={styles.trackLine} />}
      </View>

      {/* Elevated Content Bento Card */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.titleCol}>
            <View style={styles.nameRow}>
              <ThemedText style={styles.name}>{hero.name}</ThemedText>
              <ThemedText style={styles.cat} type="small">
                {catNo(hero.no)}
              </ThemedText>
            </View>
            <ThemedText style={styles.yearsText} type="small">
              {lifespan(hero)}
            </ThemedText>
          </View>

          <View
            style={[
              styles.durationBadge,
              isMars ? styles.marsBadge : styles.moonBadge,
            ]}
          >
            <Ionicons
              name={isMars ? "planet" : "moon"}
              size={11}
              color={isMars ? Colors.light.mars : Colors.light.violet}
            />
            <ThemedText
              style={[
                styles.durationText,
                isMars ? styles.marsText : styles.moonText,
              ]}
            >
              {duration}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.summary} numberOfLines={2} type="small">
          {hero.summary}
        </ThemedText>

        <View style={styles.metaBox}>
          <View style={styles.endRow}>
            <ThemedText style={styles.endLabel} type="small">
              {hero.end.label.toUpperCase()} ·{" "}
            </ThemedText>
            <ThemedText style={styles.endDate} type="small">
              {fmtLong(hero.end.date)}
            </ThemedText>
          </View>

          <View style={styles.locRow}>
            <Ionicons name="location" size={13} color={Colors.light.violet} />
            <ThemedText style={styles.restingText} numberOfLines={1} type="small">
              {hero.restingPlace}
            </ThemedText>
          </View>

          <Waveform
            seed={`${hero.slug}-timeline`}
            bars={26}
            height={14}
            fade={0.25}
            color={Colors.light.violet}
            style={{ marginTop: 6 }}
          />
        </View>

        <View style={styles.cardFooter}>
          <ThemedText style={styles.viewLinkText} type="small">
            Inspect Mission Telemetry
          </ThemedText>
          <Ionicons name="arrow-forward" size={12} color={Colors.light.violet} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  trackCol: {
    alignItems: "center",
    width: 48,
  },
  yearPill: {
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.line,
    marginBottom: 4,
  },
  yearText: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light.textSecondary,
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#070814",
    position: "relative",
    borderWidth: 2,
    borderColor: Colors.light.violet,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  bodyDot: {
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
  trackLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
    borderRadius: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
    marginBottom: 14,
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
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
    fontSize: 17,
    fontWeight: "800",
  },
  cat: {
    color: Colors.light.textSecondary,
    fontFamily: "monospace",
    fontSize: 11,
  },
  yearsText: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "600",
    fontSize: 11,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    fontSize: 12,
  },
  metaBox: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 14,
    gap: 4,
    marginTop: 2,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  endRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  endLabel: {
    fontWeight: "700",
    color: Colors.light.violet,
    fontSize: 11,
  },
  endDate: {
    color: Colors.light.text,
    fontSize: 11,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  restingText: {
    color: Colors.light.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    paddingTop: 2,
  },
  viewLinkText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.light.violet,
  },
});
