import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, photo, assetUrl, type Hero } from "@thelastsignal/data";

interface GallerySectionItem {
  hero: Hero;
}

function HeroGallerySection({ hero }: GallerySectionItem) {
  if (!hero.gallery || hero.gallery.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.heroName}>{hero.name}</ThemedText>
        <Pressable onPress={() => router.push(`/heroes/${hero.slug}` as any)}>
          <ThemedText style={styles.profileLink}>View Profile</ThemedText>
        </Pressable>
      </View>

      <View style={styles.photosGrid}>
        {hero.gallery.map((imgName) => {
          const meta = photo(imgName, hero.name);
          return (
            <View key={imgName} style={styles.photoCard}>
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: assetUrl(`images/${imgName}.jpg`) }}
                  style={styles.photo}
                  contentFit="cover"
                />
              </View>
              <View style={styles.photoDetails}>
                <ThemedText style={styles.photoTitle} numberOfLines={2}>
                  {meta.title}
                </ThemedText>
                <ThemedText style={styles.photoCredit} numberOfLines={1} type="small">
                  {meta.credit}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function GalleryScreen() {
  const heroesWithGallery = HEROES.filter((h) => h.gallery && h.gallery.length > 0);

  return (
    <FlatList
      data={heroesWithGallery}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <HeroGallerySection hero={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow} type="small">ARCHIVE GALLERY</ThemedText>
          <ThemedText style={styles.title} type="title">Their last views.</ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Real photos from NASA&apos;s public image archive, credited one by one.
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    gap: 6,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
    paddingBottom: 8,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "800",
  },
  profileLink: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.light.violet,
  },
  photosGrid: {
    gap: 14,
  },
  photoCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 16 / 10,
    backgroundColor: "#0c0a22",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoDetails: {
    padding: 12,
    gap: 2,
  },
  photoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.light.text,
  },
  photoCredit: {
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
});
