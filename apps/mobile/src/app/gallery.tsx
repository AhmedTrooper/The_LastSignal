import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { HEROES, photo, assetUrl, catNo, type Hero } from "@thelastsignal/data";

interface PhotoItem {
  hero: Hero;
  imgName: string;
  meta: ReturnType<typeof photo>;
}

export default function GalleryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedHeroSlug, setSelectedHeroSlug] = useState<string>("all");
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const heroesWithGallery = HEROES.filter((h) => h.gallery && h.gallery.length > 0);

  // Flatten all photos for easy filtering & grid display
  const allPhotos: PhotoItem[] = [];
  heroesWithGallery.forEach((h) => {
    h.gallery?.forEach((imgName) => {
      if (imgName) {
        allPhotos.push({
          hero: h,
          imgName,
          meta: photo(imgName, h.name),
        });
      }
    });
  });

  const filteredPhotos =
    selectedHeroSlug === "all"
      ? allPhotos
      : allPhotos.filter((p) => p.hero.slug === selectedHeroSlug);

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 500);
  };

  const handleSelectPhoto = (item: PhotoItem) => {
    haptic.light();
    setActivePhoto(item);
  };

  const handleSharePhoto = async (item: PhotoItem) => {
    haptic.selection();
    try {
      await Share.share({
        title: item.meta.title,
        message: `${item.meta.title} — Captured by ${item.hero.name}.\n${item.meta.credit}\nhttps://thelastsignal.space/heroes/${item.hero.slug}`,
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={filteredPhotos}
        keyExtractor={(item) => `${item.hero.slug}-${item.imgName}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectPhoto(item)}
            style={({ pressed }) => [
              styles.photoCard,
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`View ${item.meta.title}`}
          >
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: assetUrl(`images/${item.imgName}.jpg`) }}
                style={styles.photo}
                contentFit="cover"
                transition={250}
              />
              <View style={styles.badgeTopLeft}>
                <ThemedText style={styles.heroBadgeText} type="small">
                  {catNo(item.hero.no)} · {item.hero.name}
                </ThemedText>
              </View>
            </View>

            <View style={styles.photoDetails}>
              <ThemedText style={styles.photoTitle} numberOfLines={2}>
                {item.meta.title}
              </ThemedText>
              <View style={styles.creditRow}>
                <Ionicons name="camera-outline" size={13} color={Colors.light.violet} />
                <ThemedText style={styles.photoCredit} numberOfLines={1} type="small">
                  {item.meta.credit}
                </ThemedText>
              </View>
            </View>
          </Pressable>
        )}
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
            <View style={styles.eyebrowRow}>
              <View style={styles.beaconDot} />
              <ThemedText style={styles.eyebrow} type="small">
                DEEP SPACE IMAGERY
              </ThemedText>
            </View>
            <ThemedText style={styles.title} type="title">
              Their Last Views
            </ThemedText>
            <ThemedText style={styles.subtitle} type="small">
              Real planetary exploration photos from NASA&apos;s public image archives, captured across Mars, the Moon, and the outer planets.
            </ThemedText>

            {/* Horizontal Filter Chips for Explorers */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              <Pressable
                onPress={() => {
                  haptic.selection();
                  setSelectedHeroSlug("all");
                }}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedHeroSlug === "all" && styles.filterChipActive,
                  pressed && styles.cardPressed,
                ]}
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    selectedHeroSlug === "all" && styles.filterChipTextActive,
                  ]}
                  type="small"
                >
                  All Captures ({allPhotos.length})
                </ThemedText>
              </Pressable>

              {heroesWithGallery.map((h) => {
                const active = selectedHeroSlug === h.slug;
                const count = h.gallery?.length ?? 0;

                return (
                  <Pressable
                    key={h.slug}
                    onPress={() => {
                      haptic.selection();
                      setSelectedHeroSlug(h.slug);
                    }}
                    style={({ pressed }) => [
                      styles.filterChip,
                      active && styles.filterChipActive,
                      pressed && styles.cardPressed,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.filterChipText,
                        active && styles.filterChipTextActive,
                      ]}
                      type="small"
                    >
                      {h.name} ({count})
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.countRow}>
              <ThemedText style={styles.countText} type="small">
                Showing {filteredPhotos.length} public domain captures
              </ThemedText>
            </View>
          </View>
        }
      />

      {/* Full-Screen Photo Lightbox Modal */}
      {activePhoto && (
        <Modal visible animationType="fade" transparent>
          <View style={styles.lightboxModal}>
            {/* Top Bar with Dismiss and Share */}
            <View style={[styles.lightboxTopBar, { paddingTop: Math.max(insets.top + 8, 20) }]}>
              <View style={styles.lightboxBadge}>
                <ThemedText style={styles.lightboxBadgeText} type="small">
                  {catNo(activePhoto.hero.no)} · {activePhoto.hero.name}
                </ThemedText>
              </View>

              <View style={styles.lightboxActions}>
                <Pressable
                  onPress={() => handleSharePhoto(activePhoto)}
                  style={styles.lightboxCircleBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Share photograph"
                >
                  <Ionicons name="share-outline" size={18} color="#ffffff" />
                </Pressable>

                <Pressable
                  onPress={() => {
                    haptic.light();
                    setActivePhoto(null);
                  }}
                  style={styles.lightboxCircleBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Close photo lightbox"
                >
                  <Ionicons name="close" size={20} color="#ffffff" />
                </Pressable>
              </View>
            </View>

            {/* Centered High-Res Photo View */}
            <View style={styles.lightboxPhotoWrap}>
              <Image
                source={{ uri: assetUrl(`images/${activePhoto.imgName}.jpg`) }}
                style={styles.lightboxPhoto}
                contentFit="contain"
                transition={300}
              />
            </View>

            {/* Bottom Floating Metadata Sheet */}
            <View
              style={[
                styles.lightboxBottomBar,
                { paddingBottom: Math.max(insets.bottom + 16, 24) },
              ]}
            >
              <ThemedText style={styles.lightboxTitle}>
                {activePhoto.meta.title}
              </ThemedText>
              <ThemedText style={styles.lightboxCredit} type="small">
                📷 {activePhoto.meta.credit}
              </ThemedText>

              <Pressable
                onPress={() => {
                  haptic.light();
                  const targetHero = activePhoto.hero;
                  setActivePhoto(null);
                  router.push(`/heroes/${targetHero.slug}` as any);
                }}
                style={({ pressed }) => [
                  styles.lightboxProfileBtn,
                  pressed && styles.cardPressed,
                ]}
              >
                <ThemedText style={styles.lightboxProfileBtnText}>
                  View {activePhoto.hero.name}&apos;s Profile
                </ThemedText>
                <Ionicons name="arrow-forward" size={14} color="#070814" />
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
    gap: 8,
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
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  filterRow: {
    gap: 8,
    paddingVertical: 4,
    marginTop: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  filterChipActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  filterChipText: {
    fontWeight: "600",
    color: Colors.light.text,
  },
  filterChipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  countRow: {
    paddingTop: 2,
  },
  countText: {
    color: Colors.light.textSecondary,
    fontWeight: "600",
    fontSize: 11,
  },
  photoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.line,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 16 / 10,
    backgroundColor: "#070814",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  badgeTopLeft: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(7, 8, 20, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  heroBadgeText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
  },
  photoDetails: {
    padding: 14,
    gap: 6,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.light.text,
  },
  creditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  photoCredit: {
    color: Colors.light.textSecondary,
    fontSize: 11,
    flex: 1,
  },

  /* Lightbox Modal */
  lightboxModal: {
    flex: 1,
    backgroundColor: "rgba(7, 8, 20, 0.96)",
    justifyContent: "space-between",
  },
  lightboxTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  lightboxBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  lightboxBadgeText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "700",
  },
  lightboxActions: {
    flexDirection: "row",
    gap: 8,
  },
  lightboxCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxPhotoWrap: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  lightboxPhoto: {
    width: "100%",
    height: "100%",
  },
  lightboxBottomBar: {
    backgroundColor: "rgba(10, 11, 26, 0.85)",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    gap: 8,
  },
  lightboxTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  lightboxCredit: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  lightboxProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  lightboxProfileBtnText: {
    color: "#070814",
    fontWeight: "800",
    fontSize: 13,
  },
});
