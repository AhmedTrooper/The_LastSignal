import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { storyChapters, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroChapters({ hero }: Props) {
  const chapters = storyChapters(hero);

  return (
    <View style={styles.card}>
      <ThemedText style={styles.cardHeader} type="subtitle">Mission Journey</ThemedText>
      <View style={styles.list}>
        {chapters.map((ch, idx) => (
          <View key={`${ch.title}-${idx}`} style={styles.chapter}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>{ch.title}</ThemedText>
              <ThemedText style={styles.year} type="small">{ch.year}</ThemedText>
            </View>
            <ThemedText style={styles.text} type="small">{ch.text}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  cardHeader: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  list: {
    gap: 14,
  },
  chapter: {
    gap: 4,
    borderLeftWidth: 2,
    borderLeftColor: Colors.light.violet,
    paddingLeft: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
  },
  year: {
    color: Colors.light.violet,
    fontWeight: "600",
  },
  text: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
});
