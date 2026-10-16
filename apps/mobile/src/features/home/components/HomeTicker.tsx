import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, lifespan } from "@thelastsignal/data";

export function HomeTicker() {
  const items = HEROES.map((h) => `${h.name.toUpperCase()} ${lifespan(h)}`);
  const tickerText = items.join("   ·   ");

  return (
    <View style={styles.outer}>
      <View style={styles.banner}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedText style={styles.text}>{tickerText}</ThemedText>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginVertical: 10,
    overflow: "hidden",
  },
  banner: {
    backgroundColor: Colors.light.violet,
    paddingVertical: 10,
    transform: [{ rotate: "-1deg" }],
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
