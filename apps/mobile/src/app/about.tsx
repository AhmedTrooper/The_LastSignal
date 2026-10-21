import { useState } from "react";
import {
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { HEROES } from "@thelastsignal/data";

const RULES = [
  {
    icon: "shield-checkmark-outline" as const,
    title: "Facts Only",
    text: "Every date, sol count, coordinate, and final transmission comes from official NASA, JPL, and agency mission logs. We never invent quotes.",
  },
  {
    icon: "camera-outline" as const,
    title: "Real Space Imagery",
    text: "We use public-domain photography from NASA's Planetary Data System and mission image archives, fully attributed and credited one by one.",
  },
  {
    icon: "planet-outline" as const,
    title: "Independent Memorial",
    text: "The Last Signal is an independent educational space tribute built for humanity, carrying no commercial or agency advertising.",
  },
  {
    icon: "sparkles-outline" as const,
    title: "AI Is Explicitly Labelled",
    text: "Narration or reconstructive imagery produced with AI is always clearly marked as such, and is grounded strictly in historical telemetry records.",
  },
];

export default function AboutScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.light.violet}
          colors={[Colors.light.violet]}
        />
      }
    >
      {/* Top Manifesto Header */}
      <View style={styles.header}>
        <View style={styles.eyebrowRow}>
          <View style={styles.beaconDot} />
          <ThemedText style={styles.eyebrow} type="small">
            THE LAST SIGNAL MANIFESTO
          </ThemedText>
        </View>

        <ThemedText style={styles.title} type="title">
          They had names, birthdays, and last words,{"\n"}
          <ThemedText style={styles.titleViolet} type="title">
            just like us.
          </ThemedText>
        </ThemedText>

        <Waveform
          seed="about-manifesto"
          bars={38}
          fade={0.3}
          height={22}
          color={Colors.light.violet}
          style={{ marginTop: 10 }}
        />
      </View>

      {/* Lead Narrative Card */}
      <View style={styles.leadCard}>
        <ThemedText style={styles.leadText}>
          Rovers, landers, and probes went where humans could not, and they never returned. Their active missions are over, but their physical monuments remain permanently in place on the iron plains of Mars and the vacuum dust of the Moon.
        </ThemedText>
        <ThemedText style={styles.leadText}>
          We remember them the way we remember great explorers: where they were assembled, the life they lived, the milestones they uncovered, and their final signal transmitted back home to Earth.
        </ThemedText>
      </View>

      {/* 4-Bento Telemetry Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <ThemedText style={styles.statNumber}>{HEROES.length}</ThemedText>
          <ThemedText style={styles.statLabel} type="small">
            Pioneer Machines
          </ThemedText>
        </View>

        <View style={styles.statBox}>
          <ThemedText style={styles.statNumber}>60 Yrs</ThemedText>
          <ThemedText style={styles.statLabel} type="small">
            Exploration Span
          </ThemedText>
        </View>

        <View style={styles.statBox}>
          <ThemedText style={styles.statNumber}>2 Worlds</ThemedText>
          <ThemedText style={styles.statLabel} type="small">
            Mars &amp; The Moon
          </ThemedText>
        </View>

        <View style={styles.statBox}>
          <ThemedText style={styles.statNumber}>100%</ThemedText>
          <ThemedText style={styles.statLabel} type="small">
            Public Domain Facts
          </ThemedText>
        </View>
      </View>

      {/* Ground Rules Section */}
      <View style={styles.rulesSection}>
        <View style={styles.rulesHeaderRow}>
          <Ionicons name="document-text-outline" size={18} color={Colors.light.violet} />
          <ThemedText style={styles.rulesHeading} type="subtitle">
            Archival Ground Rules
          </ThemedText>
        </View>

        {RULES.map((r, i) => (
          <Pressable
            key={r.title}
            onPress={() => haptic.light()}
            style={({ pressed }) => [
              styles.ruleCard,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={styles.ruleNumberBadge}>
              <Ionicons name={r.icon} size={16} color="#ffffff" />
            </View>
            <View style={styles.ruleContent}>
              <View style={styles.ruleTitleRow}>
                <ThemedText style={styles.ruleTitle}>{r.title}</ThemedText>
                <ThemedText style={styles.ruleIndex} type="small">
                  0{i + 1}
                </ThemedText>
              </View>
              <ThemedText style={styles.ruleText} type="small">
                {r.text}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Legal & Account Deletion (Google Play Compliance) */}
      <View style={styles.legalSection}>
        <View style={styles.rulesHeaderRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color={Colors.light.violet} />
          <ThemedText style={styles.rulesHeading} type="subtitle">
            Legal & Account Data
          </ThemedText>
        </View>
        <View style={styles.legalLinksRow}>
          <Pressable
            onPress={() => {
              haptic.light();
              router.push("/login" as any);
            }}
            style={({ pressed }) => [styles.legalButton, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open Account and Sign In screen"
          >
            <ThemedText style={styles.legalButtonText} type="small">
              Explorer Account & Sign In
            </ThemedText>
            <Ionicons name="person-circle-outline" size={15} color={Colors.light.violet} />
          </Pressable>

          <Pressable
            onPress={() => {
              haptic.light();
              router.push("/privacy" as any);
            }}
            style={({ pressed }) => [styles.legalButton, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open Privacy Policy screen"
          >
            <ThemedText style={styles.legalButtonText} type="small">
              Privacy Policy
            </ThemedText>
            <Ionicons name="document-text-outline" size={14} color={Colors.light.violet} />
          </Pressable>

          <Pressable
            onPress={() => {
              haptic.light();
              router.push("/terms" as any);
            }}
            style={({ pressed }) => [styles.legalButton, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open Terms of Service screen"
          >
            <ThemedText style={styles.legalButtonText} type="small">
              Terms of Service
            </ThemedText>
            <Ionicons name="document-text-outline" size={14} color={Colors.light.violet} />
          </Pressable>

          <Pressable
            onPress={() => {
              haptic.light();
              router.push("/delete-account" as any);
            }}
            style={({ pressed }) => [styles.legalButton, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open Account and Data Deletion screen"
          >
            <ThemedText style={styles.legalButtonText} type="small">
              Delete Account & Data
            </ThemedText>
            <Ionicons name="trash-outline" size={14} color="#e11d48" />
          </Pressable>
        </View>
      </View>

      {/* App Metadata & Action Footer */}
      <View style={styles.footerCard}>
        <View style={styles.versionRow}>
          <ThemedText style={styles.versionLabel} type="small">
            BUILD
          </ThemedText>
          <ThemedText style={styles.versionText} type="small">
            v1.0.0 (Production Release)
          </ThemedText>
        </View>

        <Pressable
          onPress={() => {
            haptic.light();
            router.push("/" as any);
          }}
          style={({ pressed }) => [
            styles.exploreBtn,
            pressed && styles.cardPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Return to memorial fleet on home screen"
        >
          <Ionicons name="planet" size={16} color="#ffffff" />
          <ThemedText style={styles.exploreBtnText}>
            Explore The Memorial Fleet
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  header: {
    gap: 6,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.violet,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 32,
  },
  titleViolet: {
    color: Colors.light.violet,
    fontSize: 26,
    fontWeight: "900",
  },
  leadCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  leadText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.text,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fafafc",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.light.violet,
    fontFamily: "monospace",
  },
  statLabel: {
    color: Colors.light.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  rulesSection: {
    gap: 10,
    marginTop: 4,
  },
  rulesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  rulesHeading: {
    fontSize: 18,
    fontWeight: "800",
  },
  ruleCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  ruleNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.violet,
    alignItems: "center",
    justifyContent: "center",
  },
  ruleContent: {
    flex: 1,
    gap: 4,
  },
  ruleTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ruleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.light.text,
  },
  ruleIndex: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "700",
  },
  ruleText: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
    fontSize: 13,
  },
  footerCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
    marginTop: 4,
  },
  versionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  versionLabel: {
    fontFamily: "monospace",
    color: Colors.light.textSecondary,
    fontWeight: "700",
    fontSize: 11,
  },
  versionText: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "700",
    fontSize: 11,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    paddingVertical: 12,
    borderRadius: 14,
  },
  exploreBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  legalSection: {
    gap: 12,
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  legalLinksRow: {
    gap: 8,
  },
  legalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  legalButtonText: {
    fontWeight: "600",
    color: Colors.light.text,
  },
});
