import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import {
  STORIES,
  catNo,
  portrait,
  storyChapters,
  nextHero,
  assetUrl,
  type Hero,
  type Chapter,
} from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

interface DisplayScene {
  id: string;
  year?: string | number;
  date?: string;
  title: string;
  text: string;
  image?: string;
  mode?: "zoom" | "frame" | "space" | "black";
  count?: { from: number; to: number; decimals: number; unit: string; label: string };
  note?: string;
}

export function StoryViewer({ hero }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const film = STORIES[hero.slug];
  const chapters: Chapter[] = storyChapters(hero);

  const scenes: DisplayScene[] = film
    ? film.scenes.map((s) => ({
        id: s.id,
        year: s.year,
        date: s.date,
        title: s.title,
        text: s.text,
        image: s.image,
        mode: s.mode,
        count: s.count,
        note: s.note,
      }))
    : chapters.map((c, i) => ({
        id: `ch-${i}`,
        year: c.year,
        date: c.year,
        title: c.title,
        text: c.text,
        image: c.image,
      }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const safeIndex =
    scenes.length > 0 ? Math.min(Math.max(0, currentIndex), scenes.length - 1) : 0;
  const currentScene = scenes[safeIndex];
  const next = nextHero(hero);

  const isFirst = safeIndex === 0;
  const isLast = safeIndex === scenes.length - 1;

  const handleNext = () => {
    if (!isLast) {
      haptic.light();
      setCurrentIndex((prev) => Math.min(prev + 1, scenes.length - 1));
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      haptic.light();
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleNextHero = () => {
    haptic.success();
    setCurrentIndex(0);
    router.replace(`/heroes/${next.slug}/story` as any);
  };

  if (!currentScene) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.sceneTitle}>No scenes available</ThemedText>
        <Pressable onPress={() => router.back()} style={styles.navBtn}>
          <ThemedText style={styles.navBtnText}>Go Back</ThemedText>
        </Pressable>
      </View>
    );
  }

  const currentImg = currentScene.image
    ? assetUrl(`images/${currentScene.image}.jpg`)
    : assetUrl(`images/${portrait(hero)}.jpg`);

  return (
    <View style={styles.container}>
      {/* Background Cinematic Visual */}
      {currentScene.mode === "black" ? (
        <View style={[styles.backdrop, styles.blackBackdrop]} />
      ) : currentScene.mode === "space" ? (
        <View style={[styles.backdrop, styles.spaceBackdrop]}>
          <ThemedText style={styles.spaceNote} type="small">
            ★ Across the deep space void ★
          </ThemedText>
        </View>
      ) : (
        <Image
          source={{ uri: currentImg }}
          style={styles.backdrop}
          contentFit="cover"
          transition={400}
        />
      )}

      {/* Atmospheric Vignette & Contrast Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Top Floating App Bar: Progress Bars + Machine Pill + Close Button */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        {/* Segmented Story Progress Bars (Instagram/Snapchat style) */}
        <View style={styles.progressRow}>
          {scenes.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.progressBar,
                idx === safeIndex && styles.progressBarActive,
                idx < safeIndex && styles.progressBarDone,
              ]}
            />
          ))}
        </View>

        <View style={styles.topActions}>
          <View style={styles.heroBadge}>
            <View style={styles.beaconDot} />
            <ThemedText style={styles.heroBadgeText} type="small">
              {catNo(hero.no)} · {hero.name} ({safeIndex + 1}/{scenes.length})
            </ThemedText>
          </View>

          <Pressable
            onPress={() => {
              haptic.light();
              router.back();
            }}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && styles.btnPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Close story"
          >
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      {/* Gesture Tap Areas (Left for Previous, Right for Next) */}
      <View style={styles.tapControls} pointerEvents="box-none">
        <Pressable
          style={styles.tapAreaLeft}
          onPress={handlePrev}
          accessibilityLabel="Previous scene"
        />
        <Pressable
          style={styles.tapAreaRight}
          onPress={handleNext}
          accessibilityLabel="Next scene"
        />
      </View>

      {/* Bottom Floating Narrative Sheet */}
      <View
        style={[
          styles.bottomCard,
          { paddingBottom: Math.max(insets.bottom + 16, 28) },
        ]}
      >
        <View style={styles.narrativeHeader}>
          {currentScene.date && (
            <ThemedText style={styles.sceneDate} type="small">
              {currentScene.date.toUpperCase()}
            </ThemedText>
          )}

          <ThemedText style={styles.sceneTitle}>
            {currentScene.title}
          </ThemedText>
        </View>

        <ThemedText style={styles.sceneText}>
          {currentScene.text}
        </ThemedText>

        {/* Carrier Waveform Simulator */}
        <Waveform
          seed={`${hero.slug}-story-${safeIndex}`}
          bars={34}
          fade={0.3}
          color="#a78bfa"
          height={16}
          style={{ marginVertical: 4 }}
        />

        {/* Metric Counter Badge if Scene Contains Numbers */}
        {currentScene.count && (
          <View style={styles.countBadge}>
            <Ionicons name="sparkles" size={12} color="#a78bfa" />
            <ThemedText style={styles.countNumber}>
              {currentScene.count.to} {currentScene.count.unit}
            </ThemedText>
            <ThemedText style={styles.countLabel} type="small">
              {currentScene.count.label}
            </ThemedText>
          </View>
        )}

        {/* Bottom Navigation Buttons */}
        <View style={styles.navButtonsRow}>
          <Pressable
            onPress={handlePrev}
            disabled={isFirst}
            style={({ pressed }) => [
              styles.navBtn,
              isFirst && styles.navBtnDisabled,
              pressed && !isFirst && styles.btnPressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={16}
              color={isFirst ? "rgba(255,255,255,0.25)" : "#ffffff"}
            />
            <ThemedText
              style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}
            >
              Previous
            </ThemedText>
          </Pressable>

          {isLast ? (
            <Pressable
              onPress={handleNextHero}
              style={({ pressed }) => [
                styles.navBtn,
                styles.navBtnPrimary,
                pressed && styles.btnPressed,
              ]}
            >
              <ThemedText style={styles.navBtnPrimaryText}>
                Next Explorer: {next.name}
              </ThemedText>
              <Ionicons name="arrow-forward" size={16} color="#070814" />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.navBtn,
                styles.navBtnPrimary,
                pressed && styles.btnPressed,
              ]}
            >
              <ThemedText style={styles.navBtnPrimaryText}>
                Advance Chapter
              </ThemedText>
              <Ionicons name="arrow-forward" size={16} color="#070814" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070814",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#070814",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  blackBackdrop: {
    backgroundColor: "#000000",
  },
  spaceBackdrop: {
    backgroundColor: "#04050e",
    alignItems: "center",
    justifyContent: "center",
  },
  spaceNote: {
    color: "#a78bfa",
    fontFamily: "monospace",
    letterSpacing: 2,
    fontSize: 12,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(7, 8, 20, 0.52)",
  },
  topBar: {
    paddingHorizontal: 16,
    zIndex: 30,
    gap: 10,
  },
  progressRow: {
    flexDirection: "row",
    gap: 3,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  progressBarActive: {
    backgroundColor: Colors.light.violet,
  },
  progressBarDone: {
    backgroundColor: "#ffffff",
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(7, 8, 20, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  heroBadgeText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "700",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(7, 8, 20, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  tapControls: {
    ...StyleSheet.absoluteFill,
    flexDirection: "row",
    zIndex: 10,
  },
  tapAreaLeft: {
    width: "35%",
    height: "70%",
  },
  tapAreaRight: {
    width: "65%",
    height: "70%",
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(7, 8, 20, 0.94)",
    paddingHorizontal: 20,
    paddingTop: 18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    zIndex: 25,
    gap: 8,
  },
  narrativeHeader: {
    gap: 2,
  },
  sceneDate: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  sceneTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  sceneText: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 13,
    lineHeight: 21,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(124, 58, 237, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.45)",
    marginTop: 2,
  },
  countNumber: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "800",
  },
  countLabel: {
    color: "#c4b5fd",
    fontSize: 11,
    fontWeight: "600",
  },
  navButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  navBtnDisabled: {
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  navBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  navBtnTextDisabled: {
    color: "rgba(255, 255, 255, 0.25)",
  },
  navBtnPrimary: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  navBtnPrimaryText: {
    color: "#070814",
    fontWeight: "800",
    fontSize: 12,
  },
});
