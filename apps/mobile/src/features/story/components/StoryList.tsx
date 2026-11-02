import { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import {
  HEROES,
  catNo,
  lifespan,
  portrait,
  storyChapters,
  assetUrl,
  type Hero,
} from "@thelastsignal/data";

function StoryCard({ hero }: { hero: Hero }) {
  const router = useRouter();
  if (!hero) return null;
  const chapters = storyChapters(hero);
  const imageUrl = assetUrl(`images/${portrait(hero)}.jpg`);
  const isMars = hero.body === "mars";
  const estMinutes = Math.max(2, Math.round(chapters.length * 0.4));

  const handlePress = () => {
    haptic.light();
    router.push(`/heroes/${hero.slug}/story` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Read story of ${hero.name}, ${chapters.length} chapters`}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.gradientOverlay} />

      <View style={styles.cardContent}>
        {/* Top Meta Badges */}
        <View style={styles.topMetaRow}>
          <View style={styles.catBadge}>
            <ThemedText style={styles.catBadgeText} type="small">
              {catNo(hero.no)}
            </ThemedText>
          </View>
          <View
            style={[
              styles.worldBadge,
              isMars ? styles.marsBadge : styles.moonBadge,
            ]}
          >
            <Ionicons
              name={isMars ? "planet-outline" : "moon-outline"}
              size={11}
              color="#ffffff"
            />
            <ThemedText style={styles.worldBadgeText} type="small">
              {hero.body.toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.7)" />
            <ThemedText style={styles.timeBadgeText} type="small">
              {estMinutes} MIN READ
            </ThemedText>
          </View>
        </View>

        {/* Center Title & Designation */}
        <View style={styles.titleWrap}>
          <ThemedText style={styles.heroName}>{hero.name}</ThemedText>
          {hero.nickname && (
            <ThemedText style={styles.nickname}>&ldquo;{hero.nickname}&rdquo;</ThemedText>
          )}
          <ThemedText style={styles.lifespanText} type="small">
            {hero.designation} · {lifespan(hero)}
          </ThemedText>
        </View>

        {/* Bottom Action Strip */}
        <View style={styles.actionStrip}>
          <View style={styles.chapterCountRow}>
            <Ionicons name="book-outline" size={14} color="#a78bfa" />
            <ThemedText style={styles.chapterCountText} type="small">
              {chapters.length} Illustrated Chapters
            </ThemedText>
          </View>

          <View style={styles.readPill}>
            <ThemedText style={styles.readPillText}>Begin Story</ThemedText>
            <Ionicons name="arrow-forward" size={13} color="#ffffff" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function StoryList() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 600);
  };

  return (
    <FlatList
      data={HEROES}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <StoryCard hero={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.light.violet}
          colors={[Colors.light.violet]}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          {/* Featured Primary Story Book Hero Card */}
          <Pressable
            onPress={() => {
              haptic.light();
              router.push("/book" as any);
            }}
            style={({ pressed }) => [styles.bookHeroCard, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open The Living Story Book"
          >
            <View style={styles.bookBadgeRow}>
              <View style={styles.bookAppsBadge}>
                <Ionicons name="planet" size={12} color="#f5a623" />
                <ThemedText style={styles.bookAppsBadgeText}>
                  2026 NASA SPACE APPS · MASTER DOSSIER
                </ThemedText>
              </View>
              <View style={styles.pageCountBadge}>
                <Ionicons name="book" size={11} color="#4fc3f7" />
                <ThemedText style={styles.pageCountBadgeText}>58 PAGES</ThemedText>
              </View>
            </View>

            <ThemedText style={styles.bookHeroSuperTitle}>
              ABANDONED BUT NOT FORGOTTEN
            </ThemedText>

            <ThemedText style={styles.bookHeroTitle}>
              The Living Story Book
            </ThemedText>

            <ThemedText style={styles.bookHeroDesc}>
              Read the full illustrated chronicle across 29 two-page spreads: tactile page turning, InSight seismometer audio, Ingenuity flight physics, and 100% authentic NASA telemetry.
            </ThemedText>

            {/* Quick Chapter Jump Pills */}
            <View style={styles.quickPillsRow}>
              {[
                { label: "Apollo 11", page: 13 },
                { label: "Spirit & Oppy", page: 33 },
                { label: "InSight", page: 45 },
                { label: "Ingenuity", page: 53 },
              ].map((c) => (
                <View key={c.label} style={styles.quickPill}>
                  <ThemedText style={styles.quickPillText}>
                    {c.label} · P.{c.page}
                  </ThemedText>
                </View>
              ))}
            </View>

            {/* Big Action Button */}
            <View style={styles.openBookBtn}>
              <Ionicons name="book-outline" size={18} color="#0d0f22" />
              <ThemedText style={styles.openBookBtnText}>
                Open & Read Story Book
              </ThemedText>
              <Ionicons name="arrow-forward" size={16} color="#0d0f22" />
            </View>
          </Pressable>

          <View style={styles.sectionDivider}>
            <ThemedText style={styles.eyebrow} type="small">
              MISSION ARCHIVE REELS
            </ThemedText>
            <ThemedText style={styles.title} type="title">
              Their Lives, Chapter by Chapter
            </ThemedText>
            <ThemedText style={styles.subtitle} type="small">
              Select an individual robotic explorer below to experience their dedicated cinematic timeline.
            </ThemedText>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    gap: 6,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },
  card: {
    height: 250,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#070814",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(7, 8, 20, 0.62)",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
    padding: 18,
  },
  topMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  catBadgeText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
  },
  worldBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  marsBadge: {
    backgroundColor: "rgba(234, 88, 12, 0.65)",
  },
  moonBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.65)",
  },
  worldBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  timeBadgeText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "600",
  },
  titleWrap: {
    gap: 2,
  },
  heroName: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  nickname: {
    color: "#a78bfa",
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "600",
  },
  lifespanText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  actionStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
  },
  chapterCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chapterCountText: {
    color: "#a78bfa",
    fontWeight: "700",
    fontSize: 12,
  },
  readPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.violet,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  readPillText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  /* Book Hero Card Styles */
  bookHeroCard: {
    backgroundColor: "#0d0f22",
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(245, 166, 35, 0.4)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  bookBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  bookAppsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 166, 35, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  bookAppsBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#f5a623",
    letterSpacing: 0.5,
  },
  pageCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79, 195, 247, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pageCountBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#4fc3f7",
    letterSpacing: 0.5,
  },
  bookHeroSuperTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9aa0a6",
    letterSpacing: 1.5,
  },
  bookHeroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#f4ede0",
    marginTop: 2,
    marginBottom: 8,
    fontFamily: "SpaceGrotesk-Bold",
  },
  bookHeroDesc: {
    fontSize: 13,
    color: "#d0d4dc",
    lineHeight: 19,
    marginBottom: 14,
  },
  quickPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  quickPill: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  quickPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#f4ede0",
  },
  openBookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5a623",
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  openBookBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0d0f22",
  },
  sectionDivider: {
    marginTop: 4,
    gap: 6,
  },
});
