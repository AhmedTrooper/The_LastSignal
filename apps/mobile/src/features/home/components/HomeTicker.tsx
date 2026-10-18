import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, lifespan } from "@thelastsignal/data";
import { haptic } from "@/utils/haptics";

export function HomeTicker() {
  const handleHeroPress = (slug: string) => {
    haptic.light();
    router.push(`/heroes/${slug}` as any);
  };

  return (
    <View style={styles.outer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {HEROES.slice(0, 15).map((hero) => {
          const years = lifespan(hero);
          return (
            <Pressable
              key={hero.slug}
              onPress={() => handleHeroPress(hero.slug)}
              style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            >
              <View style={styles.dot} />
              <ThemedText style={styles.chipName}>{hero.name}</ThemedText>
              <ThemedText style={styles.chipYears} type="small">{years}</ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  chipPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.violet,
  },
  chipName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  chipYears: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: "600",
  },
});
