import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useHero } from "@/features/heroes/hooks/useHeroes";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { HeroSpecs } from "@/features/heroes/components/HeroSpecs";
import { HeroSignature } from "@/features/heroes/components/profile/HeroSignature";
import { HeroJourney } from "@/features/heroes/components/profile/HeroJourney";
import { HeroLife } from "@/features/heroes/components/profile/HeroLife";
import { HeroWiki } from "@/features/heroes/components/profile/HeroWiki";
import { HeroMedia } from "@/features/heroes/components/profile/HeroMedia";
import { HeroGallery } from "@/features/heroes/components/profile/HeroGallery";
import { HeroTwin } from "@/features/heroes/components/profile/HeroTwin";
import { HeroModelSection } from "@/features/heroes/components/profile/HeroModelSection";
import { HeroProfileTributes } from "@/features/heroes/components/profile/HeroProfileTributes";
import { HeroFilmBanner } from "@/features/heroes/components/profile/HeroFilmBanner";
import { HeroExplore } from "@/features/heroes/components/profile/HeroExplore";
import {
  LAYOUTS,
  SECTION_LABEL,
  catNo,
  fmtCoords,
  fmtLong,
  lifespan,
  portrait,
  assetUrl,
  type SectionId,
} from "@thelastsignal/data";

const STAT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  route: "navigate-outline",
  timer: "time-outline",
  calendar: "calendar-outline",
  spark: "flash-outline",
};

export default function HeroDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();
  const hero = useHero(slug ?? "");
  const isFav = useFavoritesStore((s) => s.isFavorite(slug ?? ""));
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite);

  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState<string>("model");

  if (!hero) {
    return (
      <View style={styles.center}>
        <ThemedText type="subtitle">Hero not found</ThemedText>
      </View>
    );
  }

  const isCutout = Boolean(hero.card);
  const imageUrl = isCutout
    ? assetUrl(`images/${hero.card}.webp`)
    : assetUrl(`images/${portrait(hero)}.jpg`);

  const layoutOrder = LAYOUTS[hero.slug] ?? [
    "model",
    "signature",
    "life",
    "journey",
    "lost",
    "wiki",
    "videos",
    "gallery",
    "twin",
    "tributes",
    "explore",
  ];

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case "model":
        return <HeroModelSection key="model" hero={hero} />;
      case "film":
        return <HeroFilmBanner key="film" hero={hero} />;
      case "signature":
        return <HeroSignature key="signature" hero={hero} />;
      case "life":
        return <HeroLife key="life" hero={hero} />;
      case "journey":
        return <HeroJourney key="journey" hero={hero} />;
      case "lost":
        return (
          <View key="lost" style={[styles.card, styles.lastSignalCard]}>
            <View style={styles.lostHeader}>
              <ThemedText style={styles.lostEyebrow} type="small">LAST SIGNAL</ThemedText>
              <ThemedText style={styles.lastSignalTitle} type="subtitle">
                {hero.end.label} · {fmtLong(hero.end.date)}
              </ThemedText>
            </View>
            <ThemedText style={styles.lastSignalStory}>{hero.end.story}</ThemedText>
            <View style={styles.lostFooter}>
              <ThemedText style={styles.lostCoords} type="small">
                📍 {hero.restingPlace} ({fmtCoords(hero.coords)})
              </ThemedText>
            </View>
          </View>
        );
      case "wiki":
        return <HeroWiki key="wiki" hero={hero} />;
      case "videos":
        return <HeroMedia key="media" hero={hero} />;
      case "news":
      case "eyes":
      case "documentary":
        return null;
      case "gallery":
        return <HeroGallery key="gallery" hero={hero} />;
      case "twin":
        return <HeroTwin key="twin" hero={hero} />;
      case "tributes":
        return <HeroProfileTributes key="tributes" hero={hero} />;
      case "explore":
        return <HeroExplore key="explore" hero={hero} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: hero.name,
          headerRight: () => (
            <Pressable onPress={() => toggleFav(hero.slug)} style={styles.favBtn}>
              <Ionicons
                name={isFav ? "bookmark" : "bookmark-outline"}
                size={22}
                color={Colors.light.violet}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Card */}
        <View style={styles.topCard}>
          <View style={[styles.imageWrap, isCutout && styles.cutoutWrap]}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.heroImage}
              contentFit={isCutout ? "contain" : "cover"}
            />
          </View>

          <View style={styles.heroHeaderInfo}>
            <ThemedText style={styles.cat} type="small">{catNo(hero.no)}</ThemedText>
            <ThemedText style={styles.title} type="title">{hero.name}</ThemedText>
            {hero.nickname && <ThemedText style={styles.nickname}>&ldquo;{hero.nickname}&rdquo;</ThemedText>}
            <ThemedText style={styles.meta} type="small">
              {hero.designation} · {lifespan(hero)}
            </ThemedText>

            {/* Quick Meta List */}
            <View style={styles.quickMetaList}>
              <View style={styles.quickMetaRow}>
                <ThemedText style={styles.quickMetaLabel} type="small">Born: </ThemedText>
                <ThemedText style={styles.quickMetaVal} type="small">{fmtLong(hero.launch.date)}</ThemedText>
              </View>
              <View style={styles.quickMetaRow}>
                <ThemedText style={styles.quickMetaLabel} type="small">{hero.end.label}: </ThemedText>
                <ThemedText style={styles.quickMetaVal} type="small">{fmtLong(hero.end.date)}</ThemedText>
              </View>
              <View style={styles.quickMetaRow}>
                <ThemedText style={styles.quickMetaLabel} type="small">Resting: </ThemedText>
                <ThemedText style={styles.quickMetaVal} type="small">📍 {hero.restingPlace}</ThemedText>
              </View>
            </View>

            {/* Stats Chips */}
            {hero.stats && hero.stats.length > 0 && (
              <View style={styles.statsRow}>
                {hero.stats.map((st) => (
                  <View key={st.label} style={styles.statChip}>
                    <Ionicons name={STAT_ICONS[st.icon] ?? "sparkles-outline"} size={16} color={Colors.light.violet} />
                    <View>
                      <ThemedText style={styles.statValue}>{st.value}</ThemedText>
                      <ThemedText style={styles.statLabel} type="small">{st.label}</ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Summary */}
            <View style={styles.summaryBox}>
              <ThemedText style={styles.summaryText}>{hero.summary}</ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Section Navigation Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sectionNav}
        >
          {layoutOrder
            .filter((id) => Boolean(SECTION_LABEL[id]) && id !== "news" && id !== "eyes" && id !== "documentary")
            .map((id) => (
              <Pressable
                key={id}
                onPress={() => {
                  setActiveSection(id);
                  const y = sectionOffsets.current[id];
                  if (y !== undefined) {
                    scrollRef.current?.scrollTo({ y: y + 250, animated: true });
                  }
                }}
                style={[styles.sectionChip, activeSection === id && styles.sectionChipActive]}
              >
                <ThemedText
                  style={[styles.sectionChipText, activeSection === id && styles.sectionChipTextActive]}
                  type="small"
                >
                  {SECTION_LABEL[id]}
                </ThemedText>
              </Pressable>
            ))}
          <Pressable
            onPress={() => {
              setActiveSection("specs");
              const y = sectionOffsets.current["specs"];
              if (y !== undefined) {
                scrollRef.current?.scrollTo({ y: y + 250, animated: true });
              }
            }}
            style={[styles.sectionChip, activeSection === "specs" && styles.sectionChipActive]}
          >
            <ThemedText
              style={[styles.sectionChipText, activeSection === "specs" && styles.sectionChipTextActive]}
              type="small"
            >
              Hardware Specs
            </ThemedText>
          </Pressable>
        </ScrollView>

        {/* Dynamic Layout Sections */}
        <View style={styles.sectionsContainer}>
          {layoutOrder.map((sectionId) => {
            const content = renderSection(sectionId);
            if (!content) return null;
            return (
              <View
                key={sectionId}
                onLayout={(e) => {
                  sectionOffsets.current[sectionId] = e.nativeEvent.layout.y;
                }}
              >
                {content}
              </View>
            );
          })}

          {/* Hardware Specifications */}
          <View
            onLayout={(e) => {
              sectionOffsets.current["specs"] = e.nativeEvent.layout.y;
            }}
          >
            <HeroSpecs hero={hero} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  favBtn: {
    padding: 4,
  },
  topCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.line,
    overflow: "hidden",
  },
  imageWrap: {
    width: "100%",
    height: 240,
    backgroundColor: "#0c0a22",
  },
  cutoutWrap: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroHeaderInfo: {
    padding: 18,
    gap: 4,
  },
  cat: {
    color: Colors.light.violet,
    fontFamily: "monospace",
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
  },
  nickname: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.textSecondary,
    fontStyle: "italic",
    marginTop: -2,
  },
  meta: {
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  quickMetaList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
    gap: 4,
  },
  quickMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickMetaLabel: {
    color: Colors.light.textSecondary,
    width: 70,
  },
  quickMetaVal: {
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.line,
    flex: 1,
    minWidth: 140,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  summaryBox: {
    marginTop: 12,
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    borderRadius: 14,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.text,
  },
  sectionsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  lastSignalCard: {
    backgroundColor: "#0c0a22",
    gap: 12,
  },
  lostHeader: {
    gap: 2,
  },
  lostEyebrow: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 1,
  },
  lastSignalTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  lastSignalStory: {
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 22,
    fontSize: 14,
  },
  lostFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    paddingTop: 8,
  },
  lostCoords: {
    color: "#a78bfa",
    fontFamily: "monospace",
  },
  sectionNav: {
    gap: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  sectionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  sectionChipActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  sectionChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.text,
  },
  sectionChipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
