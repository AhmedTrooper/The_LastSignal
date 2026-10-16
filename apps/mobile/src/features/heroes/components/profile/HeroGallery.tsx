import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { photo, assetUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroGallery({ hero }: Props) {
  if (!hero.gallery || hero.gallery.length === 0) return null;

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">ARCHIVE GALLERY</ThemedText>
      <ThemedText style={styles.title} type="subtitle">Mission Photographs</ThemedText>
      <ThemedText style={styles.subtitle} type="small">
        Credited public-domain photographs from the NASA Image and Video Library.
      </ThemedText>

      <View style={styles.galleryList}>
        {hero.gallery?.map((imgName) => {
          if (!imgName) return null;
          const meta = photo(imgName, hero.name);
          return (
            <View key={imgName} style={styles.galleryItem}>
              <View style={styles.imgWrap}>
                <Image source={{ uri: assetUrl(`images/${imgName}.jpg`) }} style={styles.image} contentFit="cover" />
              </View>
              <View style={styles.metaWrap}>
                <ThemedText style={styles.photoTitle}>{meta.title}</ThemedText>
                <ThemedText style={styles.photoCredit} type="small">{meta.credit}</ThemedText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginTop: -4,
  },
  galleryList: {
    gap: 16,
    marginTop: 4,
  },
  galleryItem: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  imgWrap: {
    width: "100%",
    aspectRatio: 16 / 10,
    backgroundColor: "#0c0a22",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  metaWrap: {
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
