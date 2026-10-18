import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { catNo, lifespan, portrait, type Hero, assetUrl } from "@thelastsignal/data";

import { haptic } from "@/utils/haptics";

interface Props {
  hero: Hero;
}

export function HeroCard({ hero }: Props) {
  const router = useRouter();
  if (!hero) return null;
  const isCutout = Boolean(hero.card);
  const imageUrl = isCutout
    ? assetUrl(`images/${hero.card}.webp`)
    : assetUrl(`images/${portrait(hero)}.jpg`);

  const handlePress = () => {
    haptic.light();
    router.push(`/heroes/${hero.slug}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.imageContainer, isCutout && styles.cutoutContainer]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit={isCutout ? "contain" : "cover"}
          transition={300}
        />
        <View style={styles.tag}>
          <ThemedText style={styles.tagText} type="small">
            {catNo(hero.no)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.name} type="subtitle">
            {hero.name}
          </ThemedText>
          <ThemedText style={styles.lifespan} type="small">
            {lifespan(hero)}
          </ThemedText>
        </View>

        <ThemedText style={styles.designation} numberOfLines={1}>
          {hero.designation}
        </ThemedText>

        <ThemedText style={styles.restingPlace} numberOfLines={1} type="small">
          📍 {hero.restingPlace}
        </ThemedText>

        <Waveform seed={hero.slug} bars={22} height={16} style={styles.waveform} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    overflow: "hidden",
    marginBottom: 14,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: Colors.light.backgroundElement,
    position: "relative",
  },
  cutoutContainer: {
    padding: 12,
    backgroundColor: "#f7f6fc",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(13, 11, 38, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 11,
  },
  content: {
    padding: 14,
    gap: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  name: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.light.text,
  },
  lifespan: {
    color: Colors.light.violet,
    fontWeight: "600",
  },
  designation: {
    color: Colors.light.textSecondary,
    fontSize: 13,
  },
  restingPlace: {
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  waveform: {
    marginTop: 8,
  },
});
