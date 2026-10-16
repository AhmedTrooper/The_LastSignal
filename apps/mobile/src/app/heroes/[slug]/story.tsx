import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { useHero } from "@/features/heroes/hooks/useHeroes";
import { StoryViewer } from "@/features/story/components/StoryViewer";

export default function HeroStoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const hero = useHero(slug ?? "");

  if (!hero) {
    return (
      <View style={styles.center}>
        <ThemedText type="subtitle">Story not found</ThemedText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StoryViewer key={hero.slug} hero={hero} />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0c0a22",
  },
});
