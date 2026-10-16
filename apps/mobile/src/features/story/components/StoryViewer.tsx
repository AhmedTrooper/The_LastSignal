import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
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

  const safeIndex = scenes.length > 0 ? Math.min(Math.max(0, currentIndex), scenes.length - 1) : 0;
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
    haptic.light();
    setCurrentIndex(0);
    router.replace(`/heroes/${next.slug}/story`);
  };

  if (!currentScene) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <ThemedText style={styles.sceneTitle}>No scenes available</ThemedText>
        <Pressable onPress={() => router.back()} style={[styles.navBtn, { marginTop: 16 }]}>
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
      {/* Background Media */}
      {currentScene.mode === "black" ? (
        <View style={[styles.backdrop, styles.blackBackdrop]} />
      ) : currentScene.mode === "space" ? (
        <View style={[styles.backdrop, styles.spaceBackdrop]}>
          <ThemedText style={styles.spaceNote} type="small">★ Six months across the dark ★</ThemedText>
        </View>
      ) : (
        <Image
          source={{ uri: currentImg }}
          style={styles.backdrop}
          contentFit="cover"
          transition={500}
        />
      )}

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Top Bar: Progress and Close */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
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
            <ThemedText style={styles.heroBadgeText} type="small">
              {catNo(hero.no)} · {hero.name} ({safeIndex + 1}/{scenes.length})
            </ThemedText>
          </View>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.btnPressed]}
          >
            <Ionicons name="close" size={22} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      {/* Main Touch Controls (Left for prev, Right for next) */}
      <View style={styles.tapControls}>
        <Pressable style={styles.tapArea} onPress={handlePrev} />
        <Pressable style={styles.tapArea} onPress={handleNext} />
      </View>

      {/* Bottom Content Card */}
      <View style={[styles.bottomCard, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
        {currentScene.date && (
          <ThemedText style={styles.sceneDate} type="small">
            {currentScene.date}
          </ThemedText>
        )}

        <ThemedText style={styles.sceneTitle}>{currentScene.title}</ThemedText>
        <ThemedText style={styles.sceneText}>{currentScene.text}</ThemedText>

        {/* Counter if available */}
        {currentScene.count && (
          <View style={styles.countBadge}>
            <ThemedText style={styles.countNumber}>
              {currentScene.count.to} {currentScene.count.unit}
            </ThemedText>
            <ThemedText style={styles.countLabel} type="small">{currentScene.count.label}</ThemedText>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navButtonsRow}>
          <Pressable
            onPress={handlePrev}
            disabled={isFirst}
            style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
          >
            <Ionicons name="arrow-back" size={18} color={isFirst ? "rgba(255,255,255,0.3)" : "#ffffff"} />
            <ThemedText style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}>Previous</ThemedText>
          </Pressable>

          {isLast ? (
            <Pressable onPress={handleNextHero} style={[styles.navBtn, styles.navBtnPrimary]}>
              <ThemedText style={styles.navBtnPrimaryText}>Next: {next.name}</ThemedText>
              <Ionicons name="arrow-forward" size={18} color="#0c0a22" />
            </Pressable>
          ) : (
            <Pressable onPress={handleNext} style={[styles.navBtn, styles.navBtnPrimary]}>
              <ThemedText style={styles.navBtnPrimaryText}>Next Scene</ThemedText>
              <Ionicons name="arrow-forward" size={18} color="#0c0a22" />
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
    backgroundColor: "#0c0a22",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  blackBackdrop: {
    backgroundColor: "#000000",
  },
  spaceBackdrop: {
    backgroundColor: "#050410",
    alignItems: "center",
    justifyContent: "center",
  },
  spaceNote: {
    color: "#a78bfa",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(12, 10, 34, 0.5)",
  },
  topBar: {
    paddingHorizontal: 16,
    zIndex: 20,
    gap: 12,
  },
  progressRow: {
    flexDirection: "row",
    gap: 4,
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
    backgroundColor: "rgba(12, 10, 34, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  heroBadgeText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(12, 10, 34, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  btnPressed: {
    opacity: 0.8,
  },
  tapControls: {
    ...StyleSheet.absoluteFill,
    flexDirection: "row",
    zIndex: 10,
  },
  tapArea: {
    flex: 1,
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(12, 10, 34, 0.92)",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 20,
    gap: 8,
  },
  sceneDate: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
  },
  sceneTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
  },
  sceneText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    lineHeight: 22,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    backgroundColor: "rgba(91, 46, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(91, 46, 255, 0.4)",
  },
  countNumber: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 15,
    fontWeight: "800",
  },
  countLabel: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontSize: 11,
  },
  navButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    gap: 12,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  navBtnDisabled: {
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  navBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
  navBtnTextDisabled: {
    color: "rgba(255, 255, 255, 0.3)",
  },
  navBtnPrimary: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  navBtnPrimaryText: {
    color: "#0c0a22",
    fontWeight: "700",
    fontSize: 13,
  },
});
