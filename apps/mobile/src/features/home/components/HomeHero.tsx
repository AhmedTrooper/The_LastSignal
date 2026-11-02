import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { assetUrl } from "@thelastsignal/data";
import { haptic } from "@/utils/haptics";

interface HomeHeroProps {
  onMeetHeroesPress: () => void;
}

export function HomeHero({ onMeetHeroesPress }: HomeHeroProps) {
  const familyImageUrl = assetUrl("images/hero-family.webp");
  const beaconScale = useSharedValue(1);
  const beaconOpacity = useSharedValue(0.8);

  useEffect(() => {
    beaconScale.value = withRepeat(
      withTiming(2.2, { duration: 1800, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    beaconOpacity.value = withRepeat(
      withTiming(0, { duration: 1800, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, [beaconScale, beaconOpacity]);

  const animatedBeaconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: beaconScale.value }],
    opacity: beaconOpacity.value,
  }));

  const handleMeet = () => {
    haptic.light();
    onMeetHeroesPress();
  };

  const handleGames = () => {
    haptic.light();
    router.push("/games" as any);
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.heroCard}>
        {/* Live Telemetry Pill */}
        <View style={styles.badgeRow}>
          <View style={styles.beaconWrap}>
            <Animated.View style={[styles.beaconWave, animatedBeaconStyle]} />
            <View style={styles.beaconDot} />
          </View>
          <ThemedText style={styles.badgeText} type="small">
            LIVE TELEMETRY · 48 ACTIVE MEMORIALS
          </ThemedText>
        </View>

        {/* Editorial Heading */}
        <View style={styles.titleWrap}>
          <ThemedText style={styles.title}>
            Their mission ended.{"\n"}
            <ThemedText style={styles.titleGradient}>Their story didn&apos;t.</ThemedText>
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Commemorating humanity&apos;s robotic explorers resting on Mars, Venus, the Moon and across the stars.
          </ThemedText>
        </View>

        {/* Tactile Native Mission Stats */}
        <View style={styles.statsBar}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNum}>48</ThemedText>
            <ThemedText style={styles.statLabel} type="small">Spacecraft</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statNum}>12</ThemedText>
            <ThemedText style={styles.statLabel} type="small">Worlds</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statNum}>54y</ThemedText>
            <ThemedText style={styles.statLabel} type="small">Furthest Signal</ThemedText>
          </View>
        </View>

        {/* Book-First Featured Primary CTA */}
        <Pressable
          onPress={() => {
            haptic.light();
            router.push("/book" as any);
          }}
          style={({ pressed }) => [styles.bookFeatureCta, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Read the 58-page Living Story Book"
        >
          <View style={styles.bookFeatureIconWrap}>
            <Ionicons name="book" size={18} color="#0d0f22" />
          </View>
          <View style={styles.bookFeatureTextWrap}>
            <ThemedText style={styles.bookFeatureTitle}>
              📖 The Living Story Book
            </ThemedText>
            <ThemedText style={styles.bookFeatureSubtitle}>
              58 Illustrated Pages & Telemetry · Read Now
            </ThemedText>
          </View>
          <Ionicons name="arrow-forward-circle" size={22} color="#f5a623" />
        </Pressable>

        {/* Dual Native CTAs */}
        <View style={styles.ctaRow}>
          <Pressable
            onPress={handleMeet}
            style={({ pressed }) => [styles.primaryCta, pressed && styles.btnPressed]}
          >
            <ThemedText style={styles.primaryCtaText}>Meet Heroes</ThemedText>
            <Ionicons name="arrow-down-circle" size={18} color="#ffffff" />
          </Pressable>

          <Pressable
            onPress={handleGames}
            style={({ pressed }) => [styles.secondaryCta, pressed && styles.btnPressed]}
          >
            <Ionicons name="game-controller" size={18} color={Colors.light.violet} />
            <ThemedText style={styles.secondaryCtaText}>Simulators</ThemedText>
          </Pressable>
        </View>

        {/* Spacecraft Family Visual */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: familyImageUrl }}
            style={styles.image}
            contentFit="contain"
            priority="high"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
  },
  heroCard: {
    backgroundColor: "#0d0f22",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    overflow: "hidden",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  beaconWrap: {
    width: 10,
    height: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  beaconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#38bdf8",
  },
  beaconWave: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#38bdf8",
  },
  badgeText: {
    color: "#e2e8f0",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  titleWrap: {
    gap: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  titleGradient: {
    color: "#c084fc",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  /* Book Feature CTA Styles */
  bookFeatureCta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 166, 35, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(245, 166, 35, 0.5)",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 12,
  },
  bookFeatureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5a623",
    alignItems: "center",
    justifyContent: "center",
  },
  bookFeatureTextWrap: {
    flex: 1,
  },
  bookFeatureTitle: {
    color: "#f4ede0",
    fontSize: 14,
    fontWeight: "800",
  },
  bookFeatureSubtitle: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 1,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  primaryCta: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryCtaText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryCta: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  secondaryCtaText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  imageCard: {
    width: "100%",
    aspectRatio: 3 / 2,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
