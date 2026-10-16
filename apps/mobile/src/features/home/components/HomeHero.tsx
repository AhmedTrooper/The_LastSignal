import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { assetUrl } from "@thelastsignal/data";

interface HomeHeroProps {
  onMeetHeroesPress: () => void;
}

export function HomeHero({ onMeetHeroesPress }: HomeHeroProps) {
  const familyImageUrl = assetUrl("images/hero-family.webp");

  return (
    <View style={styles.container}>
      <View style={styles.textWrap}>
        <ThemedText style={styles.title} type="title">
          Their mission ended.{"\n"}
          <ThemedText style={styles.titleViolet} type="title">Their story didn&apos;t.</ThemedText>
        </ThemedText>

        <Pressable
          onPress={onMeetHeroesPress}
          style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
        >
          <ThemedText style={styles.ctaText}>Meet the heroes</ThemedText>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </Pressable>
      </View>

      <View style={styles.imageWrap}>
        <Image
          source={{ uri: familyImageUrl }}
          style={styles.image}
          contentFit="contain"
          priority="high"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  textWrap: {
    gap: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  titleViolet: {
    color: Colors.light.violet,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: Colors.light.violet,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 3 / 2,
    marginTop: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
