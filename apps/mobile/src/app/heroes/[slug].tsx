import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
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
  storyChapters,
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hero = useHero(slug ?? "");
  const isFav = useFavoritesStore((s) => s.isFavorite(slug ?? ""));
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite);

  const scrollRef = useRef<ScrollView>(null);
  const [scrollY] = useState(() => new Animated.Value(0));
  const sectionOffsets = useRef<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [refreshing, setRefreshing] = useState(false);

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

  const chapters = storyChapters(hero);
  const isMars = hero.body === "mars";

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

  // Animated header transitions
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [120, 240],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [180, 260],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const heroImageScale = scrollY.interpolate({
    inputRange: [-150, 0],
    outputRange: [1.3, 1],
    extrapolateRight: "clamp",
  });

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 700);
  };

  const handleShare = async () => {
    haptic.selection();
    try {
      await Share.share({
        title: `${hero.name} · RoverVilla`,
        message: `${hero.name} (${catNo(hero.no)}) — ${hero.designation}.\n"${hero.end.story}"\nResting at ${hero.restingPlace}.\nhttps://thelastsignal.space/heroes/${hero.slug}`,
      });
    } catch {
      // ignore
    }
  };

  const scrollToSection = (id: string) => {
    haptic.selection();
    setActiveSection(id);
    if (id === "overview") {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    const y = sectionOffsets.current[id];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 60), animated: true });
    }
  };

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
              <View style={styles.lostBadgeRow}>
                <View style={styles.pulseDot} />
                <ThemedText style={styles.lostEyebrow} type="small">
                  OFFICIAL LOSS OF SIGNAL (LOS)
                </ThemedText>
              </View>
              <ThemedText style={styles.lastSignalTitle} type="title">
                {hero.end.label} · {fmtLong(hero.end.date)}
              </ThemedText>
            </View>

            <View style={styles.quoteBox}>
              <ThemedText style={styles.quoteMark}>&ldquo;</ThemedText>
              <ThemedText style={styles.lastSignalStory}>{hero.end.story}</ThemedText>
            </View>

            <Waveform
              seed={`${hero.slug}-hero-last`}
              bars={36}
              fade={0.35}
              color="#a78bfa"
              height={22}
              style={{ marginVertical: 4 }}
            />

            <View style={styles.lostFooter}>
              <View style={styles.lostCoordsRow}>
                <Ionicons name="location" size={16} color="#a78bfa" />
                <ThemedText style={styles.lostCoords} type="small">
                  {hero.restingPlace} ({fmtCoords(hero.coords)})
                </ThemedText>
              </View>

              <Pressable
                onPress={() => {
                  haptic.light();
                  router.push("/resting" as any);
                }}
                style={({ pressed }) => [
                  styles.lostMapBtn,
                  pressed && styles.lostMapBtnPressed,
                ]}
              >
                <ThemedText style={styles.lostMapBtnText}>Locate on Map</ThemedText>
                <Ionicons name="arrow-forward" size={13} color="#ffffff" />
              </Pressable>
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
    <View style={styles.root}>
      {/* Hide default navigation stack header to render custom parallax header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Floating Animated Native Top Bar */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top }]}>
        {/* Animated frosted solid background on scroll */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.headerSolidBg,
            { opacity: headerBgOpacity },
          ]}
        />

        <View style={styles.headerBarContent}>
          {/* Back Button */}
          <Pressable
            onPress={() => {
              haptic.light();
              router.back();
            }}
            style={({ pressed }) => [styles.iconCircleBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
          </Pressable>

          {/* Fading Title in Center */}
          <Animated.View
            style={[styles.headerTitleWrap, { opacity: headerTitleOpacity }]}
          >
            <ThemedText style={styles.headerTitleText} numberOfLines={1}>
              {hero.name}
            </ThemedText>
            <ThemedText style={styles.headerCatText} type="small">
              {catNo(hero.no)}
            </ThemedText>
          </Animated.View>

          {/* Right Action Buttons: Share & Favorite */}
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.iconCircleBtn, pressed && styles.btnPressed]}
              accessibilityRole="button"
              accessibilityLabel="Share hero memorial"
            >
              <Ionicons name="share-outline" size={19} color="#ffffff" />
            </Pressable>

            <Pressable
              onPress={() => {
                haptic.success();
                toggleFav(hero.slug);
              }}
              style={({ pressed }) => [
                styles.iconCircleBtn,
                isFav && styles.favBtnActive,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isFav ? "Remove bookmark" : "Bookmark hero"}
            >
              <Ionicons
                name={isFav ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isFav ? "#ffffff" : "#ffffff"}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        style={styles.container}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.light.violet}
            colors={[Colors.light.violet]}
            progressViewOffset={insets.top + 50}
          />
        }
      >
        {/* Parallax Atmospheric Hero Stage */}
        <View style={styles.heroStage}>
          {/* Deep Space Background Canvas */}
          <View style={styles.spaceBackdrop}>
            <View style={styles.ambientGlow} />
          </View>

          {/* Scaled Hero Image Container */}
          <Animated.View
            style={[
              styles.imageContainer,
              { transform: [{ scale: heroImageScale }] },
            ]}
          >
            <Image
              source={{ uri: imageUrl }}
              style={isCutout ? styles.cutoutImage : styles.photoImage}
              contentFit={isCutout ? "contain" : "cover"}
              transition={300}
            />
          </Animated.View>

          {/* Mission Status Beacon */}
          <View style={[styles.statusBeacon, { top: insets.top + 54 }]}>
            <View style={styles.beaconDot} />
            <ThemedText style={styles.beaconText} type="small">
              {hero.end.label.toUpperCase()} · ARCHIVE
            </ThemedText>
          </View>
        </View>

        {/* Hero Telemetry & Memorial HUD Card */}
        <View style={styles.telemetryCard}>
          <View style={styles.metaEyebrowRow}>
            <ThemedText style={styles.specimenTag} type="small">
              CATALOG {catNo(hero.no)}
            </ThemedText>
            <View
              style={[
                styles.worldTag,
                isMars ? styles.marsTag : styles.moonTag,
              ]}
            >
              <Ionicons
                name="planet-outline"
                size={12}
                color={isMars ? Colors.light.mars : Colors.light.violet}
              />
              <ThemedText
                style={[
                  styles.worldTagText,
                  isMars ? styles.marsTagText : styles.moonTagText,
                ]}
                type="small"
              >
                {hero.body.toUpperCase()}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.heroName} type="title">
            {hero.name}
          </ThemedText>

          {hero.nickname && (
            <ThemedText style={styles.nickname}>
              &ldquo;{hero.nickname}&rdquo;
            </ThemedText>
          )}

          <ThemedText style={styles.designationText} type="small">
            {hero.designation} · {lifespan(hero)}
          </ThemedText>

          {/* Audio Waveform Carrier Simulation */}
          <View style={styles.waveformHUD}>
            <View style={styles.waveformHeader}>
              <Ionicons name="radio-outline" size={13} color={Colors.light.violet} />
              <ThemedText style={styles.waveformLabel} type="small">
                DEEP SPACE CARRIER TELEMETRY
              </ThemedText>
            </View>
            <Waveform
              seed={`${hero.slug}-profile-hud`}
              bars={32}
              fade={0.25}
              height={18}
              color={Colors.light.violet}
            />
          </View>

          {/* Quick Coordinate Action Strip */}
          <Pressable
            onPress={() => {
              haptic.light();
              router.push("/resting" as any);
            }}
            style={({ pressed }) => [
              styles.coordinateStrip,
              pressed && styles.btnPressed,
            ]}
          >
            <Ionicons name="location" size={16} color={Colors.light.violet} />
            <View style={styles.coordTexts}>
              <ThemedText style={styles.restingPlaceText} numberOfLines={1}>
                {hero.restingPlace}
              </ThemedText>
              <ThemedText style={styles.coordsSub} type="small">
                {fmtCoords(hero.coords)}
              </ThemedText>
            </View>
            <View style={styles.mapPill}>
              <ThemedText style={styles.mapPillText} type="small">Map</ThemedText>
              <Ionicons name="chevron-forward" size={12} color={Colors.light.violet} />
            </View>
          </Pressable>

          {/* 4-Bento Metric Grid */}
          {hero.stats && hero.stats.length > 0 && (
            <View style={styles.bentoGrid}>
              {hero.stats.map((st) => (
                <View key={st.label} style={styles.bentoItem}>
                  <View style={styles.bentoIconCircle}>
                    <Ionicons
                      name={STAT_ICONS[st.icon] ?? "sparkles-outline"}
                      size={16}
                      color={Colors.light.violet}
                    />
                  </View>
                  <View style={styles.bentoInfo}>
                    <ThemedText style={styles.bentoValue}>{st.value}</ThemedText>
                    <ThemedText style={styles.bentoLabel} type="small">
                      {st.label}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Summary Inscription */}
          <View style={styles.summaryBox}>
            <ThemedText style={styles.summaryText}>{hero.summary}</ThemedText>
          </View>

          {/* Direct Story Journey Banner */}
          {chapters.length > 0 && (
            <Pressable
              onPress={() => {
                haptic.light();
                router.push(`/heroes/${hero.slug}/story` as any);
              }}
              style={({ pressed }) => [
                styles.storyBannerBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Ionicons name="book-outline" size={18} color="#ffffff" />
              <View style={styles.storyBannerTextWrap}>
                <ThemedText style={styles.storyBannerTitle}>
                  Experience The Mission Story
                </ThemedText>
                <ThemedText style={styles.storyBannerSub} type="small">
                  {chapters.length} immersive chapters · Earth to final contact
                </ThemedText>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </Pressable>
          )}
        </View>

        {/* Sticky-feeling Segmented Section Jump Bar */}
        <View style={styles.sectionNavWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionNav}
          >
            <Pressable
              onPress={() => scrollToSection("overview")}
              style={[
                styles.sectionChip,
                activeSection === "overview" && styles.sectionChipActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.sectionChipText,
                  activeSection === "overview" && styles.sectionChipTextActive,
                ]}
                type="small"
              >
                Overview
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => scrollToSection("specs")}
              style={[
                styles.sectionChip,
                activeSection === "specs" && styles.sectionChipActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.sectionChipText,
                  activeSection === "specs" && styles.sectionChipTextActive,
                ]}
                type="small"
              >
                Hardware Specs
              </ThemedText>
            </Pressable>

            {layoutOrder
              .filter(
                (id) =>
                  Boolean(SECTION_LABEL[id]) &&
                  id !== "news" &&
                  id !== "eyes" &&
                  id !== "documentary"
              )
              .map((id) => (
                <Pressable
                  key={id}
                  onPress={() => scrollToSection(id)}
                  style={[
                    styles.sectionChip,
                    activeSection === id && styles.sectionChipActive,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.sectionChipText,
                      activeSection === id && styles.sectionChipTextActive,
                    ]}
                    type="small"
                  >
                    {SECTION_LABEL[id]}
                  </ThemedText>
                </Pressable>
              ))}
          </ScrollView>
        </View>

        {/* Dynamic Layout Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Engineering Specifications Sheet */}
          <View
            onLayout={(e) => {
              sectionOffsets.current["specs"] = e.nativeEvent.layout.y;
            }}
          >
            <HeroSpecs hero={hero} />
          </View>

          {/* Dynamic Sections from Data Layout */}
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
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  content: {
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  headerSolidBg: {
    backgroundColor: "rgba(10, 11, 26, 0.94)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  headerBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 52,
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(12, 10, 34, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  favBtnActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerTitleText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  headerCatText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontFamily: "monospace",
    fontSize: 10,
    marginTop: -1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroStage: {
    height: 340,
    width: "100%",
    position: "relative",
    backgroundColor: "#070814",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  spaceBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#070814",
    alignItems: "center",
    justifyContent: "center",
  },
  ambientGlow: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(124, 58, 237, 0.16)",
    position: "absolute",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cutoutImage: {
    width: "82%",
    height: "82%",
    marginTop: 24,
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  statusBeacon: {
    position: "absolute",
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(8, 9, 24, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  beaconText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  telemetryCard: {
    marginTop: -28,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    gap: 12,
  },
  metaEyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  specimenTag: {
    color: Colors.light.violet,
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 11,
  },
  worldTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  marsTag: {
    backgroundColor: "#fff0ea",
  },
  moonTag: {
    backgroundColor: "#edeaff",
  },
  worldTagText: {
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  marsTagText: {
    color: Colors.light.mars,
  },
  moonTagText: {
    color: Colors.light.violet,
  },
  heroName: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  nickname: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.light.textSecondary,
    fontStyle: "italic",
    marginTop: -8,
  },
  designationText: {
    color: Colors.light.textSecondary,
    fontSize: 13,
  },
  waveformHUD: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 6,
  },
  waveformHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  waveformLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.violet,
    letterSpacing: 0.8,
  },
  coordinateStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fafafc",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  coordTexts: {
    flex: 1,
    gap: 1,
  },
  restingPlaceText: {
    fontWeight: "700",
    fontSize: 13,
    color: Colors.light.text,
  },
  coordsSub: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontSize: 11,
  },
  mapPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#edeaff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mapPillText: {
    fontWeight: "700",
    fontSize: 11,
    color: Colors.light.violet,
  },
  bentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  bentoItem: {
    flex: 1,
    minWidth: "46%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  bentoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#edeaff",
    alignItems: "center",
    justifyContent: "center",
  },
  bentoInfo: {
    flex: 1,
  },
  bentoValue: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.light.text,
  },
  bentoLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  summaryBox: {
    backgroundColor: "#fafafc",
    padding: 14,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.violet,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.text,
    fontStyle: "italic",
  },
  storyBannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.violet,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  storyBannerTextWrap: {
    flex: 1,
  },
  storyBannerTitle: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
  storyBannerSub: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 11,
  },
  sectionNavWrap: {
    paddingVertical: 4,
  },
  sectionNav: {
    gap: 8,
    paddingHorizontal: 16,
  },
  sectionChip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 22,
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
  sectionsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  lastSignalCard: {
    backgroundColor: "#070814",
    borderColor: "rgba(167, 139, 250, 0.3)",
    gap: 12,
  },
  lostHeader: {
    gap: 6,
  },
  lostBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  lostEyebrow: {
    color: "#f87171",
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 11,
  },
  lastSignalTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
  },
  quoteBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  quoteMark: {
    color: "#a78bfa",
    fontSize: 28,
    fontFamily: "serif",
    lineHeight: 28,
    position: "absolute",
    left: 8,
    top: 4,
    opacity: 0.4,
  },
  lastSignalStory: {
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
    fontSize: 14,
    paddingLeft: 12,
  },
  lostFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 10,
    gap: 8,
  },
  lostCoordsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  lostCoords: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontSize: 11,
  },
  lostMapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.violet,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  lostMapBtnPressed: {
    opacity: 0.85,
  },
  lostMapBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 11,
  },
});
