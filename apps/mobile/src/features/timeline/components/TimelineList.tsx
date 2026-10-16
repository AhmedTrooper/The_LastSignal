import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES } from "@thelastsignal/data";
import { TimelineItem } from "./TimelineItem";

export function TimelineList() {
  const sorted = [...HEROES].sort((a, b) => a.no - b.no);

  return (
    <FlatList
      data={sorted}
      keyExtractor={(item) => item.slug}
      renderItem={({ item, index }) => (
        <TimelineItem hero={item} isLast={index === sorted.length - 1} />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={styles.title} type="title">Exploration Timeline</ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            From Ranger 7 in 1964 to Ingenuity in 2024. Sixty years of robotic exploration across Mars and the Moon.
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
