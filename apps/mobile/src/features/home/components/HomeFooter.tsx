import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";

export function HomeFooter() {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <ThemedText style={styles.quote}>
        &ldquo;They never came back. So we bring their stories home.&rdquo;
      </ThemedText>
      <ThemedText style={styles.subtext} type="small">
        A memorial for the robots, landers, and rovers left on Mars and the Moon.
      </ThemedText>

      <View style={styles.linksRow}>
        <Pressable
          onPress={() => router.push("/about")}
          style={styles.linkBtn}
        >
          <Ionicons name="information-circle-outline" size={16} color={Colors.light.violet} />
          <ThemedText style={styles.linkText}>About</ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push("/gallery")}
          style={styles.linkBtn}
        >
          <Ionicons name="images-outline" size={16} color={Colors.light.violet} />
          <ThemedText style={styles.linkText}>Gallery</ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push("/favorites")}
          style={styles.linkBtn}
        >
          <Ionicons name="bookmark-outline" size={16} color={Colors.light.violet} />
          <ThemedText style={styles.linkText}>Saved</ThemedText>
        </Pressable>
      </View>

      <ThemedText style={styles.rulesText} type="small">
        Facts only · Real imagery credited · Independent
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: "center",
    gap: 12,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.light.line,
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 24,
  },
  subtext: {
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  linksRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.violet,
  },
  rulesText: {
    color: Colors.light.textSecondary,
    fontSize: 11,
    fontFamily: "monospace",
    marginTop: 8,
    textAlign: "center",
  },
});
